import React from 'react';
import { Button } from '../ui/Button';

/**
 * Literary Error Boundary — Printing House Fault
 * Catches uncaught runtime exceptions and presents a serene literary recovery interface.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[MARGINALIA_PRESS_FAULT]', error, errorInfo);
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
            minHeight: '100vh',
            width: '100vw',
            backgroundColor: 'var(--bg-canvas, #F7F5EE)',
            color: 'var(--text-primary, #181613)',
            padding: '48px 24px',
            fontFamily: 'var(--font-serif, "Newsreader", serif)',
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
              maxWidth: '640px',
              backgroundColor: 'var(--bg-surface, #FFFFFF)',
              border: '1px solid var(--border-default, #DDD6C6)',
              borderRadius: 'var(--radius-1, 2px)',
              padding: '36px 32px',
              textAlign: 'center',
            }}
          >
            <div className="fleuron" style={{ fontSize: '2rem', marginBottom: '12px', color: 'var(--accent, #8A3324)' }}>
              ❧
            </div>

            <div
              style={{
                fontFamily: 'var(--font-sans, "Instrument Sans", sans-serif)',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--accent, #8A3324)',
                marginBottom: '10px',
              }}
            >
              Printing House Fault • Exception in the Press
            </div>

            <h2
              style={{
                fontSize: '1.75rem',
                fontWeight: 600,
                lineHeight: 1.25,
                color: 'var(--text-primary, #181613)',
                margin: '0 0 16px',
              }}
            >
              An unexpected flaw halted the rendering of this folio.
            </h2>

            <p
              style={{
                color: 'var(--text-secondary, #4A453E)',
                fontSize: '15px',
                lineHeight: 1.6,
                maxWidth: '54ch',
                margin: '0 auto 24px',
              }}
            >
              The digital press encountered a runtime interruption. You may re-ink the machinery by reloading the page, or reset the local archival cache if the state was corrupted.
            </p>

            {this.state.error && (
              <div
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '11px',
                  backgroundColor: 'var(--code-bg, #EFECE3)',
                  border: '1px solid var(--border-subtle, #EAE5D8)',
                  color: 'var(--text-muted, #7C756B)',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-1, 2px)',
                  textAlign: 'left',
                  marginBottom: '24px',
                  maxHeight: '120px',
                  overflowY: 'auto',
                }}
              >
                {this.state.error.toString()}
              </div>
            )}

            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Button variant="primary" size="md" onClick={this.handleReload}>
                RE-INK THE PRESS (RELOAD)
              </Button>
              <Button variant="secondary" size="md" onClick={this.handleResetStorage}>
                RESET ARCHIVE & RECOVER
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
