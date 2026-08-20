/**
 * JavaScript para Landing Page MESTTI
 * Funcionalidades: Menu mobile, carrossel, formulário
 */

function gtag_report_conversion(url) {
    const callback = function () {
        if (typeof url !== 'undefined') {
            window.location = url;
        }
    };

    if (typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
            send_to: 'AW-11486484316/IgS3CL2-7I4ZENyul-Uq',
            event_callback: callback
        });
    } else {
        callback();
    }

    return false;
}

window.gtag_report_conversion = gtag_report_conversion;

// ============================================
// Menu Mobile Toggle
// ============================================

const menuToggle = document.getElementById('menuToggle');
const headerNav = document.querySelector('.header-nav');
const navOverlay = document.getElementById('navOverlay');

if (menuToggle && headerNav && navOverlay) {
    function setMenuVisual(isActive) {
        const spans = menuToggle.querySelectorAll('span');
        if (isActive) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            // Evita "dois X" (hamburger + botão fechar do painel)
            menuToggle.style.opacity = '0';
            menuToggle.style.pointerEvents = 'none';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
            menuToggle.style.opacity = '';
            menuToggle.style.pointerEvents = '';
        }
    }

    function toggleMenu() {
        const isActive = headerNav.classList.toggle('active');
        navOverlay.classList.toggle('active');
        setMenuVisual(isActive);
        if (isActive) {
            document.querySelector('.header')?.classList.remove('header--hidden');
        }
    }

    function closeMenu() {
        headerNav.classList.remove('active');
        navOverlay.classList.remove('active');
        setMenuVisual(false);
    }

    menuToggle.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', toggleMenu);

    headerNav.querySelectorAll('.mobile-nav-close').forEach((btn) => {
        btn.addEventListener('click', closeMenu);
    });

    // Garante que o menu comece fechado (evita estados “presos” em reloads)
    closeMenu();
    
    // Close menu when clicking a link (inclui itens do dropdown)
    headerNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (headerNav.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Se alternar breakpoint/orientação, garante estado fechado
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 900) closeMenu();
    });
}

// ============================================
// Carrossel de Depoimentos
// ============================================

const carouselContainer = document.querySelector('.carousel-container');
const carouselPrev = document.getElementById('carouselPrev');
const carouselNext = document.getElementById('carouselNext');

if (carouselContainer && carouselPrev && carouselNext) {
    let scrollPosition = 0;
    const cardWidth = 300; // Largura aproximada do card + gap
    const maxScroll = carouselContainer.scrollWidth - carouselContainer.clientWidth;

    carouselNext.addEventListener('click', () => {
        scrollPosition += cardWidth;
        if (scrollPosition > maxScroll) scrollPosition = maxScroll;
        carouselContainer.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    });

    carouselPrev.addEventListener('click', () => {
        scrollPosition -= cardWidth;
        if (scrollPosition < 0) scrollPosition = 0;
        carouselContainer.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    });

    // Atualizar posição ao scroll manual
    carouselContainer.addEventListener('scroll', () => {
        scrollPosition = carouselContainer.scrollLeft;
    });
}

// ============================================
// Smooth Scroll para Links Âncora
// ============================================

const MESTTI_HOME_SCROLL_KEY = 'mesttiHomeScroll';
const MESTTI_PAGE_SCROLL_KEY = 'mesttiPageScroll';

function normalizePathname(pathname) {
    let p = pathname || '/';
    if (p.endsWith('/index.html')) p = p.slice(0, -'/index.html'.length);
    if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
    return p || '/';
}

function scrollToHash(hash) {
    const target = document.querySelector(hash);
    if (!target) return;
    const headerOffset = 80;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
}

function stripHashFromAddressBar() {
    const url = window.location.pathname + window.location.search;
    history.replaceState(null, '', url);
}

function isHomePath() {
    return normalizePathname(window.location.pathname) === '/';
}

document.addEventListener('click', function (e) {
    const homeLink = e.target.closest('a[data-home-section]');
    if (homeLink) {
        const hash = homeLink.getAttribute('data-home-section');
        if (!hash || !hash.startsWith('#')) return;
        e.preventDefault();
        if (isHomePath()) {
            scrollToHash(hash);
            stripHashFromAddressBar();
        } else {
            sessionStorage.setItem(MESTTI_HOME_SCROLL_KEY, hash);
            window.location.assign(homeLink.getAttribute('href') || '/');
        }
        return;
    }

    const pageLink = e.target.closest('a[data-page-section]');
    if (pageLink) {
        const hash = pageLink.getAttribute('data-page-section');
        const href = pageLink.getAttribute('href');
        if (!hash || !hash.startsWith('#') || !href) return;
        e.preventDefault();
        let destPath;
        try {
            destPath = normalizePathname(new URL(href, window.location.origin).pathname);
        } catch {
            return;
        }
        const here = normalizePathname(window.location.pathname);
        if (here === destPath) {
            scrollToHash(hash);
            stripHashFromAddressBar();
        } else {
            sessionStorage.setItem(MESTTI_PAGE_SCROLL_KEY, JSON.stringify({ path: destPath, hash }));
            window.location.assign(href);
        }
        return;
    }

    const hashLink = e.target.closest('a[href^="#"]');
    if (hashLink) {
        const href = hashLink.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        scrollToHash(href);
        stripHashFromAddressBar();
    }
});

function initMesttiDeferredScroll() {
    const pendingHome = sessionStorage.getItem(MESTTI_HOME_SCROLL_KEY);
    if (pendingHome && isHomePath()) {
        sessionStorage.removeItem(MESTTI_HOME_SCROLL_KEY);
        requestAnimationFrame(() => {
            scrollToHash(pendingHome);
            stripHashFromAddressBar();
        });
        return;
    }

    const pendingRaw = sessionStorage.getItem(MESTTI_PAGE_SCROLL_KEY);
    if (pendingRaw) {
        try {
            const { path, hash } = JSON.parse(pendingRaw);
            if (normalizePathname(window.location.pathname) === path) {
                sessionStorage.removeItem(MESTTI_PAGE_SCROLL_KEY);
                requestAnimationFrame(() => {
                    scrollToHash(hash);
                    stripHashFromAddressBar();
                });
                return;
            }
        } catch {
            sessionStorage.removeItem(MESTTI_PAGE_SCROLL_KEY);
        }
    }

    if (window.location.hash) {
        const hash = window.location.hash;
        const target = document.querySelector(hash);
        if (!target) return;
        stripHashFromAddressBar();
        requestAnimationFrame(() => scrollToHash(hash));
    }
}

document.addEventListener('DOMContentLoaded', initMesttiDeferredScroll);



// WhatsApp para receber demonstrações: 14 97400-7797
const WHATSAPP_NUMERO = '5514974007797';

function mesttiT(key, fallback) {
    return (window.MesttiI18n && window.MesttiI18n.t(window.MESTTI_LANG || 'pt', key)) || fallback;
}

// ============================================
// Popup (substitui alert)
// ============================================

function ensureMesttiPopup() {
    let overlay = document.getElementById('mesttiPopup');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'mesttiPopup';
    overlay.className = 'mestti-popup';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
        <div class="mestti-popup__backdrop" data-popup-close="true"></div>
        <div class="mestti-popup__card" role="document" aria-labelledby="mesttiPopupTitle" aria-describedby="mesttiPopupMessage" tabindex="-1">
            <div class="mestti-popup__badge" aria-hidden="true"></div>
            <div class="mestti-popup__content">
                <h3 class="mestti-popup__title" id="mesttiPopupTitle">Pronto!</h3>
                <p class="mestti-popup__message" id="mesttiPopupMessage"></p>
                <div class="mestti-popup__actions">
                    <button type="button" class="btn btn-primary mestti-popup__btn" data-popup-close="true">OK</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
        const closeEl = e.target.closest('[data-popup-close="true"]');
        if (closeEl) closeMesttiPopup();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('is-open') && !overlay.querySelector('.mestti-popup__btn--confirm')) {
            closeMesttiPopup();
        }
    });

    return overlay;
}

function openMesttiPopup({ title = 'Pronto!', message = '' } = {}) {
    const overlay = ensureMesttiPopup();
    const titleEl = overlay.querySelector('#mesttiPopupTitle');
    const msgEl = overlay.querySelector('#mesttiPopupMessage');
    const cardEl = overlay.querySelector('.mestti-popup__card');
    const btnEl = overlay.querySelector('.mestti-popup__btn');

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;

    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');

    requestAnimationFrame(() => {
        if (cardEl) cardEl.focus();
        if (btnEl) btnEl.focus();
    });
}

function closeMesttiPopup() {
    const overlay = document.getElementById('mesttiPopup');
    if (!overlay) return;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
}

function restoreMesttiPopupActions() {
    const overlay = document.getElementById('mesttiPopup');
    if (!overlay) return;
    const actions = overlay.querySelector('.mestti-popup__actions');
    if (!actions) return;
    actions.innerHTML = '<button type="button" class="btn btn-primary mestti-popup__btn" data-popup-close="true">OK</button>';
}

function openMesttiConfirmPopup({
    title = 'Enviar antes de sair?',
    message = '',
    confirmLabel = 'Sim, enviar',
    cancelLabel = 'Não'
} = {}) {
    return new Promise((resolve) => {
        const overlay = ensureMesttiPopup();
        const titleEl = overlay.querySelector('#mesttiPopupTitle');
        const msgEl = overlay.querySelector('#mesttiPopupMessage');
        const actions = overlay.querySelector('.mestti-popup__actions');
        const cardEl = overlay.querySelector('.mestti-popup__card');

        if (titleEl) titleEl.textContent = title;
        if (msgEl) msgEl.textContent = message;
        if (actions) {
            actions.innerHTML = `
                <button type="button" class="mestti-popup__btn mestti-popup__btn--cancel btn">${cancelLabel}</button>
                <button type="button" class="mestti-popup__btn mestti-popup__btn--confirm btn btn-primary">${confirmLabel}</button>
            `;
        }

        const confirmBtn = actions?.querySelector('.mestti-popup__btn--confirm');
        const cancelBtn = actions?.querySelector('.mestti-popup__btn--cancel');
        const backdrop = overlay.querySelector('.mestti-popup__backdrop');

        function finish(result) {
            document.removeEventListener('keydown', onKeydown, true);
            confirmBtn?.removeEventListener('click', onConfirm);
            cancelBtn?.removeEventListener('click', onCancel);
            backdrop?.removeEventListener('click', onCancel);
            closeMesttiPopup();
            restoreMesttiPopupActions();
            resolve(result);
        }

        function onConfirm() { finish(true); }
        function onCancel() { finish(false); }
        function onKeydown(e) {
            if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
                e.preventDefault();
                onCancel();
            }
        }

        confirmBtn?.addEventListener('click', onConfirm);
        cancelBtn?.addEventListener('click', onCancel);
        backdrop?.addEventListener('click', onCancel);
        document.addEventListener('keydown', onKeydown, true);

        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
        requestAnimationFrame(() => {
            confirmBtn?.focus();
            cardEl?.focus();
        });
    });
}

function getFormFieldValue(form, selectors) {
    for (const sel of selectors) {
        const el = form.querySelector(sel);
        if (el && typeof el.value === 'string') return el.value.trim();
    }
    return '';
}

const LEAD_SOURCE_LABELS = {
    submit: 'Botão enviar',
    modal_close: 'Confirmação ao fechar modal',
    chat_progress: 'Chat — progresso',
    chat_abandoned: 'Chat — abandonou',
    barra_pass_trial: 'Pass — teste grátis',
    barra_pass_trial_explore: 'Pass — teste grátis (só explorando)'
};

const CHAT_STEP_LABELS = {
    name: 'Nome',
    empresa: 'Empresa',
    email: 'E-mail',
    phone: 'Telefone',
    cargo: 'Cargo',
    setor: 'Setor',
    solucao: 'Solução',
    observacao: 'Observação',
    mensagem: 'Mensagem',
    maquina: 'Máquina / linha'
};

function getOrCreateLeadSessionId(form) {
    const formId = form.id || 'principal';
    const storageKey = `mesttiLeadSession_${window.location.pathname}_${formId}`;
    let sessionId = form.dataset.mesttiLeadSession || '';

    try {
        if (!sessionId) {
            sessionId = sessionStorage.getItem(storageKey) || '';
        }
    } catch {
        /* ignore */
    }

    if (!sessionId) {
        sessionId = (typeof crypto !== 'undefined' && crypto.randomUUID)
            ? crypto.randomUUID()
            : `lead_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    }

    form.dataset.mesttiLeadSession = sessionId;

    try {
        sessionStorage.setItem(storageKey, sessionId);
    } catch {
        /* ignore */
    }

    return sessionId;
}

function clearLeadSessionId(form) {
    const formId = form.id || 'principal';
    const storageKey = `mesttiLeadSession_${window.location.pathname}_${formId}`;

    delete form.dataset.mesttiLeadSession;

    try {
        sessionStorage.removeItem(storageKey);
    } catch {
        /* ignore */
    }
}

function collectLeadPayload(form, formId, leadSource = 'submit') {
    const name = getFormFieldValue(form, ['#name', '[name="name"]']);
    const email = getFormFieldValue(form, ['#email', '[name="email"]']);
    const phone = getFormFieldValue(form, ['#phone', '[name="phone"]']);
    const ddi = getFormFieldValue(form, ['#ddi', '[name="ddi"]']);

    const cargo = form.querySelector('#cargo') || form.querySelector('[name="cargo"]');
    const setor = form.querySelector('#setor') || form.querySelector('[name="setor"]');
    const solucao = form.querySelector('#solucao') || form.querySelector('[name="solucao"]');
    const empresa = form.querySelector('#empresa') || form.querySelector('[name="empresa"]');
    const mensagem = form.querySelector('#mensagem') || form.querySelector('[name="mensagem"]');
    const observacao = form.querySelector('#observacao') || form.querySelector('[name="observacao"]');
    const maquinas = form.querySelector('[name="maquinas"]');
    const maquina = form.querySelector('[name="maquina"]');
    const programacaoAtual = form.querySelector('[name="programacao_atual"]');
    const dificuldadeProgramacao = form.querySelector('[name="dificuldade_programacao"]');
    const apontamentoAtual = form.querySelector('[name="apontamento_atual"]');
    const motivosParada = form.querySelector('[name="motivos_parada"]');
    const dificuldadeProducao = form.querySelector('[name="dificuldade_producao"]');
    const observacaoExtra = [
        observacao?.value?.trim() || '',
        maquinas?.value ? `Máquinas: ${maquinas.value}` : '',
        maquina?.value?.trim() ? `Máquina/linha: ${maquina.value.trim()}` : '',
        programacaoAtual?.value ? `Programação atual: ${programacaoAtual.value}` : '',
        apontamentoAtual?.value ? `Apontamento atual: ${apontamentoAtual.value}` : '',
        motivosParada?.value ? `Motivos de parada: ${motivosParada.value}` : '',
        dificuldadeProgramacao?.value?.trim() ? `Maior dificuldade na programação: ${dificuldadeProgramacao.value.trim()}` : '',
        dificuldadeProducao?.value?.trim() ? `Maior dificuldade para medir produção: ${dificuldadeProducao.value.trim()}` : ''
    ].filter(Boolean).join('\n');

    return {
        formId,
        name,
        email,
        phone,
        ddi,
        cargo: cargo?.value ? (cargo.options?.[cargo.selectedIndex]?.text || cargo.value) : '',
        setor: setor?.value ? (setor.options?.[setor.selectedIndex]?.text || setor.value) : '',
        solucao: solucao?.value ? (solucao.options?.[solucao.selectedIndex]?.text || solucao.value) : '',
        empresa: empresa?.value?.trim() || '',
        mensagem: mensagem?.value?.trim() || '',
        observacao: observacaoExtra,
        pagePath: window.location.pathname,
        leadSource: LEAD_SOURCE_LABELS[leadSource] || leadSource
    };
}

function formHasPartialData(form) {
    if (!form || form.dataset.mesttiSubmitted === '1' || form.dataset.mesttiSubmitting === '1') {
        return false;
    }

    const name = getFormFieldValue(form, ['#name', '[name="name"]']);
    const email = getFormFieldValue(form, ['#email', '[name="email"]']);
    const phone = getFormFieldValue(form, ['#phone', '[name="phone"]']).replace(/\D/g, '');
    const empresa = getFormFieldValue(form, ['#empresa', '[name="empresa"]']);
    const mensagem = getFormFieldValue(form, ['#mensagem', '[name="mensagem"]']);
    const observacao = getFormFieldValue(form, ['#observacao', '[name="observacao"]']);
    const dificuldadeProgramacao = getFormFieldValue(form, ['[name="dificuldade_programacao"]']);
    const dificuldadeProducao = getFormFieldValue(form, ['[name="dificuldade_producao"]']);
    const cargo = form.querySelector('#cargo') || form.querySelector('[name="cargo"]');
    const setor = form.querySelector('#setor') || form.querySelector('[name="setor"]');
    const solucao = form.querySelector('#solucao') || form.querySelector('[name="solucao"]');
    const maquinas = form.querySelector('[name="maquinas"]');
    const maquina = form.querySelector('[name="maquina"]');
    const programacaoAtual = form.querySelector('[name="programacao_atual"]');
    const apontamentoAtual = form.querySelector('[name="apontamento_atual"]');
    const motivosParada = form.querySelector('[name="motivos_parada"]');

    return Boolean(
        name.length >= 2
        || email.includes('@')
        || phone.length >= 8
        || empresa.length >= 2
        || mensagem.length >= 2
        || observacao.length >= 2
        || dificuldadeProgramacao.length >= 2
        || dificuldadeProducao.length >= 2
        || cargo?.value
        || setor?.value
        || solucao?.value
        || maquinas?.value
        || form.querySelector('[name="maquina"]')?.value?.trim()
        || programacaoAtual?.value
        || apontamentoAtual?.value
        || motivosParada?.value
    );
}

async function syncLeadProgress(form, formId, {
    event = 'step_completed',
    chatStepKey = '',
    stepIndex = 0,
    totalSteps = 0,
    leadSource = 'chat_progress'
} = {}) {
    if (!form) return;

    const hasPartial = formHasPartialData(form);
    if (!hasPartial && event !== 'submitted') return;

    const sessionId = getOrCreateLeadSessionId(form);
    const base = collectLeadPayload(form, formId, leadSource);
    const stepLabel = CHAT_STEP_LABELS[chatStepKey] || chatStepKey;
    const chatStep = stepIndex && totalSteps
        ? `${stepIndex}/${totalSteps} — ${stepLabel}`
        : '';

    const payload = {
        ...base,
        sessionId,
        timestamp: new Date().toISOString(),
        event,
        chatStep,
        chatStepKey,
        stepIndex,
        totalSteps,
        leadSource: LEAD_SOURCE_LABELS[leadSource] || leadSource
    };

    try {
        await fetch('/api/lead-progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            keepalive: true
        });
    } catch {
        /* sync opcional — não bloqueia o fluxo */
    }
}

function attachMetaLeadFields(payload, form) {
    const eventId =
        (typeof window.generateMetaEventId === 'function'
            ? window.generateMetaEventId()
            : null) ||
        (typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`);

    const cookies = window.MesttiMeta?.getMetaCookies?.() || {};
    const sessionId = form ? getOrCreateLeadSessionId(form) : '';

    payload.eventId = eventId;
    payload.eventSourceUrl = window.location.href;
    payload.sessionId = sessionId;
    payload.externalId = sessionId;
    payload.marketingConsent = Boolean(window.MesttiMeta?.hasConsent?.());
    if (cookies.fbp) payload.fbp = cookies.fbp;
    if (cookies.fbc) payload.fbc = cookies.fbc;

    return eventId;
}

async function sendLeadToApi(payload) {
    const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
    });
    if (!res.ok) {
        throw new Error(`lead_http_${res.status}`);
    }
    const data = await res.json().catch(() => ({ ok: true }));
    return data;
}

async function submitLeadForm(form, formId, {
    leadSource = 'submit',
    trackConversion = true,
    showSuccessPopup = true,
    closeOnSuccess = true
} = {}) {
    if (!form || form.dataset.mesttiSubmitting === '1') return false;

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton?.textContent || '';
    const payload = collectLeadPayload(form, formId, leadSource);

    const phoneDigits = (payload.phone || '').replace(/\D/g, '');
    if (!payload.name || (!payload.email && phoneDigits.length < 8)) {
        return false;
    }

    if (!payload.email && phoneDigits.length >= 8) {
        payload.email = `whatsapp+${phoneDigits}@lead.mestti.local`;
    }

    const metaEventId = attachMetaLeadFields(payload, form);

    form.dataset.mesttiSubmitting = '1';

    if (submitButton) {
        submitButton.disabled = true;
    }

    const successMessage = mesttiT(
        'form.success',
        'Em breve nossa equipe entrará em contato com você.'
    );

    await syncLeadProgress(form, formId, {
        event: 'submitted',
        leadSource
    });

    let leadOk = false;
    try {
        const result = await sendLeadToApi(payload);
        leadOk = Boolean(result?.ok !== false);
    } catch {
        leadOk = false;
    }

    if (!leadOk) {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
        form.dataset.mesttiSubmitting = '';
        openMesttiPopup({
            title: mesttiT('form.errorTitle', 'Não foi possível enviar'),
            message: mesttiT(
                'form.error',
                'Tente novamente em instantes ou fale conosco pelo WhatsApp.'
            )
        });
        return false;
    }

    // Google Ads + Meta Lead somente após aceite do lead no backend
    if (trackConversion) {
        gtag_report_conversion();
    }

    if (window.MesttiMeta?.hasConsent?.()) {
        window.MesttiMeta.trackMetaLead(metaEventId);
    }

    clearLeadSessionId(form);
    form.dataset.mesttiSubmitted = '1';
    window.MesttiConversationalForm?.clearAllDrafts?.();

    if (submitButton) {
        submitButton.textContent = 'Enviado ✓';
        submitButton.style.backgroundColor = '#059669';
    }

    if (showSuccessPopup) {
        openMesttiPopup({
            title: mesttiT('form.successTitle', 'Obrigado!'),
            message: successMessage
        });
    }

    setTimeout(() => {
        form.reset();
        if (closeOnSuccess && typeof closeModal === 'function') closeModal();
        if (submitButton) {
            submitButton.textContent = originalText;
            submitButton.style.backgroundColor = '';
            submitButton.disabled = false;
        }
        form.dataset.mesttiSubmitting = '';
        delete form.dataset.mesttiSubmitted;
    }, 2500);

    return true;
}

function montarMensagemWhatsApp(form, formId) {
    const getVal = (selectors) => {
        for (const sel of selectors) {
            const el = form.querySelector(sel);
            if (el && typeof el.value === 'string') return el.value.trim();
        }
        return '';
    };

    const name = getVal(['#name', '[name="name"]']);
    const email = getVal(['#email', '[name="email"]']);
    const phone = getVal(['#phone', '[name="phone"]']);

    const cargo = form.querySelector('#cargo') || form.querySelector('[name="cargo"]');
    const setor = form.querySelector('#setor') || form.querySelector('[name="setor"]');
    const solucao = form.querySelector('#solucao') || form.querySelector('[name="solucao"]');
    const empresa = form.querySelector('#empresa') || form.querySelector('[name="empresa"]');
    const mensagem = form.querySelector('#mensagem') || form.querySelector('[name="mensagem"]');

    let texto = '*Nova solicitação de demonstração MESTTI*\n\n';
    texto += `*Nome:* ${name}\n`;
    texto += `*E-mail:* ${email}\n`;
    texto += `*Telefone:* ${phone}\n`;
    if (cargo?.value) texto += `*Cargo:* ${cargo.options[cargo.selectedIndex]?.text || cargo.value}\n`;
    if (setor?.value) texto += `*Setor:* ${setor.options[setor.selectedIndex]?.text || setor.value}\n`;
    if (solucao?.value) texto += `*Solução de interesse:* ${solucao.options[solucao.selectedIndex]?.text || solucao.value}\n`;
    if (empresa?.value) texto += `*Empresa:* ${empresa.value}\n`;
    if (mensagem?.value) texto += `*Mensagem:* ${mensagem.value}\n`;

    return encodeURIComponent(texto);
}

function handleFormSubmit(form, formId) {
    if (!form || form.dataset.mesttiSubmitBound === '1') return;
    form.dataset.mesttiSubmitBound = '1';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await submitLeadForm(form, formId, { leadSource: 'submit' });
    });
}

if (window.MesttiFormOptions && typeof window.MesttiFormOptions.populateFormSelects === 'function') {
    window.MesttiFormOptions.populateFormSelects();
}

document.querySelectorAll('.demo-form').forEach((form) => {
    if (form.closest('#contactModal')) return;
    const formId = form.id || 'principal';
    handleFormSubmit(form, formId);
});

window.MesttiLead = { submitLeadForm, syncLeadProgress, getOrCreateLeadSessionId };

// ============================================
// Formulário de Contato e Modal
// ============================================

let openModal;
let closeModal;

const modalOverlay = document.getElementById('contactModal');
const btnOpenModalList = document.querySelectorAll('.btn-open-modal');
const btnCloseModal = document.getElementById('btnCloseModal');

function getModalForm() {
    return modalOverlay?.querySelector('.demo-form') || null;
}

let closeModalRequestPending = false;

async function requestCloseModal() {
    if (closeModalRequestPending) return;
    closeModalRequestPending = true;

    try {
        const confirmPopup = document.getElementById('mesttiPopup');
        if (confirmPopup?.classList.contains('is-open') && confirmPopup.querySelector('.mestti-popup__btn--confirm')) {
            closeMesttiPopup();
            restoreMesttiPopupActions();
            closeModal();
            return;
        }

        const form = getModalForm();

        if (form && formHasPartialData(form)) {
            const shouldSend = await openMesttiConfirmPopup({
                title: mesttiT('form.abandon.title', 'Enviar antes de sair?'),
                message: mesttiT('form.abandon.message', 'Você preencheu alguns dados. Quer que nossa equipe entre em contato?'),
                confirmLabel: mesttiT('form.abandon.yes', 'Sim, enviar'),
                cancelLabel: mesttiT('form.abandon.no', 'Não')
            });

            if (shouldSend) {
                const payload = collectLeadPayload(form, form.id || 'principal', 'modal_close');
                if (!payload.name || !payload.email) {
                    openMesttiPopup({
                        title: mesttiT('form.abandon.title', 'Enviar antes de sair?'),
                        message: mesttiT('form.abandon.incomplete', 'Para enviar, preencha pelo menos nome e e-mail.')
                    });
                    return;
                }

                await submitLeadForm(form, form.id || 'principal', {
                    leadSource: 'modal_close',
                    closeOnSuccess: true
                });
                return;
            }
        }

        closeModal();
    } finally {
        closeModalRequestPending = false;
    }
}

let modalScrollLockY = 0;

function lockModalBodyScroll() {
    if (window.innerWidth > 480) return;
    if (window.MesttiWaChatViewport?.isInAppBrowser?.()) return;
    modalScrollLockY = window.scrollY || window.pageYOffset || 0;
    document.body.style.top = `-${modalScrollLockY}px`;
}

function unlockModalBodyScroll() {
    if (window.innerWidth > 480) return;
    if (window.MesttiWaChatViewport?.isInAppBrowser?.()) {
        document.body.style.top = '';
        return;
    }
    const scrollY = modalScrollLockY;
    document.body.style.top = '';
    window.scrollTo(0, scrollY);
}

if (modalOverlay) {
    openModal = function openModalFn() {
        lockModalBodyScroll();
        modalOverlay.classList.add('active');
        document.body.classList.add('is-modal-open');
        document.body.style.overflow = 'hidden';
        document.querySelector('.header')?.classList.remove('header--hidden');
    };

    closeModal = function closeModalFn() {
        window.MesttiConversationalForm?.saveAllDrafts?.();
        closeMesttiPopup();
        restoreMesttiPopupActions();
        modalOverlay.classList.remove('active');
        document.body.classList.remove('is-modal-open');
        document.body.style.overflow = '';
        unlockModalBodyScroll();
    };

    function bindOpenModalButtons(buttons) {
        buttons.forEach((btn) => {
            if (btn.dataset.mesttiModalBound === '1') return;
            btn.dataset.mesttiModalBound = '1';
            btn.addEventListener('click', (e) => {
                if (btn.tagName === 'A') e.preventDefault();
                gtag_report_conversion();
                openModal();
            });
        });
    }

    bindOpenModalButtons(btnOpenModalList);

    function initFabContact() {
        if (document.getElementById('fabContact')) return;

        const fab = document.createElement('button');
        fab.type = 'button';
        fab.id = 'fabContact';
        fab.className = 'fab-contact btn-open-modal';
        fab.setAttribute('data-i18n-aria', 'a11y.fabDemo');
        fab.setAttribute('title', 'Demonstração');
        fab.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.883 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>`;
        document.body.appendChild(fab);
        bindOpenModalButtons([fab]);

        if (window.MesttiI18n && typeof window.MesttiI18n.applyLanguage === 'function') {
            window.MesttiI18n.applyLanguage(window.MESTTI_LANG || window.MesttiI18n.getLang());
        }
    }

    initFabContact();

    if (btnCloseModal) {
        btnCloseModal.addEventListener('click', () => requestCloseModal());
    }

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            requestCloseModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            requestCloseModal();
        }
    });
}

// ============================================
// Header Scroll Effect
// ============================================

const header = document.querySelector('.header');

if (header) {
    let lastScroll = 0;
    let ticking = false;
    const SCROLL_TOP_THRESHOLD = 24;
    const SCROLL_DELTA = 4;

    function getScrollTop() {
        return Math.max(
            window.scrollY || 0,
            document.documentElement.scrollTop || 0,
            document.body.scrollTop || 0
        );
    }

    function isHeaderLockedOpen() {
        return headerNav?.classList.contains('active')
            || document.body.classList.contains('is-modal-open');
    }

    function syncHeaderOffset() {
        document.body.classList.add('has-site-header');

        /* Mobile: altura fixa via CSS (header.css) — JS inflava no Safari */
        if (window.matchMedia('(max-width: 768px)').matches) {
            document.documentElement.style.removeProperty('--site-header-height');
            return;
        }

        const bar = header.querySelector('.header-tractian-inner')
            || header.querySelector('.header-top-wrapper');
        const safeTop = parseFloat(getComputedStyle(header).paddingTop) || 0;
        const barHeight = bar
            ? bar.getBoundingClientRect().height
            : 0;
        const height = Math.ceil(barHeight + safeTop);

        if (height > 0 && height < 120) {
            document.documentElement.style.setProperty('--site-header-height', `${height}px`);
        }
    }

    function updateHeaderOnScroll() {
        const currentScroll = getScrollTop();
        const heroFold = document.querySelector('.hero-first-fold');
        const isHome = document.body.dataset.page === 'home';

        if (isHome && heroFold) {
            const heroBottom = heroFold.getBoundingClientRect().bottom;
            const overHero = heroBottom > Math.max(header.offsetHeight, 64);

            header.classList.toggle('header--over-hero', overHero && !isHeaderLockedOpen());

            if (overHero) {
                header.style.boxShadow = '';
            } else {
                header.style.boxShadow = currentScroll > 50
                    ? '0 4px 12px rgba(0, 0, 0, 0.15)'
                    : '';
            }
        } else {
            header.classList.remove('header--over-hero');
            header.style.boxShadow = currentScroll > 50
                ? '0 4px 12px rgba(0, 0, 0, 0.15)'
                : '';
        }

        if (isHeaderLockedOpen()) {
            header.classList.remove('header--hidden');
        } else if (currentScroll <= SCROLL_TOP_THRESHOLD) {
            header.classList.remove('header--hidden');
        } else if (currentScroll > lastScroll + SCROLL_DELTA) {
            header.classList.add('header--hidden');
        } else if (currentScroll < lastScroll - SCROLL_DELTA) {
            header.classList.remove('header--hidden');
        }

        lastScroll = currentScroll;
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateHeaderOnScroll);
            ticking = true;
        }
    }

    syncHeaderOffset();
    updateHeaderOnScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', syncHeaderOffset, { passive: true });
    window.addEventListener('load', syncHeaderOffset);
}

// ============================================
// Lazy Loading de Imagens
// ============================================

if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.src;
    });
}

// ============================================
// Roadmap de implementação (home)
// ============================================

function initSistemaGridLightbox() {
    const lightbox = document.getElementById('sistemaLightbox');
    const lightboxImg = document.getElementById('sistemaLightboxImg');
    const lightboxCaption = document.getElementById('sistemaLightboxCaption');
    const grid = document.querySelector('.sistema-grid');
    if (!lightbox || !lightboxImg || !grid) return;

    let lastFocus = null;

    function openLightbox(img, captionText) {
        lastFocus = document.activeElement;
        lightboxImg.src = img.currentSrc || img.src;
        lightboxImg.alt = img.alt || '';
        if (lightboxCaption) {
            lightboxCaption.textContent = captionText || '';
            lightboxCaption.hidden = !captionText;
        }
        lightbox.hidden = false;
        lightbox.setAttribute('aria-hidden', 'false');
        requestAnimationFrame(() => {
            lightbox.classList.add('is-open');
        });
        document.body.classList.add('is-lightbox-open');
        lightbox.querySelector('.sistema-lightbox-close')?.focus();
    }

    function closeLightbox() {
        if (!lightbox.classList.contains('is-open') && lightbox.hidden) return;
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('is-lightbox-open');

        const finish = () => {
            lightbox.hidden = true;
            lightboxImg.removeAttribute('src');
            if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
            lastFocus = null;
        };

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            finish();
            return;
        }

        lightbox.addEventListener('transitionend', finish, { once: true });
        window.setTimeout(finish, 320);
    }

    grid.addEventListener('click', (event) => {
        const media = event.target.closest('.sistema-grid-media');
        if (!media || !grid.contains(media)) return;
        const img = media.querySelector('img');
        if (!img) return;
        const card = media.closest('.sistema-grid-card');
        const captionText = card?.querySelector('.sistema-grid-caption span')?.textContent?.trim() || '';
        openLightbox(img, captionText);
    });

    lightbox.addEventListener('click', (event) => {
        if (event.target.closest('[data-lightbox-close]')) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
            closeLightbox();
        }
    });
}

function initImplementationRoadmap() {
    const flow = document.querySelector('.impl-roadmap-flow');
    const steps = Array.from(document.querySelectorAll('.impl-roadmap-step'));
    const dotsWrap = document.querySelector('.impl-roadmap-dots');
    if (!flow || !steps.length || !dotsWrap) return;

    const mq = window.matchMedia('(max-width: 900px)');
    let active = 0;

    function labelFor(index) {
        const lang = window.MESTTI_LANG || window.MesttiI18n?.getLang?.() || 'pt';
        if (lang === 'en') return `Step ${index + 1} of ${steps.length}`;
        if (lang === 'es') return `Etapa ${index + 1} de ${steps.length}`;
        return `Etapa ${index + 1} de ${steps.length}`;
    }

    function nearestIndex() {
        const left = flow.scrollLeft;
        let best = 0;
        let bestDist = Infinity;
        steps.forEach((step, index) => {
            const dist = Math.abs(step.offsetLeft - left);
            if (dist < bestDist) {
                bestDist = dist;
                best = index;
            }
        });
        return best;
    }

    function setActive(index, scroll) {
        active = Math.max(0, Math.min(index, steps.length - 1));
        Array.from(dotsWrap.children).forEach((dot, i) => {
            dot.classList.toggle('is-active', i === active);
            dot.setAttribute('aria-current', i === active ? 'true' : 'false');
        });
        if (scroll) {
            const left = steps[active].getBoundingClientRect().left - flow.getBoundingClientRect().left + flow.scrollLeft;
            flow.scrollTo({ left, behavior: 'smooth' });
        }
    }

    function renderDots() {
        dotsWrap.replaceChildren();
        if (!mq.matches) {
            dotsWrap.hidden = true;
            return;
        }
        dotsWrap.hidden = false;
        steps.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = `impl-roadmap-dot${index === active ? ' is-active' : ''}`;
            dot.setAttribute('aria-label', labelFor(index));
            dot.addEventListener('click', () => setActive(index, true));
            dotsWrap.appendChild(dot);
        });
        setActive(nearestIndex(), false);
    }

    flow.addEventListener('scroll', () => {
        if (!mq.matches) return;
        const next = nearestIndex();
        if (next !== active) setActive(next, false);
    }, { passive: true });

    if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', renderDots);
    } else if (typeof mq.addListener === 'function') {
        mq.addListener(renderDots);
    }

    renderDots();
}

function lpCarouselDotLabel(index, total) {
    const lang = window.MESTTI_LANG || window.MesttiI18n?.getLang?.() || 'pt';
    if (lang === 'en') return `Screen ${index + 1} of ${total}`;
    if (lang === 'es') return `Pantalla ${index + 1} de ${total}`;
    return `Tela ${index + 1} de ${total}`;
}

function lpCarouselSlideCaption(slide) {
    const key = slide.getAttribute('data-i18n-caption');
    if (key && window.MesttiI18n) {
        return window.MesttiI18n.t(window.MESTTI_LANG || window.MesttiI18n.getLang(), key);
    }
    return slide.dataset.caption || '';
}

const lpSystemCarouselRefresh = [];

function initLpSystemCarousel() {
    const INTERVAL_MS = 5500;

    document.querySelectorAll('[data-lp-system-carousel]').forEach((root) => {
        const slides = Array.from(root.querySelectorAll('.lp-system-carousel-slide'));
        if (slides.length < 2) return;

        const captionEl = root.parentElement?.querySelector('.lp-system-carousel-caption')
            || root.querySelector('.lp-system-carousel-caption');
        const dotsWrap = root.querySelector('.lp-system-carousel-dots');
        let dotButtons = [];

        if (dotsWrap && !dotsWrap.children.length) {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = `lp-system-carousel-dot${i === 0 ? ' is-active' : ''}`;
                dot.setAttribute('aria-label', lpCarouselDotLabel(i, slides.length));
                dotsWrap.appendChild(dot);
            });
        }

        dotButtons = dotsWrap ? Array.from(dotsWrap.querySelectorAll('.lp-system-carousel-dot')) : [];

        let index = 0;
        let timer = null;

        function goTo(nextIndex) {
            index = ((nextIndex % slides.length) + slides.length) % slides.length;
            slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
            dotButtons.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
            if (captionEl) {
                captionEl.textContent = lpCarouselSlideCaption(slides[index]);
            }
        }

        function refreshI18n() {
            dotButtons.forEach((dot, i) => {
                dot.setAttribute('aria-label', lpCarouselDotLabel(i, slides.length));
            });
            goTo(index);
        }

        lpSystemCarouselRefresh.push(refreshI18n);

        function stopAuto() {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }

        function startAuto() {
            stopAuto();
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            timer = setInterval(() => goTo(index + 1), INTERVAL_MS);
        }

        dotButtons.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                stopAuto();
                goTo(i);
                startAuto();
            });
        });

        root.addEventListener('mouseenter', stopAuto);
        root.addEventListener('mouseleave', startAuto);
        root.addEventListener('focusin', stopAuto);
        root.addEventListener('focusout', startAuto);

        goTo(0);
        startAuto();
    });
}

window.MesttiLpCarousels = {
    refresh() {
        lpSystemCarouselRefresh.forEach((fn) => fn());
    }
};

// ============================================
// Faixa de logos de clientes (hero)
// ============================================

const HERO_CLIENT_LOGOS = [
    { src: 'images/logos_clientes/png-dark/phoenix.png', fallback: 'images/logos_clientes/phoenix.svg', alt: 'Cliente Phoenix' },
    { src: 'images/logos_clientes/png-dark/nicopel.png', fallback: 'images/logos_clientes/nicopel.svg', alt: 'Cliente Nicopel', className: 'hero-client-logo--nicopel' },
    { src: 'images/logos_clientes/png-dark/brighentti.png', fallback: 'images/logos_clientes/brighentti.svg', alt: 'Cliente Brighentti', className: 'hero-client-logo--brighentti' },
    { src: 'images/logos_clientes/png-dark/acoforte.png', fallback: 'images/logos_clientes/acoforte.svg', alt: 'Cliente Acoforte' },
    { src: 'images/logos_clientes/png-dark/continental.png', fallback: 'images/logos_clientes/continental.svg', alt: 'Cliente Continental', className: 'hero-client-logo--lg' },
    { src: 'images/logos_clientes/png-dark/injetplast.png', fallback: 'images/logos_clientes/injetplast.svg', alt: 'Cliente Injetplast', className: 'hero-client-logo--lg' },
    { src: 'images/logos_clientes/png-dark/metaltech.png', fallback: 'images/logos_clientes/metaltech.svg', alt: 'Cliente Metaltech', className: 'hero-client-logo--lg' }
];

function buildHeroClientLogosMarkup(includeAlt) {
    return HERO_CLIENT_LOGOS.map(({ src, fallback, alt, className }) => {
        const extraClass = className ? ` ${className}` : '';
        const altText = includeAlt ? alt : '';
        return `<div class="hero-client-logo hero-client-logo--sharp${extraClass}"><img src="${src}" data-fallback="${fallback}" alt="${altText}" loading="eager" decoding="async"></div>`;
    }).join('');
}

function bindHeroClientLogoFallback(img) {
    img.addEventListener('error', function onLogoError() {
        const fallback = img.getAttribute('data-fallback');
        if (!fallback || img.dataset.fallbackUsed === '1') return;
        img.dataset.fallbackUsed = '1';
        img.removeEventListener('error', onLogoError);
        img.src = fallback;
        img.closest('.hero-client-logo')?.classList.remove('hero-client-logo--sharp');
    }, { once: true });
}

function initHeroClientsStrip() {
    const track = document.querySelector('.hero-clients-track');
    const strip = document.querySelector('.hero-clients-strip');
    if (!track || !strip) return;

    const makeSet = (withAlt) => {
        const set = document.createElement('div');
        set.className = 'hero-clients-set';
        if (!withAlt) set.setAttribute('aria-hidden', 'true');
        set.innerHTML = buildHeroClientLogosMarkup(withAlt);
        set.querySelectorAll('.hero-client-logo img[data-fallback]').forEach(bindHeroClientLogoFallback);
        return set;
    };

    const fillTrack = () => {
        track.innerHTML = '';
        track.appendChild(makeSet(true));
        track.appendChild(makeSet(false));
        track.appendChild(makeSet(false));
        track.appendChild(makeSet(false));

        const minWidth = Math.max(strip.clientWidth, window.innerWidth) * 2.25;
        let guard = 0;
        while (track.scrollWidth < minWidth && guard < 8) {
            track.appendChild(makeSet(false));
            track.appendChild(makeSet(false));
            guard += 1;
        }
    };

    fillTrack();
    window.addEventListener('load', fillTrack, { once: true });
}

function shouldSkipHeavyMedia() {
    if (window.matchMedia('(max-width: 768px)').matches) return true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
    const conn = navigator.connection;
    if (conn && (conn.saveData || /(^2g|slow-2g)/.test(conn.effectiveType || ''))) return true;
    return false;
}

function initAosAnimations() {
    if (shouldSkipHeavyMedia() || typeof AOS === 'undefined') {
        document.documentElement.classList.add('no-aos');
        return;
    }

    AOS.init({
        duration: 600,
        easing: 'ease-out-cubic',
        once: true,
        offset: 40
    });

    window.addEventListener('load', () => {
        if (typeof AOS !== 'undefined') AOS.refreshHard();
    }, { once: true });
}

// ============================================
// AOS Initialization
// ============================================

function initPracticeSolve() {
    const root = document.querySelector('[data-practice-solve]');
    if (!root) return;

    const items = Array.from(root.querySelectorAll('[data-solve-item]'));
    const panels = Array.from(root.querySelectorAll('[data-solve-panel]'));
    if (!items.length) return;

    function activate(index) {
        items.forEach((item, i) => {
            const on = i === index;
            item.classList.toggle('is-active', on);
            item.setAttribute('aria-expanded', on ? 'true' : 'false');
        });
        panels.forEach((panel) => {
            panel.classList.toggle('is-active', Number(panel.getAttribute('data-solve-panel')) === index);
        });
    }

    items.forEach((item, i) => {
        item.addEventListener('click', () => activate(i));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initImplementationRoadmap();
    initSistemaGridLightbox();
    initHeroClientsStrip();
    initLpSystemCarousel();
    initPracticeSolve();
    initAosAnimations();

    // Rodapé fixo: número só ao carregar a página
    const countEl = document.getElementById('sensorCountDisplay');
    if (countEl) {
        const count = 1200 + Math.floor(Math.random() * 200);
        countEl.textContent = count.toLocaleString('pt-BR');
    }

    // Esteira de caixas: loop contínuo sem vazio — inicia após layout, reset exato
    const conveyorTrack = document.querySelector('.sensor-footer-boxes');
    const conveyorSet = document.querySelector('.sensor-footer-boxes-set');
    if (conveyorTrack && conveyorSet) {
        let conveyorX = 0;
        const speed = 0.5;
        let setWidthPx = 0;

        function readSetWidth() {
            const w = conveyorSet.offsetWidth;
            if (w > 0) setWidthPx = w;
            return setWidthPx;
        }

        const resizeObserver = new ResizeObserver(readSetWidth);
        resizeObserver.observe(conveyorSet);

        function stepConveyor() {
            if (setWidthPx <= 0) {
                readSetWidth();
                conveyorTrack.style.transform = 'translate3d(0, 0, 0)';
                requestAnimationFrame(stepConveyor);
                return;
            }
            conveyorX -= speed;
            if (conveyorX <= -setWidthPx) conveyorX += setWidthPx;
            conveyorTrack.style.transform = `translate3d(${conveyorX}px, 0, 0)`;
            requestAnimationFrame(stepConveyor);
        }
        requestAnimationFrame(() => requestAnimationFrame(stepConveyor));
    }
});
