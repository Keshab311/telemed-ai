import React, { useState } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { FaRegUserCircle } from "react-icons/fa";
import HamburgerMenu from "../Hamburger/Hamburger";
import LoginForm from "../LoginForm/LoginForm"; // Import LoginForm
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

//import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
//import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react"


const Main = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false); // State to manage login form visibility
  const [inputValue, setInputValue] = useState('');

  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: " ",
      sender: "Telemed-ai"
    }
  ])

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const { GoogleGenerativeAI } = require("@google/generative-ai");

  // Access your API key as an environment variable (see "Set up your API key" above)
  const genAI = new GoogleGenerativeAI("AIzaSyAzoWFUxkc5xtaz5PpkttVBGmGa1Dpqfow");
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  
  async function handleSend() {

    const result = await model.generateContent(inputValue);
    const response = await result.response;
    const text = response.text();
    console.log(text);
  }

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

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    // Handle the uploaded file here
  };

  // Speech recognition hooks
  const { transcript, resetTranscript } = useSpeechRecognition();

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  return (
    <div className="main">
      <div className="nav">
        <p>Medi-cate</p>
        <div className="user-icon"></div>
        <FaRegUserCircle className="user-icon" size={35} onClick={toggleMenu} />

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
            <img src={assets.send_icon} alt="" />
          </div>
          <div className="card">
            <p>Symptoms of common cold</p>
            <img src={assets.send_icon} alt="" />
          </div>
          <div className="card">
            <p>Medicine for headache</p>
            <img src={assets.send_icon} alt="" />
          </div>
          <div className="card">
            <p>Feeling nauseous</p>
            <img src={assets.send_icon} alt="" />
          </div>
        </div>

        <div className="main-bottom">
          <div className="search-box">
            <input type="text" placeholder="Enter a prompt here" onChange={handleInputChange} />
            <label htmlFor="file-input">
              <img src={assets.gallery_icon} alt="" />
            </label>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handlePhotoUpload}
            />
            <img src={assets.mic_icon} alt="" onClick={startListening} />
            <img src={assets.send_icon} alt="" onClick={handleSend} />
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
