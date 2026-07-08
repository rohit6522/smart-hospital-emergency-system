import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPatients = async () => {
    try {
      const response = await api.get("/patients");
      setPatients(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load patients. Is the backend running?");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient record?")) return;
    try {
      await api.delete(`/patients/${id}`);
      setPatients(patients.filter((p) => p.id !== id));
    } catch (err) {
      alert("Failed to delete patient.");
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading patients...</p>;
  if (error) return <p style={{ padding: "20px", color: "red" }}>{error}</p>;

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
        <h1 style={{ margin: 0 }}>🧑‍⚕️ Patient Records</h1>
        <Link to="/patients/add">
          <button
            style={{
              padding: "12px 22px",
              backgroundColor: "#2a9d8f",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              boxShadow: "0 2px 8px rgba(42, 157, 143, 0.3)",
            }}
          >
            + Add New Patient
          </button>
        </Link>
      </div>
      <p style={{ color: "#6c757d", marginTop: 0, marginBottom: "24px" }}>
        Manage digital patient medical history for faster emergency treatment.
      </p>

      <input
        type="text"
        placeholder="🔍 Search by patient name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "10px 12px", minWidth: "260px", marginBottom: "20px", fontSize: "14px" }}
      />

      {filteredPatients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <div style={{ backgroundColor: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <table cellPadding="12" style={{ borderCollapse: "collapse", width: "100%", fontSize: "14px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #e0e0e0" }}>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Blood Group</th>
                <th>Contact</th>
                <th>Medical History</th>
                <th>Emergency Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient, i) => (
                <tr
                  key={patient.id}
                  style={{ borderBottom: "1px solid #f0f0f0", backgroundColor: i % 2 === 0 ? "white" : "#fafafa" }}
                >
                  <td>{patient.id}</td>
                  <td style={{ fontWeight: "600" }}>{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>{patient.gender}</td>
                  <td>
                    <span style={{ backgroundColor: "#fde8e8", color: "#e63946", padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>
                      {patient.bloodGroup}
                    </span>
                  </td>
                  <td>{patient.contactNumber}</td>
                  <td style={{ maxWidth: "200px", fontSize: "13px", color: "#666" }}>{patient.medicalHistory}</td>
                  <td style={{ fontSize: "13px" }}>
                    {patient.emergencyContactName}
                    <br />
                    {patient.emergencyContactNumber}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(patient.id)}
                      style={{
                        padding: "6px 14px",
                        backgroundColor: "#e63946",
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PatientList;