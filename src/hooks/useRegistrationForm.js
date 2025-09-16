import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../utils/api";
import { toast } from "react-hot-toast";
import { sanitizeErrorMessage } from "../utils/errorSanitizer";

export const useRegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    serpApiKey: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    serpApiKey: "",
  });
  const [serverError, setServerError] = useState("");

  // Memoized validation functions for better performance
  const validationFunctions = useMemo(() => ({
    validateFullName: (value) => {
      const v = value.trim();
      if (v.length < 2 || v.length > 100) return "Full name must be between 2 and 100 characters.";
      return "";
    },

    validateEmailField: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
      if (!emailRegex.test(value.trim())) return "Please enter a valid email address.";
      return "";
    },

    validatePasswordField: (value) => {
      const hasMinLength = value.length >= 6;
      const hasLetter = /[A-Za-z]/.test(value);
      const hasNumber = /\d/.test(value);
      if (!(hasMinLength && hasLetter && hasNumber)) {
        return "Password must be at least 6 characters and contain letters and numbers.";
      }
      return "";
    },

    validateSerpKeyField: (value) => {
      const len = value.trim().length;
      if (len < 10 || len > 100) return "SerpAPI key appears invalid.";
      return "";
    }
  }), []);

  const validate = useCallback(() => {
    const nextErrors = {
      fullName: validationFunctions.validateFullName(formData.fullName),
      email: validationFunctions.validateEmailField(formData.email),
      password: validationFunctions.validatePasswordField(formData.password),
      serpApiKey: validationFunctions.validateSerpKeyField(formData.serpApiKey),
    };

    setErrors(nextErrors);
    return nextErrors;
  }, [formData, validationFunctions]);

  // Validate single field - used for onBlur validation
  const validateField = useCallback((field, value) => {
    let fieldError = "";
    switch (field) {
      case "fullName":
        fieldError = validationFunctions.validateFullName(value);
        break;
      case "email":
        fieldError = validationFunctions.validateEmailField(value);
        break;
      case "password":
        fieldError = validationFunctions.validatePasswordField(value);
        break;
      case "serpApiKey":
        fieldError = validationFunctions.validateSerpKeyField(value);
        break;
      default:
        break;
    }
    return fieldError;
  }, [validationFunctions]);

  // Handle field changes (no validation on change, only state update)
  const handleFieldChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing again
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  }, [errors]);

  // Handle field blur - lazy validation
  const handleFieldBlur = useCallback((field, value) => {
    const fieldError = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: fieldError }));
  }, [validateField]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const validation = validate();
    const hasErrors = Object.values(validation).some(Boolean);
    if (hasErrors) {
      return;
    }
    setIsSubmitting(true);
    setServerError("");
    
    try {
      const response = await apiCall('/auth/register', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          serpapiKey: formData.serpApiKey,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Registration failed. Please try again.";
        
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage = sanitizeErrorMessage(errorData.message);
          }
        } catch (parseError) {
          console.warn("Failed to parse error response:", parseError);
        }
        
        setServerError(errorMessage);
        return;
      }

      // Success
      toast.success(`Registration successful! Welcome ${formData.fullName}!`);
      navigate("/login");

    } catch (error) {
      console.error("Network or unexpected error:", error);
      
      let errorMessage = "Registration failed. Please check your connection and try again.";
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        errorMessage = "Failed to connect to the server. Please try again later.";
      } else if (error.message) {
        errorMessage = sanitizeErrorMessage(error.message);
      }
      
      setServerError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validate, navigate]);

  // Check if form can be submitted
  const canSubmit = useCallback(() => {
    const noFieldEmpty = formData.fullName && formData.email && formData.password && formData.serpApiKey;
    const noErrors = !errors.fullName && !errors.email && !errors.password && !errors.serpApiKey;
    return Boolean(noFieldEmpty && noErrors);
  }, [formData, errors]);

  return {
    formData,
    errors,
    serverError,
    isSubmitting,
    handleFieldChange,
    handleFieldBlur,
    handleSubmit,
    canSubmit,
    navigate,
  };
};
