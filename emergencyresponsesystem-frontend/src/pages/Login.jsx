import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
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
      const response = await api.post("/auth/login", formData);
      login(response.data);
      navigate("/");
    } catch (err) {
      setError("Invalid username or password.");
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
          top: "10%",
          left: "8%",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(230,57,70,0.12), transparent 70%)",
          filter: "blur(10px)",
        }}
      />
      <div
        className="animate-float"
        style={{
          position: "absolute",
          bottom: "8%",
          right: "10%",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(69,123,157,0.14), transparent 70%)",
          filter: "blur(10px)",
          animationDelay: "1.2s",
        }}
      />

      <div className="glass-card animate-fade-up" style={{ maxWidth: "420px", width: "100%", padding: "40px 34px", position: "relative" }}>
        <h1 style={{ textAlign: "center", fontSize: "26px", marginBottom: "6px", fontWeight: "800" }}>🔐 Login</h1>
        <p style={{ textAlign: "center", color: "#6c757d", marginBottom: "28px", fontSize: "14px" }}>
          Sign in to access your account
        </p>

        <form onSubmit={handleSubmit}>
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
              background: "linear-gradient(135deg, #e63946, #c1121f)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(230, 57, 70, 0.35)",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#6c757d" }}>
          Don't have an account? <Link to="/signup" style={{ color: "#457b9d", fontWeight: "700" }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;