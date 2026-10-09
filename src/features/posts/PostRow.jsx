import React from 'react';
import { Bookmark, ArrowUpRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function PostRow({
  post,
  index = 0,
  isSelected = false,
  onOpen,
}) {
  const { user, userBookmarks, toggleBookmark, openAuthModal } = useAuthStore();
  const isSavedOnShelf = userBookmarks.includes(post.id);

  const handleToggleSave = (e) => {
    e.stopPropagation();
    if (!user) {
      openAuthModal('signin', () => {
        toggleBookmark(post.id);
      });
      return;
    }
    toggleBookmark(post.id);
  };

  return (
    <article
      onClick={() => onOpen?.(post)}
      style={{
        padding: '24px 0',
        backgroundColor: 'transparent',
        borderBottom: '1px solid var(--border-default)',
        cursor: 'pointer',
        transition: 'background-color var(--duration-fast)',
      }}
    >
      {/* Top Meta Line */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px',
          fontFamily: 'var(--font-sans)',
          fontSize: '11px',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {post.category || post.section || 'Essay'}
          </span>
          <span>·</span>
          <span>{post.readTimeMinutes || 8} min read</span>
          <span>·</span>
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Issue {post.essayNumber || index + 35}
          </span>
        </div>

        <button
          type="button"
          onClick={handleToggleSave}
          title={isSavedOnShelf ? 'Remove from Bookmarks' : 'Save to Bookmarks'}
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            color: isSavedOnShelf ? 'var(--accent)' : 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Bookmark size={16} fill={isSavedOnShelf ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Title */}
      <h4
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.65rem',
          lineHeight: 1.25,
          fontWeight: 400,
          color: 'var(--text-primary)',
          margin: '0 0 8px',
          transition: 'color var(--duration-fast)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
      >
        {post.title}
      </h4>

      {/* Dek */}
      {post.dek && (
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.05rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            margin: '0 0 14px',
          }}
        >
          {post.dek}
        </p>
      )}

      {/* Bottom Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-sans)',
          fontSize: '12px',
        }}
      >
        <div style={{ color: 'var(--text-primary)' }}>
          By <span style={{ fontWeight: 600 }}>{post.author?.name || 'Author'}</span>
        </div>

        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--accent)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
          }}
        >
          Read Dispatch <ArrowUpRight size={13} />
        </span>
      </div>
    </article>
  );
}
