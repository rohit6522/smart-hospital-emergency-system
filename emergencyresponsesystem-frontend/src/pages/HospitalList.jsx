import { useEffect, useState } from "react";
import api from "../services/api";

function HospitalList() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>🏥 Hospital List</h1>
      {hospitals.length === 0 ? (
        <p>No hospitals found. Add some via Postman first.</p>
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
            {hospitals.map((hospital) => (
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