import React from "react";

const FormInput = React.memo(({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  required = false,
  autoComplete,
  minLength,
  className = "",
  autoFocus = false,
}) => {
  const handleChange = React.useCallback((e) => {
    onChange(e.target.value);
  }, [onChange]);

  const handleBlur = React.useCallback((e) => {
    onBlur(e.target.value);
  }, [onBlur]);

  return (
    <div className="register-group">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={className}
        required={required}
        autoComplete={autoComplete}
        minLength={minLength}
        autoFocus={autoFocus}
      />
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;
