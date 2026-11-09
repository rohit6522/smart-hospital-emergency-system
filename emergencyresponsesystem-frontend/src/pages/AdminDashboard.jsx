import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../services/api";
import Loader from "../components/Loader";
import {
  ActivityIcon,
  AlertIcon,
  AmbulanceIcon,
  BedIcon,
  CheckCircleIcon,
  ClockIcon,
  DashboardIcon,
  EmergencyIcon,
  HospitalIcon,
  PatientIcon,
  RefreshIcon,
} from "../components/Icons";

// Strictly controlled Healthcare Palette for all chart series
const CHART_COLORS = ["#163A5F", "#2878B5", "#16A34A", "#F59E0B", "#DC2626", "#64748B"];

const STATUS_BAR_COLORS = {
  AVAILABLE: "#16A34A",
  ON_DUTY: "#F59E0B",
  OFFLINE: "#64748B",
};

const TOOLTIP_STYLE = {
  backgroundColor: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
  fontSize: "0.8125rem",
  color: "#1E293B",
};

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let active = true;
    const loadInitialStats = async () => {
      try {
        const response = await api.get("/dashboard/stats");
        if (active) {
          setStats(response.data);
          setLastUpdated(new Date().toLocaleTimeString());
          setLoading(false);
        }
      } catch {
        if (active) {
          setError("Failed to load dashboard statistics. Please verify the backend service is running.");
          setLoading(false);
        }
      }
    };
    loadInitialStats();
    return () => {
      active = false;
    };
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const response = await api.get("/dashboard/stats");
      setStats(response.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch {
      setError("Failed to refresh dashboard statistics.");
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) return <Loader text="Loading hospital analytics..." />;

  if (error && !stats) {
    return (
      <div className="page-container">
        <div role="alert" className="hc-alert hc-alert--danger">
          <AlertIcon size={18} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const emergencyTypeData = Object.entries(stats.emergencyTypeBreakdown || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const ambulanceStatusData = Object.entries(stats.ambulanceStatusBreakdown || {}).map(([name, value]) => ({
    name,
    count: value,
  }));

  const responseTimeData = Object.entries(stats.avgResponseTimeByHospital || {}).map(
    ([name, minutes]) => ({
      name,
      minutes: typeof minutes === "number" ? Number(minutes.toFixed(1)) : minutes,
    })
  );

  const icuOccupancyPct =
    stats.totalIcuBeds > 0
      ? Math.round(((stats.totalIcuBeds - stats.availableIcuBeds) / stats.totalIcuBeds) * 100)
      : null;

  const kpiCards = [
    {
      label: "Total Hospitals",
      value: stats.totalHospitals,
      icon: HospitalIcon,
      accent: "#163A5F",
      iconBg: "#EBF1F7",
      link: "/hospitals",
    },
    {
      label: "Total Patients",
      value: stats.totalPatients,
      icon: PatientIcon,
      accent: "#2878B5",
      iconBg: "#E0F2FE",
      link: "/patients",
    },
    {
      label: "Total Ambulances",
      value: stats.totalAmbulances,
      icon: AmbulanceIcon,
      accent: "#163A5F",
      iconBg: "#EBF1F7",
      link: "/ambulances",
    },
    {
      label: "Emergency Requests",
      value: stats.totalEmergencyRequests,
      icon: EmergencyIcon,
      accent: "#DC2626",
      iconBg: "#FEE2E2",
      link: "/request-emergency",
    },
    {
      label: "Available Ambulances",
      value: stats.availableAmbulances,
      icon: CheckCircleIcon,
      accent: "#16A34A",
      iconBg: "#DCFCE7",
    },
    {
      label: "On-Duty Ambulances",
      value: stats.onDutyAmbulances,
      icon: ClockIcon,
      accent: "#F59E0B",
      iconBg: "#FEF3C7",
    },
    {
      label: "Total ICU Beds",
      value: stats.totalIcuBeds,
      icon: BedIcon,
      accent: "#2878B5",
      iconBg: "#E0F2FE",
    },
    {
      label: "Available ICU Beds",
      value: stats.availableIcuBeds,
      icon: BedIcon,
      accent: "#16A34A",
      iconBg: "#DCFCE7",
    },
    {
      label: "ICU Occupancy",
      value: icuOccupancyPct !== null ? `${icuOccupancyPct}%` : "N/A",
      icon: ActivityIcon,
      accent: icuOccupancyPct !== null && icuOccupancyPct >= 85 ? "#DC2626" : "#163A5F",
      iconBg: icuOccupancyPct !== null && icuOccupancyPct >= 85 ? "#FEE2E2" : "#EBF1F7",
      progressPct: icuOccupancyPct,
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <span className="badge badge-primary" style={{ marginBottom: "0.5rem" }}>
            <DashboardIcon size={13} />
            <span>Hospital Operations Command</span>
          </span>
          <h1 className="page-title">Admin Analytics Dashboard</h1>
          <p className="page-subtitle">
            Real-time overview of network hospital capacity, ICU bed utilization, ambulance deployment, and response benchmarks.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          {lastUpdated && (
            <span className="text-muted tabular-nums" style={{ fontSize: "0.8125rem" }}>
              Updated {lastUpdated}
            </span>
          )}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn btn-outline"
          >
            <RefreshIcon size={15} />
            <span>{refreshing ? "Refreshing..." : "Refresh Data"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="hc-alert hc-alert--danger" style={{ marginBottom: "1.25rem" }}>
          <AlertIcon size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Summary Grid */}
      <section aria-label="Key system metrics" className="hc-kpi-grid">
        {kpiCards.map((card) => {
          const IconComponent = card.icon;
          const cardBody = (
            <div className="hc-card hc-kpi-card">
              <div className="hc-kpi-card__top">
                <span className="hc-kpi-card__label">{card.label}</span>
                <span
                  className="hc-kpi-card__icon"
                  style={{ backgroundColor: card.iconBg, color: card.accent }}
                >
                  <IconComponent size={18} />
                </span>
              </div>

              <div className="hc-kpi-card__value tabular-nums">{card.value}</div>

              {typeof card.progressPct === "number" && (
                <div className="hc-progress-track" aria-hidden="true">
                  <div
                    className="hc-progress-fill"
                    style={{
                      width: `${Math.min(100, Math.max(0, card.progressPct))}%`,
                      backgroundColor:
                        card.progressPct >= 85
                          ? "#DC2626"
                          : card.progressPct >= 65
                          ? "#F59E0B"
                          : "#16A34A",
                    }}
                  />
                </div>
              )}
            </div>
          );

          return card.link ? (
            <Link key={card.label} to={card.link} className="hc-kpi-link">
              {cardBody}
            </Link>
          ) : (
            <div key={card.label}>{cardBody}</div>
          );
        })}
      </section>

      {/* Analytics Charts Grid */}
      <section aria-label="Operational charts" className="hc-charts-grid">
        {/* Emergency Type Distribution */}
        <article className="hc-card hc-card--padded">
          <div className="hc-chart-header">
            <h2 style={{ margin: 0, fontSize: "1.0625rem" }}>Hospitals by Emergency Type</h2>
            <p className="text-muted" style={{ margin: "0.25rem 0 0", fontSize: "0.8125rem" }}>
              Facility specialization coverage across emergency categories
            </p>
          </div>
          {emergencyTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={290}>
              <PieChart>
                <Pie
                  data={emergencyTypeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="48%"
                  innerRadius={52}
                  outerRadius={86}
                  paddingAngle={2}
                  animationDuration={300}
                >
                  {emergencyTypeData.map((entry, index) => (
                    <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: "0.8125rem", color: "#1E293B" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: "2rem" }}>
              No hospital specialization data recorded yet.
            </div>
          )}
        </article>

        {/* Ambulance Status Breakdown */}
        <article className="hc-card hc-card--padded">
          <div className="hc-chart-header">
            <h2 style={{ margin: 0, fontSize: "1.0625rem" }}>Ambulance Status Breakdown</h2>
            <p className="text-muted" style={{ margin: "0.25rem 0 0", fontSize: "0.8125rem" }}>
              Active dispatch readiness across all registered units
            </p>
          </div>
          {ambulanceStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={290}>
              <BarChart data={ambulanceStatusData} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={{ stroke: "#E2E8F0" }} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "#F1F5F9" }} />
                <Bar dataKey="count" name="Units" radius={[6, 6, 0, 0]} maxBarSize={56} animationDuration={300}>
                  {ambulanceStatusData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={STATUS_BAR_COLORS[entry.name] || "#2878B5"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: "2rem" }}>
              No ambulance telemetry data available yet.
            </div>
          )}
        </article>

        {/* Avg Response Time by Hospital */}
        <article className="hc-card hc-card--padded hc-chart-wide">
          <div className="hc-chart-header">
            <h2 style={{ margin: 0, fontSize: "1.0625rem" }}>Average Response Time by Hospital (min)</h2>
            <p className="text-muted" style={{ margin: "0.25rem 0 0", fontSize: "0.8125rem" }}>
              Measured duration from request dispatch to completion
            </p>
          </div>
          {responseTimeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={290}>
              <BarChart data={responseTimeData} layout="vertical" margin={{ top: 8, right: 24, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={{ stroke: "#E2E8F0" }} tickLine={false} unit=" min" />
                <YAxis dataKey="name" type="category" width={150} tick={{ fill: "#1E293B", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "#F1F5F9" }} />
                <Bar dataKey="minutes" name="Avg Minutes" fill="#2878B5" radius={[0, 6, 6, 0]} maxBarSize={32} animationDuration={300} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: "2rem" }}>
              <p style={{ margin: "0 0 0.75rem" }}>
                No completed emergency requests yet. Submit an emergency request to track hospital response benchmarks.
              </p>
              <Link to="/request-emergency" className="btn btn-outline btn-sm">
                Open Emergency Dispatch
              </Link>
            </div>
          )}
        </article>
      </section>

      <style>{`
        .hc-kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(165px, 1fr));
          gap: 1rem;
          margin-bottom: 1.75rem;
        }
        .hc-kpi-link {
          text-decoration: none;
          display: block;
          color: inherit;
        }
        .hc-kpi-link:hover {
          text-decoration: none;
        }
        .hc-kpi-link:hover .hc-kpi-card {
          border-color: var(--color-secondary);
          box-shadow: var(--shadow-sm);
        }
        .hc-kpi-card {
          padding: 1.25rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 0.75rem;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .hc-kpi-card__top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.75rem;
        }
        .hc-kpi-card__label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          line-height: 1.3;
        }
        .hc-kpi-card__icon {
          inline-size: 36px;
          block-size: 36px;
          border-radius: var(--radius-md);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .hc-kpi-card__value {
          font-size: 1.875rem;
          font-weight: 800;
          color: var(--color-primary);
          line-height: 1.1;
        }
        .hc-progress-track {
          inline-size: 100%;
          block-size: 6px;
          border-radius: var(--radius-pill);
          background-color: var(--color-surface-hover);
          overflow: hidden;
        }
        .hc-progress-fill {
          block-size: 100%;
          border-radius: var(--radius-pill);
          transition: width 0.3s ease;
        }
        .hc-charts-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.25rem;
        }
        .hc-chart-wide {
          grid-column: 1 / -1;
        }
        .hc-chart-header {
          margin-bottom: 1.125rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--color-border);
        }
        @media (max-width: 900px) {
          .hc-charts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;
