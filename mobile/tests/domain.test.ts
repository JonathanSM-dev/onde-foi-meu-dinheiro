import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseMoney} from '../src/domain/money';
import {previousMonth, occurrenceDate, validDate} from '../src/domain/dates';
import {validateEntry} from '../src/domain/validation';
import {summarize} from '../src/domain/summary';
test('centavos exatos e entradas ambíguas rejeitadas',()=>{
 assert.equal(parseMoney('0,10')!+parseMoney('0,20')!,30);
 assert.equal(parseMoney('1.234,56'),123456);
 for(const value of ['-1','0','1,234','10 e 20','999999999999999999999'])assert.equal(parseMoney(value),null,value);
});
test('calendário civil, virada do ano e fevereiro',()=>{
 assert.equal(previousMonth('2026-01'),'2025-12');
 assert.equal(occurrenceDate('2028-02',31),'2028-02-29');
 assert.equal(occurrenceDate('2026-02',31),'2026-02-28');
 assert.equal(validDate('2026-02-30'),false);
});
test('validação de data, descrição e categoria',()=>{
 const input={id:'a',usuarioId:'u',tipo:'despesa' as const,valorCentavos:30,data:'2026-02-30',descricao:'',categoriaId:'salario',origem:'manual' as const};
 const errors=validateEntry(input,[{id:'salario',usuarioId:'u',nome:'Salário',tipo:'receita'}],'2026-02-28');
 assert.ok(errors.data);assert.ok(errors.descricao);assert.ok(errors.categoriaId);
 assert.ok(validateEntry({...input,data:'2026-03-01'},[],'2026-02-28').data);
});
test('resumo sem base e lançamentos excluídos',()=>{
 const base={id:'a',usuarioId:'u',tipo:'despesa' as const,valorCentavos:30,data:'2026-09-01',descricao:'Café',categoriaId:'cafe',origem:'manual' as const,criadoEm:'',atualizadoEm:'',excluidoEm:null};
 const result=summarize([base,{...base,id:'b',valorCentavos:999,excluidoEm:'2026-09-02'}],'2026-09');
 assert.equal(result.despesas,30);assert.equal(result.saldo,-30);assert.equal(result.percentualDespesas,null);
});
