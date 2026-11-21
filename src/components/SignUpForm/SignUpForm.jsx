import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import PasswordInput from "../AuthForm/PasswordInput";
import GoogleButton from "../AuthForm/GoogleButton";
import "../AuthForm/AuthForm.css";

const MIN_PASSWORD_LENGTH = 8;

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null); // { type, text }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (formData.password.length < MIN_PASSWORD_LENGTH) {
      setMessage({ type: "error", text: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords don't match." });
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { full_name: formData.name.trim() },
        emailRedirectTo: window.location.origin,
      },
    });
    setSubmitting(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else if (!data.session) {
      // Email confirmation is on: the user must click the link first.
      setMessage({
        type: "success",
        text: "Account created! Check your email for a confirmation link, then log in.",
      });
    }
    // With a session, the auth listener redirects to the chat.
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Sign Up</h1>

        <label>
          <p className="field-title">FULL NAME</p>
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            autoComplete="name"
            required
          />
        </label>

        <label>
          <p className="field-title">EMAIL</p>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            autoComplete="email"
            required
          />
        </label>

        <label>
          <p className="field-title">PASSWORD</p>
          <PasswordInput
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder={`Password (min. ${MIN_PASSWORD_LENGTH} characters)`}
            autoComplete="new-password"
            required
          />
        </label>

        <label>
          <p className="field-title">CONFIRM PASSWORD</p>
          <PasswordInput
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm password"
            autoComplete="new-password"
            required
          />
        </label>

        {message && <p className={`form-message ${message.type}`}>{message.text}</p>}

        <div className="links">
          <span />
          <Link to="/login">Already registered? Login</Link>
        </div>

        <div className="buttons">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Creating account…" : "Sign Up"}
          </button>
          <Link to="/login" className="btn btn-secondary">
            Login
          </Link>
        </div>

        <div className="divider">or</div>
        <GoogleButton onError={(text) => setMessage({ type: "error", text })} />
      </form>
    </div>
  );
};

export default SignUpForm;
