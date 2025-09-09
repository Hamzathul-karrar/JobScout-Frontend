import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      localStorage.setItem("jobscout_user_email", email);
      navigate("/search-jobs");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-back">
        <button onClick={() => navigate("/")}>← Back</button>
      </div>

      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="register-title">Sign in to your account</h2>
        <div className="login-inputs"> {/* Changed from register-inputs to login-inputs */}
          <div className="register-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="register-input"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="register-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="register-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              minLength={6}
            />
          </div>
        </div>

        <div className="auth-switch">
          <p>Don't have an account? <button type="button" className="auth-link" onClick={() => navigate("/register")}>Sign up</button></p>
        </div>

        <button className="register-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="loading-spinner">
              <span className="spinner" />
              Signing in...
            </span>
          ) : (
            "Sign in"
          )}
        </button>
      </form>
    </div>
  );
}

export default Login;
