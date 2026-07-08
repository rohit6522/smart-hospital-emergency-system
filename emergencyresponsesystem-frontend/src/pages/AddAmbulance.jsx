import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AddAmbulance() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    driverName: "",
    driverContact: "",
    currentLatitude: "",
    currentLongitude: "",
    status: "AVAILABLE",
    assignedHospitalId: "",
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          currentLatitude: position.coords.latitude.toFixed(6),
          currentLongitude: position.coords.longitude.toFixed(6),
        });
      },
      () => setError("Unable to detect location. Please enter manually.")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.post("/ambulances", {
        ...formData,
        currentLatitude: parseFloat(formData.currentLatitude),
        currentLongitude: parseFloat(formData.currentLongitude),
        assignedHospitalId: formData.assignedHospitalId
          ? parseInt(formData.assignedHospitalId)
          : null,
      });
      navigate("/ambulances");
    } catch (err) {
      setError("Failed to add ambulance. Please check the form and try again.");
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <h1>➕ Add New Ambulance</h1>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <div style={{ marginBottom: "15px" }}>
          <label>Vehicle Number</label>
          <input
            type="text"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleChange}
            placeholder="e.g. BR01AB1234"
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
          <div style={{ flex: 1 }}>
            <label>Driver Name</label>
            <input
              type="text"
              name="driverName"
              value={formData.driverName}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Driver Contact</label>
            <input
              type="text"
              name="driverContact"
              value={formData.driverContact}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <button
            type="button"
            onClick={detectLocation}
            style={{
              padding: "8px 14px",
              backgroundColor: "#2a9d8f",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            📍 Use Current Location
          </button>
        </div>

        <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
          <div style={{ flex: 1 }}>
            <label>Current Latitude</label>
            <input
              type="text"
              name="currentLatitude"
              value={formData.currentLatitude}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Current Longitude</label>
            <input
              type="text"
              name="currentLongitude"
              value={formData.currentLongitude}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
          <div style={{ flex: 1 }}>
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            >
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="ON_DUTY">ON_DUTY</option>
              <option value="OFFLINE">OFFLINE</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label>Assigned Hospital ID</label>
            <input
              type="number"
              name="assignedHospitalId"
              value={formData.assignedHospitalId}
              onChange={handleChange}
              placeholder="e.g. 1"
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: "12px 24px",
            backgroundColor: "#2a9d8f",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          {submitting ? "Saving..." : "Save Ambulance"}
        </button>
      </form>
    </div>
  );
}

export default AddAmbulance;