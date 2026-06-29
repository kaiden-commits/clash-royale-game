// --- CORE DICTIONARIES & METRICS ---
const cvs = document.getElementById('arenaCanvas'); let ctx = cvs.getContext('2d');
const TILE_SIZE = 19; const COLS = 18; const ROWS = 32;      
const START_X = 9; const START_Y = 0; const RIVER_MID_Y = START_Y + 16 * TILE_SIZE; 
const SIGHT_RANGE = 130; 

const cardDatabase = {
    archer: { cost: 3, hp: 504, dmg: 60, range: 140, spd: 0.5, atkSpd: 70, target: 'any', targetsAir: true, name: "Purple Archer", icon: '🏹', count: 1, arena: 1, evoCyclesReq: 2, desc: 'Fires high velocity arrows.' },
    batman: { cost: 4, hp: 1400, dmg: 110, range: 120, spd: 0.6, atkSpd: 90, target: 'any', targetsAir: false, name: "Dark Knight", icon: '🦇', count: 1, arena: 1, evoCyclesReq: 2, desc: 'Grapples enemies from afar.' },
    deku:   { cost: 3, hp: 450, dmg: 120, range: 50, spd: 0.9, atkSpd: 110, target: 'any', targetsAir: false, name: "Smash Prodigy", icon: '⚡', count: 1, arena: 1, evoCyclesReq: 2, desc: 'Devastating triangle splash.' }, 
    bombur: { cost: 5, hp: 3200, dmg: 140, range: 40, spd: 0.35, atkSpd: 120, target: 'building', targetsAir: false, name: "Heavy Dwarf", icon: '🍖', count: 1, arena: 1, evoCyclesReq: 2, desc: 'Ignores troops. Targets towers.' },
    cap:    { cost: 4, hp: 1400, dmg: 130, range: 35, spd: 0.9, atkSpd: 80, target: 'any', targetsAir: false, name: "Captain", icon: '🛡️', count: 1, arena: 1, trait: 'shield', evoCyclesReq: 2, desc: 'Blocks 3 hits completely.' },
    ninja:  { cost: 1, hp: 150, dmg: 40, range: 30, spd: 1.1, atkSpd: 60, target: 'any', targetsAir: false, name: "Assassins", icon: '🥷', count: 3, arena: 1, trait: 'swarm', evoCyclesReq: 2, desc: 'Spawns 3 rapid fighters.' },
    haaland:{ cost: 4, hp: 1600, dmg: 180, range: 40, spd: 0.65, atkSpd: 100, target: 'building', targetsAir: false, name: "The Striker", icon: '⚽', count: 1, arena: 1, trait: 'charge', evoCyclesReq: 2, desc: 'Charges up for massive damage.' },
    tower:  { cost: 4, hp: 3200, dmg: 80, range: 140, spd: 0, atkSpd: 90, target: 'any', targetsAir: true, name: "A-Tower", icon: '🏢', count: 1, arena: 1, trait: 'building', evoCyclesReq: 2, desc: 'Heavy static base. Fires missiles.' },
    ultron: { cost: 3, hp: 200, dmg: 50, range: 15, spd: 0.8, atkSpd: 60, target: 'any', targetsAir: true, name: "Ultron Bots", icon: '🤖', count: 3, arena: 2, trait: 'flying', evoCyclesReq: 2, desc: 'Flying swarm ignores river bridges.' },
    naruto: { cost: 4, hp: 900, dmg: 100, range: 25, spd: 1.5, atkSpd: 50, target: 'any', targetsAir: false, name: "Ninja Dash", icon: '🦊', count: 1, arena: 2, evoCyclesReq: 2, desc: 'Insanely high speed melee rusher.' },
    martian:{ cost: 4, hp: 1200, dmg: 80, range: 90, spd: 0.5, atkSpd: 80, target: 'any', targetsAir: true, name: "Martian", icon: '👽', count: 1, arena: 2, trait: 'flying', evoCyclesReq: 2, desc: 'Flying bulk ranged psychic tank.' },
    nobu:   { cost: 5, hp: 800, dmg: 70, range: 110, spd: 0.5, atkSpd: 90, target: 'any', targetsAir: true, name: "The Hand", icon: '👺', count: 1, arena: 2, trait: 'summoner', evoCyclesReq: 2, desc: 'Summons assassins periodically to defend.' },
    indy:   { cost: 3, hp: 1000, dmg: 80, range: 30, spd: 0.7, atkSpd: 80, target: 'any', targetsAir: false, name: "Dr. Jones", icon: '🤠', count: 1, arena: 2, trait: 'miner', evoCyclesReq: 2, desc: 'Digs tunnel to pop up anywhere.' },
    golem:  { cost: 6, hp: 4200, dmg: 190, range: 38, spd: 0.32, atkSpd: 120, target: 'any', targetsAir: false, name: "Gamma Brute", icon: '👊', count: 1, arena: 3, evoCyclesReq: 2, desc: 'Furious green tank. Smashes everything in melee.' },
    drake:  { cost: 5, hp: 1300, dmg: 130, range: 95, spd: 0.6, atkSpd: 85, target: 'any', targetsAir: true, name: "Blast Hero", icon: '💥', count: 1, arena: 3, trait: 'flying', evoCyclesReq: 2, desc: 'Rockets around on explosions. Hits air and ground.' },
    sniper: { cost: 4, hp: 460, dmg: 330, range: 185, spd: 0.5, atkSpd: 210, target: 'any', targetsAir: true, name: "The Jester", icon: '🃏', count: 1, arena: 3, evoCyclesReq: 2, desc: 'Hurls explosive cards from way across the map.' },
    medic:  { cost: 3, hp: 700, dmg: 30, range: 55, spd: 0.55, atkSpd: 100, target: 'any', targetsAir: false, name: "Care Bot", icon: '🤍', count: 1, arena: 3, trait: 'healer', evoCyclesReq: 2, desc: 'Soft healthcare robot. Mends nearby allies.' },
    drones: { cost: 4, hp: 170, dmg: 65, range: 50, spd: 0.85, atkSpd: 60, target: 'any', targetsAir: false, name: "Toy Troopers", icon: '🪖', count: 4, arena: 3, evoCyclesReq: 2, desc: 'Four little plastic soldiers with rifles.' }
};

const STRAT_TIPS = {
    archer: {
        base: "Drop the Archer behind a tank like Heavy Dwarf so she snipes air and ground safely while the tank soaks tower fire.",
        evo1: "EVO TIER 1 (Marksman): gains map-wide range on troops and structures (can't snipe the enemy towers from afar). Cycle it in, then pick off their support from the back line.",
        evo2: "EVO TIER 2 (Hero): unlocks the always-ready Power Arrow ability button. Save it to shred a tank push at the moment they commit.",
        ability: "Power Arrow (2 Elixir): for 5 seconds your archers fire glowing laser arrows at 5x attack speed. Long cooldown — pick your moment."
    },
    batman: {
        base: "The Dark Knight grapples the nearest enemy troop in and beats it down in melee. Drop him in front of a glass-cannon push to yank their key unit out of position.",
        evo1: "EVO TIER 1: longer grapple reach and a short stun on impact — peel multiple attackers off your tower.",
        evo2: "EVO TIER 2: a thrown batarang staggers a clustered group, setting up the grapple."
    },
    deku: {
        base: "Smash Prodigy strikes in a wide cone, so he shines against swarms. Let enemies clump up, then send him in to clear three units at once.",
        evo1: "EVO TIER 1: bigger cone plus a knockback shockwave that resets charging enemies.",
        evo2: "EVO TIER 2: a Detroit-Smash burst of One For All that deletes a tightly packed group."
    },
    bombur: {
        base: "Heavy Dwarf ignores troops and barrels straight at your buildings. Use him as the tank up front and tuck ranged units like the Archer safely behind.",
        evo1: "EVO TIER 1: even tankier with a damage-reducing belly-flop — perfect to lead a push.",
        evo2: "EVO TIER 2: on death he drops a feast that heals nearby allies."
    },
    cap: {
        base: "Captain's shield blocks the first 3 hits completely, so lead your push with him to eat tower shots and protect the squishy units behind.",
        evo1: "EVO TIER 1: the shield reflects projectiles back at ranged attackers.",
        evo2: "EVO TIER 2: a shield-throw that ricochets between several enemies."
    },
    ninja: {
        base: "Assassins spawn as 3 fast attackers for just 1 Elixir — a cheap defense to swarm a tank or a quick cycle card. Keep them away from splash damage.",
        evo1: "EVO TIER 1: each spawns with brief stealth, ignoring the first hit.",
        evo2: "EVO TIER 2: a smoke-bomb dash that drops the whole squad onto a back-line target."
    },
    haaland: {
        base: "The Striker locks onto buildings and charges up — the longer he runs unblocked, the harder he hits. Give him a clear lane behind a tank for a huge tower strike.",
        evo1: "EVO TIER 1: keeps his charge through the first hit, so chip damage won't reset him.",
        evo2: "EVO TIER 2: a Rocket Shot that fires a charged blast at the tower from range."
    },
    tower: {
        base: "A-Tower is a defensive building that hits air and ground. Place it center to pull enemy pushes toward your King while your troops counter from the side.",
        evo1: "EVO TIER 1: longer range and faster missiles.",
        evo2: "EVO TIER 2: overcharges into a homing barrage when its health runs low."
    },
    ultron: {
        base: "Ultron Bots are a flying swarm of 3 that ignore the river. Send them at an undefended tower or to gang up a lone ground tank — but they melt to splash.",
        evo1: "EVO TIER 1: surviving bots slowly self-repair.",
        evo2: "EVO TIER 2: a sentience pulse that briefly disables an enemy building."
    },
    naruto: {
        base: "Ninja Dash is an insanely fast melee rusher. Use his speed to punish a back-line support or snipe a weakened tower before defenders arrive.",
        evo1: "EVO TIER 1: leaves shadow clones that chip the nearest enemy.",
        evo2: "EVO TIER 2: a Rasengan burst that staggers and heavily damages a single target."
    },
    martian: {
        base: "The Martian is a flying tank that hits air and ground from range. Lead an air push with him so he soaks fire while dealing steady psychic damage.",
        evo1: "EVO TIER 1: phases through the first source of damage each life.",
        evo2: "EVO TIER 2: a mind-blast that briefly turns an enemy troop to your side."
    },
    nobu: {
        base: "The Hand sits at the back and periodically summons assassins to defend. Shield him behind your tower and let the endless ninjas grind down pushes.",
        evo1: "EVO TIER 1: summons arrive faster and in larger groups.",
        evo2: "EVO TIER 2: a ritual that revives a fallen ally as a shadow."
    },
    indy: {
        base: "Dr. Jones tunnels and pops up anywhere on the map. Drop him right on enemy back-line support or straight onto a tower to start chip damage.",
        evo1: "EVO TIER 1: surfaces with brief invulnerability and a stun.",
        evo2: "EVO TIER 2: a whip-pull that drags a back-line troop into the open."
    },
    golem: {
        base: "The Gamma Brute is an unstoppable green wall of muscle that pounds anything in melee. Lead your push with him and stack squishy damage behind his huge health bar.",
        evo1: "EVO TIER 1: angrier and tankier — the madder he gets, the harder he hits.",
        evo2: "EVO TIER 2: a Thunder Clap ability that shockwaves and stuns everything around him."
    },
    drake: {
        base: "The Blast Hero rockets around on explosions, ignoring the river and hitting air and ground. Aggressive and mobile — dive an exposed lane or chase down support.",
        evo1: "EVO TIER 1: bigger blasts and a faster fuse.",
        evo2: "EVO TIER 2: a Howitzer ability that drops a massive explosion on a clustered group."
    },
    sniper: {
        base: "The Jester flings explosive cards from clear across the map and hits like a truck — but he's paper-thin. Hide him far behind your tank and let him pick off key targets.",
        evo1: "EVO TIER 1: even longer reach and a faster draw.",
        evo2: "EVO TIER 2: a Royal Flush ability — an instant high-damage card straight to the nearest threat."
    },
    medic: {
        base: "The Care Bot is a soft healthcare robot that pulses healing to nearby allies. Tuck it behind a big push so your tank and troops outlast everything the enemy throws.",
        evo1: "EVO TIER 1: heals more, more often.",
        evo2: "EVO TIER 2: a Mass Heal ability that instantly tops up your whole army."
    },
    drones: {
        base: "Toy Troopers deploy as four little plastic soldiers with rifles — a cheap swarm that shreds a lone tank or chips an open tower. Keep them clear of splash damage.",
        evo1: "EVO TIER 1: tougher plastic — they take an extra hit each.",
        evo2: "EVO TIER 2: a Reinforce ability that drops two more troopers into the squad."
    },
    generic: {
        base: "Experiment with placements and timings to master this hero's tactical advantage.",
        evo1: "Evo data encrypted. Discover in future sectors.",
        evo2: "Evo data encrypted. Discover in future sectors."
    }
};

const CARDS_REQ = [0, 2, 4, 10, 20, 50, 100, 200, 400, 800, 1000];
const GOLD_REQ = [0, 50, 100, 400, 1000, 2000, 4000, 8000, 15000, 30000, 50000];
const BOT_NAMES = ["NeonPhantom", "GridHacker", "Vanguard_99", "NullSector", "ZeroCool", "ByteMe", "GhostInTheMachine", "ClashKing"];

const TROPHY_ROAD = [
    { id: 't_0',   type: 'arena',  req: 0,   title: 'Neon Valley', desc: 'Arena 1' },
    { id: 't_50',  type: 'reward', req: 50,  title: 'Gold Stash',  desc: '+500 Gold', icon: '💰', rType: 'gold', rAmt: 500 },
    { id: 't_200', type: 'reward', req: 200, title: 'Bat-Tech',    desc: '20 Batman Cards', icon: '🦇', rType: 'card', rId: 'batman', rAmt: 20 },
    { id: 't_400', type: 'arena',  req: 400, title: 'Cyber Slums', desc: 'Arena 2 (Unlocks New Cards!)' },
    { id: 't_500', type: 'reward', req: 500, title: 'Relic Hunter',desc: '30 Dr. Jones Cards', icon: '🤠', rType: 'card', rId: 'indy', rAmt: 30 },
    { id: 't_600', type: 'reward', req: 600, title: 'Gem Stash',   desc: '+5 Gems', icon: '💎', rType: 'gem', rAmt: 5 },
    { id: 't_1000', type: 'arena',  req: 1000, title: 'Quantum Spire', desc: 'Arena 3 (Unlocks 5 New Heroes!)' },
    { id: 't_1150', type: 'reward', req: 1150, title: 'Gamma Core',  desc: '25 Gamma Brute Cards', icon: '👊', rType: 'card', rId: 'golem', rAmt: 25 },
    { id: 't_1350', type: 'reward', req: 1350, title: 'Hero Crate',  desc: '+15 Gems', icon: '💥', rType: 'gem', rAmt: 15 }
];

const SafeStorage = {
    get: function(k) { try { return localStorage.getItem(k); } catch(e) { return null; } },
    set: function(k,v) { try { localStorage.setItem(k,v); } catch(e) { } },
    remove: function(k) { try { localStorage.removeItem(k); } catch(e) { } }
};

let defaultSave = {
    version: 14.0, tutorialDone: false, username: "", level: 1, xp: 0, gold: 0, gems: 0, trophies: 0,
    evoDust: 0, evoShards: 0,
    cards: {}, cardPlays: {}, claimedMilestones: [],
    activeDeck: ['archer', 'batman', 'deku', 'bombur', 'cap', 'ninja', 'haaland', 'tower'],
    shopData: { lastRefresh: "", deals: [] }
};

// Separate save profiles per device/tab:  localhost:3000  vs  localhost:3000?p=2
const SAVE_KEY = (function(){ try { let p = new URLSearchParams(location.search).get('p'); return 'neonBlitzSave' + (p ? '_' + p.replace(/[^a-zA-Z0-9]/g,'') : ''); } catch(e){ return 'neonBlitzSave'; } })();
let pData = null;
let rawData = SafeStorage.get(SAVE_KEY);
if(rawData) { try { pData = JSON.parse(rawData); } catch(e) { pData = null; } }

if (!pData || pData.version !== 14.0 || !Array.isArray(pData.activeDeck)) {
    pData = JSON.parse(JSON.stringify(defaultSave));
    SafeStorage.set(SAVE_KEY, JSON.stringify(pData));
}

let selectedDeckSlotIndex = null;
let currentOpponentData = null;
let activeEvoCard = null;
let playerCycles = {}; 
let currentModalKey = null;
let currentModalTier = 0;
let mmTimerInterval = null; 

let towers = []; let troops = []; let projectiles = []; let particles = [];
let playerDeckCycle = []; let playerHandCycle = []; let playerNextCard = ''; 
let aiDeckCycle = []; let aiHandCycle = [];
let elixir = 5.0; let aiElixir = 1.0; let aiCooldown = 0; let mouseX = 0, mouseY = 0, isHovering = false; let riverAnimateTimer = 0;
let totalMatchSeconds = 180; let overtimeSeconds = 60; let overtimeActive = false; let lastTimerTick = 0; let combatActive = false; let blueCrownScore = 0; let redCrownScore = 0;
let activeCombatCard = ''; let activeCombatCost = 0;
let currentEvoAbilityId = null;
let abilityCooldowns = {};
// ---- Multiplayer state (driven by net.js) ----
let netActive = false;   // true during an online match
let netRole = null;      // 'host' | 'guest' | null
let netSnapTick = 0;
let currentAbilityCard = null;

Object.keys(cardDatabase).forEach(k => { 
    if(!pData.cards[k]) pData.cards[k] = { level: (cardDatabase[k].arena === 1 ? 1 : 0), amount: 0, evoTier: 0 }; 
    if(pData.cardPlays[k] === undefined) pData.cardPlays[k] = 0;
});

window.factoryResetAccount = function() {
    if(confirm("Are you sure you want to hard reset everything? All cards and progress will be deleted forever.")) {
        SafeStorage.remove(SAVE_KEY);
        window.location.reload(); 
    }
};

function saveData() { SafeStorage.set(SAVE_KEY, JSON.stringify(pData)); updateTopResources(); }
function getArenaLevel() { return pData.trophies >= 1000 ? 3 : (pData.trophies >= 400 ? 2 : 1); }

function updateTopResources() {
    document.getElementById('goldCounter').innerText = pData.gold;
    document.getElementById('gemCounter').innerText = pData.gems;
    document.getElementById('uiEvoDust').innerText = pData.evoDust;
    document.getElementById('uiEvoShards').innerText = pData.evoShards;
    document.getElementById('homeTrophyText').innerText = `🏆 ${pData.trophies} Trophies`;
    
    let aLevel = getArenaLevel();
    document.getElementById('arenaTitleUi').innerText = `Arena ${aLevel}`;
    document.getElementById('arenaNameUi').innerText = aLevel === 1 ? 'Neon Valley' : (aLevel === 2 ? 'Cyber Slums' : 'Quantum Spire');
    if(pData.username) document.getElementById('homeNameTag').innerText = `COMMANDER: ${pData.username}`;
    
    let xpReq = pData.level * 100 + (pData.level * pData.level * 50);
    document.getElementById('lvlBadge').innerText = `Lv.${pData.level}`;
    document.getElementById('xpText').innerText = `👑 ${pData.xp}/${xpReq}`;
    document.getElementById('xpFill').style.width = Math.min((pData.xp / xpReq) * 100, 100) + '%';
    
    let hasNotif = TROPHY_ROAD.some(n => pData.trophies >= n.req && !pData.claimedMilestones.includes(n.id) && n.type === 'reward');
    document.getElementById('trophyRedDot').style.display = hasNotif ? 'block' : 'none';
}

function gainXP(amt) {
    pData.xp += amt; 
    let xpReq = pData.level * 100 + (pData.level * pData.level * 50);
    if(pData.xp >= xpReq) { pData.xp -= xpReq; pData.level++; setTimeout(() => showChestUI("LEVEL UP CHEST!", 150, 0, 5, true), 500); }
    saveData();
}

function getDynamicStat(baseValue, level, isHp) {
    let actLvl = level === 0 ? 1 : level; return Math.floor(baseValue * Math.pow(isHp ? 1.15 : 1.12, actLvl - 1));
}

// --- NAVIGATION & TABS ---
window.switchTab = function(tabId, element) { 
    document.querySelectorAll('.tabScreen').forEach(screen => screen.classList.add('hidden')); 
    document.querySelectorAll('.navBtn').forEach(btn => btn.classList.remove('active')); 
    document.getElementById('screen' + tabId).classList.remove('hidden'); 
    if(element) element.classList.add('active'); 
    if(tabId === 'Troops') renderTroopsMenu(); 
    if(tabId === 'Shop') renderShop();
    if(tabId === 'Evos') renderEvoChamber();
}

// --- SHOP ENGINE ---
function checkShopRefresh() {
    let today = new Date().toDateString();
    if(pData.shopData.lastRefresh !== today) { pData.shopData.lastRefresh = today; pData.shopData.deals = generateDailyDeals(); saveData(); }
}

function generateDailyDeals() {
    let deals = []; let isSunday = new Date().getDay() === 0; 
    let unlockedCards = Object.keys(cardDatabase).filter(k => cardDatabase[k].arena <= getArenaLevel());
    
    if(isSunday) {
        let epics = unlockedCards.filter(k => cardDatabase[k].cost >= 4);
        if(epics.length === 0) epics = unlockedCards;
        let randomEpic = epics[Math.floor(Math.random()*epics.length)];
        deals.push({ id: 0, type: 'card', cardKey: randomEpic, amount: 5, costType: 'free', cost: 0, claimed: false, epicSunday: true });
    } else {
        let isGold = Math.random() > 0.5;
        deals.push({ id: 0, type: isGold ? 'gold' : 'gem', amount: isGold ? 100 : 5, costType: 'free', cost: 0, claimed: false, epicSunday: false });
    }

    for(let i=1; i<6; i++) {
        let randomCard = unlockedCards[Math.floor(Math.random()*unlockedCards.length)];
        let amount = Math.floor(Math.random() * 20) + 10;
        let isGems = Math.random() > 0.8;
        let cost = isGems ? Math.floor(amount / 2) + 5 : amount * 10; 
        deals.push({ id: i, type: 'card', cardKey: randomCard, amount: amount, costType: isGems ? 'gem' : 'gold', cost: cost, claimed: false, epicSunday: false });
    }
    return deals;
}

window.renderShop = function() {
    checkShopRefresh();
    let container = document.getElementById('shopDealsContainer'); if(!container) return; container.innerHTML = '';
    let isSunday = new Date().getDay() === 0; document.getElementById('epicSundayBanner').style.display = isSunday ? 'block' : 'none';

    pData.shopData.deals.forEach(deal => {
        let title = ""; let icon = "";
        if(deal.type === 'card') { title = cardDatabase[deal.cardKey].name; icon = cardDatabase[deal.cardKey].icon; } 
        else if(deal.type === 'gold') { title = "Gold Stash"; icon = "💰"; } 
        else if(deal.type === 'gem') { title = "Gems"; icon = "💎"; }

        let costHtml = "";
        if(deal.claimed) { costHtml = `<div style="color:#2ecc71; font-weight:bold; font-size:10px; margin-top:8px;">SOLD OUT</div>`; } 
        else if(deal.costType === 'free') { costHtml = `<button class="btn" style="padding:4px 10px; font-size:10px; margin-top:8px; border-color:#2ecc71; color:#2ecc71; width:100%; box-sizing:border-box;" onclick="buyDeal(${deal.id})">FREE</button>`; } 
        else {
            let costIcon = deal.costType === 'gold' ? '💰' : '💎'; let costColor = deal.costType === 'gold' ? '#f1c40f' : '#66fcf1';
            costHtml = `<button class="btn" style="padding:4px 10px; font-size:10px; margin-top:8px; border-color:${costColor}; color:${costColor}; width:100%; box-sizing:border-box;" onclick="buyDeal(${deal.id})">${costIcon} ${deal.cost}</button>`;
        }
        let bgStyle = deal.epicSunday ? "background: linear-gradient(135deg, #11141a, #4a235a);" : "background: #11141a;";
        container.innerHTML += `<div style="border:2px solid #1f2833; border-radius:8px; padding:10px 5px; display:flex; flex-direction:column; align-items:center; justify-content:space-between; text-align:center; ${bgStyle}">${deal.epicSunday ? `<div style="font-size:8px; color:#f1c40f; font-weight:bold; margin-bottom:4px; text-transform:uppercase;">Epic Sunday!</div>` : ''}<div style="font-size:28px; margin-bottom:4px;">${icon}</div><div style="font-size:14px; font-weight:bold; color:#fff;">x${deal.amount}</div><div style="font-size:9px; color:#45a29e; margin-top:2px; height:20px; overflow:hidden;">${title}</div>${costHtml}</div>`;
    });
}

window.buyDeal = function(id) {
    let deal = pData.shopData.deals.find(d => d.id === id);
    if(!deal || deal.claimed) return;
    if(deal.costType === 'gold' && pData.gold < deal.cost) { alert("Not enough Gold!"); return; }
    if(deal.costType === 'gem' && pData.gems < deal.cost) { alert("Not enough Gems!"); return; }

    if(deal.costType === 'gold') pData.gold -= deal.cost; if(deal.costType === 'gem') pData.gems -= deal.cost;
    if(deal.type === 'card') { if(pData.cards[deal.cardKey].level === 0) pData.cards[deal.cardKey].level = 1; pData.cards[deal.cardKey].amount += deal.amount; } 
    else if(deal.type === 'gold') { pData.gold += deal.amount; } else if(deal.type === 'gem') { pData.gems += deal.amount; }

    deal.claimed = true; saveData(); renderShop(); renderTroopsMenu();
}

window.buyChest = function(type) {
    if(type === 'silver') { if(pData.gems < 50) { alert("Not enough Gems!"); return; } pData.gems -= 50; saveData(); showChestUI("SILVER CRATE", 100, 0, 4, false); } 
    else if(type === 'golden') { if(pData.gems < 150) { alert("Not enough Gems!"); return; } pData.gems -= 150; saveData(); showChestUI("GOLDEN CRATE", 300, 0, 8, true); }
}

window.highlightDeckSlot = function(index) {
    if(selectedDeckSlotIndex !== null && selectedDeckSlotIndex !== index) {
        let temp = pData.activeDeck[selectedDeckSlotIndex]; pData.activeDeck[selectedDeckSlotIndex] = pData.activeDeck[index]; pData.activeDeck[index] = temp;
        selectedDeckSlotIndex = null; saveData(); renderTroopsMenu();
    } else { selectedDeckSlotIndex = index === selectedDeckSlotIndex ? null : index; renderActiveDeckBar(); }
}

function renderActiveDeckBar() {
    let grid = document.getElementById('activeDeckBuilderGrid'); if(!grid) return; grid.innerHTML = '';
    pData.activeDeck.forEach((cardKey, i) => {
        let c = cardDatabase[cardKey]; if(!c) return; 
        let isSel = (i === selectedDeckSlotIndex) ? 'selectedSlot' : '';
        grid.innerHTML += `<div class="deckSlotCard ${isSel}" onclick="highlightDeckSlot(${i})"><span class="slotIcon">${c.icon}</span><span class="slotLvl">Lv.${pData.cards[cardKey].level}</span></div>`;
    });
}

function renderTroopsMenu() {
    renderActiveDeckBar();
    let grid = document.getElementById('fullCardGrid'); if(!grid) return; grid.innerHTML = '';
    let curArena = getArenaLevel();

    for (let key in cardDatabase) {
        if(!cardDatabase.hasOwnProperty(key)) continue;
        let cBase = cardDatabase[key]; 
        let pState = pData.cards[key];
        let isDiscovered = pState.level > 0;
        
        if(cBase.arena > curArena && !isDiscovered) {
            grid.innerHTML += `<div class="uiCard lockedArena" onclick="openTroopModal('${key}')"><div class="lockedOverlay">🔒<br>Arena ${cBase.arena}</div><div class="cardIcon">${cBase.icon}</div><div class="cardTitle">Locked</div></div>`;
            continue;
        }

        let isDecked = pData.activeDeck.includes(key);
        let curHp = getDynamicStat(cBase.hp, pState.level, true); let curDmg = getDynamicStat(cBase.dmg, pState.level, false);
        let cReq = CARDS_REQ[pState.level] || 9999; let gReq = GOLD_REQ[pState.level] || 9999;
        let fillPct = isDiscovered ? Math.min((pState.amount / cReq) * 100, 100) : 0;
        let readyCards = isDiscovered && pState.amount >= cReq; let readyGold = pData.gold >= gReq;
        
        let btnClass = "upgBtn locked"; let btnText = isDiscovered ? "NEED CARDS" : "LOCKED";
        if (readyCards && readyGold) { btnClass = "upgBtn ready"; btnText = `UPGRADE (${gReq}g)`; }
        else if (readyCards && !readyGold) { btnClass = "upgBtn locked"; btnText = `NEED GOLD (${gReq}g)`; }

        let evoClass = pState.evoTier === 1 ? "evoTier1" : (pState.evoTier === 2 ? "evoTier2" : "");
        let evoBadge = pState.evoTier > 0 ? `<div class="evoBadge">🔮</div>` : "";

        grid.innerHTML += `
        <div class="uiCard ${evoClass} ${!isDiscovered?'undiscoveredCard':''} ${isDecked?'inActiveDeck':''}" onclick="processCardGridClick('${key}')">
            ${evoBadge}
            <div class="cardIcon">${cBase.icon}</div>
            <div class="cardTitle">${cBase.name} ${isDiscovered?`<span class="lvlTxt" style="color:#66fcf1;font-size:10px;">(Lv.${pState.level})</span>`:''}</div>
            <div class="cardDesc statTxt">${isDiscovered?`HP: ${curHp} | DMG: ${curDmg}`:'Locked in Chests'}<br>${cBase.cost} Mana</div>
            ${isDiscovered?`<div class="cardProgBar"><div class="cardProgFill ${readyCards?'ready':''}" style="width:${fillPct}%"></div><div class="cardProgText">${pState.amount} / ${cReq}</div></div><button class="${btnClass}" onclick="upgradeCard(event, '${key}', ${gReq}, ${cReq}, ${readyCards}, ${readyGold})">${btnText}</button>`:''}
        </div>`;
    }
}

window.processCardGridClick = function(key) {
    let pState = pData.cards[key];
    if(selectedDeckSlotIndex !== null) {
        if(!pState || pState.level === 0) { alert("You haven't discovered this card yet! Pull it from Chests to equip."); selectedDeckSlotIndex = null; renderActiveDeckBar(); return; }
        if(pData.activeDeck.includes(key)) {
            let oldIndex = pData.activeDeck.indexOf(key); let temp = pData.activeDeck[selectedDeckSlotIndex];
            pData.activeDeck[selectedDeckSlotIndex] = key; pData.activeDeck[oldIndex] = temp;
        } else { pData.activeDeck[selectedDeckSlotIndex] = key; }
        selectedDeckSlotIndex = null; saveData(); renderTroopsMenu();
    } else { openTroopModal(key); }
}

window.upgradeCard = function(e, key, gReq, cReq, readyCards, readyGold) {
    if(e) e.stopPropagation(); 
    if(readyCards && readyGold) { pData.gold -= gReq; pData.cards[key].amount -= cReq; pData.cards[key].level++; gainXP(pData.cards[key].level * 25); saveData(); renderTroopsMenu(); }
}

// --- ACADEMY DIORAMA INTEL MODAL PAGING ---
window.openTroopModal = function(key) {
    currentModalKey = key; currentModalTier = 0;
    document.getElementById('troopModal').style.display = 'flex'; renderModalView();
}
window.changeModalEvoView = function(dir) {
    let newTier = currentModalTier + dir; if(newTier < 0 || newTier > 2) return;
    currentModalTier = newTier; renderModalView();
}
function renderModalView() {
    let key = currentModalKey; let tier = currentModalTier;
    let cBase = cardDatabase[key]; let pState = pData.cards[key];
    let lvl = pState.level === 0 ? 1 : pState.level; let nameAppend = pState.level === 0 ? " (LOCKED)" : ` (Lv.${lvl})`;
    let targetText = cBase.target === 'building' ? 'BUILDINGS' : (cBase.targetsAir ? 'AIR & GROUND' : 'GROUND');
    let rangeText = cBase.range; let traitText = cBase.trait ? cBase.trait.toUpperCase() : 'NONE';
    
    let titleStr = "BASE FORM"; let titleColor = "#66fcf1"; let boxShadow = "0 10px 40px rgba(102,252,241,0.3)"; let boxBorder = "#66fcf1";
    let stratObj = STRAT_TIPS[key] || STRAT_TIPS['generic']; let displayStrat = stratObj.base || stratObj;

    if(tier === 1) {
        titleStr = "EVO TIER 1"; titleColor = "#9b59b6"; boxBorder = "#9b59b6"; boxShadow = "0 10px 40px rgba(155,89,182,0.3)";
        displayStrat = stratObj.evo1 || "Evo Data Encrypted.";
        if(key === 'archer') { rangeText = "INFINITE"; traitText = "MAP SNIPER"; }
    } else if (tier === 2) {
        titleStr = "EVO TIER 2"; titleColor = "#e056fd"; boxBorder = "#e056fd"; boxShadow = "0 10px 40px rgba(224,86,253,0.3)";
        displayStrat = stratObj.evo2 || "Evo Data Encrypted.";
        if(key === 'archer') { rangeText = "INFINITE"; traitText = "POWER ARROW"; }
    }

    document.getElementById('troopModalBox').style.borderColor = boxBorder;
    document.getElementById('troopModalBox').style.boxShadow = boxShadow;
    document.getElementById('modalTierTitle').innerText = titleStr;
    document.getElementById('modalTierTitle').style.color = titleColor;

    document.getElementById('modalNavLeft').disabled = (tier === 0);
    document.getElementById('modalNavRight').disabled = (tier === 2);

    document.getElementById('modIcon').innerText = cBase.icon; document.getElementById('modName').innerText = cBase.name + nameAppend; document.getElementById('modTrait').innerText = cBase.desc;
    document.getElementById('modStats').innerHTML = `<div class="statItem">MANA <span class="statVal" style="color:#9b59b6">${cBase.cost}</span></div><div class="statItem">HEALTH <span class="statVal">${getDynamicStat(cBase.hp, lvl, true)}</span></div><div class="statItem">DAMAGE <span class="statVal">${getDynamicStat(cBase.dmg, lvl, false)}</span></div><div class="statItem">TARGETS <span class="statVal" style="color:#f1c40f;">${targetText}</span></div><div class="statItem">RANGE <span class="statVal" style="color:${tier>0?'#e056fd':'#fff'}">${rangeText}</span></div><div class="statItem">TRAIT <span class="statVal" style="color:${tier>0?'#e056fd':'#fff'}">${traitText}</span></div>`;
    document.getElementById('modStratText').innerText = displayStrat;

    if(tier === 2 && stratObj.ability) { document.getElementById('modAbilityBox').style.display = 'block'; document.getElementById('modAbilityText').innerText = stratObj.ability; } 
    else { document.getElementById('modAbilityBox').style.display = 'none'; }

    // costume art at the top of the info card
    renderCharPreview(key, tier);
    let frame = document.getElementById('charPreviewFrame'); if(frame) frame.style.borderColor = boxBorder;

    // gameplay demo clip: each scene shows a recommended way to use the unit
    let vHtml = "", tacticCap = "";
    let I = (emoji, left, opts) => `<span style="position:absolute;${left};font-size:${(opts&&opts.size)||26}px;${(opts&&opts.extra)||''}">${emoji}</span>`;
    if(key === 'archer') {
        if(tier === 0) { tacticCap = "Shield her behind a tank, snipe over the top";
            vHtml = I('🍖','left:34%;bottom:14px;z-index:1',{size:32}) + I('🏹','left:14%;bottom:16px;z-index:2',{size:26}) + `<span style="position:absolute;left:26%;bottom:34px;color:#c39bd3;font-size:20px;z-index:3;animation:arrowShot 1.3s infinite;">➵</span>` + I('🧟','right:14%;bottom:14px',{size:28}); }
        else { tacticCap = "Marksman range: pick off their back line";
            vHtml = I('🏹','left:10%;bottom:16px;z-index:2',{size:28}) + `<span style="position:absolute;left:22%;bottom:40px;color:#e056fd;font-size:20px;z-index:3;text-shadow:0 0 10px #e056fd;animation:arrowShot 0.5s infinite;">➵</span>` + I('🤺','right:24%;bottom:16px',{size:24}) + I('🏰','right:8%;bottom:14px',{size:34}); }
    }
    else if(key === 'batman') { tacticCap = "Yank their squishy support into melee";
        vHtml = I('🦇','left:14%;bottom:16px;z-index:2',{size:28}) + `<div style="position:absolute;left:26%;bottom:30px;height:2px;background:#9aa6ad;animation:grappleHook 2s infinite;"></div>` + I('🏹','right:18%;bottom:16px',{size:26,extra:'animation:tacticalPull 2s infinite;'}); }
    else if(key === 'deku') { tacticCap = "Wait for them to clump, then splash the cone";
        vHtml = I('⚡','left:24%;bottom:16px;z-index:2',{size:28}) + `<div style="position:absolute;left:20%;bottom:18px;width:36px;height:36px;border:3px solid #2ecc71;border-radius:50%;animation:smashPulse 1.5s infinite;"></div>` + I('🥷','left:52%;bottom:34px',{size:18,extra:'animation:tacticalDie 1.5s infinite;'}) + I('🥷','right:22%;bottom:16px',{size:18,extra:'animation:tacticalDie 1.5s infinite;'}) + I('🥷','right:14%;bottom:40px',{size:18,extra:'animation:tacticalDie 1.5s infinite;'}); }
    else if(key === 'bombur') { tacticCap = "Tank up front — he only wants towers";
        vHtml = I('🍖','left:8%;bottom:16px',{size:28,extra:'animation:tacticalWalk 4s infinite linear;'}) + I('🏹','left:6%;bottom:18px',{size:18}) + I('🤺','left:52%;bottom:18px',{size:20}) + I('🏰','right:8%;bottom:14px',{size:34}); }
    else if(key === 'cap') { tacticCap = "Lead the push — his shield eats the hits";
        vHtml = I('🛡️','left:20%;bottom:16px;z-index:2',{size:28}) + `<div style="position:absolute;left:16%;bottom:16px;width:40px;height:40px;border:3px solid #3498db;border-radius:50%;animation:tacticalBlock 2s infinite;"></div>` + I('🤖','right:18%;bottom:16px',{size:28}) + `<span style="position:absolute;right:30%;bottom:34px;color:#e74c3c;font-size:18px;animation:enemyShoot 2s infinite;">🚀</span>`; }
    else if(key === 'ninja') { tacticCap = "Cheap swarm to melt a lone tank";
        vHtml = I('🥷','left:28%;bottom:16px',{size:18}) + I('🥷','left:24%;bottom:42px',{size:18}) + I('🥷','left:38%;bottom:60px',{size:18}) + I('🍖','right:22%;bottom:14px',{size:34}); }
    else if(key === 'haaland') { tacticCap = "Give him a clear lane to charge the tower";
        vHtml = I('⚽','left:8%;bottom:18px',{size:28,extra:'animation:chargeDash 2.2s infinite;'}) + `<div style="position:absolute;left:10%;bottom:16px;width:74%;height:8px;border-bottom:2px dashed rgba(241,196,15,0.5);"></div>` + I('🏰','right:8%;bottom:14px',{size:34}); }
    else if(key === 'tower') { tacticCap = "Place center to distract and shred";
        vHtml = I('🏢','left:16%;bottom:14px',{size:34}) + `<span style="position:absolute;left:32%;bottom:40px;color:#e74c3c;font-size:16px;animation:arrowShot 1.5s infinite;">🚀</span>` + I('🧟','right:18%;bottom:16px',{size:24,extra:'animation:tacticalWalk 1.5s infinite reverse;'}); }
    else if(key === 'ultron') { tacticCap = "Fly past defenders to an open tower";
        vHtml = I('🤖','left:14%;bottom:50px',{size:26,extra:'animation:float 2s infinite ease-in-out;'}) + I('🤖','left:32%;bottom:62px',{size:22,extra:'animation:float 2.5s infinite ease-in-out;'}) + `<div style="position:absolute;left:5%;bottom:30px;width:90%;height:3px;background:#2c3e50;"></div>` + I('🏰','right:12%;bottom:14px',{size:32}); }
    else if(key === 'naruto') { tacticCap = "Rush down their support before help arrives";
        vHtml = I('🦊','left:8%;bottom:18px',{size:30,extra:'animation:chargeDash 1s infinite linear;'}) + I('🏹','right:18%;bottom:16px',{size:26}); }
    else if(key === 'martian') { tacticCap = "Air tank — soak fire, chip from range";
        vHtml = I('👽','left:14%;bottom:40px',{size:30,extra:'animation:float 3s infinite ease-in-out;'}) + `<span style="position:absolute;left:30%;bottom:50px;color:#2ecc71;font-size:20px;animation:arrowShot 1.2s infinite;">➵</span>` + I('🏢','right:16%;bottom:14px',{size:30}); }
    else if(key === 'nobu') { tacticCap = "Defend from the back with endless ninjas";
        vHtml = I('👺','left:12%;bottom:16px',{size:30}) + I('🏰','left:10%;bottom:14px',{size:20,extra:'opacity:0.6;'}) + I('🥷','left:34%;bottom:40px',{size:16,extra:'animation:smashPulse 2s infinite;'}) + I('🥷','left:30%;bottom:16px',{size:16,extra:'animation:smashPulse 2s infinite;'}) + I('🧟','right:14%;bottom:16px',{size:28}); }
    else if(key === 'indy') { tacticCap = "Tunnel straight onto a tower or support";
        vHtml = I('🕳️','right:14%;bottom:14px',{size:24}) + I('🤠','right:16%;bottom:18px',{size:30,extra:'animation:float 1.6s infinite ease-in-out;'}) + I('🏰','right:8%;bottom:14px',{size:34,extra:'opacity:0.9;'}); }
    else if(key === 'golem') { tacticCap = "Lead the charge — stack your DPS behind him";
        vHtml = I('👊','left:10%;bottom:14px',{size:34,extra:'animation:tacticalWalk 4s infinite linear;'}) + I('🃏','left:6%;bottom:18px',{size:18}) + I('🏰','right:8%;bottom:14px',{size:34}); }
    else if(key === 'drake') { tacticCap = "Rocket over the river and blast a lane";
        vHtml = I('💥','left:12%;bottom:42px',{size:30,extra:'animation:float 2.6s infinite ease-in-out;'}) + `<span style="position:absolute;left:34%;bottom:46px;font-size:18px;animation:arrowShot 1.1s infinite;">💥</span>` + I('🏢','right:16%;bottom:14px',{size:30}); }
    else if(key === 'sniper') { tacticCap = "Fling cards from max range behind your tank";
        vHtml = I('🃏','left:8%;bottom:16px',{size:26}) + `<div style="position:absolute;left:18%;bottom:30px;width:62%;height:2px;background:rgba(70,211,255,0.6);"></div>` + I('🤺','right:22%;bottom:16px',{size:22,extra:'animation:tacticalDie 1.6s infinite;'}) + I('🏰','right:8%;bottom:14px',{size:30}); }
    else if(key === 'medic') { tacticCap = "Heal your push so it outlasts theirs";
        vHtml = I('🤍','left:14%;bottom:16px',{size:26}) + `<div style="position:absolute;left:16%;bottom:14px;width:42px;height:42px;border:3px solid #2ecc71;border-radius:50%;animation:smashPulse 1.8s infinite;"></div>` + I('👊','left:46%;bottom:16px',{size:28}) + I('🏰','right:10%;bottom:14px',{size:30}); }
    else if(key === 'drones') { tacticCap = "Swarm a lone tank or an open tower";
        vHtml = I('🪖','left:18%;bottom:16px',{size:20}) + I('🪖','left:30%;bottom:16px',{size:20}) + I('🪖','left:24%;bottom:38px',{size:20}) + I('🍖','right:20%;bottom:14px',{size:32}); }

    let capColor = tier === 0 ? '#ffd84a' : (tier === 1 ? '#c39bd3' : '#e056fd');
    document.getElementById('modVideo').innerHTML =
        `<div style="position:absolute;top:6px;left:8px;font-size:9px;color:#ff5a72;font-weight:900;letter-spacing:1px;z-index:10;">● LIVE TACTIC</div>` +
        `<div style="position:absolute;bottom:5px;width:100%;text-align:center;font-size:9.5px;color:${capColor};letter-spacing:0.5px;font-weight:800;z-index:10;padding:0 6px;box-sizing:border-box;">▶ ${tacticCap}</div>` +
        vHtml;
}
// Draw the card's costume design (vector art) at the top of the info page, like Clash Royale
function renderCharPreview(type, tier) {
    let pcv = document.getElementById('charPreviewCanvas'); if(!pcv) return;
    let pctx = pcv.getContext('2d');
    let prevCtx = ctx; ctx = pctx;                 // point the renderer at the preview canvas
    pctx.setTransform(1, 0, 0, 1, 0, 0); pctx.clearRect(0, 0, 130, 130);
    let base = cardDatabase[type];
    let fake = {
        type: type, team: 'blue', x: 0, y: 0, facing: -1, hp: 1, maxHp: 1,
        state: 'idle', hitFlash: 0, flying: base.trait === 'flying',
        isEvo: tier >= 1, abilityActive: (type === 'archer' && tier >= 2) ? 1 : 0,
        atkTimer: 0, shield: base.trait === 'shield' ? 3 : 0, isCharging: false
    };
    pctx.save(); pctx.translate(65, 104); pctx.scale(2.5, 2.5);
    try { drawTroop3D(fake, true); } catch(e) {}
    pctx.restore();
    ctx = prevCtx;                                 // restore the arena context
}
window.closeTroopModal = function() { document.getElementById('troopModal').style.display = 'none'; currentModalKey = null; }

// --- EVO CHAMBER ENGINE ---
window.renderEvoChamber = function() {
    let list = document.getElementById('evoCardList'); if(!list) return; list.innerHTML = '';
    for (let key in cardDatabase) {
        if(!cardDatabase.hasOwnProperty(key)) continue;
        let c = cardDatabase[key]; let pState = pData.cards[key]; let tier = pState.evoTier || 0;
        let discovered = pState.level > 0;
        let dot = tier >= 2 ? '🔮🔮' : (tier === 1 ? '🔮' : '○○');
        let action;
        if(!discovered) action = `<span style="color:#7f8ca8; font-weight:bold; font-size:10px;">🔒 DISCOVER FIRST</span>`;
        else if(tier < 2) action = `<button class="btn" style="padding:6px 14px; font-size:10px;" onclick="openEvoModal('${key}')">EVOLVE</button>`;
        else action = `<span style="color:#e056fd; font-weight:900; font-size:10px;">★ MAX TIER</span>`;
        list.innerHTML += `
        <div class="evoCardEntry" style="${discovered ? '' : 'opacity:0.55;'}">
            <div style="display:flex; align-items:center; gap:10px;">
                <div style="font-size:26px;">${c.icon}</div>
                <div>
                    <div style="font-size:14px; font-weight:900; color:#fff;">${c.name}</div>
                    <div style="font-size:10px; color:#e056fd; font-weight:700;">Evo Tier ${tier} / 2 &nbsp;${dot}</div>
                </div>
            </div>
            ${action}
        </div>`;
    }
}
window.convertDustToShard = function() { if(pData.evoDust >= 200) { pData.evoDust -= 200; pData.evoShards += 1; saveData(); renderEvoChamber(); } else { alert("You need 200 Evo Dust to synthesize a Shard!"); } }

window.openEvoModal = function(key) {
    activeEvoCard = key; let c = cardDatabase[key]; let tier = pData.cards[key].evoTier || 0;
    document.getElementById('evoModIcon').innerText = c.icon; document.getElementById('evoModName').innerText = c.name; document.getElementById('evoModTier').innerText = `CURRENT TIER: ${tier}`;
    let reqText = tier === 0 ? "Requires 6 Shards to Evolve to Tier 1" : "Requires 6 Shards to Evolve to Tier 2";
    document.getElementById('evoModReqText').innerText = reqText;
    let btn = document.getElementById('evoModBtn');
    if(pData.evoShards >= 6) { btn.innerText = "EVOLVE (6 🔮)"; btn.style.color = "#e056fd"; btn.style.borderColor = "#e056fd"; btn.disabled = false; } 
    else { btn.innerText = "NEED 6 SHARDS"; btn.style.color = "#555"; btn.style.borderColor = "#333"; btn.disabled = true; }
    document.getElementById('evoModal').style.display = 'flex';
}
window.closeEvoModal = function() { document.getElementById('evoModal').style.display = 'none'; activeEvoCard = null; }

window.initiateEvolution = function() {
    if(pData.evoShards >= 6 && activeEvoCard) {
        pData.evoShards -= 6; pData.cards[activeEvoCard].evoTier++; saveData(); closeEvoModal();
        let screen = document.getElementById('evoAnimationScreen'); document.getElementById('evoSpinIcon').innerText = cardDatabase[activeEvoCard].icon; document.getElementById('evoFinishBtn').style.opacity = 0;
        let flash = document.getElementById('evoFlashScreen'); flash.style.animation = 'none'; flash.offsetHeight; flash.style.animation = 'whiteFlash 3.5s forwards';
        let icon = document.getElementById('evoSpinIcon'); icon.style.animation = 'none'; icon.offsetHeight; icon.style.animation = 'evoSpin 2.5s cubic-bezier(0.5, 0, 0.5, 1) forwards';
        let text = document.getElementById('evoResultText'); text.style.animation = 'none'; text.offsetHeight; text.style.animation = 'fadeIn 1s 2.5s forwards';
        screen.style.display = 'flex';
        setTimeout(() => { document.getElementById('evoFinishBtn').style.opacity = 1; renderEvoChamber(); renderTroopsMenu(); }, 3500);
    }
}
window.closeEvoAnimation = function() { document.getElementById('evoAnimationScreen').style.display = 'none'; }

// --- TROPHY PATH REWARD Claim SYSTEMS ---
window.openTrophyRoad = function() { document.getElementById('trophyRoadOverlay').style.display = 'flex'; renderTrophyRoad(); }
window.closeTrophyRoad = function() { document.getElementById('trophyRoadOverlay').style.display = 'none'; }
function renderTrophyRoad() {
    let container = document.getElementById('trophyRoadContent'); if(!container) return; container.innerHTML = '';
    let reversedRoad = [...TROPHY_ROAD].reverse();
    reversedRoad.forEach((node, index) => {
        let isReached = pData.trophies >= node.req; let isClaimed = pData.claimedMilestones.includes(node.id);
        let canClaim = isReached && !isClaimed && node.type === 'reward';
        let statusColor = isReached ? (canClaim ? '#f1c40f' : '#2ecc71') : '#333'; let btnHtml = '';
        if(canClaim) btnHtml = `<button class="btn" style="padding:5px 15px; font-size:12px; border-color:#f1c40f; color:#f1c40f;" onclick="claimTrophyNode('${node.id}')">CLAIM</button>`;
        else if(node.type === 'reward' && isClaimed) btnHtml = `<span style="color:#2ecc71; font-weight:bold; font-size:12px;">CLAIMED ✓</span>`;
        else if(node.type === 'arena' && isReached) btnHtml = `<span style="color:#2ecc71; font-weight:bold; font-size:12px;">UNLOCKED</span>`;
        else btnHtml = `<span style="color:#555; font-size:12px; font-weight:bold;">🔒 ${node.req}</span>`;
        let icon = node.icon || (node.type === 'arena' ? '🏟️' : '🎁');
        container.innerHTML += `
        <div style="width:100%; max-width:320px; background:#11141a; border:2px solid ${statusColor}; border-radius:10px; padding:15px; display:flex; align-items:center; justify-content:space-between; position:relative;">
            <div style="display:flex; align-items:center; gap:10px;"><div style="font-size:30px;">${icon}</div><div><div style="font-size:16px; font-weight:bold; color:#fff;">${node.title}</div><div style="font-size:11px; color:#45a29e;">${node.desc}</div></div></div>
            <div>${btnHtml}</div>
        </div>
        ${index < reversedRoad.length - 1 ? `<div style="width:4px; height:30px; background:${statusColor}; margin:5px auto;"></div>` : ''}`;
    });
}
window.claimTrophyNode = function(id) {
    let node = TROPHY_ROAD.find(n => n.id === id);
    if(node) {
        if(node.rType === 'gold') pData.gold += node.rAmt;
        if(node.rType === 'gem') pData.gems += node.rAmt;
        if(node.rType === 'card') {
            if(pData.cards[node.rId].level === 0) pData.cards[node.rId].level = 1; 
            pData.cards[node.rId].amount += node.rAmt;
        }
        pData.claimedMilestones.push(id); saveData(); renderTrophyRoad(); renderTroopsMenu(); alert(`Claimed: ${node.desc}!`);
    }
}


// --- LIVE MAP COMBAT REAL TIME ENGINE SIMULATION ---
function initDeckEngine() {
    let deck = pData.activeDeck.filter(k => cardDatabase[k]);
    if(deck.length < 8) deck = ['archer','batman','deku','bombur','cap','ninja','haaland','tower'];
    playerDeckCycle = deck.slice().sort(() => Math.random() - 0.5);
    
    aiDeckCycle = (currentOpponentData && currentOpponentData.deck) ? currentOpponentData.deck.slice() : Object.keys(cardDatabase).sort(() => Math.random() - 0.5).slice(0, 8);
    Object.keys(cardDatabase).forEach(k => playerCycles[k] = 0); 
    
    playerHandCycle = playerDeckCycle.splice(0, 4); playerNextCard = playerDeckCycle.shift(); aiHandCycle = aiDeckCycle.splice(0, 4); refreshDeckUI();
}

function refreshDeckUI() {
    let dock = document.getElementById('battleDeckDock'); if(!dock) return; dock.innerHTML = '';
    if(!playerHandCycle.includes(activeCombatCard)) { activeCombatCard = playerHandCycle[0]; activeCombatCost = cardDatabase[activeCombatCard].cost; }
    
    playerHandCycle.forEach(cardKey => {
        let c = cardDatabase[cardKey]; let isAct = (cardKey === activeCombatCard) ? 'active' : '';
        let isEvoReady = pData.cards[cardKey].evoTier > 0 && playerCycles[cardKey] >= cardDatabase[cardKey].evoCyclesReq;
        let evoStyling = isEvoReady ? 'evoReady' : '';
        let cycleText = '';
        if(pData.cards[cardKey].evoTier > 0) {
            if(isEvoReady) cycleText = `<span style="color:#fff; font-size:8px; font-weight:bold; text-shadow:0 0 5px #e056fd;">EVO READY!</span>`;
            else cycleText = `<span style="color:#e056fd; font-size:8px;">Cycle: ${playerCycles[cardKey]}/${cardDatabase[cardKey].evoCyclesReq}</span>`;
        } else { cycleText = `<span style="font-size:10px;font-weight:bold;margin-top:2px;">${c.cost} MANA</span>`; }

        dock.innerHTML += `<div class="battleCard ${isAct} ${evoStyling}" onclick="selectBattleCard('${cardKey}', ${c.cost})"><span style="font-size:16px;">${c.icon}</span>${cycleText}</div>`;
    });
    let n = cardDatabase[playerNextCard];
    dock.innerHTML += `<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:45px; height:52px; background:#1c1e24; border-radius:6px; border:1px dashed #45a29e; color:#45a29e;"><span style="font-size:8px;font-weight:bold;">NEXT</span><span style="font-size:16px;">${n.icon}</span></div><button onclick="exitBattlefield()" style="background:#c0392b; border:none; border-radius:6px; color:#fff; font-weight:bold; padding:0 8px; height:52px; cursor:pointer; font-size:10px;">QUIT</button>`;
}

window.cyclePlayerCard = function(playedKey) { let idx = playerHandCycle.indexOf(playedKey); if(idx > -1) { playerHandCycle[idx] = playerNextCard; playerDeckCycle.push(playedKey); playerNextCard = playerDeckCycle.shift(); refreshDeckUI(); } }
window.selectBattleCard = function(wepId, cost) { activeCombatCard = wepId; activeCombatCost = cost; refreshDeckUI(); }

function initMatchTowers() {
    blueCrownScore = 0; redCrownScore = 0; overtimeActive = false; totalMatchSeconds = 180; elixir = 5.0; aiElixir = netActive ? 5.0 : 1.0; aiCooldown = 180;
    document.getElementById('blueCrowns').innerText = "0"; document.getElementById('redCrowns').innerText = "0";
    document.getElementById('matchTimer').innerText = "03:00"; document.getElementById('matchTimer').style.color = "#66fcf1";
    document.getElementById('hudMyName').innerText = pData.username || "COMMANDER";
    document.getElementById('hudOppName').innerText = currentOpponentData ? currentOpponentData.name : "OPPONENT";
    currentEvoAbilityId = null; abilityCooldowns = {}; currentAbilityCard = null; let d = document.getElementById('abilityBtnDock'); if(d) d.style.display = 'none';

    let pTowerHp = 2800; let kTowerHp = 4800;
    towers = [
        {id: 'bK', team: 'blue', tx: 8,  ty: 29, w: 2, h: 2, hp: kTowerHp, maxHp: kTowerHp, type: 'king', atkTimer: 0, range: 130},
        {id: 'bP1', team: 'blue', tx: 3,  ty: 24, w: 2, h: 2, hp: pTowerHp, maxHp: pTowerHp, type: 'princess', atkTimer: 0, range: 140},
        {id: 'bP2', team: 'blue', tx: 13, ty: 24, w: 2, h: 2, hp: pTowerHp, maxHp: pTowerHp, type: 'princess', atkTimer: 0, range: 140},
        {id: 'rK', team: 'red', tx: 8,  ty: 1,  w: 2, h: 2, hp: kTowerHp, maxHp: kTowerHp, type: 'king', atkTimer: 0, range: 130},
        {id: 'rP1', team: 'red', tx: 3,  ty: 6,  w: 2, h: 2, hp: pTowerHp, maxHp: pTowerHp, type: 'princess', atkTimer: 0, range: 140},
        {id: 'rP2', team: 'red', tx: 13, ty: 6,  w: 2, h: 2, hp: pTowerHp, maxHp: pTowerHp, type: 'princess', atkTimer: 0, range: 140}
    ];
    towers.forEach(t => { t.x = START_X + t.tx * TILE_SIZE + TILE_SIZE; t.y = START_Y + t.ty * TILE_SIZE + TILE_SIZE; t.dead = false; t.team = t.id.charAt(0) === 'b' ? 'blue' : 'red'; t.activated = (t.type !== 'king'); });
    troops = []; projectiles = []; particles = []; initDeckEngine();
}

window.launchBattlefield = function() { document.getElementById('screenPlayGround').style.display = 'flex'; initMatchTowers(); combatActive = true; lastTimerTick = Date.now(); }
window.exitBattlefield = function() { document.getElementById('screenPlayGround').style.display = 'none'; combatActive = false; }
function getGridCoords(mx, my) { return { tx: Math.floor((mx - START_X) / TILE_SIZE), ty: Math.floor((my - START_Y) / TILE_SIZE) }; }

cvs.addEventListener('mousemove', e => { let rect = cvs.getBoundingClientRect(); mouseX = (e.clientX - rect.left) * (cvs.width / rect.width); mouseY = (e.clientY - rect.top) * (cvs.height / rect.height); isHovering = true; });
cvs.addEventListener('mouseleave', () => isHovering = false);
cvs.addEventListener('click', e => {
    if(!combatActive) return;
    if(netRole === 'guest') { if(typeof netGuestDeploy === 'function') netGuestDeploy(); return; }
    let coords = getGridCoords(mouseX, mouseY);
    if(validatePlacement(activeCombatCard, coords.tx, coords.ty)) {
        if(elixir >= activeCombatCost) {
            elixir -= activeCombatCost;
            document.getElementById('statusMessage').innerText = "HERO DEPLOYED"; document.getElementById('statusMessage').style.color = "#00ffcc";
            let spawnX = START_X + coords.tx * TILE_SIZE + TILE_SIZE/2; let spawnY = START_Y + coords.ty * TILE_SIZE + TILE_SIZE/2;
            
            pData.cardPlays[activeCombatCard]++; saveData();
            
            let isEvoSpawn = false;
            if(pData.cards[activeCombatCard].evoTier > 0) {
                if(playerCycles[activeCombatCard] >= cardDatabase[activeCombatCard].evoCyclesReq) {
                    isEvoSpawn = true;
                    playerCycles[activeCombatCard] = 0; 
                } else {
                    playerCycles[activeCombatCard]++;
                }
            }

            spawnTroop('blue', activeCombatCard, spawnX, spawnY, false, isEvoSpawn);
            // deploy burst
            let depCol = isEvoSpawn ? '224,86,253' : '0,255,204';
            for(let r=0;r<2;r++) particles.push({x: spawnX, y: spawnY, r: 3 + r*7, alpha: 1, grow: 2.4, fade: 0.06, color: depCol, lw: 3, type: 'ring'});
            for(let s=0;s<7;s++){ let a = (s/7)*Math.PI*2; particles.push({x: spawnX, y: spawnY, r: 2, alpha: 1, vx: Math.cos(a)*1.6, vy: Math.sin(a)*1.6 - 1, color: depCol, type: 'spark'}); }
            cyclePlayerCard(activeCombatCard);
        } else { document.getElementById('statusMessage').innerText = "NOT ENOUGH MANA"; document.getElementById('statusMessage').style.color = "#ff3366"; }
    } else { document.getElementById('statusMessage').innerText = "INVALID SECTOR"; document.getElementById('statusMessage').style.color = "#ff3366"; }
});

function validatePlacement(cardType, tx, ty) {
    if(tx < 0 || tx >= COLS || ty < 0 || ty >= ROWS) return false;
    let hitTower = false; towers.forEach(t => { if(!t.dead && tx >= t.tx && tx < t.tx + t.w && ty >= t.ty && ty < t.ty + t.h) hitTower = true; }); if(hitTower) return false;
    if(cardDatabase[cardType].trait === 'miner') return true; 
    if(ty < 16) return false; return true;
}

function spawnTroop(team, type, x, y, isSummon = false, isEvoSpawn = false) {
    let base = cardDatabase[type]; let count = isSummon ? 1 : (base.count || 1);
    let level = team === 'blue' ? pData.cards[type].level : Math.floor(Math.random() * 2) + 1;
    if(level === 0) level = 1;

    for(let i=0; i<count; i++) {
        let offX = count > 1 ? (Math.random()*16 - 8) : 0; let offY = count > 1 ? (Math.random()*16 - 8) : 0;
        let t = {
            id: Math.random(), team: team, type: type, x: x + offX, y: y + offY,
            hp: getDynamicStat(base.hp, level, true), maxHp: getDynamicStat(base.hp, level, true), 
            dmg: getDynamicStat(base.dmg, level, false), range: base.range, 
            baseSpd: base.spd, spd: base.spd, baseAtkSpd: base.atkSpd, atkSpd: base.atkSpd, targetType: base.target, targetsAir: base.targetsAir,
            atkTimer: 0, state: 'walk', hookTarget: null, hitFlash: 0, facing: team==='blue'?-1:1, flying: base.trait === 'flying',
            isEvo: isEvoSpawn, abilityUsed: false, abilityActive: 0, spawnAnim: 10
        };

        if(base.trait === 'shield') t.shield = 3; if(base.trait === 'charge') { t.chargeTimer = 0; t.isCharging = false; }
        if(base.trait === 'building') { t.lifeTime = 1800; t.spd = 0; } if(base.trait === 'summoner') { t.summonTimer = 360; }
        if(base.trait === 'healer') { t.healTimer = 80; }

        // EVOLUTION POWER SPIKE: evolved units are tougher and hit harder (scales with tier)
        if(isEvoSpawn) {
            let eTier = (team === 'blue' && pData.cards[type]) ? (pData.cards[type].evoTier || 1) : 1;
            let hpMul = eTier >= 2 ? 1.6 : 1.35;
            let dmgMul = eTier >= 2 ? 1.45 : 1.25;
            t.hp = Math.floor(t.hp * hpMul); t.maxHp = Math.floor(t.maxHp * hpMul);
            t.dmg = Math.floor(t.dmg * dmgMul);
            t.evoTier = eTier;
            if(base.trait === 'shield') t.shield = eTier >= 2 ? 5 : 4;   // tougher shield
            if(base.trait === 'building') t.lifeTime = eTier >= 2 ? 3000 : 2400; // lasts longer
            if(base.trait === 'summoner') t.summonTimer = eTier >= 2 ? 200 : 260; // summons faster
        }

        troops.push(t);
    }
}

function setStatus(msg, color) { let s = document.getElementById('statusMessage'); if(s){ s.innerText = msg; s.style.color = color; } }

// ---- Combat helpers for hero abilities ----
function enemiesNear(u, r) {
    let res = [];
    troops.forEach(e => { if(e.team !== 'blue' && e.hp > 0 && Math.hypot(e.x - u.x, e.y - u.y) <= r) res.push(e); });
    towers.forEach(b => { if(b.team === 'red' && !b.dead && Math.hypot(b.x - u.x, b.y - u.y) <= r) res.push(b); });
    return res;
}
function nearestEnemy(u, troopsOnly) {
    let best = null, bd = 99999;
    troops.forEach(e => { if(e.team !== 'blue' || e.hp <= 0) return; let d = Math.hypot(e.x - u.x, e.y - u.y); if(d < bd){ bd = d; best = e; } });
    if(!troopsOnly) towers.forEach(b => { if(b.team !== 'red' || b.dead) return; let d = Math.hypot(b.x - u.x, b.y - u.y); if(d < bd){ bd = d; best = b; } });
    return best;
}
function stun(e, frames) { if(e.tx === undefined && e.spd !== 0) { e.state = 'stunned'; e.stunTimer = frames; } }
function boom(x, y) { particles.push({x: x, y: y, r: 0, alpha: 1, type: 'explosion'}); }

// ---- Tier-2 "Champion" abilities: one per card ----
const EVO_ABILITIES = {
    archer:  { name:'POWER ARROW',   icon:'🏹', cost:2, cd:1800, fn:(u)=>{ u.forEach(a => a.abilityActive = 300); } },
    batman:  { name:'BATARANG',      icon:'🦇', cost:3, cd:1500, fn:(u)=>{ u.forEach(b => enemiesNear(b,120).forEach(e => { applyDamage(e,150,'blue'); stun(e,120); boom(e.x,e.y); })); } },
    deku:    { name:'DETROIT SMASH',  icon:'⚡', cost:3, cd:1500, fn:(u)=>{ u.forEach(d => { boom(d.x,d.y); enemiesNear(d,95).forEach(e => applyDamage(e,420,'blue')); }); } },
    bombur:  { name:'FEAST',         icon:'🍖', cost:3, cd:1500, fn:()=>{ troops.filter(t => t.team==='blue' && t.hp>0).forEach(a => { a.hp = Math.min(a.maxHp, a.hp + a.maxHp*0.4); a.hitFlash = 8; }); } },
    cap:     { name:'SHIELD THROW',  icon:'🛡️', cost:3, cd:1400, fn:(u)=>{ u.forEach(c => { c.shield = Math.max(c.shield||0, 4); enemiesNear(c,170).slice(0,4).forEach(e => projectiles.push({x:c.x,y:c.y,tx:e.x,ty:e.y,angle:Math.atan2(e.y-c.y,e.x-c.x),spd:7,dmg:190,team:'blue',target:e,splash:false})); }); } },
    ninja:   { name:'SMOKE DASH',    icon:'💨', cost:2, cd:1200, fn:(u)=>{ u.forEach(n => { n.spd = n.baseSpd*2.2; n.abilityActive = 200; }); } },
    haaland: { name:'ROCKET SHOT',   icon:'⚽', cost:3, cd:1500, fn:(u)=>{ u.forEach(h => { let e = nearestEnemy(h); if(e) projectiles.push({x:h.x,y:h.y,tx:e.x,ty:e.y,angle:Math.atan2(e.y-h.y,e.x-h.x),spd:7,dmg:520,team:'blue',target:e,splash:true}); }); } },
    tower:   { name:'OVERCHARGE',    icon:'🏢', cost:3, cd:1600, fn:(u)=>{ u.forEach(tw => enemiesNear(tw,210).slice(0,6).forEach(e => projectiles.push({x:tw.x,y:tw.y-15,tx:e.x,ty:e.y,angle:Math.atan2(e.y-tw.y,e.x-tw.x),spd:6,dmg:170,team:'blue',target:e,splash:true}))); } },
    ultron:  { name:'SENTIENCE',     icon:'🤖', cost:2, cd:1400, fn:(u)=>{ u.forEach(b => { b.hp = Math.min(b.maxHp, b.hp + b.maxHp*0.5); enemiesNear(b,95).forEach(e => stun(e,150)); }); } },
    naruto:  { name:'RASENGAN',      icon:'🌀', cost:3, cd:1500, fn:(u)=>{ u.forEach(nn => { let e = nearestEnemy(nn); if(e){ applyDamage(e,620,'blue'); boom(e.x,e.y); } spawnTroop('blue','ninja',nn.x,nn.y,true); }); } },
    martian: { name:'MIND BLAST',    icon:'👽', cost:3, cd:1500, fn:(u)=>{ u.forEach(m => { boom(m.x,m.y); enemiesNear(m,125).forEach(e => { applyDamage(e,260,'blue'); stun(e,120); }); }); } },
    nobu:    { name:'SHADOW RITUAL', icon:'👺', cost:3, cd:1500, fn:(u)=>{ u.forEach(nb => { for(let s=0;s<4;s++) spawnTroop('blue','ninja',nb.x,nb.y,true); }); } },
    indy:    { name:'WHIP PULL',     icon:'🤠', cost:2, cd:1200, fn:(u)=>{ u.forEach(ix => { let e = nearestEnemy(ix,true); if(e){ let ang = Math.atan2(ix.y-e.y, ix.x-e.x); e.x += Math.cos(ang)*60; e.y += Math.sin(ang)*60; stun(e,120); applyDamage(e,120,'blue'); } }); } },
    golem:   { name:'THUNDER CLAP',  icon:'👊', cost:3, cd:1600, fn:(u)=>{ u.forEach(g => { boom(g.x,g.y); enemiesNear(g,130).forEach(e => { applyDamage(e,220,'blue'); stun(e,100); }); }); } },
    drake:   { name:'HOWITZER',      icon:'💥', cost:3, cd:1500, fn:(u)=>{ u.forEach(d => { boom(d.x, d.y - 30); enemiesNear(d,120).forEach(e => applyDamage(e,300,'blue')); }); } },
    sniper:  { name:'ROYAL FLUSH',   icon:'🃏', cost:2, cd:1400, fn:(u)=>{ u.forEach(s => { let e = nearestEnemy(s); if(e){ applyDamage(e,800,'blue'); boom(e.x,e.y); } }); } },
    medic:   { name:'MASS HEAL',     icon:'🤍', cost:2, cd:1500, fn:()=>{ troops.filter(t => t.team==='blue' && t.hp>0).forEach(a => { a.hp = Math.min(a.maxHp, a.hp + a.maxHp*0.5); a.hitFlash = 6; }); } },
    drones:  { name:'REINFORCE',     icon:'🪖', cost:2, cd:1300, fn:(u)=>{ u.forEach(d => { for(let s=0;s<2;s++) spawnTroop('blue','drones',d.x,d.y,true); }); } }
};

// Render one button per active tier-2 hero, stacked so they never overlap
function updateAbilityDock(cards) {
    let dock = document.getElementById('abilityBtnDock'); if(!dock) return;
    let sig = cards.join(',');
    if(sig !== dock.dataset.sig) {
        dock.dataset.sig = sig;
        if(cards.length === 0) { dock.style.display = 'none'; dock.innerHTML = ''; }
        else {
            dock.style.display = 'flex';
            dock.innerHTML = cards.map(k => {
                let def = EVO_ABILITIES[k];
                return `<button class="abilityCircleBtn" data-card="${k}" onclick="triggerEvoAbility('${k}')">`
                    + `<span class="abName">${def.name}</span>`
                    + `<span class="abIcon">${def.icon}</span>`
                    + `<span class="abElixir"><span id="abCost_${k}">${def.cost}</span></span>`
                    + `</button>`;
            }).join('');
        }
    }
    cards.forEach(k => {
        let btn = dock.querySelector('.abilityCircleBtn[data-card="' + k + '"]'); if(!btn) return;
        let cd = abilityCooldowns[k] || 0; let lbl = document.getElementById('abCost_' + k);
        if(cd > 0) { btn.classList.add('onCooldown'); if(lbl) lbl.innerText = Math.ceil(cd / 60) + 's'; }
        else { btn.classList.remove('onCooldown'); if(lbl) lbl.innerText = EVO_ABILITIES[k].cost; }
    });
}
window.triggerEvoAbility = function(card) {
    if(!card || !EVO_ABILITIES[card]) return;
    let def = EVO_ABILITIES[card];
    if((abilityCooldowns[card] || 0) > 0) { setStatus("ABILITY RECHARGING", "#f1c40f"); return; }
    let myUnits = troops.filter(t => t.team === 'blue' && t.type === card && t.hp > 0);
    if(myUnits.length === 0) { setStatus("HERO NOT DEPLOYED", "#ff3366"); return; }
    if(elixir < def.cost) { setStatus("NEED " + def.cost + " MANA", "#ff3366"); return; }
    elixir -= def.cost;
    def.fn(myUnits);
    myUnits.forEach(u => { for(let r=0;r<2;r++) particles.push({x: u.x, y: u.y, r: 4 + r*8, alpha: 1, grow: 2.2, fade: 0.05, color: '224,86,253', lw: 3, type: 'ring'}); });
    abilityCooldowns[card] = def.cd;
    setStatus(def.name + "!", "#e056fd");
}

function applyDamage(target, dmg, team) {
    if(!target || target.dead || target.hp <= 0) return;
    if(target.type === 'king' && target.tx !== undefined) target.activated = true; // a struck King Tower wakes up
    // hit spark (capped so swarms don't flood the particle pool)
    if(particles.length < 90) {
        let sc = target.shield && target.shield > 0 ? '120,200,255' : '255,225,140';
        particles.push({x: target.x, y: target.y - 6, r: 3, alpha: 0.85, grow: 1.6, fade: 0.12, color: sc, lw: 2, type: 'ring'});
    }
    if(target.shield && target.shield > 0) { target.shield--; target.hitFlash = 10; }
    else {
        target.hp -= dmg; target.hitFlash = 10;
        if(target.hp <= 0) {
            target.hp = 0; target.dead = true;
            // death puff
            if(particles.length < 80) { for(let s=0;s<6;s++){ let a=(s/6)*Math.PI*2; particles.push({x: target.x, y: target.y-4, r: 2, alpha: 1, vx: Math.cos(a)*1.4, vy: Math.sin(a)*1.4 - 0.8, color: target.team==='blue'?'0,255,204':'255,90,114', type: 'spark'}); } }
            if(target.tx !== undefined) awardCrown(team, target.type);
        }
    }
}

function awardCrown(scoringTeam, targetType) {
    // a destroyed Princess Tower wakes the defender's King Tower
    if(targetType === 'princess') { let loser = scoringTeam === 'blue' ? 'red' : 'blue'; towers.forEach(tw => { if(tw.team === loser && tw.type === 'king') tw.activated = true; }); }
    if(scoringTeam === 'blue') {
        if(targetType === 'king') { blueCrownScore = 3; endMatch('BLUE WINS'); } else { blueCrownScore++; if(overtimeActive || blueCrownScore>=3) endMatch('BLUE WINS'); }
        document.getElementById('blueCrowns').innerText = blueCrownScore;
    } else {
        if(targetType === 'king') { redCrownScore = 3; endMatch('RED WINS'); } else { redCrownScore++; if(overtimeActive || redCrownScore>=3) endMatch('RED WINS'); }
        document.getElementById('redCrowns').innerText = redCrownScore;
    }
}

function handleMatchTimer() {
    if(!combatActive) return; let now = Date.now();
    if(now - lastTimerTick >= 1000) {
        lastTimerTick = now;
        if(!overtimeActive) {
            totalMatchSeconds--;
            let mins = Math.floor(totalMatchSeconds / 60).toString().padStart(2, '0'); let secs = (totalMatchSeconds % 60).toString().padStart(2, '0');
            document.getElementById('matchTimer').innerText = `${mins}:${secs}`;
            if(totalMatchSeconds <= 0) { if(blueCrownScore === redCrownScore) { overtimeActive = true; document.getElementById('matchTimer').style.color = "#f1c40f"; } else endMatch(blueCrownScore > redCrownScore ? "BLUE VICTORY" : "RED VICTORY"); }
        } else {
            overtimeSeconds--; document.getElementById('matchTimer').innerText = `OT 00:${overtimeSeconds.toString().padStart(2, '0')}`;
            if(overtimeSeconds <= 0) endMatch(blueCrownScore === redCrownScore ? "DRAW" : (blueCrownScore > redCrownScore ? "BLUE VICTORY" : "RED VICTORY"));
        }
    }
}

function endMatch(outcomeText) {
    combatActive = false;
    setTimeout(() => { alert(`MATCH COMPLETE\nRESULT: ${outcomeText}`); exitBattlefield(); }, 500); 
}

function updateEngine() {
    if(!combatActive) return;
    if(netRole === 'guest') return;   // guest renders host snapshots, never simulates
    handleMatchTimer();
    
    // TIER-2 CHAMPION ABILITIES: one button per tier-2 card that has a unit on the field
    for(let k in abilityCooldowns) { if(abilityCooldowns[k] > 0) abilityCooldowns[k]--; }
    let activeCards = [];
    for(let i = 0; i < pData.activeDeck.length; i++) {
        let k = pData.activeDeck[i];
        if(activeCards.indexOf(k) < 0 && pData.cards[k] && pData.cards[k].evoTier >= 2 && EVO_ABILITIES[k] && troops.some(t => t.team === 'blue' && t.type === k && t.hp > 0)) activeCards.push(k);
    }
    updateAbilityDock(activeCards);

    // Clash-style elixir ramp: 2x in the final minute, 3x in overtime
    let eFactor = overtimeActive ? 3 : (totalMatchSeconds <= 60 ? 2 : 1);
    if(elixir < 10) elixir += 0.006 * eFactor;
    document.getElementById('elixirBar').style.width = (elixir / 10 * 100) + '%';
    document.getElementById('elixirText').innerText = Math.floor(elixir) + " / 10" + (eFactor > 1 ? "  ⚡x" + eFactor : "");
    let tScale = Math.min(pData.trophies, 3000);
    if(aiElixir < 10) aiElixir += (netActive ? 0.006 : (0.0035 + (tScale * 0.000003))) * eFactor;

    if(netActive || aiCooldown > 0) { if(aiCooldown > 0) aiCooldown--; }   // no local AI in online matches
    else {
        let blueThreats = troops.filter(t => t.team === 'blue' && t.y < RIVER_MID_Y + TILE_SIZE * 3); blueThreats.sort((a,b) => a.y - b.y);
        let playCard = null; let laneX = START_X + 4.5 * TILE_SIZE; let spawnY = START_Y + 9 * TILE_SIZE; 

        if(blueThreats.length > 0) { 
            let threat = blueThreats[0]; laneX = threat.x > (START_X + COLS*TILE_SIZE/2) ? START_X + 13.5 * TILE_SIZE : START_X + 4.5 * TILE_SIZE;
            let tBase = cardDatabase[threat.type];
            if (tScale >= 150) {
                if (tBase.trait === 'flying') playCard = aiHandCycle.find(c => cardDatabase[c].range > 80);
                else if (tBase.trait === 'swarm') playCard = aiHandCycle.find(c => c === 'deku' || cardDatabase[c].trait === 'building');
                else if (threat.hp > 1000) playCard = aiHandCycle.find(c => cardDatabase[c].trait === 'swarm' || cardDatabase[c].dmg >= 100);
            }
            if(!playCard) playCard = aiHandCycle.find(c => c === 'ninja' || c === 'deku' || c === 'tower');
            if(!playCard) playCard = aiHandCycle[Math.floor(Math.random()*aiHandCycle.length)];
        } else if(aiElixir >= 8) { 
            laneX = Math.random() > 0.5 ? START_X + 4.5 * TILE_SIZE : START_X + 13.5 * TILE_SIZE; spawnY = START_Y + 2 * TILE_SIZE; 
            if (tScale >= 300) playCard = aiHandCycle.find(c => cardDatabase[c].trait === 'charge' || cardDatabase[c].trait === 'miner');
            if(!playCard) playCard = aiHandCycle.find(c => cardDatabase[c].trait !== 'building' && cardDatabase[c].cost >= 4); 
            if(!playCard) playCard = aiHandCycle[Math.floor(Math.random()*aiHandCycle.length)];
        }
        
        if(playCard && aiElixir >= cardDatabase[playCard].cost) {
            aiElixir -= cardDatabase[playCard].cost; 
            aiCooldown = Math.max(30, 180 - Math.floor(tScale * 0.08)); 

            if(cardDatabase[playCard].trait === 'miner') {
                let blueTowers = towers.filter(t => t.team === 'blue' && !t.dead);
                if (blueTowers.length > 0) {
                    let pTowers = blueTowers.filter(t => t.type === 'princess');
                    let targetT = pTowers.length > 0 ? pTowers[Math.floor(Math.random() * pTowers.length)] : blueTowers.find(t => t.type === 'king');
                    if (targetT) { laneX = targetT.x + (Math.random() * 20 - 10); spawnY = targetT.y + (Math.random() * 20 - 10); }
                }
            }

            spawnTroop('red', playCard, laneX, spawnY);
            let idx = aiHandCycle.indexOf(playCard); let nextAi = aiDeckCycle.shift(); aiHandCycle[idx] = nextAi; aiDeckCycle.push(playCard);
        }
    }

    towers.forEach(t => {
        if(t.dead) return;
        if(t.type === 'king' && !t.activated) return; // dormant King Tower doesn't fire until woken
        if(t.atkTimer > 0) { t.atkTimer--; return; }
        let targets = troops.filter(e => e.team !== t.team && e.hp > 0); let closest = null; let tMinDist = t.range;
        targets.forEach(e => { let d = Math.hypot(e.x - t.x, e.y - t.y); if(d < tMinDist) { tMinDist = d; closest = e; } });
        if(closest) {
            t.atkTimer = t.type === 'king' ? 60 : 48; let aAng = Math.atan2(closest.y - t.y, closest.x - t.x);
            projectiles.push({x: t.x, y: t.y, tx: closest.x, ty: closest.y, angle: aAng, spd: 8, dmg: 85, team: t.team, target: closest, splash: false});
        }
    });

    for(let i = projectiles.length - 1; i >= 0; i--) {
        let p = projectiles[i]; p.life = (p.life || 0) + 1; if(p.life > 150) { projectiles.splice(i, 1); continue; }
        if (p.target && p.target.hp > 0 && !p.target.dead) { p.tx = p.target.x; p.ty = p.target.y; p.angle = Math.atan2(p.ty - p.y, p.tx - p.x); }
        let dist = Math.hypot(p.tx - p.x, p.ty - p.y);
        if(dist <= p.spd * 1.5) { 
            if(p.splash) {
                particles.push({x: p.tx, y: p.ty, r: 0, alpha: 1, type: 'explosion'});
                let activeEnemies = [...troops.filter(e => e.team !== p.team && e.hp > 0), ...towers.filter(b => b.team !== p.team && !b.dead)];
                activeEnemies.forEach(e => { if(Math.hypot(e.x - p.tx, e.y - p.ty) <= 55) applyDamage(e, p.dmg, p.team); });
            } else { applyDamage(p.target, p.dmg, p.team); }
            projectiles.splice(i, 1);
        } else { p.x += Math.cos(p.angle) * p.spd; p.y += Math.sin(p.angle) * p.spd; }
    }

    for(let i = particles.length - 1; i >= 0; i--) {
        let pt = particles[i]; if(pt.type === 'spark') { pt.alpha -= 0.05; if(pt.vx){ pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.15; } if(pt.alpha <= 0) particles.splice(i, 1); }
        else if(pt.type === 'cone' || pt.type === 'explosion') { pt.alpha -= 0.05; if(pt.type === 'explosion') pt.r += 2; if(pt.alpha <= 0) particles.splice(i, 1); }
        else if(pt.type === 'ring') { pt.r += (pt.grow || 2); pt.alpha -= (pt.fade || 0.04); if(pt.alpha <= 0) particles.splice(i, 1); }
        else if(pt.type === 'float') { pt.y -= 0.6; pt.alpha -= 0.02; if(pt.alpha <= 0) particles.splice(i, 1); }
        else { pt.alpha = (pt.alpha || 1) - 0.05; if(pt.alpha <= 0) particles.splice(i, 1); }
    }

    for(let i = troops.length - 1; i >= 0; i--) {
        let t = troops[i];
        if(t.hp <= 0) { troops.splice(i, 1); continue; }
        if(t.atkTimer > 0) t.atkTimer--; if(t.hitFlash > 0) t.hitFlash--;
        if(t.spd === 0) { t.hp -= (t.maxHp / t.lifeTime); if(t.hp <= 0) continue; }

        if(t.abilityActive > 0) { t.abilityActive--; t.atkSpd = 5; } else { t.atkSpd = t.baseAtkSpd; }

        if(t.summonTimer !== undefined) {
            t.summonTimer--; if(t.summonTimer <= 0) { for(let s=0; s<3; s++) spawnTroop(t.team, 'ninja', t.x, t.y, true); t.summonTimer = 360; }
        }
        if(t.healTimer !== undefined) {
            t.healTimer--; if(t.healTimer <= 0) {
                troops.forEach(a => { if(a.team === t.team && a.hp > 0 && a !== t && Math.hypot(a.x - t.x, a.y - t.y) < 95) { a.hp = Math.min(a.maxHp, a.hp + a.maxHp * 0.07); a.hitFlash = 4; } });
                particles.push({ x: t.x, y: t.y, r: 6, alpha: 1, grow: 2.2, fade: 0.05, color: '46,204,113', lw: 2, type: 'ring' });
                t.healTimer = 90;
            }
        }

        if(t.state === 'hooking' && t.hookTarget) {
            let ht = t.hookTarget;
            if(ht.hp <= 0) { t.state = 'walk'; t.hookTarget = null; continue; }
            let dist = Math.hypot(ht.x - t.x, ht.y - t.y);
            if(dist > 25 && ht.tx === undefined && ht.spd !== 0) { let angle = Math.atan2(t.y - ht.y, t.x - ht.x); ht.x += Math.cos(angle) * 3.5; ht.y += Math.sin(angle) * 3.5; ht.state = 'stunned'; ht.stunTimer = 8; } else { t.state = 'attack'; ht.state = 'walk'; t.atkTimer = 20; }
            continue;
        }
        if(t.state === 'stunned') { t.stunTimer = (t.stunTimer || 0) - 1; if(t.stunTimer <= 0) t.state = 'walk'; continue; }

        let enemyTowers = towers.filter(b => b.team !== t.team && !b.dead); 
        let activeEnemyTroops = troops.filter(e => e.team !== t.team && e.hp > 0 && (t.targetsAir ? true : !e.flying));
        let activeEnemyBuildings = activeEnemyTroops.filter(e => e.type === 'tower'); 
        let possibleTargets = t.targetType === 'any' ? [...activeEnemyTroops, ...enemyTowers] : [...activeEnemyBuildings, ...enemyTowers];

        if(possibleTargets.length === 0) { t.state = 'idle'; continue; }
        
        let nearest = null; let minDist = 99999;
        
        // Z-AXIS EVO SNIPER LOGIC: Only lock onto active troops/buildings map-wide. NOT Base Towers.
        let inSight = possibleTargets.filter(e => {
            let dist = Math.hypot(e.x - t.x, e.y - t.y);
            let isMainTower = (e.type === 'princess' || e.type === 'king');
            let isEvoSnipeable = (t.isEvo && t.type === 'archer' && !isMainTower);
            return dist <= SIGHT_RANGE || isEvoSnipeable;
        });
        
        if (inSight.length > 0) {
            inSight.forEach(e => { let dist = Math.hypot(e.x - t.x, e.y - t.y); if(dist < minDist) { minDist = dist; nearest = e; } });
        } else {
            let midX = START_X + (COLS * TILE_SIZE / 2); let myLane = t.x < midX ? 'left' : 'right';
            let pTowerLeft = enemyTowers.find(tw => tw.type === 'princess' && tw.x < midX);
            let pTowerRight = enemyTowers.find(tw => tw.type === 'princess' && tw.x > midX);
            let kTower = enemyTowers.find(tw => tw.type === 'king');
            
            let targetTower = null;
            if (myLane === 'left' && pTowerLeft) targetTower = pTowerLeft;
            else if (myLane === 'right' && pTowerRight) targetTower = pTowerRight;
            else targetTower = pTowerLeft || pTowerRight || kTower; 
            
            if (targetTower) { nearest = targetTower; minDist = Math.hypot(targetTower.x - t.x, targetTower.y - t.y); } 
            else { possibleTargets.forEach(e => { let dist = Math.hypot(e.x - t.x, e.y - t.y); if(dist < minDist) { minDist = dist; nearest = e; } }); }
        }

        if(t.type === 'haaland') { if(t.state === 'walk') { t.chargeTimer++; if(t.chargeTimer > 90) { t.isCharging = true; t.spd = t.baseSpd * 2.5; } } else { t.chargeTimer = 0; } }

        // DARK KNIGHT: grapple a distant enemy troop in, then beat it down in melee
        if(t.type === 'batman' && t.state !== 'hooking' && t.state !== 'stunned') {
            let gT = null, gMin = t.range;
            activeEnemyTroops.forEach(e => { if(e.type === 'tower' || e.flying) return; let d = Math.hypot(e.x - t.x, e.y - t.y); if(d > 40 && d < gMin) { gMin = d; gT = e; } });
            if(gT) { t.state = 'hooking'; t.hookTarget = gT; t.facing = gT.x < t.x ? -1 : 1; continue; }
        }

        let activeAttackRange = t.range;
        if(t.isEvo && t.type === 'archer' && nearest && nearest.type !== 'princess' && nearest.type !== 'king') {
            activeAttackRange = 9999;
        }
        // Dark Knight is a brawler vs buildings/towers: close the distance instead of poking from afar
        if(t.type === 'batman' && nearest && (nearest.tx !== undefined || nearest.type === 'tower')) {
            activeAttackRange = 40;
        }

        if(minDist <= activeAttackRange) {
            t.state = 'attack';
            if(t.atkTimer === 0) {
                t.atkTimer = t.atkSpd; t.facing = nearest.x < t.x ? -1 : 1;
                let atkAngle = Math.atan2(nearest.y - t.y, nearest.x - t.x);
                let outDamage = t.dmg; let isPowerArrow = t.type === 'archer' && t.abilityActive > 0;

                if(t.type === 'archer' || t.type === 'sniper') { projectiles.push({x: t.x, y: t.y, tx: nearest.x, ty: nearest.y, angle: atkAngle, spd: t.type === 'sniper' ? 13 : 8, dmg: outDamage, team: t.team, target: nearest, splash: false, isPower: isPowerArrow}); }
                else if(t.type === 'tower' || t.type === 'nobu') { let tAng = Math.atan2(nearest.y - (t.y-15), nearest.x - t.x); projectiles.push({x: t.x, y: t.y-15, tx: nearest.x, ty: nearest.y, angle: tAng, spd: 6, dmg: outDamage, team: t.team, target: nearest, splash: true}); }
                else if(t.type === 'deku') { particles.push({x: t.x, y: t.y, angle: atkAngle, type: 'cone', alpha: 1}); possibleTargets.forEach(e => { if(Math.hypot(e.x - t.x, e.y - t.y) <= 65) { let angleDiff = Math.abs(Math.atan2(e.y - t.y, e.x - t.x) - atkAngle); if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff; if (angleDiff <= Math.PI / 3) applyDamage(e, outDamage, t.team); } }); } 
                else { applyDamage(nearest, outDamage, t.team); }
            }
        } else if(t.spd > 0) {
            t.state = 'walk'; t.facing = nearest.x < t.x ? -1 : 1;
            let targetSide = nearest.y < RIVER_MID_Y ? -1 : 1; let troopSide = t.y < RIVER_MID_Y ? -1 : 1; let moveTarget = {x: nearest.x, y: nearest.y};
            if(targetSide !== troopSide && !t.flying) {
                let leftBx = START_X + 4 * TILE_SIZE; let rightBx = START_X + 14 * TILE_SIZE;
                let bX = Math.abs(t.x - leftBx) < Math.abs(t.x - rightBx) ? leftBx : rightBx; moveTarget = {x: bX, y: RIVER_MID_Y};
            }
            let angle = Math.atan2(moveTarget.y - t.y, moveTarget.x - t.x); t.x += Math.cos(angle) * t.spd; t.y += Math.sin(angle) * t.spd;
        }
    }
    riverAnimateTimer += 0.07;

    // HOST: broadcast a state snapshot to the guest (~20Hz)
    if(netRole === 'host') { netSnapTick++; if(netSnapTick % 3 === 0 && typeof netSend === 'function') netSend(buildSnapshot()); }
}

function rrp(x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w/2, h/2));
    ctx.beginPath(); ctx.moveTo(x+r, y);
    ctx.arcTo(x+w, y, x+w, y+h, r); ctx.arcTo(x+w, y+h, x, y+h, r);
    ctx.arcTo(x, y+h, x, y, r); ctx.arcTo(x, y, x+w, y, r); ctx.closePath();
}
function starShape(cx, cy, r, color) {
    ctx.fillStyle = color; ctx.beginPath();
    for(let i=0; i<5; i++){
        let a = -Math.PI/2 + i*2*Math.PI/5;
        ctx.lineTo(cx + Math.cos(a)*r, cy + Math.sin(a)*r);
        let a2 = a + Math.PI/5;
        ctx.lineTo(cx + Math.cos(a2)*r*0.45, cy + Math.sin(a2)*r*0.45);
    }
    ctx.closePath(); ctx.fill();
}
function drawHealthBar(t, w, h, hr) {
    let bw = Math.max(20, w*2.2), bx = -bw/2, by = -h - hr - 9;
    ctx.fillStyle = 'rgba(5,8,18,0.9)'; rrp(bx-1.5, by-1.5, bw+3, 6, 3); ctx.fill();
    let hpw = Math.max(0, Math.min(1, t.hp/t.maxHp)) * bw;
    if(hpw > 0) { ctx.fillStyle = t.team === 'blue' ? '#46d3ff' : '#ff5a72'; rrp(bx, by, hpw, 3, Math.min(1.5, hpw/2)); ctx.fill(); }
}
function drawTroop3D(t, preview) {
    let wobble = (t.state === 'walk') ? Math.sin(Date.now() / 80) * 2 : 0; if(t.type === 'tower') wobble = 0;
    let floatOffset = t.flying ? -16 : 0;
    let teamGlow = t.team === 'blue' ? '#46d3ff' : '#ff5a72';

    // ground shadow + team aura ring (kept on the ground, even for flyers)
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath(); ctx.ellipse(t.x, t.y + 7, t.type==='tower'?16:10, 5, 0, 0, Math.PI*2); ctx.fill();
    if(t.type !== 'tower') {
        ctx.strokeStyle = teamGlow; ctx.lineWidth = 2.5; ctx.globalAlpha = 0.9;
        ctx.beginPath(); ctx.ellipse(t.x, t.y + 7, 11, 4.5, 0, 0, Math.PI*2); ctx.stroke(); ctx.globalAlpha = 1;
        if(t.isEvo) { ctx.strokeStyle = '#e056fd'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(t.x, t.y + 7, 14, 6, 0, 0, Math.PI*2); ctx.stroke(); }
    }

    // Dark Knight grapple chain (drawn in absolute coords)
    if(t.type === 'batman' && t.state === 'hooking' && t.hookTarget && t.hookTarget.hp > 0) {
        let ht = t.hookTarget;
        ctx.strokeStyle = '#9aa6ad'; ctx.lineWidth = 2; ctx.setLineDash([4,3]);
        ctx.beginPath(); ctx.moveTo(t.x, t.y - 12); ctx.lineTo(ht.x, ht.y - 8); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = '#cfd6da'; ctx.beginPath(); ctx.arc(ht.x, ht.y - 8, 2.6, 0, Math.PI*2); ctx.fill();
    }

    let baseC, topC, w, h;
    if(t.type === 'archer') { if(t.isEvo) { baseC = '#1a0b2e'; topC = '#e056fd'; w=8; h=16; } else { baseC = '#5e2a70'; topC = '#8e44ad'; w=8; h=16; } }
    else if(t.type === 'batman') { baseC = '#1a252f'; topC = '#2c3e50'; w=10; h=18; }
    else if(t.type === 'deku') { baseC = '#1e8449'; topC = '#2ecc71'; w=9; h=16; }
    else if(t.type === 'bombur') { baseC = '#b95d18'; topC = '#e67e22'; w=14; h=20; }
    else if(t.type === 'cap') { baseC = '#2980b9'; topC = '#3498db'; w=10; h=17; }
    else if(t.type === 'ninja') { baseC = '#d3d6d9'; topC = '#edeff0'; w=7; h=14; }
    else if(t.type === 'haaland') { baseC = '#5dade2'; topC = '#85c1e9'; w=11; h=19; }
    else if(t.type === 'tower') { baseC = '#7f8c8d'; topC = '#bdc3c7'; w=14; h=26; }
    else if(t.type === 'ultron') { baseC = '#7f8c8d'; topC = '#bdc3c7'; w=8; h=16; }
    else if(t.type === 'naruto') { baseC = '#e67e22'; topC = '#f39c12'; w=9; h=16; }
    else if(t.type === 'martian') { baseC = '#27ae60'; topC = '#2ecc71'; w=12; h=20; }
    else if(t.type === 'nobu') { baseC = '#c0392b'; topC = '#e74c3c'; w=10; h=18; }
    else if(t.type === 'indy') { baseC = '#5a3d22'; topC = '#7a5230'; w=10; h=17; }
    else if(t.type === 'golem') { baseC = '#1e7d34'; topC = '#2ecc71'; w=15; h=24; }
    else if(t.type === 'drake') { baseC = '#262626'; topC = '#e67e22'; w=11; h=18; }
    else if(t.type === 'sniper') { baseC = '#5e2a8a'; topC = '#7d3ca8'; w=8; h=17; }
    else if(t.type === 'medic') { baseC = '#cfd6da'; topC = '#ecf0f1'; w=11; h=17; }
    else if(t.type === 'drones') { baseC = '#2f6b32'; topC = '#4a8c3f'; w=6; h=12; }

    let flash = t.hitFlash > 0;
    if(flash) { baseC = '#ffffff'; topC = '#ffe9e9'; }

    ctx.save(); ctx.translate(t.x, t.y + wobble + floatOffset);
    if(t.spawnAnim > 0 && !preview) { let s = 1 + t.spawnAnim * 0.06; ctx.scale(s, s); t.spawnAnim--; }

    // --- Tower: static turret (own silhouette) ---
    if(t.type === 'tower') {
        ctx.fillStyle = flash ? '#fff' : baseC; rrp(-w, -h+4, w*2, h, 5); ctx.fill();
        ctx.strokeStyle = 'rgba(8,12,24,0.85)'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = flash ? '#fff' : topC; ctx.beginPath(); ctx.arc(0, -h+4, w, Math.PI, 0); ctx.fill(); ctx.stroke();
        ctx.fillStyle = teamGlow; ctx.beginPath(); ctx.arc(0, -h+4, 4.5, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#0a1c38'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('A', 0, -h+18); ctx.textAlign = 'left';
        if(!preview) drawHealthBar(t, w, h, w); ctx.restore(); return;
    }

    // pre-body flourishes (behind the body)
    if(t.type === 'haaland' && t.isCharging) { ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.moveTo(-t.facing*15, -h/2); ctx.lineTo(-t.facing*5, -h/2-5); ctx.lineTo(-t.facing*5, -h/2+5); ctx.fill(); ctx.rotate(t.facing * 0.2); }
    if(t.type === 'batman') { ctx.fillStyle = '#111'; ctx.beginPath(); ctx.moveTo(-10, -h); ctx.lineTo(-14, 5); ctx.lineTo(14, 5); ctx.lineTo(10, -h); ctx.fill(); }

    // legs (grounded units)
    if(!t.flying) {
        ctx.fillStyle = 'rgba(10,12,22,0.92)';
        rrp(-w*0.62, -6, w*0.5, 8, 2); ctx.fill();
        rrp(w*0.12, -6, w*0.5, 8, 2); ctx.fill();
    }

    // body capsule with vertical shading + outline
    let grad = ctx.createLinearGradient(0, -h, 0, 0);
    grad.addColorStop(0, topC); grad.addColorStop(1, baseC);
    ctx.fillStyle = flash ? '#fff' : grad;
    rrp(-w, -h, w*2, h+3, Math.min(w*0.7, 8)); ctx.fill();
    ctx.strokeStyle = 'rgba(8,12,24,0.85)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.16)'; rrp(-w*0.6, -h+3, w*0.65, h*0.5, 3); ctx.fill();

    // stubby arms
    ctx.fillStyle = flash ? '#fff' : baseC;
    rrp(-w-2.5, -h*0.62, 4, h*0.42, 2); ctx.fill();
    rrp(w-1.5, -h*0.62, 4, h*0.42, 2); ctx.fill();

    // head
    let hr = w * 1.05;
    ctx.fillStyle = flash ? '#fff' : topC; ctx.beginPath(); ctx.arc(0, -h, hr, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = 'rgba(8,12,24,0.85)'; ctx.lineWidth = 2; ctx.stroke();

    // --- face: helmet shading + sharp determined eyes (no cartoon eyes) ---
    ctx.fillStyle = 'rgba(255,255,255,0.16)'; ctx.beginPath(); ctx.arc(-hr*0.3, -h - hr*0.35, hr*0.42, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.beginPath(); ctx.arc(0, -h + hr*0.4, hr*0.85, 0.12*Math.PI, 0.88*Math.PI); ctx.fill();
    let ex = t.facing * hr * 0.16;
    if(t.type==='batman') {
        let eyeC = '#cfe0ff';
        ctx.strokeStyle = eyeC; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.shadowColor = eyeC; ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.moveTo(ex-4.6,-h-1.6); ctx.lineTo(ex-1.2,-h-0.2); ctx.moveTo(ex+1.2,-h-0.2); ctx.lineTo(ex+4.6,-h-1.6); ctx.stroke();
        ctx.shadowBlur = 0; ctx.lineCap = 'butt';
    } else if(t.type==='ninja' || t.type==='ultron' || t.type==='martian' || t.type==='nobu' || t.type==='naruto' || t.type==='golem' || t.type==='drake' || t.type==='drones' || t.type==='sniper' || t.type==='medic') {
        /* these draw their own face/mask details below */
    } else {
        ctx.strokeStyle = 'rgba(10,12,22,0.92)'; ctx.lineWidth = 1.7; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(ex-4.3,-h-2.3); ctx.lineTo(ex-1,-h-0.6); ctx.moveTo(ex+1,-h-0.6); ctx.lineTo(ex+4.3,-h-2.3); ctx.stroke();
        ctx.lineCap = 'butt';
    }

    if(t.type === 'archer') {
        // Hawkeye purple cowl
        ctx.fillStyle = t.isEvo ? '#7a1fa2' : '#5e2a8a';
        ctx.beginPath(); ctx.arc(0, -h, hr+1.5, Math.PI*1.02, Math.PI*1.98); ctx.lineTo(0, -h+1); ctx.closePath(); ctx.fill();
        // vertical mask fin (classic Hawkeye)
        ctx.beginPath(); ctx.moveTo(-1.6,-h-hr*0.7); ctx.lineTo(0,-h-hr-5); ctx.lineTo(1.6,-h-hr*0.7); ctx.fill();
        // black domino mask band + eye holes
        ctx.fillStyle = '#16102a'; ctx.fillRect(-hr*0.9, -h-2, hr*1.8, 3.8);
        ctx.fillStyle = '#fff'; ctx.fillRect(ex-3.2, -h-0.6, 1.7, 1.5); ctx.fillRect(ex+1.5, -h-0.6, 1.7, 1.5);
        // quiver on back
        ctx.fillStyle = '#3a2a18'; ctx.fillRect(-t.facing*(w+1)-1.5, -h*0.62, 3, h*0.5);
        ctx.strokeStyle = t.isEvo ? '#e056fd' : '#9b59b6'; ctx.lineWidth = 1.4;
        for(let q=-1;q<=1;q++){ ctx.beginPath(); ctx.moveTo(-t.facing*(w+1), -h*0.62); ctx.lineTo(-t.facing*(w+1)+q*2.2, -h*0.62-4); ctx.stroke(); }
        // recurve bow + string
        ctx.strokeStyle = t.isEvo ? '#e056fd' : '#3a2a18'; ctx.lineWidth = 2;
        if(t.abilityActive > 0){ ctx.shadowColor = '#e056fd'; ctx.shadowBlur = 12; }
        ctx.beginPath(); ctx.moveTo(t.facing*9, -h*0.55-9); ctx.quadraticCurveTo(t.facing*16, -h*0.55, t.facing*9, -h*0.55+9); ctx.stroke();
        ctx.lineWidth = 1; ctx.strokeStyle = '#e8e8e8'; ctx.beginPath(); ctx.moveTo(t.facing*9, -h*0.55-9); ctx.lineTo(t.facing*9, -h*0.55+9); ctx.stroke();
        ctx.shadowBlur = 0;
    }
    else if(t.type === 'batman') {
        // cowl ears
        ctx.fillStyle = flash ? '#fff' : topC;
        ctx.beginPath(); ctx.moveTo(-hr*0.55,-h-hr*0.45); ctx.lineTo(-hr*0.2,-h-hr*1.35); ctx.lineTo(-hr*0.02,-h-hr*0.5); ctx.fill();
        ctx.beginPath(); ctx.moveTo(hr*0.55,-h-hr*0.45); ctx.lineTo(hr*0.2,-h-hr*1.35); ctx.lineTo(hr*0.02,-h-hr*0.5); ctx.fill();
        // bat emblem on chest
        ctx.fillStyle = '#f1c40f'; ctx.beginPath(); ctx.ellipse(0,-h*0.5,4.5,2.6,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = '#111'; ctx.beginPath();
        ctx.moveTo(0,-h*0.5-1.6); ctx.lineTo(-1.5,-h*0.5-0.3); ctx.lineTo(-4,-h*0.5-1); ctx.lineTo(-2.4,-h*0.5+0.6); ctx.lineTo(-3.2,-h*0.5+1.6); ctx.lineTo(0,-h*0.5+0.4);
        ctx.lineTo(3.2,-h*0.5+1.6); ctx.lineTo(2.4,-h*0.5+0.6); ctx.lineTo(4,-h*0.5-1); ctx.lineTo(1.5,-h*0.5-0.3); ctx.closePath(); ctx.fill();
        // yellow utility belt
        ctx.fillStyle = '#f1c40f'; ctx.fillRect(-w, -h*0.16, w*2, 2.8);
        ctx.fillStyle = '#c9a227'; ctx.fillRect(-2, -h*0.16-0.6, 4, 4);
    }
    else if(t.type === 'deku') {
        // spiky green hair
        ctx.fillStyle = '#1f7a3d';
        for(let s=-3;s<=3;s++){ ctx.beginPath(); ctx.moveTo(s*2.1, -h-hr*0.2); ctx.lineTo(s*2.1-2, -h-hr-4.5); ctx.lineTo(s*2.1+2.4, -h-hr*0.2); ctx.fill(); }
        ctx.fillStyle = 'rgba(0,0,0,0.14)'; ctx.beginPath(); ctx.arc(0,-h,hr*0.95,Math.PI*1.05,Math.PI*1.95); ctx.fill();
        // audio-jack ear accents
        ctx.fillStyle = '#e74c3c'; ctx.beginPath(); ctx.arc(-hr*0.98,-h+0.5,2,0,6.28); ctx.arc(hr*0.98,-h+0.5,2,0,6.28); ctx.fill();
        ctx.fillStyle = '#922b21'; ctx.beginPath(); ctx.arc(-hr*0.98,-h+0.5,0.9,0,6.28); ctx.arc(hr*0.98,-h+0.5,0.9,0,6.28); ctx.fill();
        // freckles
        ctx.fillStyle = 'rgba(150,80,40,0.5)';
        ctx.beginPath(); ctx.arc(ex-3.5,-h+1,0.6,0,6.28); ctx.arc(ex+3.5,-h+1,0.6,0,6.28); ctx.fill();
        // metal muzzle mask over the lower face
        ctx.fillStyle = '#8b969c'; rrp(-hr*0.62, -h+hr*0.42, hr*1.24, hr*0.62, 2.5); ctx.fill();
        ctx.strokeStyle = '#566573'; ctx.lineWidth = 0.8; ctx.stroke();
        ctx.strokeStyle = '#4a5a64'; ctx.lineWidth = 0.7; ctx.beginPath(); for(let g=-1;g<=1;g++){ ctx.moveTo(g*2.6, -h+hr*0.5); ctx.lineTo(g*2.6, -h+hr*0.98); } ctx.stroke();
        // One For All green lightning on attack
        if(t.state === 'attack'){ ctx.strokeStyle = 'rgba(60,220,120,0.85)'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(t.facing*(w+1),-h*0.72); ctx.lineTo(t.facing*(w+4),-h*0.52); ctx.lineTo(t.facing*(w+1),-h*0.36); ctx.lineTo(t.facing*(w+5),-h*0.14); ctx.stroke(); }
    }
    else if(t.type === 'bombur') {
        // braided beard
        ctx.fillStyle = '#7a4a1a'; ctx.beginPath(); ctx.arc(0, -h+hr*0.25, hr*0.95, 0.05*Math.PI, 0.95*Math.PI); ctx.closePath(); ctx.fill();
        // horned helmet
        ctx.fillStyle = '#8a5a2b'; ctx.beginPath(); ctx.arc(0, -h, hr*1.05, Math.PI, 0); ctx.fill();
        ctx.fillStyle = '#c9a85f'; ctx.fillRect(-hr, -h-1, hr*2, 2.5);
        ctx.fillStyle = '#ece0c0'; ctx.beginPath(); ctx.arc(-hr+1, -h-1, 3, Math.PI*0.9, Math.PI*1.7); ctx.fill(); ctx.beginPath(); ctx.arc(hr-1, -h-1, 3, Math.PI*1.3, Math.PI*0.1); ctx.fill();
        // war hammer
        ctx.fillStyle = '#95a5a6'; ctx.save(); ctx.translate(t.facing*11, -h/2); if(t.state === 'attack' && t.atkTimer > 100) ctx.rotate(t.facing * -Math.PI/2); ctx.fillStyle='#6b4a28'; ctx.fillRect(-2, -12, 4, 24); ctx.fillStyle='#95a5a6'; rrp(-7, -19, 14, 11, 2); ctx.fill(); ctx.strokeStyle='#566573'; ctx.lineWidth=1; ctx.stroke(); ctx.restore();
    }
    else if(t.type === 'cap') {
        // helmet dome + A + side wings
        ctx.fillStyle = '#2471a3'; ctx.beginPath(); ctx.arc(0, -h, hr*1.05, Math.PI, 0); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('A', 0, -h-1.5); ctx.textAlign = 'left';
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-hr, -h-1); ctx.lineTo(-hr-3, -h-4); ctx.moveTo(hr, -h-1); ctx.lineTo(hr+3, -h-4); ctx.stroke();
        // chest star
        starShape(0, -h*0.62, 3.4, '#fff');
        // red/white abdominal stripes
        ctx.fillStyle = '#fff'; for(let r=0;r<3;r++){ ctx.fillRect(-w*0.55, -h*0.34 + r*3, w*1.1, 1.5); }
        // round shield (raised when blocking)
        let sx = t.facing*7, sy = -h/2;
        ctx.beginPath(); ctx.arc(sx, sy, 6.5, 0, Math.PI*2); ctx.fillStyle='#c0392b'; ctx.fill();
        ctx.beginPath(); ctx.arc(sx, sy, 4.5, 0, Math.PI*2); ctx.fillStyle='#ecf0f1'; ctx.fill();
        ctx.beginPath(); ctx.arc(sx, sy, 2.4, 0, Math.PI*2); ctx.fillStyle='#c0392b'; ctx.fill();
        starShape(sx, sy, 2, '#fff');
        if(t.shield > 0) { ctx.beginPath(); ctx.arc(0, -h/2, 14, 0, Math.PI*2); ctx.strokeStyle='rgba(52,152,219,0.85)'; ctx.lineWidth=2; ctx.stroke(); }
    }
    else if(t.type === 'ninja') {
        // white hood with downward beak point
        ctx.fillStyle = '#eef0f1'; ctx.beginPath(); ctx.arc(0, -h, hr*1.06, Math.PI*0.92, Math.PI*2.08); ctx.fill();
        ctx.beginPath(); ctx.moveTo(-hr*0.62, -h-hr*0.15); ctx.lineTo(t.facing*hr*0.25, -h+hr*0.95); ctx.lineTo(hr*0.62, -h-hr*0.15); ctx.fill();
        // shadowed face inside hood + glint eyes
        ctx.fillStyle = 'rgba(18,22,28,0.6)'; ctx.beginPath(); ctx.arc(0, -h+1, hr*0.6, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = 'rgba(220,230,240,0.85)'; ctx.fillRect(ex-2.6, -h-0.4, 1.5, 1.2); ctx.fillRect(ex+1.2, -h-0.4, 1.5, 1.2);
        // red sash with tail
        ctx.fillStyle = '#b0301f'; ctx.fillRect(-w, -h*0.2, w*2, 2.6);
        ctx.beginPath(); ctx.moveTo(t.facing*w, -h*0.2); ctx.lineTo(t.facing*(w+4), -h*0.2+8); ctx.lineTo(t.facing*(w-1), -h*0.2+2.5); ctx.fill();
        // hidden blade
        ctx.fillStyle = '#cfd6da'; ctx.fillRect(t.facing*(w-1), -2.5, t.facing*9, 1.7);
    }
    else if(t.type === 'haaland') {
        // tied-back hair bun
        ctx.fillStyle = '#e3bd35'; ctx.beginPath(); ctx.arc(-t.facing*hr*0.75, -h-hr*0.45, 2.7, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#f4d03f'; ctx.beginPath(); ctx.arc(0, -h-1.5, hr, Math.PI, 0, true); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.fillRect(-hr, -h+0.5, hr*2, 2.2);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 7px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('9', 0, -h*0.42); ctx.textAlign = 'left';
        if(t.isCharging){ ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.arc(t.facing*(w+1), -h*0.5, 4, 0, Math.PI*2); ctx.fill(); }
    }
    else if(t.type === 'tower') { ctx.fillStyle='#3498db'; ctx.font="bold 16px sans-serif"; ctx.fillText("A", -6, -h+12); }
    else if(t.type === 'ultron') {
        ctx.fillStyle = flash ? '#fff' : '#95a5a6'; ctx.beginPath(); ctx.arc(0, -h, hr*0.92, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = '#566573'; ctx.lineWidth = 1.4; ctx.stroke();
        ctx.fillStyle = '#ff3b3b'; ctx.shadowColor = '#ff3b3b'; ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.arc(ex-2.6, -h-0.5, 1.5, 0, 6.28); ctx.arc(ex+2.6, -h-0.5, 1.5, 0, 6.28); ctx.fill(); ctx.shadowBlur = 0;
        ctx.strokeStyle = '#2c3e50'; ctx.lineWidth = 1; ctx.beginPath(); for(let g=-3; g<=3; g+=2){ ctx.moveTo(g, -h+hr*0.4); ctx.lineTo(g, -h+hr*0.75); } ctx.stroke();
        ctx.strokeStyle = '#566573'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(0, -h-hr*0.9); ctx.lineTo(0, -h-hr-3.5); ctx.stroke();
        ctx.fillStyle = '#00ffcc'; ctx.beginPath(); ctx.arc(0, -h-hr-4.5, 1.6, 0, 6.28); ctx.fill();
    }
    else if(t.type === 'naruto') {
        ctx.fillStyle = '#f1c40f'; for(let s=-3; s<=3; s++){ ctx.beginPath(); ctx.moveTo(s*2.2, -h-hr*0.25); ctx.lineTo(s*2.2-2, -h-hr-4); ctx.lineTo(s*2.2+2.2, -h-hr*0.25); ctx.fill(); }
        ctx.fillStyle = '#2980b9'; ctx.fillRect(-hr, -h-2, hr*2, 3);
        ctx.fillStyle = '#c8d2d8'; ctx.fillRect(-2.5, -h-2, 5, 3); ctx.strokeStyle='#7f8c8d'; ctx.lineWidth=0.6; ctx.strokeRect(-2.5,-h-2,5,3);
        ctx.strokeStyle = '#34495e'; ctx.lineWidth = 0.7; ctx.beginPath(); ctx.arc(0, -h-0.5, 1.1, 0.2, Math.PI*1.7); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ex-2.6, -h+1, 1.7, 0, 6.28); ctx.arc(ex+2.6, -h+1, 1.7, 0, 6.28); ctx.fill();
        ctx.fillStyle = '#2980b9'; ctx.beginPath(); ctx.arc(ex-2.6+t.facing, -h+1, 0.9, 0, 6.28); ctx.arc(ex+2.6+t.facing, -h+1, 0.9, 0, 6.28); ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(-hr*0.75,-h+2.5); ctx.lineTo(-hr*0.3,-h+3); ctx.moveTo(hr*0.3,-h+3); ctx.lineTo(hr*0.75,-h+2.5); ctx.stroke();
    }
    else if(t.type === 'martian') {
        // blue cape behind
        ctx.fillStyle = '#1f4e8a'; ctx.beginPath(); ctx.moveTo(-w, -h+2); ctx.lineTo(-w-9, 9); ctx.lineTo(w+9, 9); ctx.lineTo(w, -h+2); ctx.fill();
        // red chest straps crossing in an X
        ctx.strokeStyle = '#b0301f'; ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.moveTo(-w*0.7,-h*0.88); ctx.lineTo(w*0.7,-h*0.18); ctx.moveTo(w*0.7,-h*0.88); ctx.lineTo(-w*0.7,-h*0.18); ctx.stroke();
        // blue shoulder collar
        ctx.fillStyle = '#2a5fa0'; rrp(-w-1, -h+1, w*2+2, 4, 2); ctx.fill();
        // bald green head
        ctx.fillStyle = flash ? '#fff' : '#3aa564'; ctx.beginPath(); ctx.ellipse(0, -h-2, hr*1.05, hr*1.3, 0, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = 'rgba(8,12,24,0.5)'; ctx.lineWidth = 1.4; ctx.stroke();
        // heavy brow
        ctx.fillStyle = '#268a4e'; rrp(-hr*0.9, -h-4, hr*1.8, 2.4, 1); ctx.fill();
        // glowing red eyes
        ctx.fillStyle = '#ff3b3b'; ctx.shadowColor = '#ff3b3b'; ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.ellipse(ex-3, -h-0.5, 1.9, 1.2, 0, 0, 6.28); ctx.ellipse(ex+3, -h-0.5, 1.9, 1.2, 0, 0, 6.28); ctx.fill(); ctx.shadowBlur = 0;
    }
    else if(t.type === 'nobu') {
        // katana strapped to back
        ctx.strokeStyle = '#2c3e50'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-t.facing*(w+2), -h*0.2); ctx.lineTo(-t.facing*(w-2), -h-6); ctx.stroke();
        ctx.fillStyle = '#7a1f12'; ctx.fillRect(-t.facing*(w+3), -h*0.2-1, t.facing*3, 4);
        // red hood
        ctx.fillStyle = flash ? '#fff' : '#a82c1c';
        ctx.beginPath(); ctx.arc(0, -h, hr*1.05, Math.PI*0.9, Math.PI*2.1); ctx.fill();
        ctx.beginPath(); ctx.moveTo(-hr*0.55, -h-hr*0.1); ctx.lineTo(0, -h+hr*0.85); ctx.lineTo(hr*0.55, -h-hr*0.1); ctx.fill();
        // black face wrap with glaring eyes
        ctx.fillStyle = '#161616'; rrp(-hr*0.78, -h-1.6, hr*1.56, 5, 1); ctx.fill();
        ctx.fillStyle = '#ffd24a'; ctx.fillRect(ex-3.4, -h+0.1, 2, 1.3); ctx.fillRect(ex+1.4, -h+0.1, 2, 1.3);
    }
    else if(t.type === 'indy') {
        // tan shirt collar under the leather jacket
        ctx.fillStyle = '#d9c9a3'; ctx.beginPath(); ctx.moveTo(-3.2, -h*0.58); ctx.lineTo(0, -h*0.34); ctx.lineTo(3.2, -h*0.58); ctx.fill();
        // satchel strap + bag
        ctx.strokeStyle = '#4a3520'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(-w, -h*0.72); ctx.lineTo(w*0.55, -2); ctx.stroke();
        ctx.fillStyle = '#6e4b2a'; rrp(w*0.15, -h*0.32, 6, 7, 2); ctx.fill();
        // fedora
        ctx.fillStyle = '#4a3318'; ctx.beginPath(); ctx.ellipse(0, -h-hr*0.35, hr+4, 3, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#6e4b2a'; ctx.beginPath(); ctx.ellipse(t.facing*1, -h-hr*0.85, hr*0.85, hr*0.6, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#3a2a18'; ctx.fillRect(-hr*0.8, -h-hr*0.5, hr*1.6, 2);
        // coiled whip
        ctx.strokeStyle = '#3a2a18'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(-t.facing*(w+3), -h*0.4, 4, 0, Math.PI*1.6); ctx.stroke();
    }
    else if(t.type === 'golem') {
        // green rage-monster: huge fists, torn purple shorts, dark hair, furious brow
        ctx.fillStyle = flash ? '#fff' : baseC; ctx.beginPath(); ctx.arc(-w-3, -h*0.35, 6, 0, 6.28); ctx.arc(w+3, -h*0.35, 6, 0, 6.28); ctx.fill();
        ctx.fillStyle = '#5b2c83'; rrp(-w, -h*0.26, w*2, h*0.26, 2); ctx.fill();
        ctx.fillStyle = '#161616'; for(let s=-2;s<=2;s++){ ctx.beginPath(); ctx.moveTo(s*3, -h-hr*0.3); ctx.lineTo(s*3-2, -h-hr-3); ctx.lineTo(s*3+2, -h-hr*0.3); ctx.fill(); }
        ctx.fillStyle = '#14591f'; rrp(-hr*0.85, -h-2.5, hr*1.7, 2.6, 1); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ex-2.6, -h+0.6, 1.5, 0, 6.28); ctx.arc(ex+2.6, -h+0.6, 1.5, 0, 6.28); ctx.fill();
        ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(ex-2.6, -h+0.6, 0.8, 0, 6.28); ctx.arc(ex+2.6, -h+0.6, 0.8, 0, 6.28); ctx.fill();
    }
    else if(t.type === 'drake') {
        // explosive hero: jet blasts beneath, spiky pale hair, grenade gauntlets, red eyes
        ctx.fillStyle = 'rgba(255,140,40,0.6)'; ctx.beginPath(); ctx.arc(-w*0.5, 3, 3, 0, 6.28); ctx.arc(w*0.5, 3, 3, 0, 6.28); ctx.fill();
        ctx.fillStyle = '#f2e6bf'; for(let s=-3;s<=3;s++){ ctx.beginPath(); ctx.moveTo(s*2.2, -h-hr*0.25); ctx.lineTo(s*2.2-2, -h-hr-4); ctx.lineTo(s*2.2+2.2, -h-hr*0.25); ctx.fill(); }
        ctx.fillStyle = '#333'; rrp(-w-3, -h*0.55, 4.5, h*0.42, 1); ctx.fill(); rrp(w-1.5, -h*0.55, 4.5, h*0.42, 1); ctx.fill();
        ctx.fillStyle = '#2ecc71'; ctx.beginPath(); ctx.arc(-w-0.7, -h*0.4, 1.5, 0, 6.28); ctx.arc(w+0.7, -h*0.4, 1.5, 0, 6.28); ctx.fill();
        ctx.fillStyle = '#e74c3c'; ctx.beginPath(); ctx.arc(ex-2.4, -h, 1.3, 0, 6.28); ctx.arc(ex+2.4, -h, 1.3, 0, 6.28); ctx.fill();
        if(t.state === 'attack') { ctx.fillStyle = 'rgba(255,160,40,0.85)'; ctx.beginPath(); ctx.arc(t.facing*(w+6), -h*0.5, 5.5, 0, 6.28); ctx.fill(); ctx.fillStyle = 'rgba(255,235,140,0.95)'; ctx.beginPath(); ctx.arc(t.facing*(w+6), -h*0.5, 2.6, 0, 6.28); ctx.fill(); }
    }
    else if(t.type === 'sniper') {
        // clown trickster: green hair, white face, red grin, throws a card
        ctx.fillStyle = '#2ecc71'; ctx.beginPath(); ctx.arc(0, -h, hr*1.12, Math.PI*0.88, Math.PI*2.12); ctx.fill();
        ctx.fillStyle = flash ? '#fff' : '#f0f0f0'; ctx.beginPath(); ctx.arc(0, -h, hr*0.92, 0, 6.28); ctx.fill();
        ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(ex-2.4, -h-0.5, 1, 0, 6.28); ctx.arc(ex+2.4, -h-0.5, 1, 0, 6.28); ctx.fill();
        ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(0, -h+1, hr*0.5, 0.15*Math.PI, 0.85*Math.PI); ctx.stroke();
        ctx.save(); ctx.translate(t.facing*(w+6), -h*0.55); ctx.rotate(t.facing*0.5); ctx.fillStyle = '#ecf0f1'; rrp(-3, -4, 6, 8, 1); ctx.fill(); ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 0.7; ctx.strokeRect(-3, -4, 6, 8); ctx.restore();
    }
    else if(t.type === 'medic') {
        // soft white care-robot: round head, two-dot face + line, red cross
        ctx.fillStyle = flash ? '#fff' : '#f4f6f7'; ctx.beginPath(); ctx.arc(0, -h, hr, 0, 6.28); ctx.fill();
        ctx.strokeStyle = 'rgba(120,140,150,0.5)'; ctx.lineWidth = 1; ctx.stroke();
        ctx.strokeStyle = '#222'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-2.4, -h); ctx.lineTo(2.4, -h); ctx.stroke();
        ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(-2.6, -h, 1.2, 0, 6.28); ctx.arc(2.6, -h, 1.2, 0, 6.28); ctx.fill();
        ctx.fillStyle = '#e74c3c'; ctx.fillRect(-1.2, -h*0.55, 2.4, 7); ctx.fillRect(-3.4, -h*0.55+2.3, 7, 2.4);
        if(t.healTimer !== undefined && t.healTimer < 16) { ctx.strokeStyle = 'rgba(46,204,113,0.7)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, -h*0.4, 13, 0, 6.28); ctx.stroke(); }
    }
    else if(t.type === 'drones') {
        // little plastic soldier: helmet + rifle, matte green
        ctx.fillStyle = flash ? '#fff' : '#274d22'; ctx.beginPath(); ctx.arc(0, -h, hr*1.05, Math.PI, 0); ctx.fill();
        ctx.fillStyle = flash ? '#fff' : '#274d22'; ctx.fillRect(-hr, -h-0.5, hr*2, 1.6);
        ctx.strokeStyle = '#16330f'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-t.facing*2, -h*0.5); ctx.lineTo(t.facing*(w+6), -h*0.62); ctx.stroke();
        ctx.fillStyle = '#0a0a0a'; ctx.fillRect(ex-1.6, -h, 1.1, 1.1); ctx.fillRect(ex+0.6, -h, 1.1, 1.1);
    }

    if(!preview) drawHealthBar(t, w, h, w * 1.05); ctx.restore();
}

function drawArena() {
    ctx.clearRect(0,0,360,608); ctx.fillStyle = '#11141a'; ctx.fillRect(0,0,360,608); ctx.fillStyle = '#1c2d1f'; ctx.fillRect(START_X, START_Y, COLS * TILE_SIZE, ROWS * TILE_SIZE);
    for(let col = 0; col < COLS; col++) {
        for(let row = 0; row < ROWS; row++) {
            let x = START_X + col * TILE_SIZE; let y = START_Y + row * TILE_SIZE;
            ctx.fillStyle = ((col + row) % 2 === 0) ? (row < 16 ? '#386641' : '#3e7047') : (row < 16 ? '#2f5237' : '#345c3d');
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE); ctx.fillStyle = 'rgba(102, 252, 241, 0.12)'; ctx.fillRect(x + TILE_SIZE/2 - 1, y + TILE_SIZE/2 - 1, 2, 2);
        }
    }
    let riverY1 = START_Y + 15 * TILE_SIZE; let riverHeight = TILE_SIZE * 2;
    ctx.fillStyle = '#0a2333'; ctx.fillRect(START_X, riverY1, COLS * TILE_SIZE, riverHeight); ctx.lineWidth = 2.5;
    for(let i = 0; i < 5; i++) {
        ctx.strokeStyle = i % 2 === 0 ? '#66fcf1' : '#00ffcc'; ctx.beginPath();
        for(let x = START_X; x <= START_X + COLS*TILE_SIZE; x += 8) { let yCurve = riverY1 + 15 + i*7 + Math.sin(x*0.05 + riverAnimateTimer + i) * 5; if(x === START_X) ctx.moveTo(x, yCurve); else ctx.lineTo(x, yCurve); } ctx.stroke();
    }
    [3, 13].forEach(bx => {
        let bxReal = START_X + bx * TILE_SIZE; ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(bxReal + 2, riverY1 - 2, TILE_SIZE * 2, riverHeight + 4); 
        ctx.fillStyle = '#0b0c10'; ctx.fillRect(bxReal, riverY1 - 4, TILE_SIZE * 2, riverHeight + 8); ctx.strokeStyle = '#66fcf1'; ctx.lineWidth = 2; ctx.strokeRect(bxReal, riverY1 - 4, TILE_SIZE * 2, riverHeight + 8);
    });

    particles.forEach(pt => {
        if(pt.type === 'spark') { ctx.fillStyle = `rgba(${pt.color || '224, 86, 253'}, ${pt.alpha})`; ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI*2); ctx.fill(); }
        else if(pt.type === 'cone') { ctx.fillStyle = `rgba(46, 204, 113, ${pt.alpha})`; ctx.beginPath(); ctx.moveTo(pt.x, pt.y); ctx.arc(pt.x, pt.y, 65, pt.angle - Math.PI/3, pt.angle + Math.PI/3); ctx.fill(); }
        else if(pt.type === 'explosion') { ctx.fillStyle = `rgba(255, 170, 60, ${pt.alpha*0.5})`; ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = `rgba(255, 230, 150, ${pt.alpha})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI*2); ctx.stroke(); }
        else if(pt.type === 'ring') { ctx.strokeStyle = `rgba(${pt.color || '102,252,241'}, ${pt.alpha})`; ctx.lineWidth = pt.lw || 2; ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI*2); ctx.stroke(); }
        else if(pt.type === 'float') { ctx.fillStyle = `rgba(${pt.color || '255,255,255'}, ${pt.alpha})`; ctx.font = 'bold ' + (pt.size || 11) + 'px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(pt.text || '', pt.x, pt.y); ctx.textAlign = 'left'; }
    });

    towers.forEach(t => {
        if(t.dead) return;
        let bx = START_X + t.tx * TILE_SIZE; let by = START_Y + t.ty * TILE_SIZE; let bw = t.w * TILE_SIZE; let bh = t.h * TILE_SIZE;
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(bx + 6, by + 6, bw, bh); ctx.fillStyle = '#1f2833'; ctx.fillRect(bx, by, bw, bh);
        ctx.strokeStyle = t.team === 'blue' ? '#66fcf1' : '#ff3366'; ctx.lineWidth = 3; ctx.strokeRect(bx, by, bw, bh);
        ctx.fillStyle = t.team === 'blue' ? '#0f3460' : '#800020'; ctx.fillRect(bx + 4, by + 4, bw - 8, bh - 8);
        ctx.beginPath(); ctx.arc(bx + bw/2, by + bh/2, t.type==='king'?16:11, 0, 6.28); ctx.strokeStyle = t.team === 'blue' ? '#00ffcc' : '#ff3366'; ctx.lineWidth = 2.5; ctx.stroke();
        // dormant King Tower: dim it and show a sleep marker
        if(t.type === 'king' && !t.activated) {
            ctx.fillStyle = 'rgba(8,16,32,0.45)'; ctx.fillRect(bx, by, bw, bh);
            ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText('z', bx + bw/2 + 6, by + bh/2 - 6); ctx.textAlign = 'left';
        }
        ctx.fillStyle = '#050508'; ctx.fillRect(bx - 10, by - 12, bw + 20, 5); ctx.fillStyle = t.team === 'blue' ? '#00ffcc' : '#ff3366'; ctx.fillRect(bx - 10, by - 12, (t.hp / t.maxHp) * (bw + 20), 5);
    });

    projectiles.forEach(p => {
        if(p.isPower) {
            ctx.strokeStyle = '#e056fd'; ctx.lineWidth = 4; ctx.shadowColor = '#e056fd'; ctx.shadowBlur = 10;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - Math.cos(p.angle)*25, p.y - Math.sin(p.angle)*25); ctx.stroke(); ctx.shadowBlur = 0;
            particles.push({x: p.x, y: p.y, r: 2, alpha: 1, type: 'spark'});
        } else { 
            ctx.fillStyle = '#9b59b6'; ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, 6.28); ctx.fill(); ctx.strokeStyle = '#8e44ad'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - Math.cos(p.angle)*10, p.y - Math.sin(p.angle)*10); ctx.stroke(); 
        }
    });
    troops.forEach(t => { drawTroop3D(t); });

    if(isHovering && combatActive) {
        let coords = getGridCoords(mouseX, mouseY);
        if(coords.tx >= 0 && coords.tx < COLS && coords.ty >= 0 && coords.ty < ROWS) {
            let valid = validatePlacement(activeCombatCard, coords.tx, coords.ty); let sX = START_X + coords.tx * TILE_SIZE; let sY = START_Y + coords.ty * TILE_SIZE;
            if(valid) { ctx.fillStyle = 'rgba(0, 255, 204, 0.45)'; ctx.fillRect(sX, sY, TILE_SIZE, TILE_SIZE); } 
            else { ctx.fillStyle = 'rgba(255, 51, 102, 0.5)'; ctx.fillRect(sX, sY, TILE_SIZE, TILE_SIZE); ctx.strokeStyle = '#ff3366'; ctx.lineWidth = 2.5; ctx.strokeRect(sX, sY, TILE_SIZE, TILE_SIZE); }
        }
    }
}

// Simulation runs on a timer (keeps ticking in background tabs, unlike requestAnimationFrame,
// so the online host never "freezes" the match). Rendering stays on the animation frame.
function simTick() { try { updateEngine(); } catch(e) { console.error('sim error:', e); } }
function renderLoop() {
    try { if(document.getElementById('screenPlayGround').style.display === 'flex') drawArena(); } catch(e) { console.error('render error:', e); }
    requestAnimationFrame(renderLoop);
}
function runLoop() { setInterval(simTick, 16); renderLoop(); }

// ===================== MISSING SYSTEMS (added) =====================

// ---- Dev resource injectors (tap the coin / gem pill) ----
window.injectDevGold = function(){ pData.gold += 1000; saveData(); };
window.injectDevGems = function(){ pData.gems += 100; saveData(); };
window.injectDevDust = function(){ pData.evoDust += 1200; saveData(); renderEvoChamber(); };
window.injectDevShards = function(){ pData.evoShards += 6; saveData(); renderEvoChamber(); };
window.injectDevTrophies = function(){ pData.trophies += 100; saveData(); renderTrophyRoad(); updateTopResources(); };

// ---- Silent XP (used post-match so we don't stack chest overlays) ----
function addXpSilent(amt){
    pData.xp += amt;
    let req = pData.level*100 + (pData.level*pData.level*50);
    while(pData.xp >= req){ pData.xp -= req; pData.level++; req = pData.level*100 + (pData.level*pData.level*50); }
}

// ---- Tutorial flow ----
const TUT_STEPS = [
    { text: "Incoming transmission... 🛰️\n\nWelcome, Commander! I'm B.L.I.P., your tactical battle AI.", input:false },
    { text: "This is an arena duel. Deploy your heroes, smash the enemy towers, and capture their crowns 👑 before time runs out!", input:false },
    { text: "First things first — what should I call you? Enter your call-sign below:", input:true },
    { text: "Locked in! Your starter deck is ready, Commander. Tap the big BATTLE button to deploy. Good luck out there! ⚔️", input:false }
];
let tutIndex = 0;
function startTutorial(){ tutIndex = 0; document.getElementById('tutorialOverlay').style.display = 'flex'; renderTutStep(); }
function renderTutStep(){
    let s = TUT_STEPS[tutIndex];
    document.getElementById('tutText').innerText = s.text;
    let inp = document.getElementById('tutInput');
    inp.style.display = s.input ? 'block' : 'none';
    if(s.input) inp.focus();
    document.getElementById('tutBtn').innerText = (tutIndex === TUT_STEPS.length - 1) ? "LET'S GO!" : "NEXT";
}
window.nextTutorialStep = function(){
    let s = TUT_STEPS[tutIndex];
    if(s.input){
        let v = (document.getElementById('tutInput').value || "").trim();
        if(!v){ alert("Enter a call-sign first, Commander!"); return; }
        pData.username = v.substring(0,12); saveData();
    }
    tutIndex++;
    if(tutIndex >= TUT_STEPS.length){
        pData.tutorialDone = true; saveData();
        document.getElementById('tutorialOverlay').style.display = 'none';
        updateTopResources();
        return;
    }
    renderTutStep();
};

// ---- Matchmaking -> Versus -> Battle ----
function buildBotOpponent(){
    let name = BOT_NAMES[Math.floor(Math.random()*BOT_NAMES.length)];
    let pool = Object.keys(cardDatabase).filter(k => cardDatabase[k].arena <= getArenaLevel());
    let deck = pool.slice().sort(() => Math.random()-0.5).slice(0,8);
    if(deck.length < 8) deck = ['archer','batman','deku','bombur','cap','ninja','haaland','tower'];
    let fav = deck[Math.floor(Math.random()*deck.length)];
    return { name: name, deck: deck, favIcon: cardDatabase[fav].icon };
}
window.startMatchmaking = function(){
    if(pData.activeDeck.filter(k => cardDatabase[k]).length < 8){ alert("Your battle deck needs 8 cards!"); return; }
    currentOpponentData = buildBotOpponent();
    let ov = document.getElementById('matchmakingOverlay'); ov.style.display = 'flex';
    let t = 3; document.getElementById('mmTimerTxt').innerText = "ESTIMATED TIME: 0:0" + t;
    clearInterval(mmTimerInterval);
    mmTimerInterval = setInterval(() => {
        t--;
        if(t < 0){ clearInterval(mmTimerInterval); ov.style.display = 'none'; showVersus(); return; }
        document.getElementById('mmTimerTxt').innerText = "ESTIMATED TIME: 0:0" + t;
    }, 1000);
};
window.cancelMatchmaking = function(){ clearInterval(mmTimerInterval); document.getElementById('matchmakingOverlay').style.display = 'none'; };
function showVersus(){
    let vs = document.getElementById('versusOverlay');
    document.getElementById('vsP1Name').innerText = pData.username || "YOU";
    let myFav = pData.activeDeck[0];
    document.getElementById('vsP1Icon').innerText = (cardDatabase[myFav] ? cardDatabase[myFav].icon : '🏹');
    document.getElementById('vsP2Name').innerText = currentOpponentData.name;
    document.getElementById('vsP2Icon').innerText = currentOpponentData.favIcon;
    vs.style.display = 'flex';
    setTimeout(() => { vs.style.display = 'none'; launchBattlefield(); }, 1800);
}

// ---- Chest opening ----
function rollChestCards(count){
    let pool = Object.keys(cardDatabase).filter(k => cardDatabase[k].arena <= getArenaLevel());
    let out = {};
    for(let i=0; i<count; i++){
        let k = pool[Math.floor(Math.random()*pool.length)];
        out[k] = (out[k] || 0) + (Math.floor(Math.random()*8) + 3);
    }
    return out;
}
function showChestUI(title, gold, gems, cardCount, isBig, dust){
    dust = dust || 0;
    let ov = document.getElementById('chestOverlay'); ov.style.display = 'flex';
    document.getElementById('chestHeader').innerText = title;
    let g = document.getElementById('chestGraphic');
    g.innerText = isBig ? '🧰' : '📦'; g.style.display = 'block';
    let loot = document.getElementById('chestLootArea'); loot.style.display = 'none'; loot.innerHTML = '';
    let btn = document.getElementById('chestBtn'); btn.style.display = 'none';
    let hint = document.getElementById('chestHint'); if(hint) hint.style.display = 'block';
    g.onclick = function(){
        g.style.display = 'none';
        if(hint) hint.style.display = 'none';
        pData.gold += gold; pData.gems += gems; pData.evoDust += dust;
        let cards = rollChestCards(cardCount); let html = '';
        if(gold > 0) html += `<div class="lootItem"><span>🪙 Gold</span><span style="color:#ffd84a;">+${gold}</span></div>`;
        if(gems > 0) html += `<div class="lootItem"><span>💎 Gems</span><span style="color:#d36bff;">+${gems}</span></div>`;
        if(dust > 0) html += `<div class="lootItem" style="border-color:#e056fd;"><span>🌌 Evo Dust ${dust >= 30 ? '(RARE!)' : ''}</span><span style="color:#e056fd;">+${dust}</span></div>`;
        for(let k in cards){
            if(pData.cards[k].level === 0) pData.cards[k].level = 1;
            pData.cards[k].amount += cards[k];
            html += `<div class="lootItem"><span>${cardDatabase[k].icon} ${cardDatabase[k].name}</span><span style="color:#46d3ff;">+${cards[k]}</span></div>`;
        }
        loot.innerHTML = html; loot.style.display = 'flex'; btn.style.display = 'block';
        saveData();
    };
}
window.closeChest = function(){ document.getElementById('chestOverlay').style.display = 'none'; renderTroopsMenu(); };

// ---- Match result: rewards, trophies, victory chest ----
function endMatch(outcomeText){
    combatActive = false;
    // HOST: tell the guest the result from their perspective (guest controls the 'red' side)
    if(netRole === 'host' && typeof netSend === 'function') {
        netSend({ type:'end', win: outcomeText.indexOf('RED') > -1, draw: outcomeText.indexOf('DRAW') > -1 });
        setTimeout(() => { if(typeof netCleanup === 'function') netCleanup(); }, 750);
    }
    let win = outcomeText.indexOf('BLUE') > -1;
    let draw = outcomeText.indexOf('DRAW') > -1;
    setTimeout(() => {
        document.getElementById('screenPlayGround').style.display = 'none';
        if(draw){
            addXpSilent(15); saveData(); updateTopResources();
            alert("MATCH RESULT: DRAW\nTrophies unchanged. Well fought, Commander.");
            return;
        }
        if(win){
            // Evo Dust is RARE: a small trickle per win, with an occasional lucky cache
            let dust = 3 + Math.floor(Math.random() * 3);          // 3-5 base
            if(Math.random() < 0.10) dust += 30 + Math.floor(Math.random() * 16); // ~10% rare cache (+30-45)
            pData.trophies += 30; pData.gold += 50; addXpSilent(40); saveData(); updateTopResources();
            showChestUI("🏆 VICTORY CHEST!", 150, 2, 6, true, dust);
        } else {
            pData.trophies = Math.max(0, pData.trophies - 15); addXpSilent(12); saveData(); updateTopResources();
            alert("MATCH RESULT: DEFEAT\nYou lost 15 trophies. Regroup and try again!");
        }
    }, 600);
}

// ---- Boot ----
function boot(){
    updateTopResources();
    if(!pData.tutorialDone) startTutorial();
}
boot();


runLoop();
