import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { publishScheduledPosts } from "./publish-scheduled-posts.mjs";

async function createFixture() {
  const root = await mkdtemp(join(tmpdir(), "scheduled-posts-"));
  const sourceDirectory = join(root, "drafts/posts");
  const destinationDirectory = join(root, "content/posts");
  await mkdir(sourceDirectory, { recursive: true });

  return { destinationDirectory, sourceDirectory };
}

async function writePost(
  directory,
  fileName,
  { date, title = "Post de prueba" },
) {
  const filePath = join(directory, fileName);
  await mkdir(join(filePath, ".."), { recursive: true });
  await writeFile(
    filePath,
    `---\ntitle: "${title}"\ndescription: "Descripción de prueba"\ndate: ${date}\ntags: [Testing]\ncategory: Testing\n---\n\nContenido.\n`,
  );
}

test("publica posts anteriores o del mismo día y conserva las subcarpetas", async () => {
  const fixture = await createFixture();
  await writePost(fixture.sourceDirectory, "01-anterior.md", {
    date: "2026-08-10",
    title: "Anterior",
  });
  await writePost(fixture.sourceDirectory, "series/02-hoy.md", {
    date: "2026-08-11",
    title: "Hoy",
  });
  await writePost(fixture.sourceDirectory, "03-futuro.md", {
    date: "2026-08-12",
    title: "Futuro",
  });

  const result = await publishScheduledPosts({
    ...fixture,
    publicationDate: "2026-08-11",
  });

  assert.deepEqual(
    result.posts.map((post) => post.title),
    ["Anterior", "Hoy"],
  );
  assert.equal(result.posts[0].id, "anterior");
  assert.equal(result.posts[1].id, "series/02-hoy");
  assert.match(
    await readFile(
      join(fixture.destinationDirectory, "01-anterior.md"),
      "utf8",
    ),
    /title: "Anterior"/,
  );
  assert.match(
    await readFile(
      join(fixture.destinationDirectory, "series/02-hoy.md"),
      "utf8",
    ),
    /title: "Hoy"/,
  );
  await assert.rejects(
    readFile(join(fixture.sourceDirectory, "01-anterior.md")),
  );
  assert.equal(
    await readFile(join(fixture.sourceDirectory, "03-futuro.md"), "utf8"),
    await readFile(join(fixture.sourceDirectory, "03-futuro.md"), "utf8"),
  );
});

test("--dry-run detecta posts vencidos sin moverlos", async () => {
  const fixture = await createFixture();
  await writePost(fixture.sourceDirectory, "01-publicable.md", {
    date: "2026-08-11",
  });

  const result = await publishScheduledPosts({
    ...fixture,
    dryRun: true,
    publicationDate: "2026-08-11",
  });

  assert.equal(result.posts.length, 1);
  assert.equal(
    await readFile(join(fixture.sourceDirectory, "01-publicable.md"), "utf8"),
    await readFile(join(fixture.sourceDirectory, "01-publicable.md"), "utf8"),
  );
  await assert.rejects(
    readFile(join(fixture.destinationDirectory, "01-publicable.md")),
  );
});

test("un frontmatter con fecha inválida detiene el lote antes de mover archivos", async () => {
  const fixture = await createFixture();
  await writePost(fixture.sourceDirectory, "01-valido.md", {
    date: "2026-08-10",
  });
  await writePost(fixture.sourceDirectory, "02-invalido.md", {
    date: "2026-02-30",
  });

  await assert.rejects(
    publishScheduledPosts({ ...fixture, publicationDate: "2026-08-11" }),
    /fecha válida/,
  );
  assert.equal(
    await readFile(join(fixture.sourceDirectory, "01-valido.md"), "utf8"),
    await readFile(join(fixture.sourceDirectory, "01-valido.md"), "utf8"),
  );
  await assert.rejects(
    readFile(join(fixture.destinationDirectory, "01-valido.md")),
  );
});
