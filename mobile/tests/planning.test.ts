import {test} from 'node:test';
import assert from 'node:assert/strict';
import {budgetStatus,recurrenceDraft} from '../src/domain/planning';
const expense={id:'a',usuarioId:'u',categoriaId:'alimentacao',tipo:'despesa' as const,valorCentavos:4500,data:'2026-09-01',descricao:'Mercado',origem:'manual' as const,criadoEm:'',atualizadoEm:'',excluidoEm:null};
test('orçamento usa só despesa confirmada da categoria e mês',()=>{
 const budget={id:'b',usuarioId:'u',categoriaId:'alimentacao',mes:'2026-09',limiteCentavos:40000,criadoEm:'',atualizadoEm:'',excluidoEm:null};
 assert.equal(budgetStatus(budget,[expense,{...expense,id:'r',tipo:'receita'}]).remaining,35500);
 assert.equal(budgetStatus(budget,[{...expense,valorCentavos:5000}]).remaining,35000);
 assert.equal(budgetStatus(budget,[{...expense,excluidoEm:'x'}]).remaining,40000);
});
test('modelo recorrente gera rascunho com identidade mensal e data possível',()=>{
 const r={id:'net',usuarioId:'u',categoriaId:'moradia',descricao:'Internet',valorCentavos:7990,diaDoMes:31,mesInicial:'2026-01',ativa:true,criadoEm:'',atualizadoEm:'',excluidoEm:null};
 const d=recurrenceDraft(r,'2026-02','2026-03-01');assert.equal(d.id,'net_2026-02');assert.equal(d.data,'2026-02-28');
 assert.throws(()=>recurrenceDraft(r,'2025-12','2026-03-01'));assert.throws(()=>recurrenceDraft(r,'2026-03','2026-03-01'));
});
