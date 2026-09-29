import {useState} from 'react';
import {Text,View} from 'react-native';
import {router,useLocalSearchParams} from 'expo-router';
import {usePreventRemove} from 'expo-router/react-navigation';
import {Screen,Button,Confirm,Notice,Feedback} from '../../../src/components/ui';
import {EntryForm} from '../../../src/components/EntryForm';
import {useApp} from '../../../src/state/AppProvider';
import {useQuery} from '../../../src/state/useQuery';
import type {LancamentoInput} from '../../../src/domain/types';
import {formatMoney} from '../../../src/domain/money';
import {displayDate,localToday} from '../../../src/domain/dates';
import {validateEntry} from '../../../src/domain/validation';
import {styles as s} from '../../../src/theme';
export default function Details(){
 const params=useLocalSearchParams<{id:string}>();const id=typeof params.id==='string'?params.id:'';
 const {repo,uid,revision,refresh}=useApp();const [editing,setEditing]=useState<LancamentoInput|null>(null);const [deleting,setDeleting]=useState(false);const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [errors,setErrors]=useState<Record<string,string>>({});
 usePreventRemove(busy,()=>{});
 const q=useQuery(async()=>({entry:await repo.getEntry(uid,id),categories:await repo.listCategories(uid)}),[repo,uid,id,revision]);
 const mutate=async(remove:boolean)=>{
  if(busy)return;
  if(!remove&&editing){const e=validateEntry(editing,q.data?.categories||[],localToday());setErrors(e);if(Object.keys(e).length)return;}
  setBusy(true);setError('');
  try{if(remove)await repo.deleteEntry(uid,id);else if(editing)await repo.saveEntry(editing);refresh();setEditing(null);setDeleting(false);setBusy(false);if(remove)router.replace('/historico');}catch(e){setError((e as Error).message);}finally{setBusy(false);}
 };
 const e=q.data?.entry;
 return <Screen title={editing?'Ajustar lançamento':'Cada detalhe conta.'}><Feedback loading={q.loading} error={q.error} retry={q.retry}/>
 {!q.loading&&!q.error&&(!e?<><Notice>Este lançamento não foi encontrado ou já foi excluído.</Notice><Button title="Voltar ao histórico" onPress={()=>router.replace('/historico')}/></>:editing?<><EntryForm key={e.id} value={editing} categories={q.data!.categories} errors={errors} lockedType={e.origem==='recorrencia'} onChange={v=>{if(!busy)setEditing(v);}}/><Button title={busy?'Salvando…':'Salvar alterações'} disabled={busy} onPress={()=>void mutate(false)}/><Button title="Cancelar edição" secondary disabled={busy} onPress={()=>setEditing(null)}/></>:<><View style={s.card}><Text style={s.section}>{e.descricao}</Text><Text style={s.heroValue}>{/* value below uses contrast-safe ink */}</Text><Text style={s.amount}>{e.tipo==='receita'?'+':'−'} {formatMoney(e.valorCentavos)}</Text><Text style={s.text}>{q.data!.categories.find(c=>c.id===e.categoriaId)?.nome}</Text><Text style={s.small}>{displayDate(e.data)} · origem: {e.origem}</Text></View><Button title="Editar lançamento" onPress={()=>setEditing(e)}/><Button title="Excluir lançamento" secondary danger onPress={()=>setDeleting(true)}/></>)}
 {deleting&&<Confirm message="Excluir este lançamento? Os totais serão recalculados. A confirmação de uma recorrência não poderá ser repetida." busy={busy} onConfirm={()=>void mutate(true)} onCancel={()=>setDeleting(false)}/>}
 {!!error&&<Notice error>{error}</Notice>}</Screen>;
}
