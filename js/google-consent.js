/* Carrega e configura cada produto Google somente para a finalidade autorizada. */
(function () {
  const consent = window.MesttiConsent;
  if (!consent) return;
  let loaded = false;
  let analyticsConfigured = false;
  let adsConfigured = false;
  function state() {
    const analytics = consent.hasAnalyticsConsent() ? 'granted' : 'denied';
    const marketing = consent.hasMarketingConsent() ? 'granted' : 'denied';
    return { analytics_storage: analytics, ad_storage: marketing, ad_user_data: marketing, ad_personalization: marketing };
  }
  function update() {
    const analytics = consent.hasAnalyticsConsent();
    const marketing = consent.hasMarketingConsent();
    if (!loaded && !analytics && !marketing) return;
    if (!loaded) {
      loaded = true;
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
      window.gtag('consent', 'update', state());
      window.gtag('js', new Date());
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + (analytics ? 'G-9K4NZHC0WT' : 'AW-11486484316');
      document.head.appendChild(script);
    } else window.gtag('consent', 'update', state());
    if (analytics && !analyticsConfigured) { analyticsConfigured = true; window.gtag('config', 'G-9K4NZHC0WT'); }
    if (marketing && !adsConfigured) { adsConfigured = true; window.gtag('config', 'AW-11486484316'); }
  }
  consent.onConsentChange(update);
  update();
})();
