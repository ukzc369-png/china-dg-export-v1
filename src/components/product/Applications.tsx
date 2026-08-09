import type { Lang, ProductDetailModel } from "../../productDetails";

export function Applications({ detail, lang }: { detail: ProductDetailModel; lang: Lang }) {
  const visible = [...detail.applications];
  while (visible.length < 4) visible.push({ en: "Application fit confirmation", zh: "应用适配确认" });
  return <section className="pd-section pd-tight"><div className="container"><p className="pd-kicker">{lang === "en" ? "Industry Uses" : "行业用途"}</p><h2>{lang === "en" ? "Applications" : "应用领域"}</h2><div className="pd-card-grid">{visible.slice(0, 4).map((item, index) => <article key={`${item.en}-${index}`}><span aria-hidden="true">{["♧", "⌘", "▧", "⌁"][index]}</span><div><h3>{item[lang]}</h3><p>{lang === "en" ? "Suitability is confirmed against grade, process and end-use requirements." : "根据牌号、工艺及最终用途要求确认适用性。"}</p></div></article>)}</div></div></section>;
}
