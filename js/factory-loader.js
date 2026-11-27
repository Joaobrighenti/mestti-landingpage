/* Monta a maquete quando ela entra na tela, assim que a primeira imagem puder pintar. */
(function () {
    function mount(host, load = () => import('/js/fabrica-sim.js?v=37')) {
        const button = host.querySelector('[data-factory-start]');
        if (!button) return;

        let visible = !('IntersectionObserver' in window);
        let painted = false;
        let scheduled = false;
        let loading = false;
        let finished = false;
        let observer;
        let prepared;

        function stopWatching() {
            observer?.disconnect();
            document.removeEventListener('visibilitychange', schedule);
            host.removeEventListener('pointerdown', prioritize);
        }

        function schedule() {
            if (scheduled || loading || finished || !painted || !visible || document.hidden) return;
            scheduled = true;
            const run = () => {
                scheduled = false;
                if (visible && !document.hidden) start();
            };
            if (window.requestIdleCallback) window.requestIdleCallback(run, { timeout: 500 });
            else setTimeout(run, 0);
        }

        function prioritize() {
            if (painted && visible) start();
        }

        async function start(event) {
            if (loading || finished) return;
            if (prepared) {
                const ready = prepared;
                prepared = undefined;
                ready();
                return;
            }
            loading = true;
            const canvas = document.createElement('canvas');
            const context = getWebGL(canvas, !event);
            if (!context) {
                loading = false;
                stopWatching();
                button.hidden = Boolean(event);
                if (event) host.classList.add('fx--static');
                return;
            }

            host.setAttribute('aria-busy', 'true');
            if (event?.detail === 0) {
                host.tabIndex = -1;
                host.focus({ preventScroll: true });
            }
            button.hidden = true;
            try {
                const { mountFactory } = await load();
                loading = false;
                prepared = () => {
                    finished = true;
                    stopWatching();
                    mountFactory(canvas, context);
                };
                if (event || (visible && !document.hidden)) await start(event);
            } catch {
                finished = true;
                stopWatching();
                context.getExtension('WEBGL_lose_context')?.loseContext();
                host.removeAttribute('aria-busy');
                button.hidden = false;
                const lang = document.documentElement.lang;
                button.textContent = ({ en: 'Reload the 3D factory', es: 'Recargar la fábrica 3D' })[lang] || 'Recarregar fábrica 3D';
                button.onclick = () => location.reload();
                if (event) button.focus({ preventScroll: true });
            }
        }

        button.addEventListener('click', start, { once: true });
        host.addEventListener('pointerdown', prioritize, { passive: true });
        document.addEventListener('visibilitychange', schedule);
        if ('IntersectionObserver' in window) {
            observer = new IntersectionObserver(([entry]) => {
                visible = entry.isIntersecting;
                schedule();
            });
            observer.observe(host);
        }

        const poster = host.querySelector('.fx-poster');
        Promise.resolve(poster?.decode?.()).catch(() => {}).then(() => {
            requestAnimationFrame(() => requestAnimationFrame(() => {
                painted = true;
                schedule();
            }));
        });
    }

    function getWebGL(canvas, automatic) {
        try {
            const context = canvas.getContext('webgl2', {
                alpha: false,
                antialias: true,
                failIfMajorPerformanceCaveat: automatic,
            });
            if (automatic && context) {
                const info = context.getExtension('WEBGL_debug_renderer_info');
                const renderer = info && context.getParameter(info.UNMASKED_RENDERER_WEBGL);
                if (/swiftshader|llvmpipe|softpipe|software renderer|basic render driver/i.test(renderer)) {
                    context.getExtension('WEBGL_lose_context')?.loseContext();
                    return null;
                }
            }
            return context;
        } catch { return null; }
    }

    window.MesttiFactoryLoader = { mount };
})();
