import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const LEADS_TO_EMAIL = process.env.LEADS_TO_EMAIL || "";
const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
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

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ ok: false, error: "server_error" });
  }
}
