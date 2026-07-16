const CONSENT_KEY = "chinachemexport-analytics-consent";

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
  if (granted) trackPageView(true);
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

export function trackInquirySubmission(product: string) {
  window.gtag?.("event", "generate_lead", {
    currency: "USD",
    product_name: product || "Unspecified product",
  });
}
