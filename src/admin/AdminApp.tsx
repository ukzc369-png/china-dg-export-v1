import { Layout, Menu } from "antd";
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

const { Sider, Content } = Layout;

export default function AdminApp() {
  const [tab, setTab] = useState("dashboard");

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
        <Content style={{ padding: 24 }}>
          {tab === "dashboard" && <DashboardPage />}
          {tab === "products" && <ProductsPage />}
          {tab === "articles" && <ArticlesPage />}
          {tab === "inquiries" && <InquiriesPage />}
        </Content>
      </Layout>
    </Layout>
  );
}