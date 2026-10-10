import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useSocialStore } from '../../store/socialStore';
import { authService } from '../../lib/authService';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Modal } from '../ui/Modal';
import { LogIn, UserPlus, Key, User, Mail, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';

export function AuthModal() {
  const navigate = useNavigate();
  const location = useLocation();
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

  const handleClose = () => {
    closeAuthModal(false);
    if (location.pathname.startsWith('/write') || location.pathname.startsWith('/editor/')) {
      navigate('/');
    }
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [syncStatus, setSyncStatus] = useState(null);
  const [syncLoading, setSyncLoading] = useState(false);

  const handleManualSync = async () => {
    setSyncLoading(true);
    setSyncStatus(null);
    try {
      await authService.syncAllUsersToSupabase();
      setSyncStatus('✓ Synced all accounts to Supabase!');
    } catch (err) {
      setSyncStatus('Sync warning: ' + err.message);
    } finally {
      setSyncLoading(false);
    }
  };

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSyncStatus(null);
    if (authModalTab === 'signin') {
      const res = await login(email, password);
      if (res?.success && res.user) {
        updateProfile({
          id: res.user.id,
          name: res.user.name,
          handle: res.user.handle,
          initials: res.user.initials,
          role: res.user.role || 'Fellow Reader',
          bio: res.user.bio || 'Reader and subscriber to MARGINALIA.',
        });
      }
    } else {
      const res = await register(name, email, password);
      if (res?.success && res.user) {
        updateProfile({
          id: res.user.id,
          name: res.user.name,
          handle: res.user.handle,
          initials: res.user.initials,
          role: res.user.role || 'Fellow Reader',
          bio: res.user.bio || 'Reader and subscriber to MARGINALIA.',
        });
        setSyncStatus('✓ Account created and pushed to Supabase!');
      }
    }
  };

  return (
    <Modal
      isOpen={authModalOpen}
      onClose={handleClose}
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

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Cancel
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
                  ? 'Verifying & Syncing...'
                  : authModalTab === 'signin'
                  ? 'Sign In to Journal'
                  : 'Register Reader Account'}
              </span>
            </button>
          </div>
        </form>

        {/* Supabase Status and Sync Control */}
        <div
          style={{
            marginTop: '8px',
            paddingTop: '14px',
            borderTop: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            fontFamily: 'var(--font-sans)',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: isSupabaseConfigured ? '#16a34a' : '#d97706',
                display: 'inline-block',
                boxShadow: isSupabaseConfigured ? '0 0 6px #16a34a' : 'none',
              }}
            />
            <span style={{ fontWeight: 500 }}>
              {isSupabaseConfigured ? 'Supabase Database: Live' : 'Local Archive Mode'}
            </span>
          </div>

          {isSupabaseConfigured && (
            <button
              type="button"
              onClick={handleManualSync}
              disabled={syncLoading}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontFamily: 'var(--font-sans)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'background var(--duration-fast)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface)')}
            >
              <RefreshCw size={11} className={syncLoading ? 'animate-spin' : ''} />
              <span>{syncLoading ? 'Syncing...' : 'Sync with Supabase'}</span>
            </button>
          )}
        </div>

        {syncStatus && (
          <div
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '11px',
              backgroundColor: syncStatus.startsWith('✓') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(217, 119, 6, 0.1)',
              color: syncStatus.startsWith('✓') ? '#16a34a' : '#d97706',
              border: `1px solid ${syncStatus.startsWith('✓') ? 'rgba(34, 197, 94, 0.25)' : 'rgba(217, 119, 6, 0.25)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {syncStatus.startsWith('✓') && <CheckCircle2 size={12} />}
            <span>{syncStatus}</span>
          </div>
        )}
      </div>
    </Modal>
  );
}
