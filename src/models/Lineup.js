import { Player } from './Player.js';

export class Lineup {
  constructor(players = [], config = null) {
    this.players = players;
    this.config = config;
    this.battingOrder = [];
    this.fieldingAssignments = {};
    this.lockedInnings = new Set();
    this.history = [];
    this.historyIndex = -1;
    
    this.initializeLineup();
  }

  initializeLineup() {
    // Initialize fielding assignments for all innings
    for (let inning = 1; inning <= 6; inning++) {
      this.fieldingAssignments[inning] = {
        P: null,
        C: null,
        '1B': null,
        '2B': null,
        '3B': null,
        SS: null,
        LF: null,
        CF: null,
        RF: null,
        Bench: []
      };
    }
    
    // Generate initial batting order
    this.generateBattingOrder();
    
    // Generate initial fielding assignments
    this.generateFieldingAssignments();
  }

  generateBattingOrder() {
    // Shuffle available players for batting order
    const availablePlayers = this.players.filter(p => 
      p.isAvailable() && (p.isAvailableForInning(1) || p.isAvailableForInning(2) || p.isAvailableForInning(3) || 
      p.isAvailableForInning(4) || p.isAvailableForInning(5) || p.isAvailableForInning(6))
    );
    
    this.battingOrder = [...availablePlayers].sort(() => Math.random() - 0.5);
  }

  generateFieldingAssignments() {
    // Generate fielding assignments for all innings
    for (let inning = 1; inning <= 6; inning++) {
      this.assignInningFielding(inning);
    }
  }

  assignInningFielding(inning) {
    const availablePlayers = this.players.filter(p => p.isAvailable() && p.isAvailableForInning(inning));
    const positions = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF'];
    const assignedPlayers = new Set();
    
    // Reset pitching stats for this inning
    availablePlayers.forEach(p => {
      if (p.pitchingStats.lastPitchedInning === inning) {
        p.removePitching(inning);
      }
    });

    // Pass 1: Assign pitchers with constraints
    if (this.config?.enforcePitcherRules) {
      const eligiblePitchers = availablePlayers.filter(p => p.canPitchInning(inning));
      if (eligiblePitchers.length > 0) {
        const pitcher = this.selectBestPitcher(eligiblePitchers, inning);
        this.fieldingAssignments[inning].P = pitcher;
        assignedPlayers.add(pitcher.id);
        pitcher.assignPitching(inning);
      }
    }

    // Pass 2: Assign catchers
    const eligibleCatchers = availablePlayers.filter(p => 
      p.eligible.C && !assignedPlayers.has(p.id)
    );
    if (eligibleCatchers.length > 0) {
      const catcher = this.selectBestCatcher(eligibleCatchers, inning);
      this.fieldingAssignments[inning].C = catcher;
      assignedPlayers.add(catcher.id);
    }

    // Pass 3: Fill remaining positions
    const remainingPositions = positions.filter(pos => 
      !this.fieldingAssignments[inning][pos]
    );
    
    remainingPositions.forEach(position => {
      const eligiblePlayers = availablePlayers.filter(p => {
        if (assignedPlayers.has(p.id)) return false;
        
        if (position === '1B' || position === '2B' || position === '3B' || position === 'SS') {
          return p.eligible[position];
        } else if (position === 'LF' || position === 'CF' || position === 'RF') {
          return p.eligible[position];
        }
        return false;
      });

      if (eligiblePlayers.length > 0) {
        const player = this.selectBestPlayerForPosition(eligiblePlayers, position, inning);
        this.fieldingAssignments[inning][position] = player;
        assignedPlayers.add(player.id);
      }
    });

    // Assign remaining players to bench
    const benchPlayers = availablePlayers.filter(p => !assignedPlayers.has(p.id));
    this.fieldingAssignments[inning].Bench = benchPlayers;
  }

  selectBestPitcher(pitchers, inning) {
    // Prioritize pitchers who haven't pitched recently and haven't hit limits
    return pitchers.sort((a, b) => {
      // Prefer pitchers with fewer total innings
      if (a.pitchingStats.totalPitched !== b.pitchingStats.totalPitched) {
        return a.pitchingStats.totalPitched - b.pitchingStats.totalPitched;
      }
      
      // Prefer pitchers with fewer consecutive innings
      if (a.pitchingStats.currentConsecutivePitched !== b.pitchingStats.currentConsecutivePitched) {
        return a.pitchingStats.currentConsecutivePitched - b.pitchingStats.currentConsecutivePitched;
      }
      
      // Random tiebreaker
      return Math.random() - 0.5;
    })[0];
  }

  selectBestCatcher(catchers, inning) {
    // Count how many times each catcher has caught
    const catcherCounts = {};
    for (let i = 1; i <= 6; i++) {
      if (this.fieldingAssignments[i]?.C) {
        const catcherId = this.fieldingAssignments[i].C.id;
        catcherCounts[catcherId] = (catcherCounts[catcherId] || 0) + 1;
      }
    }

    return catchers.sort((a, b) => {
      const aCount = catcherCounts[a.id] || 0;
      const bCount = catcherCounts[b.id] || 0;
      
      if (aCount !== bCount) {
        return aCount - bCount;
      }
      
      // Random tiebreaker
      return Math.random() - 0.5;
    })[0];
  }

  selectBestPlayerForPosition(players, position, inning) {
    // Count how many times each player has played this position
    const positionCounts = {};
    for (let i = 1; i <= 6; i++) {
      if (this.fieldingAssignments[i]?.[position]) {
        const playerId = this.fieldingAssignments[i][position].id;
        positionCounts[playerId] = (positionCounts[playerId] || 0) + 1;
      }
    }

    return players.sort((a, b) => {
      const aCount = positionCounts[a.id] || 0;
      const bCount = positionCounts[b.id] || 0;
      
      if (aCount !== bCount) {
        return aCount - bCount;
      }
      
      // Random tiebreaker
      return Math.random() - 0.5;
    })[0];
  }

  movePlayer(fromInning, fromPosition, toInning, toPosition) {
    this.saveToHistory();
    
    const fromPlayer = this.fieldingAssignments[fromInning][fromPosition];
    const toPlayer = this.fieldingAssignments[toInning][toPosition];
    
    if (!fromPlayer) return false;
    
    // Handle pitcher constraints
    if (fromPosition === 'P') {
      fromPlayer.removePitching(fromInning);
    }
    if (toPosition === 'P') {
      if (!fromPlayer.canPitchInning(toInning)) {
        return false; // Can't move to pitcher position
      }
      fromPlayer.assignPitching(toInning);
    }
    
    // Handle bench arrays
    if (fromPosition === 'Bench') {
      const benchIndex = this.fieldingAssignments[fromInning].Bench.findIndex(p => p.id === fromPlayer.id);
      if (benchIndex !== -1) {
        this.fieldingAssignments[fromInning].Bench.splice(benchIndex, 1);
      }
    }
    if (toPosition === 'Bench') {
      this.fieldingAssignments[toInning].Bench.push(fromPlayer);
    }
    
    // Handle regular positions
    if (fromPosition !== 'Bench') {
      this.fieldingAssignments[fromInning][fromPosition] = null;
    }
    if (toPosition !== 'Bench') {
      this.fieldingAssignments[toInning][toPosition] = fromPlayer;
    }
    
    // Swap players if moving to an occupied position
    if (toPlayer && toPosition !== 'Bench') {
      if (fromPosition === 'Bench') {
        this.fieldingAssignments[fromInning].Bench.push(toPlayer);
      } else {
        this.fieldingAssignments[fromInning][fromPosition] = toPlayer;
      }
    }
    
    return true;
  }

  rebalanceFromInning(startInning) {
    this.saveToHistory();
    
    // Reset pitching stats from start inning onwards
    for (let inning = startInning; inning <= 6; inning++) {
      this.players.forEach(p => {
        if (p.pitchingStats.lastPitchedInning >= startInning) {
          p.removePitching(inning);
        }
      });
    }
    
    // Regenerate fielding assignments from start inning
    for (let inning = startInning; inning <= 6; inning++) {
      this.assignInningFielding(inning);
    }
  }

  saveToHistory() {
    // Remove any history after current index
    this.history = this.history.slice(0, this.historyIndex + 1);
    
    // Save current state
    const currentState = {
      fieldingAssignments: JSON.parse(JSON.stringify(this.fieldingAssignments)),
      battingOrder: [...this.battingOrder],
      lockedInnings: new Set(this.lockedInnings)
    };
    
    this.history.push(currentState);
    this.historyIndex++;
    
    // Limit history size
    if (this.history.length > 50) {
      this.history.shift();
      this.historyIndex--;
    }
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.restoreFromHistory();
    }
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.restoreFromHistory();
    }
  }

  restoreFromHistory() {
    const state = this.history[this.historyIndex];
    this.fieldingAssignments = JSON.parse(JSON.stringify(state.fieldingAssignments));
    this.battingOrder = [...state.battingOrder];
    this.lockedInnings = new Set(state.lockedInnings);
    
    // Recalculate pitching stats
    this.recalculateAllPitchingStats();
  }

  recalculateAllPitchingStats() {
    // Reset all pitching stats
    this.players.forEach(p => {
      p.pitchingStats = {
        totalPitched: 0,
        currentConsecutivePitched: 0,
        lastPitchedInning: null
      };
    });
    
    // Recalculate based on current assignments
    for (let inning = 1; inning <= 6; inning++) {
      const pitcher = this.fieldingAssignments[inning].P;
      if (pitcher) {
        pitcher.assignPitching(inning);
      }
    }
  }

  getValidationErrors() {
    const errors = [];
    
    for (let inning = 1; inning <= 6; inning++) {
      const assignments = this.fieldingAssignments[inning];
      
      // Check for duplicate assignments
      const assignedPlayers = new Set();
      const positions = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF'];
      
      positions.forEach(pos => {
        if (assignments[pos]) {
          if (assignedPlayers.has(assignments[pos].id)) {
            errors.push({
              type: 'error',
              message: `Player ${assignments[pos].displayName} assigned twice in inning ${inning}`,
              inning,
              position: pos
            });
          }
          assignedPlayers.add(assignments[pos].id);
        }
      });
      
      // Check pitcher constraints
      if (this.config?.enforcePitcherRules && assignments.P) {
        const pitcher = assignments.P;
        if (pitcher.pitchingStats.currentConsecutivePitched > 2) {
          errors.push({
            type: 'error',
            message: `Pitcher ${pitcher.displayName} assigned to 3+ consecutive innings`,
            inning,
            position: 'P'
          });
        }
        if (pitcher.pitchingStats.totalPitched > 3) {
          errors.push({
            type: 'error',
            message: `Pitcher ${pitcher.displayName} assigned to more than 3 total innings`,
            inning,
            position: 'P'
          });
        }
      }
    }
    
    return errors;
  }

  getValidationWarnings() {
    const warnings = [];
    
    // Check for players with no fielding time
    this.players.forEach(player => {
      let fieldingInnings = 0;
      for (let inning = 1; inning <= 6; inning++) {
        const assignments = this.fieldingAssignments[inning];
        const positions = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF'];
        
        positions.forEach(pos => {
          if (assignments[pos]?.id === player.id) {
            fieldingInnings++;
          }
        });
      }
      
      if (fieldingInnings === 0 && this.config?.minFieldInnings > 0) {
        warnings.push({
          type: 'warning',
          message: `Player ${player.displayName} has no fielding innings`,
          player: player.id
        });
      }
    });
    
    return warnings;
  }

  toJSON() {
    return {
      players: this.players.map(p => p.toJSON()),
      config: this.config?.toJSON(),
      battingOrder: this.battingOrder.map(p => p.id),
      fieldingAssignments: this.fieldingAssignments,
      lockedInnings: Array.from(this.lockedInnings)
    };
  }

  static fromJSON(data, players, config) {
    const lineup = new Lineup(players, config);
    lineup.battingOrder = players.filter(p => data.battingOrder.includes(p.id));
    lineup.fieldingAssignments = data.fieldingAssignments;
    lineup.lockedInnings = new Set(data.lockedInnings);
    lineup.recalculateAllPitchingStats();
    return lineup;
  }
}
