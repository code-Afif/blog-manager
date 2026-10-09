import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Bookmark, Calendar, Clock, Folder } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { RollingCounter } from '../../components/ui/RollingCounter';
import { useWorkspaceStore } from '../../store/workspaceStore';

export function PostMetaBar({ post, onStarChange }) {
  const { starredIds, stashedIds, toggleStar, toggleStash } = useWorkspaceStore();
  const [isStarring, setIsStarring] = useState(false);
  const [localStars, setLocalStars] = useState(post.stars || 0);

  const isStarred = starredIds.includes(post.id);
  const isStashed = stashedIds.includes(post.id);

  const handleStar = async () => {
    setIsStarring(true);
    const result = await toggleStar(post.id);
    setLocalStars(result.stars);
    onStarChange?.(result.stars);
    setTimeout(() => setIsStarring(false), 300);
  };

  const handleStash = () => {
    toggleStash(post.id);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '10px 14px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-1)',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
      }}
    >
      {/* Author and Date metadata */}
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
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
              fontWeight: 700,
              fontSize: '10px',
              color: 'var(--text-primary)',
            }}
          >
            {post.author?.avatar || 'DEV'}
          </div>
          <div>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              {post.author?.name}
            </span>
            <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>
              @{post.author?.handle}
            </span>
          </div>
        </div>

        {/* Category / Folder */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)' }}>
          <Folder size={13} style={{ color: 'var(--text-muted)' }} />
          <span>{post.folder || 'misc'}/</span>
        </div>

        {/* Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)' }}>
          <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
          <span className="tabular-nums">{formatDate(post.publishedAt)}</span>
        </div>

        {/* Read Time */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)' }}>
          <Clock size={13} style={{ color: 'var(--text-muted)' }} />
          <span className="tabular-nums">{post.readTimeMinutes} min read</span>
        </div>
      </div>

      {/* Action buttons: Star and Stash */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Star Button */}
        <motion.button
          type="button"
          onClick={handleStar}
          animate={isStarring ? { scale: [1, 1.25, 1] } : { scale: 1 }}
          transition={{ duration: 0.25 }}
          aria-label={isStarred ? 'Unstar post' : 'Star post'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 9px',
            backgroundColor: isStarred ? 'var(--bg-surface-elevated)' : 'transparent',
            border: isStarred ? '1px solid var(--accent)' : '1px solid var(--border-default)',
            color: isStarred ? 'var(--accent)' : 'var(--text-secondary)',
            borderRadius: 'var(--radius-1)',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 600,
          }}
          onMouseEnter={(e) => {
            if (!isStarred) {
              e.currentTarget.style.borderColor = 'var(--border-strong)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isStarred) {
              e.currentTarget.style.borderColor = 'var(--border-default)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }
          }}
        >
          <Star size={13} fill={isStarred ? 'currentColor' : 'none'} />
          <RollingCounter value={localStars} />
        </motion.button>

        {/* Stash Button */}
        <button
          type="button"
          onClick={handleStash}
          aria-label={isStashed ? 'Unstash post' : 'Stash post'}
          title={isStashed ? 'Remove from stash' : 'Stash post'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 9px',
            backgroundColor: isStashed ? 'var(--bg-surface-elevated)' : 'transparent',
            border: isStashed ? '1px solid var(--accent)' : '1px solid var(--border-default)',
            color: isStashed ? 'var(--accent)' : 'var(--text-secondary)',
            borderRadius: 'var(--radius-1)',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 600,
          }}
          onMouseEnter={(e) => {
            if (!isStashed) {
              e.currentTarget.style.borderColor = 'var(--border-strong)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isStashed) {
              e.currentTarget.style.borderColor = 'var(--border-default)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }
          }}
        >
          <Bookmark size={13} fill={isStashed ? 'currentColor' : 'none'} />
          <span>{isStashed ? 'STASHED' : 'STASH'}</span>
        </button>
      </div>
    </div>
  );
}
