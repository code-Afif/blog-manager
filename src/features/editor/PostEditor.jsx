import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService, TECHNICAL_SECTIONS } from '../../lib/postService';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { EditorSplitPane } from './EditorSplitPane';
import { Check, ArrowLeft, Terminal, Save, Layers, Tag } from 'lucide-react';
import { storage } from '../../lib/storage';

const LITERARY_TEMPLATES = {
  essay: `# The Architecture of Attention: Title Here

Why our obsession with momentum blinds us to the restorative geometry of pause, hesitation, and starting from a blank sheet of paper in an over-optimized world.

> "The ink bottle does not demand urgency. It demands only that you know where the sentence must end before setting the nib down."
> — Julian Vance

## §I. The Cadence of Thought

On reclaiming the deliberate friction that makes quiet reflection possible. When every waking hour is measured in throughput, the mind forfeits its sovereign right to wander.

Writing by hand on rag paper, letters sent without expectation of instantaneous reply, and the quiet dignity of slow contemplation.

## §II. Studies in Quietude

Observations on silence, memory, and the physical resistance of tools that shape the profundity of what we create.

## §III. The Blank Sheet of Paper

Every beginning begins with stillness.
`,
  dispatch: `# Notes from the Silent Quarter: Title Here

Observations from the field, where human cadence meets the quiet architecture of everyday life.

> "Reading is that fruitful miracle of a communication in the midst of solitude."
> — Marcel Proust

## §I. Subterranean Silence

Walking through the early morning streets, when the dawn mist replaces conversation and the empty avenues become cathedrals of quiet memory.

## §II. The Rhythm of the City

Moments captured between arrival and departure.
`,
};

/**
 * PostEditor — The Systems Engineering Authoring Workstation
 */
export function PostEditor({ initialPost = null }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { setIsDraftSaved, openTab, incrementEssaysVersion } = useWorkspaceStore();

  const [id, setId] = useState(initialPost?.id || null);
  const [title, setTitle] = useState(initialPost?.title || '');
  const [section, setSection] = useState(initialPost?.section || TECHNICAL_SECTIONS[0]);
  const [tagsInput, setTagsInput] = useState((initialPost?.tags || ['architecture', 'systems']).join(', '));
  const [dek, setDek] = useState(initialPost?.dek || '');
  const [epigraphQuote, setEpigraphQuote] = useState(initialPost?.epigraph?.quote || '');
  const [epigraphAuthor, setEpigraphAuthor] = useState(initialPost?.epigraph?.attribution || '');
  const [status, setStatus] = useState(initialPost?.status || 'draft');
  const [content, setContent] = useState(
    initialPost?.content || LITERARY_TEMPLATES.essay
  );

  const [isLoading, setIsLoading] = useState(!initialPost && slug && slug !== 'new');
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const autosaveTimerRef = useRef(null);

  // Load existing entry if editing by slug
  useEffect(() => {
    if (!initialPost && slug && slug !== 'new' && slug !== 'new-entry') {
      setIsLoading(true);
      postService
        .getBySlug(slug)
        .then((post) => {
          setId(post.id);
          setTitle(post.title);
          setSection(post.section || TECHNICAL_SECTIONS[0]);
          setTagsInput((post.tags || []).join(', '));
          setDek(post.dek || '');
          setEpigraphQuote(post.epigraph?.quote || '');
          setEpigraphAuthor(post.epigraph?.attribution || '');
          setStatus(post.status || 'draft');
          setContent(post.content || '');
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [slug, initialPost]);

  // Autosave to localStorage on any edit
  useEffect(() => {
    setIsDraftSaved(false);
    clearTimeout(autosaveTimerRef.current);

    autosaveTimerRef.current = setTimeout(() => {
      const draftData = {
        title,
        section,
        tags: tagsInput.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean),
        dek,
        epigraph: epigraphQuote ? { quote: epigraphQuote, attribution: epigraphAuthor } : null,
        status,
        content,
        timestamp: Date.now(),
      };
      storage.set('stacktrace_active_draft', draftData);
      setIsDraftSaved(true);
    }, 400);

    return () => clearTimeout(autosaveTimerRef.current);
  }, [title, section, tagsInput, dek, epigraphQuote, epigraphAuthor, status, content, setIsDraftSaved]);

  const handleSave = async (targetStatus = status) => {
    setIsSaving(true);
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const postPayload = {
      title: title.trim() || 'Untitled Entry',
      dek,
      excerpt: dek || content.slice(0, 160).replace(/[#*`]/g, '') + '...',
      section,
      tags: tags.length > 0 ? tags : ['systems'],
      epigraph: epigraphQuote ? { quote: epigraphQuote, attribution: epigraphAuthor } : null,
      status: targetStatus,
      content,
      language: 'en',
    };

    try {
      let saved;
      if (id) {
        saved = await postService.update(id, postPayload);
      } else {
        saved = await postService.create(postPayload);
        setId(saved.id);
      }

      setStatus(targetStatus);
      setIsDraftSaved(true);
      incrementEssaysVersion();
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2500);

      openTab({
        id: saved.id,
        slug: saved.slug,
        title: `№ ${String(saved.number || saved.essayNumber || 1).padStart(2, '0')} ${saved.title.slice(0, 20)}...`,
        type: 'essay',
      });

      if (targetStatus === 'published') {
        navigate(`/essays/${saved.slug}`);
      }
    } catch (err) {
      console.error('Failed to save entry:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          padding: '60px',
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
        }}
      >
        <span>&gt; LOADING_WORKSTATION...</span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-canvas)',
      }}
    >
      {/* 1. Editor Control Masthead */}
      <header
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 18px',
          borderBottom: '1px solid var(--border-default)',
          backgroundColor: 'var(--bg-surface)',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          gap: '12px',
        }}
      >
        {/* Left: Back, ID tag, Status pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              border: '1px solid var(--border-default)',
              backgroundColor: 'var(--bg-surface-elevated)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={12} />
            <span className="desktop-only">DISCOVER</span>
          </button>

          <span style={{ fontWeight: 600, color: 'var(--accent)', fontFamily: 'var(--font-sans)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            MANUSCRIPT // {id ? id.toUpperCase() : 'NEW_DISPATCH'}
          </span>

          <span
            style={{
              padding: '2px 8px',
              border: '1px solid var(--border-default)',
              backgroundColor: 'var(--bg-surface-elevated)',
              color: status === 'published' ? 'var(--accent)' : 'var(--text-muted)',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              fontSize: '10px',
              textTransform: 'uppercase',
            }}
          >
            {status.toUpperCase()}
          </span>
        </div>

        {/* Right: Template picker & Save / Publish actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setContent(LITERARY_TEMPLATES.essay)}
            style={{
              padding: '4px 10px',
              border: '1px solid var(--border-default)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '11px',
              fontFamily: 'var(--font-sans)',
            }}
            title="Load Essay & Cultural Criticism Template"
            className="desktop-only"
          >
            TPL: ESSAY
          </button>

          <button
            type="button"
            onClick={() => setContent(LITERARY_TEMPLATES.dispatch)}
            style={{
              padding: '4px 10px',
              border: '1px solid var(--border-default)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '11px',
              fontFamily: 'var(--font-sans)',
            }}
            title="Load Field Dispatch Template"
            className="desktop-only"
          >
            TPL: DISPATCH
          </button>

          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={isSaving}
            className="button-secondary hard-press"
            style={{ padding: '6px 14px', fontSize: '11px' }}
          >
            <Save size={13} />
            <span>SAVE DRAFT</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave('published')}
            disabled={isSaving}
            className="button-primary hard-press"
            style={{ padding: '6px 16px', fontSize: '11px' }}
          >
            {justSaved ? <Check size={13} /> : null}
            <span>{status === 'published' ? 'UPDATE ESSAY' : 'PUBLISH ESSAY'}</span>
          </button>
        </div>
      </header>

      {/* 2. Metadata Field Form */}
      <div
        style={{
          padding: '14px 20px',
          borderBottom: '1px solid var(--border-default)',
          backgroundColor: 'var(--bg-surface-elevated)',
          display: 'grid',
          gridTemplateColumns: '1fr auto auto',
          gap: '12px',
          alignItems: 'center',
          fontFamily: 'var(--font-sans)',
        }}
        className="editor-meta-strip"
      >
        {/* Title Input */}
        <div>
          <input
            type="text"
            placeholder="Essay Title (e.g. The Architecture of Thought)..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              padding: '6px 10px',
              fontSize: '13px',
              fontFamily: 'var(--font-headline)',
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}
          />
        </div>

        {/* Section Select */}
        <div>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              padding: '6px 10px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            {TECHNICAL_SECTIONS.map((sec) => (
              <option key={sec} value={sec}>
                [{sec.toUpperCase()}]
              </option>
            ))}
          </select>
        </div>

        {/* Tags input */}
        <div className="desktop-only">
          <input
            type="text"
            placeholder="tags: culture, literature, quiet-tech"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            style={{
              width: '240px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              padding: '6px 10px',
              fontSize: '11px',
              fontFamily: 'var(--font-sans)',
              color: 'var(--text-primary)',
            }}
          />
        </div>
      </div>

      {/* 3. Split Editor / Markdown Live Preview Pane */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <EditorSplitPane
          content={content}
          onChange={setContent}
          language="en"
        />
      </div>
    </div>
  );
}
