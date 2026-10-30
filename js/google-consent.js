/* Google Analytics e Ads só são carregados após a escolha de análise e marketing. */
(function () {
  const consent = window.MesttiConsent;
  if (!consent) return;
  let loaded = false;
  const states = (value) => ({
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  });

  function start() {
    if (loaded || !consent.hasMarketingConsent()) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', states('denied'));
    window.gtag('consent', 'update', states('granted'));
    window.gtag('js', new Date());
    window.gtag('config', 'G-9K4NZHC0WT');
    window.gtag('config', 'AW-11486484316');
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=AW-11486484316';
    document.head.appendChild(script);
  }

  function onChange(accepted) {
    if (accepted) {
      start();
    } else if (loaded) {
      window.gtag('consent', 'update', states('denied'));
      window['ga-disable-G-9K4NZHC0WT'] = true;
      window['ga-disable-AW-11486484316'] = true;
    }
  }
  consent.onConsentChange(onChange);
  start();
})();
