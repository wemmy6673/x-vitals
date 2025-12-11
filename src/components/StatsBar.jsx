import React from 'react';
import { FiCheckCircle, FiAlertTriangle, FiXCircle, FiTrendingDown } from 'react-icons/fi';
import { FaCircleNodes } from "react-icons/fa6";

const StatsBar = ({ stats, lastUpdated, totalNodes }) => {
  const healthConfig = {
    excellent: { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30', icon: FiCheckCircle },
    good: { color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', icon: FiCheckCircle },
    fair: { color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: FiAlertTriangle },
    poor: { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', icon: FiXCircle },
    unknown: { color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-800', icon: FiAlertTriangle },
  };

  const health = healthConfig[stats.health] || healthConfig.unknown;
  const HealthIcon = health.icon;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-transparent rounded-xl px-4 py-8 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white">Total Nodes</p>
            <p className="text-2xl font-bold text-white">
              {totalNodes}
            </p>
          </div>
          <div className="p-2 rounded-full">
            <FaCircleNodes className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-transparent rounded-xl px-4 py-8 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white">Avg Uptime</p>
            <p className="text-2xl font-bold text-white">
              {stats.avgUptime.toFixed(1)}%
            </p>
          </div>
          <div className="p-2 rounded-full">
            <FiCheckCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-transparent rounded-xl px-4 py-8 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white">Network Health</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-white">
                {stats.health.charAt(0).toUpperCase() + stats.health.slice(1)}
              </p>
              <HealthIcon className={`w-5 h-5 ${health.color}`} />
            </div>
          </div>
          <div className={`p-2 rounded-full ${health.bg}`}>
            <div className={`w-6 h-6 rounded-full ${health.color}`} />
          </div>
        </div>
      </div>

      <div className="bg-transparent rounded-xl px-4 py-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white">Last Updated</p>
            <p className="text-2xl font-bold text-white">
              {lastUpdated ? lastUpdated.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              }) : '--:--'}
            </p>
          </div>
          <div className="text-xs text-white">
            {lastUpdated ? 'just now' : 'never'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;