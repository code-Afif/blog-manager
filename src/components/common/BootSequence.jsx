import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_LOGS = [
  '> initializing devlog kernel v1.0.4...',
  '> mounting virtual workspace filesystem...',
  '> loading posts... 15 markdown files verified',
  '> terminal workspace ready.',
];

export function BootSequence({ onComplete }) {
  const [lines, setLines] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Check if boot already executed in this session
    const hasBooted = sessionStorage.getItem('devlog_boot_done');
    if (hasBooted) {
      onComplete?.();
      return;
    }

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < BOOT_LOGS.length) {
        setLines((prev) => [...prev, BOOT_LOGS[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          sessionStorage.setItem('devlog_boot_done', 'true');
          setIsFinished(true);
          onComplete?.();
        }, 250);
      }
    }, 240);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        skip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  const skip = () => {
    sessionStorage.setItem('devlog_boot_done', 'true');
    setIsFinished(true);
    onComplete?.();
  };

  if (isFinished) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={skip}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100000,
          backgroundColor: '#0C0E10',
          color: '#D8DEE4',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '24px',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '560px',
            backgroundColor: '#12161A',
            border: '1px solid #232A31',
            borderRadius: '2px',
            padding: '16px 20px',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            lineHeight: 1.6,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #232A31',
              paddingBottom: '8px',
              marginBottom: '12px',
              fontSize: '11px',
              color: '#7A8691',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <span>BIOS // DEVLOG_BOOT_SEQ</span>
            <span style={{ color: '#C6F432' }}>[ESC] TO SKIP</span>
          </div>

          <div style={{ minHeight: '100px' }}>
            {lines.map((line, idx) => (
              <div
                key={idx}
                style={{
                  color: line.includes('ready') ? '#C6F432' : '#D8DEE4',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {line}
              </div>
            ))}
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '14px',
                backgroundColor: '#C6F432',
                verticalAlign: '-2px',
                animation: 'cursor-blink 0.8s steps(1) infinite',
              }}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
