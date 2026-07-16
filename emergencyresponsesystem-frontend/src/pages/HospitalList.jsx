import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function HospitalList() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAdmin } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [emergencyFilter, setEmergencyFilter] = useState("All");
  const [onlyAvailableIcu, setOnlyAvailableIcu] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hospital?")) return;
    try {
      await api.delete(`/hospitals/${id}`);
      setHospitals(hospitals.filter((h) => h.id !== id));
    } catch (err) {
      alert("Failed to delete hospital.");
    }
  };

  const startEdit = (hospital) => {
    setEditingId(hospital.id);
    setEditForm({ ...hospital });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleEditChange = (field, value) => {
    setEditForm({ ...editForm, [field]: value });
  };

  const saveEdit = async (id) => {
    try {
      const updated = {
        ...editForm,
        totalIcuBeds: parseInt(editForm.totalIcuBeds),
        availableIcuBeds: parseInt(editForm.availableIcuBeds),
        availableDoctors: parseInt(editForm.availableDoctors),
      };
      const response = await api.put(`/hospitals/${id}`, updated);
      setHospitals(hospitals.map((h) => (h.id === id ? response.data : h)));
      setEditingId(null);
    } catch (err) {
      alert("Failed to update hospital.");
    }
  };

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
  const editInputStyle = { padding: "6px 8px", fontSize: "13px", width: "100%", minWidth: "80px" };

  return (
    <div className="responsive-container" style={{ maxWidth: "1300px", margin: "0 auto", padding: "50px 20px" }}>
      <h1 className="animate-fade-up" style={{ marginBottom: "6px" }}>🏥 Hospital List</h1>
      <p className="animate-fade-up" style={{ color: "#6c757d", marginTop: 0, marginBottom: "24px" }}>
        Browse all registered hospitals and their real-time resource availability.
        {isAdmin && " Click 'Edit' to update live availability."}
      </p>

      {/* Filter Card */}
      <div
        className="glass-card form-row animate-fade-up"
        style={{
          padding: "20px",
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
        <div className="glass-card table-wrapper animate-fade-up" style={{ overflow: "hidden" }}>
          <table cellPadding="12" style={{ borderCollapse: "collapse", width: "100%", fontSize: "14px" }}>
            <thead>
              <tr style={{ backgroundColor: "rgba(255,255,255,0.4)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                <th>ID</th>
                <th>Name</th>
                <th>Address</th>
                <th>ICU Beds</th>
                <th>Blood Bank</th>
                <th>Doctors</th>
                <th>Emergency Type</th>
                <th>Contact</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredHospitals.map((hospital, i) => {
                const isEditing = editingId === hospital.id;
                return (
                  <tr
                    key={hospital.id}
                    style={{
                      borderBottom: "1px solid rgba(0,0,0,0.05)",
                      backgroundColor: isEditing ? "rgba(255,251,234,0.6)" : i % 2 === 0 ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.05)",
                    }}
                  >
                    <td>{hospital.id}</td>

                    {isEditing ? (
                      <>
                        <td><input style={editInputStyle} value={editForm.name} onChange={(e) => handleEditChange("name", e.target.value)} /></td>
                        <td><input style={editInputStyle} value={editForm.address} onChange={(e) => handleEditChange("address", e.target.value)} /></td>
                        <td style={{ display: "flex", gap: "4px" }}>
                          <input style={{ ...editInputStyle, width: "45px" }} type="number" value={editForm.availableIcuBeds} onChange={(e) => handleEditChange("availableIcuBeds", e.target.value)} />
                          /
                          <input style={{ ...editInputStyle, width: "45px" }} type="number" value={editForm.totalIcuBeds} onChange={(e) => handleEditChange("totalIcuBeds", e.target.value)} />
                        </td>
                        <td>
                          <select style={editInputStyle} value={editForm.bloodBankAvailable} onChange={(e) => handleEditChange("bloodBankAvailable", e.target.value === "true")}>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                        </td>
                        <td><input style={{ ...editInputStyle, width: "60px" }} type="number" value={editForm.availableDoctors} onChange={(e) => handleEditChange("availableDoctors", e.target.value)} /></td>
                        <td>
                          <select style={editInputStyle} value={editForm.emergencyType} onChange={(e) => handleEditChange("emergencyType", e.target.value)}>
                            <option value="Trauma">Trauma</option>
                            <option value="Cardiac">Cardiac</option>
                            <option value="Accident">Accident</option>
                            <option value="Pediatric">Pediatric</option>
                            <option value="General">General</option>
                          </select>
                        </td>
                        <td><input style={editInputStyle} value={editForm.contactNumber} onChange={(e) => handleEditChange("contactNumber", e.target.value)} /></td>
                        <td style={{ display: "flex", gap: "6px" }}>
                          <button onClick={() => saveEdit(hospital.id)} style={{ padding: "6px 10px", background: "linear-gradient(135deg, #2a9d8f, #21867a)", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>Save</button>
                          <button onClick={cancelEdit} style={{ padding: "6px 10px", backgroundColor: "#999", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ fontWeight: "600" }}>{hospital.name}</td>
                        <td>{hospital.address}</td>
                        <td><b>{hospital.availableIcuBeds}</b> / {hospital.totalIcuBeds}</td>
                        <td>{hospital.bloodBankAvailable ? "✅" : "❌"}</td>
                        <td>{hospital.availableDoctors}</td>
                        <td>
                          <span style={{ background: "rgba(69,123,157,0.15)", color: "#457b9d", padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>
                            {hospital.emergencyType}
                          </span>
                        </td>
                        <td>{hospital.contactNumber}</td>
                        {isAdmin && (
                          <td style={{ display: "flex", gap: "6px" }}>
                            <button onClick={() => startEdit(hospital)} style={{ padding: "6px 12px", background: "linear-gradient(135deg, #457b9d, #2d5a7a)", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>Edit</button>
                            <button onClick={() => handleDelete(hospital.id)} style={{ padding: "6px 12px", background: "linear-gradient(135deg, #e63946, #c1121f)", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>Delete</button>
                          </td>
                        )}
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HospitalList;