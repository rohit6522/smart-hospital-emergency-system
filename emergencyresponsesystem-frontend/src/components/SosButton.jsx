import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { EmergencyIcon } from "./Icons";

function SosButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const [detecting, setDetecting] = useState(false);

  const hiddenOn = ["/request-emergency", "/login", "/signup"];
  if (hiddenOn.includes(location.pathname)) return null;

  const handleSOS = () => {
    if (!navigator.geolocation) {
      navigate("/request-emergency");
      return;
    }

    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lon = position.coords.longitude.toFixed(6);
        setDetecting(false);
        navigate(`/request-emergency?lat=${lat}&lon=${lon}&type=General&auto=true`);
      },
      () => {
        setDetecting(false);
        navigate("/request-emergency");
      },
      { timeout: 8000 }
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={handleSOS}
        disabled={detecting}
        className="sos-btn"
        aria-label="Emergency SOS - locate me and find the nearest hospital"
      >
        {detecting ? (
          <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>Locating…</span>
        ) : (
          <>
            <EmergencyIcon size={18} />
            <span style={{ fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "0.03em" }}>SOS</span>
          </>
        )}
      </button>

      <style>{`
        .sos-btn {
          position: fixed;
          inset-block-end: 1.5rem;
          inset-inline-end: 1.5rem;
          min-inline-size: 64px;
          block-size: 52px;
          padding: 0 1.125rem;
          border-radius: 999px;
          background-color: var(--color-danger);
          border: 2px solid #FFFFFF;
          color: #FFFFFF;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          z-index: 999;
          box-shadow: 0 4px 14px rgba(220, 38, 38, 0.35);
          transition: background-color 0.15s ease, transform 0.15s ease;
        }
        .sos-btn:hover:not(:disabled) {
          background-color: var(--color-danger-dark);
          transform: translateY(-2px);
        }
        .sos-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        @media (max-width: 640px) {
          .sos-btn {
            inset-block-end: 1rem;
            inset-inline-end: 1rem;
            block-size: 46px;
            padding: 0 0.95rem;
          }
        }
      `}</style>
    </>
  );
}

export default SosButton;
