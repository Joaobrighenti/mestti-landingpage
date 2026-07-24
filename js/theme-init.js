/* Aplicar tema salvo antes do CSS pintar (evita flash). Padrão: escuro. */
(function () {
    try {
        if (localStorage.getItem('mesttiTheme') !== 'light') {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    } catch {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})();
