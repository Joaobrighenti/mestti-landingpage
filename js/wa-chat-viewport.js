/**
 * Sincroniza modal de chat WhatsApp com visualViewport (teclado iOS/Android).
 */
(function () {
    const MOBILE_CHAT_MAX = 480;

    function isMobileChat() {
        return window.innerWidth <= MOBILE_CHAT_MAX;
    }

    function isIOSDevice() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent)
            || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }

    function bindWaMobileViewport(modal) {
        if (!modal || modal.dataset.waViewportBound === '1') return;
        modal.dataset.waViewportBound = '1';

        const content = modal.querySelector('.wa-modal-content');
        if (!content) return;

        let rafId = 0;
        let lastHeight = 0;
        let lastTop = 0;
        let lastLeft = 0;
        let lastWidth = 0;

        function resetViewportStyles() {
            modal.classList.remove('wa-vv-sync');
            modal.style.top = '';
            modal.style.left = '';
            modal.style.right = '';
            modal.style.bottom = '';
            modal.style.width = '';
            modal.style.height = '';
            content.style.position = '';
            content.style.top = '';
            content.style.left = '';
            content.style.width = '';
            content.style.height = '';
            content.style.maxHeight = '';
            content.style.transform = '';
            lastHeight = 0;
            lastTop = 0;
            lastLeft = 0;
            lastWidth = 0;
        }

        function applyViewportSync() {
            const isOpen = modal.classList.contains('active');
            const isMobile = isMobileChat();

            if (!isOpen || !isMobile) {
                resetViewportStyles();
                return;
            }

            const vv = window.visualViewport;
            if (!vv) {
                content.style.height = '100dvh';
                content.style.maxHeight = '100dvh';
                return;
            }

            const height = Math.max(280, Math.round(vv.height));
            const offsetTop = Math.max(0, Math.round(vv.offsetTop));
            const offsetLeft = Math.max(0, Math.round(vv.offsetLeft));
            const width = Math.round(vv.width);
            if (
                height === lastHeight
                && offsetTop === lastTop
                && offsetLeft === lastLeft
                && width === lastWidth
                && modal.classList.contains('wa-vv-sync')
            ) {
                return;
            }

            lastHeight = height;
            lastTop = offsetTop;
            lastLeft = offsetLeft;
            lastWidth = width;

            modal.classList.add('wa-vv-sync');

            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.right = '0';
            modal.style.bottom = '0';
            modal.style.width = '';
            modal.style.height = '';

            content.style.position = 'fixed';
            content.style.top = '0';
            content.style.left = '0';
            content.style.width = `${width}px`;
            content.style.height = `${height}px`;
            content.style.maxHeight = `${height}px`;
            content.style.transform = `translate3d(${offsetLeft}px, ${offsetTop}px, 0)`;
        }

        function syncViewport({ immediate = false } = {}) {
            if (immediate) {
                cancelAnimationFrame(rafId);
                applyViewportSync();
                return;
            }

            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(applyViewportSync);
        }

        function onVisualViewportChange() {
            if (!modal.classList.contains('active') || !isMobileChat()) return;
            applyViewportSync();
        }

        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', onVisualViewportChange);
            window.visualViewport.addEventListener('scroll', onVisualViewportChange);
        }

        window.addEventListener('resize', () => syncViewport());
        window.addEventListener('orientationchange', () => {
            window.setTimeout(() => syncViewport({ immediate: true }), 120);
        });

        modal.addEventListener('focusin', (event) => {
            if (!event.target.closest('.wa-input, .wa-composer input, textarea')) return;
            applyViewportSync();
            window.setTimeout(applyViewportSync, 120);
            window.setTimeout(applyViewportSync, 280);
            window.setTimeout(applyViewportSync, 480);
        });

        modal.addEventListener('focusout', (event) => {
            if (!event.target.closest('.wa-input, .wa-composer input, textarea')) return;
            if (event.relatedTarget?.closest?.('.wa-send, .wa-chip')) return;
            window.setTimeout(applyViewportSync, 80);
            window.setTimeout(applyViewportSync, 280);
        });

        let wasModalActive = modal.classList.contains('active');

        const observer = new MutationObserver(() => {
            const isOpen = modal.classList.contains('active');
            if (isOpen === wasModalActive) return;
            wasModalActive = isOpen;

            if (isOpen && isMobileChat()) {
                syncViewport({ immediate: true });
                if (isIOSDevice()) {
                    requestAnimationFrame(() => syncViewport({ immediate: true }));
                }
                return;
            }
            resetViewportStyles();
        });
        observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
    }

    window.MesttiWaChatViewport = {
        bind: bindWaMobileViewport,
        isMobileChat,
        MOBILE_CHAT_MAX
    };
})();
