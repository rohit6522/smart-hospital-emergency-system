import { Link } from "react-router-dom";

function Navbar() {
  const navStyle = {
    display: "flex",
    gap: "20px",
    padding: "15px 30px",
    backgroundColor: "#1a1a2e",
    alignItems: "center",
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500",
  };

  return (
    <nav style={navStyle}>
      <h2 style={{ color: "#e63946", margin: 0, marginRight: "30px" }}>
        🚑 Smart Hospital System
      </h2>
      <Link to="/" style={linkStyle}>Home</Link>
      <Link to="/hospitals" style={linkStyle}>Hospitals</Link>
      <Link to="/request-emergency" style={linkStyle}>Request Emergency</Link>
      <Link to="/patients" style={linkStyle}>Patients</Link>
      <Link to="/ambulances" style={linkStyle}>Ambulances</Link>
    </nav>
  );
}

export default Navbar;