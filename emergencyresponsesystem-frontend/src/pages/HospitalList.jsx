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

  // Unique emergency types for filter dropdown
  const emergencyTypes = ["All", ...new Set(hospitals.map((h) => h.emergencyType))];

  // Apply search + filters
  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEmergency =
      emergencyFilter === "All" || hospital.emergencyType === emergencyFilter;
    const matchesIcu = !onlyAvailableIcu || hospital.availableIcuBeds > 0;

    return matchesSearch && matchesEmergency && matchesIcu;
  });

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>🏥 Hospital List</h1>

      {/* Filters */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search by hospital name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "8px", minWidth: "220px" }}
        />

        <select
          value={emergencyFilter}
          onChange={(e) => setEmergencyFilter(e.target.value)}
          style={{ padding: "8px" }}
        >
          {emergencyTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <input
            type="checkbox"
            checked={onlyAvailableIcu}
            onChange={(e) => setOnlyAvailableIcu(e.target.checked)}
          />
          Only show hospitals with ICU beds available
        </label>
      </div>

      <p style={{ color: "#666", fontSize: "14px" }}>
        Showing {filteredHospitals.length} of {hospitals.length} hospitals
      </p>

      {filteredHospitals.length === 0 ? (
        <p>No hospitals match your filters.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th>ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>ICU Beds (Available/Total)</th>
              <th>Blood Bank</th>
              <th>Doctors</th>
              <th>Emergency Type</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {filteredHospitals.map((hospital) => (
              <tr key={hospital.id}>
                <td>{hospital.id}</td>
                <td>{hospital.name}</td>
                <td>{hospital.address}</td>
                <td>
                  {hospital.availableIcuBeds} / {hospital.totalIcuBeds}
                </td>
                <td>{hospital.bloodBankAvailable ? "✅ Yes" : "❌ No"}</td>
                <td>{hospital.availableDoctors}</td>
                <td>{hospital.emergencyType}</td>
                <td>{hospital.contactNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default HospitalList;