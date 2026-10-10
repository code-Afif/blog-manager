import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { ArrowLeft, Monitor, Smartphone } from 'lucide-react';

export function EssayPreview({
  title,
  subtitle,
  epigraphQuote,
  epigraphAuthor,
  byline,
  content,
  language = 'en',
  isRtl = false,
  onBackToEditing,
}) {
  const [deviceWidth, setDeviceWidth] = useState('desktop'); // 'desktop' (680px) | 'phone' (375px)

  const sanitizedContent = DOMPurify.sanitize(content || '');
  const isUrdu = language === 'ur' || isRtl;
  const isHindi = language === 'hi';

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-canvas)',
        color: 'var(--text-primary)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Preview Control Bar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 60,
          backgroundColor: 'var(--bg-canvas)',
          borderBottom: '1px solid var(--border-default)',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <button
          type="button"
          onClick={onBackToEditing}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            border: 'none',
            background: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to editing</span>
        </button>

        {/* Desktop / Phone Width Toggle */}
        <div
          role="group"
          aria-label="Preview width device toggle"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            border: '1px solid var(--border-default)',
            padding: '2px',
            backgroundColor: 'var(--bg-surface-elevated)',
          }}
        >
          <button
            type="button"
            onClick={() => setDeviceWidth('desktop')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              fontSize: '12px',
              fontFamily: 'var(--font-sans)',
              border: 'none',
              backgroundColor: deviceWidth === 'desktop' ? 'var(--text-primary)' : 'transparent',
              color: deviceWidth === 'desktop' ? 'var(--bg-canvas)' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <Monitor size={14} />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceWidth('phone')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              fontSize: '12px',
              fontFamily: 'var(--font-sans)',
              border: 'none',
              backgroundColor: deviceWidth === 'phone' ? 'var(--text-primary)' : 'transparent',
              color: deviceWidth === 'phone' ? 'var(--bg-canvas)' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <Smartphone size={14} />
            <span>Phone</span>
          </button>
        </div>
      </header>

      {/* Main Preview Container */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          padding: '40px 16px 120px',
          backgroundColor: deviceWidth === 'phone' ? 'var(--bg-surface-elevated)' : 'var(--bg-canvas)',
          transition: 'background-color var(--duration-fast)',
        }}
      >
        <article
          dir={isUrdu ? 'rtl' : 'ltr'}
          lang={language}
          style={{
            width: '100%',
            maxWidth: deviceWidth === 'phone' ? '375px' : '680px',
            backgroundColor: 'var(--bg-canvas)',
            border: deviceWidth === 'phone' ? '1px solid var(--border-default)' : 'none',
            padding: deviceWidth === 'phone' ? '28px 20px' : '0',
            boxSizing: 'border-box',
            fontFamily: isUrdu
              ? 'var(--font-urdu)'
              : isHindi
              ? 'var(--font-hindi)'
              : 'var(--font-serif)',
          }}
        >
          {/* Title */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: deviceWidth === 'phone' ? '2rem' : '2.8rem',
              fontWeight: 400,
              lineHeight: 1.18,
              color: 'var(--text-primary)',
              margin: '0 0 12px',
            }}
          >
            {title || 'Untitled Essay'}
          </h1>

          {/* Subtitle / Dek */}
          {subtitle && (
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: deviceWidth === 'phone' ? '1.05rem' : '1.25rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
                margin: '0 0 20px',
              }}
            >
              {subtitle}
            </p>
          )}

          {/* Epigraph */}
          {epigraphQuote && (
            <div
              style={{
                margin: '20px 0 28px',
                paddingLeft: isUrdu ? 0 : '16px',
                paddingRight: isUrdu ? '16px' : 0,
                borderLeft: isUrdu ? 'none' : '2px solid var(--accent)',
                borderRight: isUrdu ? '2px solid var(--accent)' : 'none',
              }}
            >
              <blockquote
                style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                  margin: 0,
                }}
              >
                “{epigraphQuote}”
              </blockquote>
              {epigraphAuthor && (
                <div
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    marginTop: '6px',
                  }}
                >
                  — {epigraphAuthor}
                </div>
              )}
            </div>
          )}

          {/* Byline chip */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 10px',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-default)',
              fontSize: '12px',
              fontFamily: 'var(--font-sans)',
              color: 'var(--text-secondary)',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: 'var(--accent)',
                color: 'var(--accent-fg, #FFFFFF)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 600,
              }}
            >
              {byline?.initials || 'JV'}
            </div>
            <span>By {byline?.name || 'Julian Vance'}</span>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', marginBottom: '32px' }} />

          {/* Body Content */}
          <div
            className="reading-content"
            style={{
              fontSize: deviceWidth === 'phone' ? '1.05rem' : '1.15rem',
              lineHeight: isUrdu ? 2.1 : 1.85,
              color: 'var(--text-primary)',
            }}
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </article>
      </div>
    </div>
  );
}
