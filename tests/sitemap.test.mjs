import assert from "node:assert/strict";
import test from "node:test";
import { buildSitemap, priorityProductSlugs } from "../scripts/generate-sitemap.mjs";
import { insightRoutes } from "../scripts/site-routes.mjs";

test("sitemap concentrates discovery on priority product detail pages", () => {
  const xml = buildSitemap();
  assert.match(xml, /\/products\/methylene-chloride-dcm<\/loc>/);
  assert.match(xml, /\/products\/dimethyl-carbonate-dmc<\/loc>/);
  assert.match(xml, /\/products\/xylene<\/loc>/);
  assert.match(xml, /\/products\/methanol<\/loc>/);
  assert.match(xml, /\/ru\/products\/aniline<\/loc>/);
  assert.doesNotMatch(xml, /\/products\/triethylamine-tea<\/loc>/);
});

test("sitemap preserves established insight URLs and has no duplicate locations", () => {
  const xml = buildSitemap();
  assert.match(xml, /\/insights\/how-to-export-dichloromethane-from-china<\/loc>/);
  assert.match(xml, /\/insights\/chemical-sourcing-china-russia-documents-shipping-guide<\/loc>/);
  const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.equal(new Set(locations).size, locations.length);
  assert.equal(locations.filter((url) => url.startsWith("https://chinachemexport.com/products/")).length, priorityProductSlugs.size);
  assert.equal(locations.filter((url) => url.startsWith("https://chinachemexport.com/insights/")).length, insightRoutes.length);
});

test("sitemap includes the Russian aniline content cluster", () => {
  const xml = buildSitemap();
  assert.match(xml, /\/ru\/insights\/aniline-inquiry-checklist-china-russia<\/loc>/);
  assert.match(xml, /\/ru\/insights\/aniline-sds-coa-specification-review<\/loc>/);
  assert.match(xml, /\/ru\/insights\/aniline-packing-dangerous-goods-shipping-russia<\/loc>/);
});

test("every sitemap URL has an ISO lastmod freshness signal", () => {
  const xml = buildSitemap();
  const locations = [...xml.matchAll(/<url><loc>([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod>/g)];
  assert.ok(locations.length > 0);
  assert.equal(locations.length, (xml.match(/<url>/g) ?? []).length);
  for (const [, , lastmod] of locations) assert.match(lastmod, /^2026-\d{2}-\d{2}$/);
});
