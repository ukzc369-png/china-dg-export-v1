import assert from "node:assert/strict";
import test from "node:test";
import { formatInquiryProduct } from "../src/inquiryPrefill.ts";

test("formats product inquiry value from product data", () => {
  const value = formatInquiryProduct({
    name: { en: "Methylene Chloride (DCM)", zh: "二氯甲烷" },
    cas: "75-09-2",
    un: "1593",
  }, "en");
  assert.equal(value, "Methylene Chloride (DCM) / CAS 75-09-2 / UN 1593");
});

