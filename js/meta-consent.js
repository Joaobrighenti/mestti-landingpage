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
    notify(ACCEPTED);
  }

  function declineMarketing() {
    writeConsent(DECLINED);
    hideBanner();
    notify(DECLINED);
  }

  function resetConsent() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    showBanner();
  }

  function hideBanner() {
    document.getElementById('mesttiCookieBanner')?.remove();
    document.documentElement.classList.remove('mestti-cookie-open');
  }

  function showBanner() {
    if (document.getElementById('mesttiCookieBanner')) return;

    const banner = document.createElement('div');
    banner.id = 'mesttiCookieBanner';
    banner.className = 'mestti-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Preferências de cookies');
    document.documentElement.classList.add('mestti-cookie-open');
    banner.innerHTML = `
      <div class="mestti-cookie-banner__inner">
        <p class="mestti-cookie-banner__text">
          Ao clicar em “Aceitar todos os cookies”, você concorda com o armazenamento de cookies no seu dispositivo para melhorar a navegação no site, analisar a utilização do site e auxiliar nos nossos esforços de marketing.
        </p>
        <div class="mestti-cookie-banner__actions">
          <button type="button" class="mestti-cookie-banner__btn mestti-cookie-banner__btn--ghost" data-consent="decline">
            Agora não
          </button>
          <button type="button" class="mestti-cookie-banner__btn mestti-cookie-banner__btn--primary" data-consent="accept">
            Aceitar todos os cookies
          </button>
        </div>
        <button type="button" class="mestti-cookie-banner__prefs" data-consent="prefs" hidden>
          Revisar preferência de cookies
        </button>
      </div>
    `;

    banner.querySelector('[data-consent="accept"]')?.addEventListener('click', acceptMarketing);
    banner.querySelector('[data-consent="decline"]')?.addEventListener('click', declineMarketing);

    document.body.appendChild(banner);
  }

  function ensurePrefsLink() {
    if (document.getElementById('mesttiCookiePrefs')) return;
    const link = document.createElement('button');
    link.type = 'button';
    link.id = 'mesttiCookiePrefs';
    link.className = 'mestti-cookie-prefs-link';
    link.textContent = 'Cookies';
    link.setAttribute('aria-label', 'Revisar preferência de cookies de marketing');
    link.addEventListener('click', () => {
      resetConsent();
    });
    document.body.appendChild(link);
  }

  function init() {
    ensurePrefsLink();
    if (!hasDecided()) {
      showBanner();
    } else if (hasMarketingConsent()) {
      notify(ACCEPTED);
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
