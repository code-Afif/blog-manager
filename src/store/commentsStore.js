import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const SEED_NOTES = {
  'on-reading-slowly': [
    {
      id: 'n-1',
      author: 'claire_m',
      avatar: 'CM',
      content: 'The observation regarding the acoustic space of prose is crucial. When one reads Browne or Hazlitt, the mind’s ear is listening as much as the eye is seeing.',
      createdAt: '2026-03-02T14:22:00Z',
      replies: [
        {
          id: 'n-1-r1',
          author: 'julian_w',
          avatar: 'JW',
          content: 'Precisely. Once we abandon the hurry of the screen, the balance of periodic clauses recovers its natural dignity.',
          createdAt: '2026-03-02T15:04:00Z',
        },
      ],
    },
    {
      id: 'n-2',
      author: 'arthur_v',
      avatar: 'AV',
      content: 'Bacon’s metaphor of chewing and digesting remains the highest standard for serious essays.',
      createdAt: '2026-03-03T09:12:00Z',
      replies: [],
    },
  ],
  'premchand-aur-sadharan-gaon': [
    {
      id: 'n-3',
      author: 'विद्याधर_शुक्ल',
      avatar: 'वि',
      content: 'प्रेमचंद ने गाँव के दर्द को जिस तरह उकेरा है, वह आज भी उतना ही प्रासंगिक है। होरी की गाय की लालसा केवल संपत्ति नहीं, सामाजिक मर्यादा का सवाल थी।',
      createdAt: '2026-03-22T11:45:00Z',
      replies: [
        {
          id: 'n-3-r1',
          author: 'अरविंद_जोशी',
          avatar: 'अ',
          content: 'बिलकुल सही। और कफ़न कहानी में जो क्रूर यथार्थवाद है, वह समाज के झूठे आदर्शवाद पर सबसे तीखा प्रहार करता है।',
          createdAt: '2026-03-22T12:30:00Z',
        },
      ],
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
          author: author || 'reader',
          avatar: avatar || 'RD',
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
          author: author || 'reader',
          avatar: avatar || 'RD',
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

      deleteNote: (essaySlug, noteId) => {
        set((state) => {
          const current = state.notesByEssay[essaySlug] || [];
          const filtered = current
            .filter((n) => n.id !== noteId)
            .map((n) => ({
              ...n,
              replies: (n.replies || []).filter((r) => r.id !== noteId),
            }));

          return {
            notesByEssay: {
              ...state.notesByEssay,
              [essaySlug]: filtered,
            },
          };
        });
      },

      // Direct aliases for interoperability
      getComments: (essaySlug) => get().getNotes(essaySlug),
      addComment: (essaySlug, data) => get().addNote(essaySlug, data),
      deleteComment: (essaySlug, noteId) => get().deleteNote(essaySlug, noteId),
    }),
    {
      name: 'marginalia_literary_notes_v3',
    }
  )
);
