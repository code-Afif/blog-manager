import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useSocialStore } from '../../store/socialStore';
import { useAuthStore } from '../../store/authStore';
import {
  Home,
  Bookmark,
  Compass,
  Bell,
  User,
  Plus,
  ChevronDown,
  FileText,
  MessageSquare,
} from 'lucide-react';

export function LeftNavRail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openNotesComposer, setIndexView } = useWorkspaceStore();
  const { profile } = useSocialStore();
  const { user, isAuthenticated, openAuthModal } = useAuthStore();
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const createMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (createMenuRef.current && !createMenuRef.current.contains(e.target)) {
        setCreateMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreateEssay = () => {
    setCreateMenuOpen(false);
    if (!isAuthenticated) {
      openAuthModal('signin', () => navigate('/write'));
      return;
    }
    navigate('/write');
  };

  const handleCreateNote = () => {
    setCreateMenuOpen(false);
    if (!isAuthenticated) {
      openAuthModal('signin', () => openNotesComposer());
      return;
    }
    openNotesComposer();
  };

  const isNavActive = (to) => {
    if (to === '/') {
      return (
        location.pathname === '/' ||
        location.pathname === '/discover' ||
        location.pathname === '/archive'
      );
    }
    if (to === '/reading-list') {
      return (
        location.pathname === '/reading-list' ||
        location.pathname === '/shelf' ||
        location.pathname === '/bookmarks'
      );
    }
    if (to === '/profile') {
      return location.pathname === '/profile' || location.pathname.startsWith('/writer/');
    }
    return location.pathname.startsWith(to);
  };

  const navItems = [
    { label: 'Home', to: '/', icon: Home, onClick: () => setIndexView('contents') },
    { label: 'Reading List', to: '/reading-list', icon: Bookmark },
    { label: 'Explore', to: '/explore', icon: Compass },
    { label: 'Activity', to: '/activity', icon: Bell },
    { label: 'Profile', to: '/profile', icon: User },
  ];

  return (
    <>
      {/* Desktop & Tablet Left Navigation Rail */}
      <aside
        className="marginalia-left-rail"
        aria-label="Sidebar Navigation"
        style={{
          width: 'var(--left-rail-width, 220px)',
          borderRight: '1px solid var(--border-default)',
          backgroundColor: 'var(--bg-canvas)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          padding: '24px 16px',
          minHeight: 'calc(100vh - 120px)',
          position: 'sticky',
          top: 0,
          alignSelf: 'flex-start',
        }}
      >
        {/* Wordmark at the top of the rail */}
        <div style={{ marginBottom: '28px', paddingLeft: '8px' }}>
          <NavLink
            to="/"
            onClick={() => setIndexView('contents')}
            style={{
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '24px',
                fontWeight: 600,
                letterSpacing: '0.01em',
                color: 'var(--text-primary)',
              }}
            >
              Marginalia
            </span>
          </NavLink>
        </div>

        {/* Navigation Links with Liquid Slide Pill Flow */}
        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            marginBottom: '28px',
            position: 'relative',
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isNavActive(item.to);

            return (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={item.onClick}
                className="left-rail-link"
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '9px 12px',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  backgroundColor: 'transparent',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 500,
                  textDecoration: 'none',
                  borderRadius: '6px',
                  transition: 'color var(--duration-fast)',
                }}
              >
                {/* Liquid Slide Capsule (Morphs and glides between items) */}
                {isActive && (
                  <motion.div
                    layoutId="leftRailActivePill"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 30,
                      mass: 0.8,
                    }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-default)',
                      borderRadius: '6px',
                      zIndex: 0,
                      pointerEvents: 'none',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
                    }}
                  />
                )}

                {/* Liquid Flow Accent Notch on Left Edge */}
                {isActive && (
                  <motion.div
                    layoutId="leftRailActiveStream"
                    transition={{
                      type: 'spring',
                      stiffness: 440,
                      damping: 32,
                      mass: 0.65,
                    }}
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '18%',
                      bottom: '18%',
                      width: '3.5px',
                      backgroundColor: 'var(--accent)',
                      borderRadius: '0 3px 3px 0',
                      zIndex: 2,
                      pointerEvents: 'none',
                    }}
                  />
                )}

                <span
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    color: isActive ? 'var(--accent)' : 'inherit',
                    transition: 'color var(--duration-fast)',
                  }}
                >
                  <Icon size={18} style={{ flexShrink: 0 }} />
                </span>
                <span
                  className="rail-label"
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    transition: 'color var(--duration-fast)',
                  }}
                >
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* Prominent Create Button with Dropdown Arrow */}
        <div ref={createMenuRef} style={{ position: 'relative', width: '100%' }}>
          <button
            type="button"
            onClick={() => setCreateMenuOpen(!createMenuOpen)}
            className="button-create"
            aria-expanded={createMenuOpen}
            aria-haspopup="true"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={16} />
              <span className="rail-label">Create</span>
            </span>
            <ChevronDown
              size={15}
              style={{
                transform: createMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform var(--duration-fast)',
              }}
            />
          </button>

          {/* Create Choice Dropdown Menu */}
          <AnimatePresence>
            {createMenuOpen && (
              <motion.div
                role="menu"
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: 0,
                  right: 0,
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  zIndex: 60,
                  padding: '4px 0',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
                  borderRadius: '10px',
                }}
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleCreateEssay}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '10px 12px',
                    border: 'none',
                    borderRadius: '6px',
                    background: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    transition: 'background-color var(--duration-fast)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <FileText size={16} style={{ color: 'var(--accent)', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600 }}>
                      Essay
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Long piece</div>
                  </div>
                </button>

                <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '4px 0' }} />

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleCreateNote}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '10px 12px',
                    border: 'none',
                    borderRadius: '6px',
                    background: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    transition: 'background-color var(--duration-fast)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <MessageSquare size={16} style={{ color: 'var(--accent)', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600 }}>
                      Note
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Short thought</div>
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Author Desk link at bottom of rail */}
        <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
          <NavLink
            to="/desk"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 10px',
              color: 'var(--text-muted)',
              fontSize: '12px',
              fontFamily: 'var(--font-sans)',
              textDecoration: 'none',
              borderRadius: '8px',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 600,
                color: 'var(--accent)',
              }}
            >
              {user?.initials || profile?.initials || 'ME'}
            </div>
            <span className="rail-label">My Desk</span>
          </NavLink>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (< 768px) with Liquid Slide Flow */}
      <nav
        className="marginalia-mobile-bottom-bar"
        aria-label="Mobile Navigation"
        style={{
          display: 'none', // Shown in CSS media queries @media (max-width: 767px)
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '56px',
          backgroundColor: 'var(--bg-canvas)',
          borderTop: '1px solid var(--border-default)',
          zIndex: 80,
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '0 4px',
        }}
      >
        {/* Home */}
        {(() => {
          const isActive = isNavActive('/');
          return (
            <NavLink
              to="/"
              onClick={() => setIndexView('contents')}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                padding: '6px 12px',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '10px',
                fontFamily: 'var(--font-sans)',
                fontWeight: isActive ? 600 : 500,
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileRailActivePill"
                  transition={{ type: 'spring', stiffness: 400, damping: 32, mass: 0.8 }}
                  style={{
                    position: 'absolute',
                    inset: '2px 4px',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-default)',
                    borderRadius: '6px',
                    zIndex: 0,
                    pointerEvents: 'none',
                  }}
                />
              )}
              {isActive && (
                <motion.div
                  layoutId="mobileRailActiveIndicator"
                  transition={{ type: 'spring', stiffness: 440, damping: 32, mass: 0.65 }}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '25%',
                    right: '25%',
                    height: '2px',
                    backgroundColor: 'var(--accent)',
                    borderRadius: '2px 2px 0 0',
                    zIndex: 2,
                    pointerEvents: 'none',
                  }}
                />
              )}
              <span style={{ position: 'relative', zIndex: 1, color: isActive ? 'var(--accent)' : 'inherit' }}>
                <Home size={18} />
              </span>
              <span style={{ position: 'relative', zIndex: 1 }}>Home</span>
            </NavLink>
          );
        })()}

        {/* Explore */}
        {(() => {
          const isActive = isNavActive('/explore');
          return (
            <NavLink
              to="/explore"
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                padding: '6px 12px',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '10px',
                fontFamily: 'var(--font-sans)',
                fontWeight: isActive ? 600 : 500,
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileRailActivePill"
                  transition={{ type: 'spring', stiffness: 400, damping: 32, mass: 0.8 }}
                  style={{
                    position: 'absolute',
                    inset: '2px 4px',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-default)',
                    borderRadius: '6px',
                    zIndex: 0,
                    pointerEvents: 'none',
                  }}
                />
              )}
              {isActive && (
                <motion.div
                  layoutId="mobileRailActiveIndicator"
                  transition={{ type: 'spring', stiffness: 440, damping: 32, mass: 0.65 }}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '25%',
                    right: '25%',
                    height: '2px',
                    backgroundColor: 'var(--accent)',
                    borderRadius: '2px 2px 0 0',
                    zIndex: 2,
                    pointerEvents: 'none',
                  }}
                />
              )}
              <span style={{ position: 'relative', zIndex: 1, color: isActive ? 'var(--accent)' : 'inherit' }}>
                <Compass size={18} />
              </span>
              <span style={{ position: 'relative', zIndex: 1 }}>Explore</span>
            </NavLink>
          );
        })()}

        {/* Mobile Create Trigger */}
        <button
          type="button"
          onClick={() => setCreateMenuOpen(true)}
          style={{
            width: '36px',
            height: '36px',
            backgroundColor: 'var(--accent)',
            color: 'var(--accent-fg, #FFFFFF)',
            border: 'none',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          aria-label="Create new piece"
        >
          <Plus size={20} />
        </button>

        {/* Activity */}
        {(() => {
          const isActive = isNavActive('/activity');
          return (
            <NavLink
              to="/activity"
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                padding: '6px 12px',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '10px',
                fontFamily: 'var(--font-sans)',
                fontWeight: isActive ? 600 : 500,
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileRailActivePill"
                  transition={{ type: 'spring', stiffness: 400, damping: 32, mass: 0.8 }}
                  style={{
                    position: 'absolute',
                    inset: '2px 4px',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-default)',
                    borderRadius: '6px',
                    zIndex: 0,
                    pointerEvents: 'none',
                  }}
                />
              )}
              {isActive && (
                <motion.div
                  layoutId="mobileRailActiveIndicator"
                  transition={{ type: 'spring', stiffness: 440, damping: 32, mass: 0.65 }}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '25%',
                    right: '25%',
                    height: '2px',
                    backgroundColor: 'var(--accent)',
                    borderRadius: '2px 2px 0 0',
                    zIndex: 2,
                    pointerEvents: 'none',
                  }}
                />
              )}
              <span style={{ position: 'relative', zIndex: 1, color: isActive ? 'var(--accent)' : 'inherit' }}>
                <Bell size={18} />
              </span>
              <span style={{ position: 'relative', zIndex: 1 }}>Activity</span>
            </NavLink>
          );
        })()}

        {/* Profile */}
        {(() => {
          const isActive = isNavActive('/profile');
          return (
            <NavLink
              to="/profile"
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                padding: '6px 12px',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '10px',
                fontFamily: 'var(--font-sans)',
                fontWeight: isActive ? 600 : 500,
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileRailActivePill"
                  transition={{ type: 'spring', stiffness: 400, damping: 32, mass: 0.8 }}
                  style={{
                    position: 'absolute',
                    inset: '2px 4px',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-default)',
                    borderRadius: '6px',
                    zIndex: 0,
                    pointerEvents: 'none',
                  }}
                />
              )}
              {isActive && (
                <motion.div
                  layoutId="mobileRailActiveIndicator"
                  transition={{ type: 'spring', stiffness: 440, damping: 32, mass: 0.65 }}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '25%',
                    right: '25%',
                    height: '2px',
                    backgroundColor: 'var(--accent)',
                    borderRadius: '2px 2px 0 0',
                    zIndex: 2,
                    pointerEvents: 'none',
                  }}
                />
              )}
              <span style={{ position: 'relative', zIndex: 1, color: isActive ? 'var(--accent)' : 'inherit' }}>
                <User size={18} />
              </span>
              <span style={{ position: 'relative', zIndex: 1 }}>Profile</span>
            </NavLink>
          );
        })()}
      </nav>
    </>
  );
}
