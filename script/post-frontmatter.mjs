import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { parseDocument } from "yaml";

export function parsePostDocument(contents, filePath = "el post") {
  const match = contents.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error(`${filePath}: falta un frontmatter YAML válido.`);
  const document = parseDocument(match[1]);
  if (document.errors.length) {
    throw new Error(`${filePath}: ${document.errors[0].message}`);
  }
  const data = document.toJS();
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error(`${filePath}: el frontmatter debe ser un objeto.`);
  }
  return { data, body: contents.slice(match[0].length) };
}

export function postId(relativePath) {
  return relativePath
    .replaceAll("\\", "/")
    .replace(/\.md$/, "")
    .replace(/^\d+-/, "");
}

export async function findMarkdownFiles(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory()
        ? findMarkdownFiles(path)
        : entry.isFile() && entry.name.endsWith(".md")
          ? [path]
          : [];
    }),
  );
  return files.flat().sort();
}
