import React from 'react';
import { Bookmark, MessageSquare } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { useAuthStore } from '../../store/authStore';

export function PostCard({ post, index = 0, onOpen }) {
  const { userBookmarks, toggleBookmark } = useAuthStore();
  const isSavedOnShelf = userBookmarks.includes(post.id);

  const entryCode = `08${42 - index}`;

  return (
    <article
      onClick={() => onOpen?.(post)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        cursor: 'pointer',
        transition: 'all var(--duration-fast)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--text-primary)';
        e.currentTarget.style.boxShadow = 'var(--shadow-hard)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-default)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div>
        {/* Top Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>
              ENTRY // {entryCode}
            </span>
            <span
              style={{
                border: '1px solid var(--border-default)',
                padding: '1px 6px',
                backgroundColor: 'var(--bg-surface-elevated)',
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
                fontSize: '10px',
                fontWeight: 600,
              }}
            >
              // [{post.section || 'SYSTEMS'}]
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(post.id);
            }}
            title={isSavedOnShelf ? 'Remove from bookmarks' : 'Save bookmark'}
            style={{
              padding: '4px',
              color: isSavedOnShelf ? 'var(--accent)' : 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <Bookmark size={14} fill={isSavedOnShelf ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Headline */}
        <h3
          style={{
            fontFamily: 'var(--font-headline)',
            fontSize: '1.2rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.3,
            marginBottom: '8px',
            letterSpacing: '-0.02em',
          }}
        >
          {post.title}
        </h3>

        {/* Excerpt */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13.5px',
            color: 'var(--text-secondary)',
            lineHeight: 1.55,
            marginBottom: '16px',
          }}
        >
          {post.excerpt || post.dek}
        </p>
      </div>

      {/* Footer Info */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--text-muted)',
        }}
      >
        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
          {post.author?.name}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>{post.readTimeMinutes || 5}M READ</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--text-primary)' }}>
            <MessageSquare size={11} />
            {post.appreciations || 24}
          </span>
        </div>
      </div>
    </article>
  );
}
