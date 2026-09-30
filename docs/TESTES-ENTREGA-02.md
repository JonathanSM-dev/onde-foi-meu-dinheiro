# Evidências de verificação · segunda entrega

Ambiente: Windows, Node 24.19.0, Expo SDK 57. Verificação em 29/09/2026 (horário de Brasília). Este relatório distingue testes no computador de execução em celular.

## Testes automatizados

17 testes via `npm test`: dinheiro e calendário; validação; resumo; cancelamento e confirmação única; falha/retry; resposta atrasada; interpretação simulada; orçamento; recorrência; CRUD e reabertura de arquivo SQLite; migração idempotente; isolamento por UID; ID vazio/inexistente; orçamento único; tombstone de recorrência; rollback; sessão demonstrativa e consultas concorrentes.

O cenário de ID vazio foi reproduzido com teste falhando antes da correção e aprovado depois. A revisão independente também identificou reaproveitamento indevido de estado entre formulários de orçamento; corrigido com nova identidade a cada abertura e categoria fixa na edição.

## Interface no navegador local

React Native Web com SQLite/WASM, executado por Metro em localhost. Dados exclusivamente fictícios.

- Lançamento de R$ 45,00 criado por texto e persistido entre sessões do navegador.
- Edição para R$ 50,00 refletida nos detalhes; cancelar exclusão preservou o registro; confirmar exclusão deixou histórico vazio.
- Orçamento de Alimentação criado em R$ 400,00 e editado para R$ 40,00.
- Regressão: abrir novo orçamento, selecionar Transporte e abrir edição de Alimentação passou a carregar a categoria e o valor corretos, sem criar Transporte.
- Modelo recorrente Internet teste criado com R$ 79,90, dia 10; revisão apresenta data calculada e requer confirmação.

Durante Fast Refresh, o rascunho retinha uma conexão antiga; a instância agora acompanha a troca de repositório. Reiniciar a página encerra a sessão, preservando o banco.

## Roteiro obrigatório no aparelho · pendente

Preencher sem antecipar resultados: integrante ___; data ___; aparelho ___; Android/iOS ___; Expo Go ___; evidência ___.

1. Instalar com `npm ci`, iniciar Expo e abrir pelo QR code. Conferir as dez telas.
2. Criar R$ 0,10 e R$ 0,20; conferir R$ 0,30. Rejeitar data futura e valor inválido.
3. Criar despesa de R$ 45,00, editar para R$ 50,00 e cancelar exclusão.
4. Fechar completamente o app/Expo Go e reabrir. Entrar novamente e conferir R$ 50,00.
5. Excluir o registro, fechar e reabrir; confirmar que não reaparece.
6. Orçamento R$ 40,00 com despesa R$ 50,00 deve mostrar excesso de R$ 10,00. Excluir orçamento não remove a despesa.
7. Criar e confirmar recorrência; segunda confirmação deve falhar. Excluir o modelo preserva a ocorrência já confirmada.
8. Conferir mês vazio, comparação sem base, filtros, erro simulado com retry e cancelamento de revisão.
9. Testar teclado aberto, fonte ampliada e botão voltar durante navegação e salvamento.

Não foram realizados testes físicos Android/iOS, leitor de tela, usabilidade externa ou testes de integrações remotas. Exportação de bundles não substitui essa validação.

## Decisões de implementação e limites

Transações e leituras serializadas no repositório; campos das entidades em JSON com chaves relacionais e índices únicos. Validação monetária fica no domínio; relatórios SQL por campo exigiriam evolução do esquema. Componentes básicos agrupados em `ui.tsx`; controladores puros testados sem um simulador completo da navegação React. Rotas em `app/`, conforme especificação aprovada. As tarefas de telas foram consolidadas em um commit por compartilharem componentes.

Auditoria npm: 13 avisos moderados, nenhum alto/crítico na verificação; cadeia Expo/Router com dependências transitivas `uuid`, `xcode`, `query-string` e `decode-uri-component`. A correção automática sugeria trocar SDK/Router por versões antigas incompatíveis; não foi aplicado `--force`. Reavaliar atualizações compatíveis antes da entrega final.

Recorrência confirmada em R$ 79,90 e repetição rejeitada na interface. Histórico recuperado após erro demonstrativo. Resumo exibiu total correto, categoria e ausência de base percentual. Captura em largura de 390 px: [resumo web](evidencias/entrega-02-resumo-web.png). A captura é do navegador, não de um aparelho físico.

## Verificação final em instalação limpa

| Comando | Resultado |
|---|---|
| npm ci | Instalação concluída pelo lockfile |
| npm test | 17 aprovados, 0 falhas |
| npm run typecheck | Aprovado |
| npm run lint | Aprovado |
| npx expo install --check | Dependências compatíveis |
| npx expo-doctor | 21/21 verificações aprovadas |
| npx expo export --platform all | Bundles Android, iOS e web exportados |
| node --test prototipo/model.test.cjs | 6 testes históricos aprovados |

Exportações foram verificadas após as correções finais de código. A auditoria de dependências tem os avisos moderados descritos acima, sem bloqueio na instalação ou nos testes.

## Refinamento final · 30/09/2026

Mensagens de login/cadastro contextualizadas; mês do orçamento identificado no formulário; erro de categoria exibido junto à seleção; revisão diferencia ocorrência recorrente de sugestão simulada. Cadastro com confirmação diferente foi rejeitado e com confirmação correta abriu a sessão demonstrativa. No formulário manual, valor negativo foi rejeitado; valor R$ 0,10 chegou à revisão e seu cancelamento preservou a base. Fluxo de foto usa o cupom identificado como fictício.

Após esses ajustes, os 17 testes, TypeScript e lint passaram novamente.
