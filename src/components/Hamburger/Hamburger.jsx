import React from "react";
import "./Hamburger.css";

const HamburgerMenu = ({ email, onLogout, onClose }) => (
  <div className="hamburger-menu">
    {email && <div className="menu-email">{email}</div>}
    <div className="menu-item" onClick={onLogout}>
      Logout
    </div>
    <div className="menu-item" onClick={onClose}>
      Close
    </div>
  </div>
);

export default HamburgerMenu;
