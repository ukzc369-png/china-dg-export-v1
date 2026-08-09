import type { ProductDetailContent } from "./productDetails";

export type ProductDetailFormFields = {
  detail_h1?: string;
  detail_subtitle?: string;
  detail_overview?: string;
  detail_formula?: string;
  detail_hs_code?: string;
  detail_appearance?: string;
  detail_storage?: string;
  detail_applications?: string;
  detail_overview_image?: string;
  detail_packaging_image?: string;
  detail_bulk_image?: string;
  detail_documents?: string;
  detail_faq_questions?: string;
  detail_faq_answers?: string;
  detail_cta_title?: string;
  detail_cta_text?: string;
};

const lines = (value?: string) => (value || "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
const clean = (value?: string) => value?.trim() || undefined;

export function detailContentFromForm(form: ProductDetailFormFields): ProductDetailContent {
  const questions = lines(form.detail_faq_questions);
  const answers = lines(form.detail_faq_answers);
  const applications = lines(form.detail_applications);
  const documents = lines(form.detail_documents).map((line) => {
    const [name = "", note = "", url = ""] = line.split("|").map((item) => item.trim());
    return { name, ...(note ? { note } : {}), ...(url ? { url } : {}) };
  }).filter((item) => item.name);
  const faqs = questions.map((question, index) => ({ question, answer: answers[index] || "" })).filter((item) => item.answer);

  return {
    ...(clean(form.detail_h1) ? { h1: clean(form.detail_h1) } : {}),
    ...(clean(form.detail_subtitle) ? { subtitle: clean(form.detail_subtitle) } : {}),
    ...(clean(form.detail_overview) ? { overview: clean(form.detail_overview) } : {}),
    ...(clean(form.detail_formula) ? { formula: clean(form.detail_formula) } : {}),
    ...(clean(form.detail_hs_code) ? { hsCode: clean(form.detail_hs_code) } : {}),
    ...(clean(form.detail_appearance) ? { appearance: clean(form.detail_appearance) } : {}),
    ...(clean(form.detail_storage) ? { storage: clean(form.detail_storage) } : {}),
    ...(applications.length ? { applications } : {}),
    ...(clean(form.detail_overview_image) ? { overviewImage: clean(form.detail_overview_image) } : {}),
    ...(clean(form.detail_packaging_image) ? { packagingImage: clean(form.detail_packaging_image) } : {}),
    ...(clean(form.detail_bulk_image) ? { bulkImage: clean(form.detail_bulk_image) } : {}),
    ...(documents.length ? { documents } : {}),
    ...(faqs.length ? { faqs } : {}),
    ...(clean(form.detail_cta_title) ? { ctaTitle: clean(form.detail_cta_title) } : {}),
    ...(clean(form.detail_cta_text) ? { ctaText: clean(form.detail_cta_text) } : {}),
  };
}

export function detailFormFromContent(content?: ProductDetailContent | null): ProductDetailFormFields {
  const value = content || {};
  return {
    detail_h1: value.h1 || "",
    detail_subtitle: value.subtitle || "",
    detail_overview: value.overview || "",
    detail_formula: value.formula || "",
    detail_hs_code: value.hsCode || "",
    detail_appearance: value.appearance || "",
    detail_storage: value.storage || "",
    detail_applications: value.applications?.join("\n") || "",
    detail_overview_image: value.overviewImage || "",
    detail_packaging_image: value.packagingImage || "",
    detail_bulk_image: value.bulkImage || "",
    detail_documents: value.documents?.map((item) => [item.name, item.note, item.url].filter(Boolean).join(" | ")).join("\n") || "",
    detail_faq_questions: value.faqs?.map((item) => item.question).join("\n") || "",
    detail_faq_answers: value.faqs?.map((item) => item.answer).join("\n") || "",
    detail_cta_title: value.ctaTitle || "",
    detail_cta_text: value.ctaText || "",
  };
}
