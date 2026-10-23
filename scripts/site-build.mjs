/**
 * Gera as páginas do site a partir de site/:
 *   site/pages/<caminho>.html   HTML-fonte com traduções em data-t-en / data-t-es (ver scripts/site-lib.mjs)
 *   site/partials/*.html        cabeçalho, rodapé e modal, iguais em todas as páginas
 *   site/i18n/chrome.json       textos pt/en/es do cabeçalho, rodapé e modal
 * Saída: <caminho>.html, js/i18n/<página>.js e o bloco "v2" de js/i18n.js. As páginas antigas recebem
 * o cabeçalho e o rodapé dos partials.
 *
 *   node scripts/site-build.mjs          escreve os arquivos
 *   node scripts/site-build.mjs --check  só confere se estão em dia (falha se algo mudou ou faltar tradução)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    LANGS, KINDS, PAGE_HEAD, CHROME_START, CHROME_END, HEADER_OPEN, FOOTER_OPEN,
    startTags, closingIndex, blockAt, modalBlock, pagePath, headerFor, pageDictFile, chromeBlock, unescapeAttr
} from './site-lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = path.join(ROOT, 'site');
const SKIP_DIRS = new Set(['node_modules', 'public', 'site', '.git', '.vercel']);

const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(ROOT, rel));

function listFiles(dir, test, base = dir) {
    const out = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
            if (!SKIP_DIRS.has(entry.name) || dir !== base) out.push(...listFiles(path.join(dir, entry.name), test, base));
        } else if (test(entry.name)) {
            out.push(path.relative(base, path.join(dir, entry.name)));
        }
    }
    return out.sort();
}

/** Monta uma página: partials, traduções em linha → HTML publicado + dicionário. */
export function buildPage(rel, source, partials) {
    const head = source.match(PAGE_HEAD);
    if (!head) throw new Error(`${rel}: falta o comentário <!--@page {...} --> na primeira linha`);
    const meta = JSON.parse(head[1]);
    let html = source.slice(head[0].length)
        .replace('<!-- @header -->', headerFor(partials.header, pagePath(rel)))
        .replace('<!-- @footer -->', partials.footer)
        .replace('<!-- @modal -->', partials.modal);

    const dict = Object.fromEntries(LANGS.map((l) => [l, {}]));
    const problems = [];
    const put = (key, values, where) => {
        if (dict.pt[key] !== undefined && dict.pt[key] !== values.pt) problems.push(`${rel}: chave ${key} repetida com textos diferentes (${where})`);
        LANGS.forEach((l) => {
            if (values[l] === undefined || values[l] === null) problems.push(`${rel}: ${key} sem tradução "${l}" (${where})`);
            dict[l][key] = values[l] ?? '';
        });
    };

    // 1. textos sem elemento (título e descrição da página), na ordem do comentário
    const strings = meta.strings || {};
    const lateKeys = [];
    for (const [key, values] of Object.entries(strings)) {
        if (key.startsWith('meta.')) put(key, values, 'comentário @page');
        else lateKeys.push(key);
    }

    // 2. textos em linha, na ordem do documento; remove os data-t-*
    const tags = startTags(html);
    let out = '';
    let cursor = 0;
    for (const tag of tags) {
        const t = [...tag.attrs.keys()].filter((name) => name.startsWith('data-t-'));
        for (const kind of KINDS) {
            const key = tag.attrs.get(kind.key);
            if (!key || key === '') continue;
            const en = tag.attrs.get(`${kind.prefix}-en`);
            const es = tag.attrs.get(`${kind.prefix}-es`);
            if (en === undefined && es === undefined) continue; // texto do cabeçalho/rodapé ou de outro dicionário
            let pt;
            if (kind.source === 'content') {
                const close = closingIndex(html, tag.tag, tag.end);
                pt = html.slice(tag.end, close);
            } else {
                pt = unescapeAttr(tag.attrs.get(kind.source) ?? '');
            }
            put(key, { pt, en: en === undefined ? undefined : unescapeAttr(en), es: es === undefined ? undefined : unescapeAttr(es) }, `<${tag.tag}>`);
        }
        if (t.length) {
            const clean = tag.raw.replace(/\s+data-t-[a-z-]+="[^"]*"/g, '');
            out += html.slice(cursor, tag.start) + clean;
            cursor = tag.end;
        }
    }
    out += html.slice(cursor);

    // 3. textos sem elemento que não são de meta (usados por scripts), ao fim
    for (const key of lateKeys) put(key, strings[key], 'comentário @page');

    return { html: out, dict, dictFile: meta.dict, problems };
}

/** Troca cabeçalho e rodapé de uma página que não tem fonte em site/pages. */
export function syncLegacy(rel, html, partials) {
    let out = html;
    const h = blockAt(out, HEADER_OPEN, 'header');
    if (h) out = out.slice(0, h.start) + headerFor(partials.header, pagePath(rel)) + out.slice(h.end);
    const f = blockAt(out, FOOTER_OPEN, 'footer');
    if (f) out = out.slice(0, f.start) + partials.footer + out.slice(f.end);
    return out;
}

export function buildAll() {
    const partials = {
        header: fs.readFileSync(path.join(SITE, 'partials/header.html'), 'utf8').replace(/\n$/, ''),
        footer: fs.readFileSync(path.join(SITE, 'partials/footer.html'), 'utf8').replace(/\n$/, ''),
        modal: fs.readFileSync(path.join(SITE, 'partials/modal.html'), 'utf8').replace(/\n$/, '')
    };
    const files = new Map();
    const problems = [];
    const sources = listFiles(path.join(SITE, 'pages'), (n) => n.endsWith('.html'));
    for (const rel of sources) {
        const page = buildPage(rel, fs.readFileSync(path.join(SITE, 'pages', rel), 'utf8'), partials);
        problems.push(...page.problems);
        files.set(rel, page.html);
        files.set(page.dictFile, pageDictFile(page.dict));
    }
    for (const rel of listFiles(ROOT, (n) => n.endsWith('.html'))) {
        if (files.has(rel)) continue;
        const html = read(rel);
        const synced = syncLegacy(rel, html, partials);
        if (synced !== html) files.set(rel, synced);
    }
    const i18n = read('js/i18n.js');
    const a = i18n.indexOf(CHROME_START);
    const b = i18n.indexOf(CHROME_END);
    if (a < 0 || b < 0) problems.push('js/i18n.js: marcadores do bloco v2 não encontrados');
    else {
        const chrome = JSON.parse(fs.readFileSync(path.join(SITE, 'i18n/chrome.json'), 'utf8'));
        files.set('js/i18n.js', i18n.slice(0, a) + chromeBlock(chrome) + i18n.slice(b + CHROME_END.length));
    }
    return { files, problems };
}

function main() {
    const check = process.argv.includes('--check');
    const { files, problems } = buildAll();
    if (problems.length) {
        console.error(problems.join('\n'));
        process.exit(1);
    }
    const changed = [...files].filter(([rel, content]) => !exists(rel) || read(rel) !== content).map(([rel]) => rel);
    if (check) {
        if (changed.length) {
            console.error(`Páginas desatualizadas em relação a site/ (rode npm run site:build):\n  ${changed.join('\n  ')}`);
            process.exit(1);
        }
        console.log(`OK: ${files.size} arquivos em dia com site/.`);
        return;
    }
    for (const rel of changed) {
        fs.mkdirSync(path.dirname(path.join(ROOT, rel)), { recursive: true });
        fs.writeFileSync(path.join(ROOT, rel), files.get(rel));
    }
    console.log(changed.length ? `Gerados ${changed.length} arquivos:\n  ${changed.join('\n  ')}` : 'Nada mudou.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
