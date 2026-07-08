import { Link } from "react-router-dom";

function Home() {
  const features = [
    {
      icon: "🎯",
      title: "Smart Hospital Matching",
      desc: "Finds the nearest and most suitable hospital using distance, ICU beds, blood bank, and doctor availability.",
    },
    {
      icon: "🗺️",
      title: "Live Route Mapping",
      desc: "Visualizes your location, nearby hospitals, and the optimal route on an interactive map.",
    },
    {
      icon: "🚑",
      title: "Ambulance Fleet Management",
      desc: "Track and manage ambulance status, drivers, and live location in real time.",
    },
    {
      icon: "🧑‍⚕️",
      title: "Digital Patient Records",
      desc: "Maintain patient medical history for faster, more informed emergency treatment.",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          color: "white",
          padding: "80px 30px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "42px", margin: "0 0 15px", color: "white" }}>
          AI-Powered Smart Hospital
          <br />
          Emergency Response & Routing System
        </h1>
        <p style={{ fontSize: "18px", color: "#b8b8c8", maxWidth: "650px", margin: "0 auto 35px" }}>
          Find the nearest and most suitable hospital in seconds. Reduce emergency response
          time and save lives with intelligent, data-driven routing.
        </p>
        <Link to="/request-emergency">
          <button
            style={{
              padding: "16px 36px",
              fontSize: "17px",
              fontWeight: "600",
              backgroundColor: "#e63946",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(230, 57, 70, 0.4)",
            }}
          >
            🚨 Request Emergency Now
          </button>
        </Link>
      </div>

      {/* Feature Cards */}
      <div style={{ padding: "60px 30px", maxWidth: "1100px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "40px" }}>What This System Does</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "24px",
          }}
        >
          {features.map((feature) => (
            <div
              key={feature.title}
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "28px 22px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                textAlign: "center",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>{feature.icon}</div>
              <h3 style={{ margin: "0 0 10px", fontSize: "17px" }}>{feature.title}</h3>
              <p style={{ color: "#6c757d", fontSize: "14px", lineHeight: "1.5", margin: 0 }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links Section */}
      <div style={{ backgroundColor: "#fff", padding: "50px 30px", borderTop: "1px solid #e0e0e0" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link to="/hospitals" style={quickLinkStyle}>🏥 View Hospitals</Link>
          <Link to="/patients" style={quickLinkStyle}>🧑‍⚕️ Patient Records</Link>
          <Link to="/ambulances" style={quickLinkStyle}>🚑 Ambulance Fleet</Link>
        </div>
      </div>
    </div>
  );
}

const quickLinkStyle = {
  padding: "14px 28px",
  backgroundColor: "#f8f9fa",
  color: "#1d1d1d",
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  fontSize: "15px",
  fontWeight: "500",
};

export default Home;