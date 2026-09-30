import type { Lancamento, Resumo } from "./types";
import { previousMonth } from "./dates";
export function summarize(entries: Lancamento[], month: string): Resumo {
  const active = entries.filter((e) => !e.excluidoEm);
  const current = active.filter((e) => e.data.slice(0, 7) === month);
  const total = (list: Lancamento[], type: string) =>
    list
      .filter((e) => e.tipo === type)
      .reduce((sum, e) => sum + e.valorCentavos, 0);
  const receitas = total(current, "receita"),
    despesas = total(current, "despesa");
  const last = total(
    active.filter((e) => e.data.slice(0, 7) === previousMonth(month)),
    "despesa",
  );
  const despesasPorCategoria: Record<string, number> = {};
  current
    .filter((e) => e.tipo === "despesa")
    .forEach((e) => {
      despesasPorCategoria[e.categoriaId] =
        (despesasPorCategoria[e.categoriaId] || 0) + e.valorCentavos;
    });
  return {
    receitas,
    despesas,
    saldo: receitas - despesas,
    despesasPorCategoria,
    diferencaDespesas: despesas - last,
    percentualDespesas: last ? ((despesas - last) / last) * 100 : null,
  };
}
