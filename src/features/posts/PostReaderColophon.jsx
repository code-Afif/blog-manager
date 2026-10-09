import React from 'react';

/**
 * Colophon note at base of each essay
 */
export function PostReaderColophon() {
  return (
    <footer
      style={{
        marginTop: '4rem',
        paddingTop: '2rem',
        borderTop: '1px solid var(--border-default)',
        fontFamily: 'var(--font-serif)',
        fontSize: '13px',
        color: 'var(--text-muted)',
        lineHeight: 1.6,
        textAlign: 'center',
      }}
    >
      <div>
        Published in <em>Marginalia</em> (हाशिया), Volume IV. Typeset in Newsreader and Noto Serif Devanagari.
      </div>
      <div
        style={{
          marginTop: '4px',
          fontSize: '11px',
          fontFamily: 'var(--font-sans)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        A Literary Quarterly in English & Hindi • Preserved in Archival Storage
      </div>
    </footer>
  );
}
