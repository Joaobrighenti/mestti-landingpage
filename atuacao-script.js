/**
 * JavaScript para Página de Sensores MESTTI
 * Funcionalidades: Interatividade dos cards, filtro dinâmico de detalhes
 */

// Função para gerar ícones SVG profissionais
function getMetricIcon(iconType) {
    const icons = {
        'chart': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3V21H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M7 16L11 12L15 8L21 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        'target': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="12" r="2" fill="currentColor"/>
        </svg>`,
        'efficiency': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        'clock': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>`,
        'refresh': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 4V10H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M23 20V14H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        'check': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        'status-on': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/>
            <circle cx="12" cy="12" r="6" fill="currentColor"/>
        </svg>`,
        'pause': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
            <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
        </svg>`,
        'trend-up': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17 6H23V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        'alert': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        'ruler': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.3 8.7L8.7 21.3C8.3 21.7 7.7 21.7 7.3 21.3L2.7 16.7C2.3 16.3 2.3 15.7 2.7 15.3L15.3 2.7C15.7 2.3 16.3 2.3 16.7 2.7L21.3 7.3C21.7 7.7 21.7 8.3 21.3 8.7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7 7L17 17" stroke="currentColor" stroke-width="2"/>
        </svg>`,
        'thermometer': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 4V10.29C15.89 11.15 17.26 13.06 17.26 15.29C17.26 18.22 14.88 20.6 11.95 20.6C9.02 20.6 6.64 18.22 6.64 15.29C6.64 13.06 8.01 11.15 9.9 10.29V4H14Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9.9 2V4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>`,
        'drop': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.69L17.66 8.35C18.78 9.47 19.5 11.07 19.5 12.77C19.5 16.08 16.83 18.75 13.52 18.75C10.21 18.75 7.54 16.08 7.54 12.77C7.54 11.07 8.26 9.47 9.38 8.35L12 2.69Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        'trend-down': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23 18L13.5 8.5L8.5 13.5L1 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17 18H23V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        'bell': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8A6 6 0 0 0 6 8C6 11.0909 4.5 13.6364 3 16H21C19.5 13.6364 18 11.0909 18 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        'mttr': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 2V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>`,
        'mtbf': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="12" r="2" fill="currentColor"/>
        </svg>`,
        'wrench': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.7 6.3C15.1 6.7 15.1 7.3 14.7 7.7L9.7 12.7C9.3 13.1 8.7 13.1 8.3 12.7L6.3 10.7C5.9 10.3 5.9 9.7 6.3 9.3L11.3 4.3C11.7 3.9 12.3 3.9 12.7 4.3L14.7 6.3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19 19L17 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 21L19 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
    };
    return icons[iconType] || icons['chart'];
}

// Dados dos sensores
const sensoresData = {
    'contagem-pecas': {
        title: 'Sensor de Contagem de Peças',
        benefits: [
            'Contagem automática e precisa em tempo real',
            'Eliminação de erros manuais de apontamento',
            'Rastreabilidade completa da produção',
            'Integração direta com sistemas de gestão',
            'Alertas automáticos para desvios de produção',
            'Histórico completo para análises e relatórios'
        ],
        metrics: [
            { label: 'Produção Real', value: '1.247', unit: 'peças', icon: 'chart' },
            { label: 'Produção Planejada', value: '1.200', unit: 'peças', icon: 'target' },
            { label: 'Eficiência', value: '103.9%', unit: '', icon: 'efficiency' },
            { label: 'Peças/Hora', value: '156', unit: 'pç/h', icon: 'clock' },
            { label: 'Turno Atual', value: '8h', unit: 'produtivas', icon: 'refresh' },
            { label: 'Desvios', value: '0', unit: 'ocorrências', icon: 'check' }
        ]
    },
    'maquina-ligada': {
        title: 'Sensor de Máquina Ligada / Desligada (Corrente Elétrica)',
        benefits: [
            'Detecção automática de funcionamento via corrente elétrica',
            'Identificação precisa de paradas não planejadas',
            'Cálculo automático de horas produtivas e improdutivas',
            'Alertas em tempo real para paradas inesperadas',
            'Histórico de disponibilidade por máquina',
            'Integração com indicadores de OEE'
        ],
        metrics: [
            { label: 'Status Atual', value: 'Ligada', unit: '', icon: 'status-on' },
            { label: 'Horas Produtivas', value: '6.5h', unit: 'hoje', icon: 'efficiency' },
            { label: 'Horas Improdutivas', value: '1.5h', unit: 'hoje', icon: 'pause' },
            { label: 'Disponibilidade', value: '81.3%', unit: '', icon: 'trend-up' },
            { label: 'MTTR', value: '25', unit: 'minutos', icon: 'mttr' },
            { label: 'MTBF', value: '2.2h', unit: '', icon: 'mtbf' }
        ]
    },
    'contagem-linear': {
        title: 'Sensor de Contagem com Metro Linear',
        benefits: [
            'Contagem de peças e medição de comprimento simultânea',
            'Cálculo automático de metros lineares produzidos',
            'Rastreabilidade de dimensões e quantidades',
            'Controle de qualidade por comprimento',
            'Relatórios detalhados de produção linear',
            'Integração com sistemas de corte e acabamento'
        ],
        metrics: [
            { label: 'Peças Produzidas', value: '892', unit: 'unidades', icon: 'chart' },
            { label: 'Metros Lineares', value: '1.245', unit: 'metros', icon: 'ruler' },
            { label: 'Comprimento Médio', value: '1.40', unit: 'm/peça', icon: 'ruler' },
            { label: 'Eficiência Linear', value: '98.2%', unit: '', icon: 'efficiency' },
            { label: 'Produção/Hora', value: '112', unit: 'm/h', icon: 'clock' },
            { label: 'Desperdício', value: '2.1%', unit: '', icon: 'trend-down' }
        ]
    },
    'temperatura-umidade': {
        title: 'Sensor de Temperatura e Umidade',
        benefits: [
            'Monitoramento ambiental contínuo 24/7',
            'Alertas automáticos para variações críticas',
            'Rastreabilidade completa para auditorias',
            'Conformidade com normas regulatórias (ANVISA, MAPA)',
            'Relatórios automáticos de conformidade',
            'Histórico completo para análises de tendências'
        ],
        metrics: [
            { label: 'Temperatura Atual', value: '22.5°C', unit: '', icon: 'thermometer' },
            { label: 'Umidade Atual', value: '55%', unit: 'UR', icon: 'drop' },
            { label: 'Variação Temp.', value: '±0.3°C', unit: 'hoje', icon: 'chart' },
            { label: 'Variação Umidade', value: '±2%', unit: 'hoje', icon: 'trend-up' },
            { label: 'Conformidade', value: '100%', unit: '', icon: 'check' },
            { label: 'Alertas Hoje', value: '0', unit: 'ocorrências', icon: 'bell' }
        ]
    }
};

// Estado atual
let sensorSelecionado = null;
let isInitialLoad = true;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    inicializarCards();
    configurarImagens();
    // Selecionar o primeiro sensor por padrão
    selecionarSensor('contagem-pecas', false);
    isInitialLoad = false;
});

// Configurar fallback para imagens
function configurarImagens() {
    const images = document.querySelectorAll('.sensor-image');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"%3E%3Crect fill="%23f3f4f6" width="200" height="150"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="Arial" font-size="14" fill="%239ca3af"%3EImagem do Sensor%3C/text%3E%3C/svg%3E';
        });
    });
}

// Inicializar cards com eventos
function inicializarCards() {
    const cards = document.querySelectorAll('.sensor-card');
    
    cards.forEach(card => {
        // Hover effect
        card.addEventListener('mouseenter', () => {
            if (!card.classList.contains('active')) {
                card.style.transform = 'translateY(-8px)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('active')) {
                card.style.transform = 'translateY(0)';
            }
        });
        
        // Click para selecionar
        card.addEventListener('click', () => {
            const sensorId = card.getAttribute('data-sensor');
            selecionarSensor(sensorId, true);
        });
    });
}

// Selecionar sensor
function selecionarSensor(sensorId, shouldScroll = true) {
    // Remover seleção anterior
    document.querySelectorAll('.sensor-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Adicionar seleção ao card clicado
    const cardSelecionado = document.querySelector(`[data-sensor="${sensorId}"]`);
    if (cardSelecionado) {
        cardSelecionado.classList.add('active');
    }
    
    // Atualizar detalhes
    sensorSelecionado = sensorId;
    atualizarDetalhes(sensorId);
    
    // Scroll suave para detalhes apenas se não for o carregamento inicial
    if (shouldScroll && !isInitialLoad) {
        const detalhesSection = document.getElementById('sensorDetails');
        if (detalhesSection) {
            const headerOffset = 100;
            const elementPosition = detalhesSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
}

// Inicializar seção de detalhes (não é mais necessário, pois sempre terá um sensor selecionado)

// Atualizar detalhes do sensor
function atualizarDetalhes(sensorId) {
    const sensor = sensoresData[sensorId];
    if (!sensor) return;
    
    const content = document.getElementById('sensorDetailsContent');
    if (!content) return;
    
    // Gerar HTML dos benefícios
    const benefitsHTML = sensor.benefits.map(benefit => 
        `<li class="benefit-item">${benefit}</li>`
    ).join('');
    
    // Gerar HTML das métricas
    const metricsHTML = sensor.metrics.map(metric => `
        <div class="metric-card">
            <div class="metric-icon">${getMetricIcon(metric.icon)}</div>
            <div class="metric-content">
                <div class="metric-value">${metric.value}</div>
                <div class="metric-label">${metric.label}</div>
                ${metric.unit ? `<div class="metric-unit">${metric.unit}</div>` : ''}
            </div>
        </div>
    `).join('');
    
    // Montar HTML completo
    content.innerHTML = `
        <div class="sensor-details-header">
            <h2 class="sensor-details-title">${sensor.title}</h2>
        </div>
        
        <div class="sensor-details-body">
            <div class="benefits-section">
                <h3 class="section-subtitle">Benefícios</h3>
                <ul class="benefits-list">
                    ${benefitsHTML}
                </ul>
            </div>
            
            <div class="metrics-section">
                <h3 class="section-subtitle">Métricas em Tempo Real</h3>
                <div class="metrics-grid">
                    ${metricsHTML}
                </div>
            </div>
        </div>
    `;
    
    // Animação de entrada
    content.style.opacity = '0';
    setTimeout(() => {
        content.style.transition = 'opacity 0.3s ease';
        content.style.opacity = '1';
    }, 10);
}

