import { normalizeLeadProgressPayload, forwardLeadToGoogleSheets } from '../lib/sheets-sync.js';

const GOOGLE_SHEETS_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL || '';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  try {
    const raw = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const payload = normalizeLeadProgressPayload(raw);

    if (!payload.sessionId) {
      return res.status(400).json({ ok: false, error: 'session_id_required' });
    }

    const result = await forwardLeadToGoogleSheets(payload, GOOGLE_SHEETS_WEBHOOK_URL);
    return res.status(200).json({ ok: true, sheets: result.skipped ? 'skipped' : 'synced' });
  } catch {
    return res.status(502).json({ ok: false, error: 'sheets_sync_failed' });
  }
}
