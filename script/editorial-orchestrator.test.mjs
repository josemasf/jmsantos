import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
import test from "node:test";
import { parseDocument } from "yaml";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const agentRoot = resolve(root, ".github/agents");

async function agentFile(file) {
  const contents = await readFile(resolve(agentRoot, file), "utf8");
  const match = contents.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert.ok(match, `Falta el frontmatter de ${file}`);
  const parsed = parseDocument(match[1]);
  assert.deepEqual(parsed.errors, [], `Frontmatter inválido: ${file}`);
  return { config: parsed.toJS(), contents };
}

test("Editorial Orchestrator está disponible y restringe la delegación a especialistas reales", async () => {
  const { config } = await agentFile("editorial-orchestrator.agent.md");
  assert.equal(config.name, "Editorial Orchestrator");
  assert.equal(config["user-invocable"], true);
  assert.equal(config["disable-model-invocation"], true);
  assert.ok(config.tools.includes("agent"), "Falta la herramienta de delegación Local");
  assert.ok(config.tools.includes("task"), "Falta la referencia de delegación Copilot");

  const expected = [
    "Editorial Planner",
    "Technical Researcher",
    "Astro Content Writer",
    "Visual Asset Prompt Designer",
    "Editorial Reviewer",
  ];
  assert.deepEqual(config.agents, expected);
  assert.equal(new Set(config.agents).size, config.agents.length);

  const filenames = [
    "editorial-planner.agent.md",
    "technical-researcher.agent.md",
    "astro-content-writer.agent.md",
    "visual-asset-prompt-designer.agent.md",
    "editorial-reviewer.agent.md",
  ];
  for (let i = 0; i < filenames.length; i++) {
    const worker = (await agentFile(filenames[i])).config;
    assert.equal(worker.name, expected[i], filenames[i]);
    assert.notEqual(worker["disable-model-invocation"], true, filenames[i]);
  }
});

test("el orquestador conserva las barreras editoriales y la documentación de entrada", async () => {
  const { contents } = await agentFile("editorial-orchestrator.agent.md");
  const registry = await readFile(resolve(root, "AGENTS.md"), "utf8");
  const workflow = await readFile(resolve(root, "docs/editorial-workflow.md"), "utf8");

  for (const marker of [
    "issue: N",
    "no finjas ejecuciones",
    "revisión independiente",
    "No publiques",
    "dos rondas automáticas",
    "Editorial Reviewer",
  ]) {
    assert.ok(contents.toLowerCase().includes(marker.toLowerCase()), marker);
  }
  assert.ok(registry.includes("editorial-orchestrator.agent.md"));
  assert.ok(workflow.includes("## Orquestación de artículos"));
  assert.ok(workflow.includes("Editorial Orchestrator"));
});
