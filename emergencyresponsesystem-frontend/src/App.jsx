import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import HospitalList from "./pages/HospitalList";
import RequestEmergency from "./pages/RequestEmergency";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hospitals" element={<HospitalList />} />
        <Route path="/request-emergency" element={<RequestEmergency />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;