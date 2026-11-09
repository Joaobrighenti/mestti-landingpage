/* Página do Otto: conversa de exemplo animada e trilha de aprovação.
   Respeita "reduzir movimento": mostra o estado final, sem digitação nem ciclo automático. */
(function () {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const dec = (document.documentElement.lang || 'pt').startsWith('en') ? '.' : ',';
    const fmt = (ms) => `${(ms / 1000).toFixed(1).replace('.', dec)} s`;

    function chat(root) {
        const body = root.querySelector('[data-oc-body]');
        const input = root.querySelector('[data-oc-input]');
        const ph = input.querySelector('.oc-ph');
        const tabs = [...document.querySelectorAll('[data-oc-tab]')];
        const ids = tabs.map((b) => b.dataset.ocTab);
        let run = 0;
        let current = 0;
        let visible = true;
        let timer = null;

        const select = (i) => tabs.forEach((b, k) => b.setAttribute('aria-selected', String(k === i)));
        const scene = (id) => root.querySelector(`template[data-oc-scene="${id}"]`).content;

        async function typeInto(text, my) {
            ph.hidden = true;
            const span = document.createElement('span');
            span.className = 'oc-typed';
            input.appendChild(span);
            for (let i = 1; i <= text.length; i++) {
                if (my !== run) return false;
                span.textContent = text.slice(0, i);
                await wait(24 + Math.random() * 30);
            }
            await wait(320);
            span.remove();
            ph.hidden = false;
            return my === run;
        }

        async function play(i, { instant = reduced } = {}) {
            const my = ++run;
            current = i;
            clearTimeout(timer);
            select(i);
            const frag = scene(ids[i]);
            const user = frag.querySelector('.oc-user').cloneNode(true);
            const think = frag.querySelector('.oc-work').cloneNode(true);
            const answer = frag.querySelector('.oc-answer').cloneNode(true);
            body.replaceChildren();
            const approve = answer.querySelector('[data-oc-approve]');
            approve.addEventListener('click', () => {
                if (root.classList.contains('is-approved')) return;
                root.classList.add('is-approved');
                clearTimeout(timer);
                if (!reduced) timer = setTimeout(() => play((current + 1) % ids.length), 4200);
            });
            root.classList.remove('is-approved');
            const steps = [...think.querySelectorAll('li')];
            const sum = think.querySelector('.oc-sum');
            const sumText = sum.querySelector('.oc-sum-text');
            const tpl = sumText.textContent;
            sum.addEventListener('click', () => {
                const open = sum.getAttribute('aria-expanded') !== 'true';
                sum.setAttribute('aria-expanded', String(open));
                think.classList.toggle('is-open', open);
            });
            const collapse = (totalMs) => {
                const secs = Math.max(1, Math.round(totalMs / 1000));
                const now = new Date();
                const hm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                sumText.textContent = `${tpl.replace('{d}', `${secs} s`)} · ${hm}`;
                sum.hidden = false;
                think.classList.add('is-done');
            };

            if (instant) {
                steps.forEach((li, k) => { li.classList.add('is-ok'); li.querySelector('.oc-dur').textContent = fmt(1100 + k * 700); });
                collapse(2900);
                body.append(user, think, answer);
                answer.classList.add('is-in');
                return;
            }
            if (!(await typeInto(user.textContent.trim(), my))) return;
            body.append(user);
            user.classList.add('is-in');
            await wait(380);
            if (my !== run) return;
            body.append(think);
            const started = performance.now();
            for (const li of steps) {
                const dur = li.querySelector('.oc-dur');
                const t0 = performance.now();
                li.classList.add('is-on');
                const tick = setInterval(() => { dur.textContent = fmt(performance.now() - t0); }, 100);
                await wait(1000 + Math.random() * 500);
                clearInterval(tick);
                if (my !== run) return;
                dur.textContent = fmt(performance.now() - t0);
                li.classList.remove('is-on');
                li.classList.add('is-ok');
            }
            await wait(300);
            if (my !== run) return;
            collapse(performance.now() - started);
            body.append(answer);
            requestAnimationFrame(() => answer.classList.add('is-in'));
            timer = setTimeout(() => { if (my === run && visible) play((current + 1) % ids.length); }, 9000);
        }

        tabs.forEach((b, i) => b.addEventListener('click', () => play(i)));
        // As setas mudam de aba, como num tablist.
        tabs.forEach((b, i) => b.addEventListener('keydown', (e) => {
            if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
            const n = (i + (e.key === 'ArrowRight' ? 1 : ids.length - 1)) % ids.length;
            tabs[n].focus(); play(n);
        }));

        if ('IntersectionObserver' in window) {
            let started = false;
            new IntersectionObserver(([e]) => {
                visible = e.isIntersecting;
                if (visible && !started) { started = true; play(0); }
            }, { threshold: 0.3 }).observe(root);
        } else play(0);
    }

    function track(list) {
        const items = [...list.children];
        if (reduced || !('IntersectionObserver' in window)) { items.forEach((li) => li.classList.add('is-lit')); return; }
        let i = -1; let t = null;
        const tick = () => {
            i = (i + 1) % (items.length + 2);
            items.forEach((li, k) => li.classList.toggle('is-lit', k <= i));
            list.style.setProperty('--p', String(Math.min(i, items.length - 1) / (items.length - 1)));
            const human = items[i] && items[i].classList.contains('is-human');
            t = setTimeout(tick, human ? 1700 : i >= items.length ? 1400 : 650);
        };
        new IntersectionObserver(([e]) => {
            if (e.isIntersecting && !t) tick();
            if (!e.isIntersecting && t) { clearTimeout(t); t = null; }
        }, { threshold: 0.4 }).observe(list);
    }

    const start = () => {
        document.querySelectorAll('[data-oc]').forEach(chat);
        document.querySelectorAll('[data-ot-track]').forEach(track);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
