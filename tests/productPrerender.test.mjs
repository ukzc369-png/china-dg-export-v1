import assert from "node:assert/strict";
import test from "node:test";
import { buildProductHtml } from "../scripts/prerender-products.mjs";

const shell = `<!doctype html><html><head><title>ChinaChemExport</title><meta name="description" content="default"><link rel="canonical" href="https://chinachemexport.com/"></head><body><div id="root"></div><script type="module" src="/assets/index.js"></script></body></html>`;

test("product prerender creates route-specific crawlable HTML", () => {
  const product = {
    slug: "methylene-chloride-dcm",
    name: "Methylene Chloride (DCM)",
    cas: "75-09-2",
    category: "Chlorinated Solvents",
  };
  const html = buildProductHtml(shell, product);

  assert.match(html, /<title>Methylene Chloride \(DCM\) Supplier from China/);
  assert.match(html, /name="description" content="[^"]*Methylene Chloride/);
  assert.match(html, /rel="canonical" href="https:\/\/chinachemexport\.com\/products\/methylene-chloride-dcm"/);
  assert.match(html, /<h1>Methylene Chloride \(DCM\) Supplier from China<\/h1>/);
  assert.match(html, /"@type":"Product"/);
  assert.match(html, /"@type":"BreadcrumbList"/);
  assert.match(html, /data-prerendered="product"/);
  assert.ok(html.indexOf('<div id="root">') < html.indexOf('data-prerendered="product"'));
  assert.ok(html.indexOf('data-prerendered="product"') < html.indexOf('</div><script type="module"'));
});
