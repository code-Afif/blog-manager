import React from 'react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useAuthStore } from '../../store/authStore';
import { Bookmark } from 'lucide-react';

/**
 * StatusBar — Running Archival Registry & Reading Telemetry Strip
 */
export function StatusBar() {
  const {
    activeWordCount,
    activeReadTime,
    isDraftSaved,
    setIndexView,
  } = useWorkspaceStore();

  const { userBookmarks } = useAuthStore();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 'var(--statusbar-height, 30px)',
        padding: '0 20px',
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
      {/* Left: Volume Imprint, Autosave Status, Bookmarks */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontWeight: 600 }}>
          <span>STACKTRACE Literary Review</span>
          <span style={{ color: 'var(--border-default)' }}>·</span>
          <span style={{ color: 'var(--accent)' }}>Vol. IX, Issue 42</span>
        </div>

        {/* Autosave Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {isDraftSaved ? (
            <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
              ● <span>Draft Preserved</span>
            </span>
          ) : (
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ○ <span>Preserving...</span>
            </span>
          )}
        </div>

        {/* Bookmarks Count */}
        <button
          type="button"
          onClick={() => setIndexView('shelf')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            padding: 0,
            color: userBookmarks.length > 0 ? 'var(--accent)' : 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '11px',
            fontFamily: 'var(--font-sans)',
          }}
        >
          <Bookmark size={11} fill={userBookmarks.length > 0 ? 'currentColor' : 'none'} />
          <span>Shelf ({userBookmarks.length})</span>
        </button>
      </div>

      {/* Right: Metrics */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span>{activeWordCount ? `${activeWordCount.toLocaleString()} words` : 'Archival Registry'}</span>
        {activeReadTime > 0 && (
          <>
            <span style={{ color: 'var(--border-default)' }}>·</span>
            <span>~{activeReadTime}m cadence</span>
          </>
        )}
      </div>
    </div>
  );
}
