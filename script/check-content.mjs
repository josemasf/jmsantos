import { access, readFile, readdir } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { postSchema } from "../src/data/post-schema.ts";
import { blogSeries } from "../src/data/blog-series.ts";
import {
  findMarkdownFiles,
  parsePostDocument,
  postId,
} from "./post-frontmatter.mjs";
import { isValidDate } from "./publish-scheduled-posts.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export async function checkContent({
  rootDirectory = root,
  series = blogSeries,
} = {}) {
  const errors = [];
  const warnings = [];
  const posts = [];
  for (const folder of ["posts", "drafts/posts"]) {
    const directory = join(rootDirectory, "src/content", folder);
    for (const path of await findMarkdownFiles(directory)) {
      const name = relative(rootDirectory, path);
      try {
        const { data, body } = parsePostDocument(
          await readFile(path, "utf8"),
          name,
        );
        const validation = postSchema.safeParse(data);
        if (!validation.success) {
          errors.push(
            `${name}: ${validation.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ")}`,
          );
          continue;
        }
        for (const field of ["date", "updatedDate"]) {
          if (
            data[field] !== undefined &&
            (typeof data[field] !== "string" || !isValidDate(data[field]))
          ) {
            errors.push(
              `${name}: ${field} debe ser una fecha válida YYYY-MM-DD.`,
            );
          }
        }
        if (data.updatedDate && data.updatedDate < data.date)
          errors.push(`${name}: updatedDate es anterior a date.`);
        posts.push({
          ...data,
          body,
          name,
          id: postId(relative(directory, path)),
          published: folder === "posts",
        });
      } catch (error) {
        errors.push(error.message);
      }
    }
  }

  const ids = new Map();
  const orders = new Map();
  const seriesImages = new Map();
  for (const post of posts) {
    if (ids.has(post.id))
      errors.push(
        `${post.name}: slug duplicado con ${ids.get(post.id)} (${post.id}).`,
      );
    ids.set(post.id, post.name);
    if (post.series) {
      const { slug, order, image } = post.series;
      if (!Object.hasOwn(series, slug))
        errors.push(`${post.name}: serie sin registrar: ${slug}.`);
      const key = `${slug}:${order}`;
      if (orders.has(key))
        errors.push(
          `${post.name}: orden de serie duplicado con ${orders.get(key)} (${key}).`,
        );
      orders.set(key, post.name);
      const signature = JSON.stringify(
        image ? [image.src, image.alt, image.width, image.height] : null,
      );
      if (seriesImages.has(slug) && seriesImages.get(slug) !== signature)
        errors.push(`${post.name}: portada social inconsistente en ${slug}.`);
      seriesImages.set(slug, signature);
    }
    for (const image of [post.image, post.series?.image].filter(Boolean)) {
      if (!image.alt.trim())
        errors.push(`${post.name}: imagen sin alt descriptivo.`);
      if (!image.src.startsWith("/images/blog/")) {
        errors.push(
          `${post.name}: guardar la imagen editorial en /images/blog/.`,
        );
        continue;
      }
      const publicDirectory = join(rootDirectory, "public");
      const path = resolve(publicDirectory, `.${image.src}`);
      if (!path.startsWith(`${publicDirectory}${sep}`)) {
        errors.push(`${post.name}: ruta de imagen fuera de public.`);
        continue;
      }
      try {
        const metadata = await sharp(path).metadata();
        if (
          (image.width && image.width !== metadata.width) ||
          (image.height && image.height !== metadata.height)
        )
          errors.push(`${post.name}: dimensiones incorrectas en ${image.src}.`);
        if (!image.width || !image.height)
          warnings.push(`${post.name}: faltan dimensiones en ${image.src}.`);
      } catch {
        errors.push(`${post.name}: imagen ausente o ilegible: ${image.src}.`);
      }
    }
  }
  for (const slug of seriesImages.keys()) {
    const positions = posts
      .filter((post) => post.series?.slug === slug)
      .map((post) => post.series.order)
      .sort((a, b) => a - b);
    const unique = [...new Set(positions)];
    if (unique.some((order, index) => order !== index + 1)) {
      errors.push(
        `Serie ${slug}: los órdenes deben ser consecutivos desde 1 (actuales: ${unique.join(", ")}).`,
      );
    }
  }
  return { errors, warnings, posts };
}

// Validar el HTML real incluye enlaces Markdown, referencias y HTML embebido.
export async function checkBuiltBlogLinks(rootDirectory = root) {
  const directory = join(rootDirectory, "dist");
  const errors = [];
  async function visit(folder) {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      const path = join(folder, entry.name);
      if (entry.isDirectory()) {
        await visit(path);
        continue;
      }
      if (!entry.name.endsWith(".html")) continue;
      const html = await readFile(path, "utf8");
      const pagePath = `/${relative(directory, path)
        .replaceAll("\\", "/")
        .replace(/index\.html$/, "")}`;
      const pageUrl = new URL(pagePath, "https://josemariasantos.com");
      for (const match of html.matchAll(/href=["']([^"']+)["']/g)) {
        const url = new URL(match[1], pageUrl);
        if (
          url.origin !== "https://josemariasantos.com" ||
          !url.pathname.startsWith("/blog/")
        )
          continue;
        const target = resolve(
          directory,
          `.${decodeURIComponent(url.pathname)}`,
          "index.html",
        );
        if (!target.startsWith(`${directory}${sep}`)) {
          errors.push(`${path}: ruta fuera de dist.`);
          continue;
        }
        try {
          await access(target);
        } catch {
          errors.push(
            `${relative(directory, path)}: enlace roto: ${url.pathname}`,
          );
        }
      }
    }
  }
  await visit(directory);
  return [...new Set(errors)];
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const { errors, warnings, posts } = await checkContent();
    if (process.argv.includes("--built"))
      errors.push(...(await checkBuiltBlogLinks()));
    warnings.forEach((message) => console.warn(`Aviso: ${message}`));
    errors.forEach((message) => console.error(message));
    console.log(
      `${posts.length} artículos revisados; ${errors.length} errores; ${warnings.length} avisos.`,
    );
    if (errors.length) process.exitCode = 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
