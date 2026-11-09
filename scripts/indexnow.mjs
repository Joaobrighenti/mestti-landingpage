/**
 * IndexNow: avisa Bing (e outros buscadores do protocolo) que as URLs do sitemap mudaram.
 * O índice do Bing alimenta o Copilot e a busca do ChatGPT, então isso acelera a descoberta das páginas novas.
 *
 * Rode SÓ depois de um deploy em produção, com o arquivo da chave já publicado em
 * https://mestti.com.br/9b2f9d61182c85700b8533e9f50d2f56.txt:
 *   npm run indexnow            envia todas as URLs do sitemap
 *   npm run indexnow -- /oee/   envia só as URLs informadas
 * Não envia nada sem esse arquivo no ar (o buscador recusa a chave).
 */
import fs from 'node:fs';

const HOST = 'mestti.com.br';
const KEY = '9b2f9d61182c85700b8533e9f50d2f56';
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const args = process.argv.slice(2);
const sitemap = fs.readFileSync(new URL('../sitemap.xml', import.meta.url), 'utf8');
const all = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
const urls = args.length ? args.map((p) => `https://${HOST}${p}`) : all;

const live = await fetch(`https://${HOST}/${KEY}.txt`).then((r) => (r.ok ? r.text() : '')).catch(() => '');
if (live.trim() !== KEY) {
    console.error(`A chave não está publicada em https://${HOST}/${KEY}.txt. Faça o deploy antes.`);
    process.exit(1);
}
const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls })
});
console.log(`IndexNow: ${res.status} ${res.statusText} para ${urls.length} URLs.`);
if (!res.ok && res.status !== 202) process.exit(1);
