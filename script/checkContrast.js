const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");

const css = readFileSync(
  resolve(__dirname, "../src/styles/global.css"),
  "utf8",
);

function tokensFrom(selector) {
  const block = css.match(
    new RegExp(`${selector.replace(".", "\\.")}\\s*\\{([\\s\\S]*?)\\}`),
  );
  if (!block)
    throw new Error(`No se encontró el bloque ${selector} en global.css`);

  return Object.fromEntries(
    [...block[1].matchAll(/(--[\w-]+):\s*(#[\da-fA-F]{6})\s*;/g)].map(
      ([, name, value]) => [name, value],
    ),
  );
}

const light = tokensFrom(":root");
const themes = { light, dark: { ...light, ...tokensFrom("html.dark") } };

const pairs = [
  ["--text-primary", "--surface", 4.5],
  ["--text-secondary", "--surface", 4.5],
  ["--text-muted", "--surface-subtle", 4.5],
  ["--text-accent", "--surface", 4.5],
  ["--text-accent", "--surface-subtle", 4.5],
  ["--text-on-action", "--surface-action", 4.5],
  ["--text-on-action", "--surface-inverse", 4.5],
];

const localPairs = [
  ["#cffafe", "#0f766e", 4.5, "kicker de cierre de About"],
  ["#c9d1d9", "#24292e", 4.5, "tokens Shiki sobre fondo oscuro"],
];

function relativeLuminance(hex) {
  const channels = hex
    .slice(1)
    .match(/../g)
    .map((value) => Number.parseInt(value, 16) / 255);
  const [red, green, blue] = channels.map((value) =>
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground, background) {
  const [lighter, darker] = [
    relativeLuminance(foreground),
    relativeLuminance(background),
  ].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

let hasFailure = false;
for (const [themeName, tokens] of Object.entries(themes)) {
  for (const [foreground, background, minimum] of pairs) {
    const ratio = contrastRatio(tokens[foreground], tokens[background]);
    const result = `${themeName}: ${foreground} on ${background} = ${ratio.toFixed(2)}:1`;
    if (ratio < minimum) {
      console.error(`FAIL ${result}; minimum ${minimum}:1`);
      hasFailure = true;
    } else {
      console.log(`PASS ${result}`);
    }
  }
}

for (const [foreground, background, minimum, name] of localPairs) {
  const ratio = contrastRatio(foreground, background);
  const result = `${name}: ${foreground} on ${background} = ${ratio.toFixed(2)}:1`;
  if (ratio < minimum) {
    console.error(`FAIL ${result}; minimum ${minimum}:1`);
    hasFailure = true;
  } else {
    console.log(`PASS ${result}`);
  }
}

if (hasFailure) process.exitCode = 1;
