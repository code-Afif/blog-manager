import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bookmark, Heart, ArrowUpRight } from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useSocialStore } from '../../store/socialStore';

const LANGUAGE_LABELS = {
  en: 'English',
  hi: 'हिन्दी',
  ur: 'اردو',
};

export function PostRow({
  post,
  index = 0,
  isSelected = false,
  onOpen,
}) {
  const navigate = useNavigate();
  const { readingListIds, toggleReadingList, appreciatedIds, toggleAppreciation } = useWorkspaceStore();
  const { isFollowing, toggleFollow } = useSocialStore();

  const isSaved = readingListIds.includes(post.id);
  const isAppreciated = appreciatedIds.includes(post.id);
  const authorHandle = post.author?.handle || (post.author?.name ? post.author.name.toLowerCase().replace(/\s+/g, '-') : 'writer');
  const isAuthorFollowed = isFollowing(authorHandle);

  const langCode = post.language || 'en';
  const langLabel = LANGUAGE_LABELS[langCode] || 'English';

  const handleToggleSave = (e) => {
    e.stopPropagation();
    toggleReadingList(post.id);
  };

  const handleToggleAppreciate = (e) => {
    e.stopPropagation();
    toggleAppreciation(post.id);
  };

  const handleAuthorClick = (e) => {
    e.stopPropagation();
    navigate(`/writer/${authorHandle}`);
  };

  const handleToggleFollow = (e) => {
    e.stopPropagation();
    toggleFollow(authorHandle);
  };

  const formattedNumber = `№ ${String(post.essayNumber || post.number || index + 1).padStart(2, '0')}`;

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
      className="essay-row"
    >
      {/* Top Meta Line: Number, Section, Language Label, Reading Time, Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px',
          fontFamily: 'var(--font-sans)',
          fontSize: '11px',
          color: 'var(--text-muted)',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--accent)',
              letterSpacing: '0.04em',
            }}
          >
            {formattedNumber}
          </span>
          <span>·</span>
          <span style={{ color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {post.section || post.category || 'Essays'}
          </span>
          <span>·</span>
          <span
            style={{
              padding: '1px 6px',
              border: '1px solid var(--border-subtle)',
              fontSize: '10px',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              letterSpacing: '0.03em',
            }}
          >
            {langLabel}
          </span>
          <span>·</span>
          <span>{post.readTimeMinutes || 8} min read</span>
        </div>

        {/* Right Actions: Appreciate & Save */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            type="button"
            onClick={handleToggleAppreciate}
            title={isAppreciated ? 'Appreciated' : 'Appreciate essay'}
            style={{
              background: 'none',
              border: 'none',
              padding: '2px 4px',
              color: isAppreciated ? 'var(--accent)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              transition: 'color var(--duration-fast)',
            }}
          >
            <Heart size={14} fill={isAppreciated ? 'currentColor' : 'none'} />
            <span>{post.appreciations || 0}</span>
          </button>

          <button
            type="button"
            onClick={handleToggleSave}
            title={isSaved ? 'Remove from Reading List' : 'Save to Reading List'}
            style={{
              background: 'none',
              border: 'none',
              padding: '2px',
              color: isSaved ? 'var(--accent)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'color var(--duration-fast)',
            }}
          >
            <Bookmark size={15} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Title */}
      <h4
        dir="auto"
        style={{
          fontFamily: langCode === 'hi' ? 'var(--font-hindi)' : langCode === 'ur' ? 'var(--font-urdu)' : 'var(--font-display)',
          fontSize: '1.55rem',
          lineHeight: langCode === 'ur' ? 1.7 : 1.3,
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

      {/* Dek / Subtitle */}
      {post.dek && (
        <p
          dir="auto"
          style={{
            fontFamily: langCode === 'hi' ? 'var(--font-hindi)' : langCode === 'ur' ? 'var(--font-urdu)' : 'var(--font-serif)',
            fontSize: '1.02rem',
            lineHeight: langCode === 'ur' ? 1.7 : 1.6,
            color: 'var(--text-secondary)',
            margin: '0 0 14px',
          }}
        >
          {post.dek}
        </p>
      )}

      {/* Bottom Footer: Author byline with Follow chip and Read link */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-sans)',
          fontSize: '12px',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--text-muted)' }}>By</span>
          <button
            type="button"
            onClick={handleAuthorClick}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              fontWeight: 600,
              color: 'var(--text-primary)',
              cursor: 'pointer',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
            }}
          >
            {post.author?.name || 'Author'}
          </button>

          <button
            type="button"
            onClick={handleToggleFollow}
            style={{
              background: isAuthorFollowed ? 'var(--bg-surface-elevated)' : 'transparent',
              border: '1px solid var(--border-default)',
              padding: '1px 8px',
              fontFamily: 'var(--font-sans)',
              fontSize: '10px',
              color: isAuthorFollowed ? 'var(--text-secondary)' : 'var(--accent)',
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.04em',
            }}
          >
            {isAuthorFollowed ? 'Following' : '+ Follow'}
          </button>
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
          Read <ArrowUpRight size={13} />
        </span>
      </div>
    </article>
  );
}
