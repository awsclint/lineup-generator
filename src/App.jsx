import React, { useState, useEffect } from 'react';
import './App.css';
import { Lineup } from './models/Lineup.js';
import { Player } from './models/Player.js';
import Header from './components/Header.jsx';
import RosterManagement from './components/RosterManagement';
import BattingOrderPanel from './components/BattingOrderPanel.jsx';
import InningBoard from './components/InningBoard.jsx';
import StatusBar from './components/StatusBar.jsx';
import BattingOrderManager from './components/BattingOrderManager.jsx';
import { exportToPDF, exportToCSV } from './utils/exportUtils.js';
import { 
  savePlayers, 
  loadPlayers, 
  saveLineup, 
  loadLineup, 
  saveConfig, 
  loadConfig, 
  hasStoredData,
  getLastSaved,
  exportRoster,
  importRoster,
  validateRosterFile
} from './utils/storageUtils.js';

function App() {
  const [currentView, setCurrentView] = useState('lineup');
  
  // Initialize players from localStorage or use default sample data
  const [players, setPlayers] = useState(() => {
    const storedPlayers = loadPlayers();
    if (storedPlayers && storedPlayers.length > 0) {
      console.log('Loaded players from localStorage');
      return storedPlayers;
    }
    
    // Default sample players if no stored data
    console.log('Using default sample players');
    return [
      new Player({
        id: 1,
        firstName: 'Sarah',
        lastName: 'Smith',
        number: 1,
        eligible: { P: true, C: false, '1B': true, '2B': true, '3B': true, SS: true, LF: false, CF: false, RF: false },
        availability: { startInning: 1, endInning: 6 }
      }),
      new Player({
        id: 2,
        firstName: 'Jessica',
        lastName: 'Johnson',
        number: 2,
        eligible: { P: true, C: false, '1B': true, '2B': true, '3B': true, SS: true, LF: false, CF: false, RF: false },
        availability: { startInning: 1, endInning: 6 }
      }),
      new Player({
        id: 3,
        firstName: 'Ashley',
        lastName: 'Williams',
        number: 3,
        eligible: { P: true, C: true, '1B': true, '2B': true, '3B': true, SS: true, LF: false, CF: false, RF: false },
        availability: { startInning: 1, endInning: 6 }
      }),
      new Player({
        id: 4,
        firstName: 'Emily',
        lastName: 'Brown',
        number: 4,
        eligible: { P: false, C: true, '1B': true, '2B': true, '3B': true, SS: true, LF: true, CF: true, RF: true },
        availability: { startInning: 1, endInning: 6 }
      }),
      new Player({
        id: 5,
        firstName: 'Amanda',
        lastName: 'Jones',
        number: 5,
        eligible: { P: true, C: false, '1B': true, '2B': true, '3B': true, SS: true, LF: false, CF: false, RF: false },
        availability: { startInning: 1, endInning: 6 }
      }),
      new Player({
        id: 6,
        firstName: 'Samantha',
        lastName: 'Garcia',
        number: 6,
        eligible: { P: false, C: true, '1B': false, '2B': false, '3B': false, SS: false, LF: true, CF: true, RF: true },
        availability: { startInning: 1, endInning: 6 }
      }),
      new Player({
        id: 7,
        firstName: 'Jennifer',
        lastName: 'Miller',
        number: 7,
        eligible: { P: false, C: false, '1B': true, '2B': true, '3B': true, SS: true, LF: true, CF: true, RF: true },
        availability: { startInning: 1, endInning: 6 }
      }),
      new Player({
        id: 8,
        firstName: 'Nicole',
        lastName: 'Davis',
        number: 8,
        eligible: { P: false, C: false, '1B': true, '2B': true, '3B': true, SS: true, LF: true, CF: true, RF: true },
        availability: { startInning: 1, endInning: 6 }
      }),
      new Player({
        id: 9,
        firstName: 'Elizabeth',
        lastName: 'Rodriguez',
        number: 9,
        eligible: { P: false, C: true, '1B': false, '2B': false, '3B': false, SS: false, LF: true, CF: true, RF: true },
        availability: { startInning: 1, endInning: 6 }
      }),
      new Player({
        id: 10,
        firstName: 'Stephanie',
        lastName: 'Martinez',
        number: 10,
        eligible: { P: false, C: true, '1B': false, '2B': false, '3B': false, SS: false, LF: true, CF: true, RF: true },
        availability: { startInning: 1, endInning: 6 }
      }),
      new Player({
        id: 11,
        firstName: 'Lauren',
        lastName: 'Hernandez',
        number: 11,
        eligible: { P: false, C: false, '1B': true, '2B': true, '3B': true, SS: true, LF: true, CF: true, RF: true },
        availability: { startInning: 1, endInning: 6 }
      })
    ];
  });

  // Initialize fielding assignments state
  const [fieldingAssignments, setFieldingAssignments] = useState(() => {
    const assignments = {};
    for (let inning = 1; inning <= 6; inning++) {
      assignments[inning] = {
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
    return assignments;
  });

  const [lineup, setLineup] = useState(() => {
    const initialLineup = new Lineup(players);
    return initialLineup;
  });

  // Auto-save players when they change
  useEffect(() => {
    if (players && players.length > 0) {
      savePlayers(players);
    }
  }, [players]);

  // Auto-save lineup when it changes
  useEffect(() => {
    if (lineup) {
      saveLineup(lineup);
    }
  }, [lineup]);

  // State for showing save status
  const [lastSaved, setLastSaved] = useState(null);
  
  // State for batting order manager
  const [showBattingOrderManager, setShowBattingOrderManager] = useState(false);

  // Update last saved time when data is saved
  useEffect(() => {
    const saved = getLastSaved();
    if (saved) {
      setLastSaved(saved);
    }
  }, [players, lineup]);

  const handleAddPlayer = (player) => {
    setPlayers(prev => [...prev, new Player({ ...player, id: Date.now() })]);
  };

  const handleUpdatePlayer = (updatedPlayer) => {
    setPlayers(prev => prev.map(p => p.id === updatedPlayer.id ? new Player(updatedPlayer) : p));
  };

  const handleRemovePlayer = (playerId) => {
    setPlayers(prev => prev.filter(p => p.id !== playerId));
  };

  const handleManageRoster = () => {
    setCurrentView('roster');
  };

  const handleBackToLineup = () => {
    setCurrentView('lineup');
  };

  const handleUpdateLineup = (inning, position, player) => {
    try {
      console.log('=== UPDATE LINEUP DEBUG ===');
      console.log('Input:', { inning, position, player });
      console.log('Current fielding assignments:', fieldingAssignments);
      
      // Create a completely new object to ensure React detects the change
      setFieldingAssignments(prev => {
        // Create a deep copy of the entire structure
        const updated = {};
        
        // Copy all innings
        for (let i = 1; i <= 6; i++) {
          updated[i] = {};
          
          // Copy all positions for this inning
          const positions = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'Bench'];
          positions.forEach(pos => {
            if (i === inning && pos === position) {
              // This is the position we're updating
              updated[i][pos] = player;
            } else {
              // Copy existing value
              updated[i][pos] = prev[i][pos];
            }
          });
        }
        
        // If we're assigning a player (not removing), check for duplicates and update bench
        if (player && inning && position && position !== 'Bench') {
          // Remove this player from any other positions in the same inning
          const positions = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF'];
          positions.forEach(pos => {
            if (pos !== position && updated[inning][pos] && updated[inning][pos].id === player.id) {
              updated[inning][pos] = null;
            }
          });
          
          // Update bench to include all unassigned players for this inning
          const assignedPlayerIds = new Set();
          positions.forEach(pos => {
            if (updated[inning][pos]) {
              assignedPlayerIds.add(updated[inning][pos].id);
            }
          });
          
          // Add all unassigned players to bench
          const benchPlayers = players.filter(p => !assignedPlayerIds.has(p.id));
          updated[inning].Bench = benchPlayers;
        }
        
        console.log('Previous state:', prev);
        console.log('Updated state:', updated);
        return updated;
      });
      
      console.log('Fielding assignments state update called');
      console.log('=== END DEBUG ===');
    } catch (error) {
      console.error('Error assigning player:', error);
    }
  };

  const handleRebalance = (inning) => {
    if (!lineup) return;
    
    try {
      lineup.rebalanceInning(inning, players);
      setLineup({ ...lineup });
    } catch (error) {
      console.error('Error rebalancing inning:', error);
    }
  };

  const handleToggleLock = (inning) => {
    if (!lineup) return;
    
    try {
      if (!lineup.lockedInnings) {
        lineup.lockedInnings = new Set();
      }
      
      if (lineup.lockedInnings.has(inning)) {
        lineup.lockedInnings.delete(inning);
      } else {
        lineup.lockedInnings.add(inning);
      }
      
      setLineup({ ...lineup });
    } catch (error) {
      console.error('Error toggling lock:', error);
    }
  };

  const handleReorderBatting = (newOrder) => {
    if (!lineup) return;
    
    try {
      lineup.battingOrder = newOrder;
      setLineup({ ...lineup });
    } catch (error) {
      console.error('Error reordering batting:', error);
    }
  };

  const handleExport = () => {
    if (!lineup) {
      alert('No lineup data to export');
      return;
    }

    try {
      // Export as JSON
      const exportData = {
        battingOrder: lineup.battingOrder || [],
        fieldingAssignments: fieldingAssignments,
        players: players,
        exportDate: new Date().toISOString()
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `softball-lineup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      console.log('Lineup exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const handleExportPDF = () => {
    if (!lineup) {
      alert('No lineup data to export');
      return;
    }

    try {
      // Load current game info from config
      const config = loadConfig() || {};
      const gameInfo = {
        teamName: config.teamName || 'Your Team',
        opponent: config.opponent || 'Opponent',
        date: config.date || new Date().toLocaleDateString(),
        field: config.field || 'Field 1',
        isHome: true
      };

      exportToPDF(lineup, gameInfo);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('PDF export failed. Please try again.');
    }
  };

  const handleExportCSV = () => {
    if (!lineup) {
      alert('No lineup data to export');
      return;
    }

    try {
      // Load current game info from config
      const config = loadConfig() || {};
      const gameInfo = {
        teamName: config.teamName || 'Your Team',
        opponent: config.opponent || 'Opponent',
        date: config.date || new Date().toLocaleDateString(),
        field: config.field || 'Field 1',
        isHome: true
      };

      exportToCSV(lineup, gameInfo);
    } catch (error) {
      console.error('CSV export failed:', error);
      alert('CSV export failed. Please try again.');
    }
  };


  // Generate PDF content for printing
  const generatePDFContent = (lineup, fieldingAssignments, players, gameInfo) => {
    if (!lineup || !lineup.battingOrder) {
      return '<div>No lineup data available</div>';
    }

    const formatPlayerName = (player) => {
      return `${player.firstName} ${player.lastName ? player.lastName.charAt(0) + '.' : ''}`;
    };

    // Convert 24-hour time to 12-hour format
    const formatTime12Hour = (time24) => {
      if (!time24 || time24 === 'TBD') return time24;
      
      const [hours, minutes] = time24.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      
      return `${hour12}:${minutes} ${ampm}`;
    };

    const getFieldingPosition = (playerId, inning) => {
      return fieldingAssignments[`${playerId}_${inning}`] || 'Bench';
    };

    const positions = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF'];
    const innings = [1, 2, 3, 4, 5, 6];

    return `
      <style>
        @media print {
          .page-break { page-break-before: always; }
        }
        .page-break { 
          border-top: 2px solid #333; 
          margin-top: 20px; 
          padding-top: 20px; 
        }
        @media screen {
          .page-break { 
            border-top: 2px solid #333; 
            margin-top: 40px; 
            padding-top: 40px; 
          }
        }
      </style>
      
      <div style="width: 100%; max-width: 8.5in; margin: 0 auto; font-family: Arial, sans-serif;">
        <!-- Page 1: Batting Order -->
        <div>
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 15px;">
            <h1 style="margin: 0; font-size: 28px; color: #333;">${gameInfo.teamName} vs ${gameInfo.opponent}</h1>
            <p style="margin: 8px 0; font-size: 18px; color: #666;">
              ${gameInfo.date} at ${formatTime12Hour(gameInfo.time)} - ${gameInfo.location}
            </p>
          </div>

          <!-- Batting Order -->
          <div style="margin-bottom: 30px;">
            <h2 style="margin: 0 0 20px 0; font-size: 22px; color: #333; border-bottom: 2px solid #333; padding-bottom: 8px;">
              BATTING ORDER
            </h2>
            <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
              ${lineup.battingOrder.map((player, index) => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f8f9fa; border: 1px solid #ddd; border-radius: 6px; font-size: 16px;">
                  <span style="font-weight: bold; color: #333; font-size: 18px;">${index + 1}.</span>
                  <span style="flex: 1; margin-left: 15px; font-weight: 500;">${formatPlayerName(player)}</span>
                  <span style="color: #666; font-size: 16px; background: #e9ecef; padding: 4px 8px; border-radius: 4px;">#${player.number || 'N/A'}</span>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

        <!-- Page Break -->
        <div class="page-break"></div>

        <!-- Page 2: Fielding Assignments -->
        <div>
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 15px;">
            <h1 style="margin: 0; font-size: 28px; color: #333;">${gameInfo.teamName} vs ${gameInfo.opponent}</h1>
            <p style="margin: 8px 0; font-size: 18px; color: #666;">
              ${gameInfo.date} at ${formatTime12Hour(gameInfo.time)} - ${gameInfo.location}
            </p>
          </div>

          <!-- Fielding Assignments -->
          <div style="margin-bottom: 30px;">
            <h2 style="margin: 0 0 20px 0; font-size: 22px; color: #333; border-bottom: 2px solid #333; padding-bottom: 8px;">
              FIELDING ASSIGNMENTS
            </h2>
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; border: 2px solid #333;">
                <thead>
                  <tr style="background: #333; color: white;">
                    <th style="border: 1px solid #333; padding: 12px; text-align: left; font-weight: bold; font-size: 16px;">Player</th>
                    ${innings.map(inning => `
                      <th style="border: 1px solid #333; padding: 12px; text-align: center; font-weight: bold; font-size: 16px;">Inning ${inning}</th>
                    `).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${players.map(player => `
                    <tr style="background: ${players.indexOf(player) % 2 === 0 ? '#f8f9fa' : 'white'};">
                      <td style="border: 1px solid #333; padding: 12px; font-weight: 600; font-size: 15px;">${formatPlayerName(player)}</td>
                      ${innings.map(inning => `
                        <td style="border: 1px solid #333; padding: 12px; text-align: center; font-size: 14px;">${getFieldingPosition(player.id, inning)}</td>
                      `).join('')}
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #ccc; color: #666; font-size: 12px;">
          Generated by Softball Lineup Generator
        </div>
      </div>
    `;
  };

  const handlePrint = () => {
    try {
      // Check if we have the required data
      if (!lineup || !lineup.battingOrder || lineup.battingOrder.length === 0) {
        alert('No lineup data available to print. Please create a lineup first.');
        return;
      }

      // Generate PDF and open it in a new window for printing
      const config = loadConfig() || {};
      const gameInfo = {
        teamName: config.teamName || 'Team',
        opponent: config.opponent || 'Opponent',
        date: config.date || new Date().toLocaleDateString(),
        time: config.time || 'TBD',
        location: config.field || 'TBD',
        isHome: true
      };

      // Generate the PDF content
      const pdfContent = generatePDFContent(lineup, fieldingAssignments, players, gameInfo);
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      
      if (!printWindow) {
        alert('Please allow popups for this site to enable printing.');
        return;
      }

      // Write the content to the new window
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Lineup - ${gameInfo.teamName} vs ${gameInfo.opponent}</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: Arial, sans-serif;
              background: white;
            }
            @media print {
              body { margin: 0; padding: 0.5in; }
            }
          </style>
        </head>
        <body>
          ${pdfContent}
        </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Wait for content to load, then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      };
      
    } catch (error) {
      console.error('Print failed:', error);
      alert(`Print failed: ${error.message}. Please try again.`);
    }
  };

  const handleExportRoster = () => {
    try {
      const config = loadConfig();
      const success = exportRoster(players, config);
      if (success) {
        alert('Roster exported successfully!');
      } else {
        alert('Failed to export roster. Please try again.');
      }
    } catch (error) {
      console.error('Export roster failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const handleImportRoster = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file first
    validateRosterFile(file).then(validation => {
      if (!validation.valid) {
        alert(`Invalid file: ${validation.message}`);
        return;
      }

      // Import the roster
      importRoster(file)
        .then(result => {
          if (result.success) {
            setPlayers(result.players);
            if (result.config) {
              // Config would be loaded automatically by the storage utility
            }
            alert(result.message);
            // Reset the file input
            event.target.value = '';
          } else {
            alert(`Import failed: ${result.message}`);
          }
        })
        .catch(error => {
          console.error('Import failed:', error);
          alert(`Import failed: ${error.message}`);
        });
    });
  };

  const handleLoadBattingOrder = (orderData) => {
    try {
      // Load players
      if (orderData.players) {
        setPlayers(orderData.players);
      }
      
      // Load fielding assignments
      if (orderData.fieldingAssignments) {
        setFieldingAssignments(orderData.fieldingAssignments);
      }
      
      // Load lineup
      if (orderData.battingOrder) {
        const newLineup = new Lineup(orderData.players || players);
        // Convert batting order data to Player objects
        const battingOrderPlayers = orderData.battingOrder.map(playerData => {
          if (typeof playerData === 'object' && playerData.id) {
            // If it's already a Player object, return it
            return playerData;
          } else if (typeof playerData === 'string') {
            // If it's a player ID, find the player
            return (orderData.players || players).find(p => p.id === playerData);
          }
          return null;
        }).filter(Boolean);
        
        newLineup.battingOrder = battingOrderPlayers;
        setLineup(newLineup);
      }
      
      console.log('Batting order loaded successfully');
    } catch (error) {
      console.error('Failed to load batting order:', error);
      alert('Failed to load batting order. Please try again.');
    }
  };

  if (currentView === 'roster') {
    return (
      <RosterManagement
        players={players}
        onAddPlayer={handleAddPlayer}
        onUpdatePlayer={handleUpdatePlayer}
        onRemovePlayer={handleRemovePlayer}
        onBack={handleBackToLineup}
        currentView={currentView}
        onViewChange={setCurrentView}
        onExportRoster={handleExportRoster}
        onImportRoster={handleImportRoster}
      />
    );
  }

  return (
    <div className="App">
      <Header currentView={currentView} onViewChange={setCurrentView} />

      {/* Main Content */}
      <div className="main-content" id="lineup-board">
        <div className="batting-order-panel">
          <BattingOrderPanel
            lineup={lineup}
            onReorder={handleReorderBatting}
          />
        </div>
        
        <div className="inning-board-panel">
          <InningBoard
            lineup={lineup}
            fieldingAssignments={fieldingAssignments}
            onUpdateLineup={handleUpdateLineup}
            onRebalance={handleRebalance}
            onToggleLock={handleToggleLock}
            players={players}
          />
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar 
        lineup={lineup} 
        onExportPDF={handleExportPDF}
        onExportCSV={handleExportCSV}
        onManageBattingOrders={() => setShowBattingOrderManager(true)}
        lastSaved={lastSaved}
      />

      {/* Batting Order Manager Modal */}
      <BattingOrderManager
        isOpen={showBattingOrderManager}
        onClose={() => setShowBattingOrderManager(false)}
        onLoadOrder={handleLoadBattingOrder}
        currentBattingOrder={lineup?.battingOrder || []}
        currentFieldingAssignments={fieldingAssignments}
        currentPlayers={players}
        currentConfig={null}
      />
    </div>
  );
}

export default App;
