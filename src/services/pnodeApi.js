import { PrpcClient } from 'xandeum-prpc';

class PNodeApiService {
  constructor() {
    // Initialize with a seed node IP
    this.client = new PrpcClient('173.212.220.65', { timeout: 10000 });
    this.cache = {
      pods: null,
      timestamp: 0,
      ttl: 30000, // 30 seconds cache
    };
  }

  /**
   * Get all pods with detailed statistics from the network
   */
  async getPodsWithStats() {
    // Check cache first
    if (this.cache.pods && Date.now() - this.cache.timestamp < this.cache.ttl) {
      return this.cache.pods;
    }

    try {
      console.log('Fetching pods with stats from Xandeum network...');
      const response = await this.client.getPodsWithStats();

      // Update cache
      this.cache.pods = response;
      this.cache.timestamp = Date.now();

      console.log(`Successfully fetched ${response.total_count} pods`);
      return response;

    } catch (error) {
      console.error('Failed to fetch pods with stats:', error.message);
      throw new Error(`Network error: ${error.message}`);
    }
  }

  /**
   * Get statistics for a specific node
   */
  async getNodeStats(nodePubkey) {
    try {
      // First, find the node using the helper function
      const node = await PrpcClient.findPNode(nodePubkey, {
        timeout: 8000
      });

      if (!node) {
        throw new Error(`Node ${nodePubkey} not found`);
      }

      // Create a client for the found node
      const nodeClient = new PrpcClient(node.address.split(':')[0]);
      const stats = await nodeClient.getStats();

      return {
        ...stats,
        address: node.address,
        pubkey: nodePubkey
      };

    } catch (error) {
      console.error(`Failed to get stats for node ${nodePubkey}:`, error.message);
      throw error;
    }
  }

  /**
   * Find a specific pNode by its public key
   */
  async findPNode(nodeId, options = {}) {
    try {
      const node = await PrpcClient.findPNode(nodeId, {
        timeout: 8000,
        ...options
      });

      if (!node) {
        throw new Error(`Node ${nodeId} not found in network`);
      }

      return node;
    } catch (error) {
      console.error(`Failed to find node ${nodeId}:`, error.message);
      throw error;
    }
  }

  /**
   * Get just the pod list (without detailed stats)
   */
  async getPods() {
    try {
      const response = await this.client.getPods();
      return response;
    } catch (error) {
      console.error('Failed to fetch pods:', error.message);
      throw error;
    }
  }
}

// Export a singleton instance
export default new PNodeApiService();