/**
 * Pontuação interna dos leads da LP /checklists/.
 * Ajuste só os pesos aqui. A classificação não é exibida ao visitante.
 */
export const CHECKLIST_LEAD_SCORE = {
  priorityMin: 70,
  developingMin: 40,
  volume: {
    'Mais de 200': 30,
    '51 a 200': 20,
  },
  cargo: {
    'Proprietário / Diretor': 20,
    'Gerente / Coordenador': 20,
  },
  checklistHoje: {
    'Papel ou formulários impressos': 15,
    'Excel ou Google Forms': 15,
  },
  unidades: {
    '2 a 5': 15,
    '6 ou mais': 15,
  },
  desafio: {
    'Organizar registros e evidências': 20,
    'Evitar falhas e não conformidades': 20,
    'Preparar auditorias e fiscalizações': 20,
  },
};

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function points(map, value) {
  return map[value] || 0;
}

export function qualifyChecklistLead(payload) {
  if (!payload || typeof payload !== 'object') return null;

  const volume = text(payload.volumeMensal);
  const hoje = text(payload.checklistHoje);
  const unidades = text(payload.unidades);
  const desafio = text(payload.desafio) || text(payload.mensagem);
  const cargo = text(payload.cargo);
  const setor = text(payload.setor);
  const utm = text(payload.utm).slice(0, 500);
  const anexo = text(payload.anexoNome).replace(/[^\w.\- ()]/g, '').slice(0, 80);

  if (!volume && !hoje && !unidades && !desafio) return null;

  const rules = CHECKLIST_LEAD_SCORE;
  const score =
    points(rules.volume, volume) +
    points(rules.cargo, cargo) +
    points(rules.checklistHoje, hoje) +
    points(rules.unidades, unidades) +
    points(rules.desafio, desafio);

  let classification = 'Lead para nutrição';
  if (score >= rules.priorityMin) classification = 'Lead prioritário';
  else if (score >= rules.developingMin) classification = 'Lead em desenvolvimento';

  const lines = [
    setor ? `Segmento: ${setor}` : '',
    cargo ? `Função: ${cargo}` : '',
    hoje ? `Checklists hoje: ${hoje}` : '',
    volume ? `Volume mensal: ${volume}` : '',
    desafio ? `Desafio: ${desafio}` : '',
    unidades ? `Unidades: ${unidades}` : '',
    utm ? `Campanha: ${utm}` : '',
    anexo ? `Anexo informado: ${anexo}` : '',
    `Pontuação: ${score}`,
    `Classificação: ${classification}`,
  ].filter(Boolean);

  return { score, classification, text: lines.join('\n') };
}

/** Grava respostas, pontuação e classificação no campo que e-mail e planilha já recebem. */
export function applyChecklistQualification(payload) {
  const result = qualifyChecklistLead(payload);
  if (!result) return payload;
  payload.observacao = result.text;
  payload.mensagem = text(payload.desafio) || text(payload.mensagem);
  delete payload.volumeMensal;
  delete payload.checklistHoje;
  delete payload.unidades;
  delete payload.desafio;
  delete payload.utm;
  delete payload.anexoNome;
  return payload;
}
