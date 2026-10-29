/**
 * Versões estáticas em inglês e espanhol (/en/... e /es/...) das páginas que têm fonte em site/pages.
 *
 * O português continua sendo a fonte. A partir da página gerada e dos dicionários (da página, do cabeçalho/rodapé
 * e de js/i18n.js), cada texto com data-i18n é trocado pela tradução já no HTML, junto com título, descrição,
 * canonical, og:*, JSON-LD e links internos. As três versões ganham <link rel="alternate" hreflang> e o rodapé
 * ganha links rastreáveis para os idiomas.
 */
import vm from 'node:vm';
import { startTags, closingIndex, unescapeAttr } from './site-lib.mjs';

export const ORIGIN = 'https://mestti.com.br';
export const LOCALES = ['en', 'es'];
const HTML_LANG = { pt: 'pt-BR', en: 'en', es: 'es' };
const OG_LOCALE = { pt: 'pt_BR', en: 'en_US', es: 'es_ES' };
const LANG_NAME = { pt: 'Português', en: 'English', es: 'Español' };
const FIXED = {
    en: { 'Pular para o conteúdo': 'Skip to content', 'Você está em': 'You are here', 'Neste guia': 'In this guide', 'Idioma': 'Language' },
    es: { 'Pular para o conteúdo': 'Saltar al contenido', 'Você está em': 'Usted está en', 'Neste guia': 'En esta guía', 'Idioma': 'Idioma' }
};

const escText = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => escText(s).replace(/"/g, '&quot;');

/** Carrega o dicionário de js/i18n.js (cabeçalho, rodapé e chaves antigas) sem navegador. */
export function legacyTranslator(source) {
    const noop = () => {};
    const document = { readyState: 'loading', addEventListener: noop, querySelectorAll: () => [], querySelector: () => null, body: { dataset: {}, getAttribute: () => null }, documentElement: {} };
    const sandbox = { window: {}, document, localStorage: { getItem: () => null, setItem: noop }, CustomEvent: function () {} };
    sandbox.window.document = document;
    vm.createContext(sandbox);
    vm.runInContext(source, sandbox);
    const api = sandbox.window.MesttiI18n;
    return (lang, key) => {
        const v = api.t(lang, key);
        return v === key ? undefined : v;
    };
}

/** URL pública de uma página numa língua. */
export const localUrl = (url, lang) => (lang === 'pt' ? url : `/${lang}${url}`);

export function hreflangLinks(url) {
    return ['pt', ...LOCALES].map((l) => `    <link rel="alternate" hreflang="${HTML_LANG[l]}" href="${ORIGIN}${localUrl(url, l)}">`).join('\n')
        + `\n    <link rel="alternate" hreflang="x-default" href="${ORIGIN}${url}">\n`;
}

/** Links do rodapé para as versões da página (ou para a home, se a página só existe em português). */
export function langLinks(url, current, localized) {
    const target = localized.has(url) ? url : '/';
    const items = ['pt', ...LOCALES].map((l) => {
        const href = localUrl(target, l);
        return l === current
            ? `<li><a href="${href}" hreflang="${HTML_LANG[l]}" lang="${HTML_LANG[l]}" aria-current="true">${LANG_NAME[l]}</a></li>`
            : `<li><a href="${href}" hreflang="${HTML_LANG[l]}" lang="${HTML_LANG[l]}">${LANG_NAME[l]}</a></li>`;
    }).join('');
    const label = current === 'pt' ? 'Idioma' : FIXED[current].Idioma;
    return `<nav class="footer-langs" aria-label="${label}"><ul>${items}</ul></nav>`;
}

/** Gera a versão de uma página em `lang`. `t(key)` devolve a tradução ou undefined. */
export function localizePage(html, { url, lang, t, ptText, localized, meta }) {
    let out = html;
    // 1. Conteúdo dos elementos com data-i18n (de trás para frente, para não mexer nos índices ainda não lidos)
    const tags = startTags(out).filter((tag) => tag.attrs.has('data-i18n') && tag.attrs.get('data-i18n'));
    for (const tag of tags.sort((a, b) => b.start - a.start)) {
        const value = t(tag.attrs.get('data-i18n'));
        if (value === undefined) continue;
        const close = closingIndex(out, tag.tag, tag.end);
        if (close < 0) continue;
        const inner = tag.attrs.has('data-i18n-html') ? value : escText(value);
        out = out.slice(0, tag.end) + inner + out.slice(close);
    }
    // 2. Atributos traduzíveis
    out = out.replace(/<[a-zA-Z][^>]*\sdata-i18n-(aria|alt|placeholder)="([^"]+)"[^>]*>/g, (raw, kind, key) => {
        const value = t(key);
        if (value === undefined) return raw;
        const attr = kind === 'aria' ? 'aria-label' : kind;
        const re = new RegExp(`\\s${attr}="[^"]*"`);
        return re.test(raw) ? raw.replace(re, ` ${attr}="${escAttr(value)}"`) : raw.replace(/\s*\/?>$/, (end) => ` ${attr}="${escAttr(value)}"${end}`);
    });
    for (const [pt, tr] of Object.entries(FIXED[lang])) {
        out = out.split(`>${pt}<`).join(`>${tr}<`).split(`aria-label="${pt}"`).join(`aria-label="${tr}"`);
    }
    // 3. Cabeçalho do documento
    out = out.replace('<html lang="pt-BR">', `<html lang="${HTML_LANG[lang]}">`);
    if (meta.title) out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${escText(meta.title)}</title>`).replace(/(<meta property="og:title" content=")[^"]*"/, `$1${escAttr(meta.title)}"`);
    if (meta.description) out = out.replace(/(<meta name="description" content=")[^"]*"/, `$1${escAttr(meta.description)}"`).replace(/(<meta property="og:description" content=")[^"]*"/, `$1${escAttr(meta.description)}"`);
    out = out.replace(/(<meta property="og:locale" content=")[^"]*"/, `$1${OG_LOCALE[lang]}"`).replace(/\s*<meta property="og:locale:alternate"[^>]*>/g, '');
    // 4. JSON-LD: textos iguais ao português viram a tradução; URLs e idioma acompanham
    out = out.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g, (all, open, raw, close) => {
        let data;
        try { data = JSON.parse(raw); } catch { return all; }
        const walk = (v) => {
            if (typeof v === 'string') {
                if (v === 'pt-BR') return HTML_LANG[lang];
                if (v.startsWith(ORIGIN + '/')) {
                    const u = new URL(v);
                    // Organização e site são a mesma entidade nas três línguas.
                    if (['#organization', '#website'].includes(u.hash) || !localized.has(u.pathname)) return v;
                    return ORIGIN + localUrl(u.pathname, lang) + u.hash;
                }
                return ptText.get(v) ?? v;
            }
            if (Array.isArray(v)) return v.map(walk);
            if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]));
            return v;
        };
        return open + JSON.stringify(walk(data)) + close;
    });
    // 5. Links internos para páginas que também existem nesta língua; canonical e og:url
    out = out.replace(/(\shref=")(\/[^"#?]*)([#?][^"]*)?"/g, (all, pre, path, rest = '') => {
        if (!localized.has(path)) return all;
        if (/^\/(css|js|images|img|favicon)/.test(path)) return all;
        return `${pre}${localUrl(path, lang)}${rest}"`;
    });
    out = out.replace(`<link rel="canonical" href="${ORIGIN}${url}">`, `<link rel="canonical" href="${ORIGIN}${localUrl(url, lang)}">`);
    out = out.replace(`<meta property="og:url" content="${ORIGIN}${url}">`, `<meta property="og:url" content="${ORIGIN}${localUrl(url, lang)}">`);
    return out;
}

/** Mapa "texto em português" → tradução, para o JSON-LD (só textos simples, sem marcação). */
export function textMap(dict, lang, chromeT) {
    const m = new Map();
    for (const [key, pt] of Object.entries(dict.pt || {})) {
        const tr = dict[lang]?.[key] ?? chromeT(lang, key);
        if (typeof pt === 'string' && tr && pt !== tr) m.set(unescapeAttr(pt).replace(/<[^>]+>/g, ''), unescapeAttr(tr).replace(/<[^>]+>/g, ''));
    }
    return m;
}
