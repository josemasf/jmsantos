const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dzrgc7fqy/image/upload";

type CloudinaryImageOptions = {
  width: number;
  height?: number;
  crop?: "fill" | "fit";
};

/**
 * Builds an optimised delivery URL for assets already stored in the
 * `jmsantos/assets` Cloudinary folder.
 */
export function cloudinaryAssetUrl(assetPath: string, { width, height, crop = "fit" }: CloudinaryImageOptions) {
  const publicId = assetPath.replace(/^\/assets\//, "jmsantos/assets/");
  const transformations = ["f_auto", "q_auto", "dpr_auto", `w_${width}`];

  if (height) {
    transformations.push(`h_${height}`, `c_${crop}`, "g_auto");
  }

  return `${CLOUDINARY_BASE_URL}/${transformations.join(",")}/${publicId}`;
}

export function cloudinarySrcSet(assetPath: string, widths: number[], options: Omit<CloudinaryImageOptions, "width"> = {}) {
  return widths.map((width) => `${cloudinaryAssetUrl(assetPath, { ...options, width })} ${width}w`).join(", ");
}
