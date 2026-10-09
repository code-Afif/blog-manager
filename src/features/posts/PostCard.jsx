import React from 'react';
import { motion } from 'framer-motion';
import { Star, Bookmark, FileCode, Clock, Calendar } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import { useWorkspaceStore } from '../../store/workspaceStore';

export function PostCard({ post, index = 0, onOpen }) {
  const { starredIds, stashedIds, toggleStash } = useWorkspaceStore();
  const isStarred = starredIds.includes(post.id);
  const isStashed = stashedIds.includes(post.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, delay: index * 0.03, ease: [0, 0, 0.2, 1] }}
      onClick={() => onOpen?.(post)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '14px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-1)',
        cursor: 'pointer',
        fontFamily: 'var(--font-mono)',
        boxShadow: 'none',
        transition: 'border-color var(--duration-fast), background-color var(--duration-fast)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-strong)';
        e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-default)';
        e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
      }}
    >
      <div>
        {/* Top bar with folder & stash */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px',
            fontSize: '11px',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <FileCode size={13} style={{ color: 'var(--accent)' }} />
            <span>{post.folder || 'src'}/{post.filename}</span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleStash(post.id);
            }}
            aria-label={isStashed ? 'Unstash' : 'Stash'}
            style={{
              padding: '2px',
              color: isStashed ? 'var(--accent)' : 'var(--text-subtle)',
            }}
          >
            <Bookmark size={13} fill={isStashed ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Title */}
        <h4
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '8px',
            lineHeight: 1.35,
          }}
        >
          {post.title}
        </h4>

        {/* Excerpt */}
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            marginBottom: '14px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.excerpt}
        </p>
      </div>

      {/* Footer */}
      <div>
        {/* Tag chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
          {(post.tags || []).slice(0, 3).map((tag) => (
            <Badge key={tag} variant="default" style={{ fontSize: '10px' }}>
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Metas hairline */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '8px',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '11px',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="tabular-nums">{formatDate(post.publishedAt)}</span>
            <span>•</span>
            <span className="tabular-nums">{post.readTimeMinutes}m</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: isStarred ? 'var(--accent)' : 'var(--text-secondary)',
            }}
          >
            <Star size={11} fill={isStarred ? 'currentColor' : 'none'} />
            <span className="tabular-nums">{post.stars}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
