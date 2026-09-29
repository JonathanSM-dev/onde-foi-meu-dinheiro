import {test} from 'node:test';
import assert from 'node:assert/strict';
import {LatestQuery,DemoSession} from '../src/state/controllers';
test('perfil demonstrativo sai e bloqueia acesso sem apagar dados',()=>{
 const s=new DemoSession();assert.equal(s.active,false);s.enter('Alex');assert.equal(s.active,true);s.leave();assert.equal(s.active,false);
});
test('consulta mais recente vence resposta antiga e erro permite retry',async()=>{
 const q=new LatestQuery<number>();let resolve!:(n:number)=>void;
 const old=q.run(()=>new Promise<number>(r=>resolve=r));
 await q.run(async()=>2);resolve(1);await old;assert.equal(q.data,2);
 await q.run(async()=>{throw Error('Banco ocupado');});assert.equal(q.error,'Banco ocupado');
 await q.run(async()=>3);assert.equal(q.error,null);assert.equal(q.data,3);
});
