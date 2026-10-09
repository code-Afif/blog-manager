import React from 'react';
import { Terminal, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function EmptySearchState({ query = '', onReset }) {
  return (
    <div
      style={{
        padding: '36px 20px',
        margin: '20px 0',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-1)',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-muted)',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '12px',
        }}
      >
        <Terminal size={14} style={{ color: 'var(--accent)' }} />
        <span>STDOUT // GREP SCAN FINISHED</span>
      </div>

      <div
        style={{
          fontSize: '14px',
          color: 'var(--text-primary)',
          fontWeight: 600,
          marginBottom: '8px',
        }}
      >
        $ grep -rn "{query}" ./posts/ &rarr; 0 matches found
      </div>

      <div
        style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          lineHeight: 1.6,
          marginBottom: '16px',
        }}
      >
        <div>&gt; hint 1: check spelling or try terms like "rust", "postgres", "docker", "raft"</div>
        <div>&gt; hint 2: search covers article titles, code blocks, and tag categories</div>
      </div>

      {onReset && (
        <Button variant="secondary" size="sm" onClick={onReset}>
          <RefreshCw size={12} />
          CLEAR FILTERS
        </Button>
      )}
    </div>
  );
}

export function EmptyStashState({ onExplore }) {
  return (
    <div
      style={{
        padding: '36px 20px',
        margin: '20px 0',
        backgroundColor: 'var(--bg-surface)',
        border: '1px dashed var(--border-default)',
        borderRadius: 'var(--radius-1)',
        fontFamily: 'var(--font-mono)',
        textAlign: 'center',
      }}
    >
      <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '8px' }}>
        $ git stash list &rarr; (0 entries)
      </div>
      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
        No files currently stashed in workspace
      </div>
      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '13px',
          color: 'var(--text-muted)',
          maxWidth: '420px',
          margin: '0 auto 16px',
        }}
      >
        Click the bookmark icon or press <span className="kbd-chip">B</span> while reading any markdown article to stash it here for offline reading.
      </p>
      {onExplore && (
        <Button variant="primary" size="sm" onClick={onExplore}>
          EXPLORE POSTS
        </Button>
      )}
    </div>
  );
}
