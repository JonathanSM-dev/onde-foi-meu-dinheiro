const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('./model.js');

test('valores em centavos preservam precisão e rejeitam entradas inválidas', () => {
  assert.equal(M.parseMoney('0,10') + M.parseMoney('0,20'), 30);
  assert.equal(M.parseMoney('1.250,50'), 125050);
  for (const input of ['0', '-10', '1,234', '', 'abc', '1e3']) assert.equal(M.parseMoney(input), null);
});
test('totais incluem apenas o mês selecionado e mudam após edição/exclusão', () => {
  const items = [
    { id:'1', type:'income', amount:10000, date:'2026-09-01' },
    { id:'2', type:'expense', amount:3000, date:'2026-09-02' },
    { id:'3', type:'expense', amount:900, date:'2026-08-02' },
  ];
  assert.deepEqual(M.totals(items, '2026-09'), {income:10000, expense:3000, balance:7000});
  items[1].amount = 4500;
  assert.equal(M.totals(items,'2026-09').balance,5500);
  items.splice(1,1);
  assert.equal(M.totals(items,'2026-09').expense,0);
});
test('resumo sem mês anterior não divide por zero', () => {
  assert.equal(M.variation(4500,0), null);
  assert.equal(M.variation(12000,10000),20);
});
test('comparação encontra o mês anterior fora do cenário inicial e na virada do ano', () => {
  assert.equal(M.previousMonth('2026-06'),'2026-05');
  assert.equal(M.previousMonth('2026-01'),'2025-12');
});
test('simulação de texto não extrai prefixos monetários inválidos nem escolhe entre vários valores', () => {
  assert.equal(M.suggestAmount('gastei 45 no mercado ontem'),4500);
  assert.equal(M.suggestAmount('recebi 1.250,50 hoje'),125050);
  for(const value of ['gastei -10','gastei 1,234','gastei 10.50','gastei 1e3','gastei 10 e 20']) assert.equal(M.suggestAmount(value),null);
});
test('recorrência mantém identidade mensal mesmo depois da exclusão do lançamento', () => {
  const state = {transactions:[], occurrences:[]};
  const recurring = {id:'r1', amount:4500, category:'Moradia', description:'Internet', day:31};
  assert.equal(M.confirmRecurring(state,recurring,'2026-02'),true);
  assert.equal(state.transactions[0].date,'2026-02-28');
  assert.equal(M.confirmRecurring(state,recurring,'2026-02'),false);
  state.transactions=[];
  assert.equal(M.confirmRecurring(state,recurring,'2026-02'),false);
});
