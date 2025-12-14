import { useState, useEffect, useCallback } from 'react';
import { processNodeData, calculateNetworkHealth } from '../utils/helpers';

export const usePNodeData = (refreshInterval = 30000) => {
  const [nodes, setNodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadNodes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const processedNodes = await processNodeData();
      setNodes(processedNodes);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'Failed to load pNodes from network');
      console.error('Failed to load pNodes:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNodes();

    const interval = setInterval(loadNodes, refreshInterval);
    return () => clearInterval(interval);
  }, [loadNodes, refreshInterval]);

  const stats = calculateNetworkHealth(nodes);

  return {
    nodes,
    isLoading,
    error,
    lastUpdated,
    stats,
    refresh: loadNodes,
  };
};