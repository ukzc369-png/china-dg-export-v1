import { useEffect, useMemo, useState } from "react";
import { Button, Card, Descriptions, Input, message, Modal, Popconfirm, Select, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DownloadOutlined } from "@ant-design/icons";
import { supabase } from "../lib/supabase";

type InquiryStatus = "new" | "contacted" | "closed";

type Inquiry = {
  id: number;
  customer_name?: string | null;
  name?: string | null;
  email: string | null;
  company: string | null;
  contact?: string | null;
  product?: string | null;
  quantity?: string | null;
  destination?: string | null;
  packing?: string | null;
  country?: string | null;
  message: string | null;
  status: InquiryStatus | string | null;
  created_at: string;
};

function buyerName(record: Inquiry) {
  return record.customer_name || record.name || "Unknown buyer";
}

function escapeCsv(value: unknown) {
  const text = String(value ?? "").replace(/"/g, '""');
  return `"${text}"`;
}

export default function InquiriesPage() {
  const [loading, setLoading] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [detailOpen, setDetailOpen] = useState(false);
  const [currentInquiry, setCurrentInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    loadInquiries();
  }, []);

  async function loadInquiries(keyword = searchText, status = statusFilter) {
    setLoading(true);

    let query = supabase.from("inquiries").select("*").order("id", { ascending: false });

    const trimmedKeyword = keyword.trim();

    if (trimmedKeyword) {
      query = query.or(
        `customer_name.ilike.%${trimmedKeyword}%,email.ilike.%${trimmedKeyword}%,company.ilike.%${trimmedKeyword}%,product.ilike.%${trimmedKeyword}%,destination.ilike.%${trimmedKeyword}%,country.ilike.%${trimmedKeyword}%`
      );
    }

    if (status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      message.error(error.message);
    } else {
      setInquiries((data || []) as Inquiry[]);
    }

    setLoading(false);
  }

  async function updateStatus(id: number, status: InquiryStatus) {
    const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
    if (error) {
      message.error(error.message);
      return;
    }
    message.success("Status updated");
    loadInquiries();
  }

  async function deleteInquiry(id: number) {
    const { error } = await supabase.from("inquiries").delete().eq("id", id);
    if (error) {
      message.error(error.message);
      return;
    }
    message.success("Inquiry deleted");
    loadInquiries();
  }

  function exportCsv() {
    const headers = [
      "ID",
      "Name",
      "Email",
      "Company",
      "Contact",
      "Product",
      "Quantity",
      "Destination",
      "Packing",
      "Status",
      "Created",
      "Message",
    ];
    const rows = inquiries.map((item) => [
      item.id,
      buyerName(item),
      item.email,
      item.company,
      item.contact,
      item.product,
      item.quantity,
      item.destination || item.country,
      item.packing,
      item.status,
      item.created_at,
      item.message,
    ]);
    const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const columns: ColumnsType<Inquiry> = useMemo(
    () => [
      { title: "ID", dataIndex: "id", width: 70 },
      {
        title: "Buyer",
        width: 220,
        render: (_, record) => (
          <Space direction="vertical" size={2}>
            <b>{buyerName(record)}</b>
            <span style={{ color: "#777" }}>{record.email || "No email"}</span>
          </Space>
        ),
      },
      { title: "Company", dataIndex: "company", width: 180, render: (value: string | null) => value || "-" },
      { title: "Product", dataIndex: "product", width: 180, render: (value: string | null) => value || "-" },
      { title: "Quantity", dataIndex: "quantity", width: 120, render: (value: string | null) => value || "-" },
      {
        title: "Destination",
        width: 160,
        render: (_, record) => record.destination || record.country || "-",
      },
      {
        title: "Status",
        dataIndex: "status",
        width: 140,
        render: (_, record) => (
          <Select
            value={record.status || "new"}
            style={{ width: 120 }}
            onChange={(value) => updateStatus(record.id, value as InquiryStatus)}
            options={[
              { label: "New", value: "new" },
              { label: "Contacted", value: "contacted" },
              { label: "Closed", value: "closed" },
            ]}
          />
        ),
      },
      {
        title: "Created",
        dataIndex: "created_at",
        width: 170,
        render: (value: string) => (value ? new Date(value).toLocaleString() : "-"),
      },
      {
        title: "Action",
        width: 160,
        fixed: "right",
        render: (_, record) => (
          <Space>
            <Button
              size="small"
              onClick={() => {
                setCurrentInquiry(record);
                setDetailOpen(true);
              }}
            >
              View
            </Button>
            <Popconfirm title="Delete inquiry?" onConfirm={() => deleteInquiry(record.id)}>
              <Button danger size="small">Delete</Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    []
  );

  return (
    <>
      <Card title="Inquiry Management">
        <Space style={{ marginBottom: 16 }} wrap>
          <Input.Search
            allowClear
            placeholder="Search buyer / email / company / product / destination"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={(value) => loadInquiries(value)}
            style={{ width: 400 }}
          />
          <Select
            value={statusFilter}
            style={{ width: 160 }}
            onChange={(value) => {
              setStatusFilter(value);
              loadInquiries(searchText, value);
            }}
            options={[
              { label: "All Status", value: "all" },
              { label: "New", value: "new" },
              { label: "Contacted", value: "contacted" },
              { label: "Closed", value: "closed" },
            ]}
          />
          <Button onClick={() => loadInquiries()}>Refresh</Button>
          <Button icon={<DownloadOutlined />} onClick={exportCsv}>
            Export CSV
          </Button>
        </Space>

        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={inquiries}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 1320 }}
        />
      </Card>

      <Modal title="Inquiry Details" open={detailOpen} footer={null} onCancel={() => setDetailOpen(false)} width={760}>
        {currentInquiry && (
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Buyer">{buyerName(currentInquiry)}</Descriptions.Item>
              <Descriptions.Item label="Email">{currentInquiry.email || "-"}</Descriptions.Item>
              <Descriptions.Item label="Company">{currentInquiry.company || "-"}</Descriptions.Item>
              <Descriptions.Item label="Contact">{currentInquiry.contact || "-"}</Descriptions.Item>
              <Descriptions.Item label="Product">{currentInquiry.product || "-"}</Descriptions.Item>
              <Descriptions.Item label="Quantity">{currentInquiry.quantity || "-"}</Descriptions.Item>
              <Descriptions.Item label="Destination">
                {currentInquiry.destination || currentInquiry.country || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Packing">{currentInquiry.packing || "-"}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={currentInquiry.status === "new" ? "blue" : "default"}>{currentInquiry.status || "new"}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {currentInquiry.created_at ? new Date(currentInquiry.created_at).toLocaleString() : "-"}
              </Descriptions.Item>
            </Descriptions>

            <Card size="small" title="Message">
              <pre style={{ whiteSpace: "pre-wrap", margin: 0, fontFamily: "inherit" }}>
                {currentInquiry.message || "-"}
              </pre>
            </Card>
          </Space>
        )}
      </Modal>
    </>
  );
}
