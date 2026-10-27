import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

function escapeXml(value: string): string {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  };
  return value.replace(/[&<>"']/g, (character) => entities[character] ?? character);
}

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL("https://josemariasantos.com/");
  const now = Date.now();
  const posts = (await getCollection("posts"))
    .filter((post) => post.data.date.getTime() <= now)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const items = posts.map((post) => {
    const url = new URL(`/blog/${post.id}/`, base).toString();
    return `<item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(post.data.description)}</description>
      <pubDate>${post.data.date.toUTCString()}</pubDate>
    </item>`;
  });

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Blog de José María Santos</title>
    <link>${escapeXml(new URL("/blog/", base).toString())}</link>
    <description>Experiencias y aprendizajes construyendo software: ingeniería, arquitectura, calidad, inteligencia artificial, producto y cultura de equipos.</description>
    <language>es-ES</language>
    ${items.join("\n")}
  </channel>
</rss>`, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
};
