import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useSocialStore } from '../../store/socialStore';
import { Search, X, UserPlus, Check } from 'lucide-react';

export function RightSidebar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    getFollowedWriters,
    getRecommendedWriters,
    toggleFollow,
    isFollowing,
    dismissRecommendation,
  } = useSocialStore();

  const queryParam = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(queryParam);

  const followedWriters = getFollowedWriters();
  const recommendedWriters = getRecommendedWriters().slice(0, 5);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchTerm.trim()) {
      params.set('q', searchTerm.trim());
      navigate(`/?${params.toString()}`);
    } else {
      params.delete('q');
      navigate('/');
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    const params = new URLSearchParams(searchParams);
    if (val.trim()) {
      params.set('q', val.trim());
    } else {
      params.delete('q');
    }
    setSearchParams(params, { replace: true });
  };

  return (
    <aside
      className="marginalia-right-sidebar desktop-only"
      aria-label="Secondary Sidebar"
      style={{
        width: 'var(--right-rail-width, 300px)',
        borderLeft: '1px solid var(--border-default)',
        backgroundColor: 'var(--bg-canvas)',
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
        flexShrink: 0,
        minHeight: 'calc(100vh - 120px)',
        position: 'sticky',
        top: 0,
        alignSelf: 'flex-start',
      }}
    >
      {/* 1. Search Box with Unicode support */}
      <div>
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
          <label htmlFor="marginalia-search-input" className="sr-only" style={{ display: 'none' }}>
            Search Marginalia
          </label>
          <Search
            size={15}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            id="marginalia-search-input"
            type="search"
            dir="auto"
            placeholder="Search essays, notes, writers..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '8px 12px 8px 32px',
              border: '1px solid var(--border-default)',
              backgroundColor: 'var(--bg-input)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              outline: 'none',
              transition: 'border-color var(--duration-fast)',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--text-primary)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                const params = new URLSearchParams(searchParams);
                params.delete('q');
                setSearchParams(params, { replace: true });
              }}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </form>
      </div>

      {/* 2. Writers you follow */}
      <section>
        <div
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-muted)',
            fontWeight: 600,
            marginBottom: '14px',
            paddingBottom: '6px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          Writers you follow
        </div>

        {followedWriters.length === 0 ? (
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '13px',
              color: 'var(--text-muted)',
              fontStyle: 'italic',
              margin: 0,
            }}
          >
            You are not following any writers yet. Follow writers from the recommendations below.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {followedWriters.map((writer) => (
              <Link
                key={writer.handle}
                to={`/writer/${writer.handle}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  textDecoration: 'none',
                  color: 'inherit',
                  padding: '4px 6px',
                  transition: 'background-color var(--duration-fast)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-default)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-display)',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--accent)',
                    flexShrink: 0,
                  }}
                >
                  {writer.initials || 'W'}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {writer.name}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {writer.role || 'Contributor'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 3. Recommended for you */}
      <section>
        <div
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-muted)',
            fontWeight: 600,
            marginBottom: '14px',
            paddingBottom: '6px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          Recommended for you
        </div>

        {recommendedWriters.length === 0 ? (
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '13px',
              color: 'var(--text-muted)',
              fontStyle: 'italic',
              margin: 0,
            }}
          >
            No more recommendations right now.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recommendedWriters.map((writer) => {
              const following = isFollowing(writer.handle);
              return (
                <div
                  key={writer.handle}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '8px',
                    paddingBottom: '10px',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  <Link
                    to={`/writer/${writer.handle}`}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      textDecoration: 'none',
                      color: 'inherit',
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        backgroundColor: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-default)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-display)',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--accent)',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      {writer.initials || 'W'}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          lineHeight: 1.2,
                        }}
                      >
                        {writer.name}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.3,
                          marginTop: '2px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {writer.bio}
                      </div>
                    </div>
                  </Link>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                    <button
                      type="button"
                      onClick={() => toggleFollow(writer.handle)}
                      style={{
                        padding: '4px 8px',
                        fontSize: '11px',
                        fontFamily: 'var(--font-sans)',
                        fontWeight: 600,
                        border: '1px solid',
                        borderColor: following ? 'var(--border-default)' : 'var(--text-primary)',
                        backgroundColor: following ? 'var(--bg-surface-elevated)' : 'var(--text-primary)',
                        color: following ? 'var(--text-secondary)' : 'var(--bg-canvas)',
                        cursor: 'pointer',
                        transition: 'all var(--duration-fast)',
                      }}
                    >
                      {following ? 'Following' : 'Follow'}
                    </button>
                    <button
                      type="button"
                      onClick={() => dismissRecommendation(writer.handle)}
                      aria-label={`Dismiss ${writer.name}`}
                      style={{
                        padding: '4px',
                        color: 'var(--text-muted)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </aside>
  );
}
