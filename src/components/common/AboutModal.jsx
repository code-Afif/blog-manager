import React from 'react';
import { Modal } from '../ui/Modal';
import { useWorkspaceStore } from '../../store/workspaceStore';

export function AboutModal() {
  const { aboutModalOpen, setAboutModalOpen } = useWorkspaceStore();

  return (
    <Modal
      isOpen={aboutModalOpen}
      onClose={() => setAboutModalOpen(false)}
      title="ABOUT MARGINALIA"
      subtitle="Colophon & Editorial Charter"
      maxWidth="600px"
    >
      <div
        style={{
          fontFamily: 'var(--font-serif)',
          color: 'var(--text-primary)',
          fontSize: '15px',
          lineHeight: 1.65,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ textAlign: 'center', paddingBottom: '6px' }}>
          <span className="fleuron" style={{ fontSize: '2rem', color: 'var(--accent)' }}>❧</span>
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.4rem',
              fontWeight: 700,
              margin: '6px 0 2px',
            }}
          >
            Marginalia
          </h3>
          <div
            style={{
              fontSize: '1rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-serif-hi)',
              margin: '2px 0 6px',
            }}
          >
            हाशिया · حاشیہ
          </div>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--text-muted)',
              fontWeight: 600,
            }}
          >
            A Literary Quarterly • English · हिन्दी · اردو
          </div>
        </div>

        <p style={{ margin: 0 }}>
          <em>Marginalia</em> is an independent digital quarterly modeled on the aesthetic dignity of classical letterpress printing. It publishes original literary criticism, essays, and meditations on English, Hindi, and Urdu literature.
        </p>

        <p style={{ margin: 0 }}>
          From Kabir and Ghalib to Premchand, Manto, and modern world letters, each piece is presented with authentic typographic care: native scripts, classical epigraphs, pull quotes, scholarly footnotes, and bidirectional reader margins.
        </p>

        <div
          style={{
            padding: '14px 16px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-1)',
            fontSize: '13px',
            lineHeight: 1.5,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: '8px',
            }}
          >
            COLOPHON & TYPOGRAPHIC SPECIFICATION
          </div>
          <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>
              <strong>English Typography:</strong> <em>Newsreader</em> (Production Type) — an optical-size serif cut for sustained contemplation.
            </li>
            <li>
              <strong>Hindi Typography:</strong> <em>Noto Serif Devanagari</em> — crafted for clear Devanagari ligatures and conjuncts.
            </li>
            <li>
              <strong>Urdu Typography:</strong> <em>Noto Nastaliq Urdu</em> — authentic right-to-left Nastaliq script with generous vertical spacing (2.1–2.4).
            </li>
            <li>
              <strong>Interface Hierarchy:</strong> <em>Instrument Sans</em> — clear modern grotesque for navigational cues and metadata.
            </li>
            <li>
              <strong>Color Palette:</strong> Flat rag paper tone (<code>#F7F5EE</code>), iron-gall ink (<code>#181613</code>), and Venetian red accents. Strictly zero gradients.
            </li>
          </ul>
        </div>

        <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', paddingTop: '4px' }}>
          Published quarterly by the editorial collective.
        </div>
      </div>
    </Modal>
  );
}
