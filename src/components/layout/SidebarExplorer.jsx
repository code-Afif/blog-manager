import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { postService, TOPICS } from '../../lib/postService';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useAuthStore } from '../../store/authStore';
import {
  ChevronRight,
  ChevronDown,
  Bookmark,
  Plus,
  BookOpen,
  FileText,
  Info,
} from 'lucide-react';

function SectionGroup({ sectionName, essays, activeSlug, onSelectEssay }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div style={{ marginBottom: '6px' }}>
      {/* Section Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 8px',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          userSelect: 'none',
          fontFamily: 'var(--font-sans)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
      >
        {isOpen ? <ChevronDown size={11} style={{ opacity: 0.6 }} /> : <ChevronRight size={11} style={{ opacity: 0.6 }} />}
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {sectionName}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--text-muted)' }}>
          {essays.length}
        </span>
      </div>

      {/* Essays List */}
      {isOpen && (
        <div style={{ paddingLeft: '8px', borderLeft: '1px solid var(--border-default)', marginLeft: '10px' }}>
          {essays.map((essay) => {
            const isActive = activeSlug === essay.slug;
            return (
              <div
                key={essay.id}
                onClick={() => onSelectEssay(essay)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 8px',
                  fontSize: '12px',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  borderRadius: 'var(--radius-1)',
                  backgroundColor: isActive ? 'var(--bg-surface-elevated)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <FileText size={11} style={{ flexShrink: 0, opacity: 0.6 }} />
                <span
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    lineHeight: 1.3,
                  }}
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
  const { openTab, setIndexView, setAboutModalOpen } = useWorkspaceStore();
  const { userBookmarks } = useAuthStore();
  const [posts, setPosts] = useState([]);

  const activeSlug = location.pathname.startsWith('/essays/')
    ? location.pathname.replace('/essays/', '')
    : null;

  useEffect(() => {
    postService.getAll(true).then(setPosts);
  }, []);

  const handleSelectEssay = (essay) => {
    openTab({
      id: essay.id,
      slug: essay.slug,
      title: `№ ${String(essay.essayNumber || 1).padStart(2, '0')} ${essay.title.slice(0, 16)}...`,
      type: 'essay',
    });
    navigate(`/essays/${essay.slug}`);
  };

  const handleCompose = () => {
    openTab({
      id: 'editor-new',
      slug: 'new-story',
      title: 'untitled_manuscript.md',
      type: 'editor',
    });
    navigate('/write');
  };

  // Group by topic
  const grouped = {};
  TOPICS.forEach((sec) => {
    grouped[sec] = [];
  });

  posts.forEach((p) => {
    const sec = p.section || 'Culture';
    if (!grouped[sec]) grouped[sec] = [];
    grouped[sec].push(p);
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-default)',
        overflowY: 'auto',
        fontFamily: 'var(--font-sans)',
        padding: '16px 12px',
      }}
    >
      {/* Top quick navigation */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-default)' }}>
        <button
          type="button"
          onClick={() => {
            setIndexView('contents');
            navigate('/');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 8px',
            background: 'none',
            border: 'none',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <BookOpen size={13} style={{ color: 'var(--accent)' }} />
          <span>Curated Index</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setIndexView('shelf');
            navigate('/shelf');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 8px',
            background: 'none',
            border: 'none',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <Bookmark size={13} fill={userBookmarks.length > 0 ? 'currentColor' : 'none'} />
          <span>Reading Shelf ({userBookmarks.length})</span>
        </button>

        <button
          type="button"
          onClick={handleCompose}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 8px',
            background: 'none',
            border: 'none',
            fontSize: '12px',
            color: 'var(--accent)',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <Plus size={13} />
          <span>Write a Story</span>
        </button>
      </div>

      {/* Sections Taxonomy */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: '10px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: '10px',
            paddingLeft: '4px',
          }}
        >
          SECTIONS
        </div>

        {Object.entries(grouped).map(([sectionName, list]) => {
          if (list.length === 0) return null;
          return (
            <SectionGroup
              key={sectionName}
              sectionName={sectionName}
              essays={list}
              activeSlug={activeSlug}
              onSelectEssay={handleSelectEssay}
            />
          );
        })}
      </div>

      {/* Bottom About link */}
      <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-default)', marginTop: 'auto' }}>
        <button
          type="button"
          onClick={() => setAboutModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 8px',
            background: 'none',
            border: 'none',
            fontSize: '11px',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          <Info size={12} />
          <span>Colophon &amp; Journal Masthead</span>
        </button>
      </div>
    </div>
  );
}
