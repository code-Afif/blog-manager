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
        Published in <strong>STACKTRACE Literary Review &amp; Essay Journal (Vol. IX)</strong>.
      </div>
      <div style={{ marginTop: '4px', fontSize: '11px' }}>
        Printed types set digitally in EB Garamond and Newsreader, with titling in DM Sans. ISSN: 2768-9123. Dispatched on archival rag paper standards.
      </div>
    </footer>
  );
}
