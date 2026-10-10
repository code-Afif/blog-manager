import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Strikethrough,
  Underline as UnderlineIcon,
  Highlighter,
  Link as LinkIcon,
  Image as ImageIcon,
  Quote,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  MoreHorizontal,
  ChevronDown,
  Minus,
  MessageSquare,
  Bookmark,
  Languages,
} from 'lucide-react';
import './RichTextEditor.css';

export function RichTextEditor({
  content = '',
  onChange,
  onAutosaveTrigger,
  isRtl = false,
  language = 'en',
  onToggleRtl,
}) {
  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [slashMenuPos, setSlashMenuPos] = useState({ top: 0, left: 0 });

  const styleDropdownRef = useRef(null);
  const moreDropdownRef = useRef(null);

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (styleDropdownRef.current && !styleDropdownRef.current.contains(e.target)) {
        setStyleDropdownOpen(false);
      }
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(e.target)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const [bubblePos, setBubblePos] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Underline,
      Highlight.configure({ multicolor: false }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
    ],
    content,
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      if (from !== to && editor.isFocused) {
        try {
          const coords = editor.view.coordsAtPos(from);
          setBubblePos({
            top: coords.top + window.scrollY - 44,
            left: Math.max(20, coords.left + window.scrollX - 40),
          });
        } catch (_) {
          setBubblePos(null);
        }
      } else {
        setBubblePos(null);
      }
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      if (onAutosaveTrigger) {
        onAutosaveTrigger();
      }

      // Check for slash command at start of empty line
      const { selection } = editor.state;
      const { $from } = selection;
      const textBefore = $from.parent.textContent;
      if (textBefore === '/' && $from.parent.type.name === 'paragraph') {
        const coords = editor.view.coordsAtPos($from.pos);
        setSlashMenuPos({
          top: coords.bottom + window.scrollY + 6,
          left: coords.left + window.scrollX,
        });
        setSlashMenuOpen(true);
      } else {
        setSlashMenuOpen(false);
      }
    },
  });

  // Keep editor content in sync if external initial content changes
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      // Only set if editor is currently empty or substantially different
      if (editor.isEmpty) {
        editor.commands.setContent(content, false);
      }
    }
  }, [content, editor]);

  const handleSetLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter destination URL:', previousUrl || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const handleInsertImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Enter image URL (https://...):');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const handleInsertDivider = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().setHorizontalRule().run();
    setSlashMenuOpen(false);
  }, [editor]);

  const handleInsertPullQuote = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().toggleBlockquote().run();
    setSlashMenuOpen(false);
  }, [editor]);

  const handleInsertFootnote = useCallback(() => {
    if (!editor) return;
    const note = window.prompt('Enter footnote citation or archival reference:');
    if (note) {
      editor
        .chain()
        .focus()
        .insertContent(`<sup>[1]</sup> <em>(${note})</em> `)
        .run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  // Active style label
  let activeStyle = 'Paragraph';
  if (editor.isActive('heading', { level: 2 })) activeStyle = 'Heading';
  else if (editor.isActive('heading', { level: 3 })) activeStyle = 'Subheading';
  else if (editor.isActive('blockquote')) activeStyle = 'Quote';

  return (
    <div
      className="marginalia-rich-editor-wrapper"
      dir={isRtl ? 'rtl' : 'ltr'}
      lang={language}
    >
      {/* 1. Sticky Formatting Toolbar */}
      <div
        className="editor-formatting-toolbar"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'var(--bg-canvas)',
          borderBottom: '1px solid var(--border-default)',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          flexWrap: 'nowrap',
          overflowX: 'auto',
          userSelect: 'none',
        }}
      >
        {/* Style Dropdown */}
        <div ref={styleDropdownRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setStyleDropdownOpen(!styleDropdownOpen)}
            title="Text style"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              border: '1px solid var(--border-default)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontFamily: 'var(--font-sans)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <span>{activeStyle}</span>
            <ChevronDown size={13} />
          </button>

          {styleDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                left: 0,
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                padding: '4px 0',
                zIndex: 60,
                minWidth: '140px',
              }}
            >
              {[
                { label: 'Paragraph', action: () => editor.chain().focus().setParagraph().run() },
                { label: 'Heading', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
                { label: 'Subheading', action: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
                { label: 'Quote', action: () => editor.chain().focus().toggleBlockquote().run() },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    item.action();
                    setStyleDropdownOpen(false);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '6px 12px',
                    fontSize: '13px',
                    fontFamily: 'var(--font-sans)',
                    border: 'none',
                    background: 'none',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-subtle)', margin: '0 4px' }} />

        {/* Basic Inlines: Bold, Italic, Strikethrough, Underline, Highlight, Link */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`bubble-btn ${editor.isActive('bold') ? 'is-active' : ''}`}
          title="Bold (Ctrl+B)"
        >
          <Bold size={15} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`bubble-btn ${editor.isActive('italic') ? 'is-active' : ''}`}
          title="Italic (Ctrl+I)"
        >
          <Italic size={15} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`bubble-btn ${editor.isActive('underline') ? 'is-active' : ''}`}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon size={15} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`bubble-btn ${editor.isActive('strike') ? 'is-active' : ''}`}
          title="Strikethrough"
        >
          <Strikethrough size={15} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`bubble-btn ${editor.isActive('highlight') ? 'is-active' : ''}`}
          title="Highlight"
        >
          <Highlighter size={15} />
        </button>

        <button
          type="button"
          onClick={handleSetLink}
          className={`bubble-btn ${editor.isActive('link') ? 'is-active' : ''}`}
          title="Add Link (Ctrl+K)"
        >
          <LinkIcon size={15} />
        </button>

        <button
          type="button"
          onClick={handleInsertImage}
          className="bubble-btn"
          title="Insert image"
        >
          <ImageIcon size={15} />
        </button>

        <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-subtle)', margin: '0 4px' }} />

        {/* Lists & Quotes */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`bubble-btn ${editor.isActive('blockquote') ? 'is-active' : ''}`}
          title="Block quote"
        >
          <Quote size={15} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`bubble-btn ${editor.isActive('bulletList') ? 'is-active' : ''}`}
          title="Bulleted list"
        >
          <List size={15} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`bubble-btn ${editor.isActive('orderedList') ? 'is-active' : ''}`}
          title="Numbered list"
        >
          <ListOrdered size={15} />
        </button>

        <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-subtle)', margin: '0 4px' }} />

        {/* Alignments: Left, Center, Right */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`bubble-btn ${editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}`}
          title="Align Left"
        >
          <AlignLeft size={15} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`bubble-btn ${editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}`}
          title="Align Center"
        >
          <AlignCenter size={15} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`bubble-btn ${editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}`}
          title="Align Right"
        >
          <AlignRight size={15} />
        </button>

        <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-subtle)', margin: '0 4px' }} />

        {/* Undo, Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="bubble-btn"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={15} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="bubble-btn"
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 size={15} />
        </button>

        {/* "More" dropdown */}
        <div ref={moreDropdownRef} style={{ position: 'relative', marginLeft: 'auto' }}>
          <button
            type="button"
            onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
            className="bubble-btn"
            title="More options"
          >
            <MoreHorizontal size={16} />
          </button>

          {moreDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                right: 0,
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                padding: '4px 0',
                zIndex: 60,
                minWidth: '170px',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  handleInsertDivider();
                  setMoreDropdownOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '7px 12px',
                  fontSize: '13px',
                  fontFamily: 'var(--font-sans)',
                  border: 'none',
                  background: 'none',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Minus size={14} />
                <span>Divider (* * *)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().toggleBlockquote().run();
                  setMoreDropdownOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '7px 12px',
                  fontSize: '13px',
                  fontFamily: 'var(--font-sans)',
                  border: 'none',
                  background: 'none',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Quote size={14} />
                <span>Pull quote</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleInsertFootnote();
                  setMoreDropdownOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '7px 12px',
                  fontSize: '13px',
                  fontFamily: 'var(--font-sans)',
                  border: 'none',
                  background: 'none',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Bookmark size={14} />
                <span>Footnote</span>
              </button>

              <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '4px 0' }} />

              <button
                type="button"
                onClick={() => {
                  if (onToggleRtl) onToggleRtl();
                  setMoreDropdownOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '7px 12px',
                  fontSize: '13px',
                  fontFamily: 'var(--font-sans)',
                  border: 'none',
                  background: 'none',
                  color: isRtl ? 'var(--accent)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontWeight: isRtl ? 600 : 400,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Languages size={14} />
                <span>{isRtl ? 'Right-to-left: ON' : 'Right-to-left toggle'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Floating Selection Bubble Menu */}
      {bubblePos && (
        <div
          className="editor-bubble-menu"
          style={{
            position: 'absolute',
            top: `${bubblePos.top}px`,
            left: `${bubblePos.left}px`,
          }}
        >
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleBold().run();
            }}
            className={`bubble-btn ${editor.isActive('bold') ? 'is-active' : ''}`}
            title="Bold"
          >
            <Bold size={13} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleItalic().run();
            }}
            className={`bubble-btn ${editor.isActive('italic') ? 'is-active' : ''}`}
            title="Italic"
          >
            <Italic size={13} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              handleSetLink();
            }}
            className={`bubble-btn ${editor.isActive('link') ? 'is-active' : ''}`}
            title="Link"
          >
            <LinkIcon size={13} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleBlockquote().run();
            }}
            className={`bubble-btn ${editor.isActive('blockquote') ? 'is-active' : ''}`}
            title="Quote"
          >
            <Quote size={13} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleHighlight().run();
            }}
            className={`bubble-btn ${editor.isActive('highlight') ? 'is-active' : ''}`}
            title="Highlight"
          >
            <Highlighter size={13} />
          </button>
        </div>
      )}

      {/* 3. Slash Command Insert Menu */}
      {slashMenuOpen && (
        <div
          className="slash-insert-menu"
          style={{
            top: `${slashMenuPos.top}px`,
            left: `${slashMenuPos.left}px`,
          }}
        >
          <button
            type="button"
            className="slash-item"
            onClick={() => {
              editor.chain().focus().deleteRange({ from: editor.state.selection.from - 1, to: editor.state.selection.from }).run();
              handleInsertImage();
              setSlashMenuOpen(false);
            }}
          >
            <ImageIcon size={15} />
            <span>Image</span>
          </button>
          <button
            type="button"
            className="slash-item"
            onClick={() => {
              editor.chain().focus().deleteRange({ from: editor.state.selection.from - 1, to: editor.state.selection.from }).run();
              handleInsertDivider();
            }}
          >
            <Minus size={15} />
            <span>Divider (* * *)</span>
          </button>
          <button
            type="button"
            className="slash-item"
            onClick={() => {
              editor.chain().focus().deleteRange({ from: editor.state.selection.from - 1, to: editor.state.selection.from }).run();
              handleInsertPullQuote();
            }}
          >
            <Quote size={15} />
            <span>Pull quote</span>
          </button>
          <button
            type="button"
            className="slash-item"
            onClick={() => {
              editor.chain().focus().deleteRange({ from: editor.state.selection.from - 1, to: editor.state.selection.from }).run();
              editor.chain().focus().toggleBlockquote().run();
              setSlashMenuOpen(false);
            }}
          >
            <MessageSquare size={15} />
            <span>Quote</span>
          </button>
        </div>
      )}

      {/* 4. Editor Body Content */}
      <div
        style={{
          fontFamily:
            language === 'ur'
              ? 'var(--font-urdu)'
              : language === 'hi'
              ? 'var(--font-hindi)'
              : 'var(--font-serif)',
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
