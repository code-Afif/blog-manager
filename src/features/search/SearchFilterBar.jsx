import React from 'react';
import { Search, LayoutList, LayoutGrid, X } from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { SECTION_TRANSLATIONS } from '../../lib/postService';

const LANGUAGE_OPTIONS = [
  { id: null, label: 'All' },
  { id: 'en', label: 'English' },
  { id: 'hi', label: 'हिन्दी' },
];

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  selectedLanguage = null,
  onLanguageSelect,
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
        gap: '14px',
        marginBottom: '20px',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Top row: Search input, Sort select, List/Grid layout toggle */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '12px',
          justifyContent: 'space-between',
        }}
      >
        {/* Search input with / keyboard chip */}
        <div
          style={{
            position: 'relative',
            flex: '1 1 260px',
            maxWidth: '460px',
          }}
        >
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: '11px',
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
            placeholder="Search essay titles, authors, prose, quotes..."
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-1)',
              padding: '7px 36px 7px 32px',
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
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
                fontSize: '9px',
              }}
            >
              /
            </span>
          )}
        </div>

        {/* Controls: Sort and Layout View mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              SORT:
            </span>
            <select
              value={sortOrder}
              onChange={(e) => onSortChange(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-1)',
                padding: '5px 8px',
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                color: 'var(--text-primary)',
                cursor: 'pointer',
              }}
            >
              <option value="newest">Newest Folios</option>
              <option value="appreciations">Most Appreciated</option>
              <option value="readTime">Shortest Read</option>
            </select>
          </div>

          {/* List vs Shelf layout toggle */}
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
              onClick={() => setDisplayMode('list')}
              aria-label="List view"
              title="Table-style list view"
              style={{
                padding: '5px 8px',
                backgroundColor: displayMode === 'list' ? 'var(--accent)' : 'var(--bg-surface-elevated)',
                color: displayMode === 'list' ? 'var(--accent-fg)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <LayoutList size={14} />
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('shelf')}
              aria-label="Shelf card view"
              title="Card shelf view"
              style={{
                padding: '5px 8px',
                backgroundColor: displayMode === 'shelf' ? 'var(--accent)' : 'var(--bg-surface-elevated)',
                color: displayMode === 'shelf' ? 'var(--accent-fg)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <LayoutGrid size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Row: Language Filter Chips & Section Chips */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Language Filter Chips */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span
            style={{
              fontSize: '10px',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 600,
              minWidth: '68px',
            }}
          >
            LANGUAGE:
          </span>

          {LANGUAGE_OPTIONS.map((opt) => {
            const isSelected = selectedLanguage === opt.id;
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => onLanguageSelect(opt.id)}
                style={{
                  fontFamily: opt.id === 'hi' ? 'var(--font-serif-hi)' : 'var(--font-sans)',
                  fontSize: '11px',
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-1)',
                  border: isSelected ? '1px solid var(--chip-active-border)' : '1px solid var(--chip-border)',
                  backgroundColor: isSelected ? 'var(--chip-active-bg)' : 'var(--chip-bg)',
                  color: isSelected ? 'var(--chip-active-text)' : 'var(--chip-text)',
                  cursor: 'pointer',
                  fontWeight: isSelected ? 600 : 400,
                  letterSpacing: opt.id ? 'normal' : '0.04em',
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Section Chips */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span
            style={{
              fontSize: '10px',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 600,
              minWidth: '68px',
            }}
          >
            SECTIONS:
          </span>

          {/* All Section Chip */}
          <button
            type="button"
            onClick={() => onSectionSelect(null)}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              padding: '3px 9px',
              borderRadius: 'var(--radius-1)',
              border: !selectedSection ? '1px solid var(--chip-active-border)' : '1px solid var(--chip-border)',
              backgroundColor: !selectedSection ? 'var(--chip-active-bg)' : 'var(--chip-bg)',
              color: !selectedSection ? 'var(--chip-active-text)' : 'var(--chip-text)',
              cursor: 'pointer',
              fontWeight: !selectedSection ? 600 : 400,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            ALL ({totalResults})
          </button>

          {availableSections.map(({ section, count }) => {
            const isSelected = selectedSection === section;
            const trans = SECTION_TRANSLATIONS[section];
            const label = trans
              ? `${section} / ${trans.hi}`
              : section;

            return (
              <button
                key={section}
                type="button"
                onClick={() => onSectionSelect(isSelected ? null : section)}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '11px',
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-1)',
                  border: isSelected ? '1px solid var(--chip-active-border)' : '1px solid var(--chip-border)',
                  backgroundColor: isSelected ? 'var(--chip-active-bg)' : 'var(--chip-bg)',
                  color: isSelected ? 'var(--chip-active-text)' : 'var(--chip-text)',
                  cursor: 'pointer',
                  fontWeight: isSelected ? 600 : 400,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  letterSpacing: '0.02em',
                }}
              >
                <span>{label}</span>
                <span className="tabular-nums" style={{ opacity: 0.75, fontSize: '10px' }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
