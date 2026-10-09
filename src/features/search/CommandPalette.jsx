import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, FileCode, Plus, Sun, Moon, Bookmark, HelpCircle, CornerDownLeft, Hash } from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { postService } from '../../lib/postService';

export function CommandPalette({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { openTab, toggleTheme, theme, setCheatSheetOpen, setSidebarView } = useWorkspaceStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [allPosts, setAllPosts] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      postService.getAll().then(setAllPosts);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Build items list
  const actions = useMemo(() => [
    {
      id: 'act-new-post',
      type: 'action',
      title: 'New Post: Create markdown document',
      category: 'Actions',
      icon: Plus,
      run: () => {
        openTab({ id: 'editor-new', title: 'untitled.md', slug: 'new-post', type: 'editor' });
        navigate('/editor/new');
      },
    },
    {
      id: 'act-toggle-theme',
      type: 'action',
      title: `Toggle Theme: Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`,
      category: 'Actions',
      icon: theme === 'dark' ? Sun : Moon,
      run: () => toggleTheme(),
    },
    {
      id: 'act-view-stash',
      type: 'action',
      title: 'Stash: View saved offline bookmarks',
      category: 'Navigation',
      icon: Bookmark,
      run: () => {
        setSidebarView('bookmarks');
      },
    },
    {
      id: 'act-cheatsheet',
      type: 'action',
      title: 'Cheat Sheet: Open keyboard shortcuts modal (?)',
      category: 'Help',
      icon: HelpCircle,
      run: () => setCheatSheetOpen(true),
    },
  ], [theme, openTab, navigate, toggleTheme, setCheatSheetOpen, setSidebarView]);

  const filteredItems = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      return [...actions, ...allPosts.slice(0, 8).map((p) => ({
        id: p.id,
        type: 'post',
        title: p.title,
        subtitle: `${p.folder}/${p.filename}`,
        category: 'Files',
        icon: FileCode,
        post: p,
      }))];
    }

    const matchedActions = actions.filter((a) => a.title.toLowerCase().includes(q));
    const matchedPosts = allPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.filename.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.content.toLowerCase().includes(q)
    ).map((p) => ({
      id: p.id,
      type: 'post',
      title: p.title,
      subtitle: `${p.folder}/${p.filename} • #${p.tags.join(' #')}`,
      category: 'Files',
      icon: FileCode,
      post: p,
    }));

    return [...matchedActions, ...matchedPosts];
  }, [query, actions, allPosts]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems.length]);

  const handleSelect = (item) => {
    if (!item) return;
    onClose();
    if (item.type === 'action') {
      item.run();
    } else if (item.type === 'post') {
      openTab({
        id: item.post.id,
        slug: item.post.slug,
        title: item.post.filename,
        type: 'post',
      });
      navigate(`/posts/${item.post.slug}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '12vh',
            paddingLeft: '16px',
            paddingRight: '16px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -6 }}
            transition={{ duration: 0.15, ease: [0, 0, 0.2, 1] }}
            style={{
              width: '100%',
              maxWidth: '580px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-1)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'none',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {/* Input Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderBottom: '1px solid var(--border-default)',
                backgroundColor: 'var(--bg-input)',
              }}
            >
              <Search size={15} style={{ color: 'var(--accent)' }} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a command or search files (e.g. rust, theme, new)..."
                style={{
                  width: '100%',
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-mono)',
                }}
              />
              <span className="kbd-chip" style={{ fontSize: '9px' }}>ESC</span>
            </div>

            {/* Results List */}
            <div
              style={{
                maxHeight: '340px',
                overflowY: 'auto',
                padding: '6px',
              }}
            >
              {filteredItems.length === 0 ? (
                <div
                  style={{
                    padding: '24px',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '12px',
                  }}
                >
                  No matching files or commands for "{query}"
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  const Icon = item.icon || FileCode;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-1)',
                        fontSize: '12px',
                        zIndex: 1,
                      }}
                    >
                      {/* Sliding highlight bar with layoutId */}
                      {isSelected && (
                        <motion.div
                          layoutId="palette-highlight"
                          style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'var(--bg-surface-active)',
                            borderLeft: '2px solid var(--accent)',
                            zIndex: -1,
                            borderRadius: 'var(--radius-1)',
                          }}
                          transition={{ duration: 0.1, ease: 'easeOut' }}
                        />
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', overflow: 'hidden' }}>
                        <Icon size={14} style={{ color: isSelected ? 'var(--accent)' : 'var(--text-secondary)', flexShrink: 0 }} />
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ color: 'var(--text-primary)', fontWeight: isSelected ? 600 : 400, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {item.title}
                          </div>
                          {item.subtitle && (
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                              {item.subtitle}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
                          {item.category}
                        </span>
                        {isSelected && <CornerDownLeft size={11} style={{ color: 'var(--accent)' }} />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 12px',
                backgroundColor: 'var(--bg-surface-elevated)',
                borderTop: '1px solid var(--border-default)',
                fontSize: '10px',
                color: 'var(--text-muted)',
              }}
            >
              <div style={{ display: 'flex', gap: '10px' }}>
                <span><kbd className="kbd-chip" style={{ fontSize: '8px' }}>↑</kbd> <kbd className="kbd-chip" style={{ fontSize: '8px' }}>↓</kbd> navigate</span>
                <span><kbd className="kbd-chip" style={{ fontSize: '8px' }}>↵</kbd> select</span>
              </div>
              <span className="tabular-nums">{filteredItems.length} results</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
