import React from 'react';

const RosterPanel = ({ players, onManageRoster, onShowConfig }) => {
  const getPositionCounts = () => {
    const counts = { P: 0, C: 0, '1B': 0, '2B': 0, '3B': 0, SS: 0, LF: 0, CF: 0, RF: 0 };
    players.forEach(player => {
      if (player.eligible.P) counts.P++;
      if (player.eligible.C) counts.C++;
      if (player.eligible['1B']) counts['1B']++;
      if (player.eligible['2B']) counts['2B']++;
      if (player.eligible['3B']) counts['3B']++;
      if (player.eligible.SS) counts.SS++;
      if (player.eligible.LF) counts.LF++;
      if (player.eligible.CF) counts.CF++;
      if (player.eligible.RF) counts.RF++;
    });
    return counts;
  };

  const positionCounts = getPositionCounts();

  return (
    <div className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Roster Summary</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn btn-primary btn-sm"
            onClick={onManageRoster}
          >
            Manage Roster
          </button>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onShowConfig}
          >
            Settings
          </button>
        </div>
      </div>

      <div className="roster-summary">
        <div className="summary-stats">
          <div className="stat-item">
            <div className="stat-number">{players.length}</div>
            <div className="stat-label">Total Players</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{positionCounts.P}</div>
            <div className="stat-label">Pitchers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{positionCounts.C}</div>
            <div className="stat-label">Catchers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{positionCounts['1B'] + positionCounts['2B'] + positionCounts['3B'] + positionCounts.SS}</div>
            <div className="stat-label">Infielders</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{positionCounts.LF + positionCounts.CF + positionCounts.RF}</div>
            <div className="stat-label">Outfielders</div>
          </div>
        </div>

        <div className="player-list-preview">
          <h4>Players</h4>
          <div className="player-preview-grid">
            {players.slice(0, 6).map((player) => (
              <div key={player.id} className="player-preview">
                <div className="player-preview-name">
                  {player.firstName} {player.lastName.charAt(0)}.
                </div>
                {player.number && (
                  <div className="player-preview-number">#{player.number}</div>
                )}
                <div className="player-preview-positions">
                  {player.positionBadges.slice(0, 2).map((badge, idx) => (
                    <span key={idx} className={`badge ${badge.className}`}>
                      {badge.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {players.length > 6 && (
            <div className="more-players">
              +{players.length - 6} more players
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RosterPanel;
