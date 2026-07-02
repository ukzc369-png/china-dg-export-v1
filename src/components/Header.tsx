function Header() {
  return (
    <header
      style={{
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "18px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "34px",
              height: "34px",
              background: "#031b4e",
              color: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: 700,
              borderRadius: "4px",
            }}
          >
            CD
          </div>

          <div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              ChinaDGExport
            </div>

            <div
              style={{
                fontSize: "11px",
                letterSpacing: "2px",
                color: "#94a3b8",
              }}
            >
              PETROCHEMICAL SOLUTIONS
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav
          style={{
            display: "flex",
            gap: "28px",
            alignItems: "center",
          }}
        >
          <a href="#">Home</a>
          <a href="#">Products</a>
          <a href="#">Services</a>
          <a href="#">Industries</a>
          <a href="#">Countries</a>
          <a href="#">Insights</a>
          <a href="#">Contact</a>

          <button
            style={{
              background: "#031b4e",
              color: "#fff",
              border: "none",
              padding: "12px 22px",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Get A Quote
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;