import { createClient } from "@supabase/supabase-js";

type TranslationRequest = {
  title?: string;
  content?: string;
  seoTitle?: string;
  seoDescription?: string;
};

function jsonError(error: string, status: number) {
  return Response.json({ success: false, error }, { status });
}

function extractOutputText(response: any) {
  if (typeof response?.output_text === "string") return response.output_text;
  for (const item of response?.output || []) {
    for (const content of item?.content || []) {
      if (content?.type === "output_text" && typeof content.text === "string") return content.text;
    }
  }
  return "";
}

export async function onRequestPost(context: any) {
  try {
    const supabaseUrl = context.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = context.env.VITE_SUPABASE_ANON_KEY;
    const openaiApiKey = context.env.OPENAI_API_KEY;
    const model = context.env.OPENAI_TRANSLATION_MODEL || "gpt-5.6-luna";

    if (!supabaseUrl || !supabaseAnonKey) return jsonError("Missing Supabase environment variables", 500);
    if (!openaiApiKey) return jsonError("翻译服务尚未配置 OPENAI_API_KEY", 503);

    const authHeader = context.request.headers.get("Authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!token) return jsonError("Unauthorized", 401);

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) return jsonError("Unauthorized", 401);

    const body = (await context.request.json()) as TranslationRequest;
    const title = String(body.title || "").trim().slice(0, 300);
    const content = String(body.content || "").trim().slice(0, 30000);
    const seoTitle = String(body.seoTitle || title).trim().slice(0, 300);
    const seoDescription = String(body.seoDescription || "").trim().slice(0, 1000);
    if (!title || !content) return jsonError("English title and content are required", 400);

    const source = JSON.stringify({ title, content, seoTitle, seoDescription });
    const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        instructions: [
          "Translate the supplied B2B chemical export article from English into accurate Simplified Chinese.",
          "Preserve Markdown headings, lists, links and image syntax exactly.",
          "Keep chemical names, CAS numbers, UN numbers, Incoterms and abbreviations accurate; retain the English term in parentheses when useful.",
          "Do not add legal claims, licenses, guarantees, statistics, products or facts absent from the source.",
          "Use professional, natural Chinese suitable for industrial chemical buyers.",
          "Return only the requested JSON object.",
        ].join(" "),
        input: source,
        max_output_tokens: 16000,
        text: {
          format: {
            type: "json_schema",
            name: "article_translation",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                title: { type: "string" },
                content: { type: "string" },
                seoTitle: { type: "string" },
                seoDescription: { type: "string" },
              },
              required: ["title", "content", "seoTitle", "seoDescription"],
            },
          },
        },
      }),
    });

    const result = await openaiResponse.json();
    if (!openaiResponse.ok) {
      return jsonError(result?.error?.message || "Translation service request failed", 502);
    }

    const outputText = extractOutputText(result);
    if (!outputText) return jsonError("Translation service returned no text", 502);
    const translation = JSON.parse(outputText);

    return Response.json({ success: true, ...translation });
  } catch (error: any) {
    return jsonError(String(error?.message || error), 500);
  }
}
