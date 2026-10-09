import React from 'react';
import { Modal } from '../ui/Modal';
import { useWorkspaceStore } from '../../store/workspaceStore';

export function AboutModal() {
  const { aboutModalOpen, setAboutModalOpen } = useWorkspaceStore();

  return (
    <Modal
      isOpen={aboutModalOpen}
      onClose={() => setAboutModalOpen(false)}
      title="STACKTRACE // COLOPHON"
      subtitle="Colophon & Editorial Charter — Vol. IX"
      maxWidth="620px"
    >
      <div
        style={{
          fontFamily: 'var(--font-sans)',
          color: 'var(--text-primary)',
          fontSize: '14px',
          lineHeight: 1.6,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ textAlign: 'center', paddingBottom: '6px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h3
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: '2rem',
              fontWeight: 400,
              letterSpacing: '0.12em',
              margin: '6px 0 2px',
              textTransform: 'uppercase',
            }}
          >
            STACKTRACE
          </h3>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              color: 'var(--text-muted)',
              fontWeight: 600,
            }}
          >
            Essays · Stories · Ideas
          </div>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--accent)',
              marginTop: '6px',
            }}
          >
            Vol. IX — Autumn Archive · Issue No. 42
          </div>
        </div>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', margin: 0, lineHeight: 1.7 }}>
          <strong>STACKTRACE</strong> is an independent review of essays, critical commentary, and philosophical reflections. Dispatched away from the frenetic cadence of the modern feed, every piece is curated for quiet contemplation, slow reading, and long-term resonance.
        </p>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', margin: 0, lineHeight: 1.7 }}>
          We publish observers, critics, and thinkers examining craftsmanship, quiet technology, personal essays, and the architecture of mind. All dispatches are preserved under strict archival typography and digital broadsheet standards.
        </p>

        <div
          style={{
            padding: '16px 18px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-default)',
            fontSize: '13px',
            lineHeight: 1.5,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: '10px',
            }}
          >
            COLOPHON & TYPOGRAPHIC SPECIFICATION
          </div>
          <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>
              <strong>Display Headings:</strong> <em>EB Garamond</em> — classical editorial serif with timeless humanist proportions.
            </li>
            <li>
              <strong>Body Prose:</strong> <em>Newsreader</em> — crafted specifically for long-form reading comfort and cadence.
            </li>
            <li>
              <strong>Labels & Navigation:</strong> <em>DM Sans</em> — clean, geometric sans-serif for metadata and archival folios.
            </li>
            <li>
              <strong>Palette:</strong> Warm French rag paper (#FDF9F2), archival black ink (#1C1C18), and burgundy bookcloth accents (#5D2630 / #793C46).
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
