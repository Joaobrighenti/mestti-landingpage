import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('js/factory-loader.js', 'utf8');

function fixture({ renderer = 'GPU', webgl = true } = {}) {
    const events = new Map();
    const frames = [];
    const attributes = new Map();
    const classes = new Set();
    const probes = [];
    let intersection, idle, reloads = 0;
    const button = { hidden: true, addEventListener: (key, fn) => events.set(key, fn), focus() {} };
    const host = {
        querySelector: selector => selector === '[data-factory-start]' ? button : { decode: () => Promise.resolve() },
        addEventListener: (key, fn) => events.set(key, fn),
        removeEventListener: key => events.delete(key),
        setAttribute: (key, value) => attributes.set(key, value),
        removeAttribute: key => attributes.delete(key),
        classList: { add: name => classes.add(name) },
        focus() {},
    };
    const context = {
        getExtension: name => name === 'WEBGL_debug_renderer_info' ? { UNMASKED_RENDERER_WEBGL: 1 } : null,
        getParameter: () => renderer,
    };
    const canvas = {
        getContext(type, options) {
            assert.equal(type, 'webgl2');
            probes.push(options.failIfMajorPerformanceCaveat);
            return webgl ? context : null;
        },
    };
    class IntersectionObserver {
        constructor(fn) { intersection = fn; }
        observe() {}
        disconnect() { intersection = null; }
    }
    const document = {
        createElement: () => canvas,
        documentElement: { lang: 'pt-BR' },
        addEventListener: (key, fn) => events.set(key, fn),
        removeEventListener: key => events.delete(key),
        hidden: false,
    };
    const window = { IntersectionObserver, requestIdleCallback: fn => { idle = fn; } };
    vm.runInNewContext(source, {
        window, document, IntersectionObserver, matchMedia: () => ({ matches: false }),
        requestAnimationFrame: fn => frames.push(fn),
        location: { reload() { reloads++; } },
    });
    return {
        mount: window.MesttiFactoryLoader.mount, host, button, probes, attributes, classes,
        visible: visible => intersection?.([{ isIntersecting: visible }]),
        async paint() { await new Promise(resolve => setImmediate(resolve)); frames.shift()(); frames.shift()(); },
        async idle() { const fn = idle; idle = null; fn?.(); await Promise.resolve(); await Promise.resolve(); },
        tap: () => (button.onclick || events.get('click'))({ detail: 0 }),
        reloads: () => reloads,
        assertContext(suppliedCanvas, suppliedContext) {
            assert.equal(suppliedCanvas, canvas);
            assert.equal(suppliedContext, context);
        },
    };
}

test('abre o WebGL automaticamente depois de pintar o pôster e entrar na área visível', async () => {
    const f = fixture();
    let mounts = 0;
    f.mount(f.host, async () => ({ mountFactory(canvas, context) { f.assertContext(canvas, context); mounts++; } }));
    await f.paint();
    await f.idle();
    assert.equal(mounts, 0);
    f.visible(true);
    await f.idle();
    assert.equal(mounts, 1);
    assert.equal(f.button.hidden, true);
    assert.deepEqual(f.probes, [true]);
});

test('se rolar para fora durante a importação, espera o quadro voltar para montar', async () => {
    const f = fixture();
    let mounts = 0, resolve;
    f.mount(f.host, () => new Promise(done => { resolve = done; }));
    f.visible(true);
    await f.paint();
    await f.idle();
    f.visible(false);
    resolve({ mountFactory() { mounts++; } });
    await f.idle();
    assert.equal(mounts, 0);
    f.visible(true);
    await f.idle();
    assert.equal(mounts, 1);
});

test('renderização por software conserva o pôster e oferece abertura manual', async () => {
    const f = fixture({ renderer: 'Google SwiftShader' });
    let mounts = 0;
    f.mount(f.host, async () => ({ mountFactory() { mounts++; } }));
    f.visible(true);
    await f.paint();
    await f.idle();
    assert.equal(f.button.hidden, false);
    assert.equal(mounts, 0);
    await f.tap();
    assert.equal(mounts, 1);
    assert.deepEqual(f.probes, [true, false]);
});

test('sem WebGL mantém o pôster; erro de importação oferece recarregar', async () => {
    const unavailable = fixture({ webgl: false });
    unavailable.mount(unavailable.host, () => assert.fail('importação desnecessária'));
    unavailable.visible(true);
    await unavailable.paint();
    await unavailable.idle();
    await unavailable.tap();
    assert.ok(unavailable.classes.has('fx--static'));

    const f = fixture();
    f.mount(f.host, async () => { throw Error('offline'); });
    f.visible(true);
    await f.paint();
    await f.idle();
    assert.equal(f.button.hidden, false);
    assert.ok(!f.attributes.has('aria-busy'));
    f.tap();
    assert.equal(f.reloads(), 1);
});
