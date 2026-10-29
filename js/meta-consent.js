/**
 * Consentimento mínimo para cookies de marketing (Meta Pixel / CAPI).
 * Não afirma conformidade jurídica por si só — apenas controla o carregamento do Pixel.
 */
(function () {
  const STORAGE_KEY = 'mestti_marketing_consent';
  const ACCEPTED = 'accepted';
  const DECLINED = 'declined';

  function readConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY) || '';
    } catch {
      return '';
    }
  }

  function writeConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* private mode */
    }
  }

  function hasMarketingConsent() {
    return readConsent() === ACCEPTED;
  }

  function hasDecided() {
    const v = readConsent();
    return v === ACCEPTED || v === DECLINED;
  }

  const listeners = new Set();

  function notify(value) {
    listeners.forEach((fn) => {
      try {
        fn(value === ACCEPTED);
      } catch {
        /* ignore */
      }
    });
  }

  function onConsentChange(fn) {
    if (typeof fn === 'function') listeners.add(fn);
    return () => listeners.delete(fn);
  }

  function acceptMarketing() {
    writeConsent(ACCEPTED);
    hideBanner();
    ensurePrefsLink();
    notify(ACCEPTED);
  }

  function declineMarketing() {
    writeConsent(DECLINED);
    hideBanner();
    ensurePrefsLink();
    notify(DECLINED);
  }

  function resetConsent() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    document.getElementById('mesttiCookiePrefs')?.remove();
    showBanner();
  }

  function hideBanner() {
    document.getElementById('mesttiCookieBanner')?.remove();
    document.documentElement.classList.remove('mestti-cookie-open');
  }

  // Textos do aviso na língua da página (/en/ e /es/ têm versão própria).
  const COOKIE_TEXT = {
    pt: { label: 'Preferências de cookies', text: 'Usamos cookies para navegação, análise e marketing.', decline: 'Agora não', accept: 'Aceitar', prefs: 'Revisar preferência de cookies', prefsAria: 'Revisar preferência de cookies de marketing' },
    en: { label: 'Cookie preferences', text: 'We use cookies for browsing, analytics and marketing.', decline: 'Not now', accept: 'Accept', prefs: 'Review cookie preferences', prefsAria: 'Review marketing cookie preferences' },
    es: { label: 'Preferencias de cookies', text: 'Usamos cookies para navegación, análisis y marketing.', decline: 'Ahora no', accept: 'Aceptar', prefs: 'Revisar preferencias de cookies', prefsAria: 'Revisar preferencias de cookies de marketing' }
  };
  const ct = () => COOKIE_TEXT[(document.documentElement.lang || 'pt').slice(0, 2)] || COOKIE_TEXT.pt;

  function showBanner() {
    if (document.getElementById('mesttiCookieBanner')) return;
    const c = ct();

    const banner = document.createElement('div');
    banner.id = 'mesttiCookieBanner';
    banner.className = 'mestti-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', c.label);
    document.documentElement.classList.add('mestti-cookie-open');
    banner.innerHTML = `
      <div class="mestti-cookie-banner__inner">
        <p class="mestti-cookie-banner__text">
          ${c.text}
        </p>
        <div class="mestti-cookie-banner__actions">
          <button type="button" class="mestti-cookie-banner__btn mestti-cookie-banner__btn--ghost" data-consent="decline">
            ${c.decline}
          </button>
          <button type="button" class="mestti-cookie-banner__btn mestti-cookie-banner__btn--primary" data-consent="accept">
            ${c.accept}
          </button>
        </div>
        <button type="button" class="mestti-cookie-banner__prefs" data-consent="prefs" hidden>
          ${c.prefs}
        </button>
      </div>
    `;

    banner.querySelector('[data-consent="accept"]')?.addEventListener('click', acceptMarketing);
    banner.querySelector('[data-consent="decline"]')?.addEventListener('click', declineMarketing);

    document.body.appendChild(banner);
  }

  function ensurePrefsLink() {
    // Só após o usuário decidir — evita conflito com o FAB do WhatsApp
    if (!hasDecided()) {
      document.getElementById('mesttiCookiePrefs')?.remove();
      return;
    }
    if (document.getElementById('mesttiCookiePrefs')) return;
    const link = document.createElement('button');
    link.type = 'button';
    link.id = 'mesttiCookiePrefs';
    link.className = 'mestti-cookie-prefs-link';
    link.textContent = 'Cookies';
    link.setAttribute('aria-label', ct().prefsAria);
    link.addEventListener('click', () => {
      resetConsent();
    });
    document.body.appendChild(link);
  }

  function init() {
    if (!hasDecided()) {
      showBanner();
    } else {
      ensurePrefsLink();
      if (hasMarketingConsent()) {
        notify(ACCEPTED);
      }
    }
  }

  window.MesttiConsent = {
    hasMarketingConsent,
    hasDecided,
    acceptMarketing,
    declineMarketing,
    resetConsent,
    onConsentChange,
    STORAGE_KEY,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
