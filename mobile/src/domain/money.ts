export function parseMoney(text: string): number | null {
 const value=text.trim();
 if(!/^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/.test(value))return null;
 const [whole,fraction='']=value.replace(/\./g,'').split(',');
 const cents=Number(whole)*100+Number(fraction.padEnd(2,'0'));
 return Number.isSafeInteger(cents)&&cents>0?cents:null;
}
export function formatMoney(cents: number): string {
 return (cents/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
}
export const moneyInput=(cents:number)=> (cents/100).toFixed(2).replace('.',',');
