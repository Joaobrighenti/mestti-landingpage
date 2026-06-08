/**
 * MESTTI — Web App SOMENTE para cliques (aba "dados").
 *
 * Implante este script em um projeto Apps Script SEPARADO do script de Leads,
 * vinculado à MESMA planilha. Use a URL /exec em GOOGLE_SHEETS_DADOS_WEBHOOK_URL.
 */

const SHEET_DADOS = 'dados';

const DADOS_HEADERS = [
  'timestamp',
  'sessionId',
  'trackId',
  'elementType',
  'label',
  'href',
  'pagePath',
  'pageTitle',
];

function doGet(e) {
  return handleClickTrack_(e && e.parameter ? e.parameter : {});
}

function doPost(e) {
  var params = {};
  try {
    if (e && e.postData && e.postData.contents) {
      params = JSON.parse(e.postData.contents);
    }
  } catch (err) {
    return jsonResponse_({ status: 'error', message: 'invalid_json' });
  }
  return handleClickTrack_(params);
}

function handleClickTrack_(params) {
  var sessionId = String(params.sessionId || '').trim();
  var trackId = String(params.trackId || '').trim();

  if (!sessionId) {
    return jsonResponse_({ status: 'error', message: 'session_id_required' });
  }
  if (!trackId) {
    return jsonResponse_({ status: 'error', message: 'track_id_required' });
  }

  var sheet = getOrCreateSheet_(SHEET_DADOS, DADOS_HEADERS);
  sheet.appendRow([
    params.timestamp || new Date().toISOString(),
    sessionId,
    trackId,
    params.elementType || '',
    params.label || '',
    params.href || '',
    params.pagePath || '',
    params.pageTitle || '',
  ]);

  return jsonResponse_({
    status: 'success',
    sheet: SHEET_DADOS,
    sessionId: sessionId,
    trackId: trackId,
  });
}

function getOrCreateSheet_(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    return sheet;
  }

  var existing = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  var needsHeaders = false;

  for (var i = 0; i < headers.length; i++) {
    if (String(existing[i] || '') !== headers[i]) {
      needsHeaders = true;
      break;
    }
  }

  if (needsHeaders) {
    sheet.insertRowBefore(1);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  return sheet;
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Rode no editor para validar — deve criar 1 linha na aba "dados". */
function testDadosClick() {
  return handleClickTrack_({
    sessionId: 'teste-manual',
    trackId: 'home.header_demo',
    timestamp: new Date().toISOString(),
    elementType: 'button',
    label: 'Teste manual',
    pagePath: '/',
    pageTitle: 'MESTTI',
  });
}
