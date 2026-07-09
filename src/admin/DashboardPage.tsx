import { useEffect, useMemo, useState } from "react";
import { Card, Col, Empty, message, Row, Space, Spin, Statistic, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  AppstoreOutlined,
  FileTextOutlined,
  MailOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { supabase } from "../lib/supabase";

const { Title, Text } = Typography;

type Inquiry = {
  id: number;
  customer_name?: string | null;
  name?: string | null;
  email?: string | null;
  company?: string | null;
  product?: string | null;
  quantity?: string | null;
  destination?: string | null;
  country?: string | null;
  status?: string | null;
  created_at?: string | null;
};

type DashboardStats = {
  todayInquiries: number;
  totalInquiries: number;
  productCount: number;
  articleCount: number;
};

function buyerName(record: Inquiry) {
  return record.customer_name || record.name || "Unknown buyer";
}

function todayStartIso() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.toISOString();
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

function statusColor(status?: string | null) {
  if (status === "closed") return "green";
  if (status === "contacted") return "blue";
  if (status === "processing") return "orange";
  return "red";
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    todayInquiries: 0,
    totalInquiries: 0,
    productCount: 0,
    articleCount: 0,
  });
  const [latestInquiries, setLatestInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);

    const todayIso = todayStartIso();

    const [todayRes, totalRes, productsRes, articlesRes, latestRes] = await Promise.all([
      supabase
        .from("inquiries")
        .select("id", { count: "exact", head: true })
        .gte("created_at", todayIso),
      supabase.from("inquiries").select("id", { count: "exact", head: true }),
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("articles").select("id", { count: "exact", head: true }),
      supabase
        .from("inquiries")
        .select("*")
        .order("id", { ascending: false })
        .limit(10),
    ]);

    const firstError =
      todayRes.error || totalRes.error || productsRes.error || articlesRes.error || latestRes.error;

    if (firstError) {
      message.error(firstError.message || "Failed to load dashboard");
    }

    setStats({
      todayInquiries: todayRes.count || 0,
      totalInquiries: totalRes.count || 0,
      productCount: productsRes.count || 0,
      articleCount: articlesRes.count || 0,
    });

    setLatestInquiries((latestRes.data || []) as Inquiry[]);
    setLoading(false);
  }

  const columns = useMemo<ColumnsType<Inquiry>>(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        width: 70,
      },
      {
        title: "Buyer",
        render: (_, record) => (
          <Space direction="vertical" size={0}>
            <Text strong>{buyerName(record)}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.email || "-"}
            </Text>
          </Space>
        ),
      },
      {
        title: "Company",
        dataIndex: "company",
        render: (value) => value || "-",
      },
      {
        title: "Product",
        dataIndex: "product",
        render: (value) => value || "-",
      },
      {
        title: "Destination",
        render: (_, record) => record.destination || record.country || "-",
      },
      {
        title: "Status",
        dataIndex: "status",
        width: 130,
        render: (value) => <Tag color={statusColor(value)}>{value || "new"}</Tag>,
      },
      {
        title: "Created",
        dataIndex: "created_at",
        width: 180,
        render: (value) => formatDate(value),
      },
    ],
    []
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ marginBottom: 4 }}>
          Dashboard
        </Title>
        <Text type="secondary">
          Overview of inquiries, products and content activity.
        </Text>
      </div>

      <Spin spinning={loading}>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Today Inquiries"
                value={stats.todayInquiries}
                prefix={<RiseOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Inquiries"
                value={stats.totalInquiries}
                prefix={<MailOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Products"
                value={stats.productCount}
                prefix={<AppstoreOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Articles"
                value={stats.articleCount}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Card
          title="Latest Inquiries"
          extra={
            <a onClick={loadDashboard} style={{ cursor: "pointer" }}>
              Refresh
            </a>
          }
        >
          {latestInquiries.length ? (
            <Table
              rowKey="id"
              columns={columns}
              dataSource={latestInquiries}
              pagination={false}
              scroll={{ x: 900 }}
            />
          ) : (
            <Empty description="No inquiries yet" />
          )}
        </Card>
      </Spin>
    </div>
  );
}
