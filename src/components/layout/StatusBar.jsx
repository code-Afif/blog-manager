import React from 'react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { Bookmark, Feather } from 'lucide-react';

/**
 * StatusBar — Running Editorial Colophon Strip
 * Shows volume imprint, live draft preservation status, shelf count, and word metrics.
 */
export function StatusBar() {
  const {
    activeWordCount,
    activeReadTime,
    readingListIds,
    theme,
    isDraftSaved,
    setIndexView,
  } = useWorkspaceStore();

  return (
    <footer
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 'var(--colophon-height, 34px)',
        padding: '0 14px',
        backgroundColor: 'var(--bg-surface-elevated)',
        borderTop: '1px solid var(--border-default)',
        fontFamily: 'var(--font-sans)',
        fontSize: '11px',
        color: 'var(--text-muted)',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      }}
    >
      {/* Left: Volume Imprint, Autosave Status, Shelf Count */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Publication Imprint */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)' }}>
          <span className="fleuron" style={{ fontSize: '12px', color: 'var(--accent)' }}>❧</span>
          <span style={{ fontWeight: 600 }}>Marginalia · हाशिया · حاشیہ • Vol. IV</span>
        </div>

        {/* Autosave Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {isDraftSaved ? (
            <span style={{ color: 'var(--status-pub-text)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
              ● <span>Draft saved</span>
            </span>
          ) : (
            <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
              ○ <span>Saving draft...</span>
            </span>
          )}
        </div>

        {/* Reading Shelf Count */}
        <button
          type="button"
          onClick={() => setIndexView('shelf')}
          title="Filter Table of Contents to Reading Shelf"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: readingListIds.length > 0 ? 'var(--text-primary)' : 'var(--text-muted)',
            cursor: 'pointer',
            padding: '2px 4px',
            borderRadius: 'var(--radius-1)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = readingListIds.length > 0 ? 'var(--text-primary)' : 'var(--text-muted)')}
        >
          <Bookmark size={11} fill={readingListIds.length > 0 ? 'currentColor' : 'none'} />
          <span className="tabular-nums">Shelf: {readingListIds.length} essays</span>
        </button>
      </div>

      {/* Right: Word Count, Read Time, Typefaces, Theme */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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

        {/* Typography imprint */}
        <div className="desktop-only" style={{ color: 'var(--text-subtle)' }}>
          Newsreader · Devanagari · Nastaliq
        </div>

        {/* Mode */}
        <div style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
          {theme === 'night' ? 'Night Library' : 'Day Paper'}
        </div>
      </div>
    </footer>
  );
}
