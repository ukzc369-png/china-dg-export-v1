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
> & Partial<Pick<ProductDetailModel, "h1" | "formula" | "hsCode" | "appearance" | "storage">>;

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
    "Chloroform (Trichloromethane)",
    "氯仿（三氯甲烷）",
    bi(
      "Chloroform (CAS 67-66-3), also known as trichloromethane, is supplied for qualified industrial processing and chemical-manufacturing requirements. ChinaChemExport reviews the required grade and stabilizer, batch COA, SDS, compatible packing, importer information and destination route before quotation. The producer, availability and shipment plan are confirmed order by order.",
      "氯仿（CAS 67-66-3）又称三氯甲烷，面向合格的工业加工与化工生产用途供应。ChinaChemExport 在报价前审核所需牌号及稳定剂、批次 COA、SDS、相容包装、进口商信息和目的地路线；生产企业、货源与出运方案均逐单确认。",
    ),
    [
      bi("Chemical synthesis and intermediate production", "化学合成与中间体生产"),
      bi("Fluorochemical manufacturing value chains", "含氟化学品制造链"),
      bi("Qualified pharmaceutical processing", "合格医药加工用途"),
      bi("Industrial solvent and process use", "工业溶剂与工艺用途"),
    ],
    {
      h1: bi("Chloroform (Trichloromethane) Supplier from China", "中国氯仿（三氯甲烷）供应与出口服务"),
      formula: "CHCl₃",
      appearance: bi("Clear, colorless liquid; final acceptance follows the agreed specification and batch COA", "澄清无色液体；最终验收以约定规格和批次 COA 为准"),
      storage: bi("Follow the current shipment SDS and approved storage controls; protect the product from unsuitable heat, light and exposure", "按照本批次 SDS 与核准储存条件操作，避免不当受热、光照和暴露"),
      faqs: [
        {
          question: bi("What information is required for a chloroform quotation?", "氯仿询价需要提供哪些信息？"),
          answer: bi("Provide the required grade and specification, stabilizer requirement if applicable, industrial end use, quantity, packing preference, destination port, importer details, requested documents and shipment window.", "请提供所需牌号与指标、适用时的稳定剂要求、工业最终用途、数量、包装偏好、目的港、进口商信息、文件要求和出运时间。"),
        },
        {
          question: bi("Can you provide the SDS and batch COA for chloroform?", "可以提供氯仿 SDS 和批次 COA 吗？"),
          answer: bi("The applicable SDS, specification and batch COA are confirmed against the selected producer, grade and shipment before order execution.", "订单执行前，将根据选定生产企业、牌号和具体批次确认适用的 SDS、规格与 COA。"),
        },
        {
          question: bi("How is chloroform classified for international transport?", "氯仿国际运输如何分类？"),
          answer: bi("Chloroform is commonly identified as UN 1888, Class 6.1, Packing Group III. The current SDS, transport assessment, carrier rules and destination requirements must still be checked for each shipment.", "氯仿通常按 UN 1888、6.1 类、包装等级 III 识别；每票货物仍需核对当前 SDS、运输鉴定、承运人规则及目的地要求。"),
        },
        {
          question: bi("Which packing can be used for chloroform export?", "氯仿出口可以采用哪些包装？"),
          answer: bi("Packing is selected after reviewing grade, quantity, material compatibility, route, carrier acceptance and destination rules. The final approved packing governs the shipment.", "需结合牌号、数量、材料相容性、路线、承运人接受条件和目的地规则选择包装，最终以审核确认的包装方案为准。"),
        },
        {
          question: bi("Can you ship chloroform to Vietnam, India or Indonesia?", "可以向越南、印度或印度尼西亚供应氯仿吗？"),
          answer: bi("Potential shipments are reviewed order by order. Importer qualifications, declared end use, local permits, carrier acceptance, documents and destination port must be confirmed before quotation.", "潜在订单均需逐单审核，报价前应确认进口商资质、申报最终用途、当地许可、承运人接受条件、文件及目的港。"),
        },
      ],
    },
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
      "Aniline (CAS 62-53-3), also called aminobenzene or phenylamine, is an aromatic-amine intermediate used by qualified industrial manufacturers. From Dongying, ChinaChemExport coordinates regional supply channels, required specification and batch COA review, compatible packing, SDS and dangerous-goods export planning. The producer, availability and shipment route are confirmed for each order rather than assumed in advance.",
      "苯胺（CAS 62-53-3）又称氨基苯或苯基胺，是面向合格工业制造企业供应的芳香胺中间体。ChinaChemExport 立足东营，按订单协调区域供应渠道、指标与批次 COA 审核、相容包装、SDS 及危险品出口方案；生产企业、货源和运输路线均需逐单确认。",
    ),
    [
      bi("MDI and polyurethane-material production", "MDI 与聚氨酯材料生产"),
      bi("Rubber chemicals and processing additives", "橡胶助剂与加工添加剂"),
      bi("Dyes, pigments and color intermediates", "染料、颜料及着色中间体"),
      bi("Agrochemical, pharmaceutical and industrial synthesis", "农化、医药及工业合成"),
    ],
    {
      h1: bi("Aniline Supplier from China for Industrial Buyers", "中国苯胺供应与工业出口服务"),
      formula: "C₆H₇N",
      appearance: bi("Clear to slightly yellow liquid; final acceptance follows the agreed specification and batch COA", "无色至微黄色液体；最终验收以约定规格和批次 COA 为准"),
      storage: bi("Use controlled storage and handling conditions stated in the current shipment SDS; protect product quality from unsuitable exposure", "按照本批次 SDS 规定的受控条件储存和操作，并避免不当暴露影响产品质量"),
      faqs: [
        {
          question: bi("What information is required for an aniline quotation?", "苯胺询价需要提供哪些信息？"),
          answer: bi("Provide the required specification, application, quantity, packing preference, destination port, requested documents and shipment window. We then confirm the suitable supply and export route.", "请提供所需指标、用途、数量、包装偏好、目的港、文件要求和出运时间，我们再确认适用货源与出口路线。"),
        },
        {
          question: bi("Can you provide the SDS and batch COA for aniline?", "可以提供苯胺 SDS 和批次 COA 吗？"),
          answer: bi("The applicable SDS and batch COA are confirmed against the selected producer, grade and shipment before order execution.", "执行订单前，将根据选定生产企业、牌号和具体批次确认适用的 SDS 与 COA。"),
        },
        {
          question: bi("How is aniline classified for international transport?", "苯胺国际运输如何分类？"),
          answer: bi("Aniline is commonly identified as UN 1547, Class 6.1, Packing Group II. The current SDS, transport assessment, carrier rules and destination requirements must be checked for each shipment.", "苯胺通常按 UN 1547、6.1 类、包装等级 II 识别；每票货物仍需核对当前 SDS、运输鉴定、承运人规则及目的地要求。"),
        },
        {
          question: bi("Which packing can be used for aniline export?", "苯胺出口可以采用哪些包装？"),
          answer: bi("Packing is selected only after reviewing quantity, product compatibility, route, carrier acceptance and destination rules. The final approved packing governs the shipment.", "需结合数量、材料相容性、路线、承运人接受条件和目的地规则选择包装，最终以审核确认的包装方案为准。"),
        },
        {
          question: bi("Can you ship aniline to India, Vietnam or Indonesia?", "可以向印度、越南或印度尼西亚供应苯胺吗？"),
          answer: bi("Potential shipments are reviewed order by order. Importer qualifications, end use, local permits, carrier acceptance, documents and the destination port must be confirmed before quotation.", "潜在订单均需逐单审核，报价前应确认进口商资质、最终用途、当地许可、承运人接受条件、文件及目的港。"),
        },
      ],
    },
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
  const transportFacts = source.cas === "62-53-3"
    ? ["II (confirm for shipment)", "II（按具体出运确认）"]
    : source.cas === "67-66-3"
      ? ["III (confirm for shipment)", "III（按具体出运确认）"]
      : undefined;
  if (transportFacts) {
    specifications.push(
      { label: bi("Transport Class", "运输类别"), value: bi("Class 6.1 (confirm for shipment)", "6.1 类（按具体出运确认）") },
      { label: bi("Packing Group", "包装等级"), value: bi(transportFacts[0], transportFacts[1]) },
    );
  }
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
    h1: priority?.h1 || bi(`${nameEn} Supplier China`, `${nameZh}中国供应与出口服务`),
    subtitle: priority?.subtitle || bi("Industrial sourcing, documentation and export coordination", "工业采购、单证与出口协调"),
    overview,
    seoTitle: bi(source.seoTitle || (source.cas === "62-53-3" ? "Aniline Supplier China | CAS 62-53-3 Export" : source.cas === "67-66-3" ? "Chloroform Supplier China | CAS 67-66-3 Export" : `${nameEn} Supplier China | ChinaChemExport`), source.cas === "62-53-3" ? "苯胺中国供应与出口 | CAS 62-53-3" : source.cas === "67-66-3" ? "氯仿中国供应与出口 | CAS 67-66-3" : `${nameZh}中国供应商 | ChinaChemExport`),
    seoDescription: bi(
      source.seoDescription || (source.cas === "62-53-3" ? "Source aniline (CAS 62-53-3) from China with specification and COA review, SDS, compatible packing, UN 1547 documentation and export coordination." : source.cas === "67-66-3" ? "Source chloroform (trichloromethane, CAS 67-66-3) from China with SDS and COA review, UN 1888 packing and export coordination." : `Source ${nameEn} from China with specification confirmation, compliant packing, export documentation and international logistics coordination.`),
      source.cas === "62-53-3" ? "苯胺（CAS 62-53-3）中国供应与出口协调，涵盖规格及 COA 审核、SDS、相容包装、UN 1547 文件与危险品运输方案。" : source.cas === "67-66-3" ? "氯仿（三氯甲烷，CAS 67-66-3）中国供应与出口协调，涵盖 SDS 与 COA 审核、UN 1888 包装和出运方案。" : `${nameZh}中国供应服务，按订单确认规格、合规包装、出口单证及国际物流方案。`,
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
