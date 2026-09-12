import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import HospitalList from "./pages/HospitalList";
import RequestEmergency from "./pages/RequestEmergency";
import PatientList from "./pages/PatientList";
import AddPatient from "./pages/AddPatient";
import AmbulanceList from "./pages/AmbulanceList";
import AddAmbulance from "./pages/AddAmbulance";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import Footer from "./components/Footer";
import SosButton from "./components/SosButton";
import ChatbotWidget from "./components/ChatbotWidget";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

function PageTitleUpdater() {
  const location = useLocation();
  useEffect(() => {
    const titles = {
      "/": "Home | SmartHospital",
      "/hospitals": "Hospitals | SmartHospital",
      "/request-emergency": "Request Emergency | SmartHospital",
      "/patients": "Patients | SmartHospital",
      "/ambulances": "Ambulances | SmartHospital",
      "/dashboard": "Dashboard | SmartHospital",
      "/login": "Login | SmartHospital",
      "/signup": "Sign Up | SmartHospital",
    };
    document.title = titles[location.pathname] || "SmartHospital";
  }, [location.pathname]);
  return null;
}
function App() {
  return (
    <BrowserRouter>
      <PageTitleUpdater />
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hospitals" element={<HospitalList />} />
        <Route path="/request-emergency" element={<RequestEmergency />} />
        <Route path="/patients" element={<PatientList />} />
        <Route path="/ambulances" element={<AmbulanceList />} />
        <Route path="/patients/add" element={<AdminRoute><AddPatient /></AdminRoute>} />
        <Route path="/ambulances/add" element={<AdminRoute><AddAmbulance /></AdminRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      </Routes>
      <Footer />
      <SosButton />
      <ChatbotWidget />
    </BrowserRouter>
  );
}

export default App;