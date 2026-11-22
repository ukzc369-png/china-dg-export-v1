import { writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { insightRouteDetails, productRoutes } from "./site-routes.mjs";

const siteUrl = "https://chinachemexport.com";

const staticPages = [
  ["/", "weekly", "1.0", "2026-11-14"],
  ["/products", "weekly", "0.9", "2026-11-12"],
  ["/chemical-sourcing", "weekly", "0.9", "2026-11-20"],
  ["/export-support", "monthly", "0.9", "2026-11-14"],
  ["/ru/chemical-sourcing", "weekly", "0.9", "2026-11-14"],
  ["/ru/products/aniline", "weekly", "0.9", "2026-11-18"],
  ["/insights", "weekly", "0.8", "2026-11-14"],
  ["/contact", "monthly", "0.9", "2026-11-14"],
  ["/dangerous-goods", "monthly", "0.7", "2026-10-24"],
];

// Keep the sitemap focused on product pages with substantive, route-specific
// copy. The complete product directory remains crawlable through /products,
// but generic templates no longer dilute discovery of the strongest pages.
export const priorityProductSlugs = new Set([
  "aniline",
  "cyclohexanone",
  "methylene-chloride-dcm",
  "trichloromethane-tcm",
  "dimethyl-carbonate-dmc",
  "acetone-ac",
  "methanol",
  "xylene",
]);

function urlEntry(path, changefreq, priority, lastmod) {
  return `  <url><loc>${siteUrl}${path}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
}

export function buildSitemap() {
  const entries = [
    ...staticPages.slice(0, 2).map((args) => urlEntry(...args)),
    ...productRoutes
      .filter(({ slug }) => priorityProductSlugs.has(slug))
      .map(({ slug }) => urlEntry(`/products/${slug}`, "monthly", "0.8", slug === "aniline" ? "2026-11-18" : "2026-11-12")),
    ...staticPages.slice(2, 6).map((args) => urlEntry(...args)),
    ...insightRouteDetails.map(({ slug, datePublished }) => urlEntry(`/insights/${slug}`, "monthly", slug === "how-to-export-dichloromethane-from-china" || slug.startsWith("dimethyl-carbonate") || slug.startsWith("methylene-chloride") || slug.startsWith("chloroform") ? "0.8" : "0.7", datePublished ?? "2026-10-24")),
    ...staticPages.slice(6).map((args) => urlEntry(...args)),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const output = fileURLToPath(new URL("../public/sitemap.xml", import.meta.url));
  await writeFile(output, buildSitemap(), "utf8");
  console.log(`Generated focused sitemap with ${priorityProductSlugs.size} priority product URLs.`);
}
