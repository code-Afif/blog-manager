import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Sun, Moon, Bookmark, HelpCircle, CornerDownLeft, Terminal, FileCode2 } from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { postService } from '../../lib/postService';
import { normalizeSearchText } from '../../lib/utils';

export function CommandPalette({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { openTab, toggleTheme, theme, setCheatSheetOpen, setIndexView } = useWorkspaceStore();
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

  // Build actions list
  const actions = useMemo(() => [
    {
      id: 'act-new-post',
      type: 'action',
      title: 'Write an Essay: Open rich-text editor',
      category: 'Actions',
      icon: Plus,
      run: () => {
        openTab({ id: 'editor-new', title: 'New Essay', slug: 'new-post', type: 'essay' });
        navigate('/write');
      },
    },
    {
      id: 'act-view-contents',
      type: 'action',
      title: 'Home: Browse essays and notes',
      category: 'Navigation',
      icon: Terminal,
      run: () => {
        setIndexView('contents');
        navigate('/');
      },
    },
    {
      id: 'act-view-shelf',
      type: 'action',
      title: 'Reading List: View saved pieces',
      category: 'Navigation',
      icon: Bookmark,
      run: () => {
        setIndexView('shelf');
        navigate('/reading-list');
      },
    },
    {
      id: 'act-toggle-theme',
      type: 'action',
      title: `Toggle Theme: Switch to ${theme === 'night' ? 'Day Paper' : 'Night Library'}`,
      category: 'Actions',
      icon: theme === 'night' ? Sun : Moon,
      run: () => toggleTheme(),
    },
    {
      id: 'act-cheatsheet',
      type: 'action',
      title: 'Keyboard Shortcuts & Guide (?)',
      category: 'Help',
      icon: HelpCircle,
      run: () => setCheatSheetOpen(true),
    },
  ], [theme, openTab, navigate, toggleTheme, setCheatSheetOpen, setIndexView]);

  const filteredItems = useMemo(() => {
    const normQ = normalizeSearchText(query);
    if (!normQ) {
      return [
        ...actions,
        ...allPosts.slice(0, 8).map((p) => ({
          id: p.id,
          type: 'post',
          title: p.title,
          subtitle: `№ ${String(p.essayNumber || 1).padStart(2, '0')} · ${p.section || 'Essays'} · ${p.author?.name || ''}`,
          category: p.section || 'Essays',
          icon: FileCode2,
          post: p,
        })),
      ];
    }

    const matchedActions = actions.filter((a) => normalizeSearchText(a.title).includes(normQ));
    const matchedPosts = allPosts
      .filter((p) => {
        const titleNorm = normalizeSearchText(p.title || '');
        const contentNorm = normalizeSearchText(p.content || '');
        const authorNorm = normalizeSearchText(p.author?.name || '');
        const sectionNorm = normalizeSearchText(p.section || '');
        const tagsNorm = (p.tags || []).map((t) => normalizeSearchText(t)).join(' ');
        return (
          titleNorm.includes(normQ) ||
          authorNorm.includes(normQ) ||
          sectionNorm.includes(normQ) ||
          tagsNorm.includes(normQ) ||
          contentNorm.includes(normQ)
        );
      })
      .map((p) => ({
        id: p.id,
        type: 'post',
        title: p.title,
        subtitle: `ENTRY // ${String(p.essayNumber || 1).padStart(4, '0')} • [${p.section || 'SYSTEMS'}] • ${p.author?.name || ''}`,
        category: p.section || 'DISPATCH',
        icon: FileCode2,
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
        title: `ENTRY // ${String(item.post.essayNumber || 1).padStart(4, '0')}`,
        type: 'essay',
      });
      navigate(`/essays/${item.post.slug}`);
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
              maxWidth: '620px',
              backgroundColor: 'var(--bg-surface)',
              border: '2px solid var(--border-default)',
              borderRadius: 0,
              boxShadow: 'var(--shadow-hard)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {/* Input Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 16px',
                borderBottom: '1px solid var(--border-default)',
                backgroundColor: 'var(--bg-canvas)',
              }}
            >
              <Search size={15} style={{ color: 'var(--accent)' }} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search dispatches, tags, or system commands (e.g. rust, postgres, ebpf)..."
                dir="auto"
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
              <span className="kbd-chip" style={{ fontSize: '9px', borderRadius: 0 }}>ESC</span>
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
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  [!] ZERO ENTRIES MATCH QUERY "{query}". ADJUST SEARCH TOKENS.
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  const Icon = item.icon || FileCode2;

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
                        padding: '8px 12px',
                        cursor: 'pointer',
                        borderRadius: 0,
                        fontSize: '12px',
                        zIndex: 1,
                        backgroundColor: isSelected ? 'var(--bg-surface-elevated)' : 'transparent',
                        borderLeft: isSelected ? '3px solid var(--accent)' : '3px solid transparent',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                        <Icon size={14} style={{ color: isSelected ? 'var(--accent)' : 'var(--text-secondary)', flexShrink: 0 }} />
                        <div style={{ overflow: 'hidden' }}>
                          <div
                            style={{
                              color: 'var(--text-primary)',
                              fontWeight: isSelected ? 700 : 500,
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              fontFamily: 'var(--font-display)',
                              fontSize: '13px',
                            }}
                          >
                            {item.title}
                          </div>
                          {item.subtitle && (
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', fontFamily: 'var(--font-mono)' }}>
                              {item.subtitle}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', textTransform: 'uppercase', padding: '1px 6px', border: '1px solid var(--border-default)' }}>
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
                padding: '8px 14px',
                backgroundColor: 'var(--bg-canvas)',
                borderTop: '1px solid var(--border-default)',
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
              }}
            >
              <div style={{ display: 'flex', gap: '10px' }}>
                <span><kbd className="kbd-chip" style={{ fontSize: '8px', borderRadius: 0 }}>↑</kbd> <kbd className="kbd-chip" style={{ fontSize: '8px', borderRadius: 0 }}>↓</kbd> NAVIGATE</span>
                <span><kbd className="kbd-chip" style={{ fontSize: '8px', borderRadius: 0 }}>↵</kbd> EXECUTE</span>
              </div>
              <span className="tabular-nums">{filteredItems.length} ENTRIES</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
