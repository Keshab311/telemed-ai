import React, { useState } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import HamburgerMenu from "../Hamburger/Hamburger";
import LoginForm from "../LoginForm/LoginForm"; // Import LoginForm

const Main = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false); // State to manage login form visibility

  const handleLogin = () => {
    // Logic for logging in
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Logic for logging out
    setIsAuthenticated(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the menu visibility
  };

  const toggleLoginForm = () => {
    setIsLoginFormOpen(!isLoginFormOpen); // Toggle the login form visibility
    setIsMenuOpen(false); // Close the hamburger menu when opening the login form
  };

  return (
    <div className="main">
      <div className="nav">
        <p>Medi-cate</p>
        <img src={assets.user_icon} alt="Settings" onClick={toggleMenu} />
        {/* Settings icon with onClick handler */}
        {isMenuOpen && (
          <HamburgerMenu
            isAuthenticated={isAuthenticated}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onOpenLoginForm={toggleLoginForm} // Pass the toggleLoginForm function
            onClose={() => setIsMenuOpen(false)} // Close the menu
          />
        )}
      </div>
      <div className="main-container">
        <div className="greet">
          <p>
            <span>Hello, Dev</span>
          </p>
          <p>How can I help you today</p>
        </div>
        <div className="cards">
          <div className="card">
            <p>How's your health today</p>
            <img src={assets.compass_icon} alt="" />
          </div>
          <div className="card">
            <p>Symptoms of common cold</p>
            <img src={assets.bulb_icon} alt="" />
          </div>
          <div className="card">
            <p>Medicine for headache</p>
            <img src={assets.message_icon} alt="" />
          </div>
          <div className="card">
            <p>Feeling nauseous</p>
            <img src={assets.code_icon} alt="" />
          </div>
        </div>

        <div className="main-bottom">
          <div className="search-box">
            <input type="text" placeholder="Enter a prompt here" />
            <div>
              <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" />
              <img src={assets.send_icon} alt="" />
            </div>
          </div>
          <p className="bottom-info">
            Medi-cate may display inaccurate info, we are working on it, so
            consult a doctor.
          </p>
        </div>
      </div>
      {/* Render the login form if isLoginFormOpen is true */}
      {isLoginFormOpen && <LoginForm onClose={toggleLoginForm} />}
    </div>
  );
};

export default Main;
