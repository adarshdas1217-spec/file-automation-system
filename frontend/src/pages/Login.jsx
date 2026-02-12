import { useState } from "react";
import axios from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/auth/login", {
        email,
        password,
      });

      login(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* HEADER */}
        <div className="login-header">
          <div className="login-logo">
            <img
              src="/redcross.png"
              alt="Indian Red Cross Society Logo"
            />
          </div>

          <div className="login-title">
            Indian Red Cross Society
            <br />
            Tamil Nadu
          </div>

          <div className="login-subtitle">
            Authorized Access Only
          </div>
        </div>

        <div className="login-heading">Sign In</div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div className="form-group">
            <input
              type="email"
              className="login-input"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="form-group password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              className="login-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="eye-button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                /* eye-off */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.74-1.73 1.83-3.26 3.17-4.53M9.88 9.88a3 3 0 1 0 4.24 4.24M1 1l22 22" />
                </svg>
              ) : (
                /* eye */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          <div className="forgot-password">
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>

        <div className="login-footer">
          © Indian Red Cross Society – Tamil Nadu
        </div>
      </div>
    </div>
  );
}
