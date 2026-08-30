import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import api from "../services/api";
import { requestNotificationPermission, listenForMessages } from "../firebase";

const AVERAGE_AMBULANCE_SPEED_KMH = 40;
const OSRM_BASE_URL = "https://router.project-osrm.org/route/v1/driving";

function RequestEmergency() {
  const [searchParams] = useSearchParams();
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [emergencyType, setEmergencyType] = useState("Trauma");
    const [symptoms, setSymptoms] = useState("");
  const [severityResult, setSeverityResult] = useState(null);
  const [classifying, setClassifying] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [etaSeconds, setEtaSeconds] = useState(null);
    const [routeCoordinates, setRouteCoordinates] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null); // { distanceKm, durationMin }
  const timerRef = useRef(null);

  useEffect(() => {
    requestNotificationPermission();
    listenForMessages();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (etaSeconds === null) return;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setEtaSeconds((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [etaSeconds === null]);

  // Logs an EmergencyRequest record for analytics, and auto-marks it completed
  // after a short demo delay so the dashboard has response-time data to show.
  const logEmergencyRequestForAnalytics = async (bestResult) => {
    try {
      const created = await api.post("/emergency-requests", {
        hospitalId: bestResult.hospital.id,
        emergencyType: emergencyType,
        pickupLatitude: parseFloat(latitude),
        pickupLongitude: parseFloat(longitude),
        status: "REQUESTED",
      });

      const etaMs = Math.max(1, (bestResult.distanceInKm / AVERAGE_AMBULANCE_SPEED_KMH) * 60) * 60 * 1000;
      const demoDelay = Math.min(etaMs, 15000); // capped at 15s so analytics data appears quickly for demo

      setTimeout(() => {
        api.put(`/emergency-requests/${created.data.id}/complete`).catch(() => {});
      }, demoDelay);
    } catch (err) {
      console.log("Could not log emergency request for analytics", err);
    }
  };

    const fetchRoadRoute = async (lat1, lon1, lat2, lon2) => {
    try {
      const url = `${OSRM_BASE_URL}/${lon1},${lat1};${lon2},${lat2}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.code !== "Ok" || !data.routes || data.routes.length === 0) return null;

      const route = data.routes[0];
      // OSRM returns [lon, lat] pairs; Leaflet needs [lat, lon]
      const coordinates = route.geometry.coordinates.map(([lon, lat]) => [lat, lon]);

      return {
        coordinates,
        distanceKm: route.distance / 1000,
        durationMin: route.duration / 60,
      };
    } catch (err) {
      console.log("OSRM routing failed, falling back to straight-line", err);
      return null;
    }
  };

  const runSearch = async (lat, lon, type) => {
    setError(null);
    setLoading(true);
    setSearched(true);
    setEtaSeconds(null);

    try {
      const response = await api.get("/hospitals/nearest", {
        params: { latitude: parseFloat(lat), longitude: parseFloat(lon), emergencyType: type },
      });
      setResults(response.data);

           if (response.data.length > 0) {
        const best = response.data[0];

        // Try to get a real road route from OSRM; fall back to straight-line ETA if it fails
        const roadRoute = await fetchRoadRoute(lat, lon, best.hospital.latitude, best.hospital.longitude);

        if (roadRoute) {
          setRouteCoordinates(roadRoute.coordinates);
          setRouteInfo({ distanceKm: roadRoute.distanceKm, durationMin: roadRoute.durationMin });
          setEtaSeconds(Math.round(roadRoute.durationMin * 60));
        } else {
          setRouteCoordinates(null);
          setRouteInfo(null);
          const etaMinutes = Math.max(1, (best.distanceInKm / AVERAGE_AMBULANCE_SPEED_KMH) * 60);
          setEtaSeconds(Math.round(etaMinutes * 60));
        }

        if (Notification.permission === "granted") {
          new Notification("🚨 Emergency Request Submitted", {
            body: `Best match: ${best.hospital.name}`,
            icon: "/vite.svg",
          });
        }

        await logEmergencyRequestForAnalytics(best);
      }
    } catch (err) {
      setError("Failed to find hospitals. Please check your inputs and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-trigger search if arriving from the SOS button with lat/lon/type in the URL
  useEffect(() => {
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const type = searchParams.get("type");
    const auto = searchParams.get("auto");

    if (auto === "true" && lat && lon) {
      setLatitude(lat);
      setLongitude(lon);
      setEmergencyType(type || "General");
      runSearch(lat, lon, type || "General");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      const classifySeverity = async () => {
    if (!symptoms.trim()) return;
    setClassifying(true);
    try {
      const response = await api.post("/ai/classify-severity", { symptoms });
      setSeverityResult(response.data);
      if (response.data.severity === "CRITICAL") {
        setEmergencyType("Trauma");
      }
    } catch (err) {
      console.log("Severity classification failed", err);
    } finally {
      setClassifying(false);
    }
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    await runSearch(latitude, longitude, emergencyType);
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const patientLat = parseFloat(latitude);
  const patientLon = parseFloat(longitude);
  const hasValidPatientLocation = !isNaN(patientLat) && !isNaN(patientLon);
  const bestHospital = results.length > 0 ? results[0] : null;

  const inputStyle = {
    width: "100%",
    padding: "11px 14px",
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
    <div className="responsive-container" style={{ maxWidth: "1000px", margin: "0 auto", padding: "50px 20px" }}>
      <div className="animate-fade-up" style={{ textAlign: "center", marginBottom: "34px" }}>
        <h1 className="hero-title" style={{ color: "#e63946", marginBottom: "8px", fontWeight: "800" }}>🚨 Request Emergency</h1>
        <p style={{ color: "#6c757d" }}>
          Enter your location and emergency type to find the best-suited hospital near you.
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="glass-card animate-fade-up"
        style={{
          padding: "34px",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <button
            type="button"
            onClick={detectLocation}
            style={{
              padding: "11px 20px",
              background: "linear-gradient(135deg, #457b9d, #2d5a7a)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              width: "100%",
              maxWidth: "260px",
            }}
          >
            📍 Use My Current Location
          </button>
        </div>

        <div className="form-row" style={{ display: "flex", gap: "15px", marginBottom: "18px" }}>
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
          <label style={labelStyle}>🤖 Describe Symptoms (AI Severity Check)</label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            onBlur={classifySeverity}
            placeholder="e.g. severe chest pain, difficulty breathing..."
            rows="2"
            style={{ ...inputStyle, resize: "vertical" }}
          />
          {classifying && <p style={{ fontSize: "12px", color: "#457b9d", marginTop: "4px" }}>Analyzing symptoms...</p>}
          {severityResult && severityResult.severity !== "UNKNOWN" && (
            <div
              style={{
                marginTop: "8px",
                padding: "10px 14px",
                borderRadius: "8px",
                fontSize: "13px",
                background:
                  severityResult.severity === "CRITICAL" ? "rgba(230,57,70,0.1)" :
                  severityResult.severity === "MODERATE" ? "rgba(233,196,106,0.15)" : "rgba(42,157,143,0.1)",
                color:
                  severityResult.severity === "CRITICAL" ? "#e63946" :
                  severityResult.severity === "MODERATE" ? "#c78a1e" : "#2a9d8f",
                fontWeight: "600",
              }}
            >
              🎯 AI Severity: {severityResult.severity} — {severityResult.recommendation}
            </div>
          )}
        </div>

        <div style={{ marginBottom: "24px" }}>
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
            <option value="Neuro">Neuro (Stroke/Brain)</option>
            <option value="Burns">Burns</option>
            <option value="Poisoning">Poisoning</option>
            <option value="Maternity">Maternity/Obstetric</option>
            <option value="Respiratory">Respiratory</option>
            <option value="General">General</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "15px",
            background: "linear-gradient(135deg, #e63946, #c1121f)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 8px 20px rgba(230, 57, 70, 0.35)",
          }}
        >
          Find Nearest Hospital
        </button>
      </form>

      {loading && (
        <p className="animate-fade" style={{ marginTop: "20px", textAlign: "center", color: "#457b9d", fontWeight: "600" }}>
          🔍 Searching for hospitals...
        </p>
      )}
      {error && (
        <p className="animate-fade" style={{ marginTop: "20px", color: "#e63946", textAlign: "center" }}>{error}</p>
      )}

      {!loading && searched && results.length === 0 && !error && (
        <p style={{ marginTop: "20px", textAlign: "center" }}>No hospitals found in the system yet.</p>
      )}

      {/* ETA COUNTDOWN CARD */}
      {bestHospital && etaSeconds !== null && (
        <div
          className="glass-card animate-fade-up"
          style={{
            marginTop: "30px",
            padding: "24px 30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            background: "linear-gradient(135deg, rgba(230,57,70,0.08), rgba(230,57,70,0.02))",
            border: "1px solid rgba(230,57,70,0.2)",
          }}
        >
          <div>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#e63946", letterSpacing: "0.5px", textTransform: "uppercase" }}>
              🚑 Estimated Ambulance Arrival
            </div>
                       <div style={{ fontSize: "13px", color: "#6c757d", marginTop: "4px" }}>
              To {bestHospital.hospital.name} · {routeInfo ? `${routeInfo.distanceKm.toFixed(1)} km road distance` : `${bestHospital.distanceInKm.toFixed(1)} km (straight-line)`}
            </div>
          </div>
          <div
            style={{
              fontSize: "36px",
              fontWeight: "800",
              color: etaSeconds <= 0 ? "#2a9d8f" : "#e63946",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "1px",
            }}
          >
            {etaSeconds <= 0 ? "Arrived 🎉" : formatTime(etaSeconds)}
          </div>
        </div>
      )}

      {/* MAP SECTION */}
      {hasValidPatientLocation && results.length > 0 && (
        <div className="animate-fade-up" style={{ marginTop: "34px" }}>
          <h2 style={{ fontSize: "20px" }}>Map View</h2>
          <div
            className="glass-card map-container"
            style={{
              height: "450px",
              width: "100%",
              overflow: "hidden",
              padding: 0,
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

                           {routeCoordinates ? (
                <Polyline
                  positions={routeCoordinates}
                  color="#e63946"
                  weight={5}
                  opacity={0.85}
                />
              ) : (
                bestHospital && (
                  <Polyline
                    positions={[
                      [patientLat, patientLon],
                      [bestHospital.hospital.latitude, bestHospital.hospital.longitude],
                    ]}
                    color="#e63946"
                    weight={4}
                    dashArray="8"
                  />
                )
              )}
            </MapContainer>
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div style={{ marginTop: "34px" }}>
          <h2 style={{ fontSize: "20px" }}>Recommended Hospitals</h2>
          {results.map((rec, index) => (
            <div
              key={rec.hospital.id}
              className={`glass-card animate-fade-up stagger-${Math.min(index + 1, 6)}`}
              style={{
                padding: "22px",
                marginBottom: "16px",
                border: index === 0 ? "1.5px solid rgba(42,157,143,0.5)" : undefined,
                background: index === 0 ? "rgba(240, 253, 249, 0.75)" : undefined,
              }}
            >
              {index === 0 && (
                <span
                  style={{
                    background: "linear-gradient(135deg, #2a9d8f, #21867a)",
                    color: "white",
                    padding: "4px 14px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: "700",
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
                  marginTop: "14px",
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