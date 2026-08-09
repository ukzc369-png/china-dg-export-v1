import assert from "node:assert/strict";
import test from "node:test";
import { buildProductDetail, type ProductSource } from "../src/productDetails.ts";
import { buildProductSeo } from "../src/productSeo.ts";

const product: ProductSource = {
  name: { en: "Methylene Chloride (DCM)", zh: "二氯甲烷（DCM）" },
  cas: "75-09-2",
  un: "1593",
  purity: "99.9%",
  packing: { en: "Drums / ISO Tank", zh: "桶装 / ISO罐" },
  category: { en: "Chlorinated Solvents", zh: "含氯溶剂" },
  application: { en: "Industrial solvent.", zh: "工业溶剂。" },
  icon: "⬡",
  imageUrl: "/product-images/methylene-chloride-dcm-75-09-2.webp",
};

test("builds unique metadata and absolute canonical/image URLs", () => {
  const seo = buildProductSeo(buildProductDetail(product), "en");
  assert.match(seo.title, /Methylene Chloride/);
  assert.equal(seo.canonical, "https://chinachemexport.com/products/methylene-chloride-dcm");
  assert.equal(seo.image, "https://chinachemexport.com/product-images/methylene-chloride-dcm-75-09-2.webp");
});

test("creates Product, BreadcrumbList and FAQPage schemas without inventory offers", () => {
  const seo = buildProductSeo(buildProductDetail(product), "en");
  assert.deepEqual(seo.schemas.map((schema) => schema["@type"]), ["Product", "BreadcrumbList", "FAQPage"]);
  assert.equal("offers" in seo.schemas[0], false);
  assert.equal((seo.schemas[1].itemListElement as unknown[]).length, 3);
  assert.equal((seo.schemas[2].mainEntity as unknown[]).length, 5);
});
