import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import FilterBar from './components/FilterBar';
import NodeList from './components/NodeList';
import { usePNodeData } from './hooks/usePNodeData';
import { calculateNetworkHealth } from './utils/helpers';

function App() {
  const [filter, setFilter] = useState('all');
  const [theme, setTheme] = useState('light');
  const [refreshInterval, setRefreshInterval] = useState(30000);
  
  const { nodes, isLoading, error, lastUpdated, refresh } = usePNodeData(refreshInterval);
  
  // Handle theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  // Filter nodes
  const filteredNodes = filter === 'all' 
    ? nodes 
    : nodes.filter(node => node.status === filter);
  
  // Calculate stats
  const stats = calculateNetworkHealth(nodes);
  
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 lg:px-0 py-6 max-w-6xl">
        <Header 
          theme={theme}
          toggleTheme={toggleTheme}
          onRefresh={refresh}
          isLoading={isLoading}
        />
        
        <StatsBar 
          stats={stats}
          lastUpdated={lastUpdated}
          totalNodes={nodes.length}
        />
        
        <FilterBar 
          activeFilter={filter}
          onFilterChange={setFilter}
          stats={stats}
        />
        
        <NodeList 
          nodes={filteredNodes}
          isLoading={isLoading}
          error={error}
        />
        
        <Footer 
          refreshInterval={refreshInterval}
          onRefreshIntervalChange={setRefreshInterval}
        />
      </div>
    </div>
  );
}

// Simple footer component
const Footer = ({ refreshInterval, onRefreshIntervalChange }) => (
  <footer className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
      <div>
        <span className="font-medium">Xandeum Pulse</span>
        <span className="mx-2">•</span>
        <span>Real-time pNode monitoring</span>
      </div>
      
      <div className="flex items-center gap-3">
        <span>Auto-refresh:</span>
        <select
          value={refreshInterval}
          onChange={(e) => onRefreshIntervalChange(Number(e.target.value))}
          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg 
                   border border-gray-300 dark:border-gray-600
                   text-gray-700 dark:text-gray-300
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={10000}>10 seconds</option>
          <option value={30000}>30 seconds</option>
          <option value={60000}>1 minute</option>
          <option value={300000}>5 minutes</option>
        </select>
      </div>
    </div>
    
    <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-500">
      <p>
        Data sourced from Xandeum pRPC • Unofficial monitoring tool
      </p>
      <p className="mt-1">
        Not affiliated with Xandeum • For community use
      </p>
    </div>
  </footer>
);

export default App;