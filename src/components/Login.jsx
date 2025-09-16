import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast"; 
import { apiCall } from "../utils/api";
import "./Register/Register.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [serverError, setServerError] = useState("");

  const validateEmail = (value) => {
    const trimmed = value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!trimmed) return "Email is required";
    if (!emailRegex.test(trimmed)) return "Please provide a valid email address";
    return "";
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const validate = () => {
    const next = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(next);
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    const validation = validate();
    const hasErrors = Object.values(validation).some(Boolean);
    if (hasErrors) return;
    
    setIsSubmitting(true);
    setServerError("");
    
    try {
      const response = await apiCall('/auth/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password }),
      });

      if (!response.ok) {
        const message = response.status === 401
          ? "Invalid email or password."
          : "Unable to sign in right now. Please try again.";
        setServerError(message);
        return;
      }

      // Success - parse response and store user data
      const userData = await response.json();
      login(userData);
      
      toast.success("Login successful!"); 

      // Small delay to ensure state updates before navigation
      setTimeout(() => {
        navigate("/"); // Navigate to home page instead of going back
      }, 100);
    } catch (error) {
      console.error("Login error:", error);
      setServerError("An unexpected error occurred. Please try again.");
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
        {serverError && (
          <div className="register-error-banner" role="alert" aria-live="polite">{serverError}</div>
        )}
        <div className="login-inputs"> {/* Changed from register-inputs to login-inputs */}
          <div className="register-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className={`register-input ${errors.email ? "input-error" : ""}`}
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => {
                const val = e.target.value;
                setEmail(val);
                setErrors((prev) => ({ ...prev, email: validateEmail(val) }));
              }}
              required
              autoComplete="email"
            />
          </div>

          <div className="register-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className={`register-input ${errors.password ? "input-error" : ""}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                const val = e.target.value;
                setPassword(val);
                setErrors((prev) => ({ ...prev, password: validatePassword(val) }));
              }}
              required
              autoComplete="current-password"
              minLength={6}
            />
          </div>
        </div>

        <div className="auth-switch">
          <p>Don't have an account? <button type="button" className="auth-link" onClick={() => navigate("/register")}>Sign up</button></p>
        </div>

        {(() => {
          const noEmpty = email && password;
          const noErrors = !errors.email && !errors.password;
          const canSubmit = Boolean(noEmpty && noErrors);
          return (
            <button 
              className="register-button" 
              type="submit" 
              disabled={isSubmitting || !canSubmit}
            >
              {isSubmitting ? (
                <span className="loading-spinner">
                  <span className="spinner" />
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          );
        })()}
      </form>
    </div>
  );
}

export default Login;
