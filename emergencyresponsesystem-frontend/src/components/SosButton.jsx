import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function SosButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const [detecting, setDetecting] = useState(false);

  // Don't show SOS button on the request-emergency page itself (already there) or auth pages
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
        onClick={handleSOS}
        disabled={detecting}
        className="sos-btn"
        aria-label="Emergency SOS - one tap to find nearest hospital"
      >
        {detecting ? (
          <span style={{ fontSize: "11px", fontWeight: "700" }}>Locating…</span>
        ) : (
          <>
            <span style={{ fontSize: "20px", lineHeight: 1 }}>🚨</span>
            <span style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "0.5px" }}>SOS</span>
          </>
        )}
      </button>

      <style>{`
        .sos-btn {
          position: fixed;
          bottom: 26px;
          right: 26px;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e63946, #c1121f);
          border: 3px solid rgba(255,255,255,0.85);
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1px;
          cursor: pointer;
          z-index: 999;
          box-shadow: 0 6px 20px rgba(230,57,70,0.5);
          animation: sosPulse 1.8s infinite;
          transition: transform 0.15s ease;
        }
        .sos-btn:hover {
          transform: scale(1.08);
        }
        .sos-btn:active {
          transform: scale(0.96);
        }
        @keyframes sosPulse {
          0% { box-shadow: 0 6px 20px rgba(230,57,70,0.5), 0 0 0 0 rgba(230,57,70,0.55); }
          70% { box-shadow: 0 6px 20px rgba(230,57,70,0.5), 0 0 0 16px rgba(230,57,70,0); }
          100% { box-shadow: 0 6px 20px rgba(230,57,70,0.5), 0 0 0 0 rgba(230,57,70,0); }
        }
        @media (max-width: 600px) {
          .sos-btn {
            width: 56px;
            height: 56px;
            bottom: 18px;
            right: 18px;
          }
        }
      `}</style>
    </>
  );
}

export default SosButton;