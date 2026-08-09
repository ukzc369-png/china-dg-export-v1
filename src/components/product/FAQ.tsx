import type { Lang, ProductDetailModel } from "../../productDetails";

export function FAQ({ detail, lang }: { detail: ProductDetailModel; lang: Lang }) {
  return <section className="pd-section pd-tight"><div className="container"><p className="pd-kicker">FAQ</p><h2>{lang === "en" ? "Frequently Asked Questions" : "常见问题"}</h2><div className="pd-faq-list">{detail.faqs.map((faq) => <details key={faq.question.en}><summary>{faq.question[lang]}</summary><p>{faq.answer[lang]}</p></details>)}</div></div></section>;
}
