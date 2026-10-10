import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService } from '../../lib/postService';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useAuthStore } from '../../store/authStore';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { MarkdownRenderer } from './MarkdownRenderer';
import { TableOfContents } from './TableOfContents';
import { PostMetaBar } from './PostMetaBar';
import { PostReaderAdjacentNav } from './PostReaderAdjacentNav';
import { PostReaderColophon } from './PostReaderColophon';
import { PostReaderCatalogCard } from './PostReaderCatalogCard';
import { CommentThread } from '../comments/CommentThread';
import { ArrowLeft, Lock, LogIn } from 'lucide-react';
import { countWords, calculateReadTime } from '../../lib/utils';

export function PostReader() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { openTab, setActiveWordCount, setActiveReadTime } = useWorkspaceStore();
  const { isAuthenticated, openAuthModal } = useAuthStore();

  const activeSlug = slug || (typeof window !== 'undefined' ? window.location.pathname.split('/').filter(Boolean).pop() : null);

  const [essay, setEssay] = useState(null);
  const [headings, setHeadings] = useState([]);
  const [adjacent, setAdjacent] = useState({ prevEssay: null, nextEssay: null });
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const scrollContainerRef = useRef(null);

  const headingIds = headings.map((h) => h.id);
  const { activeId, readingProgress } = useScrollSpy(headingIds, null);

  useEffect(() => {
    if (!activeSlug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setNotFound(false);

    postService
      .getBySlug(activeSlug)
      .then((data) => {
        setEssay(data);
        setLoading(false);
        setActiveWordCount(countWords(data.content));
        setActiveReadTime(calculateReadTime(data.content, 'en'));

        document.title = `${data.title} — Marginalia`;

        openTab({
          id: data.id,
          slug: data.slug,
          title: `№ ${String(data.number || data.essayNumber || 1).padStart(2, '0')} ${data.title.slice(0, 20)}...`,
          type: 'essay',
        });

        postService.getAdjacentEssays(data.slug).then(setAdjacent);
      })
      .catch((err) => {
        console.warn(err.message);
        setNotFound(true);
        setLoading(false);
      });
  }, [activeSlug, openTab, setActiveWordCount, setActiveReadTime]);

  useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal('signin');
    }
  }, [isAuthenticated, activeSlug, openAuthModal]);

  const handleSelectHeading = (headingId) => {
    const el = document.getElementById(headingId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: '60px 24px',
          fontFamily: 'var(--font-serif)',
          color: 'var(--text-muted)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: '1.2rem', color: 'var(--accent)', fontStyle: 'italic' }}>* * *</span>
        <div style={{ fontSize: '14px' }}>
          Retrieving essay from the archive...
        </div>
      </div>
    );
  }

  // 404 State
  if (notFound || !essay) {
    return (
      <div
        style={{
          padding: '64px 24px',
          maxWidth: '620px',
          margin: '0 auto',
          textAlign: 'center',
          fontFamily: 'var(--font-serif)',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            padding: '36px 28px',
          }}
        >
          <div style={{ color: 'var(--accent)', fontSize: '18px', fontStyle: 'italic', marginBottom: '10px' }}>
            Essay Not Found
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '14px', lineHeight: 1.3 }}>
            This essay could not be located.
          </h2>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '15px',
              lineHeight: 1.6,
              marginBottom: '24px',
            }}
          >
            No essay found under “{activeSlug}”. It may have been moved or returned to drafts.
          </p>

          <button
            type="button"
            className="button-create"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={14} />
            <span>Return to Contents</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: 'var(--bg-canvas)',
      }}
    >
      {/* Thin Flat Reading Progress Line */}
      <div
        aria-hidden="true"
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          zIndex: 50,
          backgroundColor: 'transparent',
          width: '100%',
        }}
      >
        <div
          style={{
            height: '100%',
            backgroundColor: 'var(--accent)',
            width: `${readingProgress}%`,
            transition: 'width 80ms linear',
          }}
        />
      </div>

      {/* Reader Body */}
      <div
        style={{
          width: '100%',
          padding: '48px 24px 80px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1180px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 280px',
            gap: '40px',
            alignItems: 'start',
          }}
          className="post-reader-layout"
        >
          {/* Main Article Column */}
          <article
            style={{
              minWidth: 0,
              fontFamily: 'var(--font-serif)',
            }}
          >
            <header style={{ marginBottom: '28px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                  marginBottom: '12px',
                }}
              >
                <span>Marginalia</span>
                <span>•</span>
                <span style={{ color: 'var(--accent)' }}>
                  № {String(essay.number || essay.essayNumber || 1).padStart(2, '0')}
                </span>
                <span>•</span>
                <span>{essay.section || 'Essays'}</span>
              </div>

              {/* Title */}
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.2rem, 4.5vw, 3rem)',
                  fontWeight: 400,
                  lineHeight: 1.18,
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                }}
              >
                {essay.title}
              </h1>

              {/* Standfirst / Dek */}
              {essay.dek && (
                <p
                  style={{
                    fontSize: '1.2rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    marginBottom: '20px',
                  }}
                >
                  {essay.dek}
                </p>
              )}

              {/* Epigraph */}
              {essay.epigraph && (
                <div
                  className="epigraph"
                  style={{
                    margin: '20px 0',
                    paddingLeft: '16px',
                    borderLeft: '2px solid var(--accent)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontStyle: 'italic',
                      fontSize: '1.1rem',
                      lineHeight: 1.6,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    “{essay.epigraph.quote}”
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      marginTop: '6px',
                    }}
                  >
                    — {essay.epigraph.attribution}
                  </div>
                </div>
              )}

              <PostMetaBar
                post={essay}
                onAppreciationChange={(newCount) => setEssay({ ...essay, appreciations: newCount })}
              />
            </header>

            {/* Content Body */}
            <MarkdownRenderer
              content={
                isAuthenticated
                  ? essay.content
                  : (() => {
                      const clean = essay.content || '';
                      const paragraphs = clean.split(/\n\s*\n/);
                      if (paragraphs.length > 0 && paragraphs[0].trim()) {
                        return paragraphs[0] + '...';
                      }
                      return clean.slice(0, 350) + '...';
                    })()
              }
              lang="en"
              dir="ltr"
              onHeadingsExtracted={setHeadings}
            />

            {!isAuthenticated ? (
              <div style={{ position: 'relative', marginTop: '-30px', paddingTop: '30px' }}>
                {/* Fade-out gradient mask */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '100px',
                    background: 'linear-gradient(to bottom, transparent, var(--bg-canvas))',
                    pointerEvents: 'none',
                  }}
                />

                {/* Archival Reading Gate Card */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 10,
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-default)',
                    borderRadius: '16px',
                    padding: '36px 28px',
                    textAlign: 'center',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)',
                    marginTop: '16px',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-canvas)',
                      border: '1px solid var(--border-default)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      color: 'var(--accent)',
                    }}
                  >
                    <Lock size={20} />
                  </div>

                  <div
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      color: 'var(--accent)',
                      fontWeight: 600,
                      marginBottom: '6px',
                    }}
                  >
                    Archival Reader Access Required
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.6rem',
                      fontWeight: 400,
                      color: 'var(--text-primary)',
                      margin: '0 0 10px',
                    }}
                  >
                    Sign in to continue reading
                  </h3>

                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '15px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      maxWidth: '460px',
                      margin: '0 auto 24px',
                    }}
                  >
                    Full text access, marginal citations, adjacent folio dispatches, and reader commentary are reserved for authenticated members of Marginalia.
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => openAuthModal('signin')}
                      className="button-create"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '9px 24px',
                        fontSize: '13px',
                      }}
                    >
                      <LogIn size={15} />
                      <span>Sign In to Read</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/')}
                      style={{
                        padding: '9px 18px',
                        fontSize: '13px',
                        fontFamily: 'var(--font-sans)',
                        fontWeight: 500,
                        border: '1px solid var(--border-default)',
                        borderRadius: '8px',
                        backgroundColor: 'transparent',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                      }}
                    >
                      Return to Contents
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Divider */}
                <div
                  style={{
                    margin: '3rem 0',
                    borderTop: '1px solid var(--border-default)',
                  }}
                />

                {/* Adjacent Folio Navigation (Previous / Next Essay) */}
                <PostReaderAdjacentNav adjacent={adjacent} />

                {/* Discussion Thread */}
                <CommentThread postSlug={essay.slug} />

                {/* Colophon Note */}
                <PostReaderColophon />
              </>
            )}
          </article>

          {/* Sticky Section Outline on Right */}
          <aside
            style={{
              position: 'sticky',
              top: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
            className="post-reader-toc-sidebar"
          >
            <TableOfContents
              headings={headings}
              activeId={activeId}
              onSelectHeading={handleSelectHeading}
            />

            <PostReaderCatalogCard essay={essay} />
          </aside>
        </div>
      </div>
    </div>
  );
}
