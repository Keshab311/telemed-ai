import React, { useState } from "react";
import "./LoginForm.css";
import { GoogleLoginButton } from "react-social-login-buttons";
import { LoginSocialGoogle } from "reactjs-social-login";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5"; // Import eye icons

const LoginForm = ({ onClose }) => {
  const [showPassword, setShowPassword] = useState(false);

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="wrapper">
      <form action="">
        <h1>Login</h1>
        <div className="input-box">
          <label>
            <p className="email-title">EMAIL</p>
            <input type="email" placeholder="Enter your email" required />
          </label>
        </div>
        <div className="input-box">
          <label>
            <p className="password-title">PASSWORD</p>
            <input
              type={showPassword ? "text" : "password"} // Dynamic input type
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
        <div className="remember-forgot">
          <a href="#">
            <p className="forgot-text">Forgot Password?</p>
          </a>
          <a href="#">
            <p className="newon-text">New to TeleMed.ai?</p>
          </a>
        </div>
        <div className="buttons">
          <div className="sign-in">Sign In</div>
          <div className="register">Register</div>
        </div>
        <div className="divider">
          <hr />
        </div>
        <div className="google-login">
          <LoginSocialGoogle
            client_id={
              "363654929530-tfivsl76a3dj5e1v7h8v77ib2ae3htle.apps.googleusercontent.com"
            }
            scope="openid profile email"
            discoveryDocs="claims_supported"
            access_type="offline"
            onResolve={({ provider, data }) => {
              console.log(provider, data);
            }}
            onReject={(err) => {
              console.log(err);
            }}
          >
            <GoogleLoginButton />
          </LoginSocialGoogle>
        </div>
      </form>
      {/* Close button for the login form */}
    </div>
  );
};

export default LoginForm;
