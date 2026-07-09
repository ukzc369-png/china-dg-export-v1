import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Descriptions,
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
import { DownloadOutlined, MailOutlined } from "@ant-design/icons";
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

function formatDate(value?: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

function buildReplyMailto(inquiry: Inquiry) {
  const subject = encodeURIComponent(`Re: Your inquiry about ${inquiry.product || "chemical export from China"}`);
  const body = encodeURIComponent(
    `Dear ${buyerName(inquiry)},\n\nThank you for your inquiry. We have received your request and will review product availability, DG compliance, packing and shipment options.\n\nInquiry details:\nProduct: ${inquiry.product || ""}\nQuantity: ${inquiry.quantity || ""}\nDestination: ${inquiry.destination || inquiry.country || ""}\nPacking: ${inquiry.packing || ""}\n\nBest regards,\nChinaDGExport Team`
  );
  return `mailto:${inquiry.email || ""}?subject=${subject}&body=${body}`;
}

export default function InquiriesPage() {
  const [loading, setLoading] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [currentInquiry, setCurrentInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    loadInquiries();
  }, []);

  async function loadInquiries(
    keyword = searchText,
    status = statusFilter,
    from = dateFrom,
    to = dateTo
  ) {
    setLoading(true);

    let query = supabase.from("inquiries").select("*").order("id", { ascending: false });
    const trimmedKeyword = keyword.trim();

    if (trimmedKeyword) {
      query = query.or(
        `customer_name.ilike.%${trimmedKeyword}%,name.ilike.%${trimmedKeyword}%,email.ilike.%${trimmedKeyword}%,company.ilike.%${trimmedKeyword}%,product.ilike.%${trimmedKeyword}%,destination.ilike.%${trimmedKeyword}%,country.ilike.%${trimmedKeyword}%`
      );
    }

    if (status !== "all") query = query.eq("status", status);
    if (from) query = query.gte("created_at", `${from}T00:00:00`);
    if (to) query = query.lte("created_at", `${to}T23:59:59`);

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

  function openDetail(record: Inquiry) {
    setCurrentInquiry(record);
    setDetailOpen(true);
  }

  async function markCurrentContacted() {
    if (!currentInquiry) return;
    await updateStatus(currentInquiry.id, "contacted");
    setCurrentInquiry({ ...currentInquiry, status: "contacted" });
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

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return {
      total: inquiries.length,
      today: inquiries.filter((item) => item.created_at?.startsWith(today)).length,
      new: inquiries.filter((item) => (item.status || "new") === "new").length,
      contacted: inquiries.filter((item) => item.status === "contacted").length,
      closed: inquiries.filter((item) => item.status === "closed").length,
    };
  }, [inquiries]);

  const columns: ColumnsType<Inquiry> = [
    {
      title: "Buyer",
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <strong>{buyerName(record)}</strong>
          <span style={{ color: "#64748b" }}>{record.email}</span>
          {record.company && <span style={{ color: "#94a3b8" }}>{record.company}</span>}
        </Space>
      ),
    },
    {
      title: "Request",
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <strong>{record.product || "-"}</strong>
          <span>{record.quantity || "-"}</span>
          <span style={{ color: "#64748b" }}>{record.destination || record.country || "-"}</span>
        </Space>
      ),
    },
    { title: "Packing", dataIndex: "packing", width: 120 },
    {
      title: "Status",
      width: 150,
      render: (_, record) => (
        <Select
          size="small"
          value={(record.status || "new") as InquiryStatus}
          style={{ width: 130 }}
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
      render: (value) => formatDate(value),
    },
    {
      title: "Actions",
      width: 230,
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => openDetail(record)}>View</Button>
          <Button size="small" icon={<MailOutlined />} href={buildReplyMailto(record)} onClick={() => updateStatus(record.id, "contacted")}>Reply</Button>
          <Popconfirm title="Delete this inquiry?" onConfirm={() => deleteInquiry(record.id)}>
            <Button danger size="small">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space direction="vertical" size={18} style={{ width: "100%" }}>
        <Card>
          <Space style={{ width: "100%", justifyContent: "space-between" }} align="center" wrap>
            <div>
              <h2 style={{ margin: 0 }}>Inquiries</h2>
              <p style={{ margin: "6px 0 0", color: "#64748b" }}>
                Search, filter, reply, export and manage buyer inquiries.
              </p>
            </div>
            <Button icon={<DownloadOutlined />} onClick={exportCsv}>Export CSV</Button>
          </Space>
        </Card>

        <Space wrap>
          <Card size="small"><strong>{stats.today}</strong><div>Today</div></Card>
          <Card size="small"><strong>{stats.total}</strong><div>Total</div></Card>
          <Card size="small"><strong>{stats.new}</strong><div>New</div></Card>
          <Card size="small"><strong>{stats.contacted}</strong><div>Contacted</div></Card>
          <Card size="small"><strong>{stats.closed}</strong><div>Closed</div></Card>
        </Space>

        <Card>
          <Space style={{ marginBottom: 16 }} wrap>
            <Input.Search
              placeholder="Search buyer, email, company, product, destination"
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={(value) => loadInquiries(value, statusFilter, dateFrom, dateTo)}
              style={{ width: 380 }}
            />
            <Select
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                loadInquiries(searchText, value, dateFrom, dateTo);
              }}
              style={{ width: 150 }}
              options={[
                { label: "All Status", value: "all" },
                { label: "New", value: "new" },
                { label: "Contacted", value: "contacted" },
                { label: "Closed", value: "closed" },
              ]}
            />
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={{ width: 155 }} />
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={{ width: 155 }} />
            <Button onClick={() => loadInquiries(searchText, statusFilter, dateFrom, dateTo)}>Apply</Button>
            <Button onClick={() => {
              setSearchText("");
              setStatusFilter("all");
              setDateFrom("");
              setDateTo("");
              loadInquiries("", "all", "", "");
            }}>Reset</Button>
          </Space>
          <Table rowKey="id" loading={loading} columns={columns} dataSource={inquiries} pagination={{ pageSize: 10 }} />
        </Card>
      </Space>

      <Modal
        title="Inquiry Detail"
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={currentInquiry ? [
          <Button key="close" onClick={() => setDetailOpen(false)}>Close</Button>,
          <Button key="contacted" onClick={markCurrentContacted}>Mark Contacted</Button>,
          <Button key="reply" type="primary" href={buildReplyMailto(currentInquiry)} icon={<MailOutlined />} onClick={markCurrentContacted}>Reply by Email</Button>,
        ] : null}
        width={760}
      >
        {currentInquiry && (
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Buyer">{buyerName(currentInquiry)}</Descriptions.Item>
              <Descriptions.Item label="Email">{currentInquiry.email}</Descriptions.Item>
              <Descriptions.Item label="Company">{currentInquiry.company || "-"}</Descriptions.Item>
              <Descriptions.Item label="Contact">{currentInquiry.contact || "-"}</Descriptions.Item>
              <Descriptions.Item label="Product">{currentInquiry.product || "-"}</Descriptions.Item>
              <Descriptions.Item label="Quantity">{currentInquiry.quantity || "-"}</Descriptions.Item>
              <Descriptions.Item label="Destination">{currentInquiry.destination || currentInquiry.country || "-"}</Descriptions.Item>
              <Descriptions.Item label="Packing">{currentInquiry.packing || "-"}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={(currentInquiry.status || "new") === "new" ? "red" : currentInquiry.status === "contacted" ? "blue" : "green"}>{currentInquiry.status || "new"}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created">{formatDate(currentInquiry.created_at)}</Descriptions.Item>
            </Descriptions>
            <Card size="small" title="Message">
              <div style={{ whiteSpace: "pre-wrap" }}>{currentInquiry.message || "-"}</div>
            </Card>
          </Space>
        )}
      </Modal>
    </div>
  );
}
