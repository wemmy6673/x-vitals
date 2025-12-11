import React from 'react';
import classNames from 'classnames';
import { FiActivity, FiBarChart2, FiClock, FiGlobe } from 'react-icons/fi';

const NodeCard = ({ node }) => {
  const getStatusClasses = (status) => {
    switch (status) {
      case 'online':
        return {
          bg: 'bg-online-light',
          border: 'border-online',
          dot: 'status-online',
          text: 'text-online',
        };
      case 'warning':
        return {
          bg: 'bg-warning-light',
          border: 'border-warning',
          dot: 'status-warning',
          text: 'text-warning',
        };
      case 'offline':
      default:
        return {
          bg: 'bg-offline-light',
          border: 'border-offline',
          dot: 'status-offline',
          text: 'text-offline',
        };
    }
  };

  const statusClasses = getStatusClasses(node.status);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(node.id);
  };

  return (
    <div className={classNames(
      'rounded-lg p-4 border-l-4',
      statusClasses.bg,
      statusClasses.border,
      'card-hover',
      ''
    )}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 pt-1">
            <div className={classNames(
              'w-3 h-3 rounded-full animate-pulse text-white',
              statusClasses.dot
            )} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <code className="font-mono text-sm font-semibold dark:text-white">
                {node.shortId}
              </code>
              <button
                onClick={copyToClipboard}
                className="text-white   flex-shrink-0"
                title="Copy Node ID"
              >
                ⎘
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-white">
              <div className="flex items-center gap-1">
                <FiActivity className="w-4 h-4" />
                <span className={classNames('font-medium', statusClasses.text)}>
                  {node.uptime.toFixed(1)}%
                </span>
              </div>

              <div className="flex items-center gap-1">
                <FiBarChart2 className="w-4 h-4" />
                <span>Score: {node.score}/100</span>
              </div>

              <div className="flex items-center gap-1">
                <FiClock className="w-4 h-4" />
                <span>{node.lastSeenRelative}</span>
              </div>

              <div className="flex items-center gap-1">
                <FiGlobe className="w-4 h-4" />
                <span>{node.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-right">
            <div className="text-xs text-white mb-1">
              Version
            </div>
            <div className="font-mono text-sm text-white font-medium">
              v{node.version}
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <div className="text-xs text-white mb-1">
              Stake
            </div>
            <div className="text-sm text-white font-medium">
              {node.stakeFormatted}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeCard;