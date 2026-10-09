import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useAuthStore } from '../../store/authStore';
import { SidebarExplorer } from './SidebarExplorer';
import { Terminal, Search, Plus, Bookmark, Moon, Sun, X } from 'lucide-react';

/**
 * MobileNav — Responsive STACKTRACE Navigation Bar & Drawer
 * Ensures >= 44px tap targets and neo-brutal technical branding.
 */
export function MobileNav() {
  const navigate = useNavigate();
  const {
    mobileDrawerOpen,
    setMobileDrawerOpen,
    setCommandPaletteOpen,
    openTab,
    theme,
    toggleTheme,
    setIndexView,
  } = useWorkspaceStore();

  const { userBookmarks } = useAuthStore();

  const handleWrite = () => {
    openTab({
      id: 'editor-new',
      slug: 'new-post',
      title: 'untitled.md',
      type: 'editor',
    });
    navigate('/write');
  };

  const handleShelf = () => {
    setIndexView('shelf');
    navigate('/shelf');
  };

  return (
    <>
      {/* Slide-in Archive Drawer */}
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
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'relative',
                width: '85%',
                maxWidth: '320px',
                height: '100%',
                backgroundColor: 'var(--bg-surface)',
                borderRight: '2px solid var(--border-default)',
                borderRadius: 0,
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
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border-default)',
                  backgroundColor: 'var(--bg-canvas)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                <span>[TAXONOMY_TREE]</span>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  aria-label="Close drawer"
                  style={{
                    padding: '8px',
                    color: 'var(--text-muted)',
                    minWidth: '44px',
                    minHeight: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ flex: 1, overflow: 'hidden' }} onClick={() => setMobileDrawerOpen(false)}>
                <SidebarExplorer />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Nav Bar (Mobile only) with >= 44px tap targets */}
      <nav
        aria-label="Mobile Navigation"
        className="mobile-nav-bar mobile-only"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '52px',
          backgroundColor: 'var(--bg-surface)',
          borderTop: '2px solid var(--border-default)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 80,
          fontFamily: 'var(--font-mono)',
          fontSize: '9.5px',
        }}
      >
        <button
          type="button"
          onClick={() => {
            setIndexView('contents');
            navigate('/');
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            color: 'var(--text-secondary)',
            minHeight: '48px',
            minWidth: '48px',
            padding: '4px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          <Terminal size={15} />
          <span>FEED</span>
        </button>

        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            color: 'var(--text-secondary)',
            minHeight: '48px',
            minWidth: '48px',
            padding: '4px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          <Search size={15} />
          <span>SEARCH</span>
        </button>

        <button
          type="button"
          onClick={handleWrite}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            color: 'var(--accent)',
            fontWeight: 700,
            minHeight: '48px',
            minWidth: '48px',
            padding: '4px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          <Plus size={16} />
          <span>DISPATCH</span>
        </button>

        <button
          type="button"
          onClick={handleShelf}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            color: 'var(--text-secondary)',
            minHeight: '48px',
            minWidth: '48px',
            padding: '4px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          <Bookmark size={15} fill={userBookmarks.length > 0 ? 'currentColor' : 'none'} />
          <span>SAVED</span>
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            color: 'var(--text-secondary)',
            minHeight: '48px',
            minWidth: '48px',
            padding: '4px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          {theme === 'night' ? <Moon size={15} /> : <Sun size={15} />}
          <span>{theme === 'night' ? 'DARK' : 'LIGHT'}</span>
        </button>
      </nav>
    </>
  );
}
