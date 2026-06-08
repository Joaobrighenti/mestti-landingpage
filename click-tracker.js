/**
 * MESTTI — rastreamento de cliques com nomes legíveis em português.
 * Formato do ID: "Página › Local › Ação" (ex.: "Início › Cabeçalho desktop › Demonstração")
 */
(function () {
    const SESSION_KEY = 'mesttiClickSession';
    const TRACK_ATTR = 'data-track-id';

    const ACTIONABLE_SELECTOR = [
        'a[href]',
        'button',
        'input[type="submit"]',
        'input[type="button"]',
        '[role="button"]',
        '[role="tab"]',
        '.btn',
        '.nav-link',
        '.btn-open-modal',
        '.theme-switcher-btn',
        '.lang-switcher-btn',
        '.demo-submit',
        '.service-offer-cta',
        '.sensores-intel-sensor-cta',
        '.sensores-intel-cta',
        '.btn-cta-green',
        '.impl-roadmap-step'
    ].join(', ');

    const PAGE_LABELS = {
        home: 'Início',
        empresa: 'Sobre a empresa',
        contato: 'Contato',
        sensores: 'Sensores',
        sequenciamento: 'Sequenciamento',
        cmms: 'CMMS',
        atuacao: 'Atuação'
    };

    const HOME_SECTION_ACTIONS = {
        '#controle-total': 'Ir para seção Soluções',
        '#sensores': 'Ir para seção Sensores',
        '#implementacao': 'Ir para seção Implementação'
    };

    const LANG_LABELS = {
        pt: 'Português',
        en: 'English',
        es: 'Español'
    };

    function getPageSlug() {
        const fromBody = document.body?.dataset?.page;
        if (fromBody) return String(fromBody).trim();

        const path = window.location.pathname.replace(/^\/|\/$/g, '');
        if (!path) return 'home';
        return path.replace(/\//g, '-');
    }

    function getPageLabel() {
        return PAGE_LABELS[getPageSlug()] || getPageSlug();
    }

    function stripHtml(text) {
        return String(text || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    }

    function translatePt(key) {
        if (!key || !window.MesttiI18n?.t) return '';
        const translated = window.MesttiI18n.t('pt', key);
        return stripHtml(translated);
    }

    function getPlacement(el) {
        if (el.id === 'fabContact' || el.closest('#fabContact')) {
            return 'Botão flutuante (canto da tela)';
        }

        if (el.closest('.modal-overlay')) {
            return 'Modal de demonstração';
        }

        if (el.closest('.theme-switcher')) {
            return 'Seletor de tema';
        }

        if (el.closest('.lang-switcher')) {
            return 'Seletor de idioma';
        }

        if (el.closest('.header-nav')) {
            if (el.closest('.mobile-nav-contact')) return 'Menu mobile — contato';
            if (el.closest('.header-nav-mobile-extras')) return 'Menu mobile — ações';
            if (el.closest('.mobile-nav-header')) return 'Menu mobile — topo';
            return 'Menu mobile';
        }

        if (el.closest('.header-tractian-actions') || el.closest('.header-link-contact')) {
            return 'Cabeçalho desktop';
        }

        if (el.closest('.hero')) {
            return 'Topo da página (hero)';
        }

        if (el.closest('#controle-total, .features-testimonials')) {
            return 'Seção Nossas soluções';
        }

        if (el.closest('.sistema-grid-section')) {
            return 'Galeria de telas do sistema';
        }

        if (el.closest('#sensores, .sensores-cards-section, .sensores-intel-home')) {
            return 'Seção Sensores industriais';
        }

        if (el.closest('.impl-roadmap-shell, #implementacao')) {
            if (el.classList.contains('impl-roadmap-step')) {
                const step = el.getAttribute('data-step') || '';
                return step ? `Implementação — etapa ${step}` : 'Implementação — abas';
            }
            return 'Seção Como implementamos';
        }

        if (el.closest('.footer')) {
            return 'Rodapé';
        }

        if (el.closest('#formulario, .contact-form-section')) {
            return 'Formulário de contato';
        }

        if (el.closest('.seq-hero, .seq-page-hero')) {
            return 'Topo sequenciamento';
        }

        if (el.closest('.seq-solution, .seq-fit')) {
            return 'Conteúdo sequenciamento';
        }

        return 'Corpo da página';
    }

    function getReadableAction(el) {
        const i18n = el.getAttribute('data-i18n');
        if (i18n) {
            const translated = translatePt(i18n);
            if (translated) return translated.slice(0, 90);
        }

        const i18nAria = el.getAttribute('data-i18n-aria');
        if (i18nAria) {
            const translated = translatePt(i18nAria);
            if (translated) return translated.slice(0, 90);
        }

        if (el.classList.contains('impl-roadmap-step')) {
            const title = el.querySelector('.impl-roadmap-step-title');
            if (title?.textContent?.trim()) {
                return `Ver etapa: ${title.textContent.trim()}`;
            }
        }

        if (el.classList.contains('theme-switcher-btn')) {
            return el.getAttribute('data-theme-value') === 'dark' ? 'Ativar tema escuro' : 'Ativar tema claro';
        }

        if (el.classList.contains('lang-switcher-btn')) {
            const lang = el.getAttribute('data-lang') || '';
            return `Mudar idioma para ${LANG_LABELS[lang] || lang}`;
        }

        const href = el.getAttribute('href') || '';
        if (href.includes('wa.me')) return 'Abrir WhatsApp';
        if (href.includes('app.mestti.com.br')) return 'Acessar login do sistema';
        if (href.startsWith('tel:')) return 'Ligar para MESTTI';
        if (href.includes('linkedin.com')) return 'Abrir LinkedIn';
        if (href.includes('instagram.com')) return 'Abrir Instagram';
        if (href.includes('mailto:')) return 'Enviar e-mail';

        const homeSection = el.getAttribute('data-home-section');
        if (homeSection && HOME_SECTION_ACTIONS[homeSection]) {
            return HOME_SECTION_ACTIONS[homeSection];
        }

        if (el.id === 'menuToggle') return 'Abrir menu mobile';
        if (el.id === 'btnCloseModal' || el.classList.contains('modal-close')) return 'Fechar modal';
        if (el.classList.contains('mobile-nav-close')) return 'Fechar menu mobile';

        const aria = el.getAttribute('aria-label');
        if (aria) return aria.trim().slice(0, 90);

        const text = stripHtml(el.textContent);
        if (text) return text.slice(0, 90);

        if (href && href !== '#') {
            return `Link para ${href.replace(/^https?:\/\/[^/]+/i, '') || href}`.slice(0, 90);
        }

        return 'Clique';
    }

    function buildTrackId(el) {
        const page = getPageLabel();
        const placement = getPlacement(el);
        const action = getReadableAction(el);
        return `${page} › ${placement} › ${action}`;
    }

    function getElementLabel(el) {
        return getReadableAction(el);
    }

    function isActionable(el) {
        if (!el || el.nodeType !== 1) return false;
        if (el.closest('[data-track-ignore]')) return false;
        if (el.disabled || el.getAttribute('aria-disabled') === 'true') return false;

        try {
            if (el.matches(ACTIONABLE_SELECTOR)) return true;
        } catch {
            /* ignore */
        }

        const tag = el.tagName;
        if (tag === 'A' && el.hasAttribute('href')) return true;
        if (tag === 'BUTTON') return true;
        if (tag === 'INPUT' && ['submit', 'button'].includes(el.type)) return true;

        const role = el.getAttribute('role');
        return role === 'button' || role === 'tab';
    }

    function findActionableTarget(target) {
        let el = target;
        while (el && el !== document.documentElement) {
            if (isActionable(el)) return el;
            el = el.parentElement;
        }
        return null;
    }

    function assignTrackIds(root = document.body) {
        if (!root || root.nodeType !== 1) return;

        const elements = root.matches?.(ACTIONABLE_SELECTOR)
            ? [root, ...root.querySelectorAll(ACTIONABLE_SELECTOR)]
            : [...root.querySelectorAll(ACTIONABLE_SELECTOR)];

        const seen = new Map();

        elements.forEach((el) => {
            if (!isActionable(el)) return;

            let trackId = buildTrackId(el);
            const count = seen.get(trackId) || 0;
            if (count > 0) {
                trackId = `${trackId} (${count + 1})`;
            }
            seen.set(trackId, count + 1);

            el.setAttribute(TRACK_ATTR, trackId);
        });
    }

    function getOrCreateSessionId() {
        try {
            let id = sessionStorage.getItem(SESSION_KEY);
            if (!id) {
                id = (typeof crypto !== 'undefined' && crypto.randomUUID)
                    ? crypto.randomUUID()
                    : `click_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
                sessionStorage.setItem(SESSION_KEY, id);
            }
            return id;
        } catch {
            return `click_${Date.now()}`;
        }
    }

    function getElementType(el) {
        const tag = el.tagName.toLowerCase();
        const role = el.getAttribute('role');
        if (role) return `${tag}:${role}`;
        if (tag === 'input') return `input:${el.type || 'button'}`;
        return tag;
    }

    async function sendClickTrack(el) {
        if (!el.getAttribute(TRACK_ATTR)) {
            assignTrackIds(el.parentElement || document.body);
        }

        const trackId = el.getAttribute(TRACK_ATTR) || buildTrackId(el);

        const payload = {
            sessionId: getOrCreateSessionId(),
            timestamp: new Date().toISOString(),
            trackId,
            elementType: getElementType(el),
            label: getElementLabel(el),
            href: el.getAttribute('href') || '',
            pagePath: window.location.pathname,
            pageTitle: document.title
        };

        try {
            const res = await fetch('/api/click-track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                keepalive: true
            });

            if (!res.ok) {
                const detail = await res.text().catch(() => '');
                console.warn('[MesttiClickTrack] falha ao enviar clique:', trackId, res.status, detail);
            }
        } catch (err) {
            console.warn('[MesttiClickTrack] rede indisponível — use npm run dev em http://127.0.0.1:5500/', trackId, err);
        }
    }

    function onDocumentClick(event) {
        const el = findActionableTarget(event.target);
        if (!el) return;
        sendClickTrack(el);
    }

    function init() {
        assignTrackIds();
        document.addEventListener('click', onDocumentClick, true);

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) assignTrackIds(node);
                }
            }
        });

        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        }

    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.MesttiClickTrack = {
        assignTrackIds,
        getOrCreateSessionId,
        sendClickTrack,
        buildTrackId
    };
})();
