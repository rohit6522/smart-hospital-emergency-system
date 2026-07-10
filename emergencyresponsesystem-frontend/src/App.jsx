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

function App() {
  return (
    <BrowserRouter>
      <Navbar />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;