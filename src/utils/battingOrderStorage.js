// Batting order storage utilities for saving and managing lineup configurations
import { Player } from '../models/Player.js';
import { GameConfig } from '../models/GameConfig.js';

const STORAGE_KEYS = {
  SAVED_ORDERS: 'softball_saved_batting_orders',
  CURRENT_ORDER: 'softball_current_batting_order'
};

// Save a batting order with a name
export const saveBattingOrder = (name, battingOrder, fieldingAssignments, players, config) => {
  try {
    const savedOrders = getSavedOrders();
    
    const orderData = {
      id: Date.now().toString(),
      name: name.trim(),
      battingOrder: battingOrder.map(player => player.toJSON ? player.toJSON() : player),
      fieldingAssignments: fieldingAssignments,
      players: players.map(player => player.toJSON ? player.toJSON() : player),
      config: config ? (config.toJSON ? config.toJSON() : config) : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Check if name already exists
    const existingIndex = savedOrders.findIndex(order => order.name.toLowerCase() === name.toLowerCase());
    
    if (existingIndex >= 0) {
      // Update existing order
      savedOrders[existingIndex] = orderData;
    } else {
      // Add new order
      savedOrders.push(orderData);
    }
    
    localStorage.setItem(STORAGE_KEYS.SAVED_ORDERS, JSON.stringify(savedOrders));
    console.log(`Batting order "${name}" saved successfully`);
    return { success: true, message: `Batting order "${name}" saved successfully` };
  } catch (error) {
    console.error('Failed to save batting order:', error);
    return { success: false, message: 'Failed to save batting order' };
  }
};

// Get all saved batting orders
export const getSavedOrders = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SAVED_ORDERS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load saved orders:', error);
    return [];
  }
};

// Load a specific batting order
export const loadBattingOrder = (orderId) => {
  try {
    const savedOrders = getSavedOrders();
    const order = savedOrders.find(o => o.id === orderId);
    
    if (!order) {
      return { success: false, message: 'Batting order not found' };
    }
    
    // Convert player data back to Player objects
    const players = order.players.map(playerData => Player.fromJSON(playerData));
    const config = order.config ? new GameConfig(order.config) : null;
    
    // Convert batting order data back to Player objects
    const battingOrder = order.battingOrder.map(playerData => {
      if (typeof playerData === 'object' && playerData.id) {
        return Player.fromJSON(playerData);
      } else if (typeof playerData === 'string') {
        // If it's a player ID, find the player in the players array
        return players.find(p => p.id === playerData);
      }
      return null;
    }).filter(Boolean);
    
    // Convert fielding assignments back to Player objects
    const fieldingAssignments = {};
    if (order.fieldingAssignments) {
      Object.keys(order.fieldingAssignments).forEach(inning => {
        fieldingAssignments[inning] = {};
        Object.keys(order.fieldingAssignments[inning]).forEach(position => {
          const playerRef = order.fieldingAssignments[inning][position];
          if (position === 'Bench' && Array.isArray(playerRef)) {
            // Handle bench array
            fieldingAssignments[inning][position] = playerRef.map(playerData => {
              if (typeof playerData === 'object' && playerData.id) {
                return Player.fromJSON(playerData);
              } else if (typeof playerData === 'string') {
                return players.find(p => p.id === playerData);
              }
              return null;
            }).filter(Boolean);
          } else if (playerRef) {
            // Handle individual position
            if (typeof playerRef === 'object' && playerRef.id) {
              fieldingAssignments[inning][position] = Player.fromJSON(playerRef);
            } else if (typeof playerRef === 'string') {
              fieldingAssignments[inning][position] = players.find(p => p.id === playerRef);
            }
          } else {
            fieldingAssignments[inning][position] = null;
          }
        });
      });
    }
    
    return {
      success: true,
      data: {
        name: order.name,
        battingOrder: battingOrder,
        fieldingAssignments: fieldingAssignments,
        players: players,
        config: config,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }
    };
  } catch (error) {
    console.error('Failed to load batting order:', error);
    return { success: false, message: 'Failed to load batting order' };
  }
};

// Delete a saved batting order
export const deleteBattingOrder = (orderId) => {
  try {
    const savedOrders = getSavedOrders();
    const filteredOrders = savedOrders.filter(order => order.id !== orderId);
    
    localStorage.setItem(STORAGE_KEYS.SAVED_ORDERS, JSON.stringify(filteredOrders));
    console.log(`Batting order ${orderId} deleted successfully`);
    return { success: true, message: 'Batting order deleted successfully' };
  } catch (error) {
    console.error('Failed to delete batting order:', error);
    return { success: false, message: 'Failed to delete batting order' };
  }
};

// Rename a saved batting order
export const renameBattingOrder = (orderId, newName) => {
  try {
    const savedOrders = getSavedOrders();
    const orderIndex = savedOrders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      return { success: false, message: 'Batting order not found' };
    }
    
    // Check if new name already exists
    const nameExists = savedOrders.some(order => 
      order.id !== orderId && order.name.toLowerCase() === newName.toLowerCase()
    );
    
    if (nameExists) {
      return { success: false, message: 'A batting order with this name already exists' };
    }
    
    savedOrders[orderIndex].name = newName.trim();
    savedOrders[orderIndex].updatedAt = new Date().toISOString();
    
    localStorage.setItem(STORAGE_KEYS.SAVED_ORDERS, JSON.stringify(savedOrders));
    console.log(`Batting order renamed to "${newName}"`);
    return { success: true, message: `Batting order renamed to "${newName}"` };
  } catch (error) {
    console.error('Failed to rename batting order:', error);
    return { success: false, message: 'Failed to rename batting order' };
  }
};

// Export batting order as JSON file
export const exportBattingOrder = (orderId) => {
  try {
    const result = loadBattingOrder(orderId);
    if (!result.success) {
      return result;
    }
    
    const exportData = {
      ...result.data,
      exportDate: new Date().toISOString(),
      version: '1.0',
      app: 'Softball Lineup Generator'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `batting-order-${result.data.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    console.log(`Batting order "${result.data.name}" exported successfully`);
    return { success: true, message: `Batting order "${result.data.name}" exported successfully` };
  } catch (error) {
    console.error('Failed to export batting order:', error);
    return { success: false, message: 'Failed to export batting order' };
  }
};

// Import batting order from JSON file
export const importBattingOrder = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          
          // Validate the file format
          if (!data.battingOrder || !Array.isArray(data.battingOrder) || !data.name) {
            throw new Error('Invalid batting order file format');
          }
          
          // Check if name already exists
          const savedOrders = getSavedOrders();
          const nameExists = savedOrders.some(order => 
            order.name.toLowerCase() === data.name.toLowerCase()
          );
          
          if (nameExists) {
            resolve({
              success: false,
              message: 'A batting order with this name already exists. Please rename the file or choose a different name.'
            });
            return;
          }
          
          // Save the imported order
          const result = saveBattingOrder(
            data.name,
            data.battingOrder,
            data.fieldingAssignments || {},
            data.players || [],
            data.config
          );
          
          if (result.success) {
            resolve({
              success: true,
              message: `Batting order "${data.name}" imported successfully`
            });
          } else {
            resolve(result);
          }
        } catch (parseError) {
          console.error('Failed to parse batting order file:', parseError);
          resolve({
            success: false,
            message: 'Invalid batting order file format'
          });
        }
      };
      
      reader.onerror = () => {
        resolve({
          success: false,
          message: 'Failed to read file'
        });
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Failed to import batting order:', error);
      resolve({
        success: false,
        message: 'Failed to process file'
      });
    }
  });
};

// Google Drive integration (placeholder for future implementation)
export const saveToGoogleDrive = async (orderId) => {
  // This would integrate with Google Drive API
  // For now, return a placeholder response
  return {
    success: false,
    message: 'Google Drive integration coming soon! Use export/import for now.'
  };
};

export const loadFromGoogleDrive = async () => {
  // This would integrate with Google Drive API
  // For now, return a placeholder response
  return {
    success: false,
    message: 'Google Drive integration coming soon! Use import for now.'
  };
};
