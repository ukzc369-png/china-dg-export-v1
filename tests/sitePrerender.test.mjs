import assert from "node:assert/strict";
import test from "node:test";

import { buildRouteHtml } from "../scripts/prerender-products.mjs";
import { coreRoutes, insightRouteDetails, russianAnilineClusterRoutes } from "../scripts/site-routes.mjs";

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
  assert.match(html, /Chloroform China to Vietnam/);
  assert.match(html, /CAS 67-66-3/);
  assert.match(html, /UN 1888/);
  assert.match(html, /"@type":"FAQPage"/);
  assert.match(html, /"name":"Evan Cole"/);
  assert.match(html, /"datePublished":"2026-09-05"/);
  assert.match(html, /href="\/products\/trichloromethane-tcm"/);
  assert.match(html, /href="\/dangerous-goods"/);
});

test("supplier document checklist exposes buyer-intent metadata, FAQ schema and service links", () => {
  const route = insightRouteDetails.find((item) => item.slug === "wholesale-chemical-supplier-documents-checklist");
  assert.ok(route);
  const html = buildRouteHtml(shell, route);
  assert.match(html, /Wholesale Chemical Supplier Documents \| Buyer Checklist/);
  assert.match(html, /supplier identity/);
  assert.match(html, /batch COA/);
  assert.match(html, /"@type":"FAQPage"/);
  assert.match(html, /"datePublished":"2026-11-06"/);
  assert.match(html, /href="\/chemical-sourcing"/);
  assert.match(html, /href="\/export-support"/);
  assert.match(html, /href="\/contact"/);
});

test("Russia sourcing guide exposes substantive copy, FAQ schema and market links", () => {
  const route = insightRouteDetails.find((item) => item.slug === "chemical-sourcing-china-russia-documents-shipping-guide");
  assert.ok(route);
  const html = buildRouteHtml(shell, route);
  assert.match(html, /Chemical Sourcing from China to Russia/);
  assert.match(html, /Start with the exact product requirement/);
  assert.match(html, /Compare the supplier specification, current SDS and batch COA/);
  assert.match(html, /"@type":"FAQPage"/);
  assert.match(html, /"datePublished":"2026-11-14"/);
  assert.match(html, /chemical-sourcing-china-russia-cover\.jpg/);
  assert.match(html, /href="\/ru\/chemical-sourcing"/);
  assert.match(html, /href="\/contact"/);
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

test("chemical procurement service route exposes commercial intent, service copy and FAQ schema", () => {
  const route = coreRoutes.find((item) => item.path === "/chemical-sourcing");
  assert.ok(route);
  const html = buildRouteHtml(shell, route);
  assert.match(html, /Chemical Sourcing Agent China \| Supplier &amp; Document Review/);
  assert.match(html, /<h1>Chemical Sourcing Agent and Supplier Review in China<\/h1>/);
  assert.match(html, /Supplier identity, producer and current availability/);
  assert.match(html, /TDS, SDS and current batch COA/);
  assert.match(html, /"@type":"FAQPage"/);
  assert.match(html, /What does a chemical sourcing agent in China do\?/);
  assert.match(html, /href="\/contact"/);
});

test("high-impression routes expose focused search titles without changing their URLs", () => {
  const homepage = coreRoutes.find((item) => item.path === "/");
  const insights = coreRoutes.find((item) => item.path === "/insights");
  const dmc = insightRouteDetails.find((item) => item.slug === "dimethyl-carbonate-supplier-china-export-guide");
  assert.ok(homepage);
  assert.ok(insights);
  assert.ok(dmc);

  const homepageHtml = buildRouteHtml(shell, homepage);
  assert.match(homepageHtml, /China Chemical Sourcing Agent \| Supplier &amp; Export Review/);
  assert.match(homepageHtml, /<h1>China Chemical Sourcing Agent and Export Coordinator<\/h1>/);
  assert.match(homepageHtml, /rel="canonical" href="https:\/\/chinachemexport\.com\/"/);

  const insightsHtml = buildRouteHtml(shell, insights);
  assert.match(insightsHtml, /Chemical Sourcing Guides \| Supplier Documents &amp; Shipping/);
  assert.match(insightsHtml, /<h1>Chemical Sourcing Guides for Industrial Buyers<\/h1>/);
  assert.match(insightsHtml, /href="\/insights\/dimethyl-carbonate-supplier-china-export-guide"/);

  const dmcHtml = buildRouteHtml(shell, dmc);
  assert.match(dmcHtml, /Dimethyl Carbonate Supplier China \| DMC COA &amp; Packing/);
  assert.match(dmcHtml, /CAS 616-38-6/);
  assert.match(dmcHtml, /rel="canonical" href="https:\/\/chinachemexport\.com\/insights\/dimethyl-carbonate-supplier-china-export-guide"/);
});

test("Russian sourcing route exposes Russian metadata and reciprocal language links", () => {
  const route = coreRoutes.find((item) => item.path === "/ru/chemical-sourcing");
  assert.ok(route);
  const html = buildRouteHtml(shell, route);
  assert.match(html, /<html lang="ru">/);
  assert.match(html, /Поставка химической продукции из Китая в Россию/);
  assert.match(html, /rel="canonical" href="https:\/\/chinachemexport\.com\/ru\/chemical-sourcing"/);
  assert.match(html, /hreflang="ru" href="https:\/\/chinachemexport\.com\/ru\/chemical-sourcing"/);
  assert.match(html, /hreflang="en" href="https:\/\/chinachemexport\.com\/chemical-sourcing"/);
  assert.match(html, /hreflang="x-default"/);
  assert.match(html, /href="\/chemical-sourcing">English version/);
  assert.match(html, /href="\/insights\/chemical-sourcing-china-russia-documents-shipping-guide"/);
});

test("Russian aniline route exposes product, transport and reciprocal language signals", () => {
  const route = coreRoutes.find((item) => item.path === "/ru/products/aniline");
  assert.ok(route);
  const html = buildRouteHtml(shell, route);
  assert.match(html, /<html lang="ru">/);
  assert.match(html, /Поставка анилина из Китая в Россию/);
  assert.match(html, /CAS 62-53-3/);
  assert.match(html, /UN 1547/);
  assert.match(html, /класс 6\.1/);
  assert.match(html, /rel="canonical" href="https:\/\/chinachemexport\.com\/ru\/products\/aniline"/);
  assert.match(html, /hreflang="en" href="https:\/\/chinachemexport\.com\/products\/aniline"/);
  assert.match(html, /href="\/ru\/chemical-sourcing"/);
});

test("Russian aniline cluster exposes three crawlable buyer guides with commercial links", () => {
  assert.equal(russianAnilineClusterRoutes.length, 3);
  for (const route of russianAnilineClusterRoutes) {
    const html = buildRouteHtml(shell, route);
    assert.match(html, /<html lang="ru">/);
    assert.match(html, /rel="canonical" href="https:\/\/chinachemexport\.com\/ru\/insights\//);
    assert.match(html, /"@type":"Article"/);
    assert.match(html, /"@type":"FAQPage"/);
    assert.match(html, /"datePublished":"2026-11-23"/);
    assert.match(html, /href="\/ru\/products\/aniline"/);
    assert.match(html, /href="\/contact\?product=Aniline%20CAS%2062-53-3"/);
  }
});
