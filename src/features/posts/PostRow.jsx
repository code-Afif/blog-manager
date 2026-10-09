import React from 'react';
import { motion } from 'framer-motion';
import { Star, Bookmark, FileCode } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import { useWorkspaceStore } from '../../store/workspaceStore';

export function PostRow({
  post,
  index = 0,
  isSelected = false,
  onOpen,
}) {
  const { starredIds, stashedIds, toggleStash } = useWorkspaceStore();
  const isStarred = starredIds.includes(post.id);
  const isStashed = stashedIds.includes(post.id);

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.18, delay: index * 0.03, ease: [0, 0, 0.2, 1] }}
      onClick={() => onOpen?.(post)}
      style={{
        display: 'grid',
        gridTemplateColumns: '36px 1fr auto auto auto auto 44px',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 12px',
        backgroundColor: isSelected ? 'var(--bg-surface-active)' : 'transparent',
        borderBottom: '1px solid var(--border-subtle)',
        borderLeft: isSelected ? '2px solid var(--accent)' : '2px solid transparent',
        cursor: 'pointer',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        transition: 'background-color var(--duration-fast)',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {/* Index Number */}
      <div
        className="tabular-nums"
        style={{ color: 'var(--text-subtle)', textAlign: 'right', fontSize: '11px' }}
      >
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Title & File Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
        <FileCode size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
        <span
          style={{
            fontWeight: 600,
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {post.title}
        </span>
        <span
          style={{
            color: 'var(--text-muted)',
            fontSize: '11px',
            whiteSpace: 'nowrap',
          }}
        >
          ({post.filename})
        </span>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: '4px', overflow: 'hidden' }}>
        {(post.tags || []).slice(0, 2).map((tag) => (
          <Badge key={tag} variant="default" style={{ fontSize: '10px' }}>
            #{tag}
          </Badge>
        ))}
      </div>

      {/* Date */}
      <div
        className="tabular-nums"
        style={{ color: 'var(--text-secondary)', fontSize: '11px', whiteSpace: 'nowrap' }}
      >
        {formatDate(post.publishedAt)}
      </div>

      {/* Read Time */}
      <div
        className="tabular-nums"
        style={{ color: 'var(--text-muted)', fontSize: '11px', whiteSpace: 'nowrap' }}
      >
        {post.readTimeMinutes}m read
      </div>

      {/* Star count */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: isStarred ? 'var(--accent)' : 'var(--text-secondary)',
          fontSize: '11px',
        }}
      >
        <Star size={12} fill={isStarred ? 'currentColor' : 'none'} />
        <span className="tabular-nums">{post.stars}</span>
      </div>

      {/* Quick Stash action */}
      <div style={{ textAlign: 'right' }}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleStash(post.id);
          }}
          aria-label={isStashed ? 'Unstash' : 'Stash'}
          title={isStashed ? 'Unstash' : 'Stash'}
          style={{
            padding: '3px',
            color: isStashed ? 'var(--accent)' : 'var(--text-subtle)',
            borderRadius: 'var(--radius-1)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = isStashed ? 'var(--accent)' : 'var(--text-subtle)';
          }}
        >
          <Bookmark size={13} fill={isStashed ? 'currentColor' : 'none'} />
        </button>
      </div>
    </motion.div>
  );
}
