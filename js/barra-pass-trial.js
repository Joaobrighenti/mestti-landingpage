/**
 * Chat de teste grátis — Barra Pass
 */
(function () {
    const AVATAR_SRC = '/images/Atendente.png';
    const TYPING_MS = 520;
    const PAUSE_MS = 680;
    const CLOSE_AFTER_MS = 1200;

    const STEPS = [
        {
            key: 'name',
            question: 'Pra começar: qual é o seu nome completo?',
            type: 'text',
            validate: (v) => v.trim().length >= 2,
            error: 'Me passa seu nome com pelo menos 2 letras 🙂'
        },
        {
            key: 'empresa',
            question: 'Qual o nome da sua empresa?',
            type: 'text',
            validate: (v) => v.trim().length >= 2,
            error: 'Preciso do nome da empresa para montar a simulação.'
        },
        {
            key: 'email',
            question: 'Qual e-mail profissional podemos usar?',
            type: 'email',
            validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
            error: 'Esse e-mail não parece válido. Pode conferir?'
        },
        {
            key: 'phone',
            question: 'Me passa seu WhatsApp ou telefone (com DDD):',
            type: 'phone',
            validate: (v) => v.replace(/\D/g, '').length >= 8,
            error: 'Preciso de um número com DDD para continuar.'
        },
        {
            key: 'maquina',
            question: 'Qual máquina ou linha de produção você quer monitorar no teste?',
            type: 'text',
            validate: (v) => v.trim().length >= 2,
            error: 'Informe pelo menos o nome da máquina ou da linha.'
        }
    ];

    function sleep(ms) {
        return new Promise((resolve) => window.setTimeout(resolve, ms));
    }

    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function escapeHtml(text) {
        return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function firstName(full) {
        const raw = (full || '').trim().split(/\s+/)[0] || '';
        if (!raw) return '';
        return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
    }

    class TrialChat {
        constructor(form, modal) {
            this.form = form;
            this.modal = modal;
            this.card = form.closest('.demo-modal-card');
            this.modalContent = form.closest('.modal-content');
            this.stepIndex = 0;
            this.busy = false;
            this.finished = false;
            this.ddiValue = form.querySelector('[name="ddi"]')?.value || '+55';
            this.setupUi();
        }

        setupUi() {
            this.card?.classList.add('wa-mode');
            this.modalContent?.classList.add('wa-modal-content', 'wa-modal');
            this.form.classList.add('wa-form-hidden');
            this.modal.classList.add('modal-overlay--wa-chat');

            this.chatEl = document.createElement('div');
            this.chatEl.className = 'wa-chat';
            this.chatEl.innerHTML = `
                <div class="wa-chat-header">
                    <div class="wa-chat-avatar">
                        <img src="${AVATAR_SRC}" alt="Giovana — MESTTI" width="40" height="40" loading="eager" decoding="async">
                    </div>
                    <div class="wa-chat-meta">
                        <p class="wa-chat-name">Giovana — MESTTI</p>
                        <p class="wa-chat-status">Teste grátis · 7 dias</p>
                    </div>
                </div>
                <div class="wa-chat-body">
                    <div class="wa-chat-scroll">
                        <div class="wa-messages" role="log" aria-live="polite"></div>
                        <div class="wa-quick-replies"></div>
                    </div>
                    <div class="wa-composer">
                        <input type="text" class="wa-input" autocomplete="off">
                        <button type="button" class="wa-send" aria-label="Enviar">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            `;

            this.form.parentNode.insertBefore(this.chatEl, this.form);
            this.messagesEl = this.chatEl.querySelector('.wa-messages');
            this.scrollEl = this.chatEl.querySelector('.wa-chat-scroll');
            this.quickRepliesEl = this.chatEl.querySelector('.wa-quick-replies');
            this.composerEl = this.chatEl.querySelector('.wa-composer');
            this.inputEl = this.chatEl.querySelector('.wa-input');
            this.sendBtn = this.chatEl.querySelector('.wa-send');

            this.sendBtn.addEventListener('click', () => this.handleSend());
            this.inputEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSend();
                }
            });
        }

        scrollBottom() {
            requestAnimationFrame(() => {
                const target = this.scrollEl || this.messagesEl;
                target.scrollTop = target.scrollHeight;
            });
        }

        renderMessage(role, html, allowHtml = false) {
            const msg = document.createElement('div');
            msg.className = `wa-msg wa-msg--${role}`;
            const avatar = role === 'bot'
                ? `<img src="${AVATAR_SRC}" alt="" class="wa-msg-avatar" width="28" height="28" loading="lazy">`
                : '';
            const body = allowHtml ? html : escapeHtml(html);
            msg.innerHTML = `
                ${avatar}
                <div class="wa-bubble">
                    ${body}
                    <span class="wa-bubble-time">${formatTime(new Date())}</span>
                </div>
            `;
            this.messagesEl.appendChild(msg);
            this.scrollBottom();
            return msg;
        }

        addUser(text) {
            this.renderMessage('user', text);
        }

        async showTyping() {
            const el = document.createElement('div');
            el.className = 'wa-msg wa-msg--bot wa-msg--typing';
            el.innerHTML = `
                <img src="${AVATAR_SRC}" alt="" class="wa-msg-avatar" width="28" height="28">
                <div class="wa-bubble wa-bubble--typing"><span></span><span></span><span></span></div>
            `;
            this.messagesEl.appendChild(el);
            this.scrollBottom();
            await sleep(TYPING_MS);
            el.remove();
        }

        async botSay(text, allowHtml = false) {
            await this.showTyping();
            this.renderMessage('bot', text, allowHtml);
            await sleep(PAUSE_MS);
        }

        currentStep() {
            return STEPS[this.stepIndex] || null;
        }

        setField(key, value) {
            const el = this.form.querySelector(`[name="${key}"]`);
            if (el) el.value = value;
        }

        reset() {
            this.stepIndex = 0;
            this.busy = false;
            this.finished = false;
            this.messagesEl.innerHTML = '';
            this.quickRepliesEl.innerHTML = '';
            this.inputEl.value = '';
            this.inputEl.disabled = false;
            this.sendBtn.disabled = false;
            this.composerEl.classList.remove('is-hidden');
            this.form.reset();
            const ddi = this.form.querySelector('[name="ddi"]');
            if (ddi) ddi.value = this.ddiValue;
        }

        async start() {
            this.reset();
            await this.botSay('Oi! 👋 Bem-vindo ao <strong>teste grátis MESTTI</strong>.', true);
            await this.botSay('Em 7 dias você vê na prática como funciona o apontamento e o monitoramento da sua linha — sem compromisso.');
            await this.botSay('Vou pedir alguns dados rapidinho para nossa equipe te atender. Vamos lá?');
            await this.askStep();
        }

        formatQuestion(step) {
            const nome = firstName(this.form.querySelector('[name="name"]')?.value);
            if (step.key === 'name' || !nome) return step.question;
            const lower = step.question.charAt(0).toLowerCase() + step.question.slice(1);
            return `${nome}, ${lower}`;
        }

        async askStep() {
            const step = this.currentStep();
            if (!step) {
                await this.promptContact();
                return;
            }

            if (step.type === 'phone') {
                this.showDdiChips();
            } else {
                this.quickRepliesEl.innerHTML = '';
            }

            this.composerEl.classList.remove('is-hidden');
            this.inputEl.type = step.type === 'email' ? 'email' : 'text';
            this.inputEl.inputMode = step.type === 'email' ? 'email' : step.type === 'phone' ? 'tel' : 'text';
            this.inputEl.placeholder = step.type === 'phone' ? 'Telefone / WhatsApp' : 'Digite aqui…';
            this.inputEl.disabled = false;
            await this.botSay(this.formatQuestion(step));
            this.inputEl.focus();
        }

        showDdiChips() {
            const ddiEl = this.form.querySelector('[name="ddi"]');
            if (!ddiEl) return;
            this.quickRepliesEl.innerHTML = '';
            Array.from(ddiEl.options).forEach((opt) => {
                const chip = document.createElement('button');
                chip.type = 'button';
                chip.className = 'wa-chip';
                chip.textContent = opt.textContent.trim();
                if (opt.value === this.ddiValue) {
                    chip.style.background = '#075e54';
                    chip.style.color = '#fff';
                }
                chip.addEventListener('click', () => {
                    this.ddiValue = opt.value;
                    ddiEl.value = opt.value;
                    this.quickRepliesEl.querySelectorAll('.wa-chip').forEach((n) => {
                        n.style.background = '';
                        n.style.color = '';
                    });
                    chip.style.background = '#075e54';
                    chip.style.color = '#fff';
                    this.inputEl.focus();
                });
                this.quickRepliesEl.appendChild(chip);
            });
        }

        async handleSend() {
            if (this.busy || this.finished) return;
            const step = this.currentStep();
            if (!step) return;

            const raw = this.inputEl.value.trim();
            if (!raw) return;

            if (step.validate && !step.validate(raw)) {
                await this.botSay(step.error);
                return;
            }

            this.busy = true;
            const display = step.type === 'phone' ? `${this.ddiValue} ${raw}` : raw;
            this.addUser(display);
            this.inputEl.value = '';
            this.quickRepliesEl.innerHTML = '';

            if (step.type === 'phone') {
                this.setField('ddi', this.ddiValue);
                this.setField('phone', raw);
            } else {
                this.setField(step.key, raw);
            }

            if (step.key === 'name') {
                await this.botSay(`Prazer, ${firstName(raw)}! 😊`);
            } else if (step.key !== 'maquina') {
                await this.botSay('Show! 👍');
            }

            this.stepIndex += 1;
            this.busy = false;
            await this.askStep();
        }

        async promptContact() {
            this.composerEl.classList.add('is-hidden');
            const nome = firstName(this.form.querySelector('[name="name"]')?.value);

            await this.botSay(
                `${nome ? `${nome}, o` : 'O'}brigada pelos dados! Quer que nossa equipe entre em contato para ativar o <strong>teste grátis de 7 dias</strong>?`,
                true
            );

            this.showFinalChoices();
        }

        showFinalChoices() {
            this.quickRepliesEl.innerHTML = '';
            const yes = document.createElement('button');
            yes.type = 'button';
            yes.className = 'wa-chip';
            yes.textContent = 'Sim, quero o teste!';
            yes.addEventListener('click', () => this.finish(true));

            const no = document.createElement('button');
            no.type = 'button';
            no.className = 'wa-chip wa-chip--skip';
            no.textContent = 'Só explorando';
            no.addEventListener('click', () => this.finish(false));

            this.quickRepliesEl.appendChild(yes);
            this.quickRepliesEl.appendChild(no);
            this.scrollBottom();
        }

        async submitLeadData(wantsContact) {
            const submit = window.MesttiLead?.submitLeadForm;
            if (typeof submit !== 'function') return;
            try {
                await submit(this.form, 'trialForm', {
                    leadSource: wantsContact ? 'barra_pass_trial' : 'barra_pass_trial_explore',
                    showSuccessPopup: false,
                    closeOnSuccess: false,
                    trackConversion: wantsContact
                });
            } catch {
                /* envio em segundo plano — não bloqueia fechamento */
            }
        }

        async closeSmoothly() {
            const modal = this.modal;
            if (!modal?.classList.contains('active')) return;
            modal.classList.add('is-closing');
            await sleep(320);
            closeTrialModal();
        }

        async finish(wantsContact) {
            if (this.finished) return;
            this.finished = true;
            this.quickRepliesEl.innerHTML = '';
            this.composerEl.classList.add('is-hidden');

            const obs = [
                'Pass — Teste grátis',
                wantsContact ? 'Solicitou contato da equipe' : 'Não solicitou contato'
            ].join(' · ');
            this.setField('observacao', obs);

            if (wantsContact) {
                this.addUser('Sim, quero o teste!');
                await this.botSay('Perfeito! 🎉 Nossa equipe vai entrar em contato em breve para ativar o teste na sua planta.');
            } else {
                this.addUser('Só explorando');
                await this.botSay('Sem problemas! Quando quiser ativar o teste na sua fábrica, é só voltar aqui ou falar no WhatsApp. 😊');
            }

            await this.botSay('Obrigada pelo interesse na MESTTI!');
            await this.submitLeadData(wantsContact);
            await sleep(CLOSE_AFTER_MS);
            await this.closeSmoothly();
        }
    }

    let chatInstance = null;
    let scrollLockY = 0;

    function lockScroll() {
        if (window.innerWidth > 480) return;
        scrollLockY = window.scrollY || 0;
        document.body.style.top = `-${scrollLockY}px`;
    }

    function unlockScroll() {
        if (window.innerWidth > 480) return;
        document.body.style.top = '';
        window.scrollTo(0, scrollLockY);
    }

    function openTrialModal() {
        const modal = document.getElementById('trialModal');
        if (!modal) return;
        lockScroll();
        modal.classList.add('active');
        document.body.classList.add('is-modal-open');
        document.body.style.overflow = 'hidden';
        if (typeof window.gtag_report_conversion === 'function') {
            window.gtag_report_conversion();
        }
        chatInstance?.start();
    }

    function closeTrialModal() {
        const modal = document.getElementById('trialModal');
        if (!modal) return;
        modal.classList.remove('active', 'is-closing');
        document.body.classList.remove('is-modal-open');
        document.body.style.overflow = '';
        unlockScroll();
    }

    function init() {
        const modal = document.getElementById('trialModal');
        const form = document.getElementById('trialForm');
        const openBtn = document.getElementById('btnTrial');
        const closeBtn = document.getElementById('btnCloseTrialModal');

        if (!modal || !form) return;

        chatInstance = new TrialChat(form, modal);

        openBtn?.addEventListener('click', openTrialModal);
        closeBtn?.addEventListener('click', closeTrialModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeTrialModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeTrialModal();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.MesttiBarraPass = { openTrialModal, closeTrialModal };
})();
