import assert from "node:assert/strict";
import test from "node:test";
import { buildSitemap } from "../scripts/generate-sitemap.mjs";

test("sitemap includes priority and generic product detail pages", () => {
  const xml = buildSitemap();
  assert.match(xml, /\/products\/methylene-chloride-dcm<\/loc>/);
  assert.match(xml, /\/products\/dimethyl-carbonate-dmc<\/loc>/);
  assert.match(xml, /\/products\/xylene<\/loc>/);
  assert.match(xml, /\/products\/methanol<\/loc>/);
});

test("sitemap preserves established insight URLs and has no duplicate locations", () => {
  const xml = buildSitemap();
  assert.match(xml, /\/insights\/how-to-export-dichloromethane-from-china<\/loc>/);
  const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.equal(new Set(locations).size, locations.length);
});
