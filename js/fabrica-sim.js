/**
 * Fábrica simulada no estilo da Fábrica 3D do produto (mestti_frontend · factory-3d):
 * vista isométrica, setores no chão, pinos por estado (o normal é quieto, só o anormal ganha cor),
 * "Fábrica agora", filtros por estado, camada Estado/OEE, zoom e detalhe da máquina com Resumo e Fila.
 * Todos os dados são de demonstração e ficam neste arquivo.
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { createFactoryFullscreen } from './factory-fullscreen.js?v=2';

const root = document.querySelector('[data-factory]');

/* ---------------------------------------------------------------- textos */
const TX = {
    pt: {
        factory: 'Fábrica exemplo', live: 'Ao vivo', search: 'Buscar máquina', noResult: 'Nenhuma máquina encontrada',
        now: 'Fábrica agora', running: 'Rodando', stoppedPl: 'Paradas', lost: 'Sem sinal', machines: 'Máquinas',
        inFilter: 'Máquinas no filtro', noneInFilter: 'Nenhuma máquina neste filtro.', collapse: 'Recolher painel', expand: 'Expandir painel',
        all: 'Todas', layerState: 'Estado', layerOee: 'OEE', layerGroup: 'Colorir o chão por', filterGroup: 'Filtrar a cena por estado',
        zoomIn: 'Aproximar', zoomOut: 'Afastar', fit: 'Ver a fábrica toda', full: 'Tela cheia', fullExit: 'Sair da tela cheia', hintFull: 'Arraste para girar · role para aproximar · Esc para sair', hintFullTouch: 'Arraste para mover · pinça para aproximar · dois dedos giram', explore: 'Explorar a fábrica', close: 'Fechar detalhes',
        summary: 'Resumo', queue: 'Fila', today: 'hoje', eff: 'Eficiência', producedToday: 'Produção hoje', pieces: 'peças no dia',
        orderDone: 'Conclusão da ordem', of: 'de', pcs: 'pç', operation: 'Operação', product: 'Produto', operator: 'Operador',
        since: 'há', reason: 'Motivo', doing: 'Em apontamento', todo: 'A fazer', planned: 'Previsto', sector: 'Setor',
        stock: 'Estoque', balance: 'Saldo', critical: 'Estoque crítico', ok: 'Normal', capacity: 'da capacidade',
        hint: 'Clique numa máquina ou num pino para ver o detalhe.', hintDrag: 'Arraste para girar · Ctrl + rolagem para aproximar',
        hintTouch: 'Toque numa máquina para ver o detalhe.', tapPin: 'Clique para ver o motivo', tapPinTouch: 'Toque para ver o motivo', demo: 'Dados de demonstração', credit: 'Galpão e objetos: NVIDIA SimReady, CC BY 4.0', loading: 'Montando a fábrica…',
        error: 'Não foi possível carregar a maquete 3D. A lista ao lado mostra as mesmas máquinas.', oeeLegend: 'OEE',
        b_high: '80% ou mais', b_mid: '60 a 79%', b_low: 'abaixo de 60%', b_none: 'sem dado', tomorrow: 'amanhã', attention: 'Precisa de atenção',
        current: 'Em apontamento', nth: 'ª na fila', applied: 'apontado', load: 'de carga programada', ends: 'termina', todayH: 'Hoje', tomorrowH: 'Amanhã'
    },
    en: {
        factory: 'Sample factory', live: 'Live', search: 'Search machine', noResult: 'No machine found',
        now: 'Factory now', running: 'Running', stoppedPl: 'Stopped', lost: 'No signal', machines: 'Machines',
        inFilter: 'Machines in filter', noneInFilter: 'No machine in this filter.', collapse: 'Collapse panel', expand: 'Expand panel',
        all: 'All', layerState: 'State', layerOee: 'OEE', layerGroup: 'Color the floor by', filterGroup: 'Filter the scene by state',
        zoomIn: 'Zoom in', zoomOut: 'Zoom out', fit: 'See the whole factory', full: 'Full screen', fullExit: 'Exit full screen', hintFull: 'Drag to rotate · scroll to zoom · Esc to exit', hintFullTouch: 'Drag to move · pinch to zoom · two fingers rotate', explore: 'Explore the factory', close: 'Close details',
        summary: 'Summary', queue: 'Queue', today: 'today', eff: 'Efficiency', producedToday: 'Produced today', pieces: 'parts today',
        orderDone: 'Order progress', of: 'of', pcs: 'pcs', operation: 'Operation', product: 'Product', operator: 'Operator',
        since: 'for', reason: 'Reason', doing: 'In progress', todo: 'To do', planned: 'Planned', sector: 'Area',
        stock: 'Stock', balance: 'Balance', critical: 'Critical stock', ok: 'Normal', capacity: 'of capacity',
        hint: 'Click a machine or a pin to see the details.', hintDrag: 'Drag to rotate · Ctrl + scroll to zoom',
        hintTouch: 'Tap a machine to see the details.', tapPin: 'Click to see why', tapPinTouch: 'Tap to see why', demo: 'Demo data', credit: 'Building and props: NVIDIA SimReady, CC BY 4.0', loading: 'Building the factory…',
        error: 'The 3D model could not be loaded. The list shows the same machines.', oeeLegend: 'OEE',
        b_high: '80% or more', b_mid: '60 to 79%', b_low: 'below 60%', b_none: 'no data', tomorrow: 'tomorrow', attention: 'Needs attention',
        current: 'In progress', nth: ' in queue', applied: 'reported', load: 'of scheduled load', ends: 'ends', todayH: 'Today', tomorrowH: 'Tomorrow'
    },
    es: {
        factory: 'Fábrica ejemplo', live: 'En vivo', search: 'Buscar máquina', noResult: 'Ninguna máquina encontrada',
        now: 'Fábrica ahora', running: 'Operando', stoppedPl: 'Paradas', lost: 'Sin señal', machines: 'Máquinas',
        inFilter: 'Máquinas en el filtro', noneInFilter: 'Ninguna máquina en este filtro.', collapse: 'Contraer panel', expand: 'Expandir panel',
        all: 'Todas', layerState: 'Estado', layerOee: 'OEE', layerGroup: 'Colorear el piso por', filterGroup: 'Filtrar la escena por estado',
        zoomIn: 'Acercar', zoomOut: 'Alejar', fit: 'Ver toda la fábrica', full: 'Pantalla completa', fullExit: 'Salir de pantalla completa', hintFull: 'Arrastre para girar · desplace para acercar · Esc para salir', hintFullTouch: 'Arrastre para mover · pellizque para acercar · dos dedos giran', explore: 'Explorar la fábrica', close: 'Cerrar detalles',
        summary: 'Resumen', queue: 'Cola', today: 'hoy', eff: 'Eficiencia', producedToday: 'Producción hoy', pieces: 'piezas del día',
        orderDone: 'Avance de la orden', of: 'de', pcs: 'pz', operation: 'Operación', product: 'Producto', operator: 'Operador',
        since: 'hace', reason: 'Motivo', doing: 'En registro', todo: 'Pendiente', planned: 'Previsto', sector: 'Sector',
        stock: 'Inventario', balance: 'Saldo', critical: 'Inventario crítico', ok: 'Normal', capacity: 'de la capacidad',
        hint: 'Haga clic en una máquina o un pin para ver el detalle.', hintDrag: 'Arrastre para girar · Ctrl + rueda para acercar',
        hintTouch: 'Toque una máquina para ver el detalle.', tapPin: 'Haga clic para ver el motivo', tapPinTouch: 'Toque para ver el motivo', demo: 'Datos de demostración', credit: 'Nave y objetos: NVIDIA SimReady, CC BY 4.0', loading: 'Montando la fábrica…',
        error: 'No se pudo cargar la maqueta 3D. La lista muestra las mismas máquinas.', oeeLegend: 'OEE',
        b_high: '80% o más', b_mid: '60 a 79%', b_low: 'menos de 60%', b_none: 'sin dato', tomorrow: 'mañana', attention: 'Requiere atención',
        current: 'En registro', nth: 'º en la cola', applied: 'registrado', load: 'de carga programada', ends: 'termina', todayH: 'Hoy', tomorrowH: 'Mañana'
    }
};

/* Estados com as mesmas cores, glifos e ênfases do produto (constants/factoryStatusVisual.ts). */
const STATES = {
    running: { glyph: 'M8 6l10 6-10 6z', emphasis: 'quiet', label: { pt: 'Rodando', en: 'Running', es: 'Operando' }, light: '#1F7A5C', dark: '#4CC9A0', lamp: 0x22c55e },
    stopped: { glyph: 'M7 7h10v10H7z', emphasis: 'alert', pulse: true, label: { pt: 'Parada', en: 'Stopped', es: 'Parada' }, light: '#B42318', dark: '#F2796F', lamp: 0xef4444 },
    warning: { glyph: 'M9 6v12M15 6v12', emphasis: 'notice', label: { pt: 'Microparada', en: 'Micro-stop', es: 'Microparada' }, light: '#B54708', dark: '#F0A04B', lamp: 0xf59e0b },
    setup: { glyph: 'M4 8h9M17 8h3M4 16h3M11 16h9M15 5v6M7 13v6', emphasis: 'notice', label: { pt: 'Setup', en: 'Setup', es: 'Setup' }, light: '#1D5FD1', dark: '#6FA3FF', lamp: 0x3b82f6 },
    maintenance: { glyph: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M12 2v3 M12 19v3 M2 12h3 M19 12h3 M4.9 4.9l2.1 2.1 M17 17l2.1 2.1 M4.9 19.1L7 17 M17 7l2.1-2.1', emphasis: 'notice', label: { pt: 'Manutenção', en: 'Maintenance', es: 'Mantenimiento' }, light: '#6D28D9', dark: '#A78BFA', lamp: 0x8b5cf6 }
};
const STOCK_GLYPH = 'M4 7l8-4 8 4-8 4-8-4z M4 7v10l8 4 8-4V7 M12 11v10';
const FIRST_STOP = 'cnc02';
const ORDER = ['stopped', 'maintenance', 'warning', 'setup', 'running'];

const SECTORS = [
    { id: 'corte', name: { pt: 'Corte', en: 'Panel cutting', es: 'Corte' }, x0: -17.4, x1: -5.4, z0: -10.2, z1: -1.4, fill: '#3b82f6', border: '#2563eb', ink: '#1d4ed8' },
    { id: 'injecao', name: { pt: 'Injeção', en: 'Injection molding', es: 'Inyección' }, x0: -3.6, x1: 9.2, z0: -10.2, z1: -1.4, fill: '#10b981', border: '#059669', ink: '#047857' },
    { id: 'mp', name: { pt: 'Matéria-prima', en: 'Raw material', es: 'Materia prima' }, x0: 10.8, x1: 17.4, z0: -10.2, z1: -1.4, fill: '#f59e0b', border: '#d97706', ink: '#b45309' },
    { id: 'borda', name: { pt: 'Borda e furação', en: 'Edging and drilling', es: 'Canteado y taladrado' }, x0: -17.4, x1: -5.4, z0: 1.4, z1: 10.2, fill: '#8b5cf6', border: '#7c3aed', ink: '#6d28d9' },
    { id: 'montagem', name: { pt: 'Montagem', en: 'Assembly', es: 'Montaje' }, x0: -3.6, x1: 9.2, z0: 1.4, z1: 10.2, fill: '#06b6d4', border: '#0891b2', ink: '#0e7490' },
    { id: 'expedicao', name: { pt: 'Expedição', en: 'Shipping', es: 'Expedición' }, x0: 10.8, x1: 17.4, z0: 1.4, z1: 10.2, fill: '#ec4899', border: '#db2777', ink: '#be185d' }
];

const L = (pt, en, es) => ({ pt, en, es });
const PROC = {
    saw: L('Corte', 'Panel sawing', 'Corte'),
    nesting: L('Corte CNC', 'CNC nesting', 'Corte CNC'),
    drill: L('Furação', 'Drilling', 'Taladrado'),
    edge: L('Bordeamento', 'Edge banding', 'Canteado'),
    injector: L('Injeção', 'Injection', 'Inyección'),
    labeler: L('Etiquetagem', 'Labeling', 'Etiquetado')
};
const P = {
    lateral: L('Lateral 18 mm 2.100 × 550', 'Side panel 18 mm 2100 × 550', 'Lateral 18 mm 2.100 × 550'),
    tampo: L('Tampo 25 mm 1.200 × 600', 'Top 25 mm 1200 × 600', 'Tablero 25 mm 1.200 × 600'),
    porta: L('Porta 18 mm 700 × 400', 'Door 18 mm 700 × 400', 'Puerta 18 mm 700 × 400'),
    prateleira: L('Prateleira 15 mm', 'Shelf 15 mm', 'Estante 15 mm'),
    lateralFurada: L('Lateral de roupeiro furada', 'Drilled wardrobe side', 'Lateral de ropero perforada'),
    base: L('Base de cômoda', 'Dresser base', 'Base de cómoda'),
    puxador: L('Puxador 128 mm', 'Handle 128 mm', 'Tirador 128 mm'),
    pe: L('Pé nivelador', 'Leveling foot', 'Pata niveladora'),
    organizador: L('Organizador de gaveta', 'Drawer organizer', 'Organizador de cajón'),
    gaveta: L('Gaveta 40 cm', 'Drawer 40 cm', 'Cajón 40 cm'),
    portaFita: L('Porta 18 mm com fita', 'Edge-banded door 18 mm', 'Puerta 18 mm con canto'),
    tampoMesa: L('Tampo de mesa 25 mm', 'Table top 25 mm', 'Tablero de mesa 25 mm'),
    volRoupeiro: L('Volume roupeiro 3 portas', 'Wardrobe box, 3 doors', 'Bulto ropero 3 puertas'),
    volComoda: L('Volume cômoda 4 gavetas', 'Dresser box, 4 drawers', 'Bulto cómoda 4 cajones')
};
/* Fila no formato da MachineQueueSection: [OP, produto, programado, apontado, [dia, início], [dia, fim]]. dia 0 = hoje. */
const MACHINES = [
    {
        id: 'sec01', code: 'SEC-01', type: 'saw', sector: 'corte', x: -8.6, z: -6.3, state: 'running', minutes: 192, oee: 84, eff: 91, produced: 312,
        op: '2481', product: P.lateral, done: 214, planned: 340, operator: 'Marcos',
        queue: [['2481', P.lateral, 340, 214, [0, '06:10'], [0, '14:40']], ['2490', P.tampo, 500, 0, [0, '14:55'], [1, '09:10']], ['2496', P.lateral, 180, 0, [1, '09:25'], [1, '13:40']]]
    },
    {
        id: 'cnc02', code: 'CNC-02', type: 'nesting', sector: 'corte', x: -14.9, z: -5.8, state: 'stopped', minutes: 23, oee: 52, eff: 61, produced: 118,
        reason: L('Falta de material', 'Material shortage', 'Falta de material'), op: '2477', product: P.porta, done: 118, planned: 260, operator: 'Paula',
        queue: [['2477', P.porta, 260, 118, [0, '07:00'], [0, '16:20']], ['2493', P.prateleira, 800, 0, [0, '16:35'], [1, '11:00']]]
    },
    {
        id: 'fur01', code: 'FUR-01', type: 'drill', sector: 'borda', x: -11.5, z: 7.7, state: 'warning', minutes: 4, oee: 71, eff: 78, produced: 486,
        op: '2479', product: P.lateralFurada, done: 486, planned: 900, operator: 'Diego',
        queue: [['2479', P.lateralFurada, 900, 486, [0, '06:00'], [0, '13:50']], ['2491', P.base, 400, 0, [0, '14:05'], [0, '19:30']], ['2499', P.lateralFurada, 1200, 0, [1, '06:00'], [1, '15:10']]]
    },
    {
        id: 'inj01', code: 'INJ-01', type: 'injector', sector: 'injecao', x: -0.5, z: -6.7, state: 'running', minutes: 248, oee: 91, eff: 96, produced: 2946,
        op: '2470', product: P.puxador, done: 2946, planned: 4000, operator: 'Fernanda',
        queue: [['2470', P.puxador, 4000, 2946, [0, '05:30'], [0, '15:30']], ['2485', P.pe, 1200, 0, [0, '16:10'], [1, '07:40']], ['2494', P.puxador, 6000, 0, [1, '07:55'], [2, '06:20']]]
    },
    {
        id: 'inj02', code: 'INJ-02', type: 'injector', sector: 'injecao', x: 5.9, z: -6.7, state: 'setup', minutes: 12, oee: 66, eff: 72, produced: 1320,
        reason: L('Troca de molde', 'Mold change', 'Cambio de molde'), op: '2488', product: P.organizador, done: 0, planned: 600, operator: 'Carlos',
        queue: [['2488', P.organizador, 600, 0, [0, '11:20'], [0, '17:00']], ['2492', P.gaveta, 900, 0, [0, '17:40'], [1, '10:30']]]
    },
    {
        id: 'col01', code: 'COL-01', type: 'edge', sector: 'borda', x: -11.5, z: 3.85, state: 'running', minutes: 95, oee: 79, eff: 85, produced: 1680,
        op: '2475', product: P.portaFita, done: 1680, planned: 2400, operator: 'Rafael',
        queue: [['2475', P.portaFita, 2400, 1680, [0, '06:30'], [0, '14:10']], ['2486', P.tampoMesa, 1500, 0, [0, '14:25'], [0, '20:15']]]
    },
    {
        id: 'etq01', code: 'ETQ-01', type: 'labeler', sector: 'expedicao', x: 12.2, z: 3.0, state: 'maintenance', minutes: 41, oee: 58, eff: 64, produced: 640,
        reason: L('Ajuste do aplicador', 'Applicator adjustment', 'Ajuste del aplicador'), op: '2482', product: P.volRoupeiro, done: 640, planned: 3000, operator: 'Bruno',
        queue: [['2482', P.volRoupeiro, 3000, 640, [0, '07:15'], [0, '18:30']], ['2497', P.volComoda, 3000, 0, [1, '06:00'], [1, '16:45']]]
    }
];
const STOCKS = [
    { id: 'silo1', code: 'SILO-01', type: 'tank', sector: 'mp', x: 12.6, z: -7.2, qty: '1.842 kg', material: L('PP preto', 'Black PP', 'PP negro'), level: 62, critical: false },
    { id: 'silo2', code: 'SILO-02', type: 'tank', sector: 'mp', x: 15.8, z: -7.2, qty: '214 kg', material: L('PP branco', 'White PP', 'PP blanco'), level: 7, critical: true },
    { id: 'exp', code: 'EXP-01', type: 'pallets', sector: 'expedicao', x: 14.0, z: 7.17, qty: '48 vol.', material: L('Pedidos do dia', "Today's orders", 'Pedidos del día'), level: 40, critical: false }
];
const ALL = [...MACHINES, ...STOCKS];

/* ---------------------------------------------------------------- utilidades */
const lang = () => (TX[window.MESTTI_LANG] ? window.MESTTI_LANG : 'pt');
const t = (key) => TX[lang()][key];
const loc = (value) => (value && typeof value === 'object' ? value[lang()] : value);
const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = window.matchMedia('(pointer: coarse)').matches;
// UI de celular/tablet = sem mouse. Notebook com tela de toque tem mouse/trackpad e fica com a UI de desktop.
const mobileUI = !window.matchMedia('(any-hover: hover)').matches;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = (n) => Number(n).toLocaleString(lang() === 'en' ? 'en-US' : 'pt-BR');
const elapsed = (min) => (min < 60 ? `${min} min` : `${Math.floor(min / 60)}h ${String(min % 60).padStart(2, '0')}min`);
const bucket = (oee) => (oee == null ? 'none' : oee >= 80 ? 'high' : oee >= 60 ? 'mid' : 'low');
const BUCKET_COLOR = { high: ['#1F7A5C', '#4CC9A0'], mid: ['#B54708', '#F0A04B'], low: ['#B42318', '#F2796F'], none: ['#5A6876', '#8A97A4'] };
const glyph = (path, size = 14) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"/></svg>`;
const sectorOf = (item) => SECTORS.find((s) => s.id === item.sector);

/* ---------------------------------------------------------------- estado da vista */
const view = { full: false, touched: false, selected: null, tab: 'summary', layer: 'state', filters: new Set(), nowOpen: false };

if (root) init();

function init() {
    // O módulo pode chegar antes de a aba abrir (pré-carga ao apontar para ela). Sem tamanho, a câmera
    // calcularia zoom infinito: espera o quadro ganhar largura e altura para montar a cena.
    if (!root.clientWidth || !root.clientHeight) {
        const wait = new ResizeObserver(() => {
            if (!root.clientWidth || !root.clientHeight) return;
            wait.disconnect();
            init();
        });
        wait.observe(root);
        return;
    }
    // "Fábrica agora" começa aberto no desktop e recolhido no celular/tablet, para não cobrir a cena.
    view.nowOpen = root.clientWidth >= 1100;
    root.classList.add('fx--loading');
    // A imagem estática da fábrica fica por cima até a cena 3D estar pronta, e some suavemente.
    const poster = root.querySelector('.fx-poster');
    root.innerHTML = `
        <div class="fx-scene"><canvas class="fx-canvas" aria-hidden="true"></canvas><div class="fx-labels"></div></div>
        <p class="fx-status" role="status">${t('loading')}</p>
        <div class="fx-hud" data-fx-hud></div>`;
    if (poster) root.prepend(poster);
    const canvas = root.querySelector('.fx-canvas');
    const labelsHost = root.querySelector('.fx-labels');
    renderHud();
    root.querySelector('[data-fx-hud]').inert = true;
    bindHud();

    let scene3d = null;
    try {
        scene3d = buildScene(canvas, labelsHost);
    } catch (error) {
        console.error(error);
        // Sem WebGL recarregar não resolve: mantém a imagem estática.
        fail({ permanent: true });
    }
    root.__fx = scene3d;

    document.addEventListener('mestti:lang', () => { renderHud(); scene3d?.refreshLabels(); });
    new MutationObserver(() => scene3d?.applyTheme()).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}

function fail({ permanent = false } = {}) {
    root.removeAttribute('aria-busy');
    if (permanent) {
        if (view.full) setFull(false);
        root.classList.remove('fx--loading', 'fx--ready');
        root.classList.add('fx--static');
        return;
    }
    root.querySelector('[data-fx-hud]').inert = false;
    root.classList.remove('fx--loading');
    root.classList.add('fx--error');
    const status = root.querySelector('.fx-status');
    status.textContent = t('error');
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.className = 'fx-retry fx-surface';
    retry.textContent = loc(L('Tentar novamente', 'Try again', 'Intentar de nuevo'));
    retry.addEventListener('click', () => location.reload());
    status.appendChild(retry);
}

/* ---------------------------------------------------------------- HUD */
function counts() {
    let running = 0; let stopped = 0;
    MACHINES.forEach((m) => {
        if (m.state === 'running' || m.state === 'warning') running += 1;
        else if (m.state === 'stopped') stopped += 1;
    });
    return { running, stopped, lost: 0, total: MACHINES.length };
}

function matchesFilter(item) {
    if (view.filters.size === 0) return true;
    if (!item.state) return false;
    const key = item.state === 'warning' ? 'running' : item.state;
    return view.filters.has(key) || view.filters.has(item.state);
}

function listItems() {
    const machines = MACHINES.filter(matchesFilter).slice().sort((a, b) => ORDER.indexOf(a.state) - ORDER.indexOf(b.state));
    const stocks = view.filters.size === 0 ? STOCKS.filter((s) => s.critical) : [];
    return [...stocks, ...machines];
}

function renderHud() {
    const hud = root.querySelector('[data-fx-hud]');
    if (!hud) return;
    const c = counts();
    const chips = ['running', 'stopped', 'warning', 'setup', 'maintenance'].map((key) => ({ key, count: MACHINES.filter((m) => m.state === key).length })).filter((chip) => chip.count > 0);
    const items = listItems();
    const ident = `
        <div class="fx-top-left">
            <div class="fx-surface fx-ident">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 20V9l6 4V9l6 4V5h4l4 15H2z"/></svg>
                <span class="fx-ident-name">${t('factory')}</span>
                <span class="fx-sep" aria-hidden="true"></span>
                <span class="fx-live"><i aria-hidden="true"></i>${t('live')}</span>
            </div>
        </div>`;
    // Na home a maquete só passa o modo cinema; a interação (filtros, camadas, zoom, detalhes) fica na tela cheia.
    root.classList.toggle('fx--cinema', mobileUI && !view.full);
    if (mobileUI && !view.full) {
        hud.innerHTML = `${ident}
        <button type="button" class="fx-cta" data-fx-full><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>${t('explore')}</button>`;
        return;
    }
    hud.innerHTML = `
        <div class="fx-top-left">
            <div class="fx-surface fx-ident">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 20V9l6 4V9l6 4V5h4l4 15H2z"/></svg>
                <span class="fx-ident-name">${t('factory')}</span>
                <span class="fx-sep" aria-hidden="true"></span>
                <span class="fx-live"><i aria-hidden="true"></i>${t('live')}</span>
            </div>
        </div>
        <div class="fx-top-right">
            <div class="fx-layer" role="group" aria-label="${t('layerGroup')}">
                <button type="button" data-fx-layer="state" aria-pressed="${view.layer === 'state'}">${t('layerState')}</button>
                <button type="button" data-fx-layer="oee" aria-pressed="${view.layer === 'oee'}">${t('layerOee')}</button>
            </div>
            ${mobileUI ? `<button type="button" class="fx-icon fx-exit" data-fx-exit aria-label="${t('fullExit')}" title="${t('fullExit')}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>` : ''}
        </div>
        <section class="fx-surface fx-now${view.nowOpen ? '' : ' is-collapsed'}" aria-label="${t('now')}">
            <div class="fx-now-head">
                <h3>${t('now')}<i class="fx-now-live" aria-hidden="true"></i></h3>
                <button type="button" class="fx-icon" data-fx-now aria-expanded="${view.nowOpen}" aria-label="${view.nowOpen ? t('collapse') : t('expand')}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
                </button>
            </div>
            <div class="fx-now-body">
                <div class="fx-stats">
                    <div><span>${t('running')}</span><strong>${c.running}<small> / ${c.total}</small></strong></div>
                    <div><span>${t('stoppedPl')}</span><strong>${c.stopped}</strong></div>
                    <div><span>${t('lost')}</span><strong>${c.lost}</strong></div>
                </div>
                <div class="fx-list-head"><h4>${view.filters.size ? t('inFilter') : t('machines')}</h4><span>${items.length}</span></div>
                ${items.length === 0 ? `<p class="fx-empty">${t('noneInFilter')}</p>` : `<ul class="fx-list">${items.map(listRow).join('')}</ul>`}
                <p class="fx-hint"><span class="fx-demo-tag">${t('demo')}</span><span>${t(mobileUI ? 'hintFullTouch' : (view.full ? 'hintFull' : 'hintDrag'))}</span></p>
            </div>
        </section>
        <div class="fx-dock-wrap">
            ${view.layer === 'oee' ? `<div class="fx-surface fx-legend"><b>${t('oeeLegend')}</b>${['high', 'mid', 'low'].map((b) => `<span><i style="background:${BUCKET_COLOR[b][isDark() ? 1 : 0]}"></i>${t('b_' + b)}</span>`).join('')}</div>` : ''}
            <div class="fx-surface fx-dock" role="group" aria-label="${t('filterGroup')}">
                <button type="button" data-fx-filter="" aria-pressed="${view.filters.size === 0}">${t('all')} <span>${MACHINES.length}</span></button>
                ${chips.map((chip) => `<button type="button" data-fx-filter="${chip.key}" aria-pressed="${view.filters.has(chip.key)}" title="${STATES[chip.key].label[lang()]}"><i class="fx-dot st-${chip.key}" aria-hidden="true"></i><em class="fx-chip-label">${STATES[chip.key].label[lang()]}</em> <span>${chip.count}</span></button>`).join('')}
            </div>
        </div>
        <div class="fx-surface fx-zoom">
            <button type="button" class="fx-icon" data-fx-zoom="in" aria-label="${t('zoomIn')}" title="${t('zoomIn')}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button>
            <button type="button" class="fx-icon" data-fx-zoom="out" aria-label="${t('zoomOut')}" title="${t('zoomOut')}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14"/></svg></button>
            <button type="button" class="fx-icon" data-fx-full aria-pressed="${view.full}" aria-label="${t(view.full ? 'fullExit' : 'full')}" title="${t(view.full ? 'fullExit' : 'full')}"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="${view.full ? 'M20 10h-6V4M4 14h6v6M14 10l7-7M3 21l7-7' : 'M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7'}"/></svg></button>
        </div>
        ${view.selected ? drawer(view.selected) : ''}`;
}

function listRow(item) {
    const isStock = item.type === 'tank' || item.type === 'pallets';
    const state = isStock ? null : STATES[item.state];
    const tone = isStock ? 'stock' : item.state;
    const sub = isStock
        ? [t('critical'), item.qty].join(' · ')
        : [state.label[lang()], item.state === 'running' ? null : elapsed(item.minutes), item.operator].filter(Boolean).join(' · ');
    const oee = isStock ? '' : `<b class="fx-oee b-${bucket(item.oee)}"><small>OEE</small>${item.oee}%</b>`;
    return `<li><button type="button" data-fx-select="${item.id}" aria-current="${view.selected === item.id}">
        <span class="fx-glyph st-${tone}">${glyph(isStock ? STOCK_GLYPH : state.glyph, 16)}</span>
        <span class="fx-row"><span class="fx-row-top"><strong>${item.code}</strong>${oee}</span><span class="fx-row-sub"><span>${esc(sub)}</span>${isStock ? '' : `<em>${fmt(item.produced)}</em>`}</span></span>
    </button></li>`;
}

function drawer(id) {
    const item = ALL.find((entry) => entry.id === id);
    if (!item) return '';
    const sector = sectorOf(item).name[lang()];
    if (item.type === 'tank' || item.type === 'pallets') {
        return `<aside class="fx-drawer" tabindex="-1" aria-label="${item.code}">
            <div class="fx-drawer-head"><div><p>${t('stock')} · ${sector}</p><h3>${item.code}</h3></div><button type="button" class="fx-icon" data-fx-close aria-label="${t('close')}">${glyph('M6 6l12 12M18 6L6 18', 20)}</button></div>
            <div class="fx-band ${item.critical ? 'st-stopped' : 'st-running'}">${glyph(STOCK_GLYPH, 16)}<span>${item.critical ? t('critical') : t('ok')}</span></div>
            <div class="fx-drawer-body">
                <div class="fx-tiles"><div class="fx-tile"><span>${t('balance')}</span><strong>${item.qty}</strong><small>${esc(loc(item.material))}</small></div>
                <div class="fx-tile"><span>${t('capacity')}</span><strong>${item.level}%</strong><i class="fx-bar"><b style="width:${item.level}%" class="${item.critical ? 'is-low' : ''}"></b></i></div></div>
            </div>
        </aside>`;
    }
    const state = STATES[item.state];
    const band = [state.label[lang()], item.state === 'running' ? `${t('since')} ${elapsed(item.minutes)}` : `${t('since')} ${elapsed(item.minutes)}`].join(' ');
    const progress = Math.round((item.done / item.planned) * 100);
    const summary = `
        <div class="fx-tiles">
            <div class="fx-tile"><span>OEE</span><strong class="b-${bucket(item.oee)}">${item.oee}%</strong><small>${t('today')}</small></div>
            <div class="fx-tile"><span>${t('eff')}</span><strong>${item.eff}%</strong><small>${t('today')}</small></div>
            <div class="fx-tile"><span>${t('producedToday')}</span><strong>${fmt(item.produced)}</strong><small>${t('pieces')}</small></div>
            <div class="fx-tile"><span>${t('orderDone')}</span><strong>${progress}%</strong><i class="fx-bar"><b style="width:${progress}%"></b></i><small>${fmt(item.done)} ${t('of')} ${fmt(item.planned)} ${t('pcs')}</small></div>
        </div>
        <dl class="fx-rows">
            ${item.reason ? `<div><dt>${t('reason')}</dt><dd>${esc(loc(item.reason))}</dd></div>` : ''}
            <div><dt>${t('operation')}</dt><dd>OP ${item.op}</dd></div>
            <div><dt>${t('product')}</dt><dd>${esc(loc(item.product))}</dd></div>
            <div><dt>${t('operator')}</dt><dd>${item.operator}</dd></div>
            <div><dt>${t('sector')}</dt><dd>${sector}</dd></div>
        </dl>`;
    const queue = queueMarkup(item);
    return `<aside class="fx-drawer" tabindex="-1" aria-label="${item.code}">
        <div class="fx-drawer-head"><div><p>${sector}</p><h3>${item.code}</h3></div><button type="button" class="fx-icon" data-fx-close aria-label="${t('close')}">${glyph('M6 6l12 12M18 6L6 18', 20)}</button></div>
        <div class="fx-band st-${item.state}">${glyph(state.glyph, 16)}<span>${band}</span></div>
        <div class="fx-tabs" role="tablist">
            <button type="button" role="tab" data-fx-tab="summary" aria-selected="${view.tab === 'summary'}">${t('summary')}</button>
            <button type="button" role="tab" data-fx-tab="queue" aria-selected="${view.tab === 'queue'}">${t('queue')}</button>
        </div>
        <div class="fx-drawer-body">${view.tab === 'queue' ? queue : summary}</div>
    </aside>`;
}

/* Fila igual à MachineQueueSection do produto: trilho com ponto, OP, posição, produto, progresso,
   "processo · pç · apontado", janela "início → fim" com duração e cabeçalho por dia. */
function dayAt(offset, hhmm) {
    const d = new Date();
    const [h, m] = hhmm.split(':').map(Number);
    d.setDate(d.getDate() + offset);
    d.setHours(h, m, 0, 0);
    return d;
}
const locale = () => (lang() === 'en' ? 'en-US' : lang() === 'es' ? 'es-ES' : 'pt-BR');
const dateTime = (d) => `${d.toLocaleDateString(locale(), { day: '2-digit', month: '2-digit' })} ${d.toLocaleTimeString(locale(), { hour: '2-digit', minute: '2-digit', hour12: false })}`;
const span = (min) => (min < 60 ? `${min} min` : `${Math.floor(min / 60)}h${min % 60 ? ` ${String(min % 60).padStart(2, '0')}min` : ''}`);
function dayLabel(offset) {
    if (offset === 0) return t('todayH');
    if (offset === 1) return t('tomorrowH');
    const label = dayAt(offset, '12:00').toLocaleDateString(locale(), { weekday: 'long', day: '2-digit', month: '2-digit' });
    return label.charAt(0).toUpperCase() + label.slice(1);
}
function queueMarkup(item) {
    const proc = loc(PROC[item.type]);
    const rows = item.queue.map(([op, product, qty, applied, start, end], index) => ({
        op, product, qty, applied, index,
        day: start[0], endDay: end[0], start: dayAt(...start), end: dayAt(...end)
    }));
    const totalMin = rows.reduce((sum, r) => sum + Math.round((r.end - r.start) / 60000), 0);
    const last = rows[rows.length - 1];
    const hm = (d) => d.toLocaleTimeString(locale(), { hour: '2-digit', minute: '2-digit', hour12: false });
    const ends = last.endDay === 0 ? hm(last.end) : `${dayLabel(last.endDay).toLowerCase()} ${hm(last.end)}`;
    let html = `<p class="fq-summary">${span(totalMin)} ${t('load')} · ${t('ends')} ${ends}</p><div class="fq">`;
    let day = null;
    rows.forEach((r) => {
        if (r.day !== day) { day = r.day; html += `<h4 class="fq-day">${dayLabel(day)}</h4>`; }
        const current = r.index === 0;
        const progress = Math.min(100, Math.round((r.applied / r.qty) * 100));
        const isLast = r.index === rows.length - 1;
        html += `<div class="fq-row${current ? ' is-current' : ''}">
            <span class="fq-rail${isLast ? ' is-last' : ''}" aria-hidden="true"><i></i></span>
            <div class="fq-body">
                <div class="fq-top"><strong>OP ${r.op}</strong><span>${current ? t('current') : `${r.index + 1}${t('nth')}`}</span></div>
                <p class="fq-prod">${esc(loc(r.product))}</p>
                ${current ? `<div class="fq-bar" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100"><b style="width:${progress}%"></b></div>` : ''}
                <p class="fq-meta">${esc(proc)} · ${fmt(r.qty)} ${t('pcs')} · ${fmt(r.applied)} ${t('applied')}</p>
                <p class="fq-win"><span>${dateTime(r.start)} → ${dateTime(r.end)}</span><b>${span(Math.round((r.end - r.start) / 60000))}</b></p>
            </div>
        </div>`;
    });
    return html + '</div>';
}

function bindHud() {
    root.addEventListener('click', (event) => {
        const target = event.target.closest('button, [data-fx-pin]');
        if (!target || !root.contains(target)) return;
        const fx = root.__fx;
        if (target.dataset.fxSelect || target.dataset.fxPin) {
            select(target.dataset.fxSelect || target.dataset.fxPin);
        } else if (target.hasAttribute('data-fx-close')) {
            select(null);
        } else if (target.dataset.fxTab) {
            view.tab = target.dataset.fxTab;
            renderHud();
        } else if (target.hasAttribute('data-fx-now')) {
            view.nowOpen = !view.nowOpen;
            renderHud();
            fx?.frame(true);
        } else if (target.dataset.fxLayer) {
            view.layer = target.dataset.fxLayer;
            renderHud();
            fx?.refreshLabels();
        } else if (target.hasAttribute('data-fx-filter')) {
            const key = target.dataset.fxFilter;
            if (!key) view.filters.clear();
            else if (view.filters.has(key)) view.filters.delete(key);
            else view.filters.add(key);
            renderHud();
            fx?.refreshLabels();
        } else if (target.hasAttribute('data-fx-exit')) {
            setFull(false);
        } else if (target.hasAttribute('data-fx-full')) {
            setFull(!view.full);
        } else if (target.dataset.fxZoom) {
            fx?.zoomBy(target.dataset.fxZoom === 'in' ? 1.35 : 1 / 1.35);
        }
    });
    root.addEventListener('input', (event) => {
        if (!event.target.matches('[data-fx-search]')) return;
        const q = event.target.value.trim().toLowerCase();
        const box = root.querySelector('[data-fx-results]');
        if (!q) { box.hidden = true; return; }
        const hits = ALL.filter((item) => item.code.toLowerCase().includes(q) || sectorOf(item).name[lang()].toLowerCase().includes(q));
        box.innerHTML = hits.length ? hits.map((item) => `<li><button type="button" data-fx-select="${item.id}">${item.code} <span>${sectorOf(item).name[lang()]}</span></button></li>`).join('') : `<li class="fx-empty">${t('noResult')}</li>`;
        box.hidden = false;
    });
    root.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && view.selected) { event.preventDefault(); select(null); }
        else if (event.key === 'Escape' && view.full) { event.preventDefault(); setFull(false); }
        if (event.key === 'Enter' && event.target.matches('[data-fx-search]')) {
            const first = root.querySelector('[data-fx-results] [data-fx-select]');
            if (first) select(first.dataset.fxSelect);
        }
    });
}

// No toque, usa uma camada modal acima da página; desktop tenta primeiro a API nativa.
let fullscreen = null;
function setFull(on) {
    if (on === view.full) return;
    view.full = on;
    if (!on) view.selected = null;
    renderHud();
    fullscreen ??= createFactoryFullscreen(root, { mobile: coarse, label: () => t('factory'), onExit: () => setFull(false) });
    if (on) {
        // Guarda o tamanho e a posição da página antes de retirar a cena do fluxo.
        fullscreen.enter();
        root.classList.add('fx--full');
        document.documentElement.classList.add('fx-lock');
    } else {
        root.classList.remove('fx--full');
        document.documentElement.classList.remove('fx-lock');
        fullscreen.exit();
    }
    root.__fx?.setFull(on);
    root.querySelector('[data-fx-full]')?.focus({ preventScroll: true });
    window.dispatchEvent(new CustomEvent('mestti:factory-fullscreen', { detail: { active: on } }));
    if (on && typeof window.gtag === 'function') window.gtag('event', 'home_factory_fullscreen');
}

const openFull = () => setFull(true);

function select(id) {
    view.selected = id;
    // Abaixo de 1100 px o painel e o card se sobrepõem: ao escolher uma máquina, recolhe "Fábrica agora".
    if (id && root.clientWidth < 1100) view.nowOpen = false;
    if (id && !view.touched) { view.touched = true; root.__fx?.refreshLabels(); }
    view.tab = 'summary';
    renderHud();
    root.__fx?.focus(id);
    if (id) root.querySelector('.fx-drawer')?.focus({ preventScroll: true });
    if (typeof window.gtag === 'function' && id) window.gtag('event', 'home_factory_select', { machine: id });
}

/* ---------------------------------------------------------------- cena 3D */
function buildScene(canvas, labelsHost) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1 : 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 400);
    const labels = new CSS2DRenderer({ element: labelsHost });

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Planta compacta: coordenadas do layout em escala de metros parecida com a do produto.
    const K = 0.78;
    const MS = 0.72;
    SECTORS.forEach((s) => { s.x0 *= K; s.x1 *= K; s.z0 *= K; s.z1 *= K; });
    ALL.forEach((item) => { item.x *= K; item.z *= K; });
    const B = { minX: -15, maxX: 15, minZ: -9, maxZ: 9 };

    // Iluminação de galpão: céu fraco, sol entrando pelos janelões, luminárias que fazem poças de luz no piso
    // e um ambiente refletivo para o metal das máquinas e o brilho do epóxi.
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.42;
    scene.add(new THREE.HemisphereLight(0xdde7f0, 0x22272d, 0.42));
    const sun = new THREE.DirectionalLight(0xfff1de, 1.45);
    sun.position.set(-9, 20, -12);
    sun.castShadow = true;
    sun.shadow.mapSize.setScalar(coarse ? 1024 : 2048);
    Object.assign(sun.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, near: 1, far: 70 });
    sun.shadow.bias = -0.0005;
    sun.shadow.normalBias = 0.03;
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0xcfe0ff, 0.35);
    fill.position.set(12, 10, 14);
    scene.add(fill);
    // Luminárias de galpão: em vez de 12 luzes reais (caras por pixel), poças de luz aditivas sobre o piso,
    // num único desenho. O efeito visual é o mesmo e o custo de GPU cai para quase nada.
    const POOLS = [[-11.5, -4.6], [-6.4, -4.6], [-0.6, -4.8], [5, -4.8], [11, -4.4], [-11.5, 4.6], [-6.4, 4.6], [0, 4.6], [5.4, 4.6], [11, 4.6], [-3.5, 0], [7.8, 0]];
    function lightPools(parent) {
        const c = document.createElement('canvas');
        c.width = c.height = 128;
        const ctx = c.getContext('2d');
        const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        grad.addColorStop(0, 'rgba(255, 238, 210, 1)');
        grad.addColorStop(0.45, 'rgba(255, 238, 210, 0.45)');
        grad.addColorStop(1, 'rgba(255, 238, 210, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 128, 128);
        const tex = new THREE.CanvasTexture(c);
        tex.colorSpace = THREE.SRGBColorSpace;
        const geo = new THREE.PlaneGeometry(6.4, 6.4).rotateX(-Math.PI / 2);
        const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending, depthWrite: false });
        const pools = new THREE.InstancedMesh(geo, mat, POOLS.length);
        const m = new THREE.Matrix4();
        POOLS.forEach(([x, z], i) => pools.setMatrixAt(i, m.makeTranslation(x, 0.02, z)));
        pools.renderOrder = 2;
        parent.add(pools);
    }

    const world = new THREE.Group();
    scene.add(world);

    // Fora do galpão é escuro nos dois temas, como numa planta vista à noite.
    const palette = () => ({ bg: isDark() ? 0x0b0f13 : 0x11171d });

    // Instâncias de caixa (piso, nervuras, montantes, parafusos), como FactoryStructureInstances.
    const unitBox = new THREE.BoxGeometry(1, 1, 1);
    function instances(list, material, { geometry = unitBox, cast = false, receive = false, parent = world } = {}) {
        const mesh = new THREE.InstancedMesh(geometry, material, list.length);
        const m = new THREE.Matrix4(); const q = new THREE.Quaternion(); const e = new THREE.Euler();
        list.forEach((it, i) => {
            e.set(...(it.rot || [0, 0, 0]));
            q.setFromEuler(e);
            m.compose(new THREE.Vector3(...it.pos), q, new THREE.Vector3(...it.scale));
            mesh.setMatrixAt(i, m);
            if (it.color) mesh.setColorAt(i, new THREE.Color(it.color));
        });
        mesh.castShadow = cast;
        mesh.receiveShadow = receive;
        parent.add(mesh);
        return mesh;
    }

    // Piso: placas 1×1 m quadriculadas com laje, cores da FactoryFloorTiles.
    const WALL_T = 0.14;
    const SLAB = 0.1;
    const base = []; const top = [];
    for (let x = B.minX; x < B.maxX; x += 1) {
        for (let z = B.minZ; z < B.maxZ; z += 1) {
            const light = (x + z) % 2 === 0;
            const ex = x === B.minX ? WALL_T : 0;
            const ez = z === B.minZ ? WALL_T : 0;
            const cx = x + 0.5 - ex / 2; const cz = z + 0.5 - ez / 2;
            base.push({ pos: [cx, -SLAB / 2, cz], scale: [1 + ex, SLAB, 1 + ez], color: light ? '#2b3036' : '#2a2f35' });
            top.push({ pos: [cx, 0.004, cz], scale: [1 + ex - 0.06, 0.004, 1 + ez - 0.06], color: light ? '#cfd6dc' : '#c7ced4' });
        }
    }
    const floorBase = instances(base, new THREE.MeshStandardMaterial({ roughness: 0.82, metalness: 0.06 }), { receive: true });
    const floorTop = instances(top, new THREE.MeshStandardMaterial({ roughness: 0.36, metalness: 0.1 }), { receive: true });
    floorBase.userData.floor = true;
    floorTop.userData.floor = true;
    floorTop.visible = false;
    // Epóxi escuro (textura de concreto do SimReady) com brilho suave.
    const epoxy = new THREE.MeshStandardMaterial({ color: 0x9aa3ad, roughness: 0.34, metalness: 0.18 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(B.maxX - B.minX, B.maxZ - B.minZ), epoxy);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set((B.minX + B.maxX) / 2, 0.004, (B.minZ + B.maxZ) / 2);
    floor.receiveShadow = true;
    floor.userData.floor = true;
    world.add(floor);
    lightPools(world);
    new THREE.TextureLoader().load('/glbimagens/piso-epoxi.webp', (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set((B.maxX - B.minX) / 6, (B.maxZ - B.minZ) / 6);
        tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        epoxy.map = tex;
        epoxy.color.set(0x9aa2aa);
        epoxy.needsUpdate = true;
    });

    // Sinalização pintada no piso: faixas amarelas dos setores, vagas brancas e o nome de cada setor no chão.
    const paint = { yellow: [], white: [] };
    const strip = (color, x0, z0, x1, z1, w = 0.09) => {
        const dx = x1 - x0; const dz = z1 - z0; const len = Math.hypot(dx, dz);
        // +w: a faixa passa meia largura de cada ponta, e a quina fecha em esquadro com a faixa vizinha.
        paint[color].push({ pos: [(x0 + x1) / 2, 0.012, (z0 + z1) / 2], scale: [len + w, 0.004, w], rot: [0, -Math.atan2(dz, dx), 0] });
    };
    const rect = (color, x0, z0, x1, z1, w) => { strip(color, x0, z0, x1, z0, w); strip(color, x1, z0, x1, z1, w); strip(color, x1, z1, x0, z1, w); strip(color, x0, z1, x0, z0, w); };

    SECTORS.forEach((s) => rect('yellow', s.x0 + 0.1, s.z0 + 0.1, s.x1 - 0.1, s.z1 - 0.1, 0.1));
    // Vagas dos paletes da expedição.
    [[10.3, 5.0], [11.5, 5.0], [10.3, 6.2], [11.5, 6.2]].forEach(([x, z]) => rect('white', x - 0.5, z - 0.45, x + 0.5, z + 0.45, 0.05));
    const paintMat = (hex) => new THREE.MeshStandardMaterial({ color: hex, roughness: 0.55, metalness: 0, emissive: hex, emissiveIntensity: 0.12, polygonOffset: true, polygonOffsetFactor: -2 });
    instances(paint.yellow, paintMat(0xf2bf1a), { receive: true });
    instances(paint.white, paintMat(0xe9edf1), { receive: true });

    // Nome do setor escrito no piso, em letras grandes perto da borda da frente.
    let paintedLang = null;
    function paintSector(s) {
        const text = s.name[lang()].toUpperCase();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const px = 96;
        ctx.font = `700 ${px}px Inter, "Segoe UI", Arial, sans-serif`;
        const spacing = 10;
        const width = Math.ceil([...text].reduce((w, ch) => w + ctx.measureText(ch).width + spacing, 0)) + 20;
        canvas.width = width; canvas.height = Math.ceil(px * 1.3);
        ctx.font = `700 ${px}px Inter, "Segoe UI", Arial, sans-serif`;
        ctx.fillStyle = 'rgba(236, 240, 244, 0.86)';
        ctx.textBaseline = 'middle';
        let x = 10;
        [...text].forEach((ch) => { ctx.fillText(ch, x, canvas.height / 2); x += ctx.measureText(ch).width + spacing; });
        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        const h = 0.62; const w = (h * canvas.width) / canvas.height;
        if (s.paintMesh) { world.remove(s.paintMesh); s.paintMesh.material.map.dispose(); s.paintMesh.material.dispose(); s.paintMesh.geometry.dispose(); }
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.6, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3 }));
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.set(s.x0 + 0.45 + w / 2, 0.014, s.z1 - 0.62);
        mesh.receiveShadow = true;
        world.add(mesh);
        s.paintMesh = mesh;
    }

    // Paredes do fundo (−X e −Z) com as medidas e materiais da FactoryBackWalls.
    // Paredes desenhadas em código: ficam só até a casca do galpão (NVIDIA SimReady) carregar.
    const fallbackShell = new THREE.Group();
    world.add(fallbackShell);
    (function backWalls(world) {
        const H = 1.8; const PANEL_BASE = 0.28; const FRAME = 0.055; const RIB_W = 0.016; const RIB_D = 0.018;
        const std = (color, roughness, metalness) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
        const wall = std('#4b5563', 0.72, 0.18); const trim = std('#303946', 0.68, 0.24); const panel = std('#65717e', 0.78, 0.12);
        const rib = std('#8994a0', 0.66, 0.22); const plinth = std('#8b949e', 0.9, 0.02); const bolt = std('#161d26', 0.5, 0.62);
        const spanX = B.maxX - B.minX + WALL_T; const spanZ = B.maxZ - B.minZ + WALL_T;
        const cX = (B.minX + B.maxX) / 2 - WALL_T / 2; const cZ = (B.minZ + B.maxZ) / 2 - WALL_T / 2;
        const add = (geo, mat, pos, cast = true) => { const mesh = new THREE.Mesh(geo, mat); mesh.position.set(...pos); mesh.castShadow = cast; mesh.receiveShadow = true; world.add(mesh); return mesh; };
        const bx = (w, h, d) => new THREE.BoxGeometry(w, h, d);
        add(bx(spanX, H, WALL_T), wall, [cX, H / 2, B.minZ - WALL_T / 2]);
        add(bx(WALL_T, H, spanZ), wall, [B.minX - WALL_T / 2, H / 2, cZ]);
        add(bx(spanX - 0.08, H - 0.24, 0.025), panel, [cX, H / 2, B.minZ + 0.0125], false);
        add(bx(0.025, H - 0.24, spanZ - 0.08), panel, [B.minX + 0.0125, H / 2, cZ], false);
        add(bx(spanX, PANEL_BASE, 0.037), plinth, [cX, PANEL_BASE / 2, B.minZ + 0.031], false);
        add(bx(0.037, PANEL_BASE, spanZ), plinth, [B.minX + 0.031, PANEL_BASE / 2, cZ], false);
        [0.58, 1.25].forEach((y) => {
            add(bx(spanX, FRAME, FRAME), trim, [cX, y, B.minZ + FRAME / 2]);
            add(bx(FRAME, FRAME, spanZ), trim, [B.minX + FRAME / 2, y, cZ]);
        });
        add(bx(spanX, 0.08, 0.2), trim, [cX, H + 0.04, B.minZ - WALL_T / 2]);
        add(bx(0.2, 0.08, spanZ), trim, [B.minX - WALL_T / 2, H + 0.04, cZ]);
        add(bx(spanX, 0.16, 0.1), trim, [cX, 0.08, B.minZ + 0.05]);
        add(bx(0.1, 0.16, spanZ), trim, [B.minX + 0.05, 0.08, cZ]);
        const detailH = H - PANEL_BASE - 0.12; const detailY = PANEL_BASE + detailH / 2;
        const ribs = []; const frames = []; const bolts = [];
        for (let x = B.minX + 0.2; x < B.maxX - 0.1; x += 0.2) ribs.push({ pos: [x, detailY, B.minZ + 0.025 + RIB_D / 2], scale: [RIB_W, detailH, RIB_D] });
        for (let z = B.minZ + 0.2; z < B.maxZ - 0.1; z += 0.2) ribs.push({ pos: [B.minX + 0.025 + RIB_D / 2, detailY, z], scale: [RIB_D, detailH, RIB_W] });
        for (let x = B.minX + 1; x < B.maxX; x += 1) {
            frames.push({ pos: [x, H / 2, B.minZ + FRAME / 2], scale: [FRAME, H - 0.08, FRAME] }, { pos: [x, 0.018, B.minZ + 0.08], scale: [0.16, 0.036, 0.16] });
            [0.22, 0.9, 1.58].forEach((y) => bolts.push({ pos: [x, y, B.minZ + FRAME + 0.006], scale: [0.022, 0.014, 0.022], rot: [Math.PI / 2, 0, 0] }));
        }
        for (let z = B.minZ + 1; z < B.maxZ; z += 1) {
            frames.push({ pos: [B.minX + FRAME / 2, H / 2, z], scale: [FRAME, H - 0.08, FRAME] }, { pos: [B.minX + 0.08, 0.018, z], scale: [0.16, 0.036, 0.16] });
            [0.22, 0.9, 1.58].forEach((y) => bolts.push({ pos: [B.minX + FRAME + 0.006, y, z], scale: [0.022, 0.014, 0.022], rot: [0, 0, Math.PI / 2] }));
        }
        instances(ribs, rib, { cast: true, parent: world });
        instances(frames, trim, { cast: true, parent: world });
        instances(bolts, bolt, { geometry: new THREE.CylinderGeometry(1, 1, 1, 8), parent: world });

        // Equipamentos de parede (FactoryWallEquipment): extintores, luminárias e quadro elétrico.
        const group = (pos) => { const g = new THREE.Group(); g.position.set(...pos); world.add(g); return g; };
        const part = (g, geo, mat, pos = [0, 0, 0], rot) => { const mesh = new THREE.Mesh(geo, mat); mesh.position.set(...pos); if (rot) mesh.rotation.set(...rot); mesh.castShadow = true; g.add(mesh); return mesh; };
        const dark = std('#20262d', 0.48, 0.65);
        const extinguisher = (x) => {
            const g = group([x, 0.56, B.minZ + 0.13]);
            part(g, bx(0.25, 0.52, 0.045), std('#252d36', 0.76, 0.3), [0, 0.02, -0.065]);
            part(g, new THREE.CylinderGeometry(0.095, 0.105, 0.42, 20), std('#d32f2f', 0.42, 0.18));
            part(g, new THREE.CylinderGeometry(0.035, 0.045, 0.07, 12), dark, [0, 0.245, 0]);
            part(g, bx(0.12, 0.025, 0.035), dark, [0.055, 0.275, 0]);
            part(g, new THREE.PlaneGeometry(0.1, 0.13), new THREE.MeshBasicMaterial({ color: '#f5f5f5' }), [0, 0.08, 0.102]);
            part(g, new THREE.TorusGeometry(0.11, 0.014, 8, 24, Math.PI * 1.35), std('#181d22', 0.7, 0), [0.13, 0.08, 0.02], [0, 0, -0.22]);
        };
        const lamp = (x) => {
            const g = group([x, 1.57, B.minZ + 0.105]);
            part(g, bx(0.48, 0.16, 0.08), std('#2f3944', 0.6, 0.35), [0, 0, -0.035]);
            const glow = new THREE.MeshStandardMaterial({ color: '#fff3c4', emissive: '#ffd76a', emissiveIntensity: 1.6, roughness: 0.28 });
            part(g, bx(0.39, 0.085, 0.025), glow, [0, 0, 0.015]);
        };
        const panelBox = (x) => {
            const g = group([x, 0.92, B.minZ + 0.13]);
            part(g, bx(0.48, 0.7, 0.13), std('#7d8791', 0.55, 0.38));
            part(g, bx(0.42, 0.63, 0.025), std('#aab2b9', 0.62, 0.26), [0, 0, 0.076]);
            part(g, bx(0.025, 0.13, 0.025), std('#242b32', 0.42, 0.7), [0.15, 0, 0.098]);
            part(g, new THREE.CircleGeometry(0.075, 3), new THREE.MeshBasicMaterial({ color: '#f7c948' }), [0, 0.09, 0.091]);
            part(g, new THREE.SphereGeometry(0.022, 10, 10), new THREE.MeshStandardMaterial({ color: '#43a047', emissive: '#1b5e20', emissiveIntensity: 0.7 }), [0.04, 0.31, 0.098]);
            part(g, new THREE.SphereGeometry(0.022, 10, 10), std('#ef5350', 0.35, 0), [-0.04, 0.31, 0.098]);
        };
        extinguisher(B.minX + 0.65);
        extinguisher(1.6);
        [-9, -3, 4, 10].forEach(lamp);
        panelBox(B.maxX - 0.72);
        panelBox(-5.4);
    })(fallbackShell);

    // Junta as malhas estáticas de um grupo por material: centenas de peças viram poucas chamadas de desenho.
    function mergeStatic(group) {
        group.updateMatrixWorld(true);
        const buckets = new Map();
        group.traverse((child) => {
            if (!child.isMesh || child.isInstancedMesh || child.isSkinnedMesh) return;
            const g = child.geometry;
            const key = [child.material.uuid, Object.keys(g.attributes).sort().join(), g.index ? 'i' : 'n', child.castShadow].join('|');
            if (!buckets.has(key)) buckets.set(key, []);
            buckets.get(key).push(child);
        });
        const merged = new THREE.Group();
        buckets.forEach((meshes) => {
            const geos = meshes.map((mesh) => { const g = mesh.geometry.clone(); g.applyMatrix4(mesh.matrixWorld); return g; });
            const geo = geos.length > 1 ? mergeGeometries(geos, false) : geos[0];
            if (!geo) { meshes.forEach((mesh) => { const copy = mesh.clone(); copy.matrix.copy(mesh.matrixWorld); copy.matrixAutoUpdate = false; merged.add(copy); }); return; }
            const mesh = new THREE.Mesh(geo, meshes[0].material);
            mesh.castShadow = meshes[0].castShadow;
            mesh.receiveShadow = true;
            mesh.matrixAutoUpdate = false;
            merged.add(mesh);
        });
        return merged;
    }

    // Casca do galpão: paredes de 10 m com janelões e pilares do galpão modular NVIDIA SimReady (CC BY 4.0),
    // convertidos para GLB sem telhado nem treliça. Módulos de 10 m em escala 0,6 (6 m na planta).
    const SHELL = 0.6;
    const SEG = 10 * SHELL;
    function buildShell(wall, windowWall, column, hydrant) {
        const shell = new THREE.Group();
        const glass = new Map();
        const piece = (gltf, x, z, rotY) => {
            const obj = gltf.scene.clone(true);
            obj.scale.setScalar(SHELL);
            obj.position.set(x, 0, z);
            obj.rotation.y = rotY;
            obj.traverse((child) => {
                if (!child.isMesh) return;
                child.castShadow = true;
                child.receiveShadow = true;
                // Vidro dos janelões: luz do dia.
                if (child.material && /eef4f8/i.test(child.material.name || '')) {
                    if (!glass.has(child.material)) {
                        const lit = child.material.clone();
                        lit.emissive = new THREE.Color(0xeaf2f8);
                        lit.emissiveIntensity = 1.3;
                        glass.set(child.material, lit);
                    }
                    child.material = glass.get(child.material);
                    child.castShadow = false;
                }
            });
            shell.add(obj);
        };
        const nx = Math.round((B.maxX - B.minX) / SEG); const nz = Math.round((B.maxZ - B.minZ) / SEG);
        for (let k = 0; k < nx; k += 1) piece(k % 2 ? wall : windowWall, B.minX + k * SEG, B.minZ, 0);
        for (let k = 0; k < nz; k += 1) piece(k % 2 ? windowWall : wall, B.minX, B.minZ + (k + 1) * SEG, Math.PI / 2);
        const c = 0.3;
        piece(hydrant, B.minX + c, B.minZ + c, 0);
        for (let k = 1; k <= nx; k += 1) piece(k % 2 ? column : hydrant, Math.min(B.minX + k * SEG, B.maxX - c), B.minZ + c, 0);
        for (let k = 1; k <= nz; k += 1) piece(k % 2 ? column : hydrant, B.minX + c, Math.min(B.minZ + k * SEG, B.maxZ - c), Math.PI / 2);
        world.add(mergeStatic(shell));
        world.remove(fallbackShell);
    }
    const loadShell = () => Promise.all(['/glbimagens/galpao-parede.glb', '/glbimagens/galpao-parede-janela.glb', '/glbimagens/galpao-pilar.glb', '/glbimagens/galpao-pilar-hidrante.glb'].map((url) => loader.loadAsync(url)))
        .then(([wall, windowWall, column, hydrant]) => buildShell(wall, windowWall, column, hydrant))
        .catch((error) => console.warn('fabrica-sim: casca do galpão indisponível', error));

    const mats = {
        body: new THREE.MeshStandardMaterial({ color: 0xf1f4f7, roughness: 0.55 }),
        blue: new THREE.MeshStandardMaterial({ color: 0x2d6a9a, roughness: 0.45 }),
        dark: new THREE.MeshStandardMaterial({ color: 0x3b4550, roughness: 0.6 }),
        steel: new THREE.MeshStandardMaterial({ color: 0xaab4bc, roughness: 0.35, metalness: 0.5 }),
        glass: new THREE.MeshStandardMaterial({ color: 0x9fc3d9, roughness: 0.1, transparent: true, opacity: 0.55 }),
        yellow: new THREE.MeshStandardMaterial({ color: 0xe6b423, roughness: 0.5 }),
        wood: new THREE.MeshStandardMaterial({ color: 0xc9a16e, roughness: 0.8 }),
        carton: new THREE.MeshStandardMaterial({ color: 0xb98a55, roughness: 0.85 }),
        tank: new THREE.MeshStandardMaterial({ color: 0xd9dee3, roughness: 0.35, metalness: 0.35 })
    };
    const box = (w, h, d, mat, x = 0, y = 0, z = 0) => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
        mesh.position.set(x, y + h / 2, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    };
    const cyl = (r, h, mat, x = 0, y = 0, z = 0, seg = 24) => {
        const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), mat);
        mesh.position.set(x, y + h / 2, z);
        mesh.castShadow = true;
        return mesh;
    };

    function stackLight(group, x, y, z) {
        group.add(cyl(0.035, 0.5, mats.dark, x, y, z, 8));
        const lamps = {};
        [['stopped', 0xef4444], ['warning', 0xf59e0b], ['running', 0x22c55e]].forEach(([key, color], i) => {
            const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.3, transparent: true, opacity: 0.35, emissive: color, emissiveIntensity: 0 });
            const lamp = cyl(0.09, 0.14, mat, x, y + 0.5 + i * 0.15, z, 16);
            group.add(lamp);
            lamps[key] = mat;
        });
        return lamps;
    }

    let benchShared = null;
    const benchMats = () => benchShared || (benchShared = {
        frame: new THREE.MeshStandardMaterial({ color: 0x5b6672, roughness: 0.5, metalness: 0.55 }),
        peg: new THREE.MeshStandardMaterial({ color: 0xc9d0d6, roughness: 0.75 }),
        bin: new THREE.MeshStandardMaterial({ color: 0x1d5fd1, roughness: 0.55 }),
        binY: new THREE.MeshStandardMaterial({ color: 0xe6b423, roughness: 0.55 }),
        tool: new THREE.MeshStandardMaterial({ color: 0x2a323b, roughness: 0.45, metalness: 0.4 }),
        glow: new THREE.MeshStandardMaterial({ color: 0xfff3c4, emissive: 0xffe08a, emissiveIntensity: 1.2, roughness: 0.3 }),
        screen: new THREE.MeshStandardMaterial({ color: 0x0b1b33, emissive: 0x2f6fe0, emissiveIntensity: 0.55, roughness: 0.25 })
    });
    const builders = {
        bench() {
            // Bancada de montagem: estrutura de aço, tampo de madeira, painel de ferramentas, luminária e tablet de apontamento.
            const g = new THREE.Group();
            const { frame, peg, bin, binY, tool, glow, screen } = benchMats();
            [[-1.18, -0.44], [1.18, -0.44], [-1.18, 0.44], [1.18, 0.44]].forEach(([x, z]) => g.add(box(0.07, 0.85, 0.07, frame, x, 0, z)));
            g.add(box(2.42, 0.04, 0.9, frame, 0, 0.16, 0));
            g.add(box(2.5, 0.06, 1.0, mats.wood, 0, 0.85));
            g.add(box(2.3, 0.012, 0.62, mats.dark, 0.05, 0.91, 0.12));
            g.add(box(0.55, 0.62, 0.8, mats.dark, 0.88, 0.2, 0));
            [0.36, 0.56].forEach((y) => g.add(box(0.5, 0.012, 0.012, mats.steel, 0.88, y, 0.41)));
            g.add(box(0.5, 0.3, 0.42, mats.carton, -0.55, 0.2, -0.05));
            // Painel perfurado com ferramentas e caixas de peças.
            [-1.18, 1.18].forEach((x) => g.add(box(0.06, 1.05, 0.06, frame, x, 0.91, -0.47)));
            g.add(box(2.42, 0.78, 0.03, peg, 0, 1.02, -0.47));
            g.add(box(2.42, 0.04, 0.06, frame, 0, 1.94, -0.45));
            g.add(box(1.6, 0.05, 0.1, glow, 0, 1.9, -0.38));
            [[-0.95, 1.52, 0.05, 0.34], [-0.8, 1.48, 0.05, 0.26], [-0.65, 1.55, 0.04, 0.36], [0.62, 1.5, 0.22, 0.05], [0.62, 1.62, 0.18, 0.05]].forEach(([x, y, w, h]) => g.add(box(w, h, 0.03, tool, x, y, -0.44)));
            [-0.32, -0.08, 0.16, 0.4].forEach((x, i) => g.add(box(0.2, 0.13, 0.16, i % 2 ? binY : bin, x, 1.18, -0.38)));
            g.add(box(2.1, 0.02, 0.2, mats.steel, 0, 1.16, -0.38));
            // Peças sobre o tampo e o tablet do apontamento.
            g.add(box(0.45, 0.28, 0.35, mats.carton, -0.75, 0.91, 0.1));
            g.add(box(0.6, 0.04, 0.42, mats.wood, 0.05, 0.92, 0.12));
            g.add(box(0.6, 0.04, 0.42, mats.wood, 0.05, 0.96, 0.12));
            g.add(box(0.04, 0.3, 0.04, mats.dark, 0.75, 0.91, -0.18));
            const tab = box(0.34, 0.24, 0.025, screen, 0.75, 1.16, -0.16);
            tab.rotation.x = -0.35;
            g.add(tab);
            return { group: g, height: 2.0 };
        },
        pallets() {
            const g = new THREE.Group();
            [[-1.4, -1.1], [0, -1.1], [1.4, -1.1], [-1.4, 0.4], [0, 0.4]].forEach(([x, z], i) => {
                g.add(box(1.2, 0.15, 1.0, mats.wood, x, 0, z));
                const layers = 2 + (i % 2);
                for (let l = 0; l < layers; l += 1) g.add(box(1.1, 0.42, 0.9, mats.carton, x, 0.15 + l * 0.44, z));
            });
            return { group: g, height: 1.6, radius: 2.4 };
        }
    };

    const objects = new Map();
    const pickables = [];

    function addObject(item, built) {
        const group = built.group;
        group.position.set(item.x, 0, item.z);
        if (item.rotY) group.rotation.y = item.rotY;
        const k = built.scaled ? 1 : MS;
        group.scale.setScalar(k);
        group.traverse((child) => { if (child.isMesh) { child.userData.itemId = item.id; pickables.push(child); } });
        world.add(group);
        const entry = { item, group, height: built.height * k, radius: (built.radius || 1.8) * k, lamps: null, ring: null, disc: null, pin: null, footprint: (built.footprint || [2.4, 2]).map((v) => v * k) };
        if (built.lightAt) entry.lamps = stackLight(group, ...built.lightAt);
        objects.set(item.id, entry);
        return entry;
    }

    // Bancadas de montagem (sem sensor, sem pino).
    const benches = new THREE.Group();
    [[0.2, 4.4], [5.2, 4.4], [0.2, 7.6], [5.2, 7.6]].forEach(([x, z]) => {
        const b = builders.bench();
        b.group.position.set(x * K, 0, z * K);
        b.group.scale.setScalar(MS);
        benches.add(b.group);
    });
    world.add(mergeStatic(benches));

    // Expedição: o grupo nasce vazio e recebe os paletes do SimReady quando carregarem.
    STOCKS.filter((s) => s.type === 'pallets').forEach((s) => addObject(s, { group: new THREE.Group(), height: 1.0, radius: 1.5, footprint: [2.2, 2.1] }));

    // Pinos (DOM) presos acima de cada objeto, como FactoryCard.
    function pinMarkup(entry) {
        const { item } = entry;
        const isStock = !item.state;
        if (isStock) {
            const tone = item.critical ? 'alert' : 'quiet';
            const sub = item.critical ? `<span class="fpin__sub fpin__sub--state">${t('critical')}</span>` : '';
            return `<button type="button" class="fpin fpin--${tone} st-${item.critical ? 'stopped' : 'stock'}" data-fx-pin="${item.id}" aria-label="${item.code}, ${item.qty}">
                <span class="fpin__row">${glyph(STOCK_GLYPH)}<span class="fpin__code">${item.code}</span><span class="fpin__val">${item.qty}</span></span>${sub}</button><span class="fpin__leader"></span>`;
        }
        const st = STATES[item.state];
        const oeeLayer = view.layer === 'oee';
        const tone = oeeLayer ? 'quiet' : st.emphasis;
        const loud = tone !== 'quiet';
        const value = oeeLayer
            ? `<span class="fpin__val fpin__val--oee b-${bucket(item.oee)}">${item.oee}%</span>`
            : loud ? '' : `<span class="fpin__val"><span class="fpin__unit">OEE </span>${item.oee}%</span>`;
        const sub = loud ? `<span class="fpin__sub fpin__sub--state">${st.label[lang()]} · ${elapsed(item.minutes)}</span>` : '';
        const lead = loud ? glyph(st.glyph) : '<span class="fpin__dotmark fpin__dotmark--sm"></span>';
        const aria = `${item.code}, ${st.label[lang()]}${loud ? `, ${elapsed(item.minutes)}` : ''}, OEE ${item.oee}%`;
        const tap = !view.touched && !oeeLayer && item.id === FIRST_STOP ? `<span class="hv-tap-hint fx-tap-hint" aria-hidden="true">${t(coarse ? 'tapPinTouch' : 'tapPin')}</span>` : '';
        return `${tap}<button type="button" class="fpin fpin--${tone} st-${item.state}${st.pulse && !oeeLayer ? ' fpin--pulse' : ''}${view.selected === item.id ? ' fpin--selected' : ''}" data-fx-pin="${item.id}" aria-label="${aria}">
            <span class="fpin__row">${lead}<span class="fpin__code">${item.code}</span>${value}</span>${sub}</button><span class="fpin__leader${loud ? ` st-${item.state}` : ''}"></span>`;
    }

    function ensurePin(entry) {
        if (entry.pin) return;
        const el = document.createElement('div');
        el.className = 'fcard-anchor';
        const obj = new CSS2DObject(el);
        obj.position.set(entry.item.x, entry.height + 0.35, entry.item.z);
        obj.center.set(0.5, 1);
        world.add(obj);
        entry.pin = el;
    }

    const ringMat = (color) => new THREE.MeshBasicMaterial({ color, transparent: true, depthWrite: false, side: THREE.DoubleSide, toneMapped: false });
    function ringGeometry(radius, dashed) {
        if (!dashed) return new THREE.RingGeometry(radius - 0.16, radius, 64);
        const geos = [];
        const count = 12; const step = (Math.PI * 2) / count;
        for (let i = 0; i < count; i += 1) geos.push(new THREE.RingGeometry(radius - 0.16, radius, 6, 1, i * step, step * 0.6));
        const merged = new THREE.BufferGeometry();
        const pos = []; const idx = [];
        geos.forEach((geo) => {
            const base = pos.length / 3;
            pos.push(...geo.getAttribute('position').array);
            geo.getIndex().array.forEach((v) => idx.push(v + base));
            geo.dispose();
        });
        merged.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        merged.setIndex(idx);
        return merged;
    }

    function stateColor(item) {
        if (!item.state) return item.critical ? (isDark() ? '#F2796F' : '#B42318') : (isDark() ? '#9AA8B8' : '#5A6876');
        return STATES[item.state][isDark() ? 'dark' : 'light'];
    }

    function refreshLabels() {
        if (paintedLang !== lang()) { paintedLang = lang(); SECTORS.forEach(paintSector); }
        objects.forEach((entry) => {
            ensurePin(entry);
            entry.pin.innerHTML = pinMarkup(entry);
            entry.pin.classList.toggle('fcard-anchor--dim', !matchesFilter(entry.item) && Boolean(entry.item.state || view.filters.size));
            // Lâmpada da torre: só a do estado atual acende.
            if (entry.glbLamps) {
                const on = LAMP[entry.item.state];
                Object.entries(entry.glbLamps).forEach(([name, mat]) => {
                    const lit = name === on;
                    mat.color.copy(mat.userData.base).multiplyScalar(lit ? 1 : 0.28);
                    mat.emissive = lit ? mat.userData.base.clone() : new THREE.Color(0x000000);
                    mat.emissiveIntensity = lit ? 1.6 : 0;
                });
            }
            if (entry.lamps) {
                const lampKey = entry.item.state === 'stopped' ? 'stopped' : entry.item.state === 'running' ? 'running' : 'warning';
                Object.entries(entry.lamps).forEach(([key, mat]) => {
                    const on = key === lampKey;
                    mat.opacity = on ? 1 : 0.3;
                    mat.emissiveIntensity = on ? 0.9 : 0;
                });
            }
            // Anel: na seleção (cor e traço do estado) e, na camada OEE, um disco suave em todas.
            if (entry.ring) { world.remove(entry.ring); entry.ring = null; }
            if (entry.disc) { world.remove(entry.disc); entry.disc = null; }
            if (view.selected === entry.item.id) {
                const ring = new THREE.Mesh(ringGeometry(entry.radius, entry.item.state === 'stopped'), ringMat(stateColor(entry.item)));
                ring.rotation.x = -Math.PI / 2;
                ring.position.set(entry.item.x, 0.03, entry.item.z);
                world.add(ring);
                entry.ring = ring;
            }
            if (view.layer === 'oee' && entry.item.state) {
                const color = BUCKET_COLOR[bucket(entry.item.oee)][isDark() ? 1 : 0];
                const disc = new THREE.Mesh(new THREE.CircleGeometry(entry.radius, 48), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.22, depthWrite: false }));
                disc.rotation.x = -Math.PI / 2;
                disc.position.set(entry.item.x, 0.022, entry.item.z);
                world.add(disc);
                entry.disc = disc;
            }
        });
    }

    // Câmera isométrica com giro limitado; roda do mouse só com Ctrl para não prender a rolagem da página.
    const gestureSurface = root.querySelector('.fx-scene');
    const controls = new OrbitControls(camera, gestureSurface);
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minPolarAngle = 0.35;
    controls.maxPolarAngle = Math.PI / 2 - 0.12;
    controls.screenSpacePanning = true;
    controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.PAN, RIGHT: THREE.MOUSE.PAN };
    // Interação direta no celular e desktop; o primeiro gesto interrompe o passeio cinema.
    // Fora da tela cheia o CSS (pan-y) entrega a rolagem vertical ao navegador: só o arrasto lateral gira.
    let tour = null;
    // Celular fora da tela cheia: só cinema; desktop interage também na página.
    const interactive = () => view.full || !mobileUI;
    function applyControls() {
        controls.enabled = !tour && interactive();
        controls.enableZoom = coarse;
        // Como num mapa: um dedo arrasta a planta, pinça aproxima e dois dedos giram (a legenda diz o mesmo).
        controls.touches = { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_ROTATE };
    }
    applyControls();
    // O CSS mantém os gestos da cena; a rolagem da página continua fora dela.
    gestureSurface.style.touchAction = '';
    const BASE_DIR = new THREE.Vector3(1, 0.86, 1.12).normalize();
    camera.position.copy(BASE_DIR.clone().multiplyScalar(80));
    camera.lookAt(0, 0, 0);

    gestureSurface.addEventListener('wheel', (event) => {
        if (!(event.ctrlKey || event.metaKey || view.full)) return;
        event.preventDefault();
        zoomBy(event.deltaY < 0 ? 1.12 : 1 / 1.12);
    }, { passive: false });

    let tween = null;
    function animateTo(target, zoom, duration = reduceMotion ? 0 : 650) {
        const fromT = controls.target.clone();
        const fromP = camera.position.clone();
        const offset = fromP.clone().sub(fromT);
        const fromZ = camera.zoom;
        const start = performance.now();
        tween = (now) => {
            const k = duration ? Math.min(1, (now - start) / duration) : 1;
            const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
            controls.target.lerpVectors(fromT, target, e);
            camera.position.copy(controls.target).add(offset);
            camera.zoom = fromZ + (zoom - fromZ) * e;
            camera.updateProjectionMatrix();
            if (k >= 1) tween = null;
        };
    }

    function insets() {
        const wide = root.clientWidth >= 1100;
        return {
            left: wide && view.nowOpen ? 332 : 0,
            right: wide && view.selected ? 412 : 0,
            top: 64,
            // Card em folha inferior (quadro estreito): a máquina fica centrada na área acima dele.
            bottom: !wide && view.selected ? (root.querySelector('.fx-drawer')?.offsetHeight || 0) + 24 : 84
        };
    }

    // Zoom que enquadra o chão inteiro na área livre (fora dos painéis).
    function fitZoom() {
        if (!root.clientWidth || !root.clientHeight) return camera.zoom || 1;
        const pad = insets();
        const w = Math.max(200, root.clientWidth - pad.left - pad.right);
        const h = Math.max(200, root.clientHeight - pad.top - pad.bottom);
        camera.updateMatrixWorld();
        const inv = camera.matrixWorldInverse;
        let minX = Infinity; let maxX = -Infinity; let minY = Infinity; let maxY = -Infinity;
        [[B.minX, B.minZ], [B.maxX, B.minZ], [B.minX, B.maxZ], [B.maxX, B.maxZ]].forEach(([x, z]) => {
            [0, 1.9].forEach((y) => {
                const p = new THREE.Vector3(x, y, z).applyMatrix4(inv);
                minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
            });
        });
        const frustumW = camera.right - camera.left;
        const frustumH = camera.top - camera.bottom;
        const zx = (frustumW * (w / root.clientWidth)) / (maxX - minX);
        const zy = (frustumH * (h / root.clientHeight)) / (maxY - minY);
        return Math.min(zx, zy) * 0.96;
    }

    // Desloca o alvo para o objeto ficar no centro da área livre (mesma ideia de computeViewInsets).
    function offsetTarget(point, zoom) {
        const pad = insets();
        const unitsPerPx = (camera.right - camera.left) / zoom / Math.max(1, root.clientWidth);
        const dx = ((pad.left - pad.right) / 2) * unitsPerPx;
        const dy = ((pad.top - pad.bottom) / 2) * unitsPerPx;
        const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
        const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
        return point.clone().sub(right.multiplyScalar(dx)).add(up.multiplyScalar(dy));
    }

    function frame(animate) {
        showingAll = true;
        const zoom = fitZoom();
        const target = offsetTarget(new THREE.Vector3(0, 0, 0), zoom);
        if (animate) animateTo(target, zoom);
        else {
            controls.target.copy(target);
            camera.position.copy(target).add(BASE_DIR.clone().multiplyScalar(80));
            camera.zoom = zoom;
            camera.updateProjectionMatrix();
        }
    }

    // Abertura: perto da Injeção, com as injetoras grandes na tela. O botão de enquadrar mostra a fábrica toda.
    const HOME = new THREE.Vector3(2.1, 0.7, -4.9);
    let showingAll = false;
    function home(animate) {
        showingAll = false;
        const zoom = fitZoom() * (root.clientWidth < 700 ? 2.8 : 2.25);
        const target = offsetTarget(HOME.clone(), zoom);
        if (animate) animateTo(target, zoom);
        else {
            controls.target.copy(target);
            camera.position.copy(target).add(BASE_DIR.clone().multiplyScalar(80));
            camera.zoom = zoom;
            camera.updateProjectionMatrix();
        }
    }

    // Passeio automático (cinema): sem botão. Começa sozinho, para no primeiro toque e volta depois de um tempo parado.
    const TOUR = [
        { at: [2.1, 0.7, -5.2], zoom: 2.5 }, { at: [-9.1, 0.7, -4.8], zoom: 2.3 }, { at: [-9.0, 0.5, 4.6], zoom: 2.4 },
        { at: [2.2, 0.5, 4.4], zoom: 2.5 }, { at: [10.9, 0.9, -1.4], zoom: 2.1 }, { at: [0, 0.6, 0], zoom: 1.05 }
    ];
    // Cinema mais perto das máquinas; em tela estreita (celular) ainda mais e sem a vista geral.
    const narrow = () => root.clientWidth < 720;
    const tourStops = () => (narrow() ? TOUR.slice(0, -1) : TOUR);
    const tourZoom = (zoom) => zoom * (narrow() ? 1.7 : 1);
    const BASE_ANGLE = Math.atan2(BASE_DIR.x, BASE_DIR.z);
    const BASE_PITCH = Math.asin(BASE_DIR.y);
    const IDLE_RESUME = 18000;
    // Celular: depois de um tempo sem toque, congela a cena (para de renderizar) para poupar bateria.
    const IDLE_SLEEP = coarse ? 60000 : Infinity;
    let lastInput = 0;
    let awakeAt = 0;
    function startTour() {
        if (reduceMotion || tour || !root.clientWidth) return;
        tween = null;
        controls.enabled = false;
        const dir = camera.position.clone().sub(controls.target);
        tour = { stop: 0, time: 0, clock: 0, angle: Math.atan2(dir.x, dir.z), point: new THREE.Vector3(...tourStops()[0].at), zoom: camera.zoom };
    }
    function stopTour() {
        lastInput = performance.now();
        if (!tour) return;
        tour = null;
        applyControls();
    }
    // Em tela cheia o celular também gira com um dedo e aproxima com pinça; no computador a roda aproxima sem Ctrl.
    // Entrar interrompe o cinema e libera os controles; sair volta direto ao cinema.
    function setFull(on) {
        if (on || !mobileUI) stopTour();
        else { tour = null; lastInput = 0; awakeAt = performance.now(); startTour(); }
        applyControls();
    }
    function tourStep(dt) {
        const stops = tourStops();
        const stop = stops[tour.stop % stops.length];
        tour.time += dt;
        tour.clock += dt;
        if (tour.time > 8.5) { tour.time = 0; tour.stop = (tour.stop + 1) % stops.length; }
        const k = 1 - Math.pow(0.02, dt);
        tour.point.lerp(new THREE.Vector3(...stop.at), k * 0.6);
        tour.zoom += (fitZoom() * tourZoom(stop.zoom) - tour.zoom) * k * 0.6;
        // Balanço lento em volta do setor; não dá a volta inteira porque as paredes do fundo taparia a vista.
        const wanted = BASE_ANGLE + Math.sin(tour.clock * 0.11) * 0.55;
        tour.angle += (wanted - tour.angle) * k;
        const pitch = BASE_PITCH + Math.sin(tour.clock * 0.07) * 0.06;
        const offset = new THREE.Vector3(Math.sin(tour.angle) * Math.cos(pitch), Math.sin(pitch), Math.cos(tour.angle) * Math.cos(pitch)).multiplyScalar(80);
        const target = offsetTarget(tour.point, tour.zoom);
        controls.target.copy(target);
        camera.position.copy(target).add(offset);
        camera.lookAt(target);
        camera.zoom = tour.zoom;
        camera.updateProjectionMatrix();
    }
    // Captura: o passeio para antes de os controles receberem o toque, senão o primeiro gesto se perde.
    ['pointerdown', 'wheel', 'keydown', 'touchstart'].forEach((type) => root.addEventListener(type, () => { if (interactive()) stopTour(); }, { passive: true, capture: true }));
    // Arrastar também conta como uso: o passeio não volta no meio de um gesto longo.
    root.addEventListener('pointermove', (event) => { if (interactive() && (event.buttons || event.pointerType === 'touch')) lastInput = performance.now(); }, { passive: true });

    function zoomBy(factor) {
        const zoom = Math.max(0.3, Math.min(camera.zoom * factor, fitZoom() * 5.5));
        animateTo(controls.target.clone(), zoom, 250);
    }

    function focus(id) {
        stopTour();
        refreshLabels();
        if (!id) { home(true); return; }
        const entry = objects.get(id);
        if (!entry) return;
        const zoom = Math.max(camera.zoom, fitZoom() * 2.1);
        animateTo(offsetTarget(new THREE.Vector3(entry.item.x, entry.height * 0.4, entry.item.z), zoom), zoom);
    }

    // Clique na cena: máquina seleciona; chão vazio fecha o detalhe (sem confundir com arrasto).
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downAt = null;
    let downPin = null;
    let suppressClickUntil = 0;
    const activePointers = new Set();
    // Gesto novo cancela a animação de câmera em curso (senão ela devolve a câmera e o arrasto parece travado).
    gestureSurface.addEventListener('pointerdown', (event) => {
        activePointers.add(event.pointerId);
        downAt = activePointers.size === 1 ? [event.clientX, event.clientY] : null;
        downPin = downAt ? event.target.closest('[data-fx-pin]')?.dataset.fxPin : null;
        tween = null;
    });
    gestureSurface.addEventListener('pointercancel', (event) => { activePointers.delete(event.pointerId); downAt = null; downPin = null; });
    gestureSurface.addEventListener('pointermove', (event) => {
        if (downAt && Math.hypot(event.clientX - downAt[0], event.clientY - downAt[1]) > 6) {
            downAt = null; downPin = null; suppressClickUntil = performance.now() + 350;
        }
    });
    gestureSurface.addEventListener('click', (event) => {
        if (event.detail > 0 && performance.now() < suppressClickUntil) { event.preventDefault(); event.stopPropagation(); }
    }, { capture: true });
    // Toque curto seleciona; arrastar e pinçar só movimentam a câmera.
    gestureSurface.addEventListener('pointerup', (event) => {
        const multiTouch = activePointers.size > 1;
        activePointers.delete(event.pointerId);
        if (multiTouch || !downAt || Math.hypot(event.clientX - downAt[0], event.clientY - downAt[1]) > 6) {
            downAt = null; downPin = null; suppressClickUntil = performance.now() + 350; return;
        }
        downAt = null;
        suppressClickUntil = performance.now() + 350;
        if (!interactive()) { downPin = null; openFull(); return; }
        if (downPin) { select(downPin); downPin = null; return; }
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(pickables, false)[0];
        if (hit) select(hit.object.userData.itemId);
        else if (view.selected) select(null);
    });
    renderer.domElement.addEventListener('pointermove', (event) => {
        if (coarse || event.buttons) return;
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
        raycaster.setFromCamera(pointer, camera);
        renderer.domElement.style.cursor = raycaster.intersectObjects(pickables, false).length ? 'pointer' : '';
    });

    function applyTheme() {
        scene.background = new THREE.Color(palette().bg);
        refreshLabels();
        renderHud();
    }

    function resize() {
        const w = root.clientWidth; const h = root.clientHeight;
        if (!w || !h) return;
        const aspect = w / h;
        const S = 12;
        camera.left = -S * aspect; camera.right = S * aspect; camera.top = S; camera.bottom = -S;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
        labels.setSize(w, h);
    }

    const mixer = new THREE.AnimationMixer(world);
    const loader = new GLTFLoader();
    // operador.glb vem comprimido com Draco, como no produto.
    const draco = new DRACOLoader();
    draco.setWorkerLimit(coarse ? 2 : 4);
    draco.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/draco/gltf/');
    loader.setDRACOLoader(draco);
    loadShell();

    resize();
    applyTheme();
    let farZoom = fitZoom();
    controls.minZoom = farZoom * 0.5;
    controls.maxZoom = farZoom * 5.5;
    home(false);
    new ResizeObserver(() => { resize(); farZoom = fitZoom(); controls.minZoom = farZoom * 0.5; controls.maxZoom = farZoom * 5.5; if (!tween && !tour) (showingAll ? frame : home)(false); }).observe(root);

    // Nome sobre a cabeça de cada pessoa (operador na máquina, montagem e quem anda pelos corredores).
    function nameTag(person, name, role) {
        const el = document.createElement('div');
        el.className = 'fx-name';
        el.innerHTML = role ? `${esc(name)}<small>${esc(loc(role))}</small>` : esc(name);
        const tag = new CSS2DObject(el);
        tag.position.set(0, 1.42 / person.scale.y, 0);
        tag.center.set(0.5, 1);
        person.add(tag);
        return tag;
    }

    // Operador: o mesmo GLB da Fábrica 3D do produto, com 1,2 m (1,75 m na escala 0,68 das máquinas).
    const ACTIVITY = { running: 'Operando', warning: 'Operando', stopped: 'Aguardando', setup: 'Manutencao', maintenance: 'Manutencao' };
    function person(template) {
        const body = SkeletonUtils.clone(template);
        body.updateWorldMatrix(true, true);
        const box3 = new THREE.Box3().setFromObject(body);
        body.scale.multiplyScalar(1.2 / Math.max(0.01, box3.max.y - box3.min.y));
        body.traverse((child) => { if (child.isMesh) { child.castShadow = true; child.frustumCulled = false; } });
        world.add(body);
        return body;
    }
    function play(body, clips, name, seed) {
        const clip = THREE.AnimationClip.findByName(clips, name) || THREE.AnimationClip.findByName(clips, 'Parado');
        if (!clip) return null;
        const action = mixer.clipAction(clip, body);
        action.play();
        action.time = seed * clip.duration;
        return action;
    }
    function placeOperator(template, clips, entry, seed) {
        const body = person(template);
        // Fica no posto de comando da máquina, olhando para ela.
        const [ox, oz] = entry.spot;
        body.position.set(entry.item.x + ox, 0, entry.item.z + oz);
        body.rotation.y = Math.atan2(-ox * 0.35, -oz) + (entry.turn || 0);
        play(body, clips, ACTIVITY[entry.item.state], seed);
        nameTag(body, entry.item.operator);
    }

    // Caminhada procedural para o rig do operador (22 ossos), a partir da pose "Parado".
    // Cada osso gira em torno do eixo lateral do CORPO (espaço do modelo), levado para o espaço do pai:
    // assim a perna balança reta para frente e para trás, sem torcer pelo "roll" de cada osso.
    function walkClip(template, clips) {
        const duration = 1.1;
        const bones = {};
        template.traverse((o) => { if (o.isBone) bones[o.name] = o; });
        const probe = new THREE.AnimationMixer(template);
        const idle = THREE.AnimationClip.findByName(clips, 'Parado');
        if (idle) { probe.clipAction(idle).play(); probe.update(0); }
        template.updateMatrixWorld(true);
        const rootInv = template.getWorldQuaternion(new THREE.Quaternion()).invert();
        const rest = {}; const parent = {};
        Object.entries(bones).forEach(([n, b]) => {
            rest[n] = { q: b.quaternion.clone(), p: b.position.clone() };
            parent[n] = rootInv.clone().multiply(b.parent ? b.parent.getWorldQuaternion(new THREE.Quaternion()) : new THREE.Quaternion());
        });
        probe.stopAllAction();
        probe.uncacheRoot(template);
        const times = [];
        for (let i = 0; i <= 24; i += 1) times.push((i / 24) * duration);
        const LAT = new THREE.Vector3(1, 0, 0); const UP = new THREE.Vector3(0, 1, 0);
        const tracks = [];
        const track = (name, fn) => {
            if (!bones[name]) return;
            const pm = parent[name]; const pmInv = pm.clone().invert();
            const values = [];
            times.forEach((time) => {
                let delta = new THREE.Quaternion();
                fn((time / duration) * Math.PI * 2).forEach(([axis, angle]) => { delta = new THREE.Quaternion().setFromAxisAngle(axis, angle).multiply(delta); });
                const q = pmInv.clone().multiply(delta).multiply(pm).multiply(rest[name].q);
                values.push(q.x, q.y, q.z, q.w);
            });
            tracks.push(new THREE.QuaternionKeyframeTrack(`${name}.quaternion`, times, values));
        };
        // Ângulo negativo no eixo lateral leva o membro para frente.
        const hip = (p) => 0.04 + 0.38 * Math.sin(p);
        const knee = (p) => 0.12 + 0.72 * Math.pow(Math.max(0, Math.cos(p + 0.15)), 1.6);
        const ankle = (p) => 0.22 * Math.sin(p - 0.9);
        [['L', 0], ['R', Math.PI]].forEach(([side, off]) => {
            track(`thigh${side}`, (p) => [[LAT, -hip(p + off)]]);
            track(`shin${side}`, (p) => [[LAT, knee(p + off)]]);
            track(`foot${side}`, (p) => [[LAT, -ankle(p + off)]]);
            track(`upper_arm${side}`, (p) => [[LAT, 0.36 * Math.sin(p + off)]]);
            track(`forearm${side}`, (p) => [[LAT, -(0.28 + 0.12 * Math.sin(p + off))]]);
        });
        track('hips', (p) => [[UP, 0.07 * Math.sin(p)]]);
        track('spine', (p) => [[LAT, -0.025], [UP, -0.042 * Math.sin(p)]]);
        track('chest', (p) => [[UP, -0.042 * Math.sin(p)]]);
        track('head', (p) => [[UP, 0.035 * Math.sin(p)]]);
        Object.keys(bones).forEach((n) => {
            if (!tracks.some((t) => t.name === `${n}.quaternion`)) tracks.push(new THREE.QuaternionKeyframeTrack(`${n}.quaternion`, [0], rest[n].q.toArray()));
        });
        if (bones.hips) {
            // Quadril desce um pouco no apoio duplo (duas vezes por passada).
            const h = rest.hips.p; const unit = h.length() > 5 ? 100 : 1;
            const v = [];
            times.forEach((time) => { const p = (time / duration) * Math.PI * 2; v.push(h.x, h.y - 0.025 * unit * (0.5 + 0.5 * Math.cos(2 * p)), h.z); });
            tracks.push(new THREE.VectorKeyframeTrack('hips.position', times, v));
        }
        return new THREE.AnimationClip('Caminhar', duration, tracks);
    }

    // Objetos do SimReady: porta-paletes, paletes com caixas, paleteira e cavaletes.
    const PROP = 0.68;
    function loadProps() {
        const names = ['porta-pallet', 'pallet-caixas-a', 'pallet-caixas-b', 'paleteira', 'cavalete-piso'];
        Promise.all(names.map((n) => loader.loadAsync(`/glbimagens/${n}.glb`))).then((list) => {
            const g = Object.fromEntries(names.map((n, i) => [n, list[i]]));
            const loose = new THREE.Group();
            const matCache = new Map();
            const matOf = (source) => {
                if (!matCache.has(source)) {
                    const m = source.clone();
                    m.vertexColors = true; m.roughness = 0.75; m.metalness = 0.05;
                    matCache.set(source, m);
                }
                return matCache.get(source);
            };
            const put = (name, x, z, rotY = 0, parent = loose) => {
                const obj = g[name].scene.clone(true);
                obj.scale.setScalar(PROP);
                obj.position.set(x, 0, z);
                obj.rotation.y = rotY;
                obj.traverse((child) => {
                    if (!child.isMesh) return;
                    child.castShadow = true; child.receiveShadow = true;
                    if (child.material) child.material = matOf(child.material);
                });
                parent.add(obj);
                return obj;
            };
            put('porta-pallet', 11.0, -2.25, Math.PI / 2);
            put('porta-pallet', 13.6, 3.3, 0);
            // Paletes da EXP-01 nas vagas brancas; os meshes viram clicáveis como a máquina.
            const exp = objects.get('exp');
            if (exp) {
                [['pallet-caixas-a', -0.6, -0.55], ['pallet-caixas-b', 0.6, -0.55], ['pallet-caixas-b', -0.6, 0.65], ['pallet-caixas-a', 0.6, 0.65]].forEach(([n, dx, dz], i) => {
                    const obj = put(n, dx, dz, i % 2 ? Math.PI / 2 : 0, exp.group);
                    obj.scale.setScalar(PROP / exp.group.scale.x);
                    obj.position.set(dx / exp.group.scale.x, 0, dz / exp.group.scale.x);
                    obj.traverse((child) => { if (child.isMesh) { child.userData.itemId = 'exp'; pickables.push(child); } });
                });
            }
            put('paleteira', 9.4, 6.9, 0.4);
            put('cavalete-piso', -5.0, 2.6, 0.5);
            put('cavalete-piso', 7.2, -1.35, -0.3);
            world.add(mergeStatic(loose));
        }).catch((error) => console.warn('fabrica-sim: objetos SimReady indisponíveis', error));
    }
    // Pessoas andando pelos corredores (ida e volta), com nome e função.
    // Metros percorridos por segundo com o clipe em velocidade 1 (evita o pé "patinando").
    const STRIDE = 0.86;
    const walkers = [];
    function spawnWalker(template, walk, { path, speed, phase, name, role }) {
        const body = person(template);
        const action = mixer.clipAction(walk, body);
        action.play();
        action.timeScale = speed / STRIDE;
        action.time = (phase * 0.37) % walk.duration;
        nameTag(body, name, role);
        const pts = path.map(([x, z]) => new THREE.Vector3(x, 0, z));
        const seg = []; let length = 0;
        for (let i = 1; i < pts.length; i += 1) { const d = pts[i].distanceTo(pts[i - 1]); seg.push(d); length += d; }
        walkers.push({ body, points: pts, seg, length, speed, dist: phase * length, yaw: null });
    }
    function updateWalkers(dt) {
        walkers.forEach((w) => {
            w.dist += w.speed * dt;
            let travel = w.dist % (w.length * 2);
            const forward = travel <= w.length;
            if (!forward) travel = w.length * 2 - travel;
            let index = 0;
            while (index < w.seg.length - 1 && travel > w.seg[index]) { travel -= w.seg[index]; index += 1; }
            const from = w.points[index]; const to = w.points[index + 1];
            const f = travel / (w.seg[index] || 1);
            w.body.position.set(from.x + (to.x - from.x) * f, 0, from.z + (to.z - from.z) * f);
            const facing = Math.atan2(to.x - from.x, to.z - from.z) + (forward ? 0 : Math.PI);
            // Vira na esquina com suavidade em vez de girar de uma vez.
            if (w.yaw == null) w.yaw = facing;
            let diff = facing - w.yaw;
            diff = Math.atan2(Math.sin(diff), Math.cos(diff));
            w.yaw += diff * Math.min(1, dt * 7);
            w.body.rotation.y = w.yaw;
        });
    }

    // Máquinas: os mesmos GLB do catálogo de modelos 3D do produto, na escala da planta.
    const SCALE = 0.68;
    const LAMP = { running: 'Sinaleiro_Verde', stopped: 'Sinaleiro_Vermelho', warning: 'Sinaleiro_Ambar', setup: 'Sinaleiro_Ambar', maintenance: 'Sinaleiro_Ambar' };
    const MODELS = {
        saw: { url: '/glbimagens/seccionadora.glb', rot: 0, cycle: 'Ciclo_Seccionadora', spot: [1.0, 0.62] },
        nesting: { url: '/glbimagens/cnc-nesting.glb', rot: 0, cycle: 'Ciclo_CNC_Nesting', spot: [1.0, 0.35] },
        drill: { url: '/glbimagens/furadeira-cnc.glb', rot: Math.PI / 2, cycle: 'Ciclo_Furadeira', spot: [-0.2, 0.62] },
        edge: { url: '/glbimagens/coladeira-borda.glb', rot: Math.PI / 2, cycle: 'Ciclo_Coladeira', spot: [-0.35, 0.6] },
        injector: { url: '/glbimagens/injetora.glb', rot: -Math.PI / 2, cycle: 'Ciclo_Injecao', open: 'Abrir_Porta', spot: [0.15, 0.62] },
        labeler: { url: '/glbimagens/etiquetadora.glb', rot: 0, cycle: 'Ciclo_Etiquetadora', spot: [0.1, 0.62] },
        tank: { url: '/glbimagens/silo.glb', rot: 0 }
    };
    function fitModel(gltf, spec) {
        const model = gltf.scene.clone(true);
        model.rotation.y = spec.rot;
        model.scale.setScalar(SCALE);
        const holder = new THREE.Group();
        holder.add(model);
        holder.updateWorldMatrix(true, true);
        const fitted = new THREE.Box3().setFromObject(model);
        const center = fitted.getCenter(new THREE.Vector3());
        model.position.set(-center.x, -fitted.min.y, -center.z);
        const size = fitted.getSize(new THREE.Vector3());
        // Sinaleiro próprio do modelo: cada máquina ganha cópias dos materiais para acender só a sua cor.
        const lamps = {};
        model.traverse((child) => {
            if (!child.isMesh) return;
            child.castShadow = true;
            child.receiveShadow = true;
            const name = child.material && child.material.name;
            if (name && name.startsWith('Sinaleiro_')) {
                if (!lamps[name]) {
                    const mat = child.material.clone();
                    mat.userData.base = mat.color.clone();
                    lamps[name] = mat;
                }
                child.material = lamps[name];
            }
        });
        return { model, holder, size, lamps };
    }
    const loadModel = (url) => loader.loadAsync(url);
    const want = [...new Set([...MACHINES.map((m) => m.type), 'tank'])];
    let sceneReady = false;
    const loadOperators = () => loadModel('/glbimagens/operador-mestti.glb').then(async (operador) => {
            for (const [i, m] of MACHINES.entries()) {
                placeOperator(operador.scene, operador.animations, objects.get(m.id), (i * 0.37) % 1);
                if (i % 3 === 2) await new Promise(resolve => setTimeout(resolve, 0));
            }
            // Montagem: duas pessoas nas bancadas.
            [[0.2, 4.4, 'Lia'], [5.2, 7.6, 'Tomás']].forEach(([x, z, name], i) => {
                const body = person(operador.scene);
                body.position.set(x * K, 0, z * K + 0.62);
                body.rotation.y = Math.PI;
                play(body, operador.animations, 'Operando', 0.3 + i * 0.4);
                nameTag(body, name);
            });
            const walk = walkClip(operador.scene, operador.animations);
            const ROLE = {
                quality: L('Qualidade', 'Quality', 'Calidad'), logistics: L('Logística', 'Logistics', 'Logística'),
                maintenance: L('Manutenção', 'Maintenance', 'Mantenimiento'), planning: L('PCP', 'Planning', 'Planificación')
            };
            [
                { path: [[-12.8, 0.72], [7.4, 0.72]], speed: 0.82, phase: 0.15, name: 'Ana', role: ROLE.quality },
                { path: [[7.8, -7.2], [7.8, -0.6], [13.4, -0.6]], speed: 0.9, phase: 0.6, name: 'Lucas', role: ROLE.logistics },
                { path: [[-3.85, -7.3], [-3.85, 7.3]], speed: 0.78, phase: 0.35, name: 'Bia', role: ROLE.maintenance },
                { path: [[-9.4, -7.4], [-9.4, -1.6]], speed: 0.72, phase: 0.8, name: 'Jorge', role: ROLE.planning }
            ].forEach((w) => spawnWalker(operador.scene, walk, w));
            updateWalkers(0);
    }).catch((error) => console.warn('fabrica-sim: pessoas indisponíveis', error));
    const ready = Promise.all(want.map((type) => loadModel(MODELS[type].url).then((gltf) => [type, gltf])));
    ready
        .then(async (loaded) => {
            const gltfs = Object.fromEntries(loaded);
            for (const [index, item] of [...MACHINES, ...STOCKS.filter((s) => s.type === 'tank')].entries()) {
                const spec = MODELS[item.type];
                const gltf = gltfs[item.type];
                const { model, holder, size, lamps } = fitModel(gltf, spec);
                const entry = addObject(item, { group: holder, height: size.y, radius: Math.max(size.x, size.z) * 0.55 + 0.3, scaled: true, footprint: [size.x, size.z] });
                entry.glbLamps = lamps;
                if (!item.state) continue;
                entry.spot = [size.x / 2 * spec.spot[0], size.z / 2 + spec.spot[1]];
                const cycle = spec.cycle && THREE.AnimationClip.findByName(gltf.animations, spec.cycle);
                if (cycle && (item.state === 'running' || item.state === 'warning')) {
                    const action = mixer.clipAction(cycle, model);
                    action.play();
                    action.time = (index * 2.3) % cycle.duration;
                    if (item.state === 'warning') entry.stutter = action;
                }
                // Em setup a injetora fica com a porta aberta (troca de molde).
                const open = spec.open && THREE.AnimationClip.findByName(gltf.animations, spec.open);
                if (open && item.state === 'setup') {
                    const action = mixer.clipAction(open, model);
                    action.setLoop(THREE.LoopOnce, 1);
                    action.clampWhenFinished = true;
                    action.play();
                }
                if (index % 3 === 2) await new Promise(resolve => setTimeout(resolve, 0));
            }
            refreshLabels();
            setTimeout(() => { if (!lastInput && !view.full) startTour(); }, 3200);
        })
        .then(() => {
            refreshLabels();
            sceneReady = true;
            awakeAt = performance.now();
        })
        .catch((error) => { console.warn('fabrica-sim: modelos GLB indisponíveis', error); fail(); });

    const PRIORITY = { stopped: 4, maintenance: 3, warning: 3, setup: 2, running: 1 };
    function resolveCollisions() {
        const host = root.getBoundingClientRect();
        const pins = [];
        objects.forEach((entry) => {
            const el = entry.pin;
            if (!el || !el.firstElementChild) return;
            const r = el.getBoundingClientRect();
            if (!el.classList.contains('fcard-anchor--dot')) entry.full = [r.width, r.height];
            if (!entry.full) return;
            const cx = r.left + r.width / 2 - host.left;
            const bottom = r.bottom - host.top;
            const [w, h] = entry.full;
            const item = entry.item;
            const prio = view.selected === item.id ? 9 : item.critical ? 4 : PRIORITY[item.state] || 1;
            pins.push({ el, prio, box: [cx - w / 2 - 3, bottom - h - 3, cx + w / 2 + 3, bottom + 3] });
        });
        pins.sort((a, b) => b.prio - a.prio);
        const kept = [];
        // Etiqueta que sairia cortada na borda do quadro vira só o ponto, como na colisão.
        const W = host.width; const H = host.height;
        pins.forEach((pin) => {
            const out = pin.box[0] < 4 || pin.box[2] > W - 4 || pin.box[1] < 4 || pin.box[3] > H - 4;
            const hit = out || kept.some((k) => !(pin.box[2] < k[0] || pin.box[0] > k[2] || pin.box[3] < k[1] || pin.box[1] > k[3]));
            pin.el.classList.toggle('fcard-anchor--dot', hit);
            if (!hit) kept.push(pin.box);
        });
        root.querySelectorAll('.fx-name').forEach((el) => {
            const r = el.getBoundingClientRect();
            const out = r.left - host.left < 4 || r.right - host.left > W - 4 || r.top - host.top < 4 || r.bottom - host.top > H - 4;
            el.classList.toggle('fx-name--out', out);
        });
    }
    let lastCollision = 0;

    let visible = true;
    new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !visible) awakeAt = performance.now();
        visible = e.isIntersecting;
    }).observe(root);
    // Na home o cinema é o conteúdo: rolar ou tocar a página mantém a cena viva; parada 60 s, congela.
    if (coarse) ['scroll', 'pointerdown'].forEach((type) => window.addEventListener(type, () => { awakeAt = performance.now(); }, { passive: true }));
    // A GPU do celular pode descartar o contexto (memória, aba em segundo plano): volta à imagem estática.
    renderer.domElement.addEventListener('webglcontextlost', () => fail({ permanent: true }));
    const clock = new THREE.Clock();
    let pulse = 0;
    let stutterClock = 0;
    let far = false; let wasFar = null;
    let lastFrame = 0;
    let firstFrame = true;
    (function tick() {
        requestAnimationFrame(tick);
        const now = performance.now();
        if (coarse && now - lastFrame < 1000 / 30) return;
        lastFrame = now;
        const dt = Math.min(clock.getDelta(), 0.05);
        if (!sceneReady || !visible || document.hidden) return;
        if (!firstFrame && !view.full && now - Math.max(lastInput, awakeAt) > IDLE_SLEEP) return;
        if (tour) tourStep(dt);
        else {
            if (tween) tween(now);
            controls.update();
            if (lastInput && !view.selected && !view.full && !tween && now - lastInput > IDLE_RESUME) startTour();
        }
        far = camera.zoom < farZoom * 1.45;
        if (far !== wasFar) { labelsHost.classList.toggle('fx-labels--far', far); wasFar = far; }
        if (!reduceMotion) {
            stutterClock += dt;
            objects.forEach((entry) => { if (entry.stutter) entry.stutter.paused = stutterClock % 7 > 5.2; });
            mixer.update(dt);
            updateWalkers(dt);
            pulse += dt;
            objects.forEach((entry) => { if (entry.ring) entry.ring.material.opacity = 0.65 + Math.sin(pulse * 3) * 0.3; });
        }
        renderer.render(scene, camera);
        labels.render(scene, camera);
        if (coarse) lastFrame = performance.now();
        if (firstFrame) {
            firstFrame = false;
            root.classList.remove('fx--loading');
            root.classList.add('fx--ready');
            root.removeAttribute('aria-busy');
            root.querySelector('[data-fx-hud]').inert = false;
            performance.mark('mestti-factory-interactive');
            const extras = () => { loadOperators(); loadProps(); };
            if ('requestIdleCallback' in window) requestIdleCallback(extras, { timeout: 2000 });
            else setTimeout(extras, 100);
        }
        if (now - lastCollision > 200) { lastCollision = now; resolveCollisions(); }
    })();

    return { refreshLabels, applyTheme, frame, zoomBy, focus, setFull };
}
