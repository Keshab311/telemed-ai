import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ChatPage from "./components/ChatPage/ChatPage";
import LoginForm from "./components/LoginForm/LoginForm";
import SignUpForm from "./components/SignUpForm/SignUpForm";

// Only logged-in users can reach the chat.
const RequireAuth = ({ children }) => {
  const { session, loading } = useAuth();
  if (loading) return null;
  return session ? children : <Navigate to="/login" replace />;
};

// Logged-in users skip the login and sign-up pages.
const GuestOnly = ({ children }) => {
  const { session, loading } = useAuth();
  if (loading) return null;
  return session ? <Navigate to="/" replace /> : children;
};

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<RequireAuth><ChatPage /></RequireAuth>} />
        <Route path="/login" element={<GuestOnly><LoginForm /></GuestOnly>} />
        <Route path="/signup" element={<GuestOnly><SignUpForm /></GuestOnly>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
