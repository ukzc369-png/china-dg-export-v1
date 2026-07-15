import { useState } from "react";
import type { ReactElement } from "react";

export type Lang = "en" | "zh";
export type I18n = { en: string; zh: string };
export type Page = "home" | "products" | "services" | "markets" | "cases" | "insights" | "contact";
export type Product = {
  name: I18n;
  cas: string;
  un: string;
  purity: string;
  packing: I18n;
  category: I18n;
  application: I18n;
  icon: string;
  imageUrl?: string;
  imagePosition?: string;
};
export type Article = {
  title: I18n;
  tag: I18n;
  text: I18n;
  slug: string;
  content: I18n;
  seoTitle: I18n;
  seoDescription: I18n;
  coverImage?: string;
};

const t = (en: string, zh: string): I18n => ({ en, zh });
const tx = (value: I18n, lang: Lang) => value[lang];

type Props = {
  go: (page: Page) => void;
  lang: Lang;
  products: Product[];
  articles: Article[];
  onOpenArticle: (slug: string) => void;
};

const strengths = [
  ["shield", t("Strict Compliance", "严格合规"), t("Meet REACH, GHS, IMO, ISOTANK and local regulations.", "符合 REACH、GHS、IMO、ISO TANK 及当地法规。")],
  ["quality", t("Premium Quality", "优质品质"), t("Rigorous QC system ensures stable and consistent quality.", "严格质控确保品质稳定一致。")],
  ["team", t("Experienced Team", "经验团队"), t("Professional team with deep knowledge in chemicals and international trade.", "拥有深厚化工与国际贸易经验的专业团队。")],
  ["globe", t("Global Network", "全球网络"), t("Strong logistics network ensures safe and timely delivery worldwide.", "强大物流网络确保全球安全及时交付。")],
  ["truck", t("One-stop Service", "一站式服务"), t("From product selection to shipping, we provide complete solutions.", "从产品选择到运输提供完整解决方案。")],
  ["hand", t("Customer First", "客户至上"), t("We focus on long-term partnership and customer satisfaction.", "专注长期合作与客户满意。")],
] as const;

const services = [
  ["source", t("Product Sourcing", "产品寻源"), t("High-quality products from reliable and audited manufacturers.", "来自可靠且经过审核的制造商。")],
  ["check", t("Quality Control", "质量控制"), t("Strict QC procedures throughout production and before shipment.", "生产全过程及装运前严格质检。")],
  ["doc", t("Documentation", "单证服务"), t("Complete export documents and certificates as required.", "按要求提供完整出口单证及证书。")],
  ["pack", t("Packaging & Labeling", "包装与标签"), t("Professional packaging and labeling in compliance with standards.", "符合标准的专业包装与标签。")],
  ["ship", t("Logistics & Shipping", "物流与海运"), t("Safe, efficient and cost-effective logistics solutions worldwide.", "安全、高效且具成本优势的全球物流。")],
  ["support", t("After-sales Support", "售后支持"), t("Dedicated support for any questions and after-sales service.", "提供专属售后支持与问题响应。")],
] as const;

const process = [
  [t("Inquiry", "提交需求"), t("Tell us your requirement", "告诉我们您的需求")],
  [t("Quotation", "报价"), t("Receive our best offer", "获取最佳报价")],
  [t("Order Confirmation", "订单确认"), t("Confirm details and PI", "确认细节与形式发票")],
  [t("Production & QC", "生产与质检"), t("Manufacturing and quality inspection", "生产及质量检验")],
  [t("Shipping", "出运"), t("Safe packing and on-time delivery", "安全包装并准时交付")],
  [t("After-sales", "售后"), t("Ongoing support and partnership", "持续支持与长期合作")],
] as const;

function Icon({ name }: { name: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<string, ReactElement> = {
    shield: <><path {...common} d="M12 3 5 6v5c0 5 3.2 8.5 7 10 3.8-1.5 7-5 7-10V6l-7-3Z"/><path {...common} d="m9 12 2 2 4-4"/></>,
    quality: <><circle {...common} cx="12" cy="10" r="5"/><path {...common} d="m8.5 14.5-1 6 4.5-2 4.5 2-1-6"/></>,
    team: <><circle {...common} cx="12" cy="8" r="3"/><path {...common} d="M5 20v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2"/><path {...common} d="M4 10a2.5 2.5 0 0 0 0 5M20 10a2.5 2.5 0 0 1 0 5"/></>,
    globe: <><circle {...common} cx="12" cy="12" r="9"/><path {...common} d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>,
    truck: <><path {...common} d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"/><circle {...common} cx="7" cy="18" r="2"/><circle {...common} cx="18" cy="18" r="2"/></>,
    hand: <><path {...common} d="M8 11 5 8a2 2 0 0 0-3 3l6 7c1 1 2.5 2 4 2s3-1 4-2l6-7a2 2 0 0 0-3-3l-3 3"/><path {...common} d="m8 11 4-4 4 4"/></>,
    source: <><path {...common} d="M4 20h16M7 17l3-10 4 6 3-9"/><circle {...common} cx="17" cy="4" r="2"/></>,
    check: <><path {...common} d="M6 3h12v18H6z"/><path {...common} d="m9 12 2 2 4-4"/></>,
    doc: <><path {...common} d="M6 3h9l3 3v15H6z"/><path {...common} d="M9 10h6M9 14h6M9 18h4"/></>,
    pack: <><rect {...common} x="3" y="5" width="8" height="14" rx="1"/><rect {...common} x="13" y="5" width="8" height="14" rx="1"/><path {...common} d="M6 9h2M16 9h2"/></>,
    ship: <><path {...common} d="M3 15h18l-3 4H6zM7 15V8h7v7M14 10h4l3 3v2"/></>,
    support: <><circle {...common} cx="12" cy="12" r="8"/><path {...common} d="M8 15v-3a4 4 0 0 1 8 0v3M7 14h2v4H7zM15 14h2v4h-2z"/></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

export default function HomePage({ go, lang, products, articles, onOpenArticle }: Props) {
  const featuredProducts = products.slice(0, 5);
  const latestArticles = articles.slice(0, 3);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const productImages = ["/home-v3/drums-1.jpg", "/home-v3/drums-2.jpg", "/home-v3/drums-3.jpg", "/home-v3/drums-4.jpg", "/home-v3/drums-5.jpg"];

  return <main className="hp">
    <section className="hp-hero">
      <div className="hp-hero-bg" />
      <div className="hp-shell hp-hero-inner">
        <div className="hp-hero-copy">
          <p className="hp-kicker">{tx(t("CHINA-ORIGIN BULK CHEMICAL EXPORT", "中国大宗危化品出口"), lang)}</p>
          <h1>{tx(t("Reliable. Compliant. Global.", "可靠、合规、全球交付。"), lang)}<br/>{tx(t("Bulk Chemicals Exporter from China.", "中国大宗危化品出口商。"), lang)}</h1>
          <p className="hp-hero-text">{tx(t("We specialize in manufacturing and exporting high-quality bulk chemicals in drums, compliant with international standards.", "我们专注于高品质桶装大宗化工品制造与出口，并符合国际标准。"), lang)}</p>
          <div className="hp-actions"><button className="hp-primary" onClick={() => go("products")}>{tx(t("View Products", "查看产品"), lang)} →</button><button className="hp-ghost" onClick={() => go("contact")}>{tx(t("Contact Us", "联系我们"), lang)}</button></div>
          <div className="hp-metrics">
            {[["20+",t("Years Experience","年行业经验")],["100+",t("Countries Served","服务国家")],["200+",t("Chemical Products","化工产品")],["100%",t("Compliance Guarantee","合规保障")]].map(([num,label],i)=><button key={String(num)} onClick={()=>document.getElementById("about-home")?.scrollIntoView({behavior:"smooth"})}><span className="hp-metric-icon">{["⌂","▣","♙","◎"][i]}</span><strong>{String(num)}</strong><small>{tx(label as I18n,lang)}</small></button>)}
          </div>
        </div>
      </div>
    </section>

    <section id="about-home" className="hp-section hp-why"><div className="hp-shell"><Header title={tx(t("WHY CHOOSE CHINACHEMEXPORT","为什么选择 CHINACHEMEXPORT"),lang)} />
      <div className="hp-six-grid">{strengths.map(([icon,title,text])=><article key={title.en}><div className="hp-line-icon"><Icon name={icon}/></div><h3>{tx(title,lang)}</h3><p>{tx(text,lang)}</p></article>)}</div>
    </div></section>

    <section className="hp-products"><div className="hp-shell"><div className="hp-section-row"><h2>{tx(t("OUR MAIN PRODUCTS","主要产品"),lang)}</h2><button onClick={()=>go("products")}>{tx(t("View All Products","查看全部产品"),lang)} →</button></div>
      <div className="hp-product-grid">{featuredProducts.map((p,i)=><article key={`${p.cas}-${i}`}><img src={productImages[i]} alt={tx(p.name,lang)} /><div className="hp-product-content"><h3>{tx(p.name,lang)}</h3><p>CAS: {p.cas}</p>{p.un&&<p>UN: {p.un}</p>}<button onClick={()=>setSelectedProduct(p)}>{tx(t("View Details","查看详情"),lang)}</button></div></article>)}</div>
    </div></section>

    <section className="hp-section hp-services"><div className="hp-shell"><Header title={tx(t("OUR SERVICES","我们的服务"),lang)} />
      <div className="hp-service-grid">{services.map(([icon,title,text])=><article key={title.en}><div className="hp-line-icon"><Icon name={icon}/></div><h3>{tx(title,lang)}</h3><p>{tx(text,lang)}</p></article>)}</div>
      <Header title={tx(t("EXPORT PROCESS","出口流程"),lang)} compact />
      <div className="hp-process">{process.map(([title,text],i)=><article key={title.en}><div>{i+1}</div><h3>{tx(title,lang)}</h3><p>{tx(text,lang)}</p></article>)}</div>
      <div className="hp-lower-grid"><section><div className="hp-section-row lower"><h2>{tx(t("OUR GLOBAL MARKETS","全球市场"),lang)}</h2></div><div className="hp-map-wrap"><img src="/home-v3/world-map-clean.svg" alt="Global markets map"/></div><div className="hp-market-buttons">{["North America","South America","Europe","Middle East","Africa","Asia Pacific"].map(x=><button key={x}>◉ {x}</button>)}</div></section>
      <section><div className="hp-section-row lower"><h2>{tx(t("LATEST INSIGHTS","最新洞察"),lang)}</h2><button onClick={()=>go("insights")}>{tx(t("View All Articles","查看全部文章"),lang)} →</button></div><div className="hp-insight-grid">{latestArticles.map((a,i)=><article key={a.slug}><img src={a.coverImage||["/home-v3/insight-1.jpg","/home-v3/insight-2.jpg","/home-v3/drums-3.jpg"][i]} alt={tx(a.title,lang)}/><time>{["May 12, 2025","May 05, 2025","Apr 28, 2025"][i]}</time><h3>{tx(a.title,lang)}</h3><button onClick={()=>onOpenArticle(a.slug)}>{tx(t("Read More","阅读全文"),lang)} →</button></article>)}</div></section></div>
    </div></section>

    <section className="hp-cta"><div className="hp-cta-bg"/><div className="hp-shell hp-cta-inner"><div><h2>{tx(t("Ready to Work with a Trusted Chemical Export Partner?","准备与值得信赖的化工出口伙伴合作？"),lang)}</h2><p>{tx(t("Contact us today for a free quotation and let us support your business growth.","立即联系我们获取免费报价，助力您的业务增长。"),lang)}</p></div><button onClick={()=>go("contact")}>{tx(t("Send Inquiry Now","立即发送询盘"),lang)} →</button></div></section>

    <footer className="hp-footer"><div className="hp-shell hp-footer-grid"><div><div className="hp-footer-brand"><span>CE</span><b>ChinaChemExport</b></div><p>{tx(t("We are a professional chemical exporter from China, committed to providing high-quality products, compliant solutions and reliable service to customers worldwide.","我们是一家专业的中国化工品出口商，致力于为全球客户提供高品质产品、合规解决方案与可靠服务。"),lang)}</p><div className="hp-social"><a href="#" aria-label="LinkedIn">in</a><a href="#" aria-label="Facebook">f</a><a href="https://wa.me/8618678695200" aria-label="WhatsApp">◉</a><a href="mailto:info@chinachemexport.com" aria-label="Email">✉</a></div></div><FooterCol title="Products" items={["Inorganic Chemicals","Organic Chemicals","Fine Chemicals","Water Treatment Chemicals","View All Products"]}/><FooterCol title="Services" items={["Product Sourcing","Quality Control","Documentation","Logistics & Shipping","After-sales Support"]}/><FooterCol title="Company" items={["About Us","Our Team","Certifications","News","Contact Us"]}/><div><h3>Contact Us</h3><p>✉ Email: info@chinachemexport.com</p><p>☎ Tel: +86 186 7869 5200</p><p>◉ WhatsApp: +86 186 7869 5200</p><p>⌖ Address: Dongying, Shandong, China</p></div></div><div className="hp-shell hp-footer-bottom"><span>© 2026 ChinaChemExport. All Rights Reserved.</span><span>Privacy Policy　|　Terms of Use</span></div></footer>

    {selectedProduct&&<div className="hp-modal" onClick={()=>setSelectedProduct(null)}><div onClick={e=>e.stopPropagation()}><button className="hp-modal-close" onClick={()=>setSelectedProduct(null)}>×</button><h2>{tx(selectedProduct.name,lang)}</h2><p><b>CAS:</b> {selectedProduct.cas}</p>{selectedProduct.un&&<p><b>UN:</b> {selectedProduct.un}</p>}<p>{tx(selectedProduct.application,lang)}</p><button className="hp-primary" onClick={()=>go("contact")}>{tx(t("Request a Quote","获取报价"),lang)}</button></div></div>}
  </main>;
}

function Header({title,compact=false}:{title:string;compact?:boolean}){return <div className={`hp-heading ${compact?"compact":""}`}><h2>{title}</h2><span/></div>}
function FooterCol({title,items}:{title:string;items:string[]}){return <div><h3>{title}</h3>{items.map(x=><p key={x}>{x}</p>)}</div>}
