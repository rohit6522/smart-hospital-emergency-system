import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import api from "../services/api";
import { requestNotificationPermission, listenForMessages } from "../firebase";
import {
  ActivityIcon,
  AlertIcon,
  AmbulanceIcon,
  BedIcon,
  ClockIcon,
  DropletIcon,
  EmergencyIcon,
  MapPinIcon,
  PhoneIcon,
  RefreshIcon,
  SearchIcon,
  StethoscopeIcon,
} from "../components/Icons";

const AVERAGE_AMBULANCE_SPEED_KMH = 40;
const OSRM_BASE_URL = "https://router.project-osrm.org/route/v1/driving";

function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && !Number.isNaN(center[0]) && !Number.isNaN(center[1])) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

function RequestEmergency() {
  const [searchParams] = useSearchParams();
  const [latitude, setLatitude] = useState(() => searchParams.get("lat") || "");
  const [longitude, setLongitude] = useState(() => searchParams.get("lon") || "");
  const [emergencyType, setEmergencyType] = useState(() => searchParams.get("type") || "Trauma");
  const [symptoms, setSymptoms] = useState("");
  const [placeQuery, setPlaceQuery] = useState("");
  const [placeSuggestions, setPlaceSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchingPlace, setSearchingPlace] = useState(false);
  const debounceRef = useRef(null);
  const [severityResult, setSeverityResult] = useState(null);
  const [classifying, setClassifying] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [etaSeconds, setEtaSeconds] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const timerRef = useRef(null);
  const [dispatchedAmbulance, setDispatchedAmbulance] = useState(null);

  useEffect(() => {
    requestNotificationPermission();
    listenForMessages();
  }, []);

  const hasEta = etaSeconds !== null;

  useEffect(() => {
    if (!hasEta) return;
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
  }, [hasEta]);

  const logEmergencyRequestForAnalytics = useCallback(async (bestResult, lat, lon, type) => {
    try {
      const created = await api.post("/emergency-requests", {
        hospitalId: bestResult.hospital.id,
        emergencyType: type,
        pickupLatitude: parseFloat(lat),
        pickupLongitude: parseFloat(lon),
        status: "REQUESTED",
      });

      try {
        const dispatchRes = await api.post("/ambulances/auto-dispatch", null, {
          params: {
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
            hospitalId: bestResult.hospital.id,
          },
        });
        if (dispatchRes.data) {
          setDispatchedAmbulance(dispatchRes.data);
        }
      } catch {
        // Auto-dispatch fallback when no idle ambulance is available
      }

      const etaMs = Math.max(1, (bestResult.distanceInKm / AVERAGE_AMBULANCE_SPEED_KMH) * 60) * 60 * 1000;
      const demoDelay = Math.min(etaMs, 15000);

      setTimeout(() => {
        api.put(`/emergency-requests/${created.data.id}/complete`).catch(() => {});
      }, demoDelay);
    } catch {
      // Non-blocking analytics logging
    }
  }, []);

  const fetchRoadRoute = async (lat1, lon1, lat2, lon2) => {
    try {
      const url = `${OSRM_BASE_URL}/${lon1},${lat1};${lon2},${lat2}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.code !== "Ok" || !data.routes || data.routes.length === 0) return null;

      const route = data.routes[0];
      const coordinates = route.geometry.coordinates.map(([lon, lat]) => [lat, lon]);

      return {
        coordinates,
        distanceKm: route.distance / 1000,
        durationMin: route.duration / 60,
      };
    } catch {
      return null;
    }
  };

  const runSearch = useCallback(
    async (lat, lon, type) => {
      setError(null);
      setLoading(true);
      setSearched(true);
      setEtaSeconds(null);
      setDispatchedAmbulance(null);

      try {
        const response = await api.get("/hospitals/nearest", {
          params: { latitude: parseFloat(lat), longitude: parseFloat(lon), emergencyType: type },
        });
        setResults(response.data);

        if (response.data.length > 0) {
          const best = response.data[0];
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

          if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            new Notification("Emergency Request Submitted", {
              body: `Best match: ${best.hospital.name}`,
              icon: "/vite.svg",
            });
          }

          await logEmergencyRequestForAnalytics(best, lat, lon, type);
        }
      } catch {
        setError("Failed to find matching hospitals. Please check your coordinates and try again.");
      } finally {
        setLoading(false);
      }
    },
    [logEmergencyRequestForAnalytics]
  );

  // Auto-trigger search if arriving from SOS button
  const autoTriggeredRef = useRef(false);
  useEffect(() => {
    if (autoTriggeredRef.current) return;
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const type = searchParams.get("type");
    const auto = searchParams.get("auto");

    if (auto === "true" && lat && lon) {
      const timer = setTimeout(() => {
        autoTriggeredRef.current = true;
        runSearch(lat, lon, type || "General");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [searchParams, runSearch]);

  const resetSearch = () => {
    setLatitude("");
    setLongitude("");
    setPlaceQuery("");
    setSymptoms("");
    setSeverityResult(null);
    setEmergencyType("Trauma");
    setResults([]);
    setSearched(false);
    setError(null);
    setEtaSeconds(null);
    setRouteCoordinates(null);
    setRouteInfo(null);
    setDispatchedAmbulance(null);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const searchPlaces = (query) => {
    setPlaceQuery(query);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 3) {
      setPlaceSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearchingPlace(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=6&countrycodes=in`
        );
        const data = await res.json();
        setPlaceSuggestions(data);
        setShowSuggestions(true);
      } catch {
        // ignore place lookup failure
      } finally {
        setSearchingPlace(false);
      }
    }, 500);
  };

  const selectPlace = (place) => {
    setLatitude(parseFloat(place.lat).toFixed(6));
    setLongitude(parseFloat(place.lon).toFixed(6));
    setPlaceQuery(place.display_name);
    setShowSuggestions(false);
    setPlaceSuggestions([]);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setPlaceQuery("");
      },
      () => {
        setError("Unable to detect current location. Please search by place name or enter coordinates.");
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
    } catch {
      // non-blocking
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
  const hasValidPatientLocation = !Number.isNaN(patientLat) && !Number.isNaN(patientLon);
  const bestHospital = results.length > 0 ? results[0] : null;

  return (
    <div className="page-container" style={{ maxInlineSize: "1140px" }}>
      <div className="page-header">
        <div>
          <span className="badge badge-danger" style={{ marginBottom: "0.5rem" }}>
            <EmergencyIcon size={13} />
            <span>Emergency Dispatch &amp; Routing</span>
          </span>
          <h1 className="page-title">Request Emergency Hospital Match</h1>
          <p className="page-subtitle">
            Provide pickup coordinates and emergency category to calculate hospital suitability scores, real road routes, and automated ambulance dispatch.
          </p>
        </div>
      </div>

      {/* Dispatch Intake Form */}
      <form onSubmit={handleSubmit} className="hc-card hc-card--padded">
        <div className="hc-dispatch-grid">
          {/* Location Controls */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.0625rem" }}>1. Patient Location</h2>
              <button
                type="button"
                onClick={detectLocation}
                className="btn btn-secondary btn-sm"
              >
                <MapPinIcon size={15} />
                <span>Use Current GPS</span>
              </button>
            </div>

            <div className="form-group" style={{ position: "relative" }}>
              <label htmlFor="place-search">Search Place or Landmark</label>
              <div style={{ position: "relative" }}>
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    insetInlineStart: "0.875rem",
                    insetBlockStart: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-text-secondary)",
                    display: "inline-flex",
                    pointerEvents: "none",
                  }}
                >
                  <SearchIcon size={17} />
                </span>
                <input
                  id="place-search"
                  type="text"
                  value={placeQuery}
                  onChange={(e) => searchPlaces(e.target.value)}
                  onFocus={() => placeSuggestions.length > 0 && setShowSuggestions(true)}
                  placeholder="e.g. Patna, AIIMS Delhi, Connaught Place..."
                  autoComplete="off"
                  style={{ paddingInlineStart: "2.5rem" }}
                />
              </div>

              {searchingPlace && (
                <p className="field-hint" style={{ color: "var(--color-secondary)" }}>
                  Searching locations...
                </p>
              )}

              {showSuggestions && placeSuggestions.length > 0 && (
                <ul className="hc-suggestions-list" role="listbox" aria-label="Location suggestions">
                  {placeSuggestions.map((place, i) => (
                    <li key={place.place_id || i}>
                      <button
                        type="button"
                        onClick={() => selectPlace(place)}
                        className="hc-suggestion-btn"
                      >
                        <MapPinIcon size={15} />
                        <span>{place.display_name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="em-lat">
                  Latitude <span className="required-mark">*</span>
                </label>
                <input
                  id="em-lat"
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="e.g. 25.5941"
                  inputMode="decimal"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="em-lon">
                  Longitude <span className="required-mark">*</span>
                </label>
                <input
                  id="em-lon"
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="e.g. 85.1376"
                  inputMode="decimal"
                  required
                />
              </div>
            </div>
          </div>

          {/* Triage & Symptoms */}
          <div>
            <h2 style={{ margin: "0 0 1rem", fontSize: "1.0625rem" }}>2. Clinical Triage</h2>

            <div className="form-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.375rem" }}>
                <label htmlFor="em-symptoms" style={{ margin: 0 }}>
                  Describe Symptoms (AI Severity Check)
                </label>
                <button
                  type="button"
                  onClick={classifySeverity}
                  disabled={!symptoms.trim() || classifying}
                  className="btn btn-outline btn-sm"
                  style={{ minBlockSize: "28px", fontSize: "0.75rem" }}
                >
                  {classifying ? "Analyzing..." : "Analyze"}
                </button>
              </div>
              <textarea
                id="em-symptoms"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                onBlur={classifySeverity}
                placeholder="e.g. severe chest pain, difficulty breathing, trauma injury..."
                rows="3"
                maxLength={300}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.25rem", fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
                <span>Optional — helps classify triage urgency automatically</span>
                <span className="tabular-nums">{symptoms.length}/300</span>
              </div>

              {severityResult && severityResult.severity !== "UNKNOWN" && (
                <div
                  className={`hc-alert ${
                    severityResult.severity === "CRITICAL"
                      ? "hc-alert--danger"
                      : severityResult.severity === "MODERATE"
                      ? "hc-alert--warning"
                      : "hc-alert--success"
                  }`}
                  style={{ marginTop: "0.75rem" }}
                >
                  <ActivityIcon size={18} />
                  <div>
                    <strong>AI Severity: {severityResult.severity}</strong> — {severityResult.recommendation}
                    {severityResult.matchedSymptoms && severityResult.matchedSymptoms.length > 0 && (
                      <div style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>
                        Detected indicators: {severityResult.matchedSymptoms.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="em-type">
                Emergency Category <span className="required-mark">*</span>
              </label>
              <select
                id="em-type"
                value={emergencyType}
                onChange={(e) => setEmergencyType(e.target.value)}
              >
                <option value="Trauma">Trauma</option>
                <option value="Cardiac">Cardiac</option>
                <option value="Accident">Accident</option>
                <option value="Pediatric">Pediatric</option>
                <option value="Neuro">Neuro (Stroke / Brain)</option>
                <option value="Burns">Burns</option>
                <option value="Poisoning">Poisoning</option>
                <option value="Maternity">Maternity / Obstetric</option>
                <option value="Respiratory">Respiratory</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid var(--color-border)", display: "flex", justifyContent: "flex-end", gap: "0.75rem", flexWrap: "wrap" }}>
          {searched && (
            <button type="button" onClick={resetSearch} className="btn btn-outline btn-lg">
              <RefreshIcon size={16} />
              <span>Reset</span>
            </button>
          )}
          <button type="submit" disabled={loading} className="btn btn-danger btn-lg">
            <EmergencyIcon size={18} />
            <span>{loading ? "Finding Nearest Hospitals..." : "Find Nearest Suitable Hospital"}</span>
          </button>
        </div>
      </form>

      {error && (
        <div role="alert" className="hc-alert hc-alert--danger" style={{ marginTop: "1.25rem" }}>
          <AlertIcon size={18} />
          <span>{error}</span>
        </div>
      )}

      {!loading && searched && results.length === 0 && !error && (
        <div className="empty-state" style={{ marginTop: "1.5rem" }}>
          No registered hospitals were found in the system yet.
        </div>
      )}

      {/* Active Dispatch Telemetry */}
      {(bestHospital && etaSeconds !== null) || dispatchedAmbulance ? (
        <div className="hc-telemetry-row">
          {bestHospital && etaSeconds !== null && (
            <div
              className="hc-card hc-card--padded"
              style={{
                borderInlineStart: `4px solid ${etaSeconds <= 0 ? "var(--color-success)" : "var(--color-danger)"}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: etaSeconds <= 0 ? "var(--color-success-text)" : "var(--color-danger-text)" }}>
                  <ClockIcon size={14} />
                  <span>Estimated Ambulance Arrival</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: "1.0625rem", marginTop: "0.25rem" }}>
                  {bestHospital.hospital.name}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)", marginTop: "0.125rem" }}>
                  {routeInfo
                    ? `${routeInfo.distanceKm.toFixed(1)} km road route (OSRM)`
                    : `${bestHospital.distanceInKm.toFixed(1)} km straight-line distance`}
                </div>
              </div>

              <div
                className="tabular-nums"
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: etaSeconds <= 0 ? "var(--color-success-text)" : "var(--color-danger)",
                }}
              >
                {etaSeconds <= 0 ? "Arrived" : formatTime(etaSeconds)}
              </div>
            </div>
          )}

          {dispatchedAmbulance && (
            <div
              className="hc-card hc-card--padded"
              style={{
                borderInlineStart: "4px solid var(--color-success)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "0.375rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="badge badge-success">
                  <AmbulanceIcon size={13} />
                  <span>Auto-Dispatched Unit</span>
                </span>
              </div>
              <div style={{ fontSize: "1.0625rem", fontWeight: 700 }}>
                {dispatchedAmbulance.vehicleNumber} — {dispatchedAmbulance.driverName}
              </div>
              <div style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                <PhoneIcon size={14} />
                <a href={`tel:${dispatchedAmbulance.driverContact}`} style={{ fontWeight: 600 }}>
                  {dispatchedAmbulance.driverContact}
                </a>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Map View */}
      {hasValidPatientLocation && results.length > 0 && (
        <section style={{ marginTop: "1.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <h2 style={{ margin: 0 }}>Live Route Map</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
                <span style={{ inlineSize: "14px", blockSize: "3px", backgroundColor: "var(--color-danger)", display: "inline-block" }} />
                {routeCoordinates ? "OSRM Driving Route" : "Direct Trajectory"}
              </span>
            </div>
          </div>

          <div className="map-frame">
            <MapContainer
              center={[patientLat, patientLon]}
              zoom={12}
              style={{ height: "100%", width: "100%" }}
            >
              <RecenterMap center={[patientLat, patientLon]} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={[patientLat, patientLon]}>
                <Popup>Patient Pickup Location</Popup>
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
                <Polyline positions={routeCoordinates} color="#DC2626" weight={5} opacity={0.9} />
              ) : (
                bestHospital && (
                  <Polyline
                    positions={[
                      [patientLat, patientLon],
                      [bestHospital.hospital.latitude, bestHospital.hospital.longitude],
                    ]}
                    color="#DC2626"
                    weight={4}
                    dashArray="8"
                  />
                )
              )}
            </MapContainer>
          </div>
        </section>
      )}

      {/* Ranked Results */}
      {results.length > 0 && (
        <section style={{ marginTop: "2rem" }}>
          <h2 style={{ marginBottom: "1rem" }}>Recommended Hospitals ({results.length})</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {results.map((rec, index) => {
              const isBest = index === 0;
              return (
                <article
                  key={rec.hospital.id}
                  className="hc-card hc-card--padded"
                  style={{
                    borderColor: isBest ? "var(--color-success)" : "var(--color-border)",
                    borderWidth: isBest ? "2px" : "1px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.25rem" }}>
                        {isBest ? (
                          <span className="badge badge-success">Best Recommended Match</span>
                        ) : (
                          <span className="badge badge-neutral">Rank #{index + 1}</span>
                        )}
                        <span className="badge badge-primary tabular-nums">
                          Score: {rec.suitabilityScore.toFixed(1)}
                        </span>
                      </div>
                      <h3 style={{ margin: "0.25rem 0 0.125rem", color: "var(--color-primary)" }}>
                        {rec.hospital.name}
                      </h3>
                      <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
                        {rec.hospital.address}
                      </p>
                    </div>

                    {rec.hospital.contactNumber && (
                      <a href={`tel:${rec.hospital.contactNumber}`} className="btn btn-outline btn-sm">
                        <PhoneIcon size={14} />
                        <span className="tabular-nums">{rec.hospital.contactNumber}</span>
                      </a>
                    )}
                  </div>

                  <div className="hc-hospital-metrics">
                    <div className="hc-metric-chip">
                      <MapPinIcon size={16} />
                      <span>
                        Distance: <strong className="tabular-nums">{rec.distanceInKm.toFixed(2)} km</strong>
                      </span>
                    </div>
                    <div className="hc-metric-chip">
                      <BedIcon size={16} />
                      <span>
                        ICU Beds:{" "}
                        <strong className="tabular-nums">
                          {rec.hospital.availableIcuBeds}/{rec.hospital.totalIcuBeds}
                        </strong>
                      </span>
                    </div>
                    <div className="hc-metric-chip">
                      <DropletIcon size={16} />
                      <span>
                        Blood Bank: <strong>{rec.hospital.bloodBankAvailable ? "Available" : "N/A"}</strong>
                      </span>
                    </div>
                    <div className="hc-metric-chip">
                      <StethoscopeIcon size={16} />
                      <span>
                        Doctors: <strong className="tabular-nums">{rec.hospital.availableDoctors}</strong>
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <style>{`
        .hc-dispatch-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 2rem;
        }

        .hc-suggestions-list {
          list-style: none;
          margin: 0.375rem 0 0;
          padding: 0;
          position: absolute;
          inset-block-start: 100%;
          inset-inline: 0;
          background-color: var(--color-card);
          border: 1px solid var(--color-border-strong);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-md);
          z-index: 20;
          max-block-size: 220px;
          overflow-y: auto;
        }

        .hc-suggestion-btn {
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--color-border);
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text);
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .hc-suggestion-btn:hover {
          background-color: var(--color-surface-hover);
        }

        .hc-telemetry-row {
          margin-top: 1.5rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }

        .hc-hospital-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          gap: 0.75rem;
          padding-top: 0.875rem;
          border-top: 1px solid var(--color-border);
        }

        .hc-metric-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--color-text);
          background-color: var(--color-surface-subtle);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 0.5rem 0.75rem;
        }

        @media (max-width: 820px) {
          .hc-dispatch-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default RequestEmergency;
