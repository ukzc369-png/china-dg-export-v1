function Hero() {
  return (
    <section
      style={{
        background: "#02133f",
        color: "white",
        padding: "120px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "inline-block",
            border: "1px solid rgba(255,255,255,0.2)",
            padding: "10px 18px",
            borderRadius: "999px",
            fontSize: "12px",
            letterSpacing: "2px",
            marginBottom: "30px",
          }}
        >
          PETROCHEMICAL EXPORT • SINCE 2026
        </div>

        <h1
          style={{
            fontSize: "72px",
            lineHeight: 1.1,
            maxWidth: "850px",
            marginBottom: "30px",
          }}
        >
          Petrochemical Export
          <br />
          Solutions From China.
        </h1>

        <p
          style={{
            maxWidth: "700px",
            fontSize: "22px",
            lineHeight: 1.7,
            color: "#cbd5e1",
          }}
        >
          Dangerous goods warehousing, repacking,
          documentation and global shipping services
          built for chemical importers, distributors
          and industrial manufacturers.
        </p>

        <div
          style={{
            marginTop: "40px",
            display: "flex",
            gap: "20px",
          }}
        >
          <button
            style={{
              background: "#ffffff",
              color: "#02133f",
              border: "none",
              padding: "16px 28px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Get A Quote
          </button>

          <button
            style={{
              background: "transparent",
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
              padding: "16px 28px",
              cursor: "pointer",
            }}
          >
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;