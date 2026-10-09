import React from 'react';
import { useCommentsStore } from '../../store/commentsStore';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import { MessageSquare, Terminal } from 'lucide-react';

/**
 * CommentThread — STACKTRACE Peer Review & Technical Discussion Thread
 * Allows engineers to contribute architecture review notes and reply inline.
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
      aria-label="Peer review and technical discussions"
      style={{
        marginTop: '3.5rem',
        paddingTop: '2rem',
        borderTop: '2px solid var(--border-default)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={14} style={{ color: 'var(--accent)' }} />
          <h3
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              margin: 0,
              color: 'var(--text-primary)',
            }}
          >
            PEER ARCHITECTURE REVIEW ({notes.length})
          </h3>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--text-muted)',
          }}
        >
          [STORE: LOCAL_V4 // SYNCHRONOUS]
        </span>
      </div>

      {/* Main Review Form */}
      <div style={{ marginBottom: '2rem' }}>
        <CommentForm onSubmit={handleAddNote} />
      </div>

      {/* Notes List */}
      <div>
        {notes.length === 0 ? (
          <div
            style={{
              padding: '36px 20px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-surface)',
              border: '1px dashed var(--border-default)',
              borderRadius: 0,
              color: 'var(--text-muted)',
              fontSize: '13px',
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.6,
            }}
          >
            <div style={{ fontSize: '1.2rem', marginBottom: '6px', color: 'var(--accent)' }}>&gt;_</div>
            NO PEER REVIEWS LOGGED FOR THIS ENTRY. TRANSMIT FIRST TECHNICAL ASSESSMENT ABOVE.
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
