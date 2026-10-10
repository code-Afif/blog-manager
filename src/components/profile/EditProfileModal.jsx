import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { useSocialStore } from '../../store/socialStore';
import { useAuthStore } from '../../store/authStore';
import { Edit3, Check, User, Sparkles, Feather } from 'lucide-react';

export function EditProfileModal({ isOpen, onClose }) {
  const { profile, updateProfile } = useSocialStore();
  const { user, isAuthenticated, updateUserProfile } = useAuthStore();

  const [name, setName] = useState(user?.name || profile.name || '');
  const [role, setRole] = useState(user?.role || profile.role || 'Contributing Writer');
  const [bio, setBio] = useState(user?.bio || profile.bio || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(user?.name || profile.name || '');
      setRole(user?.role || profile.role || 'Contributing Writer');
      setBio(user?.bio || profile.bio || '');
      setSavedSuccess(false);
    }
  }, [isOpen, user, profile]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim() || 'Reader';
    const trimmedRole = role.trim() || 'Contributing Writer';
    const trimmedBio = bio.trim() || 'Reader and writer of slow literature on Marginalia.';

    // Update social store
    updateProfile({
      name: trimmedName,
      role: trimmedRole,
      bio: trimmedBio,
    });

    // If authenticated, also update auth store session
    if (isAuthenticated) {
      updateUserProfile({
        name: trimmedName,
        role: trimmedRole,
        bio: trimmedBio,
      });
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 450);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="MARGINALIA // EDIT READER PROFILE"
      subtitle="Update your archival identity, role & literary bio"
      maxWidth="520px"
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {/* Monogram Preview Card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '14px 16px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: '12px',
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent)',
              color: 'var(--accent-fg, #ffffff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {name
              ? name
                  .trim()
                  .split(/\s+/)
                  .map((p) => p[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()
              : 'ME'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '17px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                lineHeight: 1.2,
              }}
            >
              {name || 'Your Name'}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                marginTop: '3px',
              }}
            >
              {role || 'Contributing Writer'}
            </div>
          </div>
        </div>

        {/* Full Name Field */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label
            htmlFor="edit-profile-name"
            style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <User size={12} />
            <span>Full Name</span>
          </label>
          <input
            id="edit-profile-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Julian Vance"
            style={{
              padding: '10px 14px',
              fontSize: '14px',
              fontFamily: 'var(--font-sans)',
              backgroundColor: 'var(--bg-canvas)',
              border: '1px solid var(--border-default)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              outline: 'none',
              transition: 'border-color var(--duration-fast)',
            }}
          />
        </div>

        {/* Literary Role / Title Field */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label
            htmlFor="edit-profile-role"
            style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Feather size={12} />
            <span>Moniker / Archival Role</span>
          </label>
          <input
            id="edit-profile-role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Contributing Essayist, Fellow Reader, Bookbinder"
            style={{
              padding: '10px 14px',
              fontSize: '14px',
              fontFamily: 'var(--font-sans)',
              backgroundColor: 'var(--bg-canvas)',
              border: '1px solid var(--border-default)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              outline: 'none',
              transition: 'border-color var(--duration-fast)',
            }}
          />
        </div>

        {/* Bio Field */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label
            htmlFor="edit-profile-bio"
            style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={12} />
            <span>Literary Bio &amp; Reflections</span>
          </label>
          <textarea
            id="edit-profile-bio"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A short reflection about what you read, write, and dwell upon..."
            style={{
              padding: '10px 14px',
              fontSize: '13px',
              fontFamily: 'var(--font-serif)',
              backgroundColor: 'var(--bg-canvas)',
              border: '1px solid var(--border-default)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              outline: 'none',
              resize: 'vertical',
              lineHeight: 1.5,
              transition: 'border-color var(--duration-fast)',
            }}
          />
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '8px',
            paddingTop: '14px',
            borderTop: '1px solid var(--border-default)',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 18px',
              borderRadius: '9999px',
              border: '1px solid var(--border-default)',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontFamily: 'var(--font-sans)',
              cursor: 'pointer',
              transition: 'all var(--duration-fast)',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="button-create"
            disabled={savedSuccess}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 20px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {savedSuccess ? (
              <>
                <Check size={14} />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Edit3 size={14} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
