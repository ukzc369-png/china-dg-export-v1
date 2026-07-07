import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { supabase } from "../lib/supabase";

type InquiryStatus = "new" | "contacted" | "closed";

type Inquiry = {
  id: number;
  name: string | null;
  email: string | null;
  company: string | null;
  country: string | null;
  message: string | null;
  status: InquiryStatus | string | null;
  created_at: string;
};

export default function InquiriesPage() {
  const [loading, setLoading] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [searchText, setSearchText] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [currentInquiry, setCurrentInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    loadInquiries();
  }, []);

  async function loadInquiries(keyword = searchText) {
    setLoading(true);

    let query = supabase
      .from("inquiries")
      .select("*")
      .order("id", { ascending: false });

    if (keyword.trim()) {
      query = query.or(
        `name.ilike.%${keyword}%,email.ilike.%${keyword}%,company.ilike.%${keyword}%,country.ilike.%${keyword}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      message.error(error.message);
    } else {
      setInquiries(data || []);
    }

    setLoading(false);
  }

  async function updateStatus(id: number, status: InquiryStatus) {
    const { error } = await supabase
      .from("inquiries")
      .update({ status })
      .eq("id", id);

    if (error) {
      message.error(error.message);
      return;
    }

    message.success("Status updated");
    loadInquiries();
  }

  async function deleteInquiry(id: number) {
    const { error } = await supabase
      .from("inquiries")
      .delete()
      .eq("id", id);

    if (error) {
      message.error(error.message);
      return;
    }

    message.success("Inquiry deleted");
    loadInquiries();
  }

  const columns: ColumnsType<Inquiry> = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        width: 80,
      },
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Email",
        dataIndex: "email",
      },
      {
        title: "Company",
        dataIndex: "company",
      },
      {
        title: "Country",
        dataIndex: "country",
        width: 120,
      },
      {
        title: "Status",
        dataIndex: "status",
        width: 140,
        render: (_, record) => (
          <Select
            value={record.status || "new"}
            style={{ width: 120 }}
            onChange={(value) =>
              updateStatus(record.id, value as InquiryStatus)
            }
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
        width: 180,
        render: (value: string) =>
          value ? new Date(value).toLocaleString() : "-",
      },
      {
        title: "Action",
        width: 220,
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

            <Popconfirm
              title="Delete inquiry?"
              onConfirm={() => deleteInquiry(record.id)}
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
    <>
      <Card title="Inquiry Management">
        <Space style={{ marginBottom: 16 }}>
          <Input.Search
            placeholder="Search name / email / company"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={(value) => loadInquiries(value)}
            style={{ width: 360 }}
          />

          <Button onClick={() => loadInquiries()}>
            Refresh
          </Button>
        </Space>

        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={inquiries}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
          }}
        />
      </Card>

      <Modal
        title="Inquiry Details"
        open={detailOpen}
        footer={null}
        onCancel={() => setDetailOpen(false)}
        width={700}
      >
        {currentInquiry && (
          <div>
            <p><b>Name:</b> {currentInquiry.name}</p>
            <p><b>Email:</b> {currentInquiry.email}</p>
            <p><b>Company:</b> {currentInquiry.company}</p>
            <p><b>Country:</b> {currentInquiry.country}</p>
            <p><b>Status:</b> {currentInquiry.status}</p>

            <p>
              <b>Message:</b>
            </p>

            <div
              style={{
                border: "1px solid #eee",
                padding: 12,
                borderRadius: 8,
                minHeight: 120,
              }}
            >
              {currentInquiry.message}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}