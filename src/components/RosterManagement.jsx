import React, { useState } from 'react';
import Header from './Header.jsx';

const RosterManagement = ({ players, onAddPlayer, onUpdatePlayer, onRemovePlayer, onBack, currentView, onViewChange, onExportRoster, onImportRoster }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    number: '',
    eligible: { P: false, C: false, '1B': false, '2B': false, '3B': false, SS: false, LF: false, CF: false, RF: false },
    availability: { startInning: 1, endInning: 6 }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingPlayer) {
      onUpdatePlayer(editingPlayer.id, {
        ...formData,
        number: formData.number ? parseInt(formData.number) : null
      });
      setEditingPlayer(null);
    } else {
      onAddPlayer({
        ...formData,
        number: formData.number ? parseInt(formData.number) : null
      });
    }
    
    setFormData({
      firstName: '',
      lastName: '',
      number: '',
      eligible: { P: false, C: false, '1B': false, '2B': false, '3B': false, SS: false, LF: false, CF: false, RF: false },
      availability: { startInning: 1, endInning: 6 }
    });
    setShowAddForm(false);
  };

  const handleEdit = (player) => {
    setEditingPlayer(player);
    setFormData({
      firstName: player.firstName,
      lastName: player.lastName,
      number: player.number?.toString() || '',
      eligible: { ...player.eligible },
      availability: { ...player.availability }
    });
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingPlayer(null);
    setFormData({
      firstName: '',
      lastName: '',
      number: '',
      eligible: { P: false, C: false, '1B': false, '2B': false, '3B': false, SS: false, LF: false, CF: false, RF: false },
      availability: { startInning: 1, endInning: 6 }
    });
  };

  const updateAvailability = (playerId, field, value) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 1 || numValue > 6) return;
    
    onUpdatePlayer(playerId, {
      availability: {
        ...players.find(p => p.id === playerId).availability,
        [field]: numValue
      }
    });
  };

  const updateEligibility = (playerId, position, value) => {
    const player = players.find(p => p.id === playerId);
    const updatedPlayer = {
      ...player,
      eligible: {
        ...player.eligible,
        [position]: value
      }
    };
    onUpdatePlayer(updatedPlayer);
  };

  const toggleInactiveStatus = (playerId) => {
    const player = players.find(p => p.id === playerId);
    const updatedPlayer = {
      ...player,
      inactive: !player.inactive
    };
    onUpdatePlayer(updatedPlayer);
  };

  const getPositionBadges = (player) => {
    const badges = [];
    if (player.eligible.P) badges.push({ label: 'P', className: 'badge-pitcher' });
    if (player.eligible.C) badges.push({ label: 'C', className: 'badge-catcher' });
    if (player.eligible['1B']) badges.push({ label: '1B', className: 'badge-infield' });
    if (player.eligible['2B']) badges.push({ label: '2B', className: 'badge-infield' });
    if (player.eligible['3B']) badges.push({ label: '3B', className: 'badge-infield' });
    if (player.eligible.SS) badges.push({ label: 'SS', className: 'badge-infield' });
    if (player.eligible.LF) badges.push({ label: 'LF', className: 'badge-outfield' });
    if (player.eligible.CF) badges.push({ label: 'CF', className: 'badge-outfield' });
    if (player.eligible.RF) badges.push({ label: 'RF', className: 'badge-outfield' });
    return badges;
  };

  const getDisplayName = (player) => {
    return `${player.firstName} ${player.lastName.charAt(0)}.`;
  };

  return (
    <div className="App">
      {/* Header - Same as main page */}
      <Header currentView={currentView} onViewChange={onViewChange} />

      <div className="roster-content">
        <div className="panel-header">
          <h2>Roster Management</h2>
          <div className="roster-actions">
            <button 
              className="btn btn-secondary"
              onClick={onExportRoster}
              title="Export roster to share with other coaches"
            >
              👥 Export Roster
            </button>
            <label className="btn btn-secondary" title="Import roster from another coach">
              📥 Import Roster
              <input
                type="file"
                accept=".json"
                onChange={onImportRoster}
                style={{ display: 'none' }}
              />
            </label>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              + Add Player
            </button>
          </div>
        </div>

      {showAddForm && (
        <div className="player-form-overlay">
          <div className="player-form">
            <h2>{editingPlayer ? 'Edit Player' : 'Add New Player'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h3>Basic Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Jersey Number</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    min="0"
                    max="99"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Position Eligibility</h3>
                <div className="position-grid">
                  <label className="position-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.eligible.P}
                      onChange={(e) => setFormData({
                        ...formData,
                        eligible: { ...formData.eligible, P: e.target.checked }
                      })}
                    />
                    <span className="position-label pitcher">Pitcher (P)</span>
                  </label>
                  <label className="position-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.eligible.C}
                      onChange={(e) => setFormData({
                        ...formData,
                        eligible: { ...formData.eligible, C: e.target.checked }
                      })}
                    />
                    <span className="position-label catcher">Catcher (C)</span>
                  </label>
                  <label className="position-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.eligible['1B']}
                      onChange={(e) => setFormData({
                        ...formData,
                        eligible: { ...formData.eligible, '1B': e.target.checked }
                      })}
                    />
                    <span className="position-label infield">First Base (1B)</span>
                  </label>
                  <label className="position-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.eligible['2B']}
                      onChange={(e) => setFormData({
                        ...formData,
                        eligible: { ...formData.eligible, '2B': e.target.checked }
                      })}
                    />
                    <span className="position-label infield">Second Base (2B)</span>
                  </label>
                  <label className="position-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.eligible['3B']}
                      onChange={(e) => setFormData({
                        ...formData,
                        eligible: { ...formData.eligible, '3B': e.target.checked }
                      })}
                    />
                    <span className="position-label infield">Third Base (3B)</span>
                  </label>
                  <label className="position-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.eligible.SS}
                      onChange={(e) => setFormData({
                        ...formData,
                        eligible: { ...formData.eligible, SS: e.target.checked }
                      })}
                    />
                    <span className="position-label infield">Shortstop (SS)</span>
                  </label>
                  <label className="position-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.eligible.LF}
                      onChange={(e) => setFormData({
                        ...formData,
                        eligible: { ...formData.eligible, LF: e.target.checked }
                      })}
                    />
                    <span className="position-label outfield">Left Field (LF)</span>
                  </label>
                  <label className="position-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.eligible.CF}
                      onChange={(e) => setFormData({
                        ...formData,
                        eligible: { ...formData.eligible, CF: e.target.checked }
                      })}
                    />
                    <span className="position-label outfield">Center Field (CF)</span>
                  </label>
                  <label className="position-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.eligible.RF}
                      onChange={(e) => setFormData({
                        ...formData,
                        eligible: { ...formData.eligible, RF: e.target.checked }
                      })}
                    />
                    <span className="position-label outfield">Right Field (RF)</span>
                  </label>
                </div>
              </div>

              <div className="form-section">
                <h3>Game Availability</h3>
                <div className="availability-row">
                  <span>Available from inning:</span>
                  <input
                    type="number"
                    className="form-input availability-input"
                    value={formData.availability.startInning}
                    onChange={(e) => setFormData({
                      ...formData,
                      availability: { ...formData.availability, startInning: parseInt(e.target.value) }
                    })}
                    min="1"
                    max="6"
                  />
                  <span>to inning:</span>
                  <input
                    type="number"
                    className="form-input availability-input"
                    value={formData.availability.endInning}
                    onChange={(e) => setFormData({
                      ...formData,
                      availability: { ...formData.availability, endInning: parseInt(e.target.value) }
                    })}
                    min="1"
                    max="6"
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPlayer ? 'Update' : 'Add'} Player
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="roster-grid">
        {players.map((player) => (
          <div key={player.id} className="player-card">
            <div className="player-header">
              <div className="player-name">{getDisplayName(player)}</div>
              {player.number && (
                <div className="player-number">#{player.number}</div>
              )}
            </div>
            
            <div className="player-status">
              <div 
                className={`status-toggle ${player.inactive ? 'inactive' : 'active'}`}
                onClick={() => toggleInactiveStatus(player.id)}
              >
                {player.inactive ? '❌ INACTIVE' : '✅ ACTIVE'}
              </div>
            </div>
            
            <div className="player-positions">
              {getPositionBadges(player).map((badge, idx) => (
                <span key={idx} className={`badge ${badge.className}`}>
                  {badge.label}
                </span>
              ))}
            </div>
            
            <div className="player-availability">
              <div className="availability-label">Available:</div>
              <div className="availability-inputs">
                <input
                  type="number"
                  className="availability-input"
                  value={player.availability.startInning}
                  onChange={(e) => updateAvailability(player.id, 'startInning', e.target.value)}
                  min="1"
                  max="6"
                />
                <span>to</span>
                <input
                  type="number"
                  className="availability-input"
                  value={player.availability.endInning}
                  onChange={(e) => updateAvailability(player.id, 'endInning', e.target.value)}
                  min="1"
                  max="6"
                />
              </div>
            </div>

            <div className="player-eligibility">
              <div className="eligibility-label">Positions:</div>
              <div className="eligibility-toggles">
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={player.eligible.P}
                    onChange={(e) => updateEligibility(player.id, 'P', e.target.checked)}
                  />
                  <span className="toggle-label">P</span>
                </label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={player.eligible.C}
                    onChange={(e) => updateEligibility(player.id, 'C', e.target.checked)}
                  />
                  <span className="toggle-label">C</span>
                </label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={player.eligible['1B']}
                    onChange={(e) => updateEligibility(player.id, '1B', e.target.checked)}
                  />
                  <span className="toggle-label">1B</span>
                </label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={player.eligible['2B']}
                    onChange={(e) => updateEligibility(player.id, '2B', e.target.checked)}
                  />
                  <span className="toggle-label">2B</span>
                </label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={player.eligible['3B']}
                    onChange={(e) => updateEligibility(player.id, '3B', e.target.checked)}
                  />
                  <span className="toggle-label">3B</span>
                </label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={player.eligible.SS}
                    onChange={(e) => updateEligibility(player.id, 'SS', e.target.checked)}
                  />
                  <span className="toggle-label">SS</span>
                </label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={player.eligible.LF}
                    onChange={(e) => updateEligibility(player.id, 'LF', e.target.checked)}
                  />
                  <span className="toggle-label">LF</span>
                </label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={player.eligible.CF}
                    onChange={(e) => updateEligibility(player.id, 'CF', e.target.checked)}
                  />
                  <span className="toggle-label">CF</span>
                </label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={player.eligible.RF}
                    onChange={(e) => updateEligibility(player.id, 'RF', e.target.checked)}
                  />
                  <span className="toggle-label">RF</span>
                </label>
              </div>
            </div>
            
            <div className="player-actions">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleEdit(player)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => onRemovePlayer(player.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {players.length === 0 && (
        <div className="empty-roster">
          <h3>No Players Added Yet</h3>
          <p>Add your first player to get started!</p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            Add First Player
          </button>
        </div>
      )}
        </div> {/* Close roster-content */}
    </div>
  );
};

export default RosterManagement;
