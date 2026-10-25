import assert from "node:assert/strict";
import test from "node:test";
import {
  syncPublicationIssues,
  upsertPublicationBlock,
} from "./sync-publication-issues.mjs";

const post = {
  id: "github-issues-grafo-trabajo-agentes",
  relativePath: "68-github-issues-grafo-trabajo-agentes.md",
  title: "GitHub Issues como grafo de trabajo",
  date: "2026-10-26",
  issue: 65,
};
const siteUrl = "https://josemariasantos.com";

test("actualiza el estado editorial programado de una serie al publicarse", () => {
  const body = [
    "## Estado editorial",
    "",
    "- **Borrador programado** — `src/content/drafts/posts/68-github-issues-grafo-trabajo-agentes.md`, fecha prevista: 2026-10-26.",
    "- **Borrador programado** — `src/content/drafts/posts/69-paralelismo-agentes-worktrees-contexto.md`, fecha prevista: 2026-10-27.",
  ].join("\n");
  const result = upsertPublicationBlock(body, post, siteUrl);

  assert.match(result, /\*\*Publicado en master\*\*/);
  assert.match(result, /src\/content\/posts\/68-github-issues-grafo-trabajo-agentes\.md/);
  assert.doesNotMatch(result, /src\/content\/drafts\/posts\/68-github-issues-grafo-trabajo-agentes\.md/);
  assert.match(result, /src\/content\/drafts\/posts\/69-paralelismo-agentes-worktrees-contexto\.md/);
  assert.match(result, /blog\/github-issues-grafo-trabajo-agentes\//);
  assert.equal(upsertPublicationBlock(result, post, siteUrl), result);
});

test("sin lista editorial previa añade un bloque verificable sin cerrar la issue", () => {
  const requests = [];
  const current = { body: "Serie editorial", state: "open" };
  const api = (method, endpoint, payload) => {
    requests.push({ method, endpoint, payload });
    if (method === "GET") return current;
    return { ...current, ...payload };
  };
  const updated = syncPublicationIssues({
    posts: [post],
    repository: "josemasf/jmsantos",
    siteUrl,
    api,
  });
  assert.deepEqual(updated, [65]);
  assert.equal(requests.length, 2);
  assert.equal(requests[1].method, "PATCH");
  assert.equal(requests[1].endpoint, "repos/josemasf/jmsantos/issues/65");
  assert.match(requests[1].payload.body, /Publicado/);
  assert.equal(requests[1].payload.state, undefined);
});

test("un post sin issue asociada no actualiza ninguna issue", () => {
  const updated = syncPublicationIssues({
    posts: [{ ...post, issue: undefined }],
    repository: "josemasf/jmsantos",
    siteUrl,
    api: () => {
      throw new Error("No se esperaba una llamada a GitHub");
    },
  });
  assert.deepEqual(updated, []);
});
