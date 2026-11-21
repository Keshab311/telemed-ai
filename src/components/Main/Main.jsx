import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { FaRegUserCircle } from "react-icons/fa";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "./Main.css";
import { assets } from "../../assets/assets";
import HamburgerMenu from "../Hamburger/Hamburger";
import { useAuth } from "../../context/AuthContext";

const SUGGESTIONS = [
  "How's your health today",
  "Symptoms of common cold",
  "Medicine for headache",
  "Feeling nauseous",
];

const Main = ({ messages, sending, loading, error, onDismissError, onSend }) => {
  const { user, displayName, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [notice, setNotice] = useState(null);
  const inputRef = useRef(null);
  const userMenuRef = useRef(null);
  const bottomRef = useRef(null);
  const speechBaseRef = useRef("");

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  // Keep the newest message in view.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  // While the mic is on, show what's being said after any text typed before.
  useEffect(() => {
    if (listening) {
      setInputValue([speechBaseRef.current, transcript].filter(Boolean).join(" "));
    }
  }, [transcript, listening]);

  // Close the user menu when clicking anywhere else.
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClick = (e) => {
      if (!userMenuRef.current?.contains(e.target)) setIsMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isMenuOpen]);

  const toggleListening = () => {
    if (!browserSupportsSpeechRecognition) {
      setNotice("Voice input isn't supported in this browser. Try Chrome or Edge.");
      return;
    }
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      speechBaseRef.current = inputValue.trim();
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || sending) return;
    if (listening) SpeechRecognition.stopListening();
    resetTranscript();
    setInputValue("");
    setNotice(null);
    const result = await onSend(text);
    if (result?.restoreInput) setInputValue(result.restoreInput);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const applySuggestion = (text) => {
    setInputValue(text);
    inputRef.current?.focus();
  };

  const handlePhotoUpload = (e) => {
    e.target.value = "";
    setNotice("Uploading medical records is coming in the next update.");
  };

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await signOut();
  };

  const showWelcome = messages.length === 0 && !loading;

  return (
    <div className="main">
      <div className="nav">
        <p>Medi-cate</p>
        <div className="user-menu" ref={userMenuRef}>
          <FaRegUserCircle
            className="user-icon"
            size={35}
            onClick={() => setIsMenuOpen((open) => !open)}
          />
          {isMenuOpen && (
            <HamburgerMenu
              email={user?.email}
              onLogout={handleLogout}
              onClose={() => setIsMenuOpen(false)}
            />
          )}
        </div>
      </div>

      <div className="main-container">
        {showWelcome ? (
          <>
            <div className="greet">
              <p>
                <span>Hello, {displayName}</span>
              </p>
              <p>How can I help you today</p>
            </div>
            <div className="cards">
              {SUGGESTIONS.map((text) => (
                <div className="card" key={text} onClick={() => applySuggestion(text)}>
                  <p>{text}</p>
                  <img src={assets.send_icon} alt="" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="messages">
            {loading && <p className="loading-chat">Loading chat…</p>}
            {messages.map((m) => (
              <div key={m.id} className={`message ${m.role}`}>
                {m.role === "assistant" && (
                  <img className="avatar" src={assets.gemini_icon} alt="" />
                )}
                <div className="bubble">
                  {m.role === "assistant" ? (
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}
            {sending && (
              <div className="message assistant">
                <img className="avatar spinning" src={assets.gemini_icon} alt="" />
                <div className="bubble typing" aria-label="Medi-cate is typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="main-bottom">
        {error && (
          <div className="banner error" role="alert">
            <span>{error}</span>
            <button onClick={onDismissError} aria-label="Dismiss">×</button>
          </div>
        )}
        {notice && (
          <div className="banner info">
            <span>{notice}</span>
            <button onClick={() => setNotice(null)} aria-label="Dismiss">×</button>
          </div>
        )}
        <div className="search-box">
          <input
            ref={inputRef}
            type="text"
            placeholder={listening ? "Listening… click the mic to stop" : "Enter a prompt here"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <label htmlFor="file-input" title="Upload a medical record">
            <img src={assets.gallery_icon} alt="Upload" />
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handlePhotoUpload}
          />
          <img
            src={assets.mic_icon}
            alt={listening ? "Stop voice input" : "Start voice input"}
            title={listening ? "Stop voice input" : "Voice input"}
            className={listening ? "mic listening" : "mic"}
            onClick={toggleListening}
          />
          <img
            src={assets.send_icon}
            alt="Send"
            title="Send"
            className={!inputValue.trim() || sending ? "send disabled" : "send"}
            onClick={handleSend}
          />
        </div>
        <p className="bottom-info">
          Medi-cate may display inaccurate info, we are working on it, so consult a doctor.
        </p>
      </div>
    </div>
  );
};

export default Main;
