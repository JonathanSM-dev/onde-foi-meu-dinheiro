# Segunda entrega · telas, navegação e persistência local

Equipe: Cecília Scharnovski, Hellen Caroline, Jonathan Silva Machado e Nicolas da Gama.

Etapa de codificação das telas · **30/10/2026**.

## Conteúdo implementado

- Login e cadastro demonstrativos, início, novo lançamento, revisão, histórico, detalhes/edição, orçamentos, recorrências e resumo mensal.
- Navegação Expo Router, estados vazios, carregamento, erro e nova tentativa.
- CRUD SQLite de lançamentos, orçamentos e modelos recorrentes; totais calculados a partir dos registros confirmados.
- Revisão obrigatória, cancelamento, proteção contra confirmação duplicada, valores em centavos e datas civis válidas.
- Código, lockfile, testes, instruções de execução e diário de uso de IA.

Autenticação, câmera, interpretação por LLM e sincronização remota continuam simuladas ou adiadas à etapa final. O professor ainda não confirmou se a API da LLM atende também ao requisito de API externa.

## Executar e verificar

O aplicativo está em `mobile/`. Consulte [as instruções de execução](../mobile/README.md) e [os resultados das verificações](TESTES-ENTREGA-02.md).

## Documentação técnica

- [Requisitos do produto](PRD.md)
- [Decisões de arquitetura](DECISOES-ARQUITETURA.md)
- [Modelagem dos dados](MODELAGEM-DADOS.md)
- [Diário de uso de IA](DIARIO-DE-BORDO.md)
