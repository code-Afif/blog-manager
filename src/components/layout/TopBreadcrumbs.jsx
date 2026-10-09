import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { ThemeToggle } from '../../features/theme/ThemeToggle';
import { Button } from '../ui/Button';
import {
  Sidebar,
  Search,
  Plus,
  HelpCircle,
  Menu,
  BookOpen,
  Feather,
  Info,
} from 'lucide-react';

/**
 * TopBreadcrumbs — Literary Journal Running Masthead
 * Provides the publication header, current folio position, and editorial quick actions.
 */
export function TopBreadcrumbs() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    sidebarOpen,
    toggleSidebar,
    setMobileDrawerOpen,
    setCommandPaletteOpen,
    setCheatSheetOpen,
    setAboutModalOpen,
    openTab,
    indexView,
  } = useWorkspaceStore();

  const pathname = location.pathname;
  const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  // Determine current folio context label
  const getContextLabel = () => {
    if (pathname === '/') {
      return indexView === 'shelf' ? 'Private Reading Shelf' : 'Table of Contents';
    }
    if (pathname.startsWith('/essays/') || pathname.startsWith('/posts/') || pathname.startsWith('/essay/')) {
      return 'Folio Reader';
    }
    if (pathname.startsWith('/write') || pathname.startsWith('/editor/')) {
      return 'Editorial Composition';
    }
    if (pathname === '/desk' || pathname === '/my-posts') {
      return 'Author’s Desk';
    }
    if (pathname === '/about') {
      return 'About & Colophon';
    }
    return 'Marginalia Archive';
  };

  const handleWrite = () => {
    openTab({
      id: 'editor-new',
      slug: 'new-folio',
      title: 'untitled-folio.md',
      type: 'editor',
    });
    navigate('/write');
  };

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 'var(--masthead-height, 54px)',
        padding: '0 16px',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-default)',
        fontFamily: 'var(--font-sans)',
        fontSize: '12px',
        userSelect: 'none',
      }}
    >
      {/* Left: Sidebar toggle, Masthead brand, and breadcrumb indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        {/* Desktop Sidebar Toggle */}
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle archive explorer sidebar"
          title="Toggle Archive Sidebar"
          className="desktop-only"
          style={{
            padding: '6px',
            color: sidebarOpen ? 'var(--accent)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-1)',
            minHeight: '36px',
            minWidth: '36px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = sidebarOpen ? 'var(--accent)' : 'var(--text-muted)')}
        >
          <Sidebar size={16} />
        </button>

        {/* Mobile Drawer Trigger */}
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          aria-label="Open archive navigation drawer"
          className="mobile-only"
          style={{
            padding: '8px',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            minHeight: '44px',
            minWidth: '44px',
          }}
        >
          <Menu size={18} />
        </button>

        {/* Masthead Mark & Context Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              color: 'var(--text-primary)',
            }}
          >
            <span className="fleuron" style={{ fontSize: '1.2rem', color: 'var(--accent)' }}>❧</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 700,
                  fontSize: '15px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Marginalia
              </span>
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--accent)',
                  fontWeight: 500,
                  fontFamily: 'var(--font-serif)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span lang="hi">हाशिया</span>
              </span>
            </div>
          </Link>

          <span style={{ color: 'var(--border-strong)', fontSize: '11px' }}>/</span>

          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {getContextLabel()}
          </span>
        </div>
      </div>

      {/* Right: Quick actions, Search, Desk, Write, Shortcuts, Theme */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {/* Search / Command Palette Trigger */}
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          aria-label="Search folios and execute commands (Cmd+K)"
          title="Search folios & commands (Cmd+K)"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-1)',
            color: 'var(--text-secondary)',
            fontSize: '11px',
            height: '32px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-strong)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-default)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <Search size={13} style={{ color: 'var(--accent)' }} />
          <span className="desktop-only" style={{ color: 'var(--text-muted)' }}>Search Folios</span>
          <kbd className="kbd-chip" style={{ fontSize: '9px' }}>
            {isMac ? '⌘K' : 'Ctrl+K'}
          </kbd>
        </button>

        {/* About trigger */}
        <button
          type="button"
          onClick={() => setAboutModalOpen(true)}
          aria-label="About Marginalia colophon"
          title="About & Colophon"
          className="desktop-only"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            backgroundColor: 'transparent',
            border: '1px solid transparent',
            borderRadius: 'var(--radius-1)',
            color: 'var(--text-muted)',
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            height: '32px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.borderColor = 'transparent';
          }}
        >
          <Info size={13} />
          <span>ABOUT</span>
        </button>

        {/* My Desk link */}
        <Link
          to="/desk"
          className="desktop-only"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            backgroundColor: 'transparent',
            border: '1px solid transparent',
            borderRadius: 'var(--radius-1)',
            color: 'var(--text-muted)',
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            height: '32px',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.borderColor = 'transparent';
          }}
        >
          <BookOpen size={13} />
          <span>MY DESK</span>
        </Link>

        {/* Keyboard Shortcuts Trigger */}
        <button
          type="button"
          onClick={() => setCheatSheetOpen(true)}
          aria-label="Keyboard shortcuts cheat sheet (?)"
          title="Keyboard shortcuts (?)"
          style={{
            padding: '6px',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-1)',
            minHeight: '32px',
            minWidth: '32px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <HelpCircle size={15} />
        </button>

        {/* Day / Night Theme Toggle */}
        <ThemeToggle />

        {/* Write Button */}
        <Button variant="primary" size="sm" onClick={handleWrite}>
          <Feather size={12} />
          <span style={{ letterSpacing: '0.06em' }}>WRITE</span>
        </Button>
      </div>
    </header>
  );
}
