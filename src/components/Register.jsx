import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [serpApiKey, setSerpApiKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Placeholder: Persist locally so the app can use it later
      // Keep minimal per requirements; no backend wired here
      localStorage.setItem("jobscout_user_full_name", fullName);
      localStorage.setItem("jobscout_user_email", email);
      localStorage.setItem("jobscout_serpapi_key", serpApiKey);
      // Do not store password in localStorage in real apps; kept ephemeral here
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
        <h2 className="register-title">Create your account</h2>
        <div className="register-inputs">
          <div className="register-group full-row">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              className="register-input"
              placeholder="Jane Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

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
              autoComplete="new-password"
              minLength={6}
            />
          </div>

          <div className="register-group full-row">
            <label htmlFor="serpapi">SerpAPI Key</label>
            <input
              id="serpapi"
              type="text"
              className="register-input"
              placeholder="Enter your SerpAPI key"
              value={serpApiKey}
              onChange={(e) => setSerpApiKey(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="auth-switch">
          <p>Already have an account? <button type="button" className="auth-link" onClick={() => navigate("/login")}>Sign in</button></p>
        </div>

        <button className="register-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="loading-spinner">
              <span className="spinner" />
              Creating...
            </span>
          ) : (
            "Sign up"
          )}
        </button>
      </form>
    </div>
  );
}

export default Register;


