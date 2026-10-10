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

  // --- Hindi Notes (5) ---
  {
    id: 'note-hi-01',
    author: {
      name: 'Priya Sharma',
      handle: 'priya-sharma',
      initials: 'PS',
      role: 'कवयित्री व अनुवादक',
    },
    content: 'साहित्य वह मौन है जो दो शब्दों के बीच सांस लेता है। जब कागज़ पर स्याही सूखती है, तब असल संवाद शुरू होता है।',
    language: 'hi',
    dir: 'ltr',
    publishedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    appreciations: 22,
    replies: [],
  },
  {
    id: 'note-hi-02',
    author: {
      name: 'Julian Vance',
      handle: 'julian-vance',
      initials: 'JV',
      role: 'Essayist & Critic',
    },
    content: 'किसी अच्छी किताब को दोबारा पढ़ना पुराने दोस्त के घर जाने जैसा है—रास्ता वही है, पर हर मोड़ पर एक नई याद मुस्कुराती है।',
    language: 'hi',
    dir: 'ltr',
    publishedAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    appreciations: 19,
    replies: [],
  },
  {
    id: 'note-hi-03',
    author: {
      name: 'Clara Morisot',
      handle: 'clara-morisot',
      initials: 'CM',
      role: 'Senior Essayist',
    },
    content: 'कलम की गति उतनी ही होनी चाहिए जितनी विचार की सांस। जल्दबाज़ी में लिखे गए वाक्य जल्द ही बिसर जाते हैं।',
    language: 'hi',
    dir: 'ltr',
    publishedAt: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
    appreciations: 14,
    replies: [],
  },
  {
    id: 'note-hi-04',
    author: {
      name: 'Priya Sharma',
      handle: 'priya-sharma',
      initials: 'PS',
      role: 'कवयित्री व अनुवादक',
    },
    content: 'किताबों की अलमारी केवल कागज़ का संग्रह नहीं, बल्कि उन अनकहे सवालों का बसेरा है जिन्हें हमने कभी दुनिया से पूछने की हिम्मत नहीं की।',
    language: 'hi',
    dir: 'ltr',
    publishedAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    appreciations: 35,
    replies: [
      {
        id: 'reply-hi-01',
        author: { name: 'Julian Vance', handle: 'julian-vance', initials: 'JV' },
        content: 'खूबसूरत बात। अलमारी हमेशा मौन बातचीत की गवाह रहती है।',
        publishedAt: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
        appreciations: 8,
      },
    ],
  },
  {
    id: 'note-hi-05',
    author: {
      name: 'Elena Rostova',
      handle: 'elena-rostova',
      initials: 'ER',
      role: 'Philosopher',
    },
    content: 'सच्चा लेखक वह नहीं जो सब कुछ कह दे, बल्कि वह जो पाठक के लिए सोचने और महसूस करने की खाली जगह छोड़ दे।',
    language: 'hi',
    dir: 'ltr',
    publishedAt: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
    appreciations: 20,
    replies: [],
  },

  // --- Urdu Notes (5) ---
  {
    id: 'note-ur-01',
    author: {
      name: 'Mirza Danish',
      handle: 'mirza-danish',
      initials: 'MD',
      role: 'ادیب و محقق',
    },
    content: 'لفظ جب دل سے نکل کر کاغذ پر اترتا ہے، تو وہ صرف سیاہی نہیں رہتا بلکہ خاموشی کا نوحہ بن جاتا ہے۔',
    language: 'ur',
    dir: 'rtl',
    publishedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    appreciations: 29,
    replies: [],
  },
  {
    id: 'note-ur-02',
    author: {
      name: 'Tariq Al-Mansoor',
      handle: 'tariq-al-mansoor',
      initials: 'TM',
      role: 'Field Correspondent',
    },
    content: 'مطالعہ تنہائی کا ایسا ہم سفر ہے جو کبھی سوال نہیں کرتا، بس ہاتھ تھامے صدیوں کے سفر پر نکل پڑتا ہے۔',
    language: 'ur',
    dir: 'rtl',
    publishedAt: new Date(Date.now() - 7 * 3600 * 1000).toISOString(),
    appreciations: 26,
    replies: [
      {
        id: 'reply-ur-01',
        author: { name: 'Mirza Danish', handle: 'mirza-danish', initials: 'MD' },
        content: 'اور اس سفر میں ہر ورق ایک نیا شہر بن جاتا ہے۔',
        publishedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
        appreciations: 11,
      },
    ],
  },
  {
    id: 'note-ur-03',
    author: {
      name: 'Mirza Danish',
      handle: 'mirza-danish',
      initials: 'MD',
      role: 'ادیب و محقق',
    },
    content: 'اچھی تحریر وہ نہیں جو قاری کو حیران کر دے، بلکہ وہ ہے جو اسے اپنے ہی اندر جھانکنے پر مجبور کرے۔',
    language: 'ur',
    dir: 'rtl',
    publishedAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    appreciations: 17,
    replies: [],
  },
  {
    id: 'note-ur-04',
    author: {
      name: 'Julian Vance',
      handle: 'julian-vance',
      initials: 'JV',
      role: 'Essayist & Critic',
    },
    content: 'کتاب کے حاشیے پر لکھا گیا ایک مختصر سا جملہ اکثر اصل متن سے زیادہ سچائی سمیٹے ہوتا ہے۔',
    language: 'ur',
    dir: 'rtl',
    publishedAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    appreciations: 33,
    replies: [],
  },
  {
    id: 'note-ur-05',
    author: {
      name: 'Mirza Danish',
      handle: 'mirza-danish',
      initials: 'MD',
      role: 'ادیب و محقق',
    },
    content: 'رات کے پچھلے پہر جب شہر سو جاتا ہے، تب لکھی ہوئی ایک سطر دن بھر کی تھکن کو روشنی میں بدل دیتی ہے۔',
    language: 'ur',
    dir: 'rtl',
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
    if (!stored || !Array.isArray(stored) || stored.length === 0) {
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
      language: noteData.language || 'en',
      dir: noteData.dir || (noteData.language === 'ur' ? 'rtl' : 'ltr'),
      image: noteData.image || null,
      publishedAt: new Date().toISOString(),
      appreciations: 0,
      replies: [],
    };

    const updated = [newNote, ...notes];
    storage.set(STORAGE_KEYS.NOTES, updated);
    return newNote;
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
