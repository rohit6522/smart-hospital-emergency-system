import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const navStyle = {
    padding: "14px 24px",
    background: "rgba(26, 26, 46, 0.65)",
    backdropFilter: "blur(16px) saturate(180%)",
    WebkitBackdropFilter: "blur(16px) saturate(180%)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
  };

  const linkStyle = (path) => ({
    color: location.pathname === path ? "#ffffff" : "#c5c5d8",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: location.pathname === path ? "600" : "400",
    padding: "9px 15px",
    borderRadius: "10px",
    background: location.pathname === path
      ? "linear-gradient(135deg, rgba(230,57,70,0.35), rgba(230,57,70,0.15))"
      : "transparent",
    border: location.pathname === path ? "1px solid rgba(230,57,70,0.3)" : "1px solid transparent",
    transition: "all 0.2s ease",
    display: "block",
  });

  const baseLinks = [
    { path: "/", label: "Home" },
    { path: "/hospitals", label: "Hospitals" },
    { path: "/request-emergency", label: "Request Emergency" },
    { path: "/patients", label: "Patients" },
    { path: "/ambulances", label: "Ambulances" },
  ];

  const links = user?.role === "ADMIN"
    ? [...baseLinks, { path: "/dashboard", label: "📊 Dashboard" }]
    : baseLinks;

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav style={navStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <h2
          style={{
            margin: 0,
            fontSize: "20px",
            whiteSpace: "nowrap",
            background: "linear-gradient(135deg, #e63946, #ff6b6b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontWeight: "800",
          }}
        >
          🚑 Smart Hospital
        </h2>

        {/* Desktop links */}
        <div className="desktop-links" style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {links.map((link) => (
            <Link key={link.path} to={link.path} style={linkStyle(link.path)}>
              {link.label}
            </Link>
          ))}

          {user ? (
            <>
              <span style={{ color: "#c5c5d8", fontSize: "14px", marginLeft: "8px" }}>
                👤 {user.fullName || user.username} {user.role === "ADMIN" && "🛡️"}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  marginLeft: "8px",
                  padding: "9px 18px",
                  background: "rgba(230, 57, 70, 0.85)",
                  backdropFilter: "blur(6px)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "10px",
                  fontSize: "14px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              style={{
                marginLeft: "8px",
                padding: "9px 18px",
                background: "rgba(42, 157, 143, 0.85)",
                backdropFilter: "blur(6px)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Login
            </Link>
          )}
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
          className="mobile-menu animate-fade"
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

          {user ? (
            <>
              <span style={{ color: "#c5c5d8", fontSize: "14px", padding: "10px 14px" }}>
                👤 {user.fullName || user.username} {user.role === "ADMIN" && "🛡️"}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  margin: "0 14px",
                  padding: "10px",
                  background: "rgba(230, 57, 70, 0.85)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "14px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              style={{
                margin: "0 14px",
                padding: "10px",
                background: "rgba(42, 157, 143, 0.85)",
                color: "white",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "600",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Login
            </Link>
          )}
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