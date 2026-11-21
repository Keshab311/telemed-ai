import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import "./Sidebar.css";
import { assets } from "../../assets/assets";

const Sidebar = ({ conversations, activeId, onSelect, onNewChat, onDelete }) => {
  const [extended, setExtended] = useState(false);

  const confirmDelete = (e, conversation) => {
    e.stopPropagation();
    if (window.confirm(`Delete “${conversation.title}”?`)) onDelete(conversation.id);
  };

  return (
    <div className={`sidebar ${extended ? "extended" : ""}`}>
      <div className="top">
        <img
          onClick={() => setExtended((prev) => !prev)}
          className="menu"
          src={assets.menu_icon}
          alt="Toggle sidebar"
        />
        <div className="new-chat" onClick={onNewChat} title="New chat">
          <img src={assets.plus_icon} alt="" />
          {extended ? <p>New Chat</p> : null}
        </div>
        {extended ? (
          <div className="recent">
            <p className="recent-title">Recent</p>
            {conversations.length === 0 && (
              <p className="recent-empty">Your chats will appear here.</p>
            )}
            {conversations.map((c) => (
              <div
                key={c.id}
                className={`recent-entry ${c.id === activeId ? "active" : ""}`}
                onClick={() => onSelect(c.id)}
                title={c.title}
              >
                <img src={assets.message_icon} alt="" />
                <p>{c.title}</p>
                <button
                  className="delete-chat"
                  onClick={(e) => confirmDelete(e, c)}
                  aria-label={`Delete ${c.title}`}
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img src={assets.question_icon} alt="" />
          {extended ? <p>Help</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt="" />
          {extended ? <p>Activity</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="" />
          {extended ? <p>Settings</p> : null}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
