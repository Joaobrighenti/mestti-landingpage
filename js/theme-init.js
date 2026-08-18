/* Aplicar tema salvo antes do CSS pintar (evita flash). Padrão: claro. */
(function () {
    try {
        if (localStorage.getItem('mesttiTheme') === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    } catch {
        /* padrão claro: sem data-theme */
    }
})();
