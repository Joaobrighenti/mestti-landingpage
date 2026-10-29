import { Resend } from 'resend';
import {
  normalizeCadastroPayload,
  forwardCadastroToGoogleSheets,
} from '../lib/sheets-sync.js';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const LEADS_TO_EMAIL = process.env.LEADS_TO_EMAIL || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
const GOOGLE_SHEETS_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL || '';

const FORMA_PAGAMENTO = new Set(['boleto', 'pix_automatico', 'cartao_credito']);
const DIA_PAGAMENTO = new Set(['1', '5', '10', '15', '20', '25']);

const FORMA_LABEL = {
  boleto: 'Boleto',
  pix_automatico: 'PIX automático',
  cartao_credito: 'Cartão de crédito',
};

function digits(value) {
  return String(value || '').replace(/\D/g, '');
}

function isTruthyAceite(value) {
  const v = String(value || '').trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'sim' || v === 'yes' || v === 'on';
}

function validateCadastro(payload) {
  const required = [
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
    'formaPagamento',
    'diaPagamento',
    'emailBoletos',
    'emailNotas',
  ];

  for (const key of required) {
    if (!String(payload[key] || '').trim()) {
      return 'required_fields';
    }
  }

  if (digits(payload.cnpj).length !== 14) return 'invalid_cnpj';
  if (digits(payload.representanteCpf).length !== 11) return 'invalid_cpf';
  if (digits(payload.cep).length !== 8) return 'invalid_cep';
  if (!FORMA_PAGAMENTO.has(payload.formaPagamento)) return 'invalid_pagamento';
  if (!DIA_PAGAMENTO.has(payload.diaPagamento)) return 'invalid_dia';
  if (!isTruthyAceite(payload.aceiteTermos)) return 'terms_required';

  const emailOk = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
  if (!emailOk(payload.email) || !emailOk(payload.emailBoletos) || !emailOk(payload.emailNotas)) {
    return 'invalid_email';
  }

  return null;
}

async function sendCadastroEmail(payload) {
  if (!RESEND_API_KEY || !LEADS_TO_EMAIL) {
    return 'skipped';
  }

  const resend = new Resend(RESEND_API_KEY);
  const safe = (v) => (typeof v === 'string' ? v.trim() : '');
  const phoneFull = [safe(payload.ddi), safe(payload.phone)].filter(Boolean).join(' ');
  const endereco = [
    safe(payload.logradouro),
    safe(payload.numero),
    safe(payload.complemento),
    safe(payload.bairro),
    safe(payload.cidade),
    safe(payload.uf),
    safe(payload.cep),
  ]
    .filter(Boolean)
    .join(', ');

  const lines = [
    ['Razão social', safe(payload.razaoSocial)],
    ['Nome fantasia', safe(payload.nomeFantasia)],
    ['CNPJ', safe(payload.cnpj)],
    ['Endereço', endereco],
    ['Representante', safe(payload.representanteNome)],
    ['CPF do representante', safe(payload.representanteCpf)],
    ['Cargo', safe(payload.representanteCargo)],
    ['E-mail', safe(payload.email)],
    ['Telefone', phoneFull],
    ['Forma de pagamento', FORMA_LABEL[payload.formaPagamento] || safe(payload.formaPagamento)],
    ['Dia de pagamento', safe(payload.diaPagamento)],
    ['E-mail boletos', safe(payload.emailBoletos)],
    ['E-mail notas fiscais', safe(payload.emailNotas)],
    ['Aceite dos termos', safe(payload.aceiteTermos)],
    ['Observação', safe(payload.observacao)],
    ['Página', safe(payload.pagePath)],
  ].filter(([, v]) => v);

  const text = lines.map(([k, v]) => `${k}: ${v}`).join('\n');
  const html = `
    <div style="font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; line-height: 1.5;">
      <h2 style="margin:0 0 12px;">Novo cadastro (contrato)</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 720px;">
        <tbody>
          ${lines
            .map(
              ([k, v]) => `
            <tr>
              <td style="padding:6px 10px; border:1px solid #e5e7eb; font-weight:600; width:38%;">${k}</td>
              <td style="padding:6px 10px; border:1px solid #e5e7eb;">${String(v)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')}</td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: LEADS_TO_EMAIL,
    subject: `Novo cadastro (contrato) — ${safe(payload.razaoSocial) || 'MESTTI'}`,
    text,
    html,
  });

  return 'sent';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  try {
    const raw = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const payload = normalizeCadastroPayload(raw);

    if (!payload.timestamp) {
      payload.timestamp = new Date().toISOString();
    }
    if (!payload.formId) payload.formId = 'cadastro';
    if (!payload.pagePath) payload.pagePath = '/cadastro/';
    if (isTruthyAceite(payload.aceiteTermos)) {
      payload.aceiteTermos = 'sim';
    }

    const error = validateCadastro(payload);
    if (error) {
      return res.status(400).json({ ok: false, error });
    }

    let sheetsStatus = 'skipped';
    try {
      const sheets = await forwardCadastroToGoogleSheets(payload, GOOGLE_SHEETS_WEBHOOK_URL);
      sheetsStatus = sheets.skipped ? 'skipped' : 'synced';
    } catch {
      return res.status(502).json({ ok: false, error: 'sheets_sync_failed' });
    }

    let emailStatus = 'skipped';
    try {
      emailStatus = await sendCadastroEmail(payload);
    } catch {
      emailStatus = 'failed';
    }

    return res.status(200).json({ ok: true, sheets: sheetsStatus, email: emailStatus });
  } catch {
    return res.status(500).json({ ok: false, error: 'cadastro_failed' });
  }
}
