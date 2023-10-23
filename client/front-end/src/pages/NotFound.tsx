import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { JwtPayload } from "../AppRouter";

const NotFound: React.FC = () => {
  const accessToken = Cookies.get("accessToken");
  let role = "";
  let path = "/";
  if (accessToken) {
    const decodedToken: JwtPayload = jwt_decode(accessToken);
    role = decodedToken.role as string;
  }
  if (role === "Admin") {
    path = "/admin/Home";
  } else if (role === "Doctor") {
    path = "/doctor/Home";
  } else if (role === "Patient") {
    path = "/patient/Home";
  }

  const notFoundStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  };

  const contentStyle: React.CSSProperties = {
    textAlign: "center",
    backgroundColor: "#f7f7f7", // Use a subtle background color
    padding: "20px",
    borderRadius: "5px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
  };

  const h1Style: React.CSSProperties = {
    fontSize: "36px", // Larger font size for the title
    color: "#333",
  };

  const pStyle: React.CSSProperties = {
    fontSize: "18px", // Larger font size for the text
    color: "#555",
  };

  const linkStyle: React.CSSProperties = {
    textDecoration: "none",
    color: "#007BFF",
    fontWeight: "bold", // Make the link stand out
  };

  return (
    <div style={notFoundStyle}>
      <div style={contentStyle}>
        <h1 style={h1Style}>404 - Page Not Found</h1>
        <p style={pStyle}>
          Oops! It looks like you've reached a page that doesn't exist or has
          been removed.
        </p>
        <p style={pStyle}>
          Let's get you back to{" "}
          <Link to={path} style={linkStyle}>
            Homepage
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default NotFound;
