import React from "react";
import FormInput from "./FormInput";

const RegistrationForm = ({
  formData,
  errors,
  serverError,
  isSubmitting,
  handleFieldChange,
  handleFieldBlur,
  handleSubmit,
  canSubmit,
  onLoginClick,
}) => {
  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2 className="register-title">Create your account</h2>

      {serverError && (
        <div className="register-error-banner" role="alert" aria-live="polite">
          {serverError}
        </div>
      )}

      <div className="register-inputs">
        <FormInput
          id="fullName"
          label="Full Name"
          type="text"
          placeholder="Jane Doe"
          value={formData.fullName}
          onChange={(value) => handleFieldChange("fullName", value)}
          onBlur={(value) => handleFieldBlur("fullName", value)}
          error={errors.fullName}
          required
          autoComplete="name"
          tooltipText="Full name must be between 2 and 100 characters."
          className="full-row"
          autoFocus={true}
        />

        <FormInput
          id="email"
          label="Email"
          type="email"
          placeholder="jane@example.com"
          value={formData.email}
          onChange={(value) => handleFieldChange("email", value)}
          onBlur={(value) => handleFieldBlur("email", value)}
          error={errors.email}
          required
          autoComplete="email"
          tooltipText="Enter a valid email."
        />

        <FormInput
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(value) => handleFieldChange("password", value)}
          onBlur={(value) => handleFieldBlur("password", value)}
          error={errors.password}
          required
          autoComplete="new-password"
          minLength={6}
          tooltipText="At least 6 characters, include both letters and numbers."
        />

        <FormInput
          id="serpapi"
          label="SerpAPI Key"
          type="text"
          placeholder="Enter your SerpAPI key"
          value={formData.serpApiKey}
          onChange={(value) => handleFieldChange("serpApiKey", value)}
          onBlur={(value) => handleFieldBlur("serpApiKey", value)}
          error={errors.serpApiKey}
          required
          tooltipText="SerpApi Key should be Valid. Get it from https://serpapi.com/users/sign_up?plan=free"
          className="full-row"
        />
      </div>

      <div className="auth-switch">
        <p>
          Already have an account?{" "}
          <button type="button" className="auth-link" onClick={onLoginClick}>
            Sign in
          </button>
        </p>
        <p>
          Get a free SerpAPI key{" "}
          <a
            href="https://serpapi.com/users/sign_up?plan=free"
            className="auth-link"
            target="_blank"
          >
            from SerpAPI
          </a>
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
          "Sign up"
        )}
      </button>
    </form>
  );
};

export default RegistrationForm;
