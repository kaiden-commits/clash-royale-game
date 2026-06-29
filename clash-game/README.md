# Neon Blitz Tactics — Online

A Clash-Royale-style tactics game with **single-player vs AI**, **online 1v1**, and **mobile/touch support**.

This is the multi-file version of the original `clash.html`. The original single file is kept as
`../clash.html` (and `../clash_backup.html`) for offline backup.

## Project layout

```
clash-game/
├─ server.js          Node static-file server + WebSocket matchmaking/relay
├─ package.json
└─ public/
   ├─ index.html      Game shell (responsive, mobile viewport, online menu)
   ├─ style.css       All styles (+ responsive/mobile rules)
   ├─ game.js         The full game engine (extracted from clash.html)
   └─ net.js          Mobile controls, responsive scaling, online netcode
```

## Opening the game

**Do not double-click `game.js`** — that's just one source file, not the game.

- **Just to play (single-player, offline):** double-click **`public/index.html`**
  (or the backup `../clash.html`). It opens in your browser and works immediately.
- **For online / party play:** you must run the server (below) and open the page
  at `http://localhost:3000`, because multiplayer needs the WebSocket server.

## Run it (for online)

You only need [Node.js](https://nodejs.org) (v16+). **No `npm install`** — the
server has zero dependencies.

```bash
cd clash-game
node server.js        # starts the server on http://localhost:3000
```

You should see `Neon Blitz Tactics server running…`. Leave that window open,
then open **http://localhost:3000** in your browser (NOT the file path).

### "Could not connect / is the server running?"

That message means the page couldn't reach the server. Check, in order:
1. Is the `node server.js` window still open and showing "server running"?
   If `node` is "not recognised", install Node.js from nodejs.org and reopen
   your terminal.
2. Are you visiting **http://localhost:3000** (served by Node) — not a
   `file:///…/index.html` path? Online only works through the server.
3. On a phone, use `http://<your-PC-LAN-IP>:3000` (see below), and allow Node
   through the firewall if prompted.

Open **http://localhost:3000** in a browser. Single-player works immediately
(tap **BATTLE**). For online, tap **🌐 PLAY ONLINE** on two different
browsers/devices, enter a name on each, and hit **FIND MATCH** — they pair up.

### Party codes (play a specific friend)

In the **🌐 PLAY ONLINE** menu:
- **⚡ QUICK MATCH** — pairs you with anyone else searching.
- **＋ CREATE PARTY CODE** — generates a 4-letter code; share it with your friend.
- **JOIN** — your friend types your code and hits JOIN → you're matched against
  each other. (The creator becomes the authoritative host.)

### Playing across devices (phone + PC, same Wi-Fi — easiest)

1. Find your computer's LAN IP:
   - Windows: `ipconfig` → "IPv4 Address" (e.g. `192.168.1.23`)
   - Mac/Linux: `ifconfig` or `ip addr`
2. On your phone (same Wi-Fi) open `http://192.168.1.23:3000`.
3. Both players tap **PLAY ONLINE → FIND MATCH**. First to queue is the host.

> If the phone can't connect, allow Node through your computer's firewall, or
> temporarily disable it on the private network.

## Letting other people join (mobile + PC)

There are three levels, easiest first:

### A) Same Wi-Fi (no setup)
You run `START.bat`. Friends on the **same Wi-Fi** open
`http://<your-PC-LAN-IP>:3000` (e.g. `http://192.168.1.23:3000`).
Find the IP with `ipconfig` → "IPv4 Address". Allow Node through the firewall
if Windows asks. Works on their phone or PC. Your PC must stay on.

### B) Anyone, anywhere — keep your PC as the server (quickest public link)
Use a free tunnel so people on other networks/data can join:
1. Install **ngrok** (https://ngrok.com/download) or **cloudflared**.
2. Start your game server (`START.bat` or `node server.js`).
3. In another terminal run:  `ngrok http 3000`
4. ngrok prints a public URL like `https://abc123.ngrok-free.app`. Share that.
   Friends open it on phone/PC; you (or a friend) hosts the match.
   (The client auto-uses secure `wss://` on https links — no changes needed.)
Your PC must stay on while people play.

### C) Always-on, no PC needed (deploy the relay to the cloud)
Host the server on a free Node platform so the link works 24/7:
- **Render** (render.com): New → Web Service → connect this folder/repo →
  Build command: *(none)* · Start command: `node server.js`. Render gives you a
  permanent `https://yourgame.onrender.com` link.
- **Railway**, **Fly.io**, **Glitch** work the same way.
The server already reads `process.env.PORT`, so no code changes are needed.
Two players open the link; one becomes the match host.

### Playing over the internet

Deploy the folder to any Node host that supports WebSockets (Render, Railway,
Fly.io, a VPS, etc.). The client auto-detects `ws://` vs `wss://` from the page
URL, so HTTPS hosting works without changes. Make sure the platform forwards the
`$PORT` env var (the server already reads `process.env.PORT`).

## Controls

- **Desktop:** mouse — move to aim placement, click to deploy.
- **Mobile:** drag a finger on the arena to preview placement, lift to deploy.
  Tap card slots / buttons as usual. The whole UI auto-scales to your screen.

## How online works (host-authoritative)

- The first player to queue is the **host** and runs the authoritative
  simulation. The **guest** never simulates — it renders ~20 Hz state snapshots
  the host sends (already flipped into the guest's perspective so both players
  see themselves at the bottom) and relays its taps back to the host.
- The server (`server.js`) only does matchmaking + message relay.

### Known limitations (online beta — needs live testing/tuning)

- No interpolation yet, so guest movement updates at snapshot rate (~20 Hz).
  Fine on LAN; add interpolation for high-latency internet play.
- Tier-2 **hero ability buttons** are currently host-only in online matches.
- Card **levels** for guest-deployed troops use the host's default roll rather
  than the guest's own levels.
- One match per pair; no reconnect. If a player leaves, the match ends.

These are good next steps if you want to harden the online mode.
