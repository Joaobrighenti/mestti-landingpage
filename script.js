/**
 * JavaScript para Landing Page MESTTI
 * Funcionalidades: Menu mobile, carrossel, formulário
 */

// ============================================
// Menu Mobile Toggle
// ============================================

const menuToggle = document.getElementById('menuToggle');
const headerNav = document.querySelector('.header-nav');
const navOverlay = document.getElementById('navOverlay');

if (menuToggle && headerNav && navOverlay) {
    function toggleMenu() {
        const isActive = headerNav.classList.toggle('active');
        navOverlay.classList.toggle('active');
        const spans = menuToggle.querySelectorAll('span');
        
        if (isActive) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }

    menuToggle.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', toggleMenu);
    
    // Close menu when clicking a link (inclui itens do dropdown)
    headerNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (headerNav.classList.contains('active')) {
                toggleMenu();
            }
        });
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

// ============================================
// Cards flutuantes que fogem do mouse (movimento fluido)
// ============================================

const personasSection = document.querySelector('.personas-with-float');
const floatingWidgets = document.querySelectorAll('.personas-with-float [data-float]');

if (personasSection && floatingWidgets.length) {
    const PUSH_DISTANCE = 85;
    const INFLUENCE_MARGIN = 28;
    const LERP = 0.12; // suavidade: quanto maior, mais rápido segue o alvo

    const state = new Map();
    floatingWidgets.forEach((el) => state.set(el, { x: 0, y: 0, targetX: 0, targetY: 0 }));

    function updateFloats() {
        floatingWidgets.forEach((el) => {
            const s = state.get(el);
            s.x += (s.targetX - s.x) * LERP;
            s.y += (s.targetY - s.y) * LERP;
            el.style.transform = `translate(${s.x}px, ${s.y}px)`;
        });
        requestAnimationFrame(updateFloats);
    }
    requestAnimationFrame(updateFloats);

    personasSection.addEventListener('mousemove', (e) => {
        const mx = e.clientX;
        const my = e.clientY;

        floatingWidgets.forEach((el) => {
            const rect = el.getBoundingClientRect();
            const expanded = {
                left: rect.left - INFLUENCE_MARGIN,
                right: rect.right + INFLUENCE_MARGIN,
                top: rect.top - INFLUENCE_MARGIN,
                bottom: rect.bottom + INFLUENCE_MARGIN
            };

            const isNear = mx >= expanded.left && mx <= expanded.right && my >= expanded.top && my <= expanded.bottom;
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const s = state.get(el);

            if (isNear) {
                const dx = cx - mx;
                const dy = cy - my;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                s.targetX = (dx / dist) * PUSH_DISTANCE;
                s.targetY = (dy / dist) * PUSH_DISTANCE;
            } else {
                s.targetX = 0;
                s.targetY = 0;
            }
        });
    });

    personasSection.addEventListener('mouseleave', () => {
        floatingWidgets.forEach((el) => {
            const s = state.get(el);
            s.targetX = 0;
            s.targetY = 0;
        });
    });
}

// ============================================
// Formulário de Contato e Modal
// ============================================

const contactForm = document.getElementById('contactForm');
const contactFormAtuacao = document.getElementById('contactFormAtuacao');

// Lógica do Modal
const modalOverlay = document.getElementById('contactModal');
const btnOpenModalList = document.querySelectorAll('.btn-open-modal');
const btnCloseModal = document.getElementById('btnCloseModal');

if (modalOverlay) {
    function openModal() {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Evita scroll atrás do modal
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    btnOpenModalList.forEach(btn => btn.addEventListener('click', openModal));
    
    if (btnCloseModal) {
        btnCloseModal.addEventListener('click', closeModal);
    }

    // Fechar ao clicar fora do modal content
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Fechar com tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
}

// WhatsApp para receber demonstrações: 14 97400-7797
const WHATSAPP_NUMERO = '5514974007797';

function montarMensagemWhatsApp(form, formId) {
    const name = form.querySelector('#name')?.value?.trim() || '';
    const email = form.querySelector('#email')?.value?.trim() || '';
    const phone = form.querySelector('#phone')?.value?.trim() || '';
    const cargo = form.querySelector('#cargo');
    const setor = form.querySelector('#setor');
    const solucao = form.querySelector('#solucao');
    const empresa = form.querySelector('#empresa');
    const mensagem = form.querySelector('#mensagem');

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
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const mensagem = montarMensagemWhatsApp(form, formId);
            const urlWhatsApp = `https://wa.me/${WHATSAPP_NUMERO}?text=${mensagem}`;

            window.open(urlWhatsApp, '_blank');

            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;

            submitButton.textContent = 'Enviado ✓';
            submitButton.style.backgroundColor = '#059669';
            submitButton.disabled = true;

            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.style.backgroundColor = '';
                submitButton.disabled = false;
                form.reset();
                if (typeof closeModal === 'function') closeModal();
            }, 3000);
        });
    }
}

handleFormSubmit(contactForm, 'principal');
handleFormSubmit(contactFormAtuacao, 'atuacao');

// ============================================
// Header Scroll Effect
// ============================================

const header = document.querySelector('.header');

if (header) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }
    });
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
// AOS Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50
        });
    }

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

    // Carrossel de clientes (loop contínuo sem reset visível)
    const clientsTrack = document.querySelector('.hero-clients-track');
    const clientsSet = document.querySelector('.hero-clients-set');
    if (clientsTrack && clientsSet) {
        let clientsX = 0;
        const clientsSpeed = 0.55;
        let setWidthPx = 0;

        function readClientsWidth() {
            const w = clientsSet.offsetWidth;
            if (w > 0) setWidthPx = w;
        }

        const clientsResizeObserver = new ResizeObserver(readClientsWidth);
        clientsResizeObserver.observe(clientsSet);

        function stepClients() {
            if (setWidthPx <= 0) {
                readClientsWidth();
                clientsTrack.style.transform = 'translate3d(0, 0, 0)';
                requestAnimationFrame(stepClients);
                return;
            }
            clientsX -= clientsSpeed;
            if (clientsX <= -setWidthPx) clientsX += setWidthPx;
            clientsTrack.style.transform = `translate3d(${clientsX}px, 0, 0)`;
            requestAnimationFrame(stepClients);
        }
        requestAnimationFrame(() => requestAnimationFrame(stepClients));
    }
});

// AOS — sem init o CSS do plugin deixa [data-aos] invisível
if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 600, once: true });
} else {
    document.documentElement.classList.add('no-aos');
}
