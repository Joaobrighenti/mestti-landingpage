/**
 * Opções centralizadas dos selects dos formulários MESTTI.
 */
(function () {
    const FORM_OPTIONS = {
        cargo: [
            { value: 'diretor', labelKey: 'options.cargo.diretor', label: 'Diretor / C-Level' },
            { value: 'gerente-producao', labelKey: 'options.cargo.gerente-producao', label: 'Gerente de Produção / Industrial' },
            { value: 'supervisor', labelKey: 'options.cargo.supervisor', label: 'Supervisor de Produção' },
            { value: 'engenheiro', labelKey: 'options.cargo.engenheiro', label: 'Engenheiro de Processos / Produção' },
            { value: 'analista', labelKey: 'options.cargo.analista', label: 'Analista de Melhoria Contínua' },
            { value: 'manutencao', labelKey: 'options.cargo.manutencao', label: 'Coordenador de Manutenção' },
            { value: 'ti', labelKey: 'options.cargo.ti', label: 'TI / Automação Industrial' },
            { value: 'compras', labelKey: 'options.cargo.compras', label: 'Compras / Suprimentos' },
            { value: 'outro', labelKey: 'options.cargo.outro', label: 'Outro' }
        ],
        setor: [
            { value: 'alimentos', labelKey: 'options.setor.alimentos', label: 'Alimentos e Bebidas' },
            { value: 'quimica', labelKey: 'options.setor.quimica', label: 'Química e Petroquímica' },
            { value: 'automotiva', labelKey: 'options.setor.automotiva', label: 'Automotiva' },
            { value: 'farmaceutica', labelKey: 'options.setor.farmaceutica', label: 'Farmacêutica e Cosmética' },
            { value: 'metalurgia', labelKey: 'options.setor.metalurgia', label: 'Metalurgia e Siderurgia' },
            { value: 'plasticos', labelKey: 'options.setor.plasticos', label: 'Plásticos e Embalagens' },
            { value: 'textil', labelKey: 'options.setor.textil', label: 'Têxtil' },
            { value: 'papel', labelKey: 'options.setor.papel', label: 'Papel e Celulose' },
            { value: 'eletro', labelKey: 'options.setor.eletro', label: 'Eletroeletrônica' },
            { value: 'energia', labelKey: 'options.setor.energia', label: 'Energia e Utilities' },
            { value: 'outro', labelKey: 'options.setor.outro', label: 'Outro' }
        ],
        solucao: [
            { value: 'sensoriamento', labelKey: 'options.solucao.sensoriamento', label: 'Sensoriamento de chão de fábrica' },
            { value: 'sequenciamento', labelKey: 'options.solucao.sequenciamento', label: 'Sequenciamento e programação' },
            { value: 'monitoramento', labelKey: 'options.solucao.monitoramento', label: 'Monitoramento de indicadores em tempo real' },
            { value: 'plataforma', labelKey: 'options.solucao.plataforma', label: 'Plataforma completa MESTTI' }
        ]
    };

    function getLang() {
        return window.MESTTI_LANG || window.MesttiI18n?.getLang?.() || 'pt';
    }

    function optionLabel(item) {
        if (!item.labelKey || !window.MesttiI18n?.t) return item.label;
        const translated = window.MesttiI18n.t(getLang(), item.labelKey);
        if (!translated || translated === item.labelKey) return item.label;
        return translated;
    }

    function populateFormSelects(root) {
        const scope = root || document;
        scope.querySelectorAll('select[data-mestti-options]').forEach((select) => {
            const group = select.dataset.mesttiOptions;
            const items = FORM_OPTIONS[group];
            if (!items) return;

            const selectedValue = select.value;
            const placeholder = select.querySelector('option[value=""]');
            const placeholderClone = placeholder ? placeholder.cloneNode(true) : null;

            select.innerHTML = '';
            if (placeholderClone) {
                select.appendChild(placeholderClone);
            }

            items.forEach((item) => {
                const option = document.createElement('option');
                option.value = item.value;
                option.textContent = optionLabel(item);
                select.appendChild(option);
            });

            if (selectedValue) {
                select.value = selectedValue;
            }
        });
    }

    window.MesttiFormOptions = {
        FORM_OPTIONS,
        optionLabel,
        populateFormSelects
    };
})();
