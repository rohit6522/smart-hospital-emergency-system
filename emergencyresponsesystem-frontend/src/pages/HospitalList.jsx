import { useEffect, useState } from "react";
import api from "../services/api";

function HospitalList() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [emergencyFilter, setEmergencyFilter] = useState("All");
  const [onlyAvailableIcu, setOnlyAvailableIcu] = useState(false);

  const fetchHospitals = async () => {
    try {
      const response = await api.get("/hospitals");
      setHospitals(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load hospitals. Is the backend running?");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  if (loading) return <p style={{ padding: "20px" }}>Loading hospitals...</p>;
  if (error) return <p style={{ padding: "20px", color: "red" }}>{error}</p>;

  const emergencyTypes = ["All", ...new Set(hospitals.map((h) => h.emergencyType))];

  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEmergency =
      emergencyFilter === "All" || hospital.emergencyType === emergencyFilter;
    const matchesIcu = !onlyAvailableIcu || hospital.availableIcuBeds > 0;
    return matchesSearch && matchesEmergency && matchesIcu;
  });

  const inputStyle = { padding: "10px 12px", fontSize: "14px" };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ marginBottom: "6px" }}>🏥 Hospital List</h1>
      <p style={{ color: "#6c757d", marginTop: 0, marginBottom: "24px" }}>
        Browse all registered hospitals and their real-time resource availability.
      </p>

      {/* Filter Card */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          marginBottom: "20px",
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search by hospital name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ ...inputStyle, minWidth: "220px", flex: 1 }}
        />

        <select
          value={emergencyFilter}
          onChange={(e) => setEmergencyFilter(e.target.value)}
          style={inputStyle}
        >
          {emergencyTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" }}>
          <input
            type="checkbox"
            checked={onlyAvailableIcu}
            onChange={(e) => setOnlyAvailableIcu(e.target.checked)}
          />
          Only ICU beds available
        </label>
      </div>

      <p style={{ color: "#6c757d", fontSize: "13px" }}>
        Showing {filteredHospitals.length} of {hospitals.length} hospitals
      </p>

      {filteredHospitals.length === 0 ? (
        <p>No hospitals match your filters.</p>
      ) : (
        <div style={{ backgroundColor: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <table cellPadding="12" style={{ borderCollapse: "collapse", width: "100%", fontSize: "14px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #e0e0e0" }}>
                <th>ID</th>
                <th>Name</th>
                <th>Address</th>
                <th>ICU Beds</th>
                <th>Blood Bank</th>
                <th>Doctors</th>
                <th>Emergency Type</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {filteredHospitals.map((hospital, i) => (
                <tr
                  key={hospital.id}
                  style={{ borderBottom: "1px solid #f0f0f0", backgroundColor: i % 2 === 0 ? "white" : "#fafafa" }}
                >
                  <td>{hospital.id}</td>
                  <td style={{ fontWeight: "600" }}>{hospital.name}</td>
                  <td>{hospital.address}</td>
                  <td>
                    <b>{hospital.availableIcuBeds}</b> / {hospital.totalIcuBeds}
                  </td>
                  <td>{hospital.bloodBankAvailable ? "✅" : "❌"}</td>
                  <td>{hospital.availableDoctors}</td>
                  <td>
                    <span
                      style={{
                        backgroundColor: "#e8f4f8",
                        color: "#457b9d",
                        padding: "3px 10px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      {hospital.emergencyType}
                    </span>
                  </td>
                  <td>{hospital.contactNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HospitalList;