import React from "react";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "../../lib/supabaseClient";

// Google sign-in through Supabase. The Google provider must be enabled in
// Supabase: Authentication -> Providers -> Google.
const GoogleButton = ({ onError }) => {
  const handleClick = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) onError(error.message);
  };

  return (
    <button type="button" className="btn btn-google" onClick={handleClick}>
      <FcGoogle size={22} /> Continue with Google
    </button>
  );
};

export default GoogleButton;
