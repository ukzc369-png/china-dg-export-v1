import type { Lang, ProductDetailModel } from "../../productDetails";

export function ProductOverview({ detail, lang }: { detail: ProductDetailModel; lang: Lang }) {
  const highlights = lang === "en"
    ? [["◇", "Grade Confirmation", "Matched to inquiry"], ["✓", "Batch Documents", "Reviewed per order"], ["▣", "Packing Planning", "Route-based selection"], ["◎", "Export Coordination", "Destination reviewed"]]
    : [["◇", "牌号确认", "根据询盘匹配"], ["✓", "批次文件", "按订单审核"], ["▣", "包装规划", "根据路线选择"], ["◎", "出口协调", "按目的地核对"]];
  return <section className="pd-section"><div className="container pd-panel pd-overview-panel"><div className="pd-overview-copy"><p className="pd-kicker">{lang === "en" ? "Product Overview" : "产品概述"}</p><h2>{lang === "en" ? `About ${detail.source.name.en}` : `关于${detail.source.name.zh}`}</h2><p className="pd-body-copy">{detail.overview[lang]}</p></div><div className="pd-overview-visual"><img src={detail.overviewImage || "/product-detail-assets/lab-beaker.webp"} alt={lang === "en" ? "Product visual reference" : "产品视觉示意"} /><small>{lang === "en" ? "Product visual reference" : "产品视觉示意"}</small></div><div className="pd-highlight-row">{highlights.map(([icon, title, note]) => <div key={title}><i>{icon}</i><span><strong>{title}</strong><small>{note}</small></span></div>)}</div></div></section>;
}
