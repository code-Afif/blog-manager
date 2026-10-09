import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { postService } from '../../lib/postService';
import { useWorkspaceStore } from '../../store/workspaceStore';
import {
  ChevronRight,
  ChevronDown,
  Bookmark,
  Feather,
  BookOpen,
  Info,
  Library,
} from 'lucide-react';

import { SECTION_TRANSLATIONS } from '../../lib/postService';

function SectionGroup({ sectionName, essays, activeSlug, onSelectEssay }) {
  const [isOpen, setIsOpen] = useState(true);
  const trans = SECTION_TRANSLATIONS[sectionName];
  const displaySection = trans ? `${sectionName} / ${trans.hi}` : sectionName;

  return (
    <div style={{ marginBottom: '4px' }}>
      {/* Section Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 8px',
          borderRadius: 'var(--radius-1)',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          userSelect: 'none',
          transition: 'color var(--duration-calm)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
      >
        {isOpen ? <ChevronDown size={11} style={{ opacity: 0.6 }} /> : <ChevronRight size={11} style={{ opacity: 0.6 }} />}
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displaySection}</span>
        <span className="tabular-nums" style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--text-muted)' }}>
          {essays.length}
        </span>
      </div>

      {/* Essays List */}
      {isOpen && (
        <div style={{ paddingLeft: '10px', borderLeft: '1px solid var(--border-subtle)', marginLeft: '10px' }}>
          {essays.map((essay) => {
            const isActive = activeSlug === essay.slug;
            const isUr = essay.language === 'ur';
            const isHi = essay.language === 'hi';
            return (
              <div
                key={essay.id}
                onClick={() => onSelectEssay(essay)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 6px',
                  borderRadius: 'var(--radius-1)',
                  cursor: 'pointer',
                  fontSize: isUr ? '12px' : '11px',
                  backgroundColor: isActive ? 'var(--bg-surface-active)' : 'transparent',
                  borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'background-color var(--duration-calm)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontFamily: isUr
                    ? 'var(--font-serif-ur)'
                    : isHi
                    ? 'var(--font-serif-hi)'
                    : 'var(--font-sans)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                    fontSize: '10px',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  №{String(essay.essayNumber || 1).padStart(2, '0')}
                </span>
                <span
                  lang={essay.language}
                  dir={isUr ? 'rtl' : 'ltr'}
                  style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {essay.title}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function SidebarExplorer() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    openTab,
    sidebarView,
    setSidebarView,
    readingListIds,
    essaysVersion,
    setAboutModalOpen,
  } = useWorkspaceStore();

  const [allEssays, setAllEssays] = useState([]);
  const [sections, setSections] = useState({});

  useEffect(() => {
    postService.getAll(false).then((essays) => {
      setAllEssays(essays);
      // Group by section
      const map = {};
      essays.forEach((e) => {
        const sec = e.section || 'General Essays';
        if (!map[sec]) map[sec] = [];
        map[sec].push(e);
      });
      setSections(map);
    });
  }, [essaysVersion]);

  // Current active slug
  const activeSlug = location.pathname.startsWith('/essays/')
    ? location.pathname.replace('/essays/', '')
    : location.pathname.startsWith('/posts/')
    ? location.pathname.replace('/posts/', '')
    : null;

  const handleSelectEssay = (essay) => {
    openTab({
      id: essay.id,
      slug: essay.slug,
      title: `№ ${String(essay.essayNumber || 1).padStart(2, '0')} ${essay.title.slice(0, 20)}...`,
      type: 'essay',
    });
    navigate(`/essays/${essay.slug}`);
  };

  const savedShelfEssays = allEssays.filter((e) => readingListIds.includes(e.id));

  return (
    <aside
      style={{
        display: 'flex',
        height: '100%',
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-default)',
        fontFamily: 'var(--font-sans)',
        overflow: 'hidden',
      }}
    >
      {/* Activity Bar Rail */}
      <div
        style={{
          width: '42px',
          backgroundColor: 'var(--bg-canvas)',
          borderRight: '1px solid var(--border-default)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '8px',
          gap: '6px',
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={() => setSidebarView('explorer')}
          aria-label="Folios Catalogue"
          title="Folio Catalogue"
          style={{
            padding: '8px',
            color: sidebarView === 'explorer' ? 'var(--accent)' : 'var(--text-muted)',
            backgroundColor: sidebarView === 'explorer' ? 'var(--bg-surface)' : 'transparent',
            borderLeft: sidebarView === 'explorer' ? '2px solid var(--accent)' : '2px solid transparent',
            borderRadius: 'var(--radius-1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Library size={16} />
        </button>

        <button
          type="button"
          onClick={() => setSidebarView('bookmarks')}
          aria-label="Reading Shelf"
          title={`Reading Shelf (${readingListIds.length} folios)`}
          style={{
            padding: '8px',
            color: sidebarView === 'bookmarks' ? 'var(--accent)' : 'var(--text-muted)',
            backgroundColor: sidebarView === 'bookmarks' ? 'var(--bg-surface)' : 'transparent',
            borderLeft: sidebarView === 'bookmarks' ? '2px solid var(--accent)' : '2px solid transparent',
            borderRadius: 'var(--radius-1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Bookmark size={16} fill={readingListIds.length > 0 ? 'currentColor' : 'none'} />
        </button>

        <button
          type="button"
          onClick={() => navigate('/desk')}
          aria-label="Author’s Desk"
          title="Author’s Desk (Drafts & Folios)"
          style={{
            padding: '8px',
            color: 'var(--text-muted)',
            backgroundColor: 'transparent',
            borderRadius: 'var(--radius-1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <BookOpen size={16} />
        </button>

        <button
          type="button"
          onClick={() => setAboutModalOpen(true)}
          aria-label="About & Colophon"
          title="About Marginalia & Colophon"
          style={{
            marginTop: 'auto',
            marginBottom: '10px',
            padding: '8px',
            color: 'var(--text-muted)',
            borderRadius: 'var(--radius-1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <Info size={16} />
        </button>
      </div>

      {/* Pane Content */}
      <div
        style={{
          width: '230px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Pane Header */}
        <div
          style={{
            padding: '10px 14px',
            borderBottom: '1px solid var(--border-default)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-surface-elevated)',
          }}
        >
          <span>
            {sidebarView === 'bookmarks' ? 'READING SHELF' : 'ARCHIVAL FOLIOS'}
          </span>
          <span className="tabular-nums" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            {sidebarView === 'bookmarks' ? `${savedShelfEssays.length}` : `${allEssays.length}`}
          </span>
        </div>

        {/* Scrollable Tree */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
          {sidebarView === 'bookmarks' ? (
            savedShelfEssays.length === 0 ? (
              <div
                style={{
                  padding: '24px 12px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-serif)',
                  lineHeight: 1.5,
                }}
              >
                <div className="fleuron" style={{ fontSize: '1.4rem', marginBottom: '4px' }}>❧</div>
                Your shelf is empty. Mark an essay to keep it here.
              </div>
            ) : (
              savedShelfEssays.map((essay) => {
                const isActive = activeSlug === essay.slug;
                return (
                  <div
                    key={essay.id}
                    onClick={() => handleSelectEssay(essay)}
                    style={{
                      padding: '6px 8px',
                      borderRadius: 'var(--radius-1)',
                      marginBottom: '4px',
                      backgroundColor: isActive ? 'var(--bg-surface-active)' : 'transparent',
                      borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                      cursor: 'pointer',
                      fontSize: '11px',
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {essay.title}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      By {essay.author?.name}
                    </span>
                  </div>
                );
              })
            )
          ) : (
            Object.entries(sections).map(([sectionName, list]) => (
              <SectionGroup
                key={sectionName}
                sectionName={sectionName}
                essays={list}
                activeSlug={activeSlug}
                onSelectEssay={handleSelectEssay}
              />
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
