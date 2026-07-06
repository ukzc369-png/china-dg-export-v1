import { Card, Col, Row } from "antd";

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>

      <Row gutter={16}>
        <Col span={6}>
          <Card title="Products">
            <h2>128</h2>
          </Card>
        </Col>

        <Col span={6}>
          <Card title="Articles">
            <h2>36</h2>
          </Card>
        </Col>

        <Col span={6}>
          <Card title="Inquiries">
            <h2>15</h2>
          </Card>
        </Col>

        <Col span={6}>
          <Card title="Unread">
            <h2>4</h2>
          </Card>
        </Col>
      </Row>
    </div>
  );
}