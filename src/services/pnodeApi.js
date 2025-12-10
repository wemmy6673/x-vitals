import axios from 'axios';

const P_RPC_URL = 'https://pnode.xandeum.network';

// Cache implementation
const cache = {
  data: null,
  timestamp: 0,
  ttl: 30000, // 30 seconds
};

export const fetchPNodes = async () => {
  // Return cached data if valid
  if (cache.data && Date.now() - cache.timestamp < cache.ttl) {
    return cache.data;
  }

  try {
    // TODO: Replace with actual pRPC endpoint and method
    // This is a placeholder - adjust based on actual API
    const response = await axios.post(P_RPC_URL, {
      jsonrpc: '2.0',
      method: 'getClusterNodes',
      id: 1,
      params: []
    });

    const nodes = response.data.result || generateMockData();
    
    // Update cache
    cache.data = nodes;
    cache.timestamp = Date.now();
    
    return nodes;
    
  } catch (error) {
    console.error('pRPC Error:', error.message);
    // Fallback to mock data for development
    return generateMockData();
  }
};

// Mock data generator for development
const generateMockData = () => {
  const nodes = [];
  const nodeCount = 20 + Math.floor(Math.random() * 30); // 20-50 nodes
  
  for (let i = 0; i < nodeCount; i++) {
    const uptime = 70 + Math.random() * 30; // 70-100%
    
    nodes.push({
      id: `Xn${Math.random().toString(36).substr(2, 10).toUpperCase()}`,
      uptime: parseFloat(uptime.toFixed(2)),
      version: `2.${Math.floor(Math.random() * 3)}.${Math.floor(Math.random() * 10)}`,
      stake: Math.floor(Math.random() * 1000000) + 10000,
      lastSeen: Date.now() - Math.floor(Math.random() * 3600000), // Up to 1 hour ago
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      port: 8000 + Math.floor(Math.random() * 1000),
      location: ['US', 'EU', 'ASIA', 'AU'][Math.floor(Math.random() * 4)],
    });
  }
  
  return nodes;
};

// For real implementation:
export const fetchRealPNodes = async () => {
  try {
    const response = await axios.post(P_RPC_URL, {
      jsonrpc: '2.0',
      method: 'getClusterNodes',
      id: 1,
      params: []
    });
    
    if (!response.data) {
      throw new Error('No data received from pRPC');
    }
    
    return response.data.result || response.data;
  } catch (error) {
    throw new Error(`Failed to fetch pNodes: ${error.message}`);
  }
};