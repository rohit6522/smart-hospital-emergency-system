import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import api from "../services/api";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/dashboard/stats");
      setStats(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load dashboard stats.");
      setLoading(false);
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading dashboard...</p>;
  if (error) return <p style={{ padding: "20px", color: "red" }}>{error}</p>;

  const COLORS = ["#e63946", "#2a9d8f", "#457b9d", "#e9c46a", "#f4a261", "#8338ec"];

  const emergencyTypeData = Object.entries(stats.emergencyTypeBreakdown || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const ambulanceStatusData = Object.entries(stats.ambulanceStatusBreakdown || {}).map(([name, value]) => ({
    name,
    count: value,
  }));

  const cards = [
    { label: "Total Hospitals", value: stats.totalHospitals, icon: "🏥", color: "#457b9d" },
    { label: "Total Patients", value: stats.totalPatients, icon: "🧑‍⚕️", color: "#e63946" },
    { label: "Total Ambulances", value: stats.totalAmbulances, icon: "🚑", color: "#2a9d8f" },
    { label: "Emergency Requests", value: stats.totalEmergencyRequests, icon: "🚨", color: "#e9c46a" },
    { label: "Available Ambulances", value: stats.availableAmbulances, icon: "✅", color: "#2a9d8f" },
    { label: "On-Duty Ambulances", value: stats.onDutyAmbulances, icon: "🔄", color: "#f4a261" },
    { label: "Total ICU Beds", value: stats.totalIcuBeds, icon: "🛏️", color: "#457b9d" },
    { label: "Available ICU Beds", value: stats.availableIcuBeds, icon: "🟢", color: "#2a9d8f" },
  ];

  return (
    <div className="responsive-container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "50px 20px" }}>
      <h1 className="animate-fade-up" style={{ marginBottom: "6px" }}>📊 Admin Dashboard</h1>
      <p className="animate-fade-up" style={{ color: "#6c757d", marginTop: 0, marginBottom: "30px" }}>
        Overview of hospital system performance and resources.
      </p>

      {/* Summary Cards */}
      <div
        className="feature-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "40px",
        }}
      >
        {cards.map((card, i) => (
          <div
            key={card.label}
            className={`glass-card animate-fade-up stagger-${Math.min(i + 1, 6)}`}
            style={{
              padding: "20px",
              borderLeft: `4px solid ${card.color}`,
            }}
          >
            <div style={{ fontSize: "26px", marginBottom: "8px" }}>{card.icon}</div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#1d1d1d" }}>{card.value}</div>
            <div style={{ fontSize: "13px", color: "#6c757d", marginTop: "4px" }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div
        className="feature-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
        }}
      >
        {/* Pie Chart - Emergency Type Distribution */}
        <div className="glass-card animate-fade-up" style={{ padding: "24px" }}>
          <h3 style={{ marginTop: 0, marginBottom: "16px", fontSize: "16px" }}>Hospitals by Emergency Type</h3>
          {emergencyTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={emergencyTypeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={(entry) => entry.name}
                >
                  {emergencyTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: "#6c757d", fontSize: "14px" }}>No data available yet.</p>
          )}
        </div>

        {/* Bar Chart - Ambulance Status */}
        <div className="glass-card animate-fade-up stagger-2" style={{ padding: "24px" }}>
          <h3 style={{ marginTop: 0, marginBottom: "16px", fontSize: "16px" }}>Ambulance Status Breakdown</h3>
          {ambulanceStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={ambulanceStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#457b9d" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: "#6c757d", fontSize: "14px" }}>No data available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;