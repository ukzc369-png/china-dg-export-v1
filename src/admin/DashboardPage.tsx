import { useEffect, useMemo, useState } from "react";
import { Card, Col, Empty, List, Row, Space, Spin, Statistic, Tag, Typography } from "antd";
import {
  AppstoreOutlined,
  FileTextOutlined,
  MailOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { supabase } from "../lib/supabase";

const { Text, Title } = Typography;

type Inquiry = {
  id: number;
  customer_name?: string | null;
  name?: string | null;
  email: string | null;
  company: string | null;
  product?: string | null;
  destination?: string | null;
  country?: string | null;
  status: string | null;
  created_at: string;
};

type Stats = {
  products: number;
  activeProducts: number;
  articles: number;
  publishedArticles: number;
  inquiries: number;
  todayInquiries: number;
  newInquiries: number;
};

function startOfTodayIso() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
}

function displayName(inquiry: Inquiry) {
  return inquiry.customer_name || inquiry.name || "Unknown buyer";
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stats>({
    products: 0,
    activeProducts: 0,
    articles: 0,
    publishedArticles: 0,
    inquiries: 0,
    todayInquiries: 0,
    newInquiries: 0,
  });
  const [latestInquiries, setLatestInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);

    const today = startOfTodayIso();

    const [
      productsRes,
      activeProductsRes,
      articlesRes,
      publishedArticlesRes,
      inquiriesRes,
      todayInquiriesRes,
      newInquiriesRes,
      latestInquiriesRes,
    ] = await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),
      supabase.from("articles").select("*", { count: "exact", head: true }),
      supabase
        .from("articles")
        .select("*", { count: "exact", head: true })
        .eq("status", "published"),
      supabase.from("inquiries").select("*", { count: "exact", head: true }),
      supabase
        .from("inquiries")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today),
      supabase
        .from("inquiries")
        .select("*", { count: "exact", head: true })
        .eq("status", "new"),
      supabase.from("inquiries").select("*").order("id", { ascending: false }).limit(5),
    ]);

    setStats({
      products: productsRes.count || 0,
      activeProducts: activeProductsRes.count || 0,
      articles: articlesRes.count || 0,
      publishedArticles: publishedArticlesRes.count || 0,
      inquiries: inquiriesRes.count || 0,
      todayInquiries: todayInquiriesRes.count || 0,
      newInquiries: newInquiriesRes.count || 0,
    });

    setLatestInquiries((latestInquiriesRes.data || []) as Inquiry[]);
    setLoading(false);
  }

  const cards = useMemo(
    () => [
      {
        title: "Today Inquiries",
        value: stats.todayInquiries,
        icon: <RiseOutlined />,
        note: "New leads submitted today",
      },
      {
        title: "Total Inquiries",
        value: stats.inquiries,
        icon: <MailOutlined />,
        note: `${stats.newInquiries} waiting for follow-up`,
      },
      {
        title: "Products",
        value: stats.products,
        icon: <AppstoreOutlined />,
        note: `${stats.activeProducts} active on website`,
      },
      {
        title: "Articles",
        value: stats.articles,
        icon: <FileTextOutlined />,
        note: `${stats.publishedArticles} published for SEO`,
      },
    ],
    [stats]
  );

  return (
    <Spin spinning={loading}>
      <Space direction="vertical" size={18} style={{ width: "100%" }}>
        <div>
          <Title level={2} style={{ marginBottom: 0 }}>
            Dashboard
          </Title>
          <Text type="secondary">
            Track product library, SEO content and buyer inquiries in one place.
          </Text>
        </div>

        <Row gutter={[16, 16]}>
          {cards.map((card) => (
            <Col xs={24} md={12} xl={6} key={card.title}>
              <Card bordered={false} style={{ minHeight: 150 }}>
                <Space direction="vertical" size={8} style={{ width: "100%" }}>
                  <Space style={{ color: "#1677ff", fontSize: 22 }}>{card.icon}</Space>
                  <Statistic title={card.title} value={card.value} />
                  <Text type="secondary">{card.note}</Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        <Card
          title="Latest Inquiries"
          extra={
            <a onClick={loadDashboard} style={{ cursor: "pointer" }}>
              Refresh
            </a>
          }
        >
          {latestInquiries.length === 0 ? (
            <Empty description="No inquiries yet" />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={latestInquiries}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Space wrap>
                        <span>{displayName(item)}</span>
                        <Tag color={item.status === "new" ? "blue" : "default"}>
                          {item.status || "new"}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size={2}>
                        <Text type="secondary">
                          {item.email || "No email"} · {item.company || "No company"}
                        </Text>
                        <Text>
                          Product: {item.product || "-"} · Destination:{" "}
                          {item.destination || item.country || "-"}
                        </Text>
                      </Space>
                    }
                  />
                  <Text type="secondary">
                    {item.created_at ? new Date(item.created_at).toLocaleString() : "-"}
                  </Text>
                </List.Item>
              )}
            />
          )}
        </Card>
      </Space>
    </Spin>
  );
}
