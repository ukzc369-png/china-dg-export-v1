import { useEffect, useState } from "react";
import { Card, Col, Row } from "antd";
import { supabase } from "../lib/supabase";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    articles: 0,
    inquiries: 0,
    unread: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const [productsRes, articlesRes, inquiriesRes, unreadRes] =
      await Promise.all([
        supabase
          .from("products")
          .select("*", { count: "exact", head: true }),

        supabase
          .from("articles")
          .select("*", { count: "exact", head: true }),

        supabase
          .from("inquiries")
          .select("*", { count: "exact", head: true }),

        supabase
          .from("inquiries")
          .select("*", { count: "exact", head: true })
          .eq("status", "new"),
      ]);

    setStats({
      products: productsRes.count || 0,
      articles: articlesRes.count || 0,
      inquiries: inquiriesRes.count || 0,
      unread: unreadRes.count || 0,
    });
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <Row gutter={16}>
        <Col span={6}>
          <Card title="Products">
            <h2>{stats.products}</h2>
          </Card>
        </Col>

        <Col span={6}>
          <Card title="Articles">
            <h2>{stats.articles}</h2>
          </Card>
        </Col>

        <Col span={6}>
          <Card title="Inquiries">
            <h2>{stats.inquiries}</h2>
          </Card>
        </Col>

        <Col span={6}>
          <Card title="Unread">
            <h2>{stats.unread}</h2>
          </Card>
        </Col>
      </Row>
    </div>
  );
}