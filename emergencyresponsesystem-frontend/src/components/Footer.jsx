import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CopyIcon, PhoneIcon, PulseLogoIcon } from "./Icons";

function Footer() {
  const { user } = useAuth();
  const year = new Date().getFullYear();
  const [copied102, setCopied102] = useState(false);

  const handleCopy102 = () => {
    navigator.clipboard.writeText("102");
    setCopied102(true);
    setTimeout(() => setCopied102(false), 1800);
  };

  return (
    <footer className="hc-footer">
      <div className="hc-footer__grid">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.875rem" }}>
            <PulseLogoIcon size={28} />
            <span style={{ fontSize: "1.0625rem", fontWeight: 800, color: "#FFFFFF" }}>
              SmartHospital
            </span>
          </div>
          <p style={{ fontSize: "0.875rem", lineHeight: 1.65, color: "#CBD5E1", margin: "0 0 1.125rem", maxWidth: "30ch" }}>
            AI-powered emergency response and hospital routing connecting patients with the best-equipped clinical care in seconds.
          </p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <a
              href="https://github.com/rohit6522/smart-hospital-emergency-system"
              target="_blank"
              rel="noopener noreferrer"
              className="hc-footer__icon-link"
              aria-label="GitHub Repository"
            >
              <GitHubIcon />
            </a>
            <a
              href="mailto:rohitrajyadav6522@gmail.com"
              className="hc-footer__icon-link"
              aria-label="Email Support"
            >
              <MailIcon />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hc-footer__icon-link"
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </a>
          </div>
        </div>

        <div>
          <h2 className="hc-footer__heading">Platform</h2>
          <ul className="hc-footer__list">
            <li><Link to="/" className="hc-footer__link">Home</Link></li>
            <li><Link to="/hospitals" className="hc-footer__link">Hospitals Directory</Link></li>
            <li><Link to="/request-emergency" className="hc-footer__link">Request Emergency</Link></li>
            <li><Link to="/patients" className="hc-footer__link">Patient Records</Link></li>
            <li><Link to="/ambulances" className="hc-footer__link">Ambulance Fleet</Link></li>
            <li>
              <a
                href="https://github.com/rohit6522/smart-hospital-emergency-system/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="hc-footer__link"
              >
                Report an Issue
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="hc-footer__heading">Account Access</h2>
          <ul className="hc-footer__list">
            {user ? (
              <>
                {user.role === "ADMIN" && (
                  <li><Link to="/dashboard" className="hc-footer__link">Admin Dashboard</Link></li>
                )}
                <li style={{ fontSize: "0.875rem", color: "#CBD5E1" }}>
                  Signed in as <strong>{user.fullName || user.username}</strong>
                </li>
                <li style={{ fontSize: "0.8125rem", color: "#94A3B8" }}>
                  Role: {user.role}
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="hc-footer__link">Sign In</Link></li>
                <li><Link to="/signup" className="hc-footer__link">Create Account</Link></li>
              </>
            )}
          </ul>
        </div>

        <div>
          <h2 className="hc-footer__heading">Emergency Helplines</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "#CBD5E1" }}>
              <PhoneIcon size={15} />
              <span>Ambulance:</span>
              <a href="tel:102" style={{ color: "#FFFFFF", fontWeight: 700 }}>102</a>
              <button
                type="button"
                onClick={handleCopy102}
                className="hc-footer__copy-btn"
                aria-label="Copy ambulance helpline 102"
              >
                <CopyIcon size={13} />
                <span>{copied102 ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "#CBD5E1" }}>
              <PhoneIcon size={15} />
              <span>National Emergency:</span>
              <a href="tel:112" style={{ color: "#FFFFFF", fontWeight: 700 }}>112</a>
            </div>
            <div style={{ fontSize: "0.875rem", color: "#CBD5E1" }}>
              Support:{" "}
              <a href="mailto:rohitrajyadav6522@gmail.com" className="hc-footer__link" style={{ display: "inline" }}>
                rohitrajyadav6522@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="hc-footer__bottom">
        <span>© {year} SmartHospital Emergency Response System</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#E2E8F0" }}>
          <span
            aria-hidden="true"
            style={{
              inlineSize: "8px",
              blockSize: "8px",
              borderRadius: "50%",
              backgroundColor: "var(--color-success)",
              display: "inline-block",
            }}
          />
          System Operational
        </span>
      </div>

      <style>{`
        .hc-footer {
          background-color: var(--color-primary);
          color: #CBD5E1;
          border-top: 1px solid var(--color-primary-dark);
        }

        .hc-footer__grid {
          max-inline-size: 1280px;
          margin-inline: auto;
          padding: 3rem 1.5rem 2.25rem;
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
          gap: 2.5rem;
        }

        .hc-footer__heading {
          color: #FFFFFF;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin: 0 0 1rem;
        }

        .hc-footer__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5625rem;
        }

        .hc-footer__link {
          color: #CBD5E1;
          font-size: 0.875rem;
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .hc-footer__link:hover {
          color: #FFFFFF;
          text-decoration: underline;
        }

        .hc-footer__icon-link {
          inline-size: 36px;
          block-size: 36px;
          border-radius: var(--radius-md);
          background-color: var(--color-primary-dark);
          border: 1px solid rgba(255, 255, 255, 0.16);
          color: #E2E8F0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .hc-footer__icon-link:hover {
          background-color: var(--color-secondary);
          color: #FFFFFF;
          text-decoration: none;
        }

        .hc-footer__copy-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.1875rem 0.5rem;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(255, 255, 255, 0.22);
          background-color: var(--color-primary-dark);
          color: #E2E8F0;
          font-size: 0.75rem;
        }
        .hc-footer__copy-btn:hover {
          background-color: var(--color-secondary);
          color: #FFFFFF;
        }

        .hc-footer__bottom {
          max-inline-size: 1280px;
          margin-inline: auto;
          padding: 1.125rem 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.14);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
          font-size: 0.8125rem;
          color: #94A3B8;
        }

        @media (max-width: 900px) {
          .hc-footer__grid {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
        }

        @media (max-width: 540px) {
          .hc-footer__grid {
            grid-template-columns: 1fr;
            padding: 2rem 1rem 1.5rem;
          }
          .hc-footer__bottom {
            padding: 1rem;
          }
        }
      `}</style>
    </footer>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default Footer;
