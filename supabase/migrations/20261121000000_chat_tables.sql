-- Conversations and messages for the Medi-cate chat.
-- Row-level security makes sure every user can only see their own chats.

create table if not exists public.conversations (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title       text not null default 'New chat',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.messages (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid not null references public.conversations (id) on delete cascade,
  role             text not null check (role in ('user', 'assistant')),
  content          text not null,
  created_at       timestamptz not null default now()
);

create index if not exists conversations_user_updated_idx
  on public.conversations (user_id, updated_at desc);
create index if not exists messages_conversation_created_idx
  on public.messages (conversation_id, created_at);

alter table public.conversations enable row level security;
alter table public.messages enable row level security;

create policy "Users manage their own conversations"
  on public.conversations for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users read messages in their conversations"
  on public.messages for select
  using (exists (
    select 1 from public.conversations c
    where c.id = conversation_id and c.user_id = auth.uid()
  ));

create policy "Users add messages to their conversations"
  on public.messages for insert
  with check (exists (
    select 1 from public.conversations c
    where c.id = conversation_id and c.user_id = auth.uid()
  ));
