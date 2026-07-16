import { createContext, useContext } from "react";
import type { ReactNode } from "react";

export type AdminLang = "zh" | "en";

const AdminLanguageContext = createContext<AdminLang>("zh");

export function AdminLanguageProvider({ lang, children }: { lang: AdminLang; children: ReactNode }) {
  return <AdminLanguageContext.Provider value={lang}>{children}</AdminLanguageContext.Provider>;
}

export function useAdminLanguage() {
  const lang = useContext(AdminLanguageContext);
  return { lang, tr: (en: string, zh: string) => (lang === "zh" ? zh : en) };
}
