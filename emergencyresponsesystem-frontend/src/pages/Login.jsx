import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  AlertIcon,
  CloseIcon,
  EyeIcon,
  EyeOffIcon,
  KeyIcon,
  PulseLogoIcon,
  ShieldIcon,
  UserIcon,
  UsersIcon,
} from "../components/Icons";

const ROLE_OPTIONS = [
  {
    value: "PUBLIC",
    label: "Public User",
    subtitle: "Sign in to access hospital directories and emergency dispatch.",
    placeholder: "Enter your username",
    icon: UsersIcon,
  },
  {
    value: "ADMIN",
    label: "Admin",
    subtitle: "Sign in to manage hospitals, ambulances, patients, and analytics.",
    placeholder: "Enter admin username",
    icon: ShieldIcon,
  },
];

function Login() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { login } = useAuth();

  const initialRole = searchParams.get("role")?.toUpperCase() === "ADMIN" ? "ADMIN" : "PUBLIC";
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [mismatchRole, setMismatchRole] = useState(null);
  const [loading, setLoading] = useState(false);

  const activeRoleMeta =
    ROLE_OPTIONS.find((opt) => opt.value === selectedRole) || ROLE_OPTIONS[0];

  const handleRoleSelect = (roleValue) => {
    setSelectedRole(roleValue);
    setError(null);
    setMismatchRole(null);
    if (roleValue === "ADMIN") {
      setSearchParams({ role: "admin" }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) {
      setError(null);
      setMismatchRole(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMismatchRole(null);
    try {
      const response = await api.post("/auth/login", formData);
      const accountRole = (response.data?.role || "").toUpperCase();

      if (accountRole && accountRole !== selectedRole) {
        const expectedLabel = accountRole === "ADMIN" ? "Admin" : "Public User";
        const currentLabel = selectedRole === "ADMIN" ? "Admin" : "Public User";
        setMismatchRole(accountRole);
        setError(
          `This account has ${expectedLabel} access, not ${currentLabel}. Switch to the ${expectedLabel} tab to sign in.`
        );
        return;
      }

      login(response.data);
      navigate(accountRole === "ADMIN" ? "/dashboard" : "/");
    } catch {
      setError("Invalid username or password. Please verify your credentials and try again.");
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
            <h1 className="hc-auth-title">Welcome back.</h1>
            <p className="hc-auth-subtitle">{activeRoleMeta.subtitle}</p>
          </div>
          <Link
            to="/"
            className="hc-auth-close"
            aria-label="Close sign in and return home"
          >
            <CloseIcon size={18} />
          </Link>
        </div>

        {/* Role Selector Tabs */}
        <div className="hc-role-switch" role="group" aria-label="Select sign-in role">
          {ROLE_OPTIONS.map((option) => {
            const Icon = option.icon;
            const active = selectedRole === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleRoleSelect(option.value)}
                aria-pressed={active}
                className={`hc-role-tab ${active ? "is-active" : ""}`}
              >
                <Icon size={16} />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} method="post">
          <div className="form-group">
            <label htmlFor="login-username">
              Username <span className="required-mark">*</span>
            </label>
            <div className="hc-input-wrap">
              <span className="hc-input-icon" aria-hidden="true">
                <UserIcon size={17} />
              </span>
              <input
                id="login-username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="next"
                placeholder={activeRoleMeta.placeholder}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="login-password">
              Password <span className="required-mark">*</span>
            </label>
            <div className="hc-input-wrap hc-input-wrap--password">
              <span className="hc-input-icon" aria-hidden="true">
                <KeyIcon size={17} />
              </span>
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
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-pressed={showPassword}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-describedby="login-password-toggle-note"
                className="hc-password-toggle"
              >
                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
              <span id="login-password-toggle-note" className="visually-hidden">
                Warning: this will display your password on the screen.
              </span>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="hc-alert hc-alert--danger"
              style={{ marginBottom: "1.125rem", flexDirection: mismatchRole ? "column" : "row" }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem" }}>
                <AlertIcon size={18} />
                <span>{error}</span>
              </div>
              {mismatchRole && (
                <button
                  type="button"
                  onClick={() => handleRoleSelect(mismatchRole)}
                  className="btn btn-outline btn-sm"
                  style={{ alignSelf: "flex-start", backgroundColor: "var(--color-card)" }}
                >
                  Switch to {mismatchRole === "ADMIN" ? "Admin" : "Public User"}
                </button>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg btn-block"
          >
            {loading
              ? "Signing in..."
              : selectedRole === "ADMIN"
                ? "Sign in as Admin"
                : "Sign in as Public User"}
          </button>
        </form>

        <div className="hc-auth-divider">
          <span>or</span>
        </div>

        {selectedRole === "PUBLIC" ? (
          <Link to="/signup" className="btn btn-outline btn-lg btn-block">
            Create a free account
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => handleRoleSelect("PUBLIC")}
            className="btn btn-outline btn-lg btn-block"
          >
            Continue to Public User login
          </button>
        )}

        <div className="hc-auth-footer">
          {selectedRole === "PUBLIC" ? (
            <p style={{ margin: 0 }}>
              Need urgent dispatch?{" "}
              <Link to="/request-emergency">Request emergency match</Link>
            </p>
          ) : (
            <p style={{ margin: 0 }}>
              Need a patient account?{" "}
              <Link to="/signup">Create a free account</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
