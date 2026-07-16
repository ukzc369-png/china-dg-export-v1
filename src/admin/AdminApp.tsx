import { Layout, Menu, Button, ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import enUS from "antd/locale/en_US";
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
import { AdminLanguageProvider, type AdminLang } from "./AdminLanguage";

const { Sider, Content } = Layout;

export default function AdminApp() {
  const [tab, setTab] = useState("dashboard");
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [lang, setLang] = useState<AdminLang>(() => (localStorage.getItem("chinachem-admin-lang") as AdminLang) || "zh");
  const tr = (en: string, zh: string) => (lang === "zh" ? zh : en);
  function toggleLanguage() {
    const next = lang === "zh" ? "en" : "zh";
    setLang(next);
    localStorage.setItem("chinachem-admin-lang", next);
  }

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
    return <AdminLanguageProvider lang={lang}><ConfigProvider locale={lang === "zh" ? zhCN : enUS}><LoginPage onToggleLanguage={toggleLanguage} /></ConfigProvider></AdminLanguageProvider>;
  }

  return (
    <AdminLanguageProvider lang={lang}>
    <ConfigProvider locale={lang === "zh" ? zhCN : enUS}>
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
          ChinaChemExport
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
              label: tr("Dashboard", "后台概览"),
            },
            {
              key: "products",
              icon: <AppstoreOutlined />,
              label: tr("Products", "产品管理"),
            },
            {
              key: "articles",
              icon: <FileTextOutlined />,
              label: tr("Articles", "博客管理"),
            },
            {
              key: "inquiries",
              icon: <MailOutlined />,
              label: tr("Inquiries", "询盘管理"),
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

            <Button onClick={toggleLanguage}>{lang === "zh" ? "English" : "中文"}</Button>

            <Button
              onClick={() => supabase.auth.signOut()}
            >
              {tr("Logout", "退出登录")}
            </Button>
          </div>

          {tab === "dashboard" && <DashboardPage />}
          {tab === "products" && <ProductsPage />}
          {tab === "articles" && <ArticlesPage />}
          {tab === "inquiries" && <InquiriesPage />}
        </Content>
      </Layout>
    </Layout>
    </ConfigProvider>
    </AdminLanguageProvider>
  );
}
