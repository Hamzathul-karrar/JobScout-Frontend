import React from "react";
import { useLoginForm } from "../../hooks/useLoginForm";
import LoginForm from "./LoginForm";
import "../Register/Register.css";

function Login() {
  const {
    formData,
    errors,
    serverError,
    isSubmitting,
    handleFieldChange,
    handleFieldBlur,
    handleSubmit,
    canSubmit,
    navigate,
  } = useLoginForm();

  return (
    <div className="register-container">
      <div className="register-back">
        <button onClick={() => navigate("/")}>← Back</button>
      </div>

      <LoginForm
        formData={formData}
        errors={errors}
        serverError={serverError}
        isSubmitting={isSubmitting}
        handleFieldChange={handleFieldChange}
        handleFieldBlur={handleFieldBlur}
        handleSubmit={handleSubmit}
        canSubmit={canSubmit}
        onRegisterClick={() => navigate("/register")}
      />
    </div>
  );
}

export default Login;
