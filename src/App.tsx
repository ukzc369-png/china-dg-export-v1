import { useEffect, useMemo, useState } from "react";
import "./App.css";
import AdminApp from "./admin/AdminApp";
import { openAnalyticsSettings, trackInquirySubmission, trackPageView } from "./analytics";
import { legalDocuments, type LegalPageKey } from "./legalContent";
import { articleTranslations } from "./articleTranslations";
import { translateProductCategoryZh, translateProductNameZh } from "./productTranslations";
import { supabase } from "./lib/supabase";
import HomePage from "./HomePage";
type Page =
  | "home"
  | "products"
  | "about"
  | "services"
  | "markets"
  | "cases"
  | "insights"
  | "contact"
  | "privacy"
  | "terms"
  | "cookies"
  | "dangerous-goods";
type Lang = "en" | "zh";
type I18n = { en: string; zh: string };
type Product = {
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
  seoTitle?: string;
  seoDescription?: string;
};
type CmsProduct = {
  id: number;
  name: string;
  cas: string | null;
  un_number: string | null;
  category: string | null;
  description: string | null;
  image_url: string | null;
  specification: string | null;
  seo_title: string | null;
  seo_description: string | null;
  status: string | null;
  created_at: string;
};
type Article = {
  title: I18n;
  tag: I18n;
  text: I18n;
  slug: string;
  content: I18n;
  seoTitle: I18n;
  seoDescription: I18n;
  coverImage?: string;
};
type CmsArticle = {
  id: number;
  title: string;
  slug: string | null;
  content: string | null;
  seo_title: string | null;
  seo_description: string | null;
  cover_image: string | null;
  status: string | null;
  created_at: string;
};
type Service = { title: I18n; text: I18n; icon: string };
type Market = { region: I18n; countries: I18n; ports: string; demand: I18n };
type CaseItem = {
  product: I18n;
  volume: string;
  packing: I18n;
  port: string;
  country: I18n;
  route: I18n;
  timeline: string;
  scope: I18n;
  result: I18n;
};

const tx = (v: I18n, lang: Lang) => v[lang];
const t = (en: string, zh: string): I18n => ({ en, zh });
function storedI18n(value: string | null | undefined, fallbackEn: string, fallbackZh: string): I18n {
  if (value) {
    try {
      const parsed = JSON.parse(value) as Partial<I18n>;
      if (parsed && typeof parsed === "object" && (parsed.en || parsed.zh)) {
        return t(parsed.en || fallbackEn, parsed.zh || fallbackZh);
      }
    } catch {
      // Existing records are plain English and remain fully compatible.
    }
  }
  return t(value || fallbackEn, fallbackZh);
}

const nav: { label: I18n; page: Page }[] = [
  { label: t("Home", "首页"), page: "home" },
  { label: t("Products", "产品"), page: "products" },
  { label: t("Export Services", "出口服务"), page: "services" },
  { label: t("Markets", "市场"), page: "markets" },
  { label: t("Cases", "案例"), page: "cases" },
  { label: t("Insights", "知识"), page: "insights" },
  { label: t("About Us", "关于我们"), page: "about" },
  { label: t("Contact", "联系"), page: "contact" },
];

const fallbackProducts: Product[] =[
  {
    name: t("Toluene", "甲苯"),
    cas: "108-88-3",
    un: "1294",
    purity: "99.9%",
    packing: t("Drums / ISO Tank / IBC", "桶装 / ISO罐 / IBC"),
    category: t("Aromatic Solvents", "芳烃溶剂"),
    application: t(
      "Coatings, adhesives, inks and chemical intermediates.",
      "用于涂料、胶黏剂、油墨及化工中间体。",
    ),
    icon: "⬡",
  },
  {
    name: t("Mixed Xylene", "混合二甲苯"),
    cas: "1330-20-7",
    un: "1307",
    purity: "99.0%",
    packing: t("Drums / ISO Tank / IBC", "桶装 / ISO罐 / IBC"),
    category: t("Aromatic Solvents", "芳烃溶剂"),
    application: t(
      "Paints, resins, pesticides and industrial solvents.",
      "用于油漆、树脂、农化及工业溶剂。",
    ),
    icon: "⬢",
  },
  {
    name: t("Benzene", "苯"),
    cas: "71-43-2",
    un: "1114",
    purity: "99.9%",
    packing: t("ISO Tank", "ISO罐"),
    category: t("Feedstocks", "基础原料"),
    application: t(
      "Styrene, phenol, cyclohexane and chemical synthesis.",
      "用于苯乙烯、苯酚、环己烷及化工合成。",
    ),
    icon: "⌬",
  },
  {
    name: t("Methanol", "甲醇"),
    cas: "67-56-1",
    un: "1230",
    purity: "99.5%",
    packing: t("Drums / ISO Tank / IBC", "桶装 / ISO罐 / IBC"),
    category: t("Alcohols", "醇类"),
    application: t(
      "Formaldehyde, fuel blending, solvents and antifreeze.",
      "用于甲醛、燃料调和、溶剂及防冻液。",
    ),
    icon: "◊",
  },
  {
    name: t("IPA", "异丙醇"),
    cas: "67-63-0",
    un: "1219",
    purity: "99.5%",
    packing: t("Drums / ISO Tank / IBC", "桶装 / ISO罐 / IBC"),
    category: t("Alcohols", "醇类"),
    application: t(
      "Cleaning, pharmaceutical, electronics and coatings.",
      "用于清洗、医药、电子及涂料行业。",
    ),
    icon: "♙",
  },
  {
    name: t("Ethyl Acetate", "乙酸乙酯"),
    cas: "141-78-6",
    un: "1173",
    purity: "99.0%",
    packing: t("Drums / ISO Tank / IBC", "桶装 / ISO罐 / IBC"),
    category: t("Esters", "酯类"),
    application: t(
      "Printing inks, adhesives, coatings and packaging.",
      "用于印刷油墨、胶黏剂、涂料及包装。",
    ),
    icon: "♧",
  },
  {
    name: t("MEK", "丁酮"),
    cas: "78-93-3",
    un: "1193",
    purity: "99.0%",
    packing: t("Drums / ISO Tank / IBC", "桶装 / ISO罐 / IBC"),
    category: t("Ketones", "酮类"),
    application: t(
      "PU resin, coatings, adhesives and synthetic leather.",
      "用于PU树脂、涂料、胶黏剂及合成革。",
    ),
    icon: "▣",
  },
  {
    name: t("Acetone", "丙酮"),
    cas: "67-64-1",
    un: "1090",
    purity: "99.5%",
    packing: t("Drums / ISO Tank / IBC", "桶装 / ISO罐 / IBC"),
    category: t("Ketones", "酮类"),
    application: t(
      "Cleaning, pharma, plastics and laboratory solvents.",
      "用于清洗、医药、塑料及实验室溶剂。",
    ),
    icon: "◊",
  },
  {
    name: t("Butyl Acetate", "乙酸丁酯"),
    cas: "123-86-4",
    un: "1123",
    purity: "99.5%",
    packing: t("Drums / ISO Tank", "桶装 / ISO罐"),
    category: t("Esters", "酯类"),
    application: t(
      "Automotive paint, wood coatings, ink and adhesives.",
      "用于汽车漆、木器漆、油墨及胶黏剂。",
    ),
    icon: "♧",
  },
  {
    name: t("Cyclohexanone", "环己酮"),
    cas: "108-94-1",
    un: "1915",
    purity: "99.5%",
    packing: t("Drums / ISO Tank", "桶装 / ISO罐"),
    category: t("Ketones", "酮类"),
    application: t(
      "Nylon, caprolactam, paints and industrial solvents.",
      "用于尼龙、己内酰胺、涂料及工业溶剂。",
    ),
    icon: "⬡",
  },
  {
    name: t("Styrene Monomer", "苯乙烯"),
    cas: "100-42-5",
    un: "2055",
    purity: "99.8%",
    packing: t("ISO Tank", "ISO罐"),
    category: t("Feedstocks", "基础原料"),
    application: t(
      "PS, ABS, SBR and resin production.",
      "用于PS、ABS、SBR及树脂生产。",
    ),
    icon: "⬢",
  },
  {
    name: t("DMF", "二甲基甲酰胺"),
    cas: "68-12-2",
    un: "2265",
    purity: "99.9%",
    packing: t("Drums / ISO Tank", "桶装 / ISO罐"),
    category: t("Amides", "酰胺类"),
    application: t(
      "PU leather, electronics, pharma intermediates and solvents.",
      "用于PU革、电子、医药中间体及溶剂。",
    ),
    icon: "▤",
  },
];

const services: Service[] = [
  {
    title: t("Chemical Supply", "化工品供应"),
    text: t(
      "Factory sourcing, product matching and export-ready coordination.",
      "工厂寻源、产品匹配及出口准备协调。",
    ),
    icon: "◎",
  },
  {
    title: t("DG Warehousing", "危化品仓储"),
    text: t(
      "Compliant hazardous storage, batch separation and controlled handling through our regional service network.",
      "依托区域服务网络提供合规危化仓储、批次分离及受控操作。",
    ),
    icon: "⌂",
  },
  {
    title: t("UN Packaging", "UN包装"),
    text: t(
      "UN drums, IBC, ISO tank options, labels and packaging solutions.",
      "UN桶、IBC、ISO罐、标签及包装方案。",
    ),
    icon: "◇",
  },
  {
    title: t("Customs", "报关单证"),
    text: t(
      "Export documents, HS code check, DG declaration and customs clearance.",
      "出口单证、HS编码核对、危申报及报关。",
    ),
    icon: "▤",
  },
  {
    title: t("Port Coordination", "港口协调"),
    text: t(
      "Port cut-off control, delivery plan and shipment status updates.",
      "截港节点控制、送货计划及出运状态更新。",
    ),
    icon: "⚓",
  },
  {
    title: t("Ocean Freight", "海运订舱"),
    text: t(
      "DG space checking, carrier booking and global ocean freight plans.",
      "危品舱位确认、船司订舱及全球海运方案。",
    ),
    icon: "▣",
  },
];

const markets: Market[] = [
  {
    region: t("Middle East", "中东"),
    countries: t(
      "UAE, Saudi Arabia, Qatar, Oman, Kuwait",
      "阿联酋、沙特、卡塔尔、阿曼、科威特",
    ),
    ports: "Jebel Ali / Dammam / Jeddah",
    demand: t(
      "Solvents, alcohols, esters and bulk liquid chemicals.",
      "溶剂、醇类、酯类及大宗液体化工品。",
    ),
  },
  {
    region: t("South Asia", "南亚"),
    countries: t(
      "India, Pakistan, Bangladesh, Sri Lanka",
      "印度、巴基斯坦、孟加拉、斯里兰卡",
    ),
    ports: "Mundra / Nhava Sheva / Chennai",
    demand: t(
      "Coatings, inks, adhesive and resin production chemicals.",
      "涂料、油墨、胶黏剂及树脂生产化学品。",
    ),
  },
  {
    region: t("Southeast Asia", "东南亚"),
    countries: t(
      "Vietnam, Indonesia, Thailand, Malaysia",
      "越南、印尼、泰国、马来西亚",
    ),
    ports: "Ho Chi Minh / Hai Phong / Jakarta",
    demand: t(
      "Regional manufacturing solvents and packaging chemicals.",
      "区域制造业溶剂及包装相关化工品。",
    ),
  },
  {
    region: t("Africa", "非洲"),
    countries: t(
      "South Africa, Nigeria, Kenya, Ghana",
      "南非、尼日利亚、肯尼亚、加纳",
    ),
    ports: "Durban / Lagos / Mombasa",
    demand: t(
      "Industrial solvent supply and dangerous goods export support.",
      "工业溶剂供应及危险品出口支持。",
    ),
  },
  {
    region: t("Europe", "欧洲"),
    countries: t("Turkey, Netherlands, Spain", "土耳其、荷兰、西班牙"),
    ports: "Istanbul / Rotterdam / Valencia",
    demand: t(
      "Document-controlled chemical supply and container shipments.",
      "单证受控的化工品供应及集装箱运输。",
    ),
  },
  {
    region: t("South America", "南美"),
    countries: t("Brazil, Chile, Peru, Colombia", "巴西、智利、秘鲁、哥伦比亚"),
    ports: "Santos / San Antonio / Callao",
    demand: t(
      "Bulk chemical sourcing and long-distance freight coordination.",
      "大宗化工寻源及远洋运输协调。",
    ),
  },
];

const cases: CaseItem[] = [
  {
    product: t("Methanol Export To UAE", "甲醇出口阿联酋"),
    volume: "80 MT",
    packing: t("ISO Tank", "ISO罐"),
    port: "Jebel Ali",
    country: t("United Arab Emirates", "阿联酋"),
    route: t("China Port → Jebel Ali", "中国港口 → 杰贝阿里"),
    timeline: "18–24 Days",
    scope: t(
      "Supply + ISO Tank + DG Declaration + Ocean Freight",
      "供应 + ISO罐 + 危申报 + 海运",
    ),
    result: t(
      "Delivered with export-ready MSDS, COA and DG declaration support for a repeat industrial buyer.",
      "为复购工业客户完成MSDS、COA及危申报支持并顺利交付。",
    ),
  },
  {
    product: t("Toluene Export To India", "甲苯出口印度"),
    volume: "120 MT",
    packing: t("UN Drums", "UN桶装"),
    port: "Mundra",
    country: t("India", "印度"),
    route: t("China Port → Mundra", "中国港口 → 蒙德拉"),
    timeline: "14–20 Days",
    scope: t(
      "UN Packing + Customs + Port Coordination",
      "UN包装 + 报关 + 港口协调",
    ),
    result: t(
      "Coordinated Class 3 product packing, label checking and port cut-off control before vessel departure.",
      "完成3类危险品包装、标签核对及截港节点控制。",
    ),
  },
  {
    product: t("MEK Export To Saudi Arabia", "丁酮出口沙特"),
    volume: "64 MT",
    packing: t("UN Drums", "UN桶装"),
    port: "Dammam",
    country: t("Saudi Arabia", "沙特阿拉伯"),
    route: t("China Port → Dammam", "中国港口 → 达曼"),
    timeline: "20–28 Days",
    scope: t(
      "MSDS / COA / DG Labels / Shipment Execution",
      "MSDS / COA / 危品标签 / 出运执行",
    ),
    result: t(
      "Prepared product documents and dangerous goods shipment workflow for coating industry use.",
      "为涂料行业客户准备产品文件及危险品出运流程。",
    ),
  },
  {
    product: t("Ethyl Acetate Export To Vietnam", "乙酸乙酯出口越南"),
    volume: "48 MT",
    packing: t("IBC", "IBC"),
    port: "Ho Chi Minh",
    country: t("Vietnam", "越南"),
    route: t("China Port → Ho Chi Minh", "中国港口 → 胡志明"),
    timeline: "7–12 Days",
    scope: t(
      "Product Supply + IBC Packing + Customs",
      "产品供应 + IBC包装 + 报关",
    ),
    result: t(
      "Matched packing method for regional distributor warehouse handling and fast replenishment.",
      "匹配区域分销商仓储操作与快速补货需求。",
    ),
  },
  {
    product: t("Mixed Xylene Export To Turkey", "混合二甲苯出口土耳其"),
    volume: "96 MT",
    packing: t("Drums", "桶装"),
    port: "Istanbul",
    country: t("Turkey", "土耳其"),
    route: t("China Port → Istanbul", "中国港口 → 伊斯坦布尔"),
    timeline: "28–35 Days",
    scope: t(
      "Supplier Coordination + DG Booking + Export Docs",
      "供应商协调 + 危品订舱 + 出口单证",
    ),
    result: t(
      "Combined product sourcing, document checking and booking coordination for long-distance export.",
      "为远洋出口整合产品寻源、单证核对及订舱协调。",
    ),
  },
  {
    product: t("Acetone Export To Brazil", "丙酮出口巴西"),
    volume: "72 MT",
    packing: t("ISO Tank", "ISO罐"),
    port: "Santos",
    country: t("Brazil", "巴西"),
    route: t("China Port → Santos", "中国港口 → 桑托斯"),
    timeline: "35–45 Days",
    scope: t(
      "Bulk Liquid Supply + ISO Tank + Ocean Freight",
      "大宗液体供应 + ISO罐 + 海运",
    ),
    result: t(
      "Structured quotation and shipment plan for a bulk liquid chemical buyer in South America.",
      "为南美大宗液体化工买家制定结构化报价与出运方案。",
    ),
  },
];

const fallbackArticles = [
  {
    title: t(
      "How To Export Class 3 Chemicals From China",
      "如何从中国出口3类危险化学品",
    ),
    tag: t("DG Export Guide", "危品出口指南"),
    text: t(
      "A practical checklist for product confirmation, MSDS, UN packing, DG declaration and port execution.",
      "涵盖产品确认、MSDS、UN包装、危申报及港口执行的实用清单。",
    ),
  },
  {
    title: t(
      "ISO Tank vs Drum Packing For Liquid Chemicals",
      "液体化工品：ISO罐与桶装如何选择",
    ),
    tag: t("Packing", "包装"),
    text: t(
      "How buyers choose between drums, IBC and ISO tank based on quantity, port and handling conditions.",
      "根据数量、港口与操作条件选择桶装、IBC或ISO罐。",
    ),
  },
  {
    title: t(
      "Documents Needed For Dangerous Chemical Shipment",
      "危险化学品出运所需单证",
    ),
    tag: t("Documentation", "单证"),
    text: t(
      "MSDS, COA, DG declaration, packing list, commercial invoice and booking information.",
      "MSDS、COA、危申报、装箱单、商业发票及订舱信息。",
    ),
  },
];

const faqs: I18n[] = [
  t(
    "Can you provide MSDS and COA before shipment?",
    "出货前可以提供MSDS和COA吗？",
  ),
  t("Can you arrange dangerous goods declaration?", "可以安排危险品申报吗？"),
  t("Can you export Class 3 liquid chemicals?", "可以出口3类液体危险品吗？"),
  t(
    "Can you supply ISO tank and UN drum packing?",
    "可以提供ISO罐和UN桶包装吗？",
  ),
  t(
    "Can you support OEM labels and customer marks?",
    "可以支持客户标签和唛头吗？",
  ),
  t(
    "Can you quote CFR / CIF ocean freight together with product price?",
    "可以连同货价一起报CFR/CIF海运价吗？",
  ),
];

// Conservative reference grades used only when the CMS field is empty.
// A value entered in the product admin always takes precedence.
const referenceSpecifications: Record<string, string> = {
  "100-42-5": "≥ 99.8% (typical; final COA governs)", // Styrene
  "108-95-2": "≥ 99.9% (typical; final COA governs)", // Phenol
  "107-06-2": "≥ 99.9% (typical; final COA governs)", // EDC
  "67-56-1": "≥ 99.9% (typical; final COA governs)", // Methanol
  "108-88-3": "≥ 99.9% (typical; final COA governs)", // Toluene
  "67-64-1": "≥ 99.5% (typical; final COA governs)", // Acetone
  "106-89-8": "≥ 99.9% (typical; final COA governs)", // ECH
  "108-05-4": "≥ 99.9% (typical; final COA governs)", // VAM
  "110-63-4": "≥ 99.5% (typical; final COA governs)", // BDO
  "111-76-2": "≥ 99.0% (typical; final COA governs)", // BCS
  "78-83-1": "≥ 99.5% (typical; final COA governs)", // IBA
  "108-87-2": "≥ 99.5% (typical; final COA governs)", // MCH
  "121-44-8": "≥ 99.5% (typical; final COA governs)", // TEA
  "1330-20-7": "≥ 99.0% (typical; final COA governs)", // Xylene mixture
};

const fallbackProductImages: Record<string, string> = {
  "141-43-5": "/home-v4/products-photo.webp", // MEA
  "111-42-2": "/home-v4/hero-drums-photo.webp", // DEA
  "98-00-0": "/home-v4/products-photo.webp", // Furfuryl alcohol
  "584-84-9": "/home-v4/hero-drums-photo.webp", // TDI 20/80
};

function cmsProductToProduct(item: CmsProduct): Product {
  const name = item.name || "Unnamed Product";
  const category = item.category || "General Chemicals";
  const cas = item.cas || "-";
  return {
    name: t(name, translateProductNameZh(name)),
    cas,
    un: /^\d{4}$/.test(item.un_number?.trim() || "") ? item.un_number!.trim() : "",
    purity: item.specification?.trim() || referenceSpecifications[cas] || "To be confirmed by COA",
    imageUrl: item.image_url?.trim() || fallbackProductImages[cas] || undefined,
    seoTitle: item.seo_title || undefined,
    seoDescription: item.seo_description || undefined,
    packing: t("Drums / ISO Tank / IBC", "桶装 / ISO罐 / IBC"),
    category: t(category, translateProductCategoryZh(category)),
    application: t(
      item.description || "Please contact us for product specification, documents and export quotation.",
      item.description || "请联系我们确认产品规格、单证和出口报价。",
    ),
    icon: "⬡",
  };
}

function cmsArticleToArticle(item: CmsArticle): Article {
  const slug = item.slug || `article-${item.id}`;
  const zh = articleTranslations[slug]
    || (/dichloromethane|methylene-chloride/i.test(`${slug} ${item.title}`)
      ? articleTranslations["how-to-export-dichloromethane-from-china"]
      : undefined);
  return {
    title: storedI18n(item.title, "Untitled Article", zh?.title || item.title || "未命名文章"),
    tag: t("Chemical Export Insight", "化工出口知识"),
    text: storedI18n(item.seo_description || item.content, "Read this export guide and contact our team for shipment support.", zh?.seoDescription || "阅读出口指南，并联系我们获取出运支持。"),
    slug,
    content: storedI18n(item.content || item.seo_description, "Please contact our team for more details.", zh?.content || "该文章的中文版本正在整理中，请联系我们获取更多详情。"),
    seoTitle: storedI18n(item.seo_title || item.title, "Chemical Export Article", zh?.seoTitle || zh?.title || "化工出口文章"),
    seoDescription: storedI18n(item.seo_description || item.content, "Chemical export guide from ChinaChemExport.", zh?.seoDescription || "ChinaChemExport 化工品出口指南。"),
    coverImage: item.cover_image || undefined,
  };
}
function fallbackArticleToArticle(item: {
  title: I18n;
  tag: I18n;
  text: I18n;
}): Article {
  const titleEn = tx(item.title, "en");
  const slug = titleEn
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return {
    title: item.title,
    tag: item.tag,
    text: item.text,
    slug,
    content: item.text,
    seoTitle: item.title,
    seoDescription: item.text,
  };
}

function getArticleSlug(pathname: string) {
  const match = pathname.match(/^\/insights\/([^/]+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}
function getProductSlug(pathname: string) {
  const match = pathname.match(/^\/products\/([^/]+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}
function productSlug(product: Product) {
  return product.name.en.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function pathToPage(pathname: string): Page {
  if (getArticleSlug(pathname)) return "insights";
  if (getProductSlug(pathname)) return "products";
  const key = pathname.replace("/", "") as Page;
  return [
    "products",
    "about",
    "services",
    "markets",
    "cases",
    "insights",
    "contact",
    "privacy",
    "terms",
    "cookies",
    "dangerous-goods",
  ].includes(key)
    ? key
    : "home";
}
function pageToPath(page: Page) {
  return page === "home" ? "/" : `/${page}`;
}

export default function App() {
if (window.location.pathname.startsWith("/admin")) {
  return <AdminApp />;
}
  const [page, setPage] = useState<Page>(() =>
    pathToPage(window.location.pathname),
  );
  const [lang, setLang] = useState<Lang>(
    () => (localStorage.getItem("chinadg-lang") as Lang) || "en",
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentArticleSlug, setCurrentArticleSlug] = useState<string | null>(() =>
    getArticleSlug(window.location.pathname),
  );
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
const [articles, setArticles] = useState<Article[]>(
  fallbackArticles.map(fallbackArticleToArticle),
);

useEffect(() => {
  async function loadCmsData() {
    const { data: productData } = await supabase
      .from("products")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (productData && productData.length > 0) {
      setProducts(productData.map((item) => cmsProductToProduct(item as CmsProduct)));
    }

    const { data: articleData } = await supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (articleData && articleData.length > 0) {
      setArticles(articleData.map((item) => cmsArticleToArticle(item as CmsArticle)));
    }
  }

  loadCmsData();
}, []);
  useEffect(() => {
    const onPop = () => {
      setPage(pathToPage(window.location.pathname));
      setCurrentArticleSlug(getArticleSlug(window.location.pathname));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title =
      page === "home"
        ? tx(
            t(
              "China Chemical Supplier & Bulk Chemical Exporter | ChinaChemExport",
              "中国化工品供应商与大宗化工品出口商 | ChinaChemExport",
            ),
            lang,
          )
        : `${tx(nav.find((n) => n.page === page)?.label || t(page, page), lang)} | ChinaChemExport`;
    const descriptions: Partial<Record<Page, I18n>> = {
      products: t(
        "Browse bulk chemicals, solvents and intermediates supplied from China with compliant packaging, export documentation and dangerous-goods logistics support.",
        "浏览中国供应的大宗化工品、溶剂及中间体，并获取合规包装、出口单证与危险品物流支持。",
      ),
      about: t(
        "ChinaChemExport supplies bulk chemicals from Dongying, China, backed by petrochemical industry resources and integrated dangerous-goods export support.",
        "ChinaChemExport立足中国东营供应大宗化工品，并依托炼化产业资源与危险品出口一站式配套支持全球采购商。",
      ),
      services: t(
        "Export support for chemical orders from China, including quality control, documentation, packaging, customs and dangerous-goods logistics.",
        "为中国化工品订单提供质量控制、单证、包装、报关及危险品物流配套支持。",
      ),
    };
    const meta = document.querySelector('meta[name="description"]');
    if (meta && descriptions[page]) meta.setAttribute("content", tx(descriptions[page]!, lang));
    const canonicalUrl = `https://chinachemexport.com${window.location.pathname || "/"}`;
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", canonicalUrl);
    const openGraphUrl = document.querySelector('meta[property="og:url"]');
    if (openGraphUrl) openGraphUrl.setAttribute("content", canonicalUrl);
    trackPageView();
  }, [page, lang, products, articles, currentArticleSlug]);
  useEffect(() => {
    localStorage.setItem("chinadg-lang", lang);
    setMobileMenuOpen(false);
  }, [lang]);
  function go(next: Page) {
    window.history.pushState({}, "", pageToPath(next));
    setPage(next);
    setCurrentArticleSlug(null);
    setMobileMenuOpen(false);
  }

  function openArticle(slug: string) {
    window.history.pushState({}, "", `/insights/${slug}`);
    setPage("insights");
    setCurrentArticleSlug(slug);
    setMobileMenuOpen(false);
  }
  const content = useMemo(() => {
    if (page === "products") return <ProductsPage go={go} lang={lang} products={products} />;
    if (page === "about") return <AboutPage go={go} lang={lang} />;
    if (page === "services") return <ServicesPage go={go} lang={lang} />;
    if (page === "markets") return <MarketsPage go={go} lang={lang} />;
    if (page === "cases") return <CasesPage go={go} lang={lang} />;
    if (page === "insights") return (
  <InsightsPage
    go={go}
    lang={lang}
    articles={articles}
    currentArticleSlug={currentArticleSlug}
  />
);
    if (page === "contact") return <ContactPage lang={lang} />;
    if (["privacy", "terms", "cookies", "dangerous-goods"].includes(page)) {
      return <LegalPage page={page as LegalPageKey} lang={lang} />;
    }
    return (
      <HomePage
        go={go}
        lang={lang}
        products={products}
        articles={articles}
        onOpenArticle={openArticle}
      />
    );
 }, [page, lang, products, articles, currentArticleSlug]);
  return (
    <>
      <header className="header">
        <button className="brand" onClick={() => go("home")}>
          <span className="brand-mark">CE</span>
          <span>
            <b>ChinaChemExport</b>
            <small>
              {tx(
                t("Chemical Supplier & Exporter", "化工品供应商与出口商"),
                lang,
              )}
            </small>
          </span>
        </button>
        <nav className="main-nav">
          {nav.map((item) => (
            <button
              key={item.page}
              className={page === item.page ? "active" : ""}
              onClick={() => go(item.page)}
            >
              {tx(item.label, lang)}
            </button>
          ))}
        </nav>
        <div className="header-right">
          <button
            className="lang-switch"
            aria-label="language switch"
            onClick={() => setLang(lang === "en" ? "zh" : "en")}
          >
            <span>◉</span>
            {lang === "en" ? "EN | 中文" : "中文 | EN"}
          </button>
          <button className="header-cta" onClick={() => go("contact")}>
            {tx(t("Get Quote", "获取报价"), lang)}
          </button>
          <button
            className={`mobile-menu-toggle ${mobileMenuOpen ? "open" : ""}`}
            type="button"
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
        <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
          <div className="mobile-menu-panel">
            <div className="mobile-menu-head">
              <b>ChinaChemExport</b>
              <button type="button" onClick={() => setMobileMenuOpen(false)}>
                ×
              </button>
            </div>
            <div className="mobile-menu-links">
              {nav.map((item) => (
                <button
                  key={item.page}
                  className={page === item.page ? "active" : ""}
                  onClick={() => go(item.page)}
                >
                  {tx(item.label, lang)}
                </button>
              ))}
            </div>
            <div className="mobile-menu-actions">
              <button
                type="button"
                className="mobile-lang-switch"
                onClick={() => setLang(lang === "en" ? "zh" : "en")}
              >
                {lang === "en" ? "EN | 中文" : "中文 | EN"}
              </button>
              <button className="blue-btn" onClick={() => go("contact")}>
                {tx(t("Get Quote", "获取报价"), lang)}
              </button>
            </div>
          </div>
        </div>
      </header>
      {content}
      <Footer go={go} lang={lang} />
    </>
  );
}

function ProductsPage({ go, lang, products }: { go: (page: Page) => void; lang: Lang; products: Product[] }) {
  const [category, setCategory] = useState("All Products");
  const [query, setQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  useEffect(() => {
    const slug = getProductSlug(window.location.pathname);
    if (slug) setSelectedProduct(products.find((product) => productSlug(product) === slug) || null);
  }, [products]);
  useEffect(() => {
    if (!selectedProduct) return;
    const slug = productSlug(selectedProduct);
    const url = `https://chinachemexport.com/products/${slug}`;
    const name = tx(selectedProduct.name, lang);
    const title = lang === "en"
      ? selectedProduct.seoTitle || `${name} Supplier from China | ChinaChemExport`
      : `${name}供应商与出口报价 | ChinaChemExport`;
    const description = lang === "en"
      ? selectedProduct.seoDescription || tx(selectedProduct.application, "en")
      : `${name}（CAS ${selectedProduct.cas}）中国供应与出口服务，提供产品规格、合规包装、单证及危险品物流支持。`;
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", url);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", url);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    let script = document.querySelector<HTMLScriptElement>("#product-structured-data");
    if (!script) {
      script = document.createElement("script");
      script.id = "product-structured-data";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name,
      description,
      image: selectedProduct.imageUrl ? [selectedProduct.imageUrl] : undefined,
      sku: selectedProduct.cas,
      url,
      brand: { "@type": "Brand", name: "ChinaChemExport" },
      additionalProperty: [
        { "@type": "PropertyValue", name: "CAS Number", value: selectedProduct.cas },
        selectedProduct.un ? { "@type": "PropertyValue", name: "UN Number", value: selectedProduct.un } : null,
        { "@type": "PropertyValue", name: "Purity", value: selectedProduct.purity },
        { "@type": "PropertyValue", name: "Packing", value: tx(selectedProduct.packing, lang) },
      ].filter(Boolean),
    });
    return () => { document.querySelector("#product-structured-data")?.remove(); };
  }, [selectedProduct, lang]);
  const categories = [
    "All Products",
    ...Array.from(new Set(products.map((p) => tx(p.category, "en")))),
  ];
  const filtered = products.filter(
    (p) =>
      (category === "All Products" || tx(p.category, "en") === category) &&
      (!query.trim() ||
        [
          tx(p.name, "en"),
          tx(p.name, "zh"),
          p.cas,
          p.un,
          tx(p.category, "en"),
          tx(p.category, "zh"),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query.trim().toLowerCase())),
  );
  function requestQuote(product?: Product) {
    setSelectedProduct(null);
    go("contact");
    setTimeout(() => {
      const firstInput = document.querySelector<HTMLInputElement>(
        ".contact-card input",
      );
      if (firstInput && product)
        firstInput.value = `${tx(product.name, lang)} / CAS ${product.cas}${product.un ? ` / UN ${product.un}` : ""}`;
    }, 120);
  }
  function openProduct(product: Product) {
    window.history.pushState({}, "", `/products/${productSlug(product)}`);
    setSelectedProduct(product);
  }
  return (
    <main className="page">
      <PageHero
        kicker={tx(t("Products", "产品中心"), lang)}
        title={tx(t("Products", "产品中心"), lang)}
        text={tx(
          t(
            "We supply a wide range of petrochemical solvents and intermediates with stable quality and compliant export packaging.",
            "供应多种石化溶剂和中间体，质量稳定，并提供合规出口包装。",
          ),
          lang,
        )}
      />
      <section className="section catalog-section">
        <div className="container catalog-layout">
          <aside className="catalog-sidebar">
            <div className="filter-box">
              <h3>{tx(t("Product Categories", "产品分类"), lang)}</h3>
              {categories.map((c) => (
                <button
                  key={c}
                  className={category === c ? "active" : ""}
                  onClick={() => setCategory(c)}
                >
                  <span>
                    {c === "All Products"
                      ? tx(t("All Products", "全部产品"), lang)
                      : tx(
                          products.find((p) => tx(p.category, "en") === c)
                            ?.category || t(c, c),
                          lang,
                        )}
                  </span>
                  <b>
                    {c === "All Products"
                      ? products.length
                      : products.filter((p) => tx(p.category, "en") === c)
                          .length}
                  </b>
                </button>
              ))}
            </div>
            <div className="filter-box packaging-box">
              <h3>{tx(t("Packaging Options", "包装方式"), lang)}</h3>
              {[
                tx(t("Drums (200L)", "200L桶装"), lang),
                "ISO Tank",
                "IBC Tank",
                "Flexitank",
              ].map((x) => (
                <label key={x}>
                  <input type="checkbox" /> {x}
                </label>
              ))}
            </div>
          </aside>
          <div className="catalog-main">
            <div className="catalog-toolbar">
              <label className="search-box">
                <span>⌕</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={tx(
                    t(
                      "Search products, e.g. Toluene, Methanol...",
                      "搜索产品，如甲苯、甲醇...",
                    ),
                    lang,
                  )}
                />
              </label>
              <select defaultValue="default">
                <option value="default">
                  {tx(t("Sort by: Default", "排序：默认"), lang)}
                </option>
                <option>{tx(t("Name A-Z", "名称A-Z"), lang)}</option>
                <option>UN Number</option>
              </select>
            </div>
            <div className="catalog-grid">
              {filtered.map((p) => (
                <CatalogCard
                  key={p.cas}
                  product={p}
                  lang={lang}
                  onView={() => openProduct(p)}
                />
              ))}
            </div>
            <div className="pagination">
              <button className="active">1</button>
              <button>2</button>
              <button>›</button>
            </div>
          </div>
        </div>
      </section>
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          lang={lang}
          onClose={() => {
            setSelectedProduct(null);
            if (getProductSlug(window.location.pathname)) {
              window.history.pushState({}, "", "/products");
              const title = `${tx(t("Products", "产品中心"), lang)} | ChinaChemExport`;
              const description = tx(t(
                "Browse bulk chemicals, solvents and intermediates supplied from China with compliant packaging, export documentation and dangerous-goods logistics support.",
                "浏览中国供应的大宗化工品、溶剂及中间体，并获取合规包装、出口单证与危险品物流支持。",
              ), lang);
              document.title = title;
              document.querySelector('meta[name="description"]')?.setAttribute("content", description);
              document.querySelector('link[rel="canonical"]')?.setAttribute("href", "https://chinachemexport.com/products");
              document.querySelector('meta[property="og:url"]')?.setAttribute("content", "https://chinachemexport.com/products");
              document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
              document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
            }
          }}
          onQuote={() => requestQuote(selectedProduct)}
        />
      )}
    </main>
  );
}

function AboutPage({ go, lang }: { go: (page: Page) => void; lang: Lang }) {
  const capabilities = [
    t("Bulk chemical supply and product matching", "大宗化工品供应与产品匹配"),
    t("Compliant storage and cargo consolidation", "合规仓储与货物集散"),
    t("Export documents and customs support", "出口单证与报关支持"),
    t("Packaging, labeling and dangerous-goods logistics", "包装、标签与危险品物流"),
  ];
  const advantages = [
    [t("Dongying Petrochemical Belt", "东营炼化产业带"), t("Built around Shengli Oilfield and one of China's leading petrochemical clusters, Dongying offers dense refining capacity, established chemical supply chains and access to major industry enterprises.", "依托胜利油田及中国领先的石化产业集群，东营具备密集的炼化产能、成熟的化工供应链与大型产业企业资源。")],
    [t("Inland Port & Warehousing", "内陆港与仓储集散"), t("Cargo can be stored, consolidated, prepared and coordinated before port departure.", "货物可在出港前完成仓储、集散、备货及运输协调。")],
    [t("One-stop Export Execution", "一站式出口执行"), t("We coordinate documentation, packaging, declaration and international logistics under one workflow.", "统一协调单证、包装、申报及国际物流，减少多方衔接成本。")],
  ] as const;
  return (
    <main className="page about-page">
      <PageHero
        kicker={tx(t("About ChinaChemExport", "关于 ChinaChemExport"), lang)}
        title={tx(t("Chemical supply from Dongying, built for global trade.", "立足中国东营，面向全球贸易的化工品供应。"), lang)}
        text={tx(t("ChinaChemExport supplies and exports bulk chemicals to international importers, distributors and industrial buyers, backed by integrated dangerous-goods export support.", "ChinaChemExport面向国际进口商、分销商和工业采购商供应并出口大宗化工品，并提供危险品出口一站式配套支持。"), lang)}
      />

      <section className="section about-intro">
        <div className="container about-intro-grid">
          <div>
            <p className="eyebrow">{tx(t("Who We Are", "我们是谁"), lang)}</p>
            <h2>{tx(t("A chemical supplier first, backed by integrated export execution.", "以化工品供应为核心，以出口执行能力为支撑。"), lang)}</h2>
          </div>
          <div className="about-copy">
            <p>{tx(t("ChinaChemExport supplies solvents, organic acids, alcohols, glycols and chemical intermediates to overseas importers, distributors and industrial users.", "ChinaChemExport向海外进口商、分销商及工业用户供应溶剂、有机酸、醇类、二元醇及化工中间体。"), lang)}</p>
            <p>{tx(t("Based in Dongying, Shandong, we benefit from a strong chemical industry cluster and an inland-port service network that supports storage, cargo consolidation and export formalities.", "平台位于山东东营，依托当地化工产业集群及内陆港服务网络，能够提供仓储、货物集散及出口手续协同支持。"), lang)}</p>
          </div>
        </div>
      </section>

      <section className="section muted">
        <div className="container">
          <SectionTop kicker={tx(t("Our Advantage", "我们的优势"), lang)} title={tx(t("Local industry resources connected to global delivery.", "连接本地产业资源与全球交付。"), lang)} />
          <div className="about-advantage-grid">
            {advantages.map(([title, text], index) => (
              <article key={title.en}>
                <b>0{index + 1}</b>
                <h3>{tx(title, lang)}</h3>
                <p>{tx(text, lang)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-capabilities">
        <div className="container about-capability-grid">
          <div>
            <p className="eyebrow">{tx(t("Integrated Support", "综合服务能力"), lang)}</p>
            <h2>{tx(t("Export support built around every chemical order.", "围绕每笔化工品订单提供出口配套支持。"), lang)}</h2>
            <p>{tx(t("Each shipment is reviewed according to product characteristics, destination requirements and the appropriate packing and transport method.", "每票货物均结合产品特性、目的地要求以及适用的包装与运输方式进行核对。"), lang)}</p>
            <button className="blue-btn" onClick={() => go("services")}>{tx(t("View Services & Export Process", "查看服务与出口流程"), lang)}</button>
          </div>
          <div className="about-checklist">
            {capabilities.map((item) => <div key={item.en}><span>✓</span>{tx(item, lang)}</div>)}
          </div>
        </div>
      </section>

      <section className="section about-commitment">
        <div className="container">
          <p className="eyebrow green">{tx(t("Our Commitment", "我们的承诺"), lang)}</p>
          <h2>{tx(t("Compliance, transparency and long-term cooperation.", "合规、透明与长期合作。"), lang)}</h2>
          <p>{tx(t("We aim to provide clear product information, traceable documentation and responsive communication throughout the export process. Final specifications, regulatory requirements and transport plans are confirmed for each order.", "我们致力于在出口过程中提供清晰的产品信息、可追溯的单证和及时沟通。最终规格、监管要求及运输方案均按具体订单确认。"), lang)}</p>
        </div>
      </section>
      <CTA go={go} lang={lang} />
    </main>
  );
}

function ServicesPage({ go, lang }: { go: (page: Page) => void; lang: Lang }) {
  const flow = [
    t("Inquiry", "询盘"),
    t("Product Match", "产品匹配"),
    t("Quote", "报价"),
    t("Order", "订单"),
    t("Documents", "单证"),
    t("DG Warehouse", "危化仓储"),
    t("Customs", "报关"),
    t("Ocean Freight", "海运"),
  ];
  return (
    <main className="page">
      <PageHero
        kicker={tx(t("Services", "服务"), lang)}
        title={tx(
          t(
            "Export support built around every chemical order.",
            "围绕每笔化工品订单提供出口配套支持。",
          ),
          lang,
        )}
        text={tx(
          t(
            "From product confirmation and quotation to compliant storage, packaging, customs and ocean freight, we help overseas buyers receive chemicals from China efficiently.",
            "从产品确认和报价，到合规仓储、包装、报关及海运，帮助海外采购商高效接收来自中国的化工品。",
          ),
          lang,
        )}
      />
      <section className="section muted">
        <div className="container service-grid large">
          {services.map((s) => (
            <ServiceCard key={tx(s.title, "en")} service={s} lang={lang} />
          ))}
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionTop
            kicker={tx(t("Execution Flow", "执行流程"), lang)}
            title={tx(
              t(
                "A clear process for every shipment.",
                "每一票货都有清晰流程。",
              ),
              lang,
            )}
          />
          <div className="flow">
            {flow.map((x, i) => (
              <div key={tx(x, "en")}>
                <b>{String(i + 1).padStart(2, "0")}</b>
                <span>{tx(x, lang)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTA go={go} lang={lang} />
    </main>
  );
}

function MarketsPage({ go, lang }: { go: (page: Page) => void; lang: Lang }) {
  const featuredCase = cases[0];
  return (
    <main className="page">
      <PageHero
        kicker={tx(t("Markets", "市场"), lang)}
        title={tx(
          t(
            "Export chemicals to major global markets.",
            "面向全球主要市场出口化工品。",
          ),
          lang,
        )}
        text={tx(
          t(
            "Product supply and destination-specific export support for international importers, distributors and industrial users.",
            "为国际进口商、分销商和工业用户提供化工品供应及目的地专项出口支持。",
          ),
          lang,
        )}
      />
      <section className="section">
        <div className="container">
          <SectionTop
            kicker={tx(t("Destination Markets", "目的地市场"), lang)}
            title={tx(
              t(
                "Route planning by region, port and product demand.",
                "按区域、港口和产品需求规划路线。",
              ),
              lang,
            )}
          />
          <div className="market-grid">
            {markets.map((m) => (
              <div className="market-card" key={tx(m.region, "en")}>
                <p>{tx(m.region, lang)}</p>
                <h3>{tx(m.countries, lang)}</h3>
                <Info
                  label={tx(t("Common Ports", "常见港口"), lang)}
                  value={m.ports}
                />
                <Info
                  label={tx(t("Demand", "需求"), lang)}
                  value={tx(m.demand, lang)}
                />
                <button onClick={() => go("contact")}>
                  {tx(t("Ask Route Quote →", "咨询路线报价 →"), lang)}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section muted case-center-section">
        <div className="container">
          <SectionTop
            kicker={tx(t("Case Study Center", "案例中心"), lang)}
            title={tx(
              t(
                "Export execution cases for chemical buyers.",
                "面向化工买家的出口执行案例。",
              ),
              lang,
            )}
            action={tx(t("Request Similar Case", "咨询类似案例"), lang)}
            onClick={() => go("contact")}
          />
          <CaseFeature c={featuredCase} lang={lang} />
          <div className="case-study-grid">
            {cases.slice(1).map((c) => (
              <CaseCard key={tx(c.product, "en")} c={c} lang={lang} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function CasesPage({ go, lang }: { go: (page: Page) => void; lang: Lang }) {
  const [selectedCase, setSelectedCase] = useState(cases[0]);
  return (
    <main className="page cases-page">
      <PageHero
        kicker={tx(t("Case Studies", "出口案例"), lang)}
        title={tx(t("Case Study Center", "案例中心"), lang)}
        text={tx(
          t(
            "Realistic export execution examples for petrochemical buyers, covering product supply, packing, DG documents, port coordination and ocean freight.",
            "面向石化买家的真实出口执行案例，覆盖产品供应、包装、危品单证、港口协调与海运。",
          ),
          lang,
        )}
      />
      <section className="section muted case-center-section standalone-cases">
        <div className="container">
          <SectionTop
            kicker={tx(t("Export Cases", "出口案例"), lang)}
            title={tx(
              t(
                "Chemical shipment execution references by product, packing and destination.",
                "按产品、包装与目的地展示化工品出运执行参考。",
              ),
              lang,
            )}
            action={tx(t("Request Similar Case", "咨询类似案例"), lang)}
            onClick={() => go("contact")}
          />
          <div className="case-tabs">
            {cases.map((c) => (
              <button
                key={tx(c.product, "en")}
                className={
                  tx(selectedCase.product, "en") === tx(c.product, "en")
                    ? "active"
                    : ""
                }
                onClick={() => setSelectedCase(c)}
              >
                <span>{tx(c.country, lang)}</span>
                <b>{tx(c.product, lang)}</b>
              </button>
            ))}
          </div>
          <CaseFeature c={selectedCase} lang={lang} selected />
          <div className="case-study-grid">
            {cases.map((c) => (
              <CaseCard key={tx(c.product, "en")} c={c} lang={lang} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function renderArticleContent(content: string) {
  return content.split("\n").map((rawLine, index) => {
    const line = rawLine.trim();
    if (!line) return null;
    const image = line.match(/^!\[([^\]]*)\]\((https?:\/\/[^)]+)\)$/);
    if (image) return <figure className="article-body-image" key={index}><img src={image[2]} alt={image[1] || "Article illustration"} loading="lazy" /><figcaption>{image[1]}</figcaption></figure>;
    if (line.startsWith("### ")) return <h3 key={index}>{line.slice(4)}</h3>;
    if (line.startsWith("## ")) return <h2 key={index}>{line.slice(3)}</h2>;
    if (line.startsWith("# ")) return <h2 key={index}>{line.slice(2)}</h2>;
    if (/^[-*] /.test(line)) return <ul className="article-single-list" key={index}><li>{line.slice(2)}</li></ul>;
    if (/^\d+\. /.test(line)) return <ol className="article-single-list" key={index}><li>{line.replace(/^\d+\. /, "")}</li></ol>;
    if (line.startsWith("> ")) return <blockquote key={index}>{line.slice(2)}</blockquote>;
    return <p key={index}>{line}</p>;
  });
}

function articleFallbackImage(article: Article) {
  const slug = article.slug.toLowerCase();
  if (slug.includes("tank") || slug.includes("packing")) return "/home-v4/products-photo.webp";
  if (slug.includes("document")) return "/home-v4/hero-drums-photo.webp";
  return "/home-v4/cta-ship-photo.webp";
}

function InsightsPage({
  go,
  lang,
  articles,
  currentArticleSlug,
}: {
  go: (page: Page) => void;
  lang: Lang;
  articles: Article[];
  currentArticleSlug: string | null;
}) {
  const currentArticle = currentArticleSlug
    ? articles.find((article) => article.slug === currentArticleSlug)
    : null;

  if (currentArticleSlug && currentArticle) {
    return (
      <main className="page">
        <PageHero
          kicker={tx(currentArticle.tag, lang)}
          title={tx(currentArticle.title, lang)}
          text={tx(currentArticle.seoDescription, lang)}
        />

        <section className="section">
          <div className="container article-detail">
            <a className="text-link article-back-link" href="/insights" onClick={(event) => { event.preventDefault(); go("insights"); }}>
              ← {tx(t("Back to Insights", "返回知识中心"), lang)}
            </a>

            <article>
              <img className="article-cover" src={currentArticle.coverImage || articleFallbackImage(currentArticle)} alt={tx(currentArticle.title, lang)} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = articleFallbackImage(currentArticle); }} />
              <div className="article-body">{renderArticleContent(tx(currentArticle.content, lang))}</div>
            </article>

            <div className="article-cta">
              <h3>{tx(t("Need DG export support from China?", "需要中国危化品出口支持？"), lang)}</h3>
              <p>
                {tx(
                  t(
                    "Send us your product name, CAS number, destination port and quantity. Our team will help check documents, packing and shipment options.",
                    "请发送产品名称、CAS号、目的港和数量，我们将协助确认单证、包装和出运方案。",
                  ),
                  lang,
                )}
              </p>
              <button onClick={() => go("contact")}>
                {tx(t("Contact Our Team", "联系团队"), lang)}
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <PageHero
        kicker={tx(t("Insights", "知识中心"), lang)}
        title={tx(
          t("Chemical export knowledge center.", "化工品出口知识中心。"),
          lang,
        )}
        text={tx(
          t(
            "Practical information for buyers who need product supply, DG documents, packing and shipment execution from China.",
            "为需要中国化工品供应、危品单证、包装和出运执行的买家提供实用信息。",
          ),
          lang,
        )}
      />
      <section className="section">
        <div className="container">
          <div className="article-grid">
            {articles.map((a) => (
              <article key={a.slug}>
                <img className="article-card-image" src={a.coverImage || articleFallbackImage(a)} alt={tx(a.title, lang)} loading="lazy" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = articleFallbackImage(a); }} />
                <span>{tx(a.tag, lang)}</span>
                <h3>{tx(a.title, lang)}</h3>
                <p>{tx(a.text, lang)}</p>
                <button
                  onClick={() => {
                    window.history.pushState({}, "", `/insights/${a.slug}`);
                    window.dispatchEvent(new PopStateEvent("popstate"));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  {tx(t("Read More →", "阅读全文 →"), lang)}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section muted">
        <div className="container faq">
          <div className="section-heading">
  <p className="kicker">FAQ</p>
  <h2>
    {tx(
      t("Questions buyers ask before shipment.", "买家出运前常问的问题。"),
      lang,
    )}
  </h2>
</div>
          {faqs.map((q) => (
            <details key={tx(q, "en")}>
              <summary>{tx(q, lang)}</summary>
              <p>
                {tx(
                  t(
                    "Yes. Our team will check the product class, packing method, destination port requirement and documents before quotation.",
                    "可以。我们会在报价和出运安排前核对产品类别、包装方式、目的港和所需单证。",
                  ),
                  lang,
                )}
              </p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}

function LegalPage({ page, lang }: { page: LegalPageKey; lang: Lang }) {
  const document = legalDocuments[page][lang];
  return (
    <main className="legal-page">
      <section className="legal-hero">
        <div className="container">
          <span>{lang === "zh" ? "法律与合规" : "Legal & Compliance"}</span>
          <h1>{document.title}</h1>
          <p>{document.intro}</p>
        </div>
      </section>
      <section className="container legal-content">
        {document.sections.map((section) => (
          <article key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph, index) => (
              <p key={`${section.heading}-${index}`}>{paragraph}</p>
            ))}
          </article>
        ))}
      </section>
    </main>
  );
}

function ContactPage({ lang }: { lang: Lang }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    contact: "",
    product: "",
    quantity: "",
    destination: "",
    packing: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (!formData.product) {
      setSubmitError(true);
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(false);

    fetch("/api/inquiry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Submit failed");
        }
        return res.json();
      })
      .then(() => {
        setSubmitSuccess(true);
        trackInquirySubmission(formData.product);

        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);

        setFormData({
          name: "",
          email: "",
          company: "",
          contact: "",
          product: "",
          quantity: "",
          destination: "",
          packing: "",
          message: "",
        });
      })
      .catch((err) => {
        console.error(err);
        setSubmitError(true);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

return (
  <>

    <main className="page">
        <PageHero
          kicker={tx(t("Contact", "联系"), lang)}
          title={tx(
            t(
              "Request product, packing and freight quotation.",
              "获取产品、包装与运费报价。"
            ),
            lang
          )}
          text={tx(
            t(
              "Send product name, quantity, destination port and packing preference. We will prepare a structured export quotation.",
              "发送产品名称、数量、目的港和包装偏好，我们将准备结构化出口报价。"
            ),
            lang
          )}
        />

        <section className="section">
          <div className="container contact-layout">
            <div className="contact-card">
              <h2>{tx(t("Inquiry Information", "询盘信息"), lang)}</h2>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={tx(t("Your name", "您的姓名"), lang)}
              />

              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={tx(t("Email address", "邮箱地址"), lang)}
              />

              <input
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder={tx(t("Company name", "公司名称"), lang)}
              />

              <input
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder={tx(
                  t("WhatsApp / WeChat / Phone", "WhatsApp / 微信 / 电话"),
                  lang
                )}
              />

              <input
                name="product"
                value={formData.product}
                onChange={handleChange}
                placeholder={tx(
                  t("Product name / CAS / UN No.", "产品名称 / CAS / UN编号"),
                  lang
                )}
              />

              <input
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder={tx(
                  t("Quantity, e.g. 1 FCL / 80 MT", "数量，例如 1柜 / 80吨"),
                  lang
                )}
              />

              <input
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder={tx(
                  t("Destination port / country", "目的港 / 国家"),
                  lang
                )}
              />

              <select
                name="packing"
                value={formData.packing}
                onChange={handleChange}
              >
                <option value="">
                  {tx(t("Packing preference", "包装偏好"), lang)}
                </option>
                <option>ISO Tank</option>
                <option>UN Drums</option>
                <option>IBC</option>
                <option>{tx(t("Need recommendation", "需要推荐"), lang)}</option>
              </select>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={tx(
                  t(
                    "Additional requirements: purity, documents, label, Incoterms...",
                    "其他要求：纯度、单证、标签、贸易术语..."
                  ),
                  lang
                )}
              ></textarea>

              <button
                className="blue-btn"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? tx(t("Submitting...", "提交中..."), lang)
                  : tx(t("Submit Inquiry", "提交询盘"), lang)}
              </button>
            </div>

            <div className="contact-side">
              <p className="eyebrow">
                {tx(t("Fast Quote Checklist", "快速报价清单"), lang)}
              </p>

              <h2>{tx(t("What to prepare?", "需要准备什么？"), lang)}</h2>

              <ul>
                <li>
                  {tx(
                    t(
                      "Product name and target specification",
                      "产品名称和目标规格"
                    ),
                    lang
                  )}
                </li>

                <li>
                  {tx(t("Quantity and packing method", "数量和包装方式"), lang)}
                </li>

                <li>
                  {tx(
                    t("Destination port and Incoterms", "目的港和贸易术语"),
                    lang
                  )}
                </li>

                <li>
                  {tx(t("Required documents and labels", "所需单证和标签"), lang)}
                </li>

                <li>
                  {tx(
                    t(
                      "Delivery schedule and repeat order plan",
                      "交付计划和复购计划"
                    ),
                    lang
                  )}
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

{submitSuccess && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.28)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 99999,
    }}
  >
    <div
      style={{
        width: "420px",
        maxWidth: "90vw",
        background: "rgba(255,255,255,0.96)",
        border: "2px solid #0b5ed7",
        borderRadius: "16px",
        padding: "36px 32px",
        textAlign: "center",
        boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
      }}
    >
      <div
        style={{
          width: "68px",
          height: "68px",
          margin: "0 auto 18px",
          borderRadius: "50%",
          border: "3px solid #16a34a",
          color: "#16a34a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "36px",
          fontWeight: 700,
        }}
      >
        ✓
      </div>

      <h3 style={{ margin: 0, color: "#0b5ed7", fontSize: "26px" }}>
        {lang === "zh" ? "发送成功" : "Inquiry Sent"}
      </h3>

      <p style={{ marginTop: "12px", color: "#4b5563", fontSize: "15px" }}>
        {lang === "zh"
          ? "我们会在24小时内联系您。"
          : "We will contact you within 24 hours."}
      </p>
    </div>
  </div>
)}

{submitError && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.28)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 99999,
    }}
    onClick={() => setSubmitError(false)}
  >
    <div
      style={{
        width: "420px",
        maxWidth: "90vw",
        background: "rgba(255,255,255,0.96)",
        border: "2px solid #ef4444",
        borderRadius: "16px",
        padding: "36px 32px",
        textAlign: "center",
        boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          width: "68px",
          height: "68px",
          margin: "0 auto 18px",
          borderRadius: "50%",
          border: "3px solid #ef4444",
          color: "#ef4444",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "36px",
          fontWeight: 700,
        }}
      >
        !
      </div>

      <h3 style={{ margin: 0, color: "#ef4444", fontSize: "26px" }}>
        {lang === "zh" ? "提交失败" : "Submit Failed"}
      </h3>

      <p style={{ marginTop: "12px", color: "#4b5563", fontSize: "15px" }}>
        {lang === "zh"
          ? "请稍后重试，或直接通过邮箱联系我们。"
          : "Please try again later or contact us by email directly."}
      </p>

      <button
        className="blue-btn"
        style={{ marginTop: "18px" }}
        onClick={() => setSubmitError(false)}
      >
        OK
      </button>
    </div>
  </div>
)}
    </>
  );
}

function CaseFeature({
  c,
  lang,
  selected,
}: {
  c: CaseItem;
  lang: Lang;
  selected?: boolean;
}) {
  return (
    <div className="case-feature case-detail-feature">
      <div className="case-feature-main">
        <div>
          <p className="eyebrow green">
            {selected
              ? tx(t("Selected Case", "当前案例"), lang)
              : tx(t("Featured Case", "精选案例"), lang)}
          </p>
          <h2>{tx(c.product, lang)}</h2>
          <p>{tx(c.result, lang)}</p>
        </div>
        <div className="case-feature-stats">
          <div>
            <small>{tx(t("Volume", "数量"), lang)}</small>
            <b>{c.volume}</b>
          </div>
          <div>
            <small>{tx(t("Packing", "包装"), lang)}</small>
            <b>{tx(c.packing, lang)}</b>
          </div>
          <div>
            <small>{tx(t("Destination Port", "目的港"), lang)}</small>
            <b>{c.port}</b>
          </div>
        </div>
      </div>
      <div className="case-feature-side route-panel">
        <p className="eyebrow">{tx(t("Export Route", "出口路线"), lang)}</p>
        <div className="route-line">
          <span>{tx(t("China Port", "中国港口"), lang)}</span>
          <i />
          <span>{c.port}</span>
        </div>
        <Info
          label={tx(t("Country", "国家"), lang)}
          value={tx(c.country, lang)}
        />
        <Info label={tx(t("Route", "路线"), lang)} value={tx(c.route, lang)} />
        <Info label={tx(t("Timeline", "周期"), lang)} value={c.timeline} />
        <Info
          label={tx(t("Execution Scope", "执行范围"), lang)}
          value={tx(c.scope, lang)}
        />
      </div>
    </div>
  );
}
function CaseCard({ c, lang }: { c: CaseItem; lang: Lang }) {
  return (
    <article className="case-study-card">
      <div className="case-study-head">
        <span>{tx(c.country, lang)}</span>
        <b>{c.timeline}</b>
      </div>
      <h3>{tx(c.product, lang)}</h3>
      <div className="case-meta">
        <div>
          <small>{tx(t("Volume", "数量"), lang)}</small>
          <b>{c.volume}</b>
        </div>
        <div>
          <small>{tx(t("Packing", "包装"), lang)}</small>
          <b>{tx(c.packing, lang)}</b>
        </div>
        <div>
          <small>{tx(t("Port", "港口"), lang)}</small>
          <b>{c.port}</b>
        </div>
      </div>
      <p>{tx(c.result, lang)}</p>
      <strong>{tx(c.scope, lang)}</strong>
    </article>
  );
}
function SectionTop({
  kicker,
  title,
  action,
  onClick,
}: {
  kicker: string;
  title: string;
  action?: string;
  onClick?: () => void;
}) {
  return (
    <div className="section-top">
      <div>
        <p className="eyebrow">{kicker}</p>
        <h2>{title}</h2>
      </div>
      {action && (
        <button className="outline-btn" onClick={onClick}>
          {action}
        </button>
      )}
    </div>
  );
}
function PageHero({
  kicker,
  title,
  text,
}: {
  kicker: string;
  title: string;
  text: string;
}) {
  return (
    <section className="page-hero">
      <div className="page-hero-bg" />
      <div className="container">
        <p className="eyebrow green">{kicker}</p>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
    </section>
  );
}
function ServiceCard({ service, lang }: { service: Service; lang: Lang }) {
  return (
    <div className="service-card">
      <span>{service.icon}</span>
      <h3>{tx(service.title, lang)}</h3>
      <p>{tx(service.text, lang)}</p>
    </div>
  );
}
function CatalogCard({
  product,
  lang,
  onView,
}: {
  product: Product;
  lang: Lang;
  onView: () => void;
}) {
  return (
    <article className="catalog-card">
      {product.imageUrl ? (
        <img className="catalog-product-photo" src={product.imageUrl} alt={tx(product.name, lang)} loading="lazy" />
      ) : (
        <div className="catalog-icon">{product.icon}</div>
      )}
      <h3>{tx(product.name, lang)}</h3>
      <div className="chip-row">
        <span>CAS {product.cas}</span>
        {/^\d{4}$/.test(product.un.trim()) && <span>UN {product.un}</span>}
      </div>
      {!/to be confirmed/i.test(product.purity) && (
        <p>{tx(t("Purity:", "纯度："), lang)} ≥ {product.purity}</p>
      )}
      <p>
        {tx(t("Packing:", "包装："), lang)} {tx(product.packing, lang)}
      </p>
      <button onClick={onView}>
        {tx(t("View Details →", "查看详情 →"), lang)}
      </button>
    </article>
  );
}
function ProductDetailModal({
  product,
  lang,
  onClose,
  onQuote,
}: {
  product: Product;
  lang: Lang;
  onClose: () => void;
  onQuote: () => void;
}) {
  const sheet = productDataSheet(product, lang);
  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`${tx(product.name, lang)} product details`}
    >
      <div className="product-modal">
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close product details"
        >
          ×
        </button>
        <div className="modal-head">
          {product.imageUrl ? <img className="product-modal-photo" src={product.imageUrl} alt={tx(product.name, lang)} /> : <div className="catalog-icon">{product.icon}</div>}
          <div>
            <p className="eyebrow">
              {tx(t("Product Detail", "产品详情"), lang)}
            </p>
            <h2>{tx(product.name, lang)}</h2>
            <div className="chip-row">
              <span>CAS {product.cas}</span>
              {/^\d{4}$/.test(product.un.trim()) && <span>UN {product.un}</span>}
              <span>{tx(product.category, lang)}</span>
            </div>
          </div>
        </div>
        <div className="modal-grid">
          <div className="detail-panel">
            <h3>{tx(t("Product Information", "产品信息"), lang)}</h3>
            {sheet.map((item) => (
              <Info key={item.label} label={item.label} value={item.value} />
            ))}
          </div>
          <div className="detail-panel dark-panel">
            <h3>{tx(t("Export Support", "出口支持"), lang)}</h3>
            <p>{tx(product.application, lang)}</p>
            <div className="document-list">
              {[
                "MSDS",
                "COA",
                "TDS",
                tx(t("DG Declaration Support", "危申报支持"), lang),
              ].map((doc) => (
                <div key={doc}>
                  <b>{doc}</b>
                  <span>
                    {tx(t("Available Upon Request", "可按需提供"), lang)}
                  </span>
                </div>
              ))}
            </div>
            <button className="blue-btn" onClick={onQuote}>
              {tx(t("Request Quote For This Product", "获取该产品报价"), lang)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
function productDataSheet(product: Product, lang: Lang) {
  const hsByCategory: Record<string, string> = {
    "Aromatic Solvents": "2902.30 / 2902.44",
    Alcohols: "2905.11 / 2905.12",
    Esters: "2915.31 / 2915.33",
    Ketones: "2914.11 / 2914.12",
    Feedstocks: "2902.20 / 2902.50",
    Amides: "2924.19",
  };
  const tankOnly =
    tx(product.packing, "en").includes("ISO Tank") &&
    !tx(product.packing, "en").includes("Drums");
  return [
    { label: tx(t("CAS Number", "CAS号"), lang), value: product.cas },
    { label: tx(t("UN Number", "UN编号"), lang), value: product.un },
    {
      label: tx(t("HS Code", "HS编码"), lang),
      value:
        hsByCategory[tx(product.category, "en")] ||
        tx(t("To be confirmed", "待确认"), lang),
    },
    {
      label: tx(t("Appearance", "外观"), lang),
      value: tx(t("Refer to product specification", "请参考产品规格"), lang),
    },
    { label: tx(t("Purity", "纯度"), lang), value: /to be confirmed/i.test(product.purity) ? tx(t("Available upon request", "可按需确认"), lang) : `≥ ${product.purity}` },
    { label: tx(t("Packing", "包装"), lang), value: tx(product.packing, lang) },
    {
      label: tx(t("Shelf Life", "保质期"), lang),
      value: tx(
        t("12 months under proper storage", "规范储存条件下12个月"),
        lang,
      ),
    },
    {
      label: tx(t("Loading Qty", "装载量"), lang),
      value: tankOnly
        ? "20–24 MT / ISO Tank"
        : tx(
            t(
              "16–22 MT / 20GP, subject to packing",
              "16–22吨 / 20GP，视包装而定",
            ),
            lang,
          ),
    },
  ];
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="info">
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}
function CTA({ go, lang }: { go: (page: Page) => void; lang: Lang }) {
  return (
    <section className="cta">
      <div className="container">
        <h2>
          {tx(
            t(
              "Need chemical supply with DG export execution?",
              "需要化工品供应与危品出口执行？",
            ),
            lang,
          )}
        </h2>
        <p>
          {tx(
            t(
              "Send product, quantity and destination port. We will check supply, packing, documents and freight plan.",
              "发送产品、数量和目的港，我们将核对供应、包装、单证和运费方案。",
            ),
            lang,
          )}
        </p>
        <button className="blue-btn" onClick={() => go("contact")}>
          {tx(t("Start Inquiry", "开始询价"), lang)}
        </button>
      </div>
    </section>
  );
}
function Footer({ go, lang }: { go: (page: Page) => void; lang: Lang }) {
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <b>ChinaChemExport</b>
          <p>
            {tx(
              t("Chemical Supplier & Exporter", "化工品供应商与出口商"),
              lang,
            )}
          </p>
        </div>
        <div>
          {nav.map((n) => (
            <button key={n.page} onClick={() => go(n.page)}>
              {tx(n.label, lang)}
            </button>
          ))}
        </div>
        <div className="footer-legal-links">
          <button onClick={() => go("privacy")}>{tx(t("Privacy", "隐私政策"), lang)}</button>
          <button onClick={() => go("terms")}>{tx(t("Terms", "使用条款"), lang)}</button>
          <button onClick={() => go("cookies")}>{tx(t("Cookies", "Cookie 政策"), lang)}</button>
          <button onClick={() => go("dangerous-goods")}>{tx(t("DG Disclaimer", "危险化学品声明"), lang)}</button>
          <button onClick={openAnalyticsSettings}>{tx(t("Cookie Settings", "Cookie 设置"), lang)}</button>
        </div>
        <small>© 2026 ChinaChemExport. All rights reserved.</small>
      </div>
    </footer>
  );
}
