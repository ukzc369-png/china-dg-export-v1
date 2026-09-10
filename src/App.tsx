import { useCallback, useEffect, useMemo, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import "./App.css";
import { openAnalyticsSettings, trackInquirySubmission, trackPageView } from "./analytics";
import { legalDocuments, type LegalPageKey } from "./legalContent";
import { articleTranslations } from "./articleTranslations";
import { translateProductCategoryZh, translateProductNameZh } from "./productTranslations";
import HomePage from "./HomePageApproved";
import {
  ChemicalSourcing as ApprovedChemicalSourcing,
  Contact as ApprovedContact,
  ExportSupport as ApprovedExportSupport,
  Insights as ApprovedInsights,
  Products as ApprovedProducts,
} from "./NewSiteApp";
import ProductDetailPage from "./ProductDetail";
import { productSlug, type I18n, type Lang, type ProductDetailContent, type ProductSource as Product } from "./productDetails";
import { getProductSlug, productPath } from "./productRouting";
import { formatInquiryProduct } from "./inquiryPrefill";
type Page =
  | "home"
  | "chemical-sourcing"
  | "export-support"
  | "shandong-supply-base"
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
type CmsProduct = {
  id: number;
  name: string;
  cas: string | null;
  un_number: string | null;
  category: string | null;
  description: string | null;
  image_url: string | null;
  specification: string | null;
  packing?: string | null;
  seo_title: string | null;
  seo_description: string | null;
  slug?: string | null;
  detail_content?: ProductDetailContent | null;
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

const chloroformVietnamArticle: Article = {
  slug: "chloroform-supplier-china-vietnam-import-guide",
  title: t("Chloroform Supplier China to Vietnam: 2026 Import & Shipping Guide", "中国氯仿供应至越南：2026 进口与运输指南"),
  tag: t("Vietnam Supply Guide", "越南供应指南"),
  text: t("A buyer-focused guide to chloroform specifications, China export controls, Vietnam import checks, SDS, COA, UN 1888 packing and shipment review.", "面向越南工业买家的氯仿规格、中国出口管制、越南进口核查、SDS、COA、UN 1888 包装及出运指南。"),
  seoTitle: t("Chloroform Supplier China to Vietnam | 2026 Guide", "中国氯仿供应至越南 | 2026 进口与运输指南"),
  seoDescription: t("Source chloroform (CAS 67-66-3) from China to Vietnam. Review grade, SDS, COA, UN 1888 packing, precursor controls and importer checks before quotation.", "从中国采购氯仿（CAS 67-66-3）至越南：报价前核查牌号、SDS、COA、UN 1888 包装、易制毒管制与进口商要求。"),
  coverImage: "/blog/chloroform-vietnam-cover.webp",
  content: t(`# Chloroform Supplier China to Vietnam: 2026 Import & Shipping Guide

Chloroform and trichloromethane are two names for the same chemical, CAS 67-66-3 and formula CHCl3. For a Vietnamese industrial buyer, a workable China supply inquiry must cover more than price: grade, stabilizer, end use, buyer and importer identity, SDS, batch COA, approved packing, Chinese precursor-chemical controls and carrier acceptance all need review.

**Quick answer:** ChinaChemExport can coordinate a chloroform supply review from China to Vietnam, but producer availability, export eligibility, Vietnamese import requirements, packing and vessel acceptance are confirmed for each transaction. No shipment should be treated as approved from a website description alone.

## Chloroform product and transport identity

- Common name: Chloroform
- Chemical name: Trichloromethane
- CAS number: 67-66-3
- Molecular formula: CHCl3
- UN number: UN 1888
- Transport class: 6.1, toxic substance
- Packing group: III

These identifiers help align the inquiry, specification, SDS and transport documents. The current supplier SDS and the rules applicable to the actual mode, carrier and destination remain controlling. See the [chloroform product page](/products/trichloromethane-tcm) for the product-level procurement checklist.

## Which chloroform grade should a Vietnamese buyer request?

The required grade depends on the industrial process. Chloroform is used as a solvent and chemical intermediate in qualified chemical synthesis, fluorochemical value chains and selected pharmaceutical processing. Industrial, reagent and application-specific grades are not automatically interchangeable.

Before matching a supply channel, the buyer should state:

- Intended industrial application and final user
- Required assay or purity
- Maximum water and acidity
- Stabilizer type or stabilizer-free requirement, if applicable
- Residue, colour and other critical limits
- Required test method or target COA
- Trial quantity and expected regular volume

A target specification or previous acceptable COA is more useful than asking only for “best quality.” Final acceptance should follow the mutually confirmed specification and batch COA.

## Why the end use and importer matter

Chloroform is not an unrestricted ordinary solvent transaction. China controls trichloromethane under its precursor-chemical framework. The responsible Chinese export party must review business eligibility, buyer and end-user information, declared use, contract consistency and the applicable approval and licence route before export.

Vietnam introduced Chemical Law No. 69/2025/QH15 effective 1 January 2026. Decrees No. 24/2026/ND-CP and No. 26/2026/ND-CP, effective 17 January 2026, set updated chemical lists and implementation requirements. The Vietnamese importer should therefore verify the current list classification and any declaration, licence, reporting, GHS label, Vietnamese SDS or hazardous-chemical obligations for the actual product and use.

This article does not determine whether a particular buyer or shipment is eligible. The importer should obtain transaction-specific confirmation from its customs broker or chemical-compliance adviser before placing the order.

## Documents to prepare before quotation and shipment

A serious inquiry should be supported by enough information to begin document matching. Depending on the transaction, the working file may include:

- Buyer, importer and final-user registration details
- Purchase order or sales contract
- End-user and end-use statement
- Agreed product specification
- Current supplier SDS
- Batch COA before final acceptance
- Commercial invoice and packing list
- Chinese precursor-chemical approval and export licence documents where applicable
- Dangerous-goods declaration and carrier documents
- Vietnamese declaration, permit or other import approval where applicable
- Certificate of origin if requested and available for the shipment

Product name, CAS number, UN number, grade, quantity and packing must remain consistent across commercial, regulatory and transport documents. A mismatch can delay licensing, booking or customs review.

![Inspection of sealed chemical drums and export documents before a Vietnam shipment](/blog/chloroform-vietnam-inspection.webp)

## Packaging and UN 1888 shipment review

Chloroform is commonly transported as UN 1888, Class 6.1, Packing Group III. Packaging must be compatible with the selected grade and meet the applicable UN performance, closure, marking and carrier requirements. An approved drum or other permitted system can only be selected after quantity, route and handling conditions are known.

Before booking, the export team should confirm:

- Packaging compatibility and condition
- Required UN package marking and hazard labels
- Net and gross weight limits
- Closure, leak-prevention and palletisation plan
- Dangerous-goods declaration data
- Carrier and vessel acceptance
- Transshipment restrictions and document cut-offs
- Destination-port and inland-delivery capability

Hai Phong and the Ho Chi Minh City port area may be considered according to the buyer’s location and carrier service, but naming a port does not guarantee acceptance or availability.

## China-to-Vietnam procurement workflow

1. **Buyer qualification:** collect the registered buyer, importer, final user and intended application.
2. **Specification matching:** compare the requested limits and stabilizer requirement with an available producer specification.
3. **Compliance screening:** review Chinese export controls and the importer’s Vietnamese requirements.
4. **Document review:** confirm SDS, target specification, COA process and required end-use documents.
5. **Packing and route review:** select a compatible packing concept and request preliminary carrier acceptance.
6. **Commercial quotation:** quote only after the workable supply and shipping assumptions are clear.
7. **Pre-shipment confirmation:** recheck the batch, documents, labels, package condition, booking and destination instructions.

This sequence reduces the risk of quoting material that cannot be licensed, packed, booked or imported as proposed.

## Information required from a Vietnamese buyer

Send the following in the first inquiry:

- Registered company and importer name
- Final user and exact industrial application
- Required purity and full specification
- Stabilizer requirement
- Quantity and repeat-demand estimate
- Packing preference
- Destination city and preferred port
- Incoterm and requested shipment window
- Required SDS language, COA fields and import documents
- Confirmation of available Vietnamese approvals or broker review

ChinaChemExport can then coordinate specification matching, supply communication, document collection, packing discussion and preliminary logistics review. We do not present ourselves as the regulator, customs broker, carrier or guaranteed manufacturer, and we do not confirm licensing or vessel acceptance before the responsible parties approve the actual shipment.

## Frequently asked questions

### Is chloroform the same as trichloromethane?

Yes. Chloroform is the common name for trichloromethane, CAS 67-66-3, molecular formula CHCl3.

### What is the UN number for chloroform?

Chloroform is commonly identified for transport as UN 1888, Class 6.1, Packing Group III. Confirm the current SDS and shipment-specific transport assessment before booking.

### Can chloroform be exported from China to Vietnam?

A potential shipment can proceed only after the Chinese export party confirms the applicable precursor-chemical controls and the Vietnamese importer confirms its current import obligations. Carrier and route acceptance are also required.

### What should I send to obtain a quotation?

Send the specification, stabilizer requirement, quantity, packing, destination, importer and final-user details, exact end use, requested documents and shipment window.

## Authoritative references

- [Vietnam Chemical Law No. 69/2025/QH15](https://vanban.chinhphu.vn/?docid=214610&pageid=27160)
- [Vietnam Decree No. 24/2026/ND-CP](https://vanban.chinhphu.vn/?docid=216671&pageid=27160&typegroupid=4)
- [Vietnam Decree No. 26/2026/ND-CP](https://vanban.chinhphu.vn/?classid=1&docid=216673&pageid=27160)
- [China Ministry of Commerce precursor-chemical export licensing guide](https://www.mofcom.gov.cn/zwdt/lywxhjsjcksp/index.html)
- [PubChem chloroform identity record](https://pubchem.ncbi.nlm.nih.gov/compound/Chloroform)
- [UN dangerous-goods list](https://unece.org/fileadmin/DAM/trans/danger/publi/unrec/rev14/English/03E_Part3.pdf)

> This guide provides general procurement and logistics information, not legal, customs or safety advice. Regulations and carrier policies change. The exporter, importer, final user and carrier must verify the actual transaction before payment, licensing, loading or customs declaration.`, `# 中国氯仿供应至越南：2026 进口与运输指南

氯仿与三氯甲烷是同一种化学品，CAS 67-66-3，分子式 CHCl3。越南工业买家从中国采购时，不能只询问价格，还应核实牌号、稳定剂、最终用途、买方和进口商身份、SDS、批次 COA、合规包装、中国易制毒化学品管制以及承运人接受条件。

**简要结论：** ChinaChemExport 可以协调中国至越南的氯仿供应审核，但生产企业、货源、出口资格、越南进口要求、包装和船公司接受条件均须逐单确认。网站介绍不能代替实际交易审批。

## 产品与运输身份

- 常用名称：氯仿
- 化学名称：三氯甲烷
- CAS：67-66-3
- 分子式：CHCl3
- UN 编号：UN 1888
- 运输类别：6.1 类毒性物质
- 包装等级：III

这些信息应在询盘、规格、SDS 和运输文件中保持一致。最终仍以当前供应商 SDS、实际运输方式、承运人和目的地规则为准。产品级采购资料可查看[氯仿产品页](/products/trichloromethane-tcm)。

## 越南买家应确认什么牌号？

氯仿可用于合格的化学合成、含氟化学品制造链、部分医药加工及工业溶剂工艺。工业级、试剂级和特定应用牌号不能默认互换。

买家应提供：

- 工业用途与最终用户
- 所需纯度或含量
- 水分与酸度上限
- 稳定剂类型或无稳定剂要求
- 残留物、色度等关键限值
- 检测方法或目标 COA
- 试单数量与预计常规需求

最终验收应以双方确认的规格和批次 COA 为准。

## 为什么必须审核最终用途和进口商？

中国将三氯甲烷纳入易制毒化学品管理。负责出口的主体需要审核经营资格、买方与最终用户、申报用途、合同一致性以及适用的审批和许可证路径。

越南第 69/2025/QH15 号《化学品法》自 2026 年 1 月 1 日生效；第 24/2026/ND-CP 号与第 26/2026/ND-CP 号法令自 2026 年 1 月 17 日生效，对化学品清单和实施要求进行了更新。越南进口商应确认实际产品和用途对应的清单分类、申报或许可、报告、GHS 标签、越南语 SDS 及危险化学品义务。

本文不能判断某个买家或某票货物是否具备资格。下单前，进口商应向当地报关或化学合规顾问取得针对本次交易的确认。

## 报价和出运前的文件

- 买方、进口商及最终用户注册资料
- 采购订单或销售合同
- 最终用户和最终用途声明
- 已确认的产品规格
- 当前供应商 SDS
- 批次 COA
- 商业发票和装箱单
- 适用时的中国易制毒化学品审批及出口许可证文件
- 危险品申报和承运人文件
- 适用时的越南申报、许可或其他进口批准
- 客户要求且本票可提供的原产地证

商业、监管和运输文件中的产品名称、CAS、UN 编号、牌号、数量和包装必须一致。

![越南出运前对密封化工桶及出口文件进行检查](/blog/chloroform-vietnam-inspection.webp)

## UN 1888 包装与运输审核

氯仿通常按 UN 1888、6.1 类、包装等级 III 运输。包装需与所选牌号相容，并符合适用的 UN 性能、封口、标记及承运人要求。只有在数量、路线和操作条件明确后，才能确认桶装或其他获准方案。

订舱前应确认：

- 包装相容性及状态
- UN 包装标记与危险标签
- 净重和毛重限制
- 封口、防漏及托盘方案
- 危险品申报数据
- 船公司和船舶接受条件
- 中转限制和文件截单时间
- 目的港及内陆交付能力

海防和胡志明市港区可以根据买家位置及船期研究，但指定港口不代表保证接货或有舱位。

## 中国至越南采购流程

1. **买家资格：** 收集注册买方、进口商、最终用户和具体用途。
2. **规格匹配：** 将所需指标及稳定剂要求与可供生产企业规格比较。
3. **合规筛查：** 审核中国出口管制和越南进口义务。
4. **文件审核：** 确认 SDS、规格、COA 流程及最终用途文件。
5. **包装与路线：** 选择相容包装并初步确认承运人接受条件。
6. **商务报价：** 在供应与运输假设可执行后报价。
7. **出运复核：** 再次核对批次、文件、标签、包装状态、订舱和目的地指示。

## 越南买家首次询盘资料

- 注册公司和进口商名称
- 最终用户与准确工业用途
- 纯度与完整规格
- 稳定剂要求
- 数量及重复需求预测
- 包装偏好
- 目的城市和首选港口
- 贸易术语与计划出运时间
- SDS 语言、COA 字段和进口文件要求
- 已有越南批准或报关顾问审核情况

ChinaChemExport 可以协调规格匹配、供应沟通、文件收集、包装讨论和初步物流审核。我们不是监管机构、报关行、承运人，也不保证所有产品均由固定生产企业供应；许可证和船公司接受条件必须由相关责任方针对实际交易确认。

## 常见问题

### 氯仿和三氯甲烷是同一种产品吗？

是。氯仿是三氯甲烷的常用名称，CAS 67-66-3，分子式 CHCl3。

### 氯仿的 UN 编号是什么？

通常识别为 UN 1888、6.1 类、包装等级 III。订舱前仍需确认当前 SDS 和本票运输鉴定。

### 氯仿可以从中国出口到越南吗？

潜在货物只有在中国出口方确认适用易制毒管制、越南进口商确认当前进口义务，并获得承运人与路线接受后才能执行。

### 询价需要提供什么？

请提供规格、稳定剂要求、数量、包装、目的地、进口商和最终用户资料、准确用途、文件要求及出运时间。

## 权威参考

- [越南第 69/2025/QH15 号《化学品法》](https://vanban.chinhphu.vn/?docid=214610&pageid=27160)
- [越南第 24/2026/ND-CP 号法令](https://vanban.chinhphu.vn/?docid=216671&pageid=27160&typegroupid=4)
- [越南第 26/2026/ND-CP 号法令](https://vanban.chinhphu.vn/?classid=1&docid=216673&pageid=27160)
- [中国商务部易制毒化学品出口许可指南](https://www.mofcom.gov.cn/zwdt/lywxhjsjcksp/index.html)
- [PubChem 氯仿记录](https://pubchem.ncbi.nlm.nih.gov/compound/Chloroform)
- [联合国危险货物目录](https://unece.org/fileadmin/DAM/trans/danger/publi/unrec/rev14/English/03E_Part3.pdf)

> 本文提供一般采购与物流信息，不构成法律、海关或安全建议。法规及承运人政策可能变化，出口商、进口商、最终用户与承运人必须在付款、许可、装货和报关前核实实际交易。`),
};
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
  { label: t("Chemical Sourcing", "化工品寻源"), page: "chemical-sourcing" },
  { label: t("Export Support", "出口支持"), page: "export-support" },
  { label: t("Products", "产品"), page: "products" },
  { label: t("Insights", "行业洞察"), page: "insights" },
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
  {
    product: t("Methylene Chloride Export To Vietnam", "二氯甲烷出口越南"),
    volume: "By Order / 按订单确认",
    packing: t("UN Drums / ISO Tank", "UN桶装 / ISO罐"),
    port: "Ho Chi Minh / Hai Phong",
    country: t("Vietnam", "越南"),
    route: t("China Port → Vietnam", "中国港口 → 越南"),
    timeline: "Per Order / 按订单确认",
    scope: t(
      "Product Supply + MSDS / COA + DG Export Coordination",
      "产品供应 + MSDS / COA + 危险品出口协调",
    ),
    result: t(
      "A Vietnam-focused sourcing route for methylene chloride, with grade, packing, documents and final port plan confirmed for each shipment.",
      "面向越南市场的二氯甲烷寻源与出运路线，具体牌号、包装、单证及最终港口方案按每票货物确认。",
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
  "108-88-3": "/product-images/toluene-tol-108-88-3.webp",
  "1330-20-7": "/product-images/xylene-1330-20-7.webp",
  "67-56-1": "/product-images/methanol-67-56-1.webp",
  "67-64-1": "/product-images/acetone-ac-67-64-1.webp",
  "75-09-2": "/product-images/methylene-chloride-dcm-75-09-2.webp",
  "67-66-3": "/product-images/trichloromethane-tcm-67-66-3.webp",
  "616-38-6": "/product-images/dimethyl-carbonate-dmc-616-38-6.webp",
  "62-53-3": "/product-images/aniline-62-53-3.webp",
  "79-01-6": "/product-images/trichloroethylene-tce-79-01-6.webp",
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
    slug: item.slug?.trim() || undefined,
    detailContent: item.detail_content || undefined,
    packing: storedI18n(item.packing, "Packing to be confirmed", "包装待确认"),
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
function canonicalPath(pathname: string) {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "");
}
function pathToPage(pathname: string): Page {
  if (getArticleSlug(pathname)) return "insights";
  if (getProductSlug(pathname)) return "products";
  if (pathname === "/cases") {
    window.history.replaceState({}, "", "/chemical-sourcing");
    return "chemical-sourcing";
  }
  if (pathname === "/services") {
    window.history.replaceState({}, "", "/export-support");
    return "export-support";
  }
  if (pathname === "/markets") {
    window.history.replaceState({}, "", "/chemical-sourcing");
    return "chemical-sourcing";
  }
  if (pathname === "/shandong-supply-base") {
    window.history.replaceState({}, "", "/chemical-sourcing");
    return "chemical-sourcing";
  }
  if (pathname === "/about") {
    window.history.replaceState({}, "", "/export-support");
    return "export-support";
  }
  const key = pathname.replace("/", "") as Page;
  return [
    "products",
    "chemical-sourcing",
    "export-support",
    "shandong-supply-base",
    "about",
    "services",
    "markets",
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
  // Keep the legacy implementations available for audited detail flows while the
  // approved standalone pages are rolled out one route at a time.
  void AboutPage;
  void ContactPage;
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
  const [inquiryProduct, setInquiryProduct] = useState("");
const [articles, setArticles] = useState<Article[]>(
  [chloroformVietnamArticle, ...fallbackArticles.map(fallbackArticleToArticle)],
);

useEffect(() => {
  async function loadCmsData() {
    const { supabase } = await import("./lib/supabase");
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
      const cmsArticles = articleData.map((item) => cmsArticleToArticle(item as CmsArticle));
      setArticles(cmsArticles.some((article) => article.slug === chloroformVietnamArticle.slug) ? cmsArticles : [chloroformVietnamArticle, ...cmsArticles]);
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
    const activeArticle = currentArticleSlug
      ? articles.find((article) => article.slug === currentArticleSlug)
      : undefined;
    if (getProductSlug(window.location.pathname)) {
      trackPageView();
      return;
    }
    document.title =
      activeArticle
        ? `${tx(activeArticle.seoTitle, lang)} | ChinaChemExport`
        : page === "home"
        ? tx(
            t(
              "China Chemical Sourcing & Export Support | ChinaChemExport",
              "中国化工品寻源与出口支持 | ChinaChemExport",
            ),
            lang,
          )
        : tx(({
            "chemical-sourcing": t("Chemical Sourcing in China, Coordinated from Shandong | ChinaChemExport", "中国化工品寻源服务｜ChinaChemExport"),
            "export-support": t("Chemical Export Support from China | ChinaChemExport", "中国化工品出口支持｜ChinaChemExport"),
            "shandong-supply-base": t("Shandong Chemical Supply Base | ChinaChemExport", "山东化工产业带寻源｜ChinaChemExport"),
            products: t("Chemicals Sourced from China | ChinaChemExport", "中国化工品寻源目录｜ChinaChemExport"),
            insights: t("Chemical Sourcing & Export Guides | ChinaChemExport", "化工品寻源与出口指南｜ChinaChemExport"),
            about: t("Independent Chemical Sourcing Coordinator in Shandong | ChinaChemExport", "山东独立化工品寻源协调人｜ChinaChemExport"),
            contact: t("Submit a Chemical Sourcing Requirement | ChinaChemExport", "提交化工品采购需求｜ChinaChemExport"),
          } as Partial<Record<Page, I18n>>)[page] || t(`${page} | ChinaChemExport`, `${page} | ChinaChemExport`), lang);
    const descriptions: Partial<Record<Page, I18n>> = {
      home: t(
        "Independent chemical sourcing and export coordination from Shandong, China, connecting international buyers with reviewed supply options, qualified repacking, inspection, dangerous-goods documentation, customs and shipping resources.",
        "ChinaChemExport提供立足中国山东的独立化工品寻源与出口协调服务，为国际买家连接经核验的供应选择，以及合格分装、检验、危包单证、报关和运输资源。",
      ),
      products: t(
        "Browse bulk chemicals, solvents and intermediates supplied from China with compliant packaging, export documentation and dangerous-goods logistics support.",
        "浏览中国供应的大宗化工品、溶剂及中间体，并获取合规包装、出口单证与危险品物流支持。",
      ),
      about: t(
        "Meet the independent chemical sourcing and export coordinator behind ChinaChemExport, connecting overseas buyers with reviewed supply and qualified operating resources in Shandong.",
        "了解ChinaChemExport背后的独立化工品寻源与出口协调人，为海外采购商连接山东经核验货源及合格履约资源。",
      ),
      "chemical-sourcing": t("Independent chemical sourcing in China: requirement review, supplier identification, specification checks, availability confirmation and commercial comparison.", "独立中国化工品寻源服务：需求梳理、供应商筛选、规格核验、货源确认及商务条件比较。"),
      "export-support": t("Chemical export coordination covering qualified repacking, inspection, dangerous-goods documents, customs declaration, vessel booking and port follow-up.", "化工品出口协调服务，覆盖合格分装、检验、危包单证、报关、订舱和港口交付跟进。"),
      "shandong-supply-base": t("A buyer-focused introduction to chemical sourcing from Shandong’s petrochemical supply base and its regional export-service resources.", "面向海外买家的山东石化产业带寻源介绍及区域出口服务资源说明。"),
      insights: t("Practical guides for overseas buyers reviewing Chinese chemical suppliers, specifications, packing, dangerous-goods documents and shipment options.", "面向海外买家的中国化工品供应商、规格、包装、危品单证与运输方案实务指南。"),
      contact: t("Submit your product, specification, quantity, packing and destination for a transaction-specific chemical sourcing and export review.", "提交产品、规格、数量、包装和目的地，获取针对具体交易的化工品寻源与出口评估。"),
      services: t(
        "Export support for chemical orders from China, including quality control, documentation, packaging, customs and dangerous-goods logistics.",
        "为中国化工品订单提供质量控制、单证、包装、报关及危险品物流配套支持。",
      ),
    };
    const meta = document.querySelector('meta[name="description"]');
    if (meta && activeArticle) {
      meta.setAttribute("content", tx(activeArticle.seoDescription, lang));
    } else if (meta && descriptions[page]) {
      meta.setAttribute("content", tx(descriptions[page]!, lang));
    }
    const canonicalUrl = `https://chinachemexport.com${canonicalPath(window.location.pathname)}`;
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
    if (next === "contact") setInquiryProduct("");
    window.history.pushState({}, "", pageToPath(next));
    setPage(next);
    setCurrentArticleSlug(null);
    setMobileMenuOpen(false);
  }

  const openProductInquiry = useCallback((product: Product) => {
    setInquiryProduct(formatInquiryProduct(product, lang));
    window.history.pushState({}, "", "/contact");
    setPage("contact");
    setCurrentArticleSlug(null);
    setMobileMenuOpen(false);
  }, [lang]);

  function openArticle(slug: string) {
    window.history.pushState({}, "", `/insights/${slug}`);
    setPage("insights");
    setCurrentArticleSlug(slug);
    setMobileMenuOpen(false);
  }
  const content = useMemo(() => {
    if (page === "chemical-sourcing") return <ApprovedChemicalSourcing lang={lang} />;
    if (page === "export-support") return <ApprovedExportSupport lang={lang} />;
    if (page === "products") {
      return getProductSlug(window.location.pathname)
        ? <ProductsPage lang={lang} products={products} onRequestQuote={openProductInquiry} />
        : <ApprovedProducts lang={lang} />;
    }
    if (page === "services") return <ServicesPage go={go} lang={lang} />;
    if (page === "markets") return <MarketsPage go={go} lang={lang} />;
    if (page === "insights") return currentArticleSlug ? (
      <InsightsPage
        go={go}
        lang={lang}
        articles={articles}
        currentArticleSlug={currentArticleSlug}
      />
    ) : <ApprovedInsights />;
    if (page === "contact") return <ApprovedContact initialProduct={inquiryProduct} />;
    if (["privacy", "terms", "cookies", "dangerous-goods"].includes(page)) {
      return <LegalPage page={page as LegalPageKey} lang={lang} />;
    }
    return (
      <HomePage
        go={go}
        lang={lang}
        setLang={setLang}
        products={products}
        articles={articles}
        onOpenArticle={openArticle}
      />
    );
  }, [page, lang, products, articles, currentArticleSlug, inquiryProduct, openProductInquiry]);
  const approvedStandalone = page === "home"
    || page === "chemical-sourcing"
    || page === "export-support"
    || page === "contact"
    || (page === "products" && !getProductSlug(window.location.pathname))
    || (page === "insights" && !currentArticleSlug);
  if (approvedStandalone) return content;
  return (
    <>
      <header className="header">
        <button className="brand" onClick={() => go("home")}>
          <span className="brand-mark">CE</span>
          <span>
            <b>ChinaChemExport</b>
            <small>
              {tx(
                t("Independent Chemical Sourcing & Export Coordinator", "独立化工品寻源与出口协调服务"),
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

function ProductsPage({ lang, products, onRequestQuote }: { lang: Lang; products: Product[]; onRequestQuote: (product: Product) => void }) {
  const [category, setCategory] = useState("All Products");
  const [query, setQuery] = useState("");
  const [currentSlug, setCurrentSlug] = useState<string | null>(() => getProductSlug(window.location.pathname));
  useEffect(() => {
    const onPop = () => setCurrentSlug(getProductSlug(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  const selectedProduct = currentSlug
    ? products.find((product) => productSlug(product) === currentSlug) || null
    : null;
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
  function openProduct(product: Product) {
    const slug = productSlug(product);
    window.history.pushState({}, "", productPath(slug));
    setCurrentSlug(slug);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  if (currentSlug) {
    if (!selectedProduct) {
      return <main className="page"><section className="pd-section"><div className="container pd-narrow"><p className="pd-kicker">404</p><h1>{tx(t("Product not found", "未找到该产品"), lang)}</h1><p className="pd-body-copy">{tx(t("This product URL is not available. Browse the active product catalog or contact us with the product name and CAS number.", "该产品地址当前不可用。请浏览启用的产品目录，或携产品名称与 CAS 号联系我们。"), lang)}</p><button className="blue-btn" onClick={() => { window.history.pushState({}, "", "/products"); setCurrentSlug(null); }}>{tx(t("Back to Products", "返回产品目录"), lang)}</button></div></section></main>;
    }
    return <ProductDetailPage product={selectedProduct} products={products} lang={lang} onBack={() => { window.history.pushState({}, "", "/products"); setCurrentSlug(null); }} onOpenProduct={openProduct} onQuote={() => onRequestQuote(selectedProduct)} />;
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
            <section className="availability-panel" aria-labelledby="availability-title">
              <div className="availability-panel-head">
                <div>
                  <p className="eyebrow">{tx(t("Current Supply Availability", "当前供应状态"), lang)}</p>
                  <h2 id="availability-title">{tx(t("Supply channels reviewed for export orders.", "面向出口订单核实的供应渠道"), lang)}</h2>
                </div>
                <span className="availability-note">{tx(t("Final quantity and batch confirmed per order", "数量与批次按订单确认"), lang)}</span>
              </div>
              <div className="availability-grid">
                {[
                  ["75-09-2", "Methylene Chloride", "Regular Supply", "稳定供应"],
                  ["67-66-3", "Chloroform", "Regular Supply", "稳定供应"],
                  ["616-38-6", "Dimethyl Carbonate", "Available for Confirmation", "可确认供应"],
                  ["62-53-3", "Aniline", "Regular Supply", "稳定供应"],
                  ["79-01-6", "Trichloroethylene", "Available for Confirmation", "可确认供应"],
                ].map(([cas, name, statusEn, statusZh]) => {
                  const product = products.find((item) => item.cas === cas);
                  return (
                    <a
                      href={product ? productPath(productSlug(product)) : "/products"}
                      className="availability-card"
                      key={cas}
                      onClick={(event) => {
                        if (product && isPlainLeftClick(event)) {
                          event.preventDefault();
                          openProduct(product);
                        }
                      }}
                    >
                      <span className="availability-status">{tx(t(statusEn, statusZh), lang)}</span>
                      <strong>{product ? tx(product.name, lang) : name}</strong>
                      <small>CAS {cas}</small>
                      <em>{tx(t("Verify grade · packing · loading window", "核实牌号 · 包装 · 装运窗口"), lang)}</em>
                    </a>
                  );
                })}
              </div>
              <p className="availability-disclaimer">
                {tx(t(
                  "Status describes an established supply channel, not an unconditional warehouse-stock promise. We recheck manufacturer, specification, documentation and loading schedule before quotation.",
                  "状态表示已建立供应渠道，并不等同于无条件的自有库存承诺。报价前我们会重新核实生产商、规格、单证与装运计划。",
                ), lang)}
              </p>
            </section>
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
  const regionalSupplyNetwork = [
    [
      t("Shandong Jinling Group", "山东金岭集团"),
      t(
        "A major Dongying producer with product lines covering chlor-alkali chemicals, methane chlorides, propylene oxide and aniline-related products. We have established local supply coordination for selected products, subject to specification, availability and order review.",
        "东营本地重要生产企业，产品涉及氯碱、甲烷氯化物、环氧丙烷及苯胺等系列。我们已就部分产品建立本地供应协同，具体以规格、库存及订单审核结果为准。",
      ),
    ],
    [
      t("Lihuayi Group", "利华益集团"),
      t(
        "A representative Dongying industrial group with refining, high-end chemicals and new-material operations. Its industrial chain illustrates the depth of the local petrochemical supply base available for product matching.",
        "东营具有代表性的炼化产业集团，业务覆盖石油加工、高端化学品及新材料等领域，体现了本地石化产业链在产品匹配方面的深度。",
      ),
    ],
    [
      t("Wanda Petrochemical Group", "万达石化集团"),
      t(
        "Located in the Dongying Port Economic Development Zone, with an integrated refining, chemical and materials industry layout that strengthens the region's port-side supply and logistics resources.",
        "位于东营港经济技术开发区，形成炼化、化工及材料产业协同布局，为区域临港供货与物流资源提供产业支撑。",
      ),
    ],
    [
      t("Qicheng Holding / Qicheng Petrochemical", "齐成控股 / 齐成石化"),
      t(
        "A Dongying-based energy and chemical group with an industrial chain extending from crude-oil processing to refined products and chemical products, adding breadth to local sourcing options.",
        "东营本地能源化工企业，产业链由原油加工延伸至成品油及系列化工产品，为本地采购提供更广泛的产品选择。",
      ),
    ],
    [
      t("Dongying Qirun Chemical", "东营齐润化工"),
      t(
        "A local refining and petrochemical producer whose publicly listed product range includes refinery streams, aromatics and related chemical products. Supply feasibility is checked against the exact grade and end use.",
        "本地炼化及石化产品生产企业，公开产品范围涉及炼厂产品、芳烃及相关化工品。实际供货需根据具体牌号、用途和合规要求逐单确认。",
      ),
    ],
    [
      t("Dongying Huatai Chemical Group", "东营华泰化工集团"),
      t(
        "Part of Dongying's established chemical manufacturing base, with chemical production connected to the wider Huatai industrial chain. It is one of the regional supply channels considered during product sourcing.",
        "东营成熟化工制造体系的重要组成部分，化工生产与华泰产业链形成协同，是我们进行产品寻源时关注的区域供应渠道之一。",
      ),
    ],
    [
      t("Shandong Jinmao Chemical", "山东金茂化工"),
      t(
        "A Dongying chemical producer associated with chlor-alkali, aniline and related chemical products. Product source, specification and documentation are verified before any export quotation is confirmed.",
        "东营化工生产企业，涉及氯碱、苯胺及相关化工产品。任何出口报价确认前，我们都会核实货源、规格及配套单证。",
      ),
    ],
    [
      t("Shandong Huaxing Petrochemical", "山东华星石化"),
      t(
        "A representative Dongying refining and petrochemical enterprise with oil processing, chemical products and downstream processing capabilities. Its location in Guangrao adds another important supply channel within the local industrial belt.",
        "东营具有代表性的炼化及石化企业，业务涉及石油加工、化工产品及下游深加工。其位于广饶，为东营本地产业带增加了重要供应渠道。",
      ),
    ],
    [
      t("Zhenghe Petrochemical", "正和石化"),
      t(
        "A long-established Dongying refining and chemical enterprise within the regional supply base. We consider its product availability and route feasibility when matching suitable grades for export orders.",
        "东营本地具有较长发展历史的炼化及化工企业，是区域供应基础的一部分。在匹配出口订单时，我们会结合具体牌号、货源状态和运输路径进行核实。",
      ),
    ],
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

      <section className="section about-supply-network">
        <div className="container">
          <SectionTop
            kicker={tx(t("Dongying Supply Network", "东营供应网络"), lang)}
            title={tx(t("Close to producers. Better positioned to verify and coordinate supply.", "贴近生产企业，更高效地核实并协调货源。"), lang)}
          />
          <p className="about-network-lead">
            {tx(t(
              "Our location in Dongying gives us practical access to one of Shandong's most concentrated refining and chemical manufacturing regions. According to product, specification and destination, we coordinate with qualified local producers and supply channels, including the following representative enterprises.",
              "我们位于东营，能够连接山东高度集中的炼化与化工制造资源。根据产品、规格和目的国要求，我们与具备相应条件的本地生产企业及供应渠道协调货源，其中包括以下代表性企业。",
            ), lang)}
          </p>
          <div className="about-network-grid">
            {regionalSupplyNetwork.map(([name, description]) => (
              <article key={name.en}>
                <span>{tx(t("Regional Supply Resource", "区域供应资源"), lang)}</span>
                <h3>{tx(name, lang)}</h3>
                <p>{tx(description, lang)}</p>
              </article>
            ))}
          </div>
          <p className="about-network-note">
            {tx(t(
              "Supplier names are shown to explain the regional industrial and sourcing context. ChinaChemExport is an independent supply and export coordination platform, not an authorized representative of every company listed above. The actual manufacturer, specification, availability and export route are confirmed transaction by transaction.",
              "以上企业名称用于说明区域产业与寻源背景。ChinaChemExport是独立的供应与出口协调平台，并非上述所有企业的授权代理。实际生产商、规格、库存及出口路径均按每笔订单单独确认。",
            ), lang)}
          </p>
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

void CasesPage;

function renderArticleInline(content: string): ReactNode[] {
  const tokenPattern = /(\*\*[^*]+\*\*|\[size=(?:12|14|16|18|22|26|32)\][\s\S]*?\[\/size\]|\[[^\]]+\]\((?:https?:\/\/|mailto:|\/)[^)]+\))/g;
  const parts = content.split(tokenPattern).filter(Boolean);

  return parts.map((part, index) => {
    const bold = part.match(/^\*\*([\s\S]+)\*\*$/);
    if (bold) return <strong key={index}>{renderArticleInline(bold[1])}</strong>;
    const sized = part.match(/^\[size=(12|14|16|18|22|26|32)\]([\s\S]*)\[\/size\]$/);
    if (sized) return <span key={index} style={{ fontSize: `${sized[1]}px` }}>{renderArticleInline(sized[2])}</span>;
    const link = part.match(/^\[([^\]]+)\]\(((?:https?:\/\/|mailto:|\/)[^)]+)\)$/);
    if (link) return <a key={index} href={link[2]} target={link[2].startsWith("http") ? "_blank" : undefined} rel={link[2].startsWith("http") ? "noreferrer" : undefined}>{link[1]}</a>;
    return part;
  });
}

function renderArticleContent(content: string) {
  return content.split("\n").map((rawLine, index) => {
    const line = rawLine.trim();
    if (!line) return null;
    const image = line.match(/^!\[([^\]]*)\]\(((?:https?:\/\/|\/)[^)]+)\)$/);
    if (image) return <figure className="article-body-image" key={index}><img src={image[2]} alt={image[1] || "Article illustration"} loading="lazy" /><figcaption>{image[1]}</figcaption></figure>;
    if (line.startsWith("### ")) return <h3 key={index}>{renderArticleInline(line.slice(4))}</h3>;
    if (line.startsWith("## ")) return <h2 key={index}>{renderArticleInline(line.slice(3))}</h2>;
    if (line.startsWith("# ")) return <h2 key={index}>{renderArticleInline(line.slice(2))}</h2>;
    if (/^[-*] /.test(line)) return <ul className="article-single-list" key={index}><li>{renderArticleInline(line.slice(2))}</li></ul>;
    if (/^\d+\. /.test(line)) return <ol className="article-single-list" key={index}><li>{renderArticleInline(line.replace(/^\d+\. /, ""))}</li></ol>;
    if (line.startsWith("> ")) return <blockquote key={index}>{renderArticleInline(line.slice(2))}</blockquote>;
    return <p key={index}>{renderArticleInline(line)}</p>;
  });
}

function articleFallbackImage(article: Article) {
  const slug = article.slug.toLowerCase();
  if (slug.includes("tank") || slug.includes("packing")) return "/home-v4/products-photo.webp";
  if (slug.includes("document")) return "/home-v4/hero-drums-photo.webp";
  return "/home-v4/cta-ship-photo.webp";
}

function articleTopicLinks(slug: string, lang: Lang) {
  const links: Record<string, Array<{ href: string; label: I18n }>> = {
    "dimethyl-carbonate-supplier-china-export-guide": [
      { href: "/products/dimethyl-carbonate-dmc", label: t("Dimethyl Carbonate product details", "碳酸二甲酯产品详情") },
      { href: "/insights/dimethyl-carbonate-vietnam-china-supplier-guide", label: t("DMC supply guide for Vietnam", "DMC 越南供应指南") },
    ],
    "dimethyl-carbonate-vietnam-china-supplier-guide": [
      { href: "/products/dimethyl-carbonate-dmc", label: t("Dimethyl Carbonate product details", "碳酸二甲酯产品详情") },
      { href: "/insights/dimethyl-carbonate-supplier-china-export-guide", label: t("DMC supplier and export guide from China", "DMC 中国供应与出口指南") },
    ],
    "methylene-chloride-india-dcm-msds-china-supply-guide": [
      { href: "/products/methylene-chloride-dcm", label: t("Methylene Chloride product details", "二氯甲烷产品详情") },
      { href: "/insights/how-to-export-dichloromethane-from-china", label: t("DCM export compliance guide", "二氯甲烷出口合规指南") },
    ],
    "how-to-export-dichloromethane-from-china": [
      { href: "/products/methylene-chloride-dcm", label: t("Methylene Chloride product details", "二氯甲烷产品详情") },
      { href: "/insights/methylene-chloride-india-dcm-msds-china-supply-guide", label: t("DCM supply guide for India", "二氯甲烷印度供应指南") },
    ],
    "chloroform-supplier-china-vietnam-import-guide": [
      { href: "/products/trichloromethane-tcm", label: t("Chloroform product details", "氯仿产品详情") },
      { href: "/dangerous-goods", label: t("Dangerous-goods export support", "危险品出口服务") },
    ],
  };
  return (links[slug] || []).map((link) => ({ href: link.href, text: tx(link.label, lang) }));
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
    const topicLinks = articleTopicLinks(currentArticle.slug, lang);
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
              {topicLinks.length > 0 && <nav className="article-topic-links" aria-label={tx(t("Related product and guides", "相关产品与指南"), lang)}>{topicLinks.map((link) => <a key={link.href} href={link.href}>{link.text} →</a>)}</nav>}
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
                <a
                  href={`/insights/${a.slug}`}
                  onClick={(event) => {
                    if (!isPlainLeftClick(event)) return;
                    event.preventDefault();
                    window.history.pushState({}, "", `/insights/${a.slug}`);
                    window.dispatchEvent(new PopStateEvent("popstate"));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  {tx(t("Read More →", "阅读全文 →"), lang)}
                </a>
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

function ContactPage({ lang, initialProduct }: { lang: Lang; initialProduct: string }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    contact: "",
    product: initialProduct,
    quantity: "",
    destination: "",
    packing: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  useEffect(() => {
    if (!initialProduct) return;
    setFormData((current) => ({ ...current, product: initialProduct }));
  }, [initialProduct]);

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
                  t("WeChat / Phone", "微信 / 电话"),
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
      <a
        href={productPath(productSlug(product))}
        onClick={(event) => {
          if (isPlainLeftClick(event)) {
            event.preventDefault();
            onView();
          }
        }}
      >
        {tx(t("View Product →", "查看产品 →"), lang)}
      </a>
    </article>
  );
}
function isPlainLeftClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
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
              t("Independent Chemical Sourcing & Export Coordinator", "独立化工品寻源与出口协调服务"),
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
