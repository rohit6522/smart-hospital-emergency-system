import { useState, useEffect } from "react";
import { AlertIcon } from "./Icons";

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
      role="alert"
      style={{
        position: "sticky",
        insetBlockStart: 0,
        zIndex: 2000,
        backgroundColor: "var(--color-danger)",
        color: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        padding: "0.5rem 1rem",
        fontSize: "0.875rem",
        fontWeight: 600,
      }}
    >
      <AlertIcon size={16} />
      <span>You are currently offline. Live routing and fleet updates require an active connection.</span>
    </div>
  );
}

export default OfflineBanner;
