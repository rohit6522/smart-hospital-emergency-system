import { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../components/Toast";
import {
  AlertIcon,
  CopyIcon,
  PatientIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "../components/Icons";

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [bloodFilter, setBloodFilter] = useState("All");
  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { isAdmin } = useAuth();
  const headingId = useId();

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    let active = true;
    const loadPatients = async () => {
      try {
        const response = await api.get("/patients");
        if (active) {
          setPatients(response.data);
          setLoading(false);
        }
      } catch {
        if (active) {
          setError("Failed to load patient records. Please verify the backend service is running.");
          setLoading(false);
        }
      }
    };
    loadPatients();
    return () => {
      active = false;
    };
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/patients/${deleteTarget.id}`);
      setPatients((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      showToast(`Removed patient record for ${deleteTarget.name}`);
    } catch {
      showToast("Failed to delete patient record.", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) return <Loader text="Loading patient records..." />;
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

  const bloodGroupsInData = [
    "All",
    ...new Set(patients.map((p) => (p.bloodGroup || "").trim()).filter(Boolean)),
  ];

  const filteredPatients = patients.filter((p) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      (p.name || "").toLowerCase().includes(query) ||
      (p.bloodGroup || "").toLowerCase().includes(query) ||
      (p.contactNumber || "").includes(searchTerm);
    const matchesBlood =
      bloodFilter === "All" || (p.bloodGroup || "").trim() === bloodFilter;
    return matchesSearch && matchesBlood;
  });

  const withHistoryCount = patients.filter(
    (p) => p.medicalHistory && p.medicalHistory.trim().length > 0
  ).length;
  const distinctBloodCount = Math.max(0, bloodGroupsInData.length - 1);

  return (
    <div className="page-container">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      <div className="page-header">
        <div>
          <h1 id={headingId} className="page-title">
            <PatientIcon size={26} />
            <span>Patient Records</span>
          </h1>
          <p className="page-subtitle">
            Maintain patient demographics, blood groups, allergies, and emergency contacts for faster clinical intake.
          </p>
        </div>

        {isAdmin && (
          <Link to="/patients/add" className="btn btn-primary">
            <PlusIcon size={16} />
            <span>Add New Patient</span>
          </Link>
        )}
      </div>

      {/* Summary Strip */}
      <div className="hc-summary-strip">
        <div className="hc-card hc-mini-stat">
          <span className="hc-mini-stat__label">Registered Patients</span>
          <span className="hc-mini-stat__value tabular-nums">{patients.length}</span>
        </div>
        <div className="hc-card hc-mini-stat">
          <span className="hc-mini-stat__label">Blood Groups Represented</span>
          <span className="hc-mini-stat__value tabular-nums" style={{ color: "var(--color-danger-text)" }}>
            {distinctBloodCount}
          </span>
        </div>
        <div className="hc-card hc-mini-stat">
          <span className="hc-mini-stat__label">With Medical History</span>
          <span className="hc-mini-stat__value tabular-nums" style={{ color: "var(--color-secondary)" }}>
            {withHistoryCount}
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="hc-card hc-filter-bar">
        <div className="hc-filter-search">
          <label htmlFor="patient-search" className="visually-hidden">
            Search patients by name, blood group, or contact number
          </label>
          <span className="hc-input-icon" aria-hidden="true">
            <SearchIcon size={17} />
          </span>
          <input
            id="patient-search"
            type="search"
            placeholder="Search by patient name, blood group, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingInlineStart: "2.5rem" }}
          />
        </div>

        <div style={{ minInlineSize: "190px" }}>
          <label htmlFor="blood-filter" className="visually-hidden">
            Filter by blood group
          </label>
          <select
            id="blood-filter"
            value={bloodFilter}
            onChange={(e) => setBloodFilter(e.target.value)}
          >
            {bloodGroupsInData.map((bg) => (
              <option key={bg} value={bg}>
                {bg === "All" ? "All Blood Groups" : `Blood Group ${bg}`}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => {
            setSearchTerm("");
            setBloodFilter("All");
          }}
          className="btn btn-outline"
        >
          Reset
        </button>
      </div>

      <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", margin: "0 0 0.875rem" }}>
        Showing <strong className="tabular-nums">{filteredPatients.length}</strong> of{" "}
        <strong className="tabular-nums">{patients.length}</strong> patients
      </p>

      {filteredPatients.length === 0 ? (
        <div className="empty-state">
          <p style={{ margin: "0 0 0.75rem", fontWeight: 600, color: "var(--color-text)" }}>
            {patients.length === 0
              ? "No patient records registered yet."
              : "No patient records match your current filters."}
          </p>
          {(searchTerm || bloodFilter !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setBloodFilter("All");
              }}
              className="btn btn-outline btn-sm"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div tabIndex={0} role="region" aria-labelledby={headingId} className="table-wrapper">
          <table className="hc-table hc-table--stack">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Patient Name</th>
                <th scope="col">Age / Gender</th>
                <th scope="col">Blood Group</th>
                <th scope="col">Contact Number</th>
                <th scope="col">Medical History</th>
                <th scope="col">Emergency Contact</th>
                {isAdmin && <th scope="col">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id}>
                  <td data-label="ID" className="tabular-nums text-muted">
                    #{patient.id}
                  </td>

                  <td data-label="Patient Name" style={{ fontWeight: 600, color: "var(--color-primary)" }}>
                    {patient.name}
                  </td>

                  <td data-label="Age / Gender" className="tabular-nums">
                    {patient.age ?? "—"} {patient.gender ? `· ${patient.gender}` : ""}
                  </td>

                  <td data-label="Blood Group">
                    {patient.bloodGroup ? (
                      <span className="badge badge-danger">{patient.bloodGroup}</span>
                    ) : (
                      <span className="badge badge-neutral">Not Recorded</span>
                    )}
                  </td>

                  <td data-label="Contact Number">
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
                      <span className="tabular-nums">{patient.contactNumber || "—"}</span>
                      {patient.contactNumber && (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(patient.contactNumber);
                            showToast(`Copied ${patient.contactNumber}`);
                          }}
                          aria-label={`Copy contact number for ${patient.name}`}
                          className="btn btn-outline btn-sm"
                          style={{ minBlockSize: "28px", padding: "0 0.45rem" }}
                        >
                          <CopyIcon size={13} />
                        </button>
                      )}
                    </div>
                  </td>

                  <td data-label="Medical History" style={{ maxInlineSize: "260px", color: "var(--color-text-secondary)", fontSize: "0.8125rem" }}>
                    {patient.medicalHistory ? patient.medicalHistory : "None reported"}
                  </td>

                  <td data-label="Emergency Contact">
                    {patient.emergencyContactName || patient.emergencyContactNumber ? (
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.8125rem" }}>
                          {patient.emergencyContactName || "Unnamed contact"}
                        </div>
                        {patient.emergencyContactNumber && (
                          <div className="tabular-nums text-muted" style={{ fontSize: "0.8125rem" }}>
                            {patient.emergencyContactNumber}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>

                  {isAdmin && (
                    <td data-label="Actions">
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(patient)}
                        className="btn btn-ghost-danger btn-sm"
                        aria-label={`Delete patient ${patient.name}`}
                      >
                        <TrashIcon size={13} />
                        <span>Delete</span>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete patient record?"
        message={
          deleteTarget
            ? `Are you sure you want to permanently remove "${deleteTarget.name}" from patient records?`
            : ""
        }
        confirmLabel="Delete Patient"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default PatientList;
