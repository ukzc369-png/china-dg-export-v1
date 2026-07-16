import { useEffect, useMemo, useState } from "react";
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
import { PlusOutlined, StarFilled, StarOutlined, UploadOutlined } from "@ant-design/icons";
import { supabase } from "../lib/supabase";
import { imageSizeLabel, optimizeUploadImage } from "./imageUpload";
import { articleTranslations } from "../articleTranslations";

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
  title_en: string;
  title_zh?: string;
  slug?: string;
  content_en?: string;
  content_zh?: string;
  seo_title_en?: string;
  seo_title_zh?: string;
  seo_description_en?: string;
  seo_description_zh?: string;
  cover_image?: string;
  related_products?: string;
  publish_date?: string;
  featured?: boolean;
  status: ArticleStatus;
};

const BUCKET_NAME = "article-images";

function readBilingual(value: string | null | undefined, fallbackZh = "") {
  if (!value) return { en: "", zh: fallbackZh };
  try {
    const parsed = JSON.parse(value) as { en?: string; zh?: string };
    if (parsed && typeof parsed === "object" && (parsed.en || parsed.zh)) {
      return { en: parsed.en || "", zh: parsed.zh || fallbackZh };
    }
  } catch {
    // Legacy articles contain plain English text.
  }
  return { en: value, zh: fallbackZh };
}

function storeBilingual(en = "", zh = "") {
  return JSON.stringify({ en, zh });
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
  const [form] = Form.useForm<ArticleFormValues>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [uploading, setUploading] = useState(false);

  const contentValue = Form.useWatch("content_en", form) || "";
  const contentZhValue = Form.useWatch("content_zh", form) || "";
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
    form.setFieldsValue({ status: "draft", publish_date: todayDate(), featured: false });
    setModalOpen(true);
  }

  function openEditModal(article: Article) {
    setEditingArticle(article);
    const fallbackZh = articleTranslations[article.slug || ""];
    const title = readBilingual(article.title, fallbackZh?.title);
    const content = readBilingual(article.content, fallbackZh?.content);
    const seoTitle = readBilingual(article.seo_title, fallbackZh?.seoTitle);
    const seoDescription = readBilingual(article.seo_description, fallbackZh?.seoDescription);
    form.setFieldsValue({
      title_en: title.en,
      title_zh: title.zh,
      slug: article.slug || "",
      content_en: content.en,
      content_zh: content.zh,
      seo_title_en: seoTitle.en,
      seo_title_zh: seoTitle.zh,
      seo_description_en: seoDescription.en,
      seo_description_zh: seoDescription.zh,
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

      const slug = values.slug || createSlug(values.title_en);
      const payload = {
        title: storeBilingual(values.title_en, values.title_zh),
        slug,
        content: storeBilingual(values.content_en, values.content_zh),
        seo_title: storeBilingual(values.seo_title_en || values.title_en, values.seo_title_zh || values.title_zh),
        seo_description: storeBilingual(
          values.seo_description_en || (values.content_en || "").slice(0, 155),
          values.seo_description_zh || (values.content_zh || "").slice(0, 155),
        ),
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
      insertContent("content_en", `\n![Article Image](${data.publicUrl})\n`);
      insertContent("content_zh", `\n![文章配图](${data.publicUrl})\n`);
      message.success(`图片已优化并插入中英文正文（${imageSizeLabel(optimized.size)}）`);
      return false;
    } catch (error) {
      message.error(error instanceof Error ? error.message : "图片处理失败");
      return false;
    } finally {
      setUploading(false);
    }
  }

  function insertContent(field: "content_en" | "content_zh", text: string) {
    form.setFieldsValue({ [field]: `${form.getFieldValue(field) || ""}${text}` });
  }

  function generateSlugAndSeo() {
    const title = form.getFieldValue("title_en") || "chemical-export-guide";
    const titleZh = form.getFieldValue("title_zh") || "";
    const content = form.getFieldValue("content_en") || "Chemical export guide from ChinaChemExport.";
    const contentZh = form.getFieldValue("content_zh") || "";
    form.setFieldsValue({
      slug: createSlug(title),
      seo_title_en: `${title} | ChinaChemExport`,
      seo_title_zh: titleZh ? `${titleZh} | ChinaChemExport` : "",
      seo_description_en: content.replace(/[#*\-\n]/g, " ").replace(/\s+/g, " ").trim().slice(0, 155),
      seo_description_zh: contentZh.replace(/[#*\-\n]/g, " ").replace(/\s+/g, " ").trim().slice(0, 155),
    });
  }

  function exportArticles() {
    const rows = [
      ["ID", "英文标题", "中文标题", "链接", "状态", "首页推荐", "发布日期"],
      ...articles.map((item) => {
        const title = readBilingual(item.title, articleTranslations[item.slug || ""]?.title);
        return [
          String(item.id), title.en, title.zh, item.slug || "",
          item.status === "published" ? "已发布" : "草稿",
          item.featured ? "是" : "否", item.publish_date || item.created_at || "",
        ];
      }),
    ];
    downloadCsv("articles.csv", rows);
  }

  const columns: ColumnsType<Article> = [
    {
      title: "封面",
      dataIndex: "cover_image",
      width: 84,
      render: (url: string | null) =>
        url ? <Image src={url} width={52} height={52} style={{ objectFit: "cover", borderRadius: 8 }} /> : <div style={{ width: 52, height: 52, borderRadius: 8, background: "#f1f5f9" }} />,
    },
    {
      title: "文章",
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <strong>{readBilingual(record.title, articleTranslations[record.slug || ""]?.title).zh || readBilingual(record.title).en}</strong>
          <span style={{ color: "#64748b" }}>/{record.slug}</span>
          <Space wrap>
            {record.featured && <Tag color="gold" icon={<StarFilled />}>推荐</Tag>}
            {record.related_products && <Tag>{record.related_products}</Tag>}
          </Space>
        </Space>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 120,
      render: (status) => <Tag color={status === "published" ? "green" : "default"}>{status === "published" ? "已发布" : "草稿"}</Tag>,
    },
    { title: "发布日期", dataIndex: "publish_date", width: 140 },
    {
      title: "操作",
      width: 230,
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => openEditModal(record)}>编辑</Button>
          <Button size="small" icon={record.featured ? <StarFilled /> : <StarOutlined />} onClick={() => toggleFeatured(record)} />
          <Popconfirm title="确定删除这篇文章吗？" onConfirm={() => deleteArticle(record.id)} okText="删除" cancelText="取消">
            <Button danger size="small">删除</Button>
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
              <h2 style={{ margin: 0 }}>博客文章管理</h2>
              <p style={{ margin: "6px 0 0", color: "#64748b" }}>
                管理中英文文章、SEO、Markdown 正文、封面、发布日期和首页推荐。
              </p>
            </div>
            <Space>
              <Button onClick={exportArticles}>导出 CSV</Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>新增文章</Button>
            </Space>
          </Space>
        </Card>

        <Space wrap>
          <Card size="small"><strong>{articles.length}</strong><div>文章总数</div></Card>
          <Card size="small"><strong>{publishedCount}</strong><div>已发布</div></Card>
          <Card size="small"><strong>{featuredCount}</strong><div>首页推荐</div></Card>
        </Space>

        <Card>
          <Space style={{ marginBottom: 16 }} wrap>
            <Input.Search
              placeholder="搜索标题、链接、SEO 或关联产品"
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
                { label: "全部状态", value: "all" },
                { label: "已发布", value: "published" },
                { label: "草稿", value: "draft" },
              ]}
            />
            <Button onClick={() => loadArticles(searchText, statusFilter)}>刷新</Button>
          </Space>
          <Table rowKey="id" loading={loading} columns={columns} dataSource={articles} pagination={{ pageSize: 10 }} />
        </Card>
      </Space>

      <Modal
        title={isEditing ? "编辑文章" : "新增文章"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={saveArticle}
        confirmLoading={saving}
        width={1080}
        okText={isEditing ? "保存更新" : "创建文章"}
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Card size="small" title="文章基本信息" style={{ marginBottom: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Form.Item name="title_en" label="英文标题" rules={[{ required: true, message: "请填写英文标题" }]}>
                <Input placeholder="How to export chemicals from China" />
              </Form.Item>
              <Form.Item name="title_zh" label="中文标题" rules={[{ required: true, message: "请填写中文标题" }]}>
                <Input placeholder="如何从中国出口化工品" />
              </Form.Item>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 180px 180px", gap: 16 }}>
              <Form.Item name="slug" label="文章链接（Slug）">
                <Input placeholder="how-to-export-class-3-chemicals" />
              </Form.Item>
              <Form.Item name="publish_date" label="发布日期">
                <Input type="date" />
              </Form.Item>
              <Form.Item name="status" label="状态" rules={[{ required: true }]}>
                <Select options={[{ label: "草稿", value: "draft" }, { label: "已发布", value: "published" }]} />
              </Form.Item>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Form.Item name="cover_image" label="封面图片地址">
                <Input placeholder="https://..." />
              </Form.Item>
              <Form.Item name="related_products" label="关联产品">
                <Input placeholder="Methanol, Toluene, IPA" />
              </Form.Item>
            </div>
            <Space style={{ marginBottom: 12 }} wrap>
              <Upload accept="image/*" showUploadList={false} beforeUpload={uploadCover}>
                <Button loading={uploading} icon={<UploadOutlined />}>上传封面</Button>
              </Upload>
              <Button onClick={generateSlugAndSeo}>自动生成链接与 SEO</Button>
              <Form.Item name="featured" valuePropName="checked" style={{ marginBottom: 0 }}>
                <Checkbox>推荐到网站首页</Checkbox>
              </Form.Item>
            </Space>
            {coverImageValue && <Image src={coverImageValue} height={120} style={{ objectFit: "cover", borderRadius: 8 }} />}
          </Card>

          <Card size="small" title={`中英文正文编辑（英文约 ${wordCount} 词）`} style={{ marginBottom: 16 }}>
            <Space style={{ marginBottom: 12 }} wrap>
              <Button onClick={() => { insertContent("content_en", "\n## New Section\n"); insertContent("content_zh", "\n## 新章节\n"); }}>插入章节</Button>
              <Button onClick={() => { insertContent("content_en", "\n- Bullet point\n"); insertContent("content_zh", "\n- 列表内容\n"); }}>插入列表</Button>
              <Upload accept="image/*" showUploadList={false} beforeUpload={uploadInlineImage}>
                <Button loading={uploading} icon={<UploadOutlined />}>插入图片</Button>
              </Upload>
            </Space>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Form.Item name="content_en" label="英文正文（Markdown）" rules={[{ required: true, message: "请填写英文正文" }]}>
                <Input.TextArea rows={18} placeholder="# English title\n\n## Section\n\nWrite English content here..." />
              </Form.Item>
              <Form.Item name="content_zh" label="中文正文（Markdown）" rules={[{ required: true, message: "请填写中文正文" }]}>
                <Input.TextArea rows={18} placeholder="# 中文标题\n\n## 章节\n\n在此填写中文正文..." />
              </Form.Item>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div><div style={{ marginBottom: 8, fontWeight: 600 }}>英文预览</div><div style={{ minHeight: 240, maxHeight: 420, overflow: "auto", border: "1px solid #e5e7eb", borderRadius: 8, padding: 18, background: "#fff" }}>{renderMarkdownPreview(contentValue)}</div></div>
              <div><div style={{ marginBottom: 8, fontWeight: 600 }}>中文预览</div><div style={{ minHeight: 240, maxHeight: 420, overflow: "auto", border: "1px solid #e5e7eb", borderRadius: 8, padding: 18, background: "#fff" }}>{renderMarkdownPreview(contentZhValue)}</div></div>
            </div>
          </Card>

          <Card size="small" title="搜索引擎优化（SEO）">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Form.Item name="seo_title_en" label="英文 SEO 标题"><Input maxLength={70} showCount /></Form.Item>
              <Form.Item name="seo_title_zh" label="中文 SEO 标题"><Input maxLength={70} showCount /></Form.Item>
              <Form.Item name="seo_description_en" label="英文 SEO 描述"><Input.TextArea rows={3} maxLength={160} showCount /></Form.Item>
              <Form.Item name="seo_description_zh" label="中文 SEO 描述"><Input.TextArea rows={3} maxLength={160} showCount /></Form.Item>
            </div>
          </Card>
        </Form>
      </Modal>
    </div>
  );
}
