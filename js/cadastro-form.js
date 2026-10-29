/**
 * Formulário de cadastro contratual → POST /api/cadastro
 */
(function () {
  const form = document.getElementById('cadastroForm');
  if (!form) return;

  const UF_LIST = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
    'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
    'SP', 'SE', 'TO',
  ];

  const ufSelect = form.querySelector('[name="uf"]');
  if (ufSelect && ufSelect.options.length <= 1) {
    UF_LIST.forEach((uf) => {
      const opt = document.createElement('option');
      opt.value = uf;
      opt.textContent = uf;
      ufSelect.appendChild(opt);
    });
  }

  function onlyDigits(value) {
    return String(value || '').replace(/\D/g, '');
  }

  function maskCnpj(value) {
    const d = onlyDigits(value).slice(0, 14);
    return d
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }

  function maskCpf(value) {
    const d = onlyDigits(value).slice(0, 11);
    return d
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1-$2');
  }

  function maskCep(value) {
    const d = onlyDigits(value).slice(0, 8);
    return d.replace(/^(\d{5})(\d)/, '$1-$2');
  }

  function maskPhone(value) {
    const d = onlyDigits(value).slice(0, 11);
    if (d.length <= 10) {
      return d
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return d
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }

  function bindMask(selector, maskFn) {
    const el = form.querySelector(selector);
    if (!el) return;
    el.addEventListener('input', () => {
      const start = el.selectionStart;
      const before = el.value.length;
      el.value = maskFn(el.value);
      const after = el.value.length;
      if (typeof start === 'number') {
        const next = Math.max(0, start + (after - before));
        try {
          el.setSelectionRange(next, next);
        } catch {
          /* ignore */
        }
      }
    });
  }

  bindMask('[name="cnpj"]', maskCnpj);
  bindMask('[name="representanteCpf"]', maskCpf);
  bindMask('[name="cep"]', maskCep);
  bindMask('[name="phone"]', maskPhone);

  let cepTimer = null;
  const cepInput = form.querySelector('[name="cep"]');
  if (cepInput) {
    cepInput.addEventListener('input', () => {
      clearTimeout(cepTimer);
      const cep = onlyDigits(cepInput.value);
      if (cep.length !== 8) return;
      cepTimer = setTimeout(async () => {
        try {
          const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const data = await res.json();
          if (!data || data.erro) return;
          const setIfEmpty = (name, value) => {
            const el = form.querySelector(`[name="${name}"]`);
            if (el && value && !el.value.trim()) el.value = value;
          };
          setIfEmpty('logradouro', data.logradouro);
          setIfEmpty('bairro', data.bairro);
          setIfEmpty('cidade', data.localidade);
          if (ufSelect && data.uf) ufSelect.value = data.uf;
        } catch {
          /* ViaCEP opcional */
        }
      }, 350);
    });
  }

  function clearInvalid() {
    form.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
  }

  function markInvalid(el) {
    if (el) el.classList.add('is-invalid');
  }

  function validate() {
    clearInvalid();
    let ok = true;
    const requiredNames = [
      'razaoSocial',
      'cnpj',
      'cep',
      'logradouro',
      'numero',
      'bairro',
      'cidade',
      'uf',
      'representanteNome',
      'representanteCpf',
      'email',
      'phone',
      'diaPagamento',
    ];

    requiredNames.forEach((name) => {
      const el = form.querySelector(`[name="${name}"]`);
      if (!el || !String(el.value || '').trim()) {
        markInvalid(el);
        ok = false;
      }
    });

    const cnpj = form.querySelector('[name="cnpj"]');
    if (cnpj && onlyDigits(cnpj.value).length !== 14) {
      markInvalid(cnpj);
      ok = false;
    }

    const cpf = form.querySelector('[name="representanteCpf"]');
    if (cpf && onlyDigits(cpf.value).length !== 11) {
      markInvalid(cpf);
      ok = false;
    }

    const cep = form.querySelector('[name="cep"]');
    if (cep && onlyDigits(cep.value).length !== 8) {
      markInvalid(cep);
      ok = false;
    }

    const emailOk = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
    const email = form.querySelector('[name="email"]');
    if (email && !emailOk(email.value)) {
      markInvalid(email);
      ok = false;
    }

    const financeiroMesmo = form.querySelector('[name="emailFinanceiroMesmo"]:checked')?.value || 'sim';
    if (financeiroMesmo === 'nao') {
      const emailFinanceiro = form.querySelector('[name="emailFinanceiro"]');
      if (!emailFinanceiro || !emailOk(emailFinanceiro.value)) {
        markInvalid(emailFinanceiro);
        ok = false;
      }
    }

    const pay = form.querySelector('[name="formaPagamento"]:checked');
    if (!pay) {
      markInvalid(form.querySelector('.cadastro-pay-options'));
      ok = false;
    }

    const terms = form.querySelector('[name="aceiteTermos"]');
    if (!terms?.checked) {
      markInvalid(form.querySelector('.cadastro-terms'));
      ok = false;
    }

    if (!ok) {
      const first = form.querySelector('.is-invalid');
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      first?.focus?.();
    }

    return ok;
  }

  function resolveFinanceiroEmail() {
    const corporativo = form.querySelector('[name="email"]')?.value?.trim() || '';
    const mesmo = form.querySelector('[name="emailFinanceiroMesmo"]:checked')?.value || 'sim';
    if (mesmo === 'sim') return corporativo;
    return form.querySelector('[name="emailFinanceiro"]')?.value?.trim() || '';
  }

  function collectPayload() {
    const val = (name) => form.querySelector(`[name="${name}"]`)?.value?.trim() || '';
    const pay = form.querySelector('[name="formaPagamento"]:checked')?.value || '';
    const terms = form.querySelector('[name="aceiteTermos"]')?.checked ? 'sim' : '';
    const financeiro = resolveFinanceiroEmail();

    return {
      timestamp: new Date().toISOString(),
      formId: 'cadastro',
      pagePath: window.location.pathname || '/cadastro/',
      razaoSocial: val('razaoSocial'),
      nomeFantasia: val('nomeFantasia'),
      cnpj: val('cnpj'),
      cep: val('cep'),
      logradouro: val('logradouro'),
      numero: val('numero'),
      complemento: val('complemento'),
      bairro: val('bairro'),
      cidade: val('cidade'),
      uf: val('uf'),
      representanteNome: val('representanteNome'),
      representanteCpf: val('representanteCpf'),
      representanteCargo: val('representanteCargo'),
      email: val('email'),
      ddi: val('ddi') || '+55',
      phone: val('phone'),
      formaPagamento: pay,
      diaPagamento: val('diaPagamento'),
      emailBoletos: financeiro,
      emailNotas: financeiro,
      aceiteTermos: terms,
      observacao: val('observacao'),
    };
  }

  const financeiroWrap = form.querySelector('#emailFinanceiroWrap');
  const emailFinanceiroInput = form.querySelector('[name="emailFinanceiro"]');

  function syncFinanceiroVisibility() {
    const mesmo = form.querySelector('[name="emailFinanceiroMesmo"]:checked')?.value || 'sim';
    const showExtra = mesmo === 'nao';
    if (financeiroWrap) financeiroWrap.hidden = !showExtra;
    if (emailFinanceiroInput) {
      emailFinanceiroInput.required = showExtra;
      if (!showExtra) {
        emailFinanceiroInput.value = '';
        emailFinanceiroInput.classList.remove('is-invalid');
      }
    }
  }

  form.querySelectorAll('[name="emailFinanceiroMesmo"]').forEach((radio) => {
    radio.addEventListener('change', syncFinanceiroVisibility);
  });
  syncFinanceiroVisibility();

  const ERROR_MESSAGES = {
    required_fields: 'Preencha todos os campos obrigatórios.',
    invalid_cnpj: 'CNPJ inválido.',
    invalid_cpf: 'CPF do representante inválido.',
    invalid_cep: 'CEP inválido.',
    invalid_pagamento: 'Selecione a forma de pagamento.',
    invalid_dia: 'Selecione o dia de pagamento.',
    terms_required: 'É necessário aceitar os termos de uso.',
    invalid_email: 'E-mail inválido.',
    sheets_sync_failed: 'Não foi possível gravar o cadastro. Tente novamente.',
    cadastro_failed: 'Não foi possível enviar. Tente novamente em instantes.',
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form.dataset.submitting === '1') return;
    if (!validate()) return;

    const submitBtn = form.querySelector('[type="submit"]');
    const originalLabel = submitBtn?.textContent || 'Enviar cadastro';
    form.dataset.submitting = '1';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
    }

    try {
      const res = await fetch('/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collectPayload()),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        console.error('[cadastro]', { status: res.status, error: data.error || 'unknown' });
        const msg = ERROR_MESSAGES[data.error] || ERROR_MESSAGES.cadastro_failed;
        if (typeof window.openMesttiPopup === 'function') {
          window.openMesttiPopup({ title: 'Não foi possível enviar', message: msg, variant: 'error' });
        } else {
          alert(msg);
        }
        return;
      }

      form.reset();
      if (data.sheets === 'skipped') {
        console.warn('[cadastro] sheets skipped — configure GOOGLE_SHEETS_WEBHOOK_URL no .env');
      }
      const successMessage =
        'Recebemos seus dados. Nossa equipe vai preparar o contrato e entrar em contato.';
      if (typeof window.openMesttiPopup === 'function') {
        window.openMesttiPopup({
          title: 'Cadastro recebido',
          message: successMessage,
        });
      } else {
        alert(successMessage);
      }
    } catch {
      const msg = ERROR_MESSAGES.cadastro_failed;
      if (typeof window.openMesttiPopup === 'function') {
        window.openMesttiPopup({ title: 'Não foi possível enviar', message: msg, variant: 'error' });
      } else {
        alert(msg);
      }
    } finally {
      form.dataset.submitting = '';
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    }
  });
})();
