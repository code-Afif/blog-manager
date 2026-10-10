import React from 'react';
import { Link } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { Sun, Moon } from 'lucide-react';

export function LiteraryMasthead() {
  const { theme, toggleTheme, setIndexView } = useWorkspaceStore();

  return (
    <header
      className="marginalia-masthead"
      style={{
        width: '100%',
        backgroundColor: 'var(--bg-canvas)',
        borderBottom: '1px solid var(--border-default)',
        padding: '16px 24px 14px',
      }}
    >
      {/* Top utility row: Folio issue notice & Day/Night toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1240px',
          margin: '0 auto',
          fontSize: '13px',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <div
          style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--text-muted)',
            fontWeight: 500,
          }}
        >
          A Journal of Slow Literature &amp; Thought
        </div>

        {/* Day/Night Mode toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'day' ? 'Switch to Night mode' : 'Switch to Day mode'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              border: '1px solid var(--border-default)',
              borderRadius: '9999px',
              backgroundColor: 'var(--bg-surface-elevated)',
              color: 'var(--text-primary)',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              cursor: 'pointer',
              transition: 'all var(--duration-fast)',
            }}
          >
            {theme === 'day' ? (
              <>
                <Moon size={12} style={{ color: 'var(--accent)' }} />
                <span>Night</span>
              </>
            ) : (
              <>
                <Sun size={12} style={{ color: 'var(--accent)' }} />
                <span>Day</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Literary Masthead Title & Thin Double Rule */}
      <div
        style={{
          maxWidth: '1240px',
          margin: '14px auto 0',
          textAlign: 'center',
        }}
      >
        <Link
          to="/"
          onClick={() => setIndexView('contents')}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
              fontWeight: 400,
              letterSpacing: '0.02em',
              margin: '0 auto',
              lineHeight: 1.1,
              color: 'var(--text-primary)',
            }}
          >
            Marginalia
          </h1>
        </Link>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '14px',
            color: 'var(--text-muted)',
            margin: '4px 0 12px',
          }}
        >
          An Independent Journal of Literature, Reflections &amp; Ideas
        </p>

        {/* Thin Double Rule */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            maxWidth: '100%',
            margin: '0 auto',
          }}
        >
          <div style={{ height: '1px', backgroundColor: 'var(--border-strong)', width: '100%' }} />
          <div style={{ height: '1px', backgroundColor: 'var(--border-default)', width: '100%' }} />
        </div>
      </div>
    </header>
  );
}
