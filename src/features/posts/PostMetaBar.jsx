import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Bookmark, Calendar, Clock, Feather } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { RollingCounter } from '../../components/ui/RollingCounter';
import { useWorkspaceStore } from '../../store/workspaceStore';

export function PostMetaBar({ post, onAppreciationChange }) {
  const { appreciatedIds, readingListIds, toggleAppreciation, toggleReadingList } = useWorkspaceStore();
  const [isPopping, setIsPopping] = useState(false);
  const [localAppreciations, setLocalAppreciations] = useState(post.appreciations || 0);

  const isAppreciated = appreciatedIds.includes(post.id);
  const isSavedOnShelf = readingListIds.includes(post.id);

  const handleAppreciate = async () => {
    setIsPopping(true);
    const result = await toggleAppreciation(post.id);
    setLocalAppreciations(result.appreciations);
    onAppreciationChange?.(result.appreciations);
    setTimeout(() => setIsPopping(false), 300);
  };

  const handleShelfToggle = () => {
    toggleReadingList(post.id);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        padding: '12px 16px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-1)',
        fontFamily: 'var(--font-sans)',
        fontSize: '12px',
      }}
    >
      {/* Left Metadata */}
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        {/* Essay Issue & Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '12px',
              fontStyle: 'italic',
              fontWeight: 700,
              color: 'var(--accent)',
            }}
          >
            № {String(post.essayNumber || 1).padStart(2, '0')}
          </span>
          <span style={{ color: 'var(--border-strong)' }}>/</span>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--text-muted)',
            }}
          >
            {post.section || 'General'}
          </span>
        </div>

        {/* Author */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <div
            style={{
              width: '22px',
              height: '22px',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-strong)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '10px',
              color: 'var(--text-primary)',
            }}
          >
            {post.author?.avatar || 'AU'}
          </div>
          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
            {post.author?.name}
          </span>
        </div>

        {/* Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
          <Calendar size={13} />
          <span className="tabular-nums">{formatDate(post.publishedAt)}</span>
        </div>

        {/* Reading Duration */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
          <Clock size={13} />
          <span className="tabular-nums">{post.readTimeMinutes} min read</span>
        </div>
      </div>

      {/* Right Actions: Appreciate and Reading List (Shelf) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Appreciate Button */}
        <motion.button
          type="button"
          onClick={handleAppreciate}
          animate={isPopping ? { scale: [1, 1.25, 1] } : { scale: 1 }}
          transition={{ duration: 0.25 }}
          aria-label={isAppreciated ? 'Remove appreciation' : 'Appreciate this essay'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 11px',
            backgroundColor: isAppreciated ? 'var(--accent-soft)' : 'var(--bg-surface)',
            border: isAppreciated ? '1px solid var(--accent)' : '1px solid var(--border-default)',
            color: isAppreciated ? 'var(--accent)' : 'var(--text-secondary)',
            borderRadius: 'var(--radius-1)',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
          onMouseEnter={(e) => {
            if (!isAppreciated) {
              e.currentTarget.style.borderColor = 'var(--border-strong)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isAppreciated) {
              e.currentTarget.style.borderColor = 'var(--border-default)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }
          }}
        >
          <Heart size={13} fill={isAppreciated ? 'currentColor' : 'none'} />
          <span>APPRECIATE</span>
          <RollingCounter value={localAppreciations} />
        </motion.button>

        {/* Shelf (Reading List) Button */}
        <button
          type="button"
          onClick={handleShelfToggle}
          aria-label={isSavedOnShelf ? 'Remove from shelf' : 'Add to reading list shelf'}
          title={isSavedOnShelf ? 'Remove from reading shelf' : 'Add to reading shelf'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 11px',
            backgroundColor: isSavedOnShelf ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
            border: isSavedOnShelf ? '1px solid var(--border-strong)' : '1px solid var(--border-default)',
            color: isSavedOnShelf ? 'var(--accent)' : 'var(--text-secondary)',
            borderRadius: 'var(--radius-1)',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
          onMouseEnter={(e) => {
            if (!isSavedOnShelf) {
              e.currentTarget.style.borderColor = 'var(--border-strong)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSavedOnShelf) {
              e.currentTarget.style.borderColor = 'var(--border-default)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }
          }}
        >
          <Bookmark size={13} fill={isSavedOnShelf ? 'currentColor' : 'none'} />
          <span>{isSavedOnShelf ? 'ON SHELF' : 'SAVE TO SHELF'}</span>
        </button>
      </div>
    </div>
  );
}
