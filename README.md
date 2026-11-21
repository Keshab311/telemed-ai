# Medi-cate (Telemed-AI)

An AI health assistant: users sign up, chat about symptoms and get careful,
over-the-counter guidance from Google Gemini, with their chat history saved.

## How it fits together

```
React app (browser)
  │  login / sign-up ──────────────► Supabase Auth
  │  list chats & messages ────────► Supabase Postgres (row-level security:
  │                                   each user only sees their own rows)
  └─ send message ─► Supabase Edge Function `chat`
                        ├─ saves the message
                        ├─ sends the history + safety system prompt to Gemini
                        └─ saves and returns Gemini's reply
```

The Gemini API key exists **only** as a Supabase secret used by the Edge
Function. It is never sent to the browser.

| Path | What it is |
| --- | --- |
| `src/components/ChatPage` | Chat state shared by the sidebar and the main area |
| `src/components/Main` | Greeting, suggestion cards, messages, input bar (voice input) |
| `src/components/Sidebar` | New chat, recent conversations, delete |
| `src/components/LoginForm`, `SignUpForm`, `AuthForm` | Email/password + Google sign-in |
| `src/context/AuthContext.jsx` | Current session, user name, sign-out |
| `src/lib/` | Supabase client and chat API calls |
| `supabase/migrations/` | Database tables and security policies |
| `supabase/functions/chat/` | Edge Function and the medical safety prompt (`prompt.ts`) |

## Setup

You need Node.js 18+, a [Supabase](https://supabase.com) project, a
[Gemini API key](https://aistudio.google.com/apikey) and the
[Supabase CLI](https://supabase.com/docs/guides/cli).

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Frontend settings**: copy `.env.example` to `.env.local` and fill in the
   project URL and anon (public) key from Supabase → Project Settings → API.

3. **Database and backend**

   ```bash
   supabase login
   supabase link --project-ref <your-project-ref>
   supabase db push                                   # creates the tables
   supabase secrets set GEMINI_API_KEY=<your-gemini-key>
   supabase functions deploy chat
   ```

   Optional: `supabase secrets set GEMINI_MODEL=<model-id>` to use a different
   Gemini model (default `gemini-3.8-flash`).

4. **Auth settings** in the Supabase dashboard → Authentication:
   - URL Configuration: set the Site URL (e.g. `http://localhost:3000`) and add
     your deployed URL to Redirect URLs.
   - Providers → Google: enable it if you want "Continue with Google".
   - Email confirmation is on by default; new users must click the email link
     before logging in.

5. **Run it**

   ```bash
   npm start
   ```

## Deploy to Vercel

Finish the Supabase setup above first, or the deployed chat can't answer.

1. Sign in at [vercel.com](https://vercel.com) with GitHub and click
   **Add New → Project**, then import `telemed-ai`. Vercel detects Create React
   App; keep the default build settings (`npm run build`, output `build`).
2. Under **Environment Variables**, add `REACT_APP_SUPABASE_URL` and
   `REACT_APP_SUPABASE_ANON_KEY` with the same values as your `.env.local`.
3. Click **Deploy**. You get a link like `https://telemed-ai.vercel.app`, and
   every push to `main` redeploys it.
4. In Supabase → Authentication → URL Configuration, set the Site URL to that
   link and add it to Redirect URLs, so sign-up emails, password reset and
   Google sign-in come back to the deployed site.

`vercel.json` sends every path to `index.html`, so refreshing on `/login` or
`/signup` works. (`public/_redirects` does the same on Netlify.)

## Scripts

- `npm start`: development server on http://localhost:3000
- `npm run build`: production build in `build/`
- `npm test`: test runner

## Safety

The assistant's rules are in `supabase/functions/chat/prompt.ts`: emergency
symptoms get an "call emergency services" response instead of medicine
suggestions; only over-the-counter medicines are mentioned, with "follow the
label" instead of doses; it asks about age, pregnancy, allergies, current
medicines and conditions before suggesting anything; and it always says when to
see a doctor. Medi-cate is a student project and not a substitute for medical
advice.
