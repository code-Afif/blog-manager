import { useEffect, useRef } from 'react';

/**
 * Hook to listen for developer workspace keyboard shortcuts
 */
export function useHotkeys(keyMap, enabled = true) {
  const gSequenceRef = useRef(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(e) {
      // Don't trigger standard shortcuts if user is typing in an input, textarea, or contentEditable
      const target = e.target;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.tagName === 'SELECT';

      // Always allow Cmd/Ctrl+K or Escape even inside inputs
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (isCmdOrCtrl && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        keyMap['mod+k']?.(e);
        return;
      }

      if (e.key === 'Escape') {
        keyMap['escape']?.(e);
        return;
      }

      if (isInput) return;

      // Handle 'g' sequence like 'g h' (go home)
      if (e.key === 'g' && !gSequenceRef.current) {
        gSequenceRef.current = true;
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          gSequenceRef.current = false;
        }, 1000);
        return;
      }

      if (gSequenceRef.current) {
        if (e.key === 'h') {
          e.preventDefault();
          keyMap['g h']?.(e);
        }
        gSequenceRef.current = false;
        clearTimeout(timeoutRef.current);
        return;
      }

      // Single keys
      const key = e.key.toLowerCase();
      if (keyMap[key]) {
        e.preventDefault();
        keyMap[key](e);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeoutRef.current);
    };
  }, [keyMap, enabled]);
}
