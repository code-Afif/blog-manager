import { useRef, useEffect } from 'react';

/**
 * Synchronizes scrolling between editor textarea and preview pane
 */
export function useSyncScroll() {
  const editorRef = useRef(null);
  const previewRef = useRef(null);
  const isScrollingRef = useRef(null);

  useEffect(() => {
    const editor = editorRef.current;
    const preview = previewRef.current;
    if (!editor || !preview) return;

    const handleEditorScroll = () => {
      if (isScrollingRef.current === 'preview') return;
      isScrollingRef.current = 'editor';

      const editorScrollable = editor.scrollHeight - editor.clientHeight;
      if (editorScrollable <= 0) return;

      const percentage = editor.scrollTop / editorScrollable;
      const previewScrollable = preview.scrollHeight - preview.clientHeight;
      preview.scrollTop = percentage * previewScrollable;

      clearTimeout(window._syncTimer);
      window._syncTimer = setTimeout(() => {
        isScrollingRef.current = null;
      }, 50);
    };

    const handlePreviewScroll = () => {
      if (isScrollingRef.current === 'editor') return;
      isScrollingRef.current = 'preview';

      const previewScrollable = preview.scrollHeight - preview.clientHeight;
      if (previewScrollable <= 0) return;

      const percentage = preview.scrollTop / previewScrollable;
      const editorScrollable = editor.scrollHeight - editor.clientHeight;
      editor.scrollTop = percentage * editorScrollable;

      clearTimeout(window._syncTimer);
      window._syncTimer = setTimeout(() => {
        isScrollingRef.current = null;
      }, 50);
    };

    editor.addEventListener('scroll', handleEditorScroll, { passive: true });
    preview.addEventListener('scroll', handlePreviewScroll, { passive: true });

    return () => {
      editor.removeEventListener('scroll', handleEditorScroll);
      preview.removeEventListener('scroll', handlePreviewScroll);
      clearTimeout(window._syncTimer);
    };
  }, []);

  return { editorRef, previewRef };
}
