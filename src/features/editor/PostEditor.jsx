import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService } from '../../lib/postService';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { EditorSplitPane } from './EditorSplitPane';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Save, Check, FileCode, Tag, Folder, ArrowLeft } from 'lucide-react';
import { storage } from '../../lib/storage';

export function PostEditor({ initialPost = null }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { setIsDraftSaved, openTab, incrementPostsVersion } = useWorkspaceStore();

  const [id, setId] = useState(initialPost?.id || null);
  const [title, setTitle] = useState(initialPost?.title || '');
  const [folder, setFolder] = useState(initialPost?.folder || 'dev');
  const [tagsInput, setTagsInput] = useState((initialPost?.tags || ['dev']).join(', '));
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || '');
  const [status, setStatus] = useState(initialPost?.status || 'published');
  const [content, setContent] = useState(
    initialPost?.content ||
      '# Architecture & Implementation\n\nStart writing technical notes with real code blocks...\n\n```rust\nfn main() {\n    println!("Hello devlog!");\n}\n```\n'
  );

  const [isLoading, setIsLoading] = useState(!initialPost && slug && slug !== 'new');
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const autosaveTimerRef = useRef(null);

  // Load existing post if editing by slug
  useEffect(() => {
    if (!initialPost && slug && slug !== 'new') {
      setIsLoading(true);
      postService
        .getBySlug(slug)
        .then((post) => {
          setId(post.id);
          setTitle(post.title);
          setFolder(post.folder || 'dev');
          setTagsInput((post.tags || []).join(', '));
          setExcerpt(post.excerpt || '');
          setStatus(post.status || 'published');
          setContent(post.content || '');
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [slug, initialPost]);

  // Autosave to localStorage on content/title change
  useEffect(() => {
    setIsDraftSaved(false);
    clearTimeout(autosaveTimerRef.current);

    autosaveTimerRef.current = setTimeout(() => {
      const draftData = {
        title,
        folder,
        tags: tagsInput.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean),
        excerpt,
        status,
        content,
        timestamp: Date.now(),
      };
      storage.set('devlog_active_draft', draftData);
      setIsDraftSaved(true);
    }, 700);

    return () => clearTimeout(autosaveTimerRef.current);
  }, [title, folder, tagsInput, excerpt, status, content, setIsDraftSaved]);

  const handleSave = async () => {
    setIsSaving(true);
    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    try {
      let savedPost;
      if (id) {
        savedPost = await postService.update(id, {
          title,
          folder,
          tags: parsedTags,
          excerpt,
          status,
          content,
        });
      } else {
        savedPost = await postService.create({
          title: title || 'Untitled Note',
          folder,
          tags: parsedTags,
          excerpt,
          status,
          content,
        });
        setId(savedPost.id);
      }

      setJustSaved(true);
      setIsDraftSaved(true);
      incrementPostsVersion();
      storage.remove('devlog_active_draft');

      // Update open tab
      openTab({
        id: savedPost.id,
        slug: savedPost.slug,
        title: savedPost.filename,
        type: 'post',
      });

      setTimeout(() => {
        setJustSaved(false);
        navigate(`/posts/${savedPost.slug}`);
      }, 500);
    } catch (err) {
      console.error('Failed to save post:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '32px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
        Loading document editor...
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
          padding: '10px 16px',
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-default)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
            <FileCode size={15} style={{ color: 'var(--accent)' }} />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title (e.g. Postgres WAL Internals)..."
              style={{
                flex: 1,
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                fontFamily: 'var(--font-mono)',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Status toggle */}
            <button
              type="button"
              onClick={() => setStatus(status === 'published' ? 'draft' : 'published')}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                padding: '3px 8px',
                borderRadius: 'var(--radius-1)',
                border: status === 'published' ? '1px solid var(--status-pub-border)' : '1px solid var(--status-draft-border)',
                backgroundColor: status === 'published' ? 'var(--status-pub-bg)' : 'var(--status-draft-bg)',
                color: status === 'published' ? 'var(--status-pub-text)' : 'var(--status-draft-text)',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              STATUS: {status.toUpperCase()}
            </button>

            {/* Save Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              {justSaved ? (
                <>
                  <Check size={12} />
                  <span>SAVED</span>
                </>
              ) : (
                <>
                  <Save size={12} />
                  <span>{id ? 'UPDATE' : 'PUBLISH'}</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Second Row: Folder and Tags inputs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', fontSize: '11px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Folder size={12} style={{ color: 'var(--text-muted)' }} />
            <span style={{ color: 'var(--text-muted)' }}>FOLDER:</span>
            <input
              type="text"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              placeholder="sys, db, web..."
              style={{
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-1)',
                padding: '2px 6px',
                color: 'var(--text-primary)',
                fontSize: '11px',
                width: '70px',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
            <Tag size={12} style={{ color: 'var(--text-muted)' }} />
            <span style={{ color: 'var(--text-muted)' }}>TAGS:</span>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="comma separated tags (e.g. rust, concurrency, memory)"
              style={{
                flex: 1,
                maxWidth: '400px',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-1)',
                padding: '2px 6px',
                color: 'var(--text-primary)',
                fontSize: '11px',
              }}
            />
          </div>
        </div>
      </div>

      {/* Split Pane Editor */}
      <EditorSplitPane content={content} onChange={setContent} />
    </div>
  );
}
