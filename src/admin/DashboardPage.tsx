export default function DashboardPage() {
  return (
    <div style={{ padding: 40 }}>
      <h1>CMS Dashboard</h1>
      <p>ChinaDGExport content management system.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 30 }}>
        <div style={{ background: "#fff", padding: 24, borderRadius: 12 }}>
          <h2>Products</h2>
          <p>Manage chemical products.</p>
        </div>

        <div style={{ background: "#fff", padding: 24, borderRadius: 12 }}>
          <h2>Articles</h2>
          <p>Manage SEO articles.</p>
        </div>

        <div style={{ background: "#fff", padding: 24, borderRadius: 12 }}>
          <h2>Inquiries</h2>
          <p>View customer inquiries.</p>
        </div>
      </div>
    </div>
  );
}