import React, { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Main from "../Main/Main";
import {
  deleteConversation,
  listConversations,
  listMessages,
  sendMessage,
} from "../../lib/chatApi";

// Owns the chat state shared by the sidebar (conversation list) and the
// main area (messages + input).
const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);

  // Lets async callbacks know whether the user switched chats meanwhile.
  const activeIdRef = useRef(null);
  const selectActive = (id) => {
    activeIdRef.current = id;
    setActiveId(id);
  };

  const refreshConversations = useCallback(async () => {
    try {
      setConversations(await listConversations());
    } catch (e) {
      setError(`Couldn't load your chats: ${e.message}`);
    }
  }, []);

  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  const handleSelect = async (id) => {
    if (id === activeIdRef.current) return;
    selectActive(id);
    setMessages([]);
    setError(null);
    setLoadingMessages(true);
    try {
      const data = await listMessages(id);
      if (activeIdRef.current === id) setMessages(data);
    } catch (e) {
      if (activeIdRef.current === id) setError(`Couldn't load this chat: ${e.message}`);
    } finally {
      if (activeIdRef.current === id) setLoadingMessages(false);
    }
  };

  const handleNewChat = () => {
    selectActive(null);
    setMessages([]);
    setError(null);
  };

  const handleDelete = async (id) => {
    try {
      await deleteConversation(id);
      setConversations((list) => list.filter((c) => c.id !== id));
      if (activeIdRef.current === id) handleNewChat();
    } catch (e) {
      setError(`Couldn't delete the chat: ${e.message}`);
    }
  };

  const handleSend = async (text) => {
    const startedIn = activeIdRef.current;
    const tempId = `temp-${Date.now()}`;
    setError(null);
    setSending(true);
    setMessages((list) => [...list, { id: tempId, role: "user", content: text }]);

    // Moves the new/updated conversation to the top of the sidebar.
    const touchConversation = (id, title) =>
      setConversations((list) => [
        { id, title, updated_at: new Date().toISOString() },
        ...list.filter((c) => c.id !== id),
      ]);

    try {
      const result = await sendMessage({ conversationId: startedIn, message: text });
      touchConversation(result.conversationId, result.title);
      if (activeIdRef.current !== startedIn) return; // user moved on
      if (!startedIn) selectActive(result.conversationId);
      setMessages((list) => [
        ...list.map((m) => (m.id === tempId ? result.userMessage : m)),
        result.reply,
      ]);
    } catch (e) {
      const saved = e.data;
      if (saved?.conversationId) touchConversation(saved.conversationId, saved.title);
      if (activeIdRef.current !== startedIn) return;
      if (!startedIn && saved?.conversationId) selectActive(saved.conversationId);
      if (!saved?.userMessage) {
        // Nothing was saved: drop the message and give the text back.
        setMessages((list) => list.filter((m) => m.id !== tempId));
        setError(e.message);
        return { restoreInput: text };
      }
      setMessages((list) => list.map((m) => (m.id === tempId ? saved.userMessage : m)));
      setError(e.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelect}
        onNewChat={handleNewChat}
        onDelete={handleDelete}
      />
      <Main
        messages={messages}
        sending={sending}
        loading={loadingMessages}
        error={error}
        onDismissError={() => setError(null)}
        onSend={handleSend}
      />
    </>
  );
};

export default ChatPage;
