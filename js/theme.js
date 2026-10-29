/**
 * MESTTI — tema único (claro). O seletor claro/escuro foi removido.
 */
(function () {
    function groupHeaderTools(wrapperId, langId) {
        const lang = document.getElementById(langId);
        if (!lang || document.getElementById(wrapperId)) return;
        const tools = document.createElement('div');
        tools.className = 'header-tools';
        tools.id = wrapperId;
        lang.parentNode.insertBefore(tools, lang);
        tools.append(lang);
    }

    function init() {
        document.documentElement.removeAttribute('data-theme');
        const meta = document.querySelector('meta[name="color-scheme"]');
        if (meta) meta.setAttribute('content', 'light');
        groupHeaderTools('headerToolsDesktop', 'langSwitcher');
        groupHeaderTools('headerToolsMobile', 'langSwitcherMobile');
        window.MESTTI_THEME = 'light';
    }

    window.MesttiTheme = { applyTheme() {}, getTheme: () => 'light' };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
