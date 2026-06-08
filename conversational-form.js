/**
 * Formulário conversacional estilo WhatsApp — apenas modais (#contactModal)
 */
(function () {
    const STORAGE_PREFIX = 'mesttiChatDraft';
    const AVATAR_SRC = '/images/Atendente.png';
    const AVATAR_ALT = 'Giovana — MESTTI';
    const TYPING_DELAY_MS = 480;

    function t(key, fallback) {
        let value = fallback;
        if (typeof window.mesttiT === 'function') {
            value = window.mesttiT(key, fallback);
        } else if (window.MesttiI18n && typeof window.MesttiI18n.t === 'function') {
            const lang = window.MESTTI_LANG || 'pt';
            value = window.MesttiI18n.t(lang, key) || fallback;
        }
        if (!value || value === key) return fallback;
        return value;
    }

    function findField(form, names) {
        for (const name of names) {
            const byName = form.querySelector(`[name="${name}"]`);
            if (byName) return byName;
            const byId = form.querySelector(`#${name}`);
            if (byId) return byId;
        }
        return null;
    }

    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function scrollMessages(container) {
        requestAnimationFrame(() => {
            container.scrollTop = container.scrollHeight;
        });
    }

    const MOBILE_CHAT_MAX = 480;

    function isMobileChat() {
        return window.innerWidth <= MOBILE_CHAT_MAX;
    }

    function isIOSDevice() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent)
            || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }

    class ConversationalForm {
        constructor(form) {
            this.form = form;
            this.card = form.closest('.demo-modal-card');
            this.modalContent = form.closest('.modal-content');
            this.steps = this.buildSteps();
            this.stepIndex = 0;
            this.busy = false;
            this.finished = false;
            this.ddiEl = findField(form, ['ddi']);
            this.ddiValue = this.ddiEl?.value || '+55';
            this.messageLog = [];
            this.setupUi();
        }

        storageKey() {
            return `${STORAGE_PREFIX}_${window.location.pathname}_${this.form.id || 'principal'}`;
        }

        getFieldValues() {
            const values = {};
            this.steps.forEach((step) => {
                values[step.key] = step.el.value;
            });
            if (this.ddiEl) values.ddi = this.ddiEl.value;
            return values;
        }

        restoreFieldValues(values) {
            if (!values) return;
            this.steps.forEach((step) => {
                if (values[step.key] !== undefined) {
                    step.el.value = values[step.key];
                }
            });
            if (this.ddiEl && values.ddi) {
                this.ddiEl.value = values.ddi;
                this.ddiValue = values.ddi;
            }
        }

        saveDraft() {
            if (this.finished || this.form.dataset.mesttiSubmitted === '1') return;
            if (!this.messageLog.length) return;

            try {
                sessionStorage.setItem(this.storageKey(), JSON.stringify({
                    stepIndex: this.stepIndex,
                    ddiValue: this.ddiValue,
                    messageLog: this.messageLog,
                    fieldValues: this.getFieldValues()
                }));
            } catch {
                /* ignore quota errors */
            }
        }

        loadDraft() {
            try {
                const raw = sessionStorage.getItem(this.storageKey());
                if (!raw) return null;
                return JSON.parse(raw);
            } catch {
                return null;
            }
        }

        clearDraft() {
            try {
                sessionStorage.removeItem(this.storageKey());
            } catch {
                /* ignore */
            }
        }

        buildSteps() {
            const specs = [
                {
                    key: 'name',
                    names: ['name'],
                    type: 'text',
                    questionKey: 'chat.q.name',
                    errorKey: 'chat.err.name',
                    validate: (value) => value.trim().length >= 2
                },
                {
                    key: 'empresa',
                    names: ['empresa'],
                    type: 'text',
                    questionKey: 'chat.q.company',
                    errorKey: 'chat.err.company',
                    validate: (value) => value.trim().length >= 2
                },
                {
                    key: 'email',
                    names: ['email'],
                    type: 'email',
                    questionKey: 'chat.q.email',
                    errorKey: 'chat.err.email',
                    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
                },
                {
                    key: 'phone',
                    names: ['phone'],
                    type: 'phone',
                    questionKey: 'chat.q.phone',
                    errorKey: 'chat.err.phone',
                    validate: (value) => value.replace(/\D/g, '').length >= 8
                },
                {
                    key: 'cargo',
                    names: ['cargo'],
                    type: 'select',
                    questionKey: 'chat.q.role',
                    errorKey: 'chat.err.required'
                },
                {
                    key: 'setor',
                    names: ['setor'],
                    type: 'select',
                    questionKey: 'chat.q.sector',
                    errorKey: 'chat.err.required'
                },
                {
                    key: 'solucao',
                    names: ['solucao'],
                    type: 'select',
                    questionKey: 'chat.q.solution',
                    errorKey: 'chat.err.required'
                },
                {
                    key: 'observacao',
                    names: ['observacao'],
                    type: 'textarea',
                    questionKey: 'chat.q.note',
                    optional: true
                },
                {
                    key: 'mensagem',
                    names: ['mensagem'],
                    type: 'textarea',
                    questionKey: 'chat.q.message',
                    optional: true
                }
            ];

            return specs
                .map((spec) => {
                    const el = findField(this.form, spec.names);
                    if (!el) return null;
                    const optional = spec.optional || !el.required;
                    return { ...spec, el, optional };
                })
                .filter(Boolean);
        }

        setupUi() {
            this.card?.classList.add('wa-mode');
            this.modalContent?.classList.add('wa-modal-content', 'wa-modal');
            this.form.classList.add('wa-form-hidden');

            this.chatEl = document.createElement('div');
            this.chatEl.className = 'wa-chat';
            this.chatEl.innerHTML = `
                <div class="wa-chat-header">
                    <div class="wa-chat-avatar">
                        <img src="${AVATAR_SRC}" alt="${AVATAR_ALT}" width="40" height="40" loading="lazy" decoding="async">
                    </div>
                    <div class="wa-chat-meta">
                        <p class="wa-chat-name">${t('chat.header.name', 'Giovana')}</p>
                        <p class="wa-chat-status">${t('chat.header.status', 'online')}</p>
                    </div>
                </div>
                <div class="wa-chat-body">
                    <div class="wa-chat-scroll">
                        <div class="wa-messages" role="log" aria-live="polite" aria-relevant="additions"></div>
                        <div class="wa-quick-replies"></div>
                    </div>
                    <div class="wa-composer">
                        <input type="text" class="wa-input" autocomplete="off">
                        <button type="button" class="wa-send" aria-label="${t('chat.send', 'Enviar')}">
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
            this.sendBtn.addEventListener('pointerdown', (event) => {
                if (!this.shouldKeepKeyboard()) return;
                event.preventDefault();
            });
            this.inputEl.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    this.handleSend();
                }
            });
            this.inputEl.addEventListener('focus', () => {
                window.setTimeout(() => this.scrollToBottom(), 100);
                window.setTimeout(() => this.scrollToBottom(), 350);
            });

            this.modalOverlay = this.form.closest('#contactModal');
            this.modalOverlay?.classList.add('modal-overlay--wa-chat');
        }

        scrollToBottom() {
            const target = this.scrollEl || this.messagesEl;
            if (!target) return;
            requestAnimationFrame(() => {
                target.scrollTop = target.scrollHeight;
            });
        }

        shouldKeepKeyboard() {
            return isMobileChat() && !this.finished;
        }

        refocusInput() {
            if (!this.shouldKeepKeyboard()) return;
            const step = this.currentStep();
            if (!step || step.type === 'select') return;
            requestAnimationFrame(() => {
                if (!this.inputEl.disabled) {
                    this.inputEl.focus({ preventScroll: true });
                }
            });
        }

        dismissKeyboard() {
            this.inputEl.blur();
        }

        reset(clearSaved = true) {
            this.stepIndex = 0;
            this.busy = false;
            this.finished = false;
            this.messageLog = [];
            this.ddiValue = this.ddiEl?.value || '+55';
            this.messagesEl.innerHTML = '';
            this.quickRepliesEl.innerHTML = '';
            this.inputEl.value = '';
            this.inputEl.disabled = false;
            this.sendBtn.disabled = false;
            this.composerEl.classList.remove('is-hidden');
            this.form.reset();
            if (this.ddiEl) this.ddiEl.value = this.ddiValue;
            if (clearSaved) this.clearDraft();
        }

        async start() {
            const draft = this.loadDraft();
            if (draft && Array.isArray(draft.messageLog) && draft.messageLog.length > 0) {
                await this.resumeFromDraft(draft);
                return;
            }

            this.reset(false);
            await this.botSay(t('chat.greeting', 'Oi! 👋 Tudo bem? Sou da MESTTI. Só preciso de algumas informações rapidinhas pra agendar sua demonstração.'));
            await this.askCurrentStep();
        }

        async resumeFromDraft(draft) {
            this.stepIndex = draft.stepIndex || 0;
            this.ddiValue = draft.ddiValue || this.ddiEl?.value || '+55';
            this.busy = false;
            this.finished = false;
            this.messageLog = [];
            this.messagesEl.innerHTML = '';
            this.quickRepliesEl.innerHTML = '';
            this.form.reset();
            this.restoreFieldValues(draft.fieldValues);

            this.messageLog = draft.messageLog.slice();
            draft.messageLog.forEach((entry) => {
                this.renderMessage(entry.role, entry.text);
            });

            scrollMessages(this.scrollEl || this.messagesEl);
            await this.setupCurrentStepUi();
        }

        currentStep() {
            return this.steps[this.stepIndex] || null;
        }

        getFirstName() {
            const nameEl = findField(this.form, ['name']);
            const raw = nameEl?.value?.trim() || '';
            if (!raw) return '';
            return raw.split(/\s+/)[0];
        }

        formatFirstName(name) {
            if (!name) return '';
            return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        }

        formatQuestion(step) {
            const base = t(step.questionKey, this.questionFallback(step));
            if (step.key === 'name') return base;

            const firstName = this.formatFirstName(this.getFirstName());
            if (!firstName) return base;

            const namedKey = `${step.questionKey}.named`;
            const named = t(namedKey, '');
            if (named && named !== namedKey) {
                return named.replace(/\{name\}/g, firstName);
            }

            const lower = base.charAt(0).toLowerCase() + base.slice(1);
            return `${firstName}, ${lower}`;
        }

        formatNamedMessage(key, fallback) {
            const firstName = this.formatFirstName(this.getFirstName());
            const template = t(key, fallback);
            if (!firstName) return template;
            const namedKey = `${key}.named`;
            const named = t(namedKey, '');
            if (named && named !== namedKey) {
                return named.replace(/\{name\}/g, firstName);
            }
            return template;
        }

        questionFallback(step) {
            const fallbacks = {
                'chat.q.name': 'Pra começar: qual é seu nome completo?',
                'chat.q.company': 'Legal! Qual o nome da sua empresa?',
                'chat.q.email': 'Qual e-mail a gente pode usar pra te retornar?',
                'chat.q.phone': 'Me passa seu WhatsApp ou telefone? (com DDD)',
                'chat.q.role': 'Qual seu cargo por aí?',
                'chat.q.sector': 'E qual o setor da indústria?',
                'chat.q.solution': 'Qual solução da MESTTI te interessa mais?',
                'chat.q.note': 'Quer deixar alguma observação? Se não, pode pular 😊',
                'chat.q.message': 'Quer mandar mais alguma coisa? (opcional)'
            };
            return fallbacks[step.questionKey] || step.questionKey;
        }

        getAcknowledgment(step, rawValue) {
            if (step.key === 'name') {
                const firstName = this.formatFirstName(rawValue);
                return t('chat.ack.name', `Prazer, ${firstName}! 😊`).replace(/\{name\}/g, firstName);
            }
            if (['email', 'phone', 'empresa'].includes(step.key)) {
                return t('chat.ack.generic', 'Show! 👍');
            }
            return '';
        }

        async askCurrentStep() {
            const step = this.currentStep();
            if (!step) {
                await this.finishConversation();
                return;
            }

            await this.botSay(this.formatQuestion(step));
            await this.setupCurrentStepUi();
        }

        async setupCurrentStepUi() {
            const step = this.currentStep();
            if (!step) return;

            if (step.type === 'select') {
                this.dismissKeyboard();
                this.showSelectOptions(step);
                this.composerEl.classList.add('is-hidden');
                return;
            }

            if (step.type === 'phone' && this.ddiEl) {
                this.showDdiOptions();
            } else {
                this.quickRepliesEl.innerHTML = '';
            }

            if (step.optional) {
                this.showSkipButton();
            }

            this.composerEl.classList.remove('is-hidden');
            this.inputEl.type = step.type === 'email' ? 'email' : 'text';
            this.inputEl.inputMode = step.type === 'email' ? 'email' : step.type === 'phone' ? 'tel' : 'text';
            this.inputEl.placeholder = this.inputPlaceholder(step);
            this.scrollToBottom();
            this.refocusInput();
        }

        inputPlaceholder(step) {
            const placeholders = {
                name: t('modal.name', 'Nome completo'),
                empresa: t('chat.placeholder.company', 'Nome da empresa'),
                email: t('modal.email', 'E-mail profissional'),
                phone: t('modal.phone', 'Telefone / WhatsApp'),
                observacao: t('modal.note', 'Observação (opcional)'),
                mensagem: t('chat.placeholder.message', 'Digite sua mensagem')
            };
            return placeholders[step.key] || '';
        }

        showDdiOptions() {
            const options = Array.from(this.ddiEl.options).map((option) => ({
                value: option.value,
                label: option.textContent.trim()
            }));

            this.quickRepliesEl.innerHTML = '';
            options.forEach((option) => {
                const chip = document.createElement('button');
                chip.type = 'button';
                chip.className = 'wa-chip';
                chip.textContent = option.label;
                if (option.value === this.ddiValue) {
                    chip.style.background = '#075e54';
                    chip.style.color = '#fff';
                }
                chip.addEventListener('click', () => {
                    this.ddiValue = option.value;
                    this.ddiEl.value = option.value;
                    this.quickRepliesEl.querySelectorAll('.wa-chip').forEach((node) => {
                        node.style.background = '';
                        node.style.color = '';
                    });
                    chip.style.background = '#075e54';
                    chip.style.color = '#fff';
                    this.saveDraft();
                    this.inputEl.focus();
                });
                this.quickRepliesEl.appendChild(chip);
            });
            this.scrollToBottom();
        }

        showSelectOptions(step) {
            this.quickRepliesEl.innerHTML = '';
            Array.from(step.el.options).forEach((option) => {
                if (!option.value) return;
                const chip = document.createElement('button');
                chip.type = 'button';
                chip.className = 'wa-chip';
                chip.textContent = option.textContent.trim();
                chip.addEventListener('click', () => this.answerStep(option.textContent.trim(), option.value));
                this.quickRepliesEl.appendChild(chip);
            });
            this.scrollToBottom();
        }

        showSkipButton() {
            const skip = document.createElement('button');
            skip.type = 'button';
            skip.className = 'wa-chip wa-chip--skip';
            skip.textContent = t('chat.skip', 'Pular');
            skip.addEventListener('click', () => this.answerStep(t('chat.skipped', 'Pulado'), '', true));
            this.quickRepliesEl.appendChild(skip);
        }

        async handleSend() {
            if (this.busy || this.finished) return;

            const step = this.currentStep();
            if (!step || step.type === 'select') return;

            const rawValue = this.inputEl.value.trim();
            if (!rawValue && !step.optional) return;

            if (!rawValue && step.optional) {
                await this.answerStep(t('chat.skipped', 'Pulado'), '', true);
                return;
            }

            if (step.validate && !step.validate(rawValue)) {
                await this.botSay(t(step.errorKey, 'Não entendi. Pode tentar de novo?'));
                this.refocusInput();
                return;
            }

            const displayValue = step.type === 'phone' && this.ddiEl
                ? `${this.ddiValue} ${rawValue}`
                : rawValue;

            await this.answerStep(displayValue, rawValue);
        }

        syncProgress(event, completedStep = null) {
            const sync = window.MesttiLead?.syncLeadProgress;
            if (typeof sync !== 'function') return;

            const totalSteps = this.steps.length;
            let chatStepKey = '';
            let stepIndex = 0;

            if (event === 'step_completed' && completedStep) {
                chatStepKey = completedStep.key;
                stepIndex = this.steps.findIndex((s) => s.key === completedStep.key) + 1;
            } else if (event === 'abandoned') {
                const done = Math.min(this.stepIndex, this.steps.length);
                stepIndex = done;
                if (done > 0) {
                    chatStepKey = this.steps[done - 1]?.key || '';
                }
            }

            sync(this.form, this.form.id || 'principal', {
                event,
                chatStepKey,
                stepIndex,
                totalSteps,
                leadSource: event === 'abandoned' ? 'chat_abandoned' : 'chat_progress'
            });
        }

        async answerStep(displayValue, rawValue, skipped = false) {
            const step = this.currentStep();
            if (!step || this.busy) return;

            this.busy = true;
            this.quickRepliesEl.innerHTML = '';
            this.composerEl.classList.remove('is-hidden');
            this.addMessage('user', displayValue);
            this.inputEl.value = '';

            if (!skipped) {
                if (step.type === 'select') {
                    step.el.value = rawValue;
                } else {
                    step.el.value = rawValue;
                    if (step.type === 'phone' && this.ddiEl) {
                        this.ddiEl.value = this.ddiValue;
                    }
                }
                step.el.dispatchEvent(new Event('input', { bubbles: true }));
                step.el.dispatchEvent(new Event('change', { bubbles: true }));
            } else {
                step.el.value = '';
            }

            this.syncProgress('step_completed', step);

            this.stepIndex += 1;
            this.busy = false;
            this.saveDraft();
            this.refocusInput();

            const ack = !skipped ? this.getAcknowledgment(step, rawValue) : '';
            if (ack) {
                await this.botSay(ack);
            }

            await this.askCurrentStep();
        }

        async finishConversation() {
            this.finished = true;
            this.dismissKeyboard();
            this.composerEl.classList.add('is-hidden');
            this.quickRepliesEl.innerHTML = '';

            const submitLeadForm = window.MesttiLead?.submitLeadForm;
            if (typeof submitLeadForm === 'function') {
                await submitLeadForm(this.form, this.form.id || 'principal', {
                    leadSource: 'submit',
                    showSuccessPopup: false,
                    closeOnSuccess: true
                });
            } else {
                await window.MesttiLead?.syncLeadProgress?.(this.form, this.form.id || 'principal', {
                    event: 'submitted',
                    leadSource: 'submit'
                });
            }

            await this.botSay(this.formatNamedMessage(
                'chat.done',
                'Perfeito! Em breve nossa equipe entra em contato com você.'
            ));
            this.clearDraft();
        }

        showRetrySubmit() {
            this.quickRepliesEl.innerHTML = '';
            const retry = document.createElement('button');
            retry.type = 'button';
            retry.className = 'wa-chip';
            retry.textContent = t('chat.retryBtn', 'Tentar novamente');
            retry.addEventListener('click', () => {
                this.quickRepliesEl.innerHTML = '';
                this.finishConversation();
            });
            this.quickRepliesEl.appendChild(retry);
        }

        renderMessage(role, text) {
            const msg = document.createElement('div');
            msg.className = `wa-msg wa-msg--${role}`;

            const avatarHtml = role === 'bot'
                ? `<img src="${AVATAR_SRC}" alt="" class="wa-msg-avatar" width="28" height="28" loading="lazy" decoding="async">`
                : '';

            msg.innerHTML = `
                ${avatarHtml}
                <div class="wa-bubble">
                    ${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
                    <span class="wa-bubble-time">${formatTime(new Date())}</span>
                </div>
            `;
            this.messagesEl.appendChild(msg);
            scrollMessages(this.scrollEl || this.messagesEl);
            return msg;
        }

        addMessage(role, text, record = true) {
            if (record) {
                this.messageLog.push({ role, text });
                this.saveDraft();
            }
            return this.renderMessage(role, text);
        }

        showTyping() {
            const msg = document.createElement('div');
            msg.className = 'wa-msg wa-msg--bot wa-msg--typing-indicator';
            msg.innerHTML = `
                <img src="${AVATAR_SRC}" alt="" class="wa-msg-avatar" width="28" height="28" loading="lazy" decoding="async">
                <div class="wa-bubble wa-bubble--typing">
                    <span></span><span></span><span></span>
                </div>
            `;
            this.messagesEl.appendChild(msg);
            scrollMessages(this.scrollEl || this.messagesEl);
            return msg;
        }

        async botSay(text) {
            const typing = this.showTyping();
            await new Promise((resolve) => setTimeout(resolve, TYPING_DELAY_MS));
            typing.remove();
            this.addMessage('bot', text);
        }
    }

    const instances = new Map();

    function saveAllDrafts() {
        instances.forEach((instance) => instance.saveDraft());
    }

    function initModalForms() {
        const modal = document.getElementById('contactModal');
        if (!modal) return;

        modal.querySelectorAll('.demo-form').forEach((form) => {
            if (instances.has(form)) return;
            instances.set(form, new ConversationalForm(form));
        });

        let wasActive = modal.classList.contains('active');

        const observer = new MutationObserver(() => {
            const isActive = modal.classList.contains('active');
            if (isActive && !wasActive) {
                instances.forEach((instance) => instance.start());
            } else if (!isActive && wasActive) {
                instances.forEach((instance) => {
                    instance.saveDraft();
                    if (
                        instance.messageLog.length > 0
                        && !instance.finished
                        && instance.form.dataset.mesttiSubmitted !== '1'
                    ) {
                        instance.syncProgress('abandoned');
                    }
                });
            }
            wasActive = isActive;
        });

        observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
        bindWaMobileViewport(modal);
    }

    function bindWaMobileViewport(modal) {
        if (!modal || modal.dataset.waViewportBound === '1') return;
        modal.dataset.waViewportBound = '1';

        const content = modal.querySelector('.wa-modal-content');
        if (!content) return;

        let rafId = 0;
        let lastHeight = 0;
        let lastTop = 0;
        let lastLeft = 0;
        let lastWidth = 0;

        function resetViewportStyles() {
            modal.classList.remove('wa-vv-sync');
            modal.style.top = '';
            modal.style.left = '';
            modal.style.width = '';
            modal.style.height = '';
            content.style.height = '';
            content.style.maxHeight = '';
            content.style.transform = '';
            lastHeight = 0;
            lastTop = 0;
            lastLeft = 0;
            lastWidth = 0;
        }

        function applyViewportSync() {
            const isOpen = modal.classList.contains('active');
            const isMobile = isMobileChat();

            if (!isOpen || !isMobile) {
                resetViewportStyles();
                return;
            }

            const vv = window.visualViewport;
            if (!vv) {
                content.style.height = '100dvh';
                content.style.maxHeight = '100dvh';
                return;
            }

            const height = Math.max(280, Math.round(vv.height));
            const offsetTop = Math.max(0, Math.round(vv.offsetTop));
            const offsetLeft = Math.max(0, Math.round(vv.offsetLeft));
            const width = Math.round(vv.width);

            if (
                height === lastHeight
                && offsetTop === lastTop
                && offsetLeft === lastLeft
                && width === lastWidth
                && modal.classList.contains('wa-vv-sync')
            ) {
                return;
            }

            lastHeight = height;
            lastTop = offsetTop;
            lastLeft = offsetLeft;
            lastWidth = width;

            modal.classList.add('wa-vv-sync');
            modal.style.top = `${offsetTop}px`;
            modal.style.left = `${offsetLeft}px`;
            modal.style.width = `${width}px`;
            modal.style.height = `${height}px`;
            content.style.height = '100%';
            content.style.maxHeight = '100%';
            content.style.transform = 'none';
        }

        function syncViewport({ immediate = false } = {}) {
            if (immediate) {
                cancelAnimationFrame(rafId);
                applyViewportSync();
                return;
            }

            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(applyViewportSync);
        }

        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', () => syncViewport());
            window.visualViewport.addEventListener('scroll', () => syncViewport());
        }

        window.addEventListener('resize', () => syncViewport());
        window.addEventListener('orientationchange', () => {
            window.setTimeout(() => syncViewport({ immediate: true }), 120);
        });

        modal.addEventListener('focusin', (event) => {
            if (!event.target.closest('.wa-input, .wa-composer input, textarea')) return;
            syncViewport({ immediate: true });
            window.setTimeout(() => syncViewport(), 280);
        });

        modal.addEventListener('focusout', (event) => {
            if (!event.target.closest('.wa-input, .wa-composer input, textarea')) return;
            if (event.relatedTarget?.closest?.('.wa-send, .wa-chip')) return;
            window.setTimeout(() => syncViewport(), 80);
        });

        let wasModalActive = modal.classList.contains('active');

        const observer = new MutationObserver(() => {
            const isOpen = modal.classList.contains('active');
            if (isOpen === wasModalActive) return;
            wasModalActive = isOpen;

            if (isOpen && isMobileChat()) {
                syncViewport({ immediate: true });
                if (isIOSDevice()) {
                    requestAnimationFrame(() => syncViewport({ immediate: true }));
                }
                return;
            }
            resetViewportStyles();
        });
        observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
    }

    window.MesttiConversationalForm = {
        resetAll() {
            instances.forEach((instance) => instance.reset());
        },
        clearAllDrafts() {
            instances.forEach((instance) => instance.clearDraft());
        },
        saveAllDrafts
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initModalForms);
    } else {
        initModalForms();
    }
})();
