import { createClient } from "@supabase/supabase-js";

async function translateText(text: string) {
  if (!text.trim()) return "";
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_AI_API_TOKEN;
  if (!accountId || !apiToken) throw new Error("Cloudflare AI credentials are not configured");

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/m2m100-1.2b`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${apiToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ text, source_lang: "en", target_lang: "zh" }),
    },
  );
  const result = await response.json() as {
    success?: boolean;
    errors?: Array<{ message?: string }>;
    result?: { translated_text?: string };
  };
  if (!response.ok || !result.success) throw new Error(result.errors?.[0]?.message || "Cloudflare translation failed");
  return result.result?.translated_text || "";
}

async function translateMarkdown(markdown: string) {
  const blocks = markdown.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  const translated: string[] = [];
  for (const block of blocks) {
    if (/^!\[[^\]]*\]\(https?:\/\/[^)]+\)$/.test(block)) {
      translated.push(block);
      continue;
    }
    const lines: string[] = [];
    for (const line of block.split("\n")) {
      const prefix = line.match(/^(#{1,3}\s+|[-*]\s+|\d+\.\s+|>\s+)/)?.[0] || "";
      const body = line.slice(prefix.length).trim();
      lines.push(body ? `${prefix}${await translateText(body)}` : line);
    }
    translated.push(lines.join("\n"));
  }
  return translated.join("\n\n");
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed" });
  try {
    const authorization = req.headers.authorization || "";
    const accessToken = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
    if (!accessToken) return res.status(401).json({ success: false, error: "Unauthorized" });

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) return res.status(500).json({ success: false, error: "Missing Supabase environment variables" });
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error || !data.user) return res.status(401).json({ success: false, error: "Unauthorized" });

    const body = req.body || {};
    if (!body.title?.trim() || !body.content?.trim()) return res.status(400).json({ success: false, error: "English title and content are required" });

    const titleZh = await translateText(body.title);
    const seoTitleZh = await translateText(body.seoTitle || body.title);
    const seoDescriptionZh = await translateText(body.seoDescription || "");
    const contentZh = await translateMarkdown(body.content);
    return res.status(200).json({ success: true, titleZh, seoTitleZh, seoDescriptionZh, contentZh });
  } catch (error) {
    return res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Translation failed" });
  }
}
