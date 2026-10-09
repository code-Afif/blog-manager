import React from 'react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { GitBranch, Bookmark, FileCode, CheckCircle2, Circle } from 'lucide-react';

export function StatusBar() {
  const {
    activeWordCount,
    activeReadTime,
    cursorPosition,
    stashedIds,
    theme,
    isDraftSaved,
    setSidebarView,
  } = useWorkspaceStore();

  return (
    <footer
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 'var(--statusbar-height)',
        padding: '0 12px',
        backgroundColor: 'var(--bg-surface-elevated)',
        borderTop: '1px solid var(--border-default)',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: 'var(--text-muted)',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      }}
    >
      {/* Left Items: Branch, Autosave Status, Stash Count */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Branch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)' }}>
          <GitBranch size={12} style={{ color: 'var(--accent)' }} />
          <span>git: main</span>
        </div>

        {/* Autosave Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {isDraftSaved ? (
            <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '3px' }}>
              ● <span>saved</span>
            </span>
          ) : (
            <span style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '3px' }}>
              ○ <span>saving...</span>
            </span>
          )}
        </div>

        {/* Stash (Bookmarks) Count */}
        <button
          type="button"
          onClick={() => setSidebarView('bookmarks')}
          title="View stashed bookmarks"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: stashedIds.length > 0 ? 'var(--text-primary)' : 'var(--text-muted)',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = stashedIds.length > 0 ? 'var(--text-primary)' : 'var(--text-muted)')}
        >
          <Bookmark size={11} fill={stashedIds.length > 0 ? 'currentColor' : 'none'} />
          <span className="tabular-nums">stash: {stashedIds.length}</span>
        </button>
      </div>

      {/* Right Items: Cursor Position, Words, Read Time, Encoding, Format */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Cursor Ln/Col */}
        <div className="tabular-nums">
          ln {cursorPosition.line}, col {cursorPosition.col}
        </div>

        {/* Word Count */}
        {activeWordCount > 0 && (
          <div className="tabular-nums desktop-only">
            {activeWordCount.toLocaleString()} words
          </div>
        )}

        {/* Read Time */}
        {activeReadTime > 0 && (
          <div className="tabular-nums desktop-only">
            {activeReadTime}m read
          </div>
        )}

        {/* Encoding */}
        <div className="desktop-only" style={{ color: 'var(--text-subtle)' }}>
          UTF-8
        </div>

        {/* Language Format */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
          <FileCode size={11} />
          <span>Markdown</span>
        </div>

        {/* Theme mode */}
        <div style={{ color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
          mode: {theme}
        </div>
      </div>
    </footer>
  );
}
