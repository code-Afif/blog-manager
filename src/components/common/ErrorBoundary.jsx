import React from 'react';
import { Button } from '../ui/Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[DEVLOG_KERNEL_PANIC]', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetStorage = () => {
    window.localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            height: '100vh',
            width: '100vw',
            backgroundColor: '#0C0E10',
            color: '#FF5252',
            padding: '32px',
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '680px',
              backgroundColor: '#12161A',
              border: '1px solid #4A1A1E',
              borderRadius: '2px',
              padding: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #4A1A1E',
                paddingBottom: '10px',
                marginBottom: '16px',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '13px', letterSpacing: '0.06em' }}>
                KERNEL PANIC: UNCAUGHT RUNTIME EXCEPTION
              </span>
              <span
                style={{
                  fontSize: '11px',
                  backgroundColor: '#4A1A1E',
                  color: '#FF5252',
                  padding: '2px 6px',
                  borderRadius: '2px',
                }}
              >
                SIGSEGV
              </span>
            </div>

            <div
              style={{
                color: '#D8DEE4',
                fontSize: '13px',
                marginBottom: '16px',
                lineHeight: 1.5,
              }}
            >
              {this.state.error?.toString()}
            </div>

            {this.state.errorInfo?.componentStack && (
              <pre
                style={{
                  backgroundColor: '#090B0D',
                  padding: '12px',
                  border: '1px solid #232A31',
                  color: '#7A8691',
                  fontSize: '11px',
                  overflowX: 'auto',
                  maxHeight: '180px',
                  marginBottom: '20px',
                }}
              >
                {this.state.errorInfo.componentStack}
              </pre>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="danger" size="md" onClick={this.handleReload}>
                REBOOT WORKSPACE
              </Button>
              <Button variant="secondary" size="md" onClick={this.handleResetStorage}>
                CLEAR LOCAL STORAGE & REBOOT
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
