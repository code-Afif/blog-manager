import React, { useState } from 'react';
import { formatRelativeTime } from '../../lib/utils';
import { CommentForm } from './CommentForm';
import { Trash2, Reply } from 'lucide-react';

export function CommentItem({
  comment,
  onReply,
  onDelete,
  canReply = true,
  isNested = false,
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReplySubmit = (data) => {
    onReply(comment.id, data);
    setShowReplyForm(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginBottom: isNested ? '8px' : '14px',
        backgroundColor: isNested ? 'var(--bg-canvas)' : 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        overflow: 'hidden',
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 14px',
          backgroundColor: isNested ? 'var(--bg-surface)' : 'var(--bg-surface-elevated)',
          borderBottom: '1px solid var(--border-subtle)',
          fontFamily: 'var(--font-sans)',
          fontSize: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Avatar initial badge */}
          <div
            style={{
              width: '22px',
              height: '22px',
              backgroundColor: 'var(--accent)',
              color: 'var(--accent-fg, #FFFFFF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '10px',
              fontFamily: 'var(--font-display)',
            }}
          >
            {comment.avatar || comment.author?.slice(0, 2).toUpperCase() || 'R'}
          </div>

          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {comment.author}
          </span>

          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
            {formatRelativeTime(comment.createdAt)}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {canReply && !isNested && (
            <button
              type="button"
              onClick={() => setShowReplyForm(!showReplyForm)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                fontSize: '11px',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-default)',
                backgroundColor: 'transparent',
                cursor: 'pointer',
              }}
            >
              <Reply size={12} />
              <span>Reply</span>
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(comment.id)}
              style={{
                padding: '2px 6px',
                color: 'var(--text-muted)',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
              }}
              title="Delete note"
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Note Body */}
      <div
        dir="auto"
        style={{
          padding: '12px 14px',
          fontFamily: 'var(--font-serif)',
          fontSize: '14.5px',
          lineHeight: 1.6,
          color: 'var(--text-primary)',
          whiteSpace: 'pre-wrap',
        }}
      >
        {comment.content}
      </div>

      {/* Inline Reply Form */}
      {showReplyForm && (
        <div style={{ padding: '0 14px 14px' }}>
          <CommentForm
            isReply
            onSubmit={handleReplySubmit}
            onCancel={() => setShowReplyForm(false)}
            placeholder={`Reply to ${comment.author}...`}
          />
        </div>
      )}

      {/* Nested Replies (1 level deep) */}
      {comment.replies && comment.replies.length > 0 && (
        <div
          style={{
            padding: '8px 14px 12px',
            backgroundColor: 'var(--bg-canvas)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              isNested
              canReply={false}
              onDelete={onDelete ? () => onDelete(reply.id) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
