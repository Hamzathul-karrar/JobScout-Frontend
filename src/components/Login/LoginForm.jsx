import React from "react";
import FormInput from "./FormInput";

const LoginForm = React.memo(({
  formData,
  errors,
  serverError,
  isSubmitting,
  handleFieldChange,
  handleFieldBlur,
  handleSubmit,
  canSubmit,
  onRegisterClick,
}) => {
  return (
    <form className="register-form" onSubmit={handleSubmit} noValidate>
      <h2 className="register-title">Sign in to your account</h2>
      
      {serverError && (
        <div className="register-error-banner" role="alert" aria-live="polite">
          {serverError}
        </div>
      )}
      
      <div className="login-inputs">
        <FormInput
          id="email"
          label="Email"
          type="email"
          className={`register-input ${errors.email ? "input-error" : ""}`}
          placeholder="jane@example.com"
          value={formData.email}
          onChange={(value) => handleFieldChange("email", value)}
          onBlur={(value) => handleFieldBlur("email", value)}
          error={errors.email}
          required
          autoComplete="email"
        />
        
        <FormInput
          id="password"
          label="Password"
          type="password"
          className={`register-input ${errors.password ? "input-error" : ""}`}
          placeholder="••••••••"
          value={formData.password}
          onChange={(value) => handleFieldChange("password", value)}
          onBlur={(value) => handleFieldBlur("password", value)}
          error={errors.password}
          required
          autoComplete="current-password"
          minLength={6}
        />
      </div>
      
      <div className="auth-switch">
        <p>
          Don't have an account?{" "}
          <button type="button" className="auth-link" onClick={onRegisterClick}>
            Sign up
          </button>
        </p>
      </div>
      
      <button
        className="register-button"
        type="submit"
        disabled={isSubmitting || !canSubmit()}
      >
        {isSubmitting ? (
          <span className="loading-spinner">
            <span className="spinner" />
          </span>
        ) : (
          "Sign in"
        )}
      </button>
    </form>
  );
});

LoginForm.displayName = 'LoginForm';

export default LoginForm;
