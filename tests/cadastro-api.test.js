import assert from 'node:assert/strict';
import test from 'node:test';
import handler from '../api/cadastro.js';

const apiUrl = 'https://api.example.com/api/v1/integrations/website/contract-registrations';
const webhook = 'https://example.com/sheets';
const payload = {
  submissionId: '86343e9a-2b94-4f78-ae0d-b17761af382c',
  razaoSocial: 'Indústria de Teste',
  cnpj: '12.345.678/0001-90',
  cep: '01234-567',
  logradouro: 'Rua de Teste',
  numero: 'S/N',
  bairro: 'Centro',
  cidade: 'Curitiba',
  uf: 'PR',
  representanteNome: 'Pessoa de Teste',
  representanteCpf: '123.456.789-00',
  email: 'pessoa@example.com',
  phone: '(41) 99999-9999',
  formaPagamento: 'pix_automatico',
  diaPagamento: '10',
  emailBoletos: 'financeiro@example.com',
  emailNotas: 'fiscal@example.com',
  aceiteTermos: 'sim',
};

async function submit(t, fetchMock, { vercel = '', ...request } = {}) {
  t.mock.method(globalThis, 'fetch', fetchMock);
  const env = {
    MESTTI_CONTRACT_API_URL: apiUrl,
    CONTRACT_REGISTRATION_SITE_KEY: 'test-site-key',
    GOOGLE_SHEETS_WEBHOOK_URL: webhook,
    RESEND_API_KEY: '',
    VERCEL: vercel,
  };
  const original = { ...process.env };
  Object.assign(process.env, env);
  const response = {
    headers: {},
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.code = code; return this; },
    json(data) { this.data = data; return this; },
  };
  try {
    return await handler({ method: 'POST', body: payload, ...request }, response);
  } finally {
    for (const key of Object.keys(env)) {
      if (original[key] === undefined) delete process.env[key];
      else process.env[key] = original[key];
    }
  }
}

test('confirma a gravação na Mestti mesmo que a planilha falhe', async (t) => {
  const urls = [];
  const response = await submit(t, async (url, options) => {
    urls.push(url);
    if (url === apiUrl) {
      assert.equal(options.headers.Authorization, 'Bearer test-site-key');
      assert.equal(options.redirect, 'error');
      assert.equal(JSON.parse(options.body).representanteCpf, payload.representanteCpf);
      assert.equal(JSON.parse(options.body).submissionId, payload.submissionId);
      return Response.json({ id: payload.submissionId }, { status: 201 });
    }
    return new Response(null, { status: 502 });
  });
  assert.deepEqual(urls, [apiUrl, webhook]);
  assert.equal(response.code, 200);
  assert.deepEqual(response.data, { ok: true });
});

test('falha de gravação não confirma envio nem tenta a planilha', async (t) => {
  const urls = [];
  const response = await submit(t, async (url) => {
    urls.push(url);
    return new Response(null, { status: 503 });
  });
  assert.deepEqual(urls, [apiUrl]);
  assert.equal(response.code, 502);
  assert.deepEqual(response.data, { ok: false, error: 'cadastro_failed' });
});

test('repetição confirmada não duplica integrações legadas', async (t) => {
  const urls = [];
  const response = await submit(t, async (url) => {
    urls.push(url);
    return Response.json({ id: payload.submissionId });
  });
  assert.deepEqual(urls, [apiUrl]);
  assert.equal(response.code, 200);
});

test('HTTP 200 sem recibo do cadastro não é confirmação', async (t) => {
  const response = await submit(t, async () => Response.json({ ok: true }));
  assert.equal(response.code, 502);
});


test('repassa o 429 e a espera sem chamar planilha ou e-mail', async (t) => {
  const urls = [];
  const response = await submit(t, async (url) => {
    urls.push(url);
    return new Response(null, { status: 429, headers: { 'Retry-After': '240' } });
  });
  assert.deepEqual(urls, [apiUrl]);
  assert.equal(response.code, 429);
  assert.equal(response.headers['Retry-After'], '240');
  assert.deepEqual(response.data, { ok: false, error: 'too_many_submissions' });
});

test('Express usa o IP da conexão e ignora cabeçalhos enviados pelo visitante', async (t) => {
  let visitorIp;
  const response = await submit(t, async (_, options) => {
    visitorIp = options.headers['X-Mestti-Cadastro-Client-IP'];
    return Response.json({ id: payload.submissionId });
  }, {
    headers: {
      'x-vercel-forwarded-for': '198.51.100.9',
      'x-forwarded-for': '198.51.100.10',
      'x-mestti-cadastro-client-ip': '198.51.100.11',
    },
    socket: { remoteAddress: '127.0.0.1' },
  });
  assert.equal(response.code, 200);
  assert.equal(visitorIp, '127.0.0.1');
});

test('na Vercel usa o cabeçalho de IP da plataforma', async (t) => {
  let visitorIp;
  const response = await submit(t, async (_, options) => {
    visitorIp = options.headers['X-Mestti-Cadastro-Client-IP'];
    return Response.json({ id: payload.submissionId });
  }, {
    vercel: '1',
    headers: { 'x-vercel-forwarded-for': '2001:db8::1', 'x-mestti-cadastro-client-ip': '198.51.100.1' },
    socket: { remoteAddress: '127.0.0.1' },
  });
  assert.equal(response.code, 200);
  assert.equal(visitorIp, '2001:db8::1');
});
