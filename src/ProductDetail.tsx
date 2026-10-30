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
  if (detail.slug === "trichloromethane-tcm") guideLinks.push(["/insights/chloroform-supplier-china-vietnam-import-guide", lang === "en" ? "Chloroform supply and import guide for Vietnam" : "氯仿越南供应与进口指南"]);
  const requestDocuments = () => document.querySelector("#product-documents")?.scrollIntoView({ behavior: "smooth" });
  const buyerChecklist = detail.slug === "aniline"
    ? { title: lang === "en" ? "Aniline buyer checklist" : "苯胺买家资料清单", items: lang === "en" ? ["Required specification", "Order quantity", "Packing preference", "Destination port", "Industrial end use", "Required documents and timeline"] : ["所需指标", "采购数量", "包装偏好", "目的港", "工业最终用途", "文件要求和交期"] }
    : detail.slug === "trichloromethane-tcm"
      ? { title: lang === "en" ? "Vietnam importer information" : "越南进口商资料清单", items: lang === "en" ? ["Required grade and stabilizer", "Declared industrial end use", "Order quantity and packing", "Vietnam destination port", "Importer and permit review", "SDS, COA and document format"] : ["所需牌号与稳定剂", "申报工业最终用途", "采购数量与包装", "越南目的港", "进口商与许可审核", "SDS、COA 与文件格式"] }
      : detail.slug === "methylene-chloride-dcm"
        ? { title: lang === "en" ? "India buyer checklist" : "印度买家资料清单", items: lang === "en" ? ["Application and required grade", "Target specification limits", "Order quantity and packing", "India destination port", "Importer and end-use details", "SDS, batch COA and route review"] : ["用途与所需牌号", "目标指标限制", "采购数量与包装", "印度目的港", "进口商与最终用途", "SDS、批次 COA 与路线审核"] }
        : detail.slug === "dimethyl-carbonate-dmc"
        ? { title: lang === "en" ? "DMC buyer checklist" : "DMC 买家资料清单", items: lang === "en" ? ["Application and required grade", "Purity and impurity limits", "Order quantity", "Drum, IBC or bulk preference", "Destination port and Incoterm", "TDS, SDS and batch COA requirements"] : ["用途与所需牌号", "纯度与杂质限制", "采购数量", "钢桶、IBC 或散装偏好", "目的港与贸易术语", "TDS、SDS 与批次 COA 要求"] }
      : undefined;
  const destinationReview = detail.slug === "methylene-chloride-dcm"
    ? {
        eyebrow: lang === "en" ? "India Route Readiness" : "印度路线准备",
        title: lang === "en" ? "What must be confirmed before a DCM shipment to India" : "DCM 出运印度前需要确认什么",
        intro: lang === "en" ? "A workable offer depends on the product specification, importer information and carrier acceptance—not price alone." : "可执行报价取决于产品规格、进口商信息和承运条件，而不只是价格。",
        items: lang === "en"
          ? [["Product match", "Confirm the grade, purity and batch COA against the buyer's process."], ["Importer review", "Confirm importer details, declared end use and local broker requirements."], ["Packing decision", "Select approved packing only after compatibility, quantity and route review."], ["Carrier acceptance", "Check the current SDS, transport assessment, port and carrier requirements before booking."]]
          : [["产品匹配", "依据买家工艺核对牌号、纯度和批次 COA。"], ["进口商审核", "确认进口商资料、申报最终用途及当地报关要求。"], ["包装决策", "完成相容性、数量和路线审核后再确定核准包装。"], ["承运审核", "订舱前核对现行 SDS、运输鉴定、港口及承运人要求。"]],
      }
    : detail.slug === "trichloromethane-tcm"
      ? {
          eyebrow: lang === "en" ? "Vietnam Route Readiness" : "越南路线准备",
          title: lang === "en" ? "What must be confirmed before a chloroform shipment to Vietnam" : "氯仿出运越南前需要确认什么",
          intro: lang === "en" ? "Grade, stabilizer, declared use and regulatory eligibility must be reviewed before packing and booking are treated as executable." : "在将包装和订舱视为可执行方案前，必须审核牌号、稳定剂、申报用途及监管适用性。",
          items: lang === "en"
            ? [["Grade and stabilizer", "Match the requested industrial use with the supplier specification and batch COA."], ["Precursor controls", "The responsible exporter and importer must confirm current control and permit obligations."], ["Importer information", "Confirm the Vietnamese importer, destination port, declared use and required document format."], ["Shipment acceptance", "Packing, labels, route and carrier acceptance are reviewed for the actual transaction."]]
            : [["牌号与稳定剂", "结合工业用途核对供应商规格及批次 COA。"], ["易制毒管制", "由实际出口和进口责任主体确认当前管制及许可义务。"], ["进口商资料", "确认越南进口商、目的港、申报用途和文件格式。"], ["出运接受条件", "针对实际交易审核包装、标签、路线和承运人接受条件。"]],
        }
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
  const isMarketFocused = detail.slug === "methylene-chloride-dcm" || detail.slug === "trichloromethane-tcm";
  return <main className={`pd-page${isMarketFocused ? " pd-page--market" : ""}`}>
    <nav className="container pd-breadcrumb" aria-label="Breadcrumb"><a href="/products" onClick={(event) => { if (isPlainLeftClick(event)) { event.preventDefault(); onBack(); } }}>{lang === "en" ? "Products" : "产品"}</a><span>/</span><span aria-current="page">{product.name[lang]}</span></nav>
    <ProductHero detail={detail} lang={lang} onQuote={onQuote} onDocuments={requestDocuments} />
    <ProductOverview detail={detail} lang={lang} />
    <SpecificationTable detail={detail} lang={lang} />
    <Applications detail={detail} lang={lang} />
    <Packaging detail={detail} lang={lang} />
    <ExportSupport lang={lang} />
    <Documents detail={detail} lang={lang} onRequest={onQuote} />
    {buyerChecklist && <section className="pd-section pd-buyer-checklist"><div className="container pd-panel"><div><p className="pd-kicker">{lang === "en" ? "Inquiry Preparation" : "询价准备"}</p><h2>{buyerChecklist.title}</h2><p>{lang === "en" ? "Send these details so we can review the suitable supply, documents, packing and shipment route before quotation." : "请提供以下资料，以便报价前审核适用货源、文件、包装和出运路线。"}</p></div><ul>{buyerChecklist.items.map((item) => <li key={item}>{item}</li>)}</ul></div></section>}
    {destinationReview && <section className="pd-section pd-destination-review"><div className="container"><p className="pd-kicker">{destinationReview.eyebrow}</p><h2>{destinationReview.title}</h2><p className="pd-destination-intro">{destinationReview.intro}</p><div className="pd-destination-grid">{destinationReview.items.map(([title, body], index) => <article key={title}><b>{String(index + 1).padStart(2, "0")}</b><h3>{title}</h3><p>{body}</p></article>)}</div><p className="pd-destination-note">{lang === "en" ? "Final eligibility, permits, packing and carrier acceptance are confirmed by the responsible parties for the actual transaction." : "最终准入、许可、包装及承运条件由相关责任主体针对实际交易确认。"}</p></div></section>}
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
