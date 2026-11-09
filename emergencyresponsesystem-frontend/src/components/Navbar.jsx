import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { PulseLogoIcon, CloseIcon } from "./Icons";
import ConfirmDialog from "./ConfirmDialog";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const { user, logout } = useAuth();

  const baseLinks = [
    { path: "/", label: "Home" },
    { path: "/hospitals", label: "Hospitals" },
    { path: "/request-emergency", label: "Emergency" },
    { path: "/patients", label: "Patients" },
    { path: "/ambulances", label: "Ambulances" },
  ];

  const links =
    user?.role === "ADMIN"
      ? [...baseLinks, { path: "/dashboard", label: "Dashboard" }]
      : baseLinks;

  const confirmLogout = () => {
    logout();
    setConfirmLogoutOpen(false);
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      <header className="hc-header">
        <div className="hc-header__inner">
          <Link to="/" className="hc-brand" onClick={() => setMenuOpen(false)}>
            <PulseLogoIcon size={32} />
            <span className="hc-brand__text">
              <span className="hc-brand__name">
                Smart<span style={{ color: "var(--color-secondary)" }}>Hospital</span>
              </span>
              <span className="hc-brand__sub">Emergency Network</span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hc-nav-desktop">
            <ul className="hc-nav-list">
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      aria-current={isActive ? "page" : undefined}
                      className={`hc-nav-link ${isActive ? "is-active" : ""}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hc-nav-actions">
            {user ? (
              <div className="hc-user-cluster">
                <span className="hc-user-pill" title={user.role}>
                  <span className="hc-user-dot" aria-hidden="true" />
                  <span className="hc-user-name">{user.fullName || user.username}</span>
                  <span className={`badge ${user.role === "ADMIN" ? "badge-primary" : "badge-info"}`}>
                    {user.role}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setConfirmLogoutOpen(true)}
                  className="btn btn-outline btn-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hc-auth-cluster">
                <Link to="/login" className="btn btn-outline btn-sm">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button
            type="button"
            className="hc-hamburger"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="mobile-primary-nav"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {menuOpen ? (
              <CloseIcon size={22} />
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>

        {menuOpen && (
          <nav
            id="mobile-primary-nav"
            aria-label="Mobile"
            className="hc-mobile-drawer"
          >
            <ul className="hc-mobile-list">
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setMenuOpen(false)}
                      className={`hc-mobile-link ${isActive ? "is-active" : ""}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="hc-mobile-auth">
              {user ? (
                <>
                  <div className="hc-user-pill" style={{ justifyContent: "space-between", width: "100%" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                      <span className="hc-user-dot" aria-hidden="true" />
                      <span style={{ fontWeight: 600 }}>{user.fullName || user.username}</span>
                    </span>
                    <span className={`badge ${user.role === "ADMIN" ? "badge-primary" : "badge-info"}`}>
                      {user.role}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConfirmLogoutOpen(true)}
                    className="btn btn-danger"
                    style={{ width: "100%" }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="btn btn-outline"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="btn btn-primary"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </header>

      <ConfirmDialog
        open={confirmLogoutOpen}
        title="Sign out of SmartHospital?"
        message="You will be signed out of your current session. Public emergency routing remains accessible."
        confirmLabel="Logout"
        cancelLabel="Stay signed in"
        variant="primary"
        onConfirm={confirmLogout}
        onCancel={() => setConfirmLogoutOpen(false)}
      />

      <style>{`
        .hc-header {
          position: sticky;
          inset-block-start: 0;
          z-index: 1000;
          background-color: var(--color-card);
          border-bottom: 1px solid var(--color-border);
          box-shadow: var(--shadow-xs);
        }

        .hc-header__inner {
          max-inline-size: 1280px;
          margin-inline: auto;
          padding: 0.75rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.25rem;
        }

        .hc-brand {
          display: inline-flex;
          align-items: center;
          gap: 0.625rem;
          text-decoration: none;
          flex-shrink: 0;
        }
        .hc-brand:hover {
          text-decoration: none;
        }

        .hc-brand__text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .hc-brand__name {
          font-size: 1.0625rem;
          font-weight: 800;
          color: var(--color-primary);
          letter-spacing: -0.02em;
        }

        .hc-brand__sub {
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-text-secondary);
        }

        .hc-nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .hc-nav-link {
          display: inline-flex;
          align-items: center;
          padding: 0.5rem 0.875rem;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          text-decoration: none;
          white-space: nowrap;
          transition: background-color 0.15s ease, color 0.15s ease;
        }

        .hc-nav-link:hover {
          color: var(--color-primary);
          background-color: var(--color-surface-hover);
          text-decoration: none;
        }

        .hc-nav-link.is-active {
          color: var(--color-primary);
          background-color: var(--color-primary-tint);
          font-weight: 700;
        }

        .hc-nav-actions {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .hc-user-cluster,
        .hc-auth-cluster {
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }

        .hc-user-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.3125rem 0.625rem;
          border-radius: var(--radius-md);
          background-color: var(--color-surface-subtle);
          border: 1px solid var(--color-border);
          font-size: 0.8125rem;
          color: var(--color-text);
        }

        .hc-user-name {
          max-inline-size: 130px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: 600;
        }

        .hc-user-dot {
          inline-size: 7px;
          block-size: 7px;
          border-radius: 50%;
          background-color: var(--color-success);
          flex-shrink: 0;
        }

        .hc-hamburger {
          display: none;
          inline-size: 44px;
          block-size: 44px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          background-color: var(--color-card);
          color: var(--color-primary);
          align-items: center;
          justify-content: center;
          padding: 0;
        }

        .hc-mobile-drawer {
          display: none;
          border-top: 1px solid var(--color-border);
          background-color: var(--color-card);
          padding: 1rem 1.25rem 1.25rem;
        }

        .hc-mobile-list {
          list-style: none;
          margin: 0 0 1rem;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .hc-mobile-link {
          display: flex;
          align-items: center;
          padding: 0.6875rem 0.875rem;
          border-radius: var(--radius-md);
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--color-text);
          text-decoration: none;
        }

        .hc-mobile-link.is-active {
          background-color: var(--color-primary);
          color: #FFFFFF;
          font-weight: 600;
        }

        .hc-mobile-auth {
          border-top: 1px solid var(--color-border);
          padding-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        @media (max-width: 960px) {
          .hc-header__inner {
            padding: 0.6875rem 1rem;
          }
          .hc-nav-desktop,
          .hc-nav-actions {
            display: none;
          }
          .hc-hamburger {
            display: inline-flex;
          }
          .hc-mobile-drawer {
            display: block;
          }
        }
      `}</style>
    </>
  );
}

export default Navbar;
