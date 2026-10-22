/**
 * Fábrica simulada no estilo da Fábrica 3D do produto (mestti_frontend · factory-3d):
 * vista isométrica, setores no chão, pinos por estado (o normal é quieto, só o anormal ganha cor),
 * "Fábrica agora", filtros por estado, camada Estado/OEE, zoom e detalhe da máquina com Resumo e Fila.
 * Todos os dados são de demonstração e ficam neste arquivo.
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

const root = document.querySelector('[data-factory]');

/* ---------------------------------------------------------------- textos */
const TX = {
    pt: {
        factory: 'Fábrica exemplo', live: 'Ao vivo', search: 'Buscar máquina', noResult: 'Nenhuma máquina encontrada',
        now: 'Fábrica agora', running: 'Rodando', stoppedPl: 'Paradas', lost: 'Sem sinal', machines: 'Máquinas',
        inFilter: 'Máquinas no filtro', noneInFilter: 'Nenhuma máquina neste filtro.', collapse: 'Recolher painel', expand: 'Expandir painel',
        all: 'Todas', layerState: 'Estado', layerOee: 'OEE', layerGroup: 'Colorir o chão por', filterGroup: 'Filtrar a cena por estado',
        zoomIn: 'Aproximar', zoomOut: 'Afastar', fit: 'Ver a fábrica toda', close: 'Fechar detalhes',
        summary: 'Resumo', queue: 'Fila', today: 'hoje', eff: 'Eficiência', producedToday: 'Produção hoje', pieces: 'peças no dia',
        orderDone: 'Conclusão da ordem', of: 'de', pcs: 'pç', operation: 'Operação', product: 'Produto', operator: 'Operador',
        since: 'há', reason: 'Motivo', doing: 'Em apontamento', todo: 'A fazer', planned: 'Previsto', sector: 'Setor',
        stock: 'Estoque', balance: 'Saldo', critical: 'Estoque crítico', ok: 'Normal', capacity: 'da capacidade',
        hint: 'Clique numa máquina ou num pino para ver o detalhe.', hintDrag: 'Arraste para girar · Ctrl + rolagem para aproximar',
        hintTouch: 'Toque numa máquina para ver o detalhe.', demo: 'Dados de demonstração', loading: 'Montando a fábrica…',
        error: 'Não foi possível carregar a maquete 3D. A lista ao lado mostra as mesmas máquinas.', oeeLegend: 'OEE',
        b_high: '80% ou mais', b_mid: '60 a 79%', b_low: 'abaixo de 60%', b_none: 'sem dado', tomorrow: 'amanhã', attention: 'Precisa de atenção'
    },
    en: {
        factory: 'Sample factory', live: 'Live', search: 'Search machine', noResult: 'No machine found',
        now: 'Factory now', running: 'Running', stoppedPl: 'Stopped', lost: 'No signal', machines: 'Machines',
        inFilter: 'Machines in filter', noneInFilter: 'No machine in this filter.', collapse: 'Collapse panel', expand: 'Expand panel',
        all: 'All', layerState: 'State', layerOee: 'OEE', layerGroup: 'Color the floor by', filterGroup: 'Filter the scene by state',
        zoomIn: 'Zoom in', zoomOut: 'Zoom out', fit: 'See the whole factory', close: 'Close details',
        summary: 'Summary', queue: 'Queue', today: 'today', eff: 'Efficiency', producedToday: 'Produced today', pieces: 'parts today',
        orderDone: 'Order progress', of: 'of', pcs: 'pcs', operation: 'Operation', product: 'Product', operator: 'Operator',
        since: 'for', reason: 'Reason', doing: 'In progress', todo: 'To do', planned: 'Planned', sector: 'Area',
        stock: 'Stock', balance: 'Balance', critical: 'Critical stock', ok: 'Normal', capacity: 'of capacity',
        hint: 'Click a machine or a pin to see the details.', hintDrag: 'Drag to rotate · Ctrl + scroll to zoom',
        hintTouch: 'Tap a machine to see the details.', demo: 'Demo data', loading: 'Building the factory…',
        error: 'The 3D model could not be loaded. The list shows the same machines.', oeeLegend: 'OEE',
        b_high: '80% or more', b_mid: '60 to 79%', b_low: 'below 60%', b_none: 'no data', tomorrow: 'tomorrow', attention: 'Needs attention'
    },
    es: {
        factory: 'Fábrica ejemplo', live: 'En vivo', search: 'Buscar máquina', noResult: 'Ninguna máquina encontrada',
        now: 'Fábrica ahora', running: 'Operando', stoppedPl: 'Paradas', lost: 'Sin señal', machines: 'Máquinas',
        inFilter: 'Máquinas en el filtro', noneInFilter: 'Ninguna máquina en este filtro.', collapse: 'Contraer panel', expand: 'Expandir panel',
        all: 'Todas', layerState: 'Estado', layerOee: 'OEE', layerGroup: 'Colorear el piso por', filterGroup: 'Filtrar la escena por estado',
        zoomIn: 'Acercar', zoomOut: 'Alejar', fit: 'Ver toda la fábrica', close: 'Cerrar detalles',
        summary: 'Resumen', queue: 'Cola', today: 'hoy', eff: 'Eficiencia', producedToday: 'Producción hoy', pieces: 'piezas del día',
        orderDone: 'Avance de la orden', of: 'de', pcs: 'pz', operation: 'Operación', product: 'Producto', operator: 'Operador',
        since: 'hace', reason: 'Motivo', doing: 'En registro', todo: 'Pendiente', planned: 'Previsto', sector: 'Sector',
        stock: 'Inventario', balance: 'Saldo', critical: 'Inventario crítico', ok: 'Normal', capacity: 'de la capacidad',
        hint: 'Haga clic en una máquina o un pin para ver el detalle.', hintDrag: 'Arrastre para girar · Ctrl + rueda para acercar',
        hintTouch: 'Toque una máquina para ver el detalle.', demo: 'Datos de demostración', loading: 'Montando la fábrica…',
        error: 'No se pudo cargar la maqueta 3D. La lista muestra las mismas máquinas.', oeeLegend: 'OEE',
        b_high: '80% o más', b_mid: '60 a 79%', b_low: 'menos de 60%', b_none: 'sin dato', tomorrow: 'mañana', attention: 'Requiere atención'
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
const ORDER = ['stopped', 'maintenance', 'warning', 'setup', 'running'];

const SECTORS = [
    { id: 'usinagem', name: { pt: 'Usinagem', en: 'Machining', es: 'Mecanizado' }, x0: -17.4, x1: -5.4, z0: -10.2, z1: -1.4, fill: '#3b82f6' },
    { id: 'injecao', name: { pt: 'Injeção', en: 'Injection molding', es: 'Inyección' }, x0: -3.6, x1: 9.2, z0: -10.2, z1: -1.4, fill: '#10b981' },
    { id: 'mp', name: { pt: 'Matéria-prima', en: 'Raw material', es: 'Materia prima' }, x0: 10.8, x1: 17.4, z0: -10.2, z1: -1.4, fill: '#f59e0b' },
    { id: 'estamparia', name: { pt: 'Estamparia', en: 'Stamping', es: 'Estampado' }, x0: -17.4, x1: -5.4, z0: 1.4, z1: 10.2, fill: '#8b5cf6' },
    { id: 'montagem', name: { pt: 'Montagem', en: 'Assembly', es: 'Montaje' }, x0: -3.6, x1: 9.2, z0: 1.4, z1: 10.2, fill: '#06b6d4' },
    { id: 'expedicao', name: { pt: 'Expedição', en: 'Shipping', es: 'Expedición' }, x0: 10.8, x1: 17.4, z0: 1.4, z1: 10.2, fill: '#ec4899' }
];

const L = (pt, en, es) => ({ pt, en, es });
const MACHINES = [
    {
        id: 'cnc01', code: 'CNC-01', type: 'cnc', sector: 'usinagem', x: -14.4, z: -6.2, state: 'running', minutes: 192, oee: 84, eff: 91, produced: 312,
        op: '2481', product: L('Flange 4" aço 1020', 'Flange 4" 1020 steel', 'Brida 4" acero 1020'), done: 214, planned: 340, operator: 'Marcos',
        queue: [['2481', L('Flange 4" aço 1020', 'Flange 4" 1020 steel', 'Brida 4" acero 1020'), 340, '14:40'], ['2490', L('Bucha guia Ø32', 'Guide bushing Ø32', 'Buje guía Ø32'), 500, '+1 09:10']]
    },
    {
        id: 'cnc02', code: 'CNC-02', type: 'cnc', sector: 'usinagem', x: -8.6, z: -6.2, state: 'stopped', minutes: 23, oee: 52, eff: 61, produced: 118,
        reason: L('Falta de material', 'Material shortage', 'Falta de material'), op: '2477', product: L('Eixo de transmissão 30 mm', 'Drive shaft 30 mm', 'Eje de transmisión 30 mm'), done: 118, planned: 260, operator: 'Paula',
        queue: [['2477', L('Eixo de transmissão 30 mm', 'Drive shaft 30 mm', 'Eje de transmisión 30 mm'), 260, '16:20'], ['2493', L('Pino de articulação', 'Hinge pin', 'Pasador de articulación'), 800, '+1 11:00']]
    },
    {
        id: 'tor01', code: 'TOR-01', type: 'lathe', sector: 'usinagem', x: -11.6, z: -2.9, rotY: 0, state: 'warning', minutes: 4, oee: 71, eff: 78, produced: 486,
        op: '2479', product: L('Pino roscado M12', 'Threaded pin M12', 'Perno roscado M12'), done: 486, planned: 900, operator: 'Diego',
        queue: [['2479', L('Pino roscado M12', 'Threaded pin M12', 'Perno roscado M12'), 900, '13:50']]
    },
    {
        id: 'inj01', code: 'INJ-01', type: 'injector', sector: 'injecao', x: 0.4, z: -6.4, state: 'running', minutes: 248, oee: 91, eff: 96, produced: 2946,
        op: '2470', product: L('Tampa 28 mm PP', 'Cap 28 mm PP', 'Tapa 28 mm PP'), done: 2946, planned: 4000, operator: 'Fernanda', worker: true,
        queue: [['2470', L('Tampa 28 mm PP', 'Cap 28 mm PP', 'Tapa 28 mm PP'), 4000, '15:30'], ['2485', L('Conector 3 vias', '3-way connector', 'Conector 3 vías'), 1200, '+1 07:40']]
    },
    {
        id: 'inj02', code: 'INJ-02', type: 'injector', sector: 'injecao', x: 6.2, z: -6.4, state: 'setup', minutes: 12, oee: 66, eff: 72, produced: 1320,
        reason: L('Troca de molde', 'Mold change', 'Cambio de molde'), op: '2488', product: L('Caixa organizadora 5 L', 'Storage box 5 L', 'Caja organizadora 5 L'), done: 0, planned: 600, operator: 'Carlos', worker: true,
        queue: [['2488', L('Caixa organizadora 5 L', 'Storage box 5 L', 'Caja organizadora 5 L'), 600, '17:00']]
    },
    {
        id: 'pre01', code: 'PRE-01', type: 'press', sector: 'estamparia', x: -14.2, z: 5.6, state: 'running', minutes: 95, oee: 79, eff: 85, produced: 1680,
        op: '2475', product: L('Suporte em L 2 mm', 'L bracket 2 mm', 'Soporte en L 2 mm'), done: 1680, planned: 2400, operator: 'Rafael',
        queue: [['2475', L('Suporte em L 2 mm', 'L bracket 2 mm', 'Soporte en L 2 mm'), 2400, '14:10']]
    },
    {
        id: 'pre02', code: 'PRE-02', type: 'press', sector: 'estamparia', x: -8.8, z: 5.6, state: 'maintenance', minutes: 41, oee: 58, eff: 64, produced: 640,
        reason: L('Troca de ferramenta', 'Tool change', 'Cambio de herramienta'), op: '2482', product: L('Arruela lisa 3/8"', 'Flat washer 3/8"', 'Arandela plana 3/8"'), done: 640, planned: 3000, operator: 'Bruno',
        queue: [['2482', L('Arruela lisa 3/8"', 'Flat washer 3/8"', 'Arandela plana 3/8"'), 3000, '18:30']]
    }
];
const STOCKS = [
    { id: 'silo1', code: 'SILO-01', type: 'tank', sector: 'mp', x: 12.7, z: -6.6, qty: '1.842 kg', material: L('PP cristal', 'Clear PP', 'PP cristal'), level: 62, critical: false },
    { id: 'silo2', code: 'SILO-02', type: 'tank', sector: 'mp', x: 15.6, z: -6.6, qty: '214 kg', material: L('PEAD branco', 'White HDPE', 'PEAD blanco'), level: 7, critical: true },
    { id: 'exp', code: 'EXP-01', type: 'pallets', sector: 'expedicao', x: 14.1, z: 5.8, qty: '48 vol.', material: L('Pedidos do dia', "Today's orders", 'Pedidos del día'), level: 40, critical: false }
];
const ALL = [...MACHINES, ...STOCKS];

/* ---------------------------------------------------------------- utilidades */
const lang = () => (TX[window.MESTTI_LANG] ? window.MESTTI_LANG : 'pt');
const t = (key) => TX[lang()][key];
const loc = (value) => (value && typeof value === 'object' ? value[lang()] : value);
const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = window.matchMedia('(pointer: coarse)').matches;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = (n) => Number(n).toLocaleString(lang() === 'en' ? 'en-US' : 'pt-BR');
const elapsed = (min) => (min < 60 ? `${min} min` : `${Math.floor(min / 60)}h ${String(min % 60).padStart(2, '0')}min`);
const bucket = (oee) => (oee == null ? 'none' : oee >= 80 ? 'high' : oee >= 60 ? 'mid' : 'low');
const BUCKET_COLOR = { high: ['#1F7A5C', '#4CC9A0'], mid: ['#B54708', '#F0A04B'], low: ['#B42318', '#F2796F'], none: ['#5A6876', '#8A97A4'] };
const glyph = (path, size = 14) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"/></svg>`;
const sectorOf = (item) => SECTORS.find((s) => s.id === item.sector);

/* ---------------------------------------------------------------- estado da vista */
const view = { selected: null, tab: 'summary', layer: 'state', filters: new Set(), nowOpen: true };

if (root) init();

function init() {
    // Em quadro estreito o painel da esquerda começa recolhido para não cobrir a cena (como no produto).
    view.nowOpen = root.clientWidth >= 1100;
    root.classList.add('fx--loading');
    root.innerHTML = `
        <div class="fx-scene"><canvas class="fx-canvas" aria-hidden="true"></canvas><div class="fx-labels"></div></div>
        <p class="fx-status" role="status">${t('loading')}</p>
        <div class="fx-hud" data-fx-hud></div>`;
    const canvas = root.querySelector('.fx-canvas');
    const labelsHost = root.querySelector('.fx-labels');
    renderHud();
    bindHud();

    let scene3d = null;
    try {
        scene3d = buildScene(canvas, labelsHost);
    } catch (error) {
        console.error(error);
        fail();
    }
    root.__fx = scene3d;

    document.addEventListener('mestti:lang', () => { renderHud(); scene3d?.refreshLabels(); });
    new MutationObserver(() => scene3d?.applyTheme()).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}

function fail() {
    root.classList.remove('fx--loading');
    root.classList.add('fx--error');
    const status = root.querySelector('.fx-status');
    status.textContent = t('error');
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
    hud.innerHTML = `
        <div class="fx-top-left">
            <div class="fx-surface fx-ident">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 20V9l6 4V9l6 4V5h4l4 15H2z"/></svg>
                <span class="fx-ident-name">${t('factory')}</span>
                <span class="fx-sep" aria-hidden="true"></span>
                <span class="fx-live"><i aria-hidden="true"></i>${t('live')}</span>
            </div>
            <div class="fx-surface fx-search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="M20 20l-3.5-3.5"/></svg>
                <input type="search" data-fx-search placeholder="${t('search')}" aria-label="${t('search')}" autocomplete="off">
                <ul class="fx-search-results" data-fx-results hidden></ul>
            </div>
        </div>
        <div class="fx-top-right">
            <div class="fx-layer" role="group" aria-label="${t('layerGroup')}">
                <button type="button" data-fx-layer="state" aria-pressed="${view.layer === 'state'}">${t('layerState')}</button>
                <button type="button" data-fx-layer="oee" aria-pressed="${view.layer === 'oee'}">${t('layerOee')}</button>
            </div>
        </div>
        <section class="fx-surface fx-now${view.nowOpen ? '' : ' is-collapsed'}" aria-label="${t('now')}">
            <div class="fx-now-head">
                <h3>${t('now')}</h3>
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
            </div>
        </section>
        <div class="fx-dock-wrap">
            ${view.layer === 'oee' ? `<div class="fx-surface fx-legend"><b>${t('oeeLegend')}</b>${['high', 'mid', 'low'].map((b) => `<span><i style="background:${BUCKET_COLOR[b][isDark() ? 1 : 0]}"></i>${t('b_' + b)}</span>`).join('')}</div>` : ''}
            <div class="fx-surface fx-dock" role="group" aria-label="${t('filterGroup')}">
                <button type="button" data-fx-filter="" aria-pressed="${view.filters.size === 0}">${t('all')} <span>${MACHINES.length}</span></button>
                ${chips.map((chip) => `<button type="button" data-fx-filter="${chip.key}" aria-pressed="${view.filters.has(chip.key)}"><i class="fx-dot st-${chip.key}" aria-hidden="true"></i>${STATES[chip.key].label[lang()]} <span>${chip.count}</span></button>`).join('')}
            </div>
        </div>
        <div class="fx-surface fx-zoom">
            <button type="button" class="fx-icon" data-fx-zoom="in" aria-label="${t('zoomIn')}" title="${t('zoomIn')}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button>
            <button type="button" class="fx-icon" data-fx-zoom="out" aria-label="${t('zoomOut')}" title="${t('zoomOut')}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14"/></svg></button>
            <button type="button" class="fx-icon" data-fx-zoom="fit" aria-label="${t('fit')}" title="${t('fit')}"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg></button>
        </div>
        <p class="fx-hint"><span class="fx-demo-tag">${t('demo')}</span>${coarse ? t('hintTouch') : `${t('hint')} <span>${t('hintDrag')}</span>`}</p>
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
    const queue = `<ol class="fx-queue">${item.queue.map(([op, product, qty, eta], index) => `
        <li class="${index === 0 ? 'is-doing' : ''}"><span class="fx-queue-tag">${index === 0 ? t('doing') : t('todo')}</span>
        <strong>OP ${op} · ${esc(loc(product))}</strong><small>${fmt(qty)} ${t('pcs')} · ${t('planned')} ${eta.startsWith('+1 ') ? `${t('tomorrow')} ${eta.slice(3)}` : eta}</small></li>`).join('')}</ol>`;
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
        } else if (target.dataset.fxZoom) {
            if (target.dataset.fxZoom === 'fit') fx?.frame(true);
            else fx?.zoomBy(target.dataset.fxZoom === 'in' ? 1.35 : 1 / 1.35);
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
        if (event.key === 'Escape' && view.selected) select(null);
        if (event.key === 'Enter' && event.target.matches('[data-fx-search]')) {
            const first = root.querySelector('[data-fx-results] [data-fx-select]');
            if (first) select(first.dataset.fxSelect);
        }
    });
}

function select(id) {
    view.selected = id;
    view.tab = 'summary';
    renderHud();
    root.__fx?.focus(id);
    if (id) root.querySelector('.fx-drawer')?.focus({ preventScroll: true });
    if (typeof window.gtag === 'function' && id) window.gtag('event', 'home_factory_select', { machine: id });
}

/* ---------------------------------------------------------------- cena 3D */
function buildScene(canvas, labelsHost) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 400);
    const labels = new CSS2DRenderer({ element: labelsHost });

    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const sun = new THREE.DirectionalLight(0xffffff, 1.05);
    sun.position.set(12, 22, 10);
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0xffffff, 0.35);
    fill.position.set(-10, 9, -6);
    scene.add(fill);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x9ca3af, 0.35));

    const world = new THREE.Group();
    scene.add(world);

    const palette = () => (isDark()
        ? { bg: 0x12161a, floor: 0x1c2227, grid: 0x2a3138, wall: 0x2a3036 }
        : { bg: 0xf1f4f7, floor: 0xe6ebef, grid: 0xc9d2da, wall: 0xdfe5ea });

    const floorMat = new THREE.MeshStandardMaterial({ color: palette().floor, roughness: 0.9 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(38, 24), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.userData.floor = true;
    world.add(floor);
    let grid = new THREE.GridHelper(38, 38, palette().grid, palette().grid);
    grid.position.y = 0.006;
    grid.material.transparent = true;
    grid.material.opacity = 0.55;
    world.add(grid);

    // Setores: preenchimento suave + borda, como FactorySectorAreaMesh.
    SECTORS.forEach((s) => {
        const w = s.x1 - s.x0; const d = s.z1 - s.z0;
        const area = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ color: s.fill, transparent: true, opacity: 0.12, depthWrite: false }));
        area.rotation.x = -Math.PI / 2;
        area.position.set((s.x0 + s.x1) / 2, 0.012, (s.z0 + s.z1) / 2);
        world.add(area);
        const edge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(w, d)), new THREE.LineBasicMaterial({ color: s.fill, transparent: true, opacity: 0.9 }));
        edge.rotation.x = -Math.PI / 2;
        edge.position.copy(area.position).setY(0.016);
        world.add(edge);
        const el = document.createElement('div');
        el.className = 'fx-sector';
        el.style.setProperty('--sector', s.fill);
        el.dataset.sector = s.id;
        const label = new CSS2DObject(el);
        label.position.set(s.x0 + 0.35, 0.05, s.z1 - 0.35);
        label.center.set(0, 1);
        world.add(label);
        s.labelEl = el;
    });

    // Corredor central demarcado.
    const lane = new THREE.MeshBasicMaterial({ color: 0xe6b423 });
    [-1.05, 1.05].forEach((z) => {
        const stripe = new THREE.Mesh(new THREE.PlaneGeometry(35, 0.1), lane);
        stripe.rotation.x = -Math.PI / 2;
        stripe.position.set(0, 0.02, z);
        world.add(stripe);
    });

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
        return mesh;
    };
    const cyl = (r, h, mat, x = 0, y = 0, z = 0, seg = 24) => {
        const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), mat);
        mesh.position.set(x, y + h / 2, z);
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

    const builders = {
        cnc() {
            const g = new THREE.Group();
            g.add(box(3.0, 0.3, 2.2, mats.dark));
            g.add(box(2.8, 1.9, 2.0, mats.body, 0, 0.3));
            g.add(box(1.5, 0.95, 0.04, mats.glass, -0.25, 0.8, 1.0));
            g.add(box(0.12, 1.5, 0.06, mats.blue, -1.05, 0.45, 1.02));
            g.add(box(0.12, 1.5, 0.06, mats.blue, 0.55, 0.45, 1.02));
            g.add(box(2.8, 0.18, 2.0, mats.blue, 0, 2.2));
            g.add(box(0.55, 0.8, 0.18, mats.dark, 1.25, 1.0, 1.15));
            g.add(box(1.0, 0.45, 0.6, mats.steel, 1.9, 0, -0.5));
            return { group: g, height: 2.4, lightAt: [-1.2, 2.38, -0.8], radius: 1.9 };
        },
        lathe() {
            const g = new THREE.Group();
            [-1.3, 1.3].forEach((x) => g.add(box(0.4, 0.8, 0.9, mats.dark, x, 0, 0)));
            g.add(box(3.6, 0.35, 1.1, mats.body, 0, 0.8));
            g.add(box(1.0, 0.9, 1.1, mats.blue, -1.3, 1.15));
            const chuck = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.25, 24), mats.steel);
            chuck.rotation.z = Math.PI / 2;
            chuck.position.set(-0.65, 1.55, 0);
            g.add(chuck);
            g.add(box(0.5, 0.55, 0.7, mats.body, 1.35, 1.15));
            g.add(box(2.0, 0.7, 0.04, mats.glass, 0.2, 1.2, 0.6));
            g.add(box(0.5, 0.7, 0.2, mats.dark, -1.3, 1.6, 0.65));
            return { group: g, height: 2.05, lightAt: [-1.6, 2.05, -0.35], radius: 2.0 };
        },
        press() {
            const g = new THREE.Group();
            g.add(box(2.2, 0.45, 1.8, mats.dark));
            [-0.8, 0.8].forEach((x) => g.add(box(0.45, 2.6, 0.7, mats.blue, x, 0.45, 0)));
            g.add(box(2.3, 0.75, 1.1, mats.blue, 0, 3.0));
            g.add(box(1.25, 0.4, 0.8, mats.steel, 0, 2.2));
            g.add(box(1.4, 0.2, 1.0, mats.steel, 0, 0.45));
            [-1.05, 1.05].forEach((x) => g.add(box(0.08, 1.4, 0.08, mats.yellow, x, 0.45, 0.85)));
            g.add(box(0.5, 0.9, 0.3, mats.dark, 1.45, 0.6, 0.6));
            return { group: g, height: 3.75, lightAt: [1.0, 3.75, -0.3], radius: 1.8 };
        },
        bench() {
            const g = new THREE.Group();
            [[-1.1, -0.4], [1.1, -0.4], [-1.1, 0.4], [1.1, 0.4]].forEach(([x, z]) => g.add(box(0.08, 0.85, 0.08, mats.steel, x, 0, z)));
            g.add(box(2.5, 0.08, 1.0, mats.wood, 0, 0.85));
            g.add(box(0.5, 0.35, 0.4, mats.carton, -0.6, 0.93, 0));
            g.add(box(0.4, 0.25, 0.3, mats.blue, 0.4, 0.93, -0.1));
            return { group: g, height: 1.2 };
        },
        pallets() {
            const g = new THREE.Group();
            [[-1.4, -1.1], [0, -1.1], [1.4, -1.1], [-1.4, 0.4], [0, 0.4]].forEach(([x, z], i) => {
                g.add(box(1.2, 0.15, 1.0, mats.wood, x, 0, z));
                const layers = 2 + (i % 2);
                for (let l = 0; l < layers; l += 1) g.add(box(1.1, 0.42, 0.9, mats.carton, x, 0.15 + l * 0.44, z));
            });
            return { group: g, height: 1.6, radius: 2.4 };
        },
        tank() {
            const g = new THREE.Group();
            g.add(cyl(1.15, 3.6, mats.tank, 0, 0.6));
            const cone = new THREE.Mesh(new THREE.ConeGeometry(1.15, 0.7, 24), mats.tank);
            cone.rotation.x = Math.PI;
            cone.position.y = 0.35 + 0.25;
            g.add(cone);
            [[-0.8, -0.8], [0.8, -0.8], [-0.8, 0.8], [0.8, 0.8]].forEach(([x, z]) => g.add(box(0.1, 0.9, 0.1, mats.steel, x, 0, z)));
            const roof = new THREE.Mesh(new THREE.ConeGeometry(1.2, 0.5, 24), mats.tank);
            roof.position.y = 4.45;
            g.add(roof);
            return { group: g, height: 4.7, radius: 1.6 };
        }
    };

    const objects = new Map();
    const pickables = [];

    function addObject(item, built) {
        const group = built.group;
        group.position.set(item.x, 0, item.z);
        if (item.rotY) group.rotation.y = item.rotY;
        group.traverse((child) => { if (child.isMesh) { child.userData.itemId = item.id; pickables.push(child); } });
        world.add(group);
        const entry = { item, group, height: built.height, radius: built.radius || 1.8, lamps: null, ring: null, disc: null, pin: null };
        if (built.lightAt) entry.lamps = stackLight(group, ...built.lightAt);
        objects.set(item.id, entry);
        return entry;
    }

    // Bancadas de montagem (sem sensor, sem pino).
    [[0.2, 4.4], [5.2, 4.4], [0.2, 7.6], [5.2, 7.6]].forEach(([x, z]) => {
        const b = builders.bench();
        b.group.position.set(x, 0, z);
        world.add(b.group);
    });

    MACHINES.filter((m) => m.type !== 'injector').forEach((m) => addObject(m, builders[m.type]()));
    STOCKS.forEach((s) => addObject(s, builders[s.type]()));

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
        return `<button type="button" class="fpin fpin--${tone} st-${item.state}${st.pulse && !oeeLayer ? ' fpin--pulse' : ''}${view.selected === item.id ? ' fpin--selected' : ''}" data-fx-pin="${item.id}" aria-label="${aria}">
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
        SECTORS.forEach((s) => { s.labelEl.textContent = s.name[lang()]; });
        objects.forEach((entry) => {
            ensurePin(entry);
            entry.pin.innerHTML = pinMarkup(entry);
            entry.pin.classList.toggle('fcard-anchor--dim', !matchesFilter(entry.item) && Boolean(entry.item.state || view.filters.size));
            // Lâmpada da torre: só a do estado atual acende.
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

    // Paredes de fundo para dar escala, como FactoryBackWalls.
    const wallMat = new THREE.MeshStandardMaterial({ color: palette().wall, roughness: 0.9 });
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(38, 3.2, 0.25), wallMat);
    backWall.position.set(0, 1.6, -12.1);
    world.add(backWall);
    const sideWall = new THREE.Mesh(new THREE.BoxGeometry(0.25, 3.2, 24), wallMat);
    sideWall.position.set(-19.1, 1.6, 0);
    world.add(sideWall);

    // Câmera isométrica com giro limitado; roda do mouse só com Ctrl para não prender a rolagem da página.
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minPolarAngle = 0.35;
    controls.maxPolarAngle = Math.PI / 2 - 0.12;
    controls.screenSpacePanning = true;
    controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.PAN, RIGHT: THREE.MOUSE.PAN };
    controls.enabled = !coarse;
    const BASE_DIR = new THREE.Vector3(1, 1.05, 1.15).normalize();
    camera.position.copy(BASE_DIR.clone().multiplyScalar(80));
    camera.lookAt(0, 0, 0);

    renderer.domElement.addEventListener('wheel', (event) => {
        if (!(event.ctrlKey || event.metaKey)) return;
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
            bottom: 84
        };
    }

    // Zoom que enquadra o chão inteiro na área livre (fora dos painéis).
    function fitZoom() {
        const pad = insets();
        const w = Math.max(200, root.clientWidth - pad.left - pad.right);
        const h = Math.max(200, root.clientHeight - pad.top - pad.bottom);
        camera.updateMatrixWorld();
        const inv = camera.matrixWorldInverse;
        let minX = Infinity; let maxX = -Infinity; let minY = Infinity; let maxY = -Infinity;
        [[-18, -11], [18, -11], [-18, 11], [18, 11]].forEach(([x, z]) => {
            [0, 3].forEach((y) => {
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
        const unitsPerPx = (camera.right - camera.left) / zoom / root.clientWidth;
        const dx = ((pad.left - pad.right) / 2) * unitsPerPx;
        const dy = ((pad.top - pad.bottom) / 2) * unitsPerPx;
        const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
        const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
        return point.clone().sub(right.multiplyScalar(dx)).add(up.multiplyScalar(dy));
    }

    function frame(animate) {
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

    function zoomBy(factor) {
        const zoom = Math.max(0.3, Math.min(camera.zoom * factor, fitZoom() * 4));
        animateTo(controls.target.clone(), zoom, 250);
    }

    function focus(id) {
        refreshLabels();
        if (!id) { frame(true); return; }
        const entry = objects.get(id);
        if (!entry) return;
        const zoom = Math.max(camera.zoom, fitZoom() * 2.1);
        animateTo(offsetTarget(new THREE.Vector3(entry.item.x, entry.height * 0.4, entry.item.z), zoom), zoom);
    }

    // Clique na cena: máquina seleciona; chão vazio fecha o detalhe (sem confundir com arrasto).
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downAt = null;
    renderer.domElement.addEventListener('pointerdown', (event) => { downAt = [event.clientX, event.clientY]; });
    renderer.domElement.addEventListener('pointerup', (event) => {
        if (!downAt || Math.hypot(event.clientX - downAt[0], event.clientY - downAt[1]) > 6) return;
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
        const p = palette();
        scene.background = new THREE.Color(p.bg);
        floorMat.color.setHex(p.floor);
        wallMat.color.setHex(p.wall);
        world.remove(grid);
        grid = new THREE.GridHelper(38, 38, p.grid, p.grid);
        grid.position.y = 0.006;
        grid.material.transparent = true;
        grid.material.opacity = 0.55;
        world.add(grid);
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
    const walkers = [];
    const loader = new GLTFLoader();

    resize();
    applyTheme();
    frame(false);
    new ResizeObserver(() => { resize(); if (!tween) frame(false); }).observe(root);

    Promise.all(['injetora-detalhada.glb', 'operador-animado.glb'].map((file) => loader.loadAsync('/glbimagens/' + file)))
        .then(([injetora, operador]) => {
            const cycle = THREE.AnimationClip.findByName(injetora.animations, 'Ciclo_Injecao');
            const operate = THREE.AnimationClip.findByName(operador.animations, 'Operar_Painel');
            const walk = THREE.AnimationClip.findByName(operador.animations, 'Caminhar');
            MACHINES.filter((m) => m.type === 'injector').forEach((m, index) => {
                const model = injetora.scene.clone(true);
                model.rotation.y = -Math.PI / 2;
                const holder = new THREE.Group();
                holder.add(model);
                model.updateWorldMatrix(true, true);
                const bounds = new THREE.Box3().setFromObject(model);
                const size = bounds.getSize(new THREE.Vector3());
                const scale = 5.4 / Math.max(size.x, size.z);
                model.scale.multiplyScalar(scale);
                model.updateWorldMatrix(true, true);
                const fitted = new THREE.Box3().setFromObject(model);
                const center = fitted.getCenter(new THREE.Vector3());
                model.position.x -= center.x;
                model.position.z -= center.z;
                model.position.y -= fitted.min.y;
                const height = fitted.max.y - fitted.min.y;
                const entry = addObject(m, { group: holder, height, lightAt: [2.3, height * 0.7, -1.0], radius: 3.1 });
                if (cycle && m.state === 'running') {
                    const action = mixer.clipAction(cycle, model);
                    action.play();
                    action.time = index * 2.1;
                }
                if (m.worker) {
                    const worker = operador.scene.clone(true);
                    worker.rotation.y = Math.PI;
                    worker.position.set(m.x - 0.2, 0, m.z + 2.0);
                    world.add(worker);
                    if (operate) mixer.clipAction(operate, worker).play();
                }
                return entry;
            });
            // Operadores nas outras máquinas e um passando no corredor.
            [MACHINES[0], MACHINES[2], MACHINES[5]].forEach((m) => {
                const worker = operador.scene.clone(true);
                worker.rotation.y = Math.PI;
                worker.position.set(m.x + 0.4, 0, m.z + 1.7);
                world.add(worker);
                if (operate) { const a = mixer.clipAction(operate, worker); a.play(); a.time = Math.random() * 2; }
            });
            const walker = operador.scene.clone(true);
            world.add(walker);
            if (walk) mixer.clipAction(walk, walker).play();
            walkers.push({ person: walker, from: -16, to: 16, z: 0, speed: 1.3, pos: -6 });
            refreshLabels();
        })
        .catch((error) => console.warn('fabrica-sim: modelos GLB indisponíveis', error))
        .finally(() => {
            refreshLabels();
            root.classList.remove('fx--loading');
            root.classList.add('fx--ready');
        });

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
        pins.forEach((pin) => {
            const hit = kept.some((k) => !(pin.box[2] < k[0] || pin.box[0] > k[2] || pin.box[3] < k[1] || pin.box[1] > k[3]));
            pin.el.classList.toggle('fcard-anchor--dot', hit);
            if (!hit) kept.push(pin.box);
        });
    }
    let lastCollision = 0;

    let visible = true;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(root);
    const clock = new THREE.Clock();
    let pulse = 0;
    (function tick() {
        requestAnimationFrame(tick);
        const dt = Math.min(clock.getDelta(), 0.05);
        if (!visible || document.hidden) return;
        if (tween) tween(performance.now());
        controls.update();
        if (!reduceMotion) {
            mixer.update(dt);
            walkers.forEach((w) => {
                w.pos += w.speed * dt;
                const span = w.to - w.from;
                const p = ((w.pos - w.from) % (span * 2) + span * 2) % (span * 2);
                const forward = p <= span;
                w.person.position.set(w.from + (forward ? p : span * 2 - p), 0, w.z);
                w.person.rotation.y = forward ? Math.PI / 2 : -Math.PI / 2;
            });
            pulse += dt;
            objects.forEach((entry) => { if (entry.ring) entry.ring.material.opacity = 0.65 + Math.sin(pulse * 3) * 0.3; });
        }
        renderer.render(scene, camera);
        labels.render(scene, camera);
        const now = performance.now();
        if (now - lastCollision > 200) { lastCollision = now; resolveCollisions(); }
    })();

    return { refreshLabels, applyTheme, frame, zoomBy, focus };
}
