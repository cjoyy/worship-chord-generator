import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#0d0d14',
          color: '#e94560',
          textAlign: 'center',
          padding: '20px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div>
            <h1>❌ Oops! Something went wrong</h1>
            <p style={{ color: '#6b6a8a', marginTop: '10px' }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                background: '#7c6af7',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🔄 Reload Page
            </button>
            <details style={{ marginTop: '30px', textAlign: 'left', color: '#00e5c8' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Details</summary>
              <pre style={{ 
                background: '#1a1a2e', 
                padding: '10px', 
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '12px',
                marginTop: '10px'
              }}>
                {this.state.error?.stack || 'No stack trace available'}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
