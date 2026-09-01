import { useEffect, useMemo } from "react";
import type { MouseEvent } from "react";
import "./product-detail.css";
import { buildProductDetail, productSlug, type Lang, type ProductSource } from "./productDetails";
import { productPath } from "./productRouting";
import { buildProductSeo } from "./productSeo";
import { Applications } from "./components/product/Applications";
import { Documents } from "./components/product/Documents";
import { ExportSupport } from "./components/product/ExportSupport";
import { FAQ } from "./components/product/FAQ";
import { Packaging } from "./components/product/Packaging";
import { ProductHero } from "./components/product/ProductHero";
import { ProductOverview } from "./components/product/ProductOverview";
import { QuoteCTA } from "./components/product/QuoteCTA";
import { SpecificationTable } from "./components/product/SpecificationTable";

export default function ProductDetailPage({ product, products, lang, onBack, onOpenProduct, onQuote }: { product: ProductSource; products: ProductSource[]; lang: Lang; onBack: () => void; onOpenProduct: (product: ProductSource) => void; onQuote: () => void }) {
  const detail = useMemo(() => buildProductDetail(product), [product]);
  const related = products.filter((item) => item.cas !== product.cas).sort((a, b) => Number(a.category.en !== product.category.en) - Number(b.category.en !== product.category.en)).slice(0, 3);
  const guideLinks = detail.slug === "dimethyl-carbonate-dmc"
    ? [
        ["/insights/dimethyl-carbonate-supplier-china-export-guide", lang === "en" ? "DMC China supplier and export guide" : "DMC 中国供应与出口指南"],
        ["/insights/dimethyl-carbonate-vietnam-china-supplier-guide", lang === "en" ? "DMC supply guide for Vietnam" : "DMC 越南供应指南"],
      ]
    : detail.slug === "methylene-chloride-dcm"
      ? [
          ["/insights/how-to-export-dichloromethane-from-china", lang === "en" ? "DCM export compliance guide" : "二氯甲烷出口合规指南"],
          ["/insights/methylene-chloride-india-dcm-msds-china-supply-guide", lang === "en" ? "DCM supply guide for India" : "二氯甲烷印度供应指南"],
        ]
      : [];
  const requestDocuments = () => document.querySelector("#product-documents")?.scrollIntoView({ behavior: "smooth" });
  const buyerChecklist = detail.slug === "aniline"
    ? { title: lang === "en" ? "Aniline buyer checklist" : "苯胺买家资料清单", items: lang === "en" ? ["Required specification", "Order quantity", "Packing preference", "Destination port", "Industrial end use", "Required documents and timeline"] : ["所需指标", "采购数量", "包装偏好", "目的港", "工业最终用途", "文件要求和交期"] }
    : detail.slug === "trichloromethane-tcm"
      ? { title: lang === "en" ? "Chloroform buyer checklist" : "氯仿买家资料清单", items: lang === "en" ? ["Required grade and stabilizer", "Industrial end use", "Order quantity", "Packing preference", "Destination port and importer", "SDS, COA and permit requirements"] : ["所需牌号与稳定剂", "工业最终用途", "采购数量", "包装偏好", "目的港与进口商", "SDS、COA 与许可要求"] }
      : undefined;
  useEffect(() => {
    const seo = buildProductSeo(detail, lang);
    document.title = seo.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", seo.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", seo.canonical);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", seo.canonical);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", seo.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", seo.description);
    if (seo.image) document.querySelector('meta[property="og:image"]')?.setAttribute("content", seo.image);
    const script = document.createElement("script");
    script.id = "product-structured-data";
    script.type = "application/ld+json";
    script.text = JSON.stringify(seo.schemas);
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, [detail, lang]);
  return <main className="pd-page">
    <nav className="container pd-breadcrumb" aria-label="Breadcrumb"><a href="/products" onClick={(event) => { if (isPlainLeftClick(event)) { event.preventDefault(); onBack(); } }}>{lang === "en" ? "Products" : "产品"}</a><span>/</span><span aria-current="page">{product.name[lang]}</span></nav>
    <ProductHero detail={detail} lang={lang} onQuote={onQuote} onDocuments={requestDocuments} />
    <ProductOverview detail={detail} lang={lang} />
    <SpecificationTable detail={detail} lang={lang} />
    <Applications detail={detail} lang={lang} />
    <Packaging detail={detail} lang={lang} />
    <ExportSupport lang={lang} />
    <Documents detail={detail} lang={lang} onRequest={onQuote} />
    {buyerChecklist && <section className="pd-section pd-buyer-checklist"><div className="container pd-panel"><div><p className="pd-kicker">{lang === "en" ? "Inquiry Preparation" : "询价准备"}</p><h2>{buyerChecklist.title}</h2><p>{lang === "en" ? "Send these details so we can review the suitable supply, documents, packing and shipment route before quotation." : "请提供以下资料，以便报价前审核适用货源、文件、包装和出运路线。"}</p></div><ul>{buyerChecklist.items.map((item) => <li key={item}>{item}</li>)}</ul></div></section>}
    <FAQ detail={detail} lang={lang} />
    {guideLinks.length > 0 && <section className="pd-section pd-guides"><div className="container"><p className="pd-kicker">{lang === "en" ? "Buying Guides" : "采购指南"}</p><h2>{lang === "en" ? "Related market and export guides" : "相关市场与出口指南"}</h2><nav aria-label={lang === "en" ? "Related guides" : "相关指南"}>{guideLinks.map(([href, label]) => <a key={href} href={href}>{label} →</a>)}</nav></div></section>}
    {related.length > 0 && <section className="pd-section pd-related"><div className="container"><p className="pd-kicker">{lang === "en" ? "Related Products" : "相关产品"}</p><h2>{lang === "en" ? "Explore related chemicals" : "浏览相关化工品"}</h2><div className="pd-related-grid">{related.map((item) => <a key={item.cas} href={productPath(productSlug(item))} onClick={(event) => { if (isPlainLeftClick(event)) { event.preventDefault(); onOpenProduct(item); } }}><span>{item.category[lang]}</span><strong>{item.name[lang]}</strong><small>CAS {item.cas}</small><em>{lang === "en" ? "View Product →" : "查看产品 →"}</em></a>)}</div></div></section>}
    <QuoteCTA detail={detail} lang={lang} onQuote={onQuote} />
    <span className="pd-route-marker" hidden>{productSlug(product)}</span>
  </main>;
}

function isPlainLeftClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}
