import React, { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-docker';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-c';
import { Copy, Check, Terminal } from 'lucide-react';

export function CodeBlock({ language = 'text', code = '' }) {
  const [copied, setCopied] = useState(false);

  const cleanCode = typeof code === 'string' ? code.trim() : String(code);
  const lines = cleanCode.split('\n');

  // Map language aliases
  const langNormalized = {
    js: 'javascript',
    ts: 'typescript',
    rs: 'rust',
    sh: 'bash',
    shell: 'bash',
    golang: 'go',
    yml: 'yaml',
  }[language.toLowerCase()] || language.toLowerCase();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.warn('Failed to copy code:', err);
    }
  };

  const highlightedCode = React.useMemo(() => {
    const grammar = Prism.languages[langNormalized];
    if (grammar) {
      try {
        return Prism.highlight(cleanCode, grammar, langNormalized);
      } catch (e) {
        return cleanCode;
      }
    }
    return cleanCode;
  }, [cleanCode, langNormalized]);

  return (
    <div className="code-block-container" style={{ position: 'relative' }}>
      <div className="code-block-header">
        <span className="code-lang-tag">
          <Terminal size={12} />
          {langNormalized || 'text'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className={`code-copy-btn ${copied ? 'copied' : ''}`}
          aria-label="Copy code block"
        >
          {copied ? (
            <>
              <Check size={11} />
              <span>COPIED</span>
            </>
          ) : (
            <>
              <Copy size={11} />
              <span>COPY</span>
            </>
          )}
        </button>
      </div>

      <div className="code-block-body">
        {/* Line Numbers Gutter */}
        <div className="code-gutter-col" aria-hidden="true">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Code Content */}
        <div className="code-content-col">
          <pre>
            <code
              className={`language-${langNormalized}`}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </pre>
        </div>
      </div>
    </div>
  );
}
