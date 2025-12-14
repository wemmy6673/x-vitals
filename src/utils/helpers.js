import PNodeApiService from '../services/pnodeApi';

export const processNodeData = async () => {
  try {
    const response = await PNodeApiService.getPodsWithStats();

    if (!response.pods || !Array.isArray(response.pods)) {
      return [];
    }

    return response.pods.map(pod => ({
      id: pod.pubkey || `node_${Math.random().toString(36).substr(2, 9)}`,
      shortId: pod.pubkey ? `${pod.pubkey.substring(0, 6)}...${pod.pubkey.substring(pod.pubkey.length - 4)}` : 'Unknown',
      uptime: pod.uptime ? parseFloat(pod.uptime) : 0,
      status: getStatusFromUptime(pod.uptime),
      score: calculateHealthScore(pod),
      version: pod.version || '1.0.0',
      stake: pod.stake || 0,
      stakeFormatted: formatStake(pod.stake),
      lastSeen: pod.last_seen ? new Date(pod.last_seen).getTime() : Date.now(),
      lastSeenRelative: getRelativeTime(pod.last_seen ? new Date(pod.last_seen).getTime() : Date.now()),
      location: 'Unknown', // Not available in API
      ip: pod.address ? pod.address.split(':')[0] : 'N/A',
      port: pod.address ? pod.address.split(':')[1] || '8899' : 'N/A',
      storageUsed: pod.storage_used ? formatStorage(pod.storage_used) : '0',
      rawData: pod // Keep original data for reference
    }));

  } catch (error) {
    console.error('Error processing node data:', error.message);
    return []; // Return empty array on error
  }
};

export const getStatusFromUptime = (uptime) => {
  const uptimeValue = parseFloat(uptime) || 0;
  if (uptimeValue > 95) return 'online';
  if (uptimeValue > 85) return 'warning';
  return 'offline';
};

export const calculateHealthScore = (pod) => {
  let score = 0;

  // Uptime contributes 60%
  score += (parseFloat(pod.uptime) || 0) * 0.6;

  // Storage health (if available)
  if (pod.storage_used && pod.storage_capacity) {
    const storageRatio = pod.storage_used / pod.storage_capacity;
    if (storageRatio < 0.8) score += 20; // Good storage usage
    else score += 10; // Moderate storage usage
  }

  // Add some random factor for now (in real app, use more metrics)
  score += Math.random() * 20;

  return Math.min(100, Math.floor(score));
};

export const formatStake = (stake) => {
  if (!stake) return '0 XAN';
  const stakeNum = parseFloat(stake);
  if (stakeNum >= 1000000) return `${(stakeNum / 1000000).toFixed(1)}M XAN`;
  if (stakeNum >= 1000) return `${(stakeNum / 1000).toFixed(1)}K XAN`;
  return `${stakeNum} XAN`;
};

export const formatStorage = (bytes) => {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(2)} MB`;
  if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(2)} KB`;
  return `${bytes} bytes`;
};

export const getRelativeTime = (timestamp) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

export const calculateNetworkHealth = (nodes) => {
  if (!nodes.length) {
    return {
      total: 0,
      online: 0,
      warning: 0,
      offline: 0,
      avgUptime: 0,
      health: 'unknown',
    };
  }

  const total = nodes.length;
  const online = nodes.filter(n => n.status === 'online').length;
  const warning = nodes.filter(n => n.status === 'warning').length;
  const offline = nodes.filter(n => n.status === 'offline').length;
  const avgUptime = nodes.reduce((sum, n) => sum + n.uptime, 0) / total;

  let health = 'excellent';
  if (offline > total * 0.2) health = 'poor';
  else if (offline > total * 0.1) health = 'fair';
  else if (offline > total * 0.05) health = 'good';

  return {
    total,
    online,
    warning,
    offline,
    avgUptime: parseFloat(avgUptime.toFixed(1)),
    health,
  };
};

// New function to get detailed node info
export const getNodeDetails = async (nodeId) => {
  try {
    const stats = await PNodeApiService.getNodeStats(nodeId);
    return {
      id: nodeId,
      uptime: stats.uptime || 0,
      version: stats.version || 'Unknown',
      stake: stats.stake || 0,
      address: stats.address || 'N/A',
      storageUsed: stats.storage_used ? formatStorage(stats.storage_used) : 'N/A',
      storageCapacity: stats.storage_capacity ? formatStorage(stats.storage_capacity) : 'N/A',
      lastSeen: stats.last_seen ? new Date(stats.last_seen).toLocaleString() : 'Unknown',
      status: getStatusFromUptime(stats.uptime),
    };
  } catch (error) {
    console.error(`Failed to get details for node ${nodeId}:`, error);
    return null;
  }
};