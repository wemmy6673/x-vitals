import React from 'react';
import NodeCard from './NodeCard';
import { FiAlertCircle, FiLoader } from 'react-icons/fi';

const NodeList = ({ nodes, isLoading, error }) => {
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 
                    rounded-xl p-8 text-center">
        <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
          Failed to load nodes
        </h3>
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <p className="text-sm text-red-500 dark:text-red-400 mt-2">
          Please check your connection and try again
        </p>
      </div>
    );
  }

  if (isLoading && nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FiLoader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Loading pNodes...</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          Fetching data from Xandeum network
        </p>
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No nodes found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try changing your filter or refresh the page
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {nodes.map(node => (
        <NodeCard key={node.id} node={node} />
      ))}
    </div>
  );
};

export default NodeList;