import { Player } from '../models/Player.js';
import { GameConfig } from '../models/GameConfig.js';

export const samplePlayers = [
  new Player({
    firstName: 'Quinn',
    lastName: 'White',
    number: 7,
    eligible: { P: true, C: false, '1B': true, '2B': true, '3B': true, SS: true, LF: true, CF: true, RF: true }
  }),
  new Player({
    firstName: 'Viviana',
    lastName: 'Vasquez',
    number: 12,
    eligible: { P: true, C: true, '1B': true, '2B': true, '3B': true, SS: true, LF: true, CF: true, RF: true }
  }),
  new Player({
    firstName: 'Norah',
    lastName: 'Epple',
    number: 15,
    eligible: { P: true, C: true, '1B': true, '2B': true, '3B': true, SS: true, LF: true, CF: true, RF: true }
  }),
  new Player({
    firstName: 'Aria',
    lastName: 'Moore',
    number: 3,
    eligible: { P: false, C: false, '1B': true, '2B': true, '3B': true, SS: true, LF: true, CF: true, RF: true }
  }),
  new Player({
    firstName: 'Isla',
    lastName: 'Kennedy',
    number: 8,
    eligible: { P: false, C: false, '1B': false, '2B': false, '3B': false, SS: false, LF: true, CF: true, RF: true }
  }),
  new Player({
    firstName: 'Dylan',
    lastName: 'Reynolds',
    number: 22,
    eligible: { P: false, C: false, '1B': false, '2B': false, '3B': false, SS: false, LF: true, CF: true, RF: true }
  }),
  new Player({
    firstName: 'Adalynn',
    lastName: 'Green',
    number: 5,
    eligible: { P: true, C: false, '1B': true, '2B': true, '3B': true, SS: true, LF: false, CF: false, RF: false }
  }),
  new Player({
    firstName: 'Ryleigh',
    lastName: 'Green',
    number: 6,
    eligible: { P: false, C: true, '1B': false, '2B': false, '3B': false, SS: false, LF: true, CF: true, RF: true }
  }),
  new Player({
    firstName: 'Mary Jo',
    lastName: 'Jimeno',
    number: 11,
    eligible: { P: false, C: true, '1B': false, '2B': false, '3B': false, SS: false, LF: false, CF: false, RF: false }
  }),
  new Player({
    firstName: 'Grace',
    lastName: 'Mitchley',
    number: 14,
    eligible: { P: false, C: true, '1B': false, '2B': false, '3B': false, SS: false, LF: false, CF: false, RF: false }
  }),
  new Player({
    firstName: 'Reagan',
    lastName: 'Sams',
    number: 9,
    eligible: { P: false, C: false, '1B': false, '2B': false, '3B': false, SS: false, LF: true, CF: true, RF: true }
  }),
  new Player({
    firstName: 'Piper',
    lastName: 'Gillingham',
    number: 2,
    eligible: { P: false, C: false, '1B': true, '2B': true, '3B': true, SS: true, LF: true, CF: true, RF: true }
  })
];

export const sampleConfig = new GameConfig({
  teamName: 'Thunder',
  opponent: 'Lightning',
  date: new Date().toISOString().split('T')[0],
  field: 'Central Park Field 3',
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

// Example of a player with availability constraints
export const createPlayerWithAvailability = (playerData, startInning, endInning) => {
  const player = new Player(playerData);
  player.availability = { startInning, endInning };
  return player;
};
