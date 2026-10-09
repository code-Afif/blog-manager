import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { SidebarExplorer } from './SidebarExplorer';
import { Folder, Search, Plus, Bookmark, Moon, Sun, X } from 'lucide-react';

export function MobileNav() {
  const navigate = useNavigate();
  const {
    mobileDrawerOpen,
    setMobileDrawerOpen,
    setCommandPaletteOpen,
    openTab,
    theme,
    toggleTheme,
    stashedIds,
    setSidebarView,
  } = useWorkspaceStore();

  const handleNewPost = () => {
    openTab({
      id: 'editor-new',
      slug: 'new-post',
      title: 'untitled.md',
      type: 'editor',
    });
    navigate('/editor/new');
  };

  const handleOpenStash = () => {
    setSidebarView('bookmarks');
    setMobileDrawerOpen(true);
  };

  return (
    <>
      {/* Slide-in Explorer Drawer */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99990,
              display: 'flex',
            }}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.7)',
              }}
            />

            {/* Slide-out Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
              style={{
                position: 'relative',
                width: '85%',
                maxWidth: '300px',
                height: '100%',
                backgroundColor: 'var(--bg-surface)',
                borderRight: '1px solid var(--border-default)',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderBottom: '1px solid var(--border-default)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                <span>WORKSPACE EXPLORER</span>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  style={{ padding: '4px', color: 'var(--text-muted)' }}
                >
                  <X size={15} />
                </button>
              </div>

              <div style={{ flex: 1, overflow: 'hidden' }} onClick={() => setMobileDrawerOpen(false)}>
                <SidebarExplorer />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Nav Bar (Mobile only) */}
      <nav
        aria-label="Mobile Navigation"
        className="mobile-nav-bar mobile-only"
        style={{
          position: 'fixed',
          bottom: 'var(--statusbar-height)',
          left: 0,
          right: 0,
          height: '46px',
          backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-default)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 80,
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
        }}
      >
        <button
          type="button"
          onClick={() => {
            setSidebarView('explorer');
            setMobileDrawerOpen(true);
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: 'var(--text-secondary)',
          }}
        >
          <Folder size={15} />
          <span>FILES</span>
        </button>

        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: 'var(--text-secondary)',
          }}
        >
          <Search size={15} />
          <span>FIND</span>
        </button>

        <button
          type="button"
          onClick={handleNewPost}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: 'var(--accent)',
            fontWeight: 700,
          }}
        >
          <Plus size={15} />
          <span>NEW</span>
        </button>

        <button
          type="button"
          onClick={handleOpenStash}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: 'var(--text-secondary)',
          }}
        >
          <Bookmark size={15} fill={stashedIds.length > 0 ? 'currentColor' : 'none'} />
          <span>STASH</span>
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: 'var(--text-secondary)',
          }}
        >
          {theme === 'dark' ? <Moon size={15} /> : <Sun size={15} />}
          <span>{theme.toUpperCase()}</span>
        </button>
      </nav>
    </>
  );
}
