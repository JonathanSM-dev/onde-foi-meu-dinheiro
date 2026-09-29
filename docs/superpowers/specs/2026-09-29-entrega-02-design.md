# Segunda entrega — aplicativo Expo com persistência local

Data: 29/09/2026. Situação: especificação aprovada pelo solicitante em 29/09/2026; implementação pendente.

## Objetivo e referências

Implementar o aplicativo móvel Onde Foi Meu Dinheiro para que o grupo consiga demonstrar cadastro, consulta, edição e exclusão de dados financeiros locais, navegação entre as telas e preservação dos dados depois de fechar e reabrir o app. Referências: PRD, ADR-01 a ADR-04, MODELAGEM-DADOS.md e protótipo HTML já aprovado.

Prazo registrado no PRD: 30/10/2026. A implementação não muda a primeira entrega publicada.

## Recorte e abordagem

Criar o projeto em `mobile/`, com React Native, Expo, TypeScript, Expo Router e expo-sqlite. Fixar versões compatíveis com Expo Go em lockfile, após verificar a documentação oficial vigente. Manter `prototipo/` e o PDF da primeira entrega como referência histórica.

Alternativas consideradas: usar apenas memória não atende ao reinício; armazenar todas as listas em AsyncStorage dificulta integridade e consultas; SQLite atende à persistência local e segue a ADR adotada. Uma WebView do HTML não realiza a implementação das telas em React Native, portanto não será usada.

## Telas e experiência

Preservar a direção visual do protótipo: fundo claro, verde-petróleo, destaque coral, cartões legíveis e revisão compacta. Implementar componentes nativos reutilizáveis, área segura, rolagem e acomodação do teclado. Controles terão rótulos acessíveis e alvos de toque de pelo menos 44 pontos.

- Login e cadastro: telas demonstrativas, com aviso de que a autenticação real virá na etapa final. Usar perfil local de demonstração; não guardar senhas nem afirmar identidade verificada.
- Início: seletor de mês, receitas, despesas, saldo, orçamento e últimos lançamentos; acesso a registro e recorrências.
- Novo lançamento: formulário manual funcional e entradas de texto/foto explicitamente simuladas.
- Revisão: cartão de sugestão, edição dos campos, confirmar e cancelar. Rascunho não entra no banco antes da confirmação.
- Histórico: busca por descrição, filtros combináveis por mês/tipo/categoria, acesso aos detalhes.
- Detalhes: consulta, edição e exclusão com confirmação; retorno previsível ao histórico.
- Orçamentos: criar, editar e excluir limite por categoria de despesa/mês; gasto e excedente calculados dos lançamentos.
- Recorrências: criar, editar, excluir e confirmar ocorrência mensal; dias inexistentes usam o último dia do mês.
- Resumo: receitas, despesas, saldo, gastos por categoria e comparação com mês anterior; explicação textual demonstrativa identificada.

Abas: Início, Histórico, Orçamentos e Resumo. Telas de operação fora das abas. Detalhes recebem ID por parâmetro de rota e tratam registro ausente. Cancelar não salva. Voltar não confirma sugestões.

## Persistência e regras

SQLite será a fonte das telas. Repositório centraliza consultas e mutações; componentes não executam SQL diretamente. Migrações versionadas inicializam categorias sem duplicação. Consultas usam parâmetros vinculados.

Tabelas: categorias, lançamentos, orçamentos e recorrências, com IDs estáveis e identificação do perfil local. Valores em centavos inteiros positivos. Datas financeiras civis no formato AAAA-MM-DD, usando a data local atual do aparelho, sem congelar a data do protótipo.

Preservar as invariantes do PRD: categoria compatível com o tipo; datas válidas e não futuras; descrição obrigatória; orçamento único por categoria/mês; ocorrência única por recorrência/mês inclusive após exclusão. Exclusões lógicas preservam identidade e não participam dos totais. Alterar recorrência não altera lançamentos anteriores. Excluir orçamento não exclui lançamentos.

Gravações relacionadas serão transacionais. Falha de gravação mantém o formulário e não mostra mensagem de sucesso. Bloquear confirmação repetida durante salvamento; identidade estável impede duplicação de uma mesma confirmação.

A etapa local não terá sincronizador nem fila fingindo envio remoto. A implementação futura da fila transacional e do Firestore permanece prevista na ADR-02. Sair da demonstração bloqueia o fluxo visual, mas preserva os dados locais para retomar o teste; isso será explicitado como comportamento do perfil demonstrativo, diferente do logout da autenticação real prevista no PRD.

Primeiro uso: banco financeiro vazio com categorias disponíveis. Oferecer carregamento opcional de dados fictícios para demonstração, sem duplicá-los em cada inicialização ou misturá-los silenciosamente com registros existentes. Qualquer restauração/apagamento da base requer confirmação na interface.

## Simulações e limites

Texto e foto podem produzir exemplos controlados, sempre identificados como simulação. Valor ausente/ambíguo exige correção manual. Incluir cenário de falha com alternativa manual e preservação da entrada. Nenhuma câmera real, conta Firebase, chave Gemini ou faturamento será necessário nesta etapa.

Os estados de carregamento, vazio, erro e nova tentativa serão representados nas consultas e operações. Um cenário de erro demonstrativo deve ser explicitamente identificado, separado de uma falha real do banco.

Autenticação real, regras remotas, sincronização, câmera e LLM pertencem à terceira entrega. A dúvida sobre a API externa não impede o desenvolvimento local.

## Organização do código

- `mobile/app/`: rotas e composição das telas.
- `mobile/src/components/`: controles, cartões, formulários e estados compartilhados.
- `mobile/src/domain/`: tipos, validações, cálculos e recorrências sem dependência da interface.
- `mobile/src/data/`: esquema, migrações, repositório SQLite e dados demonstrativos.
- `mobile/src/state/`: perfil demonstrativo, período, carregamento e atualização das consultas.
- `mobile/src/services/`: serviços simulados com contrato separado das telas.
- `mobile/tests/`: regras e integração da persistência quando viável no ambiente disponível.
- `docs/ENTREGA-02.md`: checklist, execução e evidências; diário atualizado apenas com trabalho efetivamente realizado.

## Critérios de aceitação e verificação

1. Clone limpo e instalação pelo lockfile permitem iniciar o Expo conforme README.
2. Todas as dez telas são acessíveis; parâmetros de detalhe inválidos mostram estado recuperável.
3. Registrar R$ 0,10 e R$ 0,20 resulta em 30 centavos; receitas/despesas/saldo e orçamento refletem edição e exclusão.
4. Cadastros, alterações e exclusões sobrevivem ao fechamento e reabertura do banco; migrações podem rodar novamente sem duplicar dados.
5. Confirmar recorrência duas vezes, inclusive depois de excluir sua ocorrência, não cria novo lançamento para o mesmo mês. Dia 31 funciona em fevereiro, inclusive ano bissexto.
6. Cancelar revisão ou exclusão preserva a base. Campo ausente, dinheiro inválido e data futura impedem salvar.
7. Mês sem dados e mês anterior com despesas zero não exibem NaN, Infinity ou percentual sem base.
8. Executar análise TypeScript, testes das regras e verificações Expo; documentar resultados reais e limitações.
9. Conferir visualmente navegação, teclado, edição e estados em ambiente disponível. Validação final de SQLite e reinício no Expo Go em aparelho físico deve ser registrada pelo grupo se não houver dispositivo acessível nesta sessão; teste web não substitui essa evidência.

## Entregáveis

Projeto Expo executável, lockfile, testes pertinentes, README com comandos e limitações, checklist da segunda entrega e diário atualizado. Publicar o código no repositório existente após verificação, sem substituir o protótipo do GitHub Pages pelo aplicativo nativo. Não declarar conclusão da validação em aparelho físico sem realizá-la.
