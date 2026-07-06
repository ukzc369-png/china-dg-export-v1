import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    articles: 0,
    inquiries: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const products = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    const articles = await supabase
      .from("articles")
      .select("*", { count: "exact", head: true });

    const inquiries = await supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true });

    setStats({
      products: products.count || 0,
      articles: articles.count || 0,
      inquiries: inquiries.count || 0,
    });
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>ChinaDGExport CMS</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 20,
          marginTop: 30,
        }}
      >
        <div className="cms-card">
          <h3>Products</h3>
          <h1>{stats.products}</h1>
        </div>

        <div className="cms-card">
          <h3>Articles</h3>
          <h1>{stats.articles}</h1>
        </div>

        <div className="cms-card">
          <h3>Inquiries</h3>
          <h1>{stats.inquiries}</h1>
        </div>
      </div>
    </div>
  );
}