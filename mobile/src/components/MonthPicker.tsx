import {View,Text} from 'react-native';
import {Button} from './ui';
import {useApp} from '../state/AppProvider';
import {monthLabel,shiftMonth} from '../domain/dates';
import {styles as s} from '../theme';
export function MonthPicker(){const {month,setMonth}=useApp();return <View style={s.stack}><Text style={s.small}>Período · {monthLabel(month)}</Text><View style={s.row}><Button title="‹ Mês anterior" secondary disabled={month==='1900-01'} onPress={()=>setMonth(shiftMonth(month,-1))}/><Button title="Próximo mês ›" secondary onPress={()=>setMonth(shiftMonth(month,1))}/></View></View>;}
