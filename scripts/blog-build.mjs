/**
 * Blog: content/blog/<slug>.md → blog/<slug>/index.html, blog/index.html e blog/feed.xml.
 *
 * Cada artigo começa com metadados entre linhas "---" (YAML simples) e segue em Markdown:
 *   ## e ### títulos · parágrafos · listas "-" e "1." · "> " citação · tabelas "| a | b |"
 *   **negrito**, *itálico*, `código`, [link](/url) · linhas que começam com "<" passam como HTML.
 * Metadados: title, seo_title, author (joao | leonardo), description, answer, date, updated, topic, mestti, cta, related (lista de URLs),
 * faq (lista de "q:"/"a:"), noindex. Datas em AAAA-MM-DD; "updated" é a data da última revisão real.
 * O texto é só português (o seletor de idioma traduz cabeçalho e rodapé).
 */
import fs from 'node:fs';
import path from 'node:path';

export const ORIGIN = 'https://mestti.com.br';
const ORG = `${ORIGIN}/#organization`;
/** Autores (campo "author" do artigo; padrão: joao). O nome leva à página do autor; sameAs liga ao LinkedIn. */
const LEO_IN = 'https://www.linkedin.com/in/leonardo-ernica-almeida-de-cerqueira-c%C3%A9sar-558a8a1b5/';
export const AUTHORS = {
    joao: { name: 'João Brighenti', jobTitle: 'Fundador', role: 'fundador da Mestti', url: `${ORIGIN}/empresa/`, href: '/empresa/', id: `${ORIGIN}/empresa/#joao-brighenti`, sameAs: ['https://www.linkedin.com/in/jo%C3%A3o-gabriel-brighenti/'], avatar: '<img src="/images/v2/joao-brighenti.webp" alt="" width="40" height="40" loading="eager" decoding="async">' },
    leonardo: { name: 'Leonardo Ernica', jobTitle: 'Cofundador', role: 'cofundador da Mestti', url: LEO_IN, href: LEO_IN, id: `${ORIGIN}/empresa/#leonardo-ernica`, sameAs: [LEO_IN], avatar: '<span class="tp-avatar" aria-hidden="true">LE</span>' }
};
const authorOf = (a) => AUTHORS[a.author || 'joao'];

/** Páginas de tema: nome e URL usados no rótulo do artigo e nos links. */
export const TOPICS = {
    mes: ['Sistema MES', '/mes/'], oee: ['OEE', '/oee/'], pcp: ['PCP e PPCP', '/pcp/'],
    sequenciamento: ['Sequenciamento', '/sequenciamento/'], apontamento: ['Apontamento de produção', '/apontamento-de-producao/'],
    monitoramento: ['Monitoramento de máquinas', '/monitoramento-de-maquinas/'], 'maquinas-antigas': ['Máquinas antigas', '/maquinas-antigas/'],
    'industria-4-0': ['Indústria 4.0', '/industria-4-0/'], ia: ['IA na indústria', '/ia-na-industria/'],
    qualidade: ['Qualidade', '/qualidade/'], custos: ['Custos industriais', '/blog/']
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slugify = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const dateBR = (iso) => iso.split('-').reverse().join('/');

/** YAML mínimo: "chave: valor", listas "  - valor" e listas de pares "  - q: ..." / "    a: ...". */
export function parseFront(text) {
    const meta = {};
    let key = null;
    for (const raw of text.split('\n')) {
        if (!raw.trim()) continue;
        const item = raw.match(/^\s+-\s+(?:(\w+):\s*)?(.*)$/);
        const sub = raw.match(/^\s{3,}(\w+):\s*(.*)$/);
        if (item && key) {
            if (!Array.isArray(meta[key])) meta[key] = [];
            meta[key].push(item[1] ? { [item[1]]: item[2] } : item[2]);
        } else if (sub && key && Array.isArray(meta[key])) {
            meta[key][meta[key].length - 1][sub[1]] = sub[2];
        } else {
            const m = raw.match(/^(\w+):\s*(.*)$/);
            if (!m) throw new Error(`metadado inválido: ${raw}`);
            key = m[1];
            meta[key] = m[2] === '' ? [] : m[2];
        }
    }
    return meta;
}

const inline = (s) => s
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) => `<a href="${u}"${/^https?:/.test(u) ? ' target="_blank" rel="noopener"' : ''}>${t}</a>`);

/** Markdown (subconjunto acima) → HTML. Devolve também os títulos ## para o índice. */
export function markdown(md) {
    const lines = md.replace(/\r/g, '').split('\n');
    const out = [];
    const toc = [];
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        if (!line.trim()) { i++; continue; }
        if (line.startsWith('<')) {
            const block = [];
            while (i < lines.length && lines[i].trim()) block.push(lines[i++]);
            out.push(block.join('\n'));
            continue;
        }
        const h = line.match(/^(#{2,3})\s+(.*)$/);
        if (h) {
            const text = inline(h[2]);
            const id = slugify(h[2]);
            out.push(`<h${h[1].length} id="${id}">${text}</h${h[1].length}>`);
            i++;
            continue;
        }
        if (/^\|/.test(line)) {
            const rows = [];
            while (i < lines.length && /^\|/.test(lines[i])) rows.push(lines[i++]);
            const cells = (r) => r.replace(/^\||\|$/g, '').split('|').map((c) => inline(c.trim()));
            const [headRow, , ...body] = rows;
            out.push(`<div class="bp-table"><table><thead><tr>${cells(headRow).map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody>${body.map((r) => `<tr>${cells(r).map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
            continue;
        }
        if (/^>\s?/.test(line)) {
            const q = [];
            while (i < lines.length && /^>\s?/.test(lines[i])) q.push(lines[i++].replace(/^>\s?/, ''));
            out.push(`<blockquote><p>${inline(q.join(' '))}</p></blockquote>`);
            continue;
        }
        const ul = /^-\s+/, ol = /^\d+\.\s+/;
        if (ul.test(line) || ol.test(line)) {
            const ordered = ol.test(line);
            const re = ordered ? ol : ul;
            const items = [];
            while (i < lines.length && re.test(lines[i])) items.push(inline(lines[i++].replace(re, '')));
            out.push(`<${ordered ? 'ol' : 'ul'}>${items.map((t) => `<li>${t}</li>`).join('')}</${ordered ? 'ol' : 'ul'}>`);
            continue;
        }
        const para = [];
        while (i < lines.length && lines[i].trim() && !/^(#{2,3}\s|\||>|-\s|\d+\.\s|<)/.test(lines[i])) para.push(lines[i++]);
        out.push(`<p>${inline(para.join(' '))}</p>`);
    }
    // Índice a partir de todos os <h2>, inclusive os que vieram em HTML: garante um id em cada um.
    // Um <h2> logo no início de <section id="..."> usa o id da seção (sem duplicar).
    const html = out.join('\n').replace(/(<section\b[^>]*\bid="([^"]+)"[^>]*>\s*(?:<div[^>]*>\s*)?)?<h2([^>]*)>([\s\S]*?)<\/h2>/g, (all, open, sectionId, attrs, text) => {
        const plain = text.replace(/<[^>]+>/g, '').trim();
        const own = (attrs.match(/id="([^"]+)"/) || [])[1];
        const id = own || sectionId || slugify(plain);
        if (!toc.some((t) => t.id === id)) toc.push({ id, text: plain });
        return own || sectionId ? all : `<h2 id="${id}"${attrs}>${text}</h2>`;
    });
    return { html, toc };
}

export function readArticles(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort().map((file) => {
        const src = fs.readFileSync(path.join(dir, file), 'utf8');
        const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        if (!m) throw new Error(`content/blog/${file}: faltam os metadados entre "---"`);
        const meta = parseFront(m[1]);
        const slug = file.replace(/\.md$/, '');
        for (const k of ['title', 'description', 'answer', 'date', 'topic']) if (!meta[k]) throw new Error(`content/blog/${file}: falta "${k}"`);
        if (!TOPICS[meta.topic]) throw new Error(`content/blog/${file}: tema desconhecido "${meta.topic}"`);
        const body = markdown(m[2]);
        const words = m[2].replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
        return { ...meta, slug, url: `/blog/${slug}/`, updated: meta.updated || meta.date, body, minutes: Math.max(2, Math.round(words / 200)), related: meta.related || [], faq: meta.faq || [] };
    }).sort((a, b) => (b.date + b.slug).localeCompare(a.date + a.slug));
}

const HEAD = (title, desc, url, type, ld, extra = '') => `<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <!-- Google tag (gtag.js), carregado depois da página -->
    <script>addEventListener('load',function(){setTimeout(function(){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=AW-11486484316';document.head.appendChild(s)},1200)})</script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-9K4NZHC0WT');
        gtag('config', 'AW-11486484316');
    </script>
    <script src="/js/theme-init.js?v=2"></script>
    <meta name="color-scheme" content="light">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, interactive-widget=resizes-content">
    <meta name="description" content="${esc(desc)}">
    <title>${esc(title)}</title>
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" sizes="any">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Condensed:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/site.css?v=2">
    <link rel="stylesheet" href="/css/v2.css?v=2">
    <link rel="stylesheet" href="/css/v3.css?v=35">
    <link rel="stylesheet" href="/css/v3-mobile.css?v=18">
    <link rel="stylesheet" href="/css/v3-topic.css?v=5">
    <link rel="stylesheet" href="/css/v3-blog.css?v=2">
    <link rel="canonical" href="${ORIGIN}${url}">
    <link rel="alternate" type="application/atom+xml" title="Blog da Mestti" href="${ORIGIN}/blog/feed.xml">
    <meta property="og:type" content="${type}">
    <meta property="og:site_name" content="MESTTI">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(desc)}">
    <meta property="og:url" content="${ORIGIN}${url}">
    <meta property="og:image" content="${ORIGIN}/images/v2/monitoramento-cards.webp">
    <meta property="og:locale" content="pt_BR">
    <meta name="twitter:card" content="summary_large_image">${extra}
    <script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
`;

const SCRIPTS = `    <script defer src="/js/i18n.js?v=30"></script>
    <script defer src="/js/theme.js?v=3"></script>
    <script defer src="/js/form-options.js?v=4"></script>
    <script defer src="/js/meta-consent.js?v=7"></script>
    <script defer src="/js/meta-pixel.js?v=1"></script>
    <script defer src="/js/script.js?v=44"></script>
    <script defer src="/js/wa-chat-viewport.js?v=4"></script>
    <script defer src="/js/conversational-form.js?v=17"></script>
    <script defer src="/js/v2.js?v=16"></script>
</body>

</html>
`;

const byline = (a) => { const au = authorOf(a); const ext = au.href.startsWith('http') ? ' target="_blank" rel="author noopener"' : ' rel="author"'; return `<div class="tp-byline">${au.avatar}<p>Por <a href="${au.href}"${ext}>${au.name}</a>, ${au.role}<span aria-hidden="true"> · </span>Revisado em <time datetime="${a.updated}">${dateBR(a.updated)}</time><span aria-hidden="true"> · </span>${a.minutes} min de leitura</p></div>`; };

function articlePage(a, all, chrome) {
    const [topicName, topicUrl] = TOPICS[a.topic];
    const url = a.url;
    const relatedLinks = [topicUrl, ...a.related].filter((u, i, arr) => arr.indexOf(u) === i && u !== url && u !== '/blog/');
    const label = (u) => {
        const art = all.find((x) => x.url === u);
        if (art) return [art.title, art.description];
        const topic = Object.values(TOPICS).find(([, tu]) => tu === u);
        return topic ? [topic[0], 'Guia completo sobre o tema.'] : [u, ''];
    };
    const ld = { '@context': 'https://schema.org', '@graph': [
        { '@type': 'WebPage', '@id': `${ORIGIN}${url}#webpage`, url: `${ORIGIN}${url}`, name: a.seo_title || a.title, description: a.description, inLanguage: 'pt-BR', isPartOf: { '@id': `${ORIGIN}/#website` }, breadcrumb: { '@id': `${ORIGIN}${url}#breadcrumb` } },
        { '@type': 'BlogPosting', '@id': `${ORIGIN}${url}#article`, headline: a.title, description: a.description, inLanguage: 'pt-BR', mainEntityOfPage: { '@id': `${ORIGIN}${url}#webpage` }, datePublished: a.date, dateModified: a.updated,
          author: { '@type': 'Person', '@id': authorOf(a).id, name: authorOf(a).name, jobTitle: authorOf(a).jobTitle, url: authorOf(a).url, sameAs: authorOf(a).sameAs, worksFor: { '@id': ORG } }, publisher: { '@id': ORG }, image: `${ORIGIN}/images/v2/monitoramento-cards.webp`, about: { '@type': 'Thing', name: topicName }, isPartOf: { '@id': `${ORIGIN}/blog/#blog` } },
        { '@type': 'BreadcrumbList', '@id': `${ORIGIN}${url}#breadcrumb`, itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Início', item: `${ORIGIN}/` },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${ORIGIN}/blog/` },
            { '@type': 'ListItem', position: 3, name: a.title, item: `${ORIGIN}${url}` }] },
        ...(a.faq.length ? [{ '@type': 'FAQPage', '@id': `${ORIGIN}${url}#faq`, mainEntity: a.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }] : []),
        { '@type': 'Organization', '@id': ORG, name: 'MESTTI', url: `${ORIGIN}/` }] };
    const toc = a.body.toc.map((t) => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join('');
    const faq = a.faq.length ? `<section class="bp-faq" id="perguntas" aria-labelledby="bp-faq-title"><h2 id="bp-faq-title">Perguntas frequentes</h2><div class="hv-faq-list">${a.faq.map((f) => `<details><summary>${esc(f.q)}</summary><p>${inline(esc(f.a))}</p></details>`).join('')}</div></section>` : '';
    const rel = relatedLinks.slice(0, 4).map((u) => { const [t, d] = label(u); return `<li><a class="tp-related-card" href="${u}"><strong>${esc(t)}</strong><span>${esc(d)}</span></a></li>`; }).join('');
    const robots = a.noindex ? '\n    <meta name="robots" content="noindex,follow">' : '';
    return HEAD(a.seo_title || `${a.title} | Mestti`, a.description, url, 'article', ld, robots) + `
<body class="hv-page" data-page="blog-artigo">
    <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <div class="nav-overlay" id="navOverlay"></div>

    ${chrome.header}
    <main id="conteudo" tabindex="-1" class="hv tp bp">

    <section class="tp-hero" aria-labelledby="tp-title">
        <div class="hv-wrap tp-hero-grid">
            <div class="tp-hero-copy">
                <nav class="tp-crumbs" aria-label="Você está em"><a href="/">Início</a> <span aria-hidden="true">/</span> <a href="/blog/">Blog</a></nav>
                <p class="tp-overline"><a href="${topicUrl}">${esc(topicName)}</a></p>
                <h1 id="tp-title">${esc(a.title)}</h1>
                ${byline(a)}
            </div>
            <aside class="tp-answer" aria-labelledby="tp-answer-title">
                <p class="tp-answer-label" id="tp-answer-title">Resposta curta</p>
                <p class="tp-answer-text">${inline(esc(a.answer))}</p>
                <div class="tp-answer-cta"><button type="button" class="hv-btn hv-btn--primary btn-open-modal" data-cta="blog-${a.slug}-topo">${esc(a.cta || 'Quero 1 semana grátis')}</button><p class="hv-cta-micro">1 semana grátis, com o sensor emprestado.</p></div>
            </aside>
        </div>
    </section>

    <div class="hv-wrap bp-layout">
        ${toc ? `<nav class="bp-toc" aria-label="Neste artigo"><p class="tp-toc-title">Neste artigo</p><ol>${toc}</ol></nav>` : '<div></div>'}
        <article class="bp-body">
${a.body.html}
            ${a.mestti ? `<aside class="bp-mestti" aria-label="Como a Mestti ajuda"><p class="tp-answer-label">Na Mestti</p><p>${inline(esc(a.mestti))}</p><button type="button" class="hv-btn hv-btn--primary btn-open-modal" data-cta="blog-${a.slug}-meio">Ver isso na minha fábrica</button></aside>` : ''}
            ${faq}
        </article>
    </div>

    <section class="hv-section tp-section tp-related" aria-labelledby="tp-rel-title">
        <div class="hv-wrap">
            <h2 id="tp-rel-title">Continue lendo</h2>
            <ul class="tp-related-list">${rel}</ul>
        </div>
    </section>

    <section class="hv-final" aria-labelledby="tp-final-title">
        <div class="hv-wrap hv-final-inner">
            <h2 id="tp-final-title">Veja os números reais da sua fábrica em 1 semana.</h2>
            <div class="hv-hero-actions"><button type="button" class="hv-btn hv-btn--primary btn-open-modal" data-cta="blog-${a.slug}-final">Quero 1 semana grátis</button><p class="hv-cta-micro">Se não servir, retiramos o sensor e você não paga nada.</p></div>
        </div>
    </section>
    </main>
    ${chrome.footer}

${chrome.modal}

` + SCRIPTS;
}

function indexPage(list, chrome, extra) {
    const url = '/blog/';
    const items = [...list.filter((a) => !a.noindex), ...extra].sort((a, b) => (b.date + b.url).localeCompare(a.date + a.url));
    const ld = { '@context': 'https://schema.org', '@graph': [
        { '@type': 'Blog', '@id': `${ORIGIN}/blog/#blog`, url: `${ORIGIN}/blog/`, name: 'Blog da Mestti', description: 'Guias práticos de produção industrial: OEE, PCP, sequenciamento, apontamento, paradas e qualidade.', inLanguage: 'pt-BR', publisher: { '@id': ORG },
          blogPost: items.map((a) => ({ '@type': 'BlogPosting', headline: a.title, url: `${ORIGIN}${a.url}`, datePublished: a.date })) },
        { '@type': 'BreadcrumbList', '@id': `${ORIGIN}/blog/#breadcrumb`, itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Início', item: `${ORIGIN}/` },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${ORIGIN}/blog/` }] },
        { '@type': 'Organization', '@id': ORG, name: 'MESTTI', url: `${ORIGIN}/` }] };
    const guides = ['mes', 'oee', 'pcp', 'sequenciamento', 'apontamento', 'monitoramento', 'maquinas-antigas', 'industria-4-0', 'ia'].map((k) => `<li><a href="${TOPICS[k][1]}">${TOPICS[k][0]}</a></li>`).join('');
    const cards = items.map((a) => `<li><a class="bp-card" href="${a.url}"><span class="bp-card-topic">${esc(TOPICS[a.topic][0])}</span><strong>${esc(a.title)}</strong><span class="bp-card-desc">${esc(a.description)}</span><span class="bp-card-meta"><time datetime="${a.date}">${dateBR(a.date)}</time>${a.minutes ? ` · ${a.minutes} min` : ''}</span></a></li>`).join('');
    return HEAD('Blog da Mestti: produção, PCP, OEE e chão de fábrica | Mestti', 'Guias práticos para quem gerencia produção industrial: OEE, PCP, sequenciamento, apontamento, paradas, setup, qualidade e custos, escritos por quem constrói a Mestti.', url, 'website', ld) + `
<body class="hv-page" data-page="blog">
    <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <div class="nav-overlay" id="navOverlay"></div>

    ${chrome.header}
    <main id="conteudo" tabindex="-1" class="hv tp bp">

    <section class="tp-hero bp-index-hero" aria-labelledby="tp-title">
        <div class="hv-wrap">
            <nav class="tp-crumbs" aria-label="Você está em"><a href="/">Início</a> <span aria-hidden="true">/</span> <span aria-current="page">Blog</span></nav>
            <p class="tp-overline">Blog da Mestti</p>
            <h1 id="tp-title">Guias práticos para quem gerencia produção.</h1>
            <p class="bp-index-lead">OEE, PCP, sequenciamento, apontamento, paradas e qualidade, explicados com exemplos de chão de fábrica.</p>
        </div>
    </section>

    <nav class="tp-toc" aria-label="Guias por tema">
        <div class="hv-wrap"><p class="tp-toc-title">Guias por tema</p><ol>${guides}</ol></div>
    </nav>

    <section class="hv-section tp-section" aria-labelledby="bp-list-title">
        <div class="hv-wrap">
            <div class="hv-head"><h2 id="bp-list-title">Artigos</h2><p class="hv-lead"><a class="hv-link" href="/blog/feed.xml">Assine o feed</a> para receber os novos artigos.</p></div>
            <ul class="bp-cards">${cards}</ul>
        </div>
    </section>

    <section class="hv-final" aria-labelledby="tp-final-title">
        <div class="hv-wrap hv-final-inner">
            <h2 id="tp-final-title">Leu o suficiente? Veja na sua fábrica.</h2>
            <div class="hv-hero-actions"><button type="button" class="hv-btn hv-btn--primary btn-open-modal" data-cta="blog-indice-final">Quero 1 semana grátis</button><p class="hv-cta-micro">Sensores prontos em até 7 dias. Instalação em 1 dia.</p></div>
        </div>
    </section>
    </main>
    ${chrome.footer}

${chrome.modal}

` + SCRIPTS;
}

function feed(list, extra) {
    const items = [...list.filter((a) => !a.noindex), ...extra].sort((a, b) => (b.updated + b.url).localeCompare(a.updated + a.url));
    const updated = items.reduce((m, a) => (a.updated > m ? a.updated : m), '2000-01-01');
    const entries = items.map((a) => `  <entry>
    <title>${esc(a.title)}</title>
    <link href="${ORIGIN}${a.url}"/>
    <id>${ORIGIN}${a.url}</id>
    <published>${a.date}T00:00:00-03:00</published>
    <updated>${a.updated}T00:00:00-03:00</updated>
    <author><name>${(AUTHORS[a.author || 'joao'] || AUTHORS.joao).name}</name></author>
    <summary>${esc(a.description)}</summary>
  </entry>`).join('\n');
    return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="pt-BR">
  <title>Blog da Mestti</title>
  <subtitle>Guias práticos de produção industrial: OEE, PCP, sequenciamento, apontamento, paradas e qualidade.</subtitle>
  <link href="${ORIGIN}/blog/"/>
  <link rel="self" href="${ORIGIN}/blog/feed.xml"/>
  <id>${ORIGIN}/blog/</id>
  <updated>${updated}T00:00:00-03:00</updated>
${entries}
</feed>
`;
}

/**
 * Gera os arquivos do blog. "extra" são artigos que ainda não estão em Markdown (só entram no índice e no feed).
 * Devolve { files: Map, dates: { url: data } } para o sitemap.
 */
export function buildBlog(root, chromeFor) {
    const list = readArticles(path.join(root, 'content/blog'));
    const extra = JSON.parse(fs.readFileSync(path.join(root, 'content/blog/_outros.json'), 'utf8'));
    const files = new Map();
    const dates = {};
    for (const a of list) {
        files.set(`blog/${a.slug}/index.html`, articlePage(a, list, chromeFor(a.url)));
        if (!a.noindex) dates[a.url] = a.updated;
    }
    files.set('blog/index.html', indexPage(list, chromeFor('/blog/'), extra));
    files.set('blog/feed.xml', feed(list, extra));
    dates['/blog/'] = [...list.filter((a) => !a.noindex), ...extra].reduce((m, a) => (a.updated > m ? a.updated : m), '2000-01-01');
    return { files, dates, articles: [...list.filter((a) => !a.noindex), ...extra] };
}
