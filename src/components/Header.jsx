import React from 'react';

const Header = ({ currentView, onViewChange }) => {
  return (
    <>
      {/* Header */}
      <header className="header">
        <h1><span style={{ color: '#FFD700', textShadow: '0 0 8px rgba(255, 235, 59, 0.6)' }}>🥎</span> Softball Lineup Generator</h1>
      </header>

      {/* Top Navigation Tabs */}
      <nav className="top-navigation">
        <div className="nav-tabs">
          <button 
            className={`nav-tab ${currentView === 'lineup' ? 'active' : ''}`}
            onClick={() => onViewChange('lineup')}
          >
            Lineup
          </button>
          <button 
            className={`nav-tab ${currentView === 'roster' ? 'active' : ''}`}
            onClick={() => onViewChange('roster')}
          >
            Roster
          </button>
        </div>
      </nav>
    </>
  );
};

export default Header;
