import { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import api from "../services/api";
import { connectWebSocket, disconnectWebSocket } from "../services/websocket";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../components/Toast";
import {
  AlertIcon,
  AmbulanceIcon,
  CopyIcon,
  ExternalLinkIcon,
  MapPinIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "../components/Icons";

function FitFleetView({ positions }) {
  const map = useMap();
  const firstPos = positions.length > 0 ? positions[0] : null;
  const firstLat = firstPos ? firstPos[0] : null;
  const firstLon = firstPos ? firstPos[1] : null;

  useEffect(() => {
    if (firstLat !== null && firstLon !== null) {
      map.setView([firstLat, firstLon], map.getZoom());
    }
  }, [firstLat, firstLon, map]);

  return null;
}

const STATUS_BADGE = {
  AVAILABLE: { className: "badge-success", label: "Available" },
  ON_DUTY: { className: "badge-warning", label: "On Duty" },
  OFFLINE: { className: "badge-neutral", label: "Offline" },
};

function AmbulanceList() {
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showMap, setShowMap] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { isAdmin } = useAuth();
  const headingId = useId();

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2200);
  };

  useEffect(() => {
    let active = true;
    const loadAmbulances = async () => {
      try {
        const response = await api.get("/ambulances");
        if (active) {
          setAmbulances(response.data);
          setLoading(false);
        }
      } catch {
        if (active) {
          setError("Failed to load ambulance fleet data. Please verify the backend service is running.");
          setLoading(false);
        }
      }
    };

    loadAmbulances();

    connectWebSocket(
      (updatedAmbulance) => {
        setAmbulances((prevAmbulances) => {
          const exists = prevAmbulances.some((a) => a.id === updatedAmbulance.id);
          if (exists) {
            return prevAmbulances.map((a) =>
              a.id === updatedAmbulance.id ? updatedAmbulance : a
            );
          }
          return [...prevAmbulances, updatedAmbulance];
        });
      },
      (connected) => {
        if (active) setIsLive(connected);
      }
    );

    return () => {
      active = false;
      disconnectWebSocket();
    };
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/ambulances/${deleteTarget.id}`);
      setAmbulances((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      showToast(`Removed unit ${deleteTarget.vehicleNumber}`);
    } catch {
      showToast("Failed to delete ambulance unit.", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleStatusChange = async (ambulance, newStatus) => {
    try {
      const updated = { ...ambulance, status: newStatus };
      await api.put(`/ambulances/${ambulance.id}`, updated);
      setAmbulances((prev) =>
        prev.map((a) => (a.id === ambulance.id ? { ...a, status: newStatus } : a))
      );
      showToast(`${ambulance.vehicleNumber} marked ${newStatus.replace("_", " ")}`);
    } catch {
      showToast("Failed to update ambulance status.", "error");
    }
  };

  const handleCopyContact = (contact) => {
    navigator.clipboard.writeText(contact);
    showToast(`Copied ${contact}`);
  };

  if (loading) return <Loader text="Loading ambulance fleet telemetry..." />;
  if (error) {
    return (
      <div className="page-container">
        <div role="alert" className="hc-alert hc-alert--danger">
          <AlertIcon size={18} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const availableCount = ambulances.filter((a) => a.status === "AVAILABLE").length;
  const onDutyCount = ambulances.filter((a) => a.status === "ON_DUTY").length;
  const offlineCount = ambulances.filter((a) => a.status === "OFFLINE").length;

  const filteredAmbulances = ambulances.filter((ambulance) => {
    const matchesStatus = statusFilter === "All" || ambulance.status === statusFilter;
    const query = searchTerm.toLowerCase();
    const matchesQuery =
      !query ||
      (ambulance.vehicleNumber || "").toLowerCase().includes(query) ||
      (ambulance.driverName || "").toLowerCase().includes(query) ||
      (ambulance.driverContact || "").includes(searchTerm);
    return matchesStatus && matchesQuery;
  });

  const mappableAmbulances = filteredAmbulances.filter(
    (a) =>
      typeof a.currentLatitude === "number" &&
      typeof a.currentLongitude === "number" &&
      !Number.isNaN(a.currentLatitude) &&
      !Number.isNaN(a.currentLongitude)
  );

  const mapPositions = mappableAmbulances.map((a) => [a.currentLatitude, a.currentLongitude]);
  const mapCenter = mapPositions.length > 0 ? mapPositions[0] : [25.5941, 85.1376];

  return (
    <div className="page-container">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      <div className="page-header">
        <div>
          <h1 id={headingId} className="page-title">
            <AmbulanceIcon size={26} />
            <span>Ambulance Fleet &amp; Live Tracking</span>
            <span className={`badge ${isLive ? "badge-success" : "badge-danger"}`}>
              <span
                aria-hidden="true"
                style={{
                  inlineSize: "7px",
                  blockSize: "7px",
                  borderRadius: "50%",
                  backgroundColor: isLive ? "var(--color-success)" : "var(--color-danger)",
                }}
              />
              <span>{isLive ? "Live WebSocket" : "Feed Offline"}</span>
            </span>
          </h1>
          <p className="page-subtitle">
            Monitor active ambulance telemetry, GPS coordinates, driver dispatch contacts, and operational availability in real time.
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem" }}>
          <button
            type="button"
            onClick={() => setShowMap((prev) => !prev)}
            className="btn btn-outline"
            aria-pressed={showMap}
          >
            <MapPinIcon size={16} />
            <span>{showMap ? "Hide Fleet Map" : "Show Fleet Map"}</span>
          </button>

          {isAdmin && (
            <Link to="/ambulances/add" className="btn btn-primary">
              <PlusIcon size={16} />
              <span>Add New Ambulance</span>
            </Link>
          )}
        </div>
      </div>

      {/* Fleet Summary Strip */}
      <div className="hc-summary-strip">
        <div className="hc-card hc-mini-stat">
          <span className="hc-mini-stat__label">Total Fleet Units</span>
          <span className="hc-mini-stat__value tabular-nums">{ambulances.length}</span>
        </div>
        <div className="hc-card hc-mini-stat">
          <span className="hc-mini-stat__label">Available</span>
          <span className="hc-mini-stat__value tabular-nums" style={{ color: "var(--color-success-text)" }}>
            {availableCount}
          </span>
        </div>
        <div className="hc-card hc-mini-stat">
          <span className="hc-mini-stat__label">On Duty</span>
          <span className="hc-mini-stat__value tabular-nums" style={{ color: "var(--color-warning-text)" }}>
            {onDutyCount}
          </span>
        </div>
        <div className="hc-card hc-mini-stat">
          <span className="hc-mini-stat__label">Offline</span>
          <span className="hc-mini-stat__value tabular-nums" style={{ color: "var(--color-text-secondary)" }}>
            {offlineCount}
          </span>
        </div>
      </div>

      {/* Live Fleet Map */}
      {showMap && (
        <section className="hc-card" style={{ padding: "1rem 1.25rem 1.25rem", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <h2 style={{ margin: 0, fontSize: "1rem" }}>Live Fleet Map View</h2>
            <span className="text-muted tabular-nums" style={{ fontSize: "0.8125rem" }}>
              {mappableAmbulances.length} tracked {mappableAmbulances.length === 1 ? "unit" : "units"} with GPS coordinates
            </span>
          </div>

          {mappableAmbulances.length > 0 ? (
            <div className="map-frame" style={{ height: "340px" }}>
              <MapContainer center={mapCenter} zoom={11} style={{ height: "100%", width: "100%" }}>
                <FitFleetView positions={mapPositions} />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {mappableAmbulances.map((amb) => (
                  <Marker key={amb.id} position={[amb.currentLatitude, amb.currentLongitude]}>
                    <Popup>
                      <strong>{amb.vehicleNumber}</strong> ({amb.status})
                      <br />
                      Driver: {amb.driverName || "Unassigned"}
                      <br />
                      Contact: {amb.driverContact || "N/A"}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: "1.75rem" }}>
              No filtered ambulance units have GPS coordinates recorded.
            </div>
          )}
        </section>
      )}

      {/* Filter Bar */}
      <div className="hc-card hc-filter-bar">
        <div className="hc-filter-search">
          <label htmlFor="ambulance-search" className="visually-hidden">
            Search ambulances by vehicle number or driver
          </label>
          <span className="hc-input-icon" aria-hidden="true">
            <SearchIcon size={17} />
          </span>
          <input
            id="ambulance-search"
            type="search"
            placeholder="Search by vehicle #, driver name, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingInlineStart: "2.5rem" }}
          />
        </div>

        <div className="hc-pill-tabs" role="group" aria-label="Filter ambulances by status">
          {[
            { value: "All", label: "All Units" },
            { value: "AVAILABLE", label: "Available" },
            { value: "ON_DUTY", label: "On Duty" },
            { value: "OFFLINE", label: "Offline" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setStatusFilter(option.value)}
              aria-pressed={statusFilter === option.value}
              className={`hc-pill-tab ${statusFilter === option.value ? "is-active" : ""}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", margin: "0 0 0.875rem" }}>
        Showing <strong className="tabular-nums">{filteredAmbulances.length}</strong> of{" "}
        <strong className="tabular-nums">{ambulances.length}</strong> ambulances
      </p>

      {filteredAmbulances.length === 0 ? (
        <div className="empty-state">
          <p style={{ margin: "0 0 0.75rem", fontWeight: 600, color: "var(--color-text)" }}>
            No ambulance units match your current filters.
          </p>
          {(statusFilter !== "All" || searchTerm) && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter("All");
                setSearchTerm("");
              }}
              className="btn btn-outline btn-sm"
            >
              Reset filters
            </button>
          )}
        </div>
      ) : (
        <div tabIndex={0} role="region" aria-labelledby={headingId} className="table-wrapper">
          <table className="hc-table hc-table--stack">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Vehicle Number</th>
                <th scope="col">Driver</th>
                <th scope="col">Driver Contact</th>
                <th scope="col">GPS Coordinates</th>
                <th scope="col">Hospital ID</th>
                <th scope="col">Status</th>
                {isAdmin && <th scope="col">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredAmbulances.map((ambulance) => {
                const statusMeta = STATUS_BADGE[ambulance.status] || STATUS_BADGE.OFFLINE;
                const hasCoords =
                  ambulance.currentLatitude !== null &&
                  ambulance.currentLatitude !== undefined &&
                  ambulance.currentLongitude !== null &&
                  ambulance.currentLongitude !== undefined;

                return (
                  <tr key={ambulance.id}>
                    <td data-label="ID" className="tabular-nums text-muted">
                      #{ambulance.id}
                    </td>

                    <td data-label="Vehicle Number" style={{ fontWeight: 700, color: "var(--color-primary)" }}>
                      {ambulance.vehicleNumber}
                    </td>

                    <td data-label="Driver">{ambulance.driverName || "—"}</td>

                    <td data-label="Driver Contact">
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
                        <span className="tabular-nums">{ambulance.driverContact || "—"}</span>
                        {ambulance.driverContact && (
                          <button
                            type="button"
                            onClick={() => handleCopyContact(ambulance.driverContact)}
                            aria-label={`Copy driver phone for ${ambulance.vehicleNumber}`}
                            className="btn btn-outline btn-sm"
                            style={{ minBlockSize: "28px", padding: "0 0.45rem" }}
                          >
                            <CopyIcon size={13} />
                          </button>
                        )}
                      </div>
                    </td>

                    <td data-label="GPS Coordinates">
                      {hasCoords ? (
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", flexWrap: "wrap" }}>
                          <span className="tabular-nums" style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
                            {Number(ambulance.currentLatitude).toFixed(4)}, {Number(ambulance.currentLongitude).toFixed(4)}
                          </span>
                          <a
                            href={`https://www.openstreetmap.org/?mlat=${ambulance.currentLatitude}&mlon=${ambulance.currentLongitude}#map=15/${ambulance.currentLatitude}/${ambulance.currentLongitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Locate ${ambulance.vehicleNumber} on OpenStreetMap`}
                            className="btn btn-outline btn-sm"
                            style={{ minBlockSize: "26px", padding: "0 0.45rem" }}
                          >
                            <ExternalLinkIcon size={12} />
                          </a>
                        </div>
                      ) : (
                        <span className="text-muted">Not reported</span>
                      )}
                    </td>

                    <td data-label="Hospital ID" className="tabular-nums">
                      {ambulance.assignedHospitalId ? `#${ambulance.assignedHospitalId}` : "Unassigned"}
                    </td>

                    <td data-label="Status">
                      {isAdmin ? (
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                          <span className={`badge ${statusMeta.className}`}>{statusMeta.label}</span>
                          <select
                            aria-label={`Change status for ${ambulance.vehicleNumber}`}
                            value={ambulance.status}
                            onChange={(e) => handleStatusChange(ambulance, e.target.value)}
                            style={{
                              minBlockSize: "34px",
                              inlineSize: "auto",
                              padding: "0.25rem 0.5rem",
                              fontSize: "0.8125rem",
                              fontWeight: 600,
                            }}
                          >
                            <option value="AVAILABLE">AVAILABLE</option>
                            <option value="ON_DUTY">ON_DUTY</option>
                            <option value="OFFLINE">OFFLINE</option>
                          </select>
                        </div>
                      ) : (
                        <span className={`badge ${statusMeta.className}`}>{statusMeta.label}</span>
                      )}
                    </td>

                    {isAdmin && (
                      <td data-label="Actions">
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(ambulance)}
                          className="btn btn-ghost-danger btn-sm"
                          aria-label={`Delete ambulance ${ambulance.vehicleNumber}`}
                        >
                          <TrashIcon size={13} />
                          <span>Delete</span>
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete ambulance unit?"
        message={
          deleteTarget
            ? `Are you sure you want to remove ambulance "${deleteTarget.vehicleNumber}" from fleet telemetry?`
            : ""
        }
        confirmLabel="Delete Ambulance"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default AmbulanceList;
