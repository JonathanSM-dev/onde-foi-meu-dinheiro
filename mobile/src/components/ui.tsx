import type {PropsWithChildren} from 'react';
import {ActivityIndicator,KeyboardAvoidingView,Platform,Pressable,ScrollView,Text,TextInput,View,type TextInputProps} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors,styles as s} from '../theme';
export function Screen({children,title,subtitle}:PropsWithChildren<{title?:string;subtitle?:string}>){
 return <SafeAreaView style={{flex:1,backgroundColor:colors.bg}} edges={['top','left','right']}><KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.content}>
 <Text style={{fontSize:11,fontWeight:'700',letterSpacing:1.6,color:colors.muted}}>ONDE FOI MEU DINHEIRO</Text>
 {title&&<Text accessibilityRole="header" style={s.title}>{title}</Text>}{subtitle&&<Text style={s.subtitle}>{subtitle}</Text>}{children}
 </ScrollView></KeyboardAvoidingView></SafeAreaView>;
}
export function Button({title,onPress,secondary=false,danger=false,disabled=false}:{title:string;onPress:()=>void;secondary?:boolean;danger?:boolean;disabled?:boolean}){
 return <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={{disabled}} disabled={disabled} onPress={onPress} style={({pressed})=>({minHeight:48,padding:14,borderRadius:14,borderWidth:1,borderColor:danger?colors.error:colors.green,backgroundColor:secondary?colors.card:danger?colors.error:colors.green,opacity:disabled?.45:pressed?.75:1,alignItems:'center',justifyContent:'center'})}><Text style={{color:secondary?(danger?colors.error:colors.green):'#fff',fontSize:15,fontWeight:'600',textAlign:'center'}}>{title}</Text></Pressable>;
}
export function Field({label,error,...props}:TextInputProps&{label:string;error?:string}){
 return <View style={{gap:6}}><Text style={{color:colors.ink,fontSize:14,fontWeight:'600'}}>{label}</Text><TextInput accessibilityLabel={label} placeholderTextColor="#74806D" {...props} style={[{minHeight:50,borderWidth:1,borderColor:error?colors.error:colors.line,backgroundColor:colors.card,padding:13,borderRadius:12,fontSize:16,color:colors.ink},props.style]}/>{error&&<Text accessibilityRole="alert" style={s.error}>{error}</Text>}</View>;
}
export function Choice({label,value,items,onChange}:{label:string;value:string;items:{value:string;label:string}[];onChange:(value:string)=>void}){
 return <View style={{gap:8}}><Text style={{fontSize:14,fontWeight:'600',color:colors.ink}}>{label}</Text><View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>{items.map(item=><Pressable key={item.value} accessibilityRole="button" accessibilityLabel={item.label} accessibilityState={{selected:value===item.value}} onPress={()=>onChange(item.value)} style={{minHeight:44,padding:12,borderRadius:12,borderWidth:1,borderColor:value===item.value?colors.green:colors.line,backgroundColor:value===item.value?colors.pale:colors.card}}><Text style={{fontSize:14,color:colors.green,fontWeight:value===item.value?'700':'400'}}>{item.label}</Text></Pressable>)}</View></View>;
}
export function Notice({children,error=false}:PropsWithChildren<{error?:boolean}>){return <View style={[s.card,{backgroundColor:error?'#FFF0E9':colors.pale,padding:14}]}><Text accessibilityRole={error?'alert':undefined} style={error?s.error:s.small}>{children}</Text></View>;}
export function Feedback({loading,error,empty,retry}:{loading?:boolean;error?:string|null;empty?:string;retry?:()=>void}){
 if(loading)return <View style={s.card}><ActivityIndicator color={colors.green}/><Text style={s.small}>Carregando seus registros…</Text></View>;
 if(error)return <View style={s.card}><Text style={s.error} accessibilityRole="alert">{error}</Text>{retry&&<Button title="Tentar novamente" onPress={retry}/>}</View>;
 if(empty)return <View style={s.card}><Text style={s.section}>Um começo mais leve.</Text><Text style={s.subtitle}>{empty}</Text></View>;
 return null;
}
export function Confirm({message,onConfirm,onCancel,busy=false}:{message:string;onConfirm:()=>void;onCancel:()=>void;busy?:boolean}){
 return <View style={s.card}><Text accessibilityRole="alert" style={s.text}>{message}</Text><Button title={busy?'Aguarde…':'Confirmar'} danger disabled={busy} onPress={onConfirm}/><Button title="Cancelar" secondary disabled={busy} onPress={onCancel}/></View>;
}
