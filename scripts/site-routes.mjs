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
  { path: "/", title: "Chemical Export Services from China", description: "ChinaChemExport coordinates chemical sourcing, specifications, packaging, export documentation and international shipping from Dongying, China.", heading: "Chemical Export Services from China", links: [["/products", "Browse chemical products"], ["/contact", "Request a quotation"]] },
  { path: "/products", title: "Bulk Chemical Products from China", description: "Browse bulk solvents, intermediates, alcohols, glycols, acids and amines supplied from China with export documentation and shipping coordination.", heading: "Bulk Chemical Products from China", links: [["/services", "View export services"], ["/contact", "Ask about a product"]] },
  { path: "/about", title: "About ChinaChemExport", description: "Learn how ChinaChemExport coordinates chemical supply and export execution from the Dongying petrochemical region in China.", heading: "About ChinaChemExport", links: [["/services", "Our services"], ["/contact", "Contact us"]] },
  { path: "/services", title: "Chemical Export Services", description: "Chemical sourcing, specification review, packaging, documentation, dangerous-goods handling and international shipping coordination from China.", heading: "Chemical Export Services", links: [["/products", "Browse products"], ["/contact", "Request a shipping review"]] },
  { path: "/markets", title: "Chemical Export Markets", description: "Chemical supply and export coordination for buyers in Southeast Asia, India, the Middle East, Russia, Africa and South America.", heading: "Chemical Export Markets", links: [["/insights", "Read market guides"], ["/contact", "Discuss your destination"]] },
  { path: "/insights", title: "Chemical Export Insights", description: "Practical guides on chemical sourcing, compliance, documentation, packaging and shipping from China.", heading: "Chemical Export Insights", links: [["/products", "Browse products"], ["/contact", "Contact our export team"]] },
  { path: "/contact", title: "Contact ChinaChemExport", description: "Send your product, specification, quantity, packaging and destination requirements for a chemical supply and shipping review.", heading: "Contact ChinaChemExport", links: [["/products", "Browse products"], ["/services", "Review our services"]] },
  { path: "/dangerous-goods", title: "Dangerous Goods Chemical Export", description: "Review dangerous-goods packaging, documentation, declaration and shipping coordination for chemical exports from China.", heading: "Dangerous Goods Chemical Export", links: [["/services", "Export services"], ["/contact", "Request a review"]] },
  { path: "/privacy", title: "Privacy Policy", description: "Privacy policy for ChinaChemExport website visitors and inquiry submissions.", heading: "Privacy Policy", links: [["/", "Home"], ["/contact", "Contact us"]] },
  { path: "/terms", title: "Terms of Use", description: "Terms governing use of the ChinaChemExport website and its informational content.", heading: "Terms of Use", links: [["/", "Home"], ["/contact", "Contact us"]] },
  { path: "/cookies", title: "Cookie Policy", description: "Information about cookies and analytics used on the ChinaChemExport website.", heading: "Cookie Policy", links: [["/privacy", "Privacy policy"], ["/contact", "Contact us"]] },
];

export const insightRouteDetails = [
  ["how-to-export-dichloromethane-from-china", "How to Export Dichloromethane from China", "A practical guide to dichloromethane sourcing, documents, packaging and dangerous-goods shipping from China."],
  ["one-stop-chemical-export-compliance-services-from-china", "One-stop Chemical Export Compliance Services from China", "How chemical buyers can coordinate sourcing, compliance documents, packaging and export shipping through one workflow."],
  ["inland-port-chemical-export-services-china", "Inland Port Chemical Export Services in China", "How inland-port warehousing, consolidation, repacking and customs coordination support chemical exports from China."],
  ["dongying-strategic-gateway-chemical-exports-china", "Dongying: A Strategic Gateway for Chemical Exports from China", "An introduction to Dongying's petrochemical supply base and its role in chemical sourcing and export coordination."],
  ["factory-to-port-chemical-export-compliance-workflow-china", "Factory-to-Port Chemical Export Compliance Workflow", "A step-by-step overview of supplier checks, specifications, documents, packaging and port execution for chemical exports."],
  ["how-to-export-dangerous-goods-from-china", "How to Export Dangerous Goods from China", "A buyer-focused guide to dangerous-goods classification, packaging, labels, declarations and shipping from China."],
  ["dimethyl-carbonate-supplier-china-export-guide", "Dimethyl Carbonate Supplier and Export Guide from China", "How to source dimethyl carbonate from China, compare specifications, confirm packaging and prepare export documents."],
  ["dimethyl-carbonate-vietnam-china-supplier-guide", "Dimethyl Carbonate Supply from China to Vietnam", "A Vietnam-focused guide to DMC sourcing, specifications, packaging, documents and shipping coordination from China."],
  ["methylene-chloride-india-dcm-msds-china-supply-guide", "Methylene Chloride Supply from China to India", "An India-focused guide to methylene chloride sourcing, MSDS review, packaging and shipping coordination from China."],
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
};

for (const route of insightRouteDetails) {
  route.links = insightLinksBySlug[route.slug] ?? route.links;
}

export const insightRoutes = insightRouteDetails.map(({ slug }) => slug);
