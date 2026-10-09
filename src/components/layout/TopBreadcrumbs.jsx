import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useAuthStore } from '../../store/authStore';
import { ThemeToggle } from '../../features/theme/ThemeToggle';
import { Search, Menu, User, LogOut, Bookmark, Heart, FileText, ChevronDown } from 'lucide-react';

/**
 * TopBreadcrumbs — STACKTRACE Literary Review Masthead & Navigation
 * Exact implementation of the STACKTRACE screen from StitchMCP with integrated Reader Auth.
 */
export function TopBreadcrumbs() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    setMobileDrawerOpen,
    setCommandPaletteOpen,
    openTab,
    indexView,
    setIndexView,
  } = useWorkspaceStore();

  const {
    user,
    userBookmarks,
    userLikes,
    logout,
    openAuthModal,
  } = useAuthStore();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pathname = location.pathname;

  const handleWrite = () => {
    openTab({
      id: 'editor-new',
      slug: 'new-story',
      title: 'untitled_manuscript.md',
      type: 'editor',
    });
    navigate('/write');
  };

  const isDiscover = pathname === '/' && indexView === 'contents';
  const isBookmarks = pathname === '/shelf' || (pathname === '/' && indexView === 'shelf');
  const isDesk = pathname === '/desk' || pathname === '/my-posts';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flexShrink: 0 }}>
      {/* 1. TOP BANNER RULE (PRINT RUN / ARCHIVE REGISTRY) */}
      <div
        style={{
          width: '100%',
          backgroundColor: 'var(--bg-surface-elevated)',
          borderBottom: '1px solid var(--border-default)',
          padding: '6px 24px',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-sans)',
          fontSize: '11px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <span>VOL. IX — AUTUMN ARCHIVE · ISSUE NO. 42</span>
          <span style={{ color: 'var(--text-muted)' }}>
            PRINTED &amp; DISPATCHED DIGITALLY ON ARCHIVAL STANDARDS
          </span>
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
            CIRCULATION: 12,400 COPIES
          </span>
        </div>
      </div>

      {/* 2. FORMAL LITERARY MASTHEAD */}
      <header
        style={{
          width: '100%',
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '28px 24px 20px',
            textAlign: 'center',
          }}
        >
          <Link
            to="/"
            onClick={() => setIndexView('contents')}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'inline-block',
            }}
          >
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
                fontWeight: 400,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                margin: 0,
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}
            >
              STACKTRACE
            </h1>
          </Link>

          <div
            style={{
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ width: '36px', height: '1px', backgroundColor: 'var(--border-default)', display: 'inline-block' }} />
            <span>ESSAYS · STORIES · IDEAS</span>
            <span style={{ width: '36px', height: '1px', backgroundColor: 'var(--border-default)', display: 'inline-block' }} />
          </div>
        </div>

        {/* 3. NAVIGATION BAR */}
        <nav
          aria-label="Main Navigation"
          style={{
            width: '100%',
            borderTop: '1px solid var(--border-default)',
            padding: '10px 24px',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Desktop Navigation Links */}
            <div
              className="desktop-nav-links"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '28px',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setIndexView('contents');
                  navigate('/');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '4px 0',
                  color: isDiscover ? 'var(--accent)' : 'var(--text-secondary)',
                  borderBottom: isDiscover ? '2px solid var(--accent)' : '2px solid transparent',
                  fontWeight: isDiscover ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'color var(--duration-fast)',
                }}
              >
                Discover
              </button>

              <button
                type="button"
                onClick={() => {
                  setIndexView('contents');
                  navigate('/?section=Culture');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '4px 0',
                  color: 'var(--text-secondary)',
                  borderBottom: '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'color var(--duration-fast)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                Essays
              </button>

              <button
                type="button"
                onClick={() => {
                  setIndexView('contents');
                  navigate('/?section=Personal');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '4px 0',
                  color: 'var(--text-secondary)',
                  borderBottom: '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'color var(--duration-fast)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                Stories
              </button>

              <button
                type="button"
                onClick={() => {
                  setIndexView('contents');
                  navigate('/?section=Ideas');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '4px 0',
                  color: 'var(--text-secondary)',
                  borderBottom: '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'color var(--duration-fast)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                Topics
              </button>

              <button
                type="button"
                onClick={() => {
                  setIndexView('shelf');
                  navigate('/shelf');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '4px 0',
                  color: isBookmarks ? 'var(--accent)' : 'var(--text-secondary)',
                  borderBottom: isBookmarks ? '2px solid var(--accent)' : '2px solid transparent',
                  fontWeight: isBookmarks ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'color var(--duration-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>Bookmarks</span>
                {userBookmarks.length > 0 && (
                  <span
                    style={{
                      fontSize: '10px',
                      padding: '1px 5px',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-default)',
                      color: 'var(--accent)',
                      fontWeight: 600,
                      borderRadius: 0,
                    }}
                  >
                    {userBookmarks.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/desk')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '4px 0',
                  color: isDesk ? 'var(--accent)' : 'var(--text-secondary)',
                  borderBottom: isDesk ? '2px solid var(--accent)' : '2px solid transparent',
                  fontWeight: isDesk ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'color var(--duration-fast)',
                }}
              >
                My Writing
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="mobile-only" style={{ display: 'none' }}>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <Menu size={18} />
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>INDEX</span>
              </button>
            </div>

            {/* Trailing actions: Search, Reader Auth Widget, Theme Toggle, Write Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {/* Search Trigger */}
              <div
                onClick={() => setCommandPaletteOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-default)',
                  padding: '6px 10px',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'border-color var(--duration-fast)',
                }}
              >
                <Search size={14} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-serif)', minWidth: '110px' }}>
                  Search archive...
                </span>
                <span className="kbd-chip" style={{ fontSize: '9px', padding: '1px 4px' }}>
                  ⌘K
                </span>
              </div>

              {/* Reader Auth Identification Widget */}
              {user ? (
                <div ref={dropdownRef} style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'none',
                      border: '1px solid var(--border-default)',
                      padding: '4px 10px',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontFamily: 'var(--font-sans)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <span
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent-container, #793C46)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 600,
                      }}
                    >
                      {user.initials || 'R'}
                    </span>
                    <span style={{ fontWeight: 600 }} className="desktop-only">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown size={12} style={{ color: 'var(--text-muted)' }} />
                  </button>

                  {userDropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 6px)',
                        right: 0,
                        width: '240px',
                        backgroundColor: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-default)',
                        boxShadow: 'var(--shadow-hard, 0 4px 12px rgba(0,0,0,0.08))',
                        zIndex: 100,
                        padding: '12px 0',
                        fontSize: '12px',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      {/* User Info Header */}
                      <div style={{ padding: '0 16px 10px', borderBottom: '1px solid var(--border-default)' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {user.role} · {user.memberNumber}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--accent)', marginTop: '2px' }}>
                          {user.email}
                        </div>
                      </div>

                      {/* User Links */}
                      <div style={{ padding: '6px 0', display: 'flex', flexDirection: 'column' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            setIndexView('shelf');
                            navigate('/shelf');
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 16px',
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            width: '100%',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface)')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Bookmark size={13} style={{ color: 'var(--accent)' }} />
                            <span>My Bookmarks</span>
                          </span>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                            {userBookmarks.length}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            setIndexView('shelf');
                            navigate('/shelf?filter=liked');
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 16px',
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            width: '100%',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface)')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Heart size={13} style={{ color: 'var(--accent)' }} />
                            <span>Appreciated Dispatches</span>
                          </span>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                            {userLikes.length}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            navigate('/desk');
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            width: '100%',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface)')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <FileText size={13} style={{ color: 'var(--text-muted)' }} />
                          <span>Author’s Desk</span>
                        </button>
                      </div>

                      {/* Sign Out */}
                      <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: '6px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            width: '100%',
                            fontSize: '11px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface)')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <LogOut size={13} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'none',
                    border: '1px solid var(--border-default)',
                    padding: '6px 12px',
                    fontSize: '11px',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    transition: 'all var(--duration-fast)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.color = 'var(--accent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-default)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                >
                  <User size={13} />
                  <span>Sign In</span>
                </button>
              )}

              {/* Theme toggle */}
              <ThemeToggle />

              {/* Primary action button: Write a Story */}
              <button
                type="button"
                onClick={handleWrite}
                className="button-primary"
                style={{
                  backgroundColor: 'var(--accent-container, #793C46)',
                  color: '#FFFFFF',
                  padding: '8px 18px',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                }}
              >
                WRITE A STORY
              </button>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
