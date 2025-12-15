export const processNodeData = async () => {
  try {
    const response = await PNodeApiService.getPodsWithStats();

    if (!response.pods || !Array.isArray(response.pods)) {
      return [];
    }

    // STEP 1: Remove duplicates based on pubkey
    const uniquePods = removeDuplicates(response.pods);

    console.log(`Original: ${response.pods.length} pods, Unique: ${uniquePods.length} pods`);

    // STEP 2: Process unique pods
    return uniquePods.map((pod, index) => ({
      id: pod.pubkey || `node_${index}_${Math.random().toString(36).substr(2, 6)}`,
      shortId: pod.pubkey ? `${pod.pubkey.substring(0, 6)}...${pod.pubkey.substring(pod.pubkey.length - 4)}` : `Unknown_${index}`,
      originalId: pod.pubkey, // Keep original for reference
      uptime: pod.uptime ? parseFloat(pod.uptime) : 0,
      status: getStatusFromUptime(pod.uptime),
      score: calculateHealthScore(pod),
      version: pod.version || '1.0.0',
      stake: pod.stake || 0,
      stakeFormatted: formatStake(pod.stake),
      lastSeen: pod.last_seen ? new Date(pod.last_seen).getTime() : Date.now(),
      lastSeenRelative: getRelativeTime(pod.last_seen ? new Date(pod.last_seen).getTime() : Date.now()),
      location: 'Unknown',
      ip: pod.address ? pod.address.split(':')[0] : 'N/A',
      port: pod.address ? pod.address.split(':')[1] || '8899' : 'N/A',
      storageUsed: pod.storage_used ? formatStorage(pod.storage_used) : '0',
      rawData: pod,
      // Add timestamp to make truly unique if needed
      timestamp: Date.now()
    }));

  } catch (error) {
    console.error('Error processing node data:', error.message);
    return [];
  }
};

// New function to remove duplicates
const removeDuplicates = (pods) => {
  const seen = new Map();
  const uniquePods = [];

  pods.forEach(pod => {
    const pubkey = pod.pubkey;

    if (!pubkey) {
      // If no pubkey, keep as is (might want to handle differently)
      uniquePods.push(pod);
      return;
    }

    if (!seen.has(pubkey)) {
      seen.set(pubkey, true);
      uniquePods.push(pod);
    } else {
      console.warn(`Duplicate node found with pubkey: ${pubkey.substring(0, 12)}...`);
    }
  });

  return uniquePods;
};