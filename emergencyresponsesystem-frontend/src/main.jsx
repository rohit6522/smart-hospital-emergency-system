
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./leafletIconFix.js";
import "leaflet/dist/leaflet.css";
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered:", registration);
    })
    .catch((err) => {
      console.error("Service Worker registration failed:", err);
    });
}
