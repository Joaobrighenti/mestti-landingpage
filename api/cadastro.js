import { randomUUID } from 'node:crypto';
import { isIP } from 'node:net';
import { Resend } from 'resend';
import {
  normalizeCadastroPayload,
  forwardCadastroToGoogleSheets,
} from '../lib/sheets-sync.js';

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
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const LEADS_TO_EMAIL = process.env.LEADS_TO_EMAIL;
  const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
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

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: LEADS_TO_EMAIL,
    subject: `Novo cadastro (contrato) — ${safe(payload.razaoSocial) || 'MESTTI'}`,
    text,
    html,
  });

  return error ? 'failed' : 'sent';
}

function getCadastroVisitorIp(req) {
  // Na Vercel, o endereço vem da infraestrutura. No Express, vem da conexão.
  const rawIp = process.env.VERCEL === '1'
    ? req.headers?.['x-vercel-forwarded-for']
    : req.socket?.remoteAddress;
  const ip = typeof rawIp === 'string' ? rawIp.trim() : '';
  return isIP(ip) ? ip : null;
}

async function saveInMestti(data, submissionId, visitorIp) {
  const url = process.env.MESTTI_CONTRACT_API_URL?.trim();
  const key = process.env.CONTRACT_REGISTRATION_SITE_KEY?.trim();
  if (!url || !key) throw new Error('cadastro_integration_unconfigured');

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
      ...(visitorIp ? { 'X-Mestti-Cadastro-Client-IP': visitorIp } : {}),
    },
    body: JSON.stringify({ ...data, submissionId }),
    redirect: 'error',
    signal: AbortSignal.timeout(7000),
  });
}

async function syncLegacyDestinations(payload) {
  const sheets = forwardCadastroToGoogleSheets(
    payload, process.env.GOOGLE_SHEETS_WEBHOOK_URL, 3000,
  ).then((result) => result.skipped ? 'skipped' : 'synced').catch(() => 'failed');

  let timeout;
  try {
    const email = Promise.race([
      sendCadastroEmail(payload).catch(() => 'failed'),
      new Promise((resolve) => { timeout = setTimeout(() => resolve('failed'), 3000); }),
    ]);
    return await Promise.all([sheets, email]);
  } finally {
    clearTimeout(timeout);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  res.setHeader('Cache-Control', 'no-store');
  let raw;
  try {
    raw = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) || {};
  } catch {
    return res.status(400).json({ ok: false, error: 'required_fields' });
  }

  try {
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

    const contractData = { ...payload };
    delete contractData.timestamp;
    delete contractData.formId;
    delete contractData.pagePath;
    const submissionId = raw.submissionId || randomUUID();
    const stored = await saveInMestti(contractData, submissionId, getCadastroVisitorIp(req));
    if (stored.status === 429) {
      const retryAfter = stored.headers.get('Retry-After');
      if (retryAfter && /^\d+$/.test(retryAfter)) res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({ ok: false, error: 'too_many_submissions' });
    }
    if (stored.status === 422) {
      return res.status(400).json({ ok: false, error: 'invalid_data' });
    }
    if (stored.status !== 200 && stored.status !== 201) {
      console.error('[cadastro] gravação recusada', { status: stored.status });
      return res.status(502).json({ ok: false, error: 'cadastro_failed' });
    }

    const receipt = await stored.json();
    if (receipt?.id !== String(submissionId).toLowerCase()) {
      throw new Error('cadastro_receipt_invalid');
    }

    // Só o primeiro envio dispara as integrações legadas.
    if (stored.status === 200) return res.status(200).json({ ok: true });
    const [sheets, email] = await syncLegacyDestinations(payload);
    if (sheets === 'failed' || email === 'failed') {
      console.warn('[cadastro] falha após gravação', { sheets, email });
    }
    return res.status(200).json({ ok: true });
  } catch {
    console.error('[cadastro] falha na integração com a Mestti');
    return res.status(502).json({ ok: false, error: 'cadastro_failed' });
  }
}
