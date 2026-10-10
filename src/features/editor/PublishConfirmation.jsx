import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Copy, ArrowRight, PenTool, LayoutDashboard } from 'lucide-react';

export function PublishConfirmation({ publishedPost, onWriteAnother }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const essayUrl = `${window.location.origin}/essays/${publishedPost.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(essayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          backgroundColor: 'var(--bg-canvas)',
          border: '1px solid var(--border-default)',
          borderRadius: '16px',
          padding: '40px 32px',
          textAlign: 'center',
        }}
      >
        {/* Subtle Check Icon */}
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-default)',
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <Check size={22} />
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.2rem',
            fontWeight: 400,
            color: 'var(--text-primary)',
            margin: '0 0 10px',
          }}
        >
          Your essay is published.
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '15px',
            color: 'var(--text-secondary)',
            margin: '0 auto 28px',
            maxWidth: '440px',
            lineHeight: 1.5,
          }}
        >
          <em>“{publishedPost.title}”</em> is now catalogued in Marginalia’s broadsheet archive under {publishedPost.section}.
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxWidth: '320px',
            margin: '0 auto',
          }}
        >
          <button
            type="button"
            onClick={() => navigate(`/essays/${publishedPost.slug}`)}
            className="button-create"
            style={{
              padding: '10px 18px',
              fontSize: '13px',
              width: '100%',
            }}
          >
            <span>View essay</span>
            <ArrowRight size={15} />
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '9px 18px',
              fontSize: '13px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              border: '1px solid var(--border-default)',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all var(--duration-fast)',
            }}
          >
            {copied ? (
              <>
                <Check size={15} style={{ color: 'var(--accent)' }} />
                <span>Link copied</span>
              </>
            ) : (
              <>
                <Copy size={15} />
                <span>Share (copy link)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onWriteAnother}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '9px 18px',
              fontSize: '13px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 500,
              border: '1px solid transparent',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <PenTool size={14} />
            <span>Write another</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/desk')}
            style={{
              fontSize: '12px',
              fontFamily: 'var(--font-sans)',
              color: 'var(--text-muted)',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            Go to My Desk
          </button>
        </div>
      </div>
    </div>
  );
}
