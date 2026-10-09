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
        marginBottom: isNested ? '8px' : '12px',
        backgroundColor: isNested ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-1)',
        overflow: 'hidden',
      }}
    >
      {/* Header bar (PR review thread style) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 10px',
          backgroundColor: isNested ? 'var(--bg-surface)' : 'var(--bg-surface-elevated)',
          borderBottom: '1px solid var(--border-subtle)',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Avatar square */}
          <div
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: 'var(--code-gutter)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '10px',
              lineHeight: 1,
            }}
          >
            {comment.avatar || comment.author?.slice(0, 2).toUpperCase() || 'AN'}
          </div>

          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            @{comment.author}
          </span>

          <span className="tabular-nums" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
            {formatRelativeTime(comment.createdAt)}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {canReply && !isNested && (
            <button
              type="button"
              onClick={() => setShowReplyForm(!showReplyForm)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 6px',
                fontSize: '10px',
                color: 'var(--text-muted)',
                borderRadius: 'var(--radius-1)',
                border: '1px solid transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
              title="Reply"
            >
              <Reply size={11} />
              <span>REPLY</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete(comment.id)}
            style={{
              padding: '2px 4px',
              color: 'var(--text-muted)',
              borderRadius: 'var(--radius-1)',
              border: '1px solid transparent',
              display: 'flex',
              alignItems: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--danger)';
              e.currentTarget.style.borderColor = 'var(--danger-border)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.borderColor = 'transparent';
            }}
            title="Delete comment"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          padding: '10px 12px',
          fontFamily: 'var(--font-sans)',
          fontSize: '13px',
          color: 'var(--text-primary)',
          lineHeight: 1.55,
          whiteSpace: 'pre-wrap',
        }}
      >
        {comment.content}
      </div>

      {/* Nested Replies (1 level deep) */}
      {comment.replies && comment.replies.length > 0 && (
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            padding: '8px 10px 4px 20px',
            backgroundColor: 'var(--bg-canvas)',
          }}
        >
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

      {/* Reply input form */}
      {showReplyForm && (
        <div
          style={{
            padding: '8px 12px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-canvas)',
          }}
        >
          <CommentForm
            isReply={true}
            placeholder={`Reply to @${comment.author}...`}
            onSubmit={handleReplySubmit}
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}
    </div>
  );
}
