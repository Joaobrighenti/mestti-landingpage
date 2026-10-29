import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildAll, buildPage } from '../scripts/site-build.mjs';
import { headerFor, readPageDict } from '../scripts/site-lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const partials = { header: '<header><a href="/" class="nav-link" data-i18n="nav.home">Início</a><a href="/x/" class="nav-link" data-i18n="nav.x">X</a></header>', footer: '<footer></footer>', modal: '<div></div>' };

test('as páginas publicadas estão em dia com site/', () => {
    const { files, problems } = buildAll();
    assert.deepEqual(problems, []);
    const stale = [...files].filter(([rel, content]) => fs.readFileSync(path.join(ROOT, rel), 'utf8') !== content).map(([rel]) => rel);
    assert.deepEqual(stale, [], 'rode npm run site:build');
});

test('o build tira as traduções do HTML e escreve os três idiomas no dicionário', async () => {
    const source = '<!--@page {"dict": "js/i18n/t.js", "strings": {"meta.t.title": {"pt": "Título", "en": "Title", "es": "Título"}}} -->\n'
        + '<!-- @header -->\n<h2 data-i18n="t.h" data-t-en="Hello &amp; welcome" data-t-es="Hola">Olá <strong>mundo</strong></h2>\n'
        + '<img alt="Foto" data-i18n-alt="t.img" data-t-alt-en="Photo" data-t-alt-es="Foto ES">\n';
    const page = buildPage('x/index.html', source, partials);
    assert.deepEqual(page.problems, []);
    assert.ok(!page.html.includes('data-t-'));
    assert.ok(page.html.includes('<h2 data-i18n="t.h">Olá <strong>mundo</strong></h2>'));
    assert.ok(page.html.includes('<a href="/x/" class="nav-link" aria-current="page" data-i18n="nav.x">'));
    assert.deepEqual(Object.keys(page.dict.pt), ['meta.t.title', 't.h', 't.img']);
    assert.equal(page.dict.en['t.h'], 'Hello & welcome');
    assert.equal(page.dict.pt['t.h'], 'Olá <strong>mundo</strong>');
    assert.equal(page.dict.es['t.img'], 'Foto ES');
});

test('falta de tradução quebra o build', () => {
    const source = '<!--@page {"dict": "js/i18n/t.js", "strings": {}} -->\n<p data-i18n="t.p" data-t-en="Only English">Só português</p>\n';
    const page = buildPage('index.html', source, partials);
    assert.ok(page.problems.some((p) => p.includes('t.p') && p.includes('"es"')));
});

test('o cabeçalho marca só o link da página atual', () => {
    const html = headerFor(partials.header, '/');
    assert.equal((html.match(/aria-current/g) || []).length, 1);
    assert.ok(html.includes('href="/" class="nav-link" aria-current="page"'));
});

test('o dicionário gerado da home tem as mesmas chaves nos três idiomas', async () => {
    const dict = await readPageDict(fs.readFileSync(path.join(ROOT, 'js/i18n/inicio.js'), 'utf8'));
    const pt = Object.keys(dict.pt).sort();
    assert.ok(pt.length > 100);
    assert.deepEqual(Object.keys(dict.en).sort(), pt);
    assert.deepEqual(Object.keys(dict.es).sort(), pt);
});
