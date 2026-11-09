import test from 'node:test';
import assert from 'node:assert';

test('purgeCss mantém o que é usado e tira o que nenhuma página usa', async () => {
    const { purgeCss } = await import('../scripts/css-purge.mjs');
    const corpus = { tokens: new Set(['usada', 'menu', 'is-open', 'hero']), prefixes: ['fx-'] };
    const css = `
        @import url("./outro.css");
        /* comentário */
        :root { --a: 1px; }
        body { margin: 0; }
        .usada { color: red; }
        .sumiu { color: blue; }
        .menu.is-open, .sumiu-tambem { display: block; }
        .fx-rodando { color: green; }
        [data-theme="dark"] .hero { color: white; }
        .hero:not(.inexistente) { padding: 1px; }
        @media (max-width: 600px) { .usada { color: pink; } .sumiu { color: gray; } }
        @media (min-width: 900px) { .sumiu { color: gray; } }
        @keyframes giro { from { opacity: 0; } to { opacity: 1; } }
    `;
    const out = purgeCss(css, corpus);
    assert.ok(out.includes('@import url("./outro.css");'));
    assert.ok(out.includes(':root{--a: 1px}') || out.includes(':root{--a:1px}'));
    assert.ok(out.includes('body{'));
    assert.ok(out.includes('.usada{color: red}') || out.includes('.usada{color:red}'));
    assert.ok(!out.includes('.sumiu{'));
    assert.ok(out.includes('.menu.is-open{') && !out.includes('sumiu-tambem'));
    assert.ok(out.includes('.fx-rodando'), 'prefixo montado em JS fica');
    assert.ok(out.includes('[data-theme="dark"] .hero'));
    assert.ok(out.includes('.hero:not(.inexistente)'));
    assert.ok(out.includes('@media (max-width: 600px){.usada'));
    assert.ok(!out.includes('min-width: 900px'), 'media vazia sai');
    assert.ok(out.includes('@keyframes giro'));
    assert.ok(!out.includes('comentário'));
});

test('purgeCss preserva seletores funcionais, atributos e strings literalmente', async () => {
    const { purgeCss } = await import('../scripts/css-purge.mjs');
    const corpus = { tokens: new Set(['usada']), prefixes: [] };
    const cases = [
        '.usada:is(.aberta, .fechada){color: red}',
        '.ausente:is(.aberta, .fechada){color: blue}',
        '[data-label="a,b;{c}"] .usada{color: green}',
        '.usada::before{content: "a  b; } c /* literal */"}',
        String.raw`.usada::after{content: "aspas \" e } chaves"}`,
        '.usada{background: url("data:image/svg+xml,<svg>{;}</svg>")}',
    ];
    for (const css of cases) assert.equal(purgeCss(css, corpus), css);
});
