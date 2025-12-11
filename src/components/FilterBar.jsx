import React from 'react';
import classNames from 'classnames';

const FilterBar = ({ activeFilter, onFilterChange, stats }) => {
  const filters = [
    { id: 'all', label: 'All Nodes', count: stats.total, color: 'gray' },
    { id: 'online', label: '🟢 Online', count: stats.online, color: 'online' },
    { id: 'warning', label: '🟡 Warning', count: stats.warning, color: 'warning' },
    { id: 'offline', label: '🔴 Offline', count: stats.offline, color: 'offline' },
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={classNames(
              'px-4 py-2 rounded-lg font-medium transition-all duration-200',
              'flex items-center gap-2',
              activeFilter === filter.id
                ? filter.id === 'all'
                  ? 'bg-gray-900 dark:bg-gray-700 text-white'
                  : `bg-${filter.color} 
                     text-${filter.color} dark:text-${filter.color}-300 
                     border border-${filter.color}`
                : 'text-white'
            )}
          >
            <span>{filter.label}</span>
            <span className={classNames(
              'px-2 py-0.5 text-xs rounded-full',
              activeFilter === filter.id
                ? ''
                : ''
            )}>
              {filter.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;