import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function upsertPublicationBlock(body, post, siteUrl) {
  const marker = encodeURIComponent(post.id);
  const start = `<!-- blog-publication:${marker}:start -->`;
  const end = `<!-- blog-publication:${marker}:end -->`;
  const block = [
    start,
    `### Publicación: ${post.title}`,
    "",
    "- Estado editorial del artículo: **Publicado**.",
    `- Archivo: \`src/content/posts/${post.relativePath}\`.`,
    `- Fecha: ${post.date}.`,
    `- URL: ${siteUrl.replace(/\/$/, "")}/blog/${post.id}/`,
    "",
    "El archivo está publicado en master; este registro no verifica la finalización del despliegue de Netlify.",
    end,
  ].join("\n");
  const previous = body ?? "";
  const from = previous.indexOf(start);
  const to = previous.indexOf(end, from);
  if (from !== -1 && to !== -1)
    return previous.slice(0, from) + block + previous.slice(to + end.length);
  return `${previous.trimEnd()}\n\n${block}\n`.trimStart();
}

export function syncPublicationIssues({ posts, repository, siteUrl, api }) {
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository))
    throw new Error("Repositorio inválido.");
  const origin = new URL(siteUrl);
  if (origin.protocol !== "https:")
    throw new Error("SITE_URL debe usar HTTPS.");
  const linked = posts.filter((post) => post.issue !== undefined);
  for (const post of linked) {
    if (!Number.isSafeInteger(post.issue) || post.issue <= 0)
      throw new Error("Número de issue inválido.");
    if (!post.id || !post.relativePath || !post.title || !post.date)
      throw new Error("Manifiesto de publicación incompleto.");
  }
  const updated = [];
  for (const post of linked) {
    const endpoint = `repos/${repository}/issues/${post.issue}`;
    const issue = api("GET", endpoint);
    if (issue.pull_request)
      throw new Error(`#${post.issue} es una PR, no una issue editorial.`);
    const body = upsertPublicationBlock(issue.body, post, siteUrl);
    if (body !== issue.body) api("PATCH", endpoint, { body });
    // No cerrar: una issue puede representar varios artículos o una serie.
    updated.push(post.issue);
  }
  return updated;
}

function githubApi(method, endpoint, data) {
  return JSON.parse(
    execFileSync(
      "gh",
      ["api", "--method", method, endpoint, ...(data ? ["--input", "-"] : [])],
      {
        encoding: "utf8",
        ...(data ? { input: JSON.stringify(data) } : {}),
      },
    ),
  );
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const { posts } = JSON.parse(
      await readFile(process.argv[2] ?? "publication.json", "utf8"),
    );
    const updated = syncPublicationIssues({
      posts,
      repository: process.env.GITHUB_REPOSITORY,
      siteUrl: process.env.SITE_URL,
      api: githubApi,
    });
    console.log(
      `Issues sincronizadas: ${updated.join(", ") || "ninguna (posts sin issue)"}.`,
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
