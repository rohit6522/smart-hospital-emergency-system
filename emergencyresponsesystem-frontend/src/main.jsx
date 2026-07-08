
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./leafletIconFix.js";
import "leaflet/dist/leaflet.css";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
