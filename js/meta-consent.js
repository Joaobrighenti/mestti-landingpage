/**
 * Consentimento mínimo para cookies de marketing (Meta Pixel / CAPI).
 * Não afirma conformidade jurídica por si só — apenas controla o carregamento do Pixel.
 */
(function () {
  const STORAGE_KEY = 'mestti_analytics_marketing_consent_v2';
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
    const wasAccepted = hasMarketingConsent();
    writeConsent(DECLINED);
    hideBanner();
    ensurePrefsLink();
    notify(DECLINED);
    if (typeof window.fbq === 'function') window.fbq('consent', 'revoke');
    if (wasAccepted) window.location.reload();
  }

  function resetConsent() {
    const wasAccepted = hasMarketingConsent();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    notify(DECLINED);
    if (typeof window.fbq === 'function') window.fbq('consent', 'revoke');
    if (wasAccepted) { window.location.reload(); return; }
    document.getElementById('mesttiCookiePrefs')?.remove();
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
          Usamos cookies necessários para o site. Com sua autorização, também usamos cookies de análise e marketing. <a href="/cookies/">Saiba mais</a>.
        </p>
        <div class="mestti-cookie-banner__actions">
          <button type="button" class="mestti-cookie-banner__btn mestti-cookie-banner__btn--ghost" data-consent="decline">
            Recusar análise e marketing
          </button>
          <button type="button" class="mestti-cookie-banner__btn mestti-cookie-banner__btn--primary" data-consent="accept">
            Aceitar análise e marketing
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
    link.setAttribute('aria-label', 'Revisar preferência de cookies de análise e marketing');
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
