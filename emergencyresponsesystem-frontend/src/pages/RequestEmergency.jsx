import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import api from "../services/api";

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

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif", maxWidth: "1000px", margin: "0 auto" }}>
      <h1>🚨 Request Emergency</h1>
      <p style={{ color: "#555" }}>
        Enter your location and emergency type to find the best-suited hospital near you.
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: "25px" }}>
        <div style={{ marginBottom: "15px" }}>
          <button
            type="button"
            onClick={detectLocation}
            style={{
              padding: "10px 16px",
              backgroundColor: "#2a9d8f",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            📍 Use My Current Location
          </button>
        </div>

        <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
          <div style={{ flex: 1 }}>
            <label>Latitude</label>
            <input
              type="text"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="e.g. 25.5941"
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Longitude</label>
            <input
              type="text"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="e.g. 85.1376"
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Emergency Type</label>
          <select
            value={emergencyType}
            onChange={(e) => setEmergencyType(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
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
            padding: "12px 24px",
            backgroundColor: "#e63946",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Find Nearest Hospital
        </button>
      </form>

      {loading && <p style={{ marginTop: "20px" }}>Searching for hospitals...</p>}
      {error && <p style={{ marginTop: "20px", color: "red" }}>{error}</p>}

      {!loading && searched && results.length === 0 && !error && (
        <p style={{ marginTop: "20px" }}>No hospitals found in the system yet.</p>
      )}

      {/* MAP SECTION */}
      {hasValidPatientLocation && results.length > 0 && (
        <div style={{ marginTop: "30px", marginBottom: "30px" }}>
          <h2>Map View</h2>
          <div style={{ height: "450px", width: "100%", borderRadius: "8px", overflow: "hidden" }}>
            <MapContainer
              center={[patientLat, patientLon]}
              zoom={12}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Patient marker */}
              <Marker position={[patientLat, patientLon]}>
                <Popup>📍 Your Location</Popup>
              </Marker>

              {/* Hospital markers */}
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

              {/* Route line to best hospital */}
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

      {results.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h2>Recommended Hospitals</h2>
          {results.map((rec, index) => (
            <div
              key={rec.hospital.id}
              style={{
                border: index === 0 ? "2px solid #2a9d8f" : "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "15px",
                backgroundColor: index === 0 ? "#f0fdf9" : "#fff",
              }}
            >
              {index === 0 && (
                <span style={{ background: "#2a9d8f", color: "white", padding: "3px 10px", borderRadius: "4px", fontSize: "12px" }}>
                  BEST MATCH
                </span>
              )}
              <h3 style={{ margin: "10px 0 5px" }}>{rec.hospital.name}</h3>
              <p style={{ margin: "3px 0", color: "#555" }}>{rec.hospital.address}</p>
              <p style={{ margin: "3px 0" }}>📏 Distance: {rec.distanceInKm.toFixed(2)} km</p>
              <p style={{ margin: "3px 0" }}>
                🛏️ ICU Beds: {rec.hospital.availableIcuBeds} / {rec.hospital.totalIcuBeds}
              </p>
              <p style={{ margin: "3px 0" }}>
                🩸 Blood Bank: {rec.hospital.bloodBankAvailable ? "Available" : "Not Available"}
              </p>
              <p style={{ margin: "3px 0" }}>👨‍⚕️ Doctors Available: {rec.hospital.availableDoctors}</p>
              <p style={{ margin: "3px 0" }}>📞 Contact: {rec.hospital.contactNumber}</p>
              <p style={{ margin: "3px 0", fontSize: "13px", color: "#888" }}>
                Suitability Score: {rec.suitabilityScore.toFixed(1)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RequestEmergency;