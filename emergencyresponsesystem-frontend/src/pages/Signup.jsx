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
    <div
      className="responsive-container"
      style={{
        minHeight: "calc(100vh - 70px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="animate-float"
        style={{
          position: "absolute",
          top: "12%",
          right: "10%",
          width: "230px",
          height: "230px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(42,157,143,0.14), transparent 70%)",
          filter: "blur(10px)",
        }}
      />
      <div
        className="animate-float"
        style={{
          position: "absolute",
          bottom: "10%",
          left: "8%",
          width: "240px",
          height: "240px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(230,57,70,0.1), transparent 70%)",
          filter: "blur(10px)",
          animationDelay: "1s",
        }}
      />

      <div className="glass-card animate-fade-up" style={{ maxWidth: "420px", width: "100%", padding: "40px 34px", position: "relative" }}>
        <h1 style={{ textAlign: "center", fontSize: "26px", marginBottom: "6px", fontWeight: "800" }}>📝 Sign Up</h1>
        <p style={{ textAlign: "center", color: "#6c757d", marginBottom: "28px", fontSize: "14px" }}>
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
              style={{ width: "100%", padding: "11px 14px", marginTop: "6px" }}
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
              style={{ width: "100%", padding: "11px 14px", marginTop: "6px" }}
            />
          </div>

          <div style={{ marginBottom: "22px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#444" }}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "11px 14px", marginTop: "6px" }}
            />
          </div>

          {error && <p style={{ color: "#e63946", fontSize: "14px", marginBottom: "16px" }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              background: "linear-gradient(135deg, #2a9d8f, #21867a)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(42, 157, 143, 0.35)",
            }}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#6c757d" }}>
          Already have an account? <Link to="/login" style={{ color: "#457b9d", fontWeight: "700" }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;