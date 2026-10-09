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
        borderRadius: 0,
        overflow: 'hidden',
        boxShadow: isNested ? 'none' : '2px 2px 0px 0px rgba(0,0,0,0.1)',
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          backgroundColor: isNested ? 'var(--bg-surface)' : 'var(--bg-surface-elevated)',
          borderBottom: '1px solid var(--border-subtle)',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Avatar initial badge */}
          <div
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: 'var(--text-primary)',
              color: 'var(--bg-canvas)',
              borderRadius: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '9px',
              lineHeight: 1,
            }}
          >
            {comment.avatar || comment.author?.slice(0, 2).toUpperCase() || 'ST'}
          </div>

          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
            {comment.author}
          </span>

          <span className="tabular-nums" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
            [{formatRelativeTime(comment.createdAt)}]
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {canReply && !isNested && (
            <button
              type="button"
              onClick={() => setShowReplyForm(!showReplyForm)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                fontSize: '10px',
                color: 'var(--text-secondary)',
                borderRadius: 0,
                border: '1px solid var(--border-default)',
                backgroundColor: 'transparent',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.borderColor = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderColor = 'var(--border-default)';
              }}
              title="Reply to comment"
            >
              <Reply size={10} />
              <span>REPLY</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete(comment.id)}
            aria-label="Delete note"
            title="Delete this note"
            style={{
              padding: '2px 6px',
              color: 'var(--text-subtle)',
              borderRadius: 0,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-subtle)')}
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        dir="auto"
        style={{
          padding: '12px 14px',
          fontFamily: 'var(--font-sans)',
          fontSize: '13.5px',
          lineHeight: 1.6,
          color: 'var(--text-primary)',
          wordBreak: 'break-word',
        }}
      >
        {comment.content}
      </div>

      {/* Nested Single-Level Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div
          style={{
            paddingLeft: '16px',
            paddingRight: '12px',
            paddingBottom: '8px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-canvas)',
          }}
        >
          <div
            style={{
              paddingTop: '8px',
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
              marginBottom: '6px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            INLINE RESPONSES ({comment.replies.length})
          </div>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onDelete={onDelete}
              canReply={false}
              isNested={true}
            />
          ))}
        </div>
      )}

      {/* Inline Reply Form */}
      {showReplyForm && (
        <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border-subtle)' }}>
          <CommentForm
            onSubmit={handleReplySubmit}
            onCancel={() => setShowReplyForm(false)}
            isReply={true}
            placeholder={`Reply to ${comment.author}...`}
          />
        </div>
      )}
    </div>
  );
}
