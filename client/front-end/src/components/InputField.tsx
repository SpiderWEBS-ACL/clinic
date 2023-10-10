import React from "react";

interface InputFieldProps {
  id: string;
  label?: string;
  type: string;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  isValid?: boolean;
  errorMessage?: string;
  touched?: boolean;
  disabled?: boolean;
  options?: string[];
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type,
  value,
  onChange,
  onBlur,
  isValid,
  errorMessage,
  touched,
  disabled,
  options,
}) => {
  const renderInput = () => {
    if (type === "select" && options) {
      return (
        <div>
          {" "}
          {/* Wrap select and arrow in a container */}
          <select
            className={`form-control ${
              touched && !isValid ? "is-invalid" : ""
            }`}
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            disabled={disabled}
            required
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select> 
        </div>
      );
    } else {
      return (
        <input
          className={`form-control ${touched && !isValid ? "is-invalid" : ""}`}
          type={type === "select" ? "text" : type}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          required
        />
      );
    }
  };

  return (
    <div className="form-group">
      <label htmlFor={id}>
        <strong>{label}:</strong>
      </label>
      <div className="input-container">
        {renderInput()}
        {touched && !isValid && (
          <div className="invalid-feedback">{errorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default InputField;
