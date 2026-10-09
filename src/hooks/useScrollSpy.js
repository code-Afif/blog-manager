import { useState, useEffect } from 'react';

/**
 * Tracks active heading during reading scroll and calculates reading progress percentage
 */
export function useScrollSpy(headingIds = [], scrollContainerRef = null) {
  const [activeId, setActiveId] = useState('');
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef?.current || window;

    const handleScroll = () => {
      let scrollTop = 0;
      let scrollHeight = 0;
      let clientHeight = 0;

      if (scrollContainerRef?.current) {
        scrollTop = scrollContainerRef.current.scrollTop;
        scrollHeight = scrollContainerRef.current.scrollHeight;
        clientHeight = scrollContainerRef.current.clientHeight;
      } else {
        scrollTop = window.scrollY || document.documentElement.scrollTop;
        scrollHeight = document.documentElement.scrollHeight;
        clientHeight = window.innerHeight;
      }

      // Calculate progress percentage
      const totalScrollable = scrollHeight - clientHeight;
      const progress = totalScrollable > 0 ? Math.min(100, Math.max(0, (scrollTop / totalScrollable) * 100)) : 0;
      setReadingProgress(progress);

      // Detect active heading
      const elements = headingIds
        .map((id) => document.getElementById(id))
        .filter(Boolean);

      if (elements.length === 0) return;

      const containerTop = scrollContainerRef?.current
        ? scrollContainerRef.current.getBoundingClientRect().top
        : 0;

      let currentActive = elements[0].id;

      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        const rect = el.getBoundingClientRect();
        // If element is near top (within 120px threshold)
        if (rect.top - containerTop <= 130) {
          currentActive = el.id;
        } else {
          break;
        }
      }

      setActiveId(currentActive);
    };

    const target = scrollContainerRef?.current || window;
    target.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      target.removeEventListener('scroll', handleScroll);
    };
  }, [headingIds, scrollContainerRef]);

  return { activeId, readingProgress };
}
