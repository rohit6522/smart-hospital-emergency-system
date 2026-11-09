import { useEffect, useId, useRef, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../components/Toast";
import {
  AlertIcon,
  CloseIcon,
  CopyIcon,
  EditIcon,
  ExternalLinkIcon,
  HospitalIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "../components/Icons";

const EMERGENCY_TYPES = [
  "Trauma",
  "Cardiac",
  "Accident",
  "Pediatric",
  "Neuro",
  "Burns",
  "Poisoning",
  "Maternity",
  "Respiratory",
  "General",
];

const BLOOD_FIELDS = [
  { key: "bloodAPos", label: "A+" },
  { key: "bloodANeg", label: "A-" },
  { key: "bloodBPos", label: "B+" },
  { key: "bloodBNeg", label: "B-" },
  { key: "bloodOPos", label: "O+" },
  { key: "bloodONeg", label: "O-" },
  { key: "bloodABPos", label: "AB+" },
  { key: "bloodABNeg", label: "AB-" },
];

const EMPTY_HOSPITAL_FORM = {
  name: "",
  address: "",
  latitude: "",
  longitude: "",
  totalIcuBeds: 0,
  availableIcuBeds: 0,
  bloodBankAvailable: true,
  bloodAPos: 0,
  bloodANeg: 0,
  bloodBPos: 0,
  bloodBNeg: 0,
  bloodOPos: 0,
  bloodONeg: 0,
  bloodABPos: 0,
  bloodABNeg: 0,
  availableDoctors: 0,
  emergencyTypes: ["General"],
  contactNumber: "",
};

function HospitalList() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAdmin } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [emergencyFilter, setEmergencyFilter] = useState("All");
  const [onlyAvailableIcu, setOnlyAvailableIcu] = useState(false);

  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Add/Edit Modal state
  const [modalMode, setModalMode] = useState(null); // "add" | "edit" | null
  const [editingId, setEditingId] = useState(null);
  const [formState, setFormState] = useState(EMPTY_HOSPITAL_FORM);
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

  const dialogRef = useRef(null);
  const nameInputRef = useRef(null);
  const modalTitleId = useId();
  const headingId = useId();

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    let active = true;
    const loadHospitals = async () => {
      try {
        const response = await api.get("/hospitals");
        if (active) {
          setHospitals(response.data);
          setLoading(false);
        }
      } catch {
        if (active) {
          setError("Failed to load hospitals. Please verify the backend service is running.");
          setLoading(false);
        }
      }
    };
    loadHospitals();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (modalMode) {
      if (!dialog.open) {
        dialog.showModal();
        nameInputRef.current?.focus();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [modalMode]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/hospitals/${deleteTarget.id}`);
      setHospitals((prev) => prev.filter((h) => h.id !== deleteTarget.id));
      showToast(`Removed ${deleteTarget.name}`);
    } catch {
      showToast("Failed to delete hospital.", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  const openAddModal = () => {
    setModalMode("add");
    setEditingId(null);
    setFormState(EMPTY_HOSPITAL_FORM);
    setFormError(null);
  };

  const openEditModal = (hospital) => {
    setModalMode("edit");
    setEditingId(hospital.id);
    setFormError(null);
    setFormState({
      ...hospital,
      latitude: hospital.latitude ?? "",
      longitude: hospital.longitude ?? "",
      totalIcuBeds: hospital.totalIcuBeds ?? 0,
      availableIcuBeds: hospital.availableIcuBeds ?? 0,
      availableDoctors: hospital.availableDoctors ?? 0,
      bloodBankAvailable: Boolean(hospital.bloodBankAvailable),
      emergencyTypes: hospital.emergencyTypes || [],
      bloodAPos: hospital.bloodAPos ?? 0,
      bloodANeg: hospital.bloodANeg ?? 0,
      bloodBPos: hospital.bloodBPos ?? 0,
      bloodBNeg: hospital.bloodBNeg ?? 0,
      bloodOPos: hospital.bloodOPos ?? 0,
      bloodONeg: hospital.bloodONeg ?? 0,
      bloodABPos: hospital.bloodABPos ?? 0,
      bloodABNeg: hospital.bloodABNeg ?? 0,
      contactNumber: hospital.contactNumber || "",
    });
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingId(null);
    setFormError(null);
  };

  const handleFormChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (formError) setFormError(null);
  };

  const toggleEmergencyType = (type) => {
    const current = formState.emergencyTypes || [];
    if (current.includes(type)) {
      handleFormChange(
        "emergencyTypes",
        current.filter((t) => t !== type)
      );
    } else {
      handleFormChange("emergencyTypes", [...current, type]);
    }
  };

  const handleSaveHospital = async (e) => {
    e.preventDefault();
    if (!formState.emergencyTypes || formState.emergencyTypes.length === 0) {
      setFormError("Please select at least one emergency type.");
      return;
    }

    setSaving(true);
    setFormError(null);

    const payload = {
      ...formState,
      latitude: formState.latitude === "" ? null : parseFloat(formState.latitude),
      longitude: formState.longitude === "" ? null : parseFloat(formState.longitude),
      totalIcuBeds: parseInt(formState.totalIcuBeds, 10) || 0,
      availableIcuBeds: parseInt(formState.availableIcuBeds, 10) || 0,
      availableDoctors: parseInt(formState.availableDoctors, 10) || 0,
      bloodAPos: parseInt(formState.bloodAPos, 10) || 0,
      bloodANeg: parseInt(formState.bloodANeg, 10) || 0,
      bloodBPos: parseInt(formState.bloodBPos, 10) || 0,
      bloodBNeg: parseInt(formState.bloodBNeg, 10) || 0,
      bloodOPos: parseInt(formState.bloodOPos, 10) || 0,
      bloodONeg: parseInt(formState.bloodONeg, 10) || 0,
      bloodABPos: parseInt(formState.bloodABPos, 10) || 0,
      bloodABNeg: parseInt(formState.bloodABNeg, 10) || 0,
    };

    try {
      if (modalMode === "edit" && editingId !== null) {
        const response = await api.put(`/hospitals/${editingId}`, payload);
        setHospitals((prev) => prev.map((h) => (h.id === editingId ? response.data : h)));
        showToast("Hospital details updated.");
      } else {
        const response = await api.post("/hospitals", payload);
        setHospitals((prev) => [...prev, response.data]);
        showToast("New hospital added.");
      }
      closeModal();
    } catch {
      setFormError("Failed to save hospital changes. Please verify all fields.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader text="Loading hospital directory..." />;
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

  const emergencyTypesInData = [
    "All",
    ...new Set(hospitals.flatMap((h) => h.emergencyTypes || [])),
  ];

  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesSearch =
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (hospital.contactNumber || "").includes(searchTerm) ||
      (hospital.address || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEmergency =
      emergencyFilter === "All" || (hospital.emergencyTypes || []).includes(emergencyFilter);
    const matchesIcu = !onlyAvailableIcu || hospital.availableIcuBeds > 0;
    return matchesSearch && matchesEmergency && matchesIcu;
  });

  const totalOpenIcu = hospitals.reduce((acc, h) => acc + (h.availableIcuBeds || 0), 0);
  const bloodBankCount = hospitals.filter((h) => h.bloodBankAvailable).length;

  return (
    <div className="page-container">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      <div className="page-header">
        <div>
          <h1 id={headingId} className="page-title">
            <HospitalIcon size={26} />
            <span>Hospital Directory</span>
          </h1>
          <p className="page-subtitle">
            Browse registered medical facilities with live ICU capacity, blood inventory, and emergency specialties.
            {isAdmin && " Admin controls enabled for adding and updating facility resources."}
          </p>
        </div>

        {isAdmin && (
          <button type="button" onClick={openAddModal} className="btn btn-primary">
            <PlusIcon size={16} />
            <span>Add Hospital</span>
          </button>
        )}
      </div>

      {/* Summary Strip */}
      <div className="hc-summary-strip">
        <div className="hc-card hc-mini-stat">
          <span className="hc-mini-stat__label">Registered Hospitals</span>
          <span className="hc-mini-stat__value tabular-nums">{hospitals.length}</span>
        </div>
        <div className="hc-card hc-mini-stat">
          <span className="hc-mini-stat__label">Available ICU Beds</span>
          <span className="hc-mini-stat__value tabular-nums" style={{ color: "var(--color-success-text)" }}>
            {totalOpenIcu}
          </span>
        </div>
        <div className="hc-card hc-mini-stat">
          <span className="hc-mini-stat__label">Active Blood Banks</span>
          <span className="hc-mini-stat__value tabular-nums" style={{ color: "var(--color-secondary)" }}>
            {bloodBankCount}
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="hc-card hc-filter-bar">
        <div className="hc-filter-search">
          <label htmlFor="hospital-search" className="visually-hidden">
            Search hospitals by name, address, or contact
          </label>
          <span className="hc-input-icon" aria-hidden="true">
            <SearchIcon size={17} />
          </span>
          <input
            id="hospital-search"
            type="search"
            placeholder="Search by hospital name, city, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingInlineStart: "2.5rem" }}
          />
        </div>

        <div style={{ minInlineSize: "190px" }}>
          <label htmlFor="emergency-filter" className="visually-hidden">
            Filter by emergency type
          </label>
          <select
            id="emergency-filter"
            value={emergencyFilter}
            onChange={(e) => setEmergencyFilter(e.target.value)}
          >
            {emergencyTypesInData.map((type) => (
              <option key={type} value={type}>
                {type === "All" ? "All Emergency Types" : type}
              </option>
            ))}
          </select>
        </div>

        <label className="hc-checkbox-label">
          <input
            type="checkbox"
            checked={onlyAvailableIcu}
            onChange={(e) => setOnlyAvailableIcu(e.target.checked)}
          />
          <span>Only open ICU beds</span>
        </label>

        <button
          type="button"
          onClick={() => {
            setSearchTerm("");
            setEmergencyFilter("All");
            setOnlyAvailableIcu(false);
          }}
          className="btn btn-outline"
        >
          Reset
        </button>
      </div>

      <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", margin: "0 0 0.875rem" }}>
        Showing <strong className="tabular-nums">{filteredHospitals.length}</strong> of{" "}
        <strong className="tabular-nums">{hospitals.length}</strong> hospitals
      </p>

      {filteredHospitals.length === 0 ? (
        <div className="empty-state">
          <p style={{ margin: "0 0 0.75rem", fontWeight: 600, color: "var(--color-text)" }}>
            No hospitals match your current filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setEmergencyFilter("All");
              setOnlyAvailableIcu(false);
            }}
            className="btn btn-outline btn-sm"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div tabIndex={0} role="region" aria-labelledby={headingId} className="table-wrapper">
          <table className="hc-table hc-table--stack">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Hospital &amp; Location</th>
                <th scope="col">ICU Beds</th>
                <th scope="col">Blood Inventory</th>
                <th scope="col">Doctors</th>
                <th scope="col">Emergency Types</th>
                <th scope="col">Contact</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHospitals.map((hospital) => {
                const bloodUnits = BLOOD_FIELDS.map(({ key, label }) => [
                  label,
                  hospital[key] ?? 0,
                ]).filter(([, count]) => count > 0);

                const icuAvailable = hospital.availableIcuBeds || 0;
                const icuTotal = hospital.totalIcuBeds || 0;
                const icuBadgeClass =
                  icuAvailable === 0
                    ? "badge-danger"
                    : icuAvailable <= 2
                    ? "badge-warning"
                    : "badge-success";

                return (
                  <tr key={hospital.id}>
                    <td data-label="ID" className="tabular-nums text-muted">
                      #{hospital.id}
                    </td>

                    <td data-label="Hospital" style={{ minInlineSize: "175px" }}>
                      <div style={{ fontWeight: 600, color: "var(--color-primary)" }}>
                        {hospital.name}
                      </div>
                      <div style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)", marginTop: "2px" }}>
                        {hospital.address}
                      </div>
                    </td>

                    <td data-label="ICU Beds">
                      <span className={`badge ${icuBadgeClass} tabular-nums`}>
                        {icuAvailable} / {icuTotal} open
                      </span>
                    </td>

                    <td data-label="Blood Inventory" style={{ minInlineSize: "170px" }}>
                      {hospital.bloodBankAvailable ? (
                        <div className="hc-chips-cell">
                          {bloodUnits.length > 0 ? (
                            bloodUnits.map(([label, count]) => (
                              <span
                                key={label}
                                className={`badge tabular-nums ${count < 3 ? "badge-danger" : "badge-success"}`}
                              >
                                {label}: {count}
                              </span>
                            ))
                          ) : (
                            <span className="badge badge-neutral">Bank active (units unset)</span>
                          )}
                        </div>
                      ) : (
                        <span className="badge badge-neutral">Not Available</span>
                      )}
                    </td>

                    <td data-label="Doctors" className="tabular-nums" style={{ fontWeight: 600 }}>
                      {hospital.availableDoctors}
                    </td>

                    <td data-label="Emergency Types" style={{ minInlineSize: "155px" }}>
                      {(hospital.emergencyTypes || []).length === 0 ? (
                        <span className="badge badge-warning">Not configured</span>
                      ) : (
                        <div className="hc-chips-cell">
                          {hospital.emergencyTypes.map((type) => (
                            <span key={type} className="badge badge-info">
                              {type}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    <td data-label="Contact">
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
                        <span className="tabular-nums">{hospital.contactNumber || "—"}</span>
                        {hospital.contactNumber && (
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(hospital.contactNumber);
                              showToast(`Copied ${hospital.contactNumber}`);
                            }}
                            aria-label={`Copy contact number for ${hospital.name}`}
                            className="btn btn-outline btn-sm"
                            style={{ minBlockSize: "28px", padding: "0 0.45rem" }}
                          >
                            <CopyIcon size={13} />
                          </button>
                        )}
                      </div>
                    </td>

                    <td data-label="Actions" style={{ minInlineSize: "155px" }}>
                      <div className="hc-chips-cell" style={{ gap: "0.375rem" }}>
                        {hospital.latitude && hospital.longitude && (
                          <a
                            href={`https://www.openstreetmap.org/?mlat=${hospital.latitude}&mlon=${hospital.longitude}#map=15/${hospital.latitude}/${hospital.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline btn-sm"
                            aria-label={`View ${hospital.name} on OpenStreetMap`}
                          >
                            <span>Map</span>
                            <ExternalLinkIcon size={12} />
                          </a>
                        )}

                        {isAdmin && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `${hospital.name} - ${hospital.address} - Contact: ${hospital.contactNumber}`
                                );
                                showToast("Hospital summary copied.");
                              }}
                              className="btn btn-outline btn-sm"
                              aria-label={`Copy summary for ${hospital.name}`}
                            >
                              <CopyIcon size={13} />
                              <span>Copy</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => openEditModal(hospital)}
                              className="btn btn-ghost-secondary btn-sm"
                              aria-label={`Edit ${hospital.name}`}
                            >
                              <EditIcon size={13} />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(hospital)}
                              className="btn btn-ghost-danger btn-sm"
                              aria-label={`Delete ${hospital.name}`}
                            >
                              <TrashIcon size={13} />
                              <span>Delete</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Hospital Native Modal */}
      <dialog
        ref={dialogRef}
        className="hc-dialog"
        aria-labelledby={modalTitleId}
        onCancel={(e) => {
          e.preventDefault();
          closeModal();
        }}
        onClick={(e) => {
          const dialog = dialogRef.current;
          if (!dialog) return;
          const rect = dialog.getBoundingClientRect();
          if (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
          ) {
            closeModal();
          }
        }}
      >
        <div className="hc-dialog__header">
          <h2 id={modalTitleId} style={{ margin: 0, fontSize: "1.125rem" }}>
            {modalMode === "edit" ? "Edit Hospital Resources" : "Register New Hospital"}
          </h2>
          <button
            type="button"
            onClick={closeModal}
            className="btn btn-outline btn-sm"
            aria-label="Close hospital modal"
            style={{ minInlineSize: "34px", padding: "0 0.5rem" }}
          >
            <CloseIcon size={16} />
          </button>
        </div>

        <form onSubmit={handleSaveHospital} style={{ display: "contents" }}>
          <div className="hc-dialog__body">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="hosp-name">
                  Hospital Name <span className="required-mark">*</span>
                </label>
                <input
                  ref={nameInputRef}
                  id="hosp-name"
                  type="text"
                  value={formState.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="hosp-contact">Contact Number</label>
                <input
                  id="hosp-contact"
                  type="tel"
                  value={formState.contactNumber}
                  onChange={(e) => handleFormChange("contactNumber", e.target.value)}
                />
              </div>

              <div className="form-group form-group--full">
                <label htmlFor="hosp-address">
                  Address <span className="required-mark">*</span>
                </label>
                <input
                  id="hosp-address"
                  type="text"
                  value={formState.address}
                  onChange={(e) => handleFormChange("address", e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="hosp-lat">Latitude</label>
                <input
                  id="hosp-lat"
                  type="number"
                  step="any"
                  value={formState.latitude}
                  onChange={(e) => handleFormChange("latitude", e.target.value)}
                  placeholder="e.g. 25.5941"
                />
              </div>

              <div className="form-group">
                <label htmlFor="hosp-lon">Longitude</label>
                <input
                  id="hosp-lon"
                  type="number"
                  step="any"
                  value={formState.longitude}
                  onChange={(e) => handleFormChange("longitude", e.target.value)}
                  placeholder="e.g. 85.1376"
                />
              </div>

              <div className="form-group">
                <label htmlFor="hosp-icu-avail">Available ICU Beds</label>
                <input
                  id="hosp-icu-avail"
                  type="number"
                  min="0"
                  value={formState.availableIcuBeds}
                  onChange={(e) => handleFormChange("availableIcuBeds", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="hosp-icu-total">Total ICU Beds</label>
                <input
                  id="hosp-icu-total"
                  type="number"
                  min="0"
                  value={formState.totalIcuBeds}
                  onChange={(e) => handleFormChange("totalIcuBeds", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="hosp-doctors">Available Doctors</label>
                <input
                  id="hosp-doctors"
                  type="number"
                  min="0"
                  value={formState.availableDoctors}
                  onChange={(e) => handleFormChange("availableDoctors", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="hosp-blood-bank">Blood Bank Status</label>
                <select
                  id="hosp-blood-bank"
                  value={String(formState.bloodBankAvailable)}
                  onChange={(e) => handleFormChange("bloodBankAvailable", e.target.value === "true")}
                >
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                </select>
              </div>
            </div>

            <fieldset style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "1rem", marginTop: "1.25rem" }}>
              <legend style={{ padding: "0 0.5rem", fontSize: "0.8125rem", fontWeight: 700, color: "var(--color-primary)" }}>
                Blood Inventory (Units)
              </legend>
              <div className="hc-blood-grid">
                {BLOOD_FIELDS.map(({ key, label }) => (
                  <div key={key}>
                    <label htmlFor={`hosp-${key}`} style={{ fontSize: "0.75rem" }}>
                      {label}
                    </label>
                    <input
                      id={`hosp-${key}`}
                      type="number"
                      min="0"
                      value={formState[key]}
                      onChange={(e) => handleFormChange(key, e.target.value)}
                      style={{ minBlockSize: "38px", padding: "0.375rem 0.625rem" }}
                    />
                  </div>
                ))}
              </div>
            </fieldset>

            <fieldset style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "1rem", marginTop: "1.25rem" }}>
              <legend style={{ padding: "0 0.5rem", fontSize: "0.8125rem", fontWeight: 700, color: "var(--color-primary)" }}>
                Supported Emergency Types <span className="required-mark">*</span>
              </legend>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {EMERGENCY_TYPES.map((type) => {
                  const checked = (formState.emergencyTypes || []).includes(type);
                  return (
                    <label
                      key={type}
                      className={`hc-pill-check ${checked ? "is-checked" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleEmergencyType(type)}
                      />
                      <span>{type}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {formError && (
              <div role="alert" className="hc-alert hc-alert--danger" style={{ marginTop: "1rem" }}>
                <AlertIcon size={18} />
                <span>{formError}</span>
              </div>
            )}
          </div>

          <div className="hc-dialog__footer">
            <button type="button" onClick={closeModal} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? "Saving..." : modalMode === "edit" ? "Save Changes" : "Create Hospital"}
            </button>
          </div>
        </form>
      </dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete hospital record?"
        message={
          deleteTarget
            ? `Are you sure you want to remove "${deleteTarget.name}" from the directory? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete Hospital"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <style>{`
        .hc-blood-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.75rem;
        }
        .hc-pill-check {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          margin: 0;
          padding: 0.375rem 0.75rem;
          border-radius: var(--radius-pill);
          border: 1px solid var(--color-border);
          background-color: var(--color-surface-subtle);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
        }
        .hc-pill-check.is-checked {
          background-color: var(--color-secondary-tint);
          border-color: var(--color-secondary);
          color: var(--color-primary);
        }

        @media (max-width: 560px) {
          .hc-blood-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
}

export default HospitalList;
