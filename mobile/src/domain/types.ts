export type Tipo = "receita" | "despesa";
export type Origem = "manual" | "texto" | "foto" | "recorrencia";
export interface Controle {
  criadoEm: string;
  atualizadoEm: string;
  excluidoEm: string | null;
}
export interface Categoria {
  id: string;
  usuarioId: string;
  nome: string;
  tipo: Tipo;
}
export interface LancamentoInput {
  id: string;
  usuarioId: string;
  categoriaId: string;
  tipo: Tipo;
  valorCentavos: number;
  data: string;
  descricao: string;
  origem: Origem;
  recorrenciaId?: string | null;
  competenciaRecorrencia?: string | null;
}
export type Lancamento = LancamentoInput & Controle;
export interface OrcamentoInput {
  usuarioId: string;
  categoriaId: string;
  mes: string;
  limiteCentavos: number;
}
export type Orcamento = OrcamentoInput & Controle & { id: string };
export interface RecorrenciaInput {
  id: string;
  usuarioId: string;
  categoriaId: string;
  descricao: string;
  valorCentavos: number;
  diaDoMes: number;
  mesInicial: string;
  ativa: boolean;
}
export type Recorrencia = RecorrenciaInput & Controle;
export interface Filtro {
  mes?: string;
  busca?: string;
  tipo?: Tipo;
  categoriaId?: string;
}
export interface Resumo {
  receitas: number;
  despesas: number;
  saldo: number;
  despesasPorCategoria: Record<string, number>;
  diferencaDespesas: number;
  percentualDespesas: number | null;
}
