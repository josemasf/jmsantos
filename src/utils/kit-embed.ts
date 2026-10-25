// Aceptar exclusivamente los orígenes públicos del embed oficial de Kit.
const KIT_SCRIPT_URL = /^https:\/\/(?:f\.(?:convert)?kit\.com\/[a-zA-Z0-9_./?=&%-]+\.js(?:\?[a-zA-Z0-9_=&%-]+)?|[a-zA-Z0-9-]+\.kit\.com\/[a-zA-Z0-9_-]+\/index\.js)$/;
const KIT_HOSTED_SCRIPT_URL = /^https:\/\/[a-zA-Z0-9-]+\.kit\.com\/([a-zA-Z0-9_-]+)\/index\.js$/;

export function resolveKitScript(rawSrc?: string) {
  const src = rawSrc?.trim() ?? "";
  const hostedFormMatch = src.match(KIT_HOSTED_SCRIPT_URL);

  return {
    src,
    isValid: KIT_SCRIPT_URL.test(src),
    // En los embeds alojados en Kit el identificador público forma parte de la URL.
    uid: hostedFormMatch?.[1],
    directUrl: hostedFormMatch ? src.slice(0, -"/index.js".length) : undefined,
  };
}

export function isBlogRoute(pathname: string) {
  return pathname === "/blog" || pathname.startsWith("/blog/");
}
