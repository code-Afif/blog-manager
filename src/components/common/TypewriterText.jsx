import React, { useState, useEffect } from 'react';

export function TypewriterText({ text = '', speed = 28, delay = 100, onComplete, className }) {
  const [displayed, setDisplayed] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayed('');
    setIsTyping(true);

    let current = 0;
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (current < text.length) {
          setDisplayed(text.slice(0, current + 1));
          current++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
          onComplete?.();
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, delay, onComplete]);

  return (
    <span className={className}>
      {displayed}
      <span className="block-cursor" aria-hidden="true" />
    </span>
  );
}
