import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const SEED_COMMENTS = {
  'rust-ownership-and-borrow-checker': [
    {
      id: 'c-1',
      author: 'k_torvalds',
      avatar: 'KT',
      content: 'The distinction between lexical scopes and Polonius CFG non-lexical lifetimes is crucial here. In Linux kernel Rust drivers, re-borrowing across locks requires strict adherence to this model.',
      createdAt: '2026-09-19T14:22:00Z',
      replies: [
        {
          id: 'c-1-r1',
          author: 'erostova',
          avatar: 'ER',
          content: 'Exactly! Without NLL, early drops would force manual curly braces around lock guards everywhere.',
          createdAt: '2026-09-19T15:04:00Z',
        },
      ],
    },
    {
      id: 'c-2',
      author: 'niko_matsakis',
      avatar: 'NM',
      content: 'Great breakdown. For readers interested in digging deeper, check how MIR borrowck computes origin variables over the flow graph.',
      createdAt: '2026-09-20T09:12:00Z',
      replies: [],
    },
  ],
  'postgres-btree-vs-brin-indexes': [
    {
      id: 'c-3',
      author: 'db_internals',
      avatar: 'DB',
      content: 'One catch with BRIN: if you update older rows, their physical block correlation degrades unless you periodically run VACUUM FULL or pg_repack.',
      createdAt: '2026-09-25T11:45:00Z',
      replies: [
        {
          id: 'c-3-r1',
          author: 'mvance',
          avatar: 'MV',
          content: 'Spot on. That is why BRIN shines primarily on immutable append-only logs or time-series telemetry.',
          createdAt: '2026-09-25T12:30:00Z',
        },
      ],
    },
  ],
  'docker-layer-caching-and-multi-stage': [
    {
      id: 'c-4',
      author: 'devops_ninja',
      avatar: 'DN',
      content: 'The `--mount=type=cache,target=/root/.npm` flag saved our team over 40 hours of CI runner minutes last month.',
      createdAt: '2026-09-29T10:11:00Z',
      replies: [],
    },
  ],
};

export const useCommentsStore = create(
  persist(
    (set, get) => ({
      commentsByPost: SEED_COMMENTS,

      getComments: (postSlug) => {
        return get().commentsByPost[postSlug] || [];
      },

      addComment: (postSlug, { author, content, avatar }) => {
        const newComment = {
          id: `c-${Date.now().toString(36)}`,
          author: author || 'current_dev',
          avatar: avatar || 'CD',
          content,
          createdAt: new Date().toISOString(),
          replies: [],
        };

        set((state) => {
          const current = state.commentsByPost[postSlug] || [];
          return {
            commentsByPost: {
              ...state.commentsByPost,
              [postSlug]: [newComment, ...current],
            },
          };
        });

        return newComment;
      },

      addReply: (postSlug, parentId, { author, content, avatar }) => {
        const reply = {
          id: `r-${Date.now().toString(36)}`,
          author: author || 'current_dev',
          avatar: avatar || 'CD',
          content,
          createdAt: new Date().toISOString(),
        };

        set((state) => {
          const current = state.commentsByPost[postSlug] || [];
          const updated = current.map((c) => {
            if (c.id === parentId) {
              return {
                ...c,
                replies: [...(c.replies || []), reply],
              };
            }
            return c;
          });

          return {
            commentsByPost: {
              ...state.commentsByPost,
              [postSlug]: updated,
            },
          };
        });

        return reply;
      },

      deleteComment: (postSlug, commentId) => {
        set((state) => {
          const current = state.commentsByPost[postSlug] || [];
          // Filter top-level or remove reply
          const filtered = current
            .filter((c) => c.id !== commentId)
            .map((c) => ({
              ...c,
              replies: (c.replies || []).filter((r) => r.id !== commentId),
            }));

          return {
            commentsByPost: {
              ...state.commentsByPost,
              [postSlug]: filtered,
            },
          };
        });
      },
    }),
    {
      name: 'devlog_comments_store',
    }
  )
);
