import { useState, useRef, useCallback } from 'react';
import { scrambleText } from '../lib/utils';

export function useScrambleText(originalText) {
  const [displayText, setDisplayText] = useState(originalText);
  const cancelRef = useRef(null);
  const hasTriggeredRef = useRef(false);

  const trigger = useCallback(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    if (cancelRef.current) cancelRef.current();
    cancelRef.current = scrambleText(originalText, setDisplayText, 300);

    setTimeout(() => {
      hasTriggeredRef.current = false;
    }, 600);
  }, [originalText]);

  return { displayText, trigger };
}
