import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import "./HomePage.css";

export type Lang = "en" | "zh";
export type I18n = { en: string; zh: string };
export type Page =
  | "home"
  | "products"
  | "about"
  | "services"
  | "markets"
  | "cases"
  | "insights"
  | "contact";

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

type Props = {
  go: (page: Page) => void;
  lang: Lang;
  products: Product[];
  articles: Article[];
  onOpenArticle: (slug: string) => void;
};

const t = (en: string, zh: string): I18n => ({ en, zh });
const tx = (value: I18n, lang: Lang) => value[lang];

function productSlug(product: Product) {
  return product.name.en.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function openProductPage(product: Product) {
  window.history.pushState({}, "", `/products/${productSlug(product)}`);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

const strengths = [
  ["shield", t("Reliable Chemical Supply", "可靠化工品供应"), t("Stable product matching, specifications and batch coordination for international buyers.", "为国际采购商提供稳定的产品匹配、规格确认与批次协调。")],
  ["award", t("Quality & Documentation", "质量与单证"), t("COA, MSDS, specifications and export documents coordinated for each order.", "按订单协调COA、MSDS、产品规格与出口单证。")],
  ["team", t("Dongying Petrochemical Belt", "东营炼化产业带"), t("Close access to a strong refining and chemical production and supply base.", "依托东营炼化产业集群，连接成熟的化工生产与供应资源。")],
  ["globe", t("Inland-Port Support", "内陆港配套支持"), t("Storage, consolidation, repacking and container handling through our service network.", "依托服务网络提供仓储、集散、分装与集装箱作业支持。")],
  ["truck", t("DG Export Execution", "危险品出口执行"), t("Packaging, declaration, customs and dangerous-goods shipping coordination.", "提供包装、申报、报关及危险品运输协调。")],
  ["hand", t("Buyer-focused Service", "以采购商为中心"), t("Responsive quotation, order follow-up and long-term supply cooperation.", "提供快速报价、订单跟进与长期供应合作。")],
] as const;

const services = [
  ["source", t("Product Sourcing", "产品寻源"), t("High-quality products from reliable and audited manufacturers.", "来自可靠且经过审核的制造商。")],
  ["check", t("Quality Control", "质量控制"), t("Strict QC procedures throughout production and before shipment.", "生产全过程及装运前严格质检。")],
  ["doc", t("Documentation", "单证服务"), t("Complete export documents and certificates as required.", "按要求提供完整出口单证及证书。")],
  ["pack", t("Packaging & Labeling", "包装与标签"), t("Professional packaging and labeling in compliance with standards.", "符合标准的专业包装与标签。")],
  ["ship", t("Logistics & Shipping", "物流与海运"), t("Safe, efficient and cost-effective logistics solutions worldwide.", "安全、高效且具成本优势的全球物流。")],
  ["support", t("After-sales Support", "售后支持"), t("Dedicated support for any questions and after-sales service.", "提供专属售后支持与问题响应。")],
] as const;

function LineIcon({ name }: { name: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const paths: Record<string, ReactElement> = {
    shield: <><path {...common} d="M12 2.8 4.8 6v5.1c0 5.2 3.1 8.8 7.2 10.4 4.1-1.6 7.2-5.2 7.2-10.4V6L12 2.8Z"/><path {...common} d="m8.6 12 2.2 2.2 4.8-5"/></>,
    award: <><path {...common} d="m12 2.8 2 2.1 2.9-.3.7 2.8 2.5 1.5-1.2 2.6 1.2 2.6-2.5 1.5-.7 2.8-2.9-.3-2 2.1-2-2.1-2.9.3-.7-2.8-2.5-1.5 1.2-2.6-1.2-2.6 2.5-1.5.7-2.8 2.9.3 2-2.1Z"/><path {...common} d="m9.2 12 1.8 1.8 3.8-4"/></>,
    team: <><circle {...common} cx="12" cy="7.2" r="3.1"/><circle {...common} cx="5.3" cy="9.6" r="2.3"/><circle {...common} cx="18.7" cy="9.6" r="2.3"/><path {...common} d="M7.2 20v-2.7a4.8 4.8 0 0 1 9.6 0V20M1.8 19v-2a3.5 3.5 0 0 1 4.4-3.4M22.2 19v-2a3.5 3.5 0 0 0-4.4-3.4"/></>,
    globe: <><circle {...common} cx="12" cy="12" r="9"/><path {...common} d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21M12 3C9.5 5.6 8.2 8.6 8.2 12s1.3 6.4 3.8 9"/></>,
    truck: <><path {...common} d="M2.8 5.5h11.3v10.4H2.8zM14.1 9.2h4.1l3 3.3v3.4h-7.1z"/><circle {...common} cx="7" cy="18.2" r="2"/><circle {...common} cx="18.1" cy="18.2" r="2"/></>,
    hand: <><path {...common} d="M3.4 10.2 8 14.8l4-4 4 4 4.6-4.6"/><path {...common} d="M6.5 17.5 9 20h6l2.5-2.5M8 14.8 5 11.7a2.2 2.2 0 0 0-3.1 3.1L7 20M16 14.8l3-3.1a2.2 2.2 0 0 1 3.1 3.1L17 20"/></>,
    source: <><path {...common} d="M4 20h16M6.5 17.2 9.4 9l4.1 4.4 3.4-7.8"/><circle {...common} cx="17.7" cy="4.2" r="2.1"/><path {...common} d="M8.2 7.8 5.6 5.2M5.6 7.8 8.2 5.2"/></>,
    check: <><path {...common} d="M7 3.4h10v17.2H7z"/><path {...common} d="M9.5 3.4V2h5v1.4M9.5 12l1.8 1.8 3.6-3.8"/></>,
    doc: <><path {...common} d="M6 2.8h8.4L18 6.4v14.8H6z"/><path {...common} d="M14.4 2.8v3.6H18M8.8 10h6.4M8.8 13.8h6.4M8.8 17.6h4.5"/></>,
    pack: <><rect {...common} x="3" y="4.2" width="7.6" height="15.6" rx="1.2"/><rect {...common} x="13.4" y="4.2" width="7.6" height="15.6" rx="1.2"/><path {...common} d="M5.8 8h2M16.2 8h2M6.8 13.5h.1M17.2 13.5h.1"/></>,
    ship: <><path {...common} d="M3 15.2h18l-3 4.2H6zM6.8 15.2V7.6h7.1v7.6M13.9 10h4.2l2.9 3v2.2"/><circle {...common} cx="7.5" cy="20" r=".3"/><circle {...common} cx="12" cy="20" r=".3"/><circle {...common} cx="16.5" cy="20" r=".3"/></>,
    support: <><circle {...common} cx="12" cy="12" r="8.4"/><path {...common} d="M7.5 14.8v-3a4.5 4.5 0 0 1 9 0v3M6.7 13.5h2.1v4.2H6.7zM15.2 13.5h2.1v4.2h-2.1zM17.3 17.7c0 1.3-1 2.3-2.3 2.3h-2"/></>,
  };

  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function MetricIcon({ index }: { index: number }) {
  const names = ["clock", "building", "person", "badge"];
  return <span className={`hp-metric-glyph hp-metric-${names[index]}`} aria-hidden="true" />;
}

export default function HomePage({ go, lang, products, articles, onOpenArticle }: Props) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  useEffect(() => {
    document.body.classList.add("home-page-active");
    return () => document.body.classList.remove("home-page-active");
  }, []);

  const featuredProducts = products.slice(0, 6);
  const extraArticle: Article = {
    title: t("How Chemical Exporters Build Safer Global Supply Chains", "化工出口企业如何构建更安全的全球供应链"),
    tag: t("Supply Chain", "供应链"), text: t("Practical methods for compliant storage, packaging and international shipping.", "合规仓储、包装与国际运输的实用方法。"),
    slug: "safer-global-chemical-supply-chains",
    content: t("A reliable chemical supply chain combines verified sourcing, quality control, compliant packaging and experienced dangerous-goods logistics.", "可靠的化工供应链需要经过验证的采购、质量控制、合规包装以及专业危险品物流。"),
    seoTitle: t("Safer Global Chemical Supply Chains", "更安全的全球化工供应链"), seoDescription: t("A practical chemical export supply-chain guide.", "化工出口供应链实用指南。"),
  };
  const latestArticles = [...articles, extraArticle, extraArticle].slice(0, 3);

  const clickOriginalLanguageToggle = () => {
    const hiddenToggle = document.querySelector<HTMLButtonElement>(".header .lang-switch");
    hiddenToggle?.click();
  };

  return (
    <main className="hp">
      <header className="hp-header">
        <div className="hp-header-shell">
          <button className="hp-logo" onClick={() => go("home")} aria-label="ChinaChemExport home">
            <span className="hp-subpage-logo" aria-hidden="true">CE</span>
            <span className="hp-logo-copy">
              <strong>ChinaChemExport</strong>
              <small>CHEMICAL SUPPLIER &amp; EXPORTER</small>
            </span>
          </button>

          <nav className={`hp-nav hp-nav-i18n ${mobileNavOpen ? "is-open" : ""}`} aria-label="Main navigation">
            <button className="active" onClick={() => go("home")}>{tx(t("Home", "首页"), lang)}</button>
            <button onClick={() => go("products")}>{tx(t("Products", "产品"), lang)} <span>⌄</span></button>
            <button onClick={() => go("services")}>{tx(t("Services", "服务"), lang)} <span>⌄</span></button>
            <button onClick={() => go("markets")}>{tx(t("Markets", "市场"), lang)} <span>⌄</span></button>
            <button onClick={() => go("insights")}>{tx(t("Insights", "洞察"), lang)} <span>⌄</span></button>
            <button onClick={() => go("about")}>{tx(t("About Us", "关于我们"), lang)}</button>
            <button onClick={() => go("contact")}>{tx(t("Contact", "联系我们"), lang)}</button>
          </nav>
          <nav className="hp-nav hp-nav-legacy" aria-hidden="true">
            <button className="active" onClick={() => go("home")}>Home</button>
            <button onClick={() => go("products")}>Products <span>⌄</span></button>
            <button onClick={() => go("services")}>Services <span>⌄</span></button>
            <button onClick={() => go("markets")}>Markets <span>⌄</span></button>
            <button onClick={() => go("insights")}>Insights <span>⌄</span></button>
            <button onClick={() => go("about")}>About Us</button>
            <button onClick={() => go("contact")}>Contact</button>
          </nav>

          <div className="hp-header-actions">
            <button className={`hp-language ${lang === "zh" ? "is-zh" : ""}`} onClick={clickOriginalLanguageToggle} aria-label="Switch language">
              {lang === "en" ? "EN" : "中文"} <span>⌄</span>
            </button>
            <button className="hp-inquiry" onClick={() => go("contact")}>
              {tx(t("Inquiry Now", "立即询盘"), lang)}
            </button>
            <button className="hp-menu-toggle" onClick={() => setMobileNavOpen((open) => !open)} aria-label="Toggle navigation" aria-expanded={mobileNavOpen}>
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      <section className="hp-hero">
        <div className="hp-hero-art" />
        <div className="hp-hero-overlay" />
        <div className="hp-shell hp-hero-inner">
          <div className="hp-hero-copy">
            <h1>
              {tx(t("Reliable. Compliant. Global.", "可靠、合规、全球交付。"), lang)}
              <br />
              {tx(t("Bulk Chemicals Exporter from China.", "中国大宗化工品出口商。"), lang)}
            </h1>
            <p>
              {tx(
                t(
                  "ChinaChemExport supplies and exports bulk chemicals from Dongying, China, with reliable products and integrated dangerous-goods export support.",
                  "ChinaChemExport立足中国东营，供应并出口大宗化工品，同时提供可靠产品与危险品出口一站式配套支持。",
                ),
                lang,
              )}
            </p>
            <div className="hp-hero-actions">
              <button className="hp-primary" onClick={() => go("products")}>
                {tx(t("View Products", "查看产品"), lang)} →
              </button>
              <button className="hp-outline-light" onClick={() => go("contact")}>
                {tx(t("Contact Us", "联系我们"), lang)}
              </button>
            </div>

            <div className="hp-metrics">
              {[
                ["Dongying", t("Supply Base", "供应基地")],
                [`${products.length}+`, t("Listed Chemicals", "在售化工品")],
                ["DG", t("Export Support", "危险品出口支持")],
                ["One-stop", t("Order Coordination", "订单全程协调")],
              ].map(([number, label], index) => (
                <button className="hp-metric" key={String(number)} onClick={() => index === 1 ? go("products") : index === 2 || index === 3 ? go("services") : go("about")}>
                  <MetricIcon index={index} />
                  <span>
                    <strong>{String(number)}</strong>
                    <small>{tx(label as I18n, lang)}</small>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="about-home" className="hp-section hp-why">
        <div className="hp-shell">
          <SectionHeading title={tx(t("WHY CHOOSE CHINACHEMEXPORT", "为什么选择 CHINACHEMEXPORT"), lang)} />
          <div className="hp-six-grid">
            {strengths.map(([icon, title, text], index) => (
              <article key={title.en} role="button" tabIndex={0} onClick={() => index < 2 ? go("products") : index === 3 ? go("markets") : index === 5 ? go("contact") : go("services")}>
                <div className="hp-line-icon"><LineIcon name={icon} /></div>
                <h3>{tx(title, lang)}</h3>
                <p>{tx(text, lang)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hp-products">
        <div className="hp-shell">
          <div className="hp-section-row">
            <h2>{tx(t("OUR MAIN PRODUCTS", "主要产品"), lang)}</h2>
            <button onClick={() => go("products")}>{tx(t("View All Products", "查看全部产品"), lang)} →</button>
          </div>

          <div className="hp-product-grid">
            {featuredProducts.map((product, index) => (
              <article key={`${product.cas}-${index}`} role="link" tabIndex={0} onClick={() => openProductPage(product)} onKeyDown={(event) => event.key === "Enter" && openProductPage(product)}>
                <div className="hp-product-image">
                  <img
                    src={product.imageUrl || "/home-v4/products-photo.webp"}
                    alt={tx(product.name, lang)}
                    loading="lazy"
                    onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/home-v4/products-photo.webp"; }}
                    style={{ objectPosition: product.imagePosition || `${index * 25}% center` }}
                  />
                </div>
                <div className="hp-product-content">
                  <h3>{tx(product.name, lang)}</h3>
                  <p>CAS: {product.cas || "-"}</p>
                  {/^\d{4}$/.test(product.un.trim()) && <p>UN: {product.un}</p>}
                  <button onClick={(event) => { event.stopPropagation(); openProductPage(product); }}>
                    {tx(t("View Details", "查看详情"), lang)}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hp-section hp-services">
        <div className="hp-shell">
          <SectionHeading title={tx(t("EXPORT SUPPORT FOR EVERY ORDER", "每笔订单的出口配套支持"), lang)} />
          <div className="hp-service-grid hp-service-grid-compact">
            {services.slice(0, 4).map(([icon, title, text]) => (
              <article key={title.en} role="button" tabIndex={0} onClick={() => go("services")}>
                <div className="hp-line-icon"><LineIcon name={icon} /></div>
                <h3>{tx(title, lang)}</h3>
                <p>{tx(text, lang)}</p>
              </article>
            ))}
          </div>

          <div className="hp-services-more">
            <button onClick={() => go("services")}>{tx(t("Explore All Services & Export Process", "查看全部服务与出口流程"), lang)} →</button>
          </div>

          <div className="hp-lower-grid">
            <section className="hp-markets-panel">
              <div className="hp-section-row lower">
                <h2>{tx(t("OUR GLOBAL MARKETS", "全球市场"), lang)}</h2>
              </div>
              <div className="hp-map-wrap">
                <img src="/home-v4/world-map-v3.svg" alt="Global markets network map" />
              </div>
              <div className="hp-market-buttons">
                {["North America", "South America", "Europe", "Middle East", "Africa", "Asia Pacific"].map((region) => (
                  <button key={region} onClick={() => go("markets")}><span />{region}</button>
                ))}
              </div>
            </section>

            <section className="hp-insights-panel">
              <div className="hp-section-row lower">
                <h2>{tx(t("LATEST INSIGHTS", "最新洞察"), lang)}</h2>
                <button onClick={() => go("insights")}>{tx(t("View All Articles", "查看全部文章"), lang)} →</button>
              </div>
              <div className="hp-insight-grid">
                {latestArticles.map((article, index) => (
                  <article key={article.slug} role="button" tabIndex={0} onClick={() => onOpenArticle(article.slug)}>
                    <div className="hp-insight-image">
                      <img className={`hp-insight-shot hp-insight-shot-${index + 1}`} src={article.coverImage || "/home-v4/insights-photo.webp"} alt={tx(article.title, lang)} loading="lazy" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/home-v4/insights-photo.webp"; }} />
                    </div>
                    <time>{["May 12, 2025", "May 05, 2025", "Apr 28, 2025"][index]}</time>
                    <h3>{tx(article.title, lang)}</h3>
                    <button onClick={() => onOpenArticle(article.slug)}>
                      {tx(t("Read More", "阅读全文"), lang)} →
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="hp-cta">
        <div className="hp-cta-art" />
        <div className="hp-cta-overlay" />
        <div className="hp-shell hp-cta-inner">
          <div>
            <h2>{tx(t("Ready to Work with a Trusted Chemical Export Partner?", "准备与值得信赖的化工出口伙伴合作？"), lang)}</h2>
            <p>{tx(t("Contact us today for a free quotation and let us support your business growth.", "立即联系我们获取免费报价，助力您的业务增长。"), lang)}</p>
          </div>
          <button onClick={() => go("contact")}>{tx(t("Send Inquiry Now", "立即发送询盘"), lang)} →</button>
        </div>
      </section>

      <footer className="hp-footer">
        <div className="hp-shell hp-footer-grid">
          <div className="hp-footer-about">
            <button className="hp-footer-logo" onClick={() => go("home")}>
              <span className="hp-subpage-logo" aria-hidden="true">CE</span>
              <span><strong>ChinaChemExport</strong><small>CHEMICAL SUPPLIER &amp; EXPORTER</small></span>
            </button>
            <p>
              {tx(
                t(
                  "ChinaChemExport supplies bulk chemicals from Dongying, China, backed by integrated dangerous-goods export coordination for global buyers.",
                  "ChinaChemExport立足中国东营，面向全球采购商供应大宗化工品，并提供危险品出口全流程协调支持。",
                ),
                lang,
              )}
            </p>
            <div className="hp-social">
              <a href="#" aria-label="LinkedIn">in</a>
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="X">𝕏</a>
              <a href="https://wa.me/8618678695200" aria-label="WhatsApp">◉</a>
              <a href="mailto:18678695200@163.com" aria-label="Email">✉</a>
            </div>
          </div>

          <FooterColumn title="Products" go={go} items={[["Solvents", "products"], ["Organic Acids", "products"], ["Alcohols & Glycols", "products"], ["Chemical Intermediates", "products"], ["View All Products", "products"]]} />
          <FooterColumn title="Services" go={go} items={[["Order Support", "services"], ["Quality Control", "services"], ["Documentation", "services"], ["DG Logistics", "services"], ["Export Process", "services"]]} />
          <FooterColumn title="Company" go={go} items={[["About Us", "about"], ["Our Advantages", "about"], ["Insights", "insights"], ["Markets", "markets"], ["Contact Us", "contact"]]} />

          <div className="hp-contact">
            <h3>Contact Us</h3>
            <p>◉&nbsp; <a href="mailto:18678695200@163.com">Email: 18678695200@163.com</a></p>
            <p>◉&nbsp; <a href="tel:+8618678695200">Tel: +86 186 7869 5200</a></p>
            <p>◉&nbsp; <a href="https://wa.me/8618678695200">WhatsApp: +86 186 7869 5200</a></p>
            <p>◉&nbsp; Address: Dongying, Shandong, China</p>
          </div>
        </div>

        <div className="hp-shell hp-footer-bottom">
          <span>© 2026 ChinaChemExport. All Rights Reserved.</span>
          <span>Privacy Policy&nbsp;&nbsp; | &nbsp;&nbsp;Terms of Use</span>
        </div>
      </footer>
    </main>
  );
}

function SectionHeading({ title, compact = false }: { title: string; compact?: boolean }) {
  return (
    <div className={`hp-heading ${compact ? "compact" : ""}`}>
      <h2>{title}</h2>
      {!compact && <span />}
    </div>
  );
}

function FooterColumn({ title, items, go }: { title: string; items: [string, Page][]; go: (page: Page) => void }) {
  return (
    <div className="hp-footer-column">
      <h3>{title}</h3>
      {items.map(([label, page]) => <button key={label} type="button" onClick={() => go(page)}>{label}</button>)}
    </div>
  );
}
