import React from 'react';
import { motion } from 'framer-motion';

function SingleDigit({ digit }) {
  const num = parseInt(digit, 10);
  if (isNaN(num)) {
    return <span>{digit}</span>;
  }

  return (
    <div
      style={{
        display: 'inline-block',
        height: '1.2em',
        lineHeight: '1.2em',
        overflow: 'hidden',
        verticalAlign: 'bottom',
        position: 'relative',
        width: '0.62em',
        textAlign: 'center',
      }}
    >
      <motion.div
        initial={false}
        animate={{ y: -num * 1.2 + 'em' }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span key={n} style={{ height: '1.2em', lineHeight: '1.2em' }}>
            {n}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function RollingCounter({ value }) {
  const digits = String(value).split('');

  return (
    <span
      className="tabular-nums font-mono"
      style={{ display: 'inline-flex', alignItems: 'center', letterSpacing: '-0.02em' }}
    >
      {digits.map((d, i) => (
        <SingleDigit key={i} digit={d} />
      ))}
    </span>
  );
}
