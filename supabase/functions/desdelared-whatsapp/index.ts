// desdelared-whatsapp — WhatsApp de Desde la Red (+1 781-818-1800). Proyecto propio, sin relación con PEAK.
// 2026-10-29. Área APARTE: no usa sherpa_*, no pasa por Guru, no cae en el buzón de ningún agente.
//
// verify_jwt = false (Twilio no trae JWT). Dos entradas:
//   · Twilio (form-urlencoded): se valida X-Twilio-Signature; se guarda el mensaje y se contesta TwiML vacío.
//   · App (JSON + Authorization del usuario): { accion: "enviar", conversacion_id, texto } | { accion: "leido", conversacion_id }
//     Solo pueden las personas de acceso.
//
// Secretos (los mismos que ya usa mensajes-entrantes; no se tocan aquí): TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN.
import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";

const NUMERO = "+17818181800";
const SB_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICIO_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const URL_PUBLICA = SB_URL.replace(/\/+$/, "") + "/functions/v1/desdelared-whatsapp";
const CORS = { "access-control-allow-origin": "*", "access-control-allow-headers": "authorization, content-type, apikey", "access-control-allow-methods": "POST, OPTIONS" };
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...CORS, "content-type": "application/json; charset=utf-8" } });
const twiml = () => new Response(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`, { status: 200, headers: { "content-type": "text/xml; charset=utf-8" } });
const servicio = (): SupabaseClient => createClient(SB_URL, SERVICIO_KEY, { auth: { persistSession: false } });
const conUsuario = (auth: string): SupabaseClient => createClient(SB_URL, ANON_KEY, { global: { headers: { Authorization: auth } }, auth: { persistSession: false } });

function normalizar(raw: unknown): string | null {
  if (!raw) return null;
  const l = String(raw).trim().replace(/^whatsapp:/i, "");
  if (l.startsWith("+")) return /^\+[1-9]\d{7,14}$/.test(l) ? l : null;
  const d = l.replace(/\D/g, "");
  if (d.length === 10) return "+1" + d;
  if (d.length === 11 && d.startsWith("1")) return "+" + d;
  return null;
}

async function firmaValida(token: string, url: string, params: Record<string, string>, firma: string): Promise<boolean> {
  if (!token || !firma) return false;
  const data = url + Object.keys(params).sort().map((k) => k + params[k]).join("");
  const llave = await crypto.subtle.importKey("raw", new TextEncoder().encode(token), { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const f = await crypto.subtle.sign("HMAC", llave, new TextEncoder().encode(data));
  const esperada = btoa(String.fromCharCode(...new Uint8Array(f)));
  if (esperada.length !== firma.length) return false;
  let d = 0;
  for (let i = 0; i < esperada.length; i++) d |= esperada.charCodeAt(i) ^ firma.charCodeAt(i);
  return d === 0;
}

// Twilio firma con la llave de la cuenta dueña del número (principal o subcuenta nuestra). No se guarda ninguna llave.
async function tokenParaFirma(accountSid: string): Promise<string> {
  const sid = Deno.env.get("TWILIO_ACCOUNT_SID") || "", tok = Deno.env.get("TWILIO_AUTH_TOKEN") || "";
  if (!accountSid || accountSid === sid) return tok;
  if (!/^AC[0-9a-f]{32}$/i.test(accountSid) || !sid || !tok) return "";
  try {
    const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}.json`, { headers: { Authorization: "Basic " + btoa(`${sid}:${tok}`) } });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || j.owner_account_sid !== sid || !j.auth_token) return "";
    return String(j.auth_token);
  } catch { return ""; }
}


// ---------------------------------------------------------------------------
// Envío por Twilio (WhatsApp) y bot de preguntas frecuentes (respuestas armadas, sin IA)
// ---------------------------------------------------------------------------
async function enviarTwilio(to: string, texto: string): Promise<{ ok: boolean; sid?: string; error?: string }> {
  const sid = Deno.env.get("TWILIO_ACCOUNT_SID") || "", tok = Deno.env.get("TWILIO_AUTH_TOKEN") || "";
  if (!sid || !tok) return { ok: false, error: "Falta configurar Twilio en el servidor" };
  try {
    const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: { Authorization: "Basic " + btoa(`${sid}:${tok}`), "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ To: "whatsapp:" + to, From: "whatsapp:" + NUMERO, Body: texto }).toString(),
    });
    const j = await r.json().catch(() => ({}));
    return r.ok ? { ok: true, sid: String(j.sid || "") } : { ok: false, error: (j && (j.message || j.error)) || `Twilio respondió ${r.status}` };
  } catch (e) { return { ok: false, error: "No se pudo contactar a Twilio: " + (e as Error).message }; }
}

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const PIE = "\n\n(Respuesta automática de Desde la Red. Si prefieres hablar con una persona, escribe «persona» y te responderemos aquí.)";
const SALUDO = "Hola, te damos la bienvenida a Desde la Red. Puedes preguntarme, por ejemplo: qué es Desde la Red, cómo empiezo, cuánto cuesta o cuándo son los encuentros. Si prefieres hablar con una persona, escribe «persona».";
const CRISIS = "Gracias por contarnos cómo te sientes. No estás sola ni solo. Si estás en peligro o piensas en hacerte daño, llama o escribe al 988 (Estados Unidos, las 24 horas) o al 911 si es una emergencia. También avisamos a una persona del equipo para que te escriba.";
const PERSONA = "Listo, avisamos a una persona del equipo. Te responderemos por este mismo chat.";
const FALLBACK = "Gracias por escribirnos. Recibimos tu mensaje y una persona del equipo te responderá pronto. Mientras tanto, puedes ver las preguntas frecuentes en desdelared.net/preguntas.html";
const FAQ: { k: RegExp; r: string }[] = [
  { k: /\b(cuanto|cuesta|precio|costo|pagar|gratis|cobran|cobra|tarifa)\b/, r: "Te vamos a contar con claridad cualquier costo antes de que tengas que pagar algo." },
  { k: /\b(encuentro|encuentros|evento|eventos|sesion|sesiones|fecha|fechas|cuando|proximo|horario)\b/, r: "Los encuentros y sus fechas están en desdelared.net/encuentros.html. Si no ves lo que buscas, una persona del equipo te responderá." },
  { k: /\b(diario)\b/, r: "Sí, tu diario es privado. Es un espacio solo tuyo y no se muestra a otras personas de la comunidad." },
  { k: /\b(tratamiento|terapia|psicolog\w*|medic\w*|psiquiatr\w*|profesional|doctor)\b/, r: "Desde la Red no reemplaza un tratamiento ni a un profesional de la salud: es acompañamiento y comunidad, no atención médica ni psicológica. Si estás pasando un momento difícil, busca apoyo profesional. En Estados Unidos puedes llamar o escribir al 988." },
  { k: /\b(datos|privacidad|informacion personal)\b/, r: "No vendemos tus datos. Lo explicamos todo en la política de privacidad: desdelared.net/privacidad.html" },
  { k: /\b(creer|creencia|creencias|religion|religioso|religiosa|fe)\b/, r: "No tienes que creer nada para participar. Nadie te dice qué creer. Cada persona explora a su ritmo lo que le hace sentido." },
  { k: /\b(grupo|grupos|zona|zonas|region|regiones|continente|pais|paises)\b/, r: "Son lugares de la red donde se juntan personas de una misma parte del mundo. Por ahora empezamos con cuatro: Norteamérica, Latinoamérica y Caribe, Europa y África." },
  { k: /\b(guia|guias|acompanan|acompanante|acompanantes|anfitrion|anfitriona|facilitador|facilitadora|terapeuta|quienes son)\b/, r: "Son personas que comparten su experiencia en cada práctica o terapia. Vas a poder conocer su historia, cómo llegaron a su camino y qué estudiaron." },
  { k: /\b(despues|circulo|circulos|audio)\b/, r: "Después de un encuentro sigue contigo: una pregunta para pensar, un audio para seguir escuchando, un diario privado para escribir y un círculo pequeño para compartir con otras personas." },
  { k: /\b(empiezo|empezar|comienzo|comenzar|inicio|iniciar|unirme|sumarme|participar|participo|registrar|registro|inscribir)\b/, r: "Elige qué estás viviendo hoy: empezando de nuevo, extrañando tu país, queriendo romper patrones o necesitando un momento para ti. Desde ahí te mostramos historias, reflexiones, prácticas y encuentros. Puedes empezar en desdelared.net" },
  { k: /\b(correo|email|contacto|consulta|escribir)\b/, r: "También puedes escribirnos a hola@desdelared.net y te respondemos." },
  { k: /\b(que es|de que trata|de que se trata|en que consiste|como funciona|informacion)\b/, r: "Desde la Red es una comunidad para encontrarte, escucharte y crecer con otras personas. Reúne historias, prácticas y encuentros para tu camino personal y espiritual." },
];
function respuestaBot(texto: string): { r: string; tipo: string } | null {
  const t = norm(texto).replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  if (!t) return null;
  if (/(suicid|quitarme la vida|quiero morir|quiero morirme|no quiero vivir|hacerme dano|matarme|acabar con mi vida)/.test(t)) return { r: CRISIS, tipo: "crisis" };
  if (/\b(persona|humano|humana|asesor|asesora|alguien)\b/.test(t) && t.split(" ").length <= 8) return { r: PERSONA, tipo: "persona" };
  if (/^(hola|buenas|buenos dias|buenas tardes|buenas noches|hello|hi|que tal|saludos)( .{0,20})?$/.test(t)) return { r: SALUDO, tipo: "saludo" };
  for (const f of FAQ) if (f.k.test(t)) return { r: f.r + PIE, tipo: "faq" };
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  if (req.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);
  const tipo = req.headers.get("content-type") || "";
  if (tipo.includes("application/json")) return desdePeak(req);
  return desdeTwilio(req);
});

// ---------------------------------------------------------------------------
// Entrante: Twilio → guardar
// ---------------------------------------------------------------------------
async function desdeTwilio(req: Request): Promise<Response> {
  if (!Deno.env.get("TWILIO_AUTH_TOKEN")) { console.error("Falta TWILIO_AUTH_TOKEN"); return json({ ok: false, error: "Falta configurar Twilio en el servidor" }, 503); }
  const form = await req.formData().catch(() => null);
  if (!form) return json({ ok: false, error: "Cuerpo inválido" }, 400);
  const p: Record<string, string> = {};
  for (const [k, v] of form.entries()) p[k] = String(v);

  const url = new URL(req.url);
  const firma = req.headers.get("x-twilio-signature") || "";
  const tokenFirma = await tokenParaFirma(p.AccountSid || "");
  let ok = false;
  for (const c of [URL_PUBLICA + url.search, URL_PUBLICA + "/" + url.search]) { if (await firmaValida(tokenFirma, c, p, firma)) { ok = true; break; } }
  if (!ok) { console.error("Firma de Twilio inválida"); return json({ ok: false, error: "Firma inválida" }, 403); }

  // Solo WhatsApp y solo el número de Desde la Red.
  if (!/^whatsapp:/i.test(p.From || "")) return twiml();
  const from = normalizar(p.From), to = normalizar(p.To);
  if (!from || to !== NUMERO) { console.error("Mensaje para otro número, ignorado:", to); return twiml(); }

  const sid = String(p.MessageSid || p.SmsSid || "");
  const media = Number(p.NumMedia || 0);
  let texto = String(p.Body || "").trim();
  if (!texto && media > 0) texto = "(mandó un archivo adjunto)";
  if (!texto) return twiml();
  texto = texto.slice(0, 1600);

  const sb = servicio();
  if (sid) {
    const { data: ya } = await sb.from("mensajes").select("id").eq("twilio_sid", sid).maybeSingle();
    if (ya) return twiml(); // repetición de Twilio
  }
  const ahora = new Date().toISOString();
  const nombrePerfil = String(p.ProfileName || "").trim().slice(0, 80) || null;
  let { data: conv } = await sb.from("conversaciones").select("*").eq("telefono", from).maybeSingle();
  if (!conv) {
    const { data: nueva, error } = await sb.from("conversaciones").insert({ telefono: from, nombre: nombrePerfil }).select("*").single();
    if (error || !nueva) {
      // carrera: otra copia del mismo mensaje la creó justo antes
      const r = await sb.from("conversaciones").select("*").eq("telefono", from).maybeSingle();
      conv = r.data;
      if (!conv) { console.error("No se pudo crear la conversación:", error?.message); return json({ ok: false }, 500); } // 500 → Twilio reintenta, no se pierde
    } else conv = nueva;
  }
  // Guardar primero el mensaje: si falla, devolvemos 500 y Twilio lo reintenta.
  const { error: eMsg } = await sb.from("mensajes").insert({
    conversacion_id: conv.id, direccion: "entrante", texto, estado: "recibido", twilio_sid: sid || null, meta: { media },
  });
  if (eMsg) {
    if ((eMsg as any).code === "23505") return twiml(); // ya estaba (mismo sid)
    console.error("mensajes:", eMsg.message); return json({ ok: false }, 500);
  }
  await sb.from("conversaciones").update({
    no_leidos: (conv.no_leidos || 0) + 1, ultimo_texto: texto.slice(0, 140), ultimo_en: ahora, ultimo_entrante_en: ahora,
    nombre: conv.nombre || nombrePerfil,
  }).eq("id", conv.id);

  // Bot de preguntas frecuentes: nunca debe impedir que el mensaje quede guardado.
  try {
    let resp = respuestaBot(texto);
    if (!resp) {
      const ult = conv.ultimo_saliente_en ? new Date(conv.ultimo_saliente_en).getTime() : 0;
      if (!ult || Date.now() - ult > 12 * 3600 * 1000) resp = { r: FALLBACK, tipo: "fallback" };
    }
    if (resp) {
      const env = await enviarTwilio(from, resp.r);
      const t2 = new Date().toISOString();
      await sb.from("mensajes").insert({ conversacion_id: conv.id, direccion: "saliente", texto: resp.r, estado: env.ok ? "enviado" : "fallido", twilio_sid: env.sid || null, meta: { bot: true, tipo: resp.tipo, ...(env.ok ? {} : { error: env.error }) } });
      if (env.ok) await sb.from("conversaciones").update({ ultimo_texto: resp.r.slice(0, 140), ultimo_en: t2, ultimo_saliente_en: t2 }).eq("id", conv.id);
    }
  } catch (e) { console.error("bot:", (e as Error).message); }
  return twiml();
}

// ---------------------------------------------------------------------------
// Desde la app: enviar / marcar leído (solo correos de la tabla acceso)
// ---------------------------------------------------------------------------
async function desdePeak(req: Request): Promise<Response> {
  const auth = req.headers.get("authorization") || "";
  const { data: u, error: eU } = await conUsuario(auth).auth.getUser();
  if (eU || !u?.user) return json({ ok: false, error: "Sesión inválida" }, 401);
  const sb = servicio();
  const { data: acc } = await sb.from("acceso").select("email").eq("email", String(u.user.email || "").toLowerCase()).maybeSingle();
  if (!acc) return json({ ok: false, error: "No tienes acceso a esta área." }, 403);

  const b: any = await req.json().catch(() => ({}));
  const convId = String(b.conversacion_id || "");
  if (!/^[0-9a-f-]{36}$/i.test(convId)) return json({ ok: false, error: "Conversación inválida" }, 400);
  const { data: conv } = await sb.from("conversaciones").select("*").eq("id", convId).maybeSingle();
  if (!conv) return json({ ok: false, error: "No encontré la conversación" }, 404);

  if (b.accion === "leido") {
    await sb.from("conversaciones").update({ no_leidos: 0 }).eq("id", conv.id);
    return json({ ok: true });
  }
  if (b.accion !== "enviar") return json({ ok: false, error: "Acción desconocida" }, 400);

  const texto = String(b.texto || "").trim().slice(0, 1600);
  if (!texto) return json({ ok: false, error: "Escribe el mensaje" }, 400);
  // WhatsApp: texto libre solo dentro de las 24 h desde el último mensaje del cliente.
  const ult = conv.ultimo_entrante_en ? new Date(conv.ultimo_entrante_en).getTime() : 0;
  if (!ult || Date.now() - ult > 24 * 3600 * 1000) {
    return json({ ok: false, motivo: "ventana_24h", error: "Pasaron más de 24 horas desde el último mensaje de este cliente: WhatsApp solo deja mandar una plantilla aprobada." }, 409);
  }
  const env = await enviarTwilio(conv.telefono, texto);

  const ahora = new Date().toISOString();
  await sb.from("mensajes").insert({
    conversacion_id: conv.id, direccion: "saliente", texto, estado: env.ok ? "enviado" : "fallido",
    twilio_sid: env.sid || null, enviado_por: u.user.id, meta: env.ok ? {} : { error: env.error },
  });
  if (!env.ok) return json({ ok: false, error: env.error || "No se pudo enviar." }, 502);
  await sb.from("conversaciones").update({ ultimo_texto: texto.slice(0, 140), ultimo_en: ahora, ultimo_saliente_en: ahora, no_leidos: 0 }).eq("id", conv.id);
  return json({ ok: true });
}
