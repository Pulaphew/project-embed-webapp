import WebSocket from "ws";

let wss = null;

export function initWebSocketServer(server) {
    if (wss) return wss; // Return existing server if already initialized
    wss = new WebSocket.Server({ server, path: '/ws' });

    wss.on('connection', (ws,req) => {
        console.log('WS client connected from', req.socket.remoteAddress);
        ws.on('close',() => console.log('WS client disconnected'));
    })
    return wss;
}

export function broadcastJSON(obj) {
    if (!wss) return;
    const payload = JSON.stringify(obj);
    wss.clients.forEach((c) => {
        if (c.readyState === WebSocket.OPEN) {
            c.send(payload);
        }
    })
}