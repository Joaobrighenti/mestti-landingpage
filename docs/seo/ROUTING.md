# Roteamento da publicação

Edite redirects, rewrites e headers em **`site/routing.json`** e rode `npm run site:build`. A tabela `routes` de `vercel.json` é gerada; a checagem de sincronização também cobre esse arquivo. As demais configurações de build e Git continuam em `vercel.json`.

A tabela usa uma ordem única:

1. Headers, com continuação.
2. Redirecionamentos permanentes e normalização das URLs.
3. Arquivos e funções existentes.
4. Rewrites explícitos das páginas, com verificação do destino.
5. Página personalizada com HTTP 404 para caminhos restantes, exceto `/api`.

Na publicação de 09/11/2026, apenas disponibilizar `404.html` não impediu o fallback da hospedagem para a home. Adicionar a 404 a `routes` mantendo `redirects` separados corrigiu o erro, mas antecipou o fallback aos aliases. A Vercel concatena as regras fornecidas em `routes` antes das propriedades de nível superior; por isso a configuração agora gera uma única tabela, sem misturar os formatos.

Referências: [implementação oficial da conversão de rotas](https://github.com/vercel/vercel/blob/main/packages/routing-utils/src/index.ts), [página 404 personalizada](https://vercel.com/kb/guide/custom-404-page).

`tests/vercel-routes.test.js` executa a tabela gerada com os arquivos conhecidos e verifica todos os aliases, normalização, headers, recursos, funções e erro personalizado. Após publicar, conferir também HTTP no domínio público: `/ppcp/` e `/pcp` devem redirecionar, `/oee/` deve retornar sua página e caminhos inexistentes devem responder 404. Não enviar formulários para fazer essa checagem; GET em endpoints POST deve continuar respondendo 405.
