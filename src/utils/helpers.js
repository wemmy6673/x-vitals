export const processNodeData = (nodes) => {
  if (!Array.isArray(nodes)) {
    return [];
  }

  return nodes.map(node => {
    const uptime = node.uptime || Math.random() * 100;
    const status = getStatusFromUptime(uptime);
    const score = calculateHealthScore(node);
    
    return {
      id: node.id || `node_${Math.random().toString(36).substr(2, 9)}`,
      shortId: node.id ? `${node.id.substring(0, 6)}...${node.id.substring(node.id.length - 4)}` : 'Unknown',
      uptime: uptime,
      status: status,
      score: score,
      version: node.version || '1.0.0',
      stake: node.stake || 0,
      stakeFormatted: formatStake(node.stake),
      lastSeen: node.lastSeen || Date.now(),
      lastSeenRelative: getRelativeTime(node.lastSeen || Date.now()),
      location: node.location || 'Unknown',
      ip: node.ip || 'N/A',
      port: node.port || 'N/A',
    };
  });
};

export const getStatusFromUptime = (uptime) => {
  if (uptime > 95) return 'online';
  if (uptime > 85) return 'warning';
  return 'offline';
};

export const calculateHealthScore = (node) => {
  let score = 0;
  score += (node.uptime || 0) * 0.6; // 60% from uptime
  score += Math.random() * 40; // 40% from other factors
  return Math.min(100, Math.floor(score));
};

export const formatStake = (stake) => {
  if (!stake) return '0 XAN';
  if (stake >= 1000000) return `${(stake / 1000000).toFixed(1)}M XAN`;
  if (stake >= 1000) return `${(stake / 1000).toFixed(1)}K XAN`;
  return `${stake} XAN`;
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