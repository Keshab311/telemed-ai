import React from "react";
import "./Hamburger.css";

const HamburgerMenu = ({ isAuthenticated, onLogin, onLogout, onClose }) => {
  // Function to handle login action
  const handleLogin = () => {
    // Open login page in a new tab
    window.open("/login", "_blank");
    // Close the hamburger menu
    onClose();
  };

  return (
    <div className="hamburger-menu">
      {/* Toggle between "Login" and "Logout" based on authentication status */}
      {isAuthenticated ? (
        <div className="menu-item" onClick={onLogout}>
          Logout
        </div>
      ) : (
        <div className="menu-item" onClick={handleLogin}>
          Login
        </div>
      )}
      <div className="menu-item">About</div>
      <div className="menu-item" onClick={onClose}>
        Close
      </div>
    </div>
  );
};

export default HamburgerMenu;
