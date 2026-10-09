import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Literary Publisher Imprint
 * Brief, calm greeting on first visit celebrating Marginalia Press.
 * Dismisses instantly on Esc/Click or after 600ms, and never shows again in the session.
 */
export function BootSequence({ onComplete }) {
  const [isDismissed, setIsDismissed] = useState(
    Boolean(typeof window !== 'undefined' && sessionStorage.getItem('marginalia_imprint_seen'))
  );

  useEffect(() => {
    if (isDismissed) {
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      sessionStorage.setItem('marginalia_imprint_seen', 'true');
      setIsDismissed(true);
      onComplete?.();
    }, 650);

    const handleKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        sessionStorage.setItem('marginalia_imprint_seen', 'true');
        setIsDismissed(true);
        onComplete?.();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKey);
    };
  }, [isDismissed, onComplete]);

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => {
          sessionStorage.setItem('marginalia_imprint_seen', 'true');
          setIsDismissed(true);
          onComplete?.();
        }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          backgroundColor: 'var(--bg-canvas, #F7F5EE)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-serif, "Newsreader", serif)',
          color: 'var(--text-primary, #181613)',
          cursor: 'pointer',
        }}
      >
        <span className="fleuron" style={{ fontSize: '2.5rem', marginBottom: '12px', color: 'var(--accent, #8A3324)' }}>
          ❧
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.8rem',
            letterSpacing: '0.08em',
            margin: '0 0 6px',
            textTransform: 'uppercase',
            fontWeight: 700,
          }}
        >
          MARGINALIA
        </h1>
        <div
          style={{
            fontFamily: 'var(--font-sans, "Instrument Sans", sans-serif)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          A Journal of Software Craft & Systems Thought • Volume IV
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
