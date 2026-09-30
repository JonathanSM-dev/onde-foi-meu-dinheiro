import { useState } from "react";
import { Text, View } from "react-native";
import {
  Screen,
  Button,
  Confirm,
  Feedback,
  Notice,
} from "../../../src/components/ui";
import { MonthPicker } from "../../../src/components/MonthPicker";
import { BudgetForm } from "../../../src/components/BudgetForm";
import { useApp } from "../../../src/state/AppProvider";
import { useQuery } from "../../../src/state/useQuery";
import { budgetStatus } from "../../../src/domain/planning";
import type { OrcamentoInput } from "../../../src/domain/types";
import { formatMoney } from "../../../src/domain/money";
import { styles as s, colors } from "../../../src/theme";
export default function Budgets() {
  const { repo, uid, month, revision, refresh } = useApp();
  const [form, setForm] = useState<OrcamentoInput | null>(null);
  const [formVersion, setFormVersion] = useState(0);
  const [deleting, setDeleting] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const q = useQuery(
    async () => ({
      budgets: await repo.listBudgets(uid, month),
      entries: await repo.listEntries(uid, { mes: month }),
      categories: await repo.listCategories(uid),
    }),
    [repo, uid, month, revision],
  );
  const save = async (value: OrcamentoInput) => {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await repo.saveBudget(value);
      refresh();
      setForm(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Screen
      title="Um plano para cada escolha."
      subtitle="Seu limite ajuda a acompanhar, sem bloquear registros."
    >
      <MonthPicker />
      <Feedback loading={q.loading} error={q.error} retry={q.retry} />
      {!q.loading && !q.error && (
        <>
          <Button
            title="+ Definir orçamento"
            onPress={() => {
              setFormVersion((v) => v + 1);
              setError("");
              setForm({
                usuarioId: uid,
                categoriaId: "alimentacao",
                mes: month,
                limiteCentavos: 0,
              });
            }}
          />
          {form && (
            <BudgetForm
              key={formVersion}
              initial={form}
              categories={q.data!.categories}
              busy={busy}
              error={error}
              onSave={(v) => void save(v)}
              onCancel={() => setForm(null)}
            />
          )}
          {q.data?.budgets.map((b) => {
            const status = budgetStatus(b, q.data!.entries);
            return (
              <View style={s.card} key={b.id}>
                <Text style={s.section}>
                  {q.data!.categories.find((c) => c.id === b.categoriaId)?.nome}
                </Text>
                <Text style={s.amount}>
                  {formatMoney(status.spent)}{" "}
                  <Text style={s.small}>
                    de {formatMoney(b.limiteCentavos)}
                  </Text>
                </Text>
                <View
                  style={{
                    height: 8,
                    backgroundColor: colors.pale,
                    borderRadius: 4,
                  }}
                >
                  <View
                    style={{
                      height: 8,
                      width: `${Math.min(100, status.ratio * 100)}%`,
                      backgroundColor:
                        status.remaining < 0 ? colors.coral : colors.green,
                      borderRadius: 4,
                    }}
                  />
                </View>
                <Text style={status.remaining < 0 ? s.error : s.small}>
                  {status.remaining < 0 ? "Excedido em " : "Disponível: "}
                  {formatMoney(Math.abs(status.remaining))}
                </Text>
                <Button
                  title={
                    "Editar " +
                    q.data!.categories.find((c) => c.id === b.categoriaId)?.nome
                  }
                  secondary
                  onPress={() => {
                    setFormVersion((v) => v + 1);
                    setError("");
                    setForm(b);
                  }}
                />
                <Button
                  title="Excluir orçamento"
                  danger
                  secondary
                  onPress={() => setDeleting(b.id)}
                />
              </View>
            );
          })}
          {!q.data?.budgets.length && !form && (
            <Feedback empty="Defina um limite mensal para começar a acompanhar uma categoria." />
          )}
        </>
      )}
      {!!deleting && (
        <Confirm
          message="Excluir somente o orçamento? Seus lançamentos serão preservados."
          busy={busy}
          onCancel={() => setDeleting("")}
          onConfirm={() => {
            if (busy) return;
            setBusy(true);
            void repo
              .deleteBudget(uid, deleting)
              .then(() => {
                setDeleting("");
                refresh();
              })
              .catch((e) => setError(e.message))
              .finally(() => setBusy(false));
          }}
        />
      )}
      {!!error && !form && <Notice error>{error}</Notice>}
    </Screen>
  );
}
