import React, { useState } from 'react';
import { GameConfig } from '../models/GameConfig.js';

const ConfigModal = ({ config, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    teamName: config.teamName,
    opponent: config.opponent,
    date: config.date,
    field: config.field,
    isHome: config.isHome,
    enforcePitcherRules: config.enforcePitcherRules,
    minFieldInnings: config.minFieldInnings,
    avoidRepeatPositionLimit: config.avoidRepeatPositionLimit,
    avoidBackToBackBench: config.avoidBackToBackBench,
    balancePlayingTime: config.balancePlayingTime,
    maxCatcherInnings: config.maxCatcherInnings,
    maxShortstopInnings: config.maxShortstopInnings,
    maxFirstBaseInnings: config.maxFirstBaseInnings
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newConfig = new GameConfig(formData);
    onSave(newConfig);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Game Configuration</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Team Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.teamName}
                onChange={(e) => handleChange('teamName', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Opponent</label>
              <input
                type="text"
                className="form-input"
                value={formData.opponent}
                onChange={(e) => handleChange('opponent', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Field</label>
              <input
                type="text"
                className="form-input"
                value={formData.field}
                onChange={(e) => handleChange('field', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Home/Away</label>
            <select
              className="form-select"
              value={formData.isHome ? 'home' : 'away'}
              onChange={(e) => handleChange('isHome', e.target.value === 'home')}
            >
              <option value="home">Home</option>
              <option value="away">Away</option>
            </select>
          </div>

          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            background: 'var(--gray-50)', 
            borderRadius: '8px',
            border: '1px solid var(--gray-200)'
          }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Constraint Settings</h4>
            
            <div className="form-checkbox-group">
              <label className="checkbox-group">
                <input
                  type="checkbox"
                  checked={formData.enforcePitcherRules}
                  onChange={(e) => handleChange('enforcePitcherRules', e.target.checked)}
                />
                Enforce pitcher rules (max 2 consecutive, max 3 total)
              </label>
              <label className="checkbox-group">
                <input
                  type="checkbox"
                  checked={formData.avoidBackToBackBench}
                  onChange={(e) => handleChange('avoidBackToBackBench', e.target.checked)}
                />
                Avoid back-to-back bench innings
              </label>
              <label className="checkbox-group">
                <input
                  type="checkbox"
                  checked={formData.balancePlayingTime}
                  onChange={(e) => handleChange('balancePlayingTime', e.target.checked)}
                />
                Balance playing time across players
              </label>
            </div>

            <div className="form-row" style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Minimum fielding innings per player</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.minFieldInnings}
                  onChange={(e) => handleChange('minFieldInnings', parseInt(e.target.value))}
                  min="0"
                  max="6"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Avoid same position limit</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.avoidRepeatPositionLimit}
                  onChange={(e) => handleChange('avoidRepeatPositionLimit', parseInt(e.target.value))}
                  min="1"
                  max="6"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Max catcher innings</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.maxCatcherInnings}
                  onChange={(e) => handleChange('maxCatcherInnings', parseInt(e.target.value))}
                  min="1"
                  max="6"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Max shortstop innings</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.maxShortstopInnings}
                  onChange={(e) => handleChange('maxShortstopInnings', parseInt(e.target.value))}
                  min="1"
                  max="6"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Max first base innings</label>
              <input
                type="number"
                className="form-input"
                value={formData.maxFirstBaseInnings}
                onChange={(e) => handleChange('maxFirstBaseInnings', parseInt(e.target.value))}
                min="1"
                max="6"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigModal;
