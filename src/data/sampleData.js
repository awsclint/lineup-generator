import { Player } from '../models/Player.js';
import { GameConfig } from '../models/GameConfig.js';

export const samplePlayers = [
  new Player({
    firstName: 'Sarah',
    lastName: 'Smith',
    number: 1,
    eligible: { P: true, C: false, '1B': true, '2B': true, '3B': true, SS: true, LF: false, CF: false, RF: false }
  }),
  new Player({
    firstName: 'Jessica',
    lastName: 'Johnson',
    number: 2,
    eligible: { P: true, C: false, '1B': true, '2B': true, '3B': true, SS: true, LF: false, CF: false, RF: false }
  }),
  new Player({
    firstName: 'Ashley',
    lastName: 'Williams',
    number: 3,
    eligible: { P: true, C: true, '1B': true, '2B': true, '3B': true, SS: true, LF: false, CF: false, RF: false }
  }),
  new Player({
    firstName: 'Emily',
    lastName: 'Brown',
    number: 4,
    eligible: { P: false, C: true, '1B': true, '2B': true, '3B': true, SS: true, LF: true, CF: true, RF: true }
  }),
  new Player({
    firstName: 'Amanda',
    lastName: 'Jones',
    number: 5,
    eligible: { P: true, C: false, '1B': true, '2B': true, '3B': true, SS: true, LF: false, CF: false, RF: false }
  }),
  new Player({
    firstName: 'Samantha',
    lastName: 'Garcia',
    number: 6,
    eligible: { P: false, C: true, '1B': false, '2B': false, '3B': false, SS: false, LF: true, CF: true, RF: true }
  }),
  new Player({
    firstName: 'Jennifer',
    lastName: 'Miller',
    number: 7,
    eligible: { P: false, C: false, '1B': true, '2B': true, '3B': true, SS: true, LF: true, CF: true, RF: true }
  }),
  new Player({
    firstName: 'Nicole',
    lastName: 'Davis',
    number: 8,
    eligible: { P: false, C: false, '1B': true, '2B': true, '3B': true, SS: true, LF: true, CF: true, RF: true }
  }),
  new Player({
    firstName: 'Elizabeth',
    lastName: 'Rodriguez',
    number: 9,
    eligible: { P: false, C: true, '1B': false, '2B': false, '3B': false, SS: false, LF: true, CF: true, RF: true }
  }),
  new Player({
    firstName: 'Stephanie',
    lastName: 'Martinez',
    number: 10,
    eligible: { P: false, C: true, '1B': false, '2B': false, '3B': false, SS: false, LF: true, CF: true, RF: true }
  }),
  new Player({
    firstName: 'Lauren',
    lastName: 'Hernandez',
    number: 11,
    eligible: { P: false, C: false, '1B': true, '2B': true, '3B': true, SS: true, LF: true, CF: true, RF: true }
  }),
  new Player({
    firstName: 'Michelle',
    lastName: 'Lopez',
    number: 12,
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
