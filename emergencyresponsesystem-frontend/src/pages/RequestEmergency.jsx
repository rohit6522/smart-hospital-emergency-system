import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import api from "../services/api";
import { requestNotificationPermission, listenForMessages } from "../firebase";


function RequestEmergency() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [emergencyType, setEmergencyType] = useState("Trauma");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
      },
      () => {
        setError("Unable to detect location. Please enter manually.");
      }
    );


  };

  useEffect(() => {
    requestNotificationPermission();
    listenForMessages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSearched(true);

    try {
      const response = await api.get("/hospitals/nearest", {
        params: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          emergencyType: emergencyType,
        },
      });
      setResults(response.data);

      // Trigger local notification
      if (Notification.permission === "granted") {
        new Notification("🚨 Emergency Request Submitted", {
          body: `Best match: ${response.data[0]?.hospital.name || "Searching..."}`,
          icon: "/vite.svg",
        });
      }


    } catch (err) {
      setError("Failed to find hospitals. Please check your inputs and try again.");
    } finally {
      setLoading(false);
    }
  };

  const patientLat = parseFloat(latitude);
  const patientLon = parseFloat(longitude);
  const hasValidPatientLocation = !isNaN(patientLat) && !isNaN(patientLon);
  const bestHospital = results.length > 0 ? results[0] : null;

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    marginTop: "6px",
    fontSize: "14px",
  };

  const labelStyle = {
    fontSize: "13px",
    fontWeight: "600",
    color: "#444",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#e63946", marginBottom: "8px" }}>🚨 Request Emergency</h1>
        <p style={{ color: "#6c757d" }}>
          Enter your location and emergency type to find the best-suited hospital near you.
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ marginBottom: "18px" }}>
          <button
            type="button"
            onClick={detectLocation}
            style={{
              padding: "10px 18px",
              backgroundColor: "#457b9d",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            📍 Use My Current Location
          </button>
        </div>

        <div style={{ display: "flex", gap: "15px", marginBottom: "18px" }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Latitude</label>
            <input
              type="text"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="e.g. 25.5941"
              required
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Longitude</label>
            <input
              type="text"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="e.g. 85.1376"
              required
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ marginBottom: "22px" }}>
          <label style={labelStyle}>Emergency Type</label>
          <select
            value={emergencyType}
            onChange={(e) => setEmergencyType(e.target.value)}
            style={inputStyle}
          >
            <option value="Trauma">Trauma</option>
            <option value="Cardiac">Cardiac</option>
            <option value="Accident">Accident</option>
            <option value="Pediatric">Pediatric</option>
            <option value="General">General</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: "#e63946",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(230, 57, 70, 0.3)",
          }}
        >
          Find Nearest Hospital
        </button>
      </form>

      {loading && (
        <p style={{ marginTop: "20px", textAlign: "center", color: "#457b9d" }}>
          🔍 Searching for hospitals...
        </p>
      )}
      {error && (
        <p style={{ marginTop: "20px", color: "#e63946", textAlign: "center" }}>{error}</p>
      )}

      {!loading && searched && results.length === 0 && !error && (
        <p style={{ marginTop: "20px", textAlign: "center" }}>No hospitals found in the system yet.</p>
      )}

      {/* MAP SECTION */}
      {hasValidPatientLocation && results.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h2 style={{ fontSize: "20px" }}>Map View</h2>
          <div
            style={{
              height: "450px",
              width: "100%",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
            }}
          >
            <MapContainer
              center={[patientLat, patientLon]}
              zoom={12}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={[patientLat, patientLon]}>
                <Popup>📍 Your Location</Popup>
              </Marker>

              {results.map((rec) => (
                <Marker
                  key={rec.hospital.id}
                  position={[rec.hospital.latitude, rec.hospital.longitude]}
                >
                  <Popup>
                    <strong>{rec.hospital.name}</strong>
                    <br />
                    Distance: {rec.distanceInKm.toFixed(2)} km
                    <br />
                    ICU Beds: {rec.hospital.availableIcuBeds}/{rec.hospital.totalIcuBeds}
                  </Popup>
                </Marker>
              ))}

              {bestHospital && (
                <Polyline
                  positions={[
                    [patientLat, patientLon],
                    [bestHospital.hospital.latitude, bestHospital.hospital.longitude],
                  ]}
                  color="#e63946"
                  weight={4}
                  dashArray="8"
                />
              )}
            </MapContainer>
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h2 style={{ fontSize: "20px" }}>Recommended Hospitals</h2>
          {results.map((rec, index) => (
            <div
              key={rec.hospital.id}
              style={{
                border: index === 0 ? "2px solid #2a9d8f" : "1px solid #e0e0e0",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "15px",
                backgroundColor: index === 0 ? "#f0fdf9" : "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              {index === 0 && (
                <span
                  style={{
                    background: "#2a9d8f",
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  ⭐ BEST MATCH
                </span>
              )}
              <h3 style={{ margin: "12px 0 6px" }}>{rec.hospital.name}</h3>
              <p style={{ margin: "3px 0", color: "#555" }}>{rec.hospital.address}</p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "8px",
                  marginTop: "12px",
                  fontSize: "14px",
                }}
              >
                <p style={{ margin: 0 }}>📏 Distance: <b>{rec.distanceInKm.toFixed(2)} km</b></p>
                <p style={{ margin: 0 }}>
                  🛏️ ICU: <b>{rec.hospital.availableIcuBeds}/{rec.hospital.totalIcuBeds}</b>
                </p>
                <p style={{ margin: 0 }}>
                  🩸 Blood Bank: <b>{rec.hospital.bloodBankAvailable ? "Available" : "N/A"}</b>
                </p>
                <p style={{ margin: 0 }}>👨‍⚕️ Doctors: <b>{rec.hospital.availableDoctors}</b></p>
                <p style={{ margin: 0 }}>📞 {rec.hospital.contactNumber}</p>
                <p style={{ margin: 0, color: "#888" }}>
                  Score: {rec.suitabilityScore.toFixed(1)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RequestEmergency;