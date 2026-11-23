const CONSENT_KEY = "chinachemexport-analytics-consent";
const MEASUREMENT_ID = "G-LX6Z6RLDEP";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

let lastTrackedPath = `${window.location.pathname}${window.location.search}`;

export function getAnalyticsConsent() {
  return localStorage.getItem(CONSENT_KEY);
}

export function setAnalyticsConsent(granted: boolean) {
  localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied");
  window.gtag?.("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
  });
  if (granted) {
    const path = `${window.location.pathname}${window.location.search}`;
    // The initial config is queued while consent is denied. Re-configuring the
    // destination after consent guarantees the first granted page view is sent.
    window.gtag?.("config", MEASUREMENT_ID, {
      page_title: document.title,
      page_location: window.location.href,
      page_path: path,
    });
    lastTrackedPath = path;
  }
}

export function openAnalyticsSettings() {
  localStorage.removeItem(CONSENT_KEY);
  window.location.reload();
}

export function trackPageView(force = false) {
  if (!window.gtag || window.location.pathname.startsWith("/admin")) return;
  const path = `${window.location.pathname}${window.location.search}`;
  if (!force && path === lastTrackedPath) return;
  lastTrackedPath = path;
  window.gtag("event", "page_view", {
    page_title: document.title,
    page_location: window.location.href,
    page_path: path,
  });
}

function trackEvent(name: string, parameters: Record<string, string | number | boolean> = {}) {
  if (!window.gtag || window.location.pathname.startsWith("/admin")) return;
  window.gtag("event", name, {
    page_path: `${window.location.pathname}${window.location.search}`,
    ...parameters,
  });
}

export function trackInquiryStart(formName: string, product = "") {
  trackEvent("form_start", {
    form_name: formName,
    product_name: product || "Unspecified product",
  });
}

export function trackInquiryCta(source: string, product = "") {
  trackEvent("inquiry_cta_click", {
    link_location: source,
    product_name: product || "Unspecified product",
  });
}

export function trackEmailClick(source: string) {
  trackEvent("email_click", { link_location: source });
}

export function trackInquiryFailure(formName: string) {
  trackEvent("form_submit_error", { form_name: formName });
}

export function trackInquirySubmission(product: string, formName = "sourcing_requirement") {
  trackEvent("generate_lead", {
    currency: "USD",
    form_name: formName,
    product_name: product || "Unspecified product",
  });
}
