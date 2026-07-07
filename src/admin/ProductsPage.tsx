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
  Upload,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { UploadFile } from "antd/es/upload/interface";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
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
  specification: string | null;
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
  status: ProductStatus;
};

const BUCKET_NAME = "product-images";

export default function ProductsPage() {
  const [form] = Form.useForm<ProductFormValues>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchText, setSearchText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const isEditing = Boolean(editingProduct);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts(keyword = searchText) {
    setLoading(true);

    let query = supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    const trimmedKeyword = keyword.trim();

    if (trimmedKeyword) {
      query = query.or(
        `name.ilike.%${trimmedKeyword}%,cas.ilike.%${trimmedKeyword}%,un_number.ilike.%${trimmedKeyword}%,category.ilike.%${trimmedKeyword}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      message.error(error.message || "Failed to load products");
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  }

  function openCreateModal() {
    setEditingProduct(null);
    setFileList([]);
    form.resetFields();
    form.setFieldsValue({ status: "active" });
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

      setSaving(true);

      const payload = {
        name: values.name,
        cas: values.cas || null,
        un_number: values.un_number || null,
        category: values.category || null,
        description: values.description || null,
        specification: values.specification || null,
        image_url: values.image_url || null,
        status: values.status || "active",
      };

      const { error } = isEditing
        ? await supabase
            .from("products")
            .update(payload)
            .eq("id", editingProduct?.id)
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

  async function uploadImage(file: File) {
    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const filePath = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${fileExt}`;

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      message.error(error.message || "Image upload failed");
      setUploading(false);
      return false;
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    form.setFieldsValue({
      image_url: data.publicUrl,
    });

    setFileList([
      {
        uid: filePath,
        name: file.name,
        status: "done",
        url: data.publicUrl,
      },
    ]);

    message.success("Image uploaded");
    setUploading(false);

    return false;
  }

  const columns: ColumnsType<Product> = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        width: 80,
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
              style={{
                width: 56,
                height: 56,
                objectFit: "cover",
                borderRadius: 6,
                border: "1px solid #eee",
              }}
            />
          ) : (
            "-"
          ),
      },
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "CAS",
        dataIndex: "cas",
        width: 140,
        render: (value: string | null) => value || "-",
      },
      {
        title: "UN",
        dataIndex: "un_number",
        width: 120,
        render: (value: string | null) => value || "-",
      },
      {
        title: "Category",
        dataIndex: "category",
        width: 160,
        render: (value: string | null) => value || "-",
      },
      {
        title: "Status",
        dataIndex: "status",
        width: 120,
        render: (status: string | null) =>
          status === "active" ? (
            <Tag color="green">Active</Tag>
          ) : (
            <Tag color="default">Inactive</Tag>
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
              title="Delete this product?"
              onConfirm={() => deleteProduct(record.id)}
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
        title="Products Management"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            Add Product
          </Button>
        }
      >
        <Space style={{ marginBottom: 16 }}>
          <Input.Search
            allowClear
            placeholder="Search name / CAS / UN / category"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={(value) => loadProducts(value)}
            style={{ width: 360 }}
          />

          <Button onClick={() => loadProducts()}>Refresh</Button>
        </Space>

        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={products}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
          }}
          scroll={{ x: 1100 }}
        />
      </Card>

      <Modal
        title={isEditing ? "Edit Product" : "Add Product"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={saveProduct}
        confirmLoading={saving}
        destroyOnHidden
        width={760}
      >
        <Form form={form} layout="vertical" initialValues={{ status: "active" }}>
          <Form.Item
            label="Product Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter product name",
              },
            ]}
          >
            <Input placeholder="e.g. Sodium Hydroxide" />
          </Form.Item>

          <Space style={{ width: "100%" }} size="middle">
            <Form.Item label="CAS Number" name="cas" style={{ flex: 1 }}>
              <Input placeholder="e.g. 1310-73-2" />
            </Form.Item>

            <Form.Item label="UN Number" name="un_number" style={{ flex: 1 }}>
              <Input placeholder="e.g. UN1823" />
            </Form.Item>
          </Space>

          <Space style={{ width: "100%" }} size="middle">
            <Form.Item label="Category" name="category" style={{ flex: 1 }}>
              <Input placeholder="e.g. Corrosive Chemicals" />
            </Form.Item>

            <Form.Item label="Status" name="status" style={{ flex: 1 }}>
              <Select
                options={[
                  {
                    label: "Active",
                    value: "active",
                  },
                  {
                    label: "Inactive",
                    value: "inactive",
                  },
                ]}
              />
            </Form.Item>
          </Space>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} placeholder="Product description" />
          </Form.Item>

          <Form.Item label="Specification" name="specification">
            <Input.TextArea
              rows={3}
              placeholder="Packaging, purity, grade, storage, etc."
            />
          </Form.Item>

          <Form.Item label="Image URL" name="image_url">
            <Input placeholder="Image URL will be filled after upload" />
          </Form.Item>

          <Upload
            beforeUpload={(file) => uploadImage(file)}
            fileList={fileList}
            onRemove={() => {
              form.setFieldsValue({
                image_url: "",
              });
              setFileList([]);
            }}
            maxCount={1}
            listType="picture"
          >
            <Button icon={<UploadOutlined />} loading={uploading}>
              Upload Product Image
            </Button>
          </Upload>
        </Form>
      </Modal>
    </div>
  );
}