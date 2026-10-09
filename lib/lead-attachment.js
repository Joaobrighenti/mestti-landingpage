/**
 * Anexo opcional do checklist na LP /checklists/.
 * O arquivo segue só no e-mail do lead. Não é gravado em disco nem na planilha.
 */
const MAX_BYTES = Math.floor(1.5 * 1024 * 1024);

const ALLOWED = [
  { mime: 'application/pdf', exts: ['.pdf'], magic: (b) => b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46 },
  { mime: 'image/jpeg', exts: ['.jpg', '.jpeg'], magic: (b) => b[0] === 0xff && b[1] === 0xd8 },
  { mime: 'image/png', exts: ['.png'], magic: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  { mime: 'image/webp', exts: ['.webp'], magic: (b) => b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 },
  { mime: 'text/csv', exts: ['.csv'], magic: (b) => !b.includes(0) },
  { mime: 'application/vnd.ms-excel', exts: ['.xls'], magic: (b) => b[0] === 0xd0 && b[1] === 0xcf },
  {
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    exts: ['.xlsx'],
    magic: (b) => b[0] === 0x50 && b[1] === 0x4b,
  },
];

function safeName(name, ext) {
  const base = String(name || 'checklist')
    .replace(/\\/g, '/')
    .split('/')
    .pop()
    .replace(/[^\w.\- ()]/g, '')
    .slice(0, 80);
  const stem = base.replace(/\.[^.]+$/, '') || 'checklist';
  return `${stem}${ext}`;
}

export function extractChecklistAttachment(payload) {
  const raw = payload?.checklistAnexo;
  if (payload && typeof payload === 'object') delete payload.checklistAnexo;
  if (!raw || typeof raw !== 'object') return { attachment: null, note: '' };

  const mime = String(raw.type || '').toLowerCase().trim();
  const rule = ALLOWED.find((item) => item.mime === mime);
  const original = String(raw.name || '');
  const ext = (original.match(/\.[a-z0-9]+$/i) || [''])[0].toLowerCase();

  if (!rule || !rule.exts.includes(ext)) {
    return { attachment: null, note: 'ignorado: tipo de arquivo não aceito' };
  }

  const data = String(raw.data || '').replace(/\s/g, '');
  if (!data || !/^[A-Za-z0-9+/]+={0,2}$/.test(data)) {
    return { attachment: null, note: 'ignorado: arquivo inválido' };
  }

  let bytes;
  try {
    bytes = Buffer.from(data, 'base64');
  } catch {
    return { attachment: null, note: 'ignorado: arquivo inválido' };
  }

  if (!bytes.length || bytes.length > MAX_BYTES || !rule.magic(bytes)) {
    return { attachment: null, note: 'ignorado: arquivo vazio, grande demais ou incompatível' };
  }

  return {
    attachment: {
      filename: safeName(original, ext),
      content: data,
    },
    note: safeName(original, ext),
  };
}
