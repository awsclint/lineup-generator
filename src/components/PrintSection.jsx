import React from 'react';
import { exportToPDF, exportToCSV, printLineup } from '../utils/exportUtils.js';

const PrintSection = ({ lineup, config }) => {
  const handleExportPDF = () => {
    exportToPDF(lineup, config);
  };

  const handleExportCSV = () => {
    exportToCSV(lineup, config);
  };


  const handlePrint = () => {
    printLineup();
  };

  return (
    <div className="print-section">
      <h2>Export & Print</h2>
      
      <div className="print-actions">
        <button
          className="btn btn-primary"
          onClick={handleExportPDF}
          title="Export to PDF with full lineup details"
        >
          📄 Export PDF
        </button>
        
        <button
          className="btn btn-secondary"
          onClick={handleExportCSV}
          title="Export to CSV for spreadsheet analysis"
        >
          📊 Export CSV
        </button>
        
        
        <button
          className="btn btn-primary"
          onClick={handlePrint}
          title="Print lineup sheet"
        >
          🖨️ Print
        </button>
      </div>

      <div style={{ 
        marginTop: '1rem', 
        padding: '1rem', 
        background: 'var(--gray-50)', 
        borderRadius: '6px',
        border: '1px solid var(--gray-200)',
        fontSize: '0.875rem'
      }}>
        <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Export Options:</h4>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--gray-600)' }}>
          <li><strong>PDF:</strong> Complete lineup sheet with batting order, fielding assignments, and pitching summary</li>
          <li><strong>CSV:</strong> Data export for spreadsheet analysis and record keeping</li>
          <li><strong>Print:</strong> Browser print dialog for physical copies</li>
        </ul>
      </div>

      <div id="lineup-board" className="no-print" style={{ 
        marginTop: '1rem', 
        padding: '1rem', 
        background: 'white', 
        borderRadius: '8px',
        border: '1px solid var(--gray-200)'
      }}>
        <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>
          {config.teamName} vs {config.opponent}
        </h3>
        <p style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--gray-600)' }}>
          {config.date} • {config.field} • {config.isHome ? 'Home' : 'Away'}
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem' }}>
          {[1, 2, 3, 4, 5, 6].map(inning => (
            <div key={inning} style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Inning {inning}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>
                {lineup.fieldingAssignments[inning].P ? lineup.fieldingAssignments[inning].P.lastName : '-'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrintSection;
