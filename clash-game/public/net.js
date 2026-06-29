/* ===================================================================
   net.js — Mobile controls, responsive scaling, and online 1v1.
   Loaded AFTER game.js, shares its global scope (towers, troops, etc).

   Model: host-authoritative relay.
   - The matched "host" runs the full simulation (self = blue, bottom).
   - The "guest" never simulates; it renders snapshots the host sends,
     already transformed into the guest's perspective (self = blue, bottom),
     and sends its taps back to the host to spawn the opposing 'red' units.
   =================================================================== */

/* ---------------- Responsive scaling (fit phone/desktop) ---------------- */
function fitGameRoot() {
    let root = document.getElementById('gameRoot'); if(!root) return;
    let s = Math.min(window.innerWidth / 460, window.innerHeight / 780);
    root.style.transform = 'scale(' + s + ')';
}
window.addEventListener('resize', fitGameRoot);
window.addEventListener('orientationchange', () => setTimeout(fitGameRoot, 250));
fitGameRoot();

/* ---------------- Touch controls for the battle canvas ---------------- */
(function () {
    let el = document.getElementById('arenaCanvas'); if(!el) return;
    function toCanvas(touch) {
        let r = el.getBoundingClientRect();
        return { x: (touch.clientX - r.left) * (el.width / r.width), y: (touch.clientY - r.top) * (el.height / r.height) };
    }
    el.addEventListener('touchstart', e => { e.preventDefault(); let p = toCanvas(e.touches[0]); mouseX = p.x; mouseY = p.y; isHovering = true; }, { passive: false });
    el.addEventListener('touchmove',  e => { e.preventDefault(); let p = toCanvas(e.touches[0]); mouseX = p.x; mouseY = p.y; isHovering = true; }, { passive: false });
    el.addEventListener('touchend',   e => { e.preventDefault(); el.dispatchEvent(new MouseEvent('click')); isHovering = false; }, { passive: false });
})();

/* ---------------- Networking ---------------- */
let ws = null;
let netMyName = 'Player';
let netOppName = 'Opponent';
let netOppDeck = null;
let netLastSnap = 0;     // timestamp of the last snapshot the guest received
let netWatchdog = null;
let netTx = 0, netRx = 0;
let netDebugOn = false;
try { netDebugOn = new URLSearchParams(location.search).has('debug'); } catch(e) {}
function setNetDebug(t) { if(!netDebugOn) return; let e = document.getElementById('netDebug'); if(e) e.innerText = t; }
const MIRROR_X = 2 * START_X + COLS * TILE_SIZE;
const MIRROR_Y = 2 * START_Y + ROWS * TILE_SIZE;

function netServerUrl() {
    // Opened as a file:// page (double-clicked)? There's no host — fall back to localhost.
    if(location.protocol === 'file:' || !location.host) return 'ws://localhost:3000';
    let proto = location.protocol === 'https:' ? 'wss' : 'ws';
    return proto + '://' + location.host;
}
function netSend(obj) { if(ws && ws.readyState === 1) ws.send(JSON.stringify(obj)); }
function setOnlineStatus(t) { let e = document.getElementById('onlineStatus'); if(e) e.innerText = t; }
function flashStatus(m, c) { let s = document.getElementById('statusMessage'); if(s) { s.innerText = m; s.style.color = c; } }
function netDeckLevels() { let o = {}; pData.activeDeck.forEach(k => o[k] = pData.cards[k] ? pData.cards[k].level : 1); return o; }

function showOnlineMain() {
    let p = document.getElementById('onlineMainPanel'); if(p) p.style.display = 'flex';
    let c = document.getElementById('onlineCodePanel'); if(c) c.style.display = 'none';
    let cb = document.getElementById('onlineCancelBtn'); if(cb) cb.style.display = 'none';
}
function showOnlineWaiting(codePanel) {
    document.getElementById('onlineMainPanel').style.display = 'none';
    document.getElementById('onlineCodePanel').style.display = codePanel ? 'flex' : 'none';
    document.getElementById('onlineCancelBtn').style.display = 'block';
}
window.openOnlineMenu = function () {
    document.getElementById('onlineOverlay').style.display = 'flex';
    document.getElementById('onlineName').value = pData.username || '';
    setOnlineStatus('Play a live 1v1 against another device on the same server.');
    showOnlineMain();
};
window.closeOnlineMenu = function () { document.getElementById('onlineOverlay').style.display = 'none'; };

function netName() {
    netMyName = (document.getElementById('onlineName').value || pData.username || 'Player').substring(0, 12);
    if(netMyName) { pData.username = netMyName; saveData(); }
}
// open the socket once, then run cb() when it's ready
function netEnsureConn(cb) {
    if(ws && ws.readyState === 1) { cb(); return; }
    setOnlineStatus('Connecting to ' + netServerUrl() + ' …');
    try { ws = new WebSocket(netServerUrl()); }
    catch(e) { setOnlineStatus('⚠ Bad address. Open the game at http://localhost:3000 (run the server first).'); showOnlineMain(); return; }
    ws.onopen = () => cb();
    ws.onmessage = ev => { let m; try { m = JSON.parse(ev.data); } catch(e) { return; } netHandle(m); };
    ws.onerror = () => { setOnlineStatus('⚠ Could not reach the server. Start it with "npm start", then open http://localhost:3000'); showOnlineMain(); };
    ws.onclose = () => { if(netActive) { netBail('Opponent disconnected.'); } else { setOnlineStatus('Disconnected.'); showOnlineMain(); } };
}

window.onlineFindMatch = function () {
    netName();
    netEnsureConn(() => { setOnlineStatus('Searching for an opponent…'); showOnlineWaiting(false); netSend({ type: 'queue', name: netMyName, deck: pData.activeDeck, levels: netDeckLevels() }); });
};
window.onlineCreate = function () {
    netName();
    netEnsureConn(() => { setOnlineStatus('Creating a private party…'); netSend({ type: 'create', name: netMyName, deck: pData.activeDeck, levels: netDeckLevels() }); });
};
window.onlineJoin = function () {
    netName();
    let code = (document.getElementById('joinCode').value || '').trim().toUpperCase();
    if(code.length < 4) { setOnlineStatus('Enter the 4-letter code your friend shared.'); return; }
    netEnsureConn(() => { setOnlineStatus('Joining party ' + code + '…'); showOnlineWaiting(false); netSend({ type: 'join', code: code, name: netMyName, deck: pData.activeDeck, levels: netDeckLevels() }); });
};
window.onlineCancel = function () {
    netSend({ type: 'cancel' });
    if(ws) { try { ws.close(); } catch(e) {} ws = null; }
    setOnlineStatus('Cancelled.');
    showOnlineMain();
};

function netHandle(m) {
    if(m.type === 'matched') { netRole = m.role; netOppName = m.oppName || 'Opponent'; netOppDeck = m.oppDeck || null; startOnlineBattle(); }
    else if(m.type === 'created') { document.getElementById('roomCodeBig').innerText = m.code; setOnlineStatus('Party ready!'); showOnlineWaiting(true); }
    else if(m.type === 'joinfail') { setOnlineStatus('No party found for code "' + (m.code || '') + '". Check it and try again.'); showOnlineMain(); }
    else if(m.type === 'deploy') { if(netRole === 'host') hostApplyGuestDeploy(m); }
    else if(m.type === 'state')  { if(netRole === 'guest') applySnapshot(m); }
    else if(m.type === 'end')    { if(netRole === 'guest') netGuestEnd(m); }
    else if(m.type === 'oppleft') { netBail('Opponent left the match.'); }
}

function startOnlineBattle() {
    closeOnlineMenu();
    netActive = true; netSnapTick = 0;
    currentOpponentData = { name: netOppName, deck: netOppDeck || pData.activeDeck.slice() };
    document.getElementById('vsP1Name').innerText = netMyName;
    let myFav = pData.activeDeck[0];
    document.getElementById('vsP1Icon').innerText = cardDatabase[myFav] ? cardDatabase[myFav].icon : '🏹';
    document.getElementById('vsP2Name').innerText = netOppName;
    document.getElementById('vsP2Icon').innerText = '🌐';
    let vs = document.getElementById('versusOverlay'); vs.style.display = 'flex';
    setTimeout(() => { vs.style.display = 'none'; launchBattlefield(); startNetWatchdog(); }, 1600);
}

// Guest-side: if the host's live updates stop arriving, say so clearly instead of an empty board.
function startNetWatchdog() {
    netLastSnap = 0;
    if(netWatchdog) clearInterval(netWatchdog);
    if(netRole !== 'guest') return;
    netWatchdog = setInterval(() => {
        if(!netActive) { clearInterval(netWatchdog); netWatchdog = null; return; }
        let s = document.getElementById('statusMessage'); if(!s) return;
        if(netLastSnap === 0) { s.innerText = '⏳ WAITING FOR HOST DATA…'; s.style.color = '#f1c40f'; }
        else if(Date.now() - netLastSnap > 2500) { s.innerText = '⚠ LOST CONNECTION TO HOST'; s.style.color = '#ff3366'; }
    }, 1000);
}

/* ---- HOST: build a snapshot transformed into the GUEST's perspective ---- */
function buildSnapshot() {
    netTx++; setNetDebug('HOST  TX:' + netTx + '  troops:' + troops.length);
    return {
        type: 'state',
        tr: troops.map(t => [t.type, Math.round(MIRROR_X - t.x), Math.round(MIRROR_Y - t.y), t.team === 'blue' ? 'red' : 'blue',
            Math.round(t.hp), Math.round(t.maxHp), t.isEvo ? 1 : 0, -t.facing, t.shield || 0, t.state,
            t.flying ? 1 : 0, Math.round(t.abilityActive || 0), t.isCharging ? 1 : 0, t.evoTier || 0]),
        tw: towers.map(b => [b.type, b.team === 'blue' ? 'red' : 'blue', COLS - b.tx - b.w, ROWS - b.ty - b.h, b.w, b.h,
            Math.round(b.hp), Math.round(b.maxHp), b.dead ? 1 : 0, b.activated ? 1 : 0]),
        pj: projectiles.map(p => [Math.round(MIRROR_X - p.x), Math.round(MIRROR_Y - p.y), p.angle + Math.PI, p.isPower ? 1 : 0, p.team === 'blue' ? 'red' : 'blue']),
        el: Math.round(aiElixir * 10) / 10,
        bc: redCrownScore, rc: blueCrownScore,
        tm: document.getElementById('matchTimer').innerText,
        ef: (overtimeActive ? 3 : (totalMatchSeconds <= 60 ? 2 : 1))
    };
}

/* ---- GUEST: apply a snapshot (already in guest perspective) ---- */
function applySnapshot(s) {
    netLastSnap = Date.now();
    netRx++; setNetDebug('GUEST RX:' + netRx + '  troops:' + (s.tr ? s.tr.length : 0));
    troops = s.tr.map(a => ({ type: a[0], x: a[1], y: a[2], team: a[3], hp: a[4], maxHp: a[5], isEvo: !!a[6], facing: a[7],
        shield: a[8], state: a[9], flying: !!a[10], abilityActive: a[11], isCharging: !!a[12], evoTier: a[13],
        hitFlash: 0, atkTimer: 0, spawnAnim: 0 }));
    towers = s.tw.map(a => { let t = { type: a[0], team: a[1], tx: a[2], ty: a[3], w: a[4], h: a[5], hp: a[6], maxHp: a[7], dead: !!a[8], activated: !!a[9] };
        t.x = START_X + t.tx * TILE_SIZE + TILE_SIZE; t.y = START_Y + t.ty * TILE_SIZE + TILE_SIZE; return t; });
    projectiles = s.pj.map(a => ({ x: a[0], y: a[1], angle: a[2], isPower: !!a[3], team: a[4] }));
    particles = [];
    elixir = s.el;
    let eb = document.getElementById('elixirBar'); if(eb) eb.style.width = (elixir / 10 * 100) + '%';
    let et = document.getElementById('elixirText'); if(et) et.innerText = Math.floor(elixir) + ' / 10' + (s.ef > 1 ? '  ⚡x' + s.ef : '');
    let bc = document.getElementById('blueCrowns'); if(bc) bc.innerText = s.bc;
    let rc = document.getElementById('redCrowns'); if(rc) rc.innerText = s.rc;
    let mt = document.getElementById('matchTimer'); if(mt) mt.innerText = s.tm;
}

/* ---- GUEST: send a deploy tap to the host ---- */
function netGuestDeploy() {
    let coords = getGridCoords(mouseX, mouseY);
    if(!validatePlacement(activeCombatCard, coords.tx, coords.ty)) { flashStatus('INVALID SECTOR', '#ff3366'); return; }
    if(elixir < activeCombatCost) { flashStatus('NOT ENOUGH MANA', '#ff3366'); return; }
    netSend({ type: 'deploy', card: activeCombatCard, tx: coords.tx, ty: coords.ty });
    // immediate local feedback: show a deploy burst + a placeholder unit until the host's snapshot takes over
    let sx = START_X + coords.tx * TILE_SIZE + TILE_SIZE / 2, sy = START_Y + coords.ty * TILE_SIZE + TILE_SIZE / 2;
    for(let r = 0; r < 2; r++) particles.push({ x: sx, y: sy, r: 3 + r * 7, alpha: 1, grow: 2.4, fade: 0.06, color: '0,255,204', lw: 3, type: 'ring' });
    spawnTroop('blue', activeCombatCard, sx, sy, false, false);
    flashStatus('DEPLOYED', '#00ffcc');
    cyclePlayerCard(activeCombatCard); // advance local hand UI optimistically
}

/* ---- HOST: spawn the guest's deploy as a 'red' unit (mirrored into host world) ---- */
function hostApplyGuestDeploy(m) {
    let base = cardDatabase[m.card]; if(!base) return;
    let htx = COLS - 1 - m.tx, hty = ROWS - 1 - m.ty;
    if(htx < 0 || htx >= COLS || hty < 0 || hty >= ROWS) return;
    let onTower = false; towers.forEach(t => { if(!t.dead && htx >= t.tx && htx < t.tx + t.w && hty >= t.ty && hty < t.ty + t.h) onTower = true; });
    if(onTower) return;
    if(base.trait !== 'miner' && hty >= 16) return;   // red deploys in the top half
    if(aiElixir < base.cost) return;                  // guest (red) elixir is host-authoritative
    aiElixir -= base.cost;
    let sx = START_X + htx * TILE_SIZE + TILE_SIZE / 2, sy = START_Y + hty * TILE_SIZE + TILE_SIZE / 2;
    spawnTroop('red', m.card, sx, sy, false, false);
}

/* ---- GUEST: match finished ---- */
function netGuestEnd(m) {
    combatActive = false;
    setTimeout(() => {
        document.getElementById('screenPlayGround').style.display = 'none';
        if(m.draw) { alert('MATCH RESULT: DRAW'); }
        else if(m.win) { pData.trophies += 30; pData.gold += 50; saveData(); updateTopResources(); showChestUI('🏆 VICTORY CHEST!', 150, 2, 6, true, 3 + Math.floor(Math.random() * 3)); }
        else { pData.trophies = Math.max(0, pData.trophies - 15); saveData(); updateTopResources(); alert('MATCH RESULT: DEFEAT'); }
        netCleanup();
    }, 600);
}

function netBail(msg) {
    if(!netActive && !netRole) { return; }
    combatActive = false;
    document.getElementById('screenPlayGround').style.display = 'none';
    netCleanup();
    alert(msg || 'Match ended.');
}
function netCleanup() {
    netActive = false; netRole = null; netSnapTick = 0;
    if(netWatchdog) { clearInterval(netWatchdog); netWatchdog = null; }
    if(ws) { try { ws.close(); } catch(e) {} ws = null; }
}
