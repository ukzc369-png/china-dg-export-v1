import type { Lang, ProductDetailModel } from "../../productDetails";

const text = (value: { en: string; zh: string }, lang: Lang) => value[lang];

export function ProductHero({ detail, lang, onQuote, onDocuments }: { detail: ProductDetailModel; lang: Lang; onQuote: () => void; onDocuments: () => void }) {
  const { source } = detail;
  const facts = [
    { icon: "⌬", label: "CAS", value: source.cas },
    { icon: "✓", label: lang === "en" ? "Specification" : "规格", value: /to be confirmed/i.test(source.purity) ? (lang === "en" ? "Confirm by COA" : "以 COA 确认") : source.purity },
    { icon: "◈", label: lang === "en" ? "Formula" : "分子式", value: detail.formula || (lang === "en" ? "Confirm for selected product" : "按选定产品确认") },
    { icon: "▤", label: lang === "en" ? "HS Code" : "HS 编码", value: detail.hsCode || (lang === "en" ? "Confirm by destination" : "按目的地确认") },
    { icon: "▣", label: lang === "en" ? "Packing" : "包装", value: text(source.packing, lang) },
  ];
  return (
    <section className="pd-hero">
      <div className="container pd-hero-grid">
        <div className="pd-product-visual">
          {source.imageUrl ? <img src={source.imageUrl} alt={text(source.name, lang)} style={{ objectPosition: source.imagePosition }} /> : <span aria-hidden="true">{source.icon}</span>}
        </div>
        <div className="pd-hero-copy">
          <p className="pd-kicker">{lang === "en" ? "Chemical Supply & Export" : "化工品供应与出口"}</p>
          <h1>{text(detail.h1, lang)}</h1>
          <p className="pd-subtitle">{text(detail.subtitle, lang)}</p>
          <dl className="pd-key-facts">{facts.map((fact) => <div className={fact.label === (lang === "en" ? "Packing" : "包装") ? "pd-fact-wide" : ""} key={fact.label}><i aria-hidden="true">{fact.icon}</i><span><dt>{fact.label}</dt><dd>{fact.value}</dd></span></div>)}</dl>
          <div className="pd-actions">
            <button className="blue-btn" onClick={onQuote}>{lang === "en" ? "Request Quote" : "获取报价"}</button>
            <button className="outline-btn" onClick={onDocuments}>{lang === "en" ? "Request Documents" : "索取文件"}</button>
          </div>
          <p className="pd-confirmation-note">{lang === "en" ? "Final grade, batch, packing and availability are confirmed per inquiry." : "最终牌号、批次、包装和供应情况按询盘确认。"}</p>
        </div>
      </div>
    </section>
  );
}
