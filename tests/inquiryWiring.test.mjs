import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("product quote prefill is driven by React state instead of DOM mutation", async () => {
  const app = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(app, /document\.querySelector<HTMLInputElement>/);
  assert.match(app, /initialProduct=\{inquiryProduct\}/);
  assert.match(app, /formatInquiryProduct\(product, lang\)/);
});
