import { createClient } from "@supabase/supabase-js";

type TranslationResult = { translated_text?: string };

async function translateText(ai: any, text: string) {
  if (!text.trim()) return "";
  const result = await ai.run("@cf/meta/m2m100-1.2b", {
    text,
    source_lang: "en",
    target_lang: "zh",
  }) as TranslationResult;
  return result.translated_text || "";
}

async function translateMarkdown(ai: any, markdown: string) {
  const blocks = markdown.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  const translated: string[] = [];

  for (const block of blocks) {
    if (/^!\[[^\]]*\]\(https?:\/\/[^)]+\)$/.test(block)) {
      translated.push(block);
      continue;
    }

    const lines = block.split("\n");
    const translatedLines: string[] = [];
    for (const line of lines) {
      const prefix = line.match(/^(#{1,3}\s+|[-*]\s+|\d+\.\s+|>\s+)/)?.[0] || "";
      const body = line.slice(prefix.length).trim();
      translatedLines.push(body ? `${prefix}${await translateText(ai, body)}` : line);
    }
    translated.push(translatedLines.join("\n"));
  }

  return translated.join("\n\n");
}

export async function onRequestPost(context: any) {
  try {
    if (!context.env.AI) {
      return Response.json({ success: false, error: "Workers AI binding is not configured" }, { status: 500 });
    }

    const authorization = context.request.headers.get("Authorization") || "";
    const accessToken = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
    if (!accessToken) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const supabaseUrl = context.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = context.env.VITE_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      return Response.json({ success: false, error: "Missing Supabase environment variables" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error || !data.user) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await context.request.json() as {
      title?: string;
      content?: string;
      seoTitle?: string;
      seoDescription?: string;
    };
    if (!body.title?.trim() || !body.content?.trim()) {
      return Response.json({ success: false, error: "English title and content are required" }, { status: 400 });
    }

    const titleZh = await translateText(context.env.AI, body.title);
    const seoTitleZh = await translateText(context.env.AI, body.seoTitle || body.title);
    const seoDescriptionZh = await translateText(context.env.AI, body.seoDescription || "");
    const contentZh = await translateMarkdown(context.env.AI, body.content);

    return Response.json({ success: true, titleZh, seoTitleZh, seoDescriptionZh, contentZh });
  } catch (error) {
    return Response.json(
      { success: false, error: error instanceof Error ? error.message : "Translation failed" },
      { status: 500 },
    );
  }
}
