import React from 'react';
import { Link } from 'react-router-dom';

/**
 * PublicationFooter — Official MARGINALIA Editorial Broadsheet Footer
 * Matches Section 6 from StitchMCP design.
 */
export function PublicationFooter() {
  return (
    <footer
      style={{
        width: '100%',
        borderTop: '1px solid var(--border-default)',
        backgroundColor: 'var(--bg-surface-elevated)',
        padding: '48px 24px 40px',
        color: 'var(--text-primary)',
        marginTop: 'auto',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Top Row: Brand & Publication Links */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '32px',
            paddingBottom: '36px',
            borderBottom: '1px solid var(--border-default)',
          }}
        >
          <div>
            <span
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: '2rem',
                fontWeight: 400,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'block',
              }}
            >
              MARGINALIA
            </span>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'var(--text-secondary)',
                maxWidth: '400px',
                marginTop: '6px',
                lineHeight: 1.5,
              }}
            >
              An independent literary journal of essays, criticism, and philosophical marginalia. Dispatched without haste.
            </p>
          </div>

          {/* Links */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '24px',
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
            }}
          >
            <Link
              to="/"
              style={{ color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: '4px' }}
            >
              Current Issue (Vol. IX)
            </Link>
            <Link
              to="/?section=Culture"
              style={{ color: 'var(--text-secondary)', textDecoration: 'underline', textUnderlineOffset: '4px' }}
            >
              Archival Index
            </Link>
            <Link
              to="/desk"
              style={{ color: 'var(--text-secondary)', textDecoration: 'underline', textUnderlineOffset: '4px' }}
            >
              Letters from the Journal
            </Link>
            <Link
              to="/about"
              style={{ color: 'var(--text-secondary)', textDecoration: 'underline', textUnderlineOffset: '4px' }}
            >
              Colophon &amp; Masthead
            </Link>
            <Link
              to="/write"
              style={{ color: 'var(--text-secondary)', textDecoration: 'underline', textUnderlineOffset: '4px' }}
            >
              Submissions &amp; Guidelines
            </Link>
            <Link
              to="/about"
              style={{ color: 'var(--text-secondary)', textDecoration: 'underline', textUnderlineOffset: '4px' }}
            >
              Privacy &amp; Terms
            </Link>
          </div>
        </div>

        {/* Bottom Row: Exact Copyright Text & Archival Standard Notice */}
        <div
          style={{
            paddingTop: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '13px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-body)',
          }}
        >
          <p style={{ margin: 0 }}>
            © 2025 Marginalia Literary Review &amp; Essay Journal. All rights reserved. ISSN 2768-9123. Printed &amp; dispatched digitally on archival standards.
          </p>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              color: 'var(--accent)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>Printed on Rag Paper Web</span>
            <span>·</span>
            <span>Vol. IX, No. 42</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
