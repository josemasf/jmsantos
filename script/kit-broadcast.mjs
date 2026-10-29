import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";

const API_URL = "https://api.kit.com/v4";

export function newsletterToHtml(markdown) {
  const body = markdown
    .split("\n")
    .filter((line) => !line.startsWith("<!--") && !line.startsWith("**Estado:**") && !line.startsWith("**Periodo de artículos:**") && !line.startsWith("**Destinatarios:**") && !line.startsWith("**Control editorial:**"))
    .join("\n");

  const escapeHtml = (text) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  const inline = (text) => escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2">$1</a>');
  const lines = body.split("\n");
  const html = [];
  let paragraph = [];
  let listType = null;
  const closeParagraph = () => {
    if (paragraph.length) html.push(`<p>${inline(paragraph.join(" "))}</p>`);
    paragraph = [];
  };
  const closeList = () => {
    if (listType) html.push(`</${listType}>`);
    listType = null;
  };
  for (const line of lines) {
    if (!line.trim()) { closeParagraph(); closeList(); continue; }
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      closeParagraph(); closeList();
      const level = Math.min(heading[1].length + 1, 4);
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }
    const item = line.match(/^\s*[-*]\s+(.+)$/);
    if (item) {
      closeParagraph();
      if (listType !== "ul") { closeList(); html.push("<ul>"); listType = "ul"; }
      html.push(`<li>${inline(item[1])}</li>`);
      continue;
    }
    closeList();
    if (/^---+$/.test(line.trim())) { closeParagraph(); html.push("<hr>"); continue; }
    paragraph.push(line.trim());
  }
  closeParagraph(); closeList();
  return html.join("\n");
}

export function buildBroadcastPayload({ subject, previewText, content, description, templateId }) {
  if (!subject?.trim() || !previewText?.trim() || !content?.trim()) {
    throw new Error("subject, previewText y content son obligatorios.");
  }
  return {
    subject: subject.trim(),
    preview_text: previewText.trim(),
    content,
    description: description?.trim() || subject.trim(),
    public: false,
    // Kit's API schema marks published_at as required even for private drafts.
    // public:false keeps this timestamp from publishing the broadcast to the web.
    published_at: new Date().toISOString(),
    send_at: null,
    email_address: null,
    // When omitted, Kit's API targets all subscribers by default.
    ...(templateId ? { email_template_id: Number(templateId) } : {}),
  };
}

export async function kitRequest(path, { apiKey, method = "GET", body, fetchImpl = fetch }) {
  const response = await fetchImpl(`${API_URL}${path}`, {
    method,
    headers: { "X-Kit-Api-Key": apiKey, ...(body ? { "Content-Type": "application/json" } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errors = Array.isArray(payload.errors) ? payload.errors.join("; ") : `HTTP ${response.status}`;
    throw new Error(`Kit API ${method} ${path}: ${errors}`);
  }
  return payload;
}

async function main() {
  const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
  loadEnv({ path: resolve(root, ".env") });
  const apiKey = process.env.KIT_API_KEY;
  if (!apiKey) throw new Error("Falta KIT_API_KEY en .env (API key V4 de Kit). No se ha hecho ninguna petición.");
  const args = process.argv.slice(2);
  const value = (name) => {
    const index = args.indexOf(name);
    return index === -1 ? undefined : args[index + 1];
  };
  const subject = value("--subject") ?? process.env.KIT_NEWSLETTER_SUBJECT;
  const previewText = value("--preview") ?? process.env.KIT_NEWSLETTER_PREVIEW_TEXT;
  const templateId = value("--template-id") ?? process.env.KIT_EMAIL_TEMPLATE_ID;
  if (!subject || !previewText) throw new Error("Indica --subject y --preview o configúralos como KIT_NEWSLETTER_SUBJECT y KIT_NEWSLETTER_PREVIEW_TEXT en .env.");
  const draftPathValue = value("--draft") ?? process.env.KIT_NEWSLETTER_DRAFT;
  if (!draftPathValue) throw new Error("Indica --draft con la ruta del Markdown revisado.");
  const draftPath = resolve(draftPathValue);
  const markdown = await readFile(draftPath, "utf8");
  const content = newsletterToHtml(markdown);

  // Evitar duplicados por título exacto antes del POST no idempotente.
  const listing = await kitRequest("/broadcasts?status=draft&per_page=1000", { apiKey });
  const existing = (listing.broadcasts ?? []).find((broadcast) => broadcast.subject?.trim() === subject.trim());
  if (existing) {
    process.stdout.write(`Ya existe un Broadcast con ese asunto (id ${existing.id}, estado ${existing.status}); no se creó otro.\n`);
    return;
  }

  const payload = buildBroadcastPayload({ subject, previewText, content, description: `Newsletter quincenal · ${subject}`, templateId });
  const result = await kitRequest("/broadcasts", { apiKey, method: "POST", body: payload });
  const broadcast = result.broadcast;
  if (!broadcast?.id || broadcast.status !== "draft" || broadcast.send_at !== null) {
    throw new Error("Kit respondió, pero no confirmó estado draft con send_at=null. Revisa el Broadcast en Kit antes de continuar.");
  }
  process.stdout.write(`Broadcast creado como borrador: id ${broadcast.id}, asunto «${broadcast.subject}», send_at=null. No se envió ni programó.\n`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
}
