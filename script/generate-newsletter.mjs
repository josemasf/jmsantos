import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { findMarkdownFiles, parsePostDocument, postId } from "./post-frontmatter.mjs";
import { getMadridDate, isValidDate } from "./publish-scheduled-posts.mjs";

const MILLIS_PER_DAY = 86_400_000;
const DEFAULT_SITE = "https://josemariasantos.com";

export function dateOffset(date, days) {
  if (!isValidDate(date)) throw new Error(`Fecha inválida: ${date}`);
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * MILLIS_PER_DAY)
    .toISOString().slice(0, 10);
}

export function isBiweeklyEdition(date, anchor = "2026-11-02") {
  if (!isValidDate(date) || !isValidDate(anchor)) throw new Error("Fecha de edición o inicio inválida.");
  const diff = (Date.parse(`${date}T00:00:00Z`) - Date.parse(`${anchor}T00:00:00Z`)) / MILLIS_PER_DAY;
  return diff >= 0 && diff % 14 === 0;
}

export async function readNewsletterPosts(directory) {
  const root = resolve(directory);
  const files = await findMarkdownFiles(root);
  return Promise.all(files.map(async (filePath) => {
    const { data } = parsePostDocument(await readFile(filePath, "utf8"), relative(root, filePath));
    const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : data.date;
    if (!isValidDate(date) || typeof data.title !== "string" || !data.title.trim() || typeof data.description !== "string") {
      throw new Error(`${relative(root, filePath)}: frontmatter incompleto para newsletter.`);
    }
    return { title: data.title.trim(), description: data.description.trim(), date, id: postId(relative(root, filePath)) };
  }));
}

function safeInline(text) {
  return text.replace(/\s+/g, " ").replace(/[\\*\[\]`]/g, "\\$&").trim();
}

export function generateNewsletterDraft({ published, scheduled, editionDate, site = DEFAULT_SITE, maxUpcoming = 2 }) {
  if (!isValidDate(editionDate)) throw new Error("editionDate debe ser YYYY-MM-DD válido.");
  const start = dateOffset(editionDate, -14);
  const endFuture = dateOffset(editionDate, 28);
  const siteUrl = new URL(site);
  const recent = published
    .filter((post) => post.date >= start && post.date < editionDate)
    .sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
  // Las ideas futuras son SOLO candidatas: no se anuncian automáticamente al público.
  const upcoming = scheduled
    .filter((post) => post.date > editionDate && post.date <= endFuture)
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id))
    .slice(0, maxUpcoming);

  const articleLink = (post) => "[" + safeInline(post.title) + "](" + new URL("/blog/" + post.id + "/", siteUrl) + ")";
  const articleSummary = (post) => "**" + articleLink(post) + "** — " + safeInline(post.description);
  const first = recent[0];
  const secondary = recent.slice(1, 3);
  const quickReads = recent.slice(3);

  // Selección preliminar por fecha, NO por relevancia. El agente elige la lectura
  // destacada y reescribe la jerarquía antes de cualquier envío.
  const featured = first
    ? articleSummary(first) + "\n\n[REDACTAR: explicar por qué esta lectura es la protagonista y qué aprenderá el lector; cerrar con un CTA descriptivo.]"
    : "_No hay artículos publicados en el periodo. Preparar una edición autónoma contrastada o proponer posponer el envío._";
  const related = secondary.length
    ? secondary.map((post) => "- " + articleSummary(post)).join("\n")
    : "_Sin más artículos del periodo; omitir esta sección si no aporta contenido._";
  const more = quickReads.length
    ? "\n\n## Lecturas rápidas\n" + quickReads.map((post) => "- " + articleLink(post)).join("\n")
    : "";
  const inventory = recent.length
    ? recent.map((post) => "- " + articleSummary(post) + " (" + post.date + ")").join("\n")
    : "_Sin artículos publicados en el periodo._";
  const previews = upcoming.length
    ? upcoming.map((post) => "- [ ] **" + post.date + "** — " + safeInline(post.title) + ". Candidato privado; no enlazar ni prometer fecha. Pendiente de aprobar por el redactor.").join("\n")
    : "_No hay títulos programados en las próximas cuatro semanas. No inventar avances._";

  return [
    "<!-- BORRADOR INTERNO · NO ENVIAR NI PUBLICAR SIN REVISIÓN EDITORIAL -->",
    "<!-- La selección de la lectura destacada es preliminar. El agente debe elegirla por relevancia. -->",
    "**Estado:** pendiente de validación de Astro Content Writer y Editorial Reviewer.",
    "**Periodo de artículos:** " + start + " (incluido) — " + editionDate + " (excluido).",
    "**Destinatarios:** lectores suscritos voluntariamente.",
    "",
    "## Asunto y preheader · metadatos para Kit",
    "**Asunto:** [REDACTAR: tema concreto y valor para el lector; no usar 'Newsletter quincenal · fecha'.]",
    "**Preheader:** [REDACTAR: complementar el asunto sin repetirlo.]",
    "",
    "<!-- INICIO DEL CUERPO EDITORIAL: revisar y copiar solo tras aprobación -->",
    "*Lo que aprendo construyendo software · " + editionDate + "*",
    "",
    "# [REDACTAR: titular editorial con una idea, no un índice de artículos]",
    "",
    "[REDACTAR: apertura de 60–100 palabras sobre un problema concreto y su utilidad para el lector. Evitar 'En las últimas dos semanas he publicado...'.]",
    "",
    "## Lectura destacada",
    featured,
    "",
    "## Para profundizar",
    related,
    more,
    "",
    "## Una idea para aplicar",
    "[REDACTAR: comprobación, consejo o ejemplo verificable que aporte valor sin pulsar enlaces. No atribuir experiencias inventadas al autor; omitir si no hay base.]",
    "",
    "## Una pregunta para cerrar",
    "[REDACTAR: pregunta específica de la edición que anime a responder de forma natural.]",
    "",
    "José María Santos · josemariasantos.com",
    "<!-- FIN DEL CUERPO EDITORIAL -->",
    "",
    "---",
    "",
    "<!-- ANEXO INTERNO: NUNCA COPIAR A KIT NI PUBLICAR -->",
    "## Inventario de fuentes (solo uso interno)",
    inventory,
    "",
    "## Próximamente · Propuestas pendientes de aprobación (solo uso interno)",
    previews,
    "",
    "## Antes de programar en Kit (solo uso interno)",
    "- [ ] Newsletter Curator selecciona una tesis y una lectura principal por relevancia; reescribe las descripciones automáticas.",
    "- [ ] Asunto, preheader, apertura, lectura protagonista, idea aplicable y cierre no contienen placeholders.",
    "- [ ] Astro Content Writer valida el valor autónomo, la voz, la estructura y las URL.",
    "- [ ] Editorial Reviewer valida rigor, privacidad, fechas, accesibilidad y publicidad.",
    "- [ ] El autor aprueba la versión final y cualquier anticipo o publicidad.",
    "- [ ] Se aplica la plantilla de email compatible con Kit; se comprueba el render en móvil, escritorio y clientes principales.",
    "- [ ] Comprobar que cada enlace publicado responde y que Kit incluye baja y datos legales.",
    "- [ ] Programar manualmente el Broadcast en Kit. El workflow NUNCA envía correos.",
    "<!-- FIN DEL ANEXO INTERNO -->",
    "",
  ].join("\n");
}

function argumentValue(args, name) {
  const index = args.indexOf(name);
  if (index === -1) return undefined;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`Falta valor para ${name}`);
  return value;
}

async function main() {
  const args = process.argv.slice(2);
  const editionDate = argumentValue(args, "--date") ?? getMadridDate();
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  if (!isValidDate(editionDate)) throw new Error("La fecha debe ser YYYY-MM-DD.");
  const published = await readNewsletterPosts(argumentValue(args, "--posts-dir") ?? join(root, "src/content/posts"));
  const scheduled = await readNewsletterPosts(argumentValue(args, "--drafts-dir") ?? join(root, "src/content/drafts/posts"));
  const text = generateNewsletterDraft({ published, scheduled, editionDate });
  const output = argumentValue(args, "--output");
  if (output) {
    await mkdir(dirname(resolve(output)), { recursive: true });
    await writeFile(output, text, "utf8");
    process.stdout.write(`Borrador generado: ${resolve(output)}\n`);
  } else {
    process.stdout.write(text);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
}
