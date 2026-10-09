import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';

export function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useWorkspaceStore();

  const handleToggle = (e) => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Check if view transitions API is available
    if (document.startViewTransition && !isReducedMotion) {
      const x = e.clientX;
      const y = e.clientY;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = document.startViewTransition(() => {
        toggleTheme();
      });

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ];
        document.documentElement.animate(
          {
            clipPath: theme === 'dark' ? clipPath : [...clipPath].reverse(),
          },
          {
            duration: 350,
            easing: 'cubic-bezier(0, 0, 0.2, 1)',
            pseudoElement: theme === 'dark' ? '::view-transition-new(root)' : '::view-transition-old(root)',
          }
        );
      });
    } else {
      toggleTheme();
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={className}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Toggle theme (current: ${theme})`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5px 8px',
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-1)',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        cursor: 'pointer',
        gap: '6px',
        height: '26px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--text-primary)';
        e.currentTarget.style.borderColor = 'var(--border-strong)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--text-secondary)';
        e.currentTarget.style.borderColor = 'var(--border-default)';
      }}
    >
      {theme === 'dark' ? <Moon size={13} /> : <Sun size={13} />}
      <span className="tabular-nums" style={{ textTransform: 'uppercase', fontSize: '10px', fontWeight: 600 }}>
        {theme}
      </span>
    </button>
  );
}
