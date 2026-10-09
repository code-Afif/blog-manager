import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { ArrowLeft, Feather } from 'lucide-react';

export function AboutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'About & Colophon — Marginalia · हाशिया';
  }, []);

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        padding: '48px 24px 80px 24px',
        backgroundColor: 'var(--bg-canvas)',
        fontFamily: 'var(--font-serif)',
      }}
    >
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div className="fleuron" style={{ fontSize: '2.4rem', color: 'var(--accent)', marginBottom: '8px' }}>
            ❧
          </div>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--text-muted)',
              marginBottom: '10px',
            }}
          >
            Editorial Charter & Colophon
          </div>
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '0 0 6px',
              lineHeight: 1.2,
            }}
          >
            About Marginalia
          </h1>
          <div
            style={{
              fontSize: '1.2rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-serif-hi)',
              marginBottom: '12px',
            }}
          >
            हाशिया
          </div>
          <p
            style={{
              fontStyle: 'italic',
              color: 'var(--text-secondary)',
              fontSize: '1.05rem',
              margin: 0,
            }}
          >
            A literary quarterly dedicated to English and Hindi literature.
          </p>
        </header>

        <article style={{ lineHeight: 1.7, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
          <p className="drop-cap">
            Marginalia was founded on a simple conviction: that the vibrant literary traditions of English and Hindi—their poetry, fiction, critical debates, and cross-lingual friendships—deserve the typographic dignity and patient pacing of a printed quarterly journal.
          </p>

          <p>
            Every essay cataloged in this volume is an original exploration of the literary imagination. We publish native writing in two languages: in English prose and in Hindi (Devanagari script). Authors reflect on classical poets like Kabir and Tulsidas, modern fiction pioneers like Premchand and Phanishwar Nath Renu, and the enduring craft of reading slowly.
          </p>

          <p>
            Essays are framed with classical epigraphs, typeset pull quotes, and scholarly footnotes. Readers may browse across languages or literary sections, preserve folios to their private shelf, offer appreciations, and inscribe marginal commentary directly into the journal.
          </p>

          <div className="fleuron-divider">
            <span className="fleuron">§</span>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1rem' }}>
            Colophon & Typographic Specification
          </h2>

          <p>
            The interface of <em>Marginalia</em> adheres to strict letterpress aesthetic principles with full multilingual typographic integrity:
          </p>

          <ul style={{ paddingLeft: '1.5rem', margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>
              <strong>English Display & Body:</strong> Typeset in <em>Newsreader</em> (Production Type), an optical-size serif cut for sustained continuous reading with delicate bracketed serifs.
            </li>
            <li>
              <strong>Hindi (Devanagari):</strong> Typeset in <em>Noto Serif Devanagari</em>, calibrated with generous line-height (~1.9) to preserve complex conjuncts, matras, and shirorekha continuity.
            </li>
            <li>
              <strong>Interface Hierarchy:</strong> Labeled in <em>Instrument Sans</em>, providing a crisp, neutral typographic counterpoint for metadata, counters, and navigation.
            </li>
            <li>
              <strong>Layout Architecture:</strong> Implemented via CSS logical properties (<code>margin-inline-start</code>, <code>border-inline-start</code>) and responsive typographic scaling.
            </li>
            <li>
              <strong>Chromatic Palette:</strong> Strictly flat, unbleached rag paper tone (<code>#F7F5EE</code>) in day mode, transitioning to a midnight library tone (<code>#131210</code>) in night mode. Zero gradients, zero glows, zero drop shadows.
            </li>
          </ul>

          <div
            style={{
              marginTop: '3rem',
              padding: '24px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-1)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Volume IV • A Quarterly Journal of English & Hindi Letters
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Button variant="primary" size="md" onClick={() => navigate('/')}>
                <ArrowLeft size={13} />
                RETURN TO TABLE OF CONTENTS
              </Button>
              <Button variant="secondary" size="md" onClick={() => navigate('/write')}>
                <Feather size={13} />
                COMPOSE AN ESSAY (WRITE)
              </Button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
