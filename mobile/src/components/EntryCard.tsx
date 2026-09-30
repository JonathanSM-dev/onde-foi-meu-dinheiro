import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import type { Lancamento, Categoria } from "../domain/types";
import { formatMoney } from "../domain/money";
import { displayDate } from "../domain/dates";
import { styles as s, colors } from "../theme";
export function EntryCard({
  entry,
  categories,
}: {
  entry: Lancamento;
  categories: Categoria[];
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        entry.descricao + " " + formatMoney(entry.valorCentavos)
      }
      onPress={() =>
        router.push({ pathname: "/detalhes/[id]", params: { id: entry.id } })
      }
      style={[s.card, { padding: 16 }]}
    >
      <View style={s.row}>
        <Text style={[s.text, { fontWeight: "600", flex: 1 }]}>
          {entry.descricao}
        </Text>
        <Text
          style={[
            s.amount,
            { color: entry.tipo === "receita" ? colors.green : colors.ink },
          ]}
        >
          {entry.tipo === "receita" ? "+" : "−"}{" "}
          {formatMoney(entry.valorCentavos)}
        </Text>
      </View>
      <Text style={s.small}>
        {categories.find((c) => c.id === entry.categoriaId)?.nome} ·{" "}
        {displayDate(entry.data)}
      </Text>
    </Pressable>
  );
}
