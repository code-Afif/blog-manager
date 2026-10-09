import React from 'react';
import { ListFilter } from 'lucide-react';
import { cn } from '../../lib/utils';

export function TableOfContents({ headings = [], activeId = '', onSelectHeading }) {
  if (!headings || headings.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      style={{
        padding: '12px 14px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-1)',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--text-muted)',
          fontSize: '10px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '10px',
          paddingBottom: '6px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <ListFilter size={12} />
        <span>TABLE OF CONTENTS</span>
      </div>

      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {headings.map((h, i) => {
          const isActive = activeId === h.id;
          const indent = h.level === 1 ? 0 : h.level === 2 ? 10 : 20;

          return (
            <li
              key={`${h.id}-${i}`}
              style={{
                marginLeft: `${indent}px`,
                marginBottom: '5px',
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
                  alignItems: 'center',
                  gap: '6px',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  textDecoration: 'none',
                  padding: '2px 4px',
                  borderRadius: 'var(--radius-1)',
                  fontWeight: isActive ? 600 : 400,
                  backgroundColor: isActive ? 'var(--bg-surface-elevated)' : 'transparent',
                  borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                  transition: 'color var(--duration-fast)',
                  lineHeight: 1.35,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                <span
                  style={{
                    color: isActive ? 'var(--accent)' : 'var(--text-subtle)',
                    fontSize: '9px',
                  }}
                >
                  #{'#'.repeat(Math.max(0, h.level - 1))}
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
