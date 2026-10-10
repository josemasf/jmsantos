import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

export async function optimizeBlogImage(input, output) {
  if (!input || !output)
    throw new Error("Uso: pnpm images:optimize -- <entrada> <salida.webp>");
  if (!output.endsWith(".webp"))
    throw new Error("La salida debe tener extensión .webp.");
  if (resolve(input) === resolve(output))
    throw new Error("La salida debe ser distinta del original.");
  await mkdir(dirname(resolve(output)), { recursive: true });
  const image = await sharp(input)
    .rotate()
    .resize({ width: 1536, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer({ resolveWithObject: true });
  // No sobrescribir una portada ya existente.
  const { writeFile } = await import("node:fs/promises");
  await writeFile(output, image.data, { flag: "wx" });
  return {
    src: output,
    width: image.info.width,
    height: image.info.height,
    bytes: image.info.size,
  };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const args = process.argv.slice(2).filter((argument) => argument !== "--");
    console.log(JSON.stringify(await optimizeBlogImage(args[0], args[1])));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
