import type {Categoria,LancamentoInput} from './types';
import {validDate} from './dates';
export const positiveMoney=(value:number)=>Number.isSafeInteger(value)&&value>0;
export function validateEntry(input:LancamentoInput,categories:Categoria[],today:string):Record<string,string>{
 const errors:Record<string,string>={};
 if(!positiveMoney(input.valorCentavos))errors.valorCentavos='Informe um valor positivo com até duas casas decimais.';
 if(!validDate(input.data)||input.data>today)errors.data='Use uma data válida, até hoje (AAAA-MM-DD).';
 if(!input.descricao.trim()||input.descricao.trim().length>80)errors.descricao='Descreva o lançamento em até 80 caracteres.';
 if(!categories.some(c=>c.id===input.categoriaId&&c.usuarioId===input.usuarioId&&c.tipo===input.tipo))errors.categoriaId='Escolha uma categoria compatível.';
 if(!input.id||!input.usuarioId)errors.id='Identificação ausente.';
 if(!['manual','texto','foto','recorrencia'].includes(input.origem))errors.origem='Origem inválida.';
 return errors;
}
