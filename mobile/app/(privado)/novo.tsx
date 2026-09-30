import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { router } from "expo-router";
import {
  Screen,
  Button,
  Choice,
  Field,
  Notice,
  Feedback,
} from "../../src/components/ui";
import { EntryForm } from "../../src/components/EntryForm";
import { useApp } from "../../src/state/AppProvider";
import { useQuery } from "../../src/state/useQuery";
import { simulateEntry } from "../../src/services/simulatedAI";
import { localToday } from "../../src/domain/dates";
import type { LancamentoInput } from "../../src/domain/types";
import { validateEntry } from "../../src/domain/validation";
import { styles as s } from "../../src/theme";
export default function NewEntry() {
  const { repo, uid, draft } = useApp();
  const [mode, setMode] = useState("texto");
  const [text, setText] = useState("");
  const [fail, setFail] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [value, setValue] = useState<LancamentoInput>(() => ({
    id: `entry-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    usuarioId: uid,
    tipo: "despesa",
    categoriaId: "alimentacao",
    valorCentavos: 0,
    data: localToday(),
    descricao: "",
    origem: "manual",
  }));
  const transitioning = useRef(false);
  useEffect(
    () => () => {
      if (!transitioning.current) draft.cancel();
    },
    [draft],
  );
  const q = useQuery(() => repo.listCategories(uid), [repo, uid]);
  const review = async () => {
    if (busy) return;
    setError("");
    if (mode === "manual") {
      const e = validateEntry(value, q.data || [], localToday());
      setErrors(e);
      if (Object.keys(e).length) return;
      draft.begin(value);
      transitioning.current = true;
      router.replace("/revisao");
      return;
    }
    if (mode === "texto" && !text.trim()) {
      setError("Conte o que deseja registrar.");
      return;
    }
    setBusy(true);
    try {
      const accepted = await draft.suggest(async () => {
        await new Promise((resolve) => setTimeout(resolve, 650));
        const result = await simulateEntry(
          mode === "foto" ? "Mercado 45" : text,
          localToday(),
          q.data || [],
          fail,
        );
        return {
          ...value,
          ...result,
          valorCentavos: result.valorCentavos || 0,
          origem: mode === "foto" ? "foto" : "texto",
        };
      });
      if (accepted) {
        transitioning.current = true;
        router.replace("/revisao");
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Screen
      title="Registrar ficou mais leve."
      subtitle="Conte do seu jeito. Confira antes de salvar."
    >
      <Choice
        label="Forma de registro"
        value={mode}
        items={[
          { value: "texto", label: "Texto" },
          { value: "foto", label: "Foto" },
          { value: "manual", label: "Manual" },
        ]}
        onChange={(m) => {
          if (!busy) {
            setMode(m);
            setError("");
          }
        }}
      />
      <Feedback loading={q.loading} error={q.error} retry={q.retry} />
      {mode === "manual" ? (
        <EntryForm
          value={value}
          categories={q.data || []}
          errors={errors}
          onChange={setValue}
        />
      ) : mode === "texto" ? (
        <>
          <Field
            label="O que você quer registrar?"
            value={text}
            onChangeText={setText}
            multiline
            maxLength={500}
            style={{ minHeight: 120, textAlignVertical: "top" }}
            placeholder="Gastei 45 no mercado ontem"
          />
          <Button
            title="Usar exemplo: mercado R$ 45"
            secondary
            onPress={() => setText("Gastei 45 no mercado ontem")}
          />
        </>
      ) : (
        <View style={s.card}>
          <Text style={s.section}>Cupom de exemplo</Text>
          <Text style={s.text}>MERCADO · Total R$ 45,00</Text>
          <Text style={s.small}>
            Esta etapa usa uma captura fictícia. A câmera real será integrada na
            entrega final.
          </Text>
        </View>
      )}
      {mode !== "manual" && (
        <>
          <Notice>
            Interpretação simulada por regras locais. Nenhuma informação é
            enviada à IA. Dados incertos precisam ser corrigidos.
          </Notice>
          <Button
            title={
              fail ? "Desativar falha simulada" : "Simular IA indisponível"
            }
            secondary
            disabled={busy}
            onPress={() => setFail((v) => !v)}
          />
        </>
      )}
      {!!error && <Notice error>{error}</Notice>}
      <Button
        title={
          busy
            ? "Organizando os detalhes…"
            : mode === "manual"
              ? "Revisar lançamento"
              : mode === "foto"
                ? "Simular captura e organizar"
                : "Organizar lançamento"
        }
        disabled={busy || q.loading || !!q.error}
        onPress={() => void review()}
      />
      {!!error && mode !== "manual" && (
        <Button
          title="Preencher manualmente"
          secondary
          onPress={() => setMode("manual")}
        />
      )}
      <Button
        title="Cancelar registro"
        secondary
        onPress={() => {
          draft.cancel();
          router.replace("/(privado)/(tabs)");
        }}
      />
    </Screen>
  );
}
