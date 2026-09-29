import {StyleSheet} from 'react-native';
export const colors={bg:'#F7F7EF',card:'#FFFEFA',green:'#174C42',ink:'#243B32',muted:'#5C6A56',line:'#DCE3D3',pale:'#EDF3E7',coral:'#B45F3B',error:'#9C302B'};
export const styles=StyleSheet.create({
 content:{padding:22,gap:18,width:'100%',maxWidth:650,alignSelf:'center',paddingBottom:38},
 title:{fontSize:28,fontWeight:'700',color:colors.green,letterSpacing:-.7},
 subtitle:{fontSize:15,lineHeight:23,color:colors.muted},
 section:{fontSize:20,fontWeight:'700',color:colors.ink},
 text:{fontSize:16,lineHeight:23,color:colors.ink},
 small:{fontSize:13,lineHeight:20,color:colors.muted},
 card:{backgroundColor:colors.card,borderWidth:1,borderColor:colors.line,borderRadius:22,padding:20,gap:12},
 row:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'},
 stack:{gap:12},error:{color:colors.error,fontSize:14,lineHeight:21},
 hero:{backgroundColor:colors.green,borderRadius:26,padding:24,gap:16},
 heroValue:{fontSize:36,fontWeight:'700',color:'#FFFDF4',letterSpacing:-1},
 heroLabel:{color:'#DBE9D5',fontSize:14},heroText:{color:'#FFFFFF',fontSize:18,fontWeight:'600'},
 pill:{backgroundColor:colors.pale,paddingHorizontal:12,paddingVertical:7,borderRadius:10},
 divider:{height:1,backgroundColor:colors.line},amount:{fontSize:19,fontWeight:'700',color:colors.green},
});
