import React, { useState, useEffect } from 'react';
import { loadConfig, saveConfig } from '../utils/storageUtils.js';
import { GameConfig } from '../models/GameConfig.js';

const InningBoard = ({ lineup, fieldingAssignments, onUpdateLineup, onRebalance, onToggleLock, players, onExportPDF, onExportCSV, onManageBattingOrders }) => {
  // Debug fielding assignments
  console.log('InningBoard rendered with fieldingAssignments:', fieldingAssignments);
  const [draggedPlayer, setDraggedPlayer] = useState(null);
  const [dragOverPosition, setDragOverPosition] = useState(null);
  const [gameInfo, setGameInfo] = useState({
    teamName: '',
    opponent: '',
    date: '',
    time: '',
    location: ''
  });
  const [showGameInfo, setShowGameInfo] = useState(false);

  // Convert 24-hour time to 12-hour format
  const formatTime12Hour = (time24) => {
    if (!time24 || time24 === 'TBD') return time24;
    
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Load game info on component mount
  useEffect(() => {
    const config = loadConfig();
    if (config) {
      setGameInfo({
        teamName: config.teamName || '',
        opponent: config.opponent || '',
        date: config.date || '',
        time: config.time || '',
        location: config.field || ''
      });
    }
  }, []);

  // Save game info when it changes
  const handleGameInfoChange = (field, value) => {
    const newGameInfo = { ...gameInfo, [field]: value };
    setGameInfo(newGameInfo);
    
    // Save to localStorage using GameConfig
    const existingConfig = loadConfig();
    const configData = existingConfig ? existingConfig.toJSON() : {};
    
    // Map the fields correctly for GameConfig
    const updatedConfigData = {
      ...configData,
      teamName: newGameInfo.teamName,
      opponent: newGameInfo.opponent,
      date: newGameInfo.date,
      time: newGameInfo.time,
      field: newGameInfo.location // Map location to field
    };
    
    const gameConfig = new GameConfig(updatedConfigData);
    saveConfig(gameConfig);
  };

  // Helper function to get display name
  const getDisplayName = (player) => {
    if (!player) return 'Unknown';
    const name = `${player.firstName || 'Unknown'} ${player.lastName ? player.lastName.charAt(0) + '.' : ''}`;
    return player.inactive ? `❌ ${name}` : name;
  };

  // Helper function to get position name
  const getPositionName = (position) => {
    const positionNames = {
      'P': 'PITCHER',
      'C': 'CATCHER',
      '1B': 'FIRST BASE',
      '2B': 'SECOND BASE',
      '3B': 'THIRD BASE',
      'SS': 'SHORTSTOP',
      'LF': 'LEFT FIELD',
      'CF': 'CENTER FIELD',
      'RF': 'RIGHT FIELD',
      'Bench': 'BENCH'
    };
    return positionNames[position] || position;
  };

  // Helper function to get eligible players for a position
  const getEligiblePlayers = (position, inning) => {
    if (!players) return [];
    
    // Get all players already assigned to other positions in this inning
    const assignedPlayerIds = new Set();
    if (fieldingAssignments && fieldingAssignments[inning]) {
      const positions = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF'];
      positions.forEach(pos => {
        if (pos !== position && fieldingAssignments[inning][pos]) {
          assignedPlayerIds.add(fieldingAssignments[inning][pos].id);
        }
      });
    }
    
    return players.filter(player => {
      // Player must be available (not out)
      if (!player.isAvailable()) return false;
      
      // Check if player is eligible for this position
      let isEligible = false;
      
      if (position === 'P') {
        isEligible = player.eligible.P;
      } else if (position === 'C') {
        isEligible = player.eligible.C;
      } else if (['1B', '2B', '3B', 'SS'].includes(position)) {
        isEligible = player.eligible[position];
      } else if (['LF', 'CF', 'RF'].includes(position)) {
        isEligible = player.eligible[position];
      } else if (position === 'Bench') {
        isEligible = true; // All players can be on bench
      }
      
      // Player must be eligible AND not already assigned to another position
      return isEligible && !assignedPlayerIds.has(player.id);
    });
  };

  // Helper function to get current player for a position
  const getCurrentPlayer = (inning, position) => {
    if (!fieldingAssignments || !fieldingAssignments[inning]) {
      return null;
    }
    
    return fieldingAssignments[inning][position];
  };

  // Helper function to handle player change
  const handlePlayerChange = (inning, position, playerId) => {
    if (!onUpdateLineup) return;
    
    // Handle empty selection (when "Select Player" is chosen)
    if (!playerId || playerId === '') {
      onUpdateLineup(inning, position, null);
      return;
    }
    
    const player = players.find(p => p.id === parseInt(playerId) || p.id === playerId);
    if (player) {
      onUpdateLineup(inning, position, player);
    } else {
      console.error('Player not found for ID:', playerId);
    }
  };

  // Helper function to get player position badges for dropdown display
  const getPlayerPositionBadges = (player) => {
    if (!player || !player.eligible) return '';
    
    const badges = [];
    if (player.eligible.P) badges.push('P');
    if (player.eligible.C) badges.push('C');
    if (player.eligible['1B']) badges.push('1B');
    if (player.eligible['2B']) badges.push('2B');
    if (player.eligible['3B']) badges.push('3B');
    if (player.eligible.SS) badges.push('SS');
    if (player.eligible.LF) badges.push('LF');
    if (player.eligible.CF) badges.push('CF');
    if (player.eligible.RF) badges.push('RF');
    
    return badges.length > 0 ? ` (${badges.join(', ')})` : '';
  };

  const positions = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'Bench'];

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="header-left">
          <h2>Fielding Assignments</h2>
          <div className="header-actions">
            <button 
              className="btn btn-primary"
              onClick={onManageBattingOrders}
              title="Save and manage batting orders"
            >
              📋 Manage Lineups
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowGameInfo(!showGameInfo)}
            >
              {showGameInfo ? 'Hide' : '✏️ Edit'} Game Info
            </button>
          </div>
        </div>
        <div className="export-group">
          <span className="export-label">Export:</span>
          <div className="export-buttons">
            <button 
              className="btn btn-primary"
              onClick={onExportPDF}
              title="Export lineup as PDF"
            >
              📄 PDF
            </button>
            <button 
              className="btn btn-primary"
              onClick={onExportCSV}
              title="Export lineup as CSV"
            >
              📊 CSV
            </button>
          </div>
        </div>
      </div>

      {/* Game Info Section */}
      {showGameInfo && (
        <div className="game-info-section">
          <h3>Game Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Team Name:</label>
              <input
                type="text"
                value={gameInfo.teamName}
                onChange={(e) => handleGameInfoChange('teamName', e.target.value)}
                placeholder="Enter team name"
              />
            </div>
            <div className="form-group">
              <label>Opponent:</label>
              <input
                type="text"
                value={gameInfo.opponent}
                onChange={(e) => handleGameInfoChange('opponent', e.target.value)}
                placeholder="Enter opponent name"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                value={gameInfo.date}
                onChange={(e) => handleGameInfoChange('date', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Time:</label>
              <input
                type="time"
                value={gameInfo.time}
                onChange={(e) => handleGameInfoChange('time', e.target.value)}
                style={{ fontFamily: 'monospace' }}
              />
            </div>
            <div className="form-group">
              <label>Location:</label>
              <input
                type="text"
                value={gameInfo.location}
                onChange={(e) => handleGameInfoChange('location', e.target.value)}
                placeholder="Enter field location"
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="inning-board">
        <div className="inning-grid">
          {/* Inning columns */}
          {[1, 2, 3, 4, 5, 6].map(inning => (
            <div key={inning} className="inning-column">
              <div className="inning-header">
                <h3>Inning {inning}</h3>
              </div>
              
              <div className="positions-dropdowns">
                {positions.map(position => {
                  const currentPlayer = getCurrentPlayer(inning, position);
                  const eligiblePlayers = getEligiblePlayers(position, inning);
                  
                  return (
                    <div key={position} className="position-row">
                      {/* Position label above the dropdown/display */}
                      <div className="position-row-label">
                        {getPositionName(position)}
                      </div>
                      
                      {/* Player assignment display */}
                      <div className="position-assignment">
                        {position === 'Bench' ? (
                          // Show bench players as a read-only list
                          <div className="bench-display">
                            <div className="bench-players">
                              {currentPlayer && Array.isArray(currentPlayer) && currentPlayer.length > 0 ? (
                                currentPlayer.map(player => (
                                  <div key={player.id} className="bench-player">
                                    {getDisplayName(player)} #{player.number}
                                  </div>
                                ))
                              ) : (
                                <div className="no-bench-players">No bench players</div>
                              )}
                            </div>
                          </div>
                        ) : (
                          // Regular position dropdown with current player display
                          <div className="position-dropdown-wrapper">
                            {currentPlayer ? (
                              // Show assigned player prominently - clickable to change
                              <div 
                                className="assigned-player-display clickable"
                                onClick={() => handlePlayerChange(inning, position, '')}
                                title="Click to change player"
                              >
                                <div className="assigned-player-name">
                                  {getDisplayName(currentPlayer)} #{currentPlayer.number}
                                </div>
                              </div>
                            ) : (
                              // Show dropdown for unassigned position
                              <select
                                className="position-select"
                                value=""
                                onChange={(e) => handlePlayerChange(inning, position, e.target.value)}
                              >
                                <option value="">-- Select Player --</option>
                                {eligiblePlayers.map(player => (
                                  <option key={player.id} value={player.id}>
                                    {getDisplayName(player)} #{player.number || '?'}{getPlayerPositionBadges(player)}
                                  </option>
                                ))}
                                {position !== 'Bench' && (
                                  <optgroup label="Override (Other Positions)">
                                    {players.filter(player => !eligiblePlayers.includes(player)).map(player => (
                                      <option key={`override-${player.id}`} value={player.id}>
                                        {getDisplayName(player)} #{player.number || '?'} (Override)
                                      </option>
                                    ))}
                                  </optgroup>
                                )}
                              </select>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InningBoard;
