import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    role: "PUBLIC",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/signup", formData);
      login(response.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data || "Signup failed. Try a different username.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="responsive-container" style={{ maxWidth: "420px", margin: "60px auto", padding: "20px" }}>
      <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "36px 30px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        <h1 style={{ textAlign: "center", fontSize: "24px", marginBottom: "6px" }}>📝 Sign Up</h1>
        <p style={{ textAlign: "center", color: "#6c757d", marginBottom: "26px", fontSize: "14px" }}>
          Create your account
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#444" }}>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "10px 12px", marginTop: "6px" }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#444" }}>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "10px 12px", marginTop: "6px" }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#444" }}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "10px 12px", marginTop: "6px" }}
            />
          </div>

          

          {error && <p style={{ color: "#e63946", fontSize: "14px", marginBottom: "16px" }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#2a9d8f",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#6c757d" }}>
          Already have an account? <Link to="/login" style={{ color: "#457b9d", fontWeight: "600" }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
