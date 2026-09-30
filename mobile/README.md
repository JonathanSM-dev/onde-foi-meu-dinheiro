# Aplicativo · segunda entrega

React Native com Expo SDK 57, TypeScript, Expo Router e SQLite. Código da etapa de telas, navegação e persistência local. O protótipo HTML da primeira entrega continua em `../prototipo/`.

## Executar

Requisitos: Node.js 24 ou superior, npm e Expo Go compatível com SDK 57 no celular. Computador e celular na mesma rede.

```sh
cd mobile
npm ci
npm start
```

Leia o QR code no Expo Go (Android) ou na câmera do iPhone. Caso a versão instalada do Expo Go não aceite SDK 57, use uma versão compatível ou um development build; não altere versões isoladas do React Native. Nenhuma chave ou conta de serviço é necessária nesta etapa.

Para conferir no navegador: `npm run web`. O suporte web do expo-sqlite é experimental; Metro está configurado com WASM e cabeçalhos de isolamento. GitHub Pages continua exibindo o protótipo HTML, não este aplicativo.

## Explorar

1. Entre em **Explorar como Alex**, ou use dados fictícios nos formulários de acesso.
2. O primeiro uso começa vazio. Dados de exemplo são opcionais e só podem ser carregados em uma base nunca utilizada.
3. Registre uma despesa manualmente, por texto demonstrativo ou pelo exemplo de foto. Confira o cartão de revisão antes de confirmar.
4. Consulte, filtre, edite e exclua lançamentos no histórico. Confira os totais no início e no resumo.
5. Defina limites por categoria. Editar um orçamento altera seu limite; outra categoria exige um novo orçamento.
6. Crie uma recorrência e confirme uma ocorrência do mês. O modelo sozinho não altera o saldo; a mesma ocorrência não pode ser confirmada novamente, mesmo após sua exclusão.

Sair ou reiniciar encerra apenas a sessão demonstrativa. Ao entrar novamente, a mesma base SQLite local é utilizada. Todos os perfis de demonstração compartilham `demo-local`; não há isolamento de contas reais. Desinstalar o aplicativo ou limpar seus dados pode apagar o banco. Não há backup remoto nesta etapa.

## Limites explícitos

Login/cadastro são demonstrações: senhas não são armazenadas e não há autenticação real. Texto usa regras locais limitadas; foto usa um exemplo, sem abrir câmera. A explicação do resumo é determinística. Firebase, sincronização, câmera e LLM reais pertencem à entrega final. Não há coleta de dados nem chamadas de IA externas.

Valores são centavos inteiros; datas financeiras usam o calendário local. Lançamentos futuros são rejeitados. Meses de recorrência com menos dias usam o último dia válido.

## Verificar

```sh
npm test
npm run typecheck
npm run lint
npx expo install --check
npx expo-doctor
npx expo export --platform all
```

Os testes de integração usam SQLite real via `node:sqlite`, com o mesmo esquema e SQL do app. Exportar os bundles Android/iOS não gera APK/IPA e não comprova funcionamento em aparelho físico. Consulte [evidências e roteiro do aparelho](../docs/TESTES-ENTREGA-02.md).

Estrutura: `app/` rotas; `src/components/` interface nativa; `src/domain/` regras; `src/data/` migrações e repositório; `src/state/` sessão, consultas e rascunho; `tests/` verificações reproduzíveis.
