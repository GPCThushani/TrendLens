import React from "react";
import logo from "../assets/logo.png"; // relative path from Header.js

const Header = ({ isDarkMode, setIsDarkMode }) => {
  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: isDarkMode ? "#777C6D" : "#CBCBCB",
    color: "#000B58",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  };

  const logoStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const logoImageStyle = {
    width: "100px",
    height: "100px",
    objectFit: "contain",
    borderRadius: "8px",
    backgroundColor: "#fff", 
  };

  const toggleButtonStyle = {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    backgroundColor: isDarkMode ? "#778873" : "#777C6D",
    color: "#fff",
  };

  return (
    <header style={headerStyle}>
      <div style={logoStyle}>
        <img src={logo} alt="TrendLens Logo" style={logoImageStyle} />
        <h2>TrendLens</h2>
      </div>
      <button
        style={toggleButtonStyle}
        onClick={() => setIsDarkMode(!isDarkMode)}
      >
        {isDarkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </header>
  );
};

export default Header;
