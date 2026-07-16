import { Card, Input, Button, message } from "antd";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAdminLanguage } from "./AdminLanguage";

export default function LoginPage({ onToggleLanguage }: { onToggleLanguage: () => void }) {
  const { lang, tr } = useAdminLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) return message.warning(tr("Enter your email and password", "请输入邮箱和密码"));
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) message.error(tr("Invalid email or password", "邮箱或密码错误"));
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <Card title={tr("ChinaChemExport CMS", "ChinaChemExport 网站后台")} style={{ width: 400 }} extra={<Button size="small" onClick={onToggleLanguage}>{lang === "zh" ? "English" : "中文"}</Button>}>
        <Input
          placeholder={tr("Email", "登录邮箱")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: 12 }}
        />

        <Input.Password
          placeholder={tr("Password", "密码")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: 12 }}
        />

        <Button type="primary" block loading={loading} onClick={handleLogin}>
          {tr("Login", "登录")}
        </Button>
      </Card>
    </div>
  );
}
