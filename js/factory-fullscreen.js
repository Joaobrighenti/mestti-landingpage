/* Tela cheia móvel usa a camada superior de um dialog, sem depender da Fullscreen API do iPhone. */
export function createFactoryFullscreen(root, { mobile = false, label, onExit }) {
    let active = false;
    let native = false;
    let generation = 0;
    let placeholder = null;
    let dialog = null;
    let scroll = null;
    let originalHeight = 0;
    let background = [];
    const current = () => document.fullscreenElement || document.webkitFullscreenElement;
    const requestExit = () => { if (active) onExit(); };
    function restore() {
        if (placeholder?.parentNode) placeholder.replaceWith(root);
        placeholder = null;
        if (dialog?.open) dialog.close();
        dialog?.remove();
        dialog = null;
        for (const [element, inert] of background) element.inert = inert;
        background = [];
        if (scroll) window.scrollTo(scroll.x, scroll.y);
        scroll = null;
    }
    function overlay() {
        placeholder = document.createElement('div');
        placeholder.className = 'fx-placeholder';
        placeholder.style.height = `${originalHeight}px`;
        placeholder.setAttribute('aria-hidden', 'true');
        root.before(placeholder);
        dialog = document.createElement('dialog');
        dialog.className = 'fx-fullscreen-dialog';
        dialog.setAttribute('aria-label', label());
        document.body.appendChild(dialog);
        dialog.appendChild(root);
        dialog.addEventListener('cancel', event => { event.preventDefault(); requestExit(); });
        dialog.addEventListener('close', requestExit);
        try {
            dialog.showModal();
        } catch {
            // Navegadores sem dialog modal: retira a fábrica dos ancestrais que a recortavam.
            document.body.appendChild(root);
            dialog.remove();
            dialog = null;
            background = [...document.body.children].filter(e => e !== root).map(e => [e, e.inert]);
            background.forEach(([element]) => { element.inert = true; });
        }
        if (!mobile) root.querySelector('[data-fx-full]')?.focus({ preventScroll: true });
    }
    function enter() {
        if (active) return;
        active = true;
        scroll = { x: window.scrollX, y: window.scrollY };
        originalHeight = root.getBoundingClientRect().height;
        const ticket = ++generation;
        const request = root.requestFullscreen || root.webkitRequestFullscreen;
        if (mobile || !request) { overlay(); return; }
        try {
            Promise.resolve(request.call(root)).then(() => {
                if (ticket !== generation) {
                    if (current() === root) (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
                    return;
                }
                native = current() === root;
                if (!native) overlay();
            }).catch(() => { if (active && ticket === generation) overlay(); });
        } catch { overlay(); }
    }
    function exit() {
        if (!active) return;
        active = false;
        native = false;
        generation++;
        if (current() === root) {
            try { Promise.resolve((document.exitFullscreen || document.webkitExitFullscreen)?.call(document)).catch(() => {}); } catch { /* a saída visual permanece disponível */ }
        }
        restore();
    }
    const changed = () => {
        if (current() === root && active) native = true;
        else if (!current() && native && active) requestExit();
    };
    document.addEventListener('fullscreenchange', changed);
    document.addEventListener('webkitfullscreenchange', changed);
    return { enter, exit };
}
