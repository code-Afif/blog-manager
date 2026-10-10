import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { notesService } from '../../lib/notesService';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useSocialStore } from '../../store/socialStore';
import { formatRelativeTime } from '../../lib/utils';
import {
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  Trash2,
  Edit2,
  Send,
  Check,
} from 'lucide-react';

export function NotesFeed({ followingOnly = false }) {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const {
    openNotesComposer,
    language,
    essaysVersion,
    incrementEssaysVersion,
  } = useWorkspaceStore();
  const { profile, isFollowing } = useSocialStore();

  const [notes, setNotes] = useState([]);
  const [activeReplyNoteId, setActiveReplyNoteId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [copiedNoteId, setCopiedNoteId] = useState(null);

  // Load notes
  useEffect(() => {
    notesService.getAll().then(setNotes);
  }, [essaysVersion]);

  // Filtering
  const filteredNotes = notes.filter((note) => {
    // Language filter
    if (language !== 'all' && note.language !== language) {
      return false;
    }

    // Following filter
    if (followingOnly) {
      const isSelf = note.author?.handle === profile.handle;
      const followed = isFollowing(note.author?.handle);
      if (!isSelf && !followed) return false;
    }

    // Search query
    if (queryParam) {
      const q = queryParam.toLowerCase();
      const contentMatch = (note.content || '').toLowerCase().includes(q);
      const authorMatch = (note.author?.name || '').toLowerCase().includes(q);
      if (!contentMatch && !authorMatch) return false;
    }

    return true;
  });

  const handleToggleAppreciate = (noteId) => {
    notesService.toggleAppreciation(noteId);
    incrementEssaysVersion();
  };

  const handleToggleSave = (noteId) => {
    notesService.toggleSave(noteId);
    incrementEssaysVersion();
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Delete this note? This cannot be undone.')) {
      await notesService.delete(noteId);
      incrementEssaysVersion();
    }
  };

  const handleEditNote = (note) => {
    openNotesComposer(note);
  };

  const handleCopyLink = (noteId) => {
    const url = `${window.location.origin}/?note=${noteId}`;
    navigator.clipboard.writeText(url);
    setCopiedNoteId(noteId);
    setTimeout(() => setCopiedNoteId(null), 2000);
  };

  const handleSubmitReply = async (noteId) => {
    if (!replyText.trim()) return;
    await notesService.addReply(noteId, {
      author: {
        name: profile.name,
        handle: profile.handle,
        initials: profile.initials,
      },
      content: replyText.trim(),
    });
    setReplyText('');
    setActiveReplyNoteId(null);
    incrementEssaysVersion();
  };

  return (
    <div style={{ width: '100%', maxWidth: '680px', margin: '0 auto' }}>
      {/* 1. Quick Composer Box: "What's on your mind?" */}
      <div
        onClick={() => openNotesComposer()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '16px 18px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: '12px',
          marginBottom: '28px',
          cursor: 'pointer',
          transition: 'border-color var(--duration-fast)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--text-primary)')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-default)')}
      >
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent)',
            color: 'var(--accent-fg, #FFFFFF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-display)',
            fontSize: '13px',
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {profile.initials || 'JV'}
        </div>
        <div
          style={{
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-serif)',
            fontSize: '15px',
            fontStyle: 'italic',
            userSelect: 'none',
          }}
        >
          What’s on your mind? A reflection, observation, or thought...
        </div>
      </div>

      {/* 2. Notes Stream */}
      {filteredNotes.length === 0 ? (
        <div
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: '18px',
              color: 'var(--text-primary)',
              marginBottom: '6px',
            }}
          >
            No notes found.
          </div>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '14px',
              color: 'var(--text-muted)',
              margin: '0 0 16px',
            }}
          >
            {followingOnly
              ? 'Writers you follow have not posted any notes in this selection.'
              : 'Be the first to leave a reflection on this page.'}
          </p>
          <button
            type="button"
            onClick={() => openNotesComposer()}
            className="button-create"
            style={{ padding: '8px 16px', fontSize: '12px' }}
          >
            Write a Note
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredNotes.map((note) => {
            const isAuthor = note.author?.handle === profile.handle || note.author?.name === profile.name;
            const isSaved = notesService.isNoteSaved(note.id);
            const isAppreciated = notesService.isNoteAppreciated(note.id);
            const replyList = Array.isArray(note.replies) ? note.replies : [];

            return (
              <article
                key={note.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  borderRadius: '12px',
                  padding: '20px 22px',
                  boxSizing: 'border-box',
                }}
              >
                {/* Note Author Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                  }}
                >
                  <Link
                    to={`/writer/${note.author?.handle || 'contributor'}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-default)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-display)',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--accent)',
                      }}
                    >
                      {note.author?.initials || 'W'}
                    </div>
                    <div>
                      <span
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '13px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {note.author?.name}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          color: 'var(--text-muted)',
                          marginLeft: '8px',
                        }}
                      >
                        {formatRelativeTime(note.publishedAt)}
                      </span>
                    </div>
                  </Link>

                  {/* Author Edit / Delete actions */}
                  {isAuthor && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => handleEditNote(note)}
                        title="Edit note"
                        style={{
                          padding: '4px',
                          color: 'var(--text-muted)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteNote(note.id)}
                        title="Delete note"
                        style={{
                          padding: '4px',
                          color: 'var(--danger)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Note Content Text */}
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.125rem',
                    lineHeight: 1.7,
                    color: 'var(--text-primary)',
                    marginBottom: '16px',
                    textAlign: 'left',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {note.content}
                </div>

                {/* Optional Image attachment */}
                {note.image && (
                  <div style={{ marginBottom: '16px' }}>
                    <img
                      src={note.image}
                      alt="Note attachment"
                      style={{
                        maxHeight: '260px',
                        width: '100%',
                        objectFit: 'cover',
                        border: '1px solid var(--border-default)',
                      }}
                    />
                  </div>
                )}

                {/* Bottom Action Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    paddingTop: '10px',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '12px',
                    fontFamily: 'var(--font-sans)',
                    color: 'var(--text-muted)',
                  }}
                >
                  {/* Appreciate button */}
                  <button
                    type="button"
                    onClick={() => handleToggleAppreciate(note.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'none',
                      border: 'none',
                      color: isAppreciated ? 'var(--accent)' : 'inherit',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    <Heart
                      size={15}
                      fill={isAppreciated ? 'currentColor' : 'none'}
                    />
                    <span>{note.appreciations || 0}</span>
                  </button>

                  {/* Reply button */}
                  <button
                    type="button"
                    onClick={() =>
                      setActiveReplyNoteId(activeReplyNoteId === note.id ? null : note.id)
                    }
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'none',
                      border: 'none',
                      color: activeReplyNoteId === note.id ? 'var(--text-primary)' : 'inherit',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    <MessageSquare size={15} />
                    <span>{replyList.length}</span>
                  </button>

                  {/* Save button */}
                  <button
                    type="button"
                    onClick={() => handleToggleSave(note.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'none',
                      border: 'none',
                      color: isSaved ? 'var(--accent)' : 'inherit',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    <Bookmark
                      size={15}
                      fill={isSaved ? 'currentColor' : 'none'}
                    />
                    <span>{isSaved ? 'Saved' : 'Save'}</span>
                  </button>

                  {/* Share button */}
                  <button
                    type="button"
                    onClick={() => handleCopyLink(note.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'none',
                      border: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      padding: 0,
                      marginLeft: 'auto',
                    }}
                    title="Copy note link"
                  >
                    {copiedNoteId === note.id ? (
                      <>
                        <Check size={14} style={{ color: 'var(--accent)' }} />
                        <span style={{ fontSize: '11px', color: 'var(--accent)' }}>Copied</span>
                      </>
                    ) : (
                      <Share2 size={14} />
                    )}
                  </button>
                </div>

                {/* 1-Level Deep Replies Section */}
                {(replyList.length > 0 || activeReplyNoteId === note.id) && (
                  <div
                    style={{
                      marginTop: '14px',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    {replyList.map((rep) => (
                      <div
                        key={rep.id}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          padding: '8px 10px',
                          backgroundColor: 'var(--bg-surface-elevated)',
                          borderRadius: '8px',
                          fontSize: '13px',
                        }}
                      >
                        <div
                          style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--bg-canvas)',
                            border: '1px solid var(--border-default)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            fontWeight: 600,
                            color: 'var(--accent)',
                            flexShrink: 0,
                          }}
                        >
                          {rep.author?.initials || 'R'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 600, fontSize: '12px', fontFamily: 'var(--font-sans)' }}>
                              {rep.author?.name}
                            </span>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                              {formatRelativeTime(rep.publishedAt)}
                            </span>
                          </div>
                          <div
                            dir="auto"
                            style={{
                              fontFamily: 'var(--font-serif)',
                              color: 'var(--text-secondary)',
                              marginTop: '2px',
                            }}
                          >
                            {rep.content}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Inline Reply Composer */}
                    {activeReplyNoteId === note.id && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginTop: '6px',
                        }}
                      >
                        <input
                          type="text"
                          dir="auto"
                          placeholder="Write a reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSubmitReply(note.id);
                          }}
                          style={{
                            flex: 1,
                            padding: '6px 10px',
                            border: '1px solid var(--border-default)',
                            borderRadius: '8px',
                            backgroundColor: 'var(--bg-input)',
                            color: 'var(--text-primary)',
                            fontSize: '13px',
                            outline: 'none',
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleSubmitReply(note.id)}
                          disabled={!replyText.trim()}
                          className="button-create"
                          style={{
                            padding: '6px 12px',
                            fontSize: '12px',
                            opacity: !replyText.trim() ? 0.4 : 1,
                          }}
                        >
                          <Send size={12} />
                          <span>Reply</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
