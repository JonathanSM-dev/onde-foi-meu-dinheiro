import {useState} from 'react';
import {Text,View} from 'react-native';
import {router} from 'expo-router';
import {Screen,Button,Confirm,Feedback,Notice} from '../../src/components/ui';
import {MonthPicker} from '../../src/components/MonthPicker';
import {RecurrenceForm} from '../../src/components/RecurrenceForm';
import {useApp} from '../../src/state/AppProvider';
import {useQuery} from '../../src/state/useQuery';
import {recurrenceDraft} from '../../src/domain/planning';
import type {RecorrenciaInput,Recorrencia} from '../../src/domain/types';
import {formatMoney} from '../../src/domain/money';
import {localToday} from '../../src/domain/dates';
import {styles as s} from '../../src/theme';
export default function Recurrences(){
 const {repo,uid,month,revision,refresh,draft}=useApp();const [form,setForm]=useState<RecorrenciaInput|null>(null);const [deleting,setDeleting]=useState('');const [busy,setBusy]=useState(false);const [error,setError]=useState('');
 const q=useQuery(async()=>({rows:await repo.listRecurrences(uid),categories:await repo.listCategories(uid)}),[repo,uid,revision]);
 const save=async(value:RecorrenciaInput)=>{if(busy)return;setBusy(true);setError('');try{await repo.saveRecurrence(value);refresh();setForm(null);}catch(e){setError((e as Error).message);}finally{setBusy(false);}};
 const review=(r:Recorrencia)=>{try{draft.begin(recurrenceDraft(r,month,localToday()));router.push('/revisao');}catch(e){setError((e as Error).message);}};
 return <Screen title="O que se repete\ntambém merece cuidado." subtitle="Uma previsão só vira despesa depois da sua confirmação."><MonthPicker/><Feedback loading={q.loading} error={q.error} retry={q.retry}/><Button title="+ Nova recorrência" disabled={q.loading||!!q.error} onPress={()=>{setError('');setForm({id:`rec-${Date.now()}-${Math.random().toString(36).slice(2)}`,usuarioId:uid,categoriaId:'moradia',descricao:'',valorCentavos:0,diaDoMes:10,mesInicial:month,ativa:true});}}/>
 {form&&<RecurrenceForm key={form.id} initial={form} categories={q.data?.categories||[]} onSave={v=>void save(v)} onCancel={()=>setForm(null)} busy={busy} error={error}/>}
 {!q.loading&&!q.error&&q.data?.rows.map(r=><View key={r.id} style={s.card}><Text style={s.section}>{r.descricao}</Text><Text style={s.amount}>{formatMoney(r.valorCentavos)}</Text><Text style={s.small}>Todo dia {r.diaDoMes} · {r.ativa?'Ativa':'Pausada'} · desde {r.mesInicial}</Text><Button title={'Revisar ocorrência de '+r.descricao} disabled={!r.ativa} onPress={()=>review(r)}/><Button title={'Editar '+r.descricao} secondary onPress={()=>{setError('');setForm(r);}}/><Button title="Excluir recorrência" danger secondary onPress={()=>setDeleting(r.id)}/></View>)}
 {!q.loading&&!q.error&&!q.data?.rows.length&&!form&&<Feedback empty="Cadastre despesas mensais, como internet ou aluguel. Nada é debitado automaticamente."/>}
 {!!deleting&&<Confirm message="Excluir o modelo? Lançamentos já confirmados serão preservados." busy={busy} onCancel={()=>setDeleting('')} onConfirm={()=>{if(busy)return;setBusy(true);void repo.deleteRecurrence(uid,deleting).then(()=>{refresh();setDeleting('');}).catch(e=>setError(e.message)).finally(()=>setBusy(false));}}/>}{!!error&&!form&&<Notice error>{error}</Notice>}</Screen>;
}
