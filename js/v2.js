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
        const tabs = [...demo.querySelectorAll('[role="tab"]')];
        const select = (tab) => {
            tabs.forEach((t) => {
                const on = t === tab;
                t.setAttribute('aria-selected', String(on));
                t.tabIndex = on ? 0 : -1;
                document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
            });
        };
        tabs.forEach((tab, i) => {
            tab.addEventListener('click', () => { select(tab); track('v2_otto_question', { question: tab.dataset.ottoQ }); });
            tab.addEventListener('keydown', (event) => {
                const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
                if (!delta) return;
                event.preventDefault();
                const next = tabs[(i + delta + tabs.length) % tabs.length];
                next.focus();
                select(next);
            });
        });
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
        const read = (name) => Math.max(0, Number(form.elements[name].value) || 0);
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
        form.addEventListener('submit', (event) => event.preventDefault());
        form.addEventListener('change', () => track('v2_calc_change'), { once: true });
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
    initTarget();
    initFactory();
})();
