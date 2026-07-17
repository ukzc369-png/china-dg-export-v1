import { createClient } from "@supabase/supabase-js";

function extractOutputText(response: any) {
  if (typeof response?.output_text === "string") return response.output_text;
  for (const item of response?.output || []) {
    for (const content of item?.content || []) {
      if (content?.type === "output_text" && typeof content.text === "string") return content.text;
    }
  }
  return "";
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed" });

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_TRANSLATION_MODEL || "gpt-5.6-luna";
    if (!supabaseUrl || !supabaseAnonKey) return res.status(500).json({ success: false, error: "Missing Supabase environment variables" });
    if (!openaiApiKey) return res.status(503).json({ success: false, error: "翻译服务尚未配置 OPENAI_API_KEY" });

    const authHeader = String(req.headers.authorization || "");
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!token) return res.status(401).json({ success: false, error: "Unauthorized" });

    const supabase = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) return res.status(401).json({ success: false, error: "Unauthorized" });

    const title = String(req.body?.title || "").trim().slice(0, 300);
    const content = String(req.body?.content || "").trim().slice(0, 30000);
    const seoTitle = String(req.body?.seoTitle || title).trim().slice(0, 300);
    const seoDescription = String(req.body?.seoDescription || "").trim().slice(0, 1000);
    if (!title || !content) return res.status(400).json({ success: false, error: "English title and content are required" });

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${openaiApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        instructions: "Translate the supplied B2B chemical export article into accurate Simplified Chinese. Preserve Markdown, links and image syntax. Keep chemical names, CAS/UN numbers, Incoterms and abbreviations accurate. Do not add facts or claims. Return only the requested JSON object.",
        input: JSON.stringify({ title, content, seoTitle, seoDescription }),
        max_output_tokens: 16000,
        text: { format: { type: "json_schema", name: "article_translation", strict: true, schema: {
          type: "object", additionalProperties: false,
          properties: { title: { type: "string" }, content: { type: "string" }, seoTitle: { type: "string" }, seoDescription: { type: "string" } },
          required: ["title", "content", "seoTitle", "seoDescription"],
        } } },
      }),
    });
    const result = await response.json();
    if (!response.ok) return res.status(502).json({ success: false, error: result?.error?.message || "Translation service request failed" });
    const outputText = extractOutputText(result);
    if (!outputText) return res.status(502).json({ success: false, error: "Translation service returned no text" });
    return res.status(200).json({ success: true, ...JSON.parse(outputText) });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: String(error?.message || error) });
  }
}
