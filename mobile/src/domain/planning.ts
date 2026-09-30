import type {
  Lancamento,
  Orcamento,
  Recorrencia,
  LancamentoInput,
} from "./types";
import { occurrenceDate } from "./dates";
export function budgetStatus(budget: Orcamento, entries: Lancamento[]) {
  const spent = entries
    .filter(
      (e) =>
        e.usuarioId === budget.usuarioId &&
        !e.excluidoEm &&
        e.tipo === "despesa" &&
        e.categoriaId === budget.categoriaId &&
        e.data.startsWith(budget.mes + "-"),
    )
    .reduce((sum, e) => sum + e.valorCentavos, 0);
  return {
    spent,
    remaining: budget.limiteCentavos - spent,
    ratio: spent / budget.limiteCentavos,
  };
}
export function recurrenceDraft(
  r: Recorrencia,
  month: string,
  today: string,
): LancamentoInput {
  if (r.excluidoEm || !r.ativa || month < r.mesInicial)
    throw Error("Recorrência indisponível neste mês.");
  const data = occurrenceDate(month, r.diaDoMes);
  if (data > today) throw Error("A ocorrência ainda não aconteceu.");
  return {
    id: `${r.id}_${month}`,
    usuarioId: r.usuarioId,
    categoriaId: r.categoriaId,
    tipo: "despesa",
    valorCentavos: r.valorCentavos,
    data,
    descricao: r.descricao,
    origem: "recorrencia",
    recorrenciaId: r.id,
    competenciaRecorrencia: month,
  };
}
