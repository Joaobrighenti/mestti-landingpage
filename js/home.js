/**
 * Home — interações sobre conteúdo que já está completo no HTML.
 * Sem JS, a página mostra o turno inteiro, os números finais e a primeira resposta do Otto.
 */
(function () {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function track(name, params) {
        if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
    }

    function formatValue(value, format) {
        if (format === 'hm') {
            const minutes = Math.round(value);
            return `${Math.floor(minutes / 60)}h${String(minutes % 60).padStart(2, '0')}`;
        }
        return Math.round(value).toLocaleString('pt-BR');
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

    // 1. Turno acelerado no hero: a faixa se desenha e os números acompanham.
    function initShiftCard() {
        const card = document.querySelector('[data-shift-card]');
        if (!card || reduceMotion) return;
        const segments = [...card.querySelectorAll('.hv-seg')];
        const cursor = card.querySelector('[data-shift-cursor]');
        const pill = card.querySelector('[data-shift-status]');
        const counters = [...card.querySelectorAll('[data-count-to]')];
        const kinds = {
            run: ['hv-pill--run', 'Rodando'],
            micro: ['hv-pill--micro', 'Microparada'],
            setup: ['hv-pill--micro', 'Setup'],
            stop: ['hv-pill--stop', 'Parada'],
            off: ['hv-pill--micro', 'Intervalo']
        };
        const spans = segments.map((seg) => {
            const left = parseFloat(seg.style.left);
            const kind = (seg.className.match(/hv-seg--(\w+)/) || [])[1];
            return { left, right: left + parseFloat(seg.style.width), kind };
        });
        const duration = 7000;

        function setPill(kind) {
            const [cls, label] = kinds[kind] || kinds.run;
            pill.className = `hv-pill ${cls}`;
            pill.lastChild.textContent = label;
        }

        function frame(progress) {
            const pct = progress * 100;
            card.style.setProperty('--clip', `${100 - pct}%`);
            segments.forEach((seg, i) => {
                const span = spans[i];
                const visible = Math.max(0, Math.min(span.right, pct) - span.left);
                const width = span.right - span.left;
                seg.style.setProperty('--clip', `${100 - (visible / width) * 100}%`);
            });
            cursor.style.left = `${pct}%`;
            const current = spans.find((span) => pct >= span.left && pct < span.right);
            if (current) setPill(current.kind);
            counters.forEach((el) => {
                el.textContent = formatValue(Number(el.dataset.countTo) * progress, el.dataset.format);
            });
        }

        whenVisible(card, () => {
            card.classList.add('is-playing');
            const start = performance.now();
            function step(now) {
                const progress = Math.min(1, (now - start) / duration);
                frame(progress);
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    card.classList.remove('is-playing');
                    setPill('run');
                }
            }
            frame(0);
            requestAnimationFrame(step);
        });
    }

    // 4. Caso moveleiro: antes e depois do início do turno.
    function initCase() {
        const demo = document.querySelector('[data-case-demo]');
        if (!demo) return;
        const buttons = [...demo.querySelectorAll('[data-case-mode]')];
        const panels = [...demo.querySelectorAll('[data-case-panel]')];
        function select(mode) {
            buttons.forEach((b) => b.setAttribute('aria-checked', String(b.dataset.caseMode === mode)));
            panels.forEach((p) => { p.hidden = p.dataset.casePanel !== mode; });
        }
        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                select(button.dataset.caseMode);
                track('home_case_toggle', { mode: button.dataset.caseMode });
            });
            button.addEventListener('keydown', (event) => {
                if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
                event.preventDefault();
                const next = buttons[(buttons.indexOf(button) + 1) % buttons.length];
                next.focus();
                next.click();
            });
        });
    }

    // 6. Justificar paradas: o sensor já sabe quando e quanto; o operador escolhe o motivo.
    function initStopDemo() {
        const demo = document.querySelector('[data-stop-demo]');
        if (!demo) return;
        const stops = [...demo.querySelectorAll('[data-stop]')];
        const reasonBox = demo.querySelector('[data-stop-reason]');
        const reasonTitle = demo.querySelector('[data-stop-reason-title]');
        const pareto = demo.querySelector('[data-stop-pareto]');
        const hint = demo.querySelector('[data-stop-hint]');
        const assigned = new Map();
        let active = null;

        function render() {
            const totals = new Map();
            stops.forEach((stop) => {
                const reason = assigned.get(stop) || 'Sem justificativa';
                totals.set(reason, (totals.get(reason) || 0) + Number(stop.dataset.min));
            });
            const rows = [...totals.entries()].sort((a, b) => b[1] - a[1]);
            const max = rows[0][1];
            pareto.innerHTML = '';
            rows.forEach(([reason, minutes]) => {
                const li = document.createElement('li');
                li.dataset.reasonRow = reason;
                const label = document.createElement('span');
                label.textContent = reason;
                const value = document.createElement('b');
                value.textContent = `${minutes} min`;
                const bar = document.createElement('i');
                bar.style.width = `${(minutes / max) * 100}%`;
                li.append(label, value, bar);
                pareto.append(li);
            });
            const pending = stops.length - assigned.size;
            hint.textContent = pending
                ? `Faltam ${pending} ${pending === 1 ? 'parada' : 'paradas'} para justificar.`
                : `Pronto. A maior perda do turno é "${rows[0][0]}". É por ela que a melhoria começa.`;
        }

        function open(stop) {
            stops.forEach((s) => s.classList.toggle('is-active', s === stop));
            active = stop;
            reasonTitle.textContent = `Por que a máquina parou ${stop.dataset.min} minutos?`;
            reasonBox.hidden = false;
            reasonBox.querySelector('button').focus({ preventScroll: true });
        }

        stops.forEach((stop) => stop.addEventListener('click', () => open(stop)));
        reasonBox.querySelectorAll('[data-reason]').forEach((button) => {
            button.addEventListener('click', () => {
                if (!active) return;
                const reason = button.dataset.reason;
                assigned.set(active, reason);
                active.classList.remove('is-active');
                active.classList.add('is-done');
                active.querySelector('b').textContent = '✓';
                active.title = reason;
                active.setAttribute('aria-label', `Parada de ${active.dataset.min} minutos: ${reason}`);
                const next = stops.find((s) => !assigned.has(s));
                track('home_stop_reason', { reason });
                render();
                if (next) {
                    open(next);
                } else {
                    reasonBox.hidden = true;
                    active = null;
                    track('home_stop_demo_complete');
                }
            });
        });
    }

    // 10. Otto: perguntas de exemplo em abas e a aprovação humana.
    function initOtto() {
        const demo = document.querySelector('[data-otto-demo]');
        if (!demo) return;
        const tabs = [...demo.querySelectorAll('[role="tab"]')];
        function select(tab) {
            tabs.forEach((t) => {
                const selected = t === tab;
                t.setAttribute('aria-selected', String(selected));
                t.tabIndex = selected ? 0 : -1;
                document.getElementById(t.getAttribute('aria-controls')).hidden = !selected;
            });
        }
        tabs.forEach((tab, i) => {
            tab.addEventListener('click', () => {
                select(tab);
                track('home_otto_question', { question: tab.dataset.ottoQ });
            });
            tab.addEventListener('keydown', (event) => {
                const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
                if (!delta) return;
                event.preventDefault();
                const next = tabs[(i + delta + tabs.length) % tabs.length];
                next.focus();
                select(next);
            });
        });
        demo.querySelectorAll('[data-otto-approve]').forEach((button) => {
            button.addEventListener('click', () => {
                const action = button.closest('.hv-chat-action');
                action.classList.add('is-approved');
                button.textContent = 'Aprovado por você';
                button.disabled = true;
                track('home_otto_approve');
            }, { once: true });
        });
    }

    // 7. Fábrica 3D só carrega perto da tela, depois do conteúdo.
    function initFactory() {
        const section = document.getElementById('fabrica-ao-vivo');
        if (!section) return;
        whenVisible(section, () => {
            const status = section.querySelector('[data-fabrica-status]');
            if (status) status.textContent = 'Montando a fábrica…';
            import('/js/fabrica-hero.js?v=34').catch((error) => {
                console.error(error);
                if (status) status.textContent = 'Não foi possível carregar a maquete.';
            });
        }, '600px 0px');
    }

    document.querySelectorAll('[data-cta]').forEach((el) => {
        el.addEventListener('click', () => track('home_cta', { position: el.dataset.cta }));
    });

    initShiftCard();
    initCase();
    initStopDemo();
    initOtto();
    initFactory();
})();
