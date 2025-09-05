import React, { useState, useEffect } from 'react';
import './App.css';
import { Lineup } from './models/Lineup.js';
import { Player } from './models/Player.js';
import Header from './components/Header.jsx';
import RosterManagement from './components/RosterManagement';
import BattingOrderPanel from './components/BattingOrderPanel.jsx';
import InningBoard from './components/InningBoard.jsx';
import StatusBar from './components/StatusBar.jsx';
import { exportToPDF, exportToCSV, exportToPNG } from './utils/exportUtils.js';
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
        firstName: 'Dylan',
        lastName: 'Reynolds',
        number: 22,
        eligible: { P: true, C: false, '1B': true, '2B': true, '3B': true, SS: true, LF: false, CF: false, RF: false },
        availability: { startInning: 1, endInning: 6 }
      }),
      new Player({
        id: 2,
        firstName: 'Quinn',
        lastName: 'Williams',
        number: 7,
        eligible: { P: true, C: false, '1B': true, '2B': true, '3B': true, SS: true, LF: false, CF: false, RF: false },
        availability: { startInning: 1, endInning: 6 }
      }),
      new Player({
        id: 3,
        firstName: 'Viviana',
        lastName: 'Vargas',
        number: 12,
        eligible: { P: true, C: true, '1B': true, '2B': true, '3B': true, SS: true, LF: false, CF: false, RF: false },
        availability: { startInning: 1, endInning: 6 }
      }),
      new Player({
        id: 4,
        firstName: 'Norah',
        lastName: 'Evans',
        number: 15,
        eligible: { P: false, C: true, '1B': true, '2B': true, '3B': true, SS: true, LF: true, CF: true, RF: true },
        availability: { startInning: 1, endInning: 6 }
      }),
      new Player({
        id: 5,
        firstName: 'Adalynn',
        lastName: 'Garcia',
        number: 5,
        eligible: { P: true, C: false, '1B': true, '2B': true, '3B': true, SS: true, LF: false, CF: false, RF: false },
        availability: { startInning: 1, endInning: 6 }
      }),
      new Player({
        id: 6,
        firstName: 'Ryleigh',
        lastName: 'Gonzalez',
        number: 6,
        eligible: { P: false, C: true, '1B': false, '2B': false, '3B': false, SS: false, LF: true, CF: true, RF: true },
        availability: { startInning: 1, endInning: 6 }
      }),
      new Player({
        id: 7,
        firstName: 'Aria',
        lastName: 'Martinez',
        number: 3,
        eligible: { P: false, C: false, '1B': true, '2B': true, '3B': true, SS: true, LF: true, CF: true, RF: true },
        availability: { startInning: 1, endInning: 6 }
      }),
      new Player({
        id: 8,
        firstName: 'Piper',
        lastName: 'Johnson',
        number: 2,
        eligible: { P: false, C: false, '1B': true, '2B': true, '3B': true, SS: true, LF: true, CF: true, RF: true },
        availability: { startInning: 1, endInning: 6 }
      }),
      new Player({
        id: 9,
        firstName: 'Grace',
        lastName: 'Miller',
        number: 14,
        eligible: { P: false, C: true, '1B': false, '2B': false, '3B': false, SS: false, LF: true, CF: true, RF: true },
        availability: { startInning: 1, endInning: 6 }
      }),
      new Player({
        id: 10,
        firstName: 'Mary Jo',
        lastName: 'Jones',
        number: 11,
        eligible: { P: false, C: true, '1B': false, '2B': false, '3B': false, SS: false, LF: true, CF: true, RF: true },
        availability: { startInning: 1, endInning: 6 }
      }),
      new Player({
        id: 11,
        firstName: 'Elena',
        lastName: 'Davis',
        number: 8,
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
      // Create a config object for the export
      const config = {
        teamName: 'Your Team',
        opponent: 'Opponent',
        date: new Date().toLocaleDateString(),
        field: 'Field 1',
        isHome: true
      };

      exportToPDF(lineup, config);
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
      // Create a config object for the export
      const config = {
        teamName: 'Your Team',
        opponent: 'Opponent',
        date: new Date().toLocaleDateString(),
        field: 'Field 1',
        isHome: true
      };

      exportToCSV(lineup, config);
    } catch (error) {
      console.error('CSV export failed:', error);
      alert('CSV export failed. Please try again.');
    }
  };

  const handleExportPNG = () => {
    if (!lineup) {
      alert('No lineup data to export');
      return;
    }

    try {
      // Create a config object for the export
      const config = {
        teamName: 'Your Team',
        opponent: 'Opponent',
        date: new Date().toLocaleDateString(),
        field: 'Field 1',
        isHome: true
      };

      exportToPNG('lineup-board', `${config.teamName}_vs_${config.opponent}_${config.date}.png`);
    } catch (error) {
      console.error('PNG export failed:', error);
      alert('PNG export failed. Please try again.');
    }
  };

  const handlePrint = () => {
    try {
      // Hide elements that shouldn't be printed
      const style = document.createElement('style');
      style.id = 'print-style';
      style.innerHTML = `
        @media print {
          .header, .top-navigation, .status-bar .action-buttons { display: none !important; }
          .main-content { grid-template-columns: 1fr !important; gap: 0 !important; }
        }
      `;
      document.head.appendChild(style);
      
      window.print();
      
      // Clean up
      setTimeout(() => {
        const printStyle = document.getElementById('print-style');
        if (printStyle) printStyle.remove();
      }, 1000);
    } catch (error) {
      console.error('Print failed:', error);
      alert('Print failed. Please try again.');
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
        onExportPNG={handleExportPNG}
        onPrint={handlePrint}
        lastSaved={lastSaved}
      />
    </div>
  );
}

export default App;
