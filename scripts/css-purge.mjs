/**
 * Remove do CSS as regras que nenhuma página usa e minifica o resultado.
 *
 * Roda no build de deploy (scripts/vercel-build.mjs), sobre a cópia em public/: os CSS do repositório
 * continuam completos. Uma regra só sai quando NENHUMA classe ou id do seletor aparece como palavra em
 * nenhum HTML, JS, template (scripts/*.mjs), conteúdo do blog ou dicionário do projeto. É uma conta
 * conservadora: basta a palavra existir em qualquer lugar para a regra ficar.
 */
import fs from 'fs';
import path from 'path';

/** Palavras que podem ser nomes de classe ou id, e prefixos montados em JS (`fx-${estado}`, 'cf-' + x). */
export function buildCorpus(root) {
    const files = [];
    const walk = (dir) => {
        for (const name of fs.readdirSync(dir)) {
            if (['node_modules', 'public', '.git', '.vercel'].includes(name)) continue;
            const p = path.join(dir, name);
            const st = fs.statSync(p);
            if (st.isDirectory()) walk(p);
            else if (/\.(html|js|mjs|md|json)$/.test(name)) files.push(p);
        }
    };
    walk(root);
    const tokens = new Set();
    const prefixes = new Set();
    for (const f of files) {
        const text = fs.readFileSync(f, 'utf8');
        for (const m of text.matchAll(/[A-Za-z_][A-Za-z0-9_-]*/g)) tokens.add(m[0]);
        for (const m of text.matchAll(/([A-Za-z][A-Za-z0-9_-]*-)\$\{/g)) prefixes.add(m[1]);
        for (const m of text.matchAll(/['"`]([A-Za-z][A-Za-z0-9_-]*-)['"`]\s*\+/g)) prefixes.add(m[1]);
    }
    return { tokens, prefixes: [...prefixes] };
}

function selectorUsed(sel, { tokens, prefixes }) {
    // Sintaxe complexa pode esconder classes opcionais e vírgulas. Na dúvida, fica inteira.
    if (/[()\[\\]|[^\x00-\x7F]/.test(sel)) return true;
    // :not(), :is(), :where() e :has() não exigem a presença do que está dentro; atributos também não contam.
    let s = sel;
    for (let i = 0; i < 4; i++) s = s.replace(/:(not|is|where|has)\([^()]*\)/g, '');
    s = s.replace(/\[[^\]]*\]/g, '');
    for (const m of s.matchAll(/[.#]([A-Za-z_][A-Za-z0-9_-]*)/g)) {
        const name = m[1];
        if (tokens.has(name)) continue;
        if (prefixes.some((p) => name.startsWith(p))) continue;
        return false;
    }
    return true;
}

/** Índice do `}` que fecha o bloco aberto em `open` (ignora comentários e strings). */
function closeOf(css, open) {
    let depth = 0;
    for (let k = open; k < css.length; k++) {
        const c = css[k];
        if (c === '/' && css[k + 1] === '*') { k = css.indexOf('*/', k + 2) + 1; if (k === 0) return css.length; continue; }
        if (c === '"' || c === "'") { k = stringEnd(css, k); continue; }
        if (c === '\\') { k++; continue; }
        if (c === '{') depth++;
        else if (c === '}' && --depth === 0) return k;
    }
    return css.length;
}

function stringEnd(css, start) {
    for (let i = start + 1; i < css.length; i++) {
        if (css[i] === '\\') i++;
        else if (css[i] === css[start]) return i;
    }
    return css.length - 1;
}

// Delimitadores em strings, funções e atributos não delimitam uma regra CSS.
function nextDelimiter(css, start) {
    let depth = 0;
    for (let i = start; i < css.length; i++) {
        const c = css[i];
        if (c === '"' || c === "'") { i = stringEnd(css, i); continue; }
        if (c === '\\') { i++; continue; }
        if (c === '(' || c === '[') depth++;
        else if (c === ')' || c === ']') depth--;
        else if (!depth && (c === '{' || c === ';')) return i;
    }
    return css.length;
}

const GROUPS = /^@(media|supports|layer|container|document)\b/;

function purgeBlock(css, corpus) {
    const out = [];
    let i = 0;
    while (i < css.length) {
        // pula espaço e comentários
        const ws = css.slice(i).match(/^(\s|\/\*[\s\S]*?\*\/)+/);
        if (ws) { i += ws[0].length; continue; }
        const brace = nextDelimiter(css, i);
        if (brace === css.length || css[brace] === ';') {
            // instrução solta (@import, @charset, ;)
            const end = brace === css.length ? css.length : brace + 1;
            const stmt = css.slice(i, end).trim();
            if (stmt && stmt !== ';') out.push(stmt.endsWith(';') ? stmt : stmt + ';');
            i = end;
            continue;
        }
        const head = css.slice(i, brace).trim();
        const close = closeOf(css, brace);
        const body = css.slice(brace + 1, close);
        if (GROUPS.test(head)) {
            const inner = purgeBlock(body, corpus);
            if (inner) out.push(`${head}{${inner}}`);
        } else if (head.startsWith('@')) {
            out.push(`${head}{${body}}`);
        } else {
            const keep = /[()\[\\]|[^\x00-\x7F]/.test(head) ? [head]
                : head.split(',').map((x) => x.trim()).filter((x) => x && selectorUsed(x, corpus));
            if (keep.length) out.push(`${keep.join(',')}{${body}}`);
        }
        i = close + 1;
    }
    return out.join('');
}

/** Minificação conservadora: tira comentários e espaços que não mudam o significado. */
export function minifyCss(css) {
    // Protege strings antes de remover comentários/espaços: content e data URLs são dados.
    const strings = [];
    let protectedCss = '';
    for (let i = 0; i < css.length; i++) {
        if (css[i] === '"' || css[i] === "'") {
            const end = stringEnd(css, i);
            protectedCss += `\u0000${strings.push(css.slice(i, end + 1)) - 1}\u0000`;
            i = end;
        } else if (css[i] === '/' && css[i + 1] === '*') {
            const end = css.indexOf('*/', i + 2);
            i = end < 0 ? css.length : end + 1;
        } else protectedCss += css[i];
    }
    return protectedCss
        .replace(/\s+/g, ' ')
        .replace(/\s*([{};])\s*/g, '$1')
        .replace(/;}/g, '}')
        .trim()
        .replace(/\u0000(\d+)\u0000/g, (_, n) => strings[Number(n)]);
}

export function purgeCss(css, corpus) {
    return minifyCss(purgeBlock(minifyCss(css), corpus));
}
