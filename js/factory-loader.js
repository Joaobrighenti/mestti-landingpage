/* O pôster aparece primeiro. A cena só é criada quando a pessoa escolhe explorar. */
(function () {
    function mount(host, load = () => import('/js/fabrica-sim.js?v=35')) {
        const button = host.querySelector('[data-factory-start]');
        if (!button) return;
        button.hidden = false;
        button.addEventListener('click', async (event) => {
            if (button.disabled) return;
            button.disabled = true;
            if (!hasWebGL()) {
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
                await load();
            } catch {
                host.removeAttribute('aria-busy');
                host.classList.remove('fx--requested');
                button.disabled = false;
                button.hidden = false;
                const lang = document.documentElement.lang;
                button.textContent = ({ en: 'Reload the 3D factory', es: 'Recargar la fábrica 3D' })[lang] || 'Recarregar fábrica 3D';
                // Um import que falhou pode permanecer no cache do navegador.
                button.onclick = () => location.reload();
                button.focus({ preventScroll: true });
            }
        }, { once: true });
    }

    function hasWebGL() {
        try {
            const gl = document.createElement('canvas').getContext('webgl2');
            gl?.getExtension('WEBGL_lose_context')?.loseContext();
            return !!gl;
        } catch { return false; }
    }

    window.MesttiFactoryLoader = { mount };
})();
