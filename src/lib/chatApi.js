import { FunctionsHttpError } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

export async function listConversations() {
  const { data, error } = await supabase
    .from("conversations")
    .select("id, title, updated_at")
    .order("updated_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return data;
}

export async function listMessages(conversationId) {
  const { data, error } = await supabase
    .from("messages")
    .select("id, role, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function deleteConversation(conversationId) {
  const { error } = await supabase
    .from("conversations")
    .delete()
    .eq("id", conversationId);
  if (error) throw error;
}

// Sends one user message to the `chat` Edge Function, which stores it,
// asks Gemini for a reply using the conversation history, stores the reply
// and returns it. A new conversation is created when conversationId is null.
export async function sendMessage({ conversationId, message }) {
  const { data, error } = await supabase.functions.invoke("chat", {
    body: { conversationId, message },
  });

  if (error) {
    let body = null;
    if (error instanceof FunctionsHttpError) {
      try {
        body = await error.context.json();
      } catch {
        // keep the generic message
      }
    }
    const err = new Error(body?.error || "Couldn't reach the server. Please try again.");
    // The server may have saved the user's message (and created the
    // conversation) before the AI call failed; pass that on to the caller.
    err.data = body;
    throw err;
  }
  return data;
}
