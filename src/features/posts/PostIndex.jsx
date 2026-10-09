import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { postService } from '../../lib/postService';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useAuthStore } from '../../store/authStore';
import { useDebounce } from '../../hooks/useDebounce';
import { PostRow } from './PostRow';
import { EmptySearchState, EmptyShelfState } from '../search/EmptySearchState';
import { PostIndexMasthead } from './PostIndexMasthead';
import { ArrowUpRight, ArrowRight, Check, Bookmark, Heart } from 'lucide-react';

export function PostIndex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    openTab,
    indexView,
    setIndexView,
    essaysVersion,
  } = useWorkspaceStore();

  const {
    userBookmarks,
    userLikes,
    user,
    openAuthModal,
  } = useAuthStore();

  const isShelfPath = location.pathname === '/shelf' || location.pathname === '/bookmarks' || searchParams.get('view') === 'shelf';
  const effectiveIndexView = isShelfPath ? 'shelf' : indexView;

  const [allEssays, setAllEssays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Newsletter subscribe state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Sync state with URL query params
  const queryParam = searchParams.get('q') || '';
  const sectionParam = searchParams.get('section') || searchParams.get('tag') || null;
  const sortParam = searchParams.get('sort') || 'curated';
  const filterParam = searchParams.get('filter') || 'bookmarks';

  const [searchInput, setSearchInput] = useState(queryParam);
  const debouncedSearch = useDebounce(searchInput, 100);

  // Load published posts
  useEffect(() => {
    setIsLoading(true);
    postService.getAll(false).then((publishedPosts) => {
      setAllEssays(publishedPosts);
      setIsLoading(false);
    });
  }, [essaysVersion]);

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
    let list = [...allEssays];

    if (effectiveIndexView === 'shelf') {
      const isLiked = filterParam === 'liked';
      const targetIds = isLiked ? userLikes : userBookmarks;
      const savedSet = new Set(targetIds);
      list = list.filter((e) => savedSet.has(e.id));
    }

    if (sectionParam) {
      const secLower = sectionParam.toLowerCase();
      list = list.filter(
        (e) =>
          (e.section && e.section.toLowerCase() === secLower) ||
          (e.tags && e.tags.some((t) => t.toLowerCase() === secLower))
      );
    }

    if (queryParam) {
      const q = queryParam.toLowerCase();
      list = list.filter((e) => {
        return (
          (e.title && e.title.toLowerCase().includes(q)) ||
          (e.dek && e.dek.toLowerCase().includes(q)) ||
          (e.author?.name && e.author.name.toLowerCase().includes(q)) ||
          (e.content && e.content.toLowerCase().includes(q))
        );
      });
    }

    if (sortParam === 'newest') {
      list.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    } else if (sortParam === 'appreciated') {
      list.sort((a, b) => (b.appreciationCount || 0) - (a.appreciationCount || 0));
    }

    return list;
  }, [allEssays, effectiveIndexView, userBookmarks, userLikes, filterParam, sectionParam, queryParam, sortParam]);

  const handleOpenEssay = (essay) => {
    openTab({
      id: essay.id,
      slug: essay.slug,
      title: `№ ${String(essay.essayNumber || 1).padStart(2, '0')} ${essay.title.slice(0, 24)}...`,
      type: 'essay',
    });
    navigate(`/essays/${essay.slug}`);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setNewsletterSubscribed(false);
    }, 4000);
  };

  // Dedicated articles for the exact broadsheet layout
  const leadStory = allEssays.find((e) => e.slug === 'the-hidden-cost-of-always-being-productive') || allEssays[1];
  const story2 = allEssays.find((e) => e.slug === 'notes-from-a-city-that-never-quite-sleeps') || allEssays[2];
  const story3 = allEssays.find((e) => e.slug === 'on-learning-to-live-with-unanswered-questions') || allEssays[3];
  const story4 = allEssays.find((e) => e.slug === 'a-small-defence-of-doing-things-slowly') || allEssays[4];
  const story5 = allEssays.find((e) => e.slug === 'what-we-lose-when-everything-becomes-convenient') || allEssays[5];

  const hasFilter = Boolean(queryParam || sectionParam || effectiveIndexView === 'shelf');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100%',
        backgroundColor: 'var(--bg-canvas)',
      }}
    >
      {/* Hero & Lead Feature Spread */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', padding: '0 24px' }}>
        <PostIndexMasthead
          indexView={effectiveIndexView}
          selectedSection={sectionParam}
          onSelectSection={handleSectionSelect}
          sortBy={sortParam}
          onSortChange={handleSortChange}
        />
      </div>

      {/* Main Folio Index & Curated Broadsheet Grid */}
      <main
        style={{
          width: '100%',
          backgroundColor: 'var(--bg-surface)',
          padding: '48px 0 64px',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          {/* Section Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border-default)',
              paddingBottom: '16px',
              marginBottom: '40px',
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: 'var(--accent)',
                  fontWeight: 600,
                  display: 'block',
                }}
              >
                {effectiveIndexView === 'shelf' ? 'Personal Reading Archive' : 'Folio Index'}
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  color: 'var(--text-primary)',
                  fontWeight: 400,
                  margin: '4px 0 0',
                }}
              >
                {effectiveIndexView === 'shelf'
                  ? filterParam === 'liked'
                    ? 'Appreciated Dispatches'
                    : 'Preserved Reading Shelf'
                  : 'Essays & Long-Form Criticism'}
              </h3>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '14px',
                color: 'var(--text-muted)',
                maxWidth: '300px',
                textAlign: 'right',
                margin: 0,
              }}
              className="desktop-only"
            >
              {effectiveIndexView === 'shelf'
                ? 'Curated private index stored with member credentials.'
                : 'Curated weekly dispatches on human cadence, attention, and craftsmanship.'}
            </p>
          </div>

          {/* Shelf Mode Switcher: Bookmarks vs Liked */}
          {effectiveIndexView === 'shelf' && (
            <div
              style={{
                maxWidth: '880px',
                margin: '0 auto 32px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                borderBottom: '1px solid var(--border-default)',
                paddingBottom: '12px',
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
                  padding: '6px 14px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: filterParam !== 'liked' ? 600 : 400,
                  color: filterParam !== 'liked' ? 'var(--accent)' : 'var(--text-secondary)',
                  borderBottom: filterParam !== 'liked' ? '2px solid var(--accent)' : '2px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all var(--duration-fast)',
                }}
              >
                <Bookmark size={14} fill={filterParam !== 'liked' ? 'currentColor' : 'none'} />
                <span>Saved Bookmarks ({userBookmarks.length})</span>
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
                  padding: '6px 14px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: filterParam === 'liked' ? 600 : 400,
                  color: filterParam === 'liked' ? 'var(--accent)' : 'var(--text-secondary)',
                  borderBottom: filterParam === 'liked' ? '2px solid var(--accent)' : '2px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all var(--duration-fast)',
                }}
              >
                <Heart size={14} fill={filterParam === 'liked' ? 'currentColor' : 'none'} />
                <span>Appreciated Dispatches ({userLikes.length})</span>
              </button>
            </div>
          )}

          {/* If there's an active search or filter, show direct list of matching items */}
          {hasFilter ? (
            <div style={{ maxWidth: '880px', margin: '0 auto' }}>
              {filteredEssays.length === 0 ? (
                effectiveIndexView === 'shelf' ? (
                  <EmptyShelfState
                    filterType={filterParam}
                    onExplore={() => {
                      setIndexView('contents');
                      navigate('/');
                    }}
                    onSignIn={() => openAuthModal('signin')}
                    isAuthenticated={Boolean(user)}
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
          ) : (
            /* EXACT BROADSHEET ASYMMETRICAL LAYOUT: 8 cols (Articles) / 4 cols (Literary Sidebar) */
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: '40px',
              }}
            >
              {/* Left Column: Varied Multi-Column Grid of Stories (8 Cols) */}
              <div
                style={{
                  gridColumn: 'span 8',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '40px',
                }}
                className="col-span-8-content"
              >
                {/* Story 1: Large Featured Lead */}
                {leadStory && (
                  <article
                    style={{
                      borderBottom: '1px solid var(--border-default)',
                      paddingBottom: '36px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '8px',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '11px',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <span style={{ color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {leadStory.category || 'Personal Essay'}
                      </span>
                      <span>·</span>
                      <span>{leadStory.readTimeMinutes || 8} min read</span>
                      <span>·</span>
                      <span style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {leadStory.badge || `Issue ${leadStory.essayNumber || 42}`}
                      </span>
                    </div>

                    <h4
                      onClick={() => handleOpenEssay(leadStory)}
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.95rem',
                        lineHeight: 1.25,
                        fontWeight: 400,
                        color: 'var(--text-primary)',
                        margin: '0 0 12px',
                        cursor: 'pointer',
                        transition: 'color var(--duration-fast)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                    >
                      {leadStory.title}
                    </h4>

                    <p
                      style={{
                        fontSize: '1.1rem',
                        lineHeight: 1.7,
                        color: 'var(--text-secondary)',
                        margin: '0 0 18px',
                      }}
                    >
                      {leadStory.dek}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '12px',
                      }}
                    >
                      <div style={{ color: 'var(--text-primary)' }}>
                        By <span style={{ fontWeight: 600 }}>{leadStory.author?.name || 'Clara Morisot'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenEssay(leadStory)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          fontFamily: 'var(--font-sans)',
                          fontSize: '11px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: 'var(--accent)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span>Read Dispatch</span>
                        <ArrowUpRight size={13} />
                      </button>
                    </div>
                  </article>
                )}

                {/* Split Row: Story 2 & Story 3 in 2-Column Hairline Box */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '32px',
                    borderBottom: '1px solid var(--border-default)',
                    paddingBottom: '36px',
                  }}
                >
                  {/* Story 2 */}
                  {story2 && (
                    <article
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        paddingRight: '16px',
                        borderRight: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '8px',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '11px',
                            color: 'var(--text-muted)',
                          }}
                        >
                          <span style={{ color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase' }}>
                            {story2.category || 'Field Dispatch'}
                          </span>
                          <span>·</span>
                          <span>{story2.readTimeMinutes || 11} min read</span>
                        </div>
                        <h4
                          onClick={() => handleOpenEssay(story2)}
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.45rem',
                            lineHeight: 1.25,
                            fontWeight: 400,
                            color: 'var(--text-primary)',
                            margin: '0 0 10px',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                        >
                          {story2.title}
                        </h4>
                        <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
                          {story2.dek}
                        </p>
                      </div>
                      <div
                        style={{
                          marginTop: '20px',
                          paddingTop: '12px',
                          borderTop: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '11px',
                        }}
                      >
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{story2.author?.name}</span>
                        <span
                          onClick={() => handleOpenEssay(story2)}
                          style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}
                        >
                          Read →
                        </span>
                      </div>
                    </article>
                  )}

                  {/* Story 3 */}
                  {story3 && (
                    <article style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '8px',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '11px',
                            color: 'var(--text-muted)',
                          }}
                        >
                          <span style={{ color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase' }}>
                            {story3.category || 'Philosophy'}
                          </span>
                          <span>·</span>
                          <span>{story3.readTimeMinutes || 9} min read</span>
                        </div>
                        <h4
                          onClick={() => handleOpenEssay(story3)}
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.45rem',
                            lineHeight: 1.25,
                            fontWeight: 400,
                            color: 'var(--text-primary)',
                            margin: '0 0 10px',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                        >
                          {story3.title}
                        </h4>
                        <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
                          {story3.dek}
                        </p>
                      </div>
                      <div
                        style={{
                          marginTop: '20px',
                          paddingTop: '12px',
                          borderTop: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '11px',
                        }}
                      >
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{story3.author?.name}</span>
                        <span
                          onClick={() => handleOpenEssay(story3)}
                          style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}
                        >
                          Read →
                        </span>
                      </div>
                    </article>
                  )}
                </div>

                {/* Horizontal Story Rows: Story 4 & Story 5 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {story4 && (
                    <article style={{ borderBottom: '1px solid var(--border-default)', paddingBottom: '28px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: '8px',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '11px',
                          color: 'var(--text-muted)',
                        }}
                      >
                        <span style={{ color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase' }}>
                          {story4.category || 'Culture'}
                        </span>
                        <span>·</span>
                        <span>{story4.readTimeMinutes || 6} min read</span>
                      </div>
                      <h4
                        onClick={() => handleOpenEssay(story4)}
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.5rem',
                          fontWeight: 400,
                          color: 'var(--text-primary)',
                          margin: '0 0 8px',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                      >
                        {story4.title}
                      </h4>
                      <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--text-secondary)', margin: '0 0 12px' }}>
                        {story4.dek}
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '11px',
                        }}
                      >
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{story4.author?.name}</span>
                        <span
                          onClick={() => handleOpenEssay(story4)}
                          style={{ color: 'var(--accent)', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}
                        >
                          Examine piece →
                        </span>
                      </div>
                    </article>
                  )}

                  {story5 && (
                    <article style={{ borderBottom: '1px solid var(--border-default)', paddingBottom: '28px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: '8px',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '11px',
                          color: 'var(--text-muted)',
                        }}
                      >
                        <span style={{ color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase' }}>
                          {story5.category || 'Ideas'}
                        </span>
                        <span>·</span>
                        <span>{story5.readTimeMinutes || 12} min read</span>
                      </div>
                      <h4
                        onClick={() => handleOpenEssay(story5)}
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.5rem',
                          fontWeight: 400,
                          color: 'var(--text-primary)',
                          margin: '0 0 8px',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                      >
                        {story5.title}
                      </h4>
                      <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--text-secondary)', margin: '0 0 12px' }}>
                        {story5.dek}
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '11px',
                        }}
                      >
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{story5.author?.name}</span>
                        <span
                          onClick={() => handleOpenEssay(story5)}
                          style={{ color: 'var(--accent)', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}
                        >
                          Examine piece →
                        </span>
                      </div>
                    </article>
                  )}
                </div>

                {/* Bottom Pagination Anchor */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--text-muted)',
                    paddingTop: '8px',
                  }}
                >
                  <span>Showing Dispatches 1—5 of {allEssays.length * 23}</span>
                  <button
                    type="button"
                    onClick={() => handleSectionSelect('')}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: 'var(--accent)',
                      borderBottom: '1px solid var(--accent)',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Explore Archival Index →
                  </button>
                </div>
              </div>

              {/* Right: Literary Columnist & Curated Sidebar (4 Cols) */}
              <aside
                style={{
                  gridColumn: 'span 4',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '36px',
                  paddingLeft: '24px',
                  borderLeft: '1px solid var(--border-default)',
                }}
                className="col-span-4-sidebar"
              >
                {/* Box 1: Letters from the Journal (Postal Dispatch Invitation) */}
                <div
                  style={{
                    border: '1px solid var(--border-default)',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    padding: '24px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                      color: 'var(--accent)',
                      fontWeight: 600,
                      display: 'block',
                      marginBottom: '4px',
                    }}
                  >
                    Correspondence
                  </span>
                  <h4
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.45rem',
                      color: 'var(--text-primary)',
                      fontWeight: 400,
                      margin: '0 0 10px',
                    }}
                  >
                    Letters from the Journal
                  </h4>
                  <p
                    style={{
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                      color: 'var(--text-secondary)',
                      margin: '0 0 18px',
                    }}
                  >
                    Dispatched every alternate Friday. An unadorned digest of three recommended long reads, margin marginalia, and editorial reflections.
                  </p>

                  <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter your correspondence email..."
                      required
                      style={{
                        width: '100%',
                        backgroundColor: 'var(--bg-input)',
                        border: '1px solid var(--border-default)',
                        padding: '9px 12px',
                        fontSize: '13px',
                        fontFamily: 'var(--font-serif)',
                        color: 'var(--text-primary)',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                    <button
                      type="submit"
                      className="button-primary"
                      style={{
                        width: '100%',
                        backgroundColor: 'var(--accent-container, #793C46)',
                        color: '#FFFFFF',
                        padding: '10px 16px',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      {newsletterSubscribed ? 'Subscribed to Letters ✓' : 'Subscribe to Letters'}
                    </button>
                  </form>

                  <p
                    style={{
                      fontSize: '11px',
                      fontFamily: 'var(--font-sans)',
                      color: 'var(--text-muted)',
                      textAlign: 'center',
                      margin: '12px 0 0',
                    }}
                  >
                    Strictly archival dispatches. Zero commerce. Unsubscribe anytime.
                  </p>
                </div>

                {/* Box 2: The Editor's Shelf */}
                <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: '24px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      marginBottom: '16px',
                    }}
                  >
                    <h4
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: 'var(--text-primary)',
                        fontWeight: 600,
                        margin: 0,
                      }}
                    >
                      The Editor’s Shelf
                    </h4>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-muted)' }}>
                      Readings
                    </span>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <li style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 600 }}>
                        Monograph
                      </span>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--text-primary)', margin: '2px 0 3px', lineHeight: 1.3 }}>
                        The Geography of Time &amp; Solitude
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                        by Kenneth M. Ross (Faber &amp; Faber, 1978)
                      </p>
                    </li>

                    <li style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 600 }}>
                        Critical Edition
                      </span>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--text-primary)', margin: '2px 0 3px', lineHeight: 1.3 }}>
                        Forms of the Personal Voice in Broadsheet Print
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                        by Dr. Martha Lindquist
                      </p>
                    </li>

                    <li style={{ paddingBottom: '4px' }}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 600 }}>
                        Archival Footnote
                      </span>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--text-primary)', margin: '2px 0 3px', lineHeight: 1.3 }}>
                        Against Instantaneous Commentary
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                        STACKTRACE Volume III, Autumn 2021
                      </p>
                    </li>
                  </ul>
                </div>

                {/* Box 3: Current Issue Colophon & Masthead Summary */}
                <div
                  style={{
                    border: '1px solid var(--border-default)',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    padding: '24px',
                  }}
                >
                  <h5
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                      color: 'var(--accent)',
                      fontWeight: 600,
                      margin: '0 0 8px',
                    }}
                  >
                    Colophon Notes
                  </h5>
                  <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)', margin: '0 0 16px' }}>
                    Printed types set digitally in EB Garamond and Newsreader, with sans titling in DM Sans. Published quarterly from editorial desks in London and Edinburgh.
                  </p>
                  <div
                    style={{
                      borderTop: '1px solid var(--border-default)',
                      paddingTop: '14px',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div><strong style={{ color: 'var(--text-primary)' }}>ISSN:</strong> 2768-9123</div>
                    <div><strong style={{ color: 'var(--text-primary)' }}>Editor-in-Chief:</strong> J. Vance</div>
                    <div><strong style={{ color: 'var(--text-primary)' }}>Senior Essayist:</strong> Clara Morisot</div>
                    <div><strong style={{ color: 'var(--text-primary)' }}>Production:</strong> Coldpress Studios</div>
                  </div>
                </div>

                {/* Box 4: Quote of the Edition */}
                <div
                  style={{
                    borderTop: '1px solid var(--border-default)',
                    borderBottom: '1px solid var(--border-default)',
                    padding: '24px 16px',
                    textAlign: 'center',
                  }}
                >
                  <blockquote
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.25rem',
                      fontStyle: 'italic',
                      lineHeight: 1.5,
                      color: 'var(--text-primary)',
                      margin: '0 0 10px',
                    }}
                  >
                    “Reading is that fruitful miracle of a communication in the midst of solitude.”
                  </blockquote>
                  <cite
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--accent)',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      display: 'block',
                    }}
                  >
                    — Marcel Proust, Sur la lecture
                  </cite>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
