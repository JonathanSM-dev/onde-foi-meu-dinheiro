# Decisões de arquitetura

**Versão:** 1.0 · **Data:** 27/09/2026 · **Projeto:** Onde Foi Meu Dinheiro.

**Situação:** decisões adotadas como base para implementação, após autorização do refinamento. A escolha não significa que a integração já foi implementada ou testada em dispositivo. A primeira entrega permanece um protótipo HTML com serviços simulados.

## Visão da solução

| Responsabilidade | Escolha | Motivo |
|---|---|---|
| Aplicativo final | React Native com Expo e TypeScript | Atender ao enunciado e explicitar tipos dos dados financeiros. |
| Navegação | Expo Router | Grupos públicos/privados, abas e telas de operação. |
| Banco local | SQLite por `expo-sqlite` | Consultas e transações persistentes entre reinícios. |
| Identidade e sessão | Firebase Authentication, e-mail/senha, SDK JavaScript; persistência React Native com AsyncStorage | Compatibilidade com Expo Go e restauração sem armazenar a senha. |
| Banco remoto | Cloud Firestore pelo SDK JavaScript | Documentos por usuário e regras de acesso. |
| Câmera | `expo-camera` | Fotografar cupons no fluxo de registro. |
| Intermediário de IA | Cloud Functions for Firebase, callable, Node.js | Autenticação e chave secreta no servidor. |
| Serviço externo | Gemini API multimodal | Interpretar texto/foto e resumir agregados. |

Versões exatas serão fixadas em lockfile ao iniciar o app Expo. O modelo será configurado no servidor em `GEMINI_MODEL`: variante multimodal estável da família Flash disponível na integração. Essa configuração permite substituir modelos retirados do catálogo sem mudar o contrato do aplicativo.

## ADR-01 · Documentos por usuário e dinheiro em centavos

**Situação:** adotada em 27/09/2026.

**Problema:** consultar gastos por período, manter orçamento consistente e impedir acesso cruzado.

**Alternativas:** documento único com listas simplifica leitura, mas concentra alterações e crescimento; banco relacional remoto oferece restrições fortes, mas adiciona outra plataforma; documentos separados no Firestore mantêm proximidade com a infraestrutura sugerida na disciplina.

**Decisão:** documentos em `usuarios/{uid}/categorias`, `lancamentos`, `orcamentos` e `recorrencias`. SQLite mantém tabelas equivalentes, com o mesmo ID e `usuarioId`. Dinheiro é inteiro positivo em centavos; tipo define receita/despesa. Datas financeiras são datas civis, separadas de instantes técnicos. O [modelo detalhado](MODELAGEM-DADOS.md) inclui diagrama, invariantes e exemplo JSON.

Orçamento tem ID único por categoria/mês; ocorrência recorrente, por modelo/mês. Exclusão lógica preserva a identidade e não entra nos totais. Categorias iniciais são copiadas por usuário, sem edição de categorias no escopo inicial.

**Consequências assumidas:** referências exigem validação, pois Firestore não fornece chaves estrangeiras relacionais. Totais serão calculados pelos lançamentos ativos, sem campo de saldo editável ou paralelo. A modelagem facilita CRUD individual, mas exige índices e regras compatíveis com as consultas.

**Verificação na implementação:** B não lê nem altera dados de A; R$ 0,10 + R$ 0,20 produz 30 centavos; orçamento duplicado é impedido; alteração/exclusão atualiza totais; categoria pertence ao usuário e ao tipo correto.

## ADR-02 · SQLite para a interface e Firestore para réplica

**Situação:** adotada em 27/09/2026.

**Problema:** a etapa 2 exige persistência local; a final exige também remota. O registro manual deve funcionar sem rede.

**Alternativas:** somente Firestore não explicita o banco local; somente AsyncStorage exigiria reescrever listas e controlar consultas manualmente; SQLite com fila permite gravar dado e operação pendente na mesma transação.

**Decisão:** repositório local SQLite serve as telas. `operacoes_pendentes` registra ID da operação, entidade, ID do documento, ação, conteúdo e estado. Sincronizador envia em ordem por entidade, quando rede e sessão forem válidas. Reutiliza IDs remotos nas tentativas, evitando duplicação por reenvio. Primeiro login baixa dados do usuário; retomadas consultam mudanças por instante do servidor e ID como desempate, com sobreposição para evitar perda em empates. Alterações locais pendentes permanecem sobrepostas à réplica até confirmação.

**Conflitos:** prevalece a última gravação aceita pelo servidor, sem mesclar campos; relógio do celular não decide prioridade. Uma edição antiga enviada depois pode sobrescrever outra. Edição colaborativa e fusão automática ficam fora do escopo.

**Exclusão:** replicar `excluidoEm`; manter marcadores durante o semestre, sem limpeza automática que possa ressuscitar dados em outro dispositivo. Retenção de uma versão de produção exigirá política específica.

**Sessão:** Firebase Auth por SDK JavaScript, usando persistência apropriada para React Native com AsyncStorage. Senha não será armazenada. Logout com fila pendente permite cancelar; saída confirmada limpa dados e fila locais do usuário. React Native Firebase nativo foi descartado por incompatibilidade com Expo Go.

**Consequências assumidas:** fila e reconciliação são trabalho adicional; a mesma base local atende às etapas 2 e 3. AsyncStorage é usado para a persistência do SDK de autenticação, não como banco financeiro. Autorização remota continua obrigatória.

**Verificação:** criar offline, reiniciar e reenviar não duplica; exclusão offline permanece excluída; troca de usuário não exibe cache anterior; falha mantém pendência visível sem alegar sucesso remoto.

## ADR-03 · Gemini por função autenticada e confirmação humana

**Situação:** adotada em 27/09/2026.

**Problema:** interpretação pode falhar e a chave do provedor não pode ser distribuída no app.

**Alternativas:** regras locais não cobrem a variedade de cupons; chamada direta com chave secreta expõe credencial; servidor próprio aumenta manutenção; callable aproveita a identidade Firebase e reduz componentes operacionais.

**Decisão:** Cloud Functions for Firebase com Node.js, operações `interpretarLancamento` e `resumirMes`. Exigir `request.auth`; validar campos; chamar Gemini com segredo em Secret Manager. Tokens recebidos são validados pelo mecanismo callable, mas o handler deve rejeitar chamadas sem autenticação. Não versionar segredo nem incluí-lo no bundle.

**Contrato:** texto de até 500 caracteres ou JPEG/PNG comprimido de até 1 MB; data de referência e categorias permitidas. Saída: `tipo`, `valorCentavos`, `categoriaId`, `data`, `descricao`, `camposPendentes`. Campo incerto pode ser nulo; valor ausente não é inventado. Validar resposta antes de exibir. Foto transitória, sem galeria ou armazenamento permanente.

**Consumo planejado:** 20 pedidos por usuário/dia com contador atômico no servidor; prazo de 20 segundos por chamada ao provedor; uma tentativa por vez e repetição manual. São limites do produto, não cotas comerciais garantidas. Resumo recebe agregados; a LLM não calcula saldo nem grava dados.

**Fluxo:** sugestão → cartão compacto → confirmação. Editar detalhes abre o formulário. Campo necessário ausente abre edição e bloqueia salvar. Falha preserva entrada e oferece modo manual. Conteúdo de cupom é dado, nunca instrução para executar ações.

**Custo:** implantação de Cloud Functions exige plano Blaze. A decisão não autoriza ativar faturamento; isso será confirmado antes de provisionar. Até lá, integração pode ser testada com emulador e respostas controladas. Alertas de orçamento não bloqueiam gastos; limites da função e revisão de cotas continuam necessários. Retenção e preços do Gemini serão revistos antes de usar dados reais. Nenhum serviço ou cobrança foi ativado nesta entrega.

**Verificação:** sem sessão, resposta inválida, timeout e foto ilegível não criam registros; limite diário impede nova chamada; segredo não chega ao cliente; confirmar cria um lançamento.

## ADR-04 · Expo Router e navegação por tarefas

**Situação:** adotada em 27/09/2026.

**Problema:** acesso rápido às tarefas frequentes e separação das telas públicas.

**Alternativas:** menu lateral esconde tarefas; tela única com muitos modais reduz previsibilidade; React Navigation diretamente é viável, mas exige organizar manualmente a estrutura que Expo Router oferece.

**Decisão:** Expo Router, grupos `(publico)` e `(privado)`, abas Início, Histórico, Orçamentos e Resumo. Novo lançamento, Revisão, Detalhes e Recorrências são telas de operação. Revisão oculta abas e oferece Voltar/Cancelar. Login e-mail/senha; login social fora do escopo.

Restaurar sessão antes de resolver rotas; bloquear links privados sem sessão e limpar pilha ao sair. Rascunhos são separados dos dados confirmados. Proteção visual não substitui regras do Firestore ou autorização das funções.

**Consequências assumidas:** navegação previsível, dependência das convenções do Router e cuidado adicional com retorno/cancelamento. Confirmação sem correções exige um toque, sem preencher campos novamente.

**Verificação:** link privado abre login sem sessão; sair e voltar não reabre dados; cancelar revisão mantém totais; editar detalhes preserva a sugestão até confirmar.

## Fontes e alcance da verificação

Consulta documental em 27/09/2026; integração real ainda não executada.

- [Expo: Firebase JS SDK e Expo Go](https://docs.expo.dev/guides/using-firebase/).
- [Expo: SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/).
- [Expo Router](https://docs.expo.dev/router/introduction/).
- [Firebase: funções callable](https://firebase.google.com/docs/functions/callable).
- [Firebase: implantação e plano Blaze](https://firebase.google.com/docs/functions/get-started).
- [Firebase: configuração e segredos](https://firebase.google.com/docs/functions/config-env).
- [Gemini: proteção da chave](https://ai.google.dev/gemini-api/docs/api-key).

## API externa: interpretação acadêmica

Gemini API é a integração externa escolhida, útil no registro. O enunciado não declara que API externa e LLM devem ser serviços diferentes. O projeto adota a mesma integração para ambos, sem afirmar homologação pelo professor.

Pergunta a confirmar: **“A chamada à Gemini API, com carregamento e tratamento de falhas no registro por texto/foto, atende também ao requisito de API externa?”** Se não, revisar a decisão; não adicionar serviço sem utilidade apenas para contagem.
