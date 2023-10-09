import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClose: () => void;
  type?: "success" | "info" | "warning" | "danger";
  dismissible?: boolean;
}

const Alert = ({ children, onClose, type = "danger", dismissible = true }: Props) => {
  const alertClass = `alert alert-${type}${dismissible ? " alert-dismissible" : ""}`;

  return (
    <div className={alertClass}>
      {children}
      {dismissible && (
        <button
          onClick={onClose}
          type="button"
          className="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
        ></button>
      )}
    </div>
  );
};

export default Alert;
