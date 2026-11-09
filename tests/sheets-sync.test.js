import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { forwardLeadToGoogleSheets, forwardCadastroToGoogleSheets } from '../lib/sheets-sync.js';

test('envia dados de cadastro no corpo POST, sem acrescentar dados pessoais à URL', async () => {
  let request;
  mock.method(globalThis, 'fetch', async (url, options) => {
    request = { url, options };
    return { ok: true, status: 200, text: async () => '{"status":"success"}' };
  });
  try {
    assert.deepEqual(await forwardCadastroToGoogleSheets({ representanteCpf: '11122233344' }, 'https://example.com/exec'), { synced: true });
    assert.equal(request.url, 'https://example.com/exec');
    assert.equal(request.options.method, 'POST');
    assert.deepEqual(JSON.parse(request.options.body), { representanteCpf: '11122233344', sheet: 'cadastro' });
  } finally { mock.restoreAll(); }
});
test('resposta de erro do Apps Script não é considerada sucesso', async () => {
  mock.method(globalThis, 'fetch', async () => ({ok: true, text: async () => '{"status":"error"}'}));
  try { await assert.rejects(forwardLeadToGoogleSheets({name:'Teste'}, 'https://example.com/exec'), /sheets_response_error/); }
  finally { mock.restoreAll(); }
});

test('endpoint recusa progresso parcial antes de encaminhar para planilha', async () => {
  const { default: handler } = await import('../api/lead-progress.js');
  const response = { code: 0, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; }, setHeader() {} };
  await handler({ method: 'POST', body: { sessionId: 'test', event: 'step_completed', name: 'Teste' } }, response);
  assert.equal(response.code, 400);
  assert.equal(response.body.error, 'only_completed_submissions');
});
