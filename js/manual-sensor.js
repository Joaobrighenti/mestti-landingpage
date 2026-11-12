/* Manual do sensor de corrente: sequências 3D guiadas pela rolagem, passo atual, luzes e demonstrações. */
(function () {
    'use strict';
    var doc = document.documentElement;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

    /* ---------- sequência de quadros num canvas ---------- */
    function Seq(canvas) {
        this.c = canvas;
        this.ctx = canvas.getContext('2d');
        this.base = canvas.getAttribute('data-seq');
        this.n = parseInt(canvas.getAttribute('data-frames'), 10);
        this.imgs = new Array(this.n);
        this.want = 0;
        this.shown = -1;
        this.started = false;
    }
    Seq.prototype.src = function (i) { return this.base + String(i).padStart(3, '0') + '.webp'; };
    Seq.prototype.load = function () {
        if (this.started) return;
        this.started = true;
        var self = this;
        // primeiro, último e meio; depois o resto em ordem
        var order = [0, this.n - 1, Math.floor(this.n / 2)];
        for (var i = 0; i < this.n; i++) if (order.indexOf(i) < 0) order.push(i);
        order.forEach(function (i) {
            var im = new Image();
            im.decoding = 'async';
            im.onload = function () { self.imgs[i] = im; if (self.shown < 0 || Math.abs(i - self.want) < Math.abs(self.shown - self.want)) self.draw(); };
            im.src = self.src(i);
        });
    };
    Seq.prototype.set = function (p) {
        var f = Math.round(clamp(p, 0, 1) * (this.n - 1));
        if (f === this.want && f === this.shown) return;
        this.want = f;
        this.draw();
    };
    Seq.prototype.draw = function () {
        var best = -1;
        for (var d = 0; d < this.n; d++) {
            if (this.imgs[this.want - d]) { best = this.want - d; break; }
            if (this.imgs[this.want + d]) { best = this.want + d; break; }
        }
        if (best < 0 || best === this.shown) return;
        var im = this.imgs[best];
        if (this.c.width !== im.naturalWidth) { this.c.width = im.naturalWidth; this.c.height = im.naturalHeight; }
        this.ctx.clearRect(0, 0, this.c.width, this.c.height);
        this.ctx.drawImage(im, 0, 0);
        this.shown = best;
    };

    var hero = document.querySelector('[data-hero]');
    var heroSeq = hero && new Seq(hero.querySelector('canvas'));
    if (heroSeq) heroSeq.load();

    var scrub = document.querySelector('[data-scrub]');
    var scrubSeq = scrub && new Seq(scrub.querySelector('canvas'));
    var phases = scrub ? scrub.querySelectorAll('[data-phase]') : [];

    /* ---------- fita: as costas do sensor se endireitam ao rolar ---------- */
    var stick = document.querySelector('[data-stick]');

    /* ---------- topo, trilho e passo atual ---------- */
    var top = document.querySelector('.ms-top');
    var bar = document.querySelector('[data-progress]');
    var nowN = document.querySelector('[data-now-n]');
    var nowT = document.querySelector('[data-now-t]');
    var rail = document.querySelector('.ms-rail');
    var railLinks = rail ? rail.querySelectorAll('[data-rail]') : [];
    var steps = Array.prototype.slice.call(document.querySelectorAll('[data-step]'));
    var current = 0;

    function setCurrent(n) {
        if (n === current) return;
        current = n;
        var s = steps[n - 1];
        if (nowN) nowN.textContent = n ? String(n).padStart(2, '0') + '/09' : '00';
        if (nowT) nowT.textContent = s ? s.getAttribute('data-title') : 'Antes de começar';
        railLinks.forEach(function (a) {
            var k = parseInt(a.getAttribute('data-rail'), 10);
            a.classList.toggle('is-now', k === n);
            a.classList.toggle('is-done', k < n);
            if (k === n) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current');
        });
    }

    function progressIn(el) {
        var r = el.getBoundingClientRect();
        var run = r.height - window.innerHeight;
        return run > 0 ? clamp(-r.top / run, 0, 1) : (r.top < 0 ? 1 : 0);
    }

    var ticking = false;
    function frame() {
        ticking = false;
        var y = window.scrollY;
        var max = doc.scrollHeight - window.innerHeight;
        if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0).toFixed(4) + ')';

        if (hero) {
            var hp = progressIn(hero);
            heroSeq.set(hp);
            hero.classList.toggle('is-past', y > 40);
            var past = hero.getBoundingClientRect().bottom < window.innerHeight * .5;
            if (top) top.classList.toggle('is-on', past);
            if (rail) rail.classList.toggle('is-on', past);
        }

        if (scrub) {
            var r = scrub.getBoundingClientRect();
            if (r.top < window.innerHeight * 2 && r.bottom > -window.innerHeight) scrubSeq.load();
            var sp = progressIn(scrub);
            // a sequência ocupa 8% a 92% do trecho: começa parada e termina parada
            scrubSeq.set((sp - .08) / .84);
            var ph = sp < .36 ? 0 : sp < .62 ? 1 : 2;
            if (sp >= .9) ph = 3;
            phases.forEach(function (li, i) {
                li.classList.toggle('is-now', i === ph);
                li.classList.toggle('is-done', i < ph);
            });
        }

        if (stick) {
            var sr = stick.getBoundingClientRect();
            var k = clamp((window.innerHeight * .85 - sr.top) / (window.innerHeight * .55), 0, 1);
            var e = k * k * (3 - 2 * k);
            stick.style.setProperty('--rot', (-6 + 6 * e).toFixed(2) + 'deg');
            stick.style.setProperty('--by', (6 - 6 * e).toFixed(2) + '%');
        }

        // passo atual: o último cujo topo passou de 45% da tela
        var n = 0, line = window.innerHeight * .45;
        for (var i = 0; i < steps.length; i++) if (steps[i].getBoundingClientRect().top < line) n = i + 1;
        setCurrent(n);
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    frame();
    if (reduce && scrubSeq) { scrubSeq.load(); scrubSeq.set(1); }

    /* ---------- revelar ao entrar na tela ---------- */
    var reveal = document.querySelectorAll('.ms-in');
    if ('IntersectionObserver' in window && !reduce) {
        var io = new IntersectionObserver(function (es) {
            es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
        }, { rootMargin: '0px 0px -12% 0px' });
        reveal.forEach(function (el) { io.observe(el); });
    } else {
        reveal.forEach(function (el) { el.classList.add('is-in'); });
    }

    /* ---------- luzes: mesmos tempos do firmware (GPIO 19) ---------- */
    var PATTERNS = {
        // modo de configuração: alterna a cada 1 s
        config: function (t) { return t % 2000 < 1000; },
        // operação normal: 5 s apagado, 1 piscada de 200 ms
        normal: function (t) { var c = t % 5400; return c >= 5000 && c < 5200; },
        // erro: 5 s apagado, 3 piscadas de 200 ms
        err: function (t) { var c = t % 6200; if (c < 5000) return false; return (c - 5000) % 400 < 200; },
        // Wi-Fi conectou: aceso 5 s, depois normal
        ok: function (t) { return t < 5000 || PATTERNS.normal(t - 5000); }
    };
    var leds = Array.prototype.slice.call(document.querySelectorAll('[data-led]')).map(function (el) {
        return { el: el, fn: PATTERNS[el.getAttribute('data-led')], t0: null, vis: false, lit: null };
    });
    if ('IntersectionObserver' in window) {
        var lio = new IntersectionObserver(function (es) {
            es.forEach(function (e) {
                leds.forEach(function (l) {
                    if (l.el !== e.target) return;
                    l.vis = e.isIntersecting;
                    if (l.vis && l.t0 === null) l.t0 = performance.now();
                });
            });
        });
        leds.forEach(function (l) { lio.observe(l.el); });
    }
    function tickLeds(now) {
        leds.forEach(function (l) {
            if (!l.vis || !l.fn) return;
            var on = l.fn(now - l.t0);
            if (on !== l.lit) { l.lit = on; l.el.classList.toggle('is-lit', on); }
        });
        requestAnimationFrame(tickLeds);
    }
    requestAnimationFrame(tickLeds);

    // faixas de 10 s com os trechos acesos
    var NS = 'http://www.w3.org/2000/svg';
    document.querySelectorAll('[data-strip]').forEach(function (svg) {
        var fn = PATTERNS[svg.getAttribute('data-strip')];
        var W = 300, span = 12000, step = 20, x0 = null;
        var bg = document.createElementNS(NS, 'line');
        bg.setAttribute('x1', 0); bg.setAttribute('x2', W); bg.setAttribute('y1', 12); bg.setAttribute('y2', 12); bg.setAttribute('class', 'bg');
        svg.appendChild(bg);
        for (var t = 0; t <= span; t += step) {
            var on = t < span && fn(t);
            if (on && x0 === null) x0 = t;
            if (!on && x0 !== null) {
                var r = document.createElementNS(NS, 'rect');
                r.setAttribute('x', (x0 / span * W).toFixed(1)); r.setAttribute('y', 5);
                r.setAttribute('width', Math.max(2, (t - x0) / span * W).toFixed(1)); r.setAttribute('height', 14); r.setAttribute('rx', 2);
                r.setAttribute('class', 'on');
                svg.appendChild(r);
                x0 = null;
            }
        }
    });

    /* ---------- ID do sensor: guardado só neste aparelho ---------- */
    var idInput = document.querySelector('[data-sensor-id]');
    var echoes = document.querySelectorAll('[data-id-echo]');
    var fallback = [];
    echoes.forEach(function (el) { fallback.push(el.textContent); });
    function showId(v) {
        var ok = /^[0-9A-Za-z._-]{2,18}$/.test(v);
        echoes.forEach(function (el, i) { el.textContent = ok ? v : fallback[i]; });
    }
    if (idInput) {
        var saved = '';
        try { saved = localStorage.getItem('mesttiSensorId') || ''; } catch (e) { /* sem storage */ }
        if (saved) { idInput.value = saved; showId(saved); }
        idInput.addEventListener('input', function () {
            var v = idInput.value.trim().replace(/^Mestti-Config-/i, '');
            showId(v);
            try { if (v) localStorage.setItem('mesttiSensorId', v); else localStorage.removeItem('mesttiSensorId'); } catch (e) { /* sem storage */ }
        });
    }

    /* ---------- iPhone ou Android: escolha única para a página toda ---------- */
    var picks = document.querySelectorAll('[data-os-pick]');
    function setOs(os, save) {
        document.body.setAttribute('data-os', os);
        picks.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-os-pick') === os)); });
        if (save) { try { localStorage.setItem('mesttiOs', os); } catch (e) { /* sem storage */ } }
    }
    var os0 = '';
    try { os0 = localStorage.getItem('mesttiOs') || ''; } catch (e) { /* sem storage */ }
    if (os0 !== 'ios' && os0 !== 'and') os0 = /Android/i.test(navigator.userAgent) ? 'and' : 'ios';
    setOs(os0, false);
    picks.forEach(function (b) {
        b.addEventListener('click', function () {
            // mantém o botão clicado no mesmo lugar da tela quando o texto muda de altura
            var y = b.getBoundingClientRect().top;
            setOs(b.getAttribute('data-os-pick'), true);
            window.scrollBy(0, b.getBoundingClientRect().top - y);
        });
    });

    /* ---------- copiar o endereço ---------- */
    var copyBtn = document.querySelector('[data-copy]');
    if (copyBtn) {
        copyBtn.addEventListener('click', function () {
            var txt = document.querySelector('[data-copy-src]').textContent;
            var done = function () { copyBtn.textContent = 'Copiado'; setTimeout(function () { copyBtn.textContent = 'Copiar'; }, 1800); };
            if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, function () {});
        });
    }

    /* ---------- passo 6: endereço sendo digitado ---------- */
    var typer = document.querySelector('[data-type]');
    if (typer && 'IntersectionObserver' in window && !reduce) {
        var full = typer.getAttribute('data-type');
        typer.textContent = '';
        var tio = new IntersectionObserver(function (es) {
            if (!es[0].isIntersecting) return;
            tio.disconnect();
            var i = 0;
            typer.classList.add('is-typing');
            (function next() {
                typer.textContent = full.slice(0, ++i);
                if (i < full.length) setTimeout(next, 110 + Math.random() * 90);
                else setTimeout(function () { typer.classList.remove('is-typing'); }, 1200);
            })();
        }, { threshold: .6 });
        tio.observe(typer);
    }

    /* ---------- passo 7: teste da rede ---------- */
    var portal = document.querySelector('[data-portal]');
    if (portal && 'IntersectionObserver' in window) {
        var checks = portal.querySelectorAll('.pt-checks li');
        var title = portal.querySelector('[data-portal-title]');
        var timers = [];
        var run = function () {
            timers.forEach(clearTimeout); timers = [];
            portal.classList.remove('is-testing', 'is-done');
            checks.forEach(function (c) { c.classList.remove('is-ok'); });
            title.textContent = 'Conectando à rede';
            var at = function (ms, fn) { timers.push(setTimeout(fn, ms)); };
            at(1600, function () { portal.classList.add('is-testing'); });
            at(3000, function () { checks[0].classList.add('is-ok'); title.textContent = 'Confirmando'; });
            at(4600, function () { checks[1].classList.add('is-ok'); });
            at(5800, function () { checks[2].classList.add('is-ok'); });
            at(6400, function () { portal.classList.remove('is-testing'); portal.classList.add('is-done'); title.textContent = 'Wi-Fi configurado'; });
            at(11000, run);
        };
        var pio = new IntersectionObserver(function (es) {
            if (es[0].isIntersecting) run(); else { timers.forEach(clearTimeout); timers = []; }
        }, { threshold: .4 });
        pio.observe(portal);
    }
})();
