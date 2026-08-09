import assert from "node:assert/strict";
import test from "node:test";
import { detailContentFromForm, detailFormFromContent } from "../src/productAdminDetail.ts";

test("serializes multiline admin fields into structured product detail content", () => {
  const content = detailContentFromForm({
    detail_h1: "Custom heading",
    detail_applications: "Coatings\nMetal cleaning\n",
    detail_documents: "MSDS | Confirm per order | https://example.com/msds.pdf\nCOA",
    detail_faq_questions: "Is COA available?\nWhat packing is offered?",
    detail_faq_answers: "Confirmed by batch.\nConfirmed per order.",
  });

  assert.deepEqual(content.applications, ["Coatings", "Metal cleaning"]);
  assert.deepEqual(content.documents?.[0], { name: "MSDS", note: "Confirm per order", url: "https://example.com/msds.pdf" });
  assert.equal(content.faqs?.length, 2);
  assert.equal(content.h1, "Custom heading");
});

test("restores structured content into editable admin fields", () => {
  const form = detailFormFromContent({
    applications: ["Coatings", "Cleaning"],
    documents: [{ name: "MSDS", note: "Per order", url: "https://example.com/a.pdf" }],
    faqs: [{ question: "Question", answer: "Answer" }],
  });

  assert.equal(form.detail_applications, "Coatings\nCleaning");
  assert.equal(form.detail_documents, "MSDS | Per order | https://example.com/a.pdf");
  assert.equal(form.detail_faq_questions, "Question");
  assert.equal(form.detail_faq_answers, "Answer");
});
