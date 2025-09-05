import React, { useState } from 'react';

const InningBoard = ({ lineup, fieldingAssignments, onUpdateLineup, onRebalance, onToggleLock, players }) => {
  const [draggedPlayer, setDraggedPlayer] = useState(null);
  const [dragOverPosition, setDragOverPosition] = useState(null);
  const [dragOverInning, setDragOverInning] = useState(null);

  // Helper function to get display name
  const getDisplayName = (player) => {
    if (!player) return 'Unknown';
    return `${player.firstName || 'Unknown'} ${player.lastName ? player.lastName.charAt(0) + '.' : ''}`;
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
    console.log('=== GET CURRENT PLAYER DEBUG ===');
    console.log('Looking for:', { inning, position });
    console.log('Fielding assignments prop:', fieldingAssignments);
    console.log('Inning assignments:', fieldingAssignments?.[inning]);
    console.log('Position assignment:', fieldingAssignments?.[inning]?.[position]);
    
    if (!fieldingAssignments || !fieldingAssignments[inning]) {
      console.log('Returning null - missing data');
      return null;
    }
    
    const result = fieldingAssignments[inning][position];
    console.log('Returning player:', result);
    console.log('=== END DEBUG ===');
    return result;
  };

  // Helper function to handle player change
  const handlePlayerChange = (inning, position, playerId) => {
    if (!onUpdateLineup) return;
    
    // Handle empty selection (when "Select Player" is chosen)
    if (!playerId || playerId === '') {
      onUpdateLineup(inning, position, null);
      return;
    }
    
    const player = players.find(p => p.id === parseInt(playerId));
    if (player) {
      console.log('Calling onUpdateLineup with:', { inning, position, player });
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

  // Drag and drop handlers
  const handleDragStart = (e, player) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      type: 'player',
      player: player
    }));
    setDraggedPlayer(player);
    e.target.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    setDraggedPlayer(null);
    setDragOverPosition(null);
    setDragOverInning(null);
    e.target.classList.remove('dragging');
  };

  const handleDragOver = (e, inning, position) => {
    e.preventDefault();
    setDragOverPosition(position);
    setDragOverInning(inning);
  };

  const handleDragLeave = (e) => {
    // Only clear if we're actually leaving the drop zone
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverPosition(null);
      setDragOverInning(null);
    }
  };

  const handleDrop = (e, inning, position) => {
    e.preventDefault();
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      
      if (data.type === 'player' && data.player) {
        // Check if player is eligible for this position
        const isEligible = checkPlayerEligibility(data.player, position);
        
        if (isEligible) {
          onUpdateLineup(inning, position, data.player);
        } else {
          alert(`${data.player.firstName} ${data.player.lastName} is not eligible for ${getPositionName(position)}`);
        }
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
    
    setDraggedPlayer(null);
    setDragOverPosition(null);
    setDragOverInning(null);
  };

  // Check if player is eligible for a position
  const checkPlayerEligibility = (player, position) => {
    if (!player || !player.eligible) return false;
    
    if (position === 'P') return player.eligible.P;
    if (position === 'C') return player.eligible.C;
    if (['1B', '2B', '3B', 'SS'].includes(position)) return player.eligible[position];
    if (['LF', 'CF', 'RF'].includes(position)) return player.eligible[position];
    if (position === 'Bench') return true; // All players can be on bench
    
    return false;
  };

  const positions = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'Bench'];

  return (
    <div className="panel">
      <h2>Fielding Assignments</h2>
      
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
                  const isDragOver = dragOverPosition === position && dragOverInning === inning;
                  const canDrop = draggedPlayer ? checkPlayerEligibility(draggedPlayer, position) : true;
                  
                  return (
                    <div 
                      key={position} 
                      className={`position-row ${isDragOver ? 'drag-over' : ''} ${!canDrop && draggedPlayer ? 'drop-invalid' : ''}`}
                      onDragOver={(e) => handleDragOver(e, inning, position)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, inning, position)}
                    >
                      {/* Position label above the dropdown/display */}
                      <div className="position-row-label">
                        {getPositionName(position)}
                        {isDragOver && (
                          <div className="drop-preview">
                            <div className="drop-preview-text">
                              {canDrop ? 'Drop here' : 'Not eligible'}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Player assignment display */}
                      <div className="position-assignment">
                        {position === 'Bench' ? (
                          // Show bench players as a read-only list
                          <div className="bench-display">
                            <div className="bench-players">
                              {currentPlayer && Array.isArray(currentPlayer) && currentPlayer.length > 0 ? (
                                currentPlayer.map(player => (
                                  <div 
                                    key={player.id} 
                                    className="bench-player"
                                    draggable="true"
                                    onDragStart={(e) => handleDragStart(e, player)}
                                    onDragEnd={handleDragEnd}
                                  >
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
                              // Show assigned player prominently - clickable to change and draggable
                              <div 
                                className="assigned-player-display clickable"
                                onClick={() => handlePlayerChange(inning, position, '')}
                                title="Click to change player or drag to move"
                                draggable="true"
                                onDragStart={(e) => handleDragStart(e, currentPlayer)}
                                onDragEnd={handleDragEnd}
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
