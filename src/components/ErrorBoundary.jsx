import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.log('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '1rem', 
          margin: '1rem', 
          border: '1px solid #f56565', 
          borderRadius: '8px',
          backgroundColor: '#fed7d7',
          color: '#742a2a'
        }}>
          <h3>Something went wrong with this component</h3>
          <p>This might be a temporary issue. Try refreshing the page.</p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#742a2a',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
