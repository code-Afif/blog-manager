import React from 'react';
import { Modal } from '../ui/Modal';
import { useWorkspaceStore } from '../../store/workspaceStore';

export function AboutModal() {
  const { aboutModalOpen, setAboutModalOpen } = useWorkspaceStore();

  return (
    <Modal
      isOpen={aboutModalOpen}
      onClose={() => setAboutModalOpen(false)}
      title="Marginalia Colophon"
      subtitle="Editorial Charter & Literary Typography"
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
        <div style={{ textAlign: 'center', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.4rem',
              fontWeight: 400,
              letterSpacing: '0.02em',
              margin: '6px 0 2px',
            }}
          >
            Marginalia
          </h3>
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '14px',
              fontStyle: 'italic',
              color: 'var(--text-muted)',
            }}
          >
            A Journal of Slow Literature, Thought, and Translation
          </div>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--accent)',
              marginTop: '6px',
            }}
          >
            English · हिन्दी · اردو
          </div>
        </div>

        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', margin: 0, lineHeight: 1.7 }}>
          <strong>Marginalia</strong> is a quiet digital journal for writers and readers of literature. Built away from algorithmic feeds, vanity metrics, and rushed consumption, every essay and note is presented with classical paper-and-ink dignity.
        </p>

        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', margin: 0, lineHeight: 1.7 }}>
          We welcome original reflections across English, Hindi, and Urdu. The platform honors non-technical writers with a peaceful rich-text writing flow, bidirectional typesetting, and thoughtful readers’ marginal notes.
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
            TYPOGRAPHY & LITERARY CHARTER
          </div>
          <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>
              <strong>Display Headings:</strong> <em>EB Garamond</em> — classical humanist serif with high-contrast cuts.
            </li>
            <li>
              <strong>Body Prose:</strong> <em>Newsreader</em> — designed specifically for sustained long-form literary comfort.
            </li>
            <li>
              <strong>Multilingual Scripts:</strong> <em>Noto Serif Devanagari</em> for Hindi and <em>Noto Nastaliq Urdu</em> &amp; <em>Amiri</em> for Urdu bidirectional prose.
            </li>
            <li>
              <strong>Palette:</strong> Warm book paper, archival carbon ink, and deep oxblood &amp; amber accents.
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
