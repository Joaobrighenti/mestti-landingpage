/* A maquete usa a mesma imagem e cena; no toque, o download pesado começa por escolha. */
(function () {
    function mount(host, load = () => import('/js/fabrica-sim.js?v=29')) {
        const button = host.querySelector('[data-factory-start]');
        const onDemand = matchMedia('(pointer: coarse)').matches || navigator.connection?.saveData;
        let started = false;
        const start = () => {
            if (started) return;
            started = true;
            host.classList.add('fx--requested');
            host.setAttribute('aria-busy', 'true');
            if (onDemand) {
                host.dataset.factoryExplore = 'true';
                host.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
            }
            if (button) {
                button.disabled = true;
                button.textContent = ({ en: 'Loading the 3D factory…', es: 'Cargando la fábrica 3D…' })[document.documentElement.lang] || 'Carregando a fábrica 3D…';
            }
            load().catch(() => {
                host.removeAttribute('aria-busy');
                host.classList.remove('fx--requested');
                if (button) { button.disabled = false; button.textContent = ({ en: 'Reload the 3D factory', es: 'Recargar la fábrica 3D' })[document.documentElement.lang] || 'Recarregar fábrica 3D'; }
                // Um import que falhou pode permanecer no cache do navegador; recarregar permite recuperá-lo.
                button?.addEventListener('click', () => location.reload(), { once: true });
            });
        };
        if (onDemand && button) {
            button.hidden = false;
            button.addEventListener('click', start, { once: true });
        } else {
            const whenVisible = () => {
                if (!('IntersectionObserver' in window)) return start();
                const observer = new IntersectionObserver(([entry]) => {
                    if (!entry.isIntersecting) return;
                    observer.disconnect();
                    start();
                }, { rootMargin: '150px 0px' });
                observer.observe(host);
            };
            if (document.readyState === 'complete') whenVisible();
            else window.addEventListener('load', whenVisible, { once: true });
        }
    }
    window.MesttiFactoryLoader = { mount };
})();
