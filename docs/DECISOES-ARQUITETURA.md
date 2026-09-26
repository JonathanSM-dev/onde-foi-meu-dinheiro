# Decisões de arquitetura · Onde Foi Meu Dinheiro

**Versão:** 0.1 · **Data:** 25/09/2026.

Os registros abaixo são propostas para revisão da equipe, ainda não decisões aprovadas ou implementadas. Cada um identifica contexto, alternativas e consequências. A especificação de versões e serviços depende de verificação técnica posterior.

## ADR-01 · Modelar dados por usuário e registrar dinheiro em centavos

**Situação:** proposta.

**Contexto:** lançamentos, orçamentos e recorrências precisam ser privados, consultáveis por mês e consistentes entre armazenamento local e remoto.

**Alternativas consideradas:**

1. Um documento único por usuário com listas embutidas: leitura inicial simples, mas alterações concorrentes e crescimento ficam difíceis de controlar.
2. Banco relacional com tabelas e chaves estrangeiras: restrições e consultas expressivas; exige escolher e operar uma solução diferente da sugestão principal da disciplina.
3. Documentos separados por entidade e usuário: facilita CRUD individual e isolamento; integridade entre referências precisa ser validada pelo aplicativo e serviço.

**Escolha proposta:** alternativa 3. Estrutura conceitual compatível com coleções por usuário, sem impedir implementação equivalente em outra tecnologia. Categorias iniciais serão copiadas para cada usuário, sem CRUD de categorias personalizadas neste escopo.

| Entidade | Campos principais | Restrições |
|---|---|---|
| Usuário | id, nome, e-mail, criadoEm | Senha pertence ao provedor de autenticação, nunca a esta entidade. |
| Categoria | id, usuarioId, nome, tipo | Tipo receita ou despesa; referência deve pertencer ao mesmo usuário. |
| Lançamento | id, usuarioId, tipo, valorCentavos, categoriaId, data, descricao, origem, recorrenciaId opcional, competenciaRecorrencia opcional, criadoEm, atualizadoEm, excluidoEm opcional | Valor inteiro positivo; origem manual, texto, foto ou recorrencia; data civil; exclusão lógica enquanto houver sincronização pendente. |
| Orçamento | id, usuarioId, categoriaId, mes, limiteCentavos, criadoEm, atualizadoEm, excluidoEm opcional | Mês AAAA-MM; categoria de despesa; identidade estável por categoria e mês. |
| Recorrência | id, usuarioId, categoriaId, descricao, valorCentavos, diaDoMes, mesInicial, ativa, criadoEm, atualizadoEm, excluidoEm opcional | Somente despesa mensal; dia de 1 a 31; confirmação gera lançamento, sem débito automático. |

Organização remota conceitual: `usuarios/{usuarioId}/lancamentos/{id}`, com coleções equivalentes para categorias, orçamentos e recorrências. O identificador do proprietário vem da sessão validada, nunca apenas de um campo enviado pelo cliente.

Orçamento usa identidade derivada de categoria e mês dentro do usuário. Ocorrência recorrente usa identidade derivada de recorrência e mês. A exclusão conserva a identidade necessária para impedir recriação acidental ao sincronizar.

**Consequências assumidas:** consultas e regras de acesso devem isolar o proprietário; referências exigem validação; não há arredondamento de ponto flutuante no armazenamento; agregados do período são calculados sobre lançamentos ativos. Exclusão lógica não significa preservar dados indefinidamente: política de limpeza deverá ser definida com a implementação da sincronização.

**Verificação futura:** tentativas cruzadas entre dois usuários são negadas; R$ 0,10 + R$ 0,20 resulta em 30 centavos; orçamento duplicado para a mesma categoria/mês é impedido; exclusão recalcula o resumo.

## ADR-02 · Separar armazenamento local, sincronização e autenticação

**Situação:** proposta.

**Contexto:** a disciplina exige persistência local e remota; a segunda etapa já precisa funcionar localmente. Registros cotidianos devem continuar possíveis sem rede.

**Alternativas consideradas:** somente remoto, que prejudica uso sem rede; somente local, que não atende à entrega final; armazenamento local com fila de alterações e réplica remota.

**Escolha proposta:** terceira alternativa. A interface consulta o repositório local; criações, edições e exclusões são persistidas com operações pendentes. Um sincronizador envia alterações quando rede e sessão válida estiverem disponíveis. Após autenticação, dados remotos do usuário são reconciliados com os locais.

Cada operação possui ID único e entidade com ID estável, permitindo repetição sem duplicação. Alterações de uma mesma entidade são enviadas em ordem. A política inicial para conflitos entre dispositivos será a última gravação aceita pelo servidor; o relógio do celular não decide prioridade. Exclusões são operações explícitas, não simples desaparecimento local. A interface informa itens pendentes e falhas.

Firebase Authentication e Firestore são candidatos porque são sugeridos pelo enunciado, não porque sua adequação já tenha sido testada. O armazenamento local e os mecanismos exatos de sincronização serão escolhidos após verificar compatibilidade com Expo Go. Não se assume que persistência offline do SDK resolva automaticamente os requisitos do aplicativo.

**Consequências assumidas:** fila e reconciliação adicionam complexidade; conflito pode sobrescrever alteração de outro dispositivo, limitação a documentar; logout exige tratar alterações pendentes e limpar dados locais do usuário; testes precisam cobrir reinício, troca de usuário e retomada de rede.

**Verificação futura:** criar sem rede, reiniciar, editar, reconectar e repetir envio preserva um único lançamento com o estado esperado; usuário seguinte não vê cache do anterior.

## ADR-03 · IA como interpretação revisável, acessada por servidor

**Situação:** proposta.

**Contexto:** texto e imagens podem conter dados financeiros; respostas de LLM podem estar erradas ou fora do formato. Credenciais secretas não podem ser distribuídas no aplicativo.

**Alternativas consideradas:** regras fixas de interpretação, mais limitadas para linguagem livre e fotos; acesso direto do aplicativo ao provedor, que expõe segredo quando exige chave secreta; serviço intermediário autenticado para validar pedidos e respostas.

**Escolha proposta:** serviço intermediário autenticado. O app envia texto ou foto após ação do usuário. O serviço verifica a sessão, limita tamanho/frequência e chama o provedor com credenciais de ambiente. A resposta aceita somente tipo, valor em centavos, categoria permitida, data, descrição e avisos de campos que exigem revisão.

O resultado é uma sugestão temporária. O usuário revisa e confirma antes do registro. Dados ausentes não são preenchidos com valores inventados. Conteúdo do cupom não pode alterar instruções do serviço. Foto não será arquivada no banco como anexo permanente nesta versão.

Para o resumo, código calcula agregados e a LLM recebe apenas o necessário para descrevê-los. O serviço não permite que a LLM consulte outros dados ou execute operações financeiras. Provedor, modelo, hospedagem e limites concretos serão definidos após checagem de documentação atual.

**Consequências assumidas:** exige hospedagem de um componente adicional; pode haver custo e limites de uso; interpretação depende de rede; retenção do provedor precisa ser comunicada; registro manual funciona quando a IA falha. A API da LLM também é o atendimento proposto ao requisito de API externa, sujeito à confirmação acadêmica registrada no PRD.

**Verificação futura:** resposta malformada, timeout, foto ilegível e dados incompletos não criam lançamentos; a entrada permanece recuperável; nenhuma credencial secreta integra o bundle ou o histórico Git.

## ADR-04 · Separar fluxos públicos e privados com navegação previsível

**Situação:** proposta.

**Contexto:** o produto precisa de pelo menos cinco telas além de login/cadastro e deve impedir acesso privado sem sessão.

**Alternativas consideradas:** tela única com muitos modais, reduzindo clareza e histórico de navegação; menu lateral para tudo, escondendo tarefas frequentes; abas para áreas principais e pilhas para operações.

**Escolha proposta:** abas Início, Histórico, Orçamentos e Resumo; pilhas para Novo lançamento, Revisão, Detalhes e Recorrências. Login e cadastro ficam em fluxo público separado. Expo é obrigatório; Expo Router e React Navigation são candidatos citados no enunciado, com escolha técnica posterior.

Na inicialização, a sessão é restaurada antes de decidir qual fluxo exibir. Link direto e retorno do sistema não contornam a proteção. O bloqueio visual é complementado pela autorização no servidor. O protótipo apenas simula essas transições e informa essa limitação.

**Consequências assumidas:** o usuário tem acesso direto às áreas frequentes; operações precisam preservar seu contexto ao voltar; rascunhos não confirmados não podem virar lançamentos ao navegar; logout limpa a pilha privada.

**Verificação futura:** acesso direto sem sessão redireciona ao login; sair e pressionar voltar não reabre dados privados; cancelar revisão não altera o histórico.
