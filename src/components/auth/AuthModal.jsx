import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Modal } from '../ui/Modal';
import { INITIAL_USERS } from '../../lib/authService';
import { LogIn, UserPlus, Key, User, Mail, ShieldCheck, ArrowRight } from 'lucide-react';

export function AuthModal() {
  const {
    authModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    login,
    register,
    loginAsDemo,
    authError,
    authLoading,
  } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (authModalTab === 'signin') {
      await login(email, password);
    } else {
      await register(name, email, password);
    }
  };

  const handleDemoSelect = async (demoUser) => {
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    await loginAsDemo(demoUser.email);
  };

  return (
    <Modal
      isOpen={authModalOpen}
      onClose={closeAuthModal}
      title="STACKTRACE // READER IDENTIFICATION"
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
            : 'Join the STACKTRACE Fellowship to curate bookmarks, appreciate essays, and draft dispatches.'}
        </p>

        {/* Quick Demo Credentials Bar */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-default)',
            padding: '12px 14px',
          }}
        >
          <div
            style={{
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--accent)',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ShieldCheck size={12} />
            <span>Instant Demo Readers (1-Click Sign In)</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {INITIAL_USERS.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleDemoSelect(u)}
                disabled={authLoading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 10px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent-container)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '9px',
                      fontWeight: 600,
                    }}
                  >
                    {u.initials}
                  </span>
                  <div>
                    <strong>{u.name}</strong>{' '}
                    <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                      ({u.role})
                    </span>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '10px',
                    color: 'var(--accent)',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  Use <ArrowRight size={10} />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {authError && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: '#ffdad6',
              border: '1px solid #ba1a1a',
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
