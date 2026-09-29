import {Tabs} from 'expo-router/js-tabs';
import {Ionicons} from '@expo/vector-icons';
import {colors} from '../../../src/theme';
export default function TabLayout(){return <Tabs screenOptions={{headerShown:false,tabBarActiveTintColor:colors.green,tabBarInactiveTintColor:colors.muted,tabBarStyle:{backgroundColor:colors.card,borderTopColor:colors.line},tabBarLabelStyle:{fontSize:12}}}>
 <Tabs.Screen name="index" options={{title:'Início',tabBarIcon:({color,size})=><Ionicons name="home-outline" color={color} size={size}/>}}/>
 <Tabs.Screen name="historico" options={{title:'Histórico',tabBarIcon:({color,size})=><Ionicons name="receipt-outline" color={color} size={size}/>}}/>
 <Tabs.Screen name="orcamentos" options={{title:'Orçamentos',tabBarIcon:({color,size})=><Ionicons name="wallet-outline" color={color} size={size}/>}}/>
 <Tabs.Screen name="resumo" options={{title:'Resumo',tabBarIcon:({color,size})=><Ionicons name="bar-chart-outline" color={color} size={size}/>}}/>
 </Tabs>;}
