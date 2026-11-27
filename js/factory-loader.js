/* A prévia da própria maquete toca após a primeira dobra; o WebGL fica disponível para explorar. */
(function () {
    function mount(host, load = () => import('/js/fabrica-sim.js?v=36')) {
        const button = host.querySelector('[data-factory-start]');
        if (!button) return;
        const stopPreview = mountPreview(host);
        button.hidden = false;
        button.addEventListener('click', async (event) => {
            stopPreview();
            const canvas = document.createElement('canvas');
            const context = getWebGL(canvas);
            if (!context) {
                host.classList.add('fx--static');
                button.hidden = true;
                return;
            }

            host.classList.add('fx--requested');
            host.setAttribute('aria-busy', 'true');
            if (event.detail === 0) {
                host.tabIndex = -1;
                host.focus({ preventScroll: true });
            }
            button.hidden = true;
            try {
                const { mountFactory } = await load();
                mountFactory(canvas, context);
            } catch {
                host.removeAttribute('aria-busy');
                host.classList.remove('fx--requested');
                button.hidden = false;
                const lang = document.documentElement.lang;
                button.textContent = ({ en: 'Reload the 3D factory', es: 'Recargar la fábrica 3D' })[lang] || 'Recarregar fábrica 3D';
                // Um import que falhou pode permanecer no cache do navegador.
                button.onclick = () => location.reload();
                button.focus({ preventScroll: true });
                context.getExtension('WEBGL_lose_context')?.loseContext();
            }
        }, { once: true });
    }

    function getWebGL(canvas) {
        try { return canvas.getContext('webgl2', { alpha: false, antialias: true }); }
        catch { return null; }
    }

    function mountPreview(host) {
        const movie = host.querySelector('.fx-film');
        const motion = matchMedia('(prefers-reduced-motion: reduce)');
        const connection = navigator.connection;
        const limited = () => motion.matches || connection?.saveData
            || (connection?.effectiveType && connection.effectiveType !== '4g');
        if (!movie || limited() || !('IntersectionObserver' in window)) return () => {};

        const ratio = 0.15;
        let visible = false;
        let painted = false;
        let stopped = false;
        let pending = false;
        let fallbackSrc;
        const canPlay = () => painted && visible && !document.hidden && !limited() && !stopped && !movie.ended;
        const start = () => {
            pending = false;
            if (!canPlay()) return;
            if (!movie.hasAttribute('src')) {
                const mobile = matchMedia('(max-width: 640px)').matches;
                const mp4 = mobile ? movie.dataset.mobileSrc : movie.dataset.src;
                const webm = mobile ? movie.dataset.mobileWebm : movie.dataset.webm;
                if (movie.canPlayType('video/webm; codecs="vp9"')) {
                    fallbackSrc = mp4;
                    movie.src = webm;
                } else {
                    movie.src = mp4;
                }
            }
            movie.play().catch(() => {});
        };
        const sync = () => {
            if (!canPlay()) {
                movie.pause();
                return;
            }
            if (!pending) {
                pending = true;
                if (window.requestIdleCallback) window.requestIdleCallback(start, { timeout: 1200 });
                else setTimeout(start, 0);
            }
        };
        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.intersectionRatio >= ratio;
            sync();
        }, { threshold: ratio });
        observer.observe(host);
        document.addEventListener('visibilitychange', sync);
        motion.addEventListener?.('change', sync);
        connection?.addEventListener?.('change', sync);
        movie.addEventListener('playing', () => host.classList.add('fx--previewing'));
        movie.addEventListener('error', () => {
            host.classList.remove('fx--previewing');
            if (!fallbackSrc || stopped) return;
            movie.src = fallbackSrc;
            fallbackSrc = undefined;
            sync();
        });

        const afterLoad = async () => {
            // decode() também rejeita se a imagem falhar. Nesse caso, a prévia ainda pode abrir.
            await host.querySelector('.fx-poster')?.decode?.().catch(() => {});
            requestAnimationFrame(() => requestAnimationFrame(() => {
                setTimeout(() => { painted = true; sync(); }, 800);
            }));
        };
        if (document.readyState === 'complete') afterLoad();
        else window.addEventListener('load', afterLoad, { once: true });

        return () => {
            stopped = true;
            observer.disconnect();
            document.removeEventListener('visibilitychange', sync);
            motion.removeEventListener?.('change', sync);
            connection?.removeEventListener?.('change', sync);
            movie.pause();
        };
    }

    window.MesttiFactoryLoader = { mount };
})();
