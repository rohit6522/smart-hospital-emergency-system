import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { AlertIcon, EyeIcon, EyeOffIcon, PulseLogoIcon } from "../components/Icons";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/login", formData);
      login(response.data);
      navigate("/");
    } catch {
      setError("Invalid username or password. Please verify your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hc-auth-shell">
      <div className="hc-card hc-auth-card">
        <div className="hc-auth-header">
          <PulseLogoIcon size={34} />
          <h1 style={{ margin: "0.75rem 0 0.25rem", fontSize: "1.5rem" }}>Sign in to SmartHospital</h1>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
            Access hospital management, patient triage, and dispatch tools
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-username">
              Username <span className="required-mark">*</span>
            </label>
            <input
              id="login-username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="next"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">
              Password <span className="required-mark">*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                enterKeyHint="done"
                placeholder="Enter your password"
                required
                style={{ paddingInlineEnd: "2.85rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-pressed={showPassword}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="hc-password-toggle"
              >
                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div role="alert" className="hc-alert hc-alert--danger" style={{ marginBottom: "1.125rem" }}>
              <AlertIcon size={18} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: "100%" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="hc-auth-footer">
          <p style={{ margin: "0 0 0.5rem", fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
            Don&apos;t have an account?{" "}
            <Link to="/signup" style={{ fontWeight: 600 }}>
              Create an account
            </Link>
          </p>
          <Link to="/" style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
            ← Back to Home
          </Link>
        </div>
      </div>

      <style>{`
        .hc-auth-shell {
          min-block-size: calc(100dvh - 140px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1rem;
        }
        .hc-auth-card {
          width: 100%;
          max-inline-size: 440px;
          padding: 2rem;
          border-top: 4px solid var(--color-primary);
        }
        .hc-auth-header {
          text-align: center;
          margin-bottom: 1.75rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .hc-password-toggle {
          position: absolute;
          inset-inline-end: 0.375rem;
          inset-block-start: 50%;
          transform: translateY(-50%);
          inline-size: 36px;
          block-size: 36px;
          border: none;
          background: transparent;
          color: var(--color-text-secondary);
          border-radius: var(--radius-sm);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .hc-password-toggle:hover {
          color: var(--color-primary);
          background-color: var(--color-surface-hover);
        }
        .hc-auth-footer {
          margin-top: 1.5rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--color-border);
          text-align: center;
        }
        @media (max-width: 480px) {
          .hc-auth-card {
            padding: 1.5rem 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;
