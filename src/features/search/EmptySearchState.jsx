import React from 'react';
import { RefreshCw, Feather } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function EmptySearchState({ query = '', onReset }) {
  return (
    <div
      style={{
        padding: '48px 24px',
        margin: '24px 0',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-1)',
        textAlign: 'center',
        fontFamily: 'var(--font-serif)',
      }}
    >
      <div className="fleuron" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>❧</div>
      <div
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--text-muted)',
          marginBottom: '8px',
        }}
      >
        Archive Query
      </div>

      <h3
        style={{
          fontSize: '1.3rem',
          color: 'var(--text-primary)',
          fontWeight: 600,
          marginBottom: '10px',
        }}
      >
        {query
          ? `Nothing in the archive matches ‘${query}’.`
          : 'Nothing in the archive matches the selected filters.'}
      </h3>

      <p
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '15px',
          color: 'var(--text-muted)',
          lineHeight: 1.6,
          maxWidth: '48ch',
          margin: '0 auto 20px',
        }}
      >
        Try another word, or browse by language or section.
      </p>

      {onReset && (
        <Button variant="secondary" size="md" onClick={onReset}>
          <RefreshCw size={12} />
          CLEAR INQUIRY FILTERS
        </Button>
      )}
    </div>
  );
}

export function EmptyShelfState({ onExplore }) {
  return (
    <div
      style={{
        padding: '54px 24px',
        margin: '24px 0',
        backgroundColor: 'var(--bg-surface)',
        border: '1px dashed var(--border-default)',
        borderRadius: 'var(--radius-1)',
        textAlign: 'center',
        fontFamily: 'var(--font-serif)',
      }}
    >
      <div className="fleuron" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>❧</div>
      <div
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--text-muted)',
          marginBottom: '8px',
        }}
      >
        Reading Shelf
      </div>

      <h3
        style={{
          fontSize: '1.3rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: '10px',
        }}
      >
        Your shelf is empty. Mark an essay to keep it here.
      </h3>

      <p
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '15px',
          color: 'var(--text-muted)',
          maxWidth: '52ch',
          margin: '0 auto 22px',
          lineHeight: 1.6,
        }}
      >
        When an essay warrants closer contemplation, select the bookmark icon or press <kbd className="kbd-chip">B</kbd> while reading to shelve it here.
      </p>

      {onExplore && (
        <Button variant="primary" size="md" onClick={onExplore}>
          EXPLORE THE TABLE OF CONTENTS
        </Button>
      )}
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
        borderRadius: 'var(--radius-1)',
        textAlign: 'center',
        fontFamily: 'var(--font-serif)',
      }}
    >
      <div className="fleuron" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>❧</div>
      <div
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--text-muted)',
          marginBottom: '8px',
        }}
      >
        The Desk is Cleared
      </div>

      <h3
        style={{
          fontSize: '1.3rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: '10px',
        }}
      >
        No essays or drafts await your hand
      </h3>

      <p
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '15px',
          color: 'var(--text-muted)',
          maxWidth: '50ch',
          margin: '0 auto 22px',
          lineHeight: 1.6,
        }}
      >
        Dip your pen and compose a new essay in English, Hindi, or Urdu. Drafts are safely preserved in local storage and will never appear on the public journal until published.
      </p>

      {onWrite && (
        <Button variant="primary" size="md" onClick={onWrite}>
          <Feather size={13} />
          BEGIN A NEW ESSAY
        </Button>
      )}
    </div>
  );
}
