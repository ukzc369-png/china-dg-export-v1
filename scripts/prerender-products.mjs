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

function applyMetadata(shell, { title, description, path }) {
  const canonical = canonicalFor(path);
  let html = replaceOrInsertHead(shell, /<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
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
  return replaceOrInsertHead(
    html,
    /<meta\s+property=["']og:url["'][^>]*>/i,
    `<meta property="og:url" content="${escapeHtml(canonical)}">`,
  );
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

function injectFallback(html, markup) {
  return html.replace(/<div\s+id=["']root["']>\s*<\/div>/i, `<div id="root">${markup}</div>`);
}

export function buildRouteHtml(shell, route) {
  const kind = route.kind ?? (route.path === "/" ? "home" : "core");
  const title = `${route.title} | ChinaChemExport`;
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

  const metadata = applyMetadata(shell, { title, description: route.description, path: route.path });
  return injectFallback(
    metadata,
    fallbackMarkup({ kind, heading: route.heading, description: route.description, links: route.links, schemas }),
  );
}

export function buildProductHtml(shell, product) {
  const path = `/products/${product.slug}`;
  const isAniline = product.slug === "aniline";
  const isChloroform = product.slug === "trichloromethane-tcm";
  const heading = isAniline ? "Aniline Supplier from China for Industrial Buyers" : isChloroform ? "Chloroform (Trichloromethane) Supplier from China" : `${product.name} Supplier from China`;
  const title = isAniline ? "Aniline Supplier China | CAS 62-53-3 Export" : isChloroform ? "Chloroform Supplier China | CAS 67-66-3 Export" : `${heading} | ChinaChemExport`;
  const description = isAniline
    ? "Source aniline (CAS 62-53-3) from China with specification and COA review, SDS, compatible packing, UN 1547 documentation and export coordination."
    : isChloroform
      ? "Source chloroform (trichloromethane, CAS 67-66-3) from China with SDS and COA review, UN 1888 packing and export coordination."
    : `Source ${product.name} (${product.cas}) from China with specification review, export documentation, packaging and shipment coordination.`;
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description,
      sku: product.cas,
      brand: { "@type": "Brand", name: "ChinaChemExport" },
      url: canonicalFor(path),
    },
    breadcrumbSchema(path, product.name),
  ];
  const metadata = applyMetadata(shell, { title, description, path });
  const topicLinks = product.slug === "aniline"
    ? [["/insights", "Review chemical export guides"], ["/dangerous-goods", "Review dangerous-goods export support"], ["/contact", "Request an aniline quotation"]]
    : product.slug === "trichloromethane-tcm"
      ? [["/dangerous-goods", "Review dangerous-goods export support"], ["/insights", "Review chemical export guides"], ["/contact", "Request a chloroform quotation"]]
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
    fallbackMarkup({
      kind: "product",
      heading,
      description,
      links: topicLinks,
      schemas,
    }),
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
