import React, { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const PasswordInput = (props) => {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? IoEyeOffOutline : IoEyeOutline;
  return (
    <div className="password-field">
      <input {...props} type={visible ? "text" : "password"} />
      <button
        type="button"
        className="toggle-visibility"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        <Icon size={20} />
      </button>
    </div>
  );
};

export default PasswordInput;
