import React, { useState, useEffect } from 'react';
import { useSyncScroll } from '../../hooks/useSyncScroll';
import { MarkdownRenderer } from '../posts/MarkdownRenderer';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { Edit3, Eye } from 'lucide-react';

export function EditorSplitPane({ content, onChange, language = 'en' }) {
  const { editorRef, previewRef } = useSyncScroll();
  const { setCursorPosition, setActiveWordCount } = useWorkspaceStore();
  const [mobileTab, setMobileTab] = useState('write'); // 'write' | 'preview'
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update cursor position and word count
  const handleTextareaSelection = (e) => {
    const textarea = e.target;
    const textBefore = textarea.value.slice(0, textarea.selectionStart);
    const lines = textBefore.split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    setCursorPosition({ line, col });

    const words = textarea.value.trim().split(/\s+/).filter(Boolean).length;
    setActiveWordCount(words);
  };

  const lineCount = Math.max(1, content.split('\n').length);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        height: '100%',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-canvas)',
      }}
    >
      {/* Mobile tab bar switcher for < 768px */}
      {isMobile && (
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-default)',
            backgroundColor: 'var(--bg-surface-elevated)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
          }}
        >
          <button
            type="button"
            onClick={() => setMobileTab('write')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px',
              backgroundColor: mobileTab === 'write' ? 'var(--bg-surface)' : 'transparent',
              color: mobileTab === 'write' ? 'var(--accent)' : 'var(--text-secondary)',
              borderBottom: mobileTab === 'write' ? '2px solid var(--accent)' : '2px solid transparent',
              fontWeight: mobileTab === 'write' ? 600 : 400,
            }}
          >
            <Edit3 size={13} />
            WRITE (.md)
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('preview')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px',
              backgroundColor: mobileTab === 'preview' ? 'var(--bg-surface)' : 'transparent',
              color: mobileTab === 'preview' ? 'var(--accent)' : 'var(--text-secondary)',
              borderBottom: mobileTab === 'preview' ? '2px solid var(--accent)' : '2px solid transparent',
              fontWeight: mobileTab === 'preview' ? 600 : 400,
            }}
          >
            <Eye size={13} />
            PREVIEW
          </button>
        </div>
      )}

      {/* Main split area */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          flex: 1,
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Left Pane: Markdown Source Editor */}
        {(!isMobile || mobileTab === 'write') && (
          <div
            style={{
              display: 'flex',
              height: '100%',
              overflow: 'hidden',
              backgroundColor: 'var(--code-bg)',
              borderRight: isMobile ? 'none' : '1px solid var(--border-default)',
            }}
          >
            {/* Gutter Line Numbers */}
            <div
              aria-hidden="true"
              style={{
                userSelect: 'none',
                backgroundColor: 'var(--code-gutter)',
                borderRight: '1px solid var(--border-subtle)',
                color: 'var(--code-gutter-text)',
                padding: '16px 8px 16px 12px',
                textAlign: 'right',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                lineHeight: '1.6',
                minWidth: '42px',
                overflowY: 'hidden',
              }}
            >
              {lineNumbers.map((n) => (
                <div key={n}>{n}</div>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              ref={editorRef}
              value={content}
              lang="en"
              dir="ltr"
              onChange={(e) => {
                onChange(e.target.value);
                handleTextareaSelection(e);
              }}
              onKeyUp={handleTextareaSelection}
              onClick={handleTextareaSelection}
              onSelect={handleTextareaSelection}
              placeholder="# Write your technical post here in markdown..."
              spellCheck="false"
              style={{
                flex: 1,
                height: '100%',
                padding: '18px',
                backgroundColor: 'transparent',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '13.5px',
                lineHeight: '1.7',
                textAlign: 'left',
                border: 'none',
                outline: 'none',
                resize: 'none',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            />
          </div>
        )}

        {/* Right Pane: Live Rendered Preview */}
        {(!isMobile || mobileTab === 'preview') && (
          <div
            ref={previewRef}
            dir="auto"
            lang="en"
            style={{
              height: '100%',
              overflowY: 'auto',
              padding: '24px 32px',
              backgroundColor: 'var(--bg-canvas)',
            }}
          >
            <div
              style={{
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '16px',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>LIVE AST PREVIEW ENGINE</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
                [STATUS: REALTIME_SYNC]
              </span>
            </div>
            <MarkdownRenderer content={content} lang="en" dir="auto" />
          </div>
        )}
      </div>
    </div>
  );
}
