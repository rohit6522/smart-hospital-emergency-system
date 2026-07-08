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
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>🧑‍⚕️ Patient Records</h1>
        <Link to="/patients/add">
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
            + Add New Patient
          </button>
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search by patient name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "8px", minWidth: "250px", marginBottom: "20px" }}
      />

      {filteredPatients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
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
            {filteredPatients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>{patient.name}</td>
                <td>{patient.age}</td>
                <td>{patient.gender}</td>
                <td>{patient.bloodGroup}</td>
                <td>{patient.contactNumber}</td>
                <td style={{ maxWidth: "200px" }}>{patient.medicalHistory}</td>
                <td>
                  {patient.emergencyContactName} ({patient.emergencyContactNumber})
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(patient.id)}
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

export default PatientList;