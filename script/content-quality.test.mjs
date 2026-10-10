import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import sharp from "sharp";
import { checkContent, checkBuiltBlogLinks } from "./check-content.mjs";
import {
  parsePostFrontmatter,
  publishScheduledPosts,
} from "./publish-scheduled-posts.mjs";
import { syncPublicationIssues } from "./sync-publication-issues.mjs";
import { optimizeBlogImage } from "./optimize-blog-image.mjs";

async function fixture(t) {
  const rootDirectory = await mkdtemp(join(tmpdir(), "blog-content-"));
  t.after(() => rm(rootDirectory, { recursive: true, force: true }));
  return rootDirectory;
}

async function post(root, path, extra = "", date = "2026-10-10") {
  const file = join(root, "src/content", path);
  await mkdir(join(file, ".."), { recursive: true });
  await writeFile(
    file,
    `---\ntitle: "Decisiones #1"\ndescription: "Una tesis"\ndate: ${date}\ntags: [Testing]\ncategory: Testing\n${extra}---\n\nContenido.\n`,
  );
}

test("el parser respeta YAML, comentarios dentro de títulos y números de issue", () => {
  const result = parsePostFrontmatter(
    '---\r\ntitle: "Decisiones #1"\r\ndate: "2026-10-10" # fecha\r\nissue: 66\r\n---\r\nTexto',
  );
  assert.deepEqual(result, {
    title: "Decisiones #1",
    date: "2026-10-10",
    issue: 66,
  });
  assert.throws(
    () =>
      parsePostFrontmatter("---\ntitle: X\ndate: 2026-10-10\nissue: otra\n---"),
    /issue/,
  );
  assert.throws(
    () =>
      parsePostFrontmatter(
        "---\ntitle: X\ndate: 2026-10-10\ndate: 2026-10-11\n---",
      ),
    /unique/i,
  );
});

test("el manifiesto conserva la issue original en dry-run sin mover el borrador", async (t) => {
  const root = await fixture(t);
  await post(root, "drafts/posts/01-prueba.md", "issue: 66\n");
  const result = await publishScheduledPosts({
    sourceDirectory: join(root, "src/content/drafts/posts"),
    destinationDirectory: join(root, "src/content/posts"),
    publicationDate: "2026-10-10",
    dryRun: true,
  });
  assert.equal(result.posts[0].issue, 66);
  assert.equal(result.posts[0].id, "prueba");
});

test("detecta slugs duplicados aunque cambien prefijo y carpeta", async (t) => {
  const rootDirectory = await fixture(t);
  await post(rootDirectory, "posts/01-prueba.md");
  await post(rootDirectory, "drafts/posts/99-prueba.md");
  const { errors } = await checkContent({ rootDirectory });
  assert.ok(errors.some((error) => error.includes("slug duplicado")));
});

test("rechaza fechas imposibles, campos antiguos de serie y series sin registro", async (t) => {
  const rootDirectory = await fixture(t);
  await post(rootDirectory, "posts/01-fecha.md", "", "2026-02-30");
  await post(
    rootDirectory,
    "posts/02-campos.md",
    "series:\n  slug: pruebas\n  order: 1\n  title: Ya no existe\n",
  );
  await post(
    rootDirectory,
    "drafts/posts/03-serie.md",
    "series:\n  slug: desconocida\n  order: 1\n",
  );
  const { errors } = await checkContent({ rootDirectory, series: {} });
  assert.ok(errors.some((error) => error.includes("fecha válida")));
  assert.ok(errors.some((error) => error.includes("Unrecognized")));
  assert.ok(errors.some((error) => error.includes("serie sin registrar")));
});

test("compara orden e imagen social entre publicados y drafts", async (t) => {
  const rootDirectory = await fixture(t);
  await post(
    rootDirectory,
    "posts/01-uno.md",
    "series:\n  slug: pruebas\n  order: 1\n",
  );
  await post(
    rootDirectory,
    "drafts/posts/02-dos.md",
    "series:\n  slug: pruebas\n  order: 1\n  image:\n    src: /images/blog/pruebas/falta.png\n    alt: Portada\n",
  );
  const { errors } = await checkContent({
    rootDirectory,
    series: { pruebas: { title: "Pruebas" } },
  });
  assert.ok(errors.some((error) => error.includes("orden de serie duplicado")));
  assert.ok(
    errors.some((error) => error.includes("portada social inconsistente")),
  );
  assert.ok(errors.some((error) => error.includes("imagen ausente")));
});

test("valida dimensiones contra el archivo real y admite una imagen correcta", async (t) => {
  const rootDirectory = await fixture(t);
  const directory = join(rootDirectory, "public/images/blog/prueba");
  await mkdir(directory, { recursive: true });
  await sharp({
    create: { width: 40, height: 20, channels: 3, background: "white" },
  })
    .png()
    .toFile(join(directory, "portada.png"));
  await post(
    rootDirectory,
    "posts/01-prueba.md",
    "image:\n  src: /images/blog/prueba/portada.png\n  alt: Una portada\n  width: 40\n  height: 20\n",
  );
  assert.deepEqual((await checkContent({ rootDirectory })).errors, []);
  await post(
    rootDirectory,
    "posts/01-prueba.md",
    "image:\n  src: /images/blog/prueba/portada.png\n  alt: Una portada\n  width: 41\n  height: 20\n",
  );
  assert.ok(
    (await checkContent({ rootDirectory })).errors.some((error) =>
      error.includes("dimensiones incorrectas"),
    ),
  );
});

test("comprueba rutas del HTML generado, incluidas URL absolutas y sin barra final", async (t) => {
  const root = await fixture(t);
  await mkdir(join(root, "dist/blog/real"), { recursive: true });
  await writeFile(
    join(root, "dist/blog/real/index.html"),
    '<a href="/blog/real?x=1#titulo">Real</a><a href="https://josemariasantos.com/blog/pendiente/">Pendiente</a><a href="https://otra.web/blog/ajeno/">Ajeno</a>',
  );
  assert.deepEqual(await checkBuiltBlogLinks(root), [
    "blog/real/index.html: enlace roto: /blog/pendiente/",
  ]);
});

test("sincroniza issues de forma idempotente, preservando su cuerpo y estado", () => {
  const issues = new Map([
    [
      66,
      {
        body: "## Estado editorial\nSerie en curso.\n\n## Plan\nConservar decisiones.",
        state: "open",
      },
    ],
  ]);
  const writes = [];
  const api = (method, endpoint, data) => {
    assert.equal(endpoint, "repos/josemasf/jmsantos/issues/66");
    if (method === "GET") return issues.get(66);
    writes.push(data);
    issues.set(66, { ...issues.get(66), ...data });
    return issues.get(66);
  };
  const posts = [
    {
      issue: 66,
      id: "uno",
      title: "Uno",
      date: "2026-10-10",
      relativePath: "01-uno.md",
    },
    {
      issue: 66,
      id: "dos",
      title: "Dos",
      date: "2026-10-11",
      relativePath: "02-dos.md",
    },
    { id: "sin-issue" },
  ];
  const options = {
    posts,
    repository: "josemasf/jmsantos",
    siteUrl: "https://josemariasantos.com/",
    api,
  };
  syncPublicationIssues(options);
  syncPublicationIssues(options);
  assert.equal(writes.length, 2);
  assert.match(issues.get(66).body, /Conservar decisiones/);
  assert.match(issues.get(66).body, /\/blog\/uno\//);
  assert.match(issues.get(66).body, /\/blog\/dos\//);
  assert.equal(issues.get(66).state, "open");
  assert.throws(
    () =>
      syncPublicationIssues({
        ...options,
        posts: [{ ...posts[0], issue: -1 }],
      }),
    /issue inválido/,
  );
});

test("optimiza un asset real a WebP y evita sobrescribir la portada", async (t) => {
  const root = await fixture(t);
  const input = join(root, "original.png");
  const output = join(root, "blog/portada.webp");
  await sharp({
    create: { width: 2000, height: 1000, channels: 3, background: "white" },
  })
    .png()
    .toFile(input);
  const result = await optimizeBlogImage(input, output);
  assert.equal(result.width, 1536);
  assert.equal(result.height, 768);
  assert.equal((await sharp(output).metadata()).format, "webp");
  await assert.rejects(optimizeBlogImage(input, output), /EEXIST/);
});
