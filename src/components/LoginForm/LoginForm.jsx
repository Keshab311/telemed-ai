import React, { useState, useEffect } from "react";
import "./LoginForm.css";
import { Link } from "react-router-dom";
import { GoogleLoginButton } from "react-social-login-buttons";
import { LoginSocialGoogle } from "reactjs-social-login";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { supabase } from "../../lib/helper/supabaseclients";
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

const LoginForm = ({ onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [session, setSession] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  async function handleSubmit(e){
    e.preventDefault()
    try{
      const { user, session, error } = await supabase.auth.signIn({
        email: formData.email,
        password: formData.password,
      })
      if(error) throw error
      alert('User logged in successfully')
    } catch (error){
      alert (error)
    }
  }
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  function handleChange(event) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value
      };
    });
  }

  if (!session) {
    return (<Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />);
  } else {
    return (<div>Logged in!</div>);
  }

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div className="input-box">
          <label>
            <p className="email-title">EMAIL</p>
            <input type="email" placeholder="Enter your email" onChange={handleChange} required />
          </label>
        </div>
        <div className="input-box">
          <label>
            <p className="password-title">PASSWORD</p>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </label>
          {showPassword ? (
            <IoEyeOffOutline className="icon" onClick={togglePasswordVisibility} />
          ) : (
            <IoEyeOutline className="icon" onClick={togglePasswordVisibility} />
          )}
        </div>
        <div className="remember-forgot">
          <a href="#">
            <p className="forgot-text">Forgot Password?</p>
          </a>
          <Link to="/signup" className="newon-link">
            <p className="newon-text">New to TeleMed.ai? Register</p>
          </Link>
        </div>
        <div className="buttons">
          <button type="submit" className="sign-in">Sign In</button>
          <Link to="/signup" className="register">
            Register
          </Link>
        </div>
        <div className="divider">
          <hr />
        </div>
        <div className="google-login">
          <LoginSocialGoogle
            client_id="363654929530-tfivsl76a3dj5e1v7h8v77ib2ae3htle.apps.googleusercontent.com"
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
    </div>
  );
};

export default LoginForm;
