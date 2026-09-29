import {useState} from 'react';
import {View} from 'react-native';
import type {Categoria,LancamentoInput,Tipo} from '../domain/types';
import {parseMoney,moneyInput} from '../domain/money';
import {Field,Choice} from './ui';
import {styles as s} from '../theme';
export function EntryForm({value,categories,errors={},onChange,lockedType=false}:{value:LancamentoInput;categories:Categoria[];errors?:Record<string,string>;onChange:(value:LancamentoInput)=>void;lockedType?:boolean}){
 const [amount,setAmount]=useState(value.valorCentavos?moneyInput(value.valorCentavos):'');
 return <View style={s.stack}>{!lockedType&&<Choice label="Tipo de lançamento" value={value.tipo} items={[{value:'despesa',label:'Despesa'},{value:'receita',label:'Receita'}]} onChange={tipo=>onChange({...value,tipo:tipo as Tipo,categoriaId:categories.find(c=>c.tipo===tipo)?.id||''})}/>}
 <Field label="Valor (R$)" value={amount} onChangeText={text=>{setAmount(text);onChange({...value,valorCentavos:parseMoney(text)||0});}} keyboardType="decimal-pad" placeholder="0,00" error={errors.valorCentavos} maxLength={20}/>
 <Field label="Data (AAAA-MM-DD)" value={value.data} onChangeText={data=>onChange({...value,data})} placeholder="2026-09-29" maxLength={10} error={errors.data}/>
 <Choice label="Categoria" value={value.categoriaId} items={categories.filter(c=>c.tipo===value.tipo).map(c=>({value:c.id,label:c.nome}))} onChange={categoriaId=>onChange({...value,categoriaId})}/>
 <Field label="Descrição" value={value.descricao} onChangeText={descricao=>onChange({...value,descricao})} maxLength={80} error={errors.descricao} placeholder="Ex.: compras no mercado"/>
 </View>;
}
