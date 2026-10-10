import React, { useRef, useMemo, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DOMPurify from 'dompurify';
import { CodeBlock } from './CodeBlock';
import { generateHeadingId } from '../../lib/utils';

export function MarkdownRenderer({ content = '', lang = 'en', dir = null, onHeadingsExtracted }) {
  const plateCounterRef = useRef(0);
  plateCounterRef.current = 0;

  const isHtml = useMemo(() => {
    return /<[a-z][\s\S]*>/i.test(content);
  }, [content]);

  // Extract headings for Table of Contents and inject IDs into HTML headings
  const { processedHtml, headings } = useMemo(() => {
    if (!content) return { processedHtml: '', headings: [] };

    if (isHtml) {
      const extractedHeadings = [];
      let headingIndex = 0;

      // Replace headings with IDs for anchor linking in TableOfContents
      const withIds = content.replace(/<h([2-3])([^>]*)>(.*?)<\/h\1>/gi, (match, level, attrs, innerText) => {
        headingIndex += 1;
        const plainText = innerText.replace(/<[^>]*>/g, '').trim();
        const id = generateHeadingId(plainText, headingIndex);
        extractedHeadings.push({
          level: parseInt(level, 10),
          text: plainText,
          id,
        });
        return `<h${level}${attrs} id="${id}">${innerText}</h${level}>`;
      });

      const sanitized = DOMPurify.sanitize(withIds, {
        ADD_TAGS: ['mark'],
        ADD_ATTR: ['target', 'id', 'dir', 'lang', 'class'],
      });

      return { processedHtml: sanitized, headings: extractedHeadings };
    }

    // Markdown heading extraction
    const lines = content.split('\n');
    const mdHeadings = [];
    lines.forEach((line, idx) => {
      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim().replace(/\*\*/g, '').replace(/`/g, '');
        const id = generateHeadingId(text, idx);
        mdHeadings.push({ level, text, id });
      }
    });

    return { processedHtml: '', headings: mdHeadings };
  }, [content, isHtml]);

  useEffect(() => {
    if (onHeadingsExtracted) {
      onHeadingsExtracted(headings);
    }
  }, [headings, onHeadingsExtracted]);

  const computedDir = dir || (lang === 'ur' ? 'rtl' : 'ltr');

  if (isHtml) {
    return (
      <div
        className="reading-content"
        lang={lang}
        dir={computedDir}
        style={{
          fontFamily:
            lang === 'ur'
              ? 'var(--font-urdu)'
              : lang === 'hi'
              ? 'var(--font-hindi)'
              : 'var(--font-serif)',
          lineHeight: lang === 'ur' ? 2.1 : 1.85,
        }}
        dangerouslySetInnerHTML={{ __html: processedHtml }}
      />
    );
  }

  return (
    <div
      className="reading-content"
      lang={lang}
      dir={computedDir}
      style={{
        fontFamily:
          lang === 'ur'
            ? 'var(--font-urdu)'
            : lang === 'hi'
            ? 'var(--font-hindi)'
            : 'var(--font-serif)',
      }}
    >
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');

            if (!inline && (match || codeString.includes('\n'))) {
              plateCounterRef.current += 1;
              return (
                <CodeBlock
                  language={match ? match[1] : 'text'}
                  code={codeString}
                  plateIndex={plateCounterRef.current}
                />
              );
            }

            return (
              <code className="inline-code" {...props}>
                {children}
              </code>
            );
          },
          blockquote({ children }) {
            return (
              <div className="pull-quote" lang={lang} dir={computedDir}>
                {children}
              </div>
            );
          },
          h1({ children }) {
            const text = String(children);
            const id = generateHeadingId(text);
            return (
              <h1 id={id} lang={lang}>
                {children}
              </h1>
            );
          },
          h2({ children }) {
            const text = String(children);
            const id = generateHeadingId(text);
            return (
              <h2 id={id} lang={lang}>
                {children}
              </h2>
            );
          },
          h3({ children }) {
            const text = String(children);
            const id = generateHeadingId(text);
            return (
              <h3 id={id} lang={lang}>
                {children}
              </h3>
            );
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
