// backend/src/services/sseService.js

let clients = [];

function addClient(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'X-Accel-Buffering': 'no'
    });

    res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

    const clientId = Date.now();
    const newClient = { id: clientId, res };
    clients.push(newClient);

    req.on('close', () => {
        clients = clients.filter(c => c.id !== clientId);
    });

    return clientId;
}

function broadcast(data) {
    if (clients.length === 0) return;

    const message = `data: ${JSON.stringify(data)}\n\n`;

    clients.forEach(client => {
        try {
            client.res.write(message);
        } catch (err) {
            console.error("[sseService] Failed to write to client:", err);
        }
    });
}

function broadcastPulse(spansArray) {
    broadcast({ type: 'pulse_batch', spans: spansArray });
}

function broadcastGraph(graphData) {
    broadcast({ type: 'realtime_graph', ...graphData });
}

module.exports = {
    addClient,
    broadcast,
    broadcastPulse,
    broadcastGraph
};
