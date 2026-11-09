import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const controllerSource = fs.readFileSync('js/factory-fullscreen.js', 'utf8').replace('export function', 'function');
function fixture({ unsupportedDialog = false, mobile = true } = {}) {
    class Element extends EventTarget {
        children = []; style = {}; inert = false; open = false;
        constructor(tag) { super(); this.tagName = tag; }
        appendChild(child) { child.remove(); child.parentNode = this; this.children.push(child); return child; }
        remove() { if (this.parentNode) this.parentNode.children.splice(this.parentNode.children.indexOf(this), 1); this.parentNode = null; }
        before(child) { child.parentNode = this.parentNode; this.parentNode.children.splice(this.parentNode.children.indexOf(this), 0, child); }
        replaceWith(child) { const parent = this.parentNode; child.remove(); parent.children.splice(parent.children.indexOf(this), 1, child); child.parentNode = parent; this.parentNode = null; }
        setAttribute(key, value) { this[key] = value; }
        getBoundingClientRect() { return { height: 560 }; }
        querySelector() { return null; }
        showModal() { if (unsupportedDialog) throw Error('unsupported'); this.open = true; }
        close() { this.open = false; this.dispatchEvent(new Event('close')); }
    }
    const body = new Element('body'); const parent = body.appendChild(new Element('section'));
    const root = parent.appendChild(new Element('div')); const existing = body.appendChild(new Element('aside')); existing.inert = true;
    const events = new EventTarget(); const document = { body, createElement: tag => new Element(tag), addEventListener: events.addEventListener.bind(events), fullscreenElement: null };
    const window = { scrollX: 0, scrollY: 321, scrollTo(x, y) { this.scrollX = x; this.scrollY = y; } };
    const factory = vm.runInNewContext(controllerSource + '\ncreateFactoryFullscreen', { document, window, Promise });
    let controller; controller = factory(root, { mobile, label: () => 'Fábrica exemplo', onExit: () => controller.exit() });
    return { root, parent, body, existing, document, window, controller, dialog: () => body.children.find(e => e.tagName === 'dialog') };
}

test('mobile usa dialog e restaura posição, scroll e árvore ao sair/cancelar', () => {
    const f = fixture(); f.root.requestFullscreen = () => { throw Error('mobile não deve usar API nativa'); };
    f.controller.enter();
    assert.equal(f.dialog().open, true); assert.equal(f.root.parentNode, f.dialog());
    assert.equal(f.parent.children[0].style.height, '560px');
    f.dialog().dispatchEvent(new Event('cancel', { cancelable: true }));
    assert.equal(f.root.parentNode, f.parent); assert.equal(f.parent.children.length, 1);
    assert.equal(f.dialog(), undefined); assert.equal(f.window.scrollY, 321);
});
test('fallback sem dialog isola a página e restaura estados inert anteriores', () => {
    const f = fixture({ unsupportedDialog: true }); f.controller.enter();
    assert.equal(f.root.parentNode, f.body); assert.equal(f.parent.inert, true);
    f.controller.exit(); assert.equal(f.root.parentNode, f.parent);
    assert.equal(f.parent.inert, false); assert.equal(f.existing.inert, true);
});
test('rejeição da API nativa no desktop abre a camada modal', async () => {
    const f = fixture({ mobile: false }); f.root.requestFullscreen = () => Promise.reject(Error('denied'));
    f.controller.enter(); await new Promise(resolve => setImmediate(resolve));
    assert.equal(f.dialog().open, true); f.controller.exit(); assert.equal(f.root.parentNode, f.parent);
});
test('entrada nativa concluída depois de sair não prende a página em tela cheia', async () => {
    const f = fixture({ mobile: false }); let finish; let exits = 0;
    f.root.requestFullscreen = () => new Promise(resolve => { finish = resolve; });
    f.document.exitFullscreen = () => { exits++; f.document.fullscreenElement = null; };
    f.controller.enter(); f.controller.exit(); f.document.fullscreenElement = f.root; finish();
    await new Promise(resolve => setImmediate(resolve)); assert.equal(exits, 1);
});

test('celular: home mostra só o cinema e um CTA; tela cheia tem controles e X (PT/EN/ES), sem crédito', () => {
    const hud = { innerHTML: '' };
    const document = { querySelector: selector => selector === '[data-factory]' ? root : null, documentElement: { getAttribute: () => null } };
    const root = { dataset: {}, querySelector: () => hud, classList: { toggle() {} } };
    const window = { MESTTI_LANG: 'pt', matchMedia: q => ({ matches: q.includes('coarse') }) };
    const source = fs.readFileSync('js/fabrica-sim.js', 'utf8').replace(/^import .*;\n/gm, '').replace('if (root) init();', '');
    const context = vm.createContext({ document, window }); vm.runInContext(source, context);
    const texts = { pt: ['Explorar a fábrica', 'Arraste para mover · pinça para aproximar · dois dedos giram'], en: ['Explore the factory', 'Drag to move · pinch to zoom · two fingers rotate'], es: ['Explorar la fábrica', 'Arrastre para mover · pellizque para acercar · dos dedos giran'] };
    for (const [language, [cta, full]] of Object.entries(texts)) {
        window.MESTTI_LANG = language; vm.runInContext('renderHud()', context);
        assert.match(hud.innerHTML, /class="fx-cta" data-fx-full/); assert.ok(hud.innerHTML.includes(cta));
        for (const control of ['data-fx-filter', 'data-fx-layer', 'data-fx-zoom', 'data-fx-now', 'fx-hint']) assert.ok(!hud.innerHTML.includes(control), control);
        assert.ok(!hud.innerHTML.includes('[object Object]')); assert.ok(!hud.innerHTML.includes('data-fx-exit'));
        vm.runInContext('view.full = true; renderHud()', context);
        assert.ok(!hud.innerHTML.includes('fx-cta'));
        assert.match(hud.innerHTML, /data-fx-full aria-pressed="true"/);
        // X de saída ao lado de Estado/OEE.
        assert.match(hud.innerHTML, /data-fx-layer="oee"[\s\S]*?<\/div>\s*<button[^>]*data-fx-exit/);
        for (const control of ['data-fx-filter', 'data-fx-layer', 'data-fx-zoom']) assert.ok(hud.innerHTML.includes(control), control);
        assert.ok(hud.innerHTML.includes(full)); assert.ok(!hud.innerHTML.includes('SimReady'));
        vm.runInContext('view.full = false', context);
    }
});

test('desktop (com mouse) mantém a maquete interativa na página, sem CTA nem X', () => {
    const hud = { innerHTML: '' };
    const root = { dataset: {}, querySelector: () => hud, classList: { toggle() {} } };
    const document = { querySelector: selector => selector === '[data-factory]' ? root : null, documentElement: { getAttribute: () => null } };
    const window = { MESTTI_LANG: 'pt', matchMedia: q => ({ matches: q.includes('hover') }) };
    const source = fs.readFileSync('js/fabrica-sim.js', 'utf8').replace(/^import .*;\n/gm, '').replace('if (root) init();', '');
    const context = vm.createContext({ document, window }); vm.runInContext(source, context);
    vm.runInContext('renderHud()', context);
    assert.ok(!hud.innerHTML.includes('fx-cta')); assert.ok(hud.innerHTML.includes('data-fx-filter')); assert.ok(hud.innerHTML.includes('Ctrl'));
    vm.runInContext('view.full = true; renderHud()', context);
    assert.ok(!hud.innerHTML.includes('data-fx-exit')); assert.ok(hud.innerHTML.includes('Esc'));
});

test('na página o deslize vertical rola o site; na tela cheia a cena captura todos os gestos', () => {
    const css = fs.readFileSync('css/factory-sim.css', 'utf8');
    assert.match(css, /\.fx-canvas \{[^}]*touch-action: pan-y/);
    assert.match(css, /\.fx-scene \{ touch-action: pan-y; \}/);
    assert.match(css, /\.fx\.fx--full \.fx-scene, \.fx\.fx--full \.fx-canvas \{ touch-action: none; \}/);
    assert.doesNotMatch(css.replace(/\.fx\.fx--full[^{]*\{[^}]*\}/g, ''), /\.fx-(scene|canvas)[^{]*\{[^}]*touch-action: none/);
});

test('celular: controles só na tela cheia e sair retoma o cinema; desktop interage na página', () => {
    const src = fs.readFileSync('js/fabrica-sim.js', 'utf8');
    assert.match(src, /controls\.enabled = !tour && interactive\(\);/);
    assert.match(src, /const interactive = \(\) => view\.full \|\| !mobileUI;/);
    assert.match(src, /controls\.touches = \{ ONE: THREE\.TOUCH\.PAN, TWO: THREE\.TOUCH\.DOLLY_ROTATE \};/);
    assert.match(src, /if \(!interactive\(\)\) \{ downPin = null; openFull\(\); return; \}/);
    assert.match(src, /else \{ tour = null; lastInput = 0; awakeAt = performance\.now\(\); startTour\(\); \}/);
});
