# Diário de bordo de uso de IA

**Projeto:** Onde Foi Meu Dinheiro · **Período:** 25/09 a 30/10/2026 · **Versão:** 2.1.

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

## 9. Segunda entrega em React Native · 29/09

**Pedido e decisão:** implementar a segunda etapa após aprovação da especificação e do plano, preservando os artefatos da primeira entrega.

**Produzido com apoio de IA:** aplicativo Expo/TypeScript, rotas nativas, SQLite, revisão de lançamentos, histórico, orçamento, recorrência, resumo, testes e guias de execução. Autenticação, câmera e IA continuam explicitamente demonstrativas.

**Verificação efetiva:** testes com SQLite real no computador, análise TypeScript, lint, Expo Doctor e exportação dos bundles. Fluxos de edição, cancelamento, exclusão, orçamento e recorrência exercitados no navegador local. Revisão independente identificou problemas de ID vazio e estado reaproveitado em orçamento; ambos corrigidos. A verificação de interface também revelou conexão antiga no rascunho durante Fast Refresh, corrigida para acompanhar o repositório atual.

**Limite:** não houve teste em aparelho físico, reunião atribuída aos integrantes, integração com serviço remoto nem envio ao Moodle. O roteiro de validação física está em TESTES-ENTREGA-02.md para preenchimento pelo grupo. A confirmação acadêmica sobre API externa permanece pendente.

## 10. Refinamento da segunda entrega · 30/09

**Atividade:** revisar clareza das mensagens e consistência dos formulários após implementação. Ajustados acesso demonstrativo, identificação do mês do orçamento, feedback de categoria e rótulo da revisão recorrente.

**Evidência:** cadastro com confirmação incorreta bloqueado; confirmação correta abriu a demonstração. Formulário manual rejeitou valor negativo, levou R$ 0,10 à revisão e permitiu cancelar. Testes automatizados e análise estática aprovados novamente. A equipe ainda precisa registrar a validação física e realizar a submissão.

## 11. Retomada do contexto do projeto · 30/10/2026

**Pedido:** ler o PDF e o ZIP da primeira entrega, considerando também o protótipo publicado e os quatro integrantes informados.

**Resultado da IA:** leitura do PDF de 23 páginas, inspeção dos documentos e fontes do pacote e consulta à página publicada. O PDF externo foi comparado por hash ao incluído no ZIP e os arquivos eram iguais. O diagrama de entidades foi renderizado para inspeção visual.

**Conclusão:** o produto prioriza registro por texto ou foto, revisão e confirmação antes de atualizar os totais. O material da primeira entrega distingue protótipo HTML e serviços simulados da implementação móvel prevista. Essa distinção foi mantida na retomada.

**Aprendizado:** compreender o que já existe evita apresentar uma proposta futura como funcionalidade entregue e permite preservar a coerência entre requisitos e demonstração.

## 12. Leitura do enunciado da segunda entrega · 30/10/2026

**Pedido:** produzir a segunda entrega conforme o documento Word da disciplina.

**Resultado da análise:** o enunciado exige telas implementadas, navegação com parâmetros, persistência local, estados de carregamento/vazio/erro, execução seguindo o README e documentação revisada. Autenticação, persistência remota e regras completas não são exigidas nessa etapa.

**Decisão:** manter o recorte local. O repositório já continha uma implementação Expo versionada e uma especificação anterior registrada como aprovada. A IA passou a conferir e preparar essa implementação, em vez de reconstruir as telas.

**Limite:** a leitura atual identificou registros históricos; não representa nova aprovação do professor ou participação confirmada de todos os integrantes nas decisões anteriores.

## 13. Conferência dos fluxos e da arquitetura implementada · 30/10/2026

**Atividade:** comparar o código ao recorte do enunciado. Foram inspecionados o repositório SQLite, a consulta do histórico, o controle de rotas e o componente que abre detalhes com o ID do lançamento.

**Resultado:** a implementação contém dez telas, rotas com parâmetros, CRUD local e estados recuperáveis nas consultas. Os testes existentes incluem reabertura do banco, rollback, identidade de registros, recorrência sem duplicação e cancelamento de rascunho.

**Correção documental:** PRD e ADRs passaram a explicitar o perfil compartilhado `demo-local`, a sessão demonstrativa em memória, o logout que preserva a base e a ausência de sincronizador. O esquema implementado usa payload JSON com colunas e índices para identidade e restrições.

**Aprendizado:** uma arquitetura ganha credibilidade quando suas limitações são descritas junto das escolhas. Persistência local implementada e sincronização planejada têm alcances diferentes.

## 14. Instalação e atualização compatível do SDK 57 · 30/10/2026

**Atividade:** instalar as dependências pelo lockfile e executar a checagem de compatibilidade do Expo.

**Resultado inicial:** os testes passaram, mas a ferramenta apontou correções disponíveis para Expo, Constants, Linking, Router e SQLite dentro do SDK 57. As versões indicadas foram instaladas e o lockfile atualizado.

**Decisão:** aplicar atualizações compatíveis e executar `npm audit fix` sem força. A recomendação automática restante incluía mudanças principais incompatíveis; ela não foi aplicada nesse momento. A auditoria terminou essa etapa com 11 alertas, sendo 6 altos.

**Aprendizado:** um teste de domínio aprovado não comprova compatibilidade do conjunto de bibliotecas. A ferramenta de instalação do Expo e o lockfile atendem a verificações diferentes e complementares.

## 15. Verificações e reprodução em pasta limpa · 30/10/2026

**Atividade:** executar testes, TypeScript, lint, compatibilidade, Expo Doctor e exportação dos bundles.

**Evidência:** 17 testes aprovados; TypeScript e lint aprovados; dependências compatíveis; Expo Doctor 21/21; exportações Android, iOS e web concluídas no SDK 57.

**Conferência do pacote:** o ZIP foi extraído em pasta temporária sem dependências instaladas. `npm ci` concluiu a instalação e `npx expo start --port 8093` iniciou o Metro. Os arquivos principais do pacote foram comparados byte a byte às fontes locais. O servidor de conferência foi encerrado depois da inicialização.

**Aprendizado:** executar a partir do pacote distribuído verifica um requisito concreto do avaliador: conseguir iniciar sem depender da configuração particular de quem desenvolveu. Essa verificação não substitui testar interação e persistência no aparelho.

## 16. Publicação da segunda entrega no GitHub · 30/10/2026

**Pedido:** publicar a versão preparada no repositório existente.

**Resultado:** documentação revisada, dependências e ZIP foram commitados e enviados à branch `main`. Na publicação inicial desta sessão, o hash da branch remota foi consultado e comparado ao commit local, confirmando o envio.

**Decisão:** preservar o protótipo da primeira entrega no GitHub Pages e manter o aplicativo React Native em `mobile/`. O link do protótipo HTML não foi apresentado como execução do aplicativo móvel.

**Aprendizado:** código publicado, pacote disponível e aplicativo executável são resultados distintos. A distribuição precisa indicar qual artefato corresponde à etapa avaliada.

## 17. Orientação para iniciar e avaliar pelo Expo Go · 30/10/2026

**Pedidos:** explicar como testar o projeto e como abrir o Expo Go no celular.

**Resultado da IA:** instruções de instalação, execução pelo terminal, leitura do QR code e conexão na mesma rede. O roteiro proposto incluiu cadastro, edição, cancelamento de exclusão e reabertura do aplicativo para conferir os dados.

**Discussão de avaliação:** ao ser questionada se a entrega mereceria nota máxima, a IA diferenciou requisitos implementados de evidência física e apresentação. A nota mencionada foi uma estimativa informal, sem atribuí-la ao professor. As integrações simuladas foram reconhecidas como compatíveis com o recorte da etapa.

**Aprendizado:** demonstrar um fluxo completo ajuda a comunicar qualidade técnica: registrar, editar, fechar e reabrir oferece uma evidência mais concreta de persistência do que apenas citar SQLite.

## 18. Resolução da migração para Expo SDK 58 · 30/10/2026

**Pedido:** atualizar o projeto para SDK 58.

**Resultado inicial:** após consultar a documentação oficial, a atualização incremental encontrou `ERESOLVE` ao misturar a árvore instalada do Router 57 com as dependências do Router 58.

**Correção:** o conjunto compatível foi definido e o lockfile resolvido em pasta temporária limpa. Em seguida, `npm ci` instalou a nova árvore no projeto. Não foram usados `--force` nem `--legacy-peer-deps` para ignorar incompatibilidades.

**Resultado:** atualização coordenada de Expo, Router, SQLite e demais bibliotecas, com React 19.3.0 e React Native 0.88.1. O README passou a indicar SDK 58, os requisitos atualizados de Node e limpeza do cache do Metro.

## 19. Ajustes de código após a migração · 30/10/2026

**Problema identificado:** o TypeScript incluiu arquivos gerados em `dist` enquanto a exportação substituía esses arquivos. A configuração passou a incluir explicitamente as pastas de rotas, fontes e testes.

**Segundo problema:** a tipagem de cor fornecida pelo novo Router tornou-se mais ampla que a aceita pelos ícones. Uma primeira tentativa de usar fallback para cor nula ainda deixou o caso numérico incompatível. A solução final usa o estado `focused` para escolher as cores já definidas no tema.

**Evidência final:** TypeScript e lint aprovados; 17 testes aprovados; compatibilidade aprovada; Expo Doctor 20/20; exportação Android/iOS/web concluída novamente após o ajuste. O ZIP foi regenerado e a migração publicada.

**Limite:** a auditoria da instalação do SDK 58 apresentou 8 alertas, sendo 3 altos. Essa contagem não equivale a afirmar ausência de vulnerabilidades ou correção completa da cadeia de dependências.

## 20. Discussão sobre acesso por outra rede · 30/10/2026

**Pedido:** acessar o aplicativo pelo Expo Go sem depender da mesma rede Wi-Fi, mantendo o projeto no GitHub.

**Resultado da orientação:** a IA explicou a diferença entre armazenar o código no GitHub e manter um servidor Expo disponível. Foi indicado o modo túnel para acesso entre redes diferentes, dependente do computador ligado, conectado e com o servidor em execução.

**Esclarecimento solicitado:** se isso deixaria o computador aberto. A resposta distinguiu acesso ao servidor de desenvolvimento de controle da área de trabalho e explicou o encerramento com `Ctrl+C`. Um APK foi citado como alternativa para uso sem servidor local.

**Alcance:** houve orientação; não foi configurado um túnel nem gerado um APK nessa interação.

## 21. Confirmação de funcionamento no celular · 30/10/2026

**Resultado informado pelo solicitante:** o aplicativo funcionou no celular. A IA perguntou especificamente se um lançamento permanecia salvo após fechar completamente o Expo Go e reabrir; o solicitante confirmou que funcionou.

**Evidência:** relato textual do teste nesta conversa. Modelo do aparelho, sistema e versão do Expo Go não foram informados. Não houve inspeção remota do dispositivo nem comprovação física dos demais fluxos.

**Atualização:** o relatório de testes passou a distinguir essa confirmação dos testes automatizados feitos no computador e dos roteiros ainda não confirmados.

**Aprendizado:** a evidência relatada sustenta o benefício de continuidade do registro financeiro entre usos. Ela não autoriza afirmar que toda a experiência móvel ou acessibilidade foi validada.

## 22. Revisão do conteúdo destinado ao avaliador · 30/10/2026

**Feedback do solicitante:** o pacote incluía orientações de envio ao Moodle que não faziam sentido como parte da entrega técnica.

**Correção aceita:** removidos o guia de envio, o texto sugerido para submissão e o roteiro interno de apresentação. A página da segunda entrega passou a apresentar conteúdo implementado e links de execução e documentação.

**Mudança no empacotador:** seleção explícita dos documentos pertinentes, excluindo planos internos, instruções do agente e materiais administrativos. O ZIP passou a conter 71 arquivos, teve sua integridade verificada e foi publicado no GitHub.

**Aprendizado:** a documentação deve ajudar seu destinatário. O avaliador precisa conseguir executar e entender a solução; orientações pessoais de submissão não fazem parte dessa finalidade.

## 23. Organização e detalhamento do diário · 30/10/2026

**Feedback:** o diário parecia terminar em setembro. Os registros de outubro estavam no início do arquivo e o cabeçalho ainda indicava o período antigo.

**Correção:** atualização do período, organização cronológica e inclusão dos acontecimentos posteriores, como publicação, confirmação do teste físico e revisão do pacote. A pedido do solicitante, os registros de hoje foram separados por assunto, repetindo a data em cada seção.

**Decisão editorial:** registrar os pedidos, resultados e aprendizados ligados aos acontecimentos identificáveis nesta conversa. As entradas de setembro foram preservadas como registros históricos existentes; seu conteúdo não foi revalidado integralmente nesta atualização.

**Aprendizado:** separar os acontecimentos por problema e consequência facilita explicar na apresentação como uma escolha técnica contribuiu para reprodução, consistência dos dados, distribuição ou clareza do produto.
