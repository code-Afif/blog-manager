import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { postService } from '../../lib/postService';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useDebounce } from '../../hooks/useDebounce';
import { PostRow } from './PostRow';
import { PostCard } from './PostCard';
import { SkeletonPostRow } from '../../components/ui/Skeleton';
import { SearchFilterBar } from '../search/SearchFilterBar';
import { EmptySearchState, EmptyShelfState } from '../search/EmptySearchState';
import { PostIndexMasthead } from './PostIndexMasthead';
import { countWords, normalizeSearchText } from '../../lib/utils';

export function PostIndex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    openTab,
    indexView,
    setIndexView,
    displayMode,
    readingListIds,
    essaysVersion,
    setActiveWordCount,
    setActiveReadTime,
  } = useWorkspaceStore();

  const [allEssays, setAllEssays] = useState([]);
  const [sections, setSections] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Sync state with URL query params
  const queryParam = searchParams.get('q') || '';
  const sectionParam = searchParams.get('section') || searchParams.get('tag') || null;
  const langParam = searchParams.get('lang') || null;
  const sortParam = searchParams.get('sort') || 'newest';

  const [searchInput, setSearchInput] = useState(queryParam);
  const debouncedSearch = useDebounce(searchInput, 120);

  // Load published essays strictly (drafts never appear on public index)
  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      postService.getAll(false), // false = published only
      postService.getSections(),
      postService.getTags(),
    ]).then(([publishedEssays, sectionList, tagList]) => {
      setAllEssays(publishedEssays);
      setSections(sectionList);
      setTags(tagList);
      setIsLoading(false);

      // Status metrics
      const totalWords = publishedEssays.reduce(
        (acc, e) => acc + countWords(e.content),
        0
      );
      setActiveWordCount(totalWords);
      setActiveReadTime(Math.ceil(totalWords / 200));
    });
  }, [essaysVersion, setActiveWordCount, setActiveReadTime]);

  // Sync debounced search to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      params.set('q', debouncedSearch);
    } else {
      params.delete('q');
    }
    setSearchParams(params, { replace: true });
  }, [debouncedSearch]);

  const handleLanguageSelect = (lang) => {
    const params = new URLSearchParams(searchParams);
    if (lang) {
      params.set('lang', lang);
    } else {
      params.delete('lang');
    }
    setSearchParams(params, { replace: true });
  };

  const handleSectionSelect = (section) => {
    const params = new URLSearchParams(searchParams);
    if (section) {
      params.set('section', section);
      params.delete('tag');
    } else {
      params.delete('section');
      params.delete('tag');
    }
    setSearchParams(params, { replace: true });
  };

  const handleSortChange = (newSort) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', newSort);
    setSearchParams(params, { replace: true });
  };

  // Filter & Sort
  const filteredEssays = useMemo(() => {
    let result = [...allEssays];

    // If viewing Shelf, filter to bookmarked reading list only
    if (indexView === 'shelf') {
      result = result.filter((e) => readingListIds.includes(e.id));
    }

    // Language filter (?lang=en | ?lang=hi | ?lang=ur)
    if (langParam) {
      result = result.filter((e) => e.language === langParam);
    }

    // Section / Tag filter
    if (sectionParam) {
      result = result.filter(
        (e) =>
          e.section?.toLowerCase() === sectionParam.toLowerCase() ||
          e.tags?.includes(sectionParam.toLowerCase())
      );
    }

    // Unicode-aware search filter (normalizes NFC, diacritics, case)
    if (queryParam) {
      const q = normalizeSearchText(queryParam);
      result = result.filter((e) => {
        const titleMatch = normalizeSearchText(e.title).includes(q);
        const dekMatch = normalizeSearchText(e.dek).includes(q);
        const excerptMatch = normalizeSearchText(e.excerpt).includes(q);
        const authorMatch = normalizeSearchText(e.author?.name).includes(q);
        const sectionMatch = normalizeSearchText(e.section).includes(q);
        const tagsMatch = (e.tags || []).some((t) => normalizeSearchText(t).includes(q));
        const contentMatch = normalizeSearchText(e.content).includes(q);

        return (
          titleMatch ||
          dekMatch ||
          excerptMatch ||
          authorMatch ||
          sectionMatch ||
          tagsMatch ||
          contentMatch
        );
      });
    }

    // Sort order
    if (sortParam === 'newest') {
      result.sort((a, b) => new Date(b.publishedAt || b.date).getTime() - new Date(a.publishedAt || a.date).getTime());
    } else if (sortParam === 'appreciations') {
      result.sort((a, b) => (b.appreciations || 0) - (a.appreciations || 0));
    } else if (sortParam === 'readTime') {
      result.sort((a, b) => (a.readTimeMinutes || 0) - (b.readTimeMinutes || 0));
    }

    return result;
  }, [allEssays, indexView, readingListIds, langParam, sectionParam, queryParam, sortParam]);

  useEffect(() => {
    setSelectedIndex((prev) => Math.min(prev, Math.max(0, filteredEssays.length - 1)));
  }, [filteredEssays.length]);

  const handleOpenEssay = useCallback(
    (essay) => {
      if (!essay) return;
      openTab({
        id: essay.id,
        slug: essay.slug,
        title: `№ ${String(essay.number || essay.essayNumber || 1).padStart(2, '0')} ${essay.title.slice(0, 20)}...`,
        type: 'essay',
      });
      navigate(`/essays/${essay.slug}`);
    },
    [openTab, navigate]
  );

  // Keyboard navigation
  const hotkeyMap = useMemo(
    () => ({
      j: () => setSelectedIndex((prev) => Math.min(prev + 1, Math.max(0, filteredEssays.length - 1))),
      k: () => setSelectedIndex((prev) => Math.max(prev - 1, 0)),
      Enter: () => {
        if (filteredEssays[selectedIndex]) {
          handleOpenEssay(filteredEssays[selectedIndex]);
        }
      },
      b: () => {
        if (filteredEssays[selectedIndex]) {
          useWorkspaceStore.getState().toggleReadingList(filteredEssays[selectedIndex].id);
        }
      },
      '/': (e) => {
        e.preventDefault();
        document.getElementById('main-search-input')?.focus();
      },
    }),
    [filteredEssays, selectedIndex, handleOpenEssay]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        activeEl?.isContentEditable;

      if (isInput) return;

      if (hotkeyMap[e.key]) {
        hotkeyMap[e.key](e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hotkeyMap]);

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        backgroundColor: 'var(--bg-canvas)',
        padding: '32px 24px 80px 24px',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Editorial Journal Masthead Header */}
        <PostIndexMasthead indexView={indexView} />

        {/* View Switcher: Contents vs Reading Shelf */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-default)',
            marginBottom: '16px',
            paddingBottom: '8px',
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
          }}
        >
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              type="button"
              onClick={() => setIndexView('contents')}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px 0',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                fontWeight: indexView === 'contents' ? 700 : 500,
                color: indexView === 'contents' ? 'var(--accent)' : 'var(--text-muted)',
                borderBottom: indexView === 'contents' ? '2px solid var(--accent)' : '2px solid transparent',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              TABLE OF CONTENTS ({allEssays.length})
            </button>
            <button
              type="button"
              onClick={() => setIndexView('shelf')}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px 0',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                fontWeight: indexView === 'shelf' ? 700 : 500,
                color: indexView === 'shelf' ? 'var(--accent)' : 'var(--text-muted)',
                borderBottom: indexView === 'shelf' ? '2px solid var(--accent)' : '2px solid transparent',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              READING SHELF ({readingListIds.length})
            </button>
          </div>

          <div
            className="desktop-only"
            style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span><span className="kbd-chip">J</span> / <span className="kbd-chip">K</span> TO NAVIGATE</span>
            <span>•</span>
            <span><span className="kbd-chip">↵</span> TO OPEN</span>
          </div>
        </div>

        {/* Filter and Search Bar with Language and Section Chips */}
        <SearchFilterBar
          searchQuery={searchInput}
          onSearchChange={setSearchInput}
          selectedLanguage={langParam}
          onLanguageSelect={handleLanguageSelect}
          availableSections={sections}
          selectedSection={sectionParam}
          onSectionSelect={handleSectionSelect}
          sortOrder={sortParam}
          onSortChange={handleSortChange}
          totalResults={allEssays.length}
        />

        {/* Results List / Grid */}
        {isLoading ? (
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-1)',
            }}
          >
            <SkeletonPostRow />
            <SkeletonPostRow />
            <SkeletonPostRow />
            <SkeletonPostRow />
            <SkeletonPostRow />
          </div>
        ) : filteredEssays.length === 0 ? (
          indexView === 'shelf' ? (
            <EmptyShelfState onExplore={() => setIndexView('contents')} />
          ) : (
            <EmptySearchState
              query={queryParam}
              onReset={() => {
                setSearchInput('');
                handleSectionSelect(null);
                handleLanguageSelect(null);
              }}
            />
          )
        ) : displayMode === 'list' ? (
          /* Table-style Contents List */
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-1)',
              overflow: 'hidden',
            }}
          >
            {/* Table Header Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '48px 1fr auto auto auto auto 44px',
                gap: '14px',
                padding: '10px 14px',
                backgroundColor: 'var(--bg-surface-elevated)',
                borderBottom: '1px solid var(--border-default)',
                fontSize: '10px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <span style={{ textAlign: 'right' }}>FOLIO</span>
              <span>ESSAY DISCOURSE</span>
              <span>LANG</span>
              <span>TAGS</span>
              <span>DATE</span>
              <span>READING</span>
              <span style={{ textAlign: 'right' }}>SHELF</span>
            </div>

            {/* List Rows */}
            {filteredEssays.map((essay, idx) => (
              <PostRow
                key={essay.id}
                post={essay}
                index={idx}
                isSelected={idx === selectedIndex}
                onOpen={handleOpenEssay}
              />
            ))}
          </div>
        ) : (
          /* Grid Shelf Cards */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
              gap: '16px',
            }}
          >
            {filteredEssays.map((essay, idx) => (
              <PostCard
                key={essay.id}
                post={essay}
                index={idx}
                onOpen={handleOpenEssay}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
