import type { Lang, ProductDetailModel, ProductDocument } from "../../productDetails";

export function Documents({ detail, lang, onRequest }: { detail: ProductDetailModel; lang: Lang; onRequest: () => void }) {
  const defaults: ProductDocument[] = ["MSDS", "COA", "TDS", lang === "en" ? "Shipping documents" : "出运文件"].map((name) => ({ name }));
  const docs = detail.documents.length ? detail.documents : defaults;
  return <section className="pd-section pd-tight" id="product-documents"><div className="container pd-panel"><div className="pd-heading-row"><div><p className="pd-kicker">{lang === "en" ? "Order Documents" : "订单文件"}</p><h2>{lang === "en" ? "Documents" : "文件支持"}</h2></div><button className="outline-btn" onClick={onRequest}>{lang === "en" ? "Request Documents" : "索取文件"}</button></div><div className="pd-document-list">{docs.map((doc) => <div key={doc.name}><i aria-hidden="true">▤</i><span><strong>{doc.url ? <a href={doc.url} target="_blank" rel="noreferrer">{doc.name}</a> : doc.name}</strong><small>{doc.note?.[lang] || (lang === "en" ? "Version and availability confirmed per order" : "版本与可用性按订单确认")}</small></span><em>PDF</em></div>)}</div></div></section>;
}
