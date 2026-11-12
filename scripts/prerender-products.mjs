import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { coreRoutes, insightRouteDetails, productRoutes } from "./site-routes.mjs";

const SITE_URL = "https://chinachemexport.com";

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const escapeJson = (value) => JSON.stringify(value).replaceAll("<", "\\u003c");

const canonicalFor = (path) => `${SITE_URL}${path === "/" ? "/" : path}`;

const replaceOrInsertHead = (html, pattern, replacement) =>
  pattern.test(html)
    ? html.replace(pattern, replacement)
    : html.replace("</head>", `  ${replacement}\n</head>`);

function applyMetadata(shell, { title, description, path, lang = "en", alternates = [] }) {
  const canonical = canonicalFor(path);
  let html = shell.replace(/<html(?:\s+lang=["'][^"']*["'])?/i, `<html lang="${escapeHtml(lang)}"`);
  html = replaceOrInsertHead(html, /<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = replaceOrInsertHead(
    html,
    /<meta\s+name=["']description["'][^>]*>/i,
    `<meta name="description" content="${escapeHtml(description)}">`,
  );
  html = replaceOrInsertHead(
    html,
    /<link\s+rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${escapeHtml(canonical)}">`,
  );
  html = replaceOrInsertHead(
    html,
    /<meta\s+property=["']og:title["'][^>]*>/i,
    `<meta property="og:title" content="${escapeHtml(title)}">`,
  );
  html = replaceOrInsertHead(
    html,
    /<meta\s+property=["']og:description["'][^>]*>/i,
    `<meta property="og:description" content="${escapeHtml(description)}">`,
  );
  html = replaceOrInsertHead(
    html,
    /<meta\s+property=["']og:url["'][^>]*>/i,
    `<meta property="og:url" content="${escapeHtml(canonical)}">`,
  );
  if (alternates.length) {
    const markup = alternates.map(([hreflang, href]) => `<link rel="alternate" hreflang="${escapeHtml(hreflang)}" href="${escapeHtml(href)}">`).join("\n  ");
    html = html.replace("</head>", `  ${markup}\n</head>`);
  }
  return html;
}

const schemaScript = (schema) =>
  `<script type="application/ld+json">${escapeJson(schema)}</script>`;

function breadcrumbSchema(path, title) {
  const items = [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }];
  if (path.startsWith("/products/")) {
    items.push({ "@type": "ListItem", position: 2, name: "Products", item: `${SITE_URL}/products` });
  } else if (path.startsWith("/insights/")) {
    items.push({ "@type": "ListItem", position: 2, name: "Insights", item: `${SITE_URL}/insights` });
  }
  if (path !== "/") {
    items.push({ "@type": "ListItem", position: items.length + 1, name: title, item: canonicalFor(path) });
  }
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items };
}

function normalizeLinks(links = []) {
  return links.map((link) =>
    Array.isArray(link) ? { href: link[0], label: link[1] } : link,
  );
}

function fallbackMarkup({ kind, heading, description, links, schemas }) {
  const linkMarkup = normalizeLinks(links)
    .map(({ href, label }) => `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`)
    .join(" ");
  return `<main data-prerendered="${escapeHtml(kind)}"><nav aria-label="Related pages">${linkMarkup}</nav><article><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(description)}</p></article>${schemas.map(schemaScript).join("")}</main>`;
}

const priorityProductContent = {
  aniline: {
    identity: ["CAS 62-53-3", "UN 1547", "Class 6.1", "Packing Group II"],
    verify: ["Required specification and industrial application", "Supplier specification and current batch COA", "SDS, packing compatibility and transport assessment", "Destination port, importer details and shipment window"],
    applications: ["MDI and polyurethane-material production", "Rubber chemicals and processing additives", "Dyes, pigments and colour intermediates", "Qualified industrial synthesis"],
    route: "Potential shipments to Russia, India, Vietnam, Indonesia and other markets are reviewed order by order. Importer eligibility, declared end use, documents, packing and carrier acceptance must be confirmed before execution.",
    faqs: [
      ["What information is required for an aniline quotation?", "Send the required specification, application, quantity, packing preference, destination port, requested documents and shipment window."],
      ["Which aniline documents can be reviewed?", "The applicable supplier specification, SDS and current batch COA are reviewed for the selected source. Transport and destination documents are confirmed for the actual shipment."],
      ["How is aniline classified for transport?", "Aniline is commonly identified as UN 1547, Class 6.1, Packing Group II. The current SDS, transport assessment and carrier rules govern each shipment."],
    ],
  },
  "dimethyl-carbonate-dmc": {
    identity: ["CAS 616-38-6", "Formula C3H6O3", "Carbonate solvent and intermediate", "Grade confirmed by specification and COA"],
    verify: ["Application, target purity and relevant impurity limits", "Supplier specification, TDS, SDS and current batch COA", "Drum, IBC or bulk-equipment compatibility", "Destination port, Incoterm and shipment window"],
    applications: ["Coatings, inks and solvent formulations", "Chemical intermediates and synthesis", "Qualified electrolyte and materials processing", "Industrial cleaning and process use"],
    route: "DMC supply is reviewed for Russia, Vietnam and other qualified markets. The producer, current availability, packing, documents, carrier acceptance and destination requirements are confirmed for each inquiry.",
    faqs: [
      ["What information is needed for a DMC quotation?", "Send the intended application, target specification, quantity, packing preference, destination port, requested documents and shipment window."],
      ["How are DMC suppliers compared?", "We compare the same grade and test basis using the supplier specification, current TDS and batch COA. A headline purity value alone may not be sufficient."],
      ["Can DMC be supplied in drums, IBCs or an ISO tank?", "Potential packing is reviewed against quantity, material compatibility, supplier capability, cargo classification, route and carrier acceptance."],
    ],
  },
  "methylene-chloride-dcm": {
    identity: ["CAS 75-09-2", "UN 1593", "Class 6.1", "Packing Group III"],
    verify: ["Application, required grade and target specification", "Supplier specification, SDS and current batch COA", "Compatible packing and current transport assessment", "Importer details, destination port and route acceptance"],
    applications: ["Paint and coating processing", "Pharmaceutical processing", "Metal cleaning", "Qualified chemical manufacturing"],
    route: "Potential DCM supply to Russia, India and other markets is reviewed transaction by transaction. Importer information, declared end use, packing, documents and carrier acceptance must be confirmed before quotation becomes executable.",
    faqs: [
      ["What information is needed for a DCM quotation?", "Send the application, required grade and specification, quantity, packing preference, destination port, importer information, requested documents and shipment window."],
      ["Which DCM documents can be reviewed?", "The applicable SDS, supplier specification and current batch COA are reviewed for the selected source. Transport and destination documents are confirmed for the actual shipment."],
      ["How is methylene chloride classified for transport?", "Methylene chloride is commonly identified as UN 1593, Class 6.1, Packing Group III. The current SDS, transport assessment and carrier rules govern each shipment."],
    ],
  },
  "trichloromethane-tcm": {
    identity: ["CAS 67-66-3", "UN 1888", "Class 6.1", "Packing Group III"],
    verify: ["Required grade, specification and stabilizer", "Supplier specification, SDS and current batch COA", "Declared industrial end use and importer information", "Compatible packing, destination rules and carrier acceptance"],
    applications: ["Chemical synthesis and intermediate production", "Fluorochemical manufacturing value chains", "Qualified pharmaceutical processing", "Industrial solvent and process use"],
    route: "Potential chloroform supply to Russia, Vietnam, India, Indonesia and other markets is reviewed order by order. Control obligations, importer eligibility, end use, documents, packing and carrier acceptance must be confirmed by the responsible parties.",
    faqs: [
      ["What information is required for a chloroform quotation?", "Provide the required grade and specification, stabilizer requirement, industrial end use, quantity, packing, destination port, importer details and shipment window."],
      ["Which chloroform documents can be reviewed?", "The applicable supplier specification, SDS and current batch COA are reviewed for the selected source and shipment."],
      ["How is chloroform classified for transport?", "Chloroform is commonly identified as UN 1888, Class 6.1, Packing Group III. The current SDS, transport assessment and carrier rules govern each shipment."],
    ],
  },
};

function productFallbackMarkup({ heading, description, product, links, schemas, content }) {
  const linkMarkup = normalizeLinks(links).map(({ href, label }) => `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`).join(" ");
  if (!content) return fallbackMarkup({ kind: "product", heading, description, links, schemas });
  const list = (items) => `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  const faqs = content.faqs.map(([question, answer]) => `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join("");
  return `<main data-prerendered="product"><nav aria-label="Breadcrumb"><a href="/">Home</a> <a href="/products">Products</a> <span>${escapeHtml(product.name)}</span></nav><article><header><p>Independent sourcing and export coordination</p><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(description)}</p></header><section><h2>Product identity and transport reference</h2>${list(content.identity)}<p>Final acceptance and shipment classification follow the agreed specification, current batch documents and transaction-specific review.</p></section><section><h2>What we verify before quotation</h2>${list(content.verify)}</section><section><h2>Typical industrial applications</h2>${list(content.applications)}</section><section><h2>Destination and shipment review</h2><p>${escapeHtml(content.route)}</p></section><section><h2>Frequently asked questions</h2>${faqs}</section><nav aria-label="Related product and buying guides">${linkMarkup}</nav></article>${schemas.map(schemaScript).join("")}</main>`;
}

function injectFallback(html, markup) {
  return html.replace(/<div\s+id=["']root["']>\s*<\/div>/i, `<div id="root">${markup}</div>`);
}

export function buildRouteHtml(shell, route) {
  const kind = route.kind ?? (route.path === "/" ? "home" : "core");
  const title = route.seoTitle ?? `${route.title} | ChinaChemExport`;
  const canonical = canonicalFor(route.path);
  const schemas = [];

  if (kind === "home") {
    schemas.push(
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "ChinaChemExport",
        url: `${SITE_URL}/`,
        description: route.description,
        address: { "@type": "PostalAddress", addressLocality: "Dongying", addressCountry: "CN" },
        contactPoint: { "@type": "ContactPoint", contactType: "sales", availableLanguage: ["English", "Chinese"] },
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "ChinaChemExport",
        url: `${SITE_URL}/`,
      },
      {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Evan Cole",
        jobTitle: "Independent Chemical Sourcing & Export Coordinator",
        image: `${SITE_URL}/page-assets/chao-zhang-portrait.png`,
        address: { "@type": "PostalAddress", addressRegion: "Shandong", addressCountry: "CN" },
        knowsAbout: [
          "Chemical sourcing in China",
          "Dangerous chemical trade",
          "Shandong chemical supply chains",
          "Dangerous goods documentation",
          "Chemical export coordination",
        ],
        worksFor: { "@type": "Organization", name: "ChinaChemExport", url: `${SITE_URL}/` },
      },
    );
  } else if (kind === "insight") {
    schemas.push(
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: route.heading,
        description: route.description,
        mainEntityOfPage: canonical,
        ...(route.author ? { author: { "@type": "Person", name: route.author } } : {}),
        ...(route.datePublished ? { datePublished: route.datePublished, dateModified: route.datePublished } : {}),
        ...(route.image ? { image: new URL(route.image, SITE_URL).href } : {}),
        publisher: { "@type": "Organization", name: "ChinaChemExport", url: `${SITE_URL}/` },
      },
      breadcrumbSchema(route.path, route.heading),
    );
    if (route.faqs?.length) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: route.faqs.map(([name, text]) => ({
          "@type": "Question",
          name,
          acceptedAnswer: { "@type": "Answer", text },
        })),
      });
    }
  } else {
    schemas.push(
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: route.heading,
        description: route.description,
        url: canonical,
      },
      breadcrumbSchema(route.path, route.heading),
    );
  }

  const metadata = applyMetadata(shell, { title, description: route.description, path: route.path, lang: route.lang, alternates: route.alternates });
  return injectFallback(
    metadata,
    fallbackMarkup({ kind, heading: route.heading, description: route.description, links: route.links, schemas }),
  );
}

export function buildProductHtml(shell, product) {
  const path = `/products/${product.slug}`;
  const isAniline = product.slug === "aniline";
  const isChloroform = product.slug === "trichloromethane-tcm";
  const isDcm = product.slug === "methylene-chloride-dcm";
  const isDmc = product.slug === "dimethyl-carbonate-dmc";
  const heading = isAniline ? "Aniline Supplier from China for Industrial Buyers" : isChloroform ? "Chloroform (Trichloromethane) Supplier from China" : isDcm ? "Methylene Chloride (DCM) Supplier from China" : isDmc ? "Dimethyl Carbonate (DMC) Supplier from China" : `${product.name} Supplier from China`;
  const title = isAniline ? "Aniline Supplier China | CAS 62-53-3 Export" : isChloroform ? "Chloroform Supplier China | CAS 67-66-3 Export" : isDcm ? "Methylene Chloride Supplier China | DCM CAS 75-09-2" : isDmc ? "Dimethyl Carbonate Supplier China | DMC CAS 616-38-6" : `${heading} | ChinaChemExport`;
  const description = isAniline
    ? "Source aniline (CAS 62-53-3) from China with specification and COA review, SDS, compatible packing, UN 1547 documentation and export coordination."
    : isChloroform
      ? "Source chloroform (trichloromethane, CAS 67-66-3) from China with SDS and COA review, UN 1888 packing and export coordination."
    : isDcm
      ? "Source methylene chloride (DCM, CAS 75-09-2) from China with specification, SDS, batch COA, UN 1593 packing and India route review."
    : isDmc
      ? "Source dimethyl carbonate (DMC, CAS 616-38-6) from China with specification and batch COA review, SDS, compatible packing and export coordination."
    : `Source ${product.name} (${product.cas}) from China with specification review, export documentation, packaging and shipment coordination.`;
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description,
      sku: product.cas,
      ...(isDmc ? { image: [`${SITE_URL}/product-images/dimethyl-carbonate-dmc-616-38-6-v2.webp`] } : {}),
      ...(isDcm ? { image: [`${SITE_URL}/product-images/methylene-chloride-dcm-75-09-2-v2.webp`] } : {}),
      ...(isChloroform ? { image: [`${SITE_URL}/product-images/trichloromethane-tcm-67-66-3-v2.webp`] } : {}),
      url: canonicalFor(path),
    },
    breadcrumbSchema(path, product.name),
  ];
  const content = priorityProductContent[product.slug];
  if (content) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: heading,
      description,
      url: canonicalFor(path),
      dateModified: "2026-11-12",
      about: { "@type": "Product", name: product.name, sku: product.cas },
    });
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: content.faqs.map(([name, text]) => ({
        "@type": "Question",
        name,
        acceptedAnswer: { "@type": "Answer", text },
      })),
    });
  }
  const metadata = applyMetadata(shell, { title, description, path });
  const topicLinks = product.slug === "aniline"
    ? [["/insights", "Review chemical export guides"], ["/dangerous-goods", "Review dangerous-goods export support"], ["/contact", "Request an aniline quotation"]]
    : product.slug === "trichloromethane-tcm"
      ? [["/insights/chloroform-supplier-china-vietnam-import-guide", "Read the chloroform Vietnam import guide"], ["/dangerous-goods", "Review dangerous-goods export support"], ["/contact", "Request a chloroform quotation"]]
    : product.slug === "dimethyl-carbonate-dmc"
    ? [
        ["/insights/dimethyl-carbonate-supplier-china-export-guide", "Read the DMC China export guide"],
        ["/insights/dimethyl-carbonate-vietnam-china-supplier-guide", "Read the DMC Vietnam supply guide"],
        ["/contact", "Request a DMC quote"],
      ]
    : product.slug === "methylene-chloride-dcm"
      ? [
          ["/insights/how-to-export-dichloromethane-from-china", "Read the DCM export compliance guide"],
          ["/insights/methylene-chloride-india-dcm-msds-china-supply-guide", "Read the DCM India supply guide"],
          ["/contact", "Request a DCM quote"],
        ]
      : [["/products", "Browse all chemicals"], ["/contact", "Request a quote"]];
  return injectFallback(
    metadata,
    productFallbackMarkup({ heading, description, product, links: topicLinks, schemas, content }),
  );
}

async function writeRoute(distDir, path, html) {
  if (path === "/") {
    await writeFile(join(distDir, "index.html"), html, "utf8");
    return;
  }
  const routeDir = join(distDir, ...path.replace(/^\//, "").split("/"));
  await mkdir(routeDir, { recursive: true });
  await writeFile(join(routeDir, "index.html"), html, "utf8");
}

export async function prerenderProducts(distDir = fileURLToPath(new URL("../dist", import.meta.url))) {
  const shell = await readFile(join(distDir, "index.html"), "utf8");
  const tasks = [
    ...coreRoutes.map((route) => writeRoute(distDir, route.path, buildRouteHtml(shell, route))),
    ...insightRouteDetails.map((route) => writeRoute(distDir, route.path, buildRouteHtml(shell, route))),
    ...productRoutes.map((product) => writeRoute(distDir, `/products/${product.slug}`, buildProductHtml(shell, product))),
  ];
  await Promise.all(tasks);
  return tasks.length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const count = await prerenderProducts();
  console.log(`Prerendered ${count} public routes.`);
}
