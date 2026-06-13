/**
 * Sincroniza modal de chat WhatsApp com visualViewport (teclado iOS/Android).
 * Navegadores in-app (Instagram etc.) usam estimativa de altura do teclado.
 */
(function () {
    const MOBILE_CHAT_MAX = 480;
    const KEYBOARD_THRESHOLD = 80;
    const INAPP_KEYBOARD_BUFFER = 36;
    const TYPING_END_DELAY_MS = 350;

    function isMobileChat() {
        return window.innerWidth <= MOBILE_CHAT_MAX;
    }

    function isIOSDevice() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent)
            || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }

    function isInAppBrowser() {
        const ua = navigator.userAgent || '';
        if (/Instagram|FBAN|FBAV|FB_IAB|FBIOS|FBDV|Messenger|Line\/|LinkedInApp|Twitter|TikTok|BytedanceWebview|Snapchat/i.test(ua)) {
            return true;
        }
        if (isIOSDevice() && /AppleWebKit/.test(ua) && !/Safari|CriOS|FxiOS|EdgiOS|OPiOS/.test(ua)) {
            return true;
        }
        if (/Android/.test(ua) && /;\s*wv\)|Version\/[\d.]+.*Chrome\/[\d.]+(?!.*Safari)/i.test(ua)) {
            return true;
        }
        return false;
    }

    function captureBaselineHeight() {
        const vv = window.visualViewport;
        return Math.max(window.innerHeight, vv?.height || 0, document.documentElement.clientHeight || 0);
    }

    function detectKeyboardLift(baselineHeight) {
        const innerShrink = baselineHeight - window.innerHeight;
        if (innerShrink > KEYBOARD_THRESHOLD) return Math.round(innerShrink);

        const vv = window.visualViewport;
        if (vv && baselineHeight) {
            const vvShrink = baselineHeight - vv.height - Math.max(0, vv.offsetTop || 0);
            if (vvShrink > KEYBOARD_THRESHOLD) return Math.round(vvShrink);
        }
        return 0;
    }

    function estimateKeyboardHeight(baselineHeight) {
        const detected = detectKeyboardLift(baselineHeight);
        if (detected > KEYBOARD_THRESHOLD) return detected;

        const screenH = window.screen.height || baselineHeight;
        const innerH = window.innerHeight || baselineHeight;

        if (isIOSDevice()) {
            return Math.round(Math.min(360, Math.max(270, screenH * 0.41)));
        }

        return Math.round(Math.min(400, Math.max(250, innerH * 0.44)));
    }

    function withInAppBuffer(lift) {
        return lift > KEYBOARD_THRESHOLD ? lift + INAPP_KEYBOARD_BUFFER : lift;
    }

    function bindWaMobileViewport(modal) {
        if (!modal || modal.dataset.waViewportBound === '1') return;
        modal.dataset.waViewportBound = '1';

        const content = modal.querySelector('.wa-modal-content');
        if (!content) return;

        const inApp = isInAppBrowser();
        if (inApp) {
            document.documentElement.classList.add('wa-inapp-browser');
            modal.classList.add('wa-inapp-browser', 'wa-inapp-mode');
        }

        let rafId = 0;
        let pollId = 0;
        let focusOutTimer = 0;
        let baselineHeight = 0;
        let lastHeight = 0;
        let lastTop = 0;
        let lastLeft = 0;
        let lastWidth = 0;
        let lastLift = -1;
        let stableLift = 0;
        let typingActive = false;

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
            lastLift = -1;
            stableLift = 0;
            typingActive = false;
            document.documentElement.style.removeProperty('--wa-kb-lift');
            window.clearInterval(pollId);
            window.clearTimeout(focusOutTimer);
            pollId = 0;
            focusOutTimer = 0;
        }

        function isInputFocused() {
            return !!modal.querySelector('.wa-input:focus, .wa-composer input:focus, textarea:focus');
        }

        function computeInAppLift() {
            let lift = detectKeyboardLift(baselineHeight);
            if (lift <= KEYBOARD_THRESHOLD) {
                lift = estimateKeyboardHeight(baselineHeight);
            }
            return withInAppBuffer(lift);
        }

        function applyInAppLift(appliedLift, keyboardOpen) {
            if (appliedLift === lastLift && modal.classList.contains('wa-inapp-mode')) {
                modal.classList.toggle('wa-kb-open', keyboardOpen);
                return;
            }
            lastLift = appliedLift;

            modal.classList.add('wa-inapp-mode');
            modal.classList.toggle('wa-kb-open', keyboardOpen);
            document.documentElement.style.setProperty(
                '--wa-kb-lift',
                keyboardOpen ? `${appliedLift}px` : '0px'
            );

            content.style.position = 'fixed';
            content.style.top = '0';
            content.style.left = '0';
            content.style.width = '100%';
            content.style.transform = '';
            content.style.paddingBottom = '0';

            if (keyboardOpen) {
                content.style.height = `calc(100dvh - ${appliedLift}px)`;
                content.style.maxHeight = `calc(100dvh - ${appliedLift}px)`;
            } else {
                content.style.height = '100dvh';
                content.style.maxHeight = '100dvh';
            }
        }

        function beginTyping() {
            typingActive = true;
            window.clearTimeout(focusOutTimer);
            focusOutTimer = 0;

            const lift = computeInAppLift();
            stableLift = Math.max(stableLift, lift);
            applyInAppLift(stableLift, true);
        }

        function applyInAppSync() {
            const isOpen = modal.classList.contains('active');
            const isMobile = isMobileChat();

            if (!isOpen || !isMobile) {
                resetViewportStyles();
                return;
            }

            if (typingActive || isInputFocused()) {
                if (isInputFocused()) typingActive = true;

                const lift = computeInAppLift();
                stableLift = Math.max(stableLift, lift);
                applyInAppLift(stableLift, true);
                return;
            }

            stableLift = 0;
            applyInAppLift(0, false);
        }

        function scheduleTypingEnd() {
            window.clearTimeout(focusOutTimer);
            focusOutTimer = window.setTimeout(() => {
                focusOutTimer = 0;
                if (isInputFocused()) return;
                typingActive = false;
                stableLift = 0;
                baselineHeight = captureBaselineHeight();
                applyInAppSync();
            }, TYPING_END_DELAY_MS);
        }

        function applyViewportSync() {
            const isOpen = modal.classList.contains('active');
            const isMobile = isMobileChat();

            if (!isOpen || !isMobile) {
                resetViewportStyles();
                return;
            }

            if (inApp) {
                applyInAppSync();
                return;
            }

            const vv = window.visualViewport;
            if (!vv) return;

            const height = Math.max(280, Math.round(vv.height));
            const offsetTop = Math.max(0, Math.round(vv.offsetTop));
            const offsetLeft = Math.max(0, Math.round(vv.offsetLeft));
            const width = Math.round(vv.width);
            const keyboardOpen = baselineHeight && height < baselineHeight - KEYBOARD_THRESHOLD;

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

        function ensureInputVisible() {
            if (inApp) return;

            const input = modal.querySelector('.wa-input:focus, .wa-composer input:focus, textarea:focus');
            const composer = modal.querySelector('.wa-composer');
            const target = input || composer;
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
            window.clearInterval(pollId);
            if (inApp) {
                let ticks = 0;
                pollId = window.setInterval(() => {
                    if (!typingActive && !isInputFocused()) {
                        window.clearInterval(pollId);
                        pollId = 0;
                        return;
                    }
                    applyInAppSync();
                    ticks += 1;
                    if (ticks >= 6) {
                        window.clearInterval(pollId);
                        pollId = 0;
                    }
                }, 150);
                return;
            }

            let ticks = 0;
            pollId = window.setInterval(() => {
                applyViewportSync();
                ensureInputVisible();
                ticks += 1;
                if (ticks >= 12) window.clearInterval(pollId);
            }, 120);
        }

        function onVisualViewportChange() {
            if (!modal.classList.contains('active') || !isMobileChat()) return;

            if (inApp && typingActive) {
                const lift = computeInAppLift();
                if (lift > stableLift) {
                    stableLift = lift;
                    applyInAppLift(stableLift, true);
                }
                return;
            }

            applyViewportSync();
        }

        function onInputFocus(event) {
            if (!event.target.closest('.wa-input, .wa-composer input, textarea')) return;

            if (inApp) {
                beginTyping();
                startKeyboardPoll();
                return;
            }

            applyViewportSync();
            ensureInputVisible();
            startKeyboardPoll();
            [100, 250, 500].forEach((ms) => {
                window.setTimeout(() => {
                    applyViewportSync();
                    ensureInputVisible();
                }, ms);
            });
        }

        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', onVisualViewportChange);
            window.visualViewport.addEventListener('scroll', onVisualViewportChange);
        }

        window.addEventListener('resize', () => {
            if (inApp && typingActive) {
                stableLift = Math.max(stableLift, computeInAppLift());
                applyInAppLift(stableLift, true);
                return;
            }
            syncViewport();
        });

        window.addEventListener('orientationchange', () => {
            baselineHeight = captureBaselineHeight();
            stableLift = 0;
            window.setTimeout(() => syncViewport({ immediate: true }), 120);
        });

        modal.addEventListener('focusin', onInputFocus);

        modal.addEventListener('focusout', (event) => {
            if (!event.target.closest('.wa-input, .wa-composer input, textarea')) return;
            if (event.relatedTarget?.closest?.('.wa-send, .wa-chip')) return;

            if (inApp) {
                scheduleTypingEnd();
                return;
            }

            window.setTimeout(() => {
                if (!isInputFocused()) {
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
                lastLift = -1;
                stableLift = 0;
                syncViewport({ immediate: true });
                if (isIOSDevice() || inApp) {
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
        isInAppBrowser,
        MOBILE_CHAT_MAX
    };
})();
