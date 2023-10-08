import React from "react";

const Home = () => {
  const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
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
    <div style={containerStyle}>
      <h1 style={headingStyle}>Welcome, Admin!</h1>
    </div>
  );
};

export default Home;
