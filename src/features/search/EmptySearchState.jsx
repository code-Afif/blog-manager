import React from 'react';
import { RefreshCw, Terminal, Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function EmptySearchState({ query = '', onReset }) {
  return (
    <div
      style={{
        padding: '48px 24px',
        margin: '24px 0',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 0,
        textAlign: 'center',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--accent)', marginBottom: '8px' }}>
        [!] 404_QUERY_NOT_FOUND
      </div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--text-muted)',
          marginBottom: '8px',
        }}
      >
        INDEX SEARCH PROTOCOL
      </div>

      <h3
        style={{
          fontSize: '1.25rem',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          marginBottom: '10px',
        }}
      >
        {query
          ? `Zero dispatches match token pattern: "${query}"`
          : 'Zero dispatches match the selected taxonomy filter.'}
      </h3>

      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '14px',
          color: 'var(--text-muted)',
          lineHeight: 1.6,
          maxWidth: '52ch',
          margin: '0 auto 20px',
        }}
      >
        Adjust query tokens, verify technical section filters, or clear active parameters to browse all system dispatches.
      </p>

      {onReset && (
        <Button variant="secondary" size="md" onClick={onReset} style={{ borderRadius: 0 }}>
          <RefreshCw size={12} />
          <span>RESET FILTER ENGINE</span>
        </Button>
      )}
    </div>
  );
}

export function EmptyShelfState({ onExplore, filterType = 'bookmarks', onSignIn, isAuthenticated = false }) {
  const isLiked = filterType === 'liked';

  return (
    <div
      style={{
        padding: '54px 24px',
        margin: '24px 0',
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px dashed var(--border-default)',
        borderRadius: 0,
        textAlign: 'center',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: 'var(--accent)',
          marginBottom: '8px',
        }}
      >
        {isLiked ? 'Appreciation Archive' : 'Preserved Reading Shelf'}
      </div>

      <h3
        style={{
          fontSize: '1.45rem',
          fontWeight: 400,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-display)',
          marginBottom: '10px',
        }}
      >
        {isLiked
          ? 'No dispatches appreciated yet'
          : 'Your preserved reading shelf is currently empty'}
      </h3>

      <p
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '15px',
          color: 'var(--text-muted)',
          maxWidth: '52ch',
          margin: '0 auto 24px',
          lineHeight: 1.6,
        }}
      >
        {isLiked
          ? 'Essays and long reads you appreciate with a heart will be recorded here for convenient return.'
          : 'Preserve thoughtful dispatches, essays, and stories for slow reading by clicking the bookmark icon or pressing B.'}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {onExplore && (
          <Button variant="primary" size="md" onClick={onExplore} style={{ borderRadius: 0, backgroundColor: 'var(--accent-container, #793C46)', color: '#FFFFFF' }}>
            <span>EXPLORE DISPATCHES</span>
          </Button>
        )}
        {!isAuthenticated && onSignIn && (
          <Button variant="secondary" size="md" onClick={onSignIn} style={{ borderRadius: 0 }}>
            <span>SIGN IN TO SYNC</span>
          </Button>
        )}
      </div>
    </div>
  );
}

export function EmptyDeskState({ onWrite }) {
  return (
    <div
      style={{
        padding: '54px 24px',
        margin: '24px 0',
        backgroundColor: 'var(--bg-surface)',
        border: '1px dashed var(--border-default)',
        borderRadius: 0,
        textAlign: 'center',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--accent)', marginBottom: '8px' }}>
        &gt;_ BUFFER_EMPTY
      </div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--text-muted)',
          marginBottom: '8px',
        }}
      >
        AUTHORING REGISTER
      </div>

      <h3
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-display)',
          marginBottom: '10px',
        }}
      >
        No pending drafts or personal dispatches in memory
      </h3>

      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '14px',
          color: 'var(--text-muted)',
          maxWidth: '52ch',
          margin: '0 auto 22px',
          lineHeight: 1.6,
        }}
      >
        Initialize a new deep-dive dispatch or engineering post-mortem in markdown. All drafts are automatically synced to localStorage.
      </p>

      {onWrite && (
        <Button variant="primary" size="md" onClick={onWrite} style={{ borderRadius: 0 }}>
          <Plus size={13} />
          <span>COMPOSE NEW DISPATCH</span>
        </Button>
      )}
    </div>
  );
}
