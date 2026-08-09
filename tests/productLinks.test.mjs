import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("product catalog and related products expose crawlable href links", async () => {
  const app = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8");
  const detail = await readFile(new URL("../src/ProductDetail.tsx", import.meta.url), "utf8");

  assert.match(app, /href=\{productPath\(productSlug\(product\)\)\}/);
  assert.match(detail, /href=\{productPath\(productSlug\(item\)\)\}/);
});
