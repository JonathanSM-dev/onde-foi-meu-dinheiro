import {openDatabaseAsync} from 'expo-sqlite';
import {createRepository} from './repository';
import type {Params} from './adapter';
export async function openRepository(){
 const db=await openDatabaseAsync('onde-foi-meu-dinheiro.db');
 return createRepository({exec:sql=>db.execAsync(sql),run:async(sql,params=[])=>{await db.runAsync(sql,params);},all:<T>(sql:string,params:Params=[])=>db.getAllAsync<T>(sql,params),close:()=>db.closeAsync()});
}
