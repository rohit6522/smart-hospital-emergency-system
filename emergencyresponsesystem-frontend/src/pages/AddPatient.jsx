import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.post("/patients", {
        ...formData,
        age: parseInt(formData.age),
      });
      navigate("/patients");
    } catch (err) {
      setError("Failed to add patient. Please check the form and try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="responsive-container" style={{ padding: "40px", fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <h1>➕ Add New Patient</h1>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <div style={{ marginBottom: "15px" }}>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

       <div className="form-row" style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>

          <div style={{ flex: 1 }}>
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-row" style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
          <div style={{ flex: 1 }}>
            <label>Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Blood Group</label>
            <input
              type="text"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              placeholder="e.g. B+"
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Medical History</label>
          <textarea
            name="medicalHistory"
            value={formData.medicalHistory}
            onChange={handleChange}
            placeholder="Allergies, past conditions, medications..."
            rows="4"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

       <div className="form-row" style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
          <div style={{ flex: 1 }}>
            <label>Emergency Contact Name</label>
            <input
              type="text"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Emergency Contact Number</label>
            <input
              type="text"
              name="emergencyContactNumber"
              value={formData.emergencyContactNumber}
              onChange={handleChange}
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
          {submitting ? "Saving..." : "Save Patient"}
        </button>
      </form>
    </div>
  );
}

export default AddPatient;