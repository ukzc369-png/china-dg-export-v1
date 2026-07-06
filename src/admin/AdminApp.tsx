import { useState } from "react";

import DashboardPage from "./DashboardPage";
import ProductsPage from "./ProductsPage";
import ArticlesPage from "./ArticlesPage";
import InquiriesPage from "./InquiriesPage";

type AdminTab =
  | "dashboard"
  | "products"
  | "articles"
  | "inquiries";

export default function AdminApp() {
  const [tab, setTab] =
    useState<AdminTab>("dashboard");

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <aside
        style={{
          width: 220,
          background: "#07111f",
          color: "#fff",
          padding: 20,
        }}
      >
        <h2>ChinaDGExport CMS</h2>

        <button onClick={() => setTab("dashboard")}>
          Dashboard
        </button>

        <br />
        <br />

        <button onClick={() => setTab("products")}>
          Products
        </button>

        <br />
        <br />

        <button onClick={() => setTab("articles")}>
          Articles
        </button>

        <br />
        <br />

        <button onClick={() => setTab("inquiries")}>
          Inquiries
        </button>
      </aside>

      <main
        style={{
          flex: 1,
          padding: 30,
        }}
      >
        {tab === "dashboard" && (
          <DashboardPage />
        )}

        {tab === "products" && (
          <ProductsPage />
        )}

        {tab === "articles" && (
          <ArticlesPage />
        )}

        {tab === "inquiries" && (
          <InquiriesPage />
        )}
      </main>
    </div>
  );
}