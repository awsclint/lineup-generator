import React, { useState, useEffect } from 'react';
import { 
  getSavedOrders, 
  loadBattingOrder, 
  deleteBattingOrder, 
  renameBattingOrder,
  exportBattingOrder,
  importBattingOrder,
  saveBattingOrder
} from '../utils/battingOrderStorage.js';

const BattingOrderManager = ({ 
  isOpen, 
  onClose, 
  onLoadOrder, 
  currentBattingOrder, 
  currentFieldingAssignments, 
  currentPlayers, 
  currentConfig 
}) => {
  const [savedOrders, setSavedOrders] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [renameId, setRenameId] = useState('');
  const [renameName, setRenameName] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [message, setMessage] = useState('');

  // Load saved orders when component mounts
  useEffect(() => {
    if (isOpen) {
      loadOrders();
    }
  }, [isOpen]);

  const loadOrders = () => {
    const orders = getSavedOrders();
    setSavedOrders(orders);
  };

  const handleSaveOrder = () => {
    if (!saveName.trim()) {
      setMessage('Please enter a name for the lineup');
      return;
    }

    const result = saveBattingOrder(
      saveName,
      currentBattingOrder,
      currentFieldingAssignments,
      currentPlayers,
      currentConfig
    );

    setMessage(result.message);
    if (result.success) {
      setSaveName('');
      setShowSaveDialog(false);
      loadOrders();
    }
  };

  const handleLoadOrder = (orderId) => {
    const result = loadBattingOrder(orderId);
    if (result.success) {
      onLoadOrder(result.data);
      setMessage(`Loaded lineup "${result.data.name}"`);
      onClose();
    } else {
      setMessage(result.message);
    }
  };

  const handleDeleteOrder = (orderId, orderName) => {
    if (window.confirm(`Are you sure you want to delete "${orderName}"?`)) {
      const result = deleteBattingOrder(orderId);
      setMessage(result.message);
      if (result.success) {
        loadOrders();
      }
    }
  };

  const handleRenameOrder = () => {
    if (!renameName.trim()) {
      setMessage('Please enter a new name');
      return;
    }

    const result = renameBattingOrder(renameId, renameName);
    setMessage(result.message);
    if (result.success) {
      setRenameId('');
      setRenameName('');
      setShowRenameDialog(false);
      loadOrders();
    }
  };

  const handleExportOrder = (orderId) => {
    const result = exportBattingOrder(orderId);
    setMessage(result.message);
  };

  const handleImportOrder = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    importBattingOrder(file).then(result => {
      setMessage(result.message);
      if (result.success) {
        loadOrders();
        setShowImportDialog(false);
      }
    });
  };


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString() + ' ' + 
           new Date(dateString).toLocaleTimeString();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content batting-order-manager">
        <div className="modal-header">
          <h2>Manage Lineups</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {message && (
            <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="manager-actions">
            <button 
              className="btn btn-primary"
              onClick={() => setShowSaveDialog(true)}
            >
              💾 Save Current Lineup
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowImportDialog(true)}
            >
              📥 Import Lineup
            </button>
          </div>

          <div className="saved-orders-list">
            <h3>Saved Lineups ({savedOrders.length})</h3>
            {savedOrders.length === 0 ? (
              <div className="empty-state">
                <p>No saved lineups yet</p>
                <p>Save your current lineup to get started!</p>
              </div>
            ) : (
              <div className="orders-grid">
                {savedOrders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <h4>{order.name}</h4>
                      <div className="order-actions">
                        <button 
                          className="btn-icon"
                          onClick={() => {
                            setRenameId(order.id);
                            setRenameName(order.name);
                            setShowRenameDialog(true);
                          }}
                          title="Rename"
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn-icon"
                          onClick={() => handleDeleteOrder(order.id, order.name)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <div className="order-details">
                      <p>Created: {formatDate(order.createdAt)}</p>
                      <p>Updated: {formatDate(order.updatedAt)}</p>
                      <p>Players: {order.battingOrder?.length || 0}</p>
                    </div>
                    <div className="order-buttons">
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleLoadOrder(order.id)}
                      >
                        Load
                      </button>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleExportOrder(order.id)}
                      >
                        Export
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="modal-overlay">
            <div className="modal-content save-dialog">
              <div className="modal-header">
                <h3>Save Lineup</h3>
                <button className="modal-close" onClick={() => setShowSaveDialog(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Lineup Name:</label>
                  <input
                    type="text"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    placeholder="Enter a name for this lineup"
                    autoFocus
                  />
                </div>
                <div className="form-actions">
                  <button className="btn btn-secondary" onClick={() => setShowSaveDialog(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleSaveOrder}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rename Dialog */}
        {showRenameDialog && (
          <div className="modal-overlay">
            <div className="modal-content save-dialog">
              <div className="modal-header">
                <h3>Rename Lineup</h3>
                <button className="modal-close" onClick={() => setShowRenameDialog(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>New Name:</label>
                  <input
                    type="text"
                    value={renameName}
                    onChange={(e) => setRenameName(e.target.value)}
                    placeholder="Enter new name"
                    autoFocus
                  />
                </div>
                <div className="form-actions">
                  <button className="btn btn-secondary" onClick={() => setShowRenameDialog(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleRenameOrder}>
                    Rename
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Import Dialog */}
        {showImportDialog && (
          <div className="modal-overlay">
            <div className="modal-content save-dialog">
              <div className="modal-header">
                <h3>Import Lineup</h3>
                <button className="modal-close" onClick={() => setShowImportDialog(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Select File:</label>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportOrder}
                  />
                </div>
                <div className="form-actions">
                  <button className="btn btn-secondary" onClick={() => setShowImportDialog(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BattingOrderManager;
