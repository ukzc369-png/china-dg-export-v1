import { useState } from "react";
import {
  getAnalyticsConsent,
  setAnalyticsConsent,
} from "../analytics";

export default function CookieConsent() {
  const [visible, setVisible] = useState(() =>
    !window.location.pathname.startsWith("/admin") && !getAnalyticsConsent(),
  );

  if (!visible) return null;

  const choose = (granted: boolean) => {
    setAnalyticsConsent(granted);
    setVisible(false);
  };

  return (
    <aside
      aria-label="Analytics consent"
      style={{
        position: "fixed",
        zIndex: 10000,
        left: 18,
        right: 18,
        bottom: 18,
        maxWidth: 720,
        margin: "0 auto",
        padding: "16px 18px",
        borderRadius: 12,
        background: "#102a43",
        color: "#fff",
        boxShadow: "0 12px 35px rgba(0,0,0,.28)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6 }}>Website analytics</div>
      <div style={{ fontSize: 14, lineHeight: 1.5, opacity: 0.92 }}>
        We use analytics cookies to understand website traffic and improve our
        services. Advertising storage remains disabled.
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={() => choose(false)}
          style={{ padding: "8px 14px", borderRadius: 7, border: "1px solid #fff", background: "transparent", color: "#fff", cursor: "pointer" }}
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => choose(true)}
          style={{ padding: "8px 14px", borderRadius: 7, border: 0, background: "#f59e0b", color: "#102a43", fontWeight: 700, cursor: "pointer" }}
        >
          Accept analytics
        </button>
      </div>
    </aside>
  );
}
