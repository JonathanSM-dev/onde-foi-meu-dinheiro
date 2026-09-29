import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {nodeAdapter} from './sqlite-adapter';
import {createRepository} from '../src/data/repository';
const today='2026-09-29';
async function setup(){const dir=mkdtempSync(join(tmpdir(),'ofmd-'));const path=join(dir,'db.sqlite');const repo=await createRepository(nodeAdapter(path),()=>today);await repo.listCategories('u');return {repo,path,cleanup:()=>rmSync(dir,{recursive:true,force:true})};}
const entry={id:'a',usuarioId:'u',tipo:'despesa' as const,valorCentavos:4500,data:'2026-09-24',descricao:"Café d'água",categoriaId:'alimentacao',origem:'manual' as const};
test('CRUD sobrevive a reabertura e migração repetida; outro perfil isolado',async()=>{
 const {repo,path,cleanup}=await setup();
 try{
 await repo.saveEntry(entry);await repo.saveEntry({...entry,valorCentavos:5000});
 assert.equal((await repo.listEntries('other',{})).length,0);
 await assert.rejects(repo.saveEntry({...entry,usuarioId:'other'}));
 await repo.close();const next=await createRepository(nodeAdapter(path),()=>today);
 assert.equal((await next.getEntry('u','a'))?.valorCentavos,5000);
 assert.equal((await next.listCategories('u')).length,9);
 await next.deleteEntry('u','a');await next.close();
 const final=await createRepository(nodeAdapter(path),()=>today);
 assert.equal(await final.getEntry('u','a'),null);await assert.rejects(final.saveEntry(entry));await final.close();
 }finally{cleanup();}
});
test('mesmo ID não duplica; orçamento único e exclusão preserva lançamentos',async()=>{
 const {repo,cleanup}=await setup();
 try{
 await Promise.all([repo.saveEntry(entry),repo.saveEntry(entry)]);
 assert.equal((await repo.listEntries('u',{})).length,1);
 await repo.saveBudget({usuarioId:'u',categoriaId:'alimentacao',mes:'2026-09',limiteCentavos:40000});
 await repo.saveBudget({usuarioId:'u',categoriaId:'alimentacao',mes:'2026-09',limiteCentavos:50000});
 const budgets=await repo.listBudgets('u','2026-09');assert.equal(budgets.length,1);
 await repo.deleteBudget('u',budgets[0].id);assert.equal((await repo.listEntries('u',{})).length,1);
 }finally{await repo.close();cleanup();}
});
test('recorrência preserva ocorrência excluída e rejeita futuro',async()=>{
 const {repo,cleanup}=await setup();
 try{
 await repo.saveRecurrence({id:'net',usuarioId:'u',categoriaId:'moradia',descricao:'Internet',valorCentavos:7990,diaDoMes:10,mesInicial:'2026-09',ativa:true});
 const result=await repo.confirmOccurrence('u','net','2026-09',today);
 await repo.deleteEntry('u',result.id);
 await assert.rejects(repo.confirmOccurrence('u','net','2026-09',today));
 await assert.rejects(repo.confirmOccurrence('u','net','2026-10',today));
 await assert.rejects(repo.confirmOccurrence('u','net','2026-08',today));
 }finally{await repo.close();cleanup();}
});
test('falha transacional reverte carga demo; nova tentativa funciona',async()=>{
 const {repo,cleanup}=await setup();await repo.close();
 const dir=mkdtempSync(join(tmpdir(),'ofmd-fail-'));const adapter=nodeAdapter(join(dir,'db'));
 const original=adapter.run;let fail=true;
 adapter.run=async(sql,params)=>{if(fail&&sql.includes('INSERT INTO lancamentos')){fail=false;throw Error('Disco indisponível');}await original(sql,params);};
 const r=await createRepository(adapter,()=>today);
 try{await assert.rejects(r.loadDemo('u',today));assert.equal((await r.listEntries('u',{})).length,0);await r.loadDemo('u',today);assert.ok((await r.listEntries('u',{})).length>0);await assert.rejects(r.loadDemo('u',today));}finally{await r.close();rmSync(dir,{recursive:true,force:true});cleanup();}
});
