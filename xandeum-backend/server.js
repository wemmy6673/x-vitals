const express = require('express');
const cors = require('cors');
const { PrpcClient } = require('xandeum-prpc');

const app = express();
app.use(cors());
const PORT = 3001;

// Initialize client with a seed node
const client = new PrpcClient('173.212.220.65', { timeout: 10000 });

// API endpoint to get pods with stats
app.get('/api/pods-with-stats', async (req, res) => {
    try {
        const podsWithStats = await client.getPodsWithStats();
        res.json(podsWithStats);
    } catch (error) {
        console.error('Backend error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// API endpoint to get node stats
app.get('/api/node-stats/:pubkey', async (req, res) => {
    try {
        const node = await PrpcClient.findPNode(req.params.pubkey, { timeout: 8000 });
        if (!node) {
            return res.status(404).json({ error: 'Node not found' });
        }

        const nodeClient = new PrpcClient(node.address.split(':')[0]);
        const stats = await nodeClient.getStats();
        res.json({ ...stats, address: node.address });
    } catch (error) {
        console.error('Backend error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});