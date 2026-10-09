import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Bookmark } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import { useWorkspaceStore } from '../../store/workspaceStore';

export function PostCard({ post, index = 0, onOpen }) {
  const { appreciatedIds, readingListIds, toggleReadingList } = useWorkspaceStore();
  const isAppreciated = appreciatedIds.includes(post.id);
  const isSavedOnShelf = readingListIds.includes(post.id);

  const lang = post.language || 'en';
  const isUrdu = lang === 'ur';
  const isHindi = lang === 'hi';
  const langBadge = isUrdu ? 'اردو' : isHindi ? 'हिं' : 'EN';

  return (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.16, delay: index * 0.025, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onOpen?.(post)}
      lang={lang}
      dir={isUrdu ? 'rtl' : 'ltr'}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '18px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-1)',
        cursor: 'pointer',
        boxShadow: 'none',
        transition: 'border-color var(--duration-calm), background-color var(--duration-calm)',
        textAlign: isUrdu ? 'right' : 'left',
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
        {/* Folio Header: Essay №, Section, and Language Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px',
            fontSize: '11px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 700,
                color: 'var(--accent)',
              }}
            >
              № {String(post.number || post.essayNumber || index + 1).padStart(2, '0')}
            </span>
            <span>•</span>
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              {post.section || 'Essays'}
            </span>
            <span>•</span>
            <span
              className="small-caps"
              style={{
                padding: '1px 5px',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-1)',
                fontSize: '9px',
                fontWeight: 700,
                color: 'var(--accent)',
                backgroundColor: 'var(--bg-canvas)',
                fontFamily: isUrdu ? 'var(--font-serif-ur)' : isHindi ? 'var(--font-serif-hi)' : 'var(--font-sans)',
              }}
            >
              {langBadge}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleReadingList(post.id);
            }}
            aria-label={isSavedOnShelf ? 'Remove from shelf' : 'Save to shelf'}
            style={{
              padding: '2px',
              color: isSavedOnShelf ? 'var(--accent)' : 'var(--text-subtle)',
            }}
          >
            <Bookmark size={14} fill={isSavedOnShelf ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Title */}
        <h3
          lang={lang}
          style={{
            fontFamily: isUrdu ? 'var(--font-serif-ur)' : isHindi ? 'var(--font-serif-hi)' : 'var(--font-serif)',
            fontSize: isUrdu ? '1.35rem' : '1.25rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '8px',
            lineHeight: isUrdu ? 2.1 : isHindi ? 1.5 : 1.3,
          }}
        >
          {post.title}
        </h3>

        {/* Author Byline */}
        <div
          style={{
            fontFamily: isUrdu ? 'var(--font-serif-ur)' : isHindi ? 'var(--font-serif-hi)' : 'var(--font-sans)',
            fontSize: '12px',
            color: 'var(--text-muted)',
            marginBottom: '10px',
            lineHeight: isUrdu ? 1.8 : 1.4,
          }}
        >
          By {post.author?.name}
        </div>

        {/* Excerpt or Dek */}
        <p
          lang={lang}
          style={{
            fontFamily: isUrdu ? 'var(--font-serif-ur)' : isHindi ? 'var(--font-serif-hi)' : 'var(--font-serif)',
            fontSize: isUrdu ? '13px' : '14px',
            color: 'var(--text-secondary)',
            lineHeight: isUrdu ? 2.2 : isHindi ? 1.8 : 1.6,
            marginBottom: '16px',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.dek || post.excerpt}
        </p>
      </div>

      {/* Footer */}
      <div>
        {/* Section Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
          {(post.tags || []).slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="default"
              style={{
                fontSize: '10px',
                fontFamily: isUrdu ? 'var(--font-serif-ur)' : isHindi ? 'var(--font-serif-hi)' : 'var(--font-sans)',
              }}
            >
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Hairline Divider & Metas */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '10px',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="tabular-nums">{formatDate(post.publishedAt || post.date)}</span>
            <span>•</span>
            <span className="tabular-nums">{post.readTimeMinutes} min</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: isAppreciated ? 'var(--accent)' : 'var(--text-secondary)',
            }}
          >
            <Heart size={12} fill={isAppreciated ? 'currentColor' : 'none'} />
            <span className="tabular-nums">{post.appreciations || 0}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
