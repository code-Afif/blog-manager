import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { Sun, Moon } from 'lucide-react';

const LANGUAGES = [
  { code: 'all', label: 'All' },
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'ur', label: 'اردو' },
];

export function LiteraryMasthead() {
  const { theme, toggleTheme, language, setLanguage, setIndexView } = useWorkspaceStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleLanguageChange = (code) => {
    setLanguage(code);
    const params = new URLSearchParams(searchParams);
    if (code === 'all') {
      params.delete('lang');
    } else {
      params.set('lang', code);
    }
    setSearchParams(params, { replace: true });
  };

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
      {/* Top utility row: Day/Night toggle & Language switcher */}
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
        {/* Language switcher: All / English / हिन्दी / اردو */}
        <div
          role="group"
          aria-label="Language selection"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
              marginRight: '6px',
            }}
          >
            Language:
          </span>
          {LANGUAGES.map((lang) => {
            const isActive = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageChange(lang.code)}
                style={{
                  padding: '3px 8px',
                  background: isActive ? 'var(--text-primary)' : 'transparent',
                  color: isActive ? 'var(--bg-canvas)' : 'var(--text-secondary)',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--text-primary)' : 'transparent',
                  fontSize: lang.code === 'ur' ? '13px' : '12px',
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast)',
                }}
              >
                {lang.label}
              </button>
            );
          })}
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
              padding: '4px 10px',
              border: '1px solid var(--border-default)',
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
