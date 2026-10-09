import React from 'react';

/**
 * Editorial Literary Journal Masthead Header for Table of Contents
 */
export function PostIndexMasthead({ indexView }) {
  return (
    <header
      style={{
        borderBottom: '1px solid var(--border-default)',
        paddingBottom: '24px',
        marginBottom: '24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          fontFamily: 'var(--font-sans)',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: '8px',
        }}
      >
        <span>A LITERARY QUARTERLY</span>
        <span>•</span>
        <span>ENGLISH · HINDI · URDU</span>
        <span>•</span>
        <span>VOLUME IV, SPRING 2026</span>
      </div>

      <div style={{ margin: '6px 0' }}>
        <span className="fleuron" style={{ fontSize: '2.4rem', color: 'var(--accent)' }}>❧</span>
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '3.1rem',
          fontWeight: 700,
          letterSpacing: '0.04em',
          color: 'var(--text-primary)',
          margin: '0 0 4px 0',
          lineHeight: 1.1,
          textTransform: 'uppercase',
        }}
      >
        Marginalia
      </h1>

      {/* Trilingual Subtitle: हाशिया · حاشیہ */}
      <div
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.15rem',
          color: 'var(--accent)',
          letterSpacing: '0.06em',
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        <span lang="hi" style={{ fontFamily: 'var(--font-serif-hi)', fontWeight: 500 }}>हाशिया</span>
        <span style={{ opacity: 0.5 }}>·</span>
        <span lang="ur" dir="rtl" style={{ fontFamily: 'var(--font-serif-ur)', fontWeight: 500, lineHeight: 1.6 }}>حاشیہ</span>
      </div>

      <p
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.1rem',
          fontStyle: 'italic',
          color: 'var(--text-secondary)',
          maxWidth: '60ch',
          margin: '0 auto',
          lineHeight: 1.5,
        }}
      >
        A quarterly digital journal devoted to English, Hindi, and Urdu literature, poetry, criticism, and the art of translation.
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          marginTop: '16px',
          fontFamily: 'var(--font-sans)',
          fontSize: '11px',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        <span>ISSUE NO. 04</span>
        <span>•</span>
        <span>EIGHTEEN ESSAYS</span>
        <span>•</span>
        <span>{indexView === 'shelf' ? 'PRIVATE SHELF VIEW' : 'FULL CATALOGUE'}</span>
      </div>
    </header>
  );
}
