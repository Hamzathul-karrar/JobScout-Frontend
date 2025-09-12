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
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    serpApiKey: "",
  });

  const validateFullName = (value) => {
    const v = value.trim();
    if (v.length < 2 || v.length > 100) return "Full name must be between 2 and 100 characters.";
    return "";
  };

  const validateEmailField = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!emailRegex.test(value.trim())) return "Please enter a valid email address.";
    return "";
  };

  const validatePasswordField = (value) => {
    const hasMinLength = value.length >= 6;
    const hasLetter = /[A-Za-z]/.test(value);
    const hasNumber = /\d/.test(value);
    if (!(hasMinLength && hasLetter && hasNumber)) {
      return "Password must be at least 6 characters and contain letters and numbers.";
    }
    return "";
  };

  const validateSerpKeyField = (value) => {
    const len = value.trim().length;
    if (len < 10 || len > 100) return "SerpAPI key appears invalid.";
    return "";
  };

  const validate = () => {
    const nextErrors = {
      fullName: validateFullName(fullName),
      email: validateEmailField(email),
      password: validatePasswordField(password),
      serpApiKey: validateSerpKeyField(serpApiKey),
    };

    setErrors(nextErrors);
    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate();
    const hasErrors = Object.values(validation).some(Boolean);
    if (hasErrors) {
      return;
    }
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
            <div className="input-with-tooltip">
              <input
                id="fullName"
                type="text"
                className={`register-input ${errors.fullName ? "input-error" : ""}`}
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => {
                  const val = e.target.value;
                  setFullName(val);
                  setErrors((prev) => ({ ...prev, fullName: validateFullName(val) }));
                }}
                required
                autoComplete="name"
              />
              <span className="tooltip-icon" aria-label="Full name requirements" tabIndex={0}>?</span>
              <div className="tooltip-content">Full name must be between 2 and 100 characters.</div>
            </div>
          </div>

          <div className="register-group">
            <label htmlFor="email">Email</label>
            <div className="input-with-tooltip">
              <input
                id="email"
                type="email"
                className={`register-input ${errors.email ? "input-error" : ""}`}
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => {
                  const val = e.target.value;
                  setEmail(val);
                  setErrors((prev) => ({ ...prev, email: validateEmailField(val) }));
                }}
                required
                autoComplete="email"
              />
              <span className="tooltip-icon" aria-label="Email requirements" tabIndex={0}>?</span>
              <div className="tooltip-content">Enter a valid email.</div>
            </div>
          </div>

          <div className="register-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-tooltip">
              <input
                id="password"
                type="password"
                className={`register-input ${errors.password ? "input-error" : ""}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  const val = e.target.value;
                  setPassword(val);
                  setErrors((prev) => ({ ...prev, password: validatePasswordField(val) }));
                }}
                required
                autoComplete="new-password"
                minLength={6}
              />
              <span className="tooltip-icon" aria-label="Password requirements" tabIndex={0}>?</span>
              <div className="tooltip-content">At least 6 characters, include both letters and numbers.</div>
            </div>
          </div>

          <div className="register-group full-row">
            <label htmlFor="serpapi">SerpAPI Key</label>
            <div className="input-with-tooltip">
              <input
                id="serpapi"
                type="text"
                className={`register-input ${errors.serpApiKey ? "input-error" : ""}`}
                placeholder="Enter your SerpAPI key"
                value={serpApiKey}
                onChange={(e) => {
                  const val = e.target.value;
                  setSerpApiKey(val);
                  setErrors((prev) => ({ ...prev, serpApiKey: validateSerpKeyField(val) }));
                }}
                required
              />
              <span className="tooltip-icon" aria-label="SerpAPI key requirements" tabIndex={0}>?</span>
              <div className="tooltip-content">SerpApi Key should be Valid.</div>
            </div>
          </div>
        </div>

        <div className="auth-switch">
          <p>Already have an account? <button type="button" className="auth-link" onClick={() => navigate("/login")}>Sign in</button></p>
        </div>

        {(() => {
          const noFieldEmpty = fullName && email && password && serpApiKey;
          const noErrors = !errors.fullName && !errors.email && !errors.password && !errors.serpApiKey;
          const canSubmit = Boolean(noFieldEmpty && noErrors);
          return (
            <button className="register-button" type="submit" disabled={isSubmitting || !canSubmit}>
              {isSubmitting ? (
                <span className="loading-spinner">
                  <span className="spinner" />
                  Creating...
                </span>
              ) : (
                "Sign up"
              )}
            </button>
          );
        })()}
      </form>
    </div>
  );
}

export default Register;


