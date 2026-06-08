/**
 * MESTTI — tema claro / escuro (persistido em localStorage)
 */
(function () {
    const STORAGE_KEY = 'mesttiTheme';
    const THEMES = ['light', 'dark'];

    const SUN = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path stroke-linecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
    const MOON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';

    function getStoredTheme() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return THEMES.includes(saved) ? saved : 'light';
        } catch {
            return 'light';
        }
    }

    function updateColorSchemeMeta(theme) {
        const meta = document.querySelector('meta[name="color-scheme"]');
        if (meta) meta.setAttribute('content', theme === 'dark' ? 'dark' : 'light');
    }

    function applyTheme(theme) {
        if (!THEMES.includes(theme)) theme = 'light';
        const root = document.documentElement;
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
        }
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch { /* ignore */ }
        updateColorSchemeMeta(theme);

        document.querySelectorAll('.theme-switcher-btn').forEach((btn) => {
            btn.classList.toggle('is-active', btn.getAttribute('data-theme-value') === theme);
        });

        window.MESTTI_THEME = theme;
    }

    function themeSwitcherMarkup(idSuffix) {
        const id = idSuffix ? `themeSwitcher${idSuffix}` : 'themeSwitcher';
        return `
<div class="theme-switcher${idSuffix ? ' theme-switcher--mobile' : ''}" id="${id}" role="group" data-i18n-aria="a11y.theme">
  <button type="button" class="theme-switcher-btn is-active" data-theme-value="light" data-i18n-aria="a11y.themeLight" title="Tema claro">${SUN}</button>
  <button type="button" class="theme-switcher-btn" data-theme-value="dark" data-i18n-aria="a11y.themeDark" title="Tema escuro">${MOON}</button>
</div>`;
    }

    function injectThemeSwitcher() {
        const actions = document.querySelector('.header-tractian-actions');
        if (actions && !document.getElementById('themeSwitcher')) {
            const lang = document.getElementById('langSwitcher');
            if (lang) lang.insertAdjacentHTML('beforebegin', themeSwitcherMarkup(''));
            else actions.insertAdjacentHTML('afterbegin', themeSwitcherMarkup(''));
        }

        const mobileExtras = document.querySelector('.header-nav-mobile-extras');
        if (mobileExtras && !document.getElementById('themeSwitcherMobile')) {
            const lang = document.getElementById('langSwitcherMobile');
            if (lang) lang.insertAdjacentHTML('beforebegin', themeSwitcherMarkup('Mobile'));
            else mobileExtras.insertAdjacentHTML('afterbegin', themeSwitcherMarkup('Mobile'));
        }
    }

    function groupHeaderTools(wrapperId, langId, themeId) {
        const lang = document.getElementById(langId);
        const theme = document.getElementById(themeId);
        if (!lang || !theme) return;

        let tools = document.getElementById(wrapperId);
        if (!tools) {
            tools = document.createElement('div');
            tools.className = 'header-tools';
            tools.id = wrapperId;
            lang.parentNode.insertBefore(tools, lang);
        }
        tools.append(theme, lang);
    }

    function bindThemeSwitcher() {
        document.querySelectorAll('.theme-switcher-btn').forEach((btn) => {
            btn.addEventListener('click', () => applyTheme(btn.getAttribute('data-theme-value')));
        });
    }

    function init() {
        injectThemeSwitcher();
        groupHeaderTools('headerToolsDesktop', 'langSwitcher', 'themeSwitcher');
        groupHeaderTools('headerToolsMobile', 'langSwitcherMobile', 'themeSwitcherMobile');
        bindThemeSwitcher();
        applyTheme(getStoredTheme());
    }

    window.MesttiTheme = { applyTheme, getTheme: getStoredTheme };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
