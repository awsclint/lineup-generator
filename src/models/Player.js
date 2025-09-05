export class Player {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.number = data.number || null;
    this.eligible = {
      P: data.eligible?.P || false,
      C: data.eligible?.C || false,
      '1B': data.eligible?.['1B'] || false,
      '2B': data.eligible?.['2B'] || false,
      '3B': data.eligible?.['3B'] || false,
      SS: data.eligible?.SS || false,
      LF: data.eligible?.LF || false,
      CF: data.eligible?.CF || false,
      RF: data.eligible?.RF || false
    };
    this.availability = {
      startInning: data.availability?.startInning || 1,
      endInning: data.availability?.endInning || 6
    };
    this.pitchingStats = {
      totalPitched: 0,
      currentConsecutivePitched: 0,
      lastPitchedInning: null
    };
  }

  generateId() {
    return 'p_' + Math.random().toString(36).substr(2, 9);
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  get displayName() {
    if (this.number) {
      return `#${this.number} ${this.fullName}`;
    }
    return this.fullName;
  }

  get positionBadges() {
    const badges = [];
    if (this.eligible.P) badges.push({ type: 'P', label: 'P', className: 'badge-pitcher' });
    if (this.eligible.C) badges.push({ type: 'C', label: 'C', className: 'badge-catcher' });
    if (this.eligible['1B']) badges.push({ type: '1B', label: '1B', className: 'badge-infield' });
    if (this.eligible['2B']) badges.push({ type: '2B', label: '2B', className: 'badge-infield' });
    if (this.eligible['3B']) badges.push({ type: '3B', label: '3B', className: 'badge-infield' });
    if (this.eligible.SS) badges.push({ type: 'SS', label: 'SS', className: 'badge-infield' });
    if (this.eligible.LF) badges.push({ type: 'LF', label: 'LF', className: 'badge-outfield' });
    if (this.eligible.CF) badges.push({ type: 'CF', label: 'CF', className: 'badge-outfield' });
    if (this.eligible.RF) badges.push({ type: 'RF', label: 'RF', className: 'badge-outfield' });
    return badges;
  }

  isAvailableForInning(inning) {
    return inning >= this.availability.startInning && inning <= this.availability.endInning;
  }

  canPitchInning(inning) {
    if (!this.eligible.P) return false;
    if (!this.isAvailableForInning(inning)) return false;
    
    // Check consecutive innings limit
    if (this.pitchingStats.currentConsecutivePitched >= 2) return false;
    
    // Check total innings limit
    if (this.pitchingStats.totalPitched >= 3) return false;
    
    return true;
  }

  assignPitching(inning) {
    if (!this.canPitchInning(inning)) return false;
    
    // Update consecutive count
    if (this.pitchingStats.lastPitchedInning === inning - 1) {
      this.pitchingStats.currentConsecutivePitched++;
    } else {
      this.pitchingStats.currentConsecutivePitched = 1;
    }
    
    this.pitchingStats.totalPitched++;
    this.pitchingStats.lastPitchedInning = inning;
    return true;
  }

  removePitching(inning) {
    if (this.pitchingStats.lastPitchedInning === inning) {
      this.pitchingStats.totalPitched--;
      this.pitchingStats.lastPitchedInning = null;
      
      // Recalculate consecutive count
      this.recalculateConsecutivePitching();
    }
  }

  recalculateConsecutivePitching() {
    // This would need to be called when rebalancing to recalculate consecutive counts
    // For now, we'll reset it and let the constraint solver handle it
    this.pitchingStats.currentConsecutivePitched = 0;
  }

  toJSON() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      number: this.number,
      eligible: { ...this.eligible },
      availability: { ...this.availability },
      pitchingStats: { ...this.pitchingStats }
    };
  }

  static fromJSON(data) {
    const player = new Player(data);
    if (data.pitchingStats) {
      player.pitchingStats = { ...data.pitchingStats };
    }
    return player;
  }
}
