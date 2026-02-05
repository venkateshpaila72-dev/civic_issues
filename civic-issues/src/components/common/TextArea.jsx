import React from 'react';

/**
 * TextArea component with label, error, and hint.
 */
const TextArea = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  hint,
  required = false,
  disabled = false,
  rows = 4,
  className = '',
  textAreaClassName = '',
  ...props
}) => {
  const textAreaId = `textarea-${name}`;

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label htmlFor={textAreaId} className="input-label">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {/* TextArea */}
      <textarea
        id={textAreaId}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        rows={rows}
        className={`input-field resize-y ${error ? 'input-error' : ''} ${textAreaClassName}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${textAreaId}-error` : hint ? `${textAreaId}-hint` : undefined}
        {...props}
      />

      {/* Error */}
      {error && (
        <p id={`${textAreaId}-error`} className="input-error-msg" role="alert">
          {error}
        </p>
      )}

      {/* Hint */}
      {hint && !error && (
        <p id={`${textAreaId}-hint`} className="input-hint">
          {hint}
        </p>
      )}
    </div>
  );
};

export default TextArea;