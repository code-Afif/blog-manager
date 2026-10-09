import React from 'react';

export function TableOfContents({
  headings = [],
  activeId = '',
  onSelectHeading,
}) {
  if (!headings || headings.length === 0) return null;

  return (
    <nav
      aria-label="Essay outline"
      style={{
        padding: '16px 18px',
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-default)',
        fontFamily: 'var(--font-sans)',
        fontSize: '12px',
        textAlign: 'left',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--accent)',
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginBottom: '12px',
          paddingBottom: '8px',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <span>ESSAY OUTLINE</span>
      </div>

      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {headings.map((h, i) => {
          const isActive = activeId === h.id;
          const indent = h.level === 1 ? 0 : h.level === 2 ? 8 : 16;
          const sectionNum = String(i + 1).padStart(2, '0');

          return (
            <li
              key={`${h.id}-${i}`}
              style={{
                marginLeft: `${indent}px`,
                marginBottom: '6px',
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
                  gap: '6px',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 400,
                  textDecoration: 'none',
                  lineHeight: 1.4,
                  fontSize: '12px',
                  transition: 'color var(--duration-fast)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? 'var(--accent)' : 'var(--text-secondary)')}
              >
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  §{sectionNum}
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
