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
  cover_image?: string;
  related_products?: string;
  publish_date?: string;
  featured?: boolean;
  status: ArticleStatus;
};

const BUCKET_NAME = "article-images";

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
      message.error(error.message || "Failed to load articles");
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
    form.setFieldsValue({
      title: article.title || "",
      slug: article.slug || "",
      content: article.content || "",
      seo_title: article.seo_title || "",
      seo_description: article.seo_description || "",
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
      const payload = {
        title: values.title,
        slug,
        content: values.content || "",
        seo_title: values.seo_title || values.title,
        seo_description: values.seo_description || (values.content || "").slice(0, 155),
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
        message.error(error.message || "Failed to save article");
        return;
      }

      message.success(isEditing ? "Article updated" : "Article created");
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
    message.success("Article deleted");
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
        message.warning(`Upload failed: ${uploadError.message}. You can paste an image URL manually.`);
        return false;
      }

      const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(safeName);
      form.setFieldsValue({ cover_image: data.publicUrl });
      message.success(`Cover optimized and uploaded (${imageSizeLabel(optimized.size)})`);
      return false;
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Image processing failed");
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
        message.warning(`Upload failed: ${uploadError.message}. You can paste an image URL manually.`);
        return false;
      }

      const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(safeName);
      insertContent(`\n![Article Image](${data.publicUrl})\n`);
      message.success(`Image optimized and inserted (${imageSizeLabel(optimized.size)})`);
      return false;
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Image processing failed");
      return false;
    } finally {
      setUploading(false);
    }
  }

  function insertContent(text: string) {
    form.setFieldsValue({ content: `${form.getFieldValue("content") || ""}${text}` });
  }

  function generateSlugAndSeo() {
    const title = form.getFieldValue("title") || "chemical-export-guide";
    const content = form.getFieldValue("content") || "Chemical export guide from ChinaDGExport.";
    form.setFieldsValue({
      slug: createSlug(title),
      seo_title: `${title} | ChinaDGExport`,
      seo_description: content.replace(/[#*\-\n]/g, " ").replace(/\s+/g, " ").trim().slice(0, 155),
    });
  }

  function exportArticles() {
    const rows = [
      ["ID", "Title", "Slug", "Status", "Featured", "Publish Date"],
      ...articles.map((item) => [
        String(item.id),
        item.title || "",
        item.slug || "",
        item.status || "",
        item.featured ? "yes" : "no",
        item.publish_date || item.created_at || "",
      ]),
    ];
    downloadCsv("articles.csv", rows);
  }

  const columns: ColumnsType<Article> = [
    {
      title: "Cover",
      dataIndex: "cover_image",
      width: 84,
      render: (url: string | null) =>
        url ? <Image src={url} width={52} height={52} style={{ objectFit: "cover", borderRadius: 8 }} /> : <div style={{ width: 52, height: 52, borderRadius: 8, background: "#f1f5f9" }} />,
    },
    {
      title: "Article",
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <strong>{record.title}</strong>
          <span style={{ color: "#64748b" }}>/{record.slug}</span>
          <Space wrap>
            {record.featured && <Tag color="gold" icon={<StarFilled />}>Featured</Tag>}
            {record.related_products && <Tag>{record.related_products}</Tag>}
          </Space>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (status) => <Tag color={status === "published" ? "green" : "default"}>{status}</Tag>,
    },
    { title: "Publish Date", dataIndex: "publish_date", width: 140 },
    {
      title: "Actions",
      width: 230,
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => openEditModal(record)}>Edit</Button>
          <Button size="small" icon={record.featured ? <StarFilled /> : <StarOutlined />} onClick={() => toggleFeatured(record)} />
          <Popconfirm title="Delete this article?" onConfirm={() => deleteArticle(record.id)}>
            <Button danger size="small">Delete</Button>
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
              <h2 style={{ margin: 0 }}>Articles CMS</h2>
              <p style={{ margin: "6px 0 0", color: "#64748b" }}>
                Manage SEO articles, markdown content, cover images, publish dates and featured insights.
              </p>
            </div>
            <Space>
              <Button onClick={exportArticles}>Export CSV</Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>Add Article</Button>
            </Space>
          </Space>
        </Card>

        <Space wrap>
          <Card size="small"><strong>{articles.length}</strong><div>Total Articles</div></Card>
          <Card size="small"><strong>{publishedCount}</strong><div>Published</div></Card>
          <Card size="small"><strong>{featuredCount}</strong><div>Featured</div></Card>
        </Space>

        <Card>
          <Space style={{ marginBottom: 16 }} wrap>
            <Input.Search
              placeholder="Search title, slug, SEO, related products"
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
                { label: "All Status", value: "all" },
                { label: "Published", value: "published" },
                { label: "Draft", value: "draft" },
              ]}
            />
            <Button onClick={() => loadArticles(searchText, statusFilter)}>Refresh</Button>
          </Space>
          <Table rowKey="id" loading={loading} columns={columns} dataSource={articles} pagination={{ pageSize: 10 }} />
        </Card>
      </Space>

      <Modal
        title={isEditing ? "Edit Article" : "Add Article"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={saveArticle}
        confirmLoading={saving}
        width={1080}
        okText={isEditing ? "Update" : "Create"}
      >
        <Form form={form} layout="vertical">
          <Card size="small" title="Article Information" style={{ marginBottom: 16 }}>
            <Form.Item name="title" label="Title" rules={[{ required: true, message: "Article title is required" }]}>
              <Input placeholder="How to export Class 3 chemicals from China" />
            </Form.Item>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 180px 180px", gap: 16 }}>
              <Form.Item name="slug" label="Slug">
                <Input placeholder="how-to-export-class-3-chemicals" />
              </Form.Item>
              <Form.Item name="publish_date" label="Publish Date">
                <Input type="date" />
              </Form.Item>
              <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                <Select options={[{ label: "Draft", value: "draft" }, { label: "Published", value: "published" }]} />
              </Form.Item>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Form.Item name="cover_image" label="Cover Image URL">
                <Input placeholder="https://..." />
              </Form.Item>
              <Form.Item name="related_products" label="Related Products">
                <Input placeholder="Methanol, Toluene, IPA" />
              </Form.Item>
            </div>
            <Space style={{ marginBottom: 12 }} wrap>
              <Upload accept="image/*" showUploadList={false} beforeUpload={uploadCover}>
                <Button loading={uploading} icon={<UploadOutlined />}>Upload Cover</Button>
              </Upload>
              <Button onClick={generateSlugAndSeo}>Generate Slug & SEO</Button>
              <Form.Item name="featured" valuePropName="checked" style={{ marginBottom: 0 }}>
                <Checkbox>Featured on website</Checkbox>
              </Form.Item>
            </Space>
            {coverImageValue && <Image src={coverImageValue} height={120} style={{ objectFit: "cover", borderRadius: 8 }} />}
          </Card>

          <Card size="small" title={`Content Editor (${wordCount} words)`} style={{ marginBottom: 16 }}>
            <Space style={{ marginBottom: 12 }} wrap>
              <Button onClick={() => insertContent("\n## New Section\n")}>H2</Button>
              <Button onClick={() => insertContent("\n- Bullet point\n")}>Bullet</Button>
              <Button onClick={() => insertContent("\nNeed export support from China? Contact our DG team for documents, packing and shipment coordination.\n")}>CTA Text</Button>
              <Upload accept="image/*" showUploadList={false} beforeUpload={uploadInlineImage}>
                <Button loading={uploading} icon={<UploadOutlined />}>Insert Image</Button>
              </Upload>
            </Space>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Form.Item name="content" label="Markdown / Content">
                <Input.TextArea rows={16} placeholder="# Article title\n\n## Section\n\nWrite article content here..." />
              </Form.Item>
              <div>
                <div style={{ marginBottom: 8, fontWeight: 600 }}>Live Preview</div>
                <div style={{ minHeight: 360, maxHeight: 520, overflow: "auto", border: "1px solid #e5e7eb", borderRadius: 8, padding: 18, background: "#fff" }}>
                  {renderMarkdownPreview(contentValue)}
                </div>
              </div>
            </div>
          </Card>

          <Card size="small" title="SEO">
            <Form.Item name="seo_title" label="SEO Title">
              <Input maxLength={70} showCount placeholder="Chemical Export Guide | ChinaDGExport" />
            </Form.Item>
            <Form.Item name="seo_description" label="SEO Description">
              <Input.TextArea rows={3} maxLength={160} showCount placeholder="Short search description under 160 characters." />
            </Form.Item>
          </Card>
        </Form>
      </Modal>
    </div>
  );
}
