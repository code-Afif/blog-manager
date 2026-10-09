import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { SidebarExplorer } from './SidebarExplorer';
import { BookOpen, Search, Feather, Bookmark, Moon, Sun, X } from 'lucide-react';

/**
 * MobileNav — Responsive Mobile Navigation Bar & Drawer
 * Ensures >= 44px tap targets and literary terminology.
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
    readingListIds,
    setIndexView,
  } = useWorkspaceStore();

  const handleWrite = () => {
    openTab({
      id: 'editor-new',
      slug: 'new-folio',
      title: 'untitled-folio.md',
      type: 'editor',
    });
    navigate('/write');
  };

  const handleShelf = () => {
    setIndexView('shelf');
    navigate('/');
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
                backgroundColor: 'rgba(0,0,0,0.6)',
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
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border-default)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                <span>ARCHIVE SECTIONS</span>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  aria-label="Close archive drawer"
                  style={{
                    padding: '8px',
                    color: 'var(--text-muted)',
                    minWidth: '44px',
                    minHeight: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
          borderTop: '1px solid var(--border-default)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 80,
          fontFamily: 'var(--font-sans)',
          fontSize: '10px',
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
            gap: '2px',
            color: 'var(--text-secondary)',
            minHeight: '48px',
            minWidth: '48px',
            padding: '4px',
          }}
        >
          <BookOpen size={16} />
          <span>CONTENTS</span>
        </button>

        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
            color: 'var(--text-secondary)',
            minHeight: '48px',
            minWidth: '48px',
            padding: '4px',
          }}
        >
          <Search size={16} />
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
            gap: '2px',
            color: 'var(--accent)',
            fontWeight: 700,
            minHeight: '48px',
            minWidth: '48px',
            padding: '4px',
          }}
        >
          <Feather size={16} />
          <span>WRITE</span>
        </button>

        <button
          type="button"
          onClick={handleShelf}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
            color: 'var(--text-secondary)',
            minHeight: '48px',
            minWidth: '48px',
            padding: '4px',
          }}
        >
          <Bookmark size={16} fill={readingListIds.length > 0 ? 'currentColor' : 'none'} />
          <span>SHELF</span>
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
            color: 'var(--text-secondary)',
            minHeight: '48px',
            minWidth: '48px',
            padding: '4px',
          }}
        >
          {theme === 'night' ? <Moon size={16} /> : <Sun size={16} />}
          <span>{theme === 'night' ? 'NIGHT' : 'DAY'}</span>
        </button>
      </nav>
    </>
  );
}
