import React from 'react';
import classNames from 'classnames';
import { FiActivity, FiBarChart2, FiClock, FiGlobe, FiHardDrive } from 'react-icons/fi';

const NodeCard = ({ node }) => {
  // ... (keep your existing status styling logic)

  return (
    <div className={classNames(
      'rounded-lg p-4 border-l-4',
      statusClasses.bg,
      statusClasses.border,
      'card-hover',
      'border border-gray-200 dark:border-gray-700'
    )}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          {/* ... (keep existing layout) */}

          <div className="flex-1 min-w-0">
            {/* ... (keep existing node ID and copy button) */}

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              {/* Uptime */}
              <div className="flex items-center gap-1">
                <FiActivity className="w-4 h-4" />
                <span className={classNames('font-medium', statusClasses.text)}>
                  {node.uptime.toFixed(1)}%
                </span>
              </div>

              {/* Health Score */}
              <div className="flex items-center gap-1">
                <FiBarChart2 className="w-4 h-4" />
                <span>Score: {node.score}/100</span>
              </div>

              {/* Last Seen */}
              <div className="flex items-center gap-1">
                <FiClock className="w-4 h-4" />
                <span>{node.lastSeenRelative}</span>
              </div>

              {/* Storage Used - NEW FIELD */}
              {node.storageUsed && (
                <div className="flex items-center gap-1">
                  <FiHardDrive className="w-4 h-4" />
                  <span>{node.storageUsed}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ... (keep right side with version and stake) */}
      </div>
    </div>
  );
};

export default NodeCard;