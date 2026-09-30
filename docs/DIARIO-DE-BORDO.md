# Diário de bordo de uso de IA

**Projeto:** Onde Foi Meu Dinheiro · **Período:** 25 a 27/09/2026 · **Versão:** 1.0.

**Integrantes:** Cecília Scharnovski, Hellen Caroline, Jonathan Silva Machado e Nicolas da Gama.

Os pedidos abaixo são sínteses das interações reais. A revisão foi condensada para destacar escolhas e correções; a versão anterior permanece no histórico Git. Autorização para prosseguir não é apresentada como entrevista, teste com usuários ou discussão entre todos os integrantes. Não foram atribuídas participações individuais sem confirmação.

## 1. Leitura do enunciado e delimitação · 25/09

**Pedido:** analisar os dois PDFs e planejar a primeira entrega para o tema Onde Foi Meu Dinheiro.

**Resultado da IA:** relação dos artefatos obrigatórios, prazos e proposta de registro por texto/foto com confirmação. Foram comparados focos em registro rápido, análise mensal e automação por cupons.

**Aproveitado:** requisitos explícitos dos documentos e registro rápido como fluxo principal. **Não priorizado:** análise avançada e automação como único caminho; adicionariam escopo e dependência de serviços sem melhorar o primeiro registro.

**Verificação/correção:** o PDF de temas era composto por imagens; a extração textual não bastou. Foi feita leitura visual da página do tema antes de consolidar o plano. **Evidência:** referências e delimitação do PRD.

## 2. Requisitos e organização · 25/09

**Pedido:** iniciar a documentação após informar o grupo de quatro pessoas.

**Resultado:** PRD com requisitos numerados, regras financeiras, oito telas além de login/cadastro, critérios de aceitação e exclusões.

**Aproveitado:** separar o protótipo da etapa 1 das integrações finais; manter registro manual, revisão de IA e orçamento por categoria. **Excluído do escopo proposto:** pagamentos, integração bancária, investimentos e contas compartilhadas, por não serem necessários ao problema definido.

**Verificação:** nomes, links e numeração conferidos. **Limite:** público e indicadores de sucesso são hipóteses, não resultados de pesquisa. **Evidência:** PRD e README.

## 3. Primeira arquitetura · 25/09

**Atividade:** detalhar os requisitos em entidades, persistência, serviço de IA e navegação.

**Resultado:** quatro registros com alternativas e consequências, inicialmente apresentados como propostas.

**Aproveitado:** valores em centavos; entidades por usuário; recorrência sem débito automático; credencial secreta no servidor; confirmação antes de salvar. **Não adotado:** salvar diretamente a interpretação da IA, pois uma extração errada se tornaria um gasto sem revisão.

**Limite identificado:** tecnologias e situação das decisões ainda estavam abertas. A revisão de 27/09, registrada no item 7, tratou essa insuficiência; não se reescreve o histórico como se as decisões já estivessem fechadas.

## 4. Protótipo e verificação dos fluxos · 25/09

**Pedido:** prosseguir a partir do PRD.

**Resultado:** protótipo HTML/CSS/JavaScript portátil, com dez telas e cenários de falha. IA, câmera, login e sincronização foram identificados como simulações.

**Aproveitado:** dados locais coerentes, edição/exclusão e atualização do orçamento. **Escolha técnica:** HTML para demonstrar o fluxo nesta entrega; React Native com Expo permanece o destino final.

**Evidência concreta:** registrar R$ 47,50 alterou despesas de R$ 925,20 para R$ 972,70 e saldo de R$ 1.224,80 para R$ 1.177,30. Reduzir orçamento de Alimentação para R$ 200,00 mostrou R$ 27,30 acima do limite sobre gastos de R$ 227,30.

**Limite:** testes exploratórios no navegador e testes do modelo não comprovam integração com banco, LLM ou Expo Go.

## 5. Revisão de código e correções · 25/09

**Pedido à revisão independente:** procurar falhas de navegação, valores, datas e recorrências no protótipo.

**Resultado:** dois problemas concretos: filtro limitado aos meses iniciais e comparação errada fora deles; extração parcial de números inválidos no texto.

**Aceito:** ambos os achados, após reprodução. **Correção:** meses dinâmicos, cálculo do mês anterior e interpretação conservadora de valores ambíguos. “Gastei -10” passou a exigir o preenchimento do valor em vez de sugerir R$ 10,00.

**Verificação:** seis testes passaram após os testes de regressão falharem antes das correções. Conferência adicional no navegador. **Recusado:** nenhum desses achados. **Evidência:** testes do modelo e histórico de código.

## 6. Publicação e organização do envio · 26/09

**Pedido:** publicar no GitHub e explicar o envio ao Moodle.

**Resultado:** repositório público, GitHub Pages, ZIP portátil e instruções de submissão. O ZIP remoto foi comparado com o local por hash.

**Aproveitado:** acesso direto ao protótipo e pacote com fontes editáveis. **Limite:** o Moodle não foi acessado e nenhuma submissão foi realizada. Exigências específicas do formulário da atividade continuam sujeitas à conferência pelo grupo.

## 7. Avaliação crítica e refinamento técnico · 27/09

**Pedido:** avaliar criticamente a primeira entrega e executar as melhorias indicadas, exceto apresentação.

**Resultado da avaliação:** decisões ainda provisórias, modelagem difícil de visualizar, revisão com formulário longo e diário repetitivo.

**Autorizado:** executar o refinamento. **Adotado:** Expo Router; SQLite local; Firebase Auth/Firestore pelo SDK JavaScript; função callable como intermediário do Gemini; diagrama e exemplo JSON; cartão compacto com edição sob demanda; revisão de tamanhos e contraste.

**Alternativas não adotadas:** SDK Firebase nativo, incompatível com Expo Go; segredo da LLM no cliente; segunda API sem utilidade apenas para preencher requisito. As justificativas e consequências estão nas ADRs.

**Pesquisa efetiva:** documentação oficial de Expo, Firebase e Gemini. Identificou-se que Cloud Functions exige plano Blaze para implantação; a dependência foi documentada, sem ativar serviços ou faturamento. A escolha é arquitetural, não um relato de integração já concluída.

**Confirmação recebida:** o professor ainda não confirmou se a API da LLM atende também ao requisito de API externa. A pendência foi preservada, sem afirmar aprovação.

## 8. Consolidação para leitura · 27/09

**Atividade:** organizar os artefatos em um documento consolidado, mantendo fontes editáveis.

**Resultado:** PDF com identificação, acesso ao protótipo, requisitos, decisões, diagrama, exemplo de dados e este diário como apêndice. O pacote atualizado inclui o PDF e o HTML independente.

**Verificação:** PDF de 23 páginas renderizado e inspecionado; seis testes do modelo passaram. No navegador, confirmação direta, edição para R$ 50,00 e cancelamento preservaram os totais esperados. A validação revelou um campo obrigatório escondido pelo formulário recolhido; foi corrigida para reabrir a edição e focar o campo. Conferência em largura móvel sem overflow horizontal.

## Pendências reais

- Confirmação acadêmica sobre API externa e reserva do tema.
- Avaliação de usabilidade por pessoas externas; não foi realizada nesta fase.
- Definição interna de responsáveis e validação conjunta dos integrantes.
- Teste físico do SQLite e implementação/testes reais de autenticação, Firestore, câmera e LLM.
- Conferência das regras da atividade Moodle e envio pelo grupo.

## Como continuar o diário

Registrar pedido, resultado, decisão, justificativa e evidência. Acrescentar correções feitas pelos integrantes quando ocorrerem. Não criar recusas, reuniões ou métricas apenas para preencher o registro.

## 9. Segunda entrega em React Native · 29/09

**Pedido e decisão:** implementar a segunda etapa após aprovação da especificação e do plano, preservando os artefatos da primeira entrega.

**Produzido com apoio de IA:** aplicativo Expo/TypeScript, rotas nativas, SQLite, revisão de lançamentos, histórico, orçamento, recorrência, resumo, testes e guias de execução. Autenticação, câmera e IA continuam explicitamente demonstrativas.

**Verificação efetiva:** testes com SQLite real no computador, análise TypeScript, lint, Expo Doctor e exportação dos bundles. Fluxos de edição, cancelamento, exclusão, orçamento e recorrência exercitados no navegador local. Revisão independente identificou problemas de ID vazio e estado reaproveitado em orçamento; ambos corrigidos. A verificação de interface também revelou conexão antiga no rascunho durante Fast Refresh, corrigida para acompanhar o repositório atual.

**Limite:** não houve teste em aparelho físico, reunião atribuída aos integrantes, integração com serviço remoto nem envio ao Moodle. O roteiro de validação física está em TESTES-ENTREGA-02.md para preenchimento pelo grupo. A confirmação acadêmica sobre API externa permanece pendente.

## 10. Refinamento da segunda entrega · 30/09

**Atividade:** revisar clareza das mensagens e consistência dos formulários após implementação. Ajustados acesso demonstrativo, identificação do mês do orçamento, feedback de categoria e rótulo da revisão recorrente.

**Evidência:** cadastro com confirmação incorreta bloqueado; confirmação correta abriu a demonstração. Formulário manual rejeitou valor negativo, levou R$ 0,10 à revisão e permitiu cancelar. Testes automatizados e análise estática aprovados novamente. A equipe ainda precisa registrar a validação física e realizar a submissão.
