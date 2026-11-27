import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('js/factory-loader.js', 'utf8');

function fixture({ webgl = true, reduceMotion = false, saveData = false, effectiveType = '4g', mobile = false, supportsWebm = true } = {}) {
    const classes = new Set();
    const attributes = new Map();
    const frames = [];
    const timers = [];
    const movieEvents = new Map();
    const documentEvents = new Map();
    let onLoad, onVisibility, onClick, onIdle;
    let reloads = 0;
    let focused = false;
    let probes = 0;
    let plays = 0;
    let paused = true;
    const canvas = { getContext() { probes++; return webgl ? context : null; } };
    const context = { getExtension: () => null };
    const button = { hidden: true, addEventListener: (name, fn) => { onClick = fn; }, focus() {} };
    const movie = {
        dataset: { src: '/desktop.mp4', mobileSrc: '/mobile.mp4', webm: '/desktop.webm', mobileWebm: '/mobile.webm' },
        canPlayType: () => supportsWebm ? 'probably' : '',
        hasAttribute: name => name === 'src' && Boolean(movie.src),
        addEventListener: (name, fn) => movieEvents.set(name, fn),
        play() { plays++; paused = false; return Promise.resolve(); },
        pause() { paused = true; },
    };
    const host = {
        querySelector: selector => ({
            '[data-factory-start]': button, '.fx-film': movie,
            '.fx-poster': { decode: () => Promise.resolve() },
        })[selector],
        classList: { add: name => classes.add(name), remove: name => classes.delete(name) },
        setAttribute: (name, value) => attributes.set(name, value),
        removeAttribute: name => attributes.delete(name),
        focus: () => { focused = true; },
    };
    class IntersectionObserver {
        constructor(callback) { onVisibility = callback; }
        observe() {}
        disconnect() { onVisibility = null; }
    }
    const window = {
        IntersectionObserver, requestIdleCallback: fn => { onIdle = fn; },
        addEventListener: (name, fn) => { if (name === 'load') onLoad = fn; },
    };
    const document = {
        documentElement: { lang: 'pt-BR' }, readyState: 'interactive', hidden: false,
        createElement: () => canvas,
        addEventListener: (name, fn) => documentEvents.set(name, fn),
        removeEventListener: name => documentEvents.delete(name),
    };
    vm.runInNewContext(source, {
        window, document, IntersectionObserver,
        matchMedia: query => ({ matches: query.includes('reduce') ? reduceMotion : mobile }),
        navigator: { connection: { saveData, effectiveType } },
        location: { reload() { reloads++; } },
        requestAnimationFrame: fn => frames.push(fn),
        setTimeout: fn => timers.push(fn),
    });
    return {
        button, movie, host, attributes, classes, canvas, context,
        mount: window.MesttiFactoryLoader.mount,
        visible: ratio => onVisibility?.([{ intersectionRatio: ratio }]),
        hidden: hidden => { document.hidden = hidden; documentEvents.get('visibilitychange')?.(); },
        async pageLoaded() { await onLoad?.(); },
        frame: () => frames.shift()?.(),
        timer: () => timers.shift()?.(),
        idle() { const fn = onIdle; onIdle = null; fn?.(); },
        movieEvent: name => movieEvents.get(name)?.(),
        tap: (detail = 1) => (button.onclick ?? onClick)({ detail }),
        reloads: () => reloads,
        focused: () => focused,
        plays: () => plays,
        paused: () => paused,
        probes: () => probes,
    };
}

async function paintPage(f) {
    await f.pageLoaded();
    f.frame();
    f.frame();
    f.timer();
}

test('mostra o pôster primeiro, toca a prévia visível por tamanho e não importa WebGL', async () => {
    for (const mobile of [false, true]) {
        const f = fixture({ mobile });
        let imports = 0;
        f.mount(f.host, async () => { imports++; });
        f.visible(1);
        f.idle();
        assert.equal(f.movie.src, undefined);
        await paintPage(f);
        f.visible(0);
        f.idle();
        assert.equal(f.movie.src, undefined);
        f.visible(0.5);
        f.idle();
        assert.equal(f.movie.src, mobile ? '/mobile.webm' : '/desktop.webm');
        assert.equal(f.plays(), 1);
        assert.equal(f.probes(), 0);
        assert.equal(imports, 0);
        f.movieEvent('playing');
        assert.ok(f.classes.has('fx--previewing'));
        f.hidden(true);
        assert.equal(f.paused(), true);
        f.movie.ended = true;
        f.hidden(false);
        f.idle();
        assert.equal(f.plays(), 1);
    }
});

test('usa MP4 quando o navegador não aceita WebM ou o vídeo falha', async () => {
    for (const supportsWebm of [false, true]) {
        const f = fixture({ supportsWebm });
        f.mount(f.host);
        await paintPage(f);
        f.visible(1);
        f.idle();
        if (supportsWebm) {
            assert.equal(f.movie.src, '/desktop.webm');
            f.movieEvent('error');
            f.idle();
        }
        assert.equal(f.movie.src, '/desktop.mp4');
        assert.equal(f.paused(), false);
    }
});

test('movimento reduzido, economia de dados e rede lenta mantêm o pôster', async () => {
    for (const options of [{ reduceMotion: true }, { saveData: true }, { effectiveType: '3g' }]) {
        const f = fixture(options);
        f.mount(f.host);
        await paintPage(f);
        f.visible(1);
        f.idle();
        assert.equal(f.movie.src, undefined);
        assert.equal(f.button.hidden, false);
    }
});

test('ao explorar, pausa a prévia e monta a cena no mesmo contexto WebGL', async () => {
    const f = fixture();
    let mounts = 0;
    f.mount(f.host, async () => ({
        mountFactory(canvas, context) {
            assert.equal(canvas, f.canvas);
            assert.equal(context, f.context);
            mounts++;
        },
    }));
    f.visible(1);
    await paintPage(f);
    f.idle();
    assert.equal(f.paused(), false);
    await f.tap(0);
    assert.equal(f.paused(), true);
    assert.equal(f.probes(), 1);
    assert.equal(mounts, 1);
    assert.equal(f.focused(), true);
    assert.equal(f.attributes.get('aria-busy'), 'true');
});

test('sem WebGL a demonstração continua na prévia sem importar a cena', async () => {
    const f = fixture({ webgl: false });
    f.mount(f.host, async () => assert.fail('não deve carregar'));
    await f.tap();
    assert.ok(f.classes.has('fx--static'));
    assert.equal(f.button.hidden, true);
});

test('erro de download preserva a prévia e oferece recuperação por recarregamento', async () => {
    const f = fixture();
    f.mount(f.host, async () => { throw Error('offline'); });
    await f.tap();
    assert.equal(f.button.hidden, false);
    assert.ok(!f.attributes.has('aria-busy'));
    assert.ok(!f.classes.has('fx--requested'));
    f.tap();
    assert.equal(f.reloads(), 1);
});
