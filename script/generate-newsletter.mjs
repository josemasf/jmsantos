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

  const articles = recent.length
    ? recent.map((post) => `- **[${safeInline(post.title)}](${new URL(`/blog/${post.id}/`, siteUrl)})** (${post.date}) — ${safeInline(post.description)}`).join("\n")
    : "_No hay artículos publicados en este periodo. Replantear esta edición antes del envío._";
  const previews = upcoming.length
    ? upcoming.map((post) => `- [ ] **${post.date}** — ${safeInline(post.title)}. **Pendiente de aprobar por el redactor; no enlazar ni prometer fecha.**`).join("\n")
    : "_No hay títulos programados en las próximas cuatro semanas. No inventar avances._";

  return `<!-- BORRADOR INTERNO · NO ENVIAR NI PUBLICAR SIN REVISIÓN EDITORIAL -->
# Newsletter quincenal · ${editionDate}

**Estado:** pendiente de validación de Astro Content Writer y Editorial Reviewer.
**Periodo de artículos:** ${start} (incluido) — ${editionDate} (excluido).
**Destinatarios:** lectores suscritos voluntariamente a la newsletter del blog.

## Introducción personal
[REDACTAR: contextualizar las publicaciones. No inventar experiencias, resultados ni opiniones del autor.]

## Lo publicado en las últimas dos semanas
${articles}

## Próximamente · Propuestas pendientes de aprobación
${previews}

## Una idea útil
[REDACTAR: seleccionar una reflexión real del autor o una referencia contrastada; omitir la sección si no aporta valor.]

## Publicidad propia (opcional)
[SOLO CON APROBACIÓN EXPRESA: contenido propio o patrocinador contratado y validado por el autor. Identificar como publicidad. Sin redes de anuncios, recomendaciones automáticas ni cesión de correos a anunciantes.]

## Antes de programar en Kit
- [ ] Astro Content Writer valida el texto, las URL y decide qué anticipos se pueden anunciar.
- [ ] Editorial Reviewer valida rigor, privacidad, fechas y uso de publicidad.
- [ ] El autor aprueba la versión final y los posibles anuncios.
- [ ] Comprobar que cada enlace publicado responde y que el correo incluye baja y datos legales de Kit.
- [ ] Programar manualmente el Broadcast en Kit. El workflow NUNCA envía correos.
`;
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
