// Validação offline do HTML que será entregue; não substitui Search Console ou QA no navegador.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '.');
const origin = 'https://mestti.com.br';
const errors = [];
const pages = new Map();
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(["'])([\s\S]*?)\2/g)].map(m => [m[1], m[3]]));
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(m => attrs(m[0]));
function walk(dir) {
  for (const file of fs.readdirSync(dir, { withFileTypes: true })) {
    if (file.name.startsWith('.') || ['node_modules', 'public', 'docs', 'tests', 'scripts', 'lib', 'api'].includes(file.name)) continue;
    const full = path.join(dir, file.name);
    if (file.isDirectory()) walk(full);
    else if (file.name === 'index.html') {
      const rel = path.relative(root, path.dirname(full)).split(path.sep).join('/');
      pages.set('/' + (rel ? rel + '/' : ''), { html: fs.readFileSync(full, 'utf8'), full });
    }
  }
}
walk(root);
const fail = (url, message) => errors.push(`${url}: ${message}`);
const strip = html => html.replace(/<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const titles = new Set();
for (const [url, page] of pages) {
  const { html } = page;
  page.indexable = !tags(html, 'meta').some(a => a.name === 'robots' && /noindex/i.test(a.content));
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1];
  if (!title || titles.has(title)) fail(url, 'título ausente ou duplicado');
  titles.add(title);
  const canonical = tags(html, 'link').filter(a => a.rel === 'canonical');
  if (canonical.length !== 1 || canonical[0].href !== origin + url) fail(url, 'canonical inconsistente');
  if (!tags(html, 'meta').some(a => a.name === 'description' && a.content?.length > 40)) fail(url, 'descrição ausente');
  if (tags(html, 'main').length !== 1 || tags(html, 'h1').length !== 1) fail(url, 'verificar main/h1');
  if (!/^<!doctype html>/i.test(html.trim()) || !tags(html, 'html').some(a => a.lang === 'pt-BR')) fail(url, 'documento/idioma ausente');
  if (/[ÃÂ][\u0080-\u00bf]|inspeÃ|produÃ|\uFFFD/.test(html)) fail(url, 'possível corrupção de caracteres');
  if (/data-i18n-html\s*>\s*<\/div>/.test(html)) fail(url, 'conteúdo depende de JS');
  const ids = tags(html, '[a-z][a-z0-9-]*').map(a => a.id).filter(Boolean);
  page.ids = new Set(ids);
  if (ids.length !== page.ids.size) fail(url, 'IDs duplicados');
  const metas = tags(html, 'meta');
  for (const key of ['og:title', 'og:description', 'og:url', 'og:image']) {
    const matches = metas.filter(a => a.property === key);
    if (matches.length !== 1 || !matches[0].content) fail(url, `metadado ${key} ausente/duplicado`);
    if (key === 'og:url' && matches[0]?.content !== origin + url) fail(url, 'URL social divergente');
  }
  const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  if (!schemas.length) fail(url, 'JSON-LD ausente');
  for (const [, raw] of schemas) {
    try {
      const data = JSON.parse(raw);
      if (data['@context'] !== 'https://schema.org') fail(url, 'contexto schema inválido');
      for (const node of data['@graph'] || [data]) {
        if (!node['@type']) fail(url, 'tipo schema ausente');
        // Política editorial local; Google trata as datas de Article como recomendadas.
        // Um rascunho não deve inventar a data da primeira publicação para passar aqui.
        if (node['@type'] === 'Article' && (!node.headline || !node.author || !node.mainEntityOfPage)) fail(url, 'Article incompleto');
        if (node['@type'] === 'BreadcrumbList') {
          const list = node.itemListElement;
          if (!list?.length || list.some((n, i) => n.position !== i + 1 || !n.name || !n.item?.startsWith(origin)) || list.at(-1).item !== origin + url) fail(url, 'breadcrumb inconsistente');
        }
      }
    } catch (e) { fail(url, `JSON-LD inválido: ${e.message}`); }
  }
  if (url !== '/blog/' && url.startsWith('/blog/') && strip(html.match(/<article\b[\s\S]*?<\/article>/)?.[0] || '').length < 1000) fail(url, 'artigo sem corpo estático suficiente para leitura');
}
// Links, recursos e fragmentos inclusive entre páginas (sem depender do sitemap para descobrir órfãs).
const edges = new Map();
for (const [url, { html }] of pages) {
  const links = [];
  for (const a of tags(html, 'a')) if (a.href) links.push({ ref: a.href, anchor: true });
  for (const tag of ['img', 'script', 'source', 'video', 'link']) {
    for (const a of tags(html, tag)) {
      const ref = tag === 'link' ? a.href : a.src;
      if (ref) links.push({ ref });
      if (a.poster) links.push({ ref: a.poster });
    }
  }
  edges.set(url, []);
  for (const { ref, anchor } of links) {
    if (/^(?:mailto:|tel:|javascript:|data:)/i.test(ref)) continue;
    let target;
    try { target = new URL(ref.replaceAll('&amp;', '&'), origin + url); } catch { fail(url, `URL inválida: ${ref}`); continue; }
    if (target.origin !== origin) continue;
    if (target.pathname === '/download-app' || target.pathname === '/download-app/') continue;
    if (pages.has(target.pathname)) {
      if (anchor) edges.get(url).push(target.pathname);
      if (anchor && target.hash && !pages.get(target.pathname).ids.has(decodeURIComponent(target.hash.slice(1)))) fail(url, `fragmento inexistente: ${ref}`);
    } else {
      const resource = path.join(root, decodeURIComponent(target.pathname));
      if (!fs.existsSync(resource) || fs.statSync(resource).isDirectory()) fail(url, `destino inexistente: ${ref}`);
    }
  }
}
const reachable = new Set(['/']);
for (const url of reachable) for (const next of edges.get(url) || []) reachable.add(next);
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const listed = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
if (!sitemap.includes('http://www.sitemaps.org/schemas/sitemap/0.9') || new Set(listed).size !== listed.length) fail('sitemap', 'namespace/duplicação');
for (const [url, page] of pages) {
  if (page.indexable !== listed.includes(origin + url)) fail(url, 'indexabilidade divergente do sitemap');
  if (page.indexable && !reachable.has(url)) fail(url, 'página órfã a partir da home');
}
for (const url of listed) if (!pages.has(url.replace(origin, ''))) fail('sitemap', `URL sem página: ${url}`);
const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
if (!robots.includes(`Sitemap: ${origin}/sitemap.xml`) || /Disallow:\s*\/\s*$/m.test(robots)) fail('robots.txt', 'sitemap ausente ou bloqueio geral');
const config = JSON.parse(fs.readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
const redirectSources = new Set();
for (const rule of config.redirects) {
  if (redirectSources.has(rule.source) || rule.source === rule.destination || !pages.has(rule.destination)) fail('redirects', `regra inválida: ${rule.source}`);
  if (rule.source.startsWith('/api/')) fail('redirects', 'normalização indevida de endpoint');
  redirectSources.add(rule.source);
}
for (const url of pages.keys()) {
  if (url !== '/' && !redirectSources.has(url.slice(0, -1))) fail('redirects', `URL sem normalização: ${url}`);
}
for (const file of ['.env', '.env.example', 'server.js', 'lib', 'api', 'docs', '.agents', '.impeccable', 'PRODUCT.md', 'DESIGN.md']) {
  if (root.endsWith('/public') && fs.existsSync(path.join(root, file))) fail('build', `arquivo interno publicado: ${file}`);
}
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`OK: ${pages.size} páginas, ${listed.length} URLs indexáveis, metadados, JSON-LD, links, fragmentos, recursos e alcance desde a home.`);
