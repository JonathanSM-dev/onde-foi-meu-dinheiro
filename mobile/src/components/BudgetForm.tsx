import {useState} from 'react';
import {View} from 'react-native';
import type {Categoria,OrcamentoInput} from '../domain/types';
import {Field,Choice,Button,Notice} from './ui';
import {parseMoney,moneyInput} from '../domain/money';
import {styles as s} from '../theme';
export function BudgetForm({initial,categories,onSave,onCancel,busy,error}:{initial:OrcamentoInput;categories:Categoria[];onSave:(value:OrcamentoInput)=>void;onCancel:()=>void;busy:boolean;error:string}){
 const [category,setCategory]=useState(initial.categoriaId);const [amount,setAmount]=useState(initial.limiteCentavos?moneyInput(initial.limiteCentavos):'');
 return <View style={s.card}><Choice label="Categoria do orçamento" value={category} items={categories.filter(c=>c.tipo==='despesa').map(c=>({value:c.id,label:c.nome}))} onChange={setCategory}/><Field label="Limite mensal (R$)" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" maxLength={20}/>{!!error&&<Notice error>{error}</Notice>}<Button title={busy?'Salvando…':'Salvar orçamento'} disabled={busy} onPress={()=>onSave({...initial,categoriaId:category,limiteCentavos:parseMoney(amount)||0})}/><Button title="Cancelar orçamento" disabled={busy} secondary onPress={onCancel}/></View>;
}
