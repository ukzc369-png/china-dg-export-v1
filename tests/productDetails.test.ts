import assert from "node:assert/strict";
import test from "node:test";
import { buildProductDetail, productSlug, type ProductSource } from "../src/productDetails.ts";

const baseProduct: ProductSource = {
  name: { en: "Methylene Chloride (DCM)", zh: "二氯甲烷（DCM）" },
  cas: "75-09-2",
  un: "1593",
  purity: "99.9%",
  packing: { en: "Drums / ISO Tank", zh: "桶装 / ISO罐" },
  category: { en: "Chlorinated Solvents", zh: "含氯溶剂" },
  application: { en: "Existing CMS description.", zh: "现有后台描述。" },
  icon: "⬡",
  imageUrl: "/product-images/methylene-chloride-dcm-75-09-2.webp",
};

test("creates stable established slugs for priority products", () => {
  assert.equal(productSlug(baseProduct), "methylene-chloride-dcm");
  assert.equal(productSlug({ ...baseProduct, name: { en: "Dimethyl Carbonate (DMC)", zh: "碳酸二甲酯" } }), "dimethyl-carbonate-dmc");
  assert.equal(productSlug({ ...baseProduct, name: { en: "Xylene", zh: "二甲苯" } }), "xylene");
});

test("enriches all five priority products with reviewed landing-page modules", () => {
  const priority = [
    ["Methylene Chloride (DCM)", "75-09-2"],
    ["Dimethyl Carbonate (DMC)", "616-38-6"],
    ["Trichloromethane (TCM)", "67-66-3"],
    ["Xylene", "1330-20-7"],
    ["Aniline", "62-53-3"],
  ];

  for (const [name, cas] of priority) {
    const detail = buildProductDetail({ ...baseProduct, name: { en: name, zh: name }, cas });
    assert.equal(detail.priority, true, name);
    assert.ok(detail.overview.en.length > 80, name);
    assert.ok(detail.applications.length >= 3, name);
    assert.equal(detail.faqs.length, 5, name);
  }
});

test("adds shipment-specific transport facts to the aniline product", () => {
  const detail = buildProductDetail({
    name: { en: "Aniline", zh: "苯胺" },
    cas: "62-53-3",
    un: "1547",
    purity: "Final COA governs",
    packing: { en: "Confirm per shipment", zh: "按出运确认" },
    category: { en: "Amines", zh: "胺类" },
    application: { en: "Industrial intermediate", zh: "工业中间体" },
    icon: "⬡",
  });
  assert.equal(detail.specifications.find((fact) => fact.label.en === "Transport Class")?.value.en, "Class 6.1 (confirm for shipment)");
  assert.equal(detail.specifications.find((fact) => fact.label.en === "Packing Group")?.value.en, "II (confirm for shipment)");
});

test("adds reviewed chloroform identity, transport and procurement content", () => {
  const detail = buildProductDetail({
    ...baseProduct,
    name: { en: "Trichloromethane (TCM)", zh: "三氯甲烷" },
    cas: "67-66-3",
    un: "1888",
  });
  assert.equal(detail.h1.en, "Chloroform (Trichloromethane) Supplier from China");
  assert.equal(detail.formula, "CHCl₃");
  assert.equal(detail.specifications.find((fact) => fact.label.en === "Transport Class")?.value.en, "Class 6.1 (confirm for shipment)");
  assert.equal(detail.specifications.find((fact) => fact.label.en === "Packing Group")?.value.en, "III (confirm for shipment)");
  assert.match(detail.seoDescription.en, /UN 1888/);
  assert.match(detail.faqs[0].answer.en, /stabilizer requirement/);
});

test("generic products omit facts not present in the CMS source", () => {
  const detail = buildProductDetail({
    ...baseProduct,
    name: { en: "Unlisted Solvent", zh: "普通溶剂" },
    cas: "123-45-6",
    un: "",
    purity: "To be confirmed by COA",
    packing: { en: "Packing to be confirmed", zh: "包装待确认" },
  });

  assert.equal(detail.priority, false);
  assert.equal(detail.formula, undefined);
  assert.equal(detail.hsCode, undefined);
  assert.equal(detail.appearance, undefined);
  assert.equal(detail.storage, undefined);
  assert.equal(detail.specifications.some((item) => item.label.en === "UN Number"), false);
  assert.equal(detail.specifications.some((item) => item.value.en.includes("warehouse stock")), false);
  assert.equal(detail.applications.length, 4);
});

test("keeps a backend packing specification intact instead of splitting transport units", () => {
  const packing = "200 KG/DRUM, 16 MT/20GP, 25.6 MT/40HQ";
  const detail = buildProductDetail({
    ...baseProduct,
    name: { en: "Aniline", zh: "苯胺" },
    cas: "62-53-3",
    packing: { en: packing, zh: packing },
  });

  assert.deepEqual(detail.packaging, [{ en: packing, zh: packing }]);
});

test("CMS SEO values take precedence over generated defaults", () => {
  const detail = buildProductDetail({
    ...baseProduct,
    seoTitle: "Custom DCM SEO Title",
    seoDescription: "Custom DCM SEO description from the product admin.",
  });

  assert.equal(detail.seoTitle.en, "Custom DCM SEO Title");
  assert.equal(detail.seoDescription.en, "Custom DCM SEO description from the product admin.");
});

test("CMS detail content overrides the safe product template", () => {
  const detail = buildProductDetail({
    ...baseProduct,
    slug: "custom-dcm-export",
    detailContent: {
      h1: "Custom DCM Landing Page",
      subtitle: "Custom sourcing subtitle",
      overview: "A reviewed overview entered by the product administrator.",
      formula: "CH2Cl2",
      hsCode: "29031200",
      appearance: "Confirmed against the selected batch COA",
      storage: "Refer to the shipment MSDS",
      applications: ["Solvent processing", "Metal cleaning"],
      overviewImage: "https://example.com/beaker.webp",
      packagingImage: "https://example.com/drums.webp",
      bulkImage: "https://example.com/tank.webp",
      documents: [
        { name: "MSDS", note: "Available after grade confirmation", url: "https://example.com/msds.pdf" },
      ],
      faqs: [{ question: "Is a COA available?", answer: "Confirmed for the selected batch." }],
      ctaTitle: "Request a reviewed DCM quotation",
      ctaText: "Send your grade, quantity and destination.",
    },
  });

  assert.equal(detail.slug, "custom-dcm-export");
  assert.equal(detail.h1.en, "Custom DCM Landing Page");
  assert.equal(detail.overview.en, "A reviewed overview entered by the product administrator.");
  assert.deepEqual(detail.applications.map((item) => item.en), ["Solvent processing", "Metal cleaning"]);
  assert.equal(detail.documents[0].url, "https://example.com/msds.pdf");
  assert.equal(detail.faqs[0].question.en, "Is a COA available?");
  assert.equal(detail.ctaTitle?.en, "Request a reviewed DCM quotation");
});

test("blank CMS detail fields keep template defaults", () => {
  const detail = buildProductDetail({
    ...baseProduct,
    slug: "  ",
    detailContent: { h1: " ", applications: [], documents: [], faqs: [] },
  });

  assert.equal(detail.slug, "methylene-chloride-dcm");
  assert.equal(detail.h1.en, "Methylene Chloride (DCM) Supplier China");
  assert.ok(detail.applications.length >= 3);
  assert.equal(detail.faqs.length, 5);
});
