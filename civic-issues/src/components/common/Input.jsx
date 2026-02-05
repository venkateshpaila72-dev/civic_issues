import React from 'react';

/**
 * Reusable Input component with label, error state, and hint.
 */
const Input = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  hint,
  required = false,
  disabled = false,
  className = '',
  inputClassName = '',
  ...props
}) => {
  const inputId = `input-${name}`;

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {/* Input field */}
      <input
        id={inputId}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`input-field ${error ? 'input-error' : ''} ${inputClassName}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />

      {/* Error message */}
      {error && (
        <p id={`${inputId}-error`} className="input-error-msg" role="alert">
          {error}
        </p>
      )}

      {/* Hint text */}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="input-hint">
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;