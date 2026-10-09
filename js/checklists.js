/**
 * LP /checklists/: etapas do formulário, eventos e anexo opcional.
 * A pontuação do lead é calculada no servidor (lib/checklist-lead-score.js).
 */
(function () {
    const form = document.getElementById('checklistForm');
    if (!form) return;

    const MAX_BYTES = Math.floor(1.5 * 1024 * 1024);
    const ALLOWED_EXT = ['.pdf', '.jpg', '.jpeg', '.png', '.webp', '.csv', '.xls', '.xlsx'];
    const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'];

    const step1 = form.querySelector('[data-step-panel="1"]');
    const step2 = form.querySelector('[data-step-panel="2"]');
    const progress = form.querySelector('[data-progress]');
    const success = document.getElementById('checklistSuccess');
    const fileInput = form.querySelector('[name="checklist_arquivo"]');
    let started = false;

    function track(eventName, params) {
        const detail = params || {};
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: eventName, page: '/checklists/', ...detail });
        if (typeof window.gtag === 'function') window.gtag('event', eventName, detail);
        if (window.MesttiMeta?.hasConsent?.() && typeof window.fbq === 'function') {
            window.fbq('trackCustom', eventName, detail);
        }
    }

    function rememberCampaign() {
        const params = new URLSearchParams(window.location.search);
        const found = UTM_KEYS
            .map((key) => (params.get(key) ? `${key}=${params.get(key)}` : ''))
            .filter(Boolean)
            .join('; ')
            .slice(0, 500);
        if (!found) return;
        try { sessionStorage.setItem('mestti_checklists_utm', found); } catch { /* ignore */ }
    }

    function campaign() {
        try { return sessionStorage.getItem('mestti_checklists_utm') || ''; } catch { return ''; }
    }

    function maskPhone(raw) {
        let digits = String(raw || '').replace(/\D/g, '').replace(/^0+/, '');
        if (digits.startsWith('55') && digits.length > 11) digits = digits.slice(2);
        digits = digits.slice(0, 11);
        if (!digits) return '';
        if (digits.length <= 2) return `(${digits}`;
        if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }

    function fieldError(name, message) {
        const field = form.querySelector(`[name="${name}"]`)?.closest('.ck-field, .ck-file');
        if (!field) return;
        field.classList.toggle('is-invalid', Boolean(message));
        const error = field.querySelector('.ck-error');
        if (error) error.textContent = message || '';
    }

    function clearErrors(panel) {
        panel.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
        panel.querySelectorAll('.ck-error').forEach((el) => { el.textContent = ''; });
    }

    function selected(name) {
        return form.querySelector(`[name="${name}"]`)?.value?.trim() || '';
    }

    function validateStep1() {
        clearErrors(step1);
        let ok = true;
        ['setor', 'cargo', 'checklist_hoje', 'volume_mensal', 'desafio'].forEach((name) => {
            if (!selected(name)) {
                fieldError(name, 'Selecione uma opção.');
                ok = false;
            }
        });
        if (!ok) step1.querySelector('.is-invalid input, .is-invalid select')?.focus();
        return ok;
    }

    function validateStep2() {
        clearErrors(step2);
        let ok = true;
        const name = selected('name');
        const empresa = selected('empresa');
        const email = selected('email');
        const phone = selected('phone').replace(/\D/g, '');
        if (name.length < 2) {
            fieldError('name', 'Informe seu nome.');
            ok = false;
        }
        if (empresa.length < 2) {
            fieldError('empresa', 'Informe a empresa.');
            ok = false;
        }
        if (phone.length < 10 || phone.length > 11) {
            fieldError('phone', 'Informe um WhatsApp com DDD.');
            ok = false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            fieldError('email', 'Informe um e-mail profissional válido.');
            ok = false;
        }
        if (!selected('unidades')) {
            fieldError('unidades', 'Selecione uma opção.');
            ok = false;
        }
        const fileMessage = fileProblem();
        if (fileMessage) {
            fieldError('checklist_arquivo', fileMessage);
            ok = false;
        }
        if (!ok) step2.querySelector('.is-invalid input, .is-invalid select')?.focus();
        return ok;
    }

    function fileProblem() {
        const file = fileInput?.files?.[0];
        if (!file) return '';
        const ext = (file.name.match(/\.[a-z0-9]+$/i) || [''])[0].toLowerCase();
        if (!ALLOWED_EXT.includes(ext)) return 'Use PDF, imagem ou planilha.';
        if (file.size > MAX_BYTES) return 'O arquivo precisa ter até 1,5 MB.';
        return '';
    }

    function showStep(step) {
        const second = step === 2;
        form.dataset.step = String(step);
        step1.hidden = second;
        step2.hidden = !second;
        if (progress) progress.textContent = second ? 'Etapa 2 de 2' : 'Etapa 1 de 2';
        const focus = (second ? step2 : step1).querySelector('select, input');
        focus?.focus();
    }

    function readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const value = String(reader.result || '');
                const data = value.slice(value.indexOf(',') + 1);
                resolve({ name: file.name, type: file.type || 'application/octet-stream', data });
            };
            reader.onerror = () => reject(new Error('file_read'));
            reader.readAsDataURL(file);
        });
    }

    function fillQualification() {
        const desafio = selected('desafio');
        form.querySelector('[name="mensagem"]').value = desafio;
        form.querySelector('[name="checklistHoje"]').value = selected('checklist_hoje');
        form.querySelector('[name="volumeMensal"]').value = selected('volume_mensal');
        form.querySelector('[name="unidadesPayload"]').value = selected('unidades');
        form.querySelector('[name="utm"]').value = campaign();
        form.querySelector('[name="anexoNome"]').value = fileInput?.files?.[0]?.name || '';
    }

    rememberCampaign();
    track('lp_page_view');

    document.querySelectorAll('[data-cta]').forEach((el) => {
        el.addEventListener('click', () => track('cta_click', { cta: el.getAttribute('data-cta') || 'formulario' }));
    });

    form.addEventListener('focusin', () => {
        if (started) return;
        started = true;
        track('form_start');
    });

    const phone = form.querySelector('[name="phone"]');
    phone?.addEventListener('input', () => {
        phone.value = maskPhone(phone.value);
        fieldError('phone', '');
    });

    form.querySelectorAll('select, input').forEach((field) => {
        field.addEventListener('change', () => fieldError(field.name, ''));
    });

    form.querySelector('[data-next]').addEventListener('click', () => {
        if (!validateStep1()) return;
        showStep(2);
        track('form_step_1');
    });

    form.querySelector('[data-back]').addEventListener('click', () => showStep(1));

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (form.dataset.step !== '2' || !validateStep2()) return;
        if (form.dataset.mesttiSubmitting === '1') return;

        fillQualification();
        form._checklistAnexo = null;
        const file = fileInput?.files?.[0];
        if (file) {
            try {
                form._checklistAnexo = await readFile(file);
            } catch {
                fieldError('checklist_arquivo', 'Não foi possível ler o arquivo. Tente outro.');
                track('form_error', { reason: 'anexo' });
                return;
            }
        }

        const ok = await window.submitLeadForm?.(form, 'checklists', {
            leadSource: 'submit',
            showSuccessPopup: false,
            closeOnSuccess: false,
            successTitle: 'Demonstração solicitada',
            successMessage: 'Nossa equipe vai entrar em contato para preparar a demonstração.'
        });

        if (!ok) {
            track('form_error', { reason: 'envio' });
            return;
        }

        track('form_submit');
        form.hidden = true;
        if (success) success.hidden = false;
    });

    const cases = document.getElementById('ckCases');
    const prev = document.querySelector('[data-cases="prev"]');
    const next = document.querySelector('[data-cases="next"]');
    if (cases && prev && next) {
        const step = () => Math.max(cases.clientWidth * 0.8, 240);
        const sync = () => {
            prev.disabled = cases.scrollLeft <= 4;
            next.disabled = cases.scrollLeft + cases.clientWidth >= cases.scrollWidth - 4;
        };
        prev.addEventListener('click', () => cases.scrollBy({ left: -step(), behavior: 'smooth' }));
        next.addEventListener('click', () => cases.scrollBy({ left: step(), behavior: 'smooth' }));
        cases.addEventListener('scroll', sync, { passive: true });
        cases.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowRight') next.click();
            if (event.key === 'ArrowLeft') prev.click();
        });
        sync();
    }
})();
