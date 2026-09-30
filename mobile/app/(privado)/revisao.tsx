import { useState } from "react";
import { Text, View } from "react-native";
import { router, Stack } from "expo-router";
import { usePreventRemove } from "expo-router/react-navigation";
import { Screen, Button, Notice, Feedback } from "../../src/components/ui";
import { EntryForm } from "../../src/components/EntryForm";
import { useApp } from "../../src/state/AppProvider";
import { useQuery } from "../../src/state/useQuery";
import { formatMoney } from "../../src/domain/money";
import { displayDate, localToday } from "../../src/domain/dates";
import { validateEntry } from "../../src/domain/validation";
import { styles as s, colors } from "../../src/theme";
export default function Review() {
  const { repo, uid, draft, setMonth } = useApp();
  const [value, setValue] = useState(draft.value);
  const [edit, setEdit] = useState(!draft.value?.valorCentavos);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const q = useQuery(() => repo.listCategories(uid), [repo, uid]);
  usePreventRemove(busy, () => {});
  const confirm = async () => {
    if (!value || busy || draft.busy) return;
    const validation = validateEntry(value, q.data || [], localToday());
    setErrors(validation);
    if (Object.keys(validation).length) {
      setEdit(true);
      return;
    }
    draft.update(value);
    setBusy(true);
    setError("");
    try {
      if (await draft.confirm()) {
        setMonth(value.data.slice(0, 7));
        setBusy(false);
        router.replace("/historico");
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  if (!value)
    return (
      <Screen title="Nenhum rascunho aberto">
        <Button
          title="Registrar lançamento"
          onPress={() => router.replace("/novo")}
        />
      </Screen>
    );
  return (
    <Screen
      title="Está tudo certinho?"
      subtitle="Confira e confirme antes de registrar."
    >
      <Stack.Screen
        options={{ headerBackVisible: !busy, gestureEnabled: !busy }}
      />
      <Notice>
        {value.origem === "recorrencia"
          ? "Ocorrência recorrente"
          : value.origem === "manual"
            ? "Registro manual"
            : "Sugestão demonstrativa"}{" "}
        · nada foi salvo ainda.
      </Notice>
      <View style={[s.card, { backgroundColor: colors.pale }]}>
        <Text style={s.small}>
          {value.tipo === "receita" ? "Receita" : "Despesa"}
        </Text>
        <Text style={[s.heroValue, { color: colors.green }]}>
          {formatMoney(value.valorCentavos)}
        </Text>
        <Text style={s.section}>{value.descricao || "Descrição pendente"}</Text>
        <Text style={s.text}>
          {q.data?.find((c) => c.id === value.categoriaId)?.nome ||
            "Categoria pendente"}{" "}
          · {displayDate(value.data)}
        </Text>
      </View>
      <Feedback loading={q.loading} error={q.error} retry={q.retry} />
      <Button
        title={edit ? "Recolher detalhes" : "Editar detalhes"}
        secondary
        disabled={busy}
        onPress={() => setEdit((v) => !v)}
      />
      {edit && (
        <EntryForm
          value={value}
          categories={q.data || []}
          errors={errors}
          lockedType={value.origem === "recorrencia"}
          onChange={(v) => {
            if (!busy) setValue(v);
          }}
        />
      )}
      {!!error && <Notice error>{error}</Notice>}
      <Button
        title={busy ? "Salvando…" : "Confirmar lançamento"}
        disabled={busy || q.loading || !!q.error}
        onPress={() => void confirm()}
      />
      <Button
        title="Cancelar"
        secondary
        disabled={busy}
        onPress={() => {
          draft.cancel();
          router.replace("/(privado)/(tabs)");
        }}
      />
    </Screen>
  );
}
