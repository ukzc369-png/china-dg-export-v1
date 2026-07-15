import { readFile } from "node:fs/promises";

const host = "chinachemexport.com";
const key = "8c31e76f4a8b42d9a56f3e217cb940ad";
const keyLocation = `https://${host}/${key}.txt`;
const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

if (!urlList.length) {
  throw new Error("No URLs found in public/sitemap.xml");
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation, urlList }),
});

if (!response.ok) {
  throw new Error(`IndexNow submission failed: ${response.status} ${await response.text()}`);
}

console.log(`Submitted ${urlList.length} URLs to IndexNow (${response.status}).`);
