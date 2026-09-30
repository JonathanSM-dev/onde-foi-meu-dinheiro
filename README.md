# Onde Foi Meu Dinheiro

Aplicativo de finanças pessoais para jovens adultos que desejam registrar gastos com menos esforço e compreender o destino do dinheiro ao longo do mês.

**Proposta:** escrever uma despesa em linguagem natural ou fotografar um cupom, revisar os dados interpretados pela IA e confirmar o lançamento. Receitas, histórico, orçamento por categoria e comparação mensal completam a experiência.

## Equipe

- Cecília Scharnovski
- Hellen Caroline
- Jonathan Silva Machado
- Nicolas da Gama

UTFPR, Campus Dois Vizinhos · Bacharelado em Engenharia de Software · Programação para Dispositivos Móveis · Prof. Dr. Marlon Marcon · 2026/2.

## Situação do projeto

Segunda entrega implementada em [mobile/](mobile/README.md): React Native/Expo, navegação e persistência SQLite local. Consulte o [checklist da etapa 2](docs/ENTREGA-02.md) e as [evidências de teste](docs/TESTES-ENTREGA-02.md). A validação em celular pelo grupo permanece pendente. Autenticação, câmera, IA e sincronização remota ainda não são integrações reais. A primeira entrega permanece preservada abaixo.

**Abra o [protótipo independente](output/Onde-Foi-Meu-Dinheiro-Prototipo.html) no navegador** ou use [prototipo/index.html](prototipo/index.html), mantendo seus arquivos vizinhos. O [pacote ZIP](output/Onde-Foi-Meu-Dinheiro-Entrega-01.zip) reúne documentação, protótipo e fontes. Extraia o ZIP antes de abrir.

**Acessos públicos:** [repositório GitHub](https://github.com/JonathanSM-dev/onde-foi-meu-dinheiro) · [protótipo no navegador](https://jonathansm-dev.github.io/onde-foi-meu-dinheiro/prototipo/).

| Etapa | Prazo informado no enunciado | Resultado esperado |
|---|---|---|
| 1 · Concepção e protótipos | 28/09/2026 | Tema, GitHub, PRD, decisões de arquitetura, protótipo navegável e diário de IA |
| 2 · Telas | 30/10/2026 | Telas implementadas, navegação e persistência local |
| 3 · Aplicativo final | 30/11/2026 | Autenticação, dados remotos, API, câmera e IA funcionais |

As entregas são pelo Moodle até 23h59, com apresentação presencial de 10 minutos por grupo. As datas foram transcritas do enunciado; mudanças comunicadas em aula devem ser incorporadas pela equipe.

## Documentação

- [PDF consolidado da primeira entrega](output/pdf/Onde-Foi-Meu-Dinheiro-Entrega-01.pdf)
- [Modelagem e diagrama de dados](docs/MODELAGEM-DADOS.md)
- [Exemplo de dados fictícios](docs/exemplo-dados.json)
- [PRD: requisitos, regras e escopo](docs/PRD.md)
- [Decisões de arquitetura adotadas](docs/DECISOES-ARQUITETURA.md)
- [Diário de bordo de uso de IA](docs/DIARIO-DE-BORDO.md)
- [Checklist da primeira entrega](docs/ENTREGA-01.md)
- [Guia do protótipo e roteiro de exploração](docs/GUIA-DO-PROTOTIPO.md)
- [Plano de execução do protótipo](docs/PLANO-PROTOTIPO.md)
- [O que enviar no Moodle](docs/ENVIO-MOODLE.md)

## Experiência principal

Início → Novo lançamento → Texto ou foto → Cartão de revisão e edição opcional → Confirmação → Histórico e orçamento atualizados.

A IA sugere os dados; o usuário confirma o que será registrado. O formulário manual permanece disponível quando a câmera ou o serviço de IA não puderem ser usados.

## Organização do trabalho

Quatro frentes propostas: produto e requisitos; experiência e interface; arquitetura e dados; integração e entrega. A distribuição nominal será combinada pela equipe. Todos devem revisar o conjunto e compreender as decisões apresentadas.

## Execução

O protótipo HTML abre por duplo clique e não requer instalação. Inicia em uma conta fictícia para exploração; toque em **AL → Sair da demonstração** para acessar login e cadastro. Recarregar restaura os dados. No celular, o painel de cenários fica abaixo do aplicativo.

Os dados têm data de referência **25/09/2026**. Use os exemplos apresentados; a interpretação de texto é uma simulação local limitada, sem chamadas de IA reais.

Para executar os seis testes do modelo, com Node.js instalado: `node --test prototipo/model.test.cjs`.

Para regenerar o PDF, execute `python scripts/build_pdf.py` com ReportLab e fontes Arial do Windows. Para regenerar HTML independente e ZIP, com Python instalado: `python scripts/build_delivery.py`.

Publicado no GitHub em 26/09/2026, com protótipo disponibilizado pelo GitHub Pages. Confirmação da reserva do tema, revisão conjunta da equipe e submissão no Moodle permanecem pendentes.

## Referências do trabalho

- **Trabalho React Native 2026_2.pdf**, p. 1–4: requisitos gerais, entregas e critérios de avaliação.
- **temas.pdf**, p. 7, tema 9: problema, público, funcionalidades e diferencial de Onde Foi Meu Dinheiro.

Os documentos da disciplina orientam os requisitos acadêmicos. As escolhas de produto e arquitetura são identificadas nos documentos como decisões de projeto, sem atribuí-las ao professor.
