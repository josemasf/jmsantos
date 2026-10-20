import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { dateOffset, isBiweeklyEdition, readNewsletterPosts, generateNewsletterDraft } from "./generate-newsletter.mjs";

const published = [
  { id: "uno", title: "Un artículo", description: "Descripción de prueba", date: "2026-10-27" },
  { id: "anterior", title: "Antiguo", description: "Fuera del periodo", date: "2026-10-18" },
  { id: "limite", title: "Límite", description: "Inicio inclusivo", date: "2026-10-19" },
];
const scheduled = [
  { id: "proximo", title: "Próximo post", description: "Todavía privado", date: "2026-11-03" },
  { id: "vencido", title: "Atrasado", description: "No anticipar", date: "2026-10-30" },
];

test("ediciones ancladas cada 14 días", () => {
  assert.equal(isBiweeklyEdition("2026-11-02"), true);
  assert.equal(isBiweeklyEdition("2026-11-09"), false);
  assert.equal(isBiweeklyEdition("2026-11-16"), true);
  assert.equal(isBiweeklyEdition("2026-10-19"), false);
  assert.equal(dateOffset("2027-01-01", -1), "2026-12-31");
  assert.throws(() => isBiweeklyEdition("2026-02-30"));
});

test("usa únicamente publicaciones de los últimos 14 días y anticipos futuros", () => {
  const draft = generateNewsletterDraft({ published, scheduled, editionDate: "2026-11-02" });
  assert.match(draft, /Un artículo/);
  assert.match(draft, /Límite/);
  assert.doesNotMatch(draft, /Antiguo/);
  assert.match(draft, /Próximo post/);
  assert.doesNotMatch(draft, /Atrasado/);
  assert.match(draft, /Pendiente de aprobar por el redactor/);
  assert.match(draft, /El autor aprueba la versión final/);
});

test("no inventa artículos ni próximos títulos cuando no hay material", () => {
  const draft = generateNewsletterDraft({ published: [], scheduled: [], editionDate: "2026-11-02" });
  assert.match(draft, /No hay artículos publicados/);
  assert.match(draft, /No hay títulos programados/);
});

test("lee carpetas recursivas y elimina el prefijo numérico del slug", async () => {
  const dir = await mkdtemp(join(tmpdir(), "newsletter-test-"));
  try {
    await mkdir(join(dir, "series"));
    await writeFile(join(dir, "series", "42-ejemplo.md"), "---\ntitle: Ejemplo\ndescription: Contenido probado\ndate: 2026-11-03\n---\nTexto");
    const posts = await readNewsletterPosts(dir);
    assert.equal(posts.length, 1);
    assert.equal(posts[0].id, "series/42-ejemplo");
    assert.equal(posts[0].title, "Ejemplo");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
