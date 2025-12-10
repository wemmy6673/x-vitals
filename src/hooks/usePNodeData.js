import { useState, useEffect, useCallback } from 'react';
import { fetchPNodes } from '../services/pnodeApi';
import { processNodeData } from '../utils/helpers';

export const usePNodeData = (refreshInterval = 30000) => {
  const [nodes, setNodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadNodes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchPNodes();
      const processedNodes = processNodeData(data);
      setNodes(processedNodes);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
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

  return {
    nodes,
    isLoading,
    error,
    lastUpdated,
    refresh: loadNodes,
  };
};