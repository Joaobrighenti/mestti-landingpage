import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function fixture({ touch = true, saveData = false } = {}) {
    const listeners = new Map();
    const button = { hidden: true, disabled: false, addEventListener: (n, fn) => listeners.set(n, fn) };
    const host = { dataset: {}, querySelector: () => button, classList: { add() {}, remove() {} }, setAttribute() {}, removeAttribute() {}, scrollIntoView() {} };
    const window = { addEventListener() {} };
    const context = { window, document: { readyState: 'complete', documentElement: { lang: 'pt-BR' } }, navigator: { connection: { saveData } }, matchMedia: q => ({ matches: q.includes('coarse') && touch }), location: { reload() {} } };
    vm.runInNewContext(fs.readFileSync('js/factory-loader.js', 'utf8'), context);
    return { mount: window.MesttiFactoryLoader.mount, button, host, tap: () => listeners.get('click')() };
}

test('toque só baixa o 3D após escolha explícita e ignora ativações repetidas', async () => {
    const f = fixture(); let loads = 0;
    f.mount(f.host, () => { loads++; return Promise.resolve(); });
    assert.equal(loads, 0);
    assert.equal(f.button.hidden, false);
    f.tap(); f.tap();
    assert.equal(loads, 1);
    assert.equal(f.host.dataset.factoryExplore, 'true');
    assert.equal(f.button.disabled, true);
});

test('economia de dados também evita download automático com mouse', () => {
    const f = fixture({ touch: false, saveData: true }); let loads = 0;
    f.mount(f.host, () => { loads++; return Promise.resolve(); });
    assert.equal(loads, 0);
    assert.equal(f.button.hidden, false);
});

test('desktop mantém carregamento automático sem o passo extra', () => {
    const f = fixture({ touch: false }); let loads = 0;
    f.mount(f.host, () => { loads++; return Promise.resolve(); });
    assert.equal(loads, 1);
    assert.equal(f.button.hidden, true);
});
