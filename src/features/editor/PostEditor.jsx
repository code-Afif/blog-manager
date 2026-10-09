import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService, LITERARY_SECTIONS, SECTION_TRANSLATIONS } from '../../lib/postService';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { EditorSplitPane } from './EditorSplitPane';
import { Button } from '../../components/ui/Button';
import { Feather, Check, BookOpen, Quote, Tag, Layers, Globe } from 'lucide-react';
import { storage } from '../../lib/storage';

const LITERARY_TEMPLATES = {
  en: `# On the Craft of Literature & The Quiet Reader\n\nBegin your essay here. The opening passage sets the tempo of reflective contemplation.\n\n> "Words are the only things that last forever."\n> — William Hazlitt\n\n## §I. The Architecture of Thought\n\nThe literary essay unfolds at the deliberate speed of reflection. Unlike urgent technical communiqués, it pauses over nuance and seeks companionship with the reader's inner ear.\n\n## §II. The Footnote and the Margin\n\nScholarly remarks and textual reflections find their place in footnotes[^1] and marginal commentary.\n\n[^1]: Observations drawn from an evening with the collected essays.\n`,
  hi: `# साहित्य और विचार का अंतरंग संसार\n\nयहाँ अपना निबंध आरंभ करें। साहित्य मनुष्य की संवेदना और भाषा के गहरे संबंधों की खोज है।\n\n> "साहित्य वही है जो जीवन को सार्थकता और गहराई दे।"\n> — प्रेमचंद\n\n## §१. भाषा और संवेदना\n\nजब कोई लेखक अपने समय की सच्चाई को शब्द देता है, तो वह केवल एक कथा नहीं कहता, बल्कि मनुष्य की भीतरी यात्रा को रेखांकित करता है।\n\n## §२. पाठकीय विमर्श\n\nसाहित्यिक अध्ययन में टिप्पणियाँ और पाद-टिप्पणियाँ विचार को नई दिशा प्रदान करती हैं[^१]।\n\n[^१]: समकालीन साहित्यिक विमर्श और पाठकीय अनुभव से उद्धृत।\n`,
};

/**
 * PostEditor — The Author’s Desk & Literary Folio Composition Suite
 */
export function PostEditor({ initialPost = null }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { setIsDraftSaved, openTab, incrementEssaysVersion } = useWorkspaceStore();

  const [id, setId] = useState(initialPost?.id || null);
  const [language, setLanguage] = useState(initialPost?.language || 'en');
  const [title, setTitle] = useState(initialPost?.title || '');
  const [section, setSection] = useState(initialPost?.section || LITERARY_SECTIONS[0]);
  const [tagsInput, setTagsInput] = useState((initialPost?.tags || ['literature']).join(', '));
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || '');
  const [epigraphQuote, setEpigraphQuote] = useState(initialPost?.epigraph?.quote || '');
  const [epigraphAuthor, setEpigraphAuthor] = useState(initialPost?.epigraph?.attribution || '');
  const [status, setStatus] = useState(initialPost?.status || 'draft');
  const [content, setContent] = useState(
    initialPost?.content || LITERARY_TEMPLATES[initialPost?.language || 'en']
  );

  const [isLoading, setIsLoading] = useState(!initialPost && slug && slug !== 'new');
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const autosaveTimerRef = useRef(null);

  // Load existing essay if editing by slug
  useEffect(() => {
    if (!initialPost && slug && slug !== 'new' && slug !== 'new-folio') {
      setIsLoading(true);
      postService
        .getBySlug(slug)
        .then((essay) => {
          setId(essay.id);
          setLanguage(essay.language || 'en');
          setTitle(essay.title);
          setSection(essay.section || LITERARY_SECTIONS[0]);
          setTagsInput((essay.tags || []).join(', '));
          setExcerpt(essay.excerpt || '');
          setEpigraphQuote(essay.epigraph?.quote || '');
          setEpigraphAuthor(essay.epigraph?.attribution || '');
          setStatus(essay.status || 'draft');
          setContent(essay.content || '');
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [slug, initialPost]);

  // Handle switching language
  const handleLanguageChange = (newLang) => {
    if (newLang === language) return;
    // If content is empty or equals one of the default templates, swap template
    const isDefaultContent =
      !content.trim() ||
      content === LITERARY_TEMPLATES.en ||
      content === LITERARY_TEMPLATES.hi ||
      content === LITERARY_TEMPLATES.ur;

    setLanguage(newLang);
    if (isDefaultContent) {
      setContent(LITERARY_TEMPLATES[newLang]);
    }
  };

  // Autosave to localStorage on any edit
  useEffect(() => {
    setIsDraftSaved(false);
    clearTimeout(autosaveTimerRef.current);

    autosaveTimerRef.current = setTimeout(() => {
      const draftData = {
        language,
        title,
        section,
        tags: tagsInput.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean),
        excerpt,
        epigraph: epigraphQuote ? { quote: epigraphQuote, attribution: epigraphAuthor } : null,
        status,
        content,
        timestamp: Date.now(),
      };
      storage.set('marginalia_active_draft', draftData);
      setIsDraftSaved(true);
    }, 700);

    return () => clearTimeout(autosaveTimerRef.current);
  }, [language, title, section, tagsInput, excerpt, epigraphQuote, epigraphAuthor, status, content, setIsDraftSaved]);

  const handleSave = async (forceStatus = null) => {
    setIsSaving(true);
    const saveStatus = forceStatus || status;
    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const epigraph = epigraphQuote.trim()
      ? { quote: epigraphQuote.trim(), attribution: epigraphAuthor.trim() || 'Anonymous' }
      : null;

    const fallbackTitle =
      language === 'hi' ? 'शीर्षकहीन निबंध' : 'Untitled Essay';

    try {
      let savedEssay;
      if (id) {
        savedEssay = await postService.update(id, {
          title: title.trim() || fallbackTitle,
          language,
          section,
          tags: parsedTags,
          excerpt: excerpt.trim() || content.slice(0, 140).replace(/[#*`]/g, '') + '...',
          epigraph,
          status: saveStatus,
          content,
        });
      } else {
        savedEssay = await postService.create({
          title: title.trim() || fallbackTitle,
          language,
          section,
          tags: parsedTags,
          excerpt: excerpt.trim() || content.slice(0, 140).replace(/[#*`]/g, '') + '...',
          epigraph,
          status: saveStatus,
          content,
        });
        setId(savedEssay.id);
      }

      setStatus(saveStatus);
      setJustSaved(true);
      setIsDraftSaved(true);
      incrementEssaysVersion();
      storage.remove('marginalia_active_draft');

      // Update open tab
      openTab({
        id: savedEssay.id,
        slug: savedEssay.slug,
        title: `№ ${String(savedEssay.essayNumber || 1).padStart(2, '0')} ${savedEssay.title.slice(0, 18)}...`,
        type: 'essay',
      });

      setTimeout(() => {
        setJustSaved(false);
        if (saveStatus === 'published') {
          navigate(`/essays/${savedEssay.slug}`);
        }
      }, 500);
    } catch (err) {
      console.error('Failed to save essay:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const isHindi = language === 'hi';

  if (isLoading) {
    return (
      <div
        style={{
          padding: '60px 24px',
          textAlign: 'center',
          fontFamily: 'var(--font-serif)',
          color: 'var(--text-muted)',
        }}
      >
        <span className="fleuron" style={{ fontSize: '1.6rem' }}>❧</span>
        <div style={{ marginTop: '8px' }}>Retrieving manuscript for editing...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--bg-canvas)',
        overflow: 'hidden',
      }}
    >
      {/* Editor Meta Topbar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          padding: '12px 18px',
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-default)',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {/* Row 1: Essay Title and Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
            <span className="fleuron" style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>❧</span>
            <input
              type="text"
              value={title}
              lang={language}
              dir="ltr"
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                isHindi
                  ? 'निबंध का शीर्षक (उदा. प्रेमचंद और साधारण गाँव)...'
                  : 'Essay Title (e.g. On Reading Slowly)...'
              }
              style={{
                flex: 1,
                fontSize: isHindi ? '17px' : '16px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                fontFamily: isHindi
                  ? 'var(--font-serif-hi)'
                  : 'var(--font-serif)',
                textAlign: 'left',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Status toggle pill */}
            <button
              type="button"
              onClick={() => setStatus(status === 'published' ? 'draft' : 'published')}
              title="Click to toggle between Draft and Published status"
              style={{
                fontSize: '10px',
                padding: '4px 8px',
                borderRadius: 'var(--radius-1)',
                border: status === 'published' ? '1px solid var(--status-pub-border)' : '1px solid var(--status-draft-border)',
                backgroundColor: status === 'published' ? 'var(--status-pub-bg)' : 'var(--status-draft-bg)',
                color: status === 'published' ? 'var(--status-pub-text)' : 'var(--status-draft-text)',
                cursor: 'pointer',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {status === 'published' ? '● PUBLISHED' : '○ DRAFT'}
            </button>

            {/* Save Draft Button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleSave('draft')}
              disabled={isSaving}
            >
              SAVE DRAFT
            </Button>

            {/* Publish Essay Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleSave('published')}
              disabled={isSaving}
            >
              {justSaved ? (
                <>
                  <Check size={12} />
                  <span>SAVED</span>
                </>
              ) : (
                <>
                  <Feather size={12} />
                  <span>PUBLISH ESSAY</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Row 2: Language Selector, Section, Tags, Epigraph Inputs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px', fontSize: '11px' }}>
          {/* Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Globe size={13} style={{ color: 'var(--accent)' }} />
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>LANGUAGE:</span>
            <div
              style={{
                display: 'inline-flex',
                borderRadius: 'var(--radius-1)',
                border: '1px solid var(--border-default)',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-input)',
              }}
            >
              {[
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'हिन्दी' },
              ].map((langOpt) => {
                const isActive = language === langOpt.code;
                return (
                  <button
                    key={langOpt.code}
                    type="button"
                    onClick={() => handleLanguageChange(langOpt.code)}
                    style={{
                      padding: '3px 8px',
                      fontSize: '11px',
                      border: 'none',
                      backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                      color: isActive ? 'var(--bg-canvas)' : 'var(--text-secondary)',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      fontFamily:
                        langOpt.code === 'hi'
                          ? 'var(--font-serif-hi), var(--font-sans)'
                          : 'var(--font-sans)',
                      lineHeight: '1.4',
                    }}
                  >
                    {langOpt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={13} style={{ color: 'var(--text-muted)' }} />
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>SECTION:</span>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-1)',
                padding: '3px 8px',
                color: 'var(--text-primary)',
                fontSize: '11px',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
              }}
            >
              {LITERARY_SECTIONS.map((sec) => {
                const trans = SECTION_TRANSLATIONS[sec];
                const label = trans ? `${sec} (${trans.hi} / ${trans.ur})` : sec;
                return (
                  <option key={sec} value={sec}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: '180px' }}>
            <Tag size={13} style={{ color: 'var(--text-muted)' }} />
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>TAGS:</span>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. poetry, mir, classical, translation"
              style={{
                flex: 1,
                maxWidth: '260px',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-1)',
                padding: '3px 8px',
                color: 'var(--text-primary)',
                fontSize: '11px',
                fontFamily: 'var(--font-sans)',
              }}
            />
          </div>

          {/* Epigraph */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Quote size={13} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={epigraphQuote}
              onChange={(e) => setEpigraphQuote(e.target.value)}
              placeholder="Epigraph quote (optional)..."
              style={{
                width: '180px',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-1)',
                padding: '3px 8px',
                color: 'var(--text-primary)',
                fontSize: '11px',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
              }}
            />
            <input
              type="text"
              value={epigraphAuthor}
              onChange={(e) => setEpigraphAuthor(e.target.value)}
              placeholder="Attribution"
              style={{
                width: '100px',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-1)',
                padding: '3px 8px',
                color: 'var(--text-primary)',
                fontSize: '11px',
                fontFamily: 'var(--font-sans)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Split Pane Editor (Write / Preview) */}
      <EditorSplitPane content={content} onChange={setContent} language={language} />
    </div>
  );
}
