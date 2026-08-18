/**
 * Painel ao vivo da primeira dobra — replica o card da máquina
 */
(function () {
    const board = document.querySelector('[data-hero-live]');
    if (!board) return;

    const countEl = board.querySelector('[data-hero-count]');
    const oeeEl = board.querySelector('[data-hero-oee]');
    const oeeRing = board.querySelector('[data-hero-oee-ring]');
    const timeEl = board.querySelector('[data-hero-time]');
    if (!countEl || !oeeEl) return;

    const OEE_C = 2 * Math.PI * 46;
    let count = 1284;
    let oee = 87.4;
    let minutes = 378;

    function locale() {
        const lang = (document.documentElement.lang || 'pt').slice(0, 2);
        if (lang === 'en') return 'en-US';
        if (lang === 'es') return 'es-ES';
        return 'pt-BR';
    }

    function setOee(value) {
        oeeEl.textContent = value.toFixed(1);
        if (oeeRing) {
            oeeRing.style.strokeDasharray = String(OEE_C);
            oeeRing.style.strokeDashoffset = String(OEE_C * (1 - value / 100));
        }
    }

    function setTime() {
        if (!timeEl) return;
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        timeEl.textContent = h + 'h ' + m + 'min';
    }

    function setCount() {
        countEl.textContent = count.toLocaleString(locale());
    }

    setOee(oee);
    setCount();
    setTime();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    window.setInterval(() => {
        count += 1 + Math.floor(Math.random() * 2);
        setCount();
    }, 2200);

    window.setInterval(() => {
        oee = Math.round(Math.min(89.6, Math.max(85.8, oee + (Math.random() - 0.45) * 0.25)) * 10) / 10;
        setOee(oee);
    }, 2600);

    window.setInterval(() => {
        minutes += 1;
        setTime();
    }, 12000);
})();
