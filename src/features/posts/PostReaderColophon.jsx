import React from 'react';

/**
 * Literary Review colophon note at base of each article
 */
export function PostReaderColophon() {
  return (
    <footer
      style={{
        marginTop: '4rem',
        paddingTop: '2rem',
        borderTop: '1px solid var(--border-default)',
        fontFamily: 'var(--font-sans)',
        fontSize: '12px',
        color: 'var(--text-muted)',
        lineHeight: 1.6,
        textAlign: 'center',
      }}
    >
      <div>
        Published in <strong>Marginalia Literary Review &amp; Essay Journal</strong>.
      </div>
      <div style={{ marginTop: '4px', fontSize: '11px' }}>
        Typeset in EB Garamond and Newsreader, with Noto Serif Devanagari and Noto Nastaliq Urdu. Preserved on archival paper standards.
      </div>
    </footer>
  );
}
