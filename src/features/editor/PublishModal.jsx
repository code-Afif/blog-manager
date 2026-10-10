import React, { useState, useEffect } from 'react';
import { SECTIONS } from '../../lib/postService';
import { X, Check } from 'lucide-react';

export function PublishModal({
  isOpen,
  onClose,
  initialData = {},
  onPublish,
  onSaveDraft,
}) {
  const [title, setTitle] = useState(initialData.title || '');
  const [subtitle, setSubtitle] = useState(initialData.dek || '');
  const [section, setSection] = useState(initialData.section || 'Essays');
  const [language, setLanguage] = useState(initialData.language || 'en');
  const [summary, setSummary] = useState(initialData.summary || initialData.dek || '');
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData.title || '');
      setSubtitle(initialData.dek || '');
      setSection(initialData.section || 'Essays');
      setLanguage(initialData.language || 'en');

      // Prefill summary from dek or first sentence if empty
      if (!initialData.summary) {
        const textSnippet = (initialData.dek || initialData.content || '')
          .replace(/<[^>]*>/g, ' ')
          .trim();
        const firstSentence = textSnippet.split(/[.!?]/)[0] || '';
        setSummary(firstSentence ? `${firstSentence.trim()}...` : '');
      } else {
        setSummary(initialData.summary);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handlePublishNow = async () => {
    setIsPublishing(true);
    await onPublish({
      title: title.trim() || 'Untitled Essay',
      dek: subtitle.trim(),
      section,
      language: 'en',
      summary: summary.trim(),
      status: 'published',
    });
    setIsPublishing(false);
  };

  const handleSaveDraft = async () => {
    setIsPublishing(true);
    await onSaveDraft({
      title: title.trim() || 'Untitled Essay',
      dek: subtitle.trim(),
      section,
      language: 'en',
      summary: summary.trim(),
      status: 'draft',
    });
    setIsPublishing(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ready-to-publish-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(28, 28, 24, 0.6)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: 'var(--bg-canvas)',
          border: '1px solid var(--border-default)',
          borderRadius: '16px',
          boxSizing: 'border-box',
          padding: '28px 24px 24px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '20px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '14px',
          }}
        >
          <div>
            <h2
              id="ready-to-publish-title"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.75rem',
                fontWeight: 400,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              Ready to publish?
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '13px',
                color: 'var(--text-muted)',
                margin: '4px 0 0',
              }}
            >
              Review the presentation of your essay before dispatching it to readers.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Title */}
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-sans)',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                marginBottom: '6px',
              }}
            >
              Title
            </label>
            <input
              type="text"
              dir="auto"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title of your essay"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--border-default)',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)',
                fontSize: '1.15rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Subtitle */}
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-sans)',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                marginBottom: '6px',
              }}
            >
              Subtitle
            </label>
            <input
              type="text"
              dir="auto"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="A line summarizing your reflection..."
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--border-default)',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-serif)',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          {/* Section */}
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-sans)',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                marginBottom: '6px',
              }}
            >
              Section
            </label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                border: '1px solid var(--border-default)',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {SECTIONS.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>

          {/* Optional Short Summary */}
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-sans)',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                marginBottom: '6px',
              }}
            >
              Contents Summary (Shown in index list)
            </label>
            <input
              type="text"
              dir="auto"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Short preview sentence for readers..."
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--border-default)',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-serif)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '26px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 14px',
              fontSize: '13px',
              fontFamily: 'var(--font-sans)',
              border: '1px solid var(--border-default)',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isPublishing}
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              border: '1px solid var(--border-default)',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-surface-elevated)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            Save as draft
          </button>

          <button
            type="button"
            onClick={handlePublishNow}
            disabled={isPublishing}
            className="button-create"
            style={{
              padding: '8px 20px',
              fontSize: '13px',
              cursor: isPublishing ? 'wait' : 'pointer',
            }}
          >
            {isPublishing ? 'Publishing...' : 'Publish now'}
          </button>
        </div>
      </div>
    </div>
  );
}
