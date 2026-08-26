import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Footer() {
  const { user } = useAuth();
  const year = new Date().getFullYear();

  const linkStyle = {
    color: "#a8a8c0",
    textDecoration: "none",
    fontSize: "14px",
    transition: "color 0.2s ease",
    display: "block",
    marginBottom: "10px",
  };

  const headingStyle = {
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "700",
    letterSpacing: "0.5px",
    marginBottom: "16px",
    textTransform: "uppercase",
  };

  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #0f0c29 0%, #1a1a2e 100%)",
        color: "#a8a8c0",
        marginTop: "60px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="footer-grid"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "50px 30px 30px",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr",
          gap: "40px",
        }}
      >
        {/* Brand column */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
            <svg width="26" height="26" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="27" stroke="rgba(230,57,70,0.35)" strokeWidth="2" />
              <path
                d="M6 30 H20 L26 16 L34 44 L40 30 H54"
                stroke="#ff5c66"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <span style={{ fontSize: "16px", fontWeight: "800", color: "white" }}>
              Smart<span style={{ color: "#ff5c66" }}>Hospital</span>
            </span>
          </div>
          <p style={{ fontSize: "13.5px", lineHeight: "1.7", color: "#8f8fae", maxWidth: "280px" }}>
            AI-powered emergency response and routing — connecting patients to the
            nearest, best-equipped hospital in seconds.
          </p>
          <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
            <a
              href="https://github.com/rohit6522/smart-hospital-emergency-system"
              target="_blank"
              rel="noopener noreferrer"
              style={socialIconStyle}
              aria-label="GitHub Repository"
            >
              <GitHubIcon />
            </a>
            <a
              href="mailto:rohitrajyadav6522@gmail.com"
              style={socialIconStyle}
              aria-label="Email"
            >
              <MailIcon />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              style={socialIconStyle}
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </a>
          </div>
        </div>

        {/* Navigate column */}
        <div>
          <div style={headingStyle}>Navigate</div>
          <Link to="/" style={linkStyle} onMouseEnter={(e) => (e.target.style.color = "#fff")} onMouseLeave={(e) => (e.target.style.color = "#a8a8c0")}>Home</Link>
          <Link to="/hospitals" style={linkStyle} onMouseEnter={(e) => (e.target.style.color = "#fff")} onMouseLeave={(e) => (e.target.style.color = "#a8a8c0")}>Hospitals</Link>
          <Link to="/request-emergency" style={linkStyle} onMouseEnter={(e) => (e.target.style.color = "#fff")} onMouseLeave={(e) => (e.target.style.color = "#a8a8c0")}>Request Emergency</Link>
          <Link to="/patients" style={linkStyle} onMouseEnter={(e) => (e.target.style.color = "#fff")} onMouseLeave={(e) => (e.target.style.color = "#a8a8c0")}>Patients</Link>
          <Link to="/ambulances" style={linkStyle} onMouseEnter={(e) => (e.target.style.color = "#fff")} onMouseLeave={(e) => (e.target.style.color = "#a8a8c0")}>Ambulances</Link>
        </div>

        {/* Account column */}
        <div>
          <div style={headingStyle}>Account</div>
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Link to="/dashboard" style={linkStyle} onMouseEnter={(e) => (e.target.style.color = "#fff")} onMouseLeave={(e) => (e.target.style.color = "#a8a8c0")}>Dashboard</Link>
              )}
              <span style={{ ...linkStyle, cursor: "default" }}>
                Signed in as {user.fullName || user.username}
              </span>
            </>
          ) : (
            <>
              <Link to="/login" style={linkStyle} onMouseEnter={(e) => (e.target.style.color = "#fff")} onMouseLeave={(e) => (e.target.style.color = "#a8a8c0")}>Login</Link>
              <Link to="/signup" style={linkStyle} onMouseEnter={(e) => (e.target.style.color = "#fff")} onMouseLeave={(e) => (e.target.style.color = "#a8a8c0")}>Sign Up</Link>
            </>
          )}
        </div>

        {/* Contact column */}
        <div>
          <div style={headingStyle}>Emergency Contacts</div>
          <p style={{ fontSize: "13.5px", margin: "0 0 8px", color: "#8f8fae" }}>
            🚑 Ambulance: <a href="tel:102" style={{ color: "#ff8a5c", textDecoration: "none" }}>102</a>
          </p>
          <p style={{ fontSize: "13.5px", margin: "0 0 8px", color: "#8f8fae" }}>
            🚓 National Emergency: <a href="tel:112" style={{ color: "#ff8a5c", textDecoration: "none" }}>112</a>
          </p>
          <p style={{ fontSize: "13.5px", margin: "0 0 8px", color: "#8f8fae" }}>
            ✉️ <a href="mailto:rohitrajyadav6522@gmail.com" style={{ color: "#8f8fae", textDecoration: "none" }}>rohitrajyadav6522@gmail.com</a>
          </p>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "18px 30px",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
          maxWidth: "1200px",
          margin: "0 auto",
          fontSize: "12.5px",
          color: "#6d6d8a",
        }}
      >
        <span>© {year} SmartHospital. Built for faster, smarter emergency care.</span>
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span className="footer-live-dot" /> System Online
        </span>
      </div>

      <style>{`
        @keyframes footerLivePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(72, 220, 130, 0.6); }
          70% { box-shadow: 0 0 0 5px rgba(72, 220, 130, 0); }
        }
        .footer-live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #48dc82;
          display: inline-block;
          animation: footerLivePulse 1.8s infinite;
        }
        @media (max-width: 800px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}

const socialIconStyle = {
  width: "34px",
  height: "34px",
  borderRadius: "10px",
  background: "rgba(255,255,255,0.06)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#a8a8c0",
  transition: "background 0.2s ease, color 0.2s ease",
};

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default Footer;