import React from 'react';
import { useSocialStore } from '../../store/socialStore';
import { Heart, MessageSquare, Bookmark, UserPlus, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ActivityPage() {
  const { activities } = useSocialStore();

  const getActivityIcon = (type) => {
    switch (type) {
      case 'appreciation':
        return <Heart size={15} style={{ color: 'var(--accent)' }} fill="var(--accent)" />;
      case 'reply':
        return <MessageSquare size={15} style={{ color: 'var(--accent)' }} />;
      case 'save':
        return <Bookmark size={15} style={{ color: 'var(--accent)' }} fill="var(--accent)" />;
      case 'follow':
        return <UserPlus size={15} style={{ color: 'var(--accent)' }} />;
      default:
        return <Sparkles size={15} style={{ color: 'var(--accent)' }} />;
    }
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '680px',
        margin: '0 auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: '1px solid var(--border-default)',
          paddingBottom: '20px',
          marginBottom: '28px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--accent)',
            fontWeight: 600,
            display: 'block',
            marginBottom: '4px',
          }}
        >
          Reader Engagements
        </span>
        <h2
          style={{
            fontSize: '2rem',
            fontWeight: 400,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
            margin: 0,
          }}
        >
          Activity
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '15px',
            color: 'var(--text-secondary)',
            margin: '8px 0 0',
          }}
        >
          Recent appreciations, saved reading notes, and responses from fellow readers.
        </p>
      </div>

      {/* Activity List */}
      {activities.length === 0 ? (
        <div
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
          }}
        >
          <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-muted)', fontSize: '15px', margin: 0 }}>
            No recent activity to report.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: 'var(--border-subtle)', border: '1px solid var(--border-default)' }}>
          {activities.map((act) => (
            <div
              key={act.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                padding: '18px 20px',
                backgroundColor: 'var(--bg-surface)',
              }}
            >
              {/* Type icon */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-default)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                {getActivityIcon(act.type)}
              </div>

              {/* Activity details */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                    <span style={{ fontWeight: 600 }}>{act.actor?.name || 'A reader'}</span>{' '}
                    <span style={{ color: 'var(--text-secondary)' }}>{act.text}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {act.timestamp}
                  </span>
                </div>

                {act.targetTitle && (
                  <div
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '13px',
                      color: 'var(--accent)',
                      marginTop: '4px',
                      fontStyle: 'italic',
                    }}
                  >
                    “{act.targetTitle}”
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
