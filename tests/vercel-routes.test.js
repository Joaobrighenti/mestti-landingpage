import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { compileRoutes } from '../scripts/vercel-routes.mjs';

const routing = JSON.parse(fs.readFileSync(new URL('../site/routing.json', import.meta.url)));
const routes = compileRoutes(routing);
// Executa a tabela com os arquivos/funções conhecidos, independentemente do compilador.
function resolve(url) {
    const { pathname } = new URL(url, 'https://mestti.com.br');
    const headers = {};
    const exists = p => fs.existsSync(new URL('..' + p, import.meta.url)) || fs.existsSync(new URL('..' + p + '/index.html', import.meta.url));
    for (const r of routes) {
        if (r.handle === 'filesystem') {
            if (exists(pathname) || fs.existsSync(new URL('..' + pathname + '.js', import.meta.url))) return { status: 200, headers };
            continue;
        }
        if (!new RegExp(r.src).test(pathname)) continue;
        Object.assign(headers, r.headers);
        if (r.continue) continue;
        if (r.check && !exists(r.dest)) continue;
        return { status: r.status ?? 200, headers, dest: r.dest };
    }
    return { status: 404, headers };
}

test('aliases e normalização antecedem arquivos e fallback, para todos os redirects', () => {
    for (const r of routing.redirects) {
        const result = resolve(r.source);
        assert.equal(result.status, r.statusCode ?? (r.permanent === false ? 307 : 308), r.source);
        assert.equal(result.headers.Location, r.destination, r.source);
    }
});
test('mantém páginas, CSS, funções e headers antes do erro personalizado', () => {
    for (const p of ['/', '/oee/', '/en/oee/', '/css/site.css', '/api/lead']) assert.equal(resolve(p).status, 200, p);
    assert.equal(resolve('/index.md').headers['X-Robots-Tag'], 'noindex');
    assert.match(resolve('/glbimagens/fabrica.glb').headers['Cache-Control'], /604800/);
    assert.deepEqual(resolve('/nao-existe/'), { status: 404, headers: {}, dest: '/404.html' });
    assert.deepEqual(resolve('/arquivo-ausente.css'), { status: 404, headers: {}, dest: '/404.html' });
    assert.deepEqual(resolve('/api/ausente'), { status: 404, headers: {} });
});
