import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../../lib/postService';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { Button } from '../../components/ui/Button';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { EmptyDeskState } from '../search/EmptySearchState';
import { formatDate } from '../../lib/utils';
import { Plus, Edit2, Trash2, Eye, Terminal } from 'lucide-react';

/**
 * MyPostsManager — STACKTRACE Post Dispatch Desk
 * Manages drafts, revisions, and published technical posts in local storage.
 */
export function MyPostsManager() {
  const navigate = useNavigate();
  const { openTab, essaysVersion, incrementEssaysVersion } = useWorkspaceStore();
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'published' | 'draft'
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    postService.getAll(true).then((data) => {
      setPosts(data);
      setIsLoading(false);
    });
  }, [essaysVersion]);

  const filteredPosts = posts.filter((p) => {
    if (filter === 'all') return true;
    return (p.status || 'published') === filter;
  });

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await postService.delete(deleteTarget.id);
    setDeleteTarget(null);
    incrementEssaysVersion();
  };

  const handleCreateNew = () => {
    openTab({
      id: 'editor-new',
      slug: 'new-post',
      title: 'untitled.md',
      type: 'editor',
    });
    navigate('/write');
  };

  const handleEdit = (post) => {
    openTab({
      id: `edit-${post.id}`,
      slug: post.slug,
      title: `edit: ${post.title.slice(0, 16)}...`,
      type: 'editor',
    });
    navigate(`/editor/${post.slug}`);
  };

  const handleView = (post) => {
    openTab({
      id: post.id,
      slug: post.slug,
      title: `ENTRY // ${String(post.essayNumber || 1).padStart(4, '0')}`,
      type: 'essay',
    });
    navigate(`/essays/${post.slug}`);
  };

  return (
    <div
      style={{
        padding: '32px 32px 80px 32px',
        maxWidth: '1100px',
        margin: '0 auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2
              style={{
                fontSize: '22px',
                fontWeight: 400,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-headline)',
                letterSpacing: '0.04em',
                margin: 0,
                textTransform: 'uppercase',
              }}
            >
              My Writing // Author’s Desk
            </h2>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', marginTop: '4px' }}>
            MANAGE DRAFTS, ESSAYS, AND PUBLISHED ARCHIVAL DISPATCHES
          </div>
        </div>

        <Button variant="primary" size="md" onClick={handleCreateNew} style={{ borderRadius: 0, textTransform: 'uppercase' }}>
          <Plus size={14} />
          <span>WRITE A STORY</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[
          { key: 'all', label: `ALL MANUSCRIPTS (${posts.length})` },
          { key: 'published', label: `PUBLISHED (${posts.filter((p) => (p.status || 'published') === 'published').length})` },
          { key: 'draft', label: `DRAFTS (${posts.filter((p) => p.status === 'draft').length})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '6px 14px',
              borderRadius: 0,
              border: filter === key ? '1px solid var(--accent)' : '1px solid var(--border-default)',
              backgroundColor: filter === key ? 'var(--text-primary)' : 'transparent',
              color: filter === key ? 'var(--bg-canvas)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'background-color var(--duration-fast)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Posts Table */}
      {isLoading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          READING LOCAL_STORAGE_V4 SECTOR...
        </div>
      ) : filteredPosts.length === 0 ? (
        <EmptyDeskState onWrite={handleCreateNew} />
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 0,
            overflow: 'hidden',
          }}
        >
          {filteredPosts.map((post, idx) => {
            const isDraft = post.status === 'draft';
            return (
              <div
                key={post.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '70px 1fr auto auto 120px',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '12px 16px',
                  borderBottom: idx < filteredPosts.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  fontSize: '13px',
                }}
              >
                {/* Entry identifier */}
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--accent)',
                    fontWeight: 700,
                    fontSize: '11px',
                  }}
                >
                  #{String(post.essayNumber || idx + 1).padStart(4, '0')}
                </div>

                {/* Title & Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {post.title}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                      [{post.section || 'SYSTEMS'}]
                    </span>
                    <span>•</span>
                    <span>{post.readTimeMinutes || 5} MIN_READ</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  <span
                    style={{
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      padding: '2px 8px',
                      borderRadius: 0,
                      border: isDraft ? '1px solid var(--border-default)' : '1px solid var(--accent)',
                      backgroundColor: isDraft ? 'var(--bg-input)' : 'var(--accent-subtle)',
                      color: isDraft ? 'var(--text-muted)' : 'var(--accent)',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {isDraft ? '○ DRAFT' : '● LIVE'}
                  </span>
                </div>

                {/* Date */}
                <div className="tabular-nums" style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {formatDate(post.publishedAt)}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                  {!isDraft && (
                    <button
                      type="button"
                      onClick={() => handleView(post)}
                      aria-label="View published post"
                      title="View technical dispatch"
                      style={{
                        padding: '6px',
                        color: 'var(--text-secondary)',
                        borderRadius: 0,
                        border: '1px solid var(--border-default)',
                        backgroundColor: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                    >
                      <Eye size={13} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleEdit(post)}
                    aria-label="Edit post"
                    title="Edit dispatch in authoring studio"
                    style={{
                      padding: '6px',
                      color: 'var(--text-secondary)',
                      borderRadius: 0,
                      border: '1px solid var(--border-default)',
                      backgroundColor: 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    <Edit2 size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(post)}
                    aria-label="Delete post"
                    title="Purge record"
                    style={{
                      padding: '6px',
                      color: 'var(--danger)',
                      borderRadius: 0,
                      border: '1px solid var(--danger-border)',
                      backgroundColor: 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--danger-bg)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        postTitle={deleteTarget?.title}
      />
    </div>
  );
}
