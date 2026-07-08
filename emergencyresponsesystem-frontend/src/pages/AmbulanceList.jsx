import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

function AmbulanceList() {
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");

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
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>🚑 Ambulance Fleet</h1>
        <Link to="/ambulances/add">
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#2a9d8f",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            + Add New Ambulance
          </button>
        </Link>
      </div>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        style={{ padding: "8px", marginBottom: "20px" }}
      >
        <option value="All">All Statuses</option>
        <option value="AVAILABLE">Available</option>
        <option value="ON_DUTY">On Duty</option>
        <option value="OFFLINE">Offline</option>
      </select>

      <p style={{ color: "#666", fontSize: "14px" }}>
        Showing {filteredAmbulances.length} of {ambulances.length} ambulances
      </p>

      {filteredAmbulances.length === 0 ? (
        <p>No ambulances found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th>ID</th>
              <th>Vehicle Number</th>
              <th>Driver</th>
              <th>Driver Contact</th>
              <th>Current Location (Lat, Long)</th>
              <th>Assigned Hospital ID</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAmbulances.map((ambulance) => (
              <tr key={ambulance.id}>
                <td>{ambulance.id}</td>
                <td>{ambulance.vehicleNumber}</td>
                <td>{ambulance.driverName}</td>
                <td>{ambulance.driverContact}</td>
                <td>
                  {ambulance.currentLatitude}, {ambulance.currentLongitude}
                </td>
                <td>{ambulance.assignedHospitalId}</td>
                <td>
                  <select
                    value={ambulance.status}
                    onChange={(e) => handleStatusChange(ambulance, e.target.value)}
                    style={{
                      padding: "5px",
                      backgroundColor: statusColor[ambulance.status] || "#ccc",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="ON_DUTY">ON_DUTY</option>
                    <option value="OFFLINE">OFFLINE</option>
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(ambulance.id)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#e63946",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AmbulanceList;