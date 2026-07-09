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
  Upload,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { UploadFile } from "antd/es/upload/interface";
import { PlusOutlined, StarFilled, StarOutlined, UploadOutlined } from "@ant-design/icons";
import { supabase } from "../lib/supabase";

type ProductStatus = "active" | "inactive";

type Product = {
  id: number;
  name: string;
  cas: string | null;
  un_number: string | null;
  category: string | null;
  description: string | null;
  image_url: string | null;
  image_gallery?: string | null;
  specification: string | null;
  packing?: string | null;
  markets?: string | null;
  featured?: boolean | null;
  seo_title?: string | null;
  seo_description?: string | null;
  status: ProductStatus | string | null;
  created_at: string;
};

type ProductFormValues = {
  name: string;
  cas?: string;
  un_number?: string;
  category?: string;
  description?: string;
  specification?: string;
  image_url?: string;
  image_gallery?: string;
  packing?: string;
  markets?: string;
  featured?: boolean;
  seo_title?: string;
  seo_description?: string;
  status: ProductStatus;
};

const BUCKET_NAME = "product-images";

function normalizeCas(value?: string) {
  return value?.trim() || "";
}

function isValidCas(value?: string) {
  const cas = normalizeCas(value);
  return !cas || /^\d{2,7}-\d{2}-\d$/.test(cas);
}

export default function ProductsPage() {
  const [form] = Form.useForm<ProductFormValues>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const isEditing = Boolean(editingProduct);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts(keyword = searchText, status = statusFilter) {
    setLoading(true);

    let query = supabase.from("products").select("*").order("id", { ascending: false });

    const trimmedKeyword = keyword.trim();

    if (trimmedKeyword) {
      query = query.or(
        `name.ilike.%${trimmedKeyword}%,cas.ilike.%${trimmedKeyword}%,un_number.ilike.%${trimmedKeyword}%,category.ilike.%${trimmedKeyword}%,markets.ilike.%${trimmedKeyword}%`
      );
    }

    if (status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      message.error(error.message || "Failed to load products");
    } else {
      setProducts((data || []) as Product[]);
    }

    setLoading(false);
  }

  function openCreateModal() {
    setEditingProduct(null);
    setFileList([]);
    form.resetFields();
    form.setFieldsValue({ status: "active", featured: false });
    setModalOpen(true);
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);

    form.setFieldsValue({
      name: product.name || "",
      cas: product.cas || "",
      un_number: product.un_number || "",
      category: product.category || "",
      description: product.description || "",
      specification: product.specification || "",
      image_url: product.image_url || "",
      image_gallery: product.image_gallery || "",
      packing: product.packing || "",
      markets: product.markets || "",
      featured: Boolean(product.featured),
      seo_title: product.seo_title || "",
      seo_description: product.seo_description || "",
      status: (product.status as ProductStatus) || "active",
    });

    setFileList(
      product.image_url
        ? [
            {
              uid: "current-image",
              name: "Current image",
              status: "done",
              url: product.image_url,
            },
          ]
        : []
    );

    setModalOpen(true);
  }

  async function saveProduct() {
    try {
      const values = await form.validateFields();

      if (!isValidCas(values.cas)) {
        message.error("CAS format should look like 67-56-1");
        return;
      }

      setSaving(true);

      const payload = {
        name: values.name,
        cas: values.cas || null,
        un_number: values.un_number || null,
        category: values.category || null,
        description: values.description || null,
        specification: values.specification || null,
        image_url: values.image_url || null,
        image_gallery: values.image_gallery || null,
        packing: values.packing || null,
        markets: values.markets || null,
        featured: Boolean(values.featured),
        seo_title: values.seo_title || values.name,
        seo_description: values.seo_description || values.description || null,
        status: values.status || "active",
      };

      const { error } = isEditing
        ? await supabase.from("products").update(payload).eq("id", editingProduct?.id)
        : await supabase.from("products").insert([payload]);

      if (error) {
        message.error(error.message || "Save failed");
        return;
      }

      message.success(isEditing ? "Product updated" : "Product created");
      setModalOpen(false);
      setEditingProduct(null);
      form.resetFields();
      setFileList([]);
      await loadProducts();
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(id: number) {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      message.error(error.message || "Delete failed");
      return;
    }

    message.success("Product deleted");
    await loadProducts();
  }

  async function toggleFeatured(product: Product) {
    const { error } = await supabase
      .from("products")
      .update({ featured: !product.featured })
      .eq("id", product.id);

    if (error) {
      message.error(error.message);
      return;
    }

    await loadProducts();
  }

  async function uploadImage(file: File) {
    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      message.error(error.message || "Image upload failed");
      setUploading(false);
      return false;
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    form.setFieldsValue({ image_url: data.publicUrl });
    setFileList([{ uid: filePath, name: file.name, status: "done", url: data.publicUrl }]);
    message.success("Image uploaded");
    setUploading(false);
    return false;
  }

  const columns: ColumnsType<Product> = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        width: 70,
        sorter: (a, b) => a.id - b.id,
      },
      {
        title: "Image",
        dataIndex: "image_url",
        width: 90,
        render: (url: string | null) =>
          url ? (
            <img
              src={url}
              alt="product"
              style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8 }}
            />
          ) : (
            "-"
          ),
      },
      {
        title: "Product",
        dataIndex: "name",
        render: (_, record) => (
          <Space direction="vertical" size={2}>
            <Space>
              <b>{record.name}</b>
              {record.featured ? <Tag color="gold">Featured</Tag> : null}
            </Space>
            <span style={{ color: "#777" }}>{record.category || "No category"}</span>
          </Space>
        ),
      },
      {
        title: "CAS / UN",
        width: 170,
        render: (_, record) => (
          <Space direction="vertical" size={2}>
            <span>CAS: {record.cas || "-"}</span>
            <span>UN: {record.un_number || "-"}</span>
          </Space>
        ),
      },
      {
        title: "Packing",
        dataIndex: "packing",
        width: 180,
        render: (value: string | null) => value || "-",
      },
      {
        title: "Markets",
        dataIndex: "markets",
        width: 180,
        render: (value: string | null) => value || "-",
      },
      {
        title: "Status",
        dataIndex: "status",
        width: 110,
        render: (status: string | null) =>
          status === "active" ? <Tag color="green">Active</Tag> : <Tag>Inactive</Tag>,
      },
      {
        title: "Created",
        dataIndex: "created_at",
        width: 170,
        render: (value: string) => (value ? new Date(value).toLocaleString() : "-"),
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
            <Popconfirm title="Delete this product?" onConfirm={() => deleteProduct(record.id)}>
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
        title="Products Management"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            Add Product
          </Button>
        }
      >
        <Space style={{ marginBottom: 16 }} wrap>
          <Input.Search
            allowClear
            placeholder="Search name / CAS / UN / category / markets"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={(value) => loadProducts(value)}
            style={{ width: 360 }}
          />
          <Select
            value={statusFilter}
            style={{ width: 160 }}
            onChange={(value) => {
              setStatusFilter(value);
              loadProducts(searchText, value);
            }}
            options={[
              { label: "All Status", value: "all" },
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
          />
          <Button onClick={() => loadProducts()}>Refresh</Button>
        </Space>

        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={products}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 1320 }}
        />
      </Card>

      <Modal
        title={isEditing ? "Edit Product" : "Add Product"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={saveProduct}
        confirmLoading={saving}
        destroyOnHidden
        width={920}
      >
        <Form form={form} layout="vertical" initialValues={{ status: "active", featured: false }}>
          <Form.Item label="Product Name" name="name" rules={[{ required: true, message: "Please enter product name" }]}>
            <Input placeholder="e.g. Methanol" />
          </Form.Item>

          <Space style={{ width: "100%" }} size="middle" align="start">
            <Form.Item
              label="CAS Number"
              name="cas"
              style={{ flex: 1 }}
              rules={[
                {
                  validator: (_, value) =>
                    isValidCas(value) ? Promise.resolve() : Promise.reject(new Error("CAS format should look like 67-56-1")),
                },
              ]}
            >
              <Input placeholder="e.g. 67-56-1" />
            </Form.Item>
            <Form.Item label="UN Number" name="un_number" style={{ flex: 1 }}>
              <Input placeholder="e.g. 1230" />
            </Form.Item>
          </Space>

          <Space style={{ width: "100%" }} size="middle" align="start">
            <Form.Item label="Category" name="category" style={{ flex: 1 }}>
              <Input placeholder="e.g. Alcohols" />
            </Form.Item>
            <Form.Item label="Status" name="status" style={{ flex: 1 }}>
              <Select
                options={[
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                ]}
              />
            </Form.Item>
          </Space>

          <Space style={{ width: "100%" }} size="middle" align="start">
            <Form.Item label="Packing Options" name="packing" style={{ flex: 1 }}>
              <Input placeholder="Drums / IBC / ISO Tank" />
            </Form.Item>
            <Form.Item label="Target Markets" name="markets" style={{ flex: 1 }}>
              <Input placeholder="Middle East, Southeast Asia, Europe" />
            </Form.Item>
          </Space>

          <Form.Item name="featured" valuePropName="checked">
            <Checkbox>Featured product on website / homepage</Checkbox>
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} placeholder="Product application, export scenario and buyer notes" />
          </Form.Item>

          <Form.Item label="Specification" name="specification">
            <Input.TextArea rows={3} placeholder="Purity, grade, storage, packaging notes" />
          </Form.Item>

          <Form.Item label="Main Image URL" name="image_url">
            <Input placeholder="Upload or paste image URL" />
          </Form.Item>

          <Upload
            beforeUpload={(file) => uploadImage(file)}
            fileList={fileList}
            onRemove={() => {
              form.setFieldsValue({ image_url: "" });
              setFileList([]);
            }}
            maxCount={1}
            listType="picture"
          >
            <Button icon={<UploadOutlined />} loading={uploading}>
              Upload Product Image
            </Button>
          </Upload>

          <Form.Item label="Gallery Image URLs" name="image_gallery" style={{ marginTop: 16 }}>
            <Input.TextArea rows={3} placeholder="One image URL per line" />
          </Form.Item>

          <Space style={{ width: "100%" }} size="middle" align="start">
            <Form.Item label="SEO Title" name="seo_title" style={{ flex: 1 }}>
              <Input placeholder="SEO title, auto uses product name if empty" />
            </Form.Item>
            <Form.Item label="SEO Description" name="seo_description" style={{ flex: 1 }}>
              <Input.TextArea rows={2} placeholder="Meta description for Google" />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  );
}
