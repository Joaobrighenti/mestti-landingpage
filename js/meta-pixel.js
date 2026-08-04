/**
 * Meta Pixel + helpers de eventos (Lead, Contact, ViewContent).
 * Carrega o Pixel somente após consentimento de marketing.
 * Não duplica init — verifica instalação existente.
 */
(function () {
  const PIXEL_ID = '893387710059296';

  const VIEW_CONTENT_PAGES = {
    sensoriamento: {
      content_name: 'Sensoriamento industrial',
      content_category: 'Solução Mestti',
      content_type: 'product',
    },
    sequenciamento: {
      content_name: 'Sequenciamento de produção',
      content_category: 'Solução Mestti',
      content_type: 'product',
    },
    producao: {
      content_name: 'Apontamento e monitoramento de produção',
      content_category: 'Solução Mestti',
      content_type: 'product',
    },
    sensores: {
      content_name: 'Sensores industriais Mestti',
      content_category: 'Solução Mestti',
      content_type: 'product',
    },
    atuacao: {
      content_name: 'Catálogo de sensores e atuação',
      content_category: 'Solução Mestti',
      content_type: 'product',
    },
    cmms: {
      content_name: 'CMMS Mestti',
      content_category: 'Solução Mestti',
      content_type: 'product',
    },
  };

  let pixelInitialized = false;
  let viewContentSentForPath = '';

  function generateMetaEventId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    // Fallback RFC4122-ish
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function getCookie(name) {
    if (typeof document === 'undefined' || !document.cookie) return '';
    const parts = document.cookie.split(';');
    for (const part of parts) {
      const [k, ...rest] = part.trim().split('=');
      if (k === name) {
        return decodeURIComponent(rest.join('=') || '');
      }
    }
    return '';
  }

  function getMetaCookies() {
    const fbp = getCookie('_fbp') || '';
    const fbc = getCookie('_fbc') || '';
    return {
      fbp: fbp || undefined,
      fbc: fbc || undefined,
    };
  }

  function hasConsent() {
    return Boolean(window.MesttiConsent?.hasMarketingConsent?.());
  }

  function isFbqReady() {
    return typeof window.fbq === 'function';
  }

  /**
   * Instala o snippet oficial uma única vez (após consentimento).
   */
  function initializeMetaPixel() {
    if (!hasConsent()) return false;
    if (pixelInitialized && isFbqReady()) return true;

    try {
      if (!isFbqReady()) {
        !(function (f, b, e, v, n, t, s) {
          if (f.fbq) return;
          n = f.fbq = function () {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
          };
          if (!f._fbq) f._fbq = n;
          n.push = n;
          n.loaded = true;
          n.version = '2.0';
          n.queue = [];
          t = b.createElement(e);
          t.async = true;
          t.src = v;
          s = b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t, s);
        })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      }

      // Evita init duplicado se outro script já inicializou o mesmo pixel
      if (!window._mesttiMetaPixelInited) {
        window.fbq('init', PIXEL_ID);
        window.fbq('track', 'PageView');
        window._mesttiMetaPixelInited = PIXEL_ID;
      }

      pixelInitialized = true;
      return true;
    } catch {
      return false;
    }
  }

  function trackWithPixel(eventName, eventId, params) {
    if (!hasConsent()) return false;
    if (!initializeMetaPixel()) return false;
    if (!isFbqReady()) return false;

    try {
      const options = eventId ? { eventID: eventId } : undefined;
      if (params && Object.keys(params).length) {
        window.fbq('track', eventName, params, options);
      } else if (options) {
        window.fbq('track', eventName, {}, options);
      } else {
        window.fbq('track', eventName);
      }
      return true;
    } catch {
      return false;
    }
  }

  function sendServerEvent({ eventName, eventId, customData, contactMethod, externalId }) {
    if (!hasConsent()) return;

    const cookies = getMetaCookies();
    const body = {
      eventName,
      eventId,
      eventSourceUrl: window.location.href,
      fbp: cookies.fbp,
      fbc: cookies.fbc,
    };

    if (customData) body.customData = customData;
    if (contactMethod) body.contactMethod = contactMethod;
    if (externalId) body.externalId = externalId;

    const json = JSON.stringify(body);

    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([json], { type: 'application/json' });
        const ok = navigator.sendBeacon('/api/meta-events', blob);
        if (ok) return;
      }
    } catch {
      /* fallback fetch */
    }

    fetch('/api/meta-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json,
      keepalive: true,
    }).catch(() => {
      /* CAPI opcional — não afeta UX */
    });
  }

  function trackMetaLead(eventId, params) {
    return trackWithPixel('Lead', eventId, params);
  }

  function trackMetaContact(eventId, params) {
    return trackWithPixel('Contact', eventId, params);
  }

  function trackMetaViewContent(eventId, params) {
    return trackWithPixel('ViewContent', eventId, params);
  }

  function resolveViewContentConfig() {
    const page = document.body?.dataset?.page || '';
    if (page && VIEW_CONTENT_PAGES[page]) {
      return VIEW_CONTENT_PAGES[page];
    }

    const path = (window.location.pathname || '').replace(/\/+$/, '') || '/';
    const map = {
      '/sensoriamento': VIEW_CONTENT_PAGES.sensoriamento,
      '/sequenciamento': VIEW_CONTENT_PAGES.sequenciamento,
      '/producao': VIEW_CONTENT_PAGES.producao,
      '/sensores': VIEW_CONTENT_PAGES.sensores,
      '/atuacao': VIEW_CONTENT_PAGES.atuacao,
      '/cmms': VIEW_CONTENT_PAGES.cmms,
    };
    return map[path] || null;
  }

  function fireViewContentOnce() {
    if (!hasConsent()) return;

    const config = resolveViewContentConfig();
    if (!config) return;

    const pathKey = window.location.pathname;
    if (viewContentSentForPath === pathKey) return;
    viewContentSentForPath = pathKey;

    const eventId = generateMetaEventId();
    const customData = { ...config };

    trackMetaViewContent(eventId, customData);
    sendServerEvent({
      eventName: 'ViewContent',
      eventId,
      customData,
    });
  }

  function detectContactMethod(href) {
    if (!href) return null;
    const lower = href.toLowerCase();
    if (lower.includes('wa.me') || lower.includes('whatsapp.com') || lower.includes('api.whatsapp.com')) {
      return 'whatsapp';
    }
    if (lower.startsWith('tel:')) return 'phone';
    if (lower.startsWith('mailto:')) return 'email';
    return null;
  }

  function bindContactLinks() {
    if (document.documentElement.dataset.mesttiMetaContactBound === '1') return;
    document.documentElement.dataset.mesttiMetaContactBound = '1';

    document.addEventListener(
      'click',
      (event) => {
        if (!hasConsent()) return;

        const anchor = event.target?.closest?.('a[href]');
        if (!anchor) return;

        const method = detectContactMethod(anchor.getAttribute('href') || '');
        if (!method) return;

        // Evita double-fire no mesmo clique
        if (anchor.dataset.mesttiContactTracked === '1') return;
        anchor.dataset.mesttiContactTracked = '1';
        setTimeout(() => {
          delete anchor.dataset.mesttiContactTracked;
        }, 1500);

        const eventId = generateMetaEventId();
        const customData = { contact_method: method };

        trackMetaContact(eventId, customData);
        sendServerEvent({
          eventName: 'Contact',
          eventId,
          contactMethod: method,
          customData,
        });
      },
      true
    );
  }

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function boot() {
    bindContactLinks();

    const start = () => {
      if (!hasConsent()) return;
      initializeMetaPixel();
      // Pequeno atraso evita duplicata de Strict Mode / double DOMContentLoaded
      window.setTimeout(fireViewContentOnce, 50);
    };

    if (hasConsent()) {
      start();
    }

    window.MesttiConsent?.onConsentChange?.((accepted) => {
      if (accepted) start();
    });
  }

  window.MesttiMeta = {
    PIXEL_ID,
    generateMetaEventId,
    getMetaCookies,
    initializeMetaPixel,
    trackMetaLead,
    trackMetaContact,
    trackMetaViewContent,
    sendServerEvent,
    hasConsent,
  };

  // Aliases pedidos no briefing
  window.generateMetaEventId = generateMetaEventId;

  onReady(boot);
})();
