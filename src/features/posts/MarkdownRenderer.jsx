import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';
import { generateSlug } from '../../lib/utils';

export function MarkdownRenderer({ content = '', onHeadingsExtracted }) {
  React.useEffect(() => {
    if (!onHeadingsExtracted || !content) return;

    // Extract headings from markdown text for Table Of Contents
    const lines = content.split('\n');
    const headings = [];

    lines.forEach((line) => {
      const match = line.match(/^(#{1,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim().replace(/\*\*/g, '').replace(/`/g, '');
        const id = generateSlug(text);
        headings.push({ level, text, id });
      }
    });

    onHeadingsExtracted(headings);
  }, [content, onHeadingsExtracted]);

  return (
    <div className="reading-content">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');

            if (!inline && (match || codeString.includes('\n'))) {
              return (
                <CodeBlock
                  language={match ? match[1] : 'text'}
                  code={codeString}
                />
              );
            }

            return (
              <code className="inline-code" {...props}>
                {children}
              </code>
            );
          },
          h1({ children }) {
            const text = String(children);
            const id = generateSlug(text);
            return <h1 id={id}>{children}</h1>;
          },
          h2({ children }) {
            const text = String(children);
            const id = generateSlug(text);
            return <h2 id={id}>{children}</h2>;
          },
          h3({ children }) {
            const text = String(children);
            const id = generateSlug(text);
            return <h3 id={id}>{children}</h3>;
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
