/**
 * MESTTI — Web App Google Sheets
 * - Aba "Leads": upsert por sessionId (chat / formulário)
 * - Aba "dados": append por clique (rastreamento de botões e links)
 */

const SHEET_LEADS = 'Leads';
const SHEET_DADOS = 'dados';

const LEAD_HEADERS = [
  'sessionId',
  'updatedAt',
  'event',
  'chatStep',
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
  return handleRequest_(e && e.parameter ? e.parameter : {});
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
  return handleRequest_(params);
}

function handleRequest_(params) {
  var sheet = String(params.sheet || '').trim().toLowerCase();
  if (sheet === 'dados' || String(params.type || '').trim().toLowerCase() === 'click') {
    return handleClickTrack_(params);
  }
  return handleLeadProgress_(params);
}

function handleLeadProgress_(params) {
  var sessionId = String(params.sessionId || '').trim();
  if (!sessionId) {
    return jsonResponse_({ status: 'error', message: 'session_id_required' });
  }

  var sheet = getOrCreateSheet_(SHEET_LEADS, LEAD_HEADERS);
  var row = [
    sessionId,
    params.timestamp || new Date().toISOString(),
    params.event || '',
    params.chatStep || '',
    params.stepIndex || '',
    params.totalSteps || '',
    params.name || '',
    params.email || '',
    params.phone || '',
    params.ddi || '',
    params.empresa || '',
    params.cargo || '',
    params.setor || '',
    params.solucao || '',
    params.mensagem || '',
    params.observacao || '',
    params.pagePath || '',
    params.leadSource || '',
    params.formId || '',
  ];

  upsertRowByFirstColumn_(sheet, sessionId, row);
  return jsonResponse_({ status: 'success', sheet: SHEET_LEADS, sessionId: sessionId });
}

function handleClickTrack_(params) {
  var sessionId = String(params.visitorSessionId || params.sessionId || '').trim();
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

/** Rode no editor do Apps Script para validar a aba dados. */
function testDadosClick() {
  return handleClickTrack_({
    visitorSessionId: 'teste-manual',
    trackId: 'home.header_demo',
    timestamp: new Date().toISOString(),
    elementType: 'button',
    label: 'Teste manual',
    pagePath: '/',
    pageTitle: 'MESTTI',
    sheet: 'dados',
    type: 'click',
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

function upsertRowByFirstColumn_(sheet, key, rowValues) {
  var data = sheet.getDataRange().getValues();
  var targetRow = -1;

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0] || '') === key) {
      targetRow = i + 1;
      break;
    }
  }

  if (targetRow > 0) {
    sheet.getRange(targetRow, 1, 1, rowValues.length).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
