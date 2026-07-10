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

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav style={navStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <h2 style={{ color: "#e63946", margin: 0, fontSize: "20px", whiteSpace: "nowrap" }}>
          🚑 Smart Hospital
        </h2>

        {/* Desktop links */}
        <div className="desktop-links" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {links.map((link) => (
            <Link key={link.path} to={link.path} style={linkStyle(link.path)}>
              {link.label}
            </Link>
          ))}

          {user ? (
            <>
              <span style={{ color: "#b8b8c8", fontSize: "14px", marginLeft: "8px" }}>
                👤 {user.fullName || user.username} {user.role === "ADMIN" && "🛡️"}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  marginLeft: "8px",
                  padding: "8px 16px",
                  backgroundColor: "#e63946",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
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
                padding: "8px 16px",
                backgroundColor: "#2a9d8f",
                color: "white",
                borderRadius: "6px",
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

          {user ? (
            <>
              <span style={{ color: "#b8b8c8", fontSize: "14px", padding: "10px 14px" }}>
                👤 {user.fullName || user.username} {user.role === "ADMIN" && "🛡️"}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  margin: "0 14px",
                  padding: "10px",
                  backgroundColor: "#e63946",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
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
                backgroundColor: "#2a9d8f",
                color: "white",
                borderRadius: "6px",
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