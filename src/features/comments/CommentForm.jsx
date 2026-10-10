import React, { useState } from 'react';
import { Send } from 'lucide-react';

export function CommentForm({
  onSubmit,
  onCancel,
  isReply = false,
  placeholder = 'Add a marginal reflection or thought on this passage...',
}) {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const user = author.trim() || 'Reader';
    const avatar = user.slice(0, 2).toUpperCase();

    onSubmit({
      author: user,
      avatar,
      content: content.trim(),
    });

    setContent('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: '12px',
        padding: '16px',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          value={author}
          dir="auto"
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name"
          style={{
            flex: '0 0 200px',
            backgroundColor: 'var(--bg-canvas)',
            border: '1px solid var(--border-default)',
            borderRadius: '6px',
            padding: '6px 10px',
            fontSize: '12px',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)',
            outline: 'none',
          }}
        />
        <span
          style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
          }}
        >
          {isReply ? 'Reply to reader' : 'Leave a marginal note'}
        </span>
      </div>

      <textarea
        value={content}
        dir="auto"
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={isReply ? 2 : 3}
        style={{
          width: '100%',
          backgroundColor: 'var(--bg-canvas)',
          border: '1px solid var(--border-default)',
          borderRadius: '8px',
          padding: '10px 12px',
          fontSize: '14px',
          fontFamily: 'var(--font-serif)',
          color: 'var(--text-primary)',
          resize: 'vertical',
          lineHeight: 1.6,
          boxSizing: 'border-box',
          outline: 'none',
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              border: '1px solid var(--border-default)',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="button-create"
          disabled={!content.trim()}
          style={{
            padding: '6px 14px',
            fontSize: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            opacity: !content.trim() ? 0.4 : 1,
          }}
        >
          <Send size={12} />
          <span>{isReply ? 'Post Reply' : 'Leave Note'}</span>
        </button>
      </div>
    </form>
  );
}
