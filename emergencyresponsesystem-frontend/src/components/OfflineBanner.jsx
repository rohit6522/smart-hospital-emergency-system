import { useState, useEffect } from "react";

function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      className="offline-banner"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        background: "#e63946",
        color: "white",
        textAlign: "center",
        padding: "8px",
        fontSize: "13px",
        fontWeight: "600",
        zIndex: 2000,
      }}
    >
      ⚠️ You are offline. Some features may not work until connection is restored.
    </div>
  );
}

export default OfflineBanner;