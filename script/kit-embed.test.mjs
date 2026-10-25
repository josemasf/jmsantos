import assert from "node:assert/strict";
import test from "node:test";
import { isBlogRoute, resolveKitScript } from "../src/utils/kit-embed.ts";

test("resuelve el ID y enlace directo de un formulario alojado en Kit", () => {
  assert.deepEqual(resolveKitScript(" https://jose-maria-santos.kit.com/5c2c8714b9/index.js "), {
    src: "https://jose-maria-santos.kit.com/5c2c8714b9/index.js",
    isValid: true,
    uid: "5c2c8714b9",
    directUrl: "https://jose-maria-santos.kit.com/5c2c8714b9",
  });
});

test("admite el embed JavaScript antiguo sin inventar un UID", () => {
  assert.deepEqual(resolveKitScript("https://f.convertkit.com/abc123.js"), {
    src: "https://f.convertkit.com/abc123.js",
    isValid: true,
    uid: undefined,
    directUrl: undefined,
  });
});

test("rechaza orígenes, protocolos y atributos no permitidos", () => {
  for (const src of [
    "javascript:alert(1)",
    "http://jose-maria-santos.kit.com/5c2c8714b9/index.js",
    "https://kit.com.evil.example/5c2c8714b9/index.js",
    'https://jose-maria-santos.kit.com/5c2c8714b9/index.js" onload="alert(1)',
    "",
  ]) {
    assert.equal(resolveKitScript(src).isValid, false, src);
  }
});

test("la Sticky Bar solo corresponde a rutas del blog", () => {
  for (const path of ["/blog", "/blog/", "/blog/mi-articulo/"]) {
    assert.equal(isBlogRoute(path), true, path);
  }
  for (const path of ["/", "/newsletter/", "/porfolio/", "/blogging/"]) {
    assert.equal(isBlogRoute(path), false, path);
  }
});
