import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../../lib/postService';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { EmptyDeskState } from '../search/EmptySearchState';
import { formatDate } from '../../lib/utils';
import { Plus, Edit2, Trash2, Eye, Feather, BookOpen } from 'lucide-react';

/**
 * MyPostsManager — The Author’s Desk
 * Manages drafts, revisions, and published folios in local archival storage.
 */
export function MyPostsManager() {
  const navigate = useNavigate();
  const { openTab, essaysVersion, incrementEssaysVersion } = useWorkspaceStore();
  const [essays, setEssays] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'published' | 'draft'
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load ALL essays including drafts for the author's management desk
  useEffect(() => {
    setIsLoading(true);
    postService.getAll(true).then((data) => {
      setEssays(data);
      setIsLoading(false);
    });
  }, [essaysVersion]);

  const filteredEssays = essays.filter((e) => {
    if (filter === 'all') return true;
    return (e.status || 'published') === filter;
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
      slug: 'new-folio',
      title: 'untitled-folio.md',
      type: 'editor',
    });
    navigate('/write');
  };

  const handleEdit = (essay) => {
    openTab({
      id: `edit-${essay.id}`,
      slug: essay.slug,
      title: `edit: ${essay.title.slice(0, 16)}...`,
      type: 'editor',
    });
    navigate(`/editor/${essay.slug}`);
  };

  const handleView = (essay) => {
    openTab({
      id: essay.id,
      slug: essay.slug,
      title: `№ ${String(essay.essayNumber || 1).padStart(2, '0')} ${essay.title.slice(0, 18)}...`,
      type: 'essay',
    });
    navigate(`/essays/${essay.slug}`);
  };

  return (
    <div
      style={{
        padding: '32px 32px 80px 32px',
        maxWidth: '1000px',
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
            <span className="fleuron" style={{ fontSize: '1.4rem', color: 'var(--accent)' }}>❧</span>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-serif)',
                margin: 0,
              }}
            >
              Author’s Desk // Editorial Desk
            </h2>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Manage manuscripts, drafts, and published folios stored in archival memory. Drafts remain private to your desk.
          </div>
        </div>

        <Button variant="primary" size="md" onClick={handleCreateNew}>
          <Feather size={13} />
          <span>COMPOSE NEW FOLIO</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[
          { key: 'all', label: `ALL FOLIOS (${essays.length})` },
          { key: 'published', label: `PUBLISHED (${essays.filter((e) => (e.status || 'published') === 'published').length})` },
          { key: 'draft', label: `DRAFTS (${essays.filter((e) => e.status === 'draft').length})` },
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
              padding: '6px 12px',
              borderRadius: 'var(--radius-1)',
              border: filter === key ? '1px solid var(--border-active)' : '1px solid var(--border-default)',
              backgroundColor: filter === key ? 'var(--bg-surface)' : 'transparent',
              color: filter === key ? 'var(--text-primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'background-color var(--duration-calm)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Essays Table / List */}
      {isLoading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Retrieving manuscripts from local archives...
        </div>
      ) : filteredEssays.length === 0 ? (
        <EmptyDeskState onWrite={handleCreateNew} />
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-1)',
            overflow: 'hidden',
          }}
        >
          {filteredEssays.map((essay, idx) => {
            const isDraft = essay.status === 'draft';
            return (
              <div
                key={essay.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 1fr auto auto 120px',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '12px 16px',
                  borderBottom: idx < filteredEssays.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  fontSize: '13px',
                }}
              >
                {/* Number */}
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    color: 'var(--accent)',
                    fontWeight: 700,
                    fontSize: '12px',
                  }}
                >
                  №{String(essay.essayNumber || idx + 1).padStart(2, '0')}
                </div>

                {/* Title & Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', overflow: 'hidden' }}>
                  <div
                    lang={essay.language}
                    dir="ltr"
                    style={{
                      fontFamily:
                        essay.language === 'hi'
                          ? 'var(--font-serif-hi)'
                          : 'var(--font-serif)',
                      fontWeight: 600,
                      fontSize: '15px',
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {essay.title}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className="lang-pill" style={{ fontSize: '9px', padding: '1px 5px' }}>
                      {essay.language === 'hi' ? 'हिं' : 'EN'}
                    </span>
                    <span>Section: {essay.section || 'General'}</span>
                    <span>•</span>
                    <span>{essay.readTimeMinutes || 5} min read</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  <span
                    style={{
                      fontSize: '10px',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-1)',
                      border: isDraft ? '1px solid var(--status-draft-border)' : '1px solid var(--status-pub-border)',
                      backgroundColor: isDraft ? 'var(--status-draft-bg)' : 'var(--status-pub-bg)',
                      color: isDraft ? 'var(--status-draft-text)' : 'var(--status-pub-text)',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {isDraft ? '○ DRAFT' : '● PUBLISHED'}
                  </span>
                </div>

                {/* Date */}
                <div className="tabular-nums" style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {formatDate(essay.publishedAt)}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                  {!isDraft && (
                    <button
                      type="button"
                      onClick={() => handleView(essay)}
                      aria-label="View published essay"
                      title="View published folio"
                      style={{
                        padding: '6px',
                        color: 'var(--text-secondary)',
                        borderRadius: 'var(--radius-1)',
                        border: '1px solid var(--border-default)',
                        backgroundColor: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                    >
                      <Eye size={13} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleEdit(essay)}
                    aria-label="Edit folio"
                    title="Edit folio in composition suite"
                    style={{
                      padding: '6px',
                      color: 'var(--text-secondary)',
                      borderRadius: 'var(--radius-1)',
                      border: '1px solid var(--border-default)',
                      backgroundColor: 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    <Edit2 size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(essay)}
                    aria-label="Delete folio"
                    title="Delete manuscript"
                    style={{
                      padding: '6px',
                      color: 'var(--danger)',
                      borderRadius: 'var(--radius-1)',
                      border: '1px solid var(--danger-border)',
                      backgroundColor: 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
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
