import React from 'react';
import { RefreshCw, Plus } from 'lucide-react';

export function EmptySearchState({ query = '', onReset }) {
  return (
    <div
      style={{
        padding: '48px 24px',
        margin: '24px 0',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: '12px',
        textAlign: 'center',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: '18px',
          color: 'var(--text-primary)',
          marginBottom: '8px',
        }}
      >
        Nothing found
      </div>

      <p
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '15px',
          color: 'var(--text-muted)',
          lineHeight: 1.6,
          maxWidth: '52ch',
          margin: '0 auto 20px',
        }}
      >
        {query
          ? `No essays or notes match “${query}”. Try adjusting your search words or clearing the selection.`
          : 'No writing matches the selected section. Choose another section or view all essays.'}
      </p>

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="button-create"
          style={{
            padding: '8px 16px',
            fontSize: '12px',
          }}
        >
          <span>View all writing</span>
        </button>
      )}
    </div>
  );
}

export function EmptyShelfState({ onExplore, filterType = 'bookmarks' }) {
  const isLiked = filterType === 'liked';

  return (
    <div
      style={{
        padding: '48px 24px',
        margin: '24px 0',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: '12px',
        textAlign: 'center',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.4rem',
          fontWeight: 400,
          color: 'var(--text-primary)',
          marginBottom: '8px',
        }}
      >
        {isLiked ? 'No appreciated essays yet' : 'Your reading list is empty'}
      </div>

      <p
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '15px',
          color: 'var(--text-muted)',
          maxWidth: '50ch',
          margin: '0 auto 24px',
          lineHeight: 1.6,
        }}
      >
        {isLiked
          ? 'Essays and notes you appreciate with a heart will be kept here for easy return.'
          : 'Save thoughtful essays and notes to return to them at a quieter hour.'}
      </p>

      {onExplore && (
        <button
          type="button"
          onClick={onExplore}
          className="button-create"
          style={{
            padding: '8px 18px',
            fontSize: '12px',
          }}
        >
          <span>Explore writing</span>
        </button>
      )}
    </div>
  );
}

export function EmptyDeskState({ onWrite }) {
  return (
    <div
      style={{
        padding: '54px 24px',
        margin: '24px 0',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: '12px',
        textAlign: 'center',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <h3
        style={{
          fontSize: '1.35rem',
          fontWeight: 400,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-display)',
          marginBottom: '8px',
        }}
      >
        Your desk is clear. Begin something new.
      </h3>

      <p
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '15px',
          color: 'var(--text-muted)',
          maxWidth: '48ch',
          margin: '0 auto 22px',
          lineHeight: 1.6,
        }}
      >
        Every essay starts with a single observation. Take a seat and write freely.
      </p>

      {onWrite && (
        <button
          type="button"
          onClick={onWrite}
          className="button-create"
          style={{
            padding: '8px 18px',
            fontSize: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Plus size={14} />
          <span>Create Essay</span>
        </button>
      )}
    </div>
  );
}
