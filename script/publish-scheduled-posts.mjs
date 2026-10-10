import { access, mkdir, readFile, rename } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  findMarkdownFiles,
  parsePostDocument,
  postId,
} from "./post-frontmatter.mjs";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function getArgumentValue(argumentsList, argumentName) {
  const argumentIndex = argumentsList.indexOf(argumentName);

  if (argumentIndex === -1) {
    return undefined;
  }

  const value = argumentsList[argumentIndex + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`Falta el valor para ${argumentName}.`);
  }

  return value;
}

export function parsePostFrontmatter(contents, filePath = "el post") {
  const { data } = parsePostDocument(contents, filePath);
  const date = data.date;
  if (typeof date !== "string" || !isValidDate(date)) {
    throw new Error(
      `${filePath}: el campo date debe tener el formato YYYY-MM-DD y ser una fecha válida.`,
    );
  }

  const title = data.title;
  if (typeof title !== "string" || !title.trim()) {
    throw new Error(`${filePath}: falta el campo title en el frontmatter.`);
  }

  if (
    data.issue !== undefined &&
    (!Number.isSafeInteger(data.issue) || data.issue <= 0)
  ) {
    throw new Error(`${filePath}: issue debe ser un número entero positivo.`);
  }
  return {
    date,
    title,
    ...(data.issue !== undefined ? { issue: data.issue } : {}),
  };
}

export function isValidDate(value) {
  if (!DATE_PATTERN.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
  );
}

export function getMadridDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

export async function publishScheduledPosts({
  sourceDirectory,
  destinationDirectory,
  publicationDate = getMadridDate(),
  dryRun = false,
}) {
  if (!isValidDate(publicationDate)) {
    throw new Error(
      "La fecha de publicación debe tener el formato YYYY-MM-DD.",
    );
  }

  const source = resolve(sourceDirectory);
  const destination = resolve(destinationDirectory);
  const files = await findMarkdownFiles(source);
  const posts = await Promise.all(
    files.map(async (filePath) => {
      const frontmatter = parsePostFrontmatter(
        await readFile(filePath, "utf8"),
        relative(source, filePath),
      );
      const relativePath = relative(source, filePath);

      return {
        ...frontmatter,
        filePath,
        relativePath,
        id: postId(relativePath),
        destinationPath: join(destination, relativePath),
      };
    }),
  );
  const duePosts = posts.filter((post) => post.date <= publicationDate);

  for (const post of duePosts) {
    if (await pathExists(post.destinationPath)) {
      throw new Error(
        `${post.relativePath}: ya existe un post con ese nombre en la colección pública.`,
      );
    }
  }

  if (!dryRun) {
    for (const post of duePosts) {
      await mkdir(dirname(post.destinationPath), { recursive: true });
      await rename(post.filePath, post.destinationPath);
    }
  }

  return {
    publicationDate,
    dryRun,
    posts: duePosts.map(({ date, id, relativePath, title, issue }) => ({
      date,
      id,
      relativePath,
      title,
      ...(issue !== undefined ? { issue } : {}),
    })),
  };
}

function getCliOptions(argumentsList) {
  const scriptDirectory = dirname(fileURLToPath(import.meta.url));
  const rootDirectory = resolve(scriptDirectory, "..");
  const publicationDate =
    getArgumentValue(argumentsList, "--date") ?? getMadridDate();

  return {
    sourceDirectory:
      getArgumentValue(argumentsList, "--source") ??
      join(rootDirectory, "src/content/drafts/posts"),
    destinationDirectory:
      getArgumentValue(argumentsList, "--destination") ??
      join(rootDirectory, "src/content/posts"),
    publicationDate,
    dryRun: argumentsList.includes("--dry-run"),
  };
}

const isExecutedDirectly =
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isExecutedDirectly) {
  try {
    const result = await publishScheduledPosts(
      getCliOptions(process.argv.slice(2)),
    );
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
