# Site MESTTI

Site institucional e comercial da MESTTI, com soluções para gestão e monitoramento industrial, sensores, programação da produção, qualidade e artigos técnicos.

## Estrutura

HTML, CSS e JavaScript sem framework de frontend. O servidor Node/Express atende o desenvolvimento local e os endpoints de contato. Na Vercel, o build copia os arquivos estáticos para `public/`; os handlers em `api/` atendem os envios.

Principais entradas:

- `/`: apresentação, demonstrações e implantação.
- `/solucoes/`: caminhos por problema da operação.
- `/producao/`, `/sensoriamento/`, `/sequenciamento/`, `/qualidade/`: escopo das soluções industriais.
- `/sensores/`: especificações; `/atuacao/`: catálogo interativo.
- `/checklists/`: rotinas de verificação para diferentes segmentos.
- `/blog/`: conteúdo sobre MES, OEE, coleta, custos e avaliação de sistemas.
- `/empresa/`, `/contato/`, `/termos/`: informações institucionais e canais oficiais.

## Desenvolvimento e configuração

Na raiz deste repositório:

```sh
npm ci
npm run dev
```

O servidor usa `http://127.0.0.1:5500/`; a variável `PORT` permite outra porta. Sirva o site por HTTP: abrir um HTML diretamente no disco não representa suas rotas nem os formulários.

Consulte `.env.example` e [docs/google-sheets-leads.md](docs/google-sheets-leads.md) para a configuração das integrações. Não coloque credenciais nos arquivos públicos. Um teste visual não comprova que e-mail, planilha ou eventos comerciais foram entregues.

## Conteúdo e verificação

```sh
npm run content:sync
npm run check:site
npm test
npm run build
```

- `content:sync`: depois de editar os dicionários `js/i18n-{oee,rkw,sensoriamento}-content.js`, sincroniza o português no HTML dos três artigos. O conteúdo continua legível sem JavaScript; a tradução existente permanece.
- `check:site`: verifica sincronização, metadados, JSON-LD, sitemap, links, fragmentos, recursos, redirects e páginas órfãs.
- `test`: executa os testes existentes da integração de eventos.
- `build`: verifica a sincronização, gera `public/` e valida a saída estática. Não publica o site.

A estratégia, as fontes e os limites estão em [docs/seo/STRATEGY.md](docs/seo/STRATEGY.md). O corpus qualitativo de intenções de compradores fica em [docs/seo/query-intents.json](docs/seo/query-intents.json), e as evidências em [docs/seo/VALIDATION.md](docs/seo/VALIDATION.md).

URLs de conteúdo usam barra final; redirects são explícitos para documentos. `/cmms/` e `/pass/` continuam acessíveis com `noindex`. O preview Vercel da branch `feat/seo-geo-aeo` está desabilitado para que a revisão do PR não publique o trabalho.
