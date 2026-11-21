import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import PasswordInput from "../AuthForm/PasswordInput";
import GoogleButton from "../AuthForm/GoogleButton";
import "../AuthForm/AuthForm.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null); // { type, text }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) setMessage({ type: "error", text: error.message });
    // On success the auth listener redirects to the chat.
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage({ type: "error", text: "Enter your email first, then click “Forgot password?”." });
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    setMessage(
      error
        ? { type: "error", text: error.message }
        : { type: "success", text: "Password reset email sent. Check your inbox." }
    );
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <p className="subtitle">Welcome back to Medi-cate</p>

        <label>
          <p className="field-title">EMAIL</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            autoComplete="email"
            required
          />
        </label>

        <label>
          <p className="field-title">PASSWORD</p>
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
          />
        </label>

        {message && <p className={`form-message ${message.type}`}>{message.text}</p>}

        <div className="links">
          <button type="button" className="link-button" onClick={handleForgotPassword}>
            Forgot password?
          </button>
          <Link to="/signup">New here? Register</Link>
        </div>

        <div className="buttons">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign In"}
          </button>
          <Link to="/signup" className="btn btn-secondary">
            Register
          </Link>
        </div>

        <div className="divider">or</div>
        <GoogleButton onError={(text) => setMessage({ type: "error", text })} />
      </form>
    </div>
  );
};

export default LoginForm;
