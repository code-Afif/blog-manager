import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSocialStore } from '../../store/socialStore';
import { postService } from '../../lib/postService';
import { notesService } from '../../lib/notesService';
import { PostRow } from '../posts/PostRow';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { Edit3, Check, Heart, Bookmark, Share2 } from 'lucide-react';
import { formatRelativeTime } from '../../lib/utils';

export function ProfilePage() {
  const { handle } = useParams();
  const navigate = useNavigate();
  const { openTab } = useWorkspaceStore();
  const {
    profile,
    updateProfile,
    getWriterByHandle,
    isFollowing,
    toggleFollow,
  } = useSocialStore();

  const isOwnProfile = !handle || handle === 'me' || handle === profile.handle;
  const writer = isOwnProfile ? profile : getWriterByHandle(handle) || {
    name: handle ? handle.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') : 'Contributing Writer',
    handle: handle || 'writer',
    initials: (handle || 'W').slice(0, 2).toUpperCase(),
    bio: 'Reader and writer of slow literature on Marginalia.',
    languages: ['English'],
  };

  const [activeTab, setActiveTab] = useState('essays'); // 'essays' | 'notes'
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(writer.name);
  const [editedBio, setEditedBio] = useState(writer.bio);

  const [writerEssays, setWriterEssays] = useState([]);
  const [writerNotes, setWriterNotes] = useState([]);

  const isFollowed = isFollowing(writer.handle);

  useEffect(() => {
    Promise.all([
      postService.getAll(false),
      notesService.getAll(),
    ]).then(([allPosts, allNotes]) => {
      const matchName = writer.name.toLowerCase();
      const matchHandle = writer.handle.toLowerCase();

      const matchedEssays = allPosts.filter((p) => {
        const authorName = (p.author?.name || '').toLowerCase();
        const authorHandle = (p.author?.handle || '').toLowerCase();
        return authorName === matchName || authorHandle === matchHandle;
      });

      const matchedNotes = allNotes.filter((n) => {
        const authorName = (n.author?.name || '').toLowerCase();
        const authorHandle = (n.author?.handle || '').toLowerCase();
        return authorName === matchName || authorHandle === matchHandle;
      });

      setWriterEssays(matchedEssays);
      setWriterNotes(matchedNotes);
    });
  }, [writer.name, writer.handle]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (isOwnProfile) {
      updateProfile({
        name: editedName.trim() || profile.name,
        bio: editedBio.trim() || profile.bio,
      });
    }
    setIsEditing(false);
  };

  const handleOpenEssay = (essay) => {
    openTab({
      id: essay.id,
      slug: essay.slug,
      title: `№ ${String(essay.essayNumber || 1).padStart(2, '0')} ${essay.title.slice(0, 24)}...`,
      type: 'essay',
    });
    navigate(`/essays/${essay.slug}`);
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '720px',
        margin: '0 auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* 1. Header Plate: Monogram avatar, Name, Bio, Actions */}
      <div
        style={{
          borderBottom: '1px solid var(--border-default)',
          paddingBottom: '28px',
          marginBottom: '28px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '24px',
            marginBottom: '16px',
            flexWrap: 'wrap',
          }}
        >
          {/* Monogram Avatar */}
          <div
            style={{
              width: '72px',
              height: '72px',
              backgroundColor: 'var(--accent)',
              color: 'var(--accent-fg, #FFFFFF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: '26px',
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {writer.initials || 'W'}
          </div>

          <div style={{ flex: 1, minWidth: '240px' }}>
            {isEditing ? (
              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="Your Name"
                  style={{
                    padding: '8px 10px',
                    fontSize: '18px',
                    fontFamily: 'var(--font-display)',
                    border: '1px solid var(--border-default)',
                    backgroundColor: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                  }}
                />
                <textarea
                  rows={2}
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  placeholder="A one-line bio about your reading and writing..."
                  style={{
                    padding: '8px 10px',
                    fontSize: '14px',
                    fontFamily: 'var(--font-serif)',
                    border: '1px solid var(--border-default)',
                    backgroundColor: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    resize: 'vertical',
                  }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="submit"
                    className="button-create"
                    style={{ padding: '6px 14px', fontSize: '12px' }}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      background: 'none',
                      border: '1px solid var(--border-default)',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <h2
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '2rem',
                      fontWeight: 400,
                      color: 'var(--text-primary)',
                      margin: 0,
                    }}
                  >
                    {writer.name}
                  </h2>

                  {isOwnProfile ? (
                    <button
                      type="button"
                      onClick={() => {
                        setEditedName(writer.name);
                        setEditedBio(writer.bio);
                        setIsEditing(true);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'none',
                        border: '1px solid var(--border-default)',
                        padding: '5px 12px',
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                      }}
                    >
                      <Edit3 size={13} />
                      <span>Edit profile</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleFollow(writer.handle)}
                      style={{
                        backgroundColor: isFollowed ? 'var(--bg-surface-elevated)' : 'var(--accent)',
                        color: isFollowed ? 'var(--text-primary)' : 'var(--accent-fg, #FFFFFF)',
                        border: '1px solid var(--border-default)',
                        padding: '6px 16px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {isFollowed ? 'Following' : '+ Follow'}
                    </button>
                  )}
                </div>

                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '15px',
                    color: 'var(--text-secondary)',
                    margin: '8px 0 12px',
                    lineHeight: 1.6,
                  }}
                >
                  {writer.bio}
                </p>

                {/* Languages badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                    Languages:
                  </span>
                  {(writer.languages || ['English']).map((lang) => (
                    <span
                      key={lang}
                      style={{
                        padding: '2px 8px',
                        border: '1px solid var(--border-default)',
                        fontSize: '11px',
                        color: 'var(--accent)',
                        fontWeight: 500,
                      }}
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Tabs: Essays vs Notes with Liquid Slide Indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '28px',
          borderBottom: '1px solid var(--border-default)',
          marginBottom: '24px',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('essays')}
          style={{
            position: 'relative',
            background: 'none',
            border: 'none',
            padding: '10px 4px',
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem',
            fontWeight: activeTab === 'essays' ? 600 : 400,
            color: activeTab === 'essays' ? 'var(--text-primary)' : 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'color var(--duration-fast)',
          }}
        >
          Essays ({writerEssays.length})
          {activeTab === 'essays' && (
            <motion.div
              layoutId="profileTabLiquidIndicator"
              transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.7 }}
              style={{
                position: 'absolute',
                bottom: -1,
                left: 0,
                right: 0,
                height: '2px',
                backgroundColor: 'var(--accent)',
              }}
            />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notes')}
          style={{
            position: 'relative',
            background: 'none',
            border: 'none',
            padding: '10px 4px',
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem',
            fontWeight: activeTab === 'notes' ? 600 : 400,
            color: activeTab === 'notes' ? 'var(--text-primary)' : 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'color var(--duration-fast)',
          }}
        >
          Notes ({writerNotes.length})
          {activeTab === 'notes' && (
            <motion.div
              layoutId="profileTabLiquidIndicator"
              transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.7 }}
              style={{
                position: 'absolute',
                bottom: -1,
                left: 0,
                right: 0,
                height: '2px',
                backgroundColor: 'var(--accent)',
              }}
            />
          )}
        </button>
      </div>

      {/* 3. Tab Contents */}
      {activeTab === 'essays' ? (
        writerEssays.length === 0 ? (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
            }}
          >
            <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-muted)', fontSize: '15px', margin: 0 }}>
              No published essays yet by {writer.name}.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {writerEssays.map((essay, idx) => (
              <PostRow
                key={essay.id}
                post={essay}
                index={idx}
                onOpen={handleOpenEssay}
              />
            ))}
          </div>
        )
      ) : writerNotes.length === 0 ? (
        <div
          style={{
            padding: '40px 20px',
            textAlign: 'center',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
          }}
        >
          <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-muted)', fontSize: '15px', margin: 0 }}>
            No notes posted yet by {writer.name}.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {writerNotes.map((note) => (
            <article
              key={note.id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                padding: '18px 20px',
              }}
            >
              <div style={{ marginBottom: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>{formatRelativeTime(note.publishedAt)}</span>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.1rem',
                  lineHeight: 1.7,
                  color: 'var(--text-primary)',
                  marginBottom: '10px',
                }}
              >
                {note.content}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: 'var(--text-muted)', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Heart size={13} /> {note.appreciations || 0}
                </span>
                <span>·</span>
                <span>{note.replies ? note.replies.length : 0} replies</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
