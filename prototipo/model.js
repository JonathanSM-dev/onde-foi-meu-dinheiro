(function(root) {
  const M = {
    parseMoney(input) {
      const text=String(input).trim();
      if (!/^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/.test(text)) return null;
      const [whole,decimal='']=text.replaceAll('.','').split(',');
      const value=Number(whole)*100+Number(decimal.padEnd(2,'0'));
      return Number.isSafeInteger(value)&&value>0&&value<=999999999 ? value : null;
    },
    totals(items,month) {
      let income=0,expense=0;
      for (const item of items.filter(i=>i.date.startsWith(month))) {
        if (item.type==='income') income+=item.amount;
        else expense+=item.amount;
      }
      return {income,expense,balance:income-expense};
    },
    variation(current,previous) { return previous===0?null:Math.round((current-previous)/previous*100); },
    previousMonth(month) {
      const [year,m]=month.split('-').map(Number);
      return `${m===1?year-1:year}-${String(m===1?12:m-1).padStart(2,'0')}`;
    },
    suggestAmount(text) {
      const tokens=String(text).match(/[+-]?\d[\d.,]*(?:[eE][+-]?\d+)?/g)||[];
      return tokens.length===1?M.parseMoney(tokens[0]):null;
    },
    confirmRecurring(state,item,month) {
      const id=`${item.id}-${month}`;
      if(state.occurrences.includes(id)) return false;
      const [year,m]=month.split('-').map(Number);
      const day=Math.min(item.day,new Date(year,m,0).getDate());
      state.transactions.push({id,type:'expense',amount:item.amount,category:item.category,description:item.description,date:`${month}-${String(day).padStart(2,'0')}`,origin:'Recorrência'});
      state.occurrences.push(id);
      return true;
    },
    seed() {
      return {
        transactions:[
          {id:'t1',type:'income',amount:180000,category:'Bolsa / salário',description:'Bolsa de estágio',date:'2026-09-05',origin:'Manual'},
          {id:'t2',type:'income',amount:35000,category:'Outras receitas',description:'Projeto freelance',date:'2026-09-15',origin:'Texto'},
          {id:'t3',type:'expense',amount:62000,category:'Moradia',description:'Aluguel de setembro',date:'2026-09-05',origin:'Manual'},
          {id:'t4',type:'expense',amount:18550,category:'Alimentação',description:'Compras da semana',date:'2026-09-19',origin:'Foto'},
          {id:'t5',type:'expense',amount:3200,category:'Transporte',description:'Recarga do ônibus',date:'2026-09-22',origin:'Manual'},
          {id:'t6',type:'expense',amount:2890,category:'Alimentação',description:'Almoço no campus',date:'2026-09-24',origin:'Texto'},
          {id:'t7',type:'expense',amount:4590,category:'Lazer',description:'Cinema com amigos',date:'2026-09-23',origin:'Manual'},
          {id:'t8',type:'expense',amount:1290,category:'Alimentação',description:'Café da tarde',date:'2026-09-25',origin:'Texto'},
          {id:'p1',type:'income',amount:180000,category:'Bolsa / salário',description:'Bolsa de estágio',date:'2026-08-05',origin:'Manual'},
          {id:'p2',type:'expense',amount:62000,category:'Moradia',description:'Aluguel de agosto',date:'2026-08-05',origin:'Manual'},
          {id:'p3',type:'expense',amount:38000,category:'Alimentação',description:'Alimentação em agosto',date:'2026-08-20',origin:'Manual'},
          {id:'p4',type:'expense',amount:8000,category:'Transporte',description:'Transporte em agosto',date:'2026-08-20',origin:'Manual'},
          {id:'p5',type:'expense',amount:12000,category:'Lazer',description:'Lazer em agosto',date:'2026-08-20',origin:'Manual'},
        ],
        budgets:[{id:'b1',category:'Alimentação',amount:40000,month:'2026-09'},{id:'b2',category:'Transporte',amount:12000,month:'2026-09'},{id:'b3',category:'Lazer',amount:15000,month:'2026-09'},{id:'b4',category:'Moradia',amount:70000,month:'2026-09'}],
        recurring:[{id:'r1',description:'Internet de casa',category:'Moradia',amount:7990,day:10},{id:'r2',description:'Streaming',category:'Lazer',amount:2190,day:15}],
        occurrences:[],
      };
    },
  };
  if (typeof module !== 'undefined') module.exports=M;
  else root.MoneyModel=M;
})(globalThis);
