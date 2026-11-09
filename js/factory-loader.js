/* A maquete abre automaticamente quando visível, após os recursos iniciais da página. */
(function () {
    function mount(host, load = () => import('/js/fabrica-sim.js?v=31')) {
        const button = host.querySelector('[data-factory-start]');
        const deferWork = matchMedia('(pointer: coarse)').matches || navigator.connection?.saveData;
        let started = false;
        const start = () => {
            if (started) return;
            started = true;
            host.classList.add('fx--requested');
            host.setAttribute('aria-busy', 'true');
            load().catch(() => {
                host.removeAttribute('aria-busy');
                host.classList.remove('fx--requested');
                if (button) { button.hidden = false; button.disabled = false; button.textContent = ({ en: 'Reload the 3D factory', es: 'Recargar la fábrica 3D' })[document.documentElement.lang] || 'Recarregar fábrica 3D'; }
                // Um import que falhou pode permanecer no cache do navegador; recarregar permite recuperá-lo.
                button?.addEventListener('click', () => location.reload(), { once: true });
            });
        };
        const schedule = () => {
            if (deferWork && window.requestIdleCallback) window.requestIdleCallback(start, { timeout: 2000 });
            else start();
        };
        const whenVisible = () => {
            if (!('IntersectionObserver' in window)) return schedule();
            const observer = new IntersectionObserver(([entry]) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                schedule();
            }, { rootMargin: '150px 0px' });
            observer.observe(host);
        };
        if (document.readyState === 'complete') whenVisible();
        else window.addEventListener('load', whenVisible, { once: true });
    }
    window.MesttiFactoryLoader = { mount };
})();
