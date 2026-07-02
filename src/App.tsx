import { useEffect, useMemo, useState } from "react";
import "./App.css";

type Product = {
  name: string;
  cas: string;
  un: string;
  purity: string;
  packing: string;
  category: string;
  application: string;
};

type Page = "home" | "products" | "services" | "markets" | "insights" | "contact";

const nav: { label: string; page: Page }[] = [
  { label: "Home", page: "home" },
  { label: "Products", page: "products" },
  { label: "Services", page: "services" },
  { label: "Markets", page: "markets" },
  { label: "Insights", page: "insights" },
  { label: "Contact", page: "contact" },
];

const products: Product[] = [
  { name: "Toluene", cas: "108-88-3", un: "1294", purity: "99.9% Min", packing: "Drums / ISO Tank", category: "Aromatic Solvent", application: "Coatings, adhesives, inks and chemical intermediates." },
  { name: "Mixed Xylene", cas: "1330-20-7", un: "1307", purity: "99.5% Min", packing: "Drums / ISO Tank", category: "Aromatic Solvent", application: "Paints, resins, pesticides and industrial solvents." },
  { name: "Benzene", cas: "71-43-2", un: "1114", purity: "99.9% Min", packing: "ISO Tank", category: "Feedstock", application: "Styrene, phenol, cyclohexane and chemical synthesis." },
  { name: "Methanol", cas: "67-56-1", un: "1230", purity: "99.9% Min", packing: "Drums / ISO Tank", category: "Alcohol", application: "Formaldehyde, fuel blending, solvents and antifreeze." },
  { name: "IPA", cas: "67-63-0", un: "1219", purity: "99.5% Min", packing: "Drums / ISO Tank", category: "Alcohol", application: "Cleaning, pharmaceutical, electronics and coatings." },
  { name: "Ethyl Acetate", cas: "141-78-6", un: "1173", purity: "99.5% Min", packing: "Drums / ISO Tank", category: "Ester", application: "Printing inks, adhesives, coatings and packaging." },
  { name: "MEK", cas: "78-93-3", un: "1193", purity: "99.5% Min", packing: "Drums / ISO Tank", category: "Ketone", application: "PU resin, coatings, adhesives and synthetic leather." },
  { name: "Acetone", cas: "67-64-1", un: "1090", purity: "99.5% Min", packing: "Drums / ISO Tank", category: "Ketone", application: "Cleaning, pharma, plastics and laboratory solvents." },
  { name: "Butyl Acetate", cas: "123-86-4", un: "1123", purity: "99.5% Min", packing: "Drums / ISO Tank", category: "Ester", application: "Automotive paint, wood coatings, ink and adhesives." },
];

const services = [
  { title: "Chemical Supply", text: "Factory sourcing, product matching, quotation and export-ready supply coordination.", icon: "◎" },
  { title: "DG Warehousing", text: "Licensed hazardous chemical storage, batch separation and controlled outbound loading.", icon: "⌂" },
  { title: "UN Packaging", text: "UN drums, IBC, ISO tank options, DG labels, marks and packing photo records.", icon: "◇" },
  { title: "Customs", text: "Export documents, HS code check, DG declaration and customs clearance workflow.", icon: "▤" },
  { title: "Port Coordination", text: "Port cut-off control, delivery plan, loading supervision and shipment status update.", icon: "⚓" },
  { title: "Ocean Freight", text: "DG space checking, carrier booking and ocean freight plan for major global routes.", icon: "▣" },
];

const markets = [
  { region: "Middle East", countries: "UAE, Saudi Arabia, Qatar, Oman, Kuwait", ports: "Jebel Ali / Dammam / Jeddah", demand: "Solvents, alcohols, esters and bulk liquid chemicals." },
  { region: "South Asia", countries: "India, Pakistan, Bangladesh, Sri Lanka", ports: "Mundra / Nhava Sheva / Chennai", demand: "Coatings, inks, adhesive and resin production chemicals." },
  { region: "Southeast Asia", countries: "Vietnam, Indonesia, Thailand, Malaysia", ports: "Ho Chi Minh / Hai Phong / Jakarta", demand: "Regional manufacturing solvents and packaging chemicals." },
  { region: "Africa", countries: "South Africa, Nigeria, Kenya, Ghana", ports: "Durban / Lagos / Mombasa", demand: "Industrial solvent supply and dangerous goods export support." },
  { region: "Europe", countries: "Turkey, Netherlands, Spain", ports: "Istanbul / Rotterdam / Valencia", demand: "Document-controlled chemical supply and container shipments." },
  { region: "South America", countries: "Brazil, Chile, Peru, Colombia", ports: "Santos / San Antonio / Callao", demand: "Bulk chemical sourcing and long-distance freight coordination." },
];

const cases = [
  { product: "Methanol Export To UAE", volume: "80 MT", packing: "ISO Tank", port: "Jebel Ali", scope: "Supply + Tank + DG Declaration + Ocean Freight" },
  { product: "Toluene Export To India", volume: "120 MT", packing: "Drums", port: "Mundra", scope: "UN Packing + Customs + Port Coordination" },
  { product: "MEK Export To Saudi Arabia", volume: "64 MT", packing: "Drums", port: "Dammam", scope: "MSDS / COA / DG Labels / Shipment Execution" },
];

const faqs = [
  "Can you provide MSDS and COA before shipment?",
  "Can you arrange dangerous goods declaration?",
  "Can you export Class 3 liquid chemicals?",
  "Can you supply ISO tank and UN drum packing?",
  "Can you support OEM labels and customer marks?",
  "Can you quote CFR / CIF ocean freight together with product price?",
];

const articles = [
  { title: "How To Export Class 3 Chemicals From China", tag: "DG Export Guide", text: "A practical checklist for product confirmation, MSDS, UN packing, DG declaration and port execution." },
  { title: "ISO Tank vs Drum Packing For Liquid Chemicals", tag: "Packing", text: "How buyers choose between drums, IBC and ISO tank based on quantity, port and handling conditions." },
  { title: "Documents Needed For Dangerous Chemical Shipment", tag: "Documentation", text: "MSDS, COA, DG declaration, packing list, commercial invoice and booking information." },
];

function pathToPage(pathname: string): Page {
  const key = pathname.replace(/^\//, "") as Page;
  return ["products", "services", "markets", "insights", "contact"].includes(key) ? key : "home";
}

function pageToPath(page: Page) {
  return page === "home" ? "/" : `/${page}`;
}

export default function App() {
  const [page, setPage] = useState<Page>(() => pathToPage(window.location.pathname));
  const [selectedProduct, setSelectedProduct] = useState(products[0]);

  useEffect(() => {
    const onPop = () => setPage(pathToPage(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = page === "home" ? "ChinaDGExport | Dangerous Chemical Export Platform" : `${page[0].toUpperCase() + page.slice(1)} | ChinaDGExport`;
  }, [page]);

  function go(next: Page) {
    window.history.pushState({}, "", pageToPath(next));
    setPage(next);
  }

  const content = useMemo(() => {
    if (page === "products") return <ProductsPage selected={selectedProduct} setSelected={setSelectedProduct} go={go} />;
    if (page === "services") return <ServicesPage go={go} />;
    if (page === "markets") return <MarketsPage go={go} />;
    if (page === "insights") return <InsightsPage go={go} />;
    if (page === "contact") return <ContactPage />;
    return <HomePage go={go} />;
  }, [page, selectedProduct]);

  return (
    <>
      <header className="header">
        <button className="brand" onClick={() => go("home")}>
          <span className="brand-mark">DG</span>
          <span><b>ChinaDGExport</b><small>Dangerous Chemical Export Platform</small></span>
        </button>
        <nav>
          {nav.map((item) => <button key={item.page} className={page === item.page ? "active" : ""} onClick={() => go(item.page)}>{item.label}</button>)}
        </nav>
        <button className="header-cta" onClick={() => go("contact")}>Get Quote</button>
      </header>
      {content}
      <Footer go={go} />
    </>
  );
}

function HomePage({ go }: { go: (page: Page) => void }) {
  return (
    <main>
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">China-Origin Petrochemical Export Solutions</p>
            <h1>Dangerous Chemical Export Platform From China</h1>
            <p className="lead">Integrated support for chemical supply, DG warehousing, UN packaging, customs, port coordination and ocean freight.</p>
            <div className="hero-actions">
              <button className="blue-btn" onClick={() => go("contact")}>Request Quotation</button>
              <button className="light-btn" onClick={() => go("services")}>View Export Services</button>
            </div>
            <div className="hero-tags"><span>Class 3 Chemicals</span><span>ISO Tank</span><span>UN Drums</span><span>MSDS / COA</span></div>
          </div>
          <div className="hero-card">
            <b>Platform Scope</b>
            {services.map((s) => <div key={s.title}><span>{s.icon}</span>{s.title}</div>)}
          </div>
        </div>
      </section>

      <section className="section about-home">
        <div className="container split">
          <div>
            <p className="eyebrow">About Platform</p>
            <h2>Not a simple trader. Not a freight forwarder.</h2>
          </div>
          <p>ChinaDGExport is built as a dangerous chemical export execution platform. We connect upstream supply, compliant packing, hazardous warehouse resources, customs documentation and port shipment coordination into one export workflow.</p>
        </div>
      </section>

      <section className="section muted">
        <div className="container">
          <SectionTop kicker="Export Ecosystem" title="One workflow from product to shipment." action="View Services" onClick={() => go("services")} />
          <div className="service-grid">{services.map((s) => <ServiceCard key={s.title} {...s} />)}</div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionTop kicker="Featured Products" title="Core petrochemical products for export." action="All Products" onClick={() => go("products")} />
          <div className="product-grid compact">{products.slice(0, 6).map((p) => <ProductCard key={p.name} product={p} onClick={() => go("products")} />)}</div>
        </div>
      </section>

      <section className="section dark">
        <div className="container split light-split">
          <div><p className="eyebrow">Markets</p><h2>Serving chemical buyers across major import markets.</h2></div>
          <div className="mini-market">{markets.slice(0, 4).map((m) => <button key={m.region} onClick={() => go("markets")}>{m.region}<span>{m.countries}</span></button>)}</div>
        </div>
      </section>

      <CTA go={go} />
    </main>
  );
}

function ProductsPage({ selected, setSelected, go }: { selected: Product; setSelected: (p: Product) => void; go: (page: Page) => void }) {
  return (
    <main className="page">
      <PageHero kicker="Products" title="Petrochemical products with export execution support." text="Core solvent and chemical products supplied with MSDS, COA, DG declaration, packing options and shipment coordination." />
      <section className="section">
        <div className="container product-page-layout">
          <aside className="product-tabs">
            <b>Product List</b>
            {products.map((p) => <button key={p.name} className={selected.name === p.name ? "active" : ""} onClick={() => setSelected(p)}>{p.name}<span>UN {p.un}</span></button>)}
          </aside>
          <div className="product-detail">
            <div className="detail-head"><p className="eyebrow">{selected.category}</p><h2>{selected.name}</h2><button className="blue-btn" onClick={() => go("contact")}>Inquiry This Product</button></div>
            <div className="spec-grid"><Info label="CAS" value={selected.cas} /><Info label="UN No." value={selected.un} /><Info label="Purity" value={selected.purity} /><Info label="Packing" value={selected.packing} /></div>
            <div className="detail-box"><h3>Application</h3><p>{selected.application}</p></div>
            <div className="detail-box"><h3>Export Documents</h3><div className="chip-row"><span>MSDS</span><span>COA</span><span>DG Declaration</span><span>Packing List</span><span>Commercial Invoice</span><span>B/L</span></div></div>
            <div className="detail-box"><h3>Export Support</h3><p>We can coordinate product sourcing, UN packaging, DG warehousing, customs clearance, port cut-off and ocean freight according to your destination port and cargo class.</p></div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ServicesPage({ go }: { go: (page: Page) => void }) {
  return (
    <main className="page">
      <PageHero kicker="Services" title="Integrated dangerous chemical export execution." text="From product confirmation to port departure, the service page explains how ChinaDGExport organizes the export workflow." />
      <section className="section muted"><div className="container service-grid large">{services.map((s) => <ServiceCard key={s.title} {...s} />)}</div></section>
      <section className="section"><div className="container"><SectionTop kicker="Execution Flow" title="A clear process for every shipment." /><div className="flow">{["Inquiry", "Product Match", "Quote", "Order", "Documents", "DG Warehouse", "Customs", "Ocean Freight"].map((x, i) => <div key={x}><b>{String(i + 1).padStart(2, "0")}</b><span>{x}</span></div>)}</div></div></section>
      <CTA go={go} />
    </main>
  );
}

function MarketsPage({ go }: { go: (page: Page) => void }) {
  return (
    <main className="page">
      <PageHero kicker="Markets" title="Export chemicals to major global markets." text="Destination-focused chemical export support for importers, distributors and industrial users." />
      <section className="section"><div className="container"><div className="market-grid">{markets.map((m) => <div className="market-card" key={m.region}><p>{m.region}</p><h3>{m.countries}</h3><Info label="Common Ports" value={m.ports} /><Info label="Demand" value={m.demand} /><button onClick={() => go("contact")}>Ask Route Quote →</button></div>)}</div></div></section>
      <section className="section muted"><div className="container"><SectionTop kicker="Case Studies" title="Sample export execution cases." /><div className="case-grid">{cases.map((c) => <div className="case-card" key={c.product}><p>{c.product}</p><h3>{c.volume}</h3><span>{c.packing}</span><span>{c.port}</span><b>{c.scope}</b></div>)}</div></div></section>
    </main>
  );
}

function InsightsPage({ go }: { go: (page: Page) => void }) {
  return (
    <main className="page">
      <PageHero kicker="Insights" title="Chemical export knowledge center." text="Practical information for buyers who need product supply, DG documents, packing and shipment execution from China." />
      <section className="section"><div className="container"><div className="article-grid">{articles.map((a) => <article key={a.title}><span>{a.tag}</span><h3>{a.title}</h3><p>{a.text}</p><button onClick={() => go("contact")}>Ask Our Team →</button></article>)}</div></div></section>
      <section className="section muted"><div className="container faq"><SectionTop kicker="FAQ" title="Questions buyers ask before shipment." />{faqs.map((q) => <details key={q}><summary>{q}</summary><p>Yes. Our team will check the product class, packing method, destination port and documents required before quotation and shipment arrangement.</p></details>)}</div></section>
    </main>
  );
}

function ContactPage() {
  return (
    <main className="page">
      <PageHero kicker="Contact" title="Request product, packing and freight quotation." text="Send product name, quantity, destination port and packing preference. We will prepare a structured export quotation." />
      <section className="section"><div className="container contact-layout"><div className="contact-card"><h2>Inquiry Information</h2><input placeholder="Product name / CAS / UN No." /><input placeholder="Quantity, e.g. 1 FCL / 80 MT" /><input placeholder="Destination port / country" /><select><option>Packing preference</option><option>ISO Tank</option><option>UN Drums</option><option>IBC</option><option>Need recommendation</option></select><textarea placeholder="Additional requirements: purity, documents, label, Incoterms..." /><button className="blue-btn">Submit Inquiry</button></div><div className="contact-side"><p className="eyebrow">Fast Quote Checklist</p><h2>What to prepare?</h2><ul><li>Product name and target specification</li><li>Quantity and packing method</li><li>Destination port and Incoterms</li><li>Required documents and labels</li><li>Delivery schedule and repeat order plan</li></ul></div></div></section>
    </main>
  );
}

function SectionTop({ kicker, title, action, onClick }: { kicker: string; title: string; action?: string; onClick?: () => void }) {
  return <div className="section-top"><div><p className="eyebrow">{kicker}</p><h2>{title}</h2></div>{action && <button className="outline-btn" onClick={onClick}>{action}</button>}</div>;
}

function PageHero({ kicker, title, text }: { kicker: string; title: string; text: string }) {
  return <section className="page-hero"><div className="container"><p className="eyebrow">{kicker}</p><h1>{title}</h1><p>{text}</p></div></section>;
}

function ServiceCard({ title, text, icon }: { title: string; text: string; icon: string }) {
  return <div className="service-card"><span>{icon}</span><h3>{title}</h3><p>{text}</p></div>;
}

function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  return <button className="product-card" onClick={onClick}><p>{product.category}</p><h3>{product.name}</h3><div><span>CAS {product.cas}</span><span>UN {product.un}</span></div><b>{product.packing}</b></button>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="info"><small>{label}</small><strong>{value}</strong></div>;
}

function CTA({ go }: { go: (page: Page) => void }) {
  return <section className="cta"><div className="container"><h2>Need chemical supply with DG export execution?</h2><p>Send product, quantity and destination port. We will check supply, packing, documents and freight plan.</p><button className="blue-btn" onClick={() => go("contact")}>Start Inquiry</button></div></section>;
}

function Footer({ go }: { go: (page: Page) => void }) {
  return <footer><div className="container footer-grid"><div><b>ChinaDGExport</b><p>Dangerous Chemical Export Platform</p></div><div>{nav.map((n) => <button key={n.page} onClick={() => go(n.page)}>{n.label}</button>)}</div></div></footer>;
}
