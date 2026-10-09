import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postService } from '../../lib/postService';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { MarkdownRenderer } from './MarkdownRenderer';
import { TableOfContents } from './TableOfContents';
import { PostMetaBar } from './PostMetaBar';
import { CommentThread } from '../comments/CommentThread';
import { Button } from '../../components/ui/Button';
import { FileCode, ArrowLeft, Terminal, AlertOctagon } from 'lucide-react';
import { countWords, calculateReadTime } from '../../lib/utils';

export function PostReader() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { openTab, setActiveWordCount, setActiveReadTime } = useWorkspaceStore();

  const [post, setPost] = useState(null);
  const [headings, setHeadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const scrollContainerRef = useRef(null);

  // Extract heading IDs for scroll spy
  const headingIds = headings.map((h) => h.id);
  const { activeId, readingProgress } = useScrollSpy(headingIds, scrollContainerRef);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    postService
      .getBySlug(slug)
      .then((data) => {
        setPost(data);
        setLoading(false);
        setActiveWordCount(countWords(data.content));
        setActiveReadTime(calculateReadTime(data.content));

        // Ensure tab is open
        openTab({
          id: data.id,
          slug: data.slug,
          title: data.filename,
          type: 'post',
        });
      })
      .catch((err) => {
        console.warn(err.message);
        setNotFound(true);
        setLoading(false);
      });
  }, [slug, openTab, setActiveWordCount, setActiveReadTime]);

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
          padding: '40px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <span className="block-cursor" />
        <span>READING /posts/{slug}.md...</span>
      </div>
    );
  }

  // 404 ENOENT State
  if (notFound || !post) {
    return (
      <div
        style={{
          padding: '48px 32px',
          maxWidth: '680px',
          margin: '0 auto',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--danger-border)',
            borderRadius: 'var(--radius-1)',
            padding: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--danger)',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            <AlertOctagon size={16} />
            <span>FS_ERROR: FILE NOT FOUND</span>
          </div>

          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '10px',
            }}
          >
            ENOENT: no such file or directory, open '/posts/{slug}.md'
          </div>

          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '12px',
              lineHeight: 1.6,
              marginBottom: '20px',
            }}
          >
            The requested markdown document does not exist in the devlog filesystem tree. It may have been unlinked or moved.
          </p>

          <Button variant="secondary" size="md" onClick={() => navigate('/')}>
            <ArrowLeft size={13} />
            RETURN TO README.md
          </Button>
        </div>
      </div>
    );
  }

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
      {/* Thin Flat Reading Progress Indicator */}
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
          padding: '28px 24px 60px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1080px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 260px',
            gap: '36px',
            alignItems: 'start',
          }}
          className="post-reader-layout"
        >
          {/* Main Article Content */}
          <article style={{ minWidth: 0 }}>
            {/* Meta Top Bar */}
            <div style={{ marginBottom: '24px' }}>
              <PostMetaBar post={post} onStarChange={(newCount) => setPost({ ...post, stars: newCount })} />
            </div>

            {/* Markdown Body */}
            <MarkdownRenderer
              content={post.content}
              onHeadingsExtracted={setHeadings}
            />

            {/* PR-style Discussion Thread */}
            <CommentThread postSlug={post.slug} />
          </article>

          {/* Sticky Table Of Contents on Right */}
          <aside
            style={{
              position: 'sticky',
              top: '20px',
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

            {/* Micro file metadata card */}
            <div
              style={{
                padding: '12px 14px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-1)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-muted)',
              }}
            >
              <div style={{ textTransform: 'uppercase', fontSize: '10px', fontWeight: 600, marginBottom: '6px' }}>
                FILE METRICS
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span>WORDS:</span>
                <span className="tabular-nums" style={{ color: 'var(--text-primary)' }}>
                  {countWords(post.content)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span>READING TIME:</span>
                <span className="tabular-nums" style={{ color: 'var(--text-primary)' }}>
                  {post.readTimeMinutes}m
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>STATUS:</span>
                <span style={{ color: 'var(--accent)', textTransform: 'uppercase' }}>
                  {post.status || 'PUBLISHED'}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
