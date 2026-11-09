import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  AmbulanceIcon,
  ArrowRightIcon,
  DashboardIcon,
  EmergencyIcon,
  HospitalIcon,
  PatientIcon,
  RouteIcon,
  ShieldIcon,
} from "../components/Icons";

function Home() {
  const { isAdmin } = useAuth();

  const features = [
    {
      icon: <HospitalIcon size={22} />,
      title: "Smart Hospital Matching",
      desc: "Ranks nearby hospitals in real time using distance, available ICU beds, blood bank status, and specialist availability.",
      accentBg: "var(--color-primary-tint)",
      accentColor: "var(--color-primary)",
    },
    {
      icon: <RouteIcon size={22} />,
      title: "Live OSRM Route Mapping",
      desc: "Calculates driving routes over OpenStreetMap road networks and displays live ETA countdowns on an interactive Leaflet map.",
      accentBg: "var(--color-secondary-tint)",
      accentColor: "var(--color-secondary)",
    },
    {
      icon: <AmbulanceIcon size={22} />,
      title: "Real-Time Fleet Telemetry",
      desc: "Tracks ambulance availability, driver assignments, and GPS updates instantly across connected clients via WebSockets.",
      accentBg: "var(--color-success-bg)",
      accentColor: "var(--color-success-text)",
    },
    {
      icon: <PatientIcon size={22} />,
      title: "Digital Patient Triage Records",
      desc: "Maintains patient blood groups, medical history, and emergency contacts with duplicate detection for safer admissions.",
      accentBg: "var(--color-warning-bg)",
      accentColor: "var(--color-warning-text)",
    },
  ];

  const directoryCards = [
    {
      to: "/hospitals",
      title: "Hospital Directory",
      desc: "Inspect live ICU beds, blood units, doctors, and emergency capabilities.",
      icon: <HospitalIcon size={20} />,
    },
    {
      to: "/patients",
      title: "Patient Records",
      desc: "Search medical histories, blood types, and emergency contact details.",
      icon: <PatientIcon size={20} />,
    },
    {
      to: "/ambulances",
      title: "Ambulance Fleet",
      desc: "Monitor live WebSocket fleet readiness, driver contacts, and locations.",
      icon: <AmbulanceIcon size={20} />,
    },
    ...(isAdmin
      ? [
        {
          to: "/dashboard",
          title: "Operations Dashboard",
          desc: "Review system-wide ICU capacity, response analytics, and fleet metrics.",
          icon: <DashboardIcon size={20} />,
        },
      ]
      : []),
  ];

  return (
    <div>
      {/* Hero Banner */}
      <section className="hc-hero">
        <div className="hc-hero__inner">
          <div>
            <div className="hc-hero__eyebrow">
              <span className="hc-hero__dot" aria-hidden="true" />
              <span>24/7 Emergency Response &amp; Routing Network</span>
            </div>

            <h1 className="hc-hero__title">
              Smart Hospital Emergency Response &amp; Clinical Routing
            </h1>

            <p className="hc-hero__subtitle">
              Connect patients to the nearest and best-equipped hospital in seconds. Our scoring engine evaluates distance, ICU capacity, blood availability, and specialist coverage simultaneously.
            </p>

            <div className="hc-hero__actions">
              <Link to="/request-emergency" className="btn btn-danger btn-lg">
                <EmergencyIcon size={18} />
                <span>Request Emergency Now</span>
              </Link>
              <Link
                to="/hospitals"
                className="btn btn-lg"
                style={{
                  backgroundColor: "#FFFFFF",
                  color: "var(--color-primary)",
                }}
              >
                <HospitalIcon size={18} />
                <span>Browse Hospitals</span>
              </Link>
            </div>
          </div>

          {/* Structured Triage Overview Card */}
          <aside className="hc-card hc-card--padded hc-hero__panel" aria-label="Emergency Routing Workflow">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                How Dispatch Works
              </span>
              <span className="badge badge-success">Active Engine</span>
            </div>

            <ol className="hc-workflow-list">
              <li className="hc-workflow-item">
                <span className="hc-workflow-step">1</span>
                <div>
                  <strong style={{ display: "block", fontSize: "0.9375rem", color: "var(--color-text)" }}>
                    Location &amp; Symptom Triage
                  </strong>
                  <span style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
                    Auto-detect GPS or search location, with AI severity assessment from reported symptoms.
                  </span>
                </div>
              </li>
              <li className="hc-workflow-item">
                <span className="hc-workflow-step">2</span>
                <div>
                  <strong style={{ display: "block", fontSize: "0.9375rem", color: "var(--color-text)" }}>
                    Suitability Scoring Match
                  </strong>
                  <span style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
                    Evaluates Haversine proximity, open ICU beds, blood bank availability, and emergency type.
                  </span>
                </div>
              </li>
              <li className="hc-workflow-item">
                <span className="hc-workflow-step">3</span>
                <div>
                  <strong style={{ display: "block", fontSize: "0.9375rem", color: "var(--color-text)" }}>
                    Road Routing &amp; Auto-Dispatch
                  </strong>
                  <span style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
                    Maps live road directions, estimates ambulance ETA, and assigns the closest available unit.
                  </span>
                </div>
              </li>
            </ol>

            <div style={{ marginTop: "1.125rem", paddingTop: "1rem", borderTop: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
                <ShieldIcon size={15} />
                Role-protected operations
              </span>
              <Link to="/request-emergency" style={{ fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                Start Dispatch <ArrowRightIcon size={14} />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="page-container" style={{ paddingBlockStart: "3rem" }}>
        <div style={{ marginBottom: "1.75rem" }}>
          <h2 style={{ marginBottom: "0.375rem" }}>Core Emergency Capabilities</h2>
          <p className="page-subtitle">
            Purpose-built modules for rapid emergency triage, resource coordination, and real-time fleet visibility.
          </p>
        </div>

        <div className="hc-features-grid">
          {features.map((feature) => (
            <article key={feature.title} className="hc-card hc-card--padded">
              <div
                style={{
                  inlineSize: "44px",
                  blockSize: "44px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: feature.accentBg,
                  color: feature.accentColor,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                }}
              >
                {feature.icon}
              </div>
              <h3 style={{ marginBottom: "0.5rem" }}>{feature.title}</h3>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                {feature.desc}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Quick Access Directory */}
      <section className="page-container" style={{ paddingBlockStart: "0.5rem" }}>
        <div style={{ marginBottom: "1.25rem" }}>
          <h2 style={{ marginBottom: "0.25rem" }}>Quick Access Modules</h2>
          <p className="page-subtitle">Jump directly to live hospital, patient, and ambulance directories.</p>
        </div>

        <div className="hc-directory-grid">
          {directoryCards.map((item) => (
            <Link key={item.to} to={item.to} className="hc-card hc-card--padded hc-card--interactive hc-dir-link">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span className="hc-dir-icon">{item.icon}</span>
                <span style={{ color: "var(--color-secondary)", display: "inline-flex" }}>
                  <ArrowRightIcon size={18} />
                </span>
              </div>
              <h3 style={{ marginBottom: "0.375rem", color: "var(--color-primary)" }}>{item.title}</h3>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
                {item.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <style>{`
        .hc-hero {
          background-color: var(--color-primary);
          color: #FFFFFF;
          border-bottom: 1px solid var(--color-primary-dark);
          padding: 3.5rem 1.5rem;
        }

        .hc-hero__inner {
          max-inline-size: 1280px;
          margin-inline: auto;
          display: grid;
          grid-template-columns: 1.25fr 0.95fr;
          gap: 2.5rem;
          align-items: center;
        }

        .hc-hero__eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 0.875rem;
          background-color: var(--color-primary-dark);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: var(--radius-pill);
          font-size: 0.8125rem;
          font-weight: 600;
          color: #E2E8F0;
          margin-bottom: 1.25rem;
        }

        .hc-hero__dot {
          inline-size: 8px;
          block-size: 8px;
          border-radius: 50%;
          background-color: var(--color-success);
        }

        .hc-hero__title {
          color: #FFFFFF;
          font-size: clamp(1.875rem, 1.4rem + 1.8vw, 2.75rem);
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 1rem;
        }

        .hc-hero__subtitle {
          color: #CBD5E1;
          font-size: 1.0625rem;
          line-height: 1.6;
          max-inline-size: 56ch;
          margin: 0 0 1.75rem;
        }

        .hc-hero__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.875rem;
        }

        .hc-hero__panel {
          color: var(--color-text);
          box-shadow: var(--shadow-md);
        }

        .hc-workflow-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }

        .hc-workflow-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .hc-workflow-step {
          inline-size: 26px;
          block-size: 26px;
          border-radius: 50%;
          background-color: var(--color-primary-tint);
          color: var(--color-primary);
          font-size: 0.8125rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .hc-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.25rem;
        }

        .hc-directory-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.25rem;
        }

        .hc-dir-link {
          display: block;
          text-decoration: none;
        }
        .hc-dir-link:hover {
          text-decoration: none;
          border-color: var(--color-secondary);
        }

        .hc-dir-icon {
          inline-size: 38px;
          block-size: 38px;
          border-radius: var(--radius-md);
          background-color: var(--color-primary-tint);
          color: var(--color-primary);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 960px) {
          .hc-hero {
            padding: 2.5rem 1rem;
          }
          .hc-hero__inner {
            grid-template-columns: 1fr;
            gap: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;
