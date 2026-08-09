# Product Detail Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build data-driven, SEO-ready independent pages for every active ChinaChemExport product, with enriched pages for DCM, DMC, TCM, Xylene, and Aniline.

**Architecture:** Preserve the existing history-based routing and shared shell. Add a typed product-page adapter and focused presentation components, then switch product card navigation from modal rendering to a dedicated route view.

**Tech Stack:** React 19, TypeScript 6, Vite 8, Node built-in test runner, existing CSS.

## Global Constraints

- Do not change existing blog URLs.
- Do not invent specifications, certifications, inventory, company qualifications, exact loading quantities, or factory ownership.
- Reuse existing Header, Footer, product images, blue-white styles, and CMS records.
- Do not deploy, push, or commit.

---

### Task 1: Product Page Data Contract

**Files:**
- Create: `src/productDetails.ts`
- Test: `tests/productDetails.test.ts`

**Interfaces:**
- Consumes: current CMS-normalized `Product` values.
- Produces: `productSlug`, `buildProductDetail`, priority enrichment, conservative generic defaults, and related product selection.

- [ ] Write tests for stable slugs, five priority records, generic fallback omissions, and unknown facts.
- [ ] Run the focused test and verify it fails because the module is absent.
- [ ] Implement the minimal typed data adapter.
- [ ] Run the focused test and verify it passes.

### Task 2: Independent Detail Template

**Files:**
- Create: `src/ProductDetail.tsx`
- Create: `src/components/product/*.tsx`
- Create: `src/product-detail.css`
- Modify: `src/App.tsx`
- Test: `tests/productRouting.test.ts`

**Interfaces:**
- Consumes: `buildProductDetail(product)` and current navigation/inquiry callbacks.
- Produces: full-page Hero, Overview, Specifications, Applications, Packaging, Export Support, Why Choose, Documents, FAQ, related links, and Quote CTA.

- [ ] Write routing/source assertions showing `/products/:slug` must select a page view rather than a modal.
- [ ] Run the test and verify the current modal implementation fails it.
- [ ] Extract shared product types, wire dedicated route state, and render the new template.
- [ ] Change catalog actions to `View Product`; preserve `/products` catalog behavior.
- [ ] Add responsive blue-white styles and accessible landmarks.
- [ ] Run the focused test and production typecheck.

### Task 3: SEO and Structured Data

**Files:**
- Create: `src/productSeo.ts`
- Modify: `src/ProductDetail.tsx`
- Test: `tests/productSeo.test.ts`

**Interfaces:**
- Consumes: product detail model and canonical slug.
- Produces: metadata and Product, BreadcrumbList, and FAQPage JSON-LD objects.

- [ ] Write tests for titles, canonical URLs, breadcrumbs, safe image URLs, and FAQ schema.
- [ ] Run the test and verify it fails because helpers are absent.
- [ ] Implement metadata and schema helpers and mount/unmount tags in the detail page.
- [ ] Run the focused test and verify it passes.

### Task 4: Sitemap and Internal Links

**Files:**
- Create: `scripts/generate-sitemap.mjs`
- Modify: `package.json`
- Modify: `public/sitemap.xml`
- Test: `tests/sitemap.test.mjs`

**Interfaces:**
- Consumes: known product slugs and established static/article URLs.
- Produces: deterministic sitemap XML without changing blog URLs.

- [ ] Write a test asserting priority, generic product, and existing insight URLs are retained.
- [ ] Run the test and verify generator absence fails it.
- [ ] Implement deterministic generation and add a local script.
- [ ] Regenerate sitemap and run the focused test.

### Task 5: Full Verification

**Files:**
- Modify only files needed to fix discovered regressions.

- [ ] Run all Node tests.
- [ ] Run `npm run lint` and address errors in task-owned files.
- [ ] Run `npm run build` and confirm a clean exit.
- [ ] Start the local preview and inspect catalog, five priority products, one generic product, unknown slug, and an existing insight URL.
- [ ] Inspect desktop and mobile widths, keyboard-visible actions, metadata, schemas, canonical links, and absence of horizontal overflow.
- [ ] Review `git diff` to confirm unrelated existing changes were preserved and no deployment/push/commit occurred.
