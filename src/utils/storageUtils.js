// Local storage utilities for persisting app data
import { Player } from '../models/Player.js';
import { GameConfig } from '../models/GameConfig.js';

const STORAGE_KEYS = {
  PLAYERS: 'softball_lineup_players',
  LINEUP: 'softball_lineup_current',
  CONFIG: 'softball_lineup_config',
  LAST_SAVED: 'softball_lineup_last_saved'
};

// Save players to localStorage
export const savePlayers = (players) => {
  try {
    const playersData = players.map(player => player.toJSON());
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(playersData));
    localStorage.setItem(STORAGE_KEYS.LAST_SAVED, new Date().toISOString());
    console.log('Players saved to localStorage');
    return true;
  } catch (error) {
    console.error('Failed to save players:', error);
    return false;
  }
};

// Load players from localStorage
export const loadPlayers = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PLAYERS);
    if (!stored) return null;
    
    const playersData = JSON.parse(stored);
    const players = playersData.map(data => Player.fromJSON(data));
    console.log('Players loaded from localStorage');
    return players;
  } catch (error) {
    console.error('Failed to load players:', error);
    return null;
  }
};

// Save lineup to localStorage
export const saveLineup = (lineup) => {
  try {
    if (!lineup) return false;
    
    // Check if lineup has toJSON method
    if (typeof lineup.toJSON !== 'function') {
      console.error('Lineup object does not have toJSON method:', lineup);
      return false;
    }
    
    const lineupData = lineup.toJSON();
    localStorage.setItem(STORAGE_KEYS.LINEUP, JSON.stringify(lineupData));
    localStorage.setItem(STORAGE_KEYS.LAST_SAVED, new Date().toISOString());
    console.log('Lineup saved to localStorage');
    return true;
  } catch (error) {
    console.error('Failed to save lineup:', error);
    return false;
  }
};

// Load lineup from localStorage
export const loadLineup = (players, config) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LINEUP);
    if (!stored || !players) return null;
    
    const lineupData = JSON.parse(stored);
    // Note: This would need to be implemented in the Lineup class
    // For now, we'll return the data and let the parent handle reconstruction
    console.log('Lineup data loaded from localStorage');
    return lineupData;
  } catch (error) {
    console.error('Failed to load lineup:', error);
    return null;
  }
};

// Save game config to localStorage
export const saveConfig = (config) => {
  try {
    if (!config) return false;
    
    const configData = config.toJSON();
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(configData));
    localStorage.setItem(STORAGE_KEYS.LAST_SAVED, new Date().toISOString());
    console.log('Config saved to localStorage');
    return true;
  } catch (error) {
    console.error('Failed to save config:', error);
    return false;
  }
};

// Load game config from localStorage
export const loadConfig = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (!stored) return null;
    
    const configData = JSON.parse(stored);
    const config = new GameConfig(configData);
    console.log('Config loaded from localStorage');
    return config;
  } catch (error) {
    console.error('Failed to load config:', error);
    return null;
  }
};

// Clear all stored data
export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('All data cleared from localStorage');
    return true;
  } catch (error) {
    console.error('Failed to clear data:', error);
    return false;
  }
};

// Get last saved timestamp
export const getLastSaved = () => {
  try {
    const timestamp = localStorage.getItem(STORAGE_KEYS.LAST_SAVED);
    return timestamp ? new Date(timestamp) : null;
  } catch (error) {
    console.error('Failed to get last saved timestamp:', error);
    return null;
  }
};

// Check if data exists in localStorage
export const hasStoredData = () => {
  return localStorage.getItem(STORAGE_KEYS.PLAYERS) !== null;
};

// Export all data as a backup
export const exportAllData = () => {
  try {
    const data = {
      players: loadPlayers(),
      lineup: loadLineup(),
      config: loadConfig(),
      lastSaved: getLastSaved(),
      exportDate: new Date().toISOString()
    };
    
    return data;
  } catch (error) {
    console.error('Failed to export data:', error);
    return null;
  }
};

// Import data from backup
export const importAllData = (data) => {
  try {
    if (data.players) {
      savePlayers(data.players);
    }
    if (data.config) {
      saveConfig(data.config);
    }
    if (data.lineup) {
      localStorage.setItem(STORAGE_KEYS.LINEUP, JSON.stringify(data.lineup));
    }
    
    console.log('Data imported successfully');
    return true;
  } catch (error) {
    console.error('Failed to import data:', error);
    return false;
  }
};

// Export roster as downloadable file
export const exportRoster = (players, config = null) => {
  try {
    const exportData = {
      players: players.map(player => player.toJSON()),
      config: config ? config.toJSON() : null,
      exportDate: new Date().toISOString(),
      version: '1.0',
      app: 'Softball Lineup Generator'
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `softball-roster-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    console.log('Roster exported successfully');
    return true;
  } catch (error) {
    console.error('Failed to export roster:', error);
    return false;
  }
};

// Import roster from file
export const importRoster = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          
          // Validate the file format
          if (!data.players || !Array.isArray(data.players)) {
            throw new Error('Invalid roster file format');
          }
          
          // Convert player data to Player objects
          const importedPlayers = data.players.map(playerData => Player.fromJSON(playerData));
          
          // Save imported players
          savePlayers(importedPlayers);
          
          // Import config if available
          if (data.config) {
            const config = new GameConfig(data.config);
            saveConfig(config);
          }
          
          console.log('Roster imported successfully');
          resolve({
            success: true,
            players: importedPlayers,
            config: data.config ? new GameConfig(data.config) : null,
            message: `Successfully imported ${importedPlayers.length} players`
          });
        } catch (parseError) {
          console.error('Failed to parse roster file:', parseError);
          reject({
            success: false,
            message: 'Invalid roster file format'
          });
        }
      };
      
      reader.onerror = () => {
        reject({
          success: false,
          message: 'Failed to read file'
        });
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Failed to import roster:', error);
      reject({
        success: false,
        message: 'Failed to process file'
      });
    }
  });
};

// Validate roster file format
export const validateRosterFile = (file) => {
  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          
          // Check if it's a valid roster file
          const isValid = data.players && 
                         Array.isArray(data.players) && 
                         data.app === 'Softball Lineup Generator';
          
          resolve({
            valid: isValid,
            message: isValid ? 'Valid roster file' : 'Invalid roster file format'
          });
        } catch (error) {
          resolve({
            valid: false,
            message: 'Invalid JSON file'
          });
        }
      };
      
      reader.onerror = () => {
        resolve({
          valid: false,
          message: 'Failed to read file'
        });
      };
      
      reader.readAsText(file);
    } catch (error) {
      resolve({
        valid: false,
        message: 'Failed to process file'
      });
    }
  });
};
