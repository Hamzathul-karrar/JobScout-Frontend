import React from "react";
import { useRegistrationForm } from "../../hooks/useRegistrationForm";
import RegistrationForm from "./RegistrationForm";
import "./Register.css";

function Register() {
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
  } = useRegistrationForm();

  return (
    <div className="register-container">
      <div className="register-back">
        <button onClick={() => navigate("/")}>← Back</button>
      </div>

      <RegistrationForm
        formData={formData}
        errors={errors}
        serverError={serverError}
        isSubmitting={isSubmitting}
        handleFieldChange={handleFieldChange}
        handleFieldBlur={handleFieldBlur}
        handleSubmit={handleSubmit}
        canSubmit={canSubmit}
        onLoginClick={() => navigate("/login")}
      />
    </div>
  );
}

export default Register;
