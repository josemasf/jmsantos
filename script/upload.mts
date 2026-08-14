import "dotenv/config";
import { readdir } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { v2 as cloudinary } from "cloudinary";

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const publicDirectory = join(currentDirectory, "../public");
const uploadDirectories = [
  { directory: join(publicDirectory, "assets"), cloudinaryFolder: "jmsantos/assets" },
  { directory: join(publicDirectory, "images/blog"), cloudinaryFolder: "jmsantos/images/blog" },
];
const requiredEnvironmentVariables = ["CLOUD_NAME", "API_KEY", "API_SECRET"] as const;

type CloudinaryEnvironmentVariable = (typeof requiredEnvironmentVariables)[number];

async function main() {
  const configuration = getConfiguration();

  cloudinary.config(configuration);

  for (const { directory, cloudinaryFolder } of uploadDirectories) {
    for (const filePath of await listFiles(directory)) {
      const relativePath = relative(directory, filePath).replaceAll("\\", "/");
      const publicId = `${cloudinaryFolder}/${relativePath.replace(/\.[^.]+$/, "")}`;

      await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
      });

      console.log(`Subido: ${relativePath}`);
    }
  }
}

function getConfiguration() {
  const missingEnvironmentVariables = requiredEnvironmentVariables.filter((name) => !process.env[name]);

  if (missingEnvironmentVariables.length > 0) {
    throw new Error(`Faltan las variables de entorno: ${missingEnvironmentVariables.join(", ")}`);
  }

  return {
    cloud_name: getEnvironmentVariable("CLOUD_NAME"),
    api_key: getEnvironmentVariable("API_KEY"),
    api_secret: getEnvironmentVariable("API_SECRET"),
  };
}

function getEnvironmentVariable(name: CloudinaryEnvironmentVariable) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Falta la variable de entorno: ${name}`);
  }

  return value;
}

async function listFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = join(directory, entry.name);
      return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
    }),
  );

  return files.flat();
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
