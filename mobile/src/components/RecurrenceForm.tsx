import { useState } from "react";
import { View } from "react-native";
import type { Categoria, RecorrenciaInput } from "../domain/types";
import { Field, Choice, Button, Notice } from "./ui";
import { parseMoney, moneyInput } from "../domain/money";
import { styles as s } from "../theme";
export function RecurrenceForm({
  initial,
  categories,
  onSave,
  onCancel,
  busy,
  error,
}: {
  initial: RecorrenciaInput;
  categories: Categoria[];
  onSave: (value: RecorrenciaInput) => void;
  onCancel: () => void;
  busy: boolean;
  error: string;
}) {
  const [value, setValue] = useState(initial);
  const [amount, setAmount] = useState(
    initial.valorCentavos ? moneyInput(initial.valorCentavos) : "",
  );
  const [day, setDay] = useState(String(initial.diaDoMes));
  return (
    <View style={s.card}>
      <Field
        label="Descrição da recorrência"
        value={value.descricao}
        onChangeText={(descricao) => setValue({ ...value, descricao })}
        maxLength={80}
      />
      <Field
        label="Valor recorrente (R$)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        maxLength={20}
      />
      <Field
        label="Dia do mês (1 a 31)"
        value={day}
        onChangeText={setDay}
        keyboardType="number-pad"
        maxLength={2}
      />
      <Field
        label="Mês inicial (AAAA-MM)"
        value={value.mesInicial}
        onChangeText={(mesInicial) => setValue({ ...value, mesInicial })}
        maxLength={7}
      />
      <Choice
        label="Categoria"
        value={value.categoriaId}
        items={categories
          .filter((c) => c.tipo === "despesa")
          .map((c) => ({ value: c.id, label: c.nome }))}
        onChange={(categoriaId) => setValue({ ...value, categoriaId })}
      />
      <Choice
        label="Situação"
        value={value.ativa ? "ativa" : "pausada"}
        items={[
          { value: "ativa", label: "Ativa" },
          { value: "pausada", label: "Pausada" },
        ]}
        onChange={(state) => setValue({ ...value, ativa: state === "ativa" })}
      />
      {!!error && <Notice error>{error}</Notice>}
      <Button
        title={busy ? "Salvando…" : "Salvar recorrência"}
        disabled={busy}
        onPress={() =>
          onSave({
            ...value,
            valorCentavos: parseMoney(amount) || 0,
            diaDoMes: Number(day),
          })
        }
      />
      <Button
        title="Cancelar recorrência"
        disabled={busy}
        secondary
        onPress={onCancel}
      />
    </View>
  );
}
