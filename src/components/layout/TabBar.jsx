import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { X, Plus, Feather, BookOpen } from 'lucide-react';

/**
 * TabBar — Folio & Workspace Ribbon
 * Manages active reading tabs, composition sheets, and the pinned Table of Contents.
 */
export function TabBar() {
  const navigate = useNavigate();
  const { openTabs, activeTabId, setActiveTabId, closeTab, openTab } = useWorkspaceStore();

  const handleTabClick = (tab) => {
    setActiveTabId(tab.id);
    if (tab.type === 'contents' || tab.id === 'contents' || tab.type === 'readme') {
      navigate('/');
    } else if (tab.type === 'editor') {
      navigate(tab.slug === 'new-folio' || tab.slug === 'new-post' ? '/write' : `/editor/${tab.slug}`);
    } else if (tab.type === 'myposts' || tab.id === 'desk') {
      navigate('/desk');
    } else {
      navigate(`/essays/${tab.slug}`);
    }
  };

  const handleClose = (e, tabId) => {
    e.stopPropagation();
    closeTab(tabId);
  };

  const handleNewTab = () => {
    openTab({
      id: 'editor-new',
      slug: 'new-folio',
      title: 'untitled-folio.md',
      type: 'editor',
    });
    navigate('/write');
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 'var(--foliobar-height, 38px)',
        backgroundColor: 'var(--bg-canvas)',
        borderBottom: '1px solid var(--border-default)',
        overflowX: 'auto',
        overflowY: 'hidden',
        userSelect: 'none',
        fontFamily: 'var(--font-sans)',
        fontSize: '11px',
        scrollbarWidth: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'stretch', height: '100%', flex: 1, minWidth: 0 }}>
        <AnimatePresence initial={false}>
          {openTabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            const isContents = tab.id === 'contents' || tab.type === 'contents' || tab.type === 'readme';
            const isEditor = tab.type === 'editor';
            const isDesk = tab.type === 'myposts' || tab.id === 'desk';

            return (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                style={{ overflow: 'hidden', height: '100%' }}
              >
                <div
                  onClick={() => handleTabClick(tab)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    height: '100%',
                    padding: '0 12px',
                    backgroundColor: isActive ? 'var(--bg-surface)' : 'var(--bg-canvas)',
                    borderRight: '1px solid var(--border-default)',
                    borderTop: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontWeight: isActive ? 600 : 400,
                    transition: 'background-color var(--duration-calm), color var(--duration-calm)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-canvas)';
                  }}
                >
                  {isContents ? (
                    <span className="fleuron" style={{ fontSize: '13px', color: 'var(--accent)' }}>❧</span>
                  ) : isEditor ? (
                    <Feather size={12} style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }} />
                  ) : isDesk ? (
                    <BookOpen size={12} style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }} />
                  ) : (
                    <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--accent)', fontWeight: 700 }}>
                      §
                    </span>
                  )}

                  <span style={{ maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {isContents ? 'Contents' : tab.title}
                  </span>

                  {!tab.isPinned && tab.id !== 'contents' && (
                    <button
                      type="button"
                      onClick={(e) => handleClose(e, tab.id)}
                      aria-label={`Close ${tab.title} tab`}
                      style={{
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-subtle)',
                        borderRadius: 'var(--radius-1)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-subtle)')}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Plus tab button */}
        <button
          type="button"
          onClick={handleNewTab}
          aria-label="Compose new folio draft"
          title="Compose new folio draft"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 10px',
            color: 'var(--text-muted)',
            borderRight: '1px solid var(--border-default)',
            height: '100%',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Plus size={13} />
        </button>
      </div>
    </div>
  );
}
