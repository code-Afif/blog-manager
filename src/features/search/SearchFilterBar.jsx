import React from 'react';
import { Search, LayoutList, LayoutGrid, X, SlidersHorizontal } from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  availableTags = [],
  selectedTag,
  onTagSelect,
  sortOrder,
  onSortChange,
  totalResults = 0,
}) {
  const { viewMode, setViewMode } = useWorkspaceStore();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '16px',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* Top row: Search input, Sort select, List/Grid toggle */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '10px',
          justifyContent: 'space-between',
        }}
      >
        {/* Search input with / keyboard chip */}
        <div
          style={{
            position: 'relative',
            flex: '1 1 240px',
            maxWidth: '420px',
          }}
        >
          <Search
            size={13}
            style={{
              position: 'absolute',
              left: '9px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            id="main-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search posts, topics, code..."
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-1)',
              padding: '6px 36px 6px 28px',
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
                padding: '2px',
              }}
              title="Clear search"
            >
              <X size={12} />
            </button>
          ) : (
            <span
              className="kbd-chip"
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '9px',
              }}
            >
              /
            </span>
          )}
        </div>

        {/* Controls: Sort and View mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SORT:</span>
            <select
              value={sortOrder}
              onChange={(e) => onSortChange(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-1)',
                padding: '4px 8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-primary)',
                cursor: 'pointer',
              }}
            >
              <option value="newest">Newest first</option>
              <option value="stars">Most starred</option>
              <option value="readTime">Shortest read</option>
            </select>
          </div>

          {/* View mode toggle: List vs Grid */}
          <div
            style={{
              display: 'flex',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-1)',
              overflow: 'hidden',
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-label="List view"
              title="List view"
              style={{
                padding: '4px 7px',
                backgroundColor: viewMode === 'list' ? 'var(--accent)' : 'var(--bg-surface-elevated)',
                color: viewMode === 'list' ? 'var(--accent-fg)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <LayoutList size={13} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              title="Grid view"
              style={{
                padding: '4px 7px',
                backgroundColor: viewMode === 'grid' ? 'var(--accent)' : 'var(--bg-surface-elevated)',
                color: viewMode === 'grid' ? 'var(--accent-fg)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <LayoutGrid size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Tag Chips row */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '6px',
          paddingTop: '4px',
        }}
      >
        <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          TAGS:
        </span>

        {/* "ALL" Chip */}
        <button
          type="button"
          onClick={() => onTagSelect(null)}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: 'var(--radius-1)',
            border: !selectedTag ? '1px solid var(--chip-active-border)' : '1px solid var(--chip-border)',
            backgroundColor: !selectedTag ? 'var(--chip-active-bg)' : 'var(--chip-bg)',
            color: !selectedTag ? 'var(--chip-active-text)' : 'var(--chip-text)',
            cursor: 'pointer',
            fontWeight: !selectedTag ? 600 : 400,
          }}
        >
          ALL ({totalResults})
        </button>

        {availableTags.map(({ tag, count }) => {
          const isSelected = selectedTag === tag;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => onTagSelect(isSelected ? null : tag)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: 'var(--radius-1)',
                border: isSelected ? '1px solid var(--chip-active-border)' : '1px solid var(--chip-border)',
                backgroundColor: isSelected ? 'var(--chip-active-bg)' : 'var(--chip-bg)',
                color: isSelected ? 'var(--chip-active-text)' : 'var(--chip-text)',
                cursor: 'pointer',
                fontWeight: isSelected ? 600 : 400,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>#{tag}</span>
              <span className="tabular-nums" style={{ opacity: 0.7, fontSize: '10px' }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
