import type {SqlAdapter} from './adapter';
import {migrate} from './migrations';
import type {Categoria,LancamentoInput,Lancamento,OrcamentoInput,Orcamento,RecorrenciaInput,Recorrencia,Filtro,Controle} from '../domain/types';
import {localToday,validMonth,occurrenceDate} from '../domain/dates';
import {positiveMoney,validateEntry} from '../domain/validation';
type Table='lancamentos'|'orcamentos'|'recorrencias';
const defaults=[['alimentacao','Alimentação','despesa'],['transporte','Transporte','despesa'],['moradia','Moradia','despesa'],['lazer','Lazer','despesa'],['saude','Saúde','despesa'],['educacao','Educação','despesa'],['outros','Outros gastos','despesa'],['salario','Bolsa / salário','receita'],['renda','Outras receitas','receita']];
export class Repository {
 private tail:Promise<unknown>=Promise.resolve();
 constructor(private db:SqlAdapter,private today:()=>string=localToday){}
 private queue<T>(work:()=>Promise<T>):Promise<T>{const next=this.tail.then(work);this.tail=next.catch(()=>{});return next;}
 private async transaction<T>(work:()=>Promise<T>):Promise<T>{
  await this.db.exec('BEGIN IMMEDIATE');
  try{const result=await work();await this.db.exec('COMMIT');return result;}catch(error){await this.db.exec('ROLLBACK');throw error;}
 }
 private async categories(uid:string){
  if(!uid)throw Error('Perfil ausente.');
  for(const [id,nome,tipo] of defaults)await this.db.run('INSERT OR IGNORE INTO categorias(id,usuarioId,nome,tipo) VALUES(?,?,?,?)',[id,uid,nome,tipo]);
  return this.db.all<Categoria>('SELECT * FROM categorias WHERE usuarioId=?',[uid]);
 }
 private async read<T>(table:Table,uid:string,id?:string,deleted=false):Promise<T[]>{
  const rows=await this.db.all<{payload:string}>(`SELECT payload FROM ${table} WHERE usuarioId=?${id?' AND id=?':''}${deleted?'':' AND excluidoEm IS NULL'}`,id?[uid,id]:[uid]);
  return rows.map(row=>JSON.parse(row.payload) as T);
 }
 private async existing<T extends Controle&{usuarioId:string}>(table:Table,uid:string,id:string):Promise<T|undefined>{
  const rows=await this.db.all<{usuarioId:string,payload:string}>(`SELECT usuarioId,payload FROM ${table} WHERE id=?`,[id]);
  if(rows[0]&&rows[0].usuarioId!==uid)throw Error('Registro indisponível para este perfil.');
  return rows[0]?JSON.parse(rows[0].payload):undefined;
 }
 private control(old?:Controle):Controle {const now=new Date().toISOString();return {criadoEm:old?.criadoEm||now,atualizadoEm:now,excluidoEm:null};}
 private async putEntry(input:LancamentoInput,allowOccurrence=false):Promise<Lancamento>{
  const errors=validateEntry(input,await this.categories(input.usuarioId),this.today());
  if(Object.keys(errors).length)throw Error(Object.values(errors)[0]);
  const old=await this.existing<Lancamento>('lancamentos',input.usuarioId,input.id);
  if(old?.excluidoEm)throw Error('Um lançamento excluído não pode ser recriado.');
  if(old&&(old.recorrenciaId!==input.recorrenciaId||old.competenciaRecorrencia!==input.competenciaRecorrencia))throw Error('A origem recorrente não pode ser alterada.');
  if(!old&&input.origem==='recorrencia'&&!allowOccurrence)throw Error('Confirme a ocorrência pela tela de recorrências.');
  if(input.origem!=='recorrencia'&&(input.recorrenciaId||input.competenciaRecorrencia))throw Error('Origem incompatível.');
  const record={...input,descricao:input.descricao.trim(),...this.control(old)};
  await this.db.run('INSERT INTO lancamentos(id,usuarioId,categoriaId,payload,recurrenceKey) VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET categoriaId=excluded.categoriaId,payload=excluded.payload',
   [input.id,input.usuarioId,input.categoriaId,JSON.stringify(record),input.recorrenciaId?`${input.recorrenciaId}_${input.competenciaRecorrencia}`:null]);
  return record;
 }
 private async remove(table:Table,uid:string,id:string){
  const old=await this.existing<Controle&{usuarioId:string}>(table,uid,id);
  if(!old||old.excluidoEm)throw Error('Registro não encontrado.');
  const now=new Date().toISOString();
  await this.db.run(`UPDATE ${table} SET excluidoEm=?,payload=? WHERE usuarioId=? AND id=?`,[now,JSON.stringify({...old,excluidoEm:now,atualizadoEm:now}),uid,id]);
 }
 listCategories(uid:string){return this.queue(()=>this.transaction(()=>this.categories(uid)));}
 listEntries(uid:string,filter:Filtro={}){
  return this.queue(async()=>{const rows=await this.read<Lancamento>('lancamentos',uid);return rows.filter(e=>(!filter.mes||e.data.slice(0,7)===filter.mes)&&(!filter.tipo||e.tipo===filter.tipo)&&(!filter.categoriaId||e.categoriaId===filter.categoriaId)&&(!filter.busca||e.descricao.toLocaleLowerCase('pt-BR').includes(filter.busca.toLocaleLowerCase('pt-BR')))).sort((a,b)=>b.data.localeCompare(a.data)||b.criadoEm.localeCompare(a.criadoEm));});
 }
 getEntry(uid:string,id:string){return this.queue(async()=> (await this.read<Lancamento>('lancamentos',uid,id))[0]??null);}
 saveEntry(input:LancamentoInput){return this.queue(()=>this.transaction(()=>this.putEntry(input)));}
 deleteEntry(uid:string,id:string){return this.queue(()=>this.transaction(()=>this.remove('lancamentos',uid,id)));}
 listBudgets(uid:string,month:string){return this.queue(async()=> (await this.read<Orcamento>('orcamentos',uid)).filter(b=>b.mes===month));}
 saveBudget(input:OrcamentoInput){return this.queue(()=>this.transaction(async()=>{
  if(!positiveMoney(input.limiteCentavos)||!validMonth(input.mes))throw Error('Informe mês e limite válidos.');
  const cats=await this.categories(input.usuarioId);if(!cats.some(c=>c.id===input.categoriaId&&c.tipo==='despesa'))throw Error('Escolha uma categoria de despesa.');
  const id=`${input.usuarioId}:${input.categoriaId}_${input.mes}`;const old=await this.existing<Orcamento>('orcamentos',input.usuarioId,id);
  const record={...input,id,...this.control(old)};
  await this.db.run('INSERT INTO orcamentos(id,usuarioId,categoriaId,mes,payload) VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload,excluidoEm=NULL',[id,input.usuarioId,input.categoriaId,input.mes,JSON.stringify(record)]);return record;
 }));}
 deleteBudget(uid:string,id:string){return this.queue(()=>this.transaction(()=>this.remove('orcamentos',uid,id)));}
 listRecurrences(uid:string){return this.queue(()=>this.read<Recorrencia>('recorrencias',uid));}
 saveRecurrence(input:RecorrenciaInput){return this.queue(()=>this.transaction(async()=>{
  if(!input.id||!positiveMoney(input.valorCentavos)||!validMonth(input.mesInicial)||!Number.isInteger(input.diaDoMes)||input.diaDoMes<1||input.diaDoMes>31||!input.descricao.trim()||input.descricao.trim().length>80)throw Error('Confira descrição, valor, mês inicial e dia (1–31).');
  const cats=await this.categories(input.usuarioId);if(!cats.some(c=>c.id===input.categoriaId&&c.tipo==='despesa'))throw Error('Escolha uma categoria de despesa.');
  const old=await this.existing<Recorrencia>('recorrencias',input.usuarioId,input.id);if(old?.excluidoEm)throw Error('Recorrência excluída.');
  const record={...input,descricao:input.descricao.trim(),...this.control(old)};
  await this.db.run('INSERT INTO recorrencias(id,usuarioId,categoriaId,payload) VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET categoriaId=excluded.categoriaId,payload=excluded.payload',[input.id,input.usuarioId,input.categoriaId,JSON.stringify(record)]);return record;
 }));}
 deleteRecurrence(uid:string,id:string){return this.queue(()=>this.transaction(()=>this.remove('recorrencias',uid,id)));}
 confirmOccurrence(uid:string,id:string,month:string,today:string,correction?:LancamentoInput){return this.queue(()=>this.transaction(async()=>{
  const r=(await this.read<Recorrencia>('recorrencias',uid,id))[0];
  if(!r||!r.ativa||month<r.mesInicial)throw Error('Recorrência indisponível neste mês.');
  const date=occurrenceDate(month,r.diaDoMes);if(date>today||date>this.today())throw Error('A ocorrência ainda não aconteceu.');
  const entryId=`${id}_${month}`;
  if((await this.read<Lancamento>('lancamentos',uid,entryId,true)).length)throw Error('Esta ocorrência já foi confirmada, mesmo que tenha sido excluída.');
  return this.putEntry({...correction,id:entryId,usuarioId:uid,categoriaId:correction?.categoriaId??r.categoriaId,tipo:'despesa',valorCentavos:correction?.valorCentavos??r.valorCentavos,data:correction?.data??date,descricao:correction?.descricao??r.descricao,origem:'recorrencia',recorrenciaId:id,competenciaRecorrencia:month},true);
 }));}
 loadDemo(uid:string,today:string){return this.queue(()=>this.transaction(async()=>{
  const counts=await Promise.all((['lancamentos','orcamentos','recorrencias'] as Table[]).map(t=>this.read(t,uid,undefined,true)));
  if(counts.some(rows=>rows.length))throw Error('Os exemplos só podem ser carregados em uma base financeira vazia.');
  await this.categories(uid);const month=today.slice(0,7);
  await this.putEntry({id:`${uid}-demo-income`,usuarioId:uid,categoriaId:'salario',tipo:'receita',valorCentavos:215000,data:month+'-01',descricao:'Bolsa e trabalho · exemplo',origem:'manual'});
  await this.putEntry({id:`${uid}-demo-market`,usuarioId:uid,categoriaId:'alimentacao',tipo:'despesa',valorCentavos:22730,data:today,descricao:'Compras da semana · exemplo',origem:'manual'});
 }));}
 close(){return this.queue(()=>this.db.close());}
}
export async function createRepository(db:SqlAdapter,today?:()=>string){await migrate(db);return new Repository(db,today);}
