import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * Adjacent Folio Navigation (Previous / Next Essay)
 */
export function PostReaderAdjacentNav({ adjacent }) {
  if (!adjacent.prevEssay && !adjacent.nextEssay) return null;

  return (
    <nav
      aria-label="Previous and Next Essays"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        margin: '2rem 0 3rem 0',
      }}
    >
      {adjacent.prevEssay ? (
        <Link
          to={`/essays/${adjacent.prevEssay.slug}`}
          style={{
            padding: '16px 18px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-default)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            textDecoration: 'none',
            transition: 'border-color var(--duration-calm)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-default)')}
        >
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={11} /> PREVIOUS DISPATCH
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 400, color: 'var(--text-primary)', fontSize: '1.15rem', lineHeight: 1.3 }}>
            {adjacent.prevEssay.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {adjacent.nextEssay ? (
        <Link
          to={`/essays/${adjacent.nextEssay.slug}`}
          style={{
            padding: '16px 18px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-default)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '4px',
            textDecoration: 'none',
            textAlign: 'right',
            transition: 'border-color var(--duration-calm)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-default)')}
        >
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 600,
            }}
          >
            NEXT DISPATCH <ArrowRight size={11} />
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 400, color: 'var(--text-primary)', fontSize: '1.15rem', lineHeight: 1.3 }}>
            {adjacent.nextEssay.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
