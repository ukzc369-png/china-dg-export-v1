const MEASUREMENT_ID = "G-LX6Z6RLDEP";
const CONSENT_KEY = "chinachemexport-analytics-consent";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

let lastTrackedPath = "";

export function initializeAnalytics() {
  if (window.location.pathname.startsWith("/admin")) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  const granted = localStorage.getItem(CONSENT_KEY) === "granted";
  window.gtag("consent", "default", {
    analytics_storage: granted ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID);
  lastTrackedPath = `${window.location.pathname}${window.location.search}`;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

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
