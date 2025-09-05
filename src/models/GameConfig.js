export class GameConfig {
  constructor(data = {}) {
    this.teamName = data.teamName || 'Your Team';
    this.opponent = data.opponent || 'Opponent';
    this.date = data.date || new Date().toISOString().split('T')[0];
    this.field = data.field || 'Home Field';
    this.isHome = data.isHome !== undefined ? data.isHome : true;
    this.innings = 6; // Fixed for softball
    
    // Constraint toggles
    this.enforcePitcherRules = data.enforcePitcherRules !== undefined ? data.enforcePitcherRules : true;
    this.minFieldInnings = data.minFieldInnings || 3;
    this.avoidRepeatPositionLimit = data.avoidRepeatPositionLimit || 2;
    this.avoidBackToBackBench = data.avoidBackToBackBench !== undefined ? data.avoidBackToBackBench : true;
    this.balancePlayingTime = data.balancePlayingTime !== undefined ? data.balancePlayingTime : true;
    
    // Premium position limits
    this.maxCatcherInnings = data.maxCatcherInnings || 4;
    this.maxShortstopInnings = data.maxShortstopInnings || 4;
    this.maxFirstBaseInnings = data.maxFirstBaseInnings || 4;
  }

  get battingFirst() {
    return this.isHome;
  }

  get battingLast() {
    return !this.isHome;
  }

  toJSON() {
    return {
      teamName: this.teamName,
      opponent: this.opponent,
      date: this.date,
      field: this.field,
      isHome: this.isHome,
      innings: this.innings,
      enforcePitcherRules: this.enforcePitcherRules,
      minFieldInnings: this.minFieldInnings,
      avoidRepeatPositionLimit: this.avoidRepeatPositionLimit,
      avoidBackToBackBench: this.avoidBackToBackBench,
      balancePlayingTime: this.balancePlayingTime,
      maxCatcherInnings: this.maxCatcherInnings,
      maxShortstopInnings: this.maxShortstopInnings,
      maxFirstBaseInnings: this.maxFirstBaseInnings
    };
  }

  static fromJSON(data) {
    return new GameConfig(data);
  }

  static getDefaultConfig() {
    return new GameConfig({
      teamName: 'Your Team',
      opponent: 'Opponent',
      date: new Date().toISOString().split('T')[0],
      field: 'Home Field',
      isHome: true,
      enforcePitcherRules: true,
      minFieldInnings: 3,
      avoidRepeatPositionLimit: 2,
      avoidBackToBackBench: true,
      balancePlayingTime: true,
      maxCatcherInnings: 4,
      maxShortstopInnings: 4,
      maxFirstBaseInnings: 4
    });
  }
}
