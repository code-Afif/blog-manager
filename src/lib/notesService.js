import { storage } from './storage';

const INITIAL_NOTES = [
  // --- English Notes (5) ---
  {
    id: 'note-en-01',
    author: {
      name: 'Julian Vance',
      handle: 'julian-vance',
      initials: 'JV',
      role: 'Essayist & Critic',
    },
    content: 'A good sentence is not one that rushes to conclude itself, but one that leaves a quiet resonance in the margin after the period is set.',
    language: 'en',
    dir: 'ltr',
    publishedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    appreciations: 18,
    replies: [
      {
        id: 'reply-en-01',
        author: { name: 'Clara Morisot', handle: 'clara-morisot', initials: 'CM' },
        content: 'Especially when the margin is broad enough to hold the reader’s own hesitation.',
        publishedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
        appreciations: 6,
      },
    ],
  },
  {
    id: 'note-en-02',
    author: {
      name: 'Clara Morisot',
      handle: 'clara-morisot',
      initials: 'CM',
      role: 'Senior Essayist',
    },
    content: 'The best libraries are not those with the newest volumes, but those where the armchairs have sunk slightly under the weight of three generations of solitary readers.',
    language: 'en',
    dir: 'ltr',
    publishedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    appreciations: 24,
    replies: [],
  },
  {
    id: 'note-en-03',
    author: {
      name: 'Tariq Al-Mansoor',
      handle: 'tariq-al-mansoor',
      initials: 'TM',
      role: 'Field Correspondent',
    },
    content: 'Write with the window open. Even if the street below is noisy, the draft keeps the words from growing stale inside the room.',
    language: 'en',
    dir: 'ltr',
    publishedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    appreciations: 15,
    replies: [],
  },
  {
    id: 'note-en-04',
    author: {
      name: 'Elena Rostova',
      handle: 'elena-rostova',
      initials: 'ER',
      role: 'Philosopher',
    },
    content: 'Re-reading is the truest test of prose: the first encounter is merely curiosity, but the second is companionship.',
    language: 'en',
    dir: 'ltr',
    publishedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    appreciations: 31,
    replies: [
      {
        id: 'reply-en-02',
        author: { name: 'Arthur Pendelton', handle: 'arthur-pendelton', initials: 'AP' },
        content: 'And with every re-reading, the binding loosens just a little more comfortably.',
        publishedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
        appreciations: 9,
      },
    ],
  },
  {
    id: 'note-en-05',
    author: {
      name: 'Arthur Pendelton',
      handle: 'arthur-pendelton',
      initials: 'AP',
      role: 'Bookbinder',
    },
    content: 'We do not read to escape the world; we read to return to it with a slower, more deliberate eye.',
    language: 'en',
    dir: 'ltr',
    publishedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    appreciations: 27,
    replies: [],
  },

  // --- Literary Notes (en-06 to en-15) ---
  {
    id: 'note-en-06',
    author: {
      name: 'Priya Sharma',
      handle: 'priya-sharma',
      initials: 'PS',
      role: 'Poet & Translator',
    },
    content: 'Literature is the stillness that breathes between sentences. When the ink dries on paper, the true conversation begins.',
    language: 'en',
    dir: 'ltr',
    publishedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    appreciations: 22,
    replies: [],
  },
  {
    id: 'note-en-07',
    author: {
      name: 'Julian Vance',
      handle: 'julian-vance',
      initials: 'JV',
      role: 'Essayist & Critic',
    },
    content: 'Revisiting an old favorite book is like visiting the home of an old friend—the path is identical, yet every turn reveals an unexpected warmth.',
    language: 'en',
    dir: 'ltr',
    publishedAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    appreciations: 19,
    replies: [],
  },
  {
    id: 'note-en-08',
    author: {
      name: 'Clara Morisot',
      handle: 'clara-morisot',
      initials: 'CM',
      role: 'Senior Essayist',
    },
    content: 'The pace of the pen ought to match the breathing of the idea. Sentences set down in thoughtless haste are just as quickly forgotten.',
    language: 'en',
    dir: 'ltr',
    publishedAt: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
    appreciations: 14,
    replies: [],
  },
  {
    id: 'note-en-09',
    author: {
      name: 'Priya Sharma',
      handle: 'priya-sharma',
      initials: 'PS',
      role: 'Poet & Translator',
    },
    content: 'A bookshelf is not merely paper bound together, but a sanctuary of quiet questions we never found the courage to ask the bustling world.',
    language: 'en',
    dir: 'ltr',
    publishedAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    appreciations: 35,
    replies: [
      {
        id: 'reply-en-03',
        author: { name: 'Julian Vance', handle: 'julian-vance', initials: 'JV' },
        content: 'Quietly put. The library remains our most loyal witness.',
        publishedAt: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
        appreciations: 8,
      },
    ],
  },
  {
    id: 'note-en-10',
    author: {
      name: 'Elena Rostova',
      handle: 'elena-rostova',
      initials: 'ER',
      role: 'Philosopher',
    },
    content: 'The true author does not exhaust the subject, but preserves enough room for the reader to linger and contemplate.',
    language: 'en',
    dir: 'ltr',
    publishedAt: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
    appreciations: 20,
    replies: [],
  },
  {
    id: 'note-en-11',
    author: {
      name: 'Mirza Danish',
      handle: 'mirza-danish',
      initials: 'MD',
      role: 'Literary Scholar',
    },
    content: 'When an insight settles upon the leaf of a notebook, it ceases to be mere ink and becomes an enduring monument of quietude.',
    language: 'en',
    dir: 'ltr',
    publishedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    appreciations: 29,
    replies: [],
  },
  {
    id: 'note-en-12',
    author: {
      name: 'Tariq Al-Mansoor',
      handle: 'tariq-al-mansoor',
      initials: 'TM',
      role: 'Field Correspondent',
    },
    content: 'Reading is solitude’s gentlest companion—it never demands, but simply takes you by the hand across centuries.',
    language: 'en',
    dir: 'ltr',
    publishedAt: new Date(Date.now() - 7 * 3600 * 1000).toISOString(),
    appreciations: 26,
    replies: [
      {
        id: 'reply-en-04',
        author: { name: 'Mirza Danish', handle: 'mirza-danish', initials: 'MD' },
        content: 'And on that journey, every turned leaf reveals an uncharted country.',
        publishedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
        appreciations: 11,
      },
    ],
  },
  {
    id: 'note-en-13',
    author: {
      name: 'Mirza Danish',
      handle: 'mirza-danish',
      initials: 'MD',
      role: 'Literary Scholar',
    },
    content: 'A thoughtful sentence does not shock the reader; it invites them inward to look upon themselves with renewed clarity.',
    language: 'en',
    dir: 'ltr',
    publishedAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    appreciations: 17,
    replies: [],
  },
  {
    id: 'note-en-14',
    author: {
      name: 'Julian Vance',
      handle: 'julian-vance',
      initials: 'JV',
      role: 'Essayist & Critic',
    },
    content: 'A short marginal note penciled in haste often harbors more genuine truth than whole chapters of formal exposition.',
    language: 'en',
    dir: 'ltr',
    publishedAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    appreciations: 33,
    replies: [],
  },
  {
    id: 'note-en-15',
    author: {
      name: 'Mirza Danish',
      handle: 'mirza-danish',
      initials: 'MD',
      role: 'Literary Scholar',
    },
    content: 'In the small hours of the morning when the city falls silent, a single sentence written with sincerity redeems the day’s fatigue.',
    language: 'en',
    dir: 'ltr',
    publishedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    appreciations: 41,
    replies: [],
  },
];

const STORAGE_KEYS = {
  NOTES: 'marginalia_notes_v1',
  NOTE_DRAFTS: 'marginalia_note_drafts_v1',
  APPRECIATED_NOTES: 'marginalia_appreciated_notes_v1',
  SAVED_NOTES: 'marginalia_saved_notes_v1',
};

class NotesService {
  constructor() {
    this._initStorage();
  }

  _initStorage() {
    const stored = storage.get(STORAGE_KEYS.NOTES);
    const hasNonEnglish = Array.isArray(stored) && stored.some((n) => n.language === 'hi' || n.language === 'ur');
    if (!stored || !Array.isArray(stored) || stored.length === 0 || hasNonEnglish) {
      storage.set(STORAGE_KEYS.NOTES, INITIAL_NOTES);
    }
  }

  async getAll() {
    const notes = storage.get(STORAGE_KEYS.NOTES, INITIAL_NOTES);
    return [...notes].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  async create(noteData) {
    const notes = storage.get(STORAGE_KEYS.NOTES, INITIAL_NOTES);
    const newNote = {
      id: `note-${Date.now()}`,
      author: noteData.author || {
        name: 'Julian Vance',
        handle: 'julian-vance',
        initials: 'JV',
        role: 'Contributing Writer',
      },
      content: noteData.content || '',
      language: 'en',
      dir: 'ltr',
      image: noteData.image || null,
      publishedAt: new Date().toISOString(),
      appreciations: 0,
      replies: [],
    };

    const updated = [newNote, ...notes];
    storage.set(STORAGE_KEYS.NOTES, updated);
  }

  async update(id, updates) {
    const notes = storage.get(STORAGE_KEYS.NOTES, INITIAL_NOTES);
    const index = notes.findIndex((n) => n.id === id);
    if (index === -1) {
      throw new Error(`Note ${id} not found`);
    }
    const updatedNote = {
      ...notes[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    notes[index] = updatedNote;
    storage.set(STORAGE_KEYS.NOTES, notes);
    return updatedNote;
  }

  async delete(id) {
    const notes = storage.get(STORAGE_KEYS.NOTES, INITIAL_NOTES);
    const filtered = notes.filter((n) => n.id !== id);
    storage.set(STORAGE_KEYS.NOTES, filtered);
    return true;
  }

  async addReply(noteId, replyData) {
    const notes = storage.get(STORAGE_KEYS.NOTES, INITIAL_NOTES);
    const note = notes.find((n) => n.id === noteId);
    if (!note) return null;

    const newReply = {
      id: `reply-${Date.now()}`,
      author: replyData.author || {
        name: 'Julian Vance',
        handle: 'julian-vance',
        initials: 'JV',
      },
      content: replyData.content || '',
      publishedAt: new Date().toISOString(),
      appreciations: 0,
    };

    if (!Array.isArray(note.replies)) {
      note.replies = [];
    }
    note.replies.push(newReply);
    storage.set(STORAGE_KEYS.NOTES, notes);
    return newReply;
  }

  toggleAppreciation(noteId) {
    const appreciated = new Set(storage.get(STORAGE_KEYS.APPRECIATED_NOTES, []));
    const isAppreciated = appreciated.has(noteId);
    const notes = storage.get(STORAGE_KEYS.NOTES, INITIAL_NOTES);
    const note = notes.find((n) => n.id === noteId);

    if (isAppreciated) {
      appreciated.delete(noteId);
      if (note) note.appreciations = Math.max(0, (note.appreciations || 1) - 1);
    } else {
      appreciated.add(noteId);
      if (note) note.appreciations = (note.appreciations || 0) + 1;
    }

    storage.set(STORAGE_KEYS.NOTES, notes);
    storage.set(STORAGE_KEYS.APPRECIATED_NOTES, Array.from(appreciated));
    return { hasAppreciated: !isAppreciated, appreciations: note ? note.appreciations : 0 };
  }

  isNoteAppreciated(noteId) {
    const appreciated = new Set(storage.get(STORAGE_KEYS.APPRECIATED_NOTES, []));
    return appreciated.has(noteId);
  }

  toggleSave(noteId) {
    const saved = new Set(storage.get(STORAGE_KEYS.SAVED_NOTES, []));
    const isSaved = saved.has(noteId);
    if (isSaved) {
      saved.delete(noteId);
    } else {
      saved.add(noteId);
    }
    storage.set(STORAGE_KEYS.SAVED_NOTES, Array.from(saved));
    return !isSaved;
  }

  isNoteSaved(noteId) {
    const saved = new Set(storage.get(STORAGE_KEYS.SAVED_NOTES, []));
    return saved.has(noteId);
  }

  async getSavedNotes() {
    const saved = new Set(storage.get(STORAGE_KEYS.SAVED_NOTES, []));
    const notes = await this.getAll();
    return notes.filter((n) => saved.has(n.id));
  }

  // Drafts management
  getDrafts() {
    return storage.get(STORAGE_KEYS.NOTE_DRAFTS, []);
  }

  saveDraft(content, language = 'en') {
    if (!content || !content.trim()) return;
    const drafts = this.getDrafts();
    const existingIndex = drafts.findIndex((d) => d.id === 'active-note-draft');
    const draftObj = {
      id: 'active-note-draft',
      content,
      language,
      savedAt: new Date().toISOString(),
    };
    if (existingIndex >= 0) {
      drafts[existingIndex] = draftObj;
    } else {
      drafts.unshift(draftObj);
    }
    storage.set(STORAGE_KEYS.NOTE_DRAFTS, drafts);
  }

  deleteDraft(draftId = 'active-note-draft') {
    const drafts = this.getDrafts();
    const filtered = drafts.filter((d) => d.id !== draftId);
    storage.set(STORAGE_KEYS.NOTE_DRAFTS, filtered);
  }
}

export const notesService = new NotesService();
