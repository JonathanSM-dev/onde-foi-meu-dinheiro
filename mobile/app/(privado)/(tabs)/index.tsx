import {useState} from 'react';
import {Text,View} from 'react-native';
import {router} from 'expo-router';
import {Screen,Button,Feedback,Notice,Confirm} from '../../../src/components/ui';
import {MonthPicker} from '../../../src/components/MonthPicker';
import {EntryCard} from '../../../src/components/EntryCard';
import {useApp} from '../../../src/state/AppProvider';
import {useQuery} from '../../../src/state/useQuery';
import {summarize} from '../../../src/domain/summary';
import {formatMoney} from '../../../src/domain/money';
import {localToday} from '../../../src/domain/dates';
import {styles as s} from '../../../src/theme';
export default function Home(){
 const {repo,uid,name,month,revision,refresh,leave}=useApp();const [confirm,setConfirm]=useState(false);const [busy,setBusy]=useState(false);const [error,setError]=useState('');
 const q=useQuery(async()=>({entries:await repo.listEntries(uid,{}),categories:await repo.listCategories(uid)}),[repo,uid,revision]);
 const summary=summarize(q.data?.entries||[],month);const current=q.data?.entries.filter(e=>e.data.startsWith(month))||[];
 return <Screen title={'Vamos cuidar\ndo seu mês?'} subtitle={'Olá, '+name+'. Cada registro conta.'}><MonthPicker/><Feedback loading={q.loading} error={q.error} retry={q.retry}/>
 {!q.loading&&!q.error&&<><View style={s.hero}><Text style={s.heroLabel}>Seu saldo do mês</Text><Text style={s.heroValue}>{formatMoney(summary.saldo)}</Text><Text style={s.heroLabel}>O que entrou menos o que saiu.</Text><View style={s.row}><View><Text style={s.heroLabel}>↙ Receitas</Text><Text style={s.heroText}>{formatMoney(summary.receitas)}</Text></View><View><Text style={s.heroLabel}>↗ Despesas</Text><Text style={s.heroText}>{formatMoney(summary.despesas)}</Text></View></View></View>
 <Button title="+ Registrar lançamento" onPress={()=>router.push('/novo')}/><Button title="Recorrências" secondary onPress={()=>router.push('/recorrencias')}/>
 <View style={s.row}><Text style={s.section}>Últimos lançamentos</Text><Button title="Ver histórico" secondary onPress={()=>router.push('/historico')}/></View>
 {current.slice(0,3).map(e=><EntryCard key={e.id} entry={e} categories={q.data!.categories}/>)}{!current.length&&<Feedback empty="Seu mês começa aqui. Registre sua primeira receita ou despesa."/>}
 {!q.data?.entries.length&&<Button title="Carregar exemplos fictícios" secondary onPress={()=>setConfirm(true)}/>}
 {confirm&&<Confirm message="Adicionar receitas e despesas fictícias? Disponível somente enquanto a base financeira estiver vazia." busy={busy} onCancel={()=>setConfirm(false)} onConfirm={()=>{setBusy(true);void repo.loadDemo(uid,localToday()).then(()=>{refresh();setConfirm(false);}).catch(e=>setError(e.message)).finally(()=>setBusy(false));}}/>}
 {!!error&&<Notice error>{error}</Notice>}<Notice>Dados salvos neste aparelho. Autenticação, câmera e IA são demonstrações nesta etapa.</Notice><Button title="Sair da demonstração" secondary onPress={leave}/></>}
 </Screen>;
}
