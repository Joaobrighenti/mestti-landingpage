/* O site tem um tema só (claro). Limpa escolha antiga de tema escuro. */
(function () {
    document.documentElement.removeAttribute('data-theme');
    try {
        localStorage.removeItem('mesttiTheme');
    } catch {
        /* sem storage: nada a limpar */
    }
})();
