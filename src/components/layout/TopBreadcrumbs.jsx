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
  Terminal,
  FolderGit2,
  ChevronRight,
  Menu,
} from 'lucide-react';

export function TopBreadcrumbs() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    sidebarOpen,
    toggleSidebar,
    setMobileDrawerOpen,
    setCommandPaletteOpen,
    setCheatSheetOpen,
    openTab,
  } = useWorkspaceStore();

  const pathname = location.pathname;
  const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  // Build breadcrumb segments
  const getBreadcrumbs = () => {
    if (pathname === '/') {
      return [
        { label: 'devlog', path: '/' },
        { label: 'workspace', path: '/' },
        { label: 'README.md', path: '/' },
      ];
    }
    if (pathname.startsWith('/posts/')) {
      const slug = pathname.replace('/posts/', '');
      return [
        { label: 'devlog', path: '/' },
        { label: 'posts', path: '/' },
        { label: `${slug}.md`, path: pathname },
      ];
    }
    if (pathname.startsWith('/editor/')) {
      const slug = pathname.replace('/editor/', '');
      return [
        { label: 'devlog', path: '/' },
        { label: 'editor', path: '/my-posts' },
        { label: slug === 'new' ? 'untitled.md' : `${slug}.md`, path: pathname },
      ];
    }
    if (pathname === '/my-posts') {
      return [
        { label: 'devlog', path: '/' },
        { label: 'management', path: '/my-posts' },
        { label: 'my-posts.sh', path: '/my-posts' },
      ];
    }
    return [
      { label: 'devlog', path: '/' },
      { label: pathname.replace('/', ''), path: pathname },
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  const handleNewPost = () => {
    openTab({
      id: 'editor-new',
      slug: 'new-post',
      title: 'untitled.md',
      type: 'editor',
    });
    navigate('/editor/new');
  };

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 'var(--topbar-height)',
        padding: '0 12px',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-default)',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
      }}
    >
      {/* Left: Sidebar toggle and Breadcrumb Path */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, overflow: 'hidden' }}>
        {/* Desktop Sidebar Toggle */}
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle explorer sidebar"
          title="Toggle explorer sidebar"
          className="desktop-only"
          style={{
            padding: '4px',
            color: sidebarOpen ? 'var(--accent)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-1)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = sidebarOpen ? 'var(--accent)' : 'var(--text-muted)')}
        >
          <Sidebar size={15} />
        </button>

        {/* Mobile Drawer Trigger */}
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          aria-label="Open mobile explorer"
          className="mobile-only"
          style={{
            padding: '4px',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Menu size={16} />
        </button>

        {/* Breadcrumb Path */}
        <nav
          aria-label="Breadcrumbs"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-muted)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          <FolderGit2 size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />

          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.label + idx}>
                {idx > 0 && <ChevronRight size={11} style={{ opacity: 0.5, flexShrink: 0 }} />}
                <Link
                  to={crumb.path}
                  style={{
                    color: isLast ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: isLast ? 600 : 400,
                    textDecoration: 'none',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  onMouseEnter={(e) => {
                    if (!isLast) e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isLast) e.currentTarget.style.color = 'var(--text-muted)';
                  }}
                >
                  {crumb.label}
                </Link>
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Right Controls: Search Trigger, Hotkeys, New Post, Theme Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {/* Command Palette Trigger */}
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          aria-label="Open command palette"
          title="Search & Commands"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 8px',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-1)',
            color: 'var(--text-secondary)',
            fontSize: '11px',
            height: '26px',
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
          <Search size={12} />
          <span className="desktop-only" style={{ color: 'var(--text-muted)' }}>Quick Open</span>
          <kbd className="kbd-chip" style={{ fontSize: '9px' }}>
            {isMac ? '⌘K' : 'Ctrl+K'}
          </kbd>
        </button>

        {/* Cheat sheet trigger */}
        <button
          type="button"
          onClick={() => setCheatSheetOpen(true)}
          aria-label="Keyboard shortcuts"
          title="Shortcut cheat sheet (?)"
          style={{
            padding: '4px',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 'var(--radius-1)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <HelpCircle size={14} />
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* New Post Button */}
        <Button variant="primary" size="sm" onClick={handleNewPost}>
          <Plus size={12} />
          <span>+ post.md</span>
        </Button>
      </div>
    </header>
  );
}
