import React from "react";

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  isValid?: boolean;
  errorMessage?: string;
  touched?: boolean;
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
}) => {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}:</label>
      <div className="input-container">
        <input
          className={`form-control ${touched && !isValid ? "is-invalid" : ""}`}
          type={type}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          required
        />
        {touched && !isValid && (
          <div className="invalid-feedback">{errorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default InputField;
