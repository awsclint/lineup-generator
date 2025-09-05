import React, { useState } from 'react';

const BattingOrderPanel = ({ lineup, onReorder }) => {
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (e, player, index) => {
    try {
      if (!player || !player.id) {
        console.warn('Invalid player data for drag start');
        return;
      }
      
      e.dataTransfer.setData('text/plain', JSON.stringify({
        type: 'batting-order',
        playerId: player.id,
        player: player,
        index: index
      }));
      e.target.classList.add('dragging');
      setDraggedIndex(index);
    } catch (error) {
      console.error('Error starting drag:', error);
    }
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    setDragOverIndex(null);
    setDraggedIndex(null);
  };

  const handleDragOver = (e, targetIndex) => {
    e.preventDefault();
    setDragOverIndex(targetIndex);
  };

  const handleDragLeave = (e) => {
    // Only clear drag over if we're actually leaving the container
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    setDragOverIndex(null);
    setDraggedIndex(null);
    
    try {
      // Validate that we have valid lineup data
      if (!lineup || !lineup.battingOrder || !Array.isArray(lineup.battingOrder)) {
        console.warn('Invalid lineup data for reordering');
        return;
      }
      
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      
      if (data.type === 'batting-order' && 
          data.index !== targetIndex && 
          data.index >= 0 && 
          data.index < lineup.battingOrder.length &&
          targetIndex >= 0 && 
          targetIndex < lineup.battingOrder.length) {
        
        console.log(`Reordering: player ${data.playerId} from index ${data.index} to ${targetIndex}`);
        
        // Create new batting order with the reordered player
        const newOrder = Array.from(lineup.battingOrder);
        const [movedPlayer] = newOrder.splice(data.index, 1);
        newOrder.splice(targetIndex, 0, movedPlayer);
        
        // Call the onReorder callback with the new order
        if (onReorder && typeof onReorder === 'function') {
          onReorder(newOrder);
        }
      }
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  };

  const getDisplayName = (player) => {
    return `${player.firstName} ${player.lastName ? player.lastName.charAt(0) + '.' : ''}`;
  };

  return (
    <div className="panel">
      <h2>Batting Order</h2>
      
      <div style={{ 
        marginBottom: '1rem', 
        padding: '0.5rem', 
        background: 'var(--gray-50)', 
        borderRadius: '4px',
        fontSize: '0.75rem',
        color: 'var(--gray-600)'
      }}>
        <strong>Note:</strong> Drag to reorder batting sequence
      </div>

      {lineup && lineup.battingOrder && Array.isArray(lineup.battingOrder) ? (
        <div className="batting-order-list">
          {lineup.battingOrder.map((player, index) => {
            const isDragged = draggedIndex === index;
            const isDragOver = dragOverIndex === index;
            const showInsertPreview = isDragOver && draggedIndex !== null && draggedIndex !== index;
            
            return (
              <React.Fragment key={player.id}>
                {/* Insert preview line */}
                {showInsertPreview && (
                  <div className="batting-order-insert-preview">
                    <div className="insert-line"></div>
                    <div className="insert-text">Drop here to insert</div>
                  </div>
                )}
                
                <div
                  className={`batting-order-item ${isDragged ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, player, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  style={{ cursor: 'move' }}
                >
                  <div className="batting-order-number">{index + 1}</div>
                  
                  <div className="batting-order-info">
                    <div className="batting-order-name">
                      {getDisplayName(player)}
                      {player.number && (
                        <span className="batting-order-number-inline"> #{player.number}</span>
                      )}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      ) : (
        <div style={{ 
          padding: '1rem', 
          textAlign: 'center', 
          color: 'var(--gray-500)',
          background: 'var(--gray-50)',
          borderRadius: '6px'
        }}>
          No batting order available
        </div>
      )}
    </div>
  );
};

export default BattingOrderPanel;
