const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dzrgc7fqy/image/upload";

type CloudinaryImageOptions = {
  width: number;
  height?: number;
  crop?: "fill" | "fit";
};

export const cloudinaryWidths = {
  hero: [360, 480, 640, 768, 960, 1280, 1536],
  grid: [320, 480, 640, 800, 960],
  content: [640, 960, 1280, 1536],
  modal: [768, 1024, 1280, 1536],
} as const;

const CLOUDINARY_ASSET_PREFIXES = [
  ["/assets/", "jmsantos/assets/"],
  ["/images/about/", "jmsantos/images/about/"],
  ["/images/blog/", "jmsantos/images/blog/"],
] as const;

/**
 * Builds an optimised delivery URL for assets already stored in the
 * `jmsantos/assets` or `jmsantos/images/blog` Cloudinary folders.
 */
export function cloudinaryAssetUrl(
  assetPath: string,
  { width, height, crop = "fit" }: CloudinaryImageOptions,
) {
  const publicId = getCloudinaryPublicId(assetPath);
  const transformations = ["f_auto", "q_auto", "dpr_auto", `w_${width}`];

  if (height) {
    transformations.push(`h_${height}`, `c_${crop}`);

    if (crop === "fill") {
      transformations.push("g_auto");
    }
  }

  return `${CLOUDINARY_BASE_URL}/${transformations.join(",")}/${publicId}`;
}

export function cloudinarySrcSet(
  assetPath: string,
  widths: readonly number[],
  options: Omit<CloudinaryImageOptions, "width"> = {},
) {
  return widths
    .map(
      (width) =>
        `${cloudinaryAssetUrl(assetPath, { ...options, width })} ${width}w`,
    )
    .join(", ");
}

export function canUseCloudinary(assetPath: string) {
  return CLOUDINARY_ASSET_PREFIXES.some(([localPrefix]) =>
    assetPath.startsWith(localPrefix),
  );
}

function getCloudinaryPublicId(assetPath: string) {
  const prefix = CLOUDINARY_ASSET_PREFIXES.find(([localPrefix]) =>
    assetPath.startsWith(localPrefix),
  );

  if (!prefix) {
    throw new Error(
      `La ruta no está configurada para Cloudinary: ${assetPath}`,
    );
  }

  const [localPrefix, cloudinaryPrefix] = prefix;
  return `${cloudinaryPrefix}${assetPath.slice(localPrefix.length).replace(/\.[^.]+$/, "")}`;
}
