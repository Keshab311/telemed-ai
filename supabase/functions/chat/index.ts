// Supabase Edge Function: POST /functions/v1/chat
//
// Body: { conversationId: string | null, message: string }
// Returns: { conversationId, title, userMessage, reply }
//
// The Gemini API key lives only here, as the GEMINI_API_KEY secret.
// All database calls use the caller's own login token, so row-level
// security applies exactly as it does in the browser.

import { createClient } from "npm:@supabase/supabase-js@2";
import { SYSTEM_PROMPT } from "./prompt.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_MODEL = Deno.env.get("GEMINI_MODEL") ?? "gemini-3.8-flash";
const MAX_MESSAGE_LENGTH = 4000;
const HISTORY_LIMIT = 30;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

type Turn = { role: "user" | "assistant"; content: string };

// Gemini expects roles "user" and "model". Consecutive turns from the same
// side (e.g. a user message whose reply failed earlier) are merged.
function toGeminiContents(history: Turn[]) {
  const contents: { role: string; parts: { text: string }[] }[] = [];
  for (const turn of history) {
    const role = turn.role === "assistant" ? "model" : "user";
    const last = contents[contents.length - 1];
    if (last && last.role === role) {
      last.parts[0].text += "\n\n" + turn.content;
    } else {
      contents.push({ role, parts: [{ text: turn.content }] });
    }
  }
  return contents;
}

async function askGemini(history: Turn[]): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY!,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: toGeminiContents(history),
        generationConfig: { temperature: 0.4, maxOutputTokens: 1500 },
      }),
    },
  );

  if (!res.ok) {
    console.error("Gemini error", res.status, await res.text());
    throw new Error("The AI service is unavailable right now. Please try again.");
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts
    ?.map((p: { text?: string }) => p.text ?? "")
    .join("")
    .trim();

  if (!text) {
    console.error("Gemini returned no text", JSON.stringify(data));
    throw new Error(
      "I couldn't answer that one. Please rephrase, or consult a doctor directly.",
    );
  }
  return text;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  if (!GEMINI_API_KEY) return json({ error: "Server is missing GEMINI_API_KEY" }, 500);

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "Please log in first." }, 401);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return json({ error: "Please log in first." }, 401);

  let body: { conversationId?: string | null; message?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) return json({ error: "Message is empty" }, 400);
  if (message.length > MAX_MESSAGE_LENGTH) {
    return json({ error: `Message is too long (max ${MAX_MESSAGE_LENGTH} characters)` }, 400);
  }

  // Find or create the conversation (RLS hides other users' conversations).
  let conversationId = body.conversationId ?? null;
  let title: string;
  if (conversationId) {
    const { data, error } = await supabase
      .from("conversations")
      .select("id, title")
      .eq("id", conversationId)
      .maybeSingle();
    if (error) return json({ error: error.message }, 500);
    if (!data) return json({ error: "Conversation not found" }, 404);
    title = data.title;
  } else {
    title = message.length > 60 ? message.slice(0, 57) + "..." : message;
    const { data, error } = await supabase
      .from("conversations")
      .insert({ title })
      .select("id")
      .single();
    if (error) return json({ error: error.message }, 500);
    conversationId = data.id;
  }

  const { data: userMessage, error: insertError } = await supabase
    .from("messages")
    .insert({ conversation_id: conversationId, role: "user", content: message })
    .select("id, role, content, created_at")
    .single();
  if (insertError) return json({ error: insertError.message }, 500);

  const { data: recent, error: historyError } = await supabase
    .from("messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(HISTORY_LIMIT);
  if (historyError) return json({ error: historyError.message }, 500);

  let replyText: string;
  try {
    replyText = await askGemini((recent as Turn[]).reverse());
  } catch (e) {
    return json({ error: (e as Error).message, conversationId, title, userMessage }, 502);
  }

  const { data: reply, error: replyError } = await supabase
    .from("messages")
    .insert({ conversation_id: conversationId, role: "assistant", content: replyText })
    .select("id, role, content, created_at")
    .single();
  if (replyError) return json({ error: replyError.message }, 500);

  await supabase
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  return json({ conversationId, title, userMessage, reply });
});
