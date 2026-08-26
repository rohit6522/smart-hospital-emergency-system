# 🚑 AI-Powered Smart Hospital Emergency Response & Routing System

An intelligent, full-stack emergency healthcare platform that identifies the **nearest and most suitable hospital** in seconds — factoring in real-time distance, ICU bed availability, blood bank status, doctor availability, and emergency type — while providing live ambulance tracking, digital patient records, and role-based hospital administration.

🔗 **Live Demo:** [smart-hospital-frontend-wcd3.onrender.com](https://smart-hospital-frontend-wcd3.onrender.com/)
📦 **Repository:** [github.com/rohit6522/smart-hospital-emergency-system](https://github.com/rohit6522/smart-hospital-emergency-system)

> ⚠️ Hosted on free-tier infrastructure — the backend may take 30–60 seconds to "wake up" on the first request after inactivity.

---

## 📖 Overview

Emergency medical response is often delayed by a simple but critical problem: **which hospital should the patient go to right now?** Distance alone isn't enough — a nearby hospital might have no ICU beds, no blood bank, or no doctor available for the specific emergency type.

This system solves that by combining **geolocation, resource availability, and a weighted scoring algorithm** to recommend the best-suited hospital in real time, then visualizes the route on an interactive map — all while keeping ambulance fleets and patient records synchronized live across every connected client.

---

## ✨ Key Features

### 🎯 Intelligent Hospital Matching
- Calculates real-world distance using the **Haversine formula**
- Scores every hospital using a weighted algorithm combining distance, available ICU beds, blood bank status, doctor availability, and emergency-type match
- Returns a ranked list with the best match clearly highlighted

### 🗺️ Interactive Map & Routing
- Built on **OpenStreetMap + Leaflet** (no API key required)
- Displays patient location, all candidate hospitals, and a routed line to the best match
- Fully responsive map view for mobile devices

### 🚑 Real-Time Ambulance Tracking
- Live ambulance status updates pushed instantly to every connected user via **WebSocket (STOMP + SockJS)**
- Dynamic **🟢 Live / 🔴 Offline** connection indicator
- Admins can update ambulance status and location on the fly

### 🏥 Hospital & Resource Management
- Admins can add, edit, and delete hospital records — including live ICU bed counts, doctor availability, and blood bank status — directly from the UI
- Reflects real-world hospitals data changing minute-to-minute

### 🧑‍⚕️ Digital Patient Records
- Centralized patient medical history (allergies, conditions, blood group, emergency contacts) for faster triage

### 🔐 Secure Authentication & Role-Based Access
- JWT-based authentication with **BCrypt** password hashing
- Two roles — `PUBLIC` and `ADMIN` — enforced at the backend (not just the UI)
- Public signups can **never** self-assign admin privileges; admin accounts are provisioned securely
- Admin-only actions: hospital/patient/ambulance create, update, delete

### 🔔 Push Notifications
- **Firebase Cloud Messaging** integration — browser notifications fire the moment an emergency request is submitted

### 📊 Admin Analytics Dashboard
- Live summary cards (total hospitals, patients, ambulances, ICU capacity, emergency requests)
- Visual breakdowns via **pie and bar charts** (Recharts) — emergency type distribution, ambulance status

### 📱 Fully Responsive, Modern UI
- Custom **glassmorphism design** — frosted-glass cards, gradient backgrounds, smooth fade-in animations
- Mobile-first navigation with an animated hamburger menu
- Tables, forms, and maps all adapt gracefully across screen sizes

### 💓 Uptime & Reliability
- Dedicated `/api/health` endpoint monitored via **UptimeRobot** to minimize cold-start delays

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js (Vite), React Router, Axios |
| **Backend** | Java, Spring Boot, Spring Security, Spring Data JPA |
| **Database** | MySQL (hosted on Aiven) |
| **Real-Time** | WebSocket — STOMP over SockJS |
| **Authentication** | JWT (JJWT) + BCrypt |
| **Maps** | OpenStreetMap + Leaflet / React-Leaflet |
| **Notifications** | Firebase Cloud Messaging (FCM) |
| **Charts** | Recharts |
| **Deployment** | Render (frontend + backend), Aiven (MySQL) |
| **Monitoring** | UptimeRobot |
| **Version Control** | Git & GitHub |

---

## 🧠 Core Algorithm

For every emergency request, the backend:

1. Fetches all registered hospitals
2. Computes distance from the patient's coordinates to each hospital using the **Haversine formula** (great-circle distance)
3. Calculates a **suitability score** per hospital:

```
score = 100
      − (distance × 2)
      + (availableIcuBeds × 3)
      + (bloodBankAvailable ? 10 : 0)
      + (availableDoctors × 2)
      + (emergencyType matches ? 25 : 0)
```

4. Sorts hospitals by score (descending) and returns the ranked list — the top result is the recommended hospital

---

## 📂 Project Structure

```
smart-hospital-system/
├── emergencyresponsesystem/              # Spring Boot backend
│   ├── src/main/java/com/smarthospital/emergencyresponsesystem/
│   │   ├── entity/           # Hospital, Ambulance, Patient, EmergencyRequest, User
│   │   ├── repository/       # Spring Data JPA repositories
│   │   ├── service/          # Business logic (incl. nearest-hospital scoring)
│   │   ├── controller/       # REST controllers
│   │   ├── config/           # Security, JWT, WebSocket configuration
│   │   └── dto/               # Request/response data transfer objects
│   └── src/main/resources/application.properties
│
└── emergencyresponsesystem-frontend/     # React (Vite) frontend
    └── src/
        ├── pages/            # Home, Hospitals, RequestEmergency, Patients, Ambulances, Dashboard, Auth
        ├── components/       # Navbar, AdminRoute
        ├── context/          # AuthContext
        └── services/         # api.js, websocket.js
```

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Java 17+, Maven
- Node.js 18+
- MySQL instance (local or cloud)

### Backend
```bash
cd emergencyresponsesystem
# Configure src/main/resources/application.properties with your DB credentials
mvn clean install
mvn spring-boot:run
```
Backend runs at `http://localhost:8080`

### Frontend
```bash
cd emergencyresponsesystem-frontend
npm install
```
Create a `.env` file:
```
VITE_API_URL=http://localhost:8080/api
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_VAPID_KEY=your_vapid_key
```
```bash
npm run dev
```
Frontend runs at `http://localhost:5173`

---

## 🎯 Project Outcomes

- ✅ Finds the nearest and most suitable hospital within seconds
- ✅ Reduces ambulance response time through optimized, data-driven routing
- ✅ Provides real-time ambulance tracking across all connected clients
- ✅ Displays live ICU bed, blood bank, and doctor availability before dispatch
- ✅ Maintains digital patient medical history for faster emergency treatment
- ✅ Improves emergency healthcare coordination through role-based, secure administration

---

## 🔮 Future Enhancements

- Road-network-aware routing (OSRM) instead of straight-line distance
- One-tap SOS button for zero-form emergency requests
- Blood-group-specific inventory tracking
- SMS alerts to emergency contacts (Twilio)
- Predictive hospital capacity modeling

---

## 👤 Author

**Rohit Kumar**
Self-conceived project inspired by real-world emergency healthcare systems and modern navigation technologies.

---

## 📄 License

This project is open source and available for educational use.
