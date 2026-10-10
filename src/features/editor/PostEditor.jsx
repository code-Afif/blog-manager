import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService } from '../../lib/postService';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useSocialStore } from '../../store/socialStore';
import { useAuthStore } from '../../store/authStore';
import { storage } from '../../lib/storage';
import { RichTextEditor } from './RichTextEditor';
import { PublishModal } from './PublishModal';
import { PublishConfirmation } from './PublishConfirmation';
import { EssayPreview } from './EssayPreview';
import { ArrowLeft, Plus, X } from 'lucide-react';

const DRAFT_KEY = 'marginalia_essay_draft_active';

export function PostEditor({ initialPost = null }) {
  const { slug, id: routeId } = useParams();
  const navigate = useNavigate();
  const { incrementEssaysVersion } = useWorkspaceStore();
  const { profile } = useSocialStore();
  const { isAuthenticated, openAuthModal } = useAuthStore();

  const activeIdOrSlug = routeId || slug;

  const [id, setId] = useState(initialPost?.id || null);
  const [title, setTitle] = useState(initialPost?.title || '');
  const [subtitle, setSubtitle] = useState(initialPost?.dek || '');
  const [epigraphQuote, setEpigraphQuote] = useState(initialPost?.epigraph?.quote || '');
  const [epigraphAuthor, setEpigraphAuthor] = useState(initialPost?.epigraph?.attribution || '');
  const [epigraphFocused, setEpigraphFocused] = useState(false);
  const [section, setSection] = useState(initialPost?.section || 'Essays');
  const [language, setLanguage] = useState(initialPost?.language || 'en');
  const [isRtl, setIsRtl] = useState(initialPost?.language === 'ur');
  const [content, setContent] = useState(initialPost?.content || '');

  // Co-authors list
  const [coAuthors, setCoAuthors] = useState([]);
  const [addingCoAuthor, setAddingCoAuthor] = useState(false);
  const [coAuthorInput, setCoAuthorInput] = useState('');

  // Editor states: 'editing' | 'preview' | 'published'
  const [viewState, setViewState] = useState('editing');
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [publishedPost, setPublishedPost] = useState(null);

  // Saving indicator
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saving' | 'saved'
  const autosaveTimerRef = useRef(null);

  // Load existing essay if editing
  useEffect(() => {
    if (!initialPost && activeIdOrSlug && activeIdOrSlug !== 'new') {
      postService
        .getBySlug(activeIdOrSlug)
        .then((post) => {
          setId(post.id);
          setTitle(post.title || '');
          setSubtitle(post.dek || '');
          setEpigraphQuote(post.epigraph?.quote || '');
          setEpigraphAuthor(post.epigraph?.attribution || '');
          setSection(post.section || 'Essays');
          setLanguage(post.language || 'en');
          setIsRtl(post.language === 'ur');
          setContent(post.content || '');
          setSaveStatus('saved');
        })
        .catch(() => {
          // If not found, try restoring draft
          restoreDraft();
        });
    } else if (!initialPost) {
      restoreDraft();
    }
  }, [activeIdOrSlug, initialPost]);

  const restoreDraft = () => {
    const draft = storage.get(DRAFT_KEY);
    if (draft && !activeIdOrSlug) {
      setTitle(draft.title || '');
      setSubtitle(draft.subtitle || '');
      setEpigraphQuote(draft.epigraphQuote || '');
      setEpigraphAuthor(draft.epigraphAuthor || '');
      setSection(draft.section || 'Essays');
      setLanguage(draft.language || 'en');
      setIsRtl(draft.isRtl || draft.language === 'ur');
      setContent(draft.content || '');
    }
  };

  // Trigger autosave to localStorage on typing
  const triggerAutosave = () => {
    setSaveStatus('saving');
    clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(() => {
      // Save local draft
      storage.set(DRAFT_KEY, {
        id,
        title,
        subtitle,
        epigraphQuote,
        epigraphAuthor,
        section,
        language,
        isRtl,
        content,
        savedAt: new Date().toISOString(),
      });
      setSaveStatus('saved');
    }, 1200);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    triggerAutosave();
  };

  const handleContentChange = (html) => {
    setContent(html);
    triggerAutosave();
  };

  const handleToggleRtl = () => {
    setIsRtl(!isRtl);
    triggerAutosave();
  };

  const handleAddCoAuthor = (e) => {
    e.preventDefault();
    if (coAuthorInput.trim()) {
      setCoAuthors([...coAuthors, coAuthorInput.trim()]);
      setCoAuthorInput('');
      setAddingCoAuthor(false);
      triggerAutosave();
    }
  };

  const handleRemoveCoAuthor = (index) => {
    setCoAuthors(coAuthors.filter((_, i) => i !== index));
    triggerAutosave();
  };

  // Publish / Continue Handler
  const handlePublishSubmit = async (publishData) => {
    if (!isAuthenticated) {
      openAuthModal('signin', () => handlePublishSubmit(publishData));
      return;
    }

    const postPayload = {
      title: publishData.title,
      dek: publishData.dek,
      summary: publishData.summary,
      section: publishData.section,
      language: publishData.language,
      status: publishData.status, // 'published' or 'draft'
      content,
      epigraph: epigraphQuote
        ? {
            quote: epigraphQuote,
            attribution: epigraphAuthor || profile.name,
          }
        : null,
      author: {
        name: profile.name,
        handle: profile.handle,
        initials: profile.initials,
        role: profile.role,
      },
    };

    let result;
    if (id) {
      result = await postService.update(id, postPayload);
    } else {
      result = await postService.create(postPayload);
    }

    storage.remove(DRAFT_KEY);
    incrementEssaysVersion();
    setPublishModalOpen(false);

    if (publishData.status === 'published') {
      setPublishedPost(result);
      setViewState('published');
    } else {
      // Saved as draft -> return to Desk
      navigate('/desk');
    }
  };

  const handleWriteAnother = () => {
    setId(null);
    setTitle('');
    setSubtitle('');
    setEpigraphQuote('');
    setEpigraphAuthor('');
    setContent('');
    setPublishedPost(null);
    setViewState('editing');
  };

  // Render published confirmation
  if (viewState === 'published' && publishedPost) {
    return (
      <PublishConfirmation
        publishedPost={publishedPost}
        onWriteAnother={handleWriteAnother}
      />
    );
  }

  // Render preview mode
  if (viewState === 'preview') {
    return (
      <EssayPreview
        title={title}
        subtitle={subtitle}
        epigraphQuote={epigraphQuote}
        epigraphAuthor={epigraphAuthor}
        byline={{
          name: profile.name,
          initials: profile.initials,
        }}
        content={content}
        language={language}
        isRtl={isRtl}
        onBackToEditing={() => setViewState('editing')}
      />
    );
  }

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
      {/* 1. Editor Top Bar */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            type="button"
            onClick={() => navigate('/desk')}
            aria-label="Back to My Desk"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontFamily: 'var(--font-sans)',
              color: 'var(--text-secondary)',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <ArrowLeft size={16} />
            <span>My Desk</span>
          </button>

          {/* Quiet "Saved" / "Saving..." Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontFamily: 'var(--font-sans)',
              color: 'var(--text-muted)',
              borderLeft: '1px solid var(--border-default)',
              paddingLeft: '14px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: saveStatus === 'saving' ? 'var(--accent)' : '#4E9A51',
                display: 'inline-block',
                transition: 'background-color 300ms',
              }}
            />
            <span>{saveStatus === 'saving' ? 'Saving...' : 'Saved'}</span>
          </div>
        </div>

        {/* Right Action Buttons: Preview and Continue */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setViewState('preview')}
            style={{
              padding: '7px 16px',
              fontSize: '13px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 500,
              border: '1px solid var(--border-default)',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            Preview
          </button>

          <button
            type="button"
            onClick={() => {
              if (!isAuthenticated) {
                openAuthModal('signin', () => setPublishModalOpen(true));
                return;
              }
              setPublishModalOpen(true);
            }}
            className="button-create"
            style={{
              padding: '7px 20px',
              fontSize: '13px',
            }}
          >
            Continue
          </button>
        </div>
      </header>

      {/* 2. Centred Writing Column */}
      <main
        className="marginalia-editor-column"
        dir={isRtl ? 'rtl' : 'ltr'}
        lang={language}
      >
        {/* Large Title Placeholder */}
        <input
          type="text"
          className="editor-title-input"
          placeholder="Title"
          value={title}
          onChange={handleTitleChange}
          style={{
            fontFamily: 'var(--font-display)',
          }}
        />

        {/* Subtitle (Dek) */}
        <input
          type="text"
          className="editor-subtitle-input"
          placeholder="Add a subtitle..."
          value={subtitle}
          onChange={(e) => {
            setSubtitle(e.target.value);
            triggerAutosave();
          }}
          style={{
            fontFamily: 'var(--font-serif)',
          }}
        />

        {/* Epigraph Container */}
        <div className="editor-epigraph-container">
          <input
            type="text"
            className="editor-epigraph-quote"
            placeholder="Add an epigraph..."
            value={epigraphQuote}
            onChange={(e) => {
              setEpigraphQuote(e.target.value);
              triggerAutosave();
            }}
            onFocus={() => setEpigraphFocused(true)}
            onBlur={() => {
              if (!epigraphAuthor) setEpigraphFocused(false);
            }}
            style={{
              fontFamily: 'var(--font-display)',
            }}
          />
          {(epigraphFocused || epigraphQuote || epigraphAuthor) && (
            <input
              type="text"
              dir="auto"
              className="editor-epigraph-attribution"
              placeholder="Add attribution (e.g. Author, Source)"
              value={epigraphAuthor}
              onChange={(e) => {
                setEpigraphAuthor(e.target.value);
                triggerAutosave();
              }}
            />
          )}
        </div>

        {/* Writer's Byline Chip with Co-authors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <div className="editor-byline-chip">
            <div className="byline-avatar">{profile.initials || 'JV'}</div>
            <span>By {profile.name}</span>
          </div>

          {coAuthors.map((authorName, index) => (
            <div key={index} className="editor-byline-chip">
              <span>{authorName}</span>
              <button
                type="button"
                onClick={() => handleRemoveCoAuthor(index)}
                aria-label={`Remove ${authorName}`}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                }}
              >
                <X size={12} />
              </button>
            </div>
          ))}

          {addingCoAuthor ? (
            <form onSubmit={handleAddCoAuthor} style={{ display: 'inline-flex', gap: '4px' }}>
              <input
                type="text"
                placeholder="Co-author name"
                value={coAuthorInput}
                onChange={(e) => setCoAuthorInput(e.target.value)}
                style={{
                  padding: '3px 8px',
                  fontSize: '12px',
                  border: '1px solid var(--border-default)',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '3px 8px',
                  fontSize: '11px',
                  border: '1px solid var(--border-default)',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  cursor: 'pointer',
                }}
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setAddingCoAuthor(false)}
                style={{
                  padding: '3px 6px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                }}
              >
                <X size={14} />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setAddingCoAuthor(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                fontSize: '11px',
                fontFamily: 'var(--font-sans)',
                border: '1px dashed var(--border-default)',
                color: 'var(--text-muted)',
                backgroundColor: 'transparent',
                cursor: 'pointer',
              }}
            >
              <Plus size={12} />
              <span>Add co-author</span>
            </button>
          )}
        </div>

        {/* 3. TipTap Body Editor */}
        <RichTextEditor
          content={content}
          onChange={handleContentChange}
          onAutosaveTrigger={triggerAutosave}
        />
      </main>

      {/* Publish Dialog */}
      <PublishModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        initialData={{
          title,
          dek: subtitle,
          section,
          language: 'en',
          content,
        }}
        onPublish={handlePublishSubmit}
        onSaveDraft={handlePublishSubmit}
      />
    </div>
  );
}

export default PostEditor;
