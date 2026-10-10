import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useAuthStore } from '../../store/authStore';
import { useSocialStore } from '../../store/socialStore';
import {
  Sun,
  Moon,
  LogIn,
  LogOut,
  UserPlus,
  User,
  Edit3,
  ChevronDown,
  BookOpen,
  Feather,
} from 'lucide-react';

export function LiteraryMasthead() {
  const navigate = useNavigate();
  const { theme, toggleTheme, setIndexView, setEditProfileModalOpen } = useWorkspaceStore();
  const { user, isAuthenticated, openAuthModal, logout } = useAuthStore();
  const { profile } = useSocialStore();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenProfile = () => {
    setUserMenuOpen(false);
    navigate('/profile');
  };

  const handleEditProfile = () => {
    setUserMenuOpen(false);
    setEditProfileModalOpen(true);
  };

  const handleOpenDesk = () => {
    setUserMenuOpen(false);
    navigate('/desk');
  };

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
  };

  const displayName = user?.name || profile?.name || 'Fellow Reader';
  const displayRole = user?.role || profile?.role || 'Contributing Reader';
  const displayInitials =
    user?.initials ||
    profile?.initials ||
    displayName
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  return (
    <header
      className="marginalia-masthead"
      style={{
        width: '100%',
        backgroundColor: 'var(--bg-canvas)',
        borderBottom: '1px solid var(--border-default)',
        padding: '14px 24px 12px',
      }}
    >
      {/* Top utility row: Folio issue notice, Day/Night toggle, & User-related actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1240px',
          margin: '0 auto',
          fontSize: '13px',
          fontFamily: 'var(--font-sans)',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        {/* Folio tagline */}
        <div
          style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--text-muted)',
            fontWeight: 500,
          }}
        >
          A Journal of Slow Literature &amp; Thought
        </div>

        {/* Right utility cluster: Day/Night mode + User Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          {/* Day/Night Mode toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'day' ? 'Switch to Night mode' : 'Switch to Day mode'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              border: '1px solid var(--border-default)',
              borderRadius: '9999px',
              backgroundColor: 'var(--bg-surface-elevated)',
              color: 'var(--text-primary)',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              cursor: 'pointer',
              transition: 'all var(--duration-fast)',
            }}
          >
            {theme === 'day' ? (
              <>
                <Moon size={12} style={{ color: 'var(--accent)' }} />
                <span>Night</span>
              </>
            ) : (
              <>
                <Sun size={12} style={{ color: 'var(--accent)' }} />
                <span>Day</span>
              </>
            )}
          </button>

          {/* Thin vertical separator */}
          <div
            style={{
              width: '1px',
              height: '16px',
              backgroundColor: 'var(--border-default)',
              margin: '0 2px',
            }}
          />

          {/* User Related Actions (Sign In / Register when logged out, Profile / Edit Profile / Logout when logged in) */}
          {!isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                onClick={() => openAuthModal('signin')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 14px',
                  border: '1px solid var(--accent)',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--accent)',
                  color: 'var(--accent-fg, #ffffff)',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast)',
                }}
              >
                <LogIn size={12} />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => openAuthModal('signup')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 12px',
                  border: '1px solid var(--border-default)',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  color: 'var(--text-secondary)',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast)',
                }}
              >
                <UserPlus size={12} />
                <span>Join</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* User Account Monogram Pill & Dropdown */}
              <div style={{ position: 'relative' }} ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '3px 10px 3px 4px',
                    border: '1px solid var(--border-default)',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all var(--duration-fast)',
                  }}
                >
                  <span
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent)',
                      color: 'var(--accent-fg, #ffffff)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {displayInitials}
                  </span>
                  <span
                    style={{
                      maxWidth: '120px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontWeight: 500,
                    }}
                  >
                    {displayName}
                  </span>
                  <ChevronDown
                    size={12}
                    style={{
                      color: 'var(--text-muted)',
                      transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform var(--duration-fast)',
                    }}
                  />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      width: '230px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-default)',
                      borderRadius: '12px',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                      padding: '8px',
                      zIndex: 1000,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    {/* User Profile Mini Header */}
                    <div
                      style={{
                        padding: '8px 10px 10px',
                        borderBottom: '1px solid var(--border-subtle)',
                        marginBottom: '4px',
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: '13px',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {displayName}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--text-muted)',
                          marginTop: '2px',
                        }}
                      >
                        {displayRole}
                      </div>
                      {user?.memberNumber && (
                        <div
                          style={{
                            fontFamily: 'var(--font-mono, monospace)',
                            fontSize: '9px',
                            color: 'var(--accent)',
                            marginTop: '4px',
                            letterSpacing: '0.06em',
                          }}
                        >
                          {user.memberNumber}
                        </div>
                      )}
                    </div>

                    {/* Menu links */}
                    <button
                      type="button"
                      onClick={handleOpenProfile}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '7px 10px',
                        border: 'none',
                        borderRadius: '6px',
                        backgroundColor: 'transparent',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color var(--duration-fast)',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = 'transparent')
                      }
                    >
                      <User size={13} style={{ color: 'var(--accent)' }} />
                      <span>View My Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleEditProfile}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '7px 10px',
                        border: 'none',
                        borderRadius: '6px',
                        backgroundColor: 'transparent',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color var(--duration-fast)',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = 'transparent')
                      }
                    >
                      <Edit3 size={13} style={{ color: 'var(--accent)' }} />
                      <span>Edit User Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenDesk}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '7px 10px',
                        border: 'none',
                        borderRadius: '6px',
                        backgroundColor: 'transparent',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color var(--duration-fast)',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = 'transparent')
                      }
                    >
                      <Feather size={13} style={{ color: 'var(--accent)' }} />
                      <span>My Author Desk</span>
                    </button>

                    <div
                      style={{
                        height: '1px',
                        backgroundColor: 'var(--border-subtle)',
                        margin: '4px 0',
                      }}
                    />

                    <button
                      type="button"
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '7px 10px',
                        border: 'none',
                        borderRadius: '6px',
                        backgroundColor: 'transparent',
                        color: 'var(--text-muted)',
                        fontSize: '12px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all var(--duration-fast)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)';
                        e.currentTarget.style.color = 'var(--accent)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-muted)';
                      }}
                    >
                      <LogOut size={13} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Quick direct Edit Profile button above */}
              <button
                type="button"
                onClick={() => setEditProfileModalOpen(true)}
                title="Edit your reader profile"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 12px',
                  border: '1px solid var(--border-default)',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  color: 'var(--text-primary)',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast)',
                }}
              >
                <Edit3 size={12} style={{ color: 'var(--accent)' }} />
                <span>Edit Profile</span>
              </button>

              {/* Quick direct Logout button above */}
              <button
                type="button"
                onClick={() => logout()}
                title="Log out of Marginalia"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 12px',
                  border: '1px solid var(--border-default)',
                  borderRadius: '9999px',
                  backgroundColor: 'transparent',
                  color: 'var(--text-muted)',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast)',
                }}
              >
                <LogOut size={12} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Literary Masthead Title & Thin Double Rule */}
      <div
        style={{
          maxWidth: '1240px',
          margin: '14px auto 0',
          textAlign: 'center',
        }}
      >
        <Link
          to="/"
          onClick={() => setIndexView('contents')}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
              fontWeight: 400,
              letterSpacing: '0.02em',
              margin: '0 auto',
              lineHeight: 1.1,
              color: 'var(--text-primary)',
            }}
          >
            Marginalia
          </h1>
        </Link>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '14px',
            color: 'var(--text-muted)',
            margin: '4px 0 12px',
          }}
        >
          An Independent Journal of Literature, Reflections &amp; Ideas
        </p>

        {/* Thin Double Rule */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            maxWidth: '100%',
            margin: '0 auto',
          }}
        >
          <div style={{ height: '1px', backgroundColor: 'var(--border-strong)', width: '100%' }} />
          <div style={{ height: '1px', backgroundColor: 'var(--border-default)', width: '100%' }} />
        </div>
      </div>
    </header>
  );
}
