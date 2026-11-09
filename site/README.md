# Fontes das páginas (gerador PT/EN/ES)

As 11 páginas do site novo (home, produção, engenharia, qualidade, Otto, empresa, caso moveleiro, diagnóstico,
segurança, glossário e MES ou ERP) são geradas a partir desta pasta. **Edite aqui, nunca o HTML publicado.**

```
site/pages/<caminho>.html   uma fonte por página (mesmo caminho da página publicada)
site/partials/header.html   cabeçalho de todas as páginas (inclusive as antigas)
site/partials/footer.html   rodapé de todas as páginas (inclusive as antigas)
site/partials/modal.html    modal "1 semana grátis" das páginas novas
site/i18n/chrome.json       textos pt/en/es do cabeçalho, rodapé e modal
```

Depois de editar:

```bash
npm run site:build   # gera <caminho>.html, js/i18n/<página>.js e o bloco v2 de js/i18n.js
npm run site:check   # só confere (também roda em npm run check:site e em npm test)
```

## Como escrever um texto traduzível

O português fica no próprio HTML. O inglês e o espanhol ficam em atributos ao lado, que o build remove:

```html
<h2 data-i18n="v2.inicio.how.1" data-t-en="From the part on file…" data-t-es="De la pieza registrada…">Da peça cadastrada…</h2>
```

| Onde está o texto | Chave | Traduções |
| --- | --- | --- |
| conteúdo do elemento | `data-i18n="k"` | `data-t-en`, `data-t-es` |
| conteúdo com `<strong>`, `<em>` etc. | `data-i18n="k" data-i18n-html` | `data-t-en`, `data-t-es` (com a mesma marcação) |
| `aria-label` | `data-i18n-aria="k"` | `data-t-aria-en`, `data-t-aria-es` |
| `alt` de imagem | `data-i18n-alt="k"` | `data-t-alt-en`, `data-t-alt-es` |
| `placeholder` | `data-i18n-placeholder="k"` | `data-t-ph-en`, `data-t-ph-es` |

Regras:

- Texto novo pede chave nova e única na página (ex.: `v2.inicio.calc.20`). Duas chaves iguais com textos diferentes
  quebram o build.
- Faltou `en` ou `es`? O build para e diz qual chave. Escape `"` como `&quot;` e `&` como `&amp;` dentro dos atributos.
- Título e descrição da página (`meta.<página>.title` / `.description`) e textos usados só por script ficam no
  comentário `<!--@page {...} -->` da primeira linha, com `pt`, `en` e `es`.
- `<!-- @header -->`, `<!-- @footer -->` e `<!-- @modal -->` são trocados pelos partials. O link do menu da página
  atual recebe `aria-current="page"` sozinho.
- Textos do cabeçalho, rodapé e modal com chave `nav.v2.*`, `footer.v2.*`, `header.demo` e `modal.*` são editados em
  `i18n/chrome.json`. As demais chaves antigas do cabeçalho continuam em `js/i18n.js`.
- As demos interativas (monitoramento, Gantt, fábrica 3D) têm os textos dentro de `js/home-demos.js` e
  `js/fabrica-sim.js`, nos dicionários `GX`/`TX` de cada arquivo.
