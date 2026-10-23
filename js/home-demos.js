/**
 * Demos da home: a tela de monitoramento ao vivo (MachineCard) e o Gantt de sequenciamento
 * (MaquinasGantt/GanttTaskBlock do produto). Dados de demonstração, todos neste arquivo.
 */
(function () {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lang = () => (['pt', 'en', 'es'].includes(window.MESTTI_LANG) ? window.MESTTI_LANG : 'pt');
    const locale = () => ({ pt: 'pt-BR', en: 'en-US', es: 'es-ES' }[lang()]);
    const onLang = (fn) => document.addEventListener('mestti:lang', fn);
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const num = (n) => Math.round(n).toLocaleString(locale() === 'en-US' ? 'en-US' : 'pt-BR');
    const pad = (n) => String(n).padStart(2, '0');
    const track = (name, params) => { if (typeof window.gtag === 'function') window.gtag('event', name, params || {}); };

    /* ------------------------------------------------------------ monitoramento */
    function initMonitor() {
        const root = document.querySelector('[data-monitor]');
        if (!root) return;
        const cards = [...root.querySelectorAll('[data-mc]')].map((el) => ({
            el,
            since: Number(el.dataset.since) || 0,
            rate: Number(el.dataset.mcRate) || 0,
            dur: el.querySelector('[data-mc-dur]'),
            total: el.querySelector('[data-mc-total]'),
            good: el.querySelector('[data-mc-good]'),
            times: el.querySelector('[data-mc-times]'),
            acc: Math.random() * 3
        }));
        const parse = (el) => Number(String(el.textContent).replace(/\D/g, '')) || 0;
        cards.forEach((c) => { c.totalN = parse(c.total); c.goodN = parse(c.good); });
        const fmtDur = (sec) => {
            const h = Math.floor(sec / 3600); const m = Math.floor((sec % 3600) / 60); const s = Math.floor(sec % 60);
            return (h ? `${h}h ` : '') + `${m}min ${pad(s)}s`;
        };
        const stamp = () => {
            const now = new Date();
            const marks = [60, 45, 30, 15, 0].map((back) => {
                const d = new Date(now.getTime() - back * 60000);
                return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
            });
            cards.forEach((c) => { c.times.innerHTML = marks.map((t) => `<span>${t}</span>`).join(''); });
        };
        stamp();
        let visible = true;
        new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(root);
        let last = performance.now();
        let lastStamp = Date.now();
        setInterval(() => {
            const now = performance.now();
            const dt = (now - last) / 1000;
            last = now;
            if (!visible || document.hidden) return;
            cards.forEach((c) => {
                c.since += dt;
                c.dur.textContent = fmtDur(c.since);
                if (!c.rate || reduceMotion) return;
                c.acc += dt;
                if (c.acc >= c.rate) {
                    c.acc = 0;
                    c.totalN += 1; c.goodN += 1;
                    c.total.textContent = num(c.totalN);
                    c.good.textContent = num(c.goodN);
                    c.el.classList.remove('is-bump');
                    void c.el.offsetWidth;
                    c.el.classList.add('is-bump');
                }
            });
            if (Date.now() - lastStamp > 30000) { lastStamp = Date.now(); stamp(); }
        }, 1000);
        onLang(() => cards.forEach((c) => { c.total.textContent = num(c.totalN); c.good.textContent = num(c.goodN); }));
    }

    /* ------------------------------------------------------------ Gantt */
    const GX = {
        pt: {
            backlog: 'Carteira de ordens', backlogSub: 'Ordens liberadas, aguardando programação', pending: 'A programar', scheduled: 'Programadas',
            machine: 'Máquina', program: 'Programar', due: 'Entrega', pcs: 'pç', now: 'Agora', today: 'Hoje', tomorrow: 'Amanhã',
            ok: 'no prazo', late: 'de atraso', done: 'Programada na', allDone: 'Todas as ordens foram programadas.', reset: 'Recomeçar a demonstração',
            toastOk: (o, m, end, due) => `OP ${o} entrou na fila da ${m}. Termina ${end} e a entrega é ${due}: no prazo.`,
            toastLate: (o, m, end, due, late) => `OP ${o} entrou na fila da ${m}. Termina ${end}, mas a entrega é ${due}: ${late} de atraso. No sistema, você antecipa a ordem ou troca de máquina antes de virar problema.`,
            running: 'Rodando', stopped: 'Parada há 23 min', setup: 'Em setup', proc: 'Proc.', comp: 'Componente', min: 'min', dueShort: 'entrega'
        },
        en: {
            backlog: 'Order backlog', backlogSub: 'Released orders waiting to be scheduled', pending: 'To schedule', scheduled: 'Scheduled',
            machine: 'Machine', program: 'Schedule', due: 'Due', pcs: 'pcs', now: 'Now', today: 'Today', tomorrow: 'Tomorrow',
            ok: 'on time', late: 'late', done: 'Scheduled on', allDone: 'All orders have been scheduled.', reset: 'Restart the demo',
            toastOk: (o, m, end, due) => `Order ${o} joined the ${m} queue. It finishes ${end} and is due ${due}: on time.`,
            toastLate: (o, m, end, due, late) => `Order ${o} joined the ${m} queue. It finishes ${end}, but it is due ${due}: ${late} late. In the system, you move the order up or switch machines before it becomes a problem.`,
            running: 'Running', stopped: 'Stopped for 23 min', setup: 'In setup', proc: 'Proc.', comp: 'Component', min: 'min', dueShort: 'due'
        },
        es: {
            backlog: 'Cartera de órdenes', backlogSub: 'Órdenes liberadas, esperando programación', pending: 'Por programar', scheduled: 'Programadas',
            machine: 'Máquina', program: 'Programar', due: 'Entrega', pcs: 'pz', now: 'Ahora', today: 'Hoy', tomorrow: 'Mañana',
            ok: 'a tiempo', late: 'de atraso', done: 'Programada en', allDone: 'Todas las órdenes fueron programadas.', reset: 'Reiniciar la demostración',
            toastOk: (o, m, end, due) => `La OP ${o} entró en la cola de la ${m}. Termina ${end} y la entrega es ${due}: a tiempo.`,
            toastLate: (o, m, end, due, late) => `La OP ${o} entró en la cola de la ${m}. Termina ${end}, pero la entrega es ${due}: ${late} de atraso. En el sistema, usted adelanta la orden o cambia de máquina antes de que sea un problema.`,
            running: 'Operando', stopped: 'Parada hace 23 min', setup: 'En setup', proc: 'Proc.', comp: 'Componente', min: 'min', dueShort: 'entrega'
        }
    };
    const L = (pt, en, es) => ({ pt, en, es });
    const PRODUCTS = {
        flange: L('Flange 4" aço 1020', 'Flange 4" 1020 steel', 'Brida 4" acero 1020'),
        bucha: L('Bucha guia Ø32', 'Guide bushing Ø32', 'Buje guía Ø32'),
        eixo: L('Eixo de transmissão 30 mm', 'Drive shaft 30 mm', 'Eje de transmisión 30 mm'),
        pinoArt: L('Pino de articulação', 'Hinge pin', 'Pasador de articulación'),
        pinoM12: L('Pino roscado M12', 'Threaded pin M12', 'Perno roscado M12'),
        luva: L('Luva de redução 1"', '1" reducing coupling', 'Manguito reductor 1"'),
        tampa: L('Tampa 28 mm PP', 'Cap 28 mm PP', 'Tapa 28 mm PP'),
        conector: L('Conector 3 vias', '3-way connector', 'Conector 3 vías'),
        caixa: L('Caixa organizadora 5 L', 'Storage box 5 L', 'Caja organizadora 5 L'),
        gaveta: L('Gaveta 40 cm', 'Drawer 40 cm', 'Cajón 40 cm'),
        suporte: L('Suporte em L 2 mm', 'L bracket 2 mm', 'Soporte en L 2 mm'),
        chapa: L('Chapa de fixação', 'Mounting plate', 'Placa de fijación')
    };
    const PROC = { cnc: L('Fresamento', 'Milling', 'Fresado'), lathe: L('Torneamento', 'Turning', 'Torneado'), inj: L('Injeção', 'Injection', 'Inyección'), press: L('Estampagem', 'Stamping', 'Estampado') };
    const COMP = { flange: L('Corpo', 'Body', 'Cuerpo'), tampa: L('Tampa', 'Cap', 'Tapa'), bucha: L('Bucha', 'Bushing', 'Buje') };
    // Horas a partir de hoje 06:00.
    const MACHINES = [
        { code: 'CNC-01', type: 'cnc', state: 'running', tasks: [['2481', 'flange', 0.17, 8.67], ['2490', 'bucha', 8.92, 27.17], ['2496', 'flange', 27.42, 31.67]] },
        { code: 'CNC-02', type: 'cnc', state: 'stopped', tasks: [['2477', 'eixo', 1.0, 10.72], ['2493', 'pinoArt', 10.97, 29.4]] },
        { code: 'TOR-01', type: 'lathe', state: 'running', tasks: [['2479', 'pinoM12', 0, 7.83], ['2491', 'luva', 8.08, 13.5], ['2499', 'pinoM12', 24, 33.17]] },
        { code: 'INJ-01', type: 'inj', state: 'running', tasks: [['2470', 'tampa', 0, 9.5], ['2485', 'conector', 10.17, 25.67], ['2494', 'tampa', 25.92, 46]] },
        { code: 'INJ-02', type: 'inj', state: 'setup', tasks: [['2488', 'caixa', 5.33, 11], ['2492', 'gaveta', 11.67, 28.5]] },
        { code: 'PRE-01', type: 'press', state: 'running', tasks: [['2475', 'suporte', 0.5, 8.17], ['2486', 'chapa', 8.42, 14.25]] }
    ];
    const BACKLOG = [
        { op: '2503', product: 'suporte', qty: 1800, type: 'press', hours: 7, due: 30 },
        { op: '2502', product: 'bucha', qty: 400, type: 'cnc', hours: 6, due: 54 },
        { op: '2501', product: 'tampa', qty: 3000, type: 'inj', hours: 9.6, due: 36 }
    ];
    const SPAN = 48; const NOW = 4.25; const HOUR_W = 38;

    function stringToColor(value) {
        let hash = 0;
        for (let i = 0; i < value.length; i += 1) hash = value.charCodeAt(i) + ((hash << 5) - hash);
        // Mesma fórmula do MaquinasGantt; o ângulo áureo espalha os tons porque os números de OP da demo são parecidos.
        const hue = Math.round(Math.abs(hash) * 137.508) % 360;
        const sat = 50 + (Math.abs(hash) % 30);
        const dark = document.documentElement.getAttribute('data-theme') === 'dark';
        return `hsl(${hue}, ${sat}%, ${dark ? 34 : 38}%)`;
    }

    function initGantt() {
        const root = document.querySelector('[data-gantt]');
        if (!root) return;
        const t = (k) => GX[lang()][k];
        const loc = (v) => (v && typeof v === 'object' ? v[lang()] : v);
        const base = new Date(); base.setHours(6, 0, 0, 0);
        const at = (h) => new Date(base.getTime() + h * 3600000);
        const hm = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
        const dayName = (h) => {
            const day = Math.floor((h + 6) / 24);
            if (day === 0) return t('today').toLowerCase();
            if (day === 1) return t('tomorrow').toLowerCase();
            return at(h).toLocaleDateString(locale(), { weekday: 'long' });
        };
        const when = (h) => `${dayName(h)} ${hm(at(h))}`;
        const dt = (h) => `${at(h).toLocaleDateString(locale(), { day: '2-digit', month: '2-digit' })} ${hm(at(h))}`;
        const span = (hours) => { const m = Math.round(hours * 60); return m < 60 ? `${m} min` : `${Math.floor(m / 60)}h${m % 60 ? pad(m % 60) : ''}`; };
        let state = null;
        const reset = () => {
            state = { machines: MACHINES.map((m) => ({ ...m, tasks: m.tasks.map((x) => [...x]) })), backlog: BACKLOG.map((b) => ({ ...b, placed: null })), toast: null, fresh: null };
        };
        reset();

        function render() {
            const W = SPAN * HOUR_W;
            const hours = [];
            for (let h = 0; h <= SPAN; h += 2) hours.push(h);
            const pending = state.backlog.filter((b) => !b.placed);
            const nights = [[16, 24], [40, 48]];
            root.innerHTML = `
                <aside class="gx-orders">
                    <div class="gx-orders-head"><h3>${t('backlog')}</h3><p>${t('backlogSub')}</p>
                        <div class="gx-tabs"><span class="is-on">${t('pending')} ${pending.length}</span><span>${t('scheduled')} ${state.machines.reduce((n, m) => n + m.tasks.length, 0)}</span></div></div>
                    <ul class="gx-list">${state.backlog.map((b) => orderCard(b)).join('')}</ul>
                    ${pending.length ? '' : `<button type="button" class="gx-reset" data-gx-reset>${t('reset')}</button>`}
                </aside>
                <div class="gx-main">
                    <div class="gx-labels"><div class="gx-labels-head">${t('machine')}</div>
                        ${state.machines.map((m) => `<div class="gx-label"><strong>${m.code}</strong><span><i class="${m.state === 'stopped' ? 'is-stop' : m.state === 'setup' ? 'is-setup' : ''}"></i>${t(m.state)}</span></div>`).join('')}</div>
                    <div class="gx-scroll" data-gx-scroll><div class="gx-canvas" style="width:${W}px">
                        <div class="gx-head">${hours.map((h) => `<div class="gx-hour" style="left:${h * HOUR_W}px;width:${HOUR_W * 2}px">${h % 6 === 0 ? `<small>${at(h).toLocaleDateString(locale(), { weekday: 'short', day: '2-digit', month: '2-digit' })}</small>` : ''}<b>${hm(at(h))}</b></div>`).join('')}</div>
                        ${state.machines.map((m, mi) => `<div class="gx-row">${nights.map(([a, b]) => `<i class="gx-night" style="left:${a * HOUR_W}px;width:${(b - a) * HOUR_W}px"></i>`).join('')}${hours.map((h) => `<i class="gx-grid" style="left:${h * HOUR_W}px"></i>`).join('')}${m.tasks.map((task, ti) => block(m, mi, task, ti)).join('')}${dueMarks(m)}</div>`).join('')}
                        <i class="gx-now" style="left:${NOW * HOUR_W}px" data-label="${t('now')} ${hm(at(NOW))}"></i>
                    </div></div>
                    ${state.toast ? `<p class="gx-toast" role="status">${state.toast}</p>` : ''}
                </div>`;
            const scroller = root.querySelector('[data-gx-scroll]');
            if (scroller) scroller.scrollLeft = state.scroll != null ? state.scroll : 0;
            state.fresh = null;
        }

        function orderCard(b) {
            const prod = loc(PRODUCTS[b.product]);
            if (b.placed) {
                const late = b.placed.end > b.due;
                return `<li class="gx-order is-done"><div class="gx-order-top"><strong>OP ${b.op}</strong><span>${num(b.qty)} ${t('pcs')}</span></div><p>${esc(prod)}</p>
                    <p class="gx-result ${late ? 'gx-late' : 'gx-ok'}">${t('done')} ${b.placed.machine} · ${late ? `${span(b.placed.end - b.due)} ${t('late')}` : t('ok')}</p></li>`;
            }
            return `<li class="gx-order"><div class="gx-order-top"><strong>OP ${b.op}</strong><span>${num(b.qty)} ${t('pcs')} · ${loc(PROC[b.type])}</span></div><p>${esc(prod)}</p>
                <div class="gx-order-due"><span>${t('due')} ${when(b.due)}</span><button type="button" class="gx-program" data-gx-program="${b.op}">${t('program')}</button></div></li>`;
        }

        function block(m, mi, task, ti) {
            const [op, product, start, end, late] = task;
            const left = Math.max(0, start) * HOUR_W;
            const width = Math.max(6, (Math.min(end, SPAN) - Math.max(0, start)) * HOUR_W - 2);
            const label = `${loc(PRODUCTS[product])} - ${op}`;
            const cls = ['gx-block', late ? 'is-late' : '', state.fresh === op ? 'is-new' : ''].join(' ');
            return `<button type="button" class="${cls}" style="left:${left}px;width:${width}px;background:${stringToColor(op)}" data-gx-task="${mi}:${ti}" aria-label="OP ${op}, ${esc(loc(PRODUCTS[product]))}, ${dt(start)} – ${dt(end)}"><span>${esc(label)}</span></button>`;
        }

        function dueMarks(m) {
            return state.backlog.filter((b) => b.placed && b.placed.machine === m.code)
                .map((b) => `<i class="gx-due" style="left:${Math.min(b.due, SPAN) * HOUR_W}px" data-label="${t('dueShort')} OP ${b.op}"></i>`).join('');
        }

        function program(op) {
            const b = state.backlog.find((x) => x.op === op);
            if (!b || b.placed) return;
            const options = state.machines.filter((m) => m.type === b.type).map((m) => {
                const last = m.tasks[m.tasks.length - 1];
                const start = Math.max(NOW, last ? last[3] + 0.25 : NOW);
                return { m, start, end: start + b.hours };
            }).sort((a, c) => a.end - c.end);
            const best = options[0];
            const late = best.end > b.due;
            best.m.tasks.push([b.op, b.product, best.start, best.end, late]);
            b.placed = { machine: best.m.code, end: best.end };
            state.fresh = b.op;
            state.toast = late
                ? t('toastLate')(b.op, best.m.code, when(best.end), when(b.due), span(best.end - b.due))
                : t('toastOk')(b.op, best.m.code, when(best.end), when(b.due));
            // Rola até o bloco novo.
            state.scroll = Math.max(0, (best.start - 3) * HOUR_W);
            render();
            track('home_gantt_program', { op: b.op, late });
        }

        let tip = null;
        function showTip(btn) {
            const [mi, ti] = btn.dataset.gxTask.split(':').map(Number);
            const m = state.machines[mi];
            const [op, product, start, end, late] = m.tasks[ti];
            const comp = COMP[product] ? `${loc(COMP[product])} · ` : '';
            if (!tip) { tip = document.createElement('div'); tip.className = 'gx-tip'; tip.setAttribute('role', 'tooltip'); }
            tip.innerHTML = `<strong>OP ${op}</strong><span>${esc(loc(PRODUCTS[product]))}</span><span>${comp}${t('proc')} ${loc(PROC[m.type])}</span><span>${dt(start)} – ${dt(end)} · ${Math.round((end - start) * 60)} ${t('min')}</span>${late ? `<span class="is-late">${span(end - BACKLOG.find((b) => b.op === op).due)} ${t('late')}</span>` : ''}`;
            root.appendChild(tip);
            const r = btn.getBoundingClientRect(); const host = root.getBoundingClientRect();
            const tw = tip.offsetWidth;
            const x = Math.min(Math.max(8, r.left - host.left + Math.min(r.width, 240) / 2 - tw / 2), host.width - tw - 8);
            tip.style.left = `${x}px`;
            tip.style.top = `${r.top - host.top - tip.offsetHeight - 8}px`;
        }
        const hideTip = () => { if (tip && tip.parentNode) tip.parentNode.removeChild(tip); };

        root.addEventListener('click', (e) => {
            const prog = e.target.closest('[data-gx-program]');
            if (prog) { const sc = root.querySelector('[data-gx-scroll]'); state.scroll = sc ? sc.scrollLeft : null; program(prog.dataset.gxProgram); return; }
            if (e.target.closest('[data-gx-reset]')) { reset(); render(); return; }
            const task = e.target.closest('[data-gx-task]');
            if (task) showTip(task);
        });
        root.addEventListener('mouseover', (e) => { const task = e.target.closest('[data-gx-task]'); if (task) showTip(task); });
        root.addEventListener('mouseout', (e) => { if (e.target.closest('[data-gx-task]')) hideTip(); });
        root.addEventListener('focusin', (e) => { const task = e.target.closest('[data-gx-task]'); if (task) showTip(task); });
        root.addEventListener('focusout', hideTip);
        root.addEventListener('scroll', hideTip, true);

        render();
        document.addEventListener('hv:tab', (e) => { if (e.detail === 'sequenciamento') render(); });
        onLang(() => { const sc = root.querySelector('[data-gx-scroll]'); state.scroll = sc ? sc.scrollLeft : null; state.toast = null; render(); });
        new MutationObserver(() => render()).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }

    /* ------------------------------------------------------------ abas da demonstração */
    function initTabs() {
        const tabs = [...document.querySelectorAll('[data-demo-tab]')];
        if (!tabs.length) return;
        const list = tabs[0].parentElement;
        const ink = list.querySelector('.hv-demo-tabs-ink');
        const moveInk = () => {
            const on = tabs.find((t) => t.getAttribute('aria-selected') === 'true');
            if (!on || !ink) return;
            ink.style.width = `${on.offsetWidth}px`;
            ink.style.transform = `translateX(${on.offsetLeft}px)`;
        };
        const select = (id, focus, user) => {
            tabs.forEach((t) => {
                const on = t.dataset.demoTab === id;
                t.setAttribute('aria-selected', String(on));
                t.tabIndex = on ? 0 : -1;
                document.getElementById(t.dataset.demoTab).hidden = !on;
                if (on && focus) t.focus();
            });
            moveInk();
            document.dispatchEvent(new CustomEvent('hv:tab', { detail: id }));
            if (user) {
                history.replaceState(null, '', `#${id}`);
                track('home_demo_tab', { tab: id });
            }
        };
        tabs.forEach((t, i) => {
            t.addEventListener('click', () => select(t.dataset.demoTab, false, true));
            t.addEventListener('keydown', (e) => {
                const keys = { ArrowRight: (i + 1) % tabs.length, ArrowLeft: (i + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1 };
                if (!(e.key in keys)) return;
                e.preventDefault();
                select(tabs[keys[e.key]].dataset.demoTab, true, true);
            });
        });
        // Links para #sequenciamento, #turno ou #fabrica-ao-vivo abrem a aba certa.
        const ids = tabs.map((t) => t.dataset.demoTab);
        const openFromHash = (hash) => {
            const id = (hash || '').replace('#', '');
            if (!ids.includes(id)) return false;
            select(id, false, true);
            document.getElementById('demo').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
            return true;
        };
        document.addEventListener('click', (e) => {
            const a = e.target.closest('a[href^="#"]');
            if (a && openFromHash(a.getAttribute('href'))) e.preventDefault();
        });
        if (location.hash) setTimeout(() => openFromHash(location.hash), 60);
        // No toque, a demo que funciona melhor com o polegar abre primeiro.
        else if (window.matchMedia('(pointer: coarse)').matches) select('turno');
        new ResizeObserver(moveInk).observe(list);
        moveInk();
    }

    /* ------------------------------------------------------------ entrada das seções e fita de estado */
    function initReveal() {
        window.__hvReveal = true;
        const els = [...document.querySelectorAll('.hv [data-reveal], .hv [data-tape]')];
        if (!els.length) return;
        if (!('IntersectionObserver' in window) || reduceMotion) { els.forEach((el) => el.classList.add('is-in')); return; }
        const io = new IntersectionObserver((entries) => {
            entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
        }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });
        els.forEach((el) => io.observe(el));
    }

    /* ------------------------------------------------------------ números que contam até o valor */
    function countUp(el, to, format, ms = 900) {
        if (reduceMotion) { el.textContent = format(to); return; }
        const t0 = performance.now();
        const ease = (k) => 1 - Math.pow(1 - k, 3);
        const step = (now) => {
            const k = Math.min(1, (now - t0) / ms);
            el.textContent = format(to * ease(k));
            if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }
    function initCounts() {
        const big = document.querySelector('[data-count-to-pct]');
        if (!big || !('IntersectionObserver' in window)) return;
        const to = Number(big.dataset.countToPct);
        const io = new IntersectionObserver(([en]) => {
            if (!en.isIntersecting) return;
            io.disconnect();
            const num = big.querySelector('[data-count-num]') || big;
            countUp(num, to, (v) => String(Math.round(v)));
        }, { threshold: 0.4 });
        io.observe(big);
    }

    /* ------------------------------------------------------------ barra do celular e WhatsApp */
    function initBars() {
        const bar = document.querySelector('[data-mobilebar]');
        const heroCta = document.querySelector('.hv-hero .hv-btn--primary');
        const final = document.querySelector('.hv-final');
        let heroGone = false; let finalOn = false;
        const sync = () => {
            if (bar) bar.classList.toggle('is-on', heroGone && !finalOn && !document.body.classList.contains('is-modal-open'));
            const scrolled = window.scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight);
            document.body.classList.toggle('hv-fab-on', scrolled > 0.35);
        };
        if ('IntersectionObserver' in window) {
            if (heroCta) new IntersectionObserver(([en]) => { heroGone = !en.isIntersecting && en.boundingClientRect.top < 0; sync(); }).observe(heroCta);
            if (final) new IntersectionObserver(([en]) => { finalOn = en.isIntersecting; sync(); }).observe(final);
        }
        addEventListener('scroll', sync, { passive: true });
        new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['class'] });
        sync();
    }

    const start = () => { initMonitor(); initGantt(); initTabs(); initReveal(); initCounts(); initBars(); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
}());
