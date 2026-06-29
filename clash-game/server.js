/* Neon Blitz Tactics — static server + WebSocket matchmaking/relay.
   ZERO dependencies. Just:   node server.js
   (no npm install needed). Defaults to http://localhost:3000 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.json': 'application/json' };

/* ---------------- static file server ---------------- */
const server = http.createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split('?')[0]);
    if(urlPath === '/') urlPath = '/index.html';
    const safe = path.normalize(urlPath).replace(/^(\.\.([\/\\]|$))+/, '');
    const filePath = path.join(PUBLIC_DIR, safe);
    if(!filePath.startsWith(PUBLIC_DIR)) { res.writeHead(403); res.end('Forbidden'); return; }
    fs.readFile(filePath, (err, data) => {
        if(err) { res.writeHead(404); res.end('Not found'); return; }
        res.writeHead(200, {
            'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
            'Cache-Control': 'no-store, no-cache, must-revalidate',  // always serve the latest code
            'Pragma': 'no-cache'
        });
        res.end(data);
    });
});

/* ---------------- minimal WebSocket (RFC 6455) ---------------- */
function wsFrame(str) {
    const payload = Buffer.from(str, 'utf8');
    const len = payload.length;
    let header;
    if(len < 126) { header = Buffer.from([0x81, len]); }
    else if(len < 65536) { header = Buffer.alloc(4); header[0] = 0x81; header[1] = 126; header.writeUInt16BE(len, 2); }
    else { header = Buffer.alloc(10); header[0] = 0x81; header[1] = 127; header.writeUInt32BE(Math.floor(len / 4294967296), 2); header.writeUInt32BE(len >>> 0, 6); }
    return Buffer.concat([header, payload]);
}
function parseFrames(sock) {
    let buf = sock._buf;
    while(buf.length >= 2) {
        const b0 = buf[0], b1 = buf[1];
        const opcode = b0 & 0x0f;
        const masked = (b1 & 0x80) !== 0;
        let len = b1 & 0x7f;
        let off = 2;
        if(len === 126) { if(buf.length < 4) break; len = buf.readUInt16BE(2); off = 4; }
        else if(len === 127) { if(buf.length < 10) break; len = Number(buf.readBigUInt64BE(2)); off = 10; }
        let mask;
        if(masked) { if(buf.length < off + 4) break; mask = buf.slice(off, off + 4); off += 4; }
        if(buf.length < off + len) break;               // wait for the rest of the frame
        let payload = buf.slice(off, off + len);
        if(masked) { const out = Buffer.alloc(len); for(let i = 0; i < len; i++) out[i] = payload[i] ^ mask[i & 3]; payload = out; }
        buf = buf.slice(off + len); sock._buf = buf;
        if(opcode === 0x8) { sock.end(); return; }       // close
        else if(opcode === 0x9) { sock.write(Buffer.concat([Buffer.from([0x8A, payload.length]), payload])); } // ping -> pong
        else if(opcode === 0x1 || opcode === 0x2) { sock._onmsg(payload.toString('utf8')); } // text/binary
    }
}
server.on('upgrade', (req, socket) => {
    const key = req.headers['sec-websocket-key'];
    if(!key) { socket.destroy(); return; }
    const accept = crypto.createHash('sha1').update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');
    socket.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ' + accept + '\r\n\r\n');
    socket.setNoDelay(true);
    socket._buf = Buffer.alloc(0);
    const conn = { sock: socket, readyState: 1, partner: null, info: { name: 'Player' }, roomCode: null };
    conn.send = (obj) => { if(conn.readyState === 1) { try { socket.write(wsFrame(JSON.stringify(obj))); } catch(e) {} } };
    socket._onmsg = (str) => { let m; try { m = JSON.parse(str); } catch(e) { return; } onMessage(conn, m); };
    socket.on('data', (chunk) => { socket._buf = Buffer.concat([socket._buf, chunk]); try { parseFrames(socket); } catch(e) {} });
    socket.on('close', () => { conn.readyState = 3; onClose(conn); });
    socket.on('error', () => { conn.readyState = 3; });
});

/* ---------------- matchmaking ---------------- */
let queue = [];      // conns waiting for a random opponent
let rooms = {};      // CODE -> { host: conn }

function send(conn, obj) { if(conn) conn.send(obj); }
function genCode() {
    const A = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let c; do { c = ''; for(let i = 0; i < 4; i++) c += A[Math.floor(Math.random() * A.length)]; } while(rooms[c]);
    return c;
}
function pair(host, guest) {
    host.partner = guest; guest.partner = host;
    send(host,  { type: 'matched', role: 'host',  oppName: guest.info.name, oppDeck: guest.info.deck });
    send(guest, { type: 'matched', role: 'guest', oppName: host.info.name,  oppDeck: host.info.deck });
    console.log(`Matched: ${host.info.name} (host) vs ${guest.info.name} (guest)`);
}
function onMessage(conn, m) {
    if(m.type === 'queue') {
        conn.info = { name: (m.name || 'Player').toString().substring(0, 12), deck: m.deck, levels: m.levels };
        const opp = queue.find(s => s.readyState === 1 && s !== conn);
        if(opp) { queue = queue.filter(s => s !== opp && s !== conn); pair(opp, conn); }
        else if(!queue.includes(conn)) queue.push(conn);
    } else if(m.type === 'create') {
        conn.info = { name: (m.name || 'Player').toString().substring(0, 12), deck: m.deck, levels: m.levels };
        if(conn.roomCode && rooms[conn.roomCode]) delete rooms[conn.roomCode];
        const code = genCode(); rooms[code] = { host: conn }; conn.roomCode = code;
        send(conn, { type: 'created', code: code });
        console.log(`Room created: ${code} by ${conn.info.name}`);
    } else if(m.type === 'join') {
        conn.info = { name: (m.name || 'Player').toString().substring(0, 12), deck: m.deck, levels: m.levels };
        const code = (m.code || '').toString().toUpperCase();
        const room = rooms[code];
        if(room && room.host && room.host.readyState === 1 && room.host !== conn) {
            delete rooms[code]; room.host.roomCode = null; pair(room.host, conn);
        } else { send(conn, { type: 'joinfail', code: code }); }
    } else if(m.type === 'cancel') {
        queue = queue.filter(s => s !== conn);
        if(conn.roomCode) { delete rooms[conn.roomCode]; conn.roomCode = null; }
    } else {
        if(conn.partner) send(conn.partner, m);          // relay deploy / state / end
    }
}
function onClose(conn) {
    queue = queue.filter(s => s !== conn);
    if(conn.roomCode) { delete rooms[conn.roomCode]; conn.roomCode = null; }
    if(conn.partner) { send(conn.partner, { type: 'oppleft' }); conn.partner.partner = null; conn.partner = null; }
}

server.listen(PORT, () => {
    console.log('Neon Blitz Tactics server running (no dependencies needed):');
    console.log('  On this PC:   http://localhost:' + PORT);
    console.log('  Other devices: http://<YOUR-LAN-IP>:' + PORT + '   (same Wi-Fi)');
});
