/**
 * Interações das páginas v2 sobre conteúdo que já está completo no HTML.
 * Sem JS, as páginas mostram o texto, os números finais e a primeira resposta do Otto.
 */
(function () {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DX = {
        pt: {
            running: 'Rodando', micro: 'Microparada', setup: 'Setup', stop: 'Parada', off: 'Intervalo',
            noReason: 'Sem justificativa', why: (min) => `Por que a máquina parou ${min} minutos?`,
            left: (n) => `Faltam ${n} ${n === 1 ? 'parada' : 'paradas'} para justificar.`,
            done: (r) => `Pronto. A maior perda do turno é "${r}". É por ela que a melhoria começa.`,
            stopAria: (n, a, b, m, r) => `Parada ${n}: ${a} a ${b}, ${m} minutos, ${r}`,
            approved: 'Aprovado por você', locale: 'pt-BR'
        },
        en: {
            running: 'Running', micro: 'Micro-stop', setup: 'Setup', stop: 'Stopped', off: 'Break',
            noReason: 'No reason given', why: (min) => `Why did the machine stop for ${min} minutes?`,
            left: (n) => `${n} ${n === 1 ? 'stop' : 'stops'} left to explain.`,
            done: (r) => `Done. The shift’s biggest loss is "${r}". That’s where improvement starts.`,
            stopAria: (n, a, b, m, r) => `Stop ${n}: ${a} to ${b}, ${m} minutes, ${r}`,
            approved: 'Approved by you', locale: 'en-US'
        },
        es: {
            running: 'Operando', micro: 'Microparada', setup: 'Setup', stop: 'Parada', off: 'Pausa',
            noReason: 'Sin justificación', why: (min) => `¿Por qué la máquina se detuvo ${min} minutos?`,
            left: (n) => `Faltan ${n} ${n === 1 ? 'parada' : 'paradas'} por justificar.`,
            done: (r) => `Listo. La mayor pérdida del turno es "${r}". Por ahí empieza la mejora.`,
            stopAria: (n, a, b, m, r) => `Parada ${n}: ${a} a ${b}, ${m} minutos, ${r}`,
            approved: 'Aprobado por usted', locale: 'es-ES'
        }
    };
    const lang = () => (DX[window.MESTTI_LANG] ? window.MESTTI_LANG : 'pt');
    const d = () => DX[lang()];
    const onLang = (fn) => document.addEventListener('mestti:lang', fn);

    function track(name, params) {
        if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
    }

    function whenVisible(element, callback, rootMargin) {
        if (!('IntersectionObserver' in window)) {
            callback();
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                observer.disconnect();
                callback();
            }
        }, { rootMargin: rootMargin || '0px' });
        observer.observe(element);
    }

    const money = (value) => 'R$ ' + Math.round(value).toLocaleString('pt-BR');

    // Turno acelerado no hero: a faixa se desenha e os números acompanham.
    function initShiftCard() {
        const card = document.querySelector('[data-shift-card]');
        if (!card) return;
        const segments = [...card.querySelectorAll('.hv-seg')];
        const cursor = card.querySelector('[data-shift-cursor]');
        const pill = card.querySelector('[data-shift-status]');
        const label = card.querySelector('[data-shift-status-label]');
        const counters = [...card.querySelectorAll('[data-count-to]')];
        const pills = { run: 'hv-pill--run', micro: 'hv-pill--micro', setup: 'hv-pill--setup', stop: 'hv-pill--stop', off: 'hv-pill--micro' };
        let current = 'run';
        const setPill = (kind) => {
            current = kind;
            pill.className = `hv-pill ${pills[kind] || pills.run}`;
            label.textContent = d()[{ run: 'running', micro: 'micro', setup: 'setup', stop: 'stop', off: 'off' }[kind]];
        };
        setPill('run');
        onLang(() => setPill(current));
        if (reduceMotion) return;
        const spans = segments.map((seg) => {
            const left = parseFloat(seg.style.left);
            const kind = (seg.className.match(/hv-seg--(\w+)/) || [])[1];
            return { left, right: left + parseFloat(seg.style.width), kind };
        });
        const format = (value, fmt) => {
            if (fmt === 'hm') {
                const minutes = Math.round(value);
                return `${Math.floor(minutes / 60)}h${String(minutes % 60).padStart(2, '0')}`;
            }
            return Math.round(value).toLocaleString(d().locale);
        };
        const frame = (progress) => {
            const pct = progress * 100;
            segments.forEach((seg, i) => {
                const span = spans[i];
                const visible = Math.max(0, Math.min(span.right, pct) - span.left);
                seg.style.setProperty('--clip', `${100 - (visible / (span.right - span.left)) * 100}%`);
            });
            cursor.style.left = `${pct}%`;
            const now = spans.find((span) => pct >= span.left && pct < span.right);
            if (now && now.kind !== current) setPill(now.kind);
            counters.forEach((el) => { el.textContent = format(Number(el.dataset.countTo) * progress, el.dataset.format); });
        };
        whenVisible(card, () => {
            card.classList.add('is-playing');
            const start = performance.now();
            const step = (now) => {
                const progress = Math.min(1, (now - start) / 7000);
                frame(progress);
                if (progress < 1) requestAnimationFrame(step);
                else { card.classList.remove('is-playing'); setPill('run'); }
            };
            frame(0);
            requestAnimationFrame(step);
        });
    }

    // Antes e depois do caso de cliente.
    function initCase() {
        const demo = document.querySelector('[data-case-demo]');
        if (!demo) return;
        const buttons = [...demo.querySelectorAll('[data-case-mode]')];
        const panels = [...demo.querySelectorAll('[data-case-panel]')];
        const select = (mode) => {
            buttons.forEach((b) => b.setAttribute('aria-checked', String(b.dataset.caseMode === mode)));
            panels.forEach((p) => { p.hidden = p.dataset.casePanel !== mode; });
        };
        buttons.forEach((button) => {
            button.addEventListener('click', () => { select(button.dataset.caseMode); track('v2_case_toggle', { mode: button.dataset.caseMode }); });
            button.addEventListener('keydown', (event) => {
                if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
                event.preventDefault();
                const next = buttons[(buttons.indexOf(button) + 1) % buttons.length];
                next.focus();
                next.click();
            });
        });
    }

    function initCaseVisual() {
        const el = document.querySelector('[data-case-visual]');
        if (!el) return;
        whenVisible(el, () => el.classList.add('is-visible'), '-80px 0px');
    }

    // Otto vivo: o mesmo polvo do produto, olhos que seguem o mouse e pulinho no clique.
    function initOttoMascot() {
        const svgs = document.querySelectorAll('[data-otto-live]');
        if (!svgs.length) return;
        import('/js/otto-mascot.js?v=1').then(({ mountOtto }) => {
            svgs.forEach((svg) => {
                const poke = svg.parentElement.querySelector('.hv-otto-poke');
                mountOtto(svg, { size: Number(svg.dataset.size) || 160, onPoke: () => { if (poke) poke.hidden = true; track('v2_otto_poke'); } });
            });
        }).catch((error) => console.error(error));
    }

    // Justificar paradas: o sensor já sabe quando e quanto; o operador escolhe o motivo.
    function initStopDemo() {
        const demo = document.querySelector('[data-stop-demo]');
        if (!demo) return;
        const stops = [...demo.querySelectorAll('[data-stop]')];
        const box = demo.querySelector('[data-stop-reason]');
        const title = demo.querySelector('[data-stop-reason-title]');
        const pareto = demo.querySelector('[data-stop-pareto]');
        const hint = demo.querySelector('[data-stop-hint]');
        const tip = demo.querySelector('[data-stop-tip]');
        const progress = demo.querySelector('[data-stop-progress]');
        const assigned = new Map();
        let active = null;
        const reasonLabel = (id) => demo.querySelector(`[data-reason="${id}"]`).textContent;

        function render() {
            const totals = new Map();
            stops.forEach((stop) => {
                const id = assigned.get(stop) || '';
                totals.set(id, (totals.get(id) || 0) + Number(stop.dataset.min));
            });
            const rows = [...totals.entries()].sort((a, b) => b[1] - a[1]);
            const max = rows[0][1];
            pareto.innerHTML = '';
            rows.forEach(([id, minutes]) => {
                const li = document.createElement('li');
                if (!id) li.className = 'is-pending';
                const name = document.createElement('span');
                name.textContent = id ? reasonLabel(id) : d().noReason;
                const value = document.createElement('b');
                value.textContent = `${minutes} min`;
                const bar = document.createElement('i');
                bar.style.width = `${(minutes / max) * 100}%`;
                li.append(name, value, bar);
                pareto.append(li);
            });
            const pending = stops.length - assigned.size;
            hint.textContent = pending ? d().left(pending) : d().done(reasonLabel(rows[0][0]));
            stops.forEach((stop) => {
                const id = assigned.get(stop);
                stop.setAttribute('aria-label', d().stopAria(stop.dataset.stop, stop.dataset.from, stop.dataset.to, stop.dataset.min, id ? reasonLabel(id) : d().noReason.toLowerCase()));
                stop.title = id ? reasonLabel(id) : '';
            });
            if (active) title.textContent = d().why(active.dataset.min);
            const next = stops.find((s) => !assigned.has(s));
            if (tip) {
                tip.hidden = !next || Boolean(active);
                if (next) tip.style.left = `${parseFloat(next.style.left) + parseFloat(next.style.width) / 2}%`;
            }
            if (progress) {
                progress.textContent = `${assigned.size} / ${stops.length}`;
                progress.classList.toggle('is-done', assigned.size === stops.length);
            }
        }

        function open(stop) {
            stops.forEach((s) => s.classList.toggle('is-active', s === stop));
            active = stop;
            title.textContent = d().why(stop.dataset.min);
            box.hidden = false;
            if (tip) tip.hidden = true;
            box.querySelector('button').focus({ preventScroll: true });
        }

        stops.forEach((stop) => stop.addEventListener('click', () => open(stop)));
        box.querySelectorAll('[data-reason]').forEach((button) => {
            button.addEventListener('click', () => {
                if (!active) return;
                assigned.set(active, button.dataset.reason);
                active.classList.remove('is-active');
                active.classList.add('is-done');
                active.querySelector('b').textContent = '✓';
                track('v2_stop_reason', { reason: button.dataset.reason });
                const next = stops.find((s) => !assigned.has(s));
                if (next) open(next);
                else { box.hidden = true; active = null; track('v2_stop_demo_complete'); }
                if (next) active = next;
                render();
            });
        });
        render();
        onLang(render);
    }

    // Otto: perguntas de exemplo em abas e a aprovação humana.
    function initOtto() {
        const demo = document.querySelector('[data-otto-demo]');
        if (!demo) return;
        // A próxima pergunta já vem escrita na caixa; a pessoa só toca em enviar.
        const turns = [...demo.querySelectorAll('[data-otto-turn]')];
        const composer = demo.querySelector('[data-otto-composer]');
        const draft = demo.querySelector('[data-otto-draft]');
        let current = 0;
        const nextIndex = () => (current + 1) % turns.length;
        const syncDraft = () => { draft.textContent = turns[nextIndex()].querySelector('.hv-octo-user p').textContent; };
        composer.addEventListener('submit', (event) => {
            event.preventDefault();
            if (composer.classList.contains('is-busy')) return;
            current = nextIndex();
            const hint = demo.querySelector('[data-otto-hint]');
            if (hint) hint.hidden = true;
            const turn = turns[current];
            const reply = turn.querySelector('.hv-octo-reply');
            turns.forEach((t) => { t.hidden = t !== turn; });
            track('v2_otto_question', { question: current + 1 });
            syncDraft();
            if (reduceMotion) return;
            // "Digitando…" antes da resposta, como no produto.
            reply.hidden = true;
            const typing = document.createElement('div');
            typing.className = 'hv-octo-typing';
            typing.setAttribute('aria-hidden', 'true');
            typing.innerHTML = '<i></i><i></i><i></i>';
            reply.before(typing);
            composer.classList.add('is-busy');
            setTimeout(() => { typing.remove(); reply.hidden = false; composer.classList.remove('is-busy'); }, 900);
        });
        composer.addEventListener('click', (event) => { if (!event.target.closest('button')) composer.requestSubmit(); });
        syncDraft();
        onLang(syncDraft);
        const approved = new Set();
        demo.querySelectorAll('[data-otto-approve]').forEach((button) => {
            button.addEventListener('click', () => {
                approved.add(button);
                button.closest('.hv-chat-action').classList.add('is-approved');
                button.removeAttribute('data-i18n');
                button.textContent = d().approved;
                button.disabled = true;
                track('v2_otto_approve');
            }, { once: true });
        });
        onLang(() => approved.forEach((button) => { button.textContent = d().approved; }));
    }

    // Calculadora: tamanho da oportunidade, com a conta à vista.
    function initCalc() {
        const form = document.querySelector('[data-calc]');
        if (!form) return;
        // Cada campo respeita o próprio min/max: 100 dias no mês ou 30 h no dia não entram na conta.
        const read = (name) => {
            const input = form.elements[name];
            if (!input) return 0;
            const max = input.max === '' ? Infinity : Number(input.max);
            return Math.min(max, Math.max(Number(input.min) || 0, Number(input.value) || 0));
        };
        const update = () => {
            const hours = read('machines') * read('hours') * read('days');
            form.querySelectorAll('[data-calc-row]').forEach((row) => {
                const share = Number(row.dataset.calcRow);
                row.querySelector('[data-calc-hours]').textContent = Math.round(hours * share).toLocaleString(d().locale);
                row.querySelector('[data-calc-value]').textContent = money(hours * share * read('rate'));
            });
            // Uma hora a mais por dia em cada máquina.
            const extra = read('machines') * read('days');
            const hourValue = form.querySelector('[data-calc-hour-value]');
            if (hourValue) {
                // Interpola a partir do valor que está na tela e cancela a animação anterior.
                const to = extra * read('rate');
                const from = Number(hourValue.dataset.shown || to);
                cancelAnimationFrame(Number(hourValue.dataset.raf || 0));
                const show = (v) => { hourValue.dataset.shown = String(v); hourValue.textContent = money(v); };
                if (reduceMotion || from === to) show(to);
                else {
                    const t0 = performance.now();
                    const tick = (now) => {
                        const k = Math.min(1, (now - t0) / 400);
                        show(from + (to - from) * (1 - Math.pow(1 - k, 3)));
                        if (k < 1) hourValue.dataset.raf = String(requestAnimationFrame(tick));
                    };
                    hourValue.dataset.raf = String(requestAnimationFrame(tick));
                }
                form.querySelector('[data-calc-hour-hours]').textContent = Math.round(extra).toLocaleString(d().locale);
            }
        };
        form.addEventListener('input', update);
        // Botões − e + (usados no celular): somam o passo do campo e respeitam min/max.
        form.querySelectorAll('.hv-calc-step').forEach((btn) => btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('input');
            const step = Number(input.step) || 1;
            input.value = Math.min(Number(input.max) || Infinity, Math.max(Number(input.min) || 0, read(input.name) + step * Number(btn.dataset.step)));
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }));
        form.addEventListener('change', (event) => {
            const input = event.target;
            if (input.name && input.value !== '' && Number(input.value) !== read(input.name)) input.value = read(input.name);
            update();
        });
        form.addEventListener('submit', (event) => event.preventDefault());
        form.addEventListener('change', () => track('v2_calc_change'), { once: true });
        update();
        onLang(update);
    }

    // Calculadora de OEE das páginas de tema: D × P × Q com os números do turno.
    function initOeeCalc() {
        const form = document.querySelector('[data-oee-calc]');
        if (!form) return;
        const num = (name) => {
            const input = form.elements[name];
            const v = Number(input.value);
            return Number.isFinite(v) ? Math.min(Number(input.max) || Infinity, Math.max(Number(input.min) || 0, v)) : 0;
        };
        const pct = (v) => (Number.isFinite(v) ? (v * 100).toLocaleString(d().locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%' : '–');
        const update = () => {
            const planned = num('planned');
            const run = Math.max(0, planned - num('stopped'));
            const total = num('total');
            const good = Math.min(num('good'), total);
            const avail = planned ? run / planned : NaN;
            const perf = run ? (total * num('cycle')) / 60 / run : NaN;
            const qual = total ? good / total : NaN;
            const out = { avail, perf, qual, oee: avail * perf * qual };
            form.querySelectorAll('[data-oee-out]').forEach((el) => { el.textContent = pct(out[el.dataset.oeeOut]); });
        };
        form.addEventListener('input', update);
        form.addEventListener('submit', (event) => event.preventDefault());
        form.addEventListener('change', () => track('v2_oee_calc_change'), { once: true });
        update();
        onLang(update);
    }

    // Meta por hora a partir do roteiro (página de engenharia).
    function initTarget() {
        const form = document.querySelector('[data-target-calc]');
        if (!form) return;
        const out = form.querySelector('[data-target-out]');
        const outShift = form.querySelector('[data-target-shift]');
        const update = () => {
            const cycle = Math.max(1, Number(form.elements.cycle.value) || 1);
            const cav = Math.max(1, Number(form.elements.cavities.value) || 1);
            const perHour = Math.floor(3600 / cycle) * cav;
            out.textContent = perHour.toLocaleString(d().locale);
            outShift.textContent = (perHour * 8).toLocaleString(d().locale);
        };
        form.addEventListener('input', update);
        form.addEventListener('submit', (event) => event.preventDefault());
        update();
        onLang(update);
    }

    // Fábrica 3D: só carrega perto da tela, depois do conteúdo.
    function initFactory() {
        const host = document.querySelector('[data-factory]');
        if (!host) return;
        whenVisible(host, () => import('/js/fabrica-sim.js?v=2').catch((error) => console.error(error)), '500px 0px');
    }

    // Vídeo: começa sem som quando a pessoa chega nele, pausa quando sai e liga o som num toque.
    // Clientes e apoiadores no celular: uma faixa que corre devagar. A cópia é só visual (aria-hidden).
    function initClientsMarquee() {
        document.querySelectorAll('.hv-clients-logos, .hv-supporters .hv-partners').forEach(marquee);
    }
    function marquee(list) {
        if (list.dataset.marquee) return;
        list.dataset.marquee = '1';
        [...list.children].forEach((li) => {
            const copy = li.cloneNode(true);
            copy.setAttribute('aria-hidden', 'true');
            copy.classList.add('is-copy');
            copy.querySelectorAll('img').forEach((img) => { img.alt = ''; });
            copy.querySelectorAll('a').forEach((a) => { a.tabIndex = -1; });
            list.appendChild(copy);
        });
    }

    function initVideo() {
        const frame = document.querySelector('[data-yt]');
        if (!frame) return;
        const sound = frame.querySelector('[data-yt-sound]');
        let iframe = null;
        let playing = false;
        let state = -1;
        let muted = false;
        const send = (func) => iframe && iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func, args: [] }), '*');
        const showSound = (on) => { sound.hidden = !on; };
        // O player avisa estado (1 = tocando) e se está mudo; serve para saber se o navegador barrou o som.
        window.addEventListener('message', (ev) => {
            if (!iframe || ev.source !== iframe.contentWindow) return;
            let data;
            try { data = typeof ev.data === 'string' ? JSON.parse(ev.data) : ev.data; } catch { return; }
            const info = data && data.info;
            if (!info || typeof info !== 'object') return;
            if (typeof info.playerState === 'number') state = info.playerState;
            if (typeof info.muted === 'boolean') muted = info.muted;
            if (state === 1) showSound(muted);
        });
        const load = (byClick) => {
            if (iframe) return;
            // Tenta sempre com som. Se o navegador não deixar, cai para mudo e mostra "Ligar o som".
            const params = new URLSearchParams({ autoplay: '1', mute: '0', playsinline: '1', rel: '0', modestbranding: '1', enablejsapi: '1', origin: location.origin });
            iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube-nocookie.com/embed/${frame.dataset.yt}?${params}`;
            iframe.title = frame.querySelector('figcaption').textContent;
            iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
            iframe.allowFullscreen = true;
            iframe.addEventListener('load', () => {
                iframe.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: 'mestti-video', channel: 'widget' }), '*');
                setTimeout(() => {
                    if (state === 1 && !muted) return;
                    send('mute');
                    send('playVideo');
                    showSound(true);
                }, byClick ? 4000 : 2500);
            });
            frame.appendChild(iframe);
            frame.classList.add('is-playing');
            playing = true;
            track('v2_video_start', { click: byClick });
        };
        frame.querySelector('[data-yt-play]').addEventListener('click', () => load(true));
        sound.addEventListener('click', () => { send('unMute'); send('playVideo'); showSound(false); track('v2_video_sound'); });
        if (reduceMotion || !('IntersectionObserver' in window)) return;
        // "Chegou no vídeo" = metade dele visível, ou ele ocupando boa parte de uma tela baixa.
        new IntersectionObserver((entries) => {
            entries.forEach((en) => {
                const seen = en.intersectionRatio >= 0.5 || en.intersectionRect.height >= window.innerHeight * 0.6;
                if (seen && !iframe) load(false);
                else if (seen && !playing) { send('playVideo'); playing = true; }
                else if (!en.isIntersecting && playing) { send('pauseVideo'); playing = false; }
            });
        }, { threshold: [0, 0.25, 0.5, 0.75] }).observe(frame);
    }

    document.querySelectorAll('[data-cta]').forEach((el) => {
        el.addEventListener('click', () => track('v2_cta', { position: el.dataset.cta, page: document.body.dataset.page }));
    });

    initShiftCard();
    initCase();
    initCaseVisual();
    initOttoMascot();
    initStopDemo();
    initOtto();
    initCalc();
    initOeeCalc();
    initVideo();
    initClientsMarquee();
    initTarget();
    initFactory();
})();
