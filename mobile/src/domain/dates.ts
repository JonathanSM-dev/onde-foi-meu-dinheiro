const pad=(n:number)=>String(n).padStart(2,'0');
export function localToday(now=new Date()): string { return `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`; }
export function validMonth(month:string): boolean { return /^\d{4}-(0[1-9]|1[0-2])$/.test(month)&&Number(month.slice(0,4))>=1900; }
export function validDate(value:string): boolean {
 if(!/^\d{4}-\d{2}-\d{2}$/.test(value)||!validMonth(value.slice(0,7)))return false;
 const [y,m,d]=value.split('-').map(Number); const date=new Date(y,m-1,d,12);
 return date.getFullYear()===y&&date.getMonth()===m-1&&date.getDate()===d;
}
export function shiftMonth(month:string,delta:number): string {
 if(!validMonth(month))throw new Error('Mês inválido.');
 const [y,m]=month.split('-').map(Number);const date=new Date(y,m-1+delta,1,12);
 return localToday(date).slice(0,7);
}
export const previousMonth=(month:string)=>shiftMonth(month,-1);
export function occurrenceDate(month:string,day:number): string {
 if(!validMonth(month)||!Number.isInteger(day)||day<1||day>31)throw new Error('Dia ou mês inválido.');
 const [y,m]=month.split('-').map(Number);
 return `${month}-${pad(Math.min(day,new Date(y,m,0,12).getDate()))}`;
}
export const displayDate=(date:string)=>date.split('-').reverse().join('/');
export function monthLabel(month:string):string {
 const [y,m]=month.split('-').map(Number);
 return new Date(y,m-1,1,12).toLocaleDateString('pt-BR',{month:'long',year:'numeric'});
}
