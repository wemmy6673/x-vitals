import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

class PNodeApiService {
  constructor() {
    this.cache = {
      pods: null,
      timestamp: 0,
      ttl: 30000,
    };
  }

  async getPodsWithStats() {
    if (this.cache.pods && Date.now() - this.cache.timestamp < this.cache.ttl) {
      return this.cache.pods;
    }

    try {
      console.log('Fetching pods from backend API...');
      const response = await axios.get(`${API_BASE_URL}/pods-with-stats`);

      this.cache.pods = response.data;
      this.cache.timestamp = Date.now();

      console.log(`Successfully fetched ${response.data.total_count} pods`);
      return response.data;

    } catch (error) {
      console.error('Failed to fetch pods:', error.message);
      // Fallback to mock data for development
      return this.getMockData();
    }
  }

  // Keep your other methods but update to use backend endpoints
  async getNodeStats(nodePubkey) {
    try {
      const response = await axios.get(`${API_BASE_URL}/node-stats/${nodePubkey}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get stats for node ${nodePubkey}:`, error.message);
      throw error;
    }
  }

  // Mock data fallback
  getMockData() {
    // Your existing mock data generator
    const nodes = [];
    const nodeCount = 20 + Math.floor(Math.random() * 30);

    for (let i = 0; i < nodeCount; i++) {
      const uptime = 70 + Math.random() * 30;

      nodes.push({
        pubkey: `Xn${Math.random().toString(36).substr(2, 10).toUpperCase()}`,
        uptime: parseFloat(uptime.toFixed(2)),
        version: `2.${Math.floor(Math.random() * 3)}.${Math.floor(Math.random() * 10)}`,
        stake: Math.floor(Math.random() * 1000000) + 10000,
        last_seen: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
        address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}:8899`,
        storage_used: Math.floor(Math.random() * 1000000000),
        storage_capacity: Math.floor(Math.random() * 2000000000) + 1000000000,
      });
    }

    return {
      total_count: nodes.length,
      pods: nodes
    };
  }
}

export default new PNodeApiService();