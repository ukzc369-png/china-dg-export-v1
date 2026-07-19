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
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  PlusOutlined,
  StarFilled,
  StarOutlined,
  UploadOutlined,
} from "@ant-design/icons";
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
  title_zh?: string;
  slug?: string;
  content?: string;
  content_zh?: string;
  seo_title?: string;
  seo_title_zh?: string;
  seo_description?: string;
  seo_description_zh?: string;
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

function readChinese(value: string | null | undefined) {
  if (!value) return "";
  try {
    const parsed = JSON.parse(value) as { zh?: string };
    return parsed && typeof parsed === "object" ? parsed.zh || "" : "";
  } catch {
    return "";
  }
}

function storeBilingual(english: string, chinese?: string) {
  return chinese?.trim() ? JSON.stringify({ en: english, zh: chinese.trim() }) : english;
}

type InlineArticleImage = {
  alt: string;
  url: string;
  blockIndex: number;
};

function getContentBlocks(content: string) {
  return content.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
}

function getInlineArticleImages(content: string): InlineArticleImage[] {
  return getContentBlocks(content).flatMap((block, blockIndex) => {
    const match = block.match(/^!\[([^\]]*)\]\((https?:\/\/[^)]+)\)$/);
    return match ? [{ alt: match[1] || "Article image", url: match[2], blockIndex }] : [];
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
  const [editorMode, setEditorMode] = useState<"visual" | "source">("visual");
  const contentEditorRef = useRef<TextAreaRef>(null);

  const contentValue = Form.useWatch("content", form) || "";
  const coverImageValue = Form.useWatch("cover_image", form) || "";
  const isEditing = Boolean(editingArticle);

  const wordCount = useMemo(() => contentValue.trim().split(/\s+/).filter(Boolean).length, [contentValue]);
  const inlineImages = useMemo(() => getInlineArticleImages(contentValue), [contentValue]);

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
    form.setFieldsValue({ status: "draft", publish_date: todayDate(), featured: false });
    setEditorMode("visual");
    setModalOpen(true);
  }

  function openEditModal(article: Article) {
    setEditingArticle(article);
    form.setFieldsValue({
      title: readEnglish(article.title),
      title_zh: readChinese(article.title),
      slug: article.slug || "",
      content: readEnglish(article.content),
      content_zh: readChinese(article.content),
      seo_title: readEnglish(article.seo_title),
      seo_title_zh: readChinese(article.seo_title),
      seo_description: readEnglish(article.seo_description),
      seo_description_zh: readChinese(article.seo_description),
      cover_image: article.cover_image || "",
      related_products: article.related_products || "",
      publish_date: article.publish_date || article.created_at?.slice(0, 10) || todayDate(),
      featured: Boolean(article.featured),
      status: (article.status as ArticleStatus) || "draft",
    });
    setEditorMode("visual");
    setModalOpen(true);
  }

  async function saveArticle() {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const slug = values.slug || createSlug(values.title);
      const payload = {
        title: storeBilingual(values.title, values.title_zh),
        slug,
        content: storeBilingual(values.content || "", values.content_zh),
        seo_title: storeBilingual(values.seo_title || values.title, values.seo_title_zh || values.title_zh),
        seo_description: storeBilingual(values.seo_description || (values.content || "").slice(0, 155), values.seo_description_zh),
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

  function moveInlineImage(blockIndex: number, direction: -1 | 1) {
    const blocks = getContentBlocks(form.getFieldValue("content") || "");
    const targetIndex = blockIndex + direction;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    [blocks[blockIndex], blocks[targetIndex]] = [blocks[targetIndex], blocks[blockIndex]];
    form.setFieldValue("content", blocks.join("\n\n"));
  }

  function removeInlineImage(blockIndex: number) {
    const blocks = getContentBlocks(form.getFieldValue("content") || "");
    blocks.splice(blockIndex, 1);
    form.setFieldValue("content", blocks.join("\n\n"));
    message.success(tr("Image removed from the article", "图片已从正文中删除"));
  }

  function updateContentBlock(blockIndex: number, value: string) {
    const blocks = getContentBlocks(form.getFieldValue("content") || "");
    blocks[blockIndex] = value;
    form.setFieldValue("content", blocks.join("\n\n"));
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

  async function generateChineseTranslation() {
    const values = form.getFieldsValue();
    if (!values.title?.trim() || !values.content?.trim()) {
      message.warning(tr("Write the English title and content first", "请先填写英文标题和正文"));
      return;
    }

    setTranslating(true);
    try {
      const { data } = await supabase.auth.getSession();
      const accessToken = data.session?.access_token;
      if (!accessToken) throw new Error(tr("Please log in again", "登录已失效，请重新登录"));

      const response = await fetch("/api/translate-article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: values.title,
          content: values.content,
          seoTitle: values.seo_title || values.title,
          seoDescription: values.seo_description || "",
        }),
      });
      const result = await response.json() as {
        success?: boolean;
        error?: string;
        titleZh?: string;
        contentZh?: string;
        seoTitleZh?: string;
        seoDescriptionZh?: string;
      };
      if (!response.ok || !result.success) throw new Error(result.error || tr("Translation failed", "翻译失败"));

      form.setFieldsValue({
        title_zh: result.titleZh || "",
        content_zh: result.contentZh || "",
        seo_title_zh: result.seoTitleZh || "",
        seo_description_zh: result.seoDescriptionZh || "",
      });
      message.success(tr("Chinese draft generated. Please review it before saving.", "中文初稿已生成，请检查专业术语后再保存。"));
    } catch (error) {
      message.error(error instanceof Error ? error.message : tr("Translation failed", "翻译失败"));
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
            <Form.Item name="content" hidden rules={[{ required: true, message: tr("Enter article content", "请填写英文正文") }]}>
              <Input />
            </Form.Item>
            <Space style={{ width: "100%", justifyContent: "space-between", marginBottom: 10 }} wrap>
              <strong>{tr("English Content", "英文正文")}</strong>
              <Space.Compact>
                <Button type={editorMode === "visual" ? "primary" : "default"} onClick={() => setEditorMode("visual")}>
                  {tr("Visual Editor", "可视化编辑")}
                </Button>
                <Button type={editorMode === "source" ? "primary" : "default"} onClick={() => setEditorMode("source")}>
                  {tr("Markdown Source", "源码编辑")}
                </Button>
              </Space.Compact>
            </Space>
            {editorMode === "source" ? (
              <Input.TextArea
                ref={contentEditorRef}
                rows={22}
                value={contentValue}
                onChange={(event) => form.setFieldValue("content", event.target.value)}
                placeholder="Click here to write or edit the English article. Select text, then use the formatting buttons above."
                style={{ marginBottom: 16, fontSize: 15, lineHeight: 1.75 }}
              />
            ) : (
              <div style={{ marginBottom: 16, border: "1px solid #d9d9d9", borderRadius: 8, padding: 16, background: "#f8fafc" }}>
                {getContentBlocks(contentValue).map((block, blockIndex) => {
                  const image = inlineImages.find((item) => item.blockIndex === blockIndex);
                  if (image) {
                    return (
                      <div key={`${image.url}-${blockIndex}`} style={{ margin: "12px 0", padding: 10, border: "1px solid #cbd5e1", borderRadius: 8, background: "#fff" }}>
                        <Image src={image.url} alt={image.alt} width="100%" style={{ display: "block", maxHeight: 420, objectFit: "contain", borderRadius: 6 }} />
                        <Space style={{ width: "100%", justifyContent: "space-between", marginTop: 8 }} wrap>
                          <Input
                            value={image.alt}
                            onChange={(event) => updateContentBlock(blockIndex, `![${event.target.value}](${image.url})`)}
                            prefix={tr("Caption:", "图片说明：")}
                            style={{ width: 360 }}
                          />
                          <Space size={4}>
                            <Button size="small" icon={<ArrowUpOutlined />} disabled={blockIndex === 0} onClick={() => moveInlineImage(blockIndex, -1)}>{tr("Up", "上移")}</Button>
                            <Button size="small" icon={<ArrowDownOutlined />} disabled={blockIndex === getContentBlocks(contentValue).length - 1} onClick={() => moveInlineImage(blockIndex, 1)}>{tr("Down", "下移")}</Button>
                            <Popconfirm title={tr("Remove this image from the article?", "从正文中删除这张图片？")} onConfirm={() => removeInlineImage(blockIndex)} okText={tr("Remove", "删除")} cancelText={tr("Cancel", "取消")}>
                              <Button danger size="small" icon={<DeleteOutlined />}>{tr("Remove", "删除")}</Button>
                            </Popconfirm>
                          </Space>
                        </Space>
                      </div>
                    );
                  }
                  return (
                    <Input.TextArea
                      key={`text-${blockIndex}`}
                      autoSize={{ minRows: block.startsWith("#") ? 1 : 2, maxRows: 16 }}
                      value={block}
                      onChange={(event) => updateContentBlock(blockIndex, event.target.value)}
                      style={{
                        margin: "6px 0",
                        border: "1px solid transparent",
                        background: "#fff",
                        fontSize: block.startsWith("# ") ? 23 : block.startsWith("## ") ? 19 : 15,
                        fontWeight: block.startsWith("#") ? 700 : 400,
                        lineHeight: 1.75,
                      }}
                    />
                  );
                })}
              </div>
            )}
            <div>
              <div style={{ marginBottom: 8, fontWeight: 600 }}>{tr("Article Preview", "文章预览")}</div>
              <div style={{ minHeight: 220, maxHeight: 520, overflow: "auto", border: "1px solid #e5e7eb", borderRadius: 8, padding: 18, background: "#fff" }}>{renderMarkdownPreview(contentValue)}</div>
            </div>
          </Card>

          <Card
            size="small"
            title={tr("Chinese Translation Review", "中文译文检查")}
            extra={
              <Button type="primary" loading={translating} onClick={generateChineseTranslation}>
                {tr("Generate Chinese Translation", "一键生成中文译文")}
              </Button>
            }
            style={{ marginBottom: 16 }}
          >
            <p style={{ marginTop: 0, color: "#64748b" }}>
              {tr(
                "AI creates a draft while preserving Markdown images. Review chemical names, regulations and logistics terms before saving.",
                "系统会保留 Markdown 图片并生成中文初稿。保存前请重点检查化学品名称、法规和物流专业术语。",
              )}
            </p>
            <Form.Item name="title_zh" label={tr("Chinese Title", "中文标题")}>
              <Input placeholder="自动生成后可人工修改" />
            </Form.Item>
            <Form.Item name="content_zh" label={tr("Chinese Content", "中文正文")}>
              <Input.TextArea rows={16} placeholder="点击“一键生成中文译文”，然后在这里检查和修改。" style={{ fontSize: 15, lineHeight: 1.75 }} />
            </Form.Item>
            <Form.Item name="seo_title_zh" label={tr("Chinese SEO Title", "中文 SEO 标题")}>
              <Input maxLength={70} showCount />
            </Form.Item>
            <Form.Item name="seo_description_zh" label={tr("Chinese SEO Description", "中文 SEO 描述")}>
              <Input.TextArea rows={3} maxLength={160} showCount />
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
