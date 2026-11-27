import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function fixture({ language = 'pt', reduceMotion = false, saveData = false } = {}) {
    const source = fs.readFileSync('js/v2.js', 'utf8');
    const start = source.indexOf('    function initVideo() {');
    const end = source.indexOf("    document.querySelectorAll('[data-cta]')", start);
    const observers = [], commands = [], events = [], windowEvents = new Map(), documentEvents = new Map(), timers = new Map(), timeouts = new Map();
    let timerId = 0, iframe, locked = false, clock = 1000;
    const button = () => ({ hidden: true, addEventListener(type, fn) { this[type] = fn; } });
    const sound = button(), play = button();
    const frame = { dataset: { yt: 'v9ebdO-P66E' }, classList: { playing: false, add() { this.playing = true; } }, querySelector(s) { return s === '[data-yt-sound]' ? sound : s === '[data-yt-play]' ? play : { textContent: 'Vídeo da Mestti' }; }, appendChild(e) { iframe = e; } };
    const document = { querySelector: () => frame, documentElement: { classList: { contains: () => locked } }, addEventListener: (type, fn) => documentEvents.set(type, fn), createElement() { return { tabIndex: 0, attrs: {}, setAttribute(k, v) { this.attrs[k] = v; }, removeAttribute(k) { delete this.attrs[k]; }, contentWindow: { postMessage(text, origin) { commands.push({ ...JSON.parse(text), origin }); } }, addEventListener(type, fn) { this[type] = fn; } }; } };
    class IntersectionObserver { constructor(fn, options) { this.fn = fn; this.options = options; observers.push(this); } observe() {} disconnect() {} }
    const window = { MESTTI_LANG: language, innerHeight: 844, IntersectionObserver, addEventListener: (type, fn) => windowEvents.set(type, fn) };
    vm.runInNewContext(source.slice(start, end) + '\ninitVideo()', { performance: { now: () => clock }, document, window, IntersectionObserver, URLSearchParams, location: { origin: 'https://mestti.com.br' }, navigator: { connection: { saveData } }, reduceMotion, track: (...args) => events.push(args), setInterval(fn) { timers.set(++timerId, fn); return timerId; }, clearInterval(id) { timers.delete(id); }, setTimeout(fn) { timeouts.set(++timerId, fn); return timerId; }, clearTimeout(id) { timeouts.delete(id); } });
    const message = (event, info, origin = 'https://www.youtube-nocookie.com') => windowEvents.get('message')({ source: iframe?.contentWindow, origin, data: JSON.stringify({ event, info }) });
    const visible = on => observers[0].fn([{ isIntersecting: on, intersectionRatio: on ? 0.6 : 0, intersectionRect: { height: on ? 300 : 0 } }]);
    return { timeout() { const fns = [...timeouts.values()]; timeouts.clear(); fns.forEach(fn => fn()); }, tick(ms) { clock += ms; }, window, commands, observers, events, frame, sound, visible, message, iframe: () => iframe, click: () => play.click(), language(lang) { window.MESTTI_LANG = lang; documentEvents.get('mestti:lang')(); }, lock() { locked = true; windowEvents.get('mestti:factory-fullscreen')({ detail: { active: true } }); } };
}
const has = (f, func) => f.commands.some(c => c.func === func);

test('só cria o player quando visível, inicia ao ficar pronto e pausa ao sair', () => {
    const f = fixture();
    assert.equal(f.iframe(), undefined);
    f.visible(false);
    assert.equal(f.iframe(), undefined);
    f.visible(true);
    assert.equal(new URL(f.iframe().src).searchParams.get('autoplay'), '0');
    f.message('initialDelivery', {});
    assert.ok(has(f, 'unMute')); assert.ok(has(f, 'playVideo'));
    f.message('infoDelivery', { playerState: 1, muted: true });
    assert.equal(f.frame.classList.playing, true); assert.equal(f.sound.hidden, false);
    f.visible(false); assert.equal(f.commands.at(-1).func, 'pauseVideo');
});
test('visibilidade antes de ready aguarda o player, sem atraso artificial e sem duplicar o evento', () => {
    const f = fixture(); f.visible(true); f.visible(true);
    assert.equal(has(f, 'playVideo'), false); f.message('onReady', {});
    assert.ok(has(f, 'playVideo')); assert.equal(f.events.length, 1);
});
test('PT desliga legendas; EN/ES carregam a faixa correspondente também ao trocar idioma', () => {
    for (const language of ['pt', 'en', 'es']) {
        const f = fixture({ language }); f.visible(true);
        const params = new URL(f.iframe().src).searchParams;
        assert.equal(params.get('cc_load_policy'), language === 'pt' ? '0' : '1');
        assert.equal(params.get('cc_lang_pref'), language);
        f.message('onReady', {});
        assert.ok(has(f, language === 'pt' ? 'unloadModule' : 'loadModule'));
        if (language !== 'pt') assert.equal(f.commands.find(c => c.func === 'setOption').args[2].translationLanguage.languageCode, language);
        f.language('es'); assert.equal(f.commands.at(-1).args[2].translationLanguage.languageCode, 'es');
        f.language('pt'); assert.equal(f.commands.at(-1).func, 'unloadModule');
    }
});
test('clique liga som; bloqueio do navegador tenta mudo imediatamente; tela cheia da fábrica impede retomada', () => {
    const f = fixture(); f.click(); f.message('onReady', {}); assert.ok(has(f, 'unMute'));
    f.message('onAutoplayBlocked'); assert.equal(f.commands.at(-1).func, 'playVideo'); assert.equal(f.commands.at(-2).func, 'mute');
    f.lock(); f.message('infoDelivery', { playerState: 1 }); assert.equal(f.commands.at(-1).func, 'pauseVideo');
});
test('movimento reduzido e economia de dados carregam o player por clique', () => {
    for (const options of [{ reduceMotion: true }, { saveData: true }]) {
        const f = fixture(options);
        assert.equal(f.observers.length, 0);
        assert.equal(f.iframe(), undefined);
        f.click();
        f.message('onReady', {}, 'https://example.org');
        assert.equal(f.commands.length, 0);
        f.message('onReady', {});
        assert.ok(has(f, 'playVideo'));
    }
});

test('legenda EN/ES pede tradução da faixa PT; iframe fica fora do foco até tocar', () => {
    const f = fixture({ language: 'en' }); f.visible(true); f.message('onReady', {});
    const track = f.commands.find(c => c.func === 'setOption').args[2];
    assert.equal(track.languageCode, 'pt'); assert.equal(track.translationLanguage.languageCode, 'en');
    assert.equal(f.iframe().tabIndex, -1); assert.equal(f.iframe().attrs['aria-hidden'], 'true');
    f.visible(true); f.message('infoDelivery', { playerState: 1, muted: true });
    assert.equal(f.iframe().tabIndex, 0); assert.equal(f.iframe().attrs['aria-hidden'], undefined);
});
test('iOS: som recusado de novo após "Ligar o som" fica mudo e some o botão, sem ciclo', () => {
    const f = fixture(); f.visible(true); f.message('onReady', {});
    f.message('infoDelivery', { playerState: 1, muted: true }); assert.equal(f.sound.hidden, false);
    f.sound.click(); f.message('onStateChange', 2);
    assert.equal(f.sound.hidden, true); assert.equal(f.commands.at(-1).func, 'playVideo'); assert.equal(f.commands.at(-2).func, 'mute');
    f.message('infoDelivery', { playerState: 1, muted: true }); assert.equal(f.sound.hidden, true);
});
test('pausa feita pela pessoa muito depois do pedido de som não é tratada como bloqueio', () => {
    const f = fixture(); f.visible(true); f.message('onReady', {});
    f.sound.click(); f.tick(5000); const n = f.commands.length;
    f.message('onStateChange', 2); assert.equal(f.commands.length, n);
});

test('autoplay tenta com som; navegador barra → toca mudo com "Ligar o som" e não insiste ao voltar à seção', () => {
    const f = fixture(); f.visible(true); f.message('onReady', {});
    assert.equal(f.commands.findLast(c => ['mute', 'unMute'].includes(c.func)).func, 'unMute');
    f.message('onAutoplayBlocked');
    assert.equal(f.commands.at(-2).func, 'mute'); assert.equal(f.commands.at(-1).func, 'playVideo'); assert.equal(f.sound.hidden, false);
    f.visible(false); f.visible(true);
    assert.equal(f.commands.findLast(c => ['mute', 'unMute'].includes(c.func)).func, 'mute');
});
test('sem aviso de bloqueio e sem começar em 2,5 s (iOS), cai para mudo; tocando com som não mostra o botão', () => {
    const f = fixture(); f.visible(true); f.message('onReady', {});
    f.timeout(); assert.equal(f.commands.at(-1).func, 'playVideo'); assert.equal(f.commands.at(-2).func, 'mute'); assert.equal(f.sound.hidden, false);
    const g = fixture(); g.visible(true); g.message('onReady', {});
    g.message('infoDelivery', { playerState: 1, muted: false }); g.timeout();
    assert.equal(g.sound.hidden, true); assert.equal(g.commands.at(-1).func, 'playVideo');
});
