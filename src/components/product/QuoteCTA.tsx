import type { Lang, ProductDetailModel } from "../../productDetails";

export function QuoteCTA({ detail, lang, onQuote }: { detail: ProductDetailModel; lang: Lang; onQuote: () => void }) {
  const title = detail.ctaTitle?.[lang] || (lang === "en" ? `Ready to source ${detail.source.name.en}?` : `准备采购${detail.source.name.zh}？`);
  const text = detail.ctaText?.[lang] || (lang === "en" ? "Contact us for quotation, document confirmation, packing review and shipment planning." : "联系我们获取报价、文件确认、包装审核和出运规划。");
  return <section className="pd-quote-cta"><div className="container"><div><p className="pd-kicker">{lang === "en" ? "Start an Inquiry" : "提交询盘"}</p><h2>{title}</h2><p>{text}</p></div><button className="blue-btn" onClick={onQuote}>{lang === "en" ? "Request Quote" : "获取报价"}</button></div></section>;
}
