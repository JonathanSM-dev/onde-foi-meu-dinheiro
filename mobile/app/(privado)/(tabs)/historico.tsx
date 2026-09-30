import { useState } from "react";
import { Text } from "react-native";
import {
  Screen,
  Button,
  Field,
  Choice,
  Feedback,
  Notice,
} from "../../../src/components/ui";
import { MonthPicker } from "../../../src/components/MonthPicker";
import { EntryCard } from "../../../src/components/EntryCard";
import { useApp } from "../../../src/state/AppProvider";
import { useQuery } from "../../../src/state/useQuery";
import type { Tipo } from "../../../src/domain/types";
import { styles as s } from "../../../src/theme";
export default function History() {
  const { repo, uid, month, revision } = useApp();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [fail, setFail] = useState(false);
  const q = useQuery(async () => {
    if (fail)
      throw Error(
        "Erro demonstrativo de consulta. Desative o cenário para continuar.",
      );
    return {
      entries: await repo.listEntries(uid, {
        mes: month,
        busca: search,
        tipo: (type as Tipo) || undefined,
        categoriaId: category || undefined,
      }),
      categories: await repo.listCategories(uid),
    };
  }, [repo, uid, month, revision, search, type, category, fail]);
  return (
    <Screen
      title="Seu dinheiro em movimento."
      subtitle="Encontre cada parte da sua história."
    >
      <MonthPicker />
      <Field
        label="Buscar no histórico"
        value={search}
        onChangeText={setSearch}
        placeholder="Ex.: mercado"
      />
      <Choice
        label="Tipo"
        value={type}
        onChange={(v) => {
          setType(v);
          setCategory("");
        }}
        items={[
          { value: "", label: "Todos" },
          { value: "despesa", label: "Despesas" },
          { value: "receita", label: "Receitas" },
        ]}
      />
      <Choice
        label="Categoria"
        value={category}
        onChange={setCategory}
        items={[
          { value: "", label: "Todas" },
          ...(q.data?.categories || [])
            .filter((c) => !type || c.tipo === type)
            .map((c) => ({ value: c.id, label: c.nome })),
        ]}
      />
      <Button
        title="Limpar filtros"
        secondary
        onPress={() => {
          setSearch("");
          setType("");
          setCategory("");
        }}
      />
      <Feedback
        loading={q.loading}
        error={q.error}
        retry={() => {
          setFail(false);
          q.retry();
        }}
      />
      {!q.loading && !q.error && (
        <>
          <Text style={s.small}>{q.data?.entries.length || 0} lançamentos</Text>
          {q.data?.entries.map((e) => (
            <EntryCard key={e.id} entry={e} categories={q.data!.categories} />
          ))}
          {!q.data?.entries.length && (
            <Feedback empty="Nenhum lançamento neste período com esses filtros." />
          )}
        </>
      )}
      <Notice>
        Cenário de avaliação: o botão abaixo simula uma falha de consulta, sem
        alterar seus dados.
      </Notice>
      <Button
        title={
          fail ? "Desativar erro demonstrativo" : "Simular erro no histórico"
        }
        secondary
        onPress={() => setFail((v) => !v)}
      />
    </Screen>
  );
}
