import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AlertIcon, AmbulanceIcon, ArrowLeftIcon, MapPinIcon } from "../components/Icons";

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
    if (error) setError(null);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          currentLatitude: position.coords.latitude.toFixed(6),
          currentLongitude: position.coords.longitude.toFixed(6),
        }));
      },
      () => setError("Unable to detect current GPS location. Please enter coordinates manually.")
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
          ? parseInt(formData.assignedHospitalId, 10)
          : null,
      });
      navigate("/ambulances");
    } catch {
      setError("Failed to register ambulance. Please verify the inputs and try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container page-container--narrow">
      <Link to="/ambulances" className="hc-back-link">
        <ArrowLeftIcon size={16} />
        <span>Back to Ambulance Fleet</span>
      </Link>

      <div className="page-header" style={{ marginBottom: "1.25rem" }}>
        <div>
          <h1 className="page-title">
            <AmbulanceIcon size={26} />
            <span>Add New Ambulance</span>
          </h1>
          <p className="page-subtitle">
            Register an emergency vehicle unit, assign driver contact information, and set initial GPS telemetry.
          </p>
        </div>
      </div>

      <div className="hc-card hc-card--padded">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group form-group--full">
              <label htmlFor="amb-vehicle">
                Vehicle Number <span className="required-mark">*</span>
              </label>
              <input
                id="amb-vehicle"
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                placeholder="e.g. BR01AB1234"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="amb-driver">
                Driver Name <span className="required-mark">*</span>
              </label>
              <input
                id="amb-driver"
                type="text"
                name="driverName"
                value={formData.driverName}
                onChange={handleChange}
                placeholder="Full driver name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="amb-contact">
                Driver Contact <span className="required-mark">*</span>
              </label>
              <input
                id="amb-contact"
                type="tel"
                name="driverContact"
                value={formData.driverContact}
                onChange={handleChange}
                placeholder="e.g. +91 9876543210"
                required
              />
            </div>

            <div className="form-group form-group--full">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                  padding: "0.875rem 1rem",
                  backgroundColor: "var(--color-surface-subtle)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--color-text)" }}>
                    GPS Telemetry Coordinates
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
                    Populate coordinates from device GPS or enter manually below.
                  </div>
                </div>
                <button type="button" onClick={detectLocation} className="btn btn-secondary btn-sm">
                  <MapPinIcon size={15} />
                  <span>Use Current Location</span>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="amb-lat">
                Current Latitude <span className="required-mark">*</span>
              </label>
              <input
                id="amb-lat"
                type="text"
                name="currentLatitude"
                value={formData.currentLatitude}
                onChange={handleChange}
                inputMode="decimal"
                placeholder="e.g. 25.5941"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="amb-lon">
                Current Longitude <span className="required-mark">*</span>
              </label>
              <input
                id="amb-lon"
                type="text"
                name="currentLongitude"
                value={formData.currentLongitude}
                onChange={handleChange}
                inputMode="decimal"
                placeholder="e.g. 85.1376"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="amb-status">Operational Status</label>
              <select
                id="amb-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="ON_DUTY">ON_DUTY</option>
                <option value="OFFLINE">OFFLINE</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="amb-hospital">Assigned Hospital ID</label>
              <input
                id="amb-hospital"
                type="number"
                name="assignedHospitalId"
                min="1"
                value={formData.assignedHospitalId}
                onChange={handleChange}
                placeholder="Optional (e.g. 1)"
              />
            </div>
          </div>

          {error && (
            <div role="alert" className="hc-alert hc-alert--danger" style={{ marginTop: "1.25rem" }}>
              <AlertIcon size={18} />
              <span>{error}</span>
            </div>
          )}

          <div
            style={{
              marginTop: "1.5rem",
              paddingTop: "1.25rem",
              borderTop: "1px solid var(--color-border)",
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <Link to="/ambulances" className="btn btn-outline">
              Cancel
            </Link>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? "Saving..." : "Save Ambulance Unit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAmbulance;
