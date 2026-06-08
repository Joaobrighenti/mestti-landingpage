import { normalizeClickTrackPayload, forwardLeadToGoogleSheets } from '../lib/sheets-sync.js';

const GOOGLE_SHEETS_DADOS_WEBHOOK_URL = process.env.GOOGLE_SHEETS_DADOS_WEBHOOK_URL || '';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  try {
    const raw = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const payload = normalizeClickTrackPayload(raw);

    if (!payload.sessionId) {
      return res.status(400).json({ ok: false, error: 'session_id_required' });
    }

    if (!payload.trackId) {
      return res.status(400).json({ ok: false, error: 'track_id_required' });
    }

    if (!GOOGLE_SHEETS_DADOS_WEBHOOK_URL) {
      return res.status(200).json({ ok: true, sheets: 'skipped', reason: 'dados_webhook_not_configured' });
    }

    const result = await forwardLeadToGoogleSheets(payload, GOOGLE_SHEETS_DADOS_WEBHOOK_URL);
    return res.status(200).json({
      ok: true,
      sheets: result.skipped ? 'skipped' : 'synced',
      savedToDados: Boolean(result.savedToDados),
    });
  } catch {
    return res.status(502).json({ ok: false, error: 'sheets_sync_failed' });
  }
}
