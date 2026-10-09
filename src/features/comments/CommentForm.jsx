import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Feather } from 'lucide-react';

export function CommentForm({
  onSubmit,
  onCancel,
  isReply = false,
  placeholder = 'Inscribe a marginal note or inquiry on this discourse...',
}) {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const user = author.trim() || 'Scholarly Reader';
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
        padding: '12px 14px',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="text"
          value={author}
          dir="auto"
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name or monogram (optional)"
          style={{
            flex: '0 0 200px',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-1)',
            padding: '5px 8px',
            fontSize: '12px',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)',
          }}
        />
        <span
          style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
            fontFamily: 'var(--font-serif)',
          }}
        >
          {isReply ? 'Responding to note' : 'Inscribing in the margin'}
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
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-1)',
          padding: '8px 10px',
          fontSize: '13px',
          fontFamily: 'var(--font-serif)',
          color: 'var(--text-primary)',
          resize: 'vertical',
          lineHeight: 1.8,
          boxSizing: 'border-box',
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '2px' }}>
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            DISMISS
          </Button>
        )}
        <Button type="submit" variant="primary" size="sm" disabled={!content.trim()}>
          <Feather size={11} />
          <span>{isReply ? 'REPLY' : 'INSCRIBE NOTE'}</span>
        </Button>
      </div>
    </form>
  );
}
