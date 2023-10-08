import React from "react";

interface Props {
  children?: string;
  color?: "primary" | "secondary" | "danger";
  onClick: () => void;
  style?: React.CSSProperties;
}

const Button = ({ children, color = "primary", onClick, style }: Props) => {
  return (
    <button onClick={onClick} className={"btn btn-" + color} style={style}>
      {children}
    </button>
  );
};

export default Button;
