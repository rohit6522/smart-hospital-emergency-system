import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const linkRefs = useRef({});
  const [pill, setPill] = useState({ left: 0, width: 0, opacity: 0 });

  const baseLinks = [
    { path: "/", label: "Home" },
    { path: "/hospitals", label: "Hospitals" },
    { path: "/request-emergency", label: "Emergency" },
    { path: "/patients", label: "Patients" },
    { path: "/ambulances", label: "Ambulances" },
  ];

  const links = user?.role === "ADMIN"
    ? [...baseLinks, { path: "/dashboard", label: "Dashboard" }]
    : baseLinks;

  // Slide the active pill to the current page's link
  useEffect(() => {
    const el = linkRefs.current[location.pathname];
    if (el) {
      setPill({ left: el.offsetLeft, width: el.offsetWidth, opacity: 1 });
    } else {
      setPill((p) => ({ ...p, opacity: 0 }));
    }
  }, [location.pathname, user]);

  useEffect(() => {
    const handleResize = () => {
      const el = linkRefs.current[location.pathname];
      if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth, opacity: 1 });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const navStyle = {
    padding: "12px 24px",
    background: "rgba(15, 12, 41, 0.72)",
    backdropFilter: "blur(18px) saturate(180%)",
    WebkitBackdropFilter: "blur(18px) saturate(180%)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 4px 30px rgba(0,0,0,0.2)",
  };

  const linkStyle = (path) => ({
    color: location.pathname === path ? "#ffffff" : "#a8a8c0",
    textDecoration: "none",
    fontSize: "14.5px",
    fontWeight: location.pathname === path ? "700" : "500",
    padding: "9px 16px",
    borderRadius: "999px",
    position: "relative",
    zIndex: 2,
    transition: "color 0.25s ease",
    display: "block",
    whiteSpace: "nowrap",
  });

  return (
    <nav style={navStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>

        {/* ===== LOGO / SIGNATURE MARK ===== */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <span className="pulse-mark">
            <svg width="30" height="30" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="27" stroke="rgba(230,57,70,0.35)" strokeWidth="2" />
              <path
                className="pulse-line"
                d="M6 30 H20 L26 16 L34 44 L40 30 H54"
                stroke="#ff5c66"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </span>
          <span style={{ lineHeight: 1.05 }}>
            <span style={{
              display: "block",
              fontSize: "17px",
              fontWeight: "800",
              letterSpacing: "0.3px",
              background: "linear-gradient(135deg, #ffffff, #d8d8e8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Smart<span style={{
                background: "linear-gradient(135deg, #ff5c66, #ff8a5c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>Hospital</span>
            </span>
            <span style={{ display: "block", fontSize: "9.5px", letterSpacing: "1.8px", color: "#7d7d9a", fontWeight: "600" }}>
              EMERGENCY NETWORK
            </span>
          </span>
        </Link>

        {/* ===== DESKTOP LINKS (with sliding pill) ===== */}
        <div className="desktop-links" style={{ position: "relative", display: "flex", gap: "2px", alignItems: "center" }}>
          <div
            className="nav-pill"
            style={{
              position: "absolute",
              top: "0",
              left: `${pill.left}px`,
              width: `${pill.width}px`,
              height: "100%",
              opacity: pill.opacity,
              background: "linear-gradient(135deg, rgba(230,57,70,0.9), rgba(230,57,70,0.6))",
              borderRadius: "999px",
              transition: "left 0.35s cubic-bezier(0.4, 0, 0.2, 1), width 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease",
              boxShadow: "0 4px 14px rgba(230,57,70,0.4)",
              zIndex: 1,
            }}
          />
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              ref={(el) => (linkRefs.current[link.path] = el)}
              style={linkStyle(link.path)}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <>
              <span style={{ color: "#8f8fae", fontSize: "13px", marginLeft: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                <span className="live-dot" />
                {user.fullName || user.username}
              </span>
              <button onClick={handleLogout} style={btnStyle("rgba(230,57,70,0.85)")}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" style={{ ...btnStyle("rgba(42,157,143,0.85)"), textDecoration: "none", display: "inline-block", marginLeft: "14px" }}>
              Login
            </Link>
          )}
        </div>

        {/* ===== MOBILE HAMBURGER ===== */}
        <button
          className="hamburger-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "white",
            fontSize: "24px",
            cursor: "pointer",
            padding: "4px 8px",
          }}
        >
          <span style={{ display: "block", transform: menuOpen ? "rotate(45deg) translateY(6px)" : "none", transition: "0.25s", width: "22px", height: "2px", background: "white", marginBottom: "5px" }} />
          <span style={{ display: "block", opacity: menuOpen ? 0 : 1, transition: "0.2s", width: "22px", height: "2px", background: "white", marginBottom: "5px" }} />
          <span style={{ display: "block", transform: menuOpen ? "rotate(-45deg) translateY(-6px)" : "none", transition: "0.25s", width: "22px", height: "2px", background: "white" }} />
        </button>
      </div>

      {/* ===== MOBILE MENU ===== */}
      {menuOpen && (
        <div className="mobile-menu animate-fade" style={{ display: "none", flexDirection: "column", gap: "4px", marginTop: "16px", width: "100%", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "14px" }}>
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              style={{
                color: location.pathname === link.path ? "#fff" : "#a8a8c0",
                textDecoration: "none",
                fontSize: "15px",
                fontWeight: location.pathname === link.path ? "700" : "500",
                padding: "11px 16px",
                borderRadius: "10px",
                background: location.pathname === link.path ? "linear-gradient(135deg, rgba(230,57,70,0.85), rgba(230,57,70,0.55))" : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <>
              <span style={{ color: "#8f8fae", fontSize: "14px", padding: "10px 16px", display: "flex", alignItems: "center", gap: "6px" }}>
                <span className="live-dot" /> {user.fullName || user.username}
              </span>
              <button onClick={handleLogout} style={{ ...btnStyle("rgba(230,57,70,0.85)"), margin: "0 16px" }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} style={{ ...btnStyle("rgba(42,157,143,0.85)"), margin: "0 16px", textAlign: "center", textDecoration: "none" }}>
              Login
            </Link>
          )}
        </div>
      )}

      <style>{`
        @keyframes drawPulse {
          0% { stroke-dashoffset: 120; }
          60% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }
        .pulse-line {
          stroke-dasharray: 120;
          animation: drawPulse 2.4s ease-in-out infinite;
        }
        @keyframes livePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(72, 220, 130, 0.6); }
          70% { box-shadow: 0 0 0 6px rgba(72, 220, 130, 0); }
        }
        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #48dc82;
          display: inline-block;
          animation: livePulse 1.8s infinite;
        }
        @media (max-width: 900px) {
          .desktop-links { display: none !important; }
          .hamburger-btn { display: block !important; }
          .mobile-menu { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

const btnStyle = (bg) => ({
  padding: "9px 18px",
  background: bg,
  backdropFilter: "blur(6px)",
  color: "white",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "999px",
  fontSize: "13.5px",
  cursor: "pointer",
  fontWeight: "700",
});

export default Navbar;