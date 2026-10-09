import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useAuthStore } from '../../store/authStore';
import { ArrowRight, Bookmark } from 'lucide-react';

/**
 * PostIndexMasthead — STACKTRACE Editorial Hero & Lead Broadsheet Feature
 * Exact match to Stitch screen acd2935d565549cd9dec9cbde4a37d5e.
 */
export function PostIndexMasthead({
  indexView,
  selectedSection,
  onSelectSection,
  sortBy,
  onSortChange,
}) {
  const navigate = useNavigate();
  const { openTab } = useWorkspaceStore();
  const { user, userBookmarks, toggleBookmark, openAuthModal } = useAuthStore();

  const isSaved = userBookmarks.includes('folio-01');

  const handleOpenLead = () => {
    openTab({
      id: 'folio-01',
      slug: 'the-quiet-art-of-beginning-again',
      title: '№ 42 The quiet art of beginning again',
      type: 'essay',
    });
    navigate('/essays/the-quiet-art-of-beginning-again');
  };

  const handleToggleSave = (e) => {
    e.stopPropagation();
    if (!user) {
      openAuthModal('signin', () => {
        toggleBookmark('folio-01');
      });
      return;
    }
    toggleBookmark('folio-01');
  };

  const topics = [
    { id: 'all', label: 'All Essays' },
    { id: 'Culture', label: 'Culture' },
    { id: 'Personal', label: 'Personal' },
    { id: 'Ideas', label: 'Ideas' },
    { id: 'Literature', label: 'Literature' },
    { id: 'Quiet Tech', label: 'Quiet Tech' },
    { id: 'Architecture of Mind', label: 'Architecture of Mind' },
  ];

  if (indexView === 'shelf') {
    return (
      <section
        style={{
          borderBottom: '1px solid var(--border-default)',
          padding: '36px 0 28px',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--accent)',
            fontWeight: 600,
            marginBottom: '8px',
          }}
        >
          Preserved Manuscripts
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.5rem',
            margin: '0 0 10px',
            color: 'var(--text-primary)',
            fontWeight: 400,
          }}
        >
          The Reading Shelf
        </h2>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1.125rem',
            lineHeight: 1.6,
            maxWidth: '680px',
            margin: 0,
          }}
        >
          Your curated compendium of long-form essays, field notes, and philosophical marginalia marked for deliberate contemplation.
        </p>
      </section>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {/* 1. EDITORIAL INTRODUCTION HERO & TOPIC INDEX */}
      <section
        style={{
          width: '100%',
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-default)',
          padding: '48px 0 36px',
        }}
      >
        <div style={{ maxWidth: '820px' }}>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
              color: 'var(--accent)',
              fontWeight: 600,
              margin: '0 0 12px',
            }}
          >
            Quiet Discourse &amp; Cultural Criticism
          </p>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)',
              lineHeight: 1.15,
              fontWeight: 400,
              color: 'var(--text-primary)',
              margin: 0,
              letterSpacing: '-0.015em',
            }}
          >
            A little more room for thought.
          </h2>

          <p
            style={{
              marginTop: '16px',
              fontSize: '1.2rem',
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              maxWidth: '680px',
            }}
          >
            Essays, stories, and reflections on the things worth paying attention to. Written by observers, critics, and thinkers away from the frenetic cadence of the modern feed.
          </p>
        </div>

        {/* Topic Index & Sorter Controls Bar */}
        <div
          style={{
            marginTop: '36px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          {/* Topic Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                marginRight: '4px',
              }}
            >
              Dispatches:
            </span>

            {topics.map((t) => {
              const isActive = (t.id === 'all' && !selectedSection) || selectedSection === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onSelectSection?.(t.id === 'all' ? '' : t.id)}
                  className={`topic-pill ${isActive ? 'active' : ''}`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Sorter Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              color: 'var(--text-muted)',
            }}
          >
            <button
              type="button"
              onClick={() => onSortChange?.('curated')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: !sortBy || sortBy === 'curated' ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: !sortBy || sortBy === 'curated' ? 600 : 400,
                textDecoration: !sortBy || sortBy === 'curated' ? 'underline' : 'none',
                textUnderlineOffset: '4px',
                cursor: 'pointer',
              }}
            >
              Curator’s Selection
            </button>
            <span style={{ color: 'var(--border-default)' }}>/</span>
            <button
              type="button"
              onClick={() => onSortChange?.('newest')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: sortBy === 'newest' ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: sortBy === 'newest' ? 600 : 400,
                textDecoration: sortBy === 'newest' ? 'underline' : 'none',
                textUnderlineOffset: '4px',
                cursor: 'pointer',
              }}
            >
              Recent Dispatches
            </button>
            <span style={{ color: 'var(--border-default)' }}>/</span>
            <button
              type="button"
              onClick={() => onSortChange?.('appreciated')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: sortBy === 'appreciated' ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: sortBy === 'appreciated' ? 600 : 400,
                textDecoration: sortBy === 'appreciated' ? 'underline' : 'none',
                textUnderlineOffset: '4px',
                cursor: 'pointer',
              }}
            >
              Most Contemplated
            </button>
          </div>
        </div>
      </section>

      {/* 2. LEAD FEATURED STORY (ASYMMETRIC BROADSHEET SPREAD) */}
      <section
        style={{
          width: '100%',
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-default)',
          padding: '48px 0',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          {/* Left Editorial Column (7 cols equivalent) */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <span
                style={{
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  color: 'var(--accent)',
                  padding: '3px 10px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                ESSAY · CULTURAL CRITICISM
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                }}
              >
                COVER FEATURE
              </span>
            </div>

            <h2
              onClick={handleOpenLead}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, 2.85rem)',
                lineHeight: 1.16,
                fontWeight: 400,
                color: 'var(--text-primary)',
                margin: '0 0 16px',
                cursor: 'pointer',
                transition: 'color var(--duration-fast)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            >
              The <span style={{ fontStyle: 'italic', fontWeight: 400 }}>quiet</span> art of beginning again
            </h2>

            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.15rem',
                lineHeight: 1.7,
                margin: '0 0 24px',
                maxWidth: '600px',
              }}
            >
              Why our obsession with momentum blinds us to the restorative geometry of pause, hesitation, and starting from a blank sheet of paper in an over-optimized world.
            </p>

            {/* Marginalia citation / Pull snippet */}
            <div
              style={{
                borderLeft: '2px solid var(--accent-container, #793C46)',
                paddingLeft: '18px',
                margin: '0 0 28px',
                maxWidth: '560px',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.2rem',
                  fontStyle: 'italic',
                  lineHeight: 1.5,
                  color: 'var(--text-primary)',
                  margin: 0,
                }}
              >
                “The ink bottle does not demand urgency. It demands only that you know where the sentence must end before setting the nib down.”
              </p>
            </div>

            {/* Author row & Read button */}
            <div
              style={{
                paddingTop: '20px',
                borderTop: '1px solid var(--border-default)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    border: '1px solid var(--border-default)',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-display)',
                    fontSize: '13px',
                    color: 'var(--accent)',
                    fontWeight: 600,
                  }}
                >
                  JV
                </span>
                <div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Julian Vance
                  </div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    14 min read · Published October 14
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <button
                  type="button"
                  onClick={handleToggleSave}
                  title={isSaved ? 'Remove from Bookmarks' : 'Save to Bookmarks'}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '6px',
                    color: isSaved ? 'var(--accent)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'color var(--duration-fast)',
                  }}
                >
                  <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
                </button>

                <button
                  type="button"
                  onClick={handleOpenLead}
                  className="button-primary"
                  style={{
                    backgroundColor: 'var(--accent-container, #793C46)',
                    color: '#FFFFFF',
                    padding: '10px 20px',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                  }}
                >
                  <span>Read the story</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Visual Plate (5 cols equivalent) */}
          <div style={{ maxWidth: '520px', width: '100%', margin: '0 auto' }}>
            <figure
              style={{
                margin: 0,
                border: '1px solid var(--border-default)',
                backgroundColor: 'var(--bg-surface-card, #FFFFFF)',
                padding: '10px',
              }}
            >
              <div
                style={{
                  overflow: 'hidden',
                  aspectRatio: '16/11',
                  backgroundColor: 'var(--bg-surface-elevated)',
                }}
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuc85QaTYiIbDr8Ec4Olg98B8OndgH4va0CpBPAIOV_6rAVZqyIlLASZ5Dhw_AeUpU7oCjR6W4eNBC0AnW3_COu2yZXOQrcCR-Tkm5Da4UfFzPGCmYAjZ6dxVis9Orm_RQBCsWVKqFqcsHavRR9R4mqBOghHwkOJ70vCj7iEXMLvold46_RMHiJlCnZpseuVcY51ubLVGCrMqZ2fiB4meiTLad5KT-hBoURdzzsuypd9YBrMxqyLYn"
                  alt="Open handwritten journal on wooden desk beside ceramic coffee cup and olive branch"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.4s ease-out',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
              </div>
              <figcaption
                style={{
                  marginTop: '12px',
                  padding: '8px 4px 4px',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '12.5px',
                  color: 'var(--text-muted)',
                }}
              >
                <span>Plate 04: Studies in quietude and notebook margins, Hampshire studio.</span>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    color: 'var(--accent)',
                    whiteSpace: 'nowrap',
                    marginLeft: '8px',
                  }}
                >
                  ARCHIVE REF. 42B
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
    </div>
  );
}
