import { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Form,
  Image,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Upload,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TextAreaRef } from "antd/es/input/TextArea";
import { PlusOutlined, StarFilled, StarOutlined, UploadOutlined } from "@ant-design/icons";
import { supabase } from "../lib/supabase";
import { imageSizeLabel, optimizeUploadImage } from "./imageUpload";
import { useAdminLanguage } from "./AdminLanguage";

type ArticleStatus = "draft" | "published";

type Article = {
  id: number;
  title: string;
  slug: string | null;
  content: string | null;
  seo_title: string | null;
  seo_description: string | null;
  cover_image?: string | null;
  related_products?: string | null;
  publish_date?: string | null;
  featured?: boolean | null;
  status: ArticleStatus | string | null;
  created_at: string;
};

type ArticleFormValues = {
  title: string;
  slug?: string;
  content?: string;
  seo_title?: string;
  seo_description?: string;
  title_zh?: string;
  content_zh?: string;
  seo_title_zh?: string;
  seo_description_zh?: string;
  publish_chinese?: boolean;
  cover_image?: string;
  related_products?: string;
  publish_date?: string;
  featured?: boolean;
  status: ArticleStatus;
};

const BUCKET_NAME = "article-images";

function readEnglish(value: string | null | undefined) {
  if (!value) return "";
  try {
    const parsed = JSON.parse(value) as { en?: string; zh?: string };
    if (parsed && typeof parsed === "object" && (parsed.en || parsed.zh)) {
      return parsed.en || "";
    }
  } catch {
    // Legacy articles contain plain English text.
  }
  return value;
}

function readChinese(value: string | null | undefined) {
  if (!value) return "";
  try {
    const parsed = JSON.parse(value) as { zh?: string };
    return parsed && typeof parsed === "object" ? parsed.zh || "" : "";
  } catch {
    return "";
  }
}

function isChinesePublished(value: string | null | undefined) {
  if (!value) return false;
  try {
    const parsed = JSON.parse(value) as { zh?: string; zhStatus?: string };
    return Boolean(parsed.zh) && parsed.zhStatus !== "draft";
  } catch {
    return false;
  }
}

function bilingualValue(en: string, zh: string | undefined, publishChinese: boolean) {
  const cleanZh = zh?.trim();
  if (!cleanZh) return en;
  return JSON.stringify({ en, zh: cleanZh, zhStatus: publishChinese ? "published" : "draft" });
}

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function downloadCsv(filename: string, rows: string[][]) {
  const content = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function renderMarkdownPreview(content?: string) {
  const blocks = (content || "").split("\n").filter((line) => line.trim());
  if (!blocks.length) return <p style={{ color: "#94a3b8" }}>Preview will appear here.</p>;

  return blocks.map((line, index) => {
    if (line.startsWith("## ")) return <h3 key={index}>{line.replace(/^## /, "")}</h3>;
    if (line.startsWith("# ")) return <h2 key={index}>{line.replace(/^# /, "")}</h2>;
    if (line.startsWith("- ")) return <li key={index}>{line.replace(/^- /, "")}</li>;
    if (line.startsWith("![") && line.includes("](") && line.endsWith(")")) {
      const match = line.match(/!\[(.*?)\]\((.*?)\)/);
      if (match) return <Image key={index} src={match[2]} alt={match[1]} style={{ maxWidth: "100%", borderRadius: 8 }} />;
    }
    return <p key={index}>{line}</p>;
  });
}

export default function ArticlesPage() {
  const { tr } = useAdminLanguage();
  const [form] = Form.useForm<ArticleFormValues>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const contentEditorRef = useRef<TextAreaRef>(null);

  const contentValue = Form.useWatch("content", form) || "";
  const coverImageValue = Form.useWatch("cover_image", form) || "";
  const isEditing = Boolean(editingArticle);

  const wordCount = useMemo(() => contentValue.trim().split(/\s+/).filter(Boolean).length, [contentValue]);

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles(keyword = searchText, status = statusFilter) {
    setLoading(true);

    let query = supabase.from("articles").select("*").order("id", { ascending: false });
    const trimmedKeyword = keyword.trim();

    if (trimmedKeyword) {
      query = query.or(
        `title.ilike.%${trimmedKeyword}%,slug.ilike.%${trimmedKeyword}%,seo_title.ilike.%${trimmedKeyword}%,related_products.ilike.%${trimmedKeyword}%`
      );
    }

    if (status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      message.error(error.message || "文章加载失败");
    } else {
      setArticles((data || []) as Article[]);
    }

    setLoading(false);
  }

  function openCreateModal() {
    setEditingArticle(null);
    form.resetFields();
    form.setFieldsValue({ status: "draft", publish_date: todayDate(), featured: false, publish_chinese: false });
    setModalOpen(true);
  }

  function openEditModal(article: Article) {
    setEditingArticle(article);
    form.setFieldsValue({
      title: readEnglish(article.title),
      slug: article.slug || "",
      content: readEnglish(article.content),
      seo_title: readEnglish(article.seo_title),
      seo_description: readEnglish(article.seo_description),
      title_zh: readChinese(article.title),
      content_zh: readChinese(article.content),
      seo_title_zh: readChinese(article.seo_title),
      seo_description_zh: readChinese(article.seo_description),
      publish_chinese: isChinesePublished(article.content),
      cover_image: article.cover_image || "",
      related_products: article.related_products || "",
      publish_date: article.publish_date || article.created_at?.slice(0, 10) || todayDate(),
      featured: Boolean(article.featured),
      status: (article.status as ArticleStatus) || "draft",
    });
    setModalOpen(true);
  }

  async function saveArticle() {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const slug = values.slug || createSlug(values.title);
      const publishChinese = Boolean(values.publish_chinese);
      const payload = {
        title: bilingualValue(values.title, values.title_zh, publishChinese),
        slug,
        content: bilingualValue(values.content || "", values.content_zh, publishChinese),
        seo_title: bilingualValue(values.seo_title || values.title, values.seo_title_zh, publishChinese),
        seo_description: bilingualValue(values.seo_description || (values.content || "").slice(0, 155), values.seo_description_zh, publishChinese),
        cover_image: values.cover_image || "",
        related_products: values.related_products || "",
        publish_date: values.publish_date || todayDate(),
        featured: Boolean(values.featured),
        status: values.status,
      };

      const { error } = isEditing && editingArticle
        ? await supabase.from("articles").update(payload).eq("id", editingArticle.id)
        : await supabase.from("articles").insert([payload]);

      if (error) {
        message.error(error.message || "文章保存失败");
        return;
      }

      message.success(isEditing ? "文章已更新" : "文章已创建");
      setModalOpen(false);
      loadArticles();
    } catch (error) {
      if (error instanceof Error) message.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteArticle(id: number) {
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) {
      message.error(error.message);
      return;
    }
    message.success("文章已删除");
    loadArticles();
  }

  async function toggleFeatured(article: Article) {
    const { error } = await supabase
      .from("articles")
      .update({ featured: !Boolean(article.featured) })
      .eq("id", article.id);

    if (error) {
      message.error(error.message);
      return;
    }
    loadArticles();
  }

  async function uploadCover(file: File) {
    setUploading(true);
    try {
      const optimized = await optimizeUploadImage(file);
      const safeName = `${Date.now()}-${optimized.name}`;
      const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(safeName, optimized, {
        upsert: true,
        contentType: optimized.type,
      });

      if (uploadError) {
        message.warning(`上传失败：${uploadError.message}。您也可以手动粘贴图片地址。`);
        return false;
      }

      const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(safeName);
      form.setFieldsValue({ cover_image: data.publicUrl });
      message.success(`封面已优化并上传（${imageSizeLabel(optimized.size)}）`);
      return false;
    } catch (error) {
      message.error(error instanceof Error ? error.message : "图片处理失败");
      return false;
    } finally {
      setUploading(false);
    }
  }

  async function uploadInlineImage(file: File) {
    setUploading(true);
    try {
      const optimized = await optimizeUploadImage(file);
      const safeName = `${Date.now()}-${optimized.name}`;
      const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(safeName, optimized, {
        upsert: true,
        contentType: optimized.type,
      });

      if (uploadError) {
        message.warning(`上传失败：${uploadError.message}。您也可以手动粘贴图片地址。`);
        return false;
      }

      const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(safeName);
      insertContent(`\n![Article Image](${data.publicUrl})\n`);
      message.success(`图片已优化并插入正文（${imageSizeLabel(optimized.size)}）`);
      return false;
    } catch (error) {
      message.error(error instanceof Error ? error.message : "图片处理失败");
      return false;
    } finally {
      setUploading(false);
    }
  }

  function insertContent(text: string) {
    insertAtCursor(text);
  }

  function insertAtCursor(text: string, suffix = "", placeholder = "") {
    const current = form.getFieldValue("content") || "";
    const textarea = contentEditorRef.current?.resizableTextArea?.textArea;
    const start = textarea?.selectionStart ?? current.length;
    const end = textarea?.selectionEnd ?? current.length;
    const selected = current.slice(start, end) || placeholder;
    const next = `${current.slice(0, start)}${text}${selected}${suffix}${current.slice(end)}`;
    const cursorStart = start + text.length;
    const cursorEnd = cursorStart + selected.length;

    form.setFieldValue("content", next);
    window.setTimeout(() => {
      textarea?.focus();
      textarea?.setSelectionRange(cursorStart, cursorEnd);
    }, 0);
  }

  function generateSlugAndSeo() {
    const title = form.getFieldValue("title") || "chemical-export-guide";
    const content = form.getFieldValue("content") || "Chemical export guide from ChinaChemExport.";
    form.setFieldsValue({
      slug: createSlug(title),
      seo_title: `${title} | ChinaChemExport`,
      seo_description: content.replace(/[#*\-\n]/g, " ").replace(/\s+/g, " ").trim().slice(0, 155),
    });
  }

  async function generateChineseDraft() {
    const title = form.getFieldValue("title")?.trim();
    const content = form.getFieldValue("content")?.trim();
    if (!title || !content) {
      message.warning("请先填写英文标题和英文正文");
      return;
    }

    setTranslating(true);
    try {
      const { data } = await supabase.auth.getSession();
      const accessToken = data.session?.access_token;
      if (!accessToken) throw new Error("登录状态已失效，请重新登录");

      const response = await fetch("/api/translate-article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title,
          content,
          seoTitle: form.getFieldValue("seo_title") || title,
          seoDescription: form.getFieldValue("seo_description") || content.slice(0, 155),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "中文草稿生成失败");

      form.setFieldsValue({
        title_zh: result.title,
        content_zh: result.content,
        seo_title_zh: result.seoTitle,
        seo_description_zh: result.seoDescription,
        publish_chinese: false,
      });
      message.success("中文草稿已生成，请检查后勾选发布");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "中文草稿生成失败");
    } finally {
      setTranslating(false);
    }
  }

  function exportArticles() {
    const rows = [
      ["ID", "Title", "Slug", "Status", "Featured", "Publish Date"],
      ...articles.map((item) => {
        return [
          String(item.id), readEnglish(item.title), item.slug || "",
          item.status === "published" ? "已发布" : "草稿",
          item.featured ? "是" : "否", item.publish_date || item.created_at || "",
        ];
      }),
    ];
    downloadCsv("articles.csv", rows);
  }

  const columns: ColumnsType<Article> = [
    {
      title: tr("Cover", "封面"),
      dataIndex: "cover_image",
      width: 84,
      render: (url: string | null) =>
        url ? <Image src={url} width={52} height={52} style={{ objectFit: "cover", borderRadius: 8 }} /> : <div style={{ width: 52, height: 52, borderRadius: 8, background: "#f1f5f9" }} />,
    },
    {
      title: tr("Article", "文章"),
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <strong>{readEnglish(record.title)}</strong>
          <span style={{ color: "#64748b" }}>/{record.slug}</span>
          <Space wrap>
            {record.featured && <Tag color="gold" icon={<StarFilled />}>{tr("Featured", "推荐")}</Tag>}
            {record.related_products && <Tag>{record.related_products}</Tag>}
            {readChinese(record.content) && (
              <Tag color={isChinesePublished(record.content) ? "blue" : "orange"}>
                {isChinesePublished(record.content) ? tr("Chinese published", "中文已发布") : tr("Chinese draft", "中文待审核")}
              </Tag>
            )}
          </Space>
        </Space>
      ),
    },
    {
      title: tr("Status", "状态"),
      dataIndex: "status",
      width: 120,
      render: (status) => <Tag color={status === "published" ? "green" : "default"}>{status === "published" ? tr("Published", "已发布") : tr("Draft", "草稿")}</Tag>,
    },
    { title: tr("Publish Date", "发布日期"), dataIndex: "publish_date", width: 140 },
    {
      title: tr("Actions", "操作"),
      width: 230,
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => openEditModal(record)}>{tr("Edit", "编辑")}</Button>
          <Button size="small" icon={record.featured ? <StarFilled /> : <StarOutlined />} onClick={() => toggleFeatured(record)} />
          <Popconfirm title={tr("Delete this article?", "确定删除这篇文章吗？")} onConfirm={() => deleteArticle(record.id)} okText={tr("Delete", "删除")} cancelText={tr("Cancel", "取消")}>
            <Button danger size="small">{tr("Delete", "删除")}</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const publishedCount = articles.filter((item) => item.status === "published").length;
  const featuredCount = articles.filter((item) => item.featured).length;

  return (
    <div>
      <Space direction="vertical" size={18} style={{ width: "100%" }}>
        <Card>
          <Space style={{ width: "100%", justifyContent: "space-between" }} align="center" wrap>
            <div>
              <h2 style={{ margin: 0 }}>{tr("Articles CMS", "博客文章管理")}</h2>
              <p style={{ margin: "6px 0 0", color: "#64748b" }}>
                {tr("Manage bilingual articles, SEO, Markdown content, covers, dates and featured posts.", "管理中英文文章、SEO、Markdown 正文、封面、发布日期和首页推荐。")}
              </p>
            </div>
            <Space>
              <Button onClick={exportArticles}>{tr("Export CSV", "导出 CSV")}</Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>{tr("Add Article", "新增文章")}</Button>
            </Space>
          </Space>
        </Card>

        <Space wrap>
          <Card size="small"><strong>{articles.length}</strong><div>{tr("Total Articles", "文章总数")}</div></Card>
          <Card size="small"><strong>{publishedCount}</strong><div>{tr("Published", "已发布")}</div></Card>
          <Card size="small"><strong>{featuredCount}</strong><div>{tr("Featured", "首页推荐")}</div></Card>
        </Space>

        <Card>
          <Space style={{ marginBottom: 16 }} wrap>
            <Input.Search
              placeholder={tr("Search title, slug, SEO or related products", "搜索标题、链接、SEO 或关联产品")}
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={(value) => loadArticles(value, statusFilter)}
              style={{ width: 360 }}
            />
            <Select
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                loadArticles(searchText, value);
              }}
              style={{ width: 150 }}
              options={[
                { label: tr("All Status", "全部状态"), value: "all" },
                { label: tr("Published", "已发布"), value: "published" },
                { label: tr("Draft", "草稿"), value: "draft" },
              ]}
            />
            <Button onClick={() => loadArticles(searchText, statusFilter)}>{tr("Refresh", "刷新")}</Button>
          </Space>
          <Table rowKey="id" loading={loading} columns={columns} dataSource={articles} pagination={{ pageSize: 10 }} />
        </Card>
      </Space>

      <Modal
        title={isEditing ? tr("Edit Article", "编辑文章") : tr("Add Article", "新增文章")}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={saveArticle}
        confirmLoading={saving}
        width={1080}
        okText={isEditing ? tr("Save Changes", "保存更新") : tr("Create Article", "创建文章")}
        cancelText={tr("Cancel", "取消")}
      >
        <Form form={form} layout="vertical">
          <Card size="small" title={tr("Article Information", "文章基本信息")} style={{ marginBottom: 16 }}>
            <Form.Item name="title" label={tr("Article Title (English)", "文章标题（英文）")} rules={[{ required: true, message: tr("Enter the article title", "请填写英文文章标题") }]}>
              <Input placeholder="How to export chemicals from China" />
            </Form.Item>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 180px 180px", gap: 16 }}>
              <Form.Item name="slug" label={tr("Article URL (Slug)", "文章链接（Slug）")}>
                <Input placeholder="how-to-export-class-3-chemicals" />
              </Form.Item>
              <Form.Item name="publish_date" label={tr("Publish Date", "发布日期")}>
                <Input type="date" />
              </Form.Item>
              <Form.Item name="status" label={tr("Status", "状态")} rules={[{ required: true }]}>
                <Select options={[{ label: tr("Draft", "草稿"), value: "draft" }, { label: tr("Published", "已发布"), value: "published" }]} />
              </Form.Item>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Form.Item name="cover_image" label={tr("Cover Image URL", "封面图片地址")}>
                <Input placeholder="https://..." />
              </Form.Item>
              <Form.Item name="related_products" label={tr("Related Products", "关联产品")}>
                <Input placeholder="Methanol, Toluene, IPA" />
              </Form.Item>
            </div>
            <Space style={{ marginBottom: 12 }} wrap>
              <Upload accept="image/*" showUploadList={false} beforeUpload={uploadCover}>
                <Button loading={uploading} icon={<UploadOutlined />}>{tr("Upload Cover", "上传封面")}</Button>
              </Upload>
              <Button onClick={generateSlugAndSeo}>{tr("Generate URL & SEO", "自动生成链接与 SEO")}</Button>
              <Form.Item name="featured" valuePropName="checked" style={{ marginBottom: 0 }}>
                <Checkbox>{tr("Featured on website", "推荐到网站首页")}</Checkbox>
              </Form.Item>
            </Space>
            {coverImageValue && <Image src={coverImageValue} height={120} style={{ objectFit: "cover", borderRadius: 8 }} />}
          </Card>

          <Card size="small" title={tr(`Content Editor (${wordCount} words)`, `英文正文编辑（约 ${wordCount} 词）`)} style={{ marginBottom: 16 }}>
            <Space style={{ marginBottom: 12 }} wrap>
              <Button onClick={() => insertAtCursor("\n\n", "\n\n", "Write paragraph here")}>{tr("Paragraph", "正文段落")}</Button>
              <Button onClick={() => insertAtCursor("\n# ", "\n", "Article title")}>{tr("Title", "文章标题")}</Button>
              <Button onClick={() => insertAtCursor("\n## ", "\n", "Section title")}>{tr("Section", "章节标题")}</Button>
              <Button onClick={() => insertAtCursor("**", "**", "Bold text")}>{tr("Bold", "加粗")}</Button>
              <Button onClick={() => insertAtCursor("\n- ", "\n", "List item")}>{tr("Bullet List", "项目列表")}</Button>
              <Button onClick={() => insertAtCursor("\n1. ", "\n", "List item")}>{tr("Numbered List", "编号列表")}</Button>
              <Button onClick={() => insertAtCursor("\n> ", "\n", "Important note")}>{tr("Quote", "重点说明")}</Button>
              <Button onClick={() => insertAtCursor("[", "](https://example.com)", "Link text")}>{tr("Link", "插入链接")}</Button>
              <Upload accept="image/*" showUploadList={false} beforeUpload={uploadInlineImage}>
                <Button loading={uploading} icon={<UploadOutlined />}>{tr("Insert Image", "插入图片")}</Button>
              </Upload>
            </Space>
            <Form.Item name="content" label={tr("English Content", "英文正文（可直接选择文字后使用上方工具）")} rules={[{ required: true, message: tr("Enter article content", "请填写英文正文") }]}>
              <Input.TextArea ref={contentEditorRef} rows={22} placeholder="Click here to write or edit the English article. Select text, then use the formatting buttons above." style={{ fontSize: 15, lineHeight: 1.75 }} />
            </Form.Item>
            <div>
              <div style={{ marginBottom: 8, fontWeight: 600 }}>{tr("Article Preview", "文章预览")}</div>
              <div style={{ minHeight: 220, maxHeight: 520, overflow: "auto", border: "1px solid #e5e7eb", borderRadius: 8, padding: 18, background: "#fff" }}>{renderMarkdownPreview(contentValue)}</div>
            </div>
          </Card>

          <Card
            size="small"
            title={tr("Chinese Draft", "中文翻译草稿")}
            extra={<Button type="primary" loading={translating} onClick={generateChineseDraft}>{tr("Generate Chinese Draft", "生成中文草稿")}</Button>}
            style={{ marginBottom: 16 }}
          >
            <div style={{ marginBottom: 14, color: "#64748b" }}>
              {tr(
                "AI creates a draft while preserving Markdown and chemical terminology. Review it before enabling the Chinese version.",
                "系统会保留 Markdown 排版并翻译化工专业术语。生成后请先检查，未勾选发布前不会在前台显示。",
              )}
            </div>
            <Form.Item name="title_zh" label={tr("Chinese Title", "中文标题")}>
              <Input placeholder="生成后可人工修改" />
            </Form.Item>
            <Form.Item name="content_zh" label={tr("Chinese Content", "中文正文（可人工修改）")}>
              <Input.TextArea rows={16} placeholder="点击右上角“生成中文草稿”" style={{ fontSize: 15, lineHeight: 1.75 }} />
            </Form.Item>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Form.Item name="seo_title_zh" label={tr("Chinese SEO Title", "中文 SEO 标题")}>
                <Input maxLength={70} showCount />
              </Form.Item>
              <Form.Item name="seo_description_zh" label={tr("Chinese SEO Description", "中文 SEO 描述")}>
                <Input.TextArea rows={2} maxLength={160} showCount />
              </Form.Item>
            </div>
            <Form.Item name="publish_chinese" valuePropName="checked" style={{ marginBottom: 0 }}>
              <Checkbox>{tr("Publish the reviewed Chinese version", "我已检查译文，发布中文版")}</Checkbox>
            </Form.Item>
          </Card>

          <Card size="small" title={tr("Search Engine Optimization (SEO)", "搜索引擎优化（SEO）")}>
            <Form.Item name="seo_title" label={tr("SEO Title (English)", "SEO 标题（英文）")}><Input maxLength={70} showCount /></Form.Item>
            <Form.Item name="seo_description" label={tr("SEO Description (English)", "SEO 描述（英文）")}><Input.TextArea rows={3} maxLength={160} showCount /></Form.Item>
          </Card>
        </Form>
      </Modal>
    </div>
  );
}
