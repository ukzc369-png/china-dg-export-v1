import type { Lang, ProductDetailModel } from "./productDetails";

const SITE_URL = "https://chinachemexport.com";

export type ProductSeo = {
  title: string;
  description: string;
  canonical: string;
  image?: string;
  schemas: Record<string, unknown>[];
};

function absoluteUrl(path?: string) {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildProductSeo(detail: ProductDetailModel, lang: Lang): ProductSeo {
  const canonical = `${SITE_URL}/products/${detail.slug}`;
  const image = absoluteUrl(detail.source.imageUrl);
  const title = detail.seoTitle[lang];
  const description = detail.seoDescription[lang];
  const productSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: detail.source.name[lang],
    description,
    url: canonical,
    sku: detail.source.cas,
    category: detail.source.category[lang],
    brand: { "@type": "Brand", name: "ChinaChemExport" },
    additionalProperty: detail.specifications.map((item) => ({
      "@type": "PropertyValue",
      name: item.label[lang],
      value: item.value[lang],
    })),
  };
  if (image) productSchema.image = [image];

  const breadcrumbSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: lang === "en" ? "Home" : "首页", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: lang === "en" ? "Products" : "产品", item: `${SITE_URL}/products` },
      { "@type": "ListItem", position: 3, name: detail.source.name[lang], item: canonical },
    ],
  };
  const faqSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: detail.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question[lang],
      acceptedAnswer: { "@type": "Answer", text: faq.answer[lang] },
    })),
  };

  return { title, description, canonical, image, schemas: [productSchema, breadcrumbSchema, faqSchema] };
}
