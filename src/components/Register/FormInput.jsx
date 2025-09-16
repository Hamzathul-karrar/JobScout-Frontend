import React from "react";

const FormInput = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  autoComplete,
  minLength,
  tooltipText,
  className = "",
  autoFocus = false,
}) => {
  return (
    <div className={`register-group ${className}`}>
      <label htmlFor={id}>{label}</label>
      <div className="input-with-tooltip">
        <input
          id={id}
          type={type}
          className={`register-input ${error ? "input-error" : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onBlur && onBlur(e.target.value)}
          required={required}
          autoComplete={autoComplete}
          minLength={minLength}
          autoFocus={autoFocus}
        />
        <span className="tooltip-icon" aria-label={`${label} requirements`} tabIndex={0}>
          <i>i</i>
        </span>
        <div className="tooltip-content">{tooltipText}</div>
      </div>
    </div>
  );
};

// Wrapped with React.memo to prevent unnecessary re-renders
export default React.memo(FormInput);
