import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { CornerDownRight } from 'lucide-react';

export function CommentForm({ onSubmit, onCancel, isReply = false, placeholder = 'Leave a review comment (markdown supported)...' }) {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const user = author.trim() || 'engineer_' + Math.floor(Math.random() * 899 + 100);
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
        gap: '8px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-1)',
        padding: '10px 12px',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="your_handle (optional)"
          style={{
            flex: '0 0 160px',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-1)',
            padding: '4px 8px',
            fontSize: '11px',
            color: 'var(--text-primary)',
          }}
        />
        <span style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>
          {isReply ? 'REPLYING TO THREAD' : 'NEW REVIEW THREAD'}
        </span>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={isReply ? 2 : 3}
        style={{
          width: '100%',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-1)',
          padding: '8px 10px',
          fontSize: '12px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-primary)',
          resize: 'vertical',
          lineHeight: 1.45,
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            CANCEL
          </Button>
        )}
        <Button type="submit" variant="primary" size="sm" disabled={!content.trim()}>
          {isReply ? 'REPLY' : 'COMMENT'}
        </Button>
      </div>
    </form>
  );
}
