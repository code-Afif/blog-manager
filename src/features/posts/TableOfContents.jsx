import React from 'react';

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

export function TableOfContents({
  headings = [],
  activeId = '',
  onSelectHeading,
  lang = 'en',
  dir = 'ltr',
}) {
  if (!headings || headings.length === 0) return null;

  const isHindi = lang === 'hi';

  return (
    <nav
      aria-label="Section outline"
      lang={lang}
      dir="ltr"
      style={{
        padding: '16px 18px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-1)',
        fontFamily: isHindi ? 'var(--font-serif-hi)' : 'var(--font-sans)',
        fontSize: '12px',
        textAlign: 'left',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-muted)',
          fontSize: '10px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginBottom: '12px',
          paddingBottom: '8px',
          borderBottom: '1px solid var(--border-subtle)',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <span className="fleuron">❧</span>
        <span>
          {isHindi ? 'विषय रूपरेखा' : 'SECTION OUTLINE'}
        </span>
      </div>

      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {headings.map((h, i) => {
          const isActive = activeId === h.id;
          const indent = h.level === 1 ? 0 : h.level === 2 ? 10 : 20;
          const roman = ROMAN_NUMERALS[i % ROMAN_NUMERALS.length] || String(i + 1);

          return (
            <li
              key={`${h.id}-${i}`}
              style={{
                marginInlineStart: `${indent}px`,
                marginBottom: '6px',
                position: 'relative',
              }}
            >
              <a
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectHeading?.(h.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '8px',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  padding: '4px 6px',
                  borderRadius: 'var(--radius-1)',
                  fontWeight: isActive ? 600 : 400,
                  backgroundColor: isActive ? 'var(--bg-surface-elevated)' : 'transparent',
                  borderInlineStart: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                  transition: 'color var(--duration-calm), background-color var(--duration-calm)',
                  lineHeight: 1.4,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '10px',
                    color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                    fontStyle: 'italic',
                    width: '18px',
                    flexShrink: 0,
                  }}
                >
                  §{roman}
                </span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {h.text}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
