export const productNameZh: Record<string, string> = {
  "Aniline": "苯胺",
  "Cyclohexanone": "环己酮",
  "Dimethylformamide (DMF)": "二甲基甲酰胺（DMF）",
  "Glacial Acetic Acid (GAA)": "冰醋酸（GAA）",
  "Methylene Chloride (DCM)": "二氯甲烷（DCM）",
  "Trichloromethane (TCM)": "三氯甲烷（TCM）",
  "Trichloroethylene (TCE)": "三氯乙烯（TCE）",
  "Perchloroethylene (PCE)": "四氯乙烯（PCE）",
  "Monoethanolamine (MEA)": "一乙醇胺（MEA）",
  "Diethanolamine (DEA)": "二乙醇胺（DEA）",
  "Furfuryl Alcohol": "糠醇",
  "Toluene Diisocyanate 20/80 (TDI 20/80)": "甲苯二异氰酸酯 20/80（TDI 20/80）",
  "Propylene Glycol (PG)": "丙二醇（PG）",
  "2-Ethylhexanol (2EH)": "2-乙基己醇（2EH）",
  "n-Butanol (NBA)": "正丁醇（NBA）",
  "Dimethyl Carbonate (DMC)": "碳酸二甲酯（DMC）",
  "Formic Acid 85%": "85% 甲酸",
  "Propionic Acid (PA)": "丙酸（PA）",
  "Acrylic Acid (AA)": "丙烯酸（AA）",
  "Methacrylic Acid (MAA)": "甲基丙烯酸（MAA）",
  "Styrene (SM)": "苯乙烯（SM）",
  "Phenol": "苯酚",
  "1,2-Dichloroethane (EDC)": "1,2-二氯乙烷（EDC）",
  "Methanol": "甲醇",
  "Toluene (TOL)": "甲苯（TOL）",
  "Acetone (AC)": "丙酮（AC）",
  "Epichlorohydrin (ECH)": "环氧氯丙烷（ECH）",
  "Vinyl Acetate Monomer (VAM)": "醋酸乙烯单体（VAM）",
  "1,4-Butanediol (BDO)": "1,4-丁二醇（BDO）",
  "Butyl Cellosolve (BCS)": "乙二醇丁醚（BCS）",
  "Isobutanol (IBA)": "异丁醇（IBA）",
  "Methylcyclohexane (MCH)": "甲基环己烷（MCH）",
  "Triethylamine (TEA)": "三乙胺（TEA）",
  "Xylene": "二甲苯",
};

export const productCategoryZh: Record<string, string> = {
  "Chemical Intermediates": "化工中间体",
  "Organic Acids": "有机酸",
  "Chlorinated Solvents": "含氯溶剂",
  "Amines": "胺类",
  "Alcohols": "醇类",
  "Isocyanates": "异氰酸酯",
  "Alcohols & Glycols": "醇类与二醇类",
  "General Solvents": "通用溶剂",
};

function normalizedLookup(map: Record<string, string>, value: string) {
  const normalized = value.trim().toLowerCase();
  const match = Object.entries(map).find(([key]) => key.trim().toLowerCase() === normalized);
  return match?.[1] || value;
}

export function translateProductNameZh(name: string) {
  return normalizedLookup(productNameZh, name);
}

export function translateProductCategoryZh(category: string) {
  return normalizedLookup(productCategoryZh, category);
}
