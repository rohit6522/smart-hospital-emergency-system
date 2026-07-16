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
        className="responsive-container"
        style={{
          background: "linear-gradient(135deg, #0f0c29 0%, #302b63 55%, #24243e 100%)",
          color: "white",
          padding: "90px 30px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative glow blobs */}
        <div
          className="animate-float"
          style={{
            position: "absolute",
            top: "-60px",
            left: "-60px",
            width: "260px",
            height: "260px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(230,57,70,0.35), transparent 70%)",
            filter: "blur(10px)",
          }}
        />
        <div
          className="animate-float"
          style={{
            position: "absolute",
            bottom: "-80px",
            right: "-40px",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(42,157,143,0.3), transparent 70%)",
            filter: "blur(10px)",
            animationDelay: "1s",
          }}
        />

        <div className="animate-fade-up" style={{ position: "relative", zIndex: 1 }}>
          <div
            className="glass-dark"
            style={{
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: "999px",
              fontSize: "13px",
              marginBottom: "20px",
              color: "#b8b8c8",
            }}
          >
            ⚡ AI-Powered Emergency Response
          </div>
          <h1 className="hero-title" style={{ fontSize: "44px", margin: "0 0 15px", color: "white", fontWeight: "800", lineHeight: 1.2 }}>
            AI-Powered Smart Hospital
            <br />
            <span style={{
              background: "linear-gradient(135deg, #e63946, #f4a261)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Emergency Response & Routing
            </span>
          </h1>
          <p className="hero-subtitle" style={{ fontSize: "18px", color: "#b8b8c8", maxWidth: "650px", margin: "0 auto 35px" }}>
            Find the nearest and most suitable hospital in seconds. Reduce emergency response
            time and save lives with intelligent, data-driven routing.
          </p>
          <Link to="/request-emergency">
            <button
              style={{
                padding: "16px 36px",
                fontSize: "17px",
                fontWeight: "700",
                background: "linear-gradient(135deg, #e63946, #c1121f)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "12px",
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(230, 57, 70, 0.45)",
              }}
            >
              🚨 Request Emergency Now
            </button>
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="responsive-container" style={{ padding: "70px 30px", maxWidth: "1100px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "40px" }}>What This System Does</h2>
        <div
          className="feature-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "24px",
          }}
        >
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`glass-card animate-fade-up stagger-${i + 1}`}
              style={{
                padding: "30px 22px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "42px", marginBottom: "14px" }}>{feature.icon}</div>
              <h3 style={{ margin: "0 0 10px", fontSize: "17px" }}>{feature.title}</h3>
              <p style={{ color: "#6c757d", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="responsive-container" style={{ padding: "50px 30px 70px" }}>
        <div
          className="quick-links"
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link to="/hospitals" className="glass-card animate-fade-up stagger-1" style={quickLinkStyle}>🏥 View Hospitals</Link>
          <Link to="/patients" className="glass-card animate-fade-up stagger-2" style={quickLinkStyle}>🧑‍⚕️ Patient Records</Link>
          <Link to="/ambulances" className="glass-card animate-fade-up stagger-3" style={quickLinkStyle}>🚑 Ambulance Fleet</Link>
        </div>
      </div>
    </div>
  );
}

const quickLinkStyle = {
  padding: "16px 30px",
  color: "#1d1d1d",
  fontSize: "15px",
  fontWeight: "600",
  textAlign: "center",
};

export default Home;