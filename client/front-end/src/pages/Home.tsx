import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {

  const navigate = useNavigate();

  const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
  };

  const headingStyle: React.CSSProperties = {
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "36px",
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    textTransform: "uppercase",
    padding: "20px",
    border: "2px solid gray",
    borderRadius: "10px",
    backgroundColor: "#f0f0f0",
  };

  return (
    <div className="container">
    <div style={containerStyle}>
      <h1 style={headingStyle}>Welcome, Admin!</h1>
    </div>

    <div style={{ display: "flex" }}>
    <button
      style={{ marginLeft: "auto", marginRight: "20px" }}
      className="btn btn-danger"
      type="button"
      onClick={()=> {navigate("/admin/changePassword")}}
    >
      Change Password
    </button>
  </div>
    </div>
  );
};

export default Home;
