import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Terminal Initialization Imprint
 * Brief, crisp technical imprint on first visit celebrating STACKTRACE.
 * Dismisses instantly on Esc/Click or after 500ms, and never shows again in the session.
 */
export function BootSequence({ onComplete }) {
  const [isDismissed, setIsDismissed] = useState(
    Boolean(typeof window !== 'undefined' && sessionStorage.getItem('stacktrace_imprint_seen'))
  );

  useEffect(() => {
    if (isDismissed) {
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      sessionStorage.setItem('stacktrace_imprint_seen', 'true');
      setIsDismissed(true);
      onComplete?.();
    }, 550);

    const handleKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        sessionStorage.setItem('stacktrace_imprint_seen', 'true');
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
        transition={{ duration: 0.18, ease: 'easeOut' }}
        onClick={() => {
          sessionStorage.setItem('stacktrace_imprint_seen', 'true');
          setIsDismissed(true);
          onComplete?.();
        }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          backgroundColor: 'var(--bg-canvas, #F6F5EF)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-primary, #171A1C)',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--text-primary, #171A1C)',
            color: 'var(--bg-canvas, #F6F5EF)',
            padding: '4px 10px',
            fontSize: '14px',
            fontWeight: 700,
            marginBottom: '16px',
          }}
        >
          &gt;_
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-headline, "Space Grotesk", sans-serif)',
            fontSize: '2rem',
            letterSpacing: '-0.02em',
            margin: '0 0 6px',
            textTransform: 'uppercase',
            fontWeight: 700,
          }}
        >
          STACKTRACE // [DEV_01]
        </h1>
        <div
          style={{
            fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
            fontSize: '12px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--accent, #F06432)',
            fontWeight: 600,
          }}
        >
          Thoughts on code. Notes from the build.
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
