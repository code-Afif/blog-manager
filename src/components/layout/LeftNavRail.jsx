import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useSocialStore } from '../../store/socialStore';
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
    navigate('/write');
  };

  const handleCreateNote = () => {
    setCreateMenuOpen(false);
    openNotesComposer();
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

        {/* Navigation Links */}
        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            marginBottom: '28px',
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.to === '/'
                ? location.pathname === '/' || location.pathname === '/discover'
                : location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={item.onClick}
                className="left-rail-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '9px 12px',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--bg-surface-elevated)' : 'transparent',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--border-default)' : 'transparent',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 500,
                  textDecoration: 'none',
                  transition: 'all var(--duration-fast)',
                }}
              >
                <Icon size={18} style={{ color: isActive ? 'var(--accent)' : 'inherit', flexShrink: 0 }} />
                <span className="rail-label">{item.label}</span>
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
          {createMenuOpen && (
            <div
              role="menu"
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                left: 0,
                right: 0,
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                zIndex: 60,
                padding: '4px 0',
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
            </div>
          )}
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
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-default)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 600,
                color: 'var(--accent)',
              }}
            >
              {profile.initials || 'JV'}
            </div>
            <span className="rail-label">My Desk</span>
          </NavLink>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (< 768px) */}
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
          padding: '0 8px',
        }}
      >
        <NavLink
          to="/"
          onClick={() => setIndexView('contents')}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '10px',
            fontFamily: 'var(--font-sans)',
          })}
        >
          <Home size={18} />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/explore"
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '10px',
            fontFamily: 'var(--font-sans)',
          })}
        >
          <Compass size={18} />
          <span>Explore</span>
        </NavLink>

        {/* Mobile Create trigger */}
        <button
          type="button"
          onClick={() => setCreateMenuOpen(true)}
          style={{
            width: '36px',
            height: '36px',
            backgroundColor: 'var(--accent)',
            color: 'var(--accent-fg, #FFFFFF)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          aria-label="Create new piece"
        >
          <Plus size={20} />
        </button>

        <NavLink
          to="/activity"
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '10px',
            fontFamily: 'var(--font-sans)',
          })}
        >
          <Bell size={18} />
          <span>Activity</span>
        </NavLink>

        <NavLink
          to="/profile"
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '10px',
            fontFamily: 'var(--font-sans)',
          })}
        >
          <User size={18} />
          <span>Profile</span>
        </NavLink>
      </nav>
    </>
  );
}
