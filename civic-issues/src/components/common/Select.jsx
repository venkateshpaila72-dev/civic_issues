import React from 'react';

/**
 * Select dropdown component with label and error state.
 */
const Select = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  placeholder = 'Select...',
  error,
  hint,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const selectId = `select-${name}`;

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label htmlFor={selectId} className="input-label">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {/* Select */}
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`input-field ${error ? 'input-error' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Error */}
      {error && (
        <p id={`${selectId}-error`} className="input-error-msg" role="alert">
          {error}
        </p>
      )}

      {/* Hint */}
      {hint && !error && (
        <p id={`${selectId}-hint`} className="input-hint">
          {hint}
        </p>
      )}
    </div>
  );
};

export default Select;