const LEAD_FIELDS = [
  'sessionId',
  'timestamp',
  'event',
  'chatStep',
  'chatStepKey',
  'stepIndex',
  'totalSteps',
  'name',
  'email',
  'phone',
  'ddi',
  'empresa',
  'cargo',
  'setor',
  'solucao',
  'mensagem',
  'observacao',
  'pagePath',
  'leadSource',
  'formId',
];

function normalizePayload(raw, fields) {
  const input = raw && typeof raw === 'object' ? raw : {};
  const out = {};

  for (const key of fields) {
    const val = input[key];
    if (val === undefined || val === null) {
      out[key] = '';
    } else if (typeof val === 'number') {
      out[key] = String(val);
    } else {
      out[key] = String(val).trim();
    }
  }

  return out;
}

export function normalizeLeadProgressPayload(raw) {
  return normalizePayload(raw, LEAD_FIELDS);
}

export async function forwardLeadToGoogleSheets(payload, webhookUrl) {
  const url = (webhookUrl || '').trim();
  if (!url) {
    return { skipped: true };
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(payload)) {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      params.set(key, String(value));
    }
  }

  const separator = url.includes('?') ? '&' : '?';
  const target = `${url}${separator}${params.toString()}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch(target, { method: 'GET', redirect: 'follow', signal: controller.signal });
    await res.text();

    if (!res.ok) {
      throw new Error(`sheets_http_${res.status}`);
    }

    return { synced: true };
  } finally {
    clearTimeout(timeout);
  }
}
