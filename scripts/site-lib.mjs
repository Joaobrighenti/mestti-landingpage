/**
 * Utilitários do gerador de páginas (scripts/site-build.mjs).
 * O HTML-fonte é o próprio HTML publicado, com as traduções ao lado do texto em português:
 *   <h2 data-i18n="v2.inicio.how.1" data-t-en="..." data-t-es="...">Texto em português</h2>
 *   <img alt="..." data-i18n-alt="k" data-t-alt-en="..." data-t-alt-es="...">
 * O build remove os data-t-*, mantém o português no HTML e escreve os dicionários.
 */

export const LANGS = ['pt', 'en', 'es'];

/** atributo de chave → prefixo dos atributos de tradução e de onde vem o texto em português. */
export const KINDS = [
    { key: 'data-i18n', prefix: 'data-t', source: 'content' },
    { key: 'data-i18n-aria', prefix: 'data-t-aria', source: 'aria-label' },
    { key: 'data-i18n-alt', prefix: 'data-t-alt', source: 'alt' },
    { key: 'data-i18n-placeholder', prefix: 'data-t-ph', source: 'placeholder' }
];

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

export const PAGE_HEAD = /^<!--@page (\{[\s\S]*?\}) -->\n/;
export const CHROME_START = '    /* v2: cabeçalho, rodapé e modal (gerado) */\n';
export const CHROME_END = '    /* fim v2 */\n';
export const HEADER_OPEN = '<header class="header header--tractian">';
export const FOOTER_OPEN = '<footer class="footer footer--tractian">';
export const MODAL_OPEN = '    <div id="contactModal" class="modal-overlay"';

export function escapeAttr(value) {
    return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function unescapeAttr(value) {
    return String(value)
        .replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

/** Todas as tags de abertura com posição, nome e atributos (valores ainda escapados). */
export function startTags(html) {
    const out = [];
    const re = /<([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[^\s"'>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*(\/?)>/g;
    let m;
    while ((m = re.exec(html))) {
        const attrs = new Map();
        const attrRe = /([^\s"'>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
        let a;
        while ((a = attrRe.exec(m[2]))) attrs.set(a[1], a[2] ?? a[3] ?? a[4] ?? '');
        out.push({ start: m.index, end: m.index + m[0].length, tag: m[1].toLowerCase(), raw: m[0], attrs });
    }
    return out;
}

/** Fim do conteúdo de um elemento: índice do `</tag>` que fecha a tag aberta em `from`. */
export function closingIndex(html, tag, from) {
    if (VOID.has(tag)) return -1;
    const re = new RegExp(`<(/?)${tag}(?=[\\s>/])[^>]*>`, 'gi');
    re.lastIndex = from;
    let depth = 1;
    let m;
    while ((m = re.exec(html))) {
        if (m[0].endsWith('/>')) continue;
        depth += m[1] ? -1 : 1;
        if (depth === 0) return m.index;
    }
    throw new Error(`</${tag}> não encontrado a partir de ${from}`);
}

/** Bloco que começa em `open` e termina no fechamento correspondente, inclusive. */
export function blockAt(html, open, tag) {
    const i = html.indexOf(open);
    if (i < 0) return null;
    const startEnd = html.indexOf('>', i) + 1;
    const close = closingIndex(html, tag, startEnd);
    return { start: i, end: close + `</${tag}>`.length };
}

/** Modal: do `<div id="contactModal"` até o `</div>` correspondente e a quebra de linha seguinte. */
export function modalBlock(html) {
    const i = html.indexOf(MODAL_OPEN);
    if (i < 0) return null;
    const startEnd = html.indexOf('>', i) + 1;
    const close = closingIndex(html, 'div', startEnd);
    return { start: i, end: close + '</div>'.length };
}

/** Caminho publicado da página a partir do arquivo: index.html → /, x/index.html → /x/. */
export function pagePath(rel) {
    const clean = rel.replace(/\\/g, '/');
    if (clean === 'index.html') return '/';
    return '/' + clean.replace(/index\.html$/, '');
}

/** Cabeçalho com o link do menu da página atual marcado. */
export function headerFor(partial, path) {
    return partial.replace(/(<a href="([^"]+)" class="nav-link")( data-i18n=)/g, (all, head, href, tail) => (
        href === path ? `${head} aria-current="page"${tail}` : all
    ));
}

/** Dicionário da página no formato lido por js/i18n.js. */
export function pageDictFile(dict) {
    return '/* Gerado: textos pt/en/es desta página, mesclados em window.MESTTI_PAGE_I18N (lido por js/i18n.js). */\n'
        + '(function () {\n'
        + `    var d = ${JSON.stringify(dict, null, 1)};\n`
        + '    var g = window.MESTTI_PAGE_I18N = window.MESTTI_PAGE_I18N || {};\n'
        + "    ['pt', 'en', 'es'].forEach(function (l) { g[l] = Object.assign(g[l] || {}, d[l]); });\n"
        + '})();\n';
}

/** Bloco de textos do cabeçalho, rodapé e modal dentro de js/i18n.js. */
export function chromeBlock(chrome) {
    const json = JSON.stringify(chrome, null, 4).split('\n').map((line, i) => (i === 0 ? line : `    ${line}`)).join('\n');
    return CHROME_START
        + '    (function (chrome) {\n'
        + '        SUPPORTED.forEach((lang) => Object.assign(T[lang], chrome[lang] || {}));\n'
        + `    })(${json});\n`
        + CHROME_END;
}

/** Lê um dicionário gerado (js/i18n/<página>.js) executando-o com um window falso. */
export async function readPageDict(code) {
    const { runInNewContext } = await import('node:vm');
    const window = {};
    runInNewContext(code, { window });
    return window.MESTTI_PAGE_I18N;
}
