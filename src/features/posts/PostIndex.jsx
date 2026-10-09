import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { postService } from '../../lib/postService';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useDebounce } from '../../hooks/useDebounce';
import { useHotkeys } from '../../hooks/useHotkeys';
import { PostRow } from './PostRow';
import { PostCard } from './PostCard';
import { SearchFilterBar } from '../search/SearchFilterBar';
import { EmptySearchState } from '../search/EmptySearchState';
import { SkeletonPostRow } from '../../components/ui/Skeleton';
import { TypewriterText } from '../../components/common/TypewriterText';
import { FileText, Terminal, Layers } from 'lucide-react';

export function PostIndex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { viewMode, setViewMode, openTab, postsVersion, setActiveWordCount, setActiveReadTime } = useWorkspaceStore();

  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Sync state with URL query params
  const queryParam = searchParams.get('q') || '';
  const tagParam = searchParams.get('tag') || null;
  const sortParam = searchParams.get('sort') || 'newest';
  const viewParam = searchParams.get('view') || viewMode;

  const [searchInput, setSearchInput] = useState(queryParam);
  const debouncedSearch = useDebounce(searchInput, 120);

  // Load posts and tags
  useEffect(() => {
    setIsLoading(true);
    Promise.all([postService.getAll(), postService.getTags()]).then(([allPosts, allTags]) => {
      setPosts(allPosts);
      setTags(allTags);
      setIsLoading(false);

      // Status metrics for README
      const totalWords = allPosts.reduce((acc, p) => acc + (p.content?.split(/\s+/).length || 0), 0);
      setActiveWordCount(totalWords);
      setActiveReadTime(Math.ceil(totalWords / 200));
    });
  }, [postsVersion, setActiveWordCount, setActiveReadTime]);

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

  const handleTagSelect = (tag) => {
    const params = new URLSearchParams(searchParams);
    if (tag) {
      params.set('tag', tag);
    } else {
      params.delete('tag');
    }
    setSearchParams(params, { replace: true });
  };

  const handleSortChange = (newSort) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', newSort);
    setSearchParams(params, { replace: true });
  };

  // Filter and Sort posts
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Search query filter
    if (queryParam) {
      const q = queryParam.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.filename.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.content.toLowerCase().includes(q)
      );
    }

    // Tag filter
    if (tagParam) {
      result = result.filter((p) => p.tags.includes(tagParam));
    }

    // Sort order
    if (sortParam === 'newest') {
      result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (sortParam === 'stars') {
      result.sort((a, b) => (b.stars || 0) - (a.stars || 0));
    } else if (sortParam === 'readTime') {
      result.sort((a, b) => (a.readTimeMinutes || 0) - (b.readTimeMinutes || 0));
    }

    return result;
  }, [posts, queryParam, tagParam, sortParam]);

  // Keep selected index within bounds
  useEffect(() => {
    setSelectedIndex((prev) => Math.min(prev, Math.max(0, filteredPosts.length - 1)));
  }, [filteredPosts.length]);

  const handleOpenPost = useCallback((post) => {
    if (!post) return;
    openTab({
      id: post.id,
      slug: post.slug,
      title: post.filename,
      type: 'post',
    });
    navigate(`/posts/${post.slug}`);
  }, [openTab, navigate]);

  // Keyboard navigation: j/k, Enter, /
  const hotkeyMap = useMemo(() => ({
    j: () => setSelectedIndex((prev) => Math.min(prev + 1, Math.max(0, filteredPosts.length - 1))),
    k: () => setSelectedIndex((prev) => Math.max(prev - 1, 0)),
    enter: () => {
      if (filteredPosts[selectedIndex]) {
        handleOpenPost(filteredPosts[selectedIndex]);
      }
    },
    '/': () => {
      document.getElementById('main-search-input')?.focus();
    },
  }), [filteredPosts, selectedIndex, handleOpenPost]);

  useHotkeys(hotkeyMap);

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        padding: '24px 32px 64px 32px',
        fontFamily: 'var(--font-mono)',
        backgroundColor: 'var(--bg-canvas)',
      }}
    >
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        {/* README.md Header Section */}
        <div
          style={{
            borderBottom: '1px solid var(--border-default)',
            paddingBottom: '16px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginBottom: '6px',
            }}
          >
            <FileText size={14} style={{ color: 'var(--accent)' }} />
            <span>README.md</span>
            <span>//</span>
            <span style={{ color: 'var(--text-secondary)' }}>ENGINEERING REPOSITORY</span>
          </div>

          <h1
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              margin: '0 0 8px 0',
            }}
          >
            <TypewriterText text="devlog // systems, architecture, and internals" speed={24} />
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              maxWidth: '72ch',
              margin: 0,
            }}
          >
            A dense engineering log written for developers. Real technical deep-dives on Rust memory, Postgres indexing, container caching, concurrent runtimes, and distributed consensus.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginTop: '12px',
            }}
          >
            <span className="tabular-nums">
              TOTAL ARTICLES: <strong style={{ color: 'var(--text-primary)' }}>{posts.length}</strong>
            </span>
            <span>•</span>
            <span className="tabular-nums">
              BRANCH: <strong style={{ color: 'var(--accent)' }}>main</strong>
            </span>
            <span>•</span>
            <span>
              USE <span className="kbd-chip">J</span> <span className="kbd-chip">K</span> TO NAVIGATE
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <SearchFilterBar
          searchQuery={searchInput}
          onSearchChange={setSearchInput}
          availableTags={tags}
          selectedTag={tagParam}
          onTagSelect={handleTagSelect}
          sortOrder={sortParam}
          onSortChange={handleSortChange}
          totalResults={posts.length}
        />

        {/* Post Results List / Grid */}
        {isLoading ? (
          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-1)' }}>
            <SkeletonPostRow />
            <SkeletonPostRow />
            <SkeletonPostRow />
            <SkeletonPostRow />
            <SkeletonPostRow />
          </div>
        ) : filteredPosts.length === 0 ? (
          <EmptySearchState
            query={queryParam}
            onReset={() => {
              setSearchInput('');
              handleTagSelect(null);
            }}
          />
        ) : viewMode === 'list' ? (
          /* Table-style List View */
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
                gridTemplateColumns: '36px 1fr auto auto auto auto 44px',
                gap: '12px',
                padding: '8px 12px',
                backgroundColor: 'var(--bg-surface-elevated)',
                borderBottom: '1px solid var(--border-default)',
                fontSize: '10px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              <span style={{ textAlign: 'right' }}>#</span>
              <span>FILE // DOCUMENT</span>
              <span>TAGS</span>
              <span>DATE</span>
              <span>TIME</span>
              <span>STARS</span>
              <span style={{ textAlign: 'right' }}>STASH</span>
            </div>

            {/* List Rows with Staggered Entrance */}
            {filteredPosts.map((post, idx) => (
              <PostRow
                key={post.id}
                post={post}
                index={idx}
                isSelected={idx === selectedIndex}
                onOpen={handleOpenPost}
              />
            ))}
          </div>
        ) : (
          /* Dense Flat Grid View */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
              gap: '14px',
            }}
          >
            {filteredPosts.map((post, idx) => (
              <PostCard
                key={post.id}
                post={post}
                index={idx}
                onOpen={handleOpenPost}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
