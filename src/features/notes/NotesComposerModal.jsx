import React, { useState, useEffect, useRef } from 'react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useSocialStore } from '../../store/socialStore';
import { notesService } from '../../lib/notesService';
import { Image, Quote, X, FileText, Check } from 'lucide-react';

export function NotesComposerModal() {
  const { notesComposerOpen, closeNotesComposer, editingNote, incrementEssaysVersion } = useWorkspaceStore();
  const { profile } = useSocialStore();

  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('en');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [showDraftsList, setShowDraftsList] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const textareaRef = useRef(null);

  // Initialize content if editing an existing note
  useEffect(() => {
    if (editingNote) {
      setContent(editingNote.content || '');
      setLanguage(editingNote.language || 'en');
      setImageUrl(editingNote.image || '');
    } else {
      setContent('');
      setLanguage('en');
      setImageUrl('');
    }
    setShowDraftsList(false);
    setShowImageInput(false);
    if (notesComposerOpen) {
      setDrafts(notesService.getDrafts());
      setTimeout(() => {
        if (textareaRef.current) textareaRef.current.focus();
      }, 50);
    }
  }, [editingNote, notesComposerOpen]);

  // Autosave draft while typing (if not editing an existing note)
  useEffect(() => {
    if (!notesComposerOpen || editingNote) return;
    const timer = setTimeout(() => {
      if (content.trim()) {
        notesService.saveDraft(content, language);
        setDrafts(notesService.getDrafts());
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [content, language, notesComposerOpen, editingNote]);

  if (!notesComposerOpen) return null;

  // Auto-detect language script if user changes text
  const handleContentChange = (e) => {
    const val = e.target.value;
    if (val.length <= 500) {
      setContent(val);
      // Auto-detect Urdu or Hindi if language hasn't been manually pinned
      if (/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(val)) {
        setLanguage('ur');
      } else if (/[\u0900-\u097F]/.test(val)) {
        setLanguage('hi');
      }
    }
  };

  const handleAddQuote = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = selected ? `“${selected}”` : '“Quote here”';
    const nextContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(nextContent);
  };

  const handleRestoreDraft = (draft) => {
    setContent(draft.content);
    setLanguage(draft.language || 'en');
    setShowDraftsList(false);
  };

  const handleDeleteDraft = (draftId, e) => {
    e.stopPropagation();
    notesService.deleteDraft(draftId);
    setDrafts(notesService.getDrafts());
  };

  const handlePost = async () => {
    if (!content.trim() || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const dir = language === 'ur' ? 'rtl' : 'ltr';
      if (editingNote) {
        await notesService.update(editingNote.id, {
          content: content.trim(),
          language,
          dir,
          image: imageUrl || null,
        });
      } else {
        await notesService.create({
          author: {
            name: profile.name,
            handle: profile.handle,
            initials: profile.initials,
            role: profile.role,
          },
          content: content.trim(),
          language,
          dir,
          image: imageUrl || null,
        });
        notesService.deleteDraft();
      }

      incrementEssaysVersion();
      closeNotesComposer();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const charCount = content.length;
  const showCounter = charCount >= 400;
  const isUrdu = language === 'ur';
  const isHindi = language === 'hi';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="notes-composer-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(28, 28, 24, 0.55)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeNotesComposer();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: 'var(--bg-canvas)',
          border: '1px solid var(--border-default)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          boxSizing: 'border-box',
        }}
      >
        {/* Modal Top Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            borderBottom: '1px solid var(--border-default)',
            backgroundColor: 'var(--bg-surface-elevated)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: 'var(--bg-canvas)',
                border: '1px solid var(--border-default)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--accent)',
              }}
            >
              {profile.initials || 'JV'}
            </div>
            <div>
              <div
                id="notes-composer-title"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}
              >
                {profile.name}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {editingNote ? 'Editing note' : 'New note'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!editingNote && drafts.length > 0 && (
              <button
                type="button"
                onClick={() => setShowDraftsList(!showDraftsList)}
                style={{
                  fontSize: '12px',
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--accent)',
                  textDecoration: 'underline',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Drafts ({drafts.length})
              </button>
            )}
            <button
              type="button"
              onClick={closeNotesComposer}
              aria-label="Close composer"
              style={{
                color: 'var(--text-muted)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Drafts Drawer Overlay */}
        {showDraftsList && (
          <div
            style={{
              padding: '12px 18px',
              backgroundColor: 'var(--bg-surface)',
              borderBottom: '1px solid var(--border-default)',
              maxHeight: '140px',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                marginBottom: '8px',
              }}
            >
              Saved Note Drafts
            </div>
            {drafts.map((d) => (
              <div
                key={d.id}
                onClick={() => handleRestoreDraft(d)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 8px',
                  fontSize: '12px',
                  fontFamily: 'var(--font-serif)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '6px',
                  backgroundColor: 'var(--bg-canvas)',
                  cursor: 'pointer',
                }}
              >
                <span
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '420px',
                  }}
                >
                  {d.content}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleDeleteDraft(d.id, e)}
                  style={{
                    color: 'var(--text-muted)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px',
                  }}
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Text Area */}
        <div style={{ padding: '18px 20px 8px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <textarea
            ref={textareaRef}
            dir="auto"
            placeholder="What's on your mind? A reflection, an observation, or a line from your notebook..."
            value={content}
            onChange={handleContentChange}
            style={{
              width: '100%',
              minHeight: '160px',
              border: 'none',
              outline: 'none',
              resize: 'vertical',
              backgroundColor: 'transparent',
              color: 'var(--text-primary)',
              fontFamily: isUrdu
                ? 'var(--font-urdu)'
                : isHindi
                ? 'var(--font-hindi)'
                : 'var(--font-serif)',
              fontSize: isUrdu ? '1.25rem' : '1.125rem',
              lineHeight: isUrdu ? 2.1 : 1.7,
            }}
          />

          {/* Optional Image Preview / Input */}
          {showImageInput && (
            <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
              <input
                type="url"
                placeholder="Paste image web link (https://...)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'var(--bg-input)',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                type="button"
                onClick={() => setShowImageInput(false)}
                style={{
                  padding: '6px 10px',
                  border: '1px solid var(--border-default)',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Done
              </button>
            </div>
          )}

          {imageUrl && (
            <div style={{ marginTop: '10px', position: 'relative' }}>
              <img
                src={imageUrl}
                alt="Note attachment"
                style={{ maxHeight: '180px', width: '100%', objectFit: 'cover', border: '1px solid var(--border-default)' }}
              />
              <button
                type="button"
                onClick={() => setImageUrl('')}
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  padding: '4px',
                  cursor: 'pointer',
                }}
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Modal Bottom Bar: Tools & Post button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 18px',
            borderTop: '1px solid var(--border-default)',
            backgroundColor: 'var(--bg-canvas)',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          {/* Tool icons & Emoji-free Language picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              type="button"
              onClick={() => setShowImageInput(!showImageInput)}
              title="Add image"
              style={{
                color: imageUrl ? 'var(--accent)' : 'var(--text-secondary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Image size={17} />
            </button>

            <button
              type="button"
              onClick={handleAddQuote}
              title="Add quotation marks"
              style={{
                color: 'var(--text-secondary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Quote size={17} />
            </button>

            {/* Emoji-free language picker */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                borderLeft: '1px solid var(--border-default)',
                paddingLeft: '12px',
              }}
            >
              {[
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'हिन्दी' },
                { code: 'ur', label: 'اردو' },
              ].map((lang) => {
                const isSel = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setLanguage(lang.code)}
                    style={{
                      padding: '2px 7px',
                      fontSize: lang.code === 'ur' ? '12px' : '11px',
                      fontFamily: lang.code === 'ur' ? 'var(--font-urdu)' : lang.code === 'hi' ? 'var(--font-hindi)' : 'var(--font-sans)',
                      border: '1px solid',
                      borderColor: isSel ? 'var(--text-primary)' : 'transparent',
                      backgroundColor: isSel ? 'var(--text-primary)' : 'transparent',
                      color: isSel ? 'var(--bg-canvas)' : 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    {lang.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Character counter & Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {showCounter && (
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: charCount >= 480 ? 'var(--danger)' : 'var(--text-muted)',
                }}
              >
                {500 - charCount}
              </span>
            )}

            <button
              type="button"
              onClick={closeNotesComposer}
              style={{
                padding: '6px 12px',
                fontSize: '13px',
                fontFamily: 'var(--font-sans)',
                border: '1px solid var(--border-default)',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handlePost}
              disabled={!content.trim() || isSubmitting}
              className="button-create"
              style={{
                padding: '6px 18px',
                fontSize: '13px',
                opacity: !content.trim() || isSubmitting ? 0.45 : 1,
                cursor: !content.trim() || isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? 'Posting...' : editingNote ? 'Update' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
