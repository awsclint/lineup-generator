#!/usr/bin/env node

/**
 * Softball Lineup Generator - Demo Script
 * 
 * This script demonstrates the core functionality of the lineup generator
 * by creating a sample roster and generating a lineup.
 */

import { Player } from './src/models/Player.js';
import { GameConfig } from './src/models/GameConfig.js';
import { Lineup } from './src/models/Lineup.js';

console.log('\x1b[33m🥎\x1b[0m Softball Lineup Generator - Demo\n');

// Create sample players
console.log('Creating sample roster...');
const players = [
  new Player({
    firstName: 'Quinn',
    lastName: 'White',
    number: 7,
    eligible: { P: true, C: false, IF: true, OF: true }
  }),
  new Player({
    firstName: 'Viviana',
    lastName: 'Vasquez',
    number: 12,
    eligible: { P: true, C: true, IF: true, OF: true }
  }),
  new Player({
    firstName: 'Norah',
    lastName: 'Epple',
    number: 15,
    eligible: { P: true, C: true, IF: true, OF: true }
  }),
  new Player({
    firstName: 'Aria',
    lastName: 'Moore',
    number: 3,
    eligible: { P: false, C: false, IF: true, OF: true }
  }),
  new Player({
    firstName: 'Isla',
    lastName: 'Kennedy',
    number: 8,
    eligible: { P: false, C: false, IF: false, OF: true }
  }),
  new Player({
    firstName: 'Dylan',
    lastName: 'Reynolds',
    number: 22,
    eligible: { P: false, C: false, IF: false, OF: true }
  }),
  new Player({
    firstName: 'Adalynn',
    lastName: 'Green',
    number: 5,
    eligible: { P: true, C: false, IF: true, OF: false }
  }),
  new Player({
    firstName: 'Ryleigh',
    lastName: 'Green',
    number: 6,
    eligible: { P: false, C: true, IF: false, OF: true }
  }),
  new Player({
    firstName: 'Mary Jo',
    lastName: 'Jimeno',
    number: 11,
    eligible: { P: false, C: true, IF: false, OF: false }
  }),
  new Player({
    firstName: 'Grace',
    lastName: 'Mitchley',
    number: 14,
    eligible: { P: false, C: true, IF: false, OF: false }
  }),
  new Player({
    firstName: 'Reagan',
    lastName: 'Sams',
    number: 9,
    eligible: { P: false, C: false, IF: false, OF: true }
  }),
  new Player({
    firstName: 'Piper',
    lastName: 'Gillingham',
    number: 2,
    eligible: { P: false, C: false, IF: true, OF: true }
  })
];

console.log(`✅ Created ${players.length} players`);
console.log(`Pitchers: ${players.filter(p => p.eligible.P).length}`);
console.log(`Catchers: ${players.filter(p => p.eligible.C).length}`);
console.log(`Infielders: ${players.filter(p => p.eligible.IF).length}`);
console.log(`Outfielders: ${players.filter(p => p.eligible.OF).length}\n`);

// Create game configuration
console.log('Creating game configuration...');
const config = new GameConfig({
  teamName: 'Thunder',
  opponent: 'Lightning',
  date: new Date().toISOString().split('T')[0],
  field: 'Central Park Field 3',
  isHome: true,
  enforcePitcherRules: true,
  minFieldInnings: 3,
  avoidRepeatPositionLimit: 2,
  avoidBackToBackBench: true,
  balancePlayingTime: true
});

console.log(`✅ Game: ${config.teamName} vs ${config.opponent}`);
console.log(`Field: ${config.field}`);
console.log(`Date: ${config.date}`);
console.log(`Home/Away: ${config.isHome ? 'Home' : 'Away'}\n`);

// Generate lineup
console.log('Generating lineup...');
const lineup = new Lineup(players, config);

console.log('✅ Lineup generated successfully!\n');

// Display batting order
console.log('📋 Batting Order:');
lineup.battingOrder.forEach((player, index) => {
  console.log(`${index + 1}. ${player.displayName}`);
});
console.log('');

// Display fielding assignments for first inning
console.log('🏟️ Fielding Assignments - Inning 1:');
const inning1 = lineup.fieldingAssignments[1];
Object.entries(inning1).forEach(([position, player]) => {
  if (position === 'Bench') {
    const benchNames = player.map(p => p.lastName).join(', ');
    console.log(`${position}: ${benchNames || 'Empty'}`);
  } else {
    console.log(`${position}: ${player ? player.lastName : 'Unassigned'}`);
  }
});
console.log('');

// Check for validation issues
console.log('🔍 Validation Check:');
const errors = lineup.getValidationErrors();
const warnings = lineup.getValidationWarnings();

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ No validation issues found');
} else {
  if (errors.length > 0) {
    console.log('❌ Errors:');
    errors.forEach(error => console.log(`  - ${error.message}`));
  }
  if (warnings.length > 0) {
    console.log('⚠️ Warnings:');
    warnings.forEach(warning => console.log(`  - ${warning.message}`));
  }
}
console.log('');

// Display pitching summary
console.log('\x1b[33m🥎\x1b[0m Pitching Summary:');
const pitchers = players.filter(p => p.eligible.P);
pitchers.forEach(pitcher => {
  const stats = pitcher.pitchingStats;
  console.log(`${pitcher.lastName}: ${stats.totalPitched} total, ${stats.currentConsecutivePitched} consecutive`);
});
console.log('');

console.log('🎉 Demo completed successfully!');
console.log('Open http://localhost:3000 in your browser to use the full application.');
