import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function AboutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Colophon & Charter — Marginalia';
  }, []);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '740px',
        margin: '0 auto',
        padding: '36px 0 64px',
        backgroundColor: 'transparent',
      }}
    >
      <header
        style={{
          textAlign: 'left',
          marginBottom: '36px',
          borderBottom: '1px solid var(--border-default)',
          paddingBottom: '24px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--accent)',
            display: 'block',
            marginBottom: '8px',
          }}
        >
          Editorial Colophon &amp; Charter
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.8rem',
            fontWeight: 400,
            letterSpacing: '-0.01em',
            color: 'var(--text-primary)',
            margin: '0 0 12px',
            lineHeight: 1.15,
          }}
        >
          About Marginalia
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            color: 'var(--text-secondary)',
            fontSize: '1.2rem',
            fontStyle: 'italic',
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          A quiet digital journal for writers and readers of literature.
        </p>
      </header>

      <article
        style={{
          lineHeight: 1.8,
          fontSize: '16.5px',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-serif)',
        }}
      >
        <p>
          <strong>Marginalia</strong> was created for writers who care about words and readers who appreciate quiet sentences. In an age of algorithmic urgency, engagement bait, and notification bell sirens, Marginalia offers the dignity of an open book.
        </p>

        <p>
          Here, authors compose directly on clean white paper with natural formatting tools—no raw markdown tags, no technical slugs, and no programmer jargon. Each piece is treated as an enduring work with authentic typographic fidelity.
        </p>

        <div
          style={{
            margin: '2.5rem 0',
            padding: '24px',
            border: '1px solid var(--border-default)',
            backgroundColor: 'var(--bg-surface)',
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
          }}
        >
          <div
            style={{
              color: 'var(--accent)',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            LITERARY TYPOGRAPHY &amp; AESTHETIC PRINCIPLES
          </div>
          <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: 1.6, margin: 0 }}>
            <li><strong>Classical Display Typography:</strong> Set in <em>EB Garamond</em> display serif for timeless humanist proportions.</li>
            <li><strong>Newsreader Prose:</strong> Optimized for high-density, fatigue-free long-form reading.</li>
            <li><strong>Paper &amp; Ink Palette:</strong> Pure paper tones, carbon ink, and deep oxblood &amp; amber accents. No glow, no heavy shadows.</li>
          </ul>
        </div>

        <div style={{ marginTop: '36px' }}>
          <button
            type="button"
            className="button-create"
            onClick={() => navigate('/')}
            style={{ padding: '10px 18px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft size={14} />
            <span>Return to Essays</span>
          </button>
        </div>
      </article>
    </div>
  );
}

export default AboutPage;
