import type { Lang } from "./productDetails";

type InquiryProduct = {
  name: Record<Lang, string>;
  cas: string;
  un?: string;
};

export function formatInquiryProduct(product: InquiryProduct, lang: Lang): string {
  const un = product.un?.trim();
  return `${product.name[lang]} / CAS ${product.cas}${un ? ` / UN ${un}` : ""}`;
}

