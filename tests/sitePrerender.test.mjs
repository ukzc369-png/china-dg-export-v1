import assert from "node:assert/strict";
import test from "node:test";

import { buildRouteHtml } from "../scripts/prerender-products.mjs";
import { insightRouteDetails } from "../scripts/site-routes.mjs";

const shell = `<!doctype html><html><head><title>ChinaChemExport</title><meta name="description" content="default"><link rel="canonical" href="https://chinachemexport.com/"><meta property="og:title" content="default"><meta property="og:description" content="default"><meta property="og:url" content="https://chinachemexport.com/"></head><body><div id="root"></div><script type="module" src="/assets/index.js"></script></body></html>`;

test("insight prerender exposes metadata, article schema, breadcrumbs, and internal links", () => {
  const html = buildRouteHtml(shell, {
    kind: "insight",
    path: "/insights/dimethyl-carbonate-vietnam-china-supplier-guide",
    title: "Dimethyl Carbonate Vietnam Supplier Guide",
    description: "DMC sourcing, packaging and shipping guidance for Vietnam buyers.",
    heading: "Dimethyl Carbonate Supply to Vietnam",
    links: [
      { href: "/products/dimethyl-carbonate-dmc", label: "Dimethyl Carbonate product page" },
      { href: "/insights/dimethyl-carbonate-supplier-china-export-guide", label: "China DMC supplier guide" },
    ],
  });

  assert.match(html, /<title>Dimethyl Carbonate Vietnam Supplier Guide \| ChinaChemExport<\/title>/);
  assert.match(html, /name="description" content="DMC sourcing, packaging and shipping guidance for Vietnam buyers\."/);
  assert.match(html, /rel="canonical" href="https:\/\/chinachemexport\.com\/insights\/dimethyl-carbonate-vietnam-china-supplier-guide"/);
  assert.match(html, /<h1>Dimethyl Carbonate Supply to Vietnam<\/h1>/);
  assert.match(html, /"@type":"Article"/);
  assert.match(html, /"@type":"BreadcrumbList"/);
  assert.match(html, /href="\/products\/dimethyl-carbonate-dmc"/);
  assert.match(html, /href="\/insights\/dimethyl-carbonate-supplier-china-export-guide"/);
  assert.ok(html.indexOf('<div id="root">') < html.indexOf('data-prerendered="insight"'));
  assert.ok(html.indexOf('data-prerendered="insight"') < html.indexOf('</div><script type="module"'));
});

test("chloroform Vietnam guide exposes GEO entities, FAQ schema and commercial links", () => {
  const route = insightRouteDetails.find((item) => item.slug === "chloroform-supplier-china-vietnam-import-guide");
  assert.ok(route);
  const html = buildRouteHtml(shell, route);
  assert.match(html, /Chloroform Supplier China to Vietnam/);
  assert.match(html, /CAS 67-66-3/);
  assert.match(html, /UN 1888/);
  assert.match(html, /"@type":"FAQPage"/);
  assert.match(html, /"name":"Evan Cole"/);
  assert.match(html, /"datePublished":"2026-09-05"/);
  assert.match(html, /href="\/products\/trichloromethane-tcm"/);
  assert.match(html, /href="\/dangerous-goods"/);
});

test("homepage prerender exposes organization and website identity", () => {
  const html = buildRouteHtml(shell, {
    kind: "home",
    path: "/",
    title: "China Chemical Supplier & Export Service",
    description: "Chemical sourcing and export coordination from Dongying, China.",
    heading: "Chemical Supply and Export Coordination from China",
    links: [
      { href: "/products", label: "Browse products" },
      { href: "/contact", label: "Request a quote" },
    ],
  });

  assert.match(html, /<h1>Chemical Supply and Export Coordination from China<\/h1>/);
  assert.match(html, /"@type":"Organization"/);
  assert.match(html, /"@type":"WebSite"/);
  assert.match(html, /"@type":"Person"/);
  assert.match(html, /"name":"Evan Cole"/);
  assert.match(html, /"jobTitle":"Independent Chemical Sourcing & Export Coordinator"/);
  assert.match(html, /href="\/products"/);
  assert.match(html, /href="\/contact"/);
});

test("core route prerender exposes route-specific crawlable copy", () => {
  const html = buildRouteHtml(shell, {
    kind: "core",
    path: "/markets",
    title: "Chemical Export Markets",
    description: "Chemical export support for buyers in Asia, the Middle East and emerging markets.",
    heading: "Chemical Export Markets and Delivery Experience",
    links: [
      { href: "/products", label: "View products" },
      { href: "/contact", label: "Discuss a destination" },
    ],
  });

  assert.match(html, /<title>Chemical Export Markets \| ChinaChemExport<\/title>/);
  assert.match(html, /rel="canonical" href="https:\/\/chinachemexport\.com\/markets"/);
  assert.match(html, /<h1>Chemical Export Markets and Delivery Experience<\/h1>/);
  assert.match(html, /href="\/products"/);
  assert.match(html, /href="\/contact"/);
});
