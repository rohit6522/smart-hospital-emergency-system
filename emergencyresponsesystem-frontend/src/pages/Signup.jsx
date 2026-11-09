import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  AlertIcon,
  CloseIcon,
  EyeIcon,
  EyeOffIcon,
  KeyIcon,
  PatientIcon,
  PulseLogoIcon,
  UserIcon,
  UsersIcon,
} from "../components/Icons";

function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
  });
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
      const response = await api.post("/auth/signup", formData);
      login(response.data);
      navigate("/");
    } catch (err) {
      const message =
        typeof err.response?.data === "string" && err.response.data.trim()
          ? err.response.data
          : "Signup failed. Please try a different username.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hc-auth-shell">
      <div className="hc-card hc-auth-card">
        <div className="hc-auth-top">
          <div>
            <div className="hc-auth-brand-row">
              <PulseLogoIcon size={22} />
              <span>SmartHospital Portal</span>
            </div>
            <h1 className="hc-auth-title">Create your account.</h1>
            <p className="hc-auth-subtitle">
              Register for public emergency access, hospital lookup, and live ambulance tracking.
            </p>
          </div>
          <Link
            to="/"
            className="hc-auth-close"
            aria-label="Close sign up and return home"
          >
            <CloseIcon size={18} />
          </Link>
        </div>

        <div className="badge badge-info hc-signup-role-badge">
          <UsersIcon size={15} />
          <span>Account Role: Public User (Standard Access)</span>
        </div>

        <form onSubmit={handleSubmit} method="post">
          <div className="form-group">
            <label htmlFor="signup-fullname">
              Full Name <span className="required-mark">*</span>
            </label>
            <div className="hc-input-wrap">
              <span className="hc-input-icon" aria-hidden="true">
                <PatientIcon size={17} />
              </span>
              <input
                id="signup-fullname"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                autoComplete="name"
                enterKeyHint="next"
                placeholder="e.g. Rohit Kumar"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="signup-username">
              Username <span className="required-mark">*</span>
            </label>
            <div className="hc-input-wrap">
              <span className="hc-input-icon" aria-hidden="true">
                <UserIcon size={17} />
              </span>
              <input
                id="signup-username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="next"
                placeholder="Choose a unique username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="signup-password">
              Password <span className="required-mark">*</span>
            </label>
            <div className="hc-input-wrap hc-input-wrap--password">
              <span className="hc-input-icon" aria-hidden="true">
                <KeyIcon size={17} />
              </span>
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                enterKeyHint="done"
                placeholder="Create a strong password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-pressed={showPassword}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-describedby="signup-password-toggle-note"
                className="hc-password-toggle"
              >
                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
              <span id="signup-password-toggle-note" className="visually-hidden">
                Warning: this will display your password on the screen.
              </span>
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
            className="btn btn-primary btn-lg btn-block"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="hc-auth-divider">
          <span>or</span>
        </div>

        <Link to="/login" className="btn btn-outline btn-lg btn-block">
          Sign in to an existing account
        </Link>

        <div className="hc-auth-footer">
          <p style={{ margin: 0 }}>
            Hospital staff or administrator?{" "}
            <Link to="/login?role=admin">Sign in as Admin</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
