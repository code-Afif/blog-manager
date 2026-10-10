import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const INITIAL_WRITERS = [
  {
    name: 'Julian Vance',
    handle: 'julian-vance',
    initials: 'JV',
    role: 'Essayist & Critic',
    bio: 'Studies in quietude, slow craft, and the architecture of the printed page.',
    languages: ['English'],
  },
  {
    name: 'Clara Morisot',
    handle: 'clara-morisot',
    initials: 'CM',
    role: 'Senior Essayist',
    bio: 'Reclaiming the uncalculated hours that make art and empathy possible.',
    languages: ['English'],
  },
  {
    name: 'Tariq Al-Mansoor',
    handle: 'tariq-al-mansoor',
    initials: 'TM',
    role: 'Field Correspondent',
    bio: 'Metropolitan nocturnes, subterranean cities, and quiet human encounters.',
    languages: ['English'],
  },
  {
    name: 'Elena Rostova',
    handle: 'elena-rostova',
    initials: 'ER',
    role: 'Philosopher',
    bio: 'Dialogues in suspension; dwelling with unanswered questions.',
    languages: ['English'],
  },
  {
    name: 'Arthur Pendelton',
    handle: 'arthur-pendelton',
    initials: 'AP',
    role: 'Bookbinder',
    bio: 'Hand-bound octavo volumes, bone folders, and the resistance of physical craft.',
    languages: ['English'],
  },
  {
    name: 'Priya Sharma',
    handle: 'priya-sharma',
    initials: 'PS',
    role: 'Poet & Translator',
    bio: 'Reflections on modern poetry, silence, and literary cadence.',
    languages: ['English'],
  },
  {
    name: 'Mirza Danish',
    handle: 'mirza-danish',
    initials: 'MD',
    role: 'Literary Critic',
    bio: 'Classical prose, epistolary letters, and quiet metropolitan narratives.',
    languages: ['English'],
  },
];

const INITIAL_ACTIVITIES = [
  {
    id: 'act-1',
    type: 'appreciation',
    actor: { name: 'Clara Morisot', initials: 'CM' },
    targetTitle: 'The quiet art of beginning again',
    text: 'appreciated your essay',
    timestamp: '2 hours ago',
  },
  {
    id: 'act-2',
    type: 'reply',
    actor: { name: 'Mirza Danish', initials: 'MD' },
    targetTitle: 'A note on solitary reading',
    text: 'left a note on your thought: "A line, once felt in the heart, endures in memory..."',
    timestamp: '5 hours ago',
  },
  {
    id: 'act-3',
    type: 'save',
    actor: { name: 'Tariq Al-Mansoor', initials: 'TM' },
    targetTitle: 'On learning to live with unanswered questions',
    text: 'saved your essay to their Reading List',
    timestamp: 'Yesterday',
  },
  {
    id: 'act-4',
    type: 'appreciation',
    actor: { name: 'Priya Sharma', initials: 'PS' },
    targetTitle: 'On Solitude and Reading',
    text: 'appreciated your note',
    timestamp: '2 days ago',
  },
  {
    id: 'act-5',
    type: 'follow',
    actor: { name: 'Elena Rostova', initials: 'ER' },
    targetTitle: '',
    text: 'began following your writing',
    timestamp: '3 days ago',
  },
];

export const useSocialStore = create(
  persist(
    (set, get) => ({
      // My personal writer profile
      profile: {
        name: 'Guest Reader',
        handle: 'guest',
        initials: 'GR',
        role: 'Reader',
        bio: 'Reader and subscriber to MARGINALIA Literary Review.',
        languages: ['English'],
      },
      syncWithAuthUser: (user) => {
        if (!user) return;
        set((state) => ({
          profile: {
            ...state.profile,
            id: user.id,
            name: user.name,
            handle: user.handle || state.profile.handle,
            initials: user.initials || state.profile.initials,
            role: user.role || 'Fellow Reader',
            bio: user.bio || state.profile.bio,
          },
        }));
      },
      resetToGuest: () => {
        set({
          profile: {
            name: 'Guest Reader',
            handle: 'guest',
            initials: 'GR',
            role: 'Reader',
            bio: 'Reader and subscriber to MARGINALIA Literary Review.',
            languages: ['English'],
          },
        });
      },
      updateProfile: (updates) => {
        set((state) => ({
          profile: {
            ...state.profile,
            ...updates,
            initials: updates.initials
              ? updates.initials
              : updates.name
              ? updates.name
                  .split(' ')
                  .map((p) => p[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()
              : state.profile.initials,
          },
        }));
      },

      // Followed writers
      followedHandles: ['clara-morisot', 'tariq-al-mansoor'],
      toggleFollow: (handle) => {
        const { followedHandles } = get();
        const isFollowed = followedHandles.includes(handle);
        const next = isFollowed
          ? followedHandles.filter((h) => h !== handle)
          : [...followedHandles, handle];
        set({ followedHandles: next });
        return !isFollowed;
      },
      isFollowing: (handle) => {
        return get().followedHandles.includes(handle);
      },

      // Dismissed recommendations
      dismissedHandles: [],
      dismissRecommendation: (handle) => {
        set((state) => ({
          dismissedHandles: [...state.dismissedHandles, handle],
        }));
      },

      // Directory of writers
      writers: INITIAL_WRITERS,
      getWriterByHandle: (handle) => {
        const { writers, profile } = get();
        if (handle === 'me' || handle === profile.handle) {
          return profile;
        }
        return writers.find((w) => w.handle === handle) || null;
      },
      getWriterByName: (name) => {
        if (!name) return null;
        const { writers, profile } = get();
        if (profile.name.toLowerCase() === name.toLowerCase()) {
          return profile;
        }
        return (
          writers.find((w) => w.name.toLowerCase() === name.toLowerCase()) || {
            name,
            handle: name.toLowerCase().replace(/\s+/g, '-'),
            initials: name
              .split(' ')
              .map((p) => p[0])
              .join('')
              .slice(0, 2)
              .toUpperCase(),
            bio: 'Writer and reader on Marginalia.',
            languages: ['English'],
          }
        );
      },

      // Recommended writers: exclude own handle, already followed, and dismissed
      getRecommendedWriters: () => {
        const { writers, followedHandles, dismissedHandles, profile } = get();
        return writers.filter(
          (w) =>
            w.handle !== profile.handle &&
            !followedHandles.includes(w.handle) &&
            !dismissedHandles.includes(w.handle)
        );
      },

      // Followed writers list
      getFollowedWriters: () => {
        const { writers, followedHandles } = get();
        return writers.filter((w) => followedHandles.includes(w.handle));
      },

      // Activity notifications
      activities: INITIAL_ACTIVITIES,
      addActivity: (act) => {
        set((state) => ({
          activities: [
            {
              id: `act-${Date.now()}`,
              timestamp: 'Just now',
              ...act,
            },
            ...state.activities,
          ],
        }));
      },
    }),
    {
      name: 'marginalia_social_store_v1',
    }
  )
);
