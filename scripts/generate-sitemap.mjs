import { writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { insightRoutes, productRoutes } from "./site-routes.mjs";

const siteUrl = "https://chinachemexport.com";

const staticPages = [
  ["/", "weekly", "1.0"], ["/products", "weekly", "0.9"],
  ["/about", "monthly", "0.9"], ["/chemical-sourcing", "monthly", "0.9"],
  ["/export-support", "monthly", "0.9"], ["/shandong-supply-base", "monthly", "0.8"],
  ["/insights", "weekly", "0.8"],
  ["/contact", "monthly", "0.9"], ["/privacy", "yearly", "0.4"],
  ["/terms", "yearly", "0.4"], ["/cookies", "yearly", "0.4"],
  ["/dangerous-goods", "yearly", "0.5"],
];

function urlEntry(path, changefreq, priority) {
  return `  <url><loc>${siteUrl}${path}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
}

export function buildSitemap() {
  const entries = [
    ...staticPages.slice(0, 2).map((args) => urlEntry(...args)),
    ...productRoutes.map(({ slug }) => urlEntry(`/products/${slug}`, "monthly", "0.8")),
    ...staticPages.slice(2, 7).map((args) => urlEntry(...args)),
    ...insightRoutes.map((slug) => urlEntry(`/insights/${slug}`, "monthly", slug === "how-to-export-dichloromethane-from-china" || slug.startsWith("dimethyl-carbonate") || slug.startsWith("methylene-chloride") || slug.startsWith("chloroform") ? "0.8" : "0.7")),
    ...staticPages.slice(7).map((args) => urlEntry(...args)),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const output = fileURLToPath(new URL("../public/sitemap.xml", import.meta.url));
  await writeFile(output, buildSitemap(), "utf8");
  console.log(`Generated sitemap with ${productRoutes.length} product URLs.`);
}
