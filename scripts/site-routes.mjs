export const productRoutes = [
  ["aniline", "Aniline", "62-53-3", "Amines"],
  ["cyclohexanone", "Cyclohexanone", "108-94-1", "Ketones"],
  ["dimethylformamide-dmf", "Dimethylformamide (DMF)", "68-12-2", "Amides"],
  ["glacial-acetic-acid-gaa", "Glacial Acetic Acid (GAA)", "64-19-7", "Organic Acids"],
  ["methylene-chloride-dcm", "Methylene Chloride (DCM)", "75-09-2", "Chlorinated Solvents"],
  ["trichloromethane-tcm", "Trichloromethane (Chloroform)", "67-66-3", "Chlorinated Solvents"],
  ["trichloroethylene-tce", "Trichloroethylene (TCE)", "79-01-6", "Chlorinated Solvents"],
  ["perchloroethylene-pce", "Perchloroethylene (PCE)", "127-18-4", "Chlorinated Solvents"],
  ["monoethanolamine-mea", "Monoethanolamine (MEA)", "141-43-5", "Amines"],
  ["diethanolamine-dea", "Diethanolamine (DEA)", "111-42-2", "Amines"],
  ["furfuryl-alcohol", "Furfuryl Alcohol", "98-00-0", "Alcohols"],
  ["toluene-diisocyanate-20-80-tdi-20-80", "Toluene Diisocyanate 80/20 (TDI)", "584-84-9", "Isocyanates"],
  ["propylene-glycol-pg", "Propylene Glycol (PG)", "57-55-6", "Alcohols"],
  ["2-ethylhexanol-2eh", "2-Ethylhexanol (2-EH)", "104-76-7", "Alcohols"],
  ["n-butanol-nba", "N-Butanol (NBA)", "71-36-3", "Alcohols"],
  ["dimethyl-carbonate-dmc", "Dimethyl Carbonate (DMC)", "616-38-6", "Carbonates"],
  ["formic-acid-85", "Formic Acid 85%", "64-18-6", "Organic Acids"],
  ["propionic-acid-pa", "Propionic Acid", "79-09-4", "Organic Acids"],
  ["acrylic-acid-aa", "Acrylic Acid", "79-10-7", "Organic Acids"],
  ["methacrylic-acid-maa", "Methacrylic Acid", "79-41-4", "Organic Acids"],
  ["styrene-sm", "Styrene Monomer", "100-42-5", "Chemical Intermediates"],
  ["phenol", "Phenol", "108-95-2", "Chemical Intermediates"],
  ["1-2-dichloroethane-edc", "1,2-Dichloroethane (EDC)", "107-06-2", "Chlorinated Solvents"],
  ["methanol", "Methanol", "67-56-1", "Alcohols"],
  ["toluene-tol", "Toluene", "108-88-3", "Aromatic Solvents"],
  ["acetone-ac", "Acetone", "67-64-1", "Ketones"],
  ["epichlorohydrin-ech", "Epichlorohydrin (ECH)", "106-89-8", "Chemical Intermediates"],
  ["vinyl-acetate-monomer-vam", "Vinyl Acetate Monomer (VAM)", "108-05-4", "Chemical Intermediates"],
  ["1-4-butanediol-bdo", "1,4-Butanediol (BDO)", "110-63-4", "Alcohols"],
  ["butyl-cellosolve-bcs", "Butyl Cellosolve (BCS)", "111-76-2", "Glycol Ethers"],
  ["isobutanol-iba", "Isobutanol (IBA)", "78-83-1", "Alcohols"],
  ["methylcyclohexane-mch", "Methylcyclohexane (MCH)", "108-87-2", "Hydrocarbon Solvents"],
  ["triethylamine-tea", "Triethylamine (TEA)", "121-44-8", "Amines"],
  ["xylene", "Xylene", "1330-20-7", "Aromatic Solvents"],
].map(([slug, name, cas, category]) => ({ slug, name, cas, category }));

export const coreRoutes = [
  { path: "/", seoTitle: "Chemical Export Service China | Sourcing & Shipping", title: "China Chemical Sourcing & Export Support", description: "Compare qualified Chinese chemical suppliers, specifications, SDS, COA, packing and shipment options with an independent coordinator based in Shandong.", heading: "China Chemical Sourcing & Export Support", links: [["/chemical-sourcing", "Review chemical sourcing support"], ["/products", "Browse chemical products"], ["/contact", "Discuss your requirement"]] },
  { path: "/products", title: "Chemicals Sourced from China", description: "Browse chemicals that can be reviewed for supplier, specification, availability, packing and export feasibility.", heading: "Chemicals I Can Help You Source from China", links: [["/export-support", "View export support"], ["/contact", "Ask about a product"]] },
  { path: "/about", title: "Independent Chemical Sourcing Coordinator in Shandong", description: "Learn how an independent coordinator connects overseas buyers with reviewed chemical supply and qualified export-service resources.", heading: "Your Local Chemical Sourcing Coordinator in Shandong", links: [["/chemical-sourcing", "Chemical sourcing"], ["/contact", "Contact me"]] },
  { path: "/chemical-sourcing", seoTitle: "Chemical Sourcing Service China | Supplier & Price Review", title: "Chemical Sourcing in China, Coordinated from Shandong", description: "Compare suitable Chinese chemical suppliers, specifications, current availability, batch COA, SDS, packing, prices and export feasibility before quotation.", heading: "Chemical Sourcing in China, Coordinated from Shandong", links: [["/products/dimethyl-carbonate-dmc", "Review DMC sourcing"], ["/products/trichloromethane-tcm", "Review chloroform sourcing"], ["/products/methylene-chloride-dcm", "Review DCM sourcing"], ["/contact", "Send your requirement"]] },
  { path: "/export-support", title: "Chemical Export Support from China", description: "Coordinate qualified repacking, inspection, dangerous-goods documents, customs declaration, vessel booking and port follow-up.", heading: "Chemical Export Support from Preparation to Shipment", links: [["/products", "Browse products"], ["/contact", "Request an export review"]] },
  { path: "/shandong-supply-base", title: "Shandong Chemical Supply Base", description: "A buyer-focused introduction to chemical sourcing from Shandong's petrochemical supply base and regional export-service resources.", heading: "Sourcing Chemicals from Shandong's Petrochemical Supply Base", links: [["/insights", "Read buyer guides"], ["/contact", "Discuss a requirement"]] },
  { path: "/insights", title: "Chemical Export Insights", description: "Practical guides on chemical sourcing, compliance, documentation, packaging and shipping from China.", heading: "Chemical Export Insights", links: [["/products", "Browse products"], ["/contact", "Contact our export team"]] },
  { path: "/contact", title: "Submit a Chemical Sourcing Requirement", description: "Send your product, specification, quantity, packaging and destination requirements for a transaction-specific supply and export review.", heading: "Tell Me What You Need to Source", links: [["/products", "Browse products"], ["/export-support", "Review export support"]] },
  { path: "/dangerous-goods", title: "Dangerous Goods Chemical Export", description: "Review dangerous-goods packaging, documentation, declaration and shipping coordination for chemical exports from China.", heading: "Dangerous Goods Chemical Export", links: [["/export-support", "Export support"], ["/contact", "Request a review"]] },
  { path: "/privacy", title: "Privacy Policy", description: "Privacy policy for ChinaChemExport website visitors and inquiry submissions.", heading: "Privacy Policy", links: [["/", "Home"], ["/contact", "Contact us"]] },
  { path: "/terms", title: "Terms of Use", description: "Terms governing use of the ChinaChemExport website and its informational content.", heading: "Terms of Use", links: [["/", "Home"], ["/contact", "Contact us"]] },
  { path: "/cookies", title: "Cookie Policy", description: "Information about cookies and analytics used on the ChinaChemExport website.", heading: "Cookie Policy", links: [["/privacy", "Privacy policy"], ["/contact", "Contact us"]] },
];

export const insightRouteDetails = [
  ["xylene-china-kenya-export-cif-mombasa-guide", "Xylene from China to Kenya: Mombasa Export Guide", "A buyer-focused guide to mixed xylene specifications, drum packing, FOB Qingdao, CIF Mombasa and Kenya import preparation."],
  ["white-oil-liquid-paraffin-durban-import-specification-guide", "White Oil Supplier China: Flexibag & Durban Import Guide", "Compare China white oil and liquid paraffin suppliers, viscosity and flash point specifications, batch documents, Flexibag packing and Durban import requirements."],
  ["chemical-export-service-china-supplier-price-document-guide", "Chemical Export Service China: Compare Suppliers, Prices and Documents", "A practical guide to comparing Chinese chemical suppliers, current pricing, TDS, SDS, COA, export packing and shipment feasibility before quotation."],
  ["how-to-export-dichloromethane-from-china", "How to Export Dichloromethane from China", "A practical guide to dichloromethane sourcing, documents, packaging and dangerous-goods shipping from China."],
  ["one-stop-chemical-export-compliance-services-from-china", "One-stop Chemical Export Compliance Services from China", "How chemical buyers can coordinate sourcing, compliance documents, packaging and export shipping through one workflow."],
  ["inland-port-chemical-export-services-china", "Inland Port Chemical Export Services in China", "How inland-port warehousing, consolidation, repacking and customs coordination support chemical exports from China."],
  ["dongying-strategic-gateway-chemical-exports-china", "Dongying: A Strategic Gateway for Chemical Exports from China", "An introduction to Dongying's petrochemical supply base and its role in chemical sourcing and export coordination."],
  ["factory-to-port-chemical-export-compliance-workflow-china", "Factory-to-Port Chemical Export Compliance Workflow", "A step-by-step overview of supplier checks, specifications, documents, packaging and port execution for chemical exports."],
  ["how-to-export-dangerous-goods-from-china", "How to Export Dangerous Goods from China", "A buyer-focused guide to dangerous-goods classification, packaging, labels, declarations and shipping from China."],
  ["dimethyl-carbonate-supplier-china-export-guide", "Dimethyl Carbonate Supplier China | DMC Export Guide", "Compare DMC suppliers in China by grade, specification, batch COA, SDS, packing, current availability and export feasibility before quotation."],
  ["dimethyl-carbonate-vietnam-china-supplier-guide", "DMC Supplier China to Vietnam | Packing & Import Guide", "A Vietnam-focused DMC sourcing guide covering supplier review, specification, drum or ISO tank packing, documents, importer checks and shipment coordination."],
  ["methylene-chloride-india-dcm-msds-china-supply-guide", "Methylene Chloride China to India | MSDS & Packing", "Source methylene chloride from China to India with specification, MSDS, batch COA, UN packing, importer and shipment-route checks before quotation."],
  ["chloroform-supplier-china-vietnam-import-guide", "Chloroform China to Vietnam | SDS, COA & Shipping", "Source chloroform from China to Vietnam with grade, SDS, batch COA, UN 1888 packing, precursor controls, importer and carrier checks before quotation."],
].map(([slug, title, description]) => ({
  kind: "insight",
  slug,
  path: `/insights/${slug}`,
  title,
  description,
  heading: title,
  links: [["/insights", "More export insights"], ["/contact", "Request a supply review"]],
}));

const insightLinksBySlug = {
  "xylene-china-kenya-export-cif-mombasa-guide": [
    ["/products/xylene", "View Xylene product details"],
    ["/chemical-sourcing", "Review chemical sourcing support"],
    ["/contact", "Request a Xylene supply review"],
  ],
  "white-oil-liquid-paraffin-durban-import-specification-guide": [
    ["/chemical-sourcing", "Review chemical sourcing support"],
    ["/export-support", "Review export support"],
    ["/products", "Browse chemical products"],
    ["/contact", "Request a white oil supply review"],
  ],
  "chemical-export-service-china-supplier-price-document-guide": [
    ["/chemical-sourcing", "Review chemical sourcing support"],
    ["/export-support", "Review export support"],
    ["/contact", "Send a chemical sourcing requirement"],
  ],
  "dimethyl-carbonate-supplier-china-export-guide": [
    ["/products/dimethyl-carbonate-dmc", "View Dimethyl Carbonate product details"],
    ["/insights/dimethyl-carbonate-vietnam-china-supplier-guide", "Read the DMC Vietnam supply guide"],
    ["/contact", "Request a DMC supply review"],
  ],
  "dimethyl-carbonate-vietnam-china-supplier-guide": [
    ["/products/dimethyl-carbonate-dmc", "View Dimethyl Carbonate product details"],
    ["/insights/dimethyl-carbonate-supplier-china-export-guide", "Read the DMC China export guide"],
    ["/contact", "Request a DMC supply review"],
  ],
  "methylene-chloride-india-dcm-msds-china-supply-guide": [
    ["/products/methylene-chloride-dcm", "View Methylene Chloride product details"],
    ["/insights/how-to-export-dichloromethane-from-china", "Read the DCM export compliance guide"],
    ["/contact", "Request a DCM supply review"],
  ],
  "how-to-export-dichloromethane-from-china": [
    ["/products/methylene-chloride-dcm", "View Methylene Chloride product details"],
    ["/insights/methylene-chloride-india-dcm-msds-china-supply-guide", "Read the DCM India supply guide"],
    ["/contact", "Request a DCM supply review"],
  ],
  "chloroform-supplier-china-vietnam-import-guide": [
    ["/products/trichloromethane-tcm", "View Chloroform product details"],
    ["/dangerous-goods", "Review dangerous-goods export support"],
    ["/contact", "Request a chloroform supply review"],
  ],
};

for (const route of insightRouteDetails) {
  route.links = insightLinksBySlug[route.slug] ?? route.links;
  if ([
    "white-oil-liquid-paraffin-durban-import-specification-guide",
    "dimethyl-carbonate-supplier-china-export-guide",
    "dimethyl-carbonate-vietnam-china-supplier-guide",
    "methylene-chloride-india-dcm-msds-china-supply-guide",
    "chloroform-supplier-china-vietnam-import-guide",
  ].includes(route.slug)) route.seoTitle = route.title;
  if (route.slug === "xylene-china-kenya-export-cif-mombasa-guide") {
    route.author = "Evan Cole";
    route.datePublished = "2026-10-14";
    route.image = "/blog/xylene-kenya-export-guide-cover.png";
    route.faqs = [
      ["Is mixed xylene the same as every product sold as Xylene?", "No. Composition and quality limits vary by grade and producer, so confirm the TDS and COA."],
      ["Can 180 kg drums be used instead of 170 kg drums?", "Only after the buyer confirms the change because drum size affects loading and final net quantity."],
      ["Who buys marine insurance under FOB Qingdao?", "The buyer normally arranges the main carriage and insurance under FOB, subject to the agreed contract."],
    ];
  }
  if (route.slug === "white-oil-liquid-paraffin-durban-import-specification-guide") {
    route.author = "Evan Cole";
    route.datePublished = "2026-10-09";
    route.image = "/blog/white-oil-durban-import-guide-cover.png";
    route.faqs = [
      ["Is white oil the same as liquid paraffin?", "The names can overlap in trade, but grade, CAS, specification and intended use must be confirmed from current documents."],
      ["Can white oil be shipped in a Flexibag?", "Potentially, subject to product compatibility, liner, carrier, terminal and destination requirements."],
      ["What documents should a Durban buyer request?", "Confirm the transaction-specific set, commonly including TDS, SDS, batch COA, invoice, packing list and bill of lading."],
    ];
  }
  if (route.slug === "chemical-export-service-china-supplier-price-document-guide") {
    route.author = "Evan Cole";
    route.datePublished = "2026-10-20";
    route.image = "/blog/chemical-export-service-china-guide-cover.png";
    route.faqs = [
      ["Can a China chemical export service guarantee the lowest price?", "No. Suppliers and prices must be compared on the same specification, packing, quantity, Incoterm and shipment basis."],
      ["Which documents should be checked before quotation?", "Review the current TDS, SDS, batch COA and any route-specific dangerous-goods or packing documents."],
      ["What should a buyer send for a useful review?", "Send the product and CAS, specification, quantity, packing, destination port, Incoterm, schedule and required documents."],
    ];
  }
  if (route.slug === "chloroform-supplier-china-vietnam-import-guide") {
    route.author = "Evan Cole";
    route.datePublished = "2026-09-05";
    route.image = "/blog/chloroform-vietnam-cover.webp";
    route.faqs = [
      ["Is chloroform the same as trichloromethane?", "Yes. Chloroform is the common name for trichloromethane, CAS 67-66-3, molecular formula CHCl3."],
      ["What is the UN number for chloroform?", "Chloroform is commonly identified as UN 1888, Class 6.1, Packing Group III. Shipment-specific documents must still be checked."],
      ["Can chloroform be exported from China to Vietnam?", "A potential shipment requires review of Chinese precursor-chemical controls, current Vietnamese import obligations and carrier acceptance."],
      ["What is required for a chloroform quotation?", "Provide specification, stabilizer requirement, quantity, packing, destination, importer and final-user details, end use, documents and shipment window."],
    ];
  }
}

export const insightRoutes = insightRouteDetails.map(({ slug }) => slug);
