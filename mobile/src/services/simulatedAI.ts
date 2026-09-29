import type {Categoria,LancamentoInput} from '../domain/types';
import {parseMoney} from '../domain/money';
import {localToday} from '../domain/dates';
export async function simulateEntry(text:string,today:string,categories:Categoria[],fail=false):Promise<Partial<LancamentoInput>>{
 if(fail)throw Error('Falha simulada da IA. Tente novamente ou registre manualmente.');
 const tokens=text.match(/-?\d[\d.,]*/g)||[];
 const amount=tokens.length===1?parseMoney(tokens[0]):null;
 const tipo=/recebi|salário|salario|bolsa/i.test(text)?'receita':'despesa';
 const category=categories.find(c=>c.tipo===tipo&&(tipo==='receita'?c.id==='salario':c.id==='alimentacao'));
 const date=new Date(today+'T12:00:00');if(/ontem/i.test(text))date.setDate(date.getDate()-1);
 return {tipo,valorCentavos:amount??undefined,categoriaId:category?.id,data:localToday(date),descricao:text.trim().slice(0,80),origem:'texto'};
}
