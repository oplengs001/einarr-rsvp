# 🏴‍☠️ Einarr's Christening — One Piece RSVP App

An interactive **One Piece WANTED Poster** RSVP web app built with **Next.js (App Router)**, **Tailwind CSS**, and **Supabase** (ready for 1-click deployment on **Vercel**).

## ✨ Features

- **Playful Live WANTED Poster (`/`):**
  - Type your pirate name and watch it appear live on an aged parchment Marine bounty poster.
  - **Rolling Berry (`฿`) Bounty Ticker:** Ticks up by `+฿14,500,000` per letter typed, plus bonuses for crewmates and title rerolls.
  - **"Will of D." Toggle:** One-click button to insert `"D."` into your pirate name.
  - **Epithet Generator (`🎲 Reroll Title`):** Generates a One Piece title from your name (or write your own).
  - **Recruit Your Nakama (Plus-Ones Picker):** Pick `0` (Solo Captain), `+1 Nakama` (2 seats), or `+2 Nakama` (3 seats max) — no extra names needed.
- **Confirmation & Downloadable Poster (`/thanks/[id]`):**
  - Den Den Mushi confirmation, confetti, and a **"Download My Wanted Poster (PNG)"** button so guests can share their bounty poster.
- **Captain's Log Host Dashboard (`/captain`):**
  - Protected by passcode (`CAPTAIN_PASSCODE`, defaults to `gomugomu`).
  - Live headcount totals (Primary guests + Nakama plus-ones = Total seats), filter by status, search, and **1-click CSV export**.
- **Works Out-of-the-Box Locally:**
  - Automatically uses local storage (`.data/rsvps.json`) until you add your Supabase environment variables.

---

## 🚀 Quick Start (Local Development)

```bash
npm install
npm run dev
```

Open `http://localhost:3000` (and `http://localhost:3000/captain` with default passcode `gomugomu`).

---

## 🗄️ Connect Supabase & Deploy to Vercel

1. **Create a free Supabase project** at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New Query**, paste the contents of [`supabase/schema.sql`](./supabase/schema.sql), and click **Run**.
3. Copy `.env.example` to `.env.local` (or add these in Vercel Project Settings → Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL` — from Supabase **Project Settings → API**
   - `SUPABASE_SERVICE_ROLE_KEY` — from Supabase **Project Settings → API** (`service_role` secret)
   - `CAPTAIN_PASSCODE` — your custom passcode for `/captain` (default: `gomugomu`)
4. **Deploy to Vercel:** Push to GitHub and import into Vercel. [`vercel.json`](./vercel.json) includes an automatic cron ping (`/api/keepalive`) so your free Supabase project stays active.

