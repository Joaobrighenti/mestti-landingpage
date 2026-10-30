import express from "express";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { Resend } from "resend";
import {
  normalizeLeadProgressPayload,
  normalizeCadastroPayload,
  forwardLeadToGoogleSheets,
  forwardCadastroToGoogleSheets,
} from "./lib/sheets-sync.js";
import { scheduleLeadMetaEvent } from "./lib/meta-lead.js";
import { applyChecklistQualification } from "./lib/checklist-lead-score.js";
import { extractChecklistAttachment } from "./lib/lead-attachment.js";
import { getMetaConversionsService } from "./lib/meta-conversions.js";
import {
  checkRateLimit,
  getClientIp,
  getClientUserAgent,
  isAllowedEventName,
  isAllowedEventSourceUrl,
  isValidEventId,
  sanitizeCookieToken,
  sanitizeCustomData,
} from "./lib/meta-request.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 5500);
const HOST = process.env.HOST || "127.0.0.1";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const LEADS_TO_EMAIL = process.env.LEADS_TO_EMAIL || "";
const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";
const GOOGLE_SHEETS_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL || "";

const app = express();
app.set("trust proxy", 1);
app.use(express.json({ limit: "3mb" }));

// Static assets
app.use(express.static(__dirname, { extensions: ["html"] }));

function sendPage(res, relPath) {
  res.sendFile(path.join(__dirname, relPath));
}

// Pretty routes (match live-server behavior)
app.get("/", (_req, res) => sendPage(res, "index.html"));
app.get("/contato/", (_req, res) => sendPage(res, path.join("contato", "index.html")));
app.get("/empresa/", (_req, res) => sendPage(res, path.join("empresa", "index.html")));
app.get("/atuacao/", (_req, res) => sendPage(res, path.join("atuacao", "index.html")));
app.get("/sensoriamento/", (_req, res) => sendPage(res, path.join("sensoriamento", "index.html")));
app.get("/qualidade/", (_req, res) => sendPage(res, path.join("qualidade", "index.html")));
app.get("/checklists/", (_req, res) => sendPage(res, path.join("checklists", "index.html")));
app.get(["/qualidade-2", "/qualidade-2/"], (_req, res) => res.redirect(301, "/checklists/"));
app.get("/producao/", (_req, res) => sendPage(res, path.join("producao", "index.html")));
app.get("/sensores/", (_req, res) => sendPage(res, path.join("sensores", "index.html")));
app.get("/sequenciamento/", (_req, res) => sendPage(res, path.join("sequenciamento", "index.html")));
app.get("/blog/", (_req, res) => sendPage(res, path.join("blog", "index.html")));
app.get("/blog/o-que-e-sistema-mes-mestti/", (_req, res) =>
  sendPage(res, path.join("blog", "o-que-e-sistema-mes-mestti", "index.html"))
);
app.get("/blog/como-calcular-preco-venda-industria-rkw-custo-processo/", (_req, res) =>
  sendPage(res, path.join("blog", "como-calcular-preco-venda-industria-rkw-custo-processo", "index.html"))
);
app.get("/cmms/", (_req, res) => sendPage(res, path.join("cmms", "index.html")));
app.get("/pass/", (_req, res) => sendPage(res, path.join("pass", "index.html")));
app.get("/barra-pass/", (_req, res) => res.redirect(301, "/pass/"));
app.get("/cadastro/", (_req, res) => sendPage(res, path.join("cadastro", "index.html")));
app.get("/termos/", (_req, res) => sendPage(res, path.join("termos", "index.html")));

// Hidden route for app download
app.get("/download-app", (_req, res) => {
  res.download(path.join(__dirname, "downloads", "mestti-apontamento.apk"));
});

app.post("/api/lead", async (req, res) => {
  try {
    const payload = req.body || {};
    applyChecklistQualification(payload);
    const checklistFile = extractChecklistAttachment(payload);
    if (checklistFile.note.startsWith("ignorado")) {
      payload.observacao = [payload.observacao, `Anexo: ${checklistFile.note}`].filter(Boolean).join("\n");
    }
    const {
      formId = "",
      name = "",
      email = "",
      phone = "",
      ddi = "",
      cargo = "",
      setor = "",
      solucao = "",
      empresa = "",
      mensagem = "",
      observacao = "",
      pagePath = "",
      leadSource = "",
    } = payload;

    const phoneFull = [String(ddi || "").trim(), String(phone || "").trim()].filter(Boolean).join(" ");
    if (!name || (!email && !phoneFull)) {
      return res.status(400).json({ ok: false, error: "name_contact_required" });
    }

    const finishOk = async (emailStatus) => {
      await scheduleLeadMetaEvent(req, payload);
      return res.json({ ok: true, email: emailStatus });
    };

    if (!RESEND_API_KEY || !LEADS_TO_EMAIL) {
      return await finishOk("skipped");
    }

    const resend = new Resend(RESEND_API_KEY);

    const subject = `Novo lead (MESTTI)${formId ? ` — ${formId}` : ""}`;

    const safe = (v) => (typeof v === "string" ? v.trim() : "");
    const lines = [
      ["Nome", safe(name)],
      ["E-mail", safe(email) || "(informado via WhatsApp)"],
      ["Telefone", phoneFull],
      ["Cargo", safe(cargo)],
      ["Setor", safe(setor)],
      ["Solução", safe(solucao)],
      ["Empresa", safe(empresa)],
      ["Mensagem", safe(mensagem)],
      ["Observação", safe(observacao)],
      ["Página", safe(pagePath)],
      ["Origem", safe(leadSource)],
    ].filter(([, v]) => v);

    const text = lines.map(([k, v]) => `${k}: ${v}`).join("\n");
    const html = `
      <div style="font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; line-height: 1.5;">
        <h2 style="margin:0 0 12px;">Novo lead</h2>
        <table style="border-collapse: collapse; width: 100%; max-width: 720px;">
          <tbody>
            ${lines
              .map(
                ([k, v]) => `
              <tr>
                <td style="padding: 8px 10px; border: 1px solid #e5e7eb; background:#f9fafb; font-weight: 700; width: 180px;">${k}</td>
                <td style="padding: 8px 10px; border: 1px solid #e5e7eb;">${String(v)
                  .replaceAll("&", "&amp;")
                  .replaceAll("<", "&lt;")
                  .replaceAll(">", "&gt;")}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: LEADS_TO_EMAIL,
      subject,
      text,
      html,
      replyTo: safe(email) || undefined,
      ...(checklistFile.attachment ? { attachments: [checklistFile.attachment] } : {}),
    });

    if (error) {
      console.error("Resend error:", error);
      return await finishOk("failed");
    }

    return await finishOk("sent");
  } catch (err) {
    console.error("Lead email error:", err);
    try {
      await scheduleLeadMetaEvent(req, req.body || {});
    } catch {
      /* ignore */
    }
    return res.json({ ok: true, email: "failed" });
  }
});

app.post("/api/meta-events", async (req, res) => {
  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit(`meta:${ip || "unknown"}`, { windowMs: 60_000, max: 40 });
    if (!rate.allowed) {
      return res.status(429).json({ ok: false, error: "rate_limited" });
    }

    const raw = req.body || {};
    if (raw.access_token != null || raw.accessToken != null) {
      return res.status(400).json({ ok: false, error: "invalid_payload" });
    }

    const eventName = typeof raw.eventName === "string" ? raw.eventName.trim() : "";
    if (!isAllowedEventName(eventName, { publicOnly: true })) {
      return res.status(400).json({ ok: false, error: "event_not_allowed" });
    }

    const eventId = typeof raw.eventId === "string" ? raw.eventId.trim() : "";
    if (!isValidEventId(eventId)) {
      return res.status(400).json({ ok: false, error: "invalid_event_id" });
    }

    const meta = getMetaConversionsService();
    const eventSourceUrl =
      typeof raw.eventSourceUrl === "string" ? raw.eventSourceUrl.trim() : "";

    if (!isAllowedEventSourceUrl(eventSourceUrl, meta.siteDomain)) {
      return res.status(400).json({ ok: false, error: "invalid_event_source_url" });
    }

    const fbp = sanitizeCookieToken(raw.fbp);
    const fbc = sanitizeCookieToken(raw.fbc);
    const externalId =
      typeof raw.externalId === "string" ? raw.externalId.trim().slice(0, 128) : "";
    const customData = sanitizeCustomData(raw.customData);
    const userAgent = getClientUserAgent(req);

    const baseParams = {
      eventId,
      eventSourceUrl,
      clientIpAddress: ip,
      clientUserAgent: userAgent,
      fbp: fbp || undefined,
      fbc: fbc || undefined,
      externalId: externalId || undefined,
      customData,
    };

    try {
      if (eventName === "Contact") {
        const contactMethod =
          typeof raw.contactMethod === "string"
            ? raw.contactMethod.trim().slice(0, 32)
            : customData?.contact_method;
        await meta.sendContact({ ...baseParams, contactMethod });
      } else {
        await meta.sendViewContent(baseParams);
      }
    } catch {
      /* já logado no serviço */
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("[meta-events] error", { error: err?.message || "unknown" });
    return res.json({ ok: true, warning: "accepted_with_error" });
  }
});

app.post("/api/lead-progress", async (req, res) => {
  try {
    const rawLead = req.body || {};
    applyChecklistQualification(rawLead);
    const payload = normalizeLeadProgressPayload(rawLead);

    if (payload.event !== 'submitted') {
      return res.status(400).json({ ok: false, error: 'only_completed_submissions' });
    }

    if (!payload.sessionId) {
      return res.status(400).json({ ok: false, error: "session_id_required" });
    }

    const result = await forwardLeadToGoogleSheets(payload, GOOGLE_SHEETS_WEBHOOK_URL);
    return res.json({ ok: true, sheets: result.skipped ? "skipped" : "synced" });
  } catch {
    return res.status(502).json({ ok: false, error: "sheets_sync_failed" });
  }
});

const CADASTRO_FORMA = new Set(["boleto", "pix_automatico", "cartao_credito"]);
const CADASTRO_DIA = new Set(["1", "5", "10", "15", "20", "25"]);
const CADASTRO_FORMA_LABEL = {
  boleto: "Boleto",
  pix_automatico: "PIX automático",
  cartao_credito: "Cartão de crédito",
};

function cadastroDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function cadastroAceiteOk(value) {
  const v = String(value || "").trim().toLowerCase();
  return v === "1" || v === "true" || v === "sim" || v === "yes" || v === "on";
}

function validateCadastroPayload(payload) {
  const required = [
    "razaoSocial",
    "cnpj",
    "cep",
    "logradouro",
    "numero",
    "bairro",
    "cidade",
    "uf",
    "representanteNome",
    "representanteCpf",
    "email",
    "phone",
    "formaPagamento",
    "diaPagamento",
    "emailBoletos",
    "emailNotas",
  ];
  for (const key of required) {
    if (!String(payload[key] || "").trim()) return "required_fields";
  }
  if (cadastroDigits(payload.cnpj).length !== 14) return "invalid_cnpj";
  if (cadastroDigits(payload.representanteCpf).length !== 11) return "invalid_cpf";
  if (cadastroDigits(payload.cep).length !== 8) return "invalid_cep";
  if (!CADASTRO_FORMA.has(payload.formaPagamento)) return "invalid_pagamento";
  if (!CADASTRO_DIA.has(payload.diaPagamento)) return "invalid_dia";
  if (!cadastroAceiteOk(payload.aceiteTermos)) return "terms_required";
  const emailOk = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
  if (!emailOk(payload.email) || !emailOk(payload.emailBoletos) || !emailOk(payload.emailNotas)) {
    return "invalid_email";
  }
  return null;
}

app.post("/api/cadastro", async (req, res) => {
  try {
    const payload = normalizeCadastroPayload(req.body || {});
    if (!payload.timestamp) payload.timestamp = new Date().toISOString();
    if (!payload.formId) payload.formId = "cadastro";
    if (!payload.pagePath) payload.pagePath = "/cadastro/";
    if (cadastroAceiteOk(payload.aceiteTermos)) payload.aceiteTermos = "sim";

    const error = validateCadastroPayload(payload);
    if (error) {
      return res.status(400).json({ ok: false, error });
    }

    let sheetsStatus = "skipped";
    try {
      const sheets = await forwardCadastroToGoogleSheets(payload, GOOGLE_SHEETS_WEBHOOK_URL);
      sheetsStatus = sheets.skipped ? "skipped" : "synced";
    } catch {
      return res.status(502).json({ ok: false, error: "sheets_sync_failed" });
    }

    let emailStatus = "skipped";
    if (RESEND_API_KEY && LEADS_TO_EMAIL) {
      try {
        const resend = new Resend(RESEND_API_KEY);
        const safe = (v) => (typeof v === "string" ? v.trim() : "");
        const phoneFull = [safe(payload.ddi), safe(payload.phone)].filter(Boolean).join(" ");
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
          .join(", ");

        const lines = [
          ["Razão social", safe(payload.razaoSocial)],
          ["Nome fantasia", safe(payload.nomeFantasia)],
          ["CNPJ", safe(payload.cnpj)],
          ["Endereço", endereco],
          ["Representante", safe(payload.representanteNome)],
          ["CPF do representante", safe(payload.representanteCpf)],
          ["Cargo", safe(payload.representanteCargo)],
          ["E-mail", safe(payload.email)],
          ["Telefone", phoneFull],
          [
            "Forma de pagamento",
            CADASTRO_FORMA_LABEL[payload.formaPagamento] || safe(payload.formaPagamento),
          ],
          ["Dia de pagamento", safe(payload.diaPagamento)],
          ["E-mail boletos", safe(payload.emailBoletos)],
          ["E-mail notas fiscais", safe(payload.emailNotas)],
          ["Aceite dos termos", safe(payload.aceiteTermos)],
          ["Observação", safe(payload.observacao)],
          ["Página", safe(payload.pagePath)],
        ].filter(([, v]) => v);

        const text = lines.map(([k, v]) => `${k}: ${v}`).join("\n");
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
                      .replace(/&/g, "&amp;")
                      .replace(/</g, "&lt;")
                      .replace(/>/g, "&gt;")}</td>
                  </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        `;

        await resend.emails.send({
          from: FROM_EMAIL,
          to: LEADS_TO_EMAIL,
          subject: `Novo cadastro (contrato) — ${safe(payload.razaoSocial) || "MESTTI"}`,
          text,
          html,
        });
        emailStatus = "sent";
      } catch (err) {
        console.error("Cadastro email error:", err);
        emailStatus = "failed";
      }
    }

    return res.json({ ok: true, sheets: sheetsStatus, email: emailStatus });
  } catch (err) {
    console.error("Cadastro error:", err);
    return res.status(500).json({ ok: false, error: "cadastro_failed" });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
  if (HOST !== "0.0.0.0") return;
  const lanUrls = Object.values(os.networkInterfaces())
    .flat()
    .filter((item) => item && item.family === "IPv4" && !item.internal)
    .map((item) => `http://${item.address}:${PORT}/`);
  if (lanUrls.length) {
    console.log(`Na rede local: ${lanUrls.join("  ")}`);
  }
});

