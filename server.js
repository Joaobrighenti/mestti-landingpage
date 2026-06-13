import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { Resend } from "resend";
import {
  normalizeLeadProgressPayload,
  forwardLeadToGoogleSheets,
} from "./lib/sheets-sync.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 5500);
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const LEADS_TO_EMAIL = process.env.LEADS_TO_EMAIL || "";
const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";
const GOOGLE_SHEETS_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL || "";

const app = express();
app.use(express.json({ limit: "200kb" }));

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
app.get("/producao/", (_req, res) => sendPage(res, path.join("producao", "index.html")));
app.get("/sensores/", (_req, res) => sendPage(res, path.join("sensores", "index.html")));
app.get("/sequenciamento/", (_req, res) => sendPage(res, path.join("sequenciamento", "index.html")));
app.get("/blog/", (_req, res) => sendPage(res, path.join("blog", "index.html")));
app.get("/blog/como-calcular-preco-venda-industria-rkw-custo-processo/", (_req, res) =>
  sendPage(res, path.join("blog", "como-calcular-preco-venda-industria-rkw-custo-processo", "index.html"))
);
app.get("/cmms/", (_req, res) => sendPage(res, path.join("cmms", "index.html")));
app.get("/pass/", (_req, res) => sendPage(res, path.join("pass", "index.html")));
app.get("/barra-pass/", (_req, res) => res.redirect(301, "/pass/"));

app.post("/api/lead", async (req, res) => {
  try {
    const payload = req.body || {};
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

    if (!RESEND_API_KEY || !LEADS_TO_EMAIL) {
      return res.json({ ok: true, email: "skipped" });
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
    });

    if (error) {
      console.error("Resend error:", error);
      return res.json({ ok: true, email: "failed" });
    }

    return res.json({ ok: true, email: "sent" });
  } catch (err) {
    console.error("Lead email error:", err);
    return res.json({ ok: true, email: "failed" });
  }
});

app.post("/api/lead-progress", async (req, res) => {
  try {
    const payload = normalizeLeadProgressPayload(req.body || {});

    if (!payload.sessionId) {
      return res.status(400).json({ ok: false, error: "session_id_required" });
    }

    const result = await forwardLeadToGoogleSheets(payload, GOOGLE_SHEETS_WEBHOOK_URL);
    return res.json({ ok: true, sheets: result.skipped ? "skipped" : "synced" });
  } catch {
    return res.status(502).json({ ok: false, error: "sheets_sync_failed" });
  }
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});

