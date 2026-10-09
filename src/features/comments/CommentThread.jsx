import React from 'react';
import { useCommentsStore } from '../../store/commentsStore';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import { Feather, MessageSquare } from 'lucide-react';

/**
 * CommentThread — Marginal Notes & Scholarly Correspondence
 * Allows readers to inscribe persistent annotations and single-level replies on folios.
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
      aria-label="Marginal notes and correspondence"
      style={{
        marginTop: '3.5rem',
        paddingTop: '2.5rem',
        borderTop: '1px solid var(--border-default)',
        fontFamily: 'var(--font-serif)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="fleuron" style={{ fontSize: '1.2rem', color: 'var(--accent)' }}>❧</span>
          <h3
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              margin: 0,
              color: 'var(--text-primary)',
            }}
          >
            MARGINAL NOTES & CORRESPONDENCE ({notes.length})
          </h3>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
          }}
        >
          Preserved in client archive
        </span>
      </div>

      {/* Main Inscription Form */}
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
              border: '1px dashed var(--border-default)',
              borderRadius: 'var(--radius-1)',
              color: 'var(--text-muted)',
              fontSize: '14px',
              lineHeight: 1.6,
            }}
          >
            <div className="fleuron" style={{ fontSize: '1.4rem', marginBottom: '6px' }}>§</div>
            No reader has yet inscribed notes in this margin. Dip your pen above to leave the first scholarly annotation.
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
