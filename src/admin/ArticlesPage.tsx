import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
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
import { PlusOutlined } from "@ant-design/icons";
import { supabase } from "../lib/supabase";

type ArticleStatus = "draft" | "published";

type Article = {
  id: number;
  title: string;
  slug: string | null;
  content: string | null;
  seo_title: string | null;
  seo_description: string | null;
  status: ArticleStatus | string | null;
  created_at: string;
};

type ArticleFormValues = {
  title: string;
  slug?: string;
  content?: string;
  seo_title?: string;
  seo_description?: string;
  status: ArticleStatus;
};

export default function ArticlesPage() {
  const [form] = Form.useForm<ArticleFormValues>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [searchText, setSearchText] = useState("");

  const isEditing = Boolean(editingArticle);

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles(keyword = searchText) {
    setLoading(true);

    let query = supabase
      .from("articles")
      .select("*")
      .order("id", { ascending: false });

    const trimmedKeyword = keyword.trim();

    if (trimmedKeyword) {
      query = query.or(
        `title.ilike.%${trimmedKeyword}%,slug.ilike.%${trimmedKeyword}%,seo_title.ilike.%${trimmedKeyword}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      message.error(error.message || "Failed to load articles");
    } else {
      setArticles(data || []);
    }

    setLoading(false);
  }

  function createSlug(title: string) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function openCreateModal() {
    setEditingArticle(null);
    form.resetFields();
    form.setFieldsValue({ status: "draft" });
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
        status: values.status || "draft",
      };

      const { error } = isEditing
        ? await supabase
            .from("articles")
            .update(payload)
            .eq("id", editingArticle?.id)
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

  const columns: ColumnsType<Article> = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        width: 80,
        sorter: (a, b) => a.id - b.id,
      },
      {
        title: "Title",
        dataIndex: "title",
      },
      {
        title: "Slug",
        dataIndex: "slug",
        width: 240,
        render: (value: string | null) => value || "-",
      },
      {
        title: "SEO Title",
        dataIndex: "seo_title",
        width: 240,
        render: (value: string | null) => value || "-",
      },
      {
        title: "Status",
        dataIndex: "status",
        width: 130,
        render: (status: string | null) =>
          status === "published" ? (
            <Tag color="green">Published</Tag>
          ) : (
            <Tag color="default">Draft</Tag>
          ),
      },
      {
        title: "Created",
        dataIndex: "created_at",
        width: 180,
        render: (value: string) =>
          value ? new Date(value).toLocaleString() : "-",
      },
      {
        title: "Action",
        width: 180,
        render: (_, record) => (
          <Space>
            <Button size="small" onClick={() => openEditModal(record)}>
              Edit
            </Button>

            <Popconfirm
              title="Delete this article?"
              onConfirm={() => deleteArticle(record.id)}
            >
              <Button danger size="small">
                Delete
              </Button>
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
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            Add Article
          </Button>
        }
      >
        <Space style={{ marginBottom: 16 }}>
          <Input.Search
            allowClear
            placeholder="Search title / slug / SEO title"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={(value) => loadArticles(value)}
            style={{ width: 360 }}
          />

          <Button onClick={() => loadArticles()}>Refresh</Button>
        </Space>

        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={articles}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
          }}
          scroll={{ x: 1100 }}
        />
      </Card>

      <Modal
        title={isEditing ? "Edit Article" : "Add Article"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={saveArticle}
        confirmLoading={saving}
        destroyOnHidden
        width={800}
      >
        <Form form={form} layout="vertical" initialValues={{ status: "draft" }}>
          <Form.Item
            label="Title"
            name="title"
            rules={[
              {
                required: true,
                message: "Please enter article title",
              },
            ]}
          >
            <Input placeholder="e.g. How to Export Dangerous Goods from China" />
          </Form.Item>

          <Form.Item label="Slug" name="slug">
            <Input placeholder="auto-generated if empty" />
          </Form.Item>

          <Form.Item label="Content" name="content">
            <Input.TextArea rows={8} placeholder="Article content" />
          </Form.Item>

          <Form.Item label="SEO Title" name="seo_title">
            <Input placeholder="SEO title" />
          </Form.Item>

          <Form.Item label="SEO Description" name="seo_description">
            <Input.TextArea rows={3} placeholder="SEO description" />
          </Form.Item>

          <Form.Item label="Status" name="status">
            <Select
              options={[
                {
                  label: "Draft",
                  value: "draft",
                },
                {
                  label: "Published",
                  value: "published",
                },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}