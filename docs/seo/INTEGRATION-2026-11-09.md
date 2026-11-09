# Integração do site novo com a main — 09/11/2026

Integração preparada na branch `feat/seo-geo-aeo-v2` a partir de `bced8a2` e da main `982b1d5`. O PR #3 passa a reunir o site do PR #2, a evolução SEO/AEO/GEO e as mudanças posteriores da main. A publicação do conjunto foi autorizada pelo responsável nesta sessão.

## Resolução dos conflitos

- Páginas geradas foram reconstruídas a partir de `site/pages`, partials e conteúdo do blog, preservando as páginas novas, traduções, metadados, redirecionamentos canônicos e 404.
- O conteúdo textual de Termos, Privacidade do app, Cookies e Privacidade do site foi comparado com a main: os quatro documentos foram preservados. O layout de leitura dos documentos da main foi mantido. Agora todos têm fontes no gerador.
- O rodapé inclui os quatro documentos. Foram mantidas as rotas de Cookies e Privacidade do site e suas datas editoriais de 30/10.
- Mantido o consentimento independente de análise e marketing da main. O carregamento direto de tags Google foi removido dos templates e das páginas novas; o loader condicionado à escolha é incluído depois do gerenciador de consentimento.
- Preservados o envio de dados à planilha por POST, a validação da resposta, a recusa de progresso parcial e a proteção dos cookies Meta sem autorização. O formulário de chat mantém o aviso de privacidade e as melhorias de interface do site novo.
- O teste de cobertura de consentimento percorre todos os documentos pertinentes e valida a ordem dos scripts; não depende da contagem antiga de 23 documentos.
- Nenhum catch-all para a home foi introduzido. Aliases antigos continuam redirecionando para as páginas atuais, sem restaurar páginas removidas. O bloqueio de deploy das branches de desenvolvimento permanece; a main não está bloqueada por essa configuração.

## Validação

- `node --test --test-isolation=none tests`: **43 testes aprovados**, incluindo os testes de consentimento, privacidade dos leads e encaminhamento para a planilha trazidos da main.
- `npm run check:site` e `npm run build`: aprovados, com **101 páginas regulares e 97 URLs indexáveis**, além da 404.
- Comparação automatizada do texto do `<main>` dos quatro documentos legais com `origin/main`: igualdade após normalizar marcação e espaços.
- Sintaxe de servidor, scripts do formulário e consentimento conferida. `git diff --check` sem erros.
- Nove cenários em Chromium: home desktop/mobile; termos desktop/mobile; privacidade do app, privacidade do site e cookies mobile; 404 mobile; OEE EN mobile. Sem exceções de JavaScript, imagens visíveis quebradas ou transbordamento horizontal. Nenhuma diferença nas propriedades CSS amostradas entre fonte e saída otimizada.
- Nos nove cenários, nenhuma tentativa de carregar Google/Meta antes de consentimento. Com análise autorizada, apenas o identificador GA foi configurado; com marketing autorizado, apenas o identificador Ads. Os domínios de terceiros estavam bloqueados durante o teste, sem envio de eventos ou formulários reais.
- A sonda de links detectou seis cópias visuais do carrossel de apoiadores no mobile; `js/v2.js` marca seus ancestrais com `aria-hidden="true"`, remove a alternativa duplicada e usa `tabindex="-1"`. Não são links expostos na árvore de acessibilidade. A sonda geométrica não exclui ancestrais ocultos dessa árvore.
- Express local: URL inexistente respondeu 404; páginas existentes responderam 200; normalização de `/privacidade` respondeu 301; `index.md` manteve `X-Robots-Tag: noindex`.

Evidências: [navegador e consentimento](evidence/integration-2026-11-09/browser.json), [termos mobile](evidence/integration-2026-11-09/termos-390.png), [cookies mobile](evidence/integration-2026-11-09/cookies-390.png), [home mobile](evidence/integration-2026-11-09/home-390.png).

Esse registro valida a preparação do merge. O deploy e o comportamento do provedor em produção exigem conferência após o merge; testes locais não comprovam publicação ou indexação. O diagnóstico SEO anterior continua em `REVIEW-2026-11-09.md`, com as contagens da etapa anterior à integração dos dois documentos adicionais.
