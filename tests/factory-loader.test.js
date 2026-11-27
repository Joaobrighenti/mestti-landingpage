import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function fixture({ webgl = true } = {}) {
    const listeners = new Map();
    const classes = new Set();
    const attributes = new Map();
    let reloads = 0;
    let probes = 0;
    let focused = false;
    const button = {
        hidden: true,
        disabled: false,
        addEventListener: (name, fn, options) => listeners.set(name, { fn, options }),
        focus() {},
    };
    const host = {
        querySelector: () => button,
        classList: { add: c => classes.add(c), remove: c => classes.delete(c) },
        setAttribute: (name, value) => attributes.set(name, value),
        removeAttribute: name => attributes.delete(name),
        focus: () => { focused = true; },
    };
    const window = {};
    const document = {
        documentElement: { lang: 'pt-BR' },
        createElement: () => ({
            getContext() {
                probes++;
                return webgl ? { getExtension: () => ({ loseContext() {} }) } : null;
            },
        }),
    };
    vm.runInNewContext(fs.readFileSync('js/factory-loader.js', 'utf8'), {
        window, document, location: { reload() { reloads++; } },
    });
    const tap = (detail = 1) => {
        const listener = listeners.get('click');
        if (!listener) return button.onclick?.();
        if (listener.options.once) listeners.delete('click');
        return listener.fn({ detail });
    };
    return { mount: window.MesttiFactoryLoader.mount, button, host, attributes, classes, tap, reloads: () => reloads, probes: () => probes, focused: () => focused };
}

test('mantém a imagem e não inicializa WebGL ou importa a cena até a ativação', async () => {
    const f = fixture();
    let loads = 0;
    f.mount(f.host, async () => { loads++; });
    assert.equal(f.button.hidden, false);
    assert.equal(f.probes(), 0);
    assert.equal(loads, 0);
    await f.tap(0);
    await f.tap();
    assert.equal(f.probes(), 1);
    assert.equal(loads, 1);
    assert.equal(f.button.hidden, true);
    assert.equal(f.attributes.get('aria-busy'), 'true');
    assert.equal(f.focused(), true);
});

test('erro de download oferece recuperação por recarregamento', async () => {
    const f = fixture();
    f.mount(f.host, async () => { throw Error('offline'); });
    await f.tap();
    assert.equal(f.button.hidden, false);
    assert.equal(f.button.disabled, false);
    assert.ok(!f.attributes.has('aria-busy'));
    assert.ok(!f.classes.has('fx--requested'));
    f.tap();
    assert.equal(f.reloads(), 1);
});

test('sem WebGL mantém a imagem estática após ativar e não baixa a cena', async () => {
    const f = fixture({ webgl: false });
    let loads = 0;
    f.mount(f.host, async () => { loads++; });
    await f.tap();
    assert.equal(loads, 0);
    assert.ok(f.classes.has('fx--static'));
    assert.equal(f.button.hidden, true);
});
