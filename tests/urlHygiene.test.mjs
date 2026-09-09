import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { buildProductHtml } from "../scripts/prerender-products.mjs";
import { insightRouteDetails } from "../scripts/site-routes.mjs";

const shell = `<!doctype html><html><head><title>Default</title><meta name="description" content="default"><link rel="canonical" href="https://chinachemexport.com/"></head><body><div id="root"></div></body></html>`;

test("Vercel serves a real 404, preserves admin SPA routes and redirects retired public URLs", async () => {
  const [notFound, configText] = await Promise.all([
    readFile(new URL("../public/404.html", import.meta.url), "utf8"),
    readFile(new URL("../vercel.json", import.meta.url), "utf8"),
  ]);
  const config = JSON.parse(configText);
  assert.match(notFound, /name="robots" content="noindex, follow"/);
  assert.equal(config.trailingSlash, false);
  assert.deepEqual(config.redirects, [
    { source: "/cases", destination: "/shandong-supply-base", permanent: true },
    { source: "/services", destination: "/export-support", permanent: true },
    { source: "/markets", destination: "/shandong-supply-base", permanent: true },
  ]);
  assert.deepEqual(config.rewrites, [
    { source: "/admin", destination: "/" },
    { source: "/admin/:path*", destination: "/" },
  ]);
});

test("DMC prerender pages expose reciprocal topic links", () => {
  const productHtml = buildProductHtml(shell, {
    slug: "dimethyl-carbonate-dmc",
    name: "Dimethyl Carbonate (DMC)",
    cas: "616-38-6",
    category: "Carbonates",
  });
  assert.match(productHtml, /\/insights\/dimethyl-carbonate-supplier-china-export-guide/);
  assert.match(productHtml, /\/insights\/dimethyl-carbonate-vietnam-china-supplier-guide/);

  const vietnam = insightRouteDetails.find((route) => route.slug === "dimethyl-carbonate-vietnam-china-supplier-guide");
  assert.ok(vietnam.links.some(([href]) => href === "/products/dimethyl-carbonate-dmc"));
  assert.ok(vietnam.links.some(([href]) => href === "/insights/dimethyl-carbonate-supplier-china-export-guide"));
});

test("article UI uses href links and accepts root-relative markdown links", async () => {
  const [source, productSource] = await Promise.all([
    readFile(new URL("../src/App.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/ProductDetail.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(source, /href=\{`\/insights\/\$\{a\.slug\}`\}/);
  assert.match(source, /mailto:\|\\\//);
  assert.match(source, /https\?:\\\/\\\/\|\\\//);
  assert.match(source, /canonicalPath\(window\.location\.pathname\)/);
  assert.match(source, /article-topic-links/);
  assert.match(productSource, /pd-guides/);
  assert.match(productSource, /pd-buyer-checklist/);
});
