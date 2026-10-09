import React, { useState } from 'react';
import { Bookmark, Clock, Heart } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { RollingCounter } from '../../components/ui/RollingCounter';
import { useAuthStore } from '../../store/authStore';

export function PostMetaBar({ post, onAppreciationChange }) {
  const { user, userBookmarks, userLikes, toggleBookmark, toggleLike, openAuthModal } = useAuthStore();
  const [isPopping, setIsPopping] = useState(false);
  const [localAppreciations, setLocalAppreciations] = useState(post.appreciations || 14);

  const isAppreciated = userLikes.includes(post.id);
  const isSavedOnShelf = userBookmarks.includes(post.id);

  const handleAppreciate = async () => {
    setIsPopping(true);
    if (!user) {
      openAuthModal('signin', async () => {
        const result = await toggleLike(post.id);
        if (result && result.appreciations !== undefined) {
          setLocalAppreciations(result.appreciations);
          onAppreciationChange?.(result.appreciations);
        }
      });
      setIsPopping(false);
      return;
    }

    const result = await toggleLike(post.id);
    if (result && result.appreciations !== undefined) {
      setLocalAppreciations(result.appreciations);
      onAppreciationChange?.(result.appreciations);
    }
    setTimeout(() => setIsPopping(false), 200);
  };

  const handleShelfToggle = () => {
    if (!user) {
      openAuthModal('signin', () => {
        toggleBookmark(post.id);
      });
      return;
    }
    toggleBookmark(post.id);
  };

  const authorInitials = post.author?.initials || post.author?.name?.slice(0, 2).toUpperCase() || 'ST';

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        padding: '14px 18px',
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-default)',
        fontFamily: 'var(--font-sans)',
        fontSize: '12px',
        margin: '18px 0 28px',
      }}
    >
      {/* Left: Author & Date */}
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: '13px',
              color: 'var(--accent)',
              fontWeight: 600,
            }}
          >
            {authorInitials}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              {post.author?.name || 'Julian Vance'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {post.author?.role || 'Staff Essayist'}
            </div>
          </div>
        </div>

        <span style={{ color: 'var(--border-default)' }}>•</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
          <Clock size={13} />
          <span>{post.readTimeMinutes || 10} min read</span>
        </div>

        <span style={{ color: 'var(--border-default)' }}>•</span>

        <span style={{ color: 'var(--text-muted)' }}>
          {formatDate(post.publishedAt || '2026-10-14')}
        </span>
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Appreciation button */}
        <button
          type="button"
          onClick={handleAppreciate}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            backgroundColor: isAppreciated ? 'var(--accent-soft)' : 'var(--bg-surface)',
            border: `1px solid ${isAppreciated ? 'var(--accent)' : 'var(--border-default)'}`,
            color: isAppreciated ? 'var(--accent)' : 'var(--text-primary)',
            fontSize: '11px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all var(--duration-fast)',
          }}
        >
          <Heart size={13} fill={isAppreciated ? 'currentColor' : 'none'} />
          <RollingCounter value={localAppreciations} />
          <span>APPRECIATE</span>
        </button>

        {/* Shelf bookmark button */}
        <button
          type="button"
          onClick={handleShelfToggle}
          title={isSavedOnShelf ? 'Preserved on Shelf' : 'Add to Shelf'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 12px',
            backgroundColor: isSavedOnShelf ? 'var(--bg-surface)' : 'transparent',
            border: '1px solid var(--border-default)',
            color: isSavedOnShelf ? 'var(--accent)' : 'var(--text-muted)',
            fontSize: '11px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Bookmark size={13} fill={isSavedOnShelf ? 'currentColor' : 'none'} />
          <span>{isSavedOnShelf ? 'SAVED' : 'BOOKMARK'}</span>
        </button>
      </div>
    </div>
  );
}
