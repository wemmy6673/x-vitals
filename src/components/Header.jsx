import React from 'react';
import { FiRefreshCw, FiSun, FiMoon } from 'react-icons/fi';

const Header = ({ theme, toggleTheme, onRefresh, isLoading }) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center ">

          X-Vitals
          <div className="w-10 h-10 flex items-center justify-center">
            <span className="text-xl">❤️</span>
          </div>
        </h1>
        <p className="text-white mt-2">
          Real-time monitoring of Xandeum pNodes
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="btn-primary flex items-center gap-2 text-white"
        >
          <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>


      </div>
    </header>
  );
};

export default Header;