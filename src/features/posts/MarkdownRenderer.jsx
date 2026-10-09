import React, { useRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';
import { generateHeadingId } from '../../lib/utils';

export function MarkdownRenderer({ content = '', lang = 'en', dir = null, onHeadingsExtracted }) {
  const plateCounterRef = useRef(0);
  plateCounterRef.current = 0;

  React.useEffect(() => {
    if (!onHeadingsExtracted || !content) return;

    // Extract headings from markdown text for the Section Outline
    const lines = content.split('\n');
    const headings = [];

    lines.forEach((line, idx) => {
      const match = line.match(/^(#{1,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim().replace(/\*\*/g, '').replace(/`/g, '');
        const id = generateHeadingId(text, idx);
        headings.push({ level, text, id });
      }
    });

    onHeadingsExtracted(headings);
  }, [content, onHeadingsExtracted]);

  const computedDir = dir || (lang === 'ur' ? 'rtl' : 'ltr');

  return (
    <div
      className="reading-content"
      lang={lang}
      dir={computedDir}
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
              <div
                className="pull-quote"
                lang={lang}
                dir={computedDir}
              >
                {children}
              </div>
            );
          },
          h1({ children }) {
            const text = String(children);
            const id = generateHeadingId(text);
            return <h1 id={id} lang={lang}>{children}</h1>;
          },
          h2({ children }) {
            const text = String(children);
            const id = generateHeadingId(text);
            return <h2 id={id} lang={lang}>{children}</h2>;
          },
          h3({ children }) {
            const text = String(children);
            const id = generateHeadingId(text);
            return <h3 id={id} lang={lang}>{children}</h3>;
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
