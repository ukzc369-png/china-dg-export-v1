import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { getProductSlug, productPath } from "../src/productRouting.ts";

test("recognizes only a single product detail path segment", () => {
  assert.equal(getProductSlug("/products/methylene-chloride-dcm"), "methylene-chloride-dcm");
  assert.equal(getProductSlug("/products"), null);
  assert.equal(getProductSlug("/products/dcm/extra"), null);
  assert.equal(getProductSlug("/insights/methylene-chloride-dcm"), null);
});

test("builds an encoded product URL", () => {
  assert.equal(productPath("dimethyl-carbonate-dmc"), "/products/dimethyl-carbonate-dmc");
});

test("application source renders a page component instead of the legacy product modal", async () => {
  const app = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8");
  assert.match(app, /<ProductDetailPage/);
  assert.doesNotMatch(app, /<ProductDetailModal/);
});
