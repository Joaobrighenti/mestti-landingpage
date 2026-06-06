/**
 * Opções centralizadas dos selects dos formulários MESTTI.
 */
(function () {
    const FORM_OPTIONS = {
        cargo: [
            { value: 'diretor', label: 'Diretor / C-Level' },
            { value: 'gerente-producao', label: 'Gerente de Produção / Industrial' },
            { value: 'supervisor', label: 'Supervisor de Produção' },
            { value: 'engenheiro', label: 'Engenheiro de Processos / Produção' },
            { value: 'analista', label: 'Analista de Melhoria Contínua' },
            { value: 'manutencao', label: 'Coordenador de Manutenção' },
            { value: 'ti', label: 'TI / Automação Industrial' },
            { value: 'compras', label: 'Compras / Suprimentos' },
            { value: 'outro', label: 'Outro' }
        ],
        setor: [
            { value: 'alimentos', label: 'Alimentos e Bebidas' },
            { value: 'quimica', label: 'Química e Petroquímica' },
            { value: 'automotiva', label: 'Automotiva' },
            { value: 'farmaceutica', label: 'Farmacêutica e Cosmética' },
            { value: 'metalurgia', label: 'Metalurgia e Siderurgia' },
            { value: 'plasticos', label: 'Plásticos e Embalagens' },
            { value: 'textil', label: 'Têxtil' },
            { value: 'papel', label: 'Papel e Celulose' },
            { value: 'eletro', label: 'Eletroeletrônica' },
            { value: 'energia', label: 'Energia e Utilities' },
            { value: 'outro', label: 'Outro' }
        ],
        solucao: [
            { value: 'sensoriamento', label: 'Sensoriamento de chão de fábrica' },
            { value: 'sequenciamento', label: 'Sequenciamento e programação' },
            { value: 'monitoramento', label: 'Monitoramento de indicadores em tempo real' },
            { value: 'plataforma', label: 'Plataforma completa MESTTI' }
        ]
    };

    function populateFormSelects(root) {
        const scope = root || document;
        scope.querySelectorAll('select[data-mestti-options]').forEach((select) => {
            const group = select.dataset.mesttiOptions;
            const items = FORM_OPTIONS[group];
            if (!items) return;

            const placeholder = select.querySelector('option[value=""]');
            const placeholderClone = placeholder ? placeholder.cloneNode(true) : null;

            select.innerHTML = '';
            if (placeholderClone) {
                select.appendChild(placeholderClone);
            }

            items.forEach((item) => {
                const option = document.createElement('option');
                option.value = item.value;
                option.textContent = item.label;
                select.appendChild(option);
            });
        });
    }

    window.MesttiFormOptions = {
        FORM_OPTIONS,
        populateFormSelects
    };
})();
