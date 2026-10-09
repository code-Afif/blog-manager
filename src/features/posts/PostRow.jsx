import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Bookmark } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import { useWorkspaceStore } from '../../store/workspaceStore';

export function PostRow({
  post,
  index = 0,
  isSelected = false,
  onOpen,
}) {
  const { appreciatedIds, readingListIds, toggleReadingList } = useWorkspaceStore();
  const isAppreciated = appreciatedIds.includes(post.id);
  const isSavedOnShelf = readingListIds.includes(post.id);

  const lang = post.language || 'en';
  const isHindi = lang === 'hi';
  const langBadge = isHindi ? 'हिं' : 'EN';

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.16, delay: index * 0.025, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onOpen?.(post)}
      lang={lang}
      dir="ltr"
      style={{
        display: 'grid',
        gridTemplateColumns: '48px 1fr auto auto auto auto 44px',
        alignItems: 'center',
        gap: '14px',
        padding: '12px 14px',
        backgroundColor: isSelected ? 'var(--bg-surface-active)' : 'transparent',
        borderBottom: '1px solid var(--border-subtle)',
        borderInlineStart: isSelected ? '3px solid var(--accent)' : '3px solid transparent',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: '13px',
        transition: 'background-color var(--duration-calm)',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {/* Essay Number */}
      <div
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '13px',
          fontStyle: 'italic',
          color: 'var(--accent)',
          fontWeight: 700,
          textAlign: 'right',
        }}
      >
        № {String(post.number || post.essayNumber || index + 1).padStart(2, '0')}
      </div>

      {/* Title & Author */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          overflow: 'hidden',
          textAlign: 'left',
        }}
      >
        <div
          lang={lang}
          style={{
            fontFamily: isHindi ? 'var(--font-serif-hi)' : 'var(--font-serif)',
            fontWeight: 600,
            fontSize: '15px',
            lineHeight: 1.4,
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {post.title}
        </div>
        <div
          style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            fontFamily: isHindi ? 'var(--font-serif-hi)' : 'var(--font-sans)',
            lineHeight: 1.4,
          }}
        >
          By {post.author?.name} • in {post.section || 'Essays'}
        </div>
      </div>

      {/* Language Badge */}
      <div>
        <span
          className="small-caps"
          style={{
            display: 'inline-block',
            padding: '2px 6px',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-1)',
            fontSize: '10px',
            fontWeight: 700,
            color: 'var(--accent)',
            backgroundColor: 'var(--bg-surface-elevated)',
            fontFamily: isHindi ? 'var(--font-serif-hi)' : 'var(--font-sans)',
            letterSpacing: isHindi ? 'normal' : '0.08em',
          }}
        >
          {langBadge}
        </span>
      </div>

      {/* Tags / Section */}
      <div style={{ display: 'flex', gap: '5px', overflow: 'hidden' }}>
        {(post.tags || []).slice(0, 2).map((tag) => (
          <Badge
            key={tag}
            variant="default"
            style={{
              fontSize: '10px',
              fontFamily: isHindi ? 'var(--font-serif-hi)' : 'var(--font-sans)',
            }}
          >
            #{tag}
          </Badge>
        ))}
      </div>

      {/* Date */}
      <div
        className="tabular-nums"
        style={{ color: 'var(--text-secondary)', fontSize: '11px', whiteSpace: 'nowrap' }}
      >
        {formatDate(post.publishedAt || post.date)}
      </div>

      {/* Read Time & Appreciations */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span
          className="tabular-nums"
          style={{ color: 'var(--text-muted)', fontSize: '11px', whiteSpace: 'nowrap' }}
        >
          {post.readTimeMinutes}m read
        </span>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: isAppreciated ? 'var(--accent)' : 'var(--text-secondary)',
            fontSize: '11px',
          }}
        >
          <Heart size={12} fill={isAppreciated ? 'currentColor' : 'none'} />
          <span className="tabular-nums">{post.appreciations || 0}</span>
        </div>
      </div>

      {/* Shelf Bookmark Action */}
      <div style={{ textAlign: 'right' }}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleReadingList(post.id);
          }}
          aria-label={isSavedOnShelf ? 'Remove from shelf' : 'Save to shelf'}
          title={isSavedOnShelf ? 'Remove from shelf' : 'Save to reading list shelf'}
          style={{
            padding: '4px',
            color: isSavedOnShelf ? 'var(--accent)' : 'var(--text-subtle)',
            borderRadius: 'var(--radius-1)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = isSavedOnShelf ? 'var(--accent)' : 'var(--text-subtle)')}
        >
          <Bookmark size={14} fill={isSavedOnShelf ? 'currentColor' : 'none'} />
        </button>
      </div>
    </motion.div>
  );
}
