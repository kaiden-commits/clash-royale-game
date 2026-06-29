# Deploy Neon Blitz Tactics to the cloud (free, permanent link)

This puts the game online 24/7 so anyone can join from phone or PC with one link —
no need to keep your PC on as the server. (One *player* still hosts each match by
keeping their game window open; that's normal.)

We'll use **Render** (free). No command line needed — everything is done in the
browser. It takes ~10 minutes the first time.

## Step 1 — Put the code on GitHub (no Git install needed)

1. Make a free account at https://github.com
2. Click the **+** (top-right) → **New repository**.
   - Name: `neon-blitz-tactics`
   - Set it to **Public**
   - Click **Create repository**
3. On the new repo page click **“uploading an existing file”**.
4. Open your `clash-game` folder, select **everything inside it**
   (`server.js`, `package.json`, `render.yaml`, and the whole `public` folder)
   and **drag it onto the GitHub upload page**.
5. Click **Commit changes**.

## Step 2 — Deploy on Render

1. Make a free account at https://render.com (sign in with GitHub — one click).
2. Click **New +** → **Web Service**.
3. Choose your `neon-blitz-tactics` repository → **Connect**.
4. Render auto-fills from `render.yaml`. Confirm:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
5. Click **Create Web Service** and wait for it to say **“Live”** (a few minutes).

## Step 3 — Your link

Render shows a URL at the top like:

```
https://neon-blitz-tactics.onrender.com
```

That's your game. Share it with anyone — phone or PC. Two people open it,
one taps **CREATE PARTY CODE**, the other **JOIN**s with the code.

> Free Render services “sleep” after ~15 min idle, so the first visit after a
> quiet period takes ~30–60 seconds to wake up. Just wait and refresh once.

## Step 4 — Save the link so it's easy to reach

- **Phone:** open the link, then your browser menu → **Add to Home Screen**.
  It installs like a real app with an icon (the app meta tags are already set up).
- **PC:** bookmark it, or make a desktop shortcut (right-click desktop →
  New → Shortcut → paste the link).
- Tell me your final link and I'll drop a ready-to-use desktop shortcut file
  into your folder for you.
