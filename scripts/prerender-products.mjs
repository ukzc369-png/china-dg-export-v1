import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { productRoutes } from "./site-routes.mjs";

const siteUrl = "https://chinachemexport.com";
const escapeHtml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const escapeJson = (value) => JSON.stringify(value).replaceAll("<", "\\u003c");

function replaceMeta(html, selector, replacement) {
  return html.replace(selector, replacement);
}

export function buildProductHtml(shell, product) {
  const canonical = `${siteUrl}/products/${product.slug}`;
  const title = `${product.name} Supplier from China | ChinaChemExport`;
  const description = `Source ${product.name} (CAS ${product.cas}) from China with specification review, compliant packaging, export documents and dangerous-goods shipping coordination.`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.slug,
    category: product.category,
    description,
    url: canonical,
    brand: { "@type": "Brand", name: "ChinaChemExport" },
    additionalProperty: [{ "@type": "PropertyValue", name: "CAS Number", value: product.cas }],
  };
  const fallback = `<main data-prerendered="product"><nav><a href="/products">Products</a></nav><article><p>${escapeHtml(product.category)}</p><h1>${escapeHtml(product.name)}</h1><p>CAS ${escapeHtml(product.cas)}</p><p>${escapeHtml(description)}</p><a href="/contact">Request a quotation</a></article></main><script type="application/ld+json">${escapeJson(schema)}</script>`;

  let html = replaceMeta(shell, /<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = replaceMeta(html, /<meta\s+name="description"[^>]*>/i, `<meta name="description" content="${escapeHtml(description)}" />`);
  html = replaceMeta(html, /<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${canonical}" />`);
  html = replaceMeta(html, /<meta\s+property="og:title"[^>]*>/i, `<meta property="og:title" content="${escapeHtml(title)}" />`);
  html = replaceMeta(html, /<meta\s+property="og:description"[^>]*>/i, `<meta property="og:description" content="${escapeHtml(description)}" />`);
  html = replaceMeta(html, /<meta\s+property="og:url"[^>]*>/i, `<meta property="og:url" content="${canonical}" />`);
  return html.replace('<div id="root"></div>', `<div id="root">${fallback}</div>`);
}

export async function prerenderProducts(distDirectory = fileURLToPath(new URL("../dist", import.meta.url))) {
  const shell = await readFile(`${distDirectory}/index.html`, "utf8");
  await Promise.all(productRoutes.map(async (product) => {
    const directory = `${distDirectory}/products/${product.slug}`;
    await mkdir(directory, { recursive: true });
    await writeFile(`${directory}/index.html`, buildProductHtml(shell, product), "utf8");
  }));
  return productRoutes.length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const count = await prerenderProducts();
  console.log(`Prerendered ${count} product routes.`);
}
