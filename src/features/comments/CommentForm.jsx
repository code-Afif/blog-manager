import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Send, CornerDownRight } from 'lucide-react';

export function CommentForm({
  onSubmit,
  onCancel,
  isReply = false,
  placeholder = 'Transmit technical observation, benchmark critique, or implementation inquiry...',
}) {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const user = author.trim() || 'Staff Engineer';
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
        borderRadius: 0,
        padding: '14px 16px',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="text"
          value={author}
          dir="auto"
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Callsign / Handle (e.g. @alicia_dev)"
          style={{
            flex: '0 0 240px',
            backgroundColor: 'var(--bg-canvas)',
            border: '1px solid var(--border-default)',
            borderRadius: 0,
            padding: '6px 10px',
            fontSize: '11px',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
          }}
        />
        <span
          style={{
            fontSize: '10px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {isReply ? '[INLINE_RESPONSE]' : '[THREAD_TRANSMISSION]'}
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
          borderRadius: 0,
          padding: '10px 12px',
          fontSize: '13px',
          fontFamily: 'var(--font-sans)',
          color: 'var(--text-primary)',
          resize: 'vertical',
          lineHeight: 1.6,
          boxSizing: 'border-box',
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '2px' }}>
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel} style={{ borderRadius: 0 }}>
            ABORT
          </Button>
        )}
        <Button type="submit" variant="primary" size="sm" disabled={!content.trim()} style={{ borderRadius: 0 }}>
          <Send size={11} />
          <span>{isReply ? 'POST REPLY' : 'TRANSMIT REVIEW'}</span>
        </Button>
      </div>
    </form>
  );
}
