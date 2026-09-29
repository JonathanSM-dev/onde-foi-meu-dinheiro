import {Text,View} from 'react-native';
import type {Categoria} from '../domain/types';
import {formatMoney} from '../domain/money';
import {colors,styles as s} from '../theme';
export function CategoryBars({totals,categories}:{totals:Record<string,number>;categories:Categoria[]}){
 const sum=Object.values(totals).reduce((a,b)=>a+b,0);
 return <View style={s.card}><Text style={s.section}>Para onde foi?</Text>{Object.entries(totals).sort((a,b)=>b[1]-a[1]).map(([id,value])=><View key={id} style={{gap:7}}><View style={s.row}><Text style={s.text}>{categories.find(c=>c.id===id)?.nome}</Text><Text style={s.small}>{formatMoney(value)} · {Math.round(value/sum*100)}%</Text></View><View style={{height:8,backgroundColor:colors.pale,borderRadius:4}}><View style={{height:8,width:`${value/sum*100}%`,backgroundColor:colors.green,borderRadius:4}}/></View></View>)}{!sum&&<Text style={s.small}>Sem despesas neste período.</Text>}</View>;
}
