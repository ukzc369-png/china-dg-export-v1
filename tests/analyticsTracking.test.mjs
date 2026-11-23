import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const analytics = readFileSync(new URL("../src/analytics.ts", import.meta.url), "utf8");
const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
const approvedHome = readFileSync(new URL("../src/HomePageApproved.tsx", import.meta.url), "utf8");
const approvedPages = readFileSync(new URL("../src/NewSiteApp.tsx", import.meta.url), "utf8");

test("tracks the complete inquiry conversion funnel without personal fields", () => {
  for (const eventName of ["form_start", "inquiry_cta_click", "email_click", "form_submit_error", "generate_lead"]) {
    assert.match(analytics, new RegExp(`\\"${eventName}\\"`));
  }
  for (const personalField of ["email", "name", "company", "contact", "message"]) {
    assert.doesNotMatch(analytics, new RegExp(`(?:\\"|')${personalField}(?:\\"|')\\s*:`));
  }
});

test("wires tracking to every live inquiry form and contact route", () => {
  for (const formName of [
    "homepage_requirement_form",
    "contact_full_form",
    "russian_sourcing_form",
    "russian_aniline_form",
  ]) {
    assert.ok(approvedHome.includes(formName) || approvedPages.includes(formName), `${formName} is not tracked`);
  }
  assert.match(app, /trackInquiryCta\("site_navigation"\)/);
  assert.match(app, /a\[href\^="mailto:"\]/);
});
