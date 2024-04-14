import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Main from "./components/Main/Main";
import LoginForm from "./components/LoginForm/LoginForm";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/login" element={<LoginFormLayout />} />
      </Routes>
    </Router>
  );
};

const MainLayout = () => {
  return (
    <>
      <Sidebar />
      <Main />
    </>
  );
};

const LoginFormLayout = () => {
  return <LoginForm />;
};

export default App;
