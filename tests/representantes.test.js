import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../js/representantes.js', import.meta.url), 'utf8');
const markup = readFileSync(new URL('../representantes/index.html', import.meta.url), 'utf8');
const chapters = ['quando-indicar', 'como-funciona', 'diferenciais', 'indicacao'];
const steps = ['montagem', 'wifi', 'vinculo'];
const stepAnchors = ['instalacao-kit', 'instalacao-wifi', 'instalacao-vinculo'];
const studioPath = '/images/manual/sensor-de-corrente/giro-v2/';
const poster = studioPath + '012.webp';

function media(matches) {
    let onChange;
    return {
        matches,
        addEventListener(type, listener) {
            assert.equal(type, 'change');
            onChange = listener;
        },
        change(value) {
            this.matches = value;
            onChange();
        }
    };
}

function fixture({ horizontal = false, motion = true, saveData = false, startScreen = 'Monitoramento', failedPoster = false } = {}) {
    let focused;
    const queued = [];
    const requests = new Map();
    const windowListeners = new Map();
    const queries = [];

    function element({ top = 0, height = 0, ...properties } = {}) {
        const attributes = new Map();
        const listeners = new Map();
        const styles = new Map();
        return {
            children: [],
            dataset: {},
            style: { setProperty: (name, value) => styles.set(name, value), getPropertyValue: name => styles.get(name) },
            addEventListener: (type, listener) => listeners.set(type, listener),
            emit(type, event = {}) {
                listeners.get(type)?.(event);
            },
            getAttribute: name => attributes.get(name) ?? null,
            setAttribute(name, value) {
                attributes.set(name, String(value));
                if (name === 'src') this.src = value;
            },
            removeAttribute: name => attributes.delete(name),
            toggleAttribute(name, value) {
                if (value) this.setAttribute(name, '');
                else this.removeAttribute(name);
            },
            getBoundingClientRect() {
                return { top: this.top - window.scrollY, bottom: this.top + height - window.scrollY, height };
            },
            focus() { focused = this; },
            append(child) {
                if (child.parent) child.parent.children.splice(child.parent.children.indexOf(child), 1);
                child.parent = this;
                this.children.push(child);
            },
            prepend(child) {
                child.parent = this;
                this.children.unshift(child);
            },
            replaceWith(other) {
                const parent = this.parent;
                parent.children.splice(parent.children.indexOf(this), 1, other);
                other.parent = parent;
                this.parent = null;
            },
            top,
            ...properties
        };
    }

    const gallery = element({
        querySelectorAll: () => screens
    });
    const screens = ['Sequenciamento', 'Apontamento', startScreen, 'Qualidade']
        .map(screenName => element({ dataset: { screenName } }));
    screens.forEach(screen => gallery.append(screen));

    const progressBar = element();
    const stage = element();
    const visual = element();
    visual.append(stage);
    const kit = element({ complete: failedPoster, naturalWidth: 0, hidden: false, loading: 'lazy' });
    const kitFallback = element({ hidden: true });
    kit.setAttribute('src', poster);
    const scenes = steps.map(() => element());
    scenes[0].append(kit);
    const stepNodes = steps.map((installStep, index) => {
        const step = element({
            top: 3400 + index * 500, height: 500, dataset: { installStep },
            querySelector: () => scenes[index]
        });
        step.append(scenes[index]);
        return step;
    });
    const dial = stepAnchors.map(id => element({ hash: '#' + id }));
    const dialNav = element({ offsetHeight: 48, querySelectorAll: () => dial });
    visual.prepend(dialNav);
    const guide = element({
        top: 3300, height: 1600,
        querySelector: selector => ({
            '.reps-install-visual': visual, '.reps-install-stage': stage, '.reps-install-dial': dialNav,
            '.reps-install-kit': kit, '[data-kit-fallback]': kitFallback
        }[selector]),
        querySelectorAll: () => stepNodes
    });
    guide.append(visual);
    const chapterLinks = chapters.map(id => element({ hash: '#' + id }));
    const chapterNav = element({
        getBoundingClientRect: () => ({ bottom: 116 }),
        querySelector: () => progressBar,
        querySelectorAll: () => chapterLinks
    });
    const chapterTargets = new Map(chapters.map((id, index) => [id, element({ top: 1600 + index * 800 })]));
    const document = {
        documentElement: { scrollHeight: 6200 },
        querySelector: selector => ({ '.reps-gallery': gallery, '[data-install-guide]': guide, '.reps-index': chapterNav }[selector]),
        getElementById: id => chapterTargets.get(id),
        createElement: () => element()
    };
    const window = {
        innerHeight: 900,
        scrollY: 0,
        addEventListener: (type, listener) => windowListeners.set(type, listener)
    };
    const orientation = media(horizontal);
    const desktop = media(motion);
    const matchMedia = query => {
        queries.push(query);
        return query.includes('prefers-reduced-motion') ? desktop : orientation;
    };
    class Image {
        set src(value) {
            this.url = value;
            requests.set(value, this);
        }
        get src() { return this.url; }
    }

    runInNewContext(source, {
        document, window, matchMedia, Image,
        navigator: { connection: { saveData } },
        requestAnimationFrame: callback => queued.push(callback)
    });
    const flush = () => {
        queued.splice(0).forEach(callback => callback());
    };
    flush();
    const tablist = gallery.children[0];
    return {
        gallery, tablist, tabs: tablist.children, panels: gallery.children.slice(1), focused: () => focused,
        guide, kit, kitFallback, stage, scenes, stepNodes, chapterLinks, dial, dialNav, visual, progressBar, orientation, desktop, queries, requests, flush,
        scrollTo(position) {
            window.scrollY = position;
            windowListeners.get('scroll')();
            flush();
        },
        press(index, key) {
            let prevented = false;
            tablist.emit('keydown', { key, target: tablist.children[index], preventDefault() { prevented = true; } });
            return prevented;
        }
    };
}

function assertActiveTab(f, index) {
    f.tabs.forEach((tab, position) => {
        assert.equal(tab.getAttribute('aria-selected'), String(index === position));
        assert.equal(tab.tabIndex, index === position ? 0 : -1);
        const panel = f.panels[position];
        assert.equal(panel.hidden, index !== position);
        assert.equal(tab.getAttribute('aria-controls'), panel.id);
        assert.equal(panel.getAttribute('aria-labelledby'), tab.id);
    });
}

test('orientação das abas acompanha a largura e as setas seguem o eixo visível', () => {
    const f = fixture();
    assert.equal(f.tablist.getAttribute('role'), 'tablist');
    assert.equal(f.tablist.getAttribute('aria-orientation'), 'vertical');
    assertActiveTab(f, 2);
    assert.equal(f.press(2, 'ArrowRight'), false);
    assert.equal(f.press(2, 'ArrowDown'), true);
    assertActiveTab(f, 3);
    assert.equal(f.focused(), f.tabs[3]);
    assert.equal(f.press(3, 'ArrowDown'), true);
    assertActiveTab(f, 0);
    assert.equal(f.press(0, 'ArrowUp'), true);
    assertActiveTab(f, 3);
    assert.equal(f.press(3, 'Home'), true);
    assertActiveTab(f, 0);

    f.orientation.change(true);
    assert.equal(f.tablist.getAttribute('aria-orientation'), 'horizontal');
    assert.equal(f.press(0, 'ArrowDown'), false);
    assert.equal(f.press(0, 'ArrowLeft'), true);
    assertActiveTab(f, 3);
    assert.equal(f.press(3, 'ArrowRight'), true);
    assertActiveTab(f, 0);
    assert.equal(f.press(0, 'End'), true);
    assertActiveTab(f, 3);
    f.tabs[1].emit('click');
    assertActiveTab(f, 1);
});

test('galeria seleciona uma aba inicial válida mesmo quando o nome muda', () => {
    const f = fixture({ startScreen: 'Acompanhamento' });
    assertActiveTab(f, 0);
});

test('índice e guia apontam para âncoras reais e únicas', () => {
    function linksIn(navClass) {
        const nav = markup.match(new RegExp(`<nav\\b[^>]*class="${navClass}"[^>]*>[\\s\\S]*?</nav>`))?.[0] ?? '';
        return [...nav.matchAll(/href="#([^"]+)"/g)].map(([, id]) => id);
    }
    assert.deepEqual(linksIn('reps-index'), chapters);
    assert.deepEqual(linksIn('reps-install-dial'), stepAnchors);
    [...chapters, ...stepAnchors].forEach(id => {
        assert.equal([...markup.matchAll(new RegExp(`\\bid="${id}"`, 'g'))].length, 1);
    });
});

test('índice sinaliza o capítulo atual e atualiza o progresso da leitura', () => {
    const f = fixture();
    f.scrollTo(1510);
    assert.equal(f.chapterLinks[0].getAttribute('aria-current'), 'location');
    assert.equal(f.chapterLinks[1].getAttribute('aria-current'), null);
    const firstProgress = f.progressBar.style.getPropertyValue('--reading-progress');
    f.scrollTo(2300);
    assert.equal(f.chapterLinks[0].getAttribute('aria-current'), null);
    assert.equal(f.chapterLinks[1].getAttribute('aria-current'), 'location');
    assert(f.progressBar.style.getPropertyValue('--reading-progress') > firstProgress);
    f.scrollTo(10000);
    assert.equal(f.progressBar.style.getPropertyValue('--reading-progress'), 1);
});

test('guia avança nas duas direções e devolve as imagens às etapas sem movimento', () => {
    const f = fixture();
    assert(f.queries.includes('(min-width: 850px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)'));
    assert.equal(f.guide.getAttribute('data-track'), '');
    assert(f.scenes.every(scene => scene.parent === f.stage));
    assert.equal(f.dialNav.parent, f.visual);
    for (const index of [0, 1, 2, 1]) {
        f.scrollTo(3140 + index * 500);
        assert.equal(f.guide.dataset.active, steps[index]);
        f.dial.forEach((link, position) => assert.equal(link.getAttribute('aria-current'), position === index ? 'step' : null));
    }
    f.desktop.change(false);
    f.flush();
    assert.equal(f.guide.getAttribute('data-track'), null);
    assert(f.scenes.every((scene, index) => scene.parent === f.stepNodes[index]));
    assert.equal(f.dialNav.parent, f.guide);
    assert.equal(f.kit.src, poster);
    f.scrollTo(3750);
    assert.equal(f.dial[1].getAttribute('aria-current'), 'step');
    f.desktop.change(true);
    f.flush();
    assert.equal(f.guide.dataset.active, 'wifi');
});

test('economia de dados e movimento reduzido mantêm a foto fixa, sem baixar a rotação', () => {
    for (const options of [{ motion: false }, { saveData: true }]) {
        const f = fixture(options);
        f.scrollTo(3190);
        assert.equal(f.requests.size, 0);
        assert.equal(f.kit.src, poster);
    }
});

test('erro em quadro da instalação preserva imagem enquanto outros quadros carregam', () => {
    const f = fixture();
    f.scrollTo(3122);
    const first = studioPath + '000.webp';
    assert(f.requests.has(first));
    f.requests.get(first).onerror?.();
    f.flush();
    assert.equal(f.kit.src, poster);

    const next = studioPath + '018.webp';
    f.scrollTo(3372);
    assert(f.requests.has(next));
    f.requests.get(next).onload();
    f.flush();
    assert.equal(f.kit.src, next);

    f.scrollTo(3122);
    assert.equal(f.kit.src, next);
});

test('pôster indisponível mostra aviso e recupera a imagem assim que um quadro carrega', () => {
    for (const failedPoster of [true, false]) {
        const f = fixture({ failedPoster });
        if (!failedPoster) {
            assert.equal(f.kitFallback.hidden, true);
            assert.equal(f.kit.hidden, false);
            f.kit.emit('error');
        }
        assert.equal(f.kitFallback.hidden, false);
        assert.equal(f.kit.hidden, true);
        assert.equal(f.kit.loading, 'eager');
        assert(/<p data-kit-fallback hidden>[^<]+<\/p>/.test(markup), 'o aviso precisa existir no HTML servido');

        f.scrollTo(3622);
        assert.equal(f.guide.dataset.active, 'wifi');
        assert.equal(f.scenes[1].getAttribute('data-current'), '');
        f.scrollTo(3372);
        const next = studioPath + '018.webp';
        f.requests.get(next).onload();
        f.flush();
        assert.equal(f.kit.src, next);
        f.kit.emit('load');
        assert.equal(f.kitFallback.hidden, true);
        assert.equal(f.kit.hidden, false);
    }
});

test('página em português mantém o fluxo de indicação e os materiais acessíveis sem script', () => {
    assert.match(markup, /<body\b[^>]+data-content-lang="pt"/);
    assert.doesNotMatch(markup, /class="footer-langs"|js\/i18n\/representantes\.js/);
    const main = markup.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
    const referral = new URL(main.match(/href="(https:\/\/wa\.me\/[^"]+)"/)[1]);
    const message = referral.searchParams.get('text');
    assert.match(message, /Meu nome e empresa/);
    assert.match(message, /Indústria indicada e cidade/);
    assert.match(message, /confirmar o recebimento/);
    assert.match(main, /<video\b[^>]*controls[^>]*preload="none"/);
    assert.match(main, /<track\b[^>]*kind="captions"[^>]*srclang="pt-BR"/);
    for (const file of ['guia-comercial-mestti.pdf', 'mestti-monitoramento.mp4']) {
        assert(main.includes('href="/representantes/materiais/' + file + '" download'));
    }
});
