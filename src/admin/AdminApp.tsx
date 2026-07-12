import { Layout, Menu, Button } from "antd";
import {
  DashboardOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

import DashboardPage from "./DashboardPage";
import ProductsPage from "./ProductsPage";
import ArticlesPage from "./ArticlesPage";
import InquiriesPage from "./InquiriesPage";
import LoginPage from "./LoginPage";

const { Sider, Content } = Layout;

export default function AdminApp() {
  const [tab, setTab] = useState("dashboard");
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  if (authLoading) return null;
  if (!session) {
    return <LoginPage />;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="dark">
        <div
          style={{
            color: "#fff",
            fontSize: 20,
            fontWeight: 700,
            padding: 20,
          }}
        >
          ChinaDGExport
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[tab]}
          onClick={(e) => setTab(e.key)}
          items={[
            {
              key: "dashboard",
              icon: <DashboardOutlined />,
              label: "Dashboard",
            },
            {
              key: "products",
              icon: <AppstoreOutlined />,
              label: "Products",
            },
            {
              key: "articles",
              icon: <FileTextOutlined />,
              label: "Articles",
            },
            {
              key: "inquiries",
              icon: <MailOutlined />,
              label: "Inquiries",
            },
          ]}
        />
      </Sider>

      <Layout>
        <Content style={{ padding: 24, background: "#f5f5f5" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginBottom: 20,
              gap: 12,
            }}
          >
            <span style={{ color: "#666" }}>
              {session.user.email}
            </span>

            <Button
              onClick={() => supabase.auth.signOut()}
            >
              Logout
            </Button>
          </div>

          {tab === "dashboard" && <DashboardPage />}
          {tab === "products" && <ProductsPage />}
          {tab === "articles" && <ArticlesPage />}
          {tab === "inquiries" && <InquiriesPage />}
        </Content>
      </Layout>
    </Layout>
  );
}
