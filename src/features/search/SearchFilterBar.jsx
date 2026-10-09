import React from 'react';
import { Search, LayoutList, LayoutGrid, X } from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';

const TOPIC_PRESETS = [
  { id: null, label: '[All]' },
  { id: 'Systems', label: '[Systems]' },
  { id: 'Backend', label: '[Backend]' },
  { id: 'Frontend', label: '[Frontend]' },
  { id: 'Database', label: '[Database]' },
  { id: 'Architecture', label: '[Architecture]' },
  { id: 'Performance', label: '[Performance]' },
  { id: 'Dev Tools', label: '[Dev Tools]' },
];

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  availableSections = [],
  selectedSection,
  onSectionSelect,
  sortOrder,
  onSortChange,
  totalResults = 0,
}) {
  const { displayMode, setDisplayMode } = useWorkspaceStore();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '20px',
        fontFamily: 'var(--font-mono)',
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-default)',
        padding: '14px 16px',
      }}
    >
      {/* 1. Search Bar + Layout Toggle */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '12px',
          justifyContent: 'space-between',
        }}
      >
        {/* Search input with > prompt */}
        <div
          style={{
            position: 'relative',
            flex: '1 1 280px',
            maxWidth: '520px',
          }}
        >
          <span
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--accent)',
              fontWeight: 700,
              fontSize: '13px',
            }}
          >
            &gt;
          </span>
          <input
            id="main-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="grep_articles --query [keyword, author, tag]..."
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              padding: '7px 32px 7px 28px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--text-primary)',
            }}
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                padding: '3px',
              }}
              title="Clear search query"
            >
              <X size={13} />
            </button>
          ) : (
            <span
              className="kbd-chip"
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '10px',
              }}
            >
              /
            </span>
          )}
        </div>

        {/* List / Grid Display Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            type="button"
            onClick={() => setDisplayMode('list')}
            title="Density List View"
            style={{
              padding: '6px 10px',
              border: '1px solid var(--border-default)',
              backgroundColor: displayMode === 'list' ? 'var(--text-primary)' : 'var(--bg-surface)',
              color: displayMode === 'list' ? 'var(--bg-canvas)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 600,
            }}
          >
            <LayoutList size={13} />
            <span className="desktop-only">LIST</span>
          </button>
          <button
            type="button"
            onClick={() => setDisplayMode('shelf')}
            title="Planar Cards View"
            style={{
              padding: '6px 10px',
              border: '1px solid var(--border-default)',
              backgroundColor: displayMode === 'shelf' ? 'var(--text-primary)' : 'var(--bg-surface)',
              color: displayMode === 'shelf' ? 'var(--bg-canvas)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 600,
            }}
          >
            <LayoutGrid size={13} />
            <span className="desktop-only">CARDS</span>
          </button>
        </div>
      </div>

      {/* 2. Horizontal Topic Filter Pills */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '2px',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          TOPICS //
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {TOPIC_PRESETS.map((t) => {
            const isSelected = selectedSection === t.id || (!selectedSection && !t.id);
            return (
              <button
                key={t.label}
                type="button"
                onClick={() => onSectionSelect(t.id)}
                style={{
                  padding: '3px 8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--text-primary)' : 'var(--border-default)',
                  backgroundColor: isSelected ? 'var(--text-primary)' : 'var(--bg-surface)',
                  color: isSelected ? 'var(--bg-canvas)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Sorter Strip & Metrics */}
      <div
        style={{
          borderTop: '1px solid var(--border-default)',
          paddingTop: '8px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: 'var(--text-muted)' }}>SORT_MODE:</span>
          <button
            type="button"
            onClick={() => onSortChange('newest')}
            style={{
              cursor: 'pointer',
              fontWeight: sortOrder === 'newest' ? 700 : 500,
              color: sortOrder === 'newest' ? 'var(--text-primary)' : 'var(--text-muted)',
              textDecoration: sortOrder === 'newest' ? 'underline' : 'none',
              textDecorationColor: 'var(--accent)',
            }}
          >
            LATEST
          </button>
          <button
            type="button"
            onClick={() => onSortChange('appreciations')}
            style={{
              cursor: 'pointer',
              fontWeight: sortOrder === 'appreciations' ? 700 : 500,
              color: sortOrder === 'appreciations' ? 'var(--text-primary)' : 'var(--text-muted)',
              textDecoration: sortOrder === 'appreciations' ? 'underline' : 'none',
              textDecorationColor: 'var(--accent)',
            }}
          >
            MOST DISCUSSED
          </button>
          <button
            type="button"
            onClick={() => onSortChange('readTime')}
            style={{
              cursor: 'pointer',
              fontWeight: sortOrder === 'readTime' ? 700 : 500,
              color: sortOrder === 'readTime' ? 'var(--text-primary)' : 'var(--text-muted)',
              textDecoration: sortOrder === 'readTime' ? 'underline' : 'none',
              textDecorationColor: 'var(--accent)',
            }}
          >
            SHORTEST READ
          </button>
        </div>

        <span style={{ color: 'var(--text-muted)' }}>
          SHOWING: {totalResults} ENTRIES
        </span>
      </div>
    </div>
  );
}
