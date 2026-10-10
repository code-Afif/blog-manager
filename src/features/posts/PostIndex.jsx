import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { postService, SECTIONS } from '../../lib/postService';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useSocialStore } from '../../store/socialStore';
import { useDebounce } from '../../hooks/useDebounce';
import { PostRow } from './PostRow';
import { NotesFeed } from '../notes/NotesFeed';
import { EmptySearchState, EmptyShelfState } from '../search/EmptySearchState';
import { Bookmark, Heart, Sparkles, Filter, X } from 'lucide-react';

export function PostIndex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    openTab,
    homeTab,
    setHomeTab,
    indexView,
    setIndexView,
    readingListIds,
    appreciatedIds,
    essaysVersion,
  } = useWorkspaceStore();

  const { isFollowing } = useSocialStore();

  const isShelfPath =
    location.pathname === '/shelf' ||
    location.pathname === '/bookmarks' ||
    location.pathname === '/reading-list' ||
    searchParams.get('view') === 'shelf';

  const [allEssays, setAllEssays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state with URL query params
  const queryParam = searchParams.get('q') || '';
  const sectionParam = searchParams.get('section') || searchParams.get('tag') || null;
  const sortParam = searchParams.get('sort') || 'curated';
  const filterParam = searchParams.get('filter') || 'bookmarks';
  const followingParam = searchParams.get('following') === 'true';

  const [searchInput, setSearchInput] = useState(queryParam);
  const debouncedSearch = useDebounce(searchInput, 100);

  // Fetch published essays
  useEffect(() => {
    setIsLoading(true);
    postService.getAll(false).then((posts) => {
      setAllEssays(posts);
      setIsLoading(false);
    });
  }, [essaysVersion]);

  // Sync search input if query param changes externally (e.g. from right sidebar search)
  useEffect(() => {
    setSearchInput(queryParam);
  }, [queryParam]);

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

  const handleFollowingToggle = () => {
    const params = new URLSearchParams(searchParams);
    if (followingParam) {
      params.delete('following');
    } else {
      params.set('following', 'true');
    }
    setSearchParams(params, { replace: true });
  };

  const handleSortChange = (newSort) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', newSort);
    setSearchParams(params, { replace: true });
  };

  const handleClearSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('q');
    setSearchParams(params, { replace: true });
    setSearchInput('');
  };

  // Filter & Sort
  const filteredEssays = useMemo(() => {
    let list = [...allEssays];

    // Shelf / Reading List filter
    if (isShelfPath) {
      const isLiked = filterParam === 'liked';
      const targetIds = isLiked ? appreciatedIds : readingListIds;
      const targetSet = new Set(targetIds);
      list = list.filter((e) => targetSet.has(e.id));
    }

    // Following filter
    if (followingParam) {
      list = list.filter((e) => {
        const handle = e.author?.handle || (e.author?.name ? e.author.name.toLowerCase().replace(/\s+/g, '-') : '');
        return isFollowing(handle);
      });
    }

    // Section filter
    if (sectionParam) {
      const secLower = sectionParam.toLowerCase();
      list = list.filter(
        (e) =>
          (e.section && e.section.toLowerCase() === secLower) ||
          (e.category && e.category.toLowerCase() === secLower) ||
          (e.tags && e.tags.some((t) => t.toLowerCase() === secLower))
      );
    }

    // Query search with full Unicode support
    if (queryParam) {
      const q = queryParam.trim().toLowerCase();
      list = list.filter((e) => {
        const titleMatch = (e.title || '').toLowerCase().includes(q);
        const dekMatch = (e.dek || '').toLowerCase().includes(q);
        const authorMatch = (e.author?.name || '').toLowerCase().includes(q);
        const contentMatch = (e.content || '').toLowerCase().includes(q);
        const sectionMatch = (e.section || '').toLowerCase().includes(q);
        return titleMatch || dekMatch || authorMatch || contentMatch || sectionMatch;
      });
    }

    // Sort order
    if (sortParam === 'newest') {
      list.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
    } else if (sortParam === 'appreciated') {
      list.sort((a, b) => (b.appreciations || b.appreciationCount || 0) - (a.appreciations || a.appreciationCount || 0));
    } else {
      // Curated / default order
      list.sort((a, b) => (a.essayNumber || a.number || 0) - (b.essayNumber || b.number || 0));
    }

    return list;
  }, [
    allEssays,
    isShelfPath,
    filterParam,
    readingListIds,
    appreciatedIds,
    followingParam,
    isFollowing,
    sectionParam,
    queryParam,
    sortParam,
  ]);

  const handleOpenEssay = (essay) => {
    openTab({
      id: essay.id,
      slug: essay.slug,
      title: `№ ${String(essay.essayNumber || 1).padStart(2, '0')} ${essay.title.slice(0, 24)}...`,
      type: 'essay',
    });
    navigate(`/essays/${essay.slug}`);
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '740px',
        margin: '0 auto',
      }}
    >
      {/* 1. TOP TAB SWITCH: "Essays" vs "Notes" */}
      {!isShelfPath && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '32px',
            borderBottom: '1px solid var(--border-default)',
            marginBottom: '28px',
          }}
        >
          <button
            type="button"
            onClick={() => setHomeTab('essays')}
            style={{
              background: 'none',
              border: 'none',
              padding: '12px 4px',
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: homeTab === 'essays' ? 600 : 400,
              color: homeTab === 'essays' ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: homeTab === 'essays' ? '2px solid var(--accent)' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all var(--duration-fast)',
              letterSpacing: '0.01em',
            }}
          >
            Essays
          </button>

          <button
            type="button"
            onClick={() => setHomeTab('notes')}
            style={{
              background: 'none',
              border: 'none',
              padding: '12px 4px',
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: homeTab === 'notes' ? 600 : 400,
              color: homeTab === 'notes' ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: homeTab === 'notes' ? '2px solid var(--accent)' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all var(--duration-fast)',
              letterSpacing: '0.01em',
            }}
          >
            Notes
          </button>
        </div>
      )}

      {/* 2. IF SHELF PATH (Reading List) */}
      {isShelfPath && (
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--accent)',
              fontWeight: 600,
              marginBottom: '6px',
            }}
          >
            Personal Reading Archive
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              color: 'var(--text-primary)',
              fontWeight: 400,
              margin: '0 0 16px',
            }}
          >
            Reading List
          </h2>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              borderBottom: '1px solid var(--border-default)',
              paddingBottom: '10px',
            }}
          >
            <button
              type="button"
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.delete('filter');
                setSearchParams(params);
              }}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px 8px',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: filterParam !== 'liked' ? 600 : 400,
                color: filterParam !== 'liked' ? 'var(--accent)' : 'var(--text-secondary)',
                borderBottom: filterParam !== 'liked' ? '2px solid var(--accent)' : '2px solid transparent',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Bookmark size={14} fill={filterParam !== 'liked' ? 'currentColor' : 'none'} />
              <span>Saved Essays ({readingListIds.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('filter', 'liked');
                setSearchParams(params);
              }}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px 8px',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: filterParam === 'liked' ? 600 : 400,
                color: filterParam === 'liked' ? 'var(--accent)' : 'var(--text-secondary)',
                borderBottom: filterParam === 'liked' ? '2px solid var(--accent)' : '2px solid transparent',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Heart size={14} fill={filterParam === 'liked' ? 'currentColor' : 'none'} />
              <span>Appreciated ({appreciatedIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. NOTES TAB VIEW */}
      {!isShelfPath && homeTab === 'notes' && (
        <div>
          {/* Optional following filter for notes */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={handleFollowingToggle}
                style={{
                  border: '1px solid var(--border-default)',
                  backgroundColor: followingParam ? 'var(--accent)' : 'transparent',
                  color: followingParam ? 'var(--accent-fg, #FFFFFF)' : 'var(--text-secondary)',
                  padding: '4px 12px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  letterSpacing: '0.02em',
                }}
              >
                {followingParam ? 'Following Writers' : 'All Writers'}
              </button>
            </div>
            {queryParam && (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Searching: “{queryParam}”
              </div>
            )}
          </div>

          <NotesFeed followingOnly={followingParam} />
        </div>
      )}

      {/* 4. ESSAYS TAB VIEW */}
      {(isShelfPath || homeTab === 'essays') && (
        <div>
          {/* Active Search Banner */}
          {queryParam && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-default)',
                marginBottom: '20px',
                fontSize: '13px',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <div>
                Searching for <strong style={{ color: 'var(--accent)' }}>“{queryParam}”</strong> ({filteredEssays.length} {filteredEssays.length === 1 ? 'essay' : 'essays'})
              </div>
              <button
                type="button"
                onClick={handleClearSearch}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                }}
              >
                <X size={14} /> Clear
              </button>
            </div>
          )}

          {/* Section & Filter Bar (Desktop & Mobile) */}
          {!isShelfPath && (
            <div
              style={{
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              {/* Filter Pills */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap',
                  marginBottom: '16px',
                }}
              >
                {/* All */}
                <button
                  type="button"
                  onClick={() => {
                    handleSectionSelect('');
                    if (followingParam) handleFollowingToggle();
                  }}
                  style={{
                    border: '1px solid var(--border-default)',
                    backgroundColor: !sectionParam && !followingParam ? 'var(--accent)' : 'transparent',
                    color: !sectionParam && !followingParam ? 'var(--accent-fg, #FFFFFF)' : 'var(--text-secondary)',
                    padding: '4px 10px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  All
                </button>

                {/* Following Filter Chip */}
                <button
                  type="button"
                  onClick={handleFollowingToggle}
                  style={{
                    border: '1px solid var(--border-default)',
                    backgroundColor: followingParam ? 'var(--accent)' : 'transparent',
                    color: followingParam ? 'var(--accent-fg, #FFFFFF)' : 'var(--text-secondary)',
                    padding: '4px 10px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Following</span>
                </button>

                {/* Section Pills */}
                {SECTIONS.map((sec) => {
                  const isActive = sectionParam?.toLowerCase() === sec.toLowerCase();
                  return (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => handleSectionSelect(sec)}
                      style={{
                        border: '1px solid var(--border-default)',
                        backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                        color: isActive ? 'var(--accent-fg, #FFFFFF)' : 'var(--text-secondary)',
                        padding: '4px 10px',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      {sec}
                    </button>
                  );
                })}
              </div>

              {/* Sorter Controls */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                }}
              >
                <span>
                  {filteredEssays.length} {filteredEssays.length === 1 ? 'essay' : 'essays'}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => handleSortChange('curated')}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: sortParam === 'curated' ? 'var(--accent)' : 'inherit',
                      fontWeight: sortParam === 'curated' ? 600 : 400,
                      cursor: 'pointer',
                      textDecoration: sortParam === 'curated' ? 'underline' : 'none',
                      textUnderlineOffset: '3px',
                    }}
                  >
                    Curated
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => handleSortChange('newest')}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: sortParam === 'newest' ? 'var(--accent)' : 'inherit',
                      fontWeight: sortParam === 'newest' ? 600 : 400,
                      cursor: 'pointer',
                      textDecoration: sortParam === 'newest' ? 'underline' : 'none',
                      textUnderlineOffset: '3px',
                    }}
                  >
                    Recent
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => handleSortChange('appreciated')}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: sortParam === 'appreciated' ? 'var(--accent)' : 'inherit',
                      fontWeight: sortParam === 'appreciated' ? 600 : 400,
                      cursor: 'pointer',
                      textDecoration: sortParam === 'appreciated' ? 'underline' : 'none',
                      textUnderlineOffset: '3px',
                    }}
                  >
                    Most Appreciated
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Essays Contents List */}
          {filteredEssays.length === 0 ? (
            isShelfPath ? (
              <EmptyShelfState
                filterType={filterParam}
                onExplore={() => {
                  setIndexView('contents');
                  navigate('/');
                }}
                onSignIn={() => {}}
                isAuthenticated={true}
              />
            ) : (
              <EmptySearchState query={queryParam} onReset={() => handleSectionSelect('')} />
            )
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filteredEssays.map((essay, idx) => (
                <PostRow
                  key={essay.id}
                  post={essay}
                  index={idx}
                  onOpen={handleOpenEssay}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
