'use strict';
const M=MoneyModel;
const TODAY='2026-09-25';
const categories={expense:['Alimentação','Transporte','Moradia','Lazer','Saúde','Educação','Outros gastos'],income:['Bolsa / salário','Outras receitas']};
let data=M.seed(), session=true, screen='inicio', month='2026-09', scenario='normal';
let mode='text', inputText='', draft=null, selected=null, editing=false, photo=false, busy=false, operation=0;
let query='', filterType='', filterCategory='', formError='', summaryReady=false, toastTimer;
const app=document.getElementById('app'),nav=document.getElementById('bottom-nav'),dialog=document.getElementById('dialog');
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=value=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value/100);
const date=value=>value.split('-').reverse().join('/');
const amountInput=value=>(value/100).toFixed(2).replace('.',',');
const iconPaths={
 home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
 history:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>',
 budget:'<path d="M3 6a2 2 0 0 1 2-2h14v16H5a2 2 0 0 1-2-2Zm0 0v12M3 8h18v8h-6V8"/><path d="M17 12h1"/>',
 chart:'<path d="M4 20V10m8 10V4m8 16v-7M2 21h20"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 repeat:'<path d="M4 8a8 8 0 0 1 13-3l3 3m0-5v5h-5M20 16A8 8 0 0 1 7 19l-3-3m0 5v-5h5"/>',
 sparkle:'<path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4ZM20 2v4m-2-2h4"/>',
 food:'<path d="M5 3v6a2 2 0 0 0 4 0V3M7 3v18M17 3c-3 4-3 8 1 8V3m0 8v10"/>',
 transport:'<rect x="4" y="3" width="16" height="15" rx="3"/><path d="M4 11h16M8 18v3m8-3v3M8 14h1m6 0h1"/>',
 leisure:'<path d="m3 7 18-3v17H3Zm0 0 3 4m3-5 3 4m3-5 3 4M3 11h18m-11 3 5 2-5 2Z"/>',
 income:'<path d="M12 20V4m-6 6 6-6 6 6M4 20h16"/>',
 camera:'<path d="M3 7h4l2-3h6l2 3h4v14H3Z"/><circle cx="12" cy="13" r="4"/>',
 back:'<path d="m14 5-7 7 7 7"/>',
 edit:'<path d="m15 4 5 5M4 20l1-5L16 4a2 2 0 0 1 3 0l1 1a2 2 0 0 1 0 3L9 19Z"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
 lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
};
const icon=name=>`<svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name]||iconPaths.budget}</svg>`;
const button=(text,action,style='primary',extra='')=>`<button type="button" class="${style}" data-action="${action}" ${extra}>${text}</button>`;
const goButton=(text,to,style='secondary')=>`<button type="button" class="${style}" data-go="${to}">${text}</button>`;
const opts=(items,current,blank='')=>(blank?`<option value="">${blank}</option>`:'')+items.map(v=>`<option value="${esc(v)}" ${v===current?'selected':''}>${esc(v)}</option>`).join('');
const monthControl=()=>{
  const months=[...new Set(['2026-09','2026-08','2026-07',month,...data.transactions.map(t=>t.date.slice(0,7)),...data.budgets.map(b=>b.month)])].sort().reverse();
  const names=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  return `<div class="month-switch">${icon('history')}<label for="month" class="small-label">Período</label><select id="month">${months.map(m=>`<option value="${m}" ${month===m?'selected':''}>${names[Number(m.slice(5))-1]} de ${m.slice(0,4)}</option>`).join('')}</select></div>`;
};
const head=(title,subtitle='',back='inicio')=>`<header class="page-head">${back?goButton(icon('back')+' Voltar',back,'back'):''}<h2>${title}</h2>${subtitle?`<p>${subtitle}</p>`:''}</header>`;
const section=(title,link='',to='')=>`<div class="section-title"><h3>${title}</h3>${link?goButton(link,to,''):''}</div>`;
const currentItems=()=>data.transactions.filter(t=>t.date.startsWith(month));
const spent=category=>currentItems().filter(t=>t.type==='expense'&&t.category===category).reduce((n,t)=>n+t.amount,0);
const categoryStyle=category=>category==='Transporte'?'transport':category==='Lazer'?'leisure':category==='Moradia'?'home':categories.income.includes(category)?'income':'food';
const categoryIcon=category=>`<span class="category-icon ${categoryStyle(category)}">${icon(categoryStyle(category))}</span>`;
function rows(items) {
  if(!items.length)return empty('Nenhum lançamento por aqui','Quando você registrar algo, ele aparece aqui.');
  return [...items].sort((a,b)=>b.date.localeCompare(a.date)||b.id.localeCompare(a.id)).map(t=>`<button class="transaction" data-action="detail" data-id="${esc(t.id)}">${categoryIcon(t.category)}<span class="transaction-text"><strong>${esc(t.description)}</strong><small>${esc(t.category)} · ${date(t.date).slice(0,5)}</small></span><span class="amount ${t.type==='income'?'income-text':''}">${t.type==='income'?'+':'−'} ${money(t.amount)}</span></button>`).join('');
}
function empty(title,description){return `<div class="empty">${icon('history')}<h3>${title}</h3><p>${description}</p>${goButton('Registrar agora','novo','secondary')}</div>`;}
function toast(text){const t=document.getElementById('toast');t.textContent=text;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),3500);}
function navigate(to){
  operation++;busy=false;formError='';
  if(!session&&!['login','cadastro'].includes(to))to='login';
  screen=to;
  if(to==='novo'){draft=null;editing=false;photo=false;mode='text';}
  if(to==='resumo')summaryReady=false;
  render();app.scrollTop=0;app.focus({preventScroll:true});
}
function home(){
  const totals=M.totals(data.transactions,month),budget=data.budgets.find(b=>b.month===month&&b.category==='Alimentação');
  return `<header class="topline"><div><p class="greeting">Olá, Alex <span aria-hidden="true">☀</span></p><h2>Vamos cuidar do seu mês?</h2></div><button class="avatar" data-action="profile" aria-label="Perfil e sair">AL</button></header>${monthControl()}<section class="balance-card"><span class="small-label">Seu saldo do mês</span><div class="balance">${money(totals.balance)}</div><p class="balance-note">O que entrou menos o que saiu.</p><div class="balance-row"><div><span><i>↙</i> Receitas</span><strong>${money(totals.income)}</strong></div><div><span><i>↗</i> Despesas</span><strong>${money(totals.expense)}</strong></div></div></section><div class="quick-actions">${goButton(icon('plus')+' Registrar','novo','primary')}${goButton(icon('repeat')+' Recorrências','recorrencias','secondary')}</div>${budget?`${section('Seu orçamento','Ver todos','orcamentos')}<div class="budget-preview"><div class="between"><span>Alimentação</span><strong>${money(spent('Alimentação'))}</strong></div><div class="progress ${spent('Alimentação')>budget.amount?'over':''}"><span style="width:${Math.min(100,spent('Alimentação')/budget.amount*100)}%"></span></div><div class="between"><small>de ${money(budget.amount)} planejados</small><small>${Math.round(spent('Alimentação')/budget.amount*100)}% usado</small></div></div>`:''}${section('Últimos lançamentos','Ver histórico','historico')}${rows(currentItems().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3))}<div class="insight">${icon('sparkle')}<p><strong>Pequenos registros, grandes descobertas.</strong><br>Registrar hoje deixa o fim do mês mais claro.</p></div>`;
}
function auth(signup){
  return `<div class="auth-logo"><span class="brandmark">$<span>↗</span></span></div><div class="auth-title"><h2>${signup?'Seu primeiro passo<br>para mais clareza.':'Seu dinheiro.<br>Seu ritmo.'}</h2><p>${signup?'Crie sua conta e comece com um registro.':'Organize o presente.<br>Respire mais tranquilo no fim do mês.'}</p></div>${!signup?'<div class="auth-art" aria-hidden="true"><span class="coin">↙</span><span class="coin">$</span><span class="coin">↗</span></div>':''}<form id="auth-form">${signup?'<label class="field"><span>Como podemos chamar você?</span><input name="name" placeholder="Seu nome" required maxlength="60" autocomplete="off"></label>':''}<label class="field"><span>E-mail</span><input name="email" type="email" placeholder="voce@exemplo.com" required autocomplete="off"></label><label class="field"><span>Senha de demonstração</span><input name="password" type="password" placeholder="Use qualquer senha fictícia" required minlength="6" autocomplete="off"></label>${signup?'<label class="field"><span>Confirme a senha</span><input name="confirmation" type="password" required minlength="6" autocomplete="off"></label>':''}<p class="error-text" id="auth-error" role="alert"></p><button class="primary" type="submit">${signup?'Criar conta de demonstração':'Entrar'}</button></form><div class="auth-footer">${signup?'Já tem uma conta?':'Primeira vez por aqui?'} ${goButton(signup?'Entrar':'Criar conta',signup?'login':'cadastro','')}</div>${!signup?button('Explorar sem preencher','demo-login','secondary full'):''}<p class="auth-note">Use apenas dados fictícios. A autenticação é simulada<br>e nada é enviado ou armazenado permanentemente.</p>`;
}
function newEntry(){
  const tabs=`<div class="tabs" role="group" aria-label="Forma de registro">${[['text','Texto'],['photo','Foto'],['manual','Manual']].map(([v,label])=>button(label,'mode',v===mode?'active':'',`data-mode="${v}" aria-pressed="${v===mode}"`)).join('')}</div>`;
  let content='';
  if(mode==='manual')content=entryForm(false);
  else if(busy)content='<div class="loading" role="status"><div class="spinner"></div>Organizando os detalhes…<p class="input-hint">Processamento simulado</p></div>';
  else if(mode==='photo'){
    content=scenario==='camera-denied'?`<div class="camera">${icon('camera')}<p><strong>A câmera está sem permissão.</strong><br>Você pode continuar por texto ou preencher manualmente.</p></div>${button('Registrar por texto','text-fallback')}${button('Preencher manualmente','manual-fallback','secondary full')}`:`<div class="camera">${photo?'<div class="receipt"><b>MERCADO DO BAIRRO</b><br>24/09/2026 · CUPOM FICTÍCIO<br>-------------------------<br>Arroz &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 22,90<br>Leite &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 6,50<br>Frutas &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 15,60<br>-------------------------<br><b>TOTAL &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 45,00</b></div>':icon('camera')+'<p>Um cupom, menos digitação.<br>Enquadre o valor e a data com nitidez.</p>'}</div>${photo?button(icon('sparkle')+' Interpretar cupom','interpret')+button('Refazer foto','retake','text-button'):button(icon('camera')+' Simular captura','capture')}<p class="privacy-note">Esta demonstração usa um cupom fictício. No aplicativo final, a foto será processada por um serviço de IA após sua confirmação.</p>`;
  }else{
    content=`<label class="field" for="free-text"><span>O que você quer registrar?</span><textarea id="free-text" placeholder="Ex.: gastei 45 no mercado ontem" maxlength="500">${esc(inputText)}</textarea></label><p class="input-hint">Conte o valor, onde foi e quando aconteceu.</p><div class="chips">${button('Mercado · R$ 45','example','chip','data-example="gastei 45 no mercado ontem"')}${button('Recebi · R$ 1.800','example','chip','data-example="recebi 1800 de bolsa hoje"')}${button('Café · R$ 12,90','example','chip','data-example="gastei 12,90 no café hoje"')}</div>${button(icon('sparkle')+' Organizar lançamento','interpret')}<p class="privacy-note">Interpretação simulada para o protótipo. Confira todos os dados antes de salvar.</p>`;
  }
  return head('Registrar ficou mais leve.','Conte do seu jeito. A gente organiza os detalhes.')+tabs+(formError?`<div class="notice error" role="alert">${esc(formError)}<div class="actions">${button('Preencher manualmente','manual-fallback','secondary')}</div></div>`:'')+content;
}
function entryForm(isReview){
  const d=draft||{type:'expense',amount:0,category:'Alimentação',date:TODAY,description:''};
  return `<form id="entry-form">${isReview?'<span class="review-tag">'+icon('sparkle')+' Sugestão · confirme os detalhes</span>':''}<label class="field"><span>Tipo de lançamento</span><select name="type" id="entry-type"><option value="expense" ${d.type==='expense'?'selected':''}>Despesa</option><option value="income" ${d.type==='income'?'selected':''}>Receita</option></select></label><div class="field-grid"><label class="field"><span>Valor (R$)</span><input name="amount" inputmode="decimal" value="${d.amount?amountInput(d.amount):''}" placeholder="0,00" required maxlength="16"></label><label class="field"><span>Data</span><input name="date" type="date" value="${esc(d.date)}" max="${TODAY}" required></label></div><label class="field"><span>Categoria</span><select name="category" id="entry-category">${opts(categories[d.type],d.category)}</select></label><label class="field"><span>Descrição</span><input name="description" value="${esc(d.description)}" placeholder="Ex.: compras no mercado" required maxlength="80"></label><p class="error-text" id="entry-error" role="alert"></p>${isReview?'<div class="notice">Você está no controle. Corrija qualquer informação antes de confirmar.</div>':''}<button class="primary" type="submit">${icon('check')} ${editing?'Salvar alterações':isReview?'Confirmar lançamento':'Salvar lançamento'}</button><div class="actions">${goButton('Cancelar',editing?'detalhes':'inicio','secondary')}</div></form>`;
}
function history(){
  return head('Seu dinheiro em movimento.','Cada registro conta uma parte da história.','')+monthControl()+`<label class="field search"><span>Buscar no histórico</span><input id="search" type="search" placeholder="O que você está procurando?" value="${esc(query)}"></label><div class="filter-grid"><select id="filter-type" aria-label="Filtrar por tipo"><option value="">Todos os tipos</option><option value="expense" ${filterType==='expense'?'selected':''}>Despesas</option><option value="income" ${filterType==='income'?'selected':''}>Receitas</option></select><select id="filter-category" aria-label="Filtrar por categoria">${opts([...categories.expense,...categories.income],filterCategory,'Todas as categorias')}</select></div>${button('Limpar filtros','clear-filters','text-button')}<div id="history-results">${historyResults()}</div><div class="actions">${goButton(icon('plus')+' Novo lançamento','novo','primary')}</div>`;
}
function historyResults(){
  if(scenario==='list-error')return `<div class="notice error">Não foi possível carregar o histórico nesta simulação.${button('Tentar novamente','retry-list','text-button')}</div>`;
  const list=currentItems().filter(t=>(!filterType||t.type===filterType)&&(!filterCategory||t.category===filterCategory)&&t.description.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR')));
  return `<div class="section-title"><h3>${list.length} ${list.length===1?'lançamento':'lançamentos'}</h3></div>`+rows(list);
}
function details(){
  const t=data.transactions.find(t=>t.id===selected);
  if(!t)return head('Lançamento não encontrado.','Volte ao histórico para escolher um registro.','historico');
  return head('Cada detalhe importa.','','historico')+`<div class="detail-amount">${categoryIcon(t.category)}<h3 class="${t.type==='income'?'income-text':''}">${t.type==='income'?'+':'−'} ${money(t.amount)}</h3><p>${esc(t.description)}</p></div><dl class="details-list"><div><dt>Tipo</dt><dd>${t.type==='income'?'Receita':'Despesa'}</dd></div><div><dt>Categoria</dt><dd>${esc(t.category)}</dd></div><div><dt>Data</dt><dd>${date(t.date)}</dd></div><div><dt>Registrado por</dt><dd>${esc(t.origin)}</dd></div><div><dt>Situação</dt><dd>${scenario==='offline'?'Pendente · simulação':'Confirmado · demonstração'}</dd></div></dl><div class="actions">${button(icon('edit')+' Editar lançamento','edit-entry')}${button('Excluir lançamento','delete-entry','secondary danger')}</div>`;
}
function budgets(){
  const list=data.budgets.filter(b=>b.month===month);
  return head('Planos para o seu mês.','Defina limites que façam sentido para você.','')+monthControl()+list.map(b=>{const value=spent(b.category),over=value>b.amount;return `<section class="budget-card"><div class="between"><h3>${esc(b.category)}</h3>${button(icon('edit'),'budget-edit','icon-button',`data-id="${b.id}" aria-label="Editar orçamento de ${esc(b.category)}"`)}</div><div class="between"><strong>${money(value)}</strong><small>de ${money(b.amount)}</small></div><div class="progress ${over?'over':''}"><span style="width:${Math.min(100,value/b.amount*100)}%"></span></div><p>${over?`${money(value-b.amount)} acima do planejado`:`Ainda há ${money(b.amount-value)} no seu plano`}</p></section>`;}).join('')+(!list.length?'<div class="empty"><h3>Um plano começa por aqui.</h3><p>Defina o primeiro limite para este mês.</p></div>':'')+`<div class="actions">${button(icon('plus')+' Criar orçamento','budget-new')}</div><p class="input-hint">Os limites consideram somente despesas confirmadas no mês.</p>`;
}
function recurring(){
  return head('O que se repete no mês.','Deixe preparado. Confirme quando o gasto acontecer.')+monthControl()+data.recurring.map(r=>{const done=data.occurrences.includes(`${r.id}-${month}`);return `<section class="budget-card"><div class="between"><h3>${esc(r.description)}</h3><span class="recurring-date">Dia ${String(r.day).padStart(2,'0')}</span></div><p>${esc(r.category)} · mensal</p><div class="between"><strong>${money(r.amount)}</strong>${done?'<small>✓ Já confirmado</small>':''}</div><div class="mini-actions">${button(done?'Confirmado':'Confirmar gasto','recurring-confirm','secondary',`data-id="${r.id}" ${done?'disabled':''}`)}${button('Editar','recurring-edit','secondary',`data-id="${r.id}"`)}</div></section>`;}).join('')+(!data.recurring.length?'<div class="empty"><h3>Nenhuma recorrência cadastrada.</h3><p>Prepare os gastos que acontecem todo mês.</p></div>':'')+`<div class="actions">${button(icon('plus')+' Nova recorrência','recurring-new')}</div><div class="notice">Uma previsão não é um gasto. Os valores só entram no seu mês depois da confirmação.</div>`;
}
function summary(){
  const totals=M.totals(data.transactions,month);
  const prev=M.previousMonth(month);
  const previous=M.totals(data.transactions,prev),variation=M.variation(totals.expense,previous.expense);
  const groups=categories.expense.map(category=>({category,value:spent(category)})).filter(x=>x.value>0).sort((a,b)=>b.value-a.value);
  let insight=busy?'<div class="loading" role="status"><div class="spinner"></div>Preparando seu resumo…</div>':summaryReady?`<div class="insight">${icon('sparkle')}<p><strong>Um olhar sobre o seu mês</strong><br>${groups.length?`${esc(groups[0].category)} foi sua maior categoria de despesa: ${money(groups[0].value)}. `:'Ainda não há despesas registradas neste período. '}${variation===null?'Ainda não há base para comparação percentual.':`As despesas ${variation<=0?'diminuíram':'aumentaram'} ${Math.abs(variation)}% em relação ao mês anterior. `}Esta leitura descreve seus registros, sem presumir o motivo dos gastos.</p></div><p class="input-hint">Texto demonstrativo gerado a partir dos totais locais.</p>`:button(icon('sparkle')+' Entender meu mês','summary-ai');
  if(formError)insight=`<div class="notice error" role="alert">${esc(formError)} Seus números continuam disponíveis.</div>`+button('Tentar novamente','summary-ai','secondary full');
  return head('Então, para onde foi?','Um olhar mais claro sobre o seu mês.','')+monthControl()+`<section class="summary-hero"><p>Total de despesas</p><h3>${money(totals.expense)}</h3><small>${variation===null?'Sem base para comparação percentual':`${variation<=0?'↘':'↗'} ${Math.abs(variation)}% ${variation<=0?'a menos':'a mais'} que no mês anterior`}<br>Diferença: ${money(totals.expense-previous.expense)}</small></section>${section('Por categoria')}${groups.map(g=>`<div class="chart-row"><span>${esc(g.category)}</span><div class="progress"><span style="width:${g.value/totals.expense*100}%"></span></div><b>${money(g.value)}</b></div>`).join('')||'<p class="legend">Nenhuma despesa neste período.</p>'}<p class="legend">Valores confirmados · comparação entre meses completos ou parciais</p>${section('Além dos números')}${insight}`;
}
function render(){
  const authScreen=['login','cadastro'].includes(screen);
  nav.classList.toggle('auth-hidden',authScreen);
  const views={inicio:home,login:()=>auth(false),cadastro:()=>auth(true),novo:newEntry,revisao:()=>head(editing?'Ajuste os detalhes.':'Está tudo certinho?','Confira e confirme antes de registrar.',editing?'detalhes':'novo')+entryForm(!editing),historico:history,detalhes:details,orcamentos:budgets,recorrencias:recurring,resumo:summary};
  app.innerHTML=(!authScreen&&scenario==='offline'?'<div class="offline-banner">Sem conexão · os registros ficam pendentes nesta simulação.</div>':'')+(views[screen]||home)();
  nav.innerHTML=[['inicio','home','Início'],['historico','history','Histórico'],['orcamentos','budget','Orçamentos'],['resumo','chart','Resumo']].map(([to,i,label])=>goButton(icon(i)+label,to,screen===to?'active':'')).join('');
}
function modal(content){dialog.innerHTML=content;dialog.showModal();}
function closeModal(){dialog.close();dialog.innerHTML='';}
function confirmDialog(title,text,action){modal(`<h2>${title}</h2><p>${text}</p><div class="actions">${button('Confirmar',action)}${button('Cancelar','close','secondary')}</div>`);}
function configForm(kind,id){
  const isBudget=kind==='budget',item=(isBudget?data.budgets:data.recurring).find(x=>x.id===id);
  modal(`<h2>${item?'Editar':isBudget?'Criar':'Nova'} ${isBudget?'orçamento':'recorrência'}</h2><form id="config-form" data-kind="${kind}" data-id="${id||''}">${!isBudget?`<label class="field"><span>Descrição</span><input name="description" value="${esc(item?.description||'')}" required maxlength="80"></label>`:''}<label class="field"><span>Categoria</span><select name="category">${opts(categories.expense,item?.category||'Alimentação')}</select></label><label class="field"><span>${isBudget?'Limite mensal':'Valor'} (R$)</span><input name="amount" inputmode="decimal" placeholder="0,00" value="${item?amountInput(item.amount):''}" required></label>${!isBudget?`<label class="field"><span>Dia do mês</span><input name="day" type="number" min="1" max="31" step="1" value="${item?.day||10}" required></label>`:`<p>Período: ${month.split('-').reverse().join('/')}</p>`}<p class="error-text" id="config-error" role="alert"></p><div class="actions"><button class="primary" type="submit">Salvar</button>${item?button('Excluir','config-delete','secondary danger',`data-kind="${kind}" data-id="${id}"`):''}${button('Cancelar','close','secondary')}</div></form>`);
}
function interpret(){
  if(busy)return;
  if(mode==='text'&&!inputText.trim()){formError='Conte o que aconteceu ou escolha um exemplo.';render();return;}
  busy=true;formError='';const token=++operation;render();
  setTimeout(()=>{
    if(token!==operation)return;
    busy=false;
    if(['ai-error','offline'].includes(scenario)){formError=scenario==='offline'?'A interpretação precisa de conexão. Seu texto foi preservado.':'A IA está indisponível nesta simulação. Seu registro ainda não foi salvo.';render();return;}
    if(mode==='photo')draft={type:'expense',amount:4500,category:'Alimentação',date:'2026-09-24',description:'Compras no mercado',origin:'Foto'};
    else{
      const text=inputText.toLowerCase();
      const income=/recebi|sal[aá]rio|bolsa|ganhei/.test(text);
      draft={type:income?'income':'expense',amount:M.suggestAmount(text)||0,category:income?'Bolsa / salário':/ônibus|onibus|uber|transporte/.test(text)?'Transporte':/cinema|lazer/.test(text)?'Lazer':'Alimentação',date:/ontem/.test(text)?'2026-09-24':TODAY,description:/mercado/.test(text)?'Compras no mercado':/caf[eé]/.test(text)?'Café':income?'Recebimento de bolsa':inputText.slice(0,80),origin:'Texto'};
    }
    editing=false;navigate('revisao');
  },850);
}
document.addEventListener('click',event=>{
  const target=event.target.closest('button');if(!target)return;
  if(target.dataset.go){navigate(target.dataset.go);return;}
  const action=target.dataset.action,id=target.dataset.id;
  if(!action)return;
  if(action==='close'){closeModal();return;}
  if(action==='reset'){data=M.seed();scenario='normal';month='2026-09';session=true;inputText='';query='';filterType='';filterCategory='';document.getElementById('scenario').value='normal';navigate('inicio');toast('Demonstração restaurada.');}
  else if(action==='demo-register'){session=true;inputText='gastei 45 no mercado ontem';navigate('novo');}
  else if(action==='demo-login'){session=true;navigate('inicio');}
  else if(action==='profile')modal('<h2>Seu espaço.</h2><p>Alex é um perfil fictício para explorar o protótipo. Os dados serão restaurados ao sair.</p><div class="actions">'+button('Sair da demonstração','logout')+button('Continuar explorando','close','secondary')+'</div>');
  else if(action==='logout'){closeModal();data=M.seed();session=false;scenario='normal';document.getElementById('scenario').value='normal';navigate('login');}
  else if(action==='mode'||action==='manual-fallback'||action==='text-fallback'){operation++;busy=false;mode=action==='mode'?target.dataset.mode:action==='manual-fallback'?'manual':'text';formError='';draft=null;render();}
  else if(action==='example'){inputText=target.dataset.example;render();}
  else if(action==='capture'){photo=true;render();}
  else if(action==='retake'){photo=false;render();}
  else if(action==='interpret')interpret();
  else if(action==='detail'){selected=id;navigate('detalhes');}
  else if(action==='edit-entry'){draft={...data.transactions.find(t=>t.id===selected)};editing=true;navigate('revisao');}
  else if(action==='delete-entry')confirmDialog('Excluir este lançamento?','O valor será removido do histórico e dos totais do mês.','delete-entry-confirm');
  else if(action==='delete-entry-confirm'){data.transactions=data.transactions.filter(t=>t.id!==selected);closeModal();navigate('historico');toast('Lançamento excluído. Totais atualizados.');}
  else if(action==='clear-filters'){query='';filterType='';filterCategory='';render();}
  else if(action==='retry-list'){scenario='normal';document.getElementById('scenario').value='normal';render();}
  else if(action==='budget-new')configForm('budget');
  else if(action==='budget-edit')configForm('budget',id);
  else if(action==='recurring-new')configForm('recurring');
  else if(action==='recurring-edit')configForm('recurring',id);
  else if(action==='config-delete'){
    const kind=target.dataset.kind;closeModal();
    modal(`<h2>Excluir ${kind==='budget'?'orçamento':'recorrência'}?</h2><p>Os lançamentos já confirmados serão preservados.</p><div class="actions">${button('Confirmar exclusão','config-delete-confirm','primary',`data-kind="${kind}" data-id="${id}"`)}${button('Cancelar','close','secondary')}</div>`);
  }
  else if(action==='config-delete-confirm'){const key=target.dataset.kind==='budget'?'budgets':'recurring';data[key]=data[key].filter(x=>x.id!==id);closeModal();render();toast('Excluído. Lançamentos preservados.');}
  else if(action==='recurring-confirm'){
    const r=data.recurring.find(r=>r.id===id);
    const day=Math.min(r.day,new Date(Number(month.slice(0,4)),Number(month.slice(5)),0).getDate());
    if(`${month}-${String(day).padStart(2,'0')}`>TODAY){toast('Este gasto ainda está previsto para uma data futura.');return;}
    modal(`<h2>Confirmar este gasto?</h2><p>${esc(r.description)} · ${money(r.amount)}<br>Competência: ${month.split('-').reverse().join('/')}<br>Categoria: ${esc(r.category)}</p><div class="actions">${button('Confirmar gasto','recurring-confirm-final','primary',`data-id="${id}"`)}${button('Cancelar','close','secondary')}</div>`);
  }
  else if(action==='recurring-confirm-final'){const r=data.recurring.find(r=>r.id===id);const result=M.confirmRecurring(data,r,month);closeModal();render();toast(result?'Gasto confirmado e incluído no mês.':'Este gasto já foi confirmado.');}
  else if(action==='summary-ai'){
    if(busy)return;busy=true;formError='';const token=++operation;render();
    setTimeout(()=>{if(token!==operation)return;busy=false;if(['ai-error','offline'].includes(scenario))formError='Não foi possível gerar a interpretação.';else summaryReady=true;render();},850);
  }
});
document.addEventListener('input',event=>{
  if(event.target.id==='free-text')inputText=event.target.value;
  if(event.target.id==='search'){query=event.target.value;document.getElementById('history-results').innerHTML=historyResults();}
});
document.addEventListener('change',event=>{
  const {id,value}=event.target;
  if(id==='month'){month=value;summaryReady=false;formError='';operation++;busy=false;render();}
  else if(id==='entry-type')document.getElementById('entry-category').innerHTML=opts(categories[value],categories[value][0]);
  else if(id==='filter-type'||id==='filter-category'){if(id==='filter-type')filterType=value;else filterCategory=value;document.getElementById('history-results').innerHTML=historyResults();}
  else if(id==='scenario'){
    if(scenario==='empty'||value==='empty')data=M.seed();
    scenario=value;
    if(value==='empty'){data.transactions=[];data.budgets=[];data.recurring=[];data.occurrences=[];}
    session=true;summaryReady=false;formError='';
    if(value==='camera-denied'){navigate('novo');mode='photo';render();}
    else if(value==='ai-error'){inputText='gastei 45 no mercado ontem';navigate('novo');}
    else navigate(value==='list-error'?'historico':'inicio');
    toast('Cenário demonstrativo atualizado.');
  }
});
document.addEventListener('submit',event=>{
  event.preventDefault();const form=event.target,values=Object.fromEntries(new FormData(form));
  if(form.id==='auth-form'){
    if(screen==='cadastro'&&values.password!==values.confirmation){document.getElementById('auth-error').textContent='As senhas precisam ser iguais.';return;}
    session=true;navigate('inicio');toast('Você entrou na demonstração.');
  }
  else if(form.id==='entry-form'){
    const amount=M.parseMoney(values.amount),validDate=/^\d{4}-\d{2}-\d{2}$/.test(values.date)&&values.date<=TODAY;
    const error=!amount?'Informe um valor positivo, com até duas casas decimais.':!validDate?'Escolha uma data válida até 25/09/2026.':!values.description.trim()?'Descreva o lançamento.':!categories[values.type]?.includes(values.category)?'Selecione uma categoria compatível.':'';
    if(error){document.getElementById('entry-error').textContent=error;return;}
    const item={id:editing?selected:`t${Date.now()}`,type:values.type,amount,category:values.category,date:values.date,description:values.description.trim(),origin:draft?.origin||'Manual'};
    if(editing)data.transactions=data.transactions.map(t=>t.id===selected?item:t);else data.transactions.push(item);
    month=values.date.slice(0,7);query='';filterType='';filterCategory='';draft=null;editing=false;navigate('historico');toast(scenario==='offline'?'Salvo na demonstração · sincronização pendente.':'Lançamento salvo. Seu mês está atualizado.');
  }
  else if(form.id==='config-form'){
    const kind=form.dataset.kind,id=form.dataset.id,amount=M.parseMoney(values.amount),day=Number(values.day);
    let error=!amount?'Informe um valor positivo, com até duas casas decimais.':'';
    if(kind==='budget'&&data.budgets.some(b=>b.id!==id&&b.month===month&&b.category===values.category))error='Esta categoria já tem um orçamento neste mês.';
    if(kind==='recurring'&&(!values.description.trim()||!Number.isInteger(day)||day<1||day>31))error='Informe a descrição e um dia entre 1 e 31.';
    if(error){document.getElementById('config-error').textContent=error;return;}
    const item={id:id||`${kind}${Date.now()}`,amount,category:values.category,...(kind==='budget'?{month}:{description:values.description.trim(),day})};
    const key=kind==='budget'?'budgets':'recurring';
    if(id)data[key]=data[key].map(x=>x.id===id?item:x);else data[key].push(item);
    closeModal();render();toast('Pronto! Alteração salva na demonstração.');
  }
});
document.querySelector('.brand').addEventListener('click',event=>{event.preventDefault();navigate('inicio');});
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeModal();}});
render();
