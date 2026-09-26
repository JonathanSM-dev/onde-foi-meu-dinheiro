# PRD · Onde Foi Meu Dinheiro

**Versão:** 0.2 · **Data:** 25/09/2026 · **Situação:** base autorizada para prototipação; validação técnica e acadêmica final pendente.

**Equipe:** Cecília Scharnovski, Hellen Caroline, Jonathan Silva Machado e Nicolas da Gama.

## 1. Contexto e origem dos requisitos

Este documento define o produto pretendido para o semestre e distingue o que será apenas representado na primeira entrega do que deverá ser implementado nas etapas seguintes.

Fontes: **Trabalho React Native 2026_2.pdf**, p. 1–4, e **temas.pdf**, p. 7, tema 9. O enunciado estabelece os requisitos acadêmicos. O documento de temas descreve a proposta de finanças pessoais. As regras detalhadas deste PRD são decisões propostas para tornar essa ideia implementável e verificável.

O tema foi escolhido pela equipe. A confirmação de sua reserva e exclusividade junto à turma permanece como verificação administrativa da entrega.

## 2. Problema

Registrar pequenos gastos exige esforço repetido. Quando o usuário precisa preencher vários campos a cada compra, pode abandonar o registro, deixando o histórico incompleto e dificultando a compreensão dos próprios hábitos.

O problema central é reduzir o trabalho de registrar movimentações sem retirar do usuário o controle sobre os dados. A proposta não pressupõe acesso automático a contas bancárias.

## 3. Público e necessidades

**Público principal:** universitários e jovens adultos que começam a organizar as próprias finanças, recebem renda, bolsa ou auxílio e precisam acompanhar despesas cotidianas.

**Necessidades:** registrar rapidamente; corrigir informações com facilidade; encontrar gastos anteriores; acompanhar limites por categoria; comparar meses.

**Cenário ilustrativo, ainda não validado por pesquisa:** uma estudante recebe uma bolsa mensal, faz pequenas compras de alimentação e transporte e costuma registrar os valores em notas soltas. Ao final do mês, encontra dificuldade para identificar quanto gastou em cada categoria.

Não foram realizadas entrevistas ou testes com usuários até esta versão. O público e o cenário partem do tema fornecido e constituem hipóteses a validar.

## 4. Proposta de valor e objetivos

**Proposta de valor:** transformar texto cotidiano ou foto de cupom em um lançamento revisável, e usar os registros confirmados para mostrar o destino do dinheiro.

Objetivos do produto:

1. Reduzir o preenchimento manual de despesas e receitas.
2. Tornar explícitos os dados inferidos pela IA antes de salvá-los.
3. Acompanhar gastos mensais por categoria com cálculos verificáveis.
4. Preservar a possibilidade de registro manual em situações de falha.
5. Oferecer uma visão mensal compreensível, com histórico consultável.

Indicadores propostos para validação futura, sem resultados medidos nesta versão:

- Pelo menos 4 de 5 participantes de um teste exploratório concluem um lançamento por texto sem ajuda do moderador.
- Tempo mediano de até 30 segundos entre iniciar uma entrada por texto e confirmar um lançamento simples em conexão adequada.
- Todos os cenários de IA passam pela revisão; nenhum resultado é salvo automaticamente.
- Totais apresentados correspondem exatamente aos lançamentos confirmados nos cenários de teste.

## 5. Escopo e etapas

### Primeira entrega · 28/09

PRD, decisões de arquitetura, documentação do projeto no GitHub, protótipo navegável das telas principais e diário de uso de IA. O protótipo empregará dados fictícios identificados e simulará autenticação, câmera, IA e persistência. Não será apresentado como aplicativo funcional.

### Segunda entrega · 30/10

Implementação das telas em React Native com Expo, navegação com parâmetros, persistência local e estados de carregamento, vazio e erro. O README deverá permitir iniciar o aplicativo a partir de um clone limpo. As integrações finais não são condição de conclusão desta etapa, conforme o enunciado.

### Terceira entrega · 30/11

Autenticação real com sessão persistente, proteção de telas e dados, persistência remota, consumo de API externa, câmera, IA integrada, tratamento de falhas e tutorial de uso. Execução em dispositivo real pelo Expo Go.

### Fora do escopo do semestre

- Open Finance, conexão bancária e leitura automática de extratos.
- Transferências, pagamentos, cobrança ou movimentação de dinheiro real.
- Investimentos, recomendação de ativos e orientação financeira personalizada.
- Contas compartilhadas, permissões de família e divisão de despesas entre pessoas.
- Cartões, faturas, juros, parcelamento e conciliação contábil.
- Múltiplas moedas e conversão cambial.
- Chatbot genérico, previsão de renda e diagnóstico financeiro.
- Garantia de interpretação correta de qualquer documento ou cupom.

## 6. Requisitos funcionais

Todos os requisitos abaixo descrevem o produto final. Na etapa 1, serão documentados e representados nos fluxos pertinentes; isso não significa implementação.

| ID | Requisito | Critério de aceitação |
|---|---|---|
| RF-01 | Cadastrar usuário com nome, e-mail e senha. | Dados inválidos impedem o envio; sucesso permite acessar a área autenticada; falha mantém os dados não sensíveis para correção. |
| RF-02 | Autenticar, restaurar sessão e encerrar sessão. | Sessão válida é restaurada ao reabrir; sair bloqueia telas privadas; falha na restauração não libera acesso indevido. |
| RF-03 | Cadastrar receita ou despesa manualmente. | Tipo, valor positivo, categoria, data e descrição válidos geram um lançamento e atualizam os totais. |
| RF-04 | Interpretar lançamento por texto livre usando LLM. | Uma frase produz campos sugeridos para revisão; ausência ou ambiguidade de dado necessário é exibida para correção. |
| RF-05 | Fotografar cupom e solicitar interpretação pela LLM. | Usuário pode capturar, revisar ou refazer a foto; permissão negada oferece texto ou formulário manual. |
| RF-06 | Revisar toda sugestão da IA antes de salvar. | Todos os campos podem ser corrigidos; cancelar não cria lançamento; confirmação exige validação e bloqueia envios duplicados. |
| RF-07 | Consultar histórico com busca e filtros. | Busca por descrição e filtros por período, categoria e tipo podem ser combinados e removidos; resultado vazio é explicado. |
| RF-08 | Consultar detalhes, editar e excluir lançamento. | Alteração persiste e recalcula as visões; exclusão exige confirmação; cancelar a exclusão preserva o registro. |
| RF-09 | Criar, consultar, alterar e excluir orçamento mensal por categoria de despesa. | Um limite positivo por categoria e mês exibe gasto confirmado, limite e diferença; ultrapassagem permanece visível. |
| RF-10 | Criar, consultar, alterar e excluir modelos de despesas recorrentes mensais. | Modelo guarda valor, categoria, descrição e dia; ocorrência prevista pode ser confirmada uma única vez por mês. |
| RF-11 | Exibir resumo mensal e comparação com o mês anterior. | Receitas, despesas e saldo do período derivam dos lançamentos; mês anterior sem base não produz percentual inválido. |
| RF-12 | Gerar interpretação textual do resumo usando LLM. | Texto usa somente agregados fornecidos, identifica o período e não inventa causas; se falhar, os totais e gráficos continuam disponíveis. |
| RF-13 | Armazenar lançamentos localmente e sincronizar alterações com armazenamento remoto. | Criação, edição e exclusão sobrevivem ao reinício; pendências ficam identificadas; retomada de conexão não duplica operações. |
| RF-14 | Consumir API externa no fluxo de IA. | Solicitação apresenta carregamento, permite recuperar-se de falha e valida a resposta antes de mostrá-la como sugestão. |
| RF-15 | Restringir dados ao usuário proprietário. | Um usuário não consegue consultar nem alterar dados de outro, inclusive por requisição direta ao serviço. |
| RF-16 | Disponibilizar categorias iniciais de receita e despesa. | Formulários mostram apenas categorias compatíveis com o tipo; trocar o tipo exige selecionar uma categoria válida. |

**API externa:** a proposta utiliza a API do provedor de LLM para RF-04, RF-05 e RF-12. O enunciado exige API externa e IA, mas não explicita que sejam dois serviços distintos. Essa interpretação deve ser confirmada com o professor antes de fechar a arquitetura; nenhuma integração adicional foi tratada como exigência confirmada.

## 7. Regras de negócio

| ID | Regra |
|---|---|
| RN-01 | Uma movimentação pertence a um único usuário. Categorias iniciais são disponibilizadas separadamente no espaço de cada usuário. |
| RN-02 | A moeda é BRL. Valores são armazenados como inteiros positivos em centavos; o tipo define receita ou despesa. Zero, negativos e valores com mais de duas casas decimais são rejeitados. |
| RN-03 | A data financeira é uma data civil no formato AAAA-MM-DD. Instantes técnicos de criação e atualização são registrados separadamente. |
| RN-04 | Entradas por texto recebem como contexto a data local do pedido. “Ontem” é interpretado em relação a ela; a data resultante aparece na revisão. |
| RN-05 | Lançamentos representam movimentações realizadas. Datas futuras são rejeitadas; despesas futuras são representadas por modelos de recorrência. |
| RN-06 | Saldo do período = receitas confirmadas menos despesas confirmadas no período. Não é saldo bancário nem inclui um saldo inicial de conta. |
| RN-07 | Orçamento considera somente despesas confirmadas da categoria no mês selecionado. Receitas não aumentam o limite automaticamente. |
| RN-08 | Existe no máximo um orçamento por usuário, categoria e mês. Excluir o orçamento preserva as despesas da categoria. |
| RN-09 | Recorrência é um modelo mensal; não reduz saldo nem orçamento antes da confirmação da ocorrência. Dias inexistentes no mês usam seu último dia. |
| RN-10 | Uma ocorrência tem chave formada pelo identificador da recorrência e pelo mês. Nova tentativa usa a mesma chave. Excluir um lançamento recorrente não gera outro automaticamente. |
| RN-11 | Alterar ou excluir recorrência afeta previsões futuras, preservando lançamentos já confirmados. |
| RN-12 | A IA nunca grava lançamentos diretamente. Campos ausentes ou inválidos exigem correção; não se presume valor monetário faltante. |
| RN-13 | Os cálculos financeiros são executados por código determinístico. A LLM extrai campos e redige interpretações, sem substituir a fonte dos totais. |
| RN-14 | Comparação percentual usa o valor do mês anterior como base. Se a base for zero, apresentar “sem base para comparação percentual” e a diferença em reais. |
| RN-15 | Não se atribuem causas pessoais aos gastos sem dados que as sustentem. O resumo pode apontar variações por categoria, mas não afirmar relações com provas, saúde ou hábitos não registrados. |
| RN-16 | Sem rede, lançamentos manuais continuam disponíveis para uma sessão previamente válida. Serviços remotos exigem autenticação válida ao sincronizar. Dados locais são separados por usuário e removidos ao sair. |
| RN-17 | Se houver alterações não sincronizadas, sair exige aviso explícito de possível perda e permite cancelar para sincronizar depois. |

## 8. Requisitos não funcionais

- **RNF-01 · Plataforma:** React Native com Expo; compatibilidade com Expo Go validada em dispositivo real antes de cada entrega com código.
- **RNF-02 · Segurança:** credenciais secretas do provedor de IA ficam em ambiente de servidor, fora do aplicativo e do repositório. Arquivos de exemplo contêm apenas nomes de variáveis e valores fictícios.
- **RNF-03 · Privacidade:** enviar à IA apenas a entrada necessária ou os agregados do período. Informar que texto ou imagem será processado por serviço externo. Fotos não serão mantidas como anexos permanentes no escopo inicial; retenção pelo provedor deve ser verificada e documentada.
- **RNF-04 · Resiliência:** falhas de rede, serviço indisponível e resposta inválida preservam a entrada do usuário e oferecem nova tentativa ou registro manual.
- **RNF-05 · Acessibilidade:** controles identificáveis, texto legível, contraste adequado e indicadores que não dependam somente de cor. Alvos de toque serão verificados no protótipo e no dispositivo.
- **RNF-06 · Consistência:** listagens apresentam carregamento, vazio e erro; ações de salvamento evitam repetição acidental; totais usam a mesma base de lançamentos em todas as telas.
- **RNF-07 · Reprodutibilidade:** versões, configuração e comandos documentados no README quando houver código; clone limpo deve ser suficiente para seguir as instruções.
- **RNF-08 · Desempenho percebido:** ações locais oferecem retorno imediato; operações remotas mostram progresso. Metas quantitativas de latência dependem de medição futura e não foram comprovadas.

## 9. Mapa de telas

Navegação proposta: abas **Início**, **Histórico**, **Orçamentos** e **Resumo**. Início oferece ação destacada **Registrar** e acesso a **Recorrências**. Detalhes e revisão são telas de fluxo, com retorno ao contexto de origem.

| ID | Tela | Conteúdo e ações | Requisitos |
|---|---|---|---|
| T01 | Login | E-mail, senha, entrar e acesso ao cadastro | RF-02 |
| T02 | Cadastro | Nome, e-mail, senha, confirmação da senha e criar conta | RF-01 |
| T03 | Início | Mês, receitas, despesas, saldo do período, orçamento e registrar | RF-11 |
| T04 | Novo lançamento | Alternativas texto, foto e manual; formulário de entrada | RF-03–05, RF-16 |
| T05 | Revisão | Tipo, valor, categoria, data e descrição editáveis; confirmar ou cancelar | RF-06 |
| T06 | Histórico | Lista, busca, filtros e estados de carregamento, vazio e erro | RF-07 |
| T07 | Detalhes | Dados do lançamento, editar, salvar alteração e excluir | RF-08 |
| T08 | Orçamentos | Lista por mês, progresso e formulário de criação/edição | RF-09 |
| T09 | Recorrências | Modelos, criação/edição, exclusão e confirmação do mês | RF-10 |
| T10 | Resumo mensal | Totais, comparação e interpretação opcional por IA | RF-11–12 |

São oito telas além de login e cadastro, superando o mínimo de cinco. Formulários auxiliares podem ser modais ou estados das telas indicadas sem inflar a contagem.

## 10. Fluxos e erros

### Fluxo principal · registrar por texto

1. Usuário entra e acessa Início.
2. Escolhe Registrar e digita “gastei 45 no mercado ontem”.
3. App informa o processamento e solicita a interpretação.
4. Revisão mostra despesa de R$ 45,00, categoria sugerida, data resolvida e descrição.
5. Usuário corrige os campos se necessário e confirma.
6. App salva uma única movimentação e informa se há sincronização pendente.
7. Histórico, saldo e orçamento refletem o lançamento confirmado.

### Fluxos complementares

- **Foto:** registrar → foto → permissão → captura → revisar imagem → processar → revisar campos → confirmar.
- **Manual:** registrar → manual → preencher campos → salvar após validação.
- **Editar:** histórico → detalhes → editar → salvar → atualizar visões.
- **Excluir:** detalhes → excluir → confirmar → remover das visões.
- **Orçamento:** orçamentos → selecionar mês → definir categoria e limite → acompanhar despesas.
- **Recorrência:** recorrências → cadastrar modelo → selecionar ocorrência → revisar e confirmar lançamento.

### Estados que precisam aparecer no protótipo

| Situação | Resposta projetada |
|---|---|
| Primeiro acesso sem dados | Explicar a tela e oferecer o primeiro registro. |
| Processamento de IA | Mostrar progresso e impedir novo envio idêntico enquanto o pedido está ativo. |
| Resposta inválida ou serviço indisponível | Preservar texto/foto e oferecer tentar novamente ou preencher manualmente. |
| Câmera sem permissão | Explicar a impossibilidade de capturar e oferecer texto/manual. |
| Campo obrigatório ausente | Identificar o campo e impedir confirmação até correção. |
| Sem conexão | Manter registro manual e sinalizar pendências de sincronização. |
| Orçamento excedido | Mostrar valor excedente com texto e indicador visual. |
| Exclusão solicitada | Pedir confirmação; cancelar mantém o dado. |

## 11. Dados e limites da IA

Entidades propostas: usuário, categoria, lançamento, orçamento mensal e recorrência. O modelo e suas alternativas estão em [Decisões de arquitetura](DECISOES-ARQUITETURA.md).

Os dados fictícios do protótipo deverão usar uma mesma base para demonstrar o efeito de salvar, editar e excluir. Uma movimentação sugerida pela IA não integra totais antes da confirmação.

O resumo envia somente totais e variações necessários. Conteúdo de texto ou cupom é entrada a interpretar, nunca autorização para executar instruções, alterar regras ou acessar dados de outros usuários. A resposta é validada contra campos permitidos.

## 12. Rastreabilidade acadêmica

| Exigência do enunciado | Atendimento planejado |
|---|---|
| Expo e dispositivo real com Expo Go | RNF-01; execução nas etapas 2 e 3 |
| Cinco telas além de login/cadastro | T03–T10 |
| Autenticação, sessão e telas privadas | RF-01, RF-02 e RF-15 |
| Persistência local/remota e CRUD na interface | RF-03, RF-07–10 e RF-13 |
| API externa com carregamento e erro | RF-14; interpretação do requisito a confirmar |
| Recurso nativo e permissão negada | RF-05; câmera |
| IA útil no fluxo | RF-04–06 e RF-12 |
| Nenhuma chave de API versionada | RNF-02 |
| PRD e escopo | Este documento |
| Três decisões, incluindo modelagem | ADR-01 a ADR-04 |
| Protótipo com fluxo principal navegável | T03 → T04 → T05 → T06; disponível no HTML local, com simulações identificadas |
| Diário de uso de IA | DIARIO-DE-BORDO.md |

## 13. Riscos e decisões pendentes

| Ponto | Encaminhamento |
|---|---|
| Tema já reservado por outro grupo | Confirmar reserva com o professor. |
| API de LLM ser aceita também como API externa | Confirmar interpretação do enunciado; se necessário, rever o escopo antes de adicionar outro serviço. |
| Provedor e hospedagem do intermediário de IA | Verificar documentação atual, compatibilidade, custo e disponibilidade antes de implementar. |
| Falhas de extração | Revisão obrigatória, validação e alternativa manual. |
| Complexidade da sincronização | IDs estáveis, operações idempotentes, pendências visíveis e política de conflito documentada. |
| Escopo para quatro integrantes | Dividir frentes e revisar conjuntamente; nomes dos responsáveis ainda não atribuídos. |
| Ausência de pesquisa com usuários | Validar o fluxo em teste exploratório, sem apresentar hipóteses como evidências. |

## 14. Critério de conclusão da primeira entrega

A etapa estará pronta quando todos os itens obrigatórios do [checklist](ENTREGA-01.md) estiverem concluídos e conferidos. A existência deste PRD, por si só, não conclui a primeira entrega.
