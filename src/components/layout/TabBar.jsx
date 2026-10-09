import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { FileCode, FileText, X, Plus, Edit3 } from 'lucide-react';

export function TabBar() {
  const navigate = useNavigate();
  const { openTabs, activeTabId, setActiveTabId, closeTab, openTab } = useWorkspaceStore();

  const handleTabClick = (tab) => {
    setActiveTabId(tab.id);
    if (tab.type === 'readme') {
      navigate('/');
    } else if (tab.type === 'editor') {
      navigate(tab.slug === 'new-post' ? '/editor/new' : `/editor/${tab.slug}`);
    } else if (tab.type === 'myposts') {
      navigate('/my-posts');
    } else {
      navigate(`/posts/${tab.slug}`);
    }
  };

  const handleClose = (e, tabId) => {
    e.stopPropagation();
    closeTab(tabId);
  };

  const handleNewTab = () => {
    openTab({
      id: 'editor-new',
      slug: 'new-post',
      title: 'untitled.md',
      type: 'editor',
    });
    navigate('/editor/new');
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 'var(--tabbar-height)',
        backgroundColor: 'var(--bg-canvas)',
        borderBottom: '1px solid var(--border-default)',
        overflowX: 'auto',
        overflowY: 'hidden',
        userSelect: 'none',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        scrollbarWidth: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'stretch', height: '100%', flex: 1, minWidth: 0 }}>
        <AnimatePresence initial={false}>
          {openTabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            const isReadme = tab.type === 'readme';
            const isEditor = tab.type === 'editor';

            return (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15, ease: [0, 0, 0.2, 1] }}
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
                    transition: 'background-color var(--duration-fast), color var(--duration-fast)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-canvas)';
                  }}
                >
                  {isReadme ? (
                    <FileText size={13} style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }} />
                  ) : isEditor ? (
                    <Edit3 size={13} style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }} />
                  ) : (
                    <FileCode size={13} style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }} />
                  )}

                  <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {tab.title}
                  </span>

                  {!tab.isPinned && (
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
          aria-label="Open new markdown draft"
          title="Create new post tab"
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
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
