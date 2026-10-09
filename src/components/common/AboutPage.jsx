import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function AboutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Colophon & Editorial Charter — STACKTRACE (Vol. IX)';
  }, []);

  return (
    <div
      style={{
        width: '100%',
        padding: '56px 24px 96px 24px',
        backgroundColor: 'var(--bg-canvas)',
      }}
    >
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        <header style={{ textAlign: 'left', marginBottom: '40px', borderBottom: '1px solid var(--border-default)', paddingBottom: '28px' }}>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--accent)',
              marginBottom: '12px',
            }}
          >
            VOL. IX — AUTUMN ARCHIVE · ISSUE NO. 42
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: '3.2rem',
              fontWeight: 400,
              letterSpacing: '0.04em',
              color: 'var(--text-primary)',
              margin: '0 0 12px',
              lineHeight: 1.1,
            }}
          >
            About STACKTRACE
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--text-secondary)',
              fontSize: '1.25rem',
              fontStyle: 'italic',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Essays, stories, and reflections on the things worth paying attention to.
          </p>
        </header>

        <article
          style={{
            lineHeight: 1.8,
            fontSize: '17px',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)',
          }}
        >
          <p>
            <strong>STACKTRACE</strong> is an archival review of essays, critical commentary, and philosophical discourse. Dispatched away from the frenetic cadence of the modern feed, every dispatch is written by observers, critics, and thinkers who demand deliberate thought and careful attention.
          </p>

          <p>
            We curate long-form dispatches spanning culture, personal essays, philosophy, quiet technology, and the architecture of mind. Our mission is to restore the restorative geometry of pause, hesitation, and starting from a blank sheet of paper in an over-optimized world.
          </p>

          <div
            style={{
              margin: '2.5rem 0',
              padding: '24px',
              border: '1px solid var(--border-default)',
              backgroundColor: 'var(--bg-surface-elevated)',
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
            }}
          >
            <div style={{ color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
              EDITORIAL CHARTER & TYPOGRAPHY
            </div>
            <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: 1.6 }}>
              <li><strong>Classical Display Typography:</strong> Set in <em>EB Garamond</em> display serif for timeless humanist proportions and monumental mastheads.</li>
              <li><strong>Newsreader Prose:</strong> Optimized for high-density, fatigue-free long-form reading on digital and archival mediums.</li>
              <li><strong>DM Sans Navigational Hierarchy:</strong> Clean, crisp sans-serif folios for metadata, issue numbers, and archival pagination.</li>
              <li><strong>Archival Rag Paper Palette:</strong> Warm rag paper (#FDF9F2), archival black ink (#1C1C18), and burgundy bookcloth accents (#5D2630 / #793C46).</li>
            </ul>
          </div>

          <div style={{ marginTop: '40px' }}>
            <button
              type="button"
              className="button-primary hard-press"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={14} />
              RETURN TO DISPATCHES
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
