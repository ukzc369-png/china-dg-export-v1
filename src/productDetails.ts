export type Lang = "en" | "zh";
export type I18n = { en: string; zh: string };

export type ProductSource = {
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
  slug?: string;
  detailContent?: ProductDetailContent;
};

export type ProductDetailContent = {
  h1?: string;
  subtitle?: string;
  overview?: string;
  formula?: string;
  hsCode?: string;
  appearance?: string;
  storage?: string;
  applications?: string[];
  overviewImage?: string;
  packagingImage?: string;
  bulkImage?: string;
  documents?: Array<{ name: string; note?: string; url?: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  ctaTitle?: string;
  ctaText?: string;
};

export type ProductFact = { label: I18n; value: I18n };
export type ProductFaq = { question: I18n; answer: I18n };
export type ProductDocument = { name: string; note?: I18n; url?: string };

export type ProductDetailModel = {
  source: ProductSource;
  slug: string;
  priority: boolean;
  h1: I18n;
  subtitle: I18n;
  overview: I18n;
  seoTitle: I18n;
  seoDescription: I18n;
  formula?: string;
  hsCode?: string;
  appearance?: I18n;
  storage?: I18n;
  specifications: ProductFact[];
  applications: I18n[];
  packaging: I18n[];
  overviewImage?: string;
  packagingImage?: string;
  bulkImage?: string;
  documents: ProductDocument[];
  faqs: ProductFaq[];
  ctaTitle?: I18n;
  ctaText?: I18n;
};

const bi = (en: string, zh: string): I18n => ({ en, zh });

type PriorityContent = Pick<
  ProductDetailModel,
  "subtitle" | "overview" | "applications" | "faqs"
> & Partial<Pick<ProductDetailModel, "formula" | "hsCode" | "appearance" | "storage">>;

const commonFaqs = (name: string, zhName: string): ProductFaq[] => [
  {
    question: bi(`How can I source ${name} from China?`, `如何从中国采购${zhName}？`),
    answer: bi(
      "Send the required grade, quantity, packing and destination port. Our team will confirm the supply channel and export plan before quotation.",
      "请提供所需牌号、数量、包装和目的港，我们将在报价前确认供应渠道与出口方案。",
    ),
  },
  {
    question: bi(`Which grade of ${name} is available?`, `${zhName}可提供什么牌号？`),
    answer: bi(
      "The final grade and specification are confirmed against the current batch COA and your application requirements.",
      "最终牌号与规格将结合当前批次 COA 和您的应用要求确认。",
    ),
  },
  {
    question: bi("Can you provide MSDS and COA?", "可以提供 MSDS 和 COA 吗？"),
    answer: bi(
      "Relevant documents can be confirmed for the selected grade and shipment upon request.",
      "可按需针对选定牌号和具体出运批次确认相关文件。",
    ),
  },
  {
    question: bi("What packaging options are available?", "可以提供哪些包装方式？"),
    answer: bi(
      "Packaging is confirmed by product grade, order quantity, transport route and applicable dangerous-goods requirements.",
      "包装方式将根据产品牌号、订单数量、运输路线及适用的危险品要求确认。",
    ),
  },
  {
    question: bi("Do you support international export shipments?", "是否支持国际出口运输？"),
    answer: bi(
      "We coordinate product sourcing, export documents, compliant packing and international logistics according to the destination and order details.",
      "我们根据目的地和订单要求协调产品供应、出口单证、合规包装及国际物流。",
    ),
  },
];

function priorityContent(name: string, zhName: string, overview: I18n, applications: I18n[], extra: Partial<PriorityContent> = {}): PriorityContent {
  return {
    subtitle: bi(`${name} sourcing and export support for global industrial buyers`, `面向全球工业买家的${zhName}供应与出口支持`),
    overview,
    applications,
    faqs: commonFaqs(name, zhName),
    ...extra,
  };
}

const priorityByCas: Record<string, PriorityContent> = {
  "75-09-2": priorityContent(
    "Methylene Chloride (DCM)",
    "二氯甲烷（DCM）",
    bi(
      "Methylene Chloride, also known as dichloromethane or DCM, is an industrial chlorinated solvent. ChinaChemExport coordinates export-grade sourcing, batch document confirmation, compliant packaging and international shipment planning for qualified industrial buyers.",
      "二氯甲烷（DCM）是一种工业含氯溶剂。ChinaChemExport 面向合格工业买家协调出口级产品供应、批次文件确认、合规包装和国际运输方案。",
    ),
    [bi("Paint and coating processing", "涂料加工"), bi("Pharmaceutical processing", "医药加工"), bi("Metal cleaning", "金属清洗"), bi("Chemical manufacturing", "化工生产")],
    {
      formula: "CH₂Cl₂",
      hsCode: "29031200",
      appearance: bi("Refer to the confirmed product specification and batch COA", "以确认的产品规格和批次 COA 为准"),
      storage: bi("Confirm storage and handling requirements from the shipment MSDS", "储存与操作要求以出运 MSDS 为准"),
    },
  ),
  "616-38-6": priorityContent(
    "Dimethyl Carbonate (DMC)",
    "碳酸二甲酯（DMC）",
    bi(
      "Dimethyl Carbonate (DMC) is supplied for industrial processing and chemical-manufacturing requirements. ChinaChemExport coordinates the requested grade, batch documentation, packing selection and export logistics after reviewing the buyer's application and destination.",
      "碳酸二甲酯（DMC）用于工业加工和化工生产。ChinaChemExport 根据买家的应用和目的地要求，协调所需牌号、批次文件、包装选择及出口物流。",
    ),
    [bi("Coatings and solvents", "涂料与溶剂"), bi("Chemical intermediates", "化工中间体"), bi("Industrial synthesis", "工业合成")],
  ),
  "67-66-3": priorityContent(
    "Trichloromethane (TCM)",
    "三氯甲烷（TCM）",
    bi(
      "Trichloromethane (TCM), also known as chloroform, is sourced for qualified industrial applications. Each inquiry is reviewed for grade, documentation, compliant packaging and destination-specific shipping requirements before quotation.",
      "三氯甲烷（TCM，又称氯仿）面向合格工业用途供应。报价前将逐单核实牌号、文件、合规包装及目的地运输要求。",
    ),
    [bi("Chemical processing", "化工加工"), bi("Industrial solvent use", "工业溶剂用途"), bi("Intermediate manufacturing", "中间体生产")],
  ),
  "1330-20-7": priorityContent(
    "Xylene",
    "二甲苯",
    bi(
      "Xylene is an aromatic solvent used across industrial coating, resin and chemical-processing supply chains. ChinaChemExport confirms the required product type, current batch specification, packing and export route for each buyer inquiry.",
      "二甲苯是用于工业涂料、树脂及化工加工供应链的芳烃溶剂。ChinaChemExport 针对每项询盘确认产品类型、当前批次规格、包装及出口路线。",
    ),
    [bi("Paints and coatings", "油漆与涂料"), bi("Resin processing", "树脂加工"), bi("Industrial solvents", "工业溶剂"), bi("Chemical manufacturing", "化工生产")],
  ),
  "62-53-3": priorityContent(
    "Aniline",
    "苯胺",
    bi(
      "Aniline is a chemical intermediate supplied for qualified industrial manufacturing. ChinaChemExport coordinates specification review, batch-document confirmation, suitable packing and dangerous-goods export logistics according to the order and destination.",
      "苯胺是一种面向合格工业生产用途供应的化工中间体。ChinaChemExport 根据订单和目的地协调规格审核、批次文件确认、适用包装及危险品出口物流。",
    ),
    [bi("Chemical intermediates", "化工中间体"), bi("Dye manufacturing", "染料生产"), bi("Industrial synthesis", "工业合成")],
  ),
};

export function productSlug(product: Pick<ProductSource, "name" | "slug">): string {
  return (product.slug?.trim() || product.name.en)
    .toLowerCase()
    .trim()
    .replace(/\(([^)]+)\)/g, "-$1")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validValue(value: string) {
  return Boolean(value.trim()) && !/^(?:-|to be confirmed|available upon request)/i.test(value.trim());
}

function buildTemplateProductDetail(source: ProductSource): ProductDetailModel {
  const priority = priorityByCas[source.cas];
  const nameEn = source.name.en;
  const nameZh = source.name.zh;
  const slug = productSlug(source);
  const overview = priority?.overview || bi(
    `${nameEn} is available for qualified industrial sourcing inquiries. Send the required grade, quantity, packing and destination so ChinaChemExport can confirm the current specification, documentation and export plan before quotation.`,
    `${nameZh}可接受合格工业采购询盘。请提供所需牌号、数量、包装和目的地，ChinaChemExport 将在报价前确认当前规格、文件及出口方案。`,
  );

  const specifications: ProductFact[] = [
    { label: bi("Chemical Name", "化学品名称"), value: source.name },
    { label: bi("CAS Number", "CAS 号"), value: bi(source.cas, source.cas) },
  ];
  if (validValue(source.un)) specifications.push({ label: bi("UN Number", "UN 编号"), value: bi(source.un, source.un) });
  if (priority?.formula) specifications.push({ label: bi("Formula", "分子式"), value: bi(priority.formula, priority.formula) });
  if (validValue(source.purity)) specifications.push({ label: bi("Specification / Purity", "规格 / 纯度"), value: bi(source.purity, source.purity) });
  if (priority?.appearance) specifications.push({ label: bi("Appearance", "外观"), value: priority.appearance });
  if (priority?.hsCode) specifications.push({ label: bi("HS Code", "HS 编码"), value: bi(priority.hsCode, priority.hsCode) });
  if (validValue(source.packing.en)) specifications.push({ label: bi("Packing", "包装"), value: source.packing });
  if (priority?.storage) specifications.push({ label: bi("Storage", "储存"), value: priority.storage });

  return {
    source,
    slug,
    priority: Boolean(priority),
    h1: bi(`${nameEn} Supplier China`, `${nameZh}中国供应与出口服务`),
    subtitle: priority?.subtitle || bi("Industrial sourcing, documentation and export coordination", "工业采购、单证与出口协调"),
    overview,
    seoTitle: bi(source.seoTitle || `${nameEn} Supplier China | ChinaChemExport`, `${nameZh}中国供应商 | ChinaChemExport`),
    seoDescription: bi(
      source.seoDescription || `Source ${nameEn} from China with specification confirmation, compliant packing, export documentation and international logistics coordination.`,
      `${nameZh}中国供应服务，按订单确认规格、合规包装、出口单证及国际物流方案。`,
    ),
    formula: priority?.formula,
    hsCode: priority?.hsCode,
    appearance: priority?.appearance,
    storage: priority?.storage,
    specifications,
    applications: priority?.applications || [
      bi("Application requirement review", "应用需求评估"),
      bi("Grade compatibility confirmation", "牌号适配确认"),
      bi("Process condition review", "工艺条件核对"),
      bi("Documentation requirement check", "文件需求核对"),
    ],
    packaging: validValue(source.packing.en) ? [source.packing] : [],
    documents: [],
    faqs: priority?.faqs || commonFaqs(nameEn, nameZh),
  };
}

function optionalText(value?: string) {
  const cleaned = value?.trim();
  return cleaned && validValue(cleaned) ? cleaned : undefined;
}

export function buildProductDetail(source: ProductSource): ProductDetailModel {
  const template = buildTemplateProductDetail(source);
  const custom = source.detailContent;
  const formula = optionalText(custom?.formula) || template.formula;
  const hsCode = optionalText(custom?.hsCode) || template.hsCode;
  const appearanceText = optionalText(custom?.appearance);
  const storageText = optionalText(custom?.storage);
  const appearance = appearanceText ? bi(appearanceText, appearanceText) : template.appearance;
  const storage = storageText ? bi(storageText, storageText) : template.storage;
  const specifications = template.specifications.filter((fact) => !["Formula", "Appearance", "HS Code", "Storage"].includes(fact.label.en));
  const packingIndex = specifications.findIndex((fact) => fact.label.en === "Packing");
  const insertAt = packingIndex < 0 ? specifications.length : packingIndex;
  const extraFacts: ProductFact[] = [];
  if (formula) extraFacts.push({ label: bi("Formula", "分子式"), value: bi(formula, formula) });
  if (appearance) extraFacts.push({ label: bi("Appearance", "外观"), value: appearance });
  if (hsCode) extraFacts.push({ label: bi("HS Code", "HS 编码"), value: bi(hsCode, hsCode) });
  specifications.splice(insertAt, 0, ...extraFacts);
  if (storage) specifications.push({ label: bi("Storage", "储存"), value: storage });

  const applications = custom?.applications?.map((item) => item.trim()).filter(Boolean);
  const documents = custom?.documents?.filter((item) => item.name?.trim());
  const faqs = custom?.faqs?.filter((item) => item.question?.trim() && item.answer?.trim());
  const asI18n = (value?: string, fallback?: I18n) => {
    const text = optionalText(value);
    return text ? bi(text, text) : fallback;
  };

  return {
    ...template,
    slug: productSlug(source),
    h1: asI18n(custom?.h1, template.h1)!,
    subtitle: asI18n(custom?.subtitle, template.subtitle)!,
    overview: asI18n(custom?.overview, template.overview)!,
    formula,
    hsCode,
    appearance,
    storage,
    specifications,
    applications: applications?.length ? applications.map((item) => bi(item, item)) : template.applications,
    overviewImage: optionalText(custom?.overviewImage),
    packagingImage: optionalText(custom?.packagingImage),
    bulkImage: optionalText(custom?.bulkImage),
    documents: documents?.length ? documents.map((item) => ({
      name: item.name.trim(),
      note: optionalText(item.note) ? bi(item.note!.trim(), item.note!.trim()) : undefined,
      url: optionalText(item.url),
    })) : [],
    faqs: faqs?.length ? faqs.map((item) => ({
      question: bi(item.question.trim(), item.question.trim()),
      answer: bi(item.answer.trim(), item.answer.trim()),
    })) : template.faqs,
    ctaTitle: asI18n(custom?.ctaTitle),
    ctaText: asI18n(custom?.ctaText),
  };
}
