# Guia do protótipo navegável

## Abrir

Abra `Onde-Foi-Meu-Dinheiro-Prototipo.html`, fornecido no pacote ZIP. É um arquivo independente: não precisa de instalação, internet, conta ou servidor. Outra opção é abrir `prototipo/index.html` mantendo `styles.css`, `model.js` e `app.js` na mesma pasta.

O protótipo inicia no perfil fictício Alex para facilitar a demonstração. Para ver login e cadastro, toque no avatar **AL → Sair da demonstração**. Use apenas credenciais fictícias; não há autenticação real nem armazenamento de senhas.

## Roteiro de exploração

1. Na tela inicial, confira receitas de **R$ 2.150,00**, despesas de **R$ 925,20** e saldo do período de **R$ 1.224,80**.
2. Toque em **Registrar → Texto** e use o exemplo **Mercado · R$ 45**.
3. Toque em **Organizar lançamento**, observe o carregamento e revise os campos. A data de referência é 25/09/2026; “ontem” vira 24/09/2026.
4. Corrija algum campo ou confirme. Se mantiver R$ 45,00, as despesas passam a R$ 970,20 e o saldo a R$ 1.179,80.
5. No histórico, abra o lançamento, edite-o ou exclua-o com confirmação. A busca e os filtros podem ser combinados.
6. Em **Orçamentos**, altere o limite de Alimentação para R$ 200,00 para demonstrar a ultrapassagem. Excluir um orçamento preserva os lançamentos.
7. Em **Início → Recorrências**, confirme Internet de casa. Ela entra nos totais uma única vez por mês. O modelo continua disponível para outros meses.
8. Em **Resumo**, veja as categorias e toque em **Entender meu mês** para a leitura demonstrativa dos totais.
9. Explore **Registrar → Foto → Simular captura** para ver o cupom fictício e a revisão. Nenhuma câmera real é ativada.
10. Use **Restaurar demonstração** antes de apresentar novamente.

## Cenários adicionais

O painel de cenários fica à direita no computador e abaixo do aplicativo em telas estreitas.

| Cenário | Como explorar |
|---|---|
| IA indisponível | Solicite a interpretação; confira a mensagem e a alternativa manual. |
| Câmera sem permissão | Confira as alternativas texto e manual. |
| Sem conexão | Cadastre manualmente; observe o aviso de pendência simulada. |
| Conta sem lançamentos | Explore as telas vazias e os convites para iniciar. |
| Erro no histórico | Abra o histórico e use Tentar novamente. |

Alterar de/para conta vazia restaura a base do cenário. Recarregar a página e sair da demonstração também restauram os dados. Não utilize o protótipo para registros financeiros reais.

## Limites desta entrega

- Este é um protótipo HTML do aplicativo móvel. A implementação final será em React Native com Expo, conforme o enunciado.
- IA, login, câmera, envio remoto e estados de conexão são simulações. Nenhuma API externa é chamada.
- A interpretação de texto usa regras locais limitadas para demonstrar os exemplos; não representa a capacidade de uma LLM. Valores inválidos ou ambíguos exigem preenchimento manual na revisão.
- Os dados existem apenas na memória da página. Não há banco, sessão persistente ou sincronização real.
- Valores monetários usam o formato brasileiro, com vírgula decimal. Datas futuras em relação a 25/09/2026 não são aceitas.
- Resumo mensal é uma descrição determinística de dados fictícios; a chamada de IA real pertence à etapa final.
- O navegador permite percorrer telas, porém o botão de voltar do navegador não simula o histórico de navegação nativo. Use os controles Voltar do protótipo.

## Verificação técnica realizada

Seis testes automatizados do modelo passaram: precisão e validação monetária; totais por mês após alteração/exclusão; ausência de base percentual; mês anterior e virada do ano; extração conservadora de valores; recorrência sem duplicação mesmo após excluir o lançamento.

No navegador foram exercitados registro por texto, correção, edição, exclusão, orçamento excedido, confirmação de recorrência, resumo, foto, cancelamento, login/cadastro e falhas de IA/câmera. O layout foi inspecionado em desktop e largura móvel; a checagem móvel não detectou overflow horizontal. Isso não equivale a testes em dispositivo real com Expo Go, que ainda não se aplicam ao artefato HTML.

A navegação foi testada com os arquivos-fonte servidos localmente. O HTML independente foi conferido por equivalência dos recursos embutidos e ausência de dependências externas. Sua abertura direta do disco não pôde ser automatizada porque o navegador de testes bloqueia URLs `file:`; a equipe deve conferir o duplo clique no navegador que usará na apresentação.

## Reproduzir verificações e pacote

Com Node.js disponível, execute na raiz: `node --test prototipo/model.test.cjs`.

Com Python disponível, execute na raiz: `python scripts/build_delivery.py`. O script escreve o HTML independente e o ZIP em `output/` e confere a integridade do arquivo compactado.
