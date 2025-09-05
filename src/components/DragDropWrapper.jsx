import React, { useState, useEffect } from 'react';

const DragDropWrapper = ({ children }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Use a longer delay to ensure the DragDropContext is fully established
    // This is a more reliable approach than trying to detect the context
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 300); // Increased delay to 300ms

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '2rem',
        color: 'var(--gray-500)',
        fontSize: '0.9rem'
      }}>
        Initializing drag and drop...
      </div>
    );
  }

  return children;
};

export default DragDropWrapper;
