import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function fixture({ language = 'pt', reduceMotion = false } = {}) {
    const source = fs.readFileSync('js/v2.js', 'utf8');
    const start = source.indexOf('    function initVideo() {');
    const end = source.indexOf("    document.querySelectorAll('[data-cta]')", start);
    const observers = [], commands = [], events = [], windowEvents = new Map(), documentEvents = new Map(), timers = new Map();
    let timerId = 0, iframe, locked = false, clock = 1000;
    const button = () => ({ hidden: true, addEventListener(type, fn) { this[type] = fn; } });
    const sound = button(), play = button();
    const frame = { dataset: { yt: 'v9ebdO-P66E' }, classList: { playing: false, add() { this.playing = true; } }, querySelector(s) { return s === '[data-yt-sound]' ? sound : s === '[data-yt-play]' ? play : { textContent: 'Vídeo da Mestti' }; }, appendChild(e) { iframe = e; } };
    const document = { querySelector: () => frame, documentElement: { classList: { contains: () => locked } }, addEventListener: (type, fn) => documentEvents.set(type, fn), createElement() { return { tabIndex: 0, attrs: {}, setAttribute(k, v) { this.attrs[k] = v; }, removeAttribute(k) { delete this.attrs[k]; }, contentWindow: { postMessage(text, origin) { commands.push({ ...JSON.parse(text), origin }); } }, addEventListener(type, fn) { this[type] = fn; } }; } };
    class IntersectionObserver { constructor(fn, options) { this.fn = fn; this.options = options; observers.push(this); } observe() {} disconnect() {} }
    const window = { MESTTI_LANG: language, innerHeight: 844, IntersectionObserver, addEventListener: (type, fn) => windowEvents.set(type, fn) };
    vm.runInNewContext(source.slice(start, end) + '\ninitVideo()', { performance: { now: () => clock }, document, window, IntersectionObserver, URLSearchParams, location: { origin: 'https://mestti.com.br' }, navigator: {}, reduceMotion, track: (...args) => events.push(args), setInterval(fn) { timers.set(++timerId, fn); return timerId; }, clearInterval(id) { timers.delete(id); } });
    const message = (event, info, origin = 'https://www.youtube-nocookie.com') => windowEvents.get('message')({ source: iframe?.contentWindow, origin, data: JSON.stringify({ event, info }) });
    const near = () => observers[1].fn([{ isIntersecting: true }]);
    const visible = on => observers[2].fn([{ isIntersecting: on, intersectionRatio: on ? 0.6 : 0, intersectionRect: { height: on ? 300 : 0 } }]);
    return { tick(ms) { clock += ms; }, window, commands, observers, events, frame, sound, near, visible, message, iframe: () => iframe, click: () => play.click(), language(lang) { window.MESTTI_LANG = lang; documentEvents.get('mestti:lang')(); }, lock() { locked = true; windowEvents.get('mestti:factory-fullscreen')({ detail: { active: true } }); } };
}
const has = (f, func) => f.commands.some(c => c.func === func);

test('prepara antes da seção sem tocar e começa mudo assim que o player estiver pronto e visível', () => {
    const f = fixture(); assert.equal(f.iframe(), undefined);
    assert.equal(f.observers[1].options.rootMargin, '350px 0px');
    f.near(); assert.equal(new URL(f.iframe().src).searchParams.get('autoplay'), '0');
    f.message('initialDelivery', {}); assert.equal(has(f, 'playVideo'), false);
    f.visible(true); assert.ok(has(f, 'mute')); assert.ok(has(f, 'playVideo'));
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
        const f = fixture({ language }); f.near();
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
test('mensagem de outro domínio é ignorada e movimento reduzido conserva reprodução por clique', () => {
    const f = fixture({ reduceMotion: true }); assert.equal(f.observers.length, 2);
    f.near(); f.message('onReady', {}, 'https://example.org'); assert.equal(f.commands.length, 0);
    f.message('onReady', {}); assert.equal(has(f, 'playVideo'), false);
    f.click(); assert.ok(has(f, 'playVideo'));
});

test('legenda EN/ES pede tradução da faixa PT; iframe fica fora do foco até tocar', () => {
    const f = fixture({ language: 'en' }); f.near(); f.message('onReady', {});
    const track = f.commands.find(c => c.func === 'setOption').args[2];
    assert.equal(track.languageCode, 'pt'); assert.equal(track.translationLanguage.languageCode, 'en');
    assert.equal(f.iframe().tabIndex, -1); assert.equal(f.iframe().attrs['aria-hidden'], 'true');
    f.visible(true); f.message('infoDelivery', { playerState: 1, muted: true });
    assert.equal(f.iframe().tabIndex, 0); assert.equal(f.iframe().attrs['aria-hidden'], undefined);
});
test('iOS: som recusado de novo após "Ligar o som" fica mudo e some o botão, sem ciclo', () => {
    const f = fixture(); f.near(); f.message('onReady', {}); f.visible(true);
    f.message('infoDelivery', { playerState: 1, muted: true }); assert.equal(f.sound.hidden, false);
    f.sound.click(); f.message('onStateChange', 2);
    assert.equal(f.sound.hidden, true); assert.equal(f.commands.at(-1).func, 'playVideo'); assert.equal(f.commands.at(-2).func, 'mute');
    f.message('infoDelivery', { playerState: 1, muted: true }); assert.equal(f.sound.hidden, true);
});
test('pausa feita pela pessoa muito depois do pedido de som não é tratada como bloqueio', () => {
    const f = fixture(); f.near(); f.message('onReady', {}); f.visible(true);
    f.sound.click(); f.tick(5000); const n = f.commands.length;
    f.message('onStateChange', 2); assert.equal(f.commands.length, n);
});
