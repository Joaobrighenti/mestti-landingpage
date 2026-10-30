/* Preferências independentes para análise e marketing. */
(function () {
  const STORAGE_KEY = 'mestti_consent_v3';
  const listeners = new Set();
  function read() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (value && typeof value.analytics === 'boolean' && typeof value.marketing === 'boolean') return value;
    } catch { /* sem preferência válida */ }
    return null;
  }
  function hasMarketingConsent() { return read()?.marketing === true; }
  function hasAnalyticsConsent() { return read()?.analytics === true; }
  function hasDecided() { return read() !== null; }
  function onConsentChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }
  function notify() { listeners.forEach((fn) => { try { fn(hasMarketingConsent()); } catch { /* isolado */ } }); }
  function hideBanner() {
    document.getElementById('mesttiCookieBanner')?.remove();
    document.documentElement.classList.remove('mestti-cookie-open');
  }
  function save(analytics, marketing) {
    const previous = read();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ analytics, marketing })); } catch { return; }
    notify();
    if (!marketing && typeof window.fbq === 'function') window.fbq('consent', 'revoke');
    if (previous && ((previous.analytics && !analytics) || (previous.marketing && !marketing))) {
      window.location.reload();
      return;
    }
    hideBanner();
    ensurePrefsLink();
  }
  function acceptMarketing() { save(true, true); }
  function declineMarketing() { save(false, false); }
  function showBanner() {
    if (document.getElementById('mesttiCookieBanner')) return;
    const value = read() || { analytics: false, marketing: false };
    const banner = document.createElement('div');
    banner.id = 'mesttiCookieBanner';
    banner.className = 'mestti-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Preferências de cookies');
    document.documentElement.classList.add('mestti-cookie-open');
    banner.innerHTML = `
      <div class="mestti-cookie-banner__inner">
        <p class="mestti-cookie-banner__text">Usamos armazenamento necessário para o site. Você escolhe o uso de análise e marketing. <a href="/cookies/">Saiba mais</a>.</p>
        <div class="mestti-cookie-banner__actions">
          <button type="button" class="mestti-cookie-banner__btn mestti-cookie-banner__btn--ghost" data-consent="decline">Recusar opcionais</button>
          <button type="button" class="mestti-cookie-banner__btn mestti-cookie-banner__btn--ghost" data-consent="customize">Personalizar</button>
          <button type="button" class="mestti-cookie-banner__btn mestti-cookie-banner__btn--primary" data-consent="accept">Aceitar opcionais</button>
        </div>
        <div data-consent="choices" hidden>
          <p>Necessários: sempre ativos.</p>
          <label><input type="checkbox" data-category="analytics"> Análise</label>
          <label><input type="checkbox" data-category="marketing"> Marketing</label>
          <button type="button" class="mestti-cookie-banner__btn mestti-cookie-banner__btn--primary" data-consent="save">Salvar escolhas</button>
        </div>
      </div>`;
    const analytics = banner.querySelector('[data-category="analytics"]');
    const marketing = banner.querySelector('[data-category="marketing"]');
    analytics.checked = value.analytics;
    marketing.checked = value.marketing;
    banner.querySelector('[data-consent="accept"]').addEventListener('click', acceptMarketing);
    banner.querySelector('[data-consent="decline"]').addEventListener('click', declineMarketing);
    banner.querySelector('[data-consent="customize"]').addEventListener('click', () => { banner.querySelector('[data-consent="choices"]').hidden = false; });
    banner.querySelector('[data-consent="save"]').addEventListener('click', () => save(analytics.checked, marketing.checked));
    document.body.appendChild(banner);
  }
  function resetConsent() { showBanner(); }
  function ensurePrefsLink() {
    if (!hasDecided() || document.getElementById('mesttiCookiePrefs')) return;
    const link = document.createElement('button');
    link.type = 'button'; link.id = 'mesttiCookiePrefs';
    link.className = 'mestti-cookie-prefs-link'; link.textContent = 'Cookies';
    link.setAttribute('aria-label', 'Revisar preferências de cookies');
    link.addEventListener('click', resetConsent); document.body.appendChild(link);
  }
  window.MesttiConsent = { hasMarketingConsent, hasAnalyticsConsent, hasDecided, acceptMarketing, declineMarketing, resetConsent, onConsentChange, STORAGE_KEY };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { if (hasDecided()) ensurePrefsLink(); else showBanner(); });
  else if (hasDecided()) ensurePrefsLink(); else showBanner();
})();
