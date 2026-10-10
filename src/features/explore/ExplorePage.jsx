import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService, SECTIONS } from '../../lib/postService';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useAuthStore } from '../../store/authStore';
import { PostRow } from '../posts/PostRow';
import { ArrowUpRight, Compass, BookOpen, Heart, Sparkles } from 'lucide-react';

export function ExplorePage() {
  const navigate = useNavigate();
  const { openTab } = useWorkspaceStore();
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const [allPosts, setAllPosts] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);

  useEffect(() => {
    postService.getAll(false).then(setAllPosts);
  }, []);

  const handleOpenEssay = (essay) => {
    if (!isAuthenticated) {
      openAuthModal('signin', () => {
        openTab({
          id: essay.id,
          slug: essay.slug,
          title: `№ ${String(essay.essayNumber || 1).padStart(2, '0')} ${essay.title.slice(0, 24)}...`,
          type: 'essay',
        });
        navigate(`/essays/${essay.slug}`);
      });
      return;
    }

    openTab({
      id: essay.id,
      slug: essay.slug,
      title: `№ ${String(essay.essayNumber || 1).padStart(2, '0')} ${essay.title.slice(0, 24)}...`,
      type: 'essay',
    });
    navigate(`/essays/${essay.slug}`);
  };

  // Counts by section
  const sectionCounts = {};
  SECTIONS.forEach((s) => {
    sectionCounts[s] = allPosts.filter(
      (p) => (p.section || 'Essays').toLowerCase() === s.toLowerCase()
    ).length;
  });

  // Recent essays (top 4)
  const recentEssays = [...allPosts]
    .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0))
    .slice(0, 4);

  // Most appreciated essays (top 4)
  const mostAppreciatedEssays = [...allPosts]
    .sort((a, b) => (b.appreciations || 0) - (a.appreciations || 0))
    .slice(0, 4);

  // Filtered essays if section selected
  const hasFilter = Boolean(selectedSection);
  const filteredList = allPosts.filter((p) => {
    if (selectedSection && (p.section || 'Essays').toLowerCase() !== selectedSection.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '820px',
        margin: '0 auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: '1px solid var(--border-default)',
          paddingBottom: '20px',
          marginBottom: '32px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--accent)',
            fontWeight: 600,
            display: 'block',
            marginBottom: '4px',
          }}
        >
          Catalog &amp; Folio
        </span>
        <h2
          style={{
            fontSize: '2rem',
            fontWeight: 400,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
            margin: 0,
          }}
        >
          Explore Literature
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '15px',
            color: 'var(--text-secondary)',
            margin: '8px 0 0',
          }}
        >
          Browse essays, reflections, and criticism by section, form, and contemplation.
        </p>
      </div>

      {/* 1. BROWSE BY SECTION */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3
            style={{
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--text-muted)',
              fontWeight: 600,
              margin: 0,
            }}
          >
            Browse by Section
          </h3>
          {selectedSection && (
            <button
              type="button"
              onClick={() => setSelectedSection(null)}
              style={{ background: 'none', border: 'none', fontSize: '11px', color: 'var(--accent)', cursor: 'pointer', padding: 0 }}
            >
              Reset section
            </button>
          )}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {SECTIONS.map((sec) => {
            const isSelected = selectedSection === sec;
            const count = sectionCounts[sec] || 0;
            return (
              <button
                key={sec}
                type="button"
                onClick={() => setSelectedSection(isSelected ? null : sec)}
                style={{
                  padding: '6px 14px',
                  border: '1px solid var(--border-default)',
                  borderRadius: '9999px',
                  backgroundColor: isSelected ? 'var(--accent)' : 'var(--bg-surface)',
                  color: isSelected ? 'var(--accent-fg, #FFFFFF)' : 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{sec}</span>
                <span style={{ opacity: 0.7, fontSize: '11px' }}>({count})</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. FILTER RESULTS (if active) OR CURATED LISTS */}
      {hasFilter ? (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-default)', paddingBottom: '12px', marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 400, color: 'var(--text-primary)', margin: 0 }}>
              Matching Dispatches ({filteredList.length})
            </h3>
            <button
              type="button"
              onClick={() => {
                setSelectedSection(null);
              }}
              style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '12px', cursor: 'pointer' }}
            >
              Clear filters
            </button>
          </div>

          {filteredList.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: '12px' }}>
              <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
                No pieces match this specific combination.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filteredList.map((essay, idx) => (
                <PostRow key={essay.id} post={essay} index={idx} onOpen={handleOpenEssay} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '36px' }}>
          {/* Recently Published */}
          <div>
            <h3
              style={{
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--accent)',
                fontWeight: 600,
                borderBottom: '1px solid var(--border-default)',
                paddingBottom: '10px',
                margin: '0 0 16px',
              }}
            >
              Recently Published
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recentEssays.map((essay, idx) => (
                <div
                  key={essay.id}
                  onClick={() => handleOpenEssay(essay)}
                  style={{
                    paddingBottom: '14px',
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    {essay.section || 'Essays'} · {essay.readTimeMinutes || 6} min
                  </div>
                  <h4
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.15rem',
                      fontWeight: 400,
                      color: 'var(--text-primary)',
                      margin: '0 0 6px',
                    }}
                  >
                    {essay.title}
                  </h4>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    By {essay.author?.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Most Appreciated */}
          <div>
            <h3
              style={{
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--accent)',
                fontWeight: 600,
                borderBottom: '1px solid var(--border-default)',
                paddingBottom: '10px',
                margin: '0 0 16px',
              }}
            >
              Most Appreciated
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {mostAppreciatedEssays.map((essay, idx) => (
                <div
                  key={essay.id}
                  onClick={() => handleOpenEssay(essay)}
                  style={{
                    paddingBottom: '14px',
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    <span>{essay.section || 'Essays'} · {essay.readTimeMinutes || 6} min</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: 'var(--accent)' }}>
                      <Heart size={11} fill="currentColor" /> {essay.appreciations || 0}
                    </span>
                  </div>
                  <h4
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.15rem',
                      fontWeight: 400,
                      color: 'var(--text-primary)',
                      margin: '0 0 6px',
                    }}
                  >
                    {essay.title}
                  </h4>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    By {essay.author?.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
