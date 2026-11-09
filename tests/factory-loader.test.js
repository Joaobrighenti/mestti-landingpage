import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function fixture({ touch = true, saveData = false, webgl = true } = {}) {
    const listeners = new Map(); let visible; let idle; let reloads = 0;
    const button = { hidden: true, addEventListener: (n, fn) => listeners.set(n, fn) };
    const classes = new Set();
    const host = { classes, querySelector: () => button, classList: { add: c => classes.add(c), remove: c => classes.delete(c) }, setAttribute() {}, removeAttribute() {} };
    const window = { addEventListener() {}, IntersectionObserver: true, requestIdleCallback(fn) { idle = fn; } };
    class IntersectionObserver { constructor(fn) { visible = fn; } observe() {} disconnect() {} }
    const context = { window, IntersectionObserver, document: { readyState: 'complete', documentElement: { lang: 'pt-BR' }, createElement: () => ({ getContext: () => (webgl ? { getExtension: () => ({ loseContext() {} }) } : null) }) }, navigator: { connection: { saveData } }, matchMedia: q => ({ matches: q.includes('coarse') && touch }), location: { reload() { reloads++; } } };
    vm.runInNewContext(fs.readFileSync('js/factory-loader.js', 'utf8'), context);
    return { mount: window.MesttiFactoryLoader.mount, button, host, visible: on => visible([{ isIntersecting: on }]), idle: () => idle(), tap: () => listeners.get('click')(), reloads: () => reloads };
}

test('mobile inicia automaticamente quando visível e há tempo livre, sem botão nem carga duplicada', () => {
    const f = fixture(); let loads = 0;
    f.mount(f.host, () => { loads++; return Promise.resolve(); });
    f.visible(false); assert.equal(loads, 0);
    f.visible(true); assert.equal(loads, 0); assert.equal(f.button.hidden, true);
    f.idle(); f.idle(); assert.equal(loads, 1);
});

test('desktop carrega quando visível; economia de dados aguarda tempo livre', () => {
    for (const saveData of [false, true]) {
        const f = fixture({ touch: false, saveData }); let loads = 0;
        f.mount(f.host, () => { loads++; return Promise.resolve(); });
        f.visible(false); assert.equal(loads, 0);
        f.visible(true); assert.equal(loads, saveData ? 0 : 1);
        if (saveData) f.idle();
        assert.equal(loads, 1); assert.equal(f.button.hidden, true);
    }
});

test('erro de download oferece recuperação por recarregamento', async () => {
    const f = fixture();
    f.mount(f.host, () => Promise.reject(Error('offline'))); f.visible(true); f.idle();
    await Promise.resolve(); assert.equal(f.button.hidden, false);
    f.tap(); assert.equal(f.reloads(), 1);
});

test('sem WebGL não baixa a cena e mantém só a imagem estática', () => {
    const f = fixture({ webgl: false }); let loads = 0;
    f.mount(f.host, () => { loads++; return Promise.resolve(); });
    f.visible(true); f.idle();
    assert.equal(loads, 0); assert.ok(f.host.classes.has('fx--static')); assert.equal(f.button.hidden, true);
});
