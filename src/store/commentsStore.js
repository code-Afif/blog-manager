import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const SEED_NOTES = {
  'hidden-cost-typescript-abstractions': [
    {
      id: 'n-1',
      author: 'devinder_s',
      avatar: 'DS',
      content: 'The point about generic repository wrappers inflating V8 heap memory is spot-on. We saw 25MB of excess closures per node worker just from uncollected mapper functions.',
      createdAt: '2026-04-18T10:15:00Z',
      replies: [
        {
          id: 'n-1-r1',
          author: 'elena_r',
          avatar: 'ER',
          content: 'Exactly. When stack frames go 12 layers deep for a single SQL query, the JIT deoptimizes inline caches and GC pressure skyrockets.',
          createdAt: '2026-04-18T11:02:00Z',
        },
      ],
    },
    {
      id: 'n-2',
      author: 'alex_m',
      avatar: 'AM',
      content: 'Pragmatic handlers with direct Zod validation schemas are so much easier to audit during on-call incidents.',
      createdAt: '2026-04-18T12:30:00Z',
      replies: [],
    },
  ],
  'debugging-production-outage-go': [
    {
      id: 'n-3',
      author: 'marcus_v',
      avatar: 'MV',
      content: 'The TIME_WAIT socket exhaustion scenario is a classic trap in Go. People forget that default http.Client does not manage transport connection limits.',
      createdAt: '2026-04-16T13:45:00Z',
      replies: [
        {
          id: 'n-3-r1',
          author: 'devinder_s',
          avatar: 'DS',
          content: 'Always drain resp.Body to io.Discard before closing, otherwise the keep-alive connection will simply be destroyed by the kernel.',
          createdAt: '2026-04-16T14:10:00Z',
        },
      ],
    },
  ],
  'postgres-wal-concurrent-writes': [
    {
      id: 'n-4',
      author: 'sophie_l',
      avatar: 'SL',
      content: 'Group commit in Postgres is pure engineering elegance. Turning random page writes into sequential log flushes saves thousands of disk I/O operations per second.',
      createdAt: '2026-04-13T09:20:00Z',
      replies: [],
    },
  ],
};

export const useCommentsStore = create(
  persist(
    (set, get) => ({
      notesByEssay: SEED_NOTES,

      getNotes: (essaySlug) => {
        return get().notesByEssay[essaySlug] || [];
      },

      addNote: (essaySlug, { author, content, avatar }) => {
        const newNote = {
          id: `n-${Date.now().toString(36)}`,
          author: author || 'engineer',
          avatar: avatar || 'EN',
          content,
          createdAt: new Date().toISOString(),
          replies: [],
        };

        set((state) => {
          const current = state.notesByEssay[essaySlug] || [];
          return {
            notesByEssay: {
              ...state.notesByEssay,
              [essaySlug]: [newNote, ...current],
            },
          };
        });

        return newNote;
      },

      addReply: (essaySlug, parentId, { author, content, avatar }) => {
        const reply = {
          id: `r-${Date.now().toString(36)}`,
          author: author || 'engineer',
          avatar: avatar || 'EN',
          content,
          createdAt: new Date().toISOString(),
        };

        set((state) => {
          const current = state.notesByEssay[essaySlug] || [];
          const updated = current.map((n) => {
            if (n.id === parentId) {
              return {
                ...n,
                replies: [...(n.replies || []), reply],
              };
            }
            return n;
          });

          return {
            notesByEssay: {
              ...state.notesByEssay,
              [essaySlug]: updated,
            },
          };
        });

        return reply;
      },
    }),
    {
      name: 'marginalia_comments_v4',
    }
  )
);
