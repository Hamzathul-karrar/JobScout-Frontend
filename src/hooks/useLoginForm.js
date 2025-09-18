import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { apiCall } from "../utils/api";
import { sanitizeErrorMessage } from "../utils/errorSanitizer";

//Validation functions
export const validateEmail = (value) => {
  const trimmed = value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  if (!trimmed) return "Email is required";
  if (!emailRegex.test(trimmed)) return "Please provide a valid email address";
  return "";
};

export const validatePassword = (value) => {
  if (!value) return "Password is required";
  if (value.length < 6) return "Password must be at least 6 characters";
  return "";
};

//Login form hook
export const useLoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // Memoized validation functions for better performance
  const validationFunctions = useMemo(() => ({
    validateEmailField: (value) => {
      return validateEmail(value);
    },
    validatePasswordField: (value) => {
      return validatePassword(value);
    }
  }), []);

  const validate = useCallback(() => {
    const nextErrors = {
      email: validationFunctions.validateEmailField(formData.email),
      password: validationFunctions.validatePasswordField(formData.password),
    };
    setErrors(nextErrors);
    return nextErrors;
  }, [formData, validationFunctions]);

  // Validate single field - used for onBlur validation
  const validateField = useCallback((field, value) => {
    let fieldError = "";
    switch (field) {
      case "email":
        fieldError = validationFunctions.validateEmailField(value);
        break;
      case "password":
        fieldError = validationFunctions.validatePasswordField(value);
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
    
    if (isSubmitting) return;
    
    const validation = validate();
    const hasErrors = Object.values(validation).some(Boolean);
    if (hasErrors) {
      return;
    }

    setIsSubmitting(true);
    setServerError("");

    try {
      const response = await apiCall('/auth/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      if (!response.ok) {
        let errorMessage = "Login failed. Please try again.";
        
        if (response.status === 401) {
          errorMessage = "Invalid email or password.";
        } else {
          try {
            const errorData = await response.json();
            if (errorData && errorData.message) {
              errorMessage = sanitizeErrorMessage(errorData.message);
            }
          } catch (parseError) {
            console.warn("Failed to parse error response:", parseError);
            errorMessage = "Unable to sign in right now. Please try again.";
          }
        }
        
        setServerError(errorMessage);
        return;
      }

      // Success
      const userData = await response.json();
      login(userData);
      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/");
      }, 100);
    } catch (error) {
      console.error("Network or unexpected error:", error);
      
      let errorMessage = "Login failed. Please check your connection and try again.";
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        errorMessage = "Failed to connect to the server. Please try again later.";
      } else if (error.message) {
        errorMessage = sanitizeErrorMessage(error.message);
      }
      
      setServerError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validate, login, navigate, isSubmitting]);

  // Check if form can be submitted
  const canSubmit = useCallback(() => {
    const noFieldEmpty = formData.email && formData.password;
    const noErrors = !errors.email && !errors.password;
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
