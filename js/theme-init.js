/* Aplicar tema salvo antes do CSS pintar (evita flash) */
(function () {
    try {
        if (localStorage.getItem('mesttiTheme') === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    } catch { /* ignore */ }
})();
