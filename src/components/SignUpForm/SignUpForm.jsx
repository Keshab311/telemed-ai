import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom for routing
import "./SignUpForm.css";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5"; // Import eye icons

const SignUpForm = ({ onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Function to handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <div className="input-box">
          <label>
            <p className="email-title">EMAIL</p>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </label>
        </div>
        <div className="input-box">
          <label>
            <p className="password-title">PASSWORD</p>
            <input
              type={showPassword ? "text" : "password"} // Dynamic input type
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              required
            />
          </label>
          {/* Toggle button for password visibility */}
          {showPassword ? (
            <IoEyeOffOutline
              className="icon"
              onClick={togglePasswordVisibility}
            />
          ) : (
            <IoEyeOutline className="icon" onClick={togglePasswordVisibility} />
          )}
        </div>
        <div className="input-box">
          <label>
            <p className="password-title">CONFIRM PASSWORD</p>
            <input
              type={showPassword ? "text" : "password"} // Dynamic input type
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              required
            />
          </label>
          {/* Toggle button for password confirm visibility */}
          {showPassword ? (
            <IoEyeOffOutline
              className="icon"
              onClick={togglePasswordVisibility}
            />
          ) : (
            <IoEyeOutline className="icon" onClick={togglePasswordVisibility} />
          )}
        </div>
        <Link to="/login">
          <div className="already-registered">Already registered? Login</div>
        </Link>
        <div className="buttons">
          <div className="sign-up">Sign Up</div>
          <div className="login">Login</div>
        </div>
      </form>
      {/* Close button for the sign-up form */}
    </div>
  );
};

export default SignUpForm;
