import { writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

const siteUrl = "https://chinachemexport.com";

const productSlugs = [
  "aniline", "cyclohexanone", "dimethylformamide-dmf", "glacial-acetic-acid-gaa",
  "methylene-chloride-dcm", "trichloromethane-tcm", "trichloroethylene-tce",
  "perchloroethylene-pce", "monoethanolamine-mea", "diethanolamine-dea",
  "furfuryl-alcohol", "toluene-diisocyanate-20-80-tdi-20-80", "propylene-glycol-pg",
  "2-ethylhexanol-2eh", "n-butanol-nba", "dimethyl-carbonate-dmc", "formic-acid-85",
  "propionic-acid-pa", "acrylic-acid-aa", "methacrylic-acid-maa", "styrene-sm", "phenol",
  "1-2-dichloroethane-edc", "methanol", "toluene-tol", "acetone-ac", "epichlorohydrin-ech",
  "vinyl-acetate-monomer-vam", "1-4-butanediol-bdo", "butyl-cellosolve-bcs", "isobutanol-iba",
  "methylcyclohexane-mch", "triethylamine-tea", "xylene",
];

const insightSlugs = [
  "how-to-export-dichloromethane-from-china",
  "one-stop-chemical-export-compliance-services-from-china",
  "inland-port-chemical-export-services-china",
  "dongying-strategic-gateway-chemical-exports-china",
  "factory-to-port-chemical-export-compliance-workflow-china",
  "how-to-export-dangerous-goods-from-china",
  "dimethyl-carbonate-supplier-china-export-guide",
  "dimethyl-carbonate-vietnam-china-supplier-guide",
  "methylene-chloride-india-dcm-msds-china-supply-guide",
];

const staticPages = [
  ["/", "weekly", "1.0"], ["/products", "weekly", "0.9"],
  ["/about", "monthly", "0.9"], ["/services", "monthly", "0.9"],
  ["/markets", "monthly", "0.8"], ["/insights", "weekly", "0.8"],
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
    ...productSlugs.map((slug) => urlEntry(`/products/${slug}`, "monthly", "0.8")),
    ...staticPages.slice(2, 6).map((args) => urlEntry(...args)),
    ...insightSlugs.map((slug) => urlEntry(`/insights/${slug}`, "monthly", slug === "how-to-export-dichloromethane-from-china" || slug.startsWith("dimethyl-carbonate") || slug.startsWith("methylene-chloride") ? "0.8" : "0.7")),
    ...staticPages.slice(6).map((args) => urlEntry(...args)),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const output = fileURLToPath(new URL("../public/sitemap.xml", import.meta.url));
  await writeFile(output, buildSitemap(), "utf8");
  console.log(`Generated sitemap with ${productSlugs.length} product URLs.`);
}
