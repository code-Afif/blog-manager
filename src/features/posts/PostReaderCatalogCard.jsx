import React from 'react';
import { countWords } from '../../lib/utils';

/**
 * Sidebar metadata card showing archival registry details
 */
export function PostReaderCatalogCard({ essay }) {
  if (!essay) return null;

  return (
    <div
      style={{
        padding: '16px 18px',
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-default)',
        borderRadius: '12px',
        fontFamily: 'var(--font-sans)',
        fontSize: '12px',
        color: 'var(--text-muted)',
      }}
    >
      <div
        style={{
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginBottom: '12px',
          color: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span>ARCHIVAL REGISTRY</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span>Length:</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
          {countWords(essay.content)} words
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span>Reading Cadence:</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
          {essay.readTimeMinutes} min read
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span>Folio Section:</span>
        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
          {essay.section || 'Culture'}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Edition:</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
          Vol. IX, No. {essay.essayNumber || 42}
        </span>
      </div>
    </div>
  );
}
