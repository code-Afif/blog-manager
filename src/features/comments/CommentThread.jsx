import React from 'react';
import { useCommentsStore } from '../../store/commentsStore';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import { Feather } from 'lucide-react';

/**
 * CommentThread — Marginal Notes & Reader Reflections
 * Literary marginal reflections with one level deep replies.
 */
export function CommentThread({ postSlug }) {
  const { getNotes, addNote, addReply, deleteNote } = useCommentsStore();
  const notes = getNotes(postSlug);

  const handleAddNote = (data) => {
    addNote(postSlug, data);
  };

  const handleReply = (parentId, data) => {
    addReply(postSlug, parentId, data);
  };

  const handleDelete = (noteId) => {
    deleteNote(postSlug, noteId);
  };

  return (
    <section
      aria-label="Marginal notes and reader reflections"
      style={{
        marginTop: '3.5rem',
        paddingTop: '2rem',
        borderTop: '1px solid var(--border-default)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Feather size={15} style={{ color: 'var(--accent)' }} />
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.35rem',
              fontWeight: 400,
              margin: 0,
              color: 'var(--text-primary)',
            }}
          >
            Marginal Notes ({notes.length})
          </h3>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '13px',
            fontStyle: 'italic',
            color: 'var(--text-muted)',
          }}
        >
          Reader commentary &amp; marginalia
        </span>
      </div>

      {/* Main Form */}
      <div style={{ marginBottom: '2rem' }}>
        <CommentForm onSubmit={handleAddNote} />
      </div>

      {/* Notes List */}
      <div>
        {notes.length === 0 ? (
          <div
            style={{
              padding: '32px 20px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-muted)',
              fontSize: '14px',
              fontFamily: 'var(--font-serif)',
              lineHeight: 1.6,
            }}
          >
            <div style={{ fontStyle: 'italic', color: 'var(--accent)', marginBottom: '4px' }}>* * *</div>
            No marginal notes on this piece yet. Leave the first reflection above.
          </div>
        ) : (
          notes.map((note) => (
            <CommentItem
              key={note.id}
              comment={note}
              onReply={handleReply}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </section>
  );
}
