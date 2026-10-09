import React from 'react';
import { countWords } from '../../lib/utils';

/**
 * Sidebar metadata card showing folio catalog metrics
 */
export function PostReaderCatalogCard({ essay }) {
  if (!essay) return null;

  return (
    <div
      style={{
        padding: '14px 16px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-1)',
        fontFamily: 'var(--font-sans)',
        fontSize: '11px',
        color: 'var(--text-muted)',
      }}
    >
      <div
        style={{
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '8px',
          color: 'var(--text-secondary)',
        }}
      >
        FOLIO CATALOG
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span>WORDS:</span>
        <span className="tabular-nums" style={{ color: 'var(--text-primary)' }}>
          {countWords(essay.content)}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span>READ TIME:</span>
        <span className="tabular-nums" style={{ color: 'var(--text-primary)' }}>
          {essay.readTimeMinutes} min
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>SECTION:</span>
        <span style={{ color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 600 }}>
          {essay.section || 'ESSAYS'}
        </span>
      </div>
    </div>
  );
}
