import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, StarFilled, StarOutlined } from "@ant-design/icons";
import { supabase } from "../lib/supabase";

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

export default function ArticlesPage() {
  const [form] = Form.useForm<ArticleFormValues>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const isEditing = Boolean(editingArticle);

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
        content: values.content || null,
        seo_title: values.seo_title || values.title,
        seo_description: values.seo_description || null,
        cover_image: values.cover_image || null,
        related_products: values.related_products || null,
        publish_date: values.publish_date || todayDate(),
        featured: Boolean(values.featured),
        status: values.status || "draft",
      };

      const { error } = isEditing
        ? await supabase.from("articles").update(payload).eq("id", editingArticle?.id)
        : await supabase.from("articles").insert([payload]);

      if (error) {
        message.error(error.message || "Save failed");
        return;
      }

      message.success(isEditing ? "Article updated" : "Article created");
      setModalOpen(false);
      setEditingArticle(null);
      form.resetFields();
      await loadArticles();
    } finally {
      setSaving(false);
    }
  }

  async function deleteArticle(id: number) {
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) {
      message.error(error.message || "Delete failed");
      return;
    }
    message.success("Article deleted");
    await loadArticles();
  }

  async function toggleFeatured(article: Article) {
    const { error } = await supabase
      .from("articles")
      .update({ featured: !article.featured })
      .eq("id", article.id);
    if (error) {
      message.error(error.message);
      return;
    }
    await loadArticles();
  }

  const columns: ColumnsType<Article> = useMemo(
    () => [
      { title: "ID", dataIndex: "id", width: 70, sorter: (a, b) => a.id - b.id },
      {
        title: "Cover",
        dataIndex: "cover_image",
        width: 90,
        render: (url: string | null) =>
          url ? <img src={url} alt="cover" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8 }} /> : "-",
      },
      {
        title: "Article",
        render: (_, record) => (
          <Space direction="vertical" size={2}>
            <Space>
              <b>{record.title}</b>
              {record.featured ? <Tag color="gold">Featured</Tag> : null}
            </Space>
            <span style={{ color: "#777" }}>{record.slug || "No slug"}</span>
          </Space>
        ),
      },
      { title: "SEO Title", dataIndex: "seo_title", width: 220, render: (value: string | null) => value || "-" },
      { title: "Related", dataIndex: "related_products", width: 180, render: (value: string | null) => value || "-" },
      { title: "Publish Date", dataIndex: "publish_date", width: 130, render: (value: string | null) => value || "-" },
      {
        title: "Status",
        dataIndex: "status",
        width: 120,
        render: (status: string | null) =>
          status === "published" ? <Tag color="green">Published</Tag> : <Tag>Draft</Tag>,
      },
      {
        title: "Action",
        width: 230,
        fixed: "right",
        render: (_, record) => (
          <Space>
            <Button size="small" onClick={() => openEditModal(record)}>
              Edit
            </Button>
            <Button
              size="small"
              icon={record.featured ? <StarFilled /> : <StarOutlined />}
              onClick={() => toggleFeatured(record)}
            >
              Featured
            </Button>
            <Popconfirm title="Delete this article?" onConfirm={() => deleteArticle(record.id)}>
              <Button danger size="small">Delete</Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    []
  );

  return (
    <div>
      <Card
        title="Articles Management"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>Add Article</Button>}
      >
        <Space style={{ marginBottom: 16 }} wrap>
          <Input.Search
            allowClear
            placeholder="Search title / slug / SEO / related products"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={(value) => loadArticles(value)}
            style={{ width: 380 }}
          />
          <Select
            value={statusFilter}
            style={{ width: 160 }}
            onChange={(value) => {
              setStatusFilter(value);
              loadArticles(searchText, value);
            }}
            options={[
              { label: "All Status", value: "all" },
              { label: "Draft", value: "draft" },
              { label: "Published", value: "published" },
            ]}
          />
          <Button onClick={() => loadArticles()}>Refresh</Button>
        </Space>

        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={articles}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 1250 }}
        />
      </Card>

      <Modal
        title={isEditing ? "Edit Article" : "Add Article"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={saveArticle}
        confirmLoading={saving}
        destroyOnHidden
        width={920}
      >
        <Form form={form} layout="vertical" initialValues={{ status: "draft", featured: false }}>
          <Form.Item label="Title" name="title" rules={[{ required: true, message: "Please enter article title" }]}>
            <Input placeholder="e.g. How to Export Dangerous Goods from China" />
          </Form.Item>

          <Space style={{ width: "100%" }} size="middle" align="start">
            <Form.Item label="Slug" name="slug" style={{ flex: 1 }}>
              <Input placeholder="auto-generated if empty" />
            </Form.Item>
            <Form.Item label="Publish Date" name="publish_date" style={{ flex: 1 }}>
              <Input placeholder="YYYY-MM-DD" />
            </Form.Item>
          </Space>

          <Form.Item label="Cover Image URL" name="cover_image">
            <Input placeholder="Article cover image URL" />
          </Form.Item>

          <Form.Item label="Content" name="content">
            <Input.TextArea rows={10} placeholder="Article content. Use line breaks for paragraphs." />
          </Form.Item>

          <Space style={{ width: "100%" }} size="middle" align="start">
            <Form.Item label="Related Products" name="related_products" style={{ flex: 1 }}>
              <Input placeholder="Methanol, Acetone, IPA" />
            </Form.Item>
            <Form.Item label="Status" name="status" style={{ flex: 1 }}>
              <Select options={[{ label: "Draft", value: "draft" }, { label: "Published", value: "published" }]} />
            </Form.Item>
          </Space>

          <Form.Item name="featured" valuePropName="checked">
            <Checkbox>Featured article / SEO priority</Checkbox>
          </Form.Item>

          <Form.Item label="SEO Title" name="seo_title">
            <Input placeholder="SEO title" />
          </Form.Item>

          <Form.Item label="SEO Description" name="seo_description">
            <Input.TextArea rows={3} placeholder="SEO description" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
