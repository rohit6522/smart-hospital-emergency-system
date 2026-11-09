import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AlertIcon, ArrowLeftIcon, PatientIcon } from "../components/Icons";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

function AddPatient() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    contactNumber: "",
    bloodGroup: "",
    medicalHistory: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
  });
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const checkForDuplicates = async () => {
    if (!formData.name.trim()) return [];
    setCheckingDuplicate(true);
    try {
      const response = await api.get("/patients/check-duplicate", {
        params: { name: formData.name, contact: formData.contactNumber },
      });
      return response.data;
    } catch {
      return [];
    } finally {
      setCheckingDuplicate(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Patient full name cannot be empty.");
      return;
    }

    const duplicates = await checkForDuplicates();
    if (duplicates.length > 0 && !duplicateWarning) {
      setDuplicateWarning(duplicates);
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/patients", {
        ...formData,
        age: parseInt(formData.age, 10),
      });
      navigate("/patients");
    } catch {
      setError("Failed to add patient record. Please verify all inputs and try again.");
      setSubmitting(false);
    }
  };

  const proceedAnyway = async () => {
    setDuplicateWarning(null);
    setSubmitting(true);
    setError(null);
    try {
      await api.post("/patients", {
        ...formData,
        age: parseInt(formData.age, 10),
      });
      navigate("/patients");
    } catch {
      setError("Failed to add patient record. Please verify all inputs and try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container page-container--narrow">
      <Link to="/patients" className="hc-back-link">
        <ArrowLeftIcon size={16} />
        <span>Back to Patient Records</span>
      </Link>

      <div className="page-header" style={{ marginBottom: "1.25rem" }}>
        <div>
          <h1 className="page-title">
            <PatientIcon size={26} />
            <span>Add New Patient</span>
          </h1>
          <p className="page-subtitle">
            Register a patient profile with blood group, medical history, and emergency contact details.
          </p>
        </div>
      </div>

      <div className="hc-card hc-card--padded">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group form-group--full">
              <label htmlFor="patient-name">
                Full Name <span className="required-mark">*</span>
              </label>
              <input
                id="patient-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                placeholder="e.g. Aarav Sharma"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="patient-age">
                Age (Years) <span className="required-mark">*</span>
              </label>
              <input
                id="patient-age"
                type="number"
                name="age"
                min="0"
                max="130"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g. 42"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="patient-gender">Gender</label>
              <select
                id="patient-gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="patient-contact">
                Contact Number <span className="required-mark">*</span>
              </label>
              <input
                id="patient-contact"
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                autoComplete="tel"
                placeholder="e.g. +91 9876543210"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="patient-blood">Blood Group</label>
              <input
                id="patient-blood"
                type="text"
                name="bloodGroup"
                list="patient-blood-options"
                value={formData.bloodGroup}
                onChange={handleChange}
                placeholder="e.g. B+"
              />
              <datalist id="patient-blood-options">
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg} />
                ))}
              </datalist>
            </div>

            <div className="form-group form-group--full">
              <label htmlFor="patient-history">Medical History</label>
              <textarea
                id="patient-history"
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                placeholder="Allergies, chronic conditions, active medications..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="patient-em-name">Emergency Contact Name</label>
              <input
                id="patient-em-name"
                type="text"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
                placeholder="Next of kin or guardian"
              />
            </div>

            <div className="form-group">
              <label htmlFor="patient-em-phone">Emergency Contact Number</label>
              <input
                id="patient-em-phone"
                type="tel"
                name="emergencyContactNumber"
                value={formData.emergencyContactNumber}
                onChange={handleChange}
                placeholder="Emergency contact phone"
              />
            </div>
          </div>

          {error && (
            <div role="alert" className="hc-alert hc-alert--danger" style={{ marginTop: "1.25rem" }}>
              <AlertIcon size={18} />
              <span>{error}</span>
            </div>
          )}

          {checkingDuplicate && (
            <p className="field-hint" style={{ color: "var(--color-secondary)", marginTop: "1rem" }}>
              Checking existing records for potential duplicates...
            </p>
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
            <Link to="/patients" className="btn btn-outline">
              Cancel
            </Link>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? "Saving..." : "Save Patient Record"}
            </button>
          </div>
        </form>

        {duplicateWarning && (
          <div
            role="alert"
            className="hc-alert hc-alert--warning"
            style={{ marginTop: "1.5rem", flexDirection: "column", alignItems: "stretch" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700 }}>
              <AlertIcon size={18} />
              <span>Potential Duplicate Patient Records Found</span>
            </div>
            <ul style={{ margin: "0.25rem 0 0", paddingInlineStart: "1.25rem", fontSize: "0.8125rem" }}>
              {duplicateWarning.map((p) => (
                <li key={p.id}>
                  <strong>{p.name}</strong> — Age {p.age ?? "N/A"}, Contact: {p.contactNumber || "N/A"}
                </li>
              ))}
            </ul>
            <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
              <button type="button" onClick={proceedAnyway} className="btn btn-danger btn-sm">
                Add Record Anyway
              </button>
              <button
                type="button"
                onClick={() => setDuplicateWarning(null)}
                className="btn btn-outline btn-sm"
              >
                Cancel &amp; Review
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddPatient;
