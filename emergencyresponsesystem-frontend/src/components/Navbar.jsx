import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const navStyle = {
    display: "flex",
    gap: "8px",
    padding: "14px 30px",
    backgroundColor: "#1a1a2e",
    alignItems: "center",
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
    padding: "8px 14px",
    borderRadius: "6px",
    backgroundColor: location.pathname === path ? "rgba(230, 57, 70, 0.25)" : "transparent",
    transition: "all 0.15s ease",
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
      <h2 style={{ color: "#e63946", margin: 0, marginRight: "30px", fontSize: "20px", whiteSpace: "nowrap" }}>
        🚑 Smart Hospital
      </h2>
      {links.map((link) => (
        <Link key={link.path} to={link.path} style={linkStyle(link.path)}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export default Navbar;