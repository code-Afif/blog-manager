import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../../lib/postService';
import { notesService } from '../../lib/notesService';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useSocialStore } from '../../store/socialStore';
import { useAuthStore } from '../../store/authStore';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { EmptyDeskState } from '../search/EmptySearchState';
import { formatDate } from '../../lib/utils';
import { Plus, Edit2, Trash2, ArrowUpRight, FileText, MessageSquare } from 'lucide-react';

export function MyPostsManager() {
  const navigate = useNavigate();
  const { openTab, openNotesComposer, essaysVersion, incrementEssaysVersion } = useWorkspaceStore();
  const { profile } = useSocialStore();
  const { user, isAuthenticated, openAuthModal } = useAuthStore();

  const [activeTab, setActiveTab] = useState('essays'); // 'essays' | 'notes'
  const [essayFilter, setEssayFilter] = useState('all'); // 'all' | 'published' | 'draft'

  const [essays, setEssays] = useState([]);
  const [notes, setNotes] = useState([]);
  const [noteDrafts, setNoteDrafts] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, title, type: 'essay'|'note' }
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      postService.getAll(true),
      notesService.getAll(),
    ]).then(([allPosts, allNotes]) => {
      const currentId = user?.id;
      const currentHandle = (user?.handle || profile?.handle || '').toLowerCase();
      const currentName = (user?.name || profile?.name || '').toLowerCase();

      // Only show essays written by the current user
      const myEssays = allPosts.filter((p) => {
        if (currentId && p.author?.id && p.author.id === currentId) return true;
        const authorHandle = (p.author?.handle || '').toLowerCase();
        const authorName = (p.author?.name || '').toLowerCase();
        if (currentHandle && authorHandle && authorHandle === currentHandle) return true;
        if (currentName && authorName && authorName === currentName) return true;
        return false;
      });

      // Filter notes authored by user
      const myNotes = allNotes.filter((n) => {
        if (currentId && n.author?.id && n.author.id === currentId) return true;
        const authorHandle = (n.author?.handle || '').toLowerCase();
        const authorName = (n.author?.name || '').toLowerCase();
        if (currentHandle && authorHandle && authorHandle === currentHandle) return true;
        if (currentName && authorName && authorName === currentName) return true;
        return false;
      });

      setEssays(myEssays);
      setNotes(myNotes);
      setNoteDrafts(notesService.getDrafts());
      setIsLoading(false);
    });
  }, [essaysVersion, profile, user]);

  const filteredEssays = essays.filter((p) => {
    if (essayFilter === 'all') return true;
    return (p.status || 'published') === essayFilter;
  });

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'note') {
      await notesService.delete(deleteTarget.id);
    } else {
      await postService.delete(deleteTarget.id);
    }
    setDeleteTarget(null);
    incrementEssaysVersion();
  };

  const handleCreateNewEssay = () => {
    if (!isAuthenticated) {
      openAuthModal('signin', () => navigate('/write'));
      return;
    }
    navigate('/write');
  };

  const handleEditEssay = (post) => {
    if (!isAuthenticated) {
      openAuthModal('signin', () => {
        openTab({
          id: `edit-${post.id}`,
          slug: post.slug,
          title: `Edit: ${post.title.slice(0, 20)}...`,
          type: 'editor',
        });
        navigate(`/write/${post.id}`);
      });
      return;
    }

    openTab({
      id: `edit-${post.id}`,
      slug: post.slug,
      title: `Edit: ${post.title.slice(0, 20)}...`,
      type: 'editor',
    });
    navigate(`/write/${post.id}`);
  };

  const handleEditNote = (note) => {
    openNotesComposer(note);
  };

  const handleDeleteNotePrompt = (note) => {
    setDeleteTarget({
      id: note.id,
      title: note.content.slice(0, 36) + '...',
      type: 'note',
    });
  };

  return (
    <div
      style={{
        maxWidth: '780px',
        margin: '0 auto',
        width: '100%',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <div>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--accent)',
              fontWeight: 600,
              display: 'block',
              marginBottom: '4px',
            }}
          >
            Author’s Desk
          </span>
          <h2
            style={{
              fontSize: '1.85rem',
              fontWeight: 400,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
              margin: 0,
            }}
          >
            My Desk
          </h2>
        </div>

        <button
          type="button"
          onClick={activeTab === 'notes' ? () => openNotesComposer() : handleCreateNewEssay}
          className="button-create"
          style={{ padding: '8px 16px', fontSize: '12px' }}
        >
          <Plus size={14} />
          <span>{activeTab === 'notes' ? 'New Note' : 'New Essay'}</span>
        </button>
      </div>

      {/* Main Tabs: Essays vs Notes */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          borderBottom: '1px solid var(--border-default)',
          marginBottom: '24px',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('essays')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px 4px',
            fontFamily: 'var(--font-display)',
            fontSize: '1.15rem',
            fontWeight: activeTab === 'essays' ? 600 : 400,
            color: activeTab === 'essays' ? 'var(--text-primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'essays' ? '2px solid var(--accent)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Essays ({essays.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notes')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px 4px',
            fontFamily: 'var(--font-display)',
            fontSize: '1.15rem',
            fontWeight: activeTab === 'notes' ? 600 : 400,
            color: activeTab === 'notes' ? 'var(--text-primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'notes' ? '2px solid var(--accent)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Notes ({notes.length + noteDrafts.length})
        </button>
      </div>

      {/* ESSAYS VIEW */}
      {activeTab === 'essays' && (
        <div>
          {/* Subfilter Pills: All, Published, Drafts */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            {[
              { key: 'all', label: `All (${essays.length})` },
              { key: 'published', label: `Published (${essays.filter((p) => (p.status || 'published') === 'published').length})` },
              { key: 'draft', label: `Drafts (${essays.filter((p) => p.status === 'draft').length})` },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setEssayFilter(key)}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '11px',
                  fontWeight: 500,
                  padding: '4px 12px',
                  border: '1px solid var(--border-default)',
                  borderRadius: '9999px',
                  backgroundColor: essayFilter === key ? 'var(--accent)' : 'transparent',
                  color: essayFilter === key ? 'var(--accent-fg, #FFFFFF)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  letterSpacing: '0.02em',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {filteredEssays.length === 0 ? (
            <EmptyDeskState onWrite={handleCreateNewEssay} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filteredEssays.map((post) => {
                const isDraft = post.status === 'draft';

                return (
                  <div
                    key={post.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '18px 0',
                      borderBottom: '1px solid var(--border-subtle)',
                      gap: '16px',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span
                          style={{
                            fontSize: '10px',
                            padding: '1px 6px',
                            border: '1px solid var(--border-default)',
                            borderRadius: '4px',
                            color: isDraft ? 'var(--text-muted)' : 'var(--accent)',
                            fontWeight: 600,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                          }}
                        >
                          {isDraft ? 'Draft' : 'Published'}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {formatDate(post.publishedAt || post.updatedAt)}
                        </span>
                      </div>

                      <h4
                        onClick={() => handleEditEssay(post)}
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.25rem',
                          color: 'var(--text-primary)',
                          margin: 0,
                          fontWeight: 400,
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                      >
                        {post.title || 'Untitled Essay'}
                      </h4>
                    </div>

                    {/* Quiet Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button
                        type="button"
                        onClick={() => handleEditEssay(post)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-secondary)',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget({
                            id: post.id,
                            title: post.title,
                            type: 'essay',
                          })
                        }
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* NOTES VIEW */}
      {activeTab === 'notes' && (
        <div>
          {notes.length === 0 && noteDrafts.length === 0 ? (
            <div
              style={{
                padding: '48px 24px',
                textAlign: 'center',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: '12px',
              }}
            >
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', margin: '0 0 8px', fontWeight: 400 }}>
                You have not written any notes yet.
              </h4>
              <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-muted)', fontSize: '14px', margin: '0 0 16px' }}>
                Share a short reflection, citation, or observation on literature.
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
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Drafts Section */}
              {noteDrafts.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <div
                    style={{
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--accent)',
                      fontWeight: 600,
                      marginBottom: '10px',
                    }}
                  >
                    Note Drafts ({noteDrafts.length})
                  </div>
                  {noteDrafts.map((draft) => (
                    <div
                      key={draft.id}
                      style={{
                        padding: '14px',
                        backgroundColor: 'var(--bg-surface-elevated)',
                        border: '1px dashed var(--border-default)',
                        borderRadius: '10px',
                        marginBottom: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>
                          {draft.content.slice(0, 90)}...
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Saved draft · {formatDate(draft.updatedAt || draft.createdAt)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => openNotesComposer(draft)}
                        className="button-create"
                        style={{ padding: '4px 10px', fontSize: '11px' }}
                      >
                        Resume
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Published Notes */}
              {notes.map((note) => {
                return (
                  <div
                    key={note.id}
                    style={{
                      padding: '18px 0',
                      borderBottom: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '16px',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {formatDate(note.publishedAt)}
                        </span>
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '1.05rem',
                          lineHeight: 1.6,
                          color: 'var(--text-primary)',
                        }}
                      >
                        {note.content}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => handleEditNote(note)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-secondary)',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteNotePrompt(note)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Polite Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        postTitle={deleteTarget?.title}
        itemType={deleteTarget?.type || 'essay'}
      />
    </div>
  );
}

export default MyPostsManager;
