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
import type { UploadFile } from "antd/es/upload/interface";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  EyeOutlined,
  PlusOutlined,
  StarFilled,
  StarOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { supabase } from "../lib/supabase";
import { imageSizeLabel, optimizeUploadImage } from "./imageUpload";
import { useAdminLanguage } from "./AdminLanguage";
import { translateProductCategoryZh, translateProductNameZh } from "../productTranslations";

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

function splitGallery(value?: string) {
  return (value || "")
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinGallery(items: string[]) {
  return items.filter(Boolean).join("\n");
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

export default function ProductsPage() {
  const { lang, tr } = useAdminLanguage();
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
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const galleryValue = Form.useWatch("image_gallery", form);
  const galleryImages = useMemo(() => splitGallery(galleryValue), [galleryValue]);
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
        cas: normalizeCas(values.cas),
        un_number: values.un_number || "",
        category: values.category || "",
        description: values.description || "",
        specification: values.specification || "",
        image_url: values.image_url || "",
        image_gallery: values.image_gallery || "",
        packing: values.packing || "",
        markets: values.markets || "",
        featured: Boolean(values.featured),
        seo_title: values.seo_title || values.name,
        seo_description: values.seo_description || values.description || "",
        status: values.status,
      };

      const { error } = isEditing && editingProduct
        ? await supabase.from("products").update(payload).eq("id", editingProduct.id)
        : await supabase.from("products").insert([payload]);

      if (error) {
        message.error(error.message || "Failed to save product");
        return;
      }

      message.success(isEditing ? "Product updated" : "Product created");
      setModalOpen(false);
      loadProducts();
    } catch (error) {
      if (error instanceof Error) message.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(id: number) {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      message.error(error.message);
      return;
    }
    message.success("Product deleted");
    loadProducts();
  }

  async function toggleFeatured(product: Product) {
    const { error } = await supabase
      .from("products")
      .update({ featured: !Boolean(product.featured) })
      .eq("id", product.id);

    if (error) {
      message.error(error.message);
      return;
    }
    loadProducts();
  }

  async function uploadFile(file: File, addToGallery = false) {
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
      const publicUrl = data.publicUrl;

      if (addToGallery) {
        updateGallery([...galleryImages, publicUrl]);
      } else {
        form.setFieldsValue({ image_url: publicUrl });
        setFileList([{ uid: safeName, name: file.name, status: "done", url: publicUrl }]);
      }

      message.success(`Image optimized and uploaded (${imageSizeLabel(optimized.size)})`);
      return false;
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Image processing failed");
      return false;
    } finally {
      setUploading(false);
    }
  }

  function updateGallery(items: string[]) {
    form.setFieldsValue({ image_gallery: joinGallery(items) });
  }

  function moveGalleryImage(index: number, direction: -1 | 1) {
    const next = [...galleryImages];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    updateGallery(next);
  }

  function setGalleryAsMain(url: string) {
    form.setFieldsValue({ image_url: url });
    message.success("Set as main image");
  }

  function generateSeo() {
    const name = form.getFieldValue("name") || "Chemical Product";
    const cas = form.getFieldValue("cas") ? ` CAS ${form.getFieldValue("cas")}` : "";
    const category = form.getFieldValue("category") || "Dangerous Chemical";
    const desc = form.getFieldValue("description") || `Source ${name} from China with DG export compliance, documentation, packing and shipment support.`;
    form.setFieldsValue({
      seo_title: `${name}${cas} | ChinaChemExport`,
      seo_description: desc.slice(0, 155),
      category,
    });
  }

  function exportProducts() {
    const rows = [
      ["ID", "Name", "CAS", "UN", "Category", "Packing", "Markets", "Featured", "Status"],
      ...products.map((item) => [
        String(item.id),
        item.name || "",
        item.cas || "",
        item.un_number || "",
        item.category || "",
        item.packing || "",
        item.markets || "",
        item.featured ? "yes" : "no",
        item.status || "",
      ]),
    ];
    downloadCsv("products.csv", rows);
  }

  const columns: ColumnsType<Product> = [
    {
      title: tr("Image", "图片"),
      dataIndex: "image_url",
      width: 84,
      render: (url: string | null) =>
        url ? (
          <Image src={url} width={52} height={52} style={{ objectFit: "cover", borderRadius: 8 }} />
        ) : (
          <div style={{ width: 52, height: 52, borderRadius: 8, background: "#f1f5f9" }} />
        ),
    },
    {
      title: tr("Product", "产品"),
      dataIndex: "name",
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <strong>{lang === "zh" ? translateProductNameZh(record.name) : record.name}</strong>
          <Space wrap>
            {record.cas && <Tag>CAS {record.cas}</Tag>}
            {record.un_number && <Tag color="blue">UN {record.un_number}</Tag>}
            {record.featured && <Tag color="gold" icon={<StarFilled />}>{tr("Featured", "推荐")}</Tag>}
          </Space>
        </Space>
      ),
    },
    {
      title: tr("Category", "分类"),
      dataIndex: "category",
      width: 160,
      render: (category: string | null) => lang === "zh" && category ? translateProductCategoryZh(category) : category || "-",
    },
    { title: tr("Packing", "包装"), dataIndex: "packing", width: 160 },
    { title: tr("Markets", "目标市场"), dataIndex: "markets", width: 180 },
    {
      title: tr("Status", "状态"),
      dataIndex: "status",
      width: 110,
      render: (status) => <Tag color={status === "active" ? "green" : "default"}>{status === "active" ? tr("Active", "启用") : tr("Inactive", "停用")}</Tag>,
    },
    {
      title: tr("Actions", "操作"),
      width: 230,
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => openEditModal(record)}>{tr("Edit", "编辑")}</Button>
          <Button size="small" icon={record.featured ? <StarFilled /> : <StarOutlined />} onClick={() => toggleFeatured(record)} />
          <Popconfirm title={tr("Delete this product?", "确定删除这个产品吗？")} onConfirm={() => deleteProduct(record.id)}>
            <Button danger size="small">{tr("Delete", "删除")}</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const activeCount = products.filter((p) => p.status === "active").length;
  const featuredCount = products.filter((p) => p.featured).length;

  return (
    <div>
      <Space direction="vertical" size={18} style={{ width: "100%" }}>
        <Card>
          <Space style={{ width: "100%", justifyContent: "space-between" }} align="center" wrap>
            <div>
              <h2 style={{ margin: 0 }}>{tr("Products CMS", "产品管理")}</h2>
              <p style={{ margin: "6px 0 0", color: "#64748b" }}>
                {tr("Manage product library, images, CAS/UN, packing, markets, featured products and SEO.", "管理产品库、图片、CAS/UN、包装、目标市场、推荐产品和 SEO。")}
              </p>
            </div>
            <Space>
              <Button onClick={exportProducts}>{tr("Export CSV", "导出 CSV")}</Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>{tr("Add Product", "新增产品")}</Button>
            </Space>
          </Space>
        </Card>

        <Space wrap>
          <Card size="small"><strong>{products.length}</strong><div>{tr("Total Products", "产品总数")}</div></Card>
          <Card size="small"><strong>{activeCount}</strong><div>{tr("Active", "已启用")}</div></Card>
          <Card size="small"><strong>{featuredCount}</strong><div>{tr("Featured", "已推荐")}</div></Card>
        </Space>

        <Card>
          <Space style={{ marginBottom: 16 }} wrap>
            <Input.Search
              placeholder={tr("Search name, CAS, UN, category, market", "搜索名称、CAS、UN、分类或市场")}
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={(value) => loadProducts(value, statusFilter)}
              style={{ width: 360 }}
            />
            <Select
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                loadProducts(searchText, value);
              }}
              style={{ width: 150 }}
              options={[
                { label: tr("All Status", "全部状态"), value: "all" },
                { label: tr("Active", "启用"), value: "active" },
                { label: tr("Inactive", "停用"), value: "inactive" },
              ]}
            />
            <Button onClick={() => loadProducts(searchText, statusFilter)}>{tr("Refresh", "刷新")}</Button>
          </Space>
          <Table rowKey="id" loading={loading} columns={columns} dataSource={products} pagination={{ pageSize: 10 }} />
        </Card>
      </Space>

      <Modal
        title={isEditing ? tr("Edit Product", "编辑产品") : tr("Add Product", "新增产品")}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={saveProduct}
        confirmLoading={saving}
        width={980}
        okText={isEditing ? tr("Update", "保存更新") : tr("Create", "创建")}
        cancelText={tr("Cancel", "取消")}
      >
        <Form form={form} layout="vertical">
          <Card size="small" title={tr("Basic Information", "基本信息")} style={{ marginBottom: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>
              <Form.Item name="name" label={tr("Product Name", "产品名称")} rules={[{ required: true, message: tr("Product name is required", "请填写产品名称") }]}>
                <Input placeholder="Methanol" />
              </Form.Item>
              <Form.Item name="category" label={tr("Category", "产品分类")}>
                <Input placeholder="Alcohols / Aromatic Solvents / Ketones" />
              </Form.Item>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <Form.Item name="cas" label="CAS Number" extra={tr("Format check: 67-56-1", "格式示例：67-56-1")}>
                <Input placeholder="67-56-1" />
              </Form.Item>
              <Form.Item name="un_number" label="UN Number">
                <Input placeholder="1230" />
              </Form.Item>
              <Form.Item name="specification" label={tr("Specification / Purity", "规格 / 纯度")}>
                <Input placeholder="99.5% min" />
              </Form.Item>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Form.Item name="packing" label={tr("Packing", "包装方式")}>
                <Input placeholder="Drums / ISO Tank / IBC" />
              </Form.Item>
              <Form.Item name="markets" label={tr("Target Markets", "目标市场")}>
                <Input placeholder="Middle East, Europe, Southeast Asia" />
              </Form.Item>
            </div>
            <Form.Item name="description" label={tr("Description", "产品描述")}>
              <Input.TextArea rows={4} placeholder="Product application, export notes, documents, packing and shipment support." />
            </Form.Item>
          </Card>

          <Card size="small" title={tr("Images & Gallery", "图片与图库")} style={{ marginBottom: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <Form.Item name="image_url" label={tr("Main Image URL", "主图地址")}>
                  <Input placeholder="https://..." />
                </Form.Item>
                <Upload
                  accept="image/*"
                  fileList={fileList}
                  maxCount={1}
                  beforeUpload={(file) => uploadFile(file, false)}
                  onRemove={() => {
                    form.setFieldsValue({ image_url: "" });
                    setFileList([]);
                  }}
                >
                  <Button loading={uploading} icon={<UploadOutlined />}>{tr("Upload Main Image", "上传主图")}</Button>
                </Upload>
              </div>
              <div>
                <Form.Item name="image_gallery" label={tr("Gallery URLs", "图库地址")} extra={tr("One URL per line. You can upload images or paste URLs manually.", "每行一个地址，也可以直接上传图片。")}>
                  <Input.TextArea rows={5} placeholder="https://...\nhttps://..." />
                </Form.Item>
                <Upload accept="image/*" showUploadList={false} beforeUpload={(file) => uploadFile(file, true)}>
                  <Button loading={uploading} icon={<UploadOutlined />}>{tr("Add Gallery Image", "添加图库图片")}</Button>
                </Upload>
              </div>
            </div>

            {galleryImages.length > 0 && (
              <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
                {galleryImages.map((url, index) => (
                  <div
                    key={`${url}-${index}`}
                    style={{ display: "grid", gridTemplateColumns: "64px 1fr auto", gap: 10, alignItems: "center", border: "1px solid #e5e7eb", borderRadius: 8, padding: 8 }}
                  >
                    <Image src={url} width={56} height={56} style={{ objectFit: "cover", borderRadius: 6 }} />
                    <Input value={url} onChange={(e) => {
                      const next = [...galleryImages];
                      next[index] = e.target.value;
                      updateGallery(next);
                    }} />
                    <Space>
                      <Button icon={<EyeOutlined />} onClick={() => setPreviewImage(url)} />
                      <Button icon={<ArrowUpOutlined />} onClick={() => moveGalleryImage(index, -1)} disabled={index === 0} />
                      <Button icon={<ArrowDownOutlined />} onClick={() => moveGalleryImage(index, 1)} disabled={index === galleryImages.length - 1} />
                      <Button onClick={() => setGalleryAsMain(url)}>{tr("Set Main", "设为主图")}</Button>
                      <Button danger onClick={() => updateGallery(galleryImages.filter((_, i) => i !== index))}>{tr("Remove", "移除")}</Button>
                    </Space>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card size="small" title={tr("SEO & Publishing", "SEO 与发布设置")}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Form.Item name="seo_title" label={tr("SEO Title", "SEO 标题")}>
                <Input placeholder="Methanol CAS 67-56-1 | ChinaChemExport" />
              </Form.Item>
              <Form.Item name="status" label={tr("Status", "状态")} rules={[{ required: true }]}>
                <Select options={[{ label: tr("Active", "启用"), value: "active" }, { label: tr("Inactive", "停用"), value: "inactive" }]} />
              </Form.Item>
            </div>
            <Form.Item name="seo_description" label={tr("SEO Description", "SEO 描述")}>
              <Input.TextArea rows={3} maxLength={160} showCount placeholder="Short search description, ideally under 160 characters." />
            </Form.Item>
            <Space>
              <Form.Item name="featured" valuePropName="checked" style={{ marginBottom: 0 }}>
                <Checkbox>{tr("Featured on website", "推荐到网站首页")}</Checkbox>
              </Form.Item>
              <Button onClick={generateSeo}>{tr("Generate SEO Draft", "自动生成 SEO")}</Button>
            </Space>
          </Card>
        </Form>
      </Modal>

      <Modal open={Boolean(previewImage)} onCancel={() => setPreviewImage(null)} footer={null} width={760}>
        {previewImage && <Image src={previewImage} style={{ width: "100%" }} />}
      </Modal>
    </div>
  );
}
