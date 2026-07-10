import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navStyle = {
    padding: "14px 24px",
    backgroundColor: "#1a1a2e",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
  };

  const linkStyle = (path) => ({
    color: location.pathname === path ? "#ffffff" : "#b8b8c8",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: location.pathname === path ? "600" : "400",
    padding: "10px 14px",
    borderRadius: "6px",
    backgroundColor: location.pathname === path ? "rgba(230, 57, 70, 0.25)" : "transparent",
    transition: "all 0.15s ease",
    display: "block",
  });

  const links = [
    { path: "/", label: "Home" },
    { path: "/hospitals", label: "Hospitals" },
    { path: "/request-emergency", label: "Request Emergency" },
    { path: "/patients", label: "Patients" },
    { path: "/ambulances", label: "Ambulances" },
  ];

  return (
    <nav style={navStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <h2 style={{ color: "#e63946", margin: 0, fontSize: "20px", whiteSpace: "nowrap" }}>
          🚑 Smart Hospital
        </h2>

        {/* Desktop links */}
        <div className="desktop-links" style={{ display: "flex", gap: "8px" }}>
          {links.map((link) => (
            <Link key={link.path} to={link.path} style={linkStyle(link.path)}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Hamburger button (mobile only) */}
        <button
          className="hamburger-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "white",
            fontSize: "26px",
            cursor: "pointer",
            padding: "4px 8px",
            lineHeight: 1,
          }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          className="mobile-menu"
          style={{
            display: "none",
            flexDirection: "column",
            gap: "4px",
            marginTop: "16px",
            width: "100%",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "12px",
          }}
        >
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={linkStyle(link.path)}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-links { display: none !important; }
          .hamburger-btn { display: block !important; }
          .mobile-menu { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;