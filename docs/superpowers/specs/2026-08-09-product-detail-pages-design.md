# ChinaChemExport Product Detail Pages Design

## Goal

Replace the product-detail modal URL behavior with reusable, SEO-friendly `/products/:slug` pages while preserving the product catalog, blog URLs, shared site chrome, existing imagery, and blue-white B2B visual language.

## Architecture

- Keep the current dependency-free history routing in `App.tsx`; do not introduce a router or restructure unrelated pages.
- Add a typed product-detail data module that adapts CMS products into a conservative page model. Five priority products receive reviewed enriched copy. Other active CMS products receive generic modules populated only from existing fields.
- Render a dedicated product page when a product slug is present. `/products` remains the catalog. Product cards navigate to the page rather than opening a modal.
- Keep the CMS as the source for name, CAS, UN number, category, description, specification, packing, image, SEO title, SEO description, and active status. Missing facts render as confirmation-required text or are omitted.

## Components

The page is split into focused components under `src/components/product/`: hero, overview, specification table, applications, packaging, export support, documents, FAQ, related-product links, and quote CTA. `ProductDetail.tsx` composes them and reuses the existing Header/Footer rendered by `App.tsx`.

## Data and Safety

- Stable slugs are derived from the English product name, with explicit aliases for established priority URLs.
- Detailed facts are provided only for DCM, DMC, TCM, Xylene, and Aniline when confirmed by existing project data or the approved requirement.
- Generic pages do not claim stock, certifications, factory ownership, exact logistics quantities, HS codes, formulas, appearances, shelf life, or document availability beyond request/confirmation language.
- CMS values override generic fallbacks. Inactive products do not appear in the frontend CMS query.

## SEO

Each detail route sets a unique title, meta description, canonical URL, Open Graph values, and JSON-LD for Product, BreadcrumbList, and FAQPage where FAQs exist. Breadcrumbs and related-product links provide crawlable internal navigation. Existing insight/article paths remain unchanged.

The committed static sitemap continues to list the current catalog. A local generator validates and regenerates known product URLs during the build workflow; newly created remote CMS products become routable immediately but enter the static sitemap on the next data-aware sitemap refresh/build.

## Error Handling

An unknown slug renders a clear product-not-found state with a link back to `/products`. Missing optional fields are omitted or described as subject to quotation/COA confirmation. Image fallbacks use the existing product icon treatment.

## Verification

- Automated tests cover slug stability, priority enrichment, conservative generic fallbacks, SEO fields, and sitemap URL generation.
- Run lint and the full TypeScript/Vite production build.
- Inspect `/products`, all five priority detail routes, an ordinary generic product route, an unknown slug, an existing insight URL, and responsive layouts at desktop and mobile widths.

## Non-goals

No deployment, push, Git commit, CMS schema migration, ecommerce checkout, blog URL change, company-credential claim, or whole-site refactor.
