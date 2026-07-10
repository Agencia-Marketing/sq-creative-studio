// Cloudflare Pages Function — POST /api/contact
// Recibe el formulario de contacto y envía el correo vía Resend.
// Secret requerido: RESEND_API_KEY (Pages > Settings > Environment variables).

const TO = "ugc.bystephania@gmail.com";
const FROM = "SQ Creative Studio <notify@notify.programacionconecta.com>";

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const esc = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export async function onRequestPost({ request, env }) {
  if (!env.RESEND_API_KEY) {
    return json({ ok: false, error: "Configuración de correo faltante." }, 500);
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: "Solicitud inválida." }, 400);
  }

  // Honeypot anti-spam: si viene relleno, fingimos éxito y descartamos.
  if (data.website) return json({ ok: true });

  // Verificación Turnstile.
  if (!env.TURNSTILE_SECRET_KEY) {
    return json({ ok: false, error: "Configuración anti-bot faltante." }, 500);
  }
  const token = (data["cf-turnstile-response"] || "").toString();
  if (!token) {
    return json({ ok: false, error: "Verificación anti-bot requerida." }, 403);
  }
  const verifyBody = new URLSearchParams();
  verifyBody.append("secret", env.TURNSTILE_SECRET_KEY);
  verifyBody.append("response", token);
  const ip = request.headers.get("CF-Connecting-IP");
  if (ip) verifyBody.append("remoteip", ip);
  const verify = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body: verifyBody }
  );
  const verifyJson = await verify.json().catch(() => ({ success: false }));
  if (!verifyJson.success) {
    return json({ ok: false, error: "Verificación anti-bot fallida." }, 403);
  }

  const nombre = (data.nombre || "").toString().trim();
  const email = (data.email || "").toString().trim();
  const empresa = (data.empresa || "").toString().trim();
  const servicio = (data.servicio || "").toString().trim();
  const mensaje = (data.mensaje || "").toString().trim();

  if (!nombre || !email || !mensaje) {
    return json({ ok: false, error: "Faltan campos obligatorios." }, 400);
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json({ ok: false, error: "Correo inválido." }, 400);
  }

  const fecha = new Date().toLocaleString("es-MX", {
    timeZone: "America/Mexico_City",
    dateStyle: "full",
    timeStyle: "short",
  });

  const row = (label, value) => `
    <tr>
      <td style="padding:10px 16px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#C7A36A;white-space:nowrap;vertical-align:top">${label}</td>
      <td style="padding:10px 16px;font-size:15px;color:#2b2b2b;vertical-align:top">${value}</td>
    </tr>`;

  const html = `
  <div style="background:#4D1620;padding:32px 16px;font-family:'Helvetica Neue',Arial,sans-serif">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.25)">
      <tr>
        <td style="background:#6A1F2B;padding:28px 32px">
          <div style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#C7A36A;font-weight:700">SQ Creative Studio</div>
          <div style="font-size:22px;color:#ffffff;font-weight:700;margin-top:6px">Nuevo mensaje de contacto</div>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 16px 8px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${row("Nombre", esc(nombre))}
            ${row("Correo", `<a href="mailto:${esc(email)}" style="color:#6A1F2B;font-weight:600;text-decoration:none">${esc(email)}</a>`)}
            ${empresa ? row("Empresa", esc(empresa)) : ""}
            ${servicio ? row("Servicio", esc(servicio)) : ""}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 32px 24px">
          <div style="font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#C7A36A;margin-bottom:8px">Mensaje</div>
          <div style="font-size:15px;line-height:1.6;color:#2b2b2b;background:#f7f2ec;border-left:3px solid #C7A36A;border-radius:8px;padding:16px 18px;white-space:pre-wrap">${esc(mensaje)}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:0 32px 28px">
          <a href="mailto:${esc(email)}?subject=Re:%20tu%20mensaje%20a%20SQ%20Creative%20Studio" style="display:inline-block;background:#C7A36A;color:#6A1F2B;font-weight:700;font-size:14px;text-decoration:none;padding:12px 24px;border-radius:999px">Responder a ${esc(nombre.split(" ")[0])}</a>
        </td>
      </tr>
      <tr>
        <td style="background:#f7f2ec;padding:16px 32px;font-size:12px;color:#8a7f78">
          Enviado desde el formulario de <strong style="color:#6A1F2B">sqcreativestudio.com</strong> · ${fecha}
        </td>
      </tr>
    </table>
  </div>`;

  const text =
    `Nuevo mensaje de contacto — SQ Creative Studio\n\n` +
    `Nombre: ${nombre}\nCorreo: ${email}\n` +
    (empresa ? `Empresa: ${empresa}\n` : "") +
    (servicio ? `Servicio: ${servicio}\n` : "") +
    `\nMensaje:\n${mensaje}\n\n${fecha}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      reply_to: email,
      subject: `Nuevo contacto: ${nombre}${empresa ? " — " + empresa : ""}`,
      html,
      text,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Resend error", res.status, detail);
    return json({ ok: false, error: "No se pudo enviar el mensaje." }, 502);
  }

  return json({ ok: true });
}
