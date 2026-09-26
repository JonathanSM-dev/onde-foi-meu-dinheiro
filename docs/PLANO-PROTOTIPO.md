# Plano de execução · Protótipo da primeira entrega

**Objetivo:** materializar o PRD em um protótipo navegável de aplicativo móvel para apresentação acadêmica.

**Base:** [PRD](PRD.md), autorizado como base para continuidade em 25/09/2026.

**Arquitetura:** HTML, CSS e JavaScript local, sem dependências de execução ou serviços externos. Modelo demonstrativo separado das telas. Dados somente em memória; recarregar restaura o cenário. Este artefato não substitui o aplicativo React Native com Expo das etapas seguintes.

**Arquivos:** `prototipo/index.html` (estrutura), `styles.css` (visual), `model.js` (dados e cálculos), `app.js` (telas e interações), `model.test.cjs` (verificação dos cálculos).

## Restrições

- Dez telas do PRD, incluindo login e cadastro; nenhuma credencial real necessária.
- Data de referência da demonstração: 25/09/2026. “Ontem” corresponde a 24/09/2026.
- Valores inteiros em centavos, BRL e cálculos compartilhados entre telas.
- Texto, foto e autenticação simulados, sem chamadas de rede.
- Confirmar antes de salvar; cancelar preserva os totais.
- Revisão visual em navegador e teste do fluxo principal antes de declarar pronto.

## Tarefas

- [x] 1. Verificar modelo: totais por mês, precisão monetária, atualização/exclusão e recorrência sem duplicação.
- [x] 2. Criar visual, navegação, login/cadastro e fluxo texto → revisão → histórico.
- [x] 3. Completar orçamento, recorrências, resumo, detalhes e cenários de falha.
- [x] 4. Testar a navegação e o layout, registrar limitações e corrigir falhas encontradas.
- [x] 5. Atualizar README, diário, roteiro e checklist; salvar pacote portátil.

## Pontos de revisão

Valores inválidos não podem virar zero silenciosamente; sugestões não alteram totais; mês sem base não gera percentual inválido; ações repetidas de recorrência não duplicam; navegação durante processamento não deve salvar ou redirecionar inesperadamente.

## Decisões de execução

- Trabalhar na pasta compartilhada em uma branch própria para manter os arquivos acessíveis ao grupo.
- Testes automatizados concentrados nos cálculos e nas operações que afetam dados; aparência e navegação verificadas no navegador.
- Nenhuma publicação externa nesta fase: o destino GitHub ainda não foi informado.

## Verificação e revisão

Modelo verificado com seis testes aprovados; fluxos exercitados no navegador conforme o guia. Revisão independente de código encontrou dois problemas: filtro/comparação com mês fora dos dados iniciais e extração parcial de valores monetários inválidos. Ambos foram corrigidos, com testes que falharam antes da correção e passaram depois, além de conferência no navegador.

Rendering e interações visuais foram verificados pelo implementador. Integrações reais e Expo não foram avaliados, pois não integram o artefato desta etapa. A política de dados em memória foi mantida para deixar clara a simulação; seu limite é perder alterações ao recarregar.
