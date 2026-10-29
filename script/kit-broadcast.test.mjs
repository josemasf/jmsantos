import test from "node:test";
import assert from "node:assert/strict";
import { buildBroadcastPayload, kitRequest, newsletterToHtml } from "./kit-broadcast.mjs";

test("converts newsletter Markdown to escaped email HTML with links", () => {
  const html = newsletterToHtml("# Hola\n\nTexto **fuerte** y [enlace](https://example.com/?a=1&b=2).\n\n- Uno\n- Dos");
  assert.match(html, /<h2>Hola<\/h2>/);
  assert.match(html, /<strong>fuerte<\/strong>/);
  assert.match(html, /<a href="https:\/\/example\.com\/\?a=1&amp;b=2">enlace<\/a>/);
  assert.match(html, /<ul>[\s\S]*<li>Uno<\/li>[\s\S]*<li>Dos<\/li>[\s\S]*<\/ul>/);
});

test("builds payload explicitly as a private, unscheduled draft", () => {
  const payload = buildBroadcastPayload({ subject: "Hola", previewText: "Vista", content: "<p>Hola</p>", templateId: "42" });
  assert.deepEqual(payload, {
    subject: "Hola",
    preview_text: "Vista",
    content: "<p>Hola</p>",
    description: "Hola",
    public: false,
    published_at: payload.published_at,
    send_at: null,
    email_address: null,
    email_template_id: 42,
  });
  assert.ok(Number.isFinite(Date.parse(payload.published_at)));
});

test("sends Kit auth only in header and reports API errors", async () => {
  let seen;
  const response = await kitRequest("/broadcasts", {
    apiKey: "secret",
    fetchImpl: async (url, options) => {
      seen = { url, options };
      return { ok: true, json: async () => ({ broadcasts: [] }) };
    },
  });
  assert.deepEqual(response, { broadcasts: [] });
  assert.equal(seen.options.headers["X-Kit-Api-Key"], "secret");
  assert.equal(seen.options.body, undefined);
  await assert.rejects(() => kitRequest("/broadcasts", {
    apiKey: "secret",
    fetchImpl: async () => ({ ok: false, status: 401, json: async () => ({ errors: ["Unauthorized"] }) }),
  }), /Unauthorized/);
});
