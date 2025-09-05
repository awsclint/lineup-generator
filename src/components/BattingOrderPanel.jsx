import React, { useState, useRef, useEffect } from 'react';

const BattingOrderPanel = ({ lineup, onReorder }) => {
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [insertionIndex, setInsertionIndex] = useState(null);
  const dragTimeoutRef = useRef(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current);
      }
    };
  }, []);
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
    
    // Clear any pending timeout
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }
    
    setDragOverIndex(null);
    setDraggedIndex(null);
    setInsertionIndex(null);
  };

  const handleDragOver = (e, targetIndex) => {
    e.preventDefault();
    
    // Don't update if this is the same item we're dragging
    if (draggedIndex === targetIndex) {
      return;
    }
    
    // Clear any existing timeout
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }
    
    // Use a small timeout to prevent rapid state changes
    dragTimeoutRef.current = setTimeout(() => {
      setDragOverIndex(targetIndex);
      
      // Calculate insertion point based on mouse position
      const rect = e.currentTarget.getBoundingClientRect();
      const mouseY = e.clientY;
      const itemHeight = rect.height;
      const itemCenter = rect.top + (itemHeight / 2);
      
      // If mouse is in top half, insert before this item
      // If mouse is in bottom half, insert after this item
      const insertBefore = mouseY < itemCenter;
      const newInsertionIndex = insertBefore ? targetIndex : targetIndex + 1;
      
      // Only update if the insertion index actually changed
      if (newInsertionIndex !== insertionIndex) {
        setInsertionIndex(newInsertionIndex);
      }
    }, 10); // Small delay to prevent glitching
  };

  const handleDragLeave = (e) => {
    // Only clear if we're actually leaving the container
    // Check if the related target is null or not a child of current target
    if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
      setDragOverIndex(null);
      setInsertionIndex(null);
    }
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    setDragOverIndex(null);
    setDraggedIndex(null);
    setInsertionIndex(null);
    
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
        <div 
          className="batting-order-list"
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={(e) => {
            // Only clear if we're leaving the entire container
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setDragOverIndex(null);
              setInsertionIndex(null);
            }
          }}
        >
          {lineup.battingOrder.map((player, index) => {
            const isDragged = draggedIndex === index;
            const isDragOver = dragOverIndex === index;
            const showInsertBefore = insertionIndex === index;
            const showInsertAfter = insertionIndex === index + 1;
            
            return (
              <React.Fragment key={player.id}>
                {/* Insert line before this item */}
                {showInsertBefore && (
                  <div className="batting-order-insert-line">
                    <div className="insert-line-indicator">
                      <div className="insert-line"></div>
                      <div className="insert-text">Drop here</div>
                    </div>
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
                
                {/* Insert line after this item (for last item) */}
                {showInsertAfter && index === lineup.battingOrder.length - 1 && (
                  <div className="batting-order-insert-line">
                    <div className="insert-line-indicator">
                      <div className="insert-line"></div>
                      <div className="insert-text">Drop here</div>
                    </div>
                  </div>
                )}
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
