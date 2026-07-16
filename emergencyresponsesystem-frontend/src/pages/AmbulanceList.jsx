import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { connectWebSocket, disconnectWebSocket } from "../services/websocket";
import { useAuth } from "../context/AuthContext";

function AmbulanceList() {
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLive, setIsLive] = useState(false);
  const { isAdmin } = useAuth();

  const fetchAmbulances = async () => {
    try {
      const response = await api.get("/ambulances");
      setAmbulances(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load ambulances. Is the backend running?");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmbulances();

    connectWebSocket(
      (updatedAmbulance) => {
        setAmbulances((prevAmbulances) => {
          const exists = prevAmbulances.some((a) => a.id === updatedAmbulance.id);
          if (exists) {
            return prevAmbulances.map((a) =>
              a.id === updatedAmbulance.id ? updatedAmbulance : a
            );
          } else {
            return [...prevAmbulances, updatedAmbulance];
          }
        });
      },
      (connected) => {
        setIsLive(connected);
      }
    );

    return () => {
      disconnectWebSocket();
    };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ambulance?")) return;
    try {
      await api.delete(`/ambulances/${id}`);
      setAmbulances(ambulances.filter((a) => a.id !== id));
    } catch (err) {
      alert("Failed to delete ambulance.");
    }
  };

  const handleStatusChange = async (ambulance, newStatus) => {
    try {
      const updated = { ...ambulance, status: newStatus };
      await api.put(`/ambulances/${ambulance.id}`, updated);
      setAmbulances(
        ambulances.map((a) => (a.id === ambulance.id ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading ambulances...</p>;
  if (error) return <p style={{ padding: "20px", color: "red" }}>{error}</p>;

  const filteredAmbulances =
    statusFilter === "All" ? ambulances : ambulances.filter((a) => a.status === statusFilter);

  const statusColor = {
    AVAILABLE: "#2a9d8f",
    ON_DUTY: "#e9c46a",
    OFFLINE: "#999",
  };

  return (
    <div className="responsive-container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "50px 20px" }}>
      <div className="animate-fade-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
        <h1 style={{ margin: 0 }}>
          🚑 Ambulance Fleet{" "}
          <span
            style={{
              fontSize: "13px",
              background: isLive ? "linear-gradient(135deg, #2a9d8f, #21867a)" : "linear-gradient(135deg, #e63946, #c1121f)",
              color: "white",
              padding: "3px 10px",
              borderRadius: "12px",
              verticalAlign: "middle",
            }}
          >
            {isLive ? "🟢 Live" : "🔴 Offline"}
          </span>
        </h1>
        {isAdmin && (
          <Link to="/ambulances/add">
            <button
              style={{
                padding: "12px 22px",
                background: "linear-gradient(135deg, #2a9d8f, #21867a)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "700",
                boxShadow: "0 6px 18px rgba(42, 157, 143, 0.35)",
              }}
            >
              + Add New Ambulance
            </button>
          </Link>
        )}
      </div>

      <p className="animate-fade-up" style={{ color: "#6c757d", marginTop: 0, marginBottom: "24px" }}>
        Track and manage ambulance status and live location.
      </p>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="animate-fade-up"
        style={{ padding: "11px 14px", marginBottom: "20px", fontSize: "14px" }}
      >
        <option value="All">All Statuses</option>
        <option value="AVAILABLE">Available</option>
        <option value="ON_DUTY">On Duty</option>
        <option value="OFFLINE">Offline</option>
      </select>

      <p style={{ color: "#6c757d", fontSize: "13px" }}>
        Showing {filteredAmbulances.length} of {ambulances.length} ambulances
      </p>

      {filteredAmbulances.length === 0 ? (
        <p>No ambulances found.</p>
      ) : (
        <div className="glass-card table-wrapper animate-fade-up" style={{ overflow: "hidden" }}>
          <table cellPadding="12" style={{ borderCollapse: "collapse", width: "100%", fontSize: "14px" }}>
            <thead>
              <tr style={{ backgroundColor: "rgba(255,255,255,0.4)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                <th>ID</th>
                <th>Vehicle Number</th>
                <th>Driver</th>
                <th>Driver Contact</th>
                <th>Current Location</th>
                <th>Assigned Hospital ID</th>
                <th>Status</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredAmbulances.map((ambulance, i) => (
                <tr
                  key={ambulance.id}
                  style={{
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                    backgroundColor: i % 2 === 0 ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.05)",
                  }}
                >
                  <td>{ambulance.id}</td>
                  <td style={{ fontWeight: "600" }}>{ambulance.vehicleNumber}</td>
                  <td>{ambulance.driverName}</td>
                  <td>{ambulance.driverContact}</td>
                  <td style={{ fontSize: "13px" }}>
                    {ambulance.currentLatitude}, {ambulance.currentLongitude}
                  </td>
                  <td>{ambulance.assignedHospitalId}</td>
                  <td>
                    {isAdmin ? (
                      <select
                        value={ambulance.status}
                        onChange={(e) => handleStatusChange(ambulance, e.target.value)}
                        style={{
                          padding: "6px 10px",
                          backgroundColor: statusColor[ambulance.status] || "#ccc",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="ON_DUTY">ON_DUTY</option>
                        <option value="OFFLINE">OFFLINE</option>
                      </select>
                    ) : (
                      <span
                        style={{
                          padding: "6px 10px",
                          backgroundColor: statusColor[ambulance.status] || "#ccc",
                          color: "white",
                          borderRadius: "6px",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      >
                        {ambulance.status}
                      </span>
                    )}
                  </td>
                  {isAdmin && (
                    <td>
                      <button
                        onClick={() => handleDelete(ambulance.id)}
                        style={{
                          padding: "6px 14px",
                          background: "linear-gradient(135deg, #e63946, #c1121f)",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "13px",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AmbulanceList;