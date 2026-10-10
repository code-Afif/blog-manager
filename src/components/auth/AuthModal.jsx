import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useSocialStore } from '../../store/socialStore';
import { Modal } from '../ui/Modal';
import { LogIn, UserPlus, Key, User, Mail, ArrowRight } from 'lucide-react';

export function AuthModal() {
  const {
    authModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    login,
    register,
    authError,
    authLoading,
  } = useAuthStore();
  const { updateProfile } = useSocialStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (authModalTab === 'signin') {
      const res = await login(email, password);
      if (res?.success && res.user) {
        updateProfile({
          name: res.user.name,
          role: res.user.role || 'Fellow Reader',
          bio: res.user.bio || 'Reader and subscriber to MARGINALIA.',
        });
      }
    } else {
      const res = await register(name, email, password);
      if (res?.success && res.user) {
        updateProfile({
          name: res.user.name,
          role: res.user.role || 'Fellow Reader',
          bio: res.user.bio || 'Reader and subscriber to MARGINALIA.',
        });
      }
    }
  };

  return (
    <Modal
      isOpen={authModalOpen}
      onClose={closeAuthModal}
      title="MARGINALIA // READER IDENTIFICATION"
      subtitle="Archival Reader Registry & Fellowship"
      maxWidth="540px"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {/* Top Tab Bar: Sign In vs Create Account */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-default)',
            gap: '8px',
          }}
        >
          <button
            type="button"
            onClick={() => setAuthModalTab('signin')}
            style={{
              flex: 1,
              padding: '10px 16px',
              background: 'none',
              border: 'none',
              borderBottom: authModalTab === 'signin' ? '2px solid var(--accent)' : '2px solid transparent',
              color: authModalTab === 'signin' ? 'var(--accent)' : 'var(--text-secondary)',
              fontWeight: authModalTab === 'signin' ? 600 : 400,
              fontSize: '13px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all var(--duration-fast)',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthModalTab('signup')}
            style={{
              flex: 1,
              padding: '10px 16px',
              background: 'none',
              border: 'none',
              borderBottom: authModalTab === 'signup' ? '2px solid var(--accent)' : '2px solid transparent',
              color: authModalTab === 'signup' ? 'var(--accent)' : 'var(--text-secondary)',
              fontWeight: authModalTab === 'signup' ? 600 : 400,
              fontSize: '13px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all var(--duration-fast)',
            }}
          >
            Create Account
          </button>
        </div>

        {/* Informative Note */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {authModalTab === 'signin'
            ? 'Sign in to sync your saved reading list, liked dispatches, and private notes across reading sessions.'
            : 'Join the MARGINALIA Fellowship to curate bookmarks, appreciate essays, and draft dispatches.'}
        </p>

        {/* Error Alert */}
        {authError && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: '#ffdad6',
              border: '1px solid #ba1a1a',
              borderRadius: '8px',
              color: '#93000a',
              fontSize: '12px',
              lineHeight: 1.4,
            }}
          >
            {authError}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {authModalTab === 'signup' && (
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                  marginBottom: '6px',
                }}
              >
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arthur Pendelton"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 34px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-default)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                    outline: 'none',
                  }}
                />
                <User
                  size={14}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                fontWeight: 600,
                marginBottom: '6px',
              }}
            >
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="reader@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 34px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              />
              <Mail
                size={14}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                fontWeight: 600,
                marginBottom: '6px',
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 34px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              />
              <Key
                size={14}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
            <button
              type="button"
              onClick={() => closeAuthModal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '12px',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Continue as Guest
            </button>

            <button
              type="submit"
              disabled={authLoading}
              className="button-primary hard-press"
              style={{
                padding: '8px 20px',
                fontSize: '12px',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {authModalTab === 'signin' ? <LogIn size={13} /> : <UserPlus size={13} />}
              <span>
                {authLoading
                  ? 'Verifying...'
                  : authModalTab === 'signin'
                  ? 'Sign In to Journal'
                  : 'Register Reader Account'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
