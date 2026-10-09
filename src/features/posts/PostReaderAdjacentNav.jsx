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
        fontFamily: 'var(--font-serif)',
      }}
    >
      {adjacent.prevEssay ? (
        <Link
          to={`/essays/${adjacent.prevEssay.slug}`}
          style={{
            padding: '16px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            textDecoration: 'none',
            transition: 'border-color var(--duration-calm)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-default)')}
        >
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <ArrowLeft size={11} /> PREVIOUS FOLIO
          </span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem', lineHeight: 1.3 }}>
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
            padding: '16px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            textAlign: 'right',
            textDecoration: 'none',
            transition: 'border-color var(--duration-calm)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-default)')}
        >
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '4px',
            }}
          >
            NEXT FOLIO <ArrowRight size={11} />
          </span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem', lineHeight: 1.3 }}>
            {adjacent.nextEssay.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
