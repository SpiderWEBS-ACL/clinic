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
  required?: boolean;
}

const InputField2: React.FC<InputFieldProps> = ({
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
  required
}) => {
  const renderInput = () => {
    if (type === "select" && options) {
      return (
        <label className="label">
        <span className="span">{label}</span> 
        <div>
          {" "}
          {/* Wrap select and arrow in a container */}
          <select
            className="input"
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
          >
            <option value="" disabled selected>Select Gender</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select> 
        </div>
        </label>
      );
    }
    else if (type == "tel") {
        return (
            <label className="label">
            <span className="span">{label}</span> 
            <input
                className="input"
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                disabled={disabled}
                required={required}
                type="tel"
                pattern="/^([+]\d{1})?\d{11}$/"
              />
            </label>)
        } 
    else {
      return (
        <label className="label">
        <span className="span">{label}</span> 
           <input
            className="input"
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            type={type === "select" ? "text" : type}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
          />
        </label>
      );
    }
  };

  return (
    <div className="form-group">
         <div className="input-container">
        {renderInput()}
        {touched && !isValid && (
            <div className="text-danger" style={{textAlign: "center"}}>
                <small>{errorMessage}</small>
            </div>
        )}
      </div>
    </div>
  );
};

export default InputField2;
