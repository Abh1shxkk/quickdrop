# QuickDrop

Send text, files, and links from your browser to Telegram — in one click.

**Live:** [quickdrop-rosy.vercel.app](https://quickdrop-rosy.vercel.app)

## What it does

QuickDrop is a web app that lets you send anything to Telegram directly from your browser. No app downloads, no phone needed — just paste your bot token and start sending.

- Send text messages, images, videos, audio, and documents
- Works with any Telegram user, group, or channel
- Dark and light mode
- Optional sign-in to sync your bot token across devices
- No data is stored — messages go directly to Telegram

## How it works

1. Create a Telegram bot via [@BotFather](https://t.me/BotFather) (send `/newbot`)
2. Copy the API token BotFather gives you
3. Send `/start` to your new bot on Telegram
4. Open QuickDrop, paste the token, select a contact, and send

## Tech stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS 4
- **Fonts:** DM Sans, JetBrains Mono
- **Auth (optional):** Supabase Auth (email/password + Google OAuth)
- **Database (optional):** Supabase (stores bot tokens for logged-in users)
- **Hosting:** Vercel
- **Messaging:** Telegram Bot API

## Run locally

### Prerequisites

- Node.js 18+
- npm
- A Telegram bot token (from [@BotFather](https://t.me/BotFather))

### Setup

```bash
git clone https://github.com/Abh1shxkk/quickdrop.git
cd quickdrop
npm install
```

Create a `.env.local` file:

```env
# Required for optional sign-in feature
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> The app works without Supabase — guest mode uses localStorage for the bot token. Supabase is only needed if you want the sign-in feature.

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push the repo to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add environment variables in Vercel project settings (optional, for auth):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

## Supabase setup (optional)

Only needed if you want the sign-in / sync feature.

1. Create a project on [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run:

```sql
create table if not exists user_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  bot_token text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table user_tokens enable row level security;

create policy "Users read own token" on user_tokens
  for select using (auth.uid() = user_id);
create policy "Users insert own token" on user_tokens
  for insert with check (auth.uid() = user_id);
create policy "Users update own token" on user_tokens
  for update using (auth.uid() = user_id);
create policy "Users delete own token" on user_tokens
  for delete using (auth.uid() = user_id);
```

3. To enable Google sign-in: go to **Authentication > Providers > Google** and add your OAuth credentials
4. In **Authentication > Settings**, disable "Confirm email" for frictionless signup

## Project structure

```
src/
  app/
    page.tsx          # Main app (setup + send UI)
    layout.tsx        # Root layout with fonts + providers
    globals.css       # Brownish theme + dark mode
    api/
      send/route.ts   # Proxies messages to Telegram Bot API
      contacts/route.ts # Fetches contacts from bot updates
  components/
    header.tsx        # Floating rounded header with theme toggle
    footer.tsx        # Creator credits + social links
    auth-modal.tsx    # Sign in / Sign up modal
    providers.tsx     # Theme + Auth context wrapper
  lib/
    auth.tsx          # Supabase auth context
    theme.tsx         # Dark/light mode context
    supabase.ts       # Supabase browser client
    use-token.ts      # Token storage hook (localStorage or Supabase)
```

## Privacy

- **Guest mode:** Bot token is saved in your browser's localStorage. Never sent to any server for storage.
- **Signed-in mode:** Bot token is stored in your Supabase database with row-level security. Only you can access it.
- **Messages:** Sent directly to Telegram via their API. Never stored or logged by QuickDrop.

## License

MIT
