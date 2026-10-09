import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';

export function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useWorkspaceStore();

  const handleToggle = (e) => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // View Transitions circular reveal animation
    if (document.startViewTransition && !isReducedMotion) {
      const x = e.clientX || window.innerWidth / 2;
      const y = e.clientY || 30;
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
            clipPath: theme === 'night' ? clipPath : [...clipPath].reverse(),
          },
          {
            duration: 350,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            pseudoElement: theme === 'night' ? '::view-transition-new(root)' : '::view-transition-old(root)',
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
      aria-label={`Switch to ${theme === 'day' ? 'Night' : 'Day'} mode`}
      title={`Toggle theme (current: ${theme === 'day' ? 'Day Paper' : 'Midnight Library'})`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5px 9px',
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-1)',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-sans)',
        fontSize: '11px',
        cursor: 'pointer',
        gap: '6px',
        height: '30px',
        transition: 'background-color var(--duration-calm), border-color var(--duration-calm), color var(--duration-calm)',
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
      {theme === 'night' ? <Moon size={13} /> : <Sun size={13} />}
      <span
        style={{
          textTransform: 'uppercase',
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.08em',
        }}
      >
        {theme === 'day' ? 'DAY' : 'NIGHT'}
      </span>
    </button>
  );
}
