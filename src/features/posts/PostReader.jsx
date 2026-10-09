import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService } from '../../lib/postService';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { MarkdownRenderer } from './MarkdownRenderer';
import { TableOfContents } from './TableOfContents';
import { PostMetaBar } from './PostMetaBar';
import { PostReaderAdjacentNav } from './PostReaderAdjacentNav';
import { PostReaderColophon } from './PostReaderColophon';
import { PostReaderCatalogCard } from './PostReaderCatalogCard';
import { CommentThread } from '../comments/CommentThread';
import { Button } from '../../components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { countWords, calculateReadTime } from '../../lib/utils';

/**
 * PostReader — The Folio Reading Experience
 *
 * Supports multilingual rendering across English and Hindi with
 * correct text direction, generous line-heights, and responsive section outlines.
 */
export function PostReader() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { openTab, setActiveWordCount, setActiveReadTime } = useWorkspaceStore();

  const activeSlug = slug || (typeof window !== 'undefined' ? window.location.pathname.split('/').filter(Boolean).pop() : null);

  const [essay, setEssay] = useState(null);
  const [headings, setHeadings] = useState([]);
  const [adjacent, setAdjacent] = useState({ prevEssay: null, nextEssay: null });
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const scrollContainerRef = useRef(null);

  const headingIds = headings.map((h) => h.id);
  const { activeId, readingProgress } = useScrollSpy(headingIds, scrollContainerRef);

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
        setActiveReadTime(calculateReadTime(data.content, data.language || 'en'));

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
        <span className="fleuron" style={{ fontSize: '1.8rem' }}>❧</span>
        <div style={{ fontStyle: 'italic', fontSize: '1.1rem' }}>
          Retrieving folio from archival memory...
        </div>
      </div>
    );
  }

  // 404 Literary State
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
            borderRadius: 'var(--radius-1)',
            padding: '36px 28px',
          }}
        >
          <div className="fleuron" style={{ fontSize: '2rem', marginBottom: '10px' }}>❧</div>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: '10px',
            }}
          >
            Folio Not Found in Library Volume
          </div>

          <h2 style={{ fontSize: '1.6rem', marginBottom: '14px', lineHeight: 1.3 }}>
            This page has been lost from the volume.
          </h2>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              lineHeight: 1.6,
              marginBottom: '24px',
            }}
          >
            No essay was cataloged under the address <code className="inline-code">/essays/{activeSlug}</code>. The document may have been retired to the archives or uncataloged.
          </p>

          <Button variant="secondary" size="md" onClick={() => navigate('/')}>
            <ArrowLeft size={13} />
            RETURN TO CONTENTS
          </Button>
        </div>
      </div>
    );
  }

  const lang = essay.language || 'en';
  const isHindi = lang === 'hi';

  return (
    <div
      style={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
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

      {/* Scrollable Reader Body */}
      <div
        ref={scrollContainerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '36px 24px 80px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1040px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 260px',
            gap: '48px',
            alignItems: 'start',
          }}
          className="post-reader-layout"
        >
          {/* Main Article Column */}
          <article
            lang={lang}
            dir="ltr"
            style={{
              minWidth: 0,
              textAlign: 'left',
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
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginBottom: '12px',
                  justifyContent: 'flex-start',
                }}
              >
                <span>MARGINALIA</span>
                <span>•</span>
                <span>VOLUME IV</span>
                <span>•</span>
                <span style={{ color: 'var(--accent)' }}>
                  ESSAY № {String(essay.number || essay.essayNumber || 1).padStart(2, '0')}
                </span>
              </div>

              {/* Title */}
              <h1
                lang={lang}
                style={{
                  fontFamily: isHindi ? 'var(--font-serif-hi)' : 'var(--font-serif)',
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  lineHeight: isHindi ? 1.4 : 1.18,
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                }}
              >
                {essay.title}
              </h1>

              {/* Standfirst / Dek */}
              {essay.dek && (
                <p
                  lang={lang}
                  style={{
                    fontFamily: isHindi ? 'var(--font-serif-hi)' : 'var(--font-serif)',
                    fontSize: '1.2rem',
                    fontStyle: isHindi ? 'normal' : 'italic',
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
                <div className="epigraph" lang={lang} dir="ltr">
                  <div className="epigraph-quote">“{essay.epigraph.quote}”</div>
                  <div className="epigraph-author">— {essay.epigraph.attribution}</div>
                </div>
              )}

              <PostMetaBar
                post={essay}
                onAppreciationChange={(newCount) => setEssay({ ...essay, appreciations: newCount })}
              />
            </header>

            {/* Markdown Body (with Drop Cap on English, Pull Quotes, Footnotes) */}
            <MarkdownRenderer
              content={essay.content}
              lang={lang}
              onHeadingsExtracted={setHeadings}
            />

            {/* Fleuron Divider */}
            <div className="fleuron-divider">
              <span className="fleuron">❧</span>
            </div>

            {/* Adjacent Folio Navigation (Previous / Next Essay) */}
            <PostReaderAdjacentNav adjacent={adjacent} />

            {/* Marginal Notes Discussion Thread */}
            <CommentThread postSlug={essay.slug} />

            {/* Colophon Note */}
            <PostReaderColophon />
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
              lang={lang}
              dir="ltr"
            />

            <PostReaderCatalogCard essay={essay} />
          </aside>
        </div>
      </div>
    </div>
  );
}
