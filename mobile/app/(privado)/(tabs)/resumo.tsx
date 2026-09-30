import { useState } from "react";
import { Text, View } from "react-native";
import { Screen, Button, Feedback, Notice } from "../../../src/components/ui";
import { MonthPicker } from "../../../src/components/MonthPicker";
import { CategoryBars } from "../../../src/components/CategoryBars";
import { useApp } from "../../../src/state/AppProvider";
import { useQuery } from "../../../src/state/useQuery";
import { summarize } from "../../../src/domain/summary";
import { formatMoney } from "../../../src/domain/money";
import { monthLabel } from "../../../src/domain/dates";
import { styles as s } from "../../../src/theme";
export default function Summary() {
  const { repo, uid, month, revision } = useApp();
  const [explain, setExplain] = useState(false);
  const q = useQuery(
    async () => ({
      entries: await repo.listEntries(uid, {}),
      categories: await repo.listCategories(uid),
    }),
    [repo, uid, revision],
  );
  const result = summarize(q.data?.entries || [], month);
  return (
    <Screen
      title="Seu mês, com mais clareza."
      subtitle="Números que ajudam a entender suas escolhas."
    >
      <MonthPicker />
      <Feedback loading={q.loading} error={q.error} retry={q.retry} />
      {!q.loading && !q.error && (
        <>
          <View style={s.hero}>
            <Text style={s.heroLabel}>Saldo de {monthLabel(month)}</Text>
            <Text style={s.heroValue}>{formatMoney(result.saldo)}</Text>
            <Text style={s.heroLabel}>
              Receitas {formatMoney(result.receitas)} · Despesas{" "}
              {formatMoney(result.despesas)}
            </Text>
          </View>
          <CategoryBars
            totals={result.despesasPorCategoria}
            categories={q.data!.categories}
          />
          <View style={s.card}>
            <Text style={s.section}>Em relação ao mês anterior</Text>
            <Text style={s.amount}>
              {formatMoney(result.diferencaDespesas)} em despesas
            </Text>
            <Text style={s.small}>
              {result.percentualDespesas === null
                ? "Sem base para comparação percentual."
                : `${result.percentualDespesas.toFixed(1).replace(".", ",")}% de variação nas despesas.`}
            </Text>
          </View>
          <Button
            title={
              explain
                ? "Recolher leitura demonstrativa"
                : "Entender meu mês · demonstração"
            }
            secondary
            onPress={() => setExplain((v) => !v)}
          />
          {explain && (
            <Notice>
              Leitura determinística, sem IA real: em {monthLabel(month)}, suas
              receitas registradas somam {formatMoney(result.receitas)} e suas
              despesas {formatMoney(result.despesas)}. O saldo do período é{" "}
              {formatMoney(result.saldo)}. Esses números refletem apenas os
              lançamentos confirmados.
            </Notice>
          )}
        </>
      )}
    </Screen>
  );
}
