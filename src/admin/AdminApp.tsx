import { Layout, Menu, Button } from "antd";
import {
  DashboardOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useState } from "react";

import DashboardPage from "./DashboardPage";
import ProductsPage from "./ProductsPage";
import ArticlesPage from "./ArticlesPage";
import InquiriesPage from "./InquiriesPage";
import LoginPage from "./LoginPage";

const { Sider, Content } = Layout;

export default function AdminApp() {
  const [tab, setTab] = useState("dashboard");

  const isLoggedIn =
    localStorage.getItem("admin_logged_in") === "true";

  if (!isLoggedIn) {
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
              admin@chinadgexport.com
            </span>

            <Button
              onClick={() => {
                localStorage.removeItem("admin_logged_in");
                window.location.reload();
              }}
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