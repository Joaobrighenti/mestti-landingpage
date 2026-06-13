/**
 * Sincroniza modal de chat WhatsApp com visualViewport (teclado iOS/Android).
 * Inclui fallback para navegadores in-app (Instagram, Facebook, etc.).
 */
(function () {
    const MOBILE_CHAT_MAX = 480;
    const KEYBOARD_THRESHOLD = 80;

    function isMobileChat() {
        return window.innerWidth <= MOBILE_CHAT_MAX;
    }

    function isIOSDevice() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent)
            || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }

    function isInAppBrowser() {
        const ua = navigator.userAgent || '';
        return /Instagram|FBAN|FBAV|FB_IAB|Messenger|Line\/|LinkedInApp|Twitter|TikTok|BytedanceWebview|Snapchat/i.test(ua)
            || (isIOSDevice() && /AppleWebKit/.test(ua) && !/Safari|CriOS|FxiOS|EdgiOS/.test(ua));
    }

    function captureBaselineHeight() {
        const vv = window.visualViewport;
        return Math.max(window.innerHeight, vv?.height || 0);
    }

    function bindWaMobileViewport(modal) {
        if (!modal || modal.dataset.waViewportBound === '1') return;
        modal.dataset.waViewportBound = '1';

        const content = modal.querySelector('.wa-modal-content');
        if (!content) return;

        if (isInAppBrowser()) {
            document.documentElement.classList.add('wa-inapp-browser');
            modal.classList.add('wa-inapp-browser');
        }

        let rafId = 0;
        let pollId = 0;
        let baselineHeight = 0;
        let lastHeight = 0;
        let lastTop = 0;
        let lastLeft = 0;
        let lastWidth = 0;

        function resetViewportStyles() {
            modal.classList.remove('wa-vv-sync', 'wa-kb-open');
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
            content.style.paddingBottom = '';
            lastHeight = 0;
            lastTop = 0;
            lastLeft = 0;
            lastWidth = 0;
            window.clearInterval(pollId);
            pollId = 0;
        }

        function keyboardInset() {
            if (!baselineHeight) return 0;
            const inset = baselineHeight - window.innerHeight;
            return inset > KEYBOARD_THRESHOLD ? inset : 0;
        }

        function getViewportMetrics() {
            const vv = window.visualViewport;
            const inset = keyboardInset();
            const width = Math.round(vv?.width || window.innerWidth);

            if (isInAppBrowser() && inset > 0) {
                return {
                    height: Math.max(280, window.innerHeight),
                    offsetTop: Math.max(0, Math.round(window.scrollY || 0)),
                    offsetLeft: Math.max(0, Math.round(vv?.offsetLeft || 0)),
                    width,
                    keyboardOpen: true
                };
            }

            if (vv) {
                const vvHeight = Math.round(vv.height);
                const vvShrunk = baselineHeight && vvHeight < baselineHeight - KEYBOARD_THRESHOLD;

                if (isInAppBrowser() && inset > 0 && !vvShrunk) {
                    return {
                        height: Math.max(280, window.innerHeight),
                        offsetTop: Math.max(0, Math.round(window.scrollY || 0)),
                        offsetLeft: Math.max(0, Math.round(vv.offsetLeft || 0)),
                        width,
                        keyboardOpen: true
                    };
                }

                return {
                    height: Math.max(280, vvHeight),
                    offsetTop: Math.max(0, Math.round(vv.offsetTop || 0)),
                    offsetLeft: Math.max(0, Math.round(vv.offsetLeft || 0)),
                    width,
                    keyboardOpen: vvShrunk || inset > 0
                };
            }

            return {
                height: Math.max(280, window.innerHeight),
                offsetTop: 0,
                offsetLeft: 0,
                width,
                keyboardOpen: inset > 0
            };
        }

        function ensureInputVisible() {
            const input = modal.querySelector('.wa-input:focus, .wa-composer input:focus, textarea:focus');
            const target = input || modal.querySelector('.wa-composer');
            if (!target) return;

            requestAnimationFrame(() => {
                try {
                    target.scrollIntoView({ block: 'end', inline: 'nearest', behavior: 'auto' });
                } catch {
                    /* ignore */
                }
            });
        }

        function startKeyboardPoll() {
            if (!isInAppBrowser()) return;
            window.clearInterval(pollId);
            let ticks = 0;
            pollId = window.setInterval(() => {
                applyViewportSync();
                ensureInputVisible();
                ticks += 1;
                if (ticks >= 12) window.clearInterval(pollId);
            }, 120);
        }

        function applyViewportSync() {
            const isOpen = modal.classList.contains('active');
            const isMobile = isMobileChat();

            if (!isOpen || !isMobile) {
                resetViewportStyles();
                return;
            }

            const metrics = getViewportMetrics();
            const { height, offsetTop, offsetLeft, width, keyboardOpen } = metrics;

            if (
                height === lastHeight
                && offsetTop === lastTop
                && offsetLeft === lastLeft
                && width === lastWidth
                && modal.classList.contains('wa-vv-sync')
                && keyboardOpen === modal.classList.contains('wa-kb-open')
            ) {
                return;
            }

            lastHeight = height;
            lastTop = offsetTop;
            lastLeft = offsetLeft;
            lastWidth = width;

            modal.classList.add('wa-vv-sync');
            modal.classList.toggle('wa-kb-open', keyboardOpen);

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
            content.style.paddingBottom = '0';
            content.style.transform = offsetLeft || offsetTop
                ? `translate3d(${offsetLeft}px, ${offsetTop}px, 0)`
                : '';
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

        function onInputFocus(event) {
            if (!event.target.closest('.wa-input, .wa-composer input, textarea')) return;
            applyViewportSync();
            ensureInputVisible();
            startKeyboardPoll();
            window.setTimeout(applyViewportSync, 100);
            window.setTimeout(ensureInputVisible, 100);
            window.setTimeout(applyViewportSync, 250);
            window.setTimeout(ensureInputVisible, 250);
            window.setTimeout(applyViewportSync, 500);
            window.setTimeout(ensureInputVisible, 500);
        }

        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', onVisualViewportChange);
            window.visualViewport.addEventListener('scroll', onVisualViewportChange);
        }

        window.addEventListener('resize', () => syncViewport());
        window.addEventListener('orientationchange', () => {
            baselineHeight = captureBaselineHeight();
            window.setTimeout(() => syncViewport({ immediate: true }), 120);
        });

        modal.addEventListener('focusin', onInputFocus);

        modal.addEventListener('focusout', (event) => {
            if (!event.target.closest('.wa-input, .wa-composer input, textarea')) return;
            if (event.relatedTarget?.closest?.('.wa-send, .wa-chip')) return;
            window.setTimeout(() => {
                if (!modal.querySelector('.wa-input:focus, .wa-composer input:focus, textarea:focus')) {
                    baselineHeight = captureBaselineHeight();
                }
                applyViewportSync();
            }, 80);
            window.setTimeout(applyViewportSync, 280);
        });

        let wasModalActive = modal.classList.contains('active');

        const observer = new MutationObserver(() => {
            const isOpen = modal.classList.contains('active');
            if (isOpen === wasModalActive) return;
            wasModalActive = isOpen;

            if (isOpen && isMobileChat()) {
                baselineHeight = captureBaselineHeight();
                syncViewport({ immediate: true });
                if (isIOSDevice() || isInAppBrowser()) {
                    requestAnimationFrame(() => syncViewport({ immediate: true }));
                }
                return;
            }
            resetViewportStyles();
            if (isOpen) baselineHeight = captureBaselineHeight();
        });
        observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
    }

    window.MesttiWaChatViewport = {
        bind: bindWaMobileViewport,
        isMobileChat,
        isInAppBrowser,
        MOBILE_CHAT_MAX
    };
})();
