import React from "react";

const Footer = ({ isDarkMode }) => {
  const footerStyle = {
    padding: "20px",
    textAlign: "center",
    backgroundColor: isDarkMode ? "#1f1f1f" : "#333", // matching header colors
    color: "#fff",
    marginTop: "40px",
  };

  const linkStyle = {
    margin: "0 10px",
    color: "#fff",
    textDecoration: "underline",
    cursor: "pointer",
    background: "none",
    border: "none",
    fontSize: "14px",
  };

  return (
    <footer style={footerStyle}>
      <button style={linkStyle} onClick={() => alert("Privacy Policy page")}>
        Privacy Policy
      </button>
      |
      <button style={linkStyle} onClick={() => alert("Terms page")}>
        Terms
      </button>
      |
      <button style={linkStyle} onClick={() => alert("Contact page")}>
        Contact
      </button>
    </footer>
  );
};

export default Footer;
