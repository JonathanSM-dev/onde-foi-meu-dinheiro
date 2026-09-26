# Diário de bordo de uso de IA

**Projeto:** Onde Foi Meu Dinheiro · **Início:** 25/09/2026.

**Equipe:** Cecília Scharnovski, Hellen Caroline, Jonathan Silva Machado e Nicolas da Gama.

Este diário registra o apoio de IA à concepção e documentação. Os pedidos são sintetizados, não transcrições literais. Aceitação pela equipe, proposta da ferramenta e verificação efetiva são estados distintos. Não há atribuição individual de participação sem confirmação dos integrantes.

## Registro 01 · Leitura dos requisitos acadêmicos

- **Data:** 25/09/2026.
- **Ferramenta:** Codex.
- **Pedido sintetizado:** analisar os dois PDFs e planejar a primeira entrega para o tema escolhido.
- **Resultado:** identificação de prazo, peso da etapa, apresentação, PRD, decisões de arquitetura, GitHub, protótipo navegável e diário de IA.
- **Avaliação realizada:** texto do enunciado extraído; páginas relevantes conferidas visualmente. O PDF de temas não forneceu texto útil na extração e foi renderizado para leitura.
- **Aceito como base:** requisitos explícitos dos documentos.
- **Correção de abordagem:** complementar a extração com leitura visual, pois o documento de temas estava em imagens.
- **Justificativa:** evitar planejar o produto sem conferir a descrição específica do tema.
- **Evidência:** fontes identificadas no README e no PRD.

## Registro 02 · Delimitação da proposta de produto

- **Data:** 25/09/2026.
- **Ferramenta:** Codex.
- **Pedido sintetizado:** propor o conteúdo da entrega considerando Onde Foi Meu Dinheiro.
- **Resultado:** foco em registro por linguagem natural, revisão antes de salvar e acompanhamento mensal; comparação entre foco em registro, análise e automação por cupons.
- **Encaminhamento da equipe:** autorização para iniciar a documentação a partir da proposta apresentada.
- **Proposta adotada no rascunho:** registro rápido como fluxo principal; foto e resumo como complementos.
- **Alternativas não priorizadas pela ferramenta:** análise financeira como centro do app e automação por cupons como único caminho de entrada.
- **Justificativa proposta:** reduzir o esforço de registro e manter um caminho utilizável sem câmera ou IA disponível.
- **Limite da evidência:** a autorização para começar não equivale a validação de todos os detalhes do PRD.

## Registro 03 · Composição e organização da equipe

- **Data:** 25/09/2026.
- **Ferramenta:** Codex.
- **Informação recebida:** grupo com quatro integrantes e seus nomes.
- **Resultado:** identificação do projeto e proposta de frentes de produto, interface, arquitetura e integração.
- **Aceito:** composição da equipe fornecida na conversa.
- **Pendente:** distribuição nominal de responsabilidades.
- **Cuidado adotado:** não atribuir tarefas ou decisões individuais sem indicação da equipe.
- **Evidência:** seção Equipe no README.

## Registro 04 · Estruturação do PRD

- **Data:** 25/09/2026.
- **Ferramenta:** Codex.
- **Pedido sintetizado:** iniciar a elaboração do PRD e da estrutura documental.
- **Resultado:** documento com problema, público, objetivos, requisitos RF-01 a RF-16, regras RN-01 a RN-17, requisitos não funcionais, telas, fluxos, riscos e rastreabilidade.
- **Proposto para revisão:** escopo e critérios de aceitação apresentados no PRD.
- **Alternativas excluídas do rascunho pela ferramenta:** integração bancária, investimentos, pagamentos e contas compartilhadas.
- **Justificativa proposta:** manter o trabalho realizável no semestre e coerente com o problema escolhido.
- **Pendente:** leitura crítica e aceitação explícita pela equipe; pesquisa e teste com usuários não realizados.
- **Evidência:** PRD.md, versão 0.1.

## Registro 05 · Modelagem e regras financeiras

- **Data:** 25/09/2026.
- **Ferramenta:** Codex.
- **Atividade derivada:** detalhar as decisões de dados necessárias aos requisitos propostos.
- **Resultado:** entidades separadas, isolamento por usuário, valores em centavos, saldo do período e recorrências confirmadas manualmente.
- **Alternativas analisadas pela ferramenta:** documento único, tabelas relacionais e documentos separados por entidade.
- **Escolha proposta:** documentos separados; dinheiro como inteiro em centavos; recorrência como modelo, sem impacto antecipado nos totais.
- **Justificativa proposta:** facilitar CRUD, evitar imprecisão monetária e impedir que uma previsão seja confundida com gasto realizado.
- **Pendente:** revisão da equipe e verificação em implementação. Nenhum teste de banco foi executado nesta fase.
- **Evidência:** ADR-01 e regras de negócio do PRD.

## Registro 06 · Tratamento de falhas da IA

- **Data:** 25/09/2026.
- **Ferramenta:** Codex.
- **Atividade derivada:** planejar o comportamento quando a interpretação não é confiável ou não está disponível.
- **Resultado:** revisão obrigatória, campos editáveis, validação de formato, preservação da entrada e alternativa manual.
- **Alternativas não adotadas na proposta:** gravação automática da resposta e inclusão de credencial secreta no aplicativo.
- **Justificativa proposta:** evitar lançamentos incorretos silenciosos e exposição da credencial do serviço.
- **Pendente:** definição e teste do provedor e do intermediário; nenhuma chamada de IA de produto foi realizada.
- **Evidência:** ADR-03; RF-04 a RF-06 e RF-14.

## Registro 07 · Separação entre planejamento e implementação

- **Data:** 25/09/2026.
- **Ferramenta:** Codex.
- **Atividade derivada:** organizar o material de forma compatível com as três etapas da disciplina.
- **Resultado:** indicação explícita de documentos em revisão e checklist com protótipo, GitHub e apresentação ainda pendentes.
- **Critério adotado no rascunho:** não tratar desenho de fluxo como navegação implementada nem critério de aceitação como teste executado.
- **Justificativa:** permitir acompanhar o progresso com evidências e evitar divergência entre documentação e entrega.
- **Pendente:** validação documental, revisão da equipe e construção do protótipo.
- **Evidência:** README.md e ENTREGA-01.md.

## Registro 08 · Conferência documental

- **Data:** 25/09/2026.
- **Ferramenta:** Codex com verificação local dos arquivos.
- **Atividade realizada:** conferir links internos, sequência dos identificadores de requisitos e regras, presença dos quatro integrantes e quantidade de decisões de arquitetura.
- **Resultado:** os cinco documentos Markdown foram verificados; os links locais apontaram para arquivos existentes, RF-01 a RF-16 e RN-01 a RN-17 estavam em sequência, os nomes estavam presentes e foram encontrados quatro registros de arquitetura. Não foram encontrados caracteres de substituição ou marcadores de conteúdo por preencher na checagem.
- **Avaliação:** verificação estrutural concluída; isso não substitui a revisão do conteúdo pela equipe ou o teste do futuro protótipo.
- **Pendente:** revisão humana e construção dos artefatos visuais.

## Próximos registros planejados

Estas atividades ainda não ocorreram e não constituem entradas concluídas do diário:

- Revisão do PRD pela equipe, incluindo alterações aceitas e rejeitadas.
- Comparação e escolha de direção visual.
- Construção e revisão das telas do protótipo.
- Teste de navegação do fluxo principal e dos estados de erro.
- Verificação técnica dos serviços e da compatibilidade com Expo Go.
- Preparação e ensaio da apresentação.

## Modelo para novas entradas

Para cada interação relevante, registrar: data; participante responsável, quando confirmado; ferramenta; pedido sintetizado; resultado; verificação efetuada; partes aceitas; partes recusadas e motivo; alterações manuais; evidência ou arquivo; pendências. Quando não houver recusa, registrar isso em vez de inventar uma alternativa descartada.
