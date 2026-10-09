import React from 'react';
import { useCommentsStore } from '../../store/commentsStore';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import { GitPullRequest, MessageSquare } from 'lucide-react';

export function CommentThread({ postSlug }) {
  const { getComments, addComment, addReply, deleteComment } = useCommentsStore();
  const comments = getComments(postSlug);

  const handleAddComment = (data) => {
    addComment(postSlug, data);
  };

  const handleReply = (parentId, data) => {
    addReply(postSlug, parentId, data);
  };

  const handleDelete = (commentId) => {
    deleteComment(postSlug, commentId);
  };

  return (
    <section
      aria-label="Discussion thread"
      style={{
        marginTop: '3rem',
        paddingTop: '2rem',
        borderTop: '1px solid var(--border-default)',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GitPullRequest size={15} style={{ color: 'var(--accent)' }} />
          <h3
            style={{
              fontSize: '13px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: 0,
            }}
          >
            REVIEW THREADS ({comments.length})
          </h3>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          THREAD: {postSlug}.patch
        </span>
      </div>

      {/* Main Comment Form */}
      <div style={{ marginBottom: '1.5rem' }}>
        <CommentForm onSubmit={handleAddComment} />
      </div>

      {/* Comments List */}
      <div>
        {comments.length === 0 ? (
          <div
            style={{
              padding: '24px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-surface)',
              border: '1px dashed var(--border-default)',
              borderRadius: 'var(--radius-1)',
              color: 'var(--text-muted)',
              fontSize: '12px',
            }}
          >
            <MessageSquare size={16} style={{ margin: '0 auto 6px', display: 'block' }} />
            0 comments on this file. Start the first review thread above.
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </section>
  );
}
