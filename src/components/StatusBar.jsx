import React from 'react';

const StatusBar = ({ lineup, onExportPDF, onExportCSV, onManageBattingOrders }) => {
  // Safety checks for lineup and its methods
  if (!lineup) {
    return (
      <div className="status-bar">
        <div className="status-messages">
          <div className="status-message">No lineup data available</div>
        </div>
      </div>
    );
  }

  // Get validation errors safely
  const validationErrors = [];
  if (lineup.getValidationErrors && typeof lineup.getValidationErrors === 'function') {
    try {
      const errors = lineup.getValidationErrors();
      if (Array.isArray(errors)) {
        validationErrors.push(...errors);
      }
    } catch (error) {
      console.error('Error getting validation errors:', error);
    }
  }

  // Get warnings safely
  const warnings = [];
  if (lineup.getWarnings && typeof lineup.getWarnings === 'function') {
    try {
      const lineupWarnings = lineup.getWarnings();
      if (Array.isArray(lineupWarnings)) {
        warnings.push(...lineupWarnings);
      }
    } catch (error) {
      console.error('Error getting warnings:', error);
    }
  }

  return (
    <div className="status-bar">
      <div className="status-messages">
        {validationErrors.length > 0 && (
          <div className="status-error">
            <strong>Errors:</strong> {validationErrors.join(', ')}
          </div>
        )}
        {warnings.length > 0 && (
          <div className="status-warning">
            <strong>Warnings:</strong> {warnings.join(', ')}
          </div>
        )}
      </div>
      
      <div className="action-buttons">
        <button className="btn btn-primary" onClick={onManageBattingOrders} title="Save and manage batting orders">
          📋 Manage Lineups
        </button>
        <div className="button-divider"></div>
        <button className="btn btn-primary" onClick={onExportPDF} title="Export to PDF with full lineup details">
          📄 PDF
        </button>
        <button className="btn btn-primary" onClick={onExportCSV} title="Export to CSV for spreadsheet analysis">
          📊 CSV
        </button>
      </div>
    </div>
  );
};

export default StatusBar;
