import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 5500);
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const LEADS_TO_EMAIL = process.env.LEADS_TO_EMAIL || "";
const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";

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
    } = payload;

    if (!name || !email) {
      return res.status(400).json({ ok: false, error: "name_email_required" });
    }

    if (!RESEND_API_KEY) {
      return res.status(500).json({ ok: false, error: "missing_resend_api_key" });
    }
    if (!LEADS_TO_EMAIL) {
      return res.status(500).json({ ok: false, error: "missing_leads_to_email" });
    }

    const resend = new Resend(RESEND_API_KEY);

    const subject = `Novo lead (MESTTI)${formId ? ` — ${formId}` : ""}`;

    const safe = (v) => (typeof v === "string" ? v.trim() : "");
    const phoneFull = [safe(ddi), safe(phone)].filter(Boolean).join(" ");

    const lines = [
      ["Nome", safe(name)],
      ["E-mail", safe(email)],
      ["Telefone", phoneFull],
      ["Cargo", safe(cargo)],
      ["Setor", safe(setor)],
      ["Solução", safe(solucao)],
      ["Empresa", safe(empresa)],
      ["Mensagem", safe(mensagem)],
      ["Observação", safe(observacao)],
      ["Página", safe(pagePath)],
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
      return res.status(502).json({ ok: false, error: "resend_error", details: error });
    }

    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "server_error" });
  }
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});

