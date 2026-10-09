import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../../lib/postService';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { formatDate } from '../../lib/utils';
import { Plus, Edit2, Trash2, Eye, FileText, CheckCircle, Clock } from 'lucide-react';

export function MyPostsManager() {
  const navigate = useNavigate();
  const { openTab, postsVersion, incrementPostsVersion } = useWorkspaceStore();
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'published' | 'draft'
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    postService.getAll().then((data) => {
      setPosts(data);
      setIsLoading(false);
    });
  }, [postsVersion]);

  const filteredPosts = posts.filter((p) => {
    if (filter === 'all') return true;
    return (p.status || 'published') === filter;
  });

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await postService.delete(deleteTarget.id);
    setDeleteTarget(null);
    incrementPostsVersion();
  };

  const handleCreateNew = () => {
    openTab({ id: 'editor-new', slug: 'new-post', title: 'untitled.md', type: 'editor' });
    navigate('/editor/new');
  };

  const handleEdit = (post) => {
    openTab({ id: `edit-${post.id}`, slug: post.slug, title: `edit:${post.filename}`, type: 'editor' });
    navigate(`/editor/${post.slug}`);
  };

  const handleView = (post) => {
    openTab({ id: post.id, slug: post.slug, title: post.filename, type: 'post' });
    navigate(`/posts/${post.slug}`);
  };

  return (
    <div
      style={{
        padding: '24px 32px',
        maxWidth: '1000px',
        margin: '0 auto',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            MY POSTS // MANAGEMENT CONSOLE
          </h2>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Manage, draft, update, and delete markdown documents in your local repository.
          </div>
        </div>

        <Button variant="primary" size="md" onClick={handleCreateNew}>
          <Plus size={13} />
          NEW POST
        </Button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {['all', 'published', 'draft'].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-1)',
              border: filter === f ? '1px solid var(--border-active)' : '1px solid var(--border-default)',
              backgroundColor: filter === f ? 'var(--bg-surface-active)' : 'var(--bg-surface)',
              color: filter === f ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: filter === f ? 600 : 400,
              textTransform: 'uppercase',
            }}
          >
            {f} ({posts.filter((p) => f === 'all' || (p.status || 'published') === f).length})
          </button>
        ))}
      </div>

      {/* Posts Table */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-1)',
          overflow: 'hidden',
        }}
      >
        {/* Table Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 100px 100px 90px 120px',
            padding: '8px 12px',
            backgroundColor: 'var(--bg-surface-elevated)',
            borderBottom: '1px solid var(--border-default)',
            fontSize: '10px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          <span>DOCUMENT / FILE</span>
          <span>STATUS</span>
          <span>DATE</span>
          <span>READ TIME</span>
          <span style={{ textAlign: 'right' }}>ACTIONS</span>
        </div>

        {/* Table Body */}
        {filteredPosts.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
            No posts found matching filter "{filter}".
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 100px 100px 90px 120px',
                alignItems: 'center',
                padding: '10px 12px',
                borderBottom: '1px solid var(--border-subtle)',
                fontSize: '12px',
                transition: 'background-color var(--duration-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {/* Document details */}
              <div style={{ overflow: 'hidden', paddingRight: '12px' }}>
                <div
                  style={{
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                >
                  {post.title}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {post.folder}/{post.filename}
                </div>
              </div>

              {/* Status Badge */}
              <div>
                <Badge variant={post.status === 'draft' ? 'draft' : 'published'}>
                  {post.status || 'published'}
                </Badge>
              </div>

              {/* Date */}
              <div className="tabular-nums" style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                {formatDate(post.publishedAt)}
              </div>

              {/* Read Time */}
              <div className="tabular-nums" style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                {post.readTimeMinutes} min
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                <button
                  type="button"
                  onClick={() => handleView(post)}
                  title="View post"
                  style={{
                    padding: '3px 5px',
                    color: 'var(--text-secondary)',
                    borderRadius: 'var(--radius-1)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  <Eye size={13} />
                </button>

                <button
                  type="button"
                  onClick={() => handleEdit(post)}
                  title="Edit post"
                  style={{
                    padding: '3px 5px',
                    color: 'var(--text-secondary)',
                    borderRadius: 'var(--radius-1)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  <Edit2 size={13} />
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteTarget(post)}
                  title="Delete post"
                  style={{
                    padding: '3px 5px',
                    color: 'var(--text-secondary)',
                    borderRadius: 'var(--radius-1)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        postTitle={deleteTarget?.title}
        postFilename={deleteTarget?.filename}
      />
    </div>
  );
}
