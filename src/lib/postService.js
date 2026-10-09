import initialEssays from '../data/posts.json';
import { storage } from './storage';
import { calculateReadTime, generateSlug } from './utils';

export const LITERARY_SECTIONS = [
  'Poetry',
  'Fiction',
  'Essays',
  'Criticism',
  'Translation',
  'Authors',
  'History',
  'Language',
];

export const SECTION_TRANSLATIONS = {
  Poetry: { en: 'Poetry', hi: 'कविता' },
  Fiction: { en: 'Fiction', hi: 'कथा-साहित्य' },
  Essays: { en: 'Essays', hi: 'निबंध' },
  Criticism: { en: 'Criticism', hi: 'आलोचना' },
  Translation: { en: 'Translation', hi: 'अनुवाद' },
  Authors: { en: 'Authors', hi: 'रचनाकार' },
  History: { en: 'History', hi: 'इतिहास' },
  Language: { en: 'Language', hi: 'भाषा' },
};

const STORAGE_KEYS = {
  ESSAYS: 'marginalia_literary_essays_v3',
  DELETED_IDS: 'marginalia_literary_deleted_ids_v3',
  READING_LIST: 'marginalia_literary_reading_list_v3',
  APPRECIATED_IDS: 'marginalia_literary_appreciated_v3',
};

/**
 * Service layer wrapping Marginalia literary journal essay operations.
 */
class PostService {
  constructor() {
    this._initStorage();
  }

  _initStorage() {
    const stored = storage.get(STORAGE_KEYS.ESSAYS);
    // If not stored or if holding obsolete non-multilingual data, seed with fresh literary essays
    if (!stored || !Array.isArray(stored) || stored.length === 0 || !stored[0].language) {
      storage.set(STORAGE_KEYS.ESSAYS, initialEssays);
      storage.set(STORAGE_KEYS.DELETED_IDS, []);
      storage.set(STORAGE_KEYS.READING_LIST, []);
    }
  }

  /**
   * Fetch essays.
   * By default, returns ONLY published essays (drafts never appear on public contents list).
   * Pass includeDrafts = true for the Author's Desk.
   */
  async getAll(includeDrafts = false) {
    await new Promise((resolve) => setTimeout(resolve, 30));
    const all = storage.get(STORAGE_KEYS.ESSAYS, initialEssays);
    const deletedIds = new Set(storage.get(STORAGE_KEYS.DELETED_IDS, []));

    const active = all.filter((e) => !deletedIds.has(e.id));
    if (includeDrafts) {
      return active;
    }
    // Public contents list strictly excludes drafts
    return active.filter((e) => (e.status || 'published') === 'published');
  }

  /**
   * Fetch single essay by slug
   */
  async getBySlug(slug) {
    await new Promise((resolve) => setTimeout(resolve, 30));
    const all = storage.get(STORAGE_KEYS.ESSAYS, initialEssays);
    const deletedIds = new Set(storage.get(STORAGE_KEYS.DELETED_IDS, []));
    const essay = all.find(
      (e) => !deletedIds.has(e.id) && (e.slug === slug || e.filename === slug)
    );

    if (!essay) {
      throw new Error(`Folio Not Found: No essay registered under folio /essays/${slug}`);
    }
    return essay;
  }

  /**
   * Fetch previous and next published essays for pagination
   */
  async getAdjacentEssays(currentSlug) {
    const published = await this.getAll(false);
    const currentIndex = published.findIndex((e) => e.slug === currentSlug);

    if (currentIndex === -1) {
      return { prevEssay: null, nextEssay: null };
    }

    return {
      prevEssay: currentIndex > 0 ? published[currentIndex - 1] : null,
      nextEssay: currentIndex < published.length - 1 ? published[currentIndex + 1] : null,
    };
  }

  /**
   * Create an essay draft or publication
   */
  async create(essayData) {
    await new Promise((resolve) => setTimeout(resolve, 40));
    const all = storage.get(STORAGE_KEYS.ESSAYS, initialEssays);

    const lang = essayData.language || 'en';
    const slug = generateSlug(essayData.title || 'untitled-essay');
    const readTime = calculateReadTime(essayData.content || '', lang);

    const newEssay = {
      id: `essay-${Date.now().toString(36)}`,
      number: all.length + 1,
      essayNumber: all.length + 1,
      slug,
      filename: `${slug}.md`,
      language: lang,
      title: essayData.title || (lang === 'hi' ? 'शीर्षकहीन निबंध' : 'Untitled Essay'),
      dek: essayData.dek || '',
      excerpt:
        essayData.excerpt ||
        (essayData.content || '').slice(0, 150).replace(/[#*`]/g, '') + '...',
      section: essayData.section || 'Essays',
      tags: Array.isArray(essayData.tags) && essayData.tags.length > 0 ? essayData.tags : ['literature'],
      author: {
        name: essayData.author?.name || (lang === 'hi' ? 'निबंधकार' : 'Contributing Author'),
        handle: essayData.author?.handle || 'contributor',
        avatar: essayData.author?.avatar || 'CA',
      },
      publishedAt: new Date().toISOString(),
      readTimeMinutes: readTime,
      appreciations: 0,
      status: essayData.status || 'draft',
      epigraph: essayData.epigraph || null,
      content:
        essayData.content ||
        (lang === 'hi'
          ? '## §१. विचार का प्रस्थान बिंदु\n\nयहाँ अपना निबंध आरंभ करें...'
          : '## §I. The Initial Inquiry\n\nBegin your essay here...'),
    };

    const updated = [newEssay, ...all];
    storage.set(STORAGE_KEYS.ESSAYS, updated);
    return newEssay;
  }

  /**
   * Update an existing essay
   */
  async update(id, updates) {
    await new Promise((resolve) => setTimeout(resolve, 40));
    const all = storage.get(STORAGE_KEYS.ESSAYS, initialEssays);
    const index = all.findIndex((e) => e.id === id);

    if (index === -1) {
      throw new Error(`Cannot update: Essay folio ${id} does not exist`);
    }

    const current = all[index];
    const newTitle = updates.title !== undefined ? updates.title : current.title;
    const newContent = updates.content !== undefined ? updates.content : current.content;
    const newLanguage = updates.language || current.language || 'en';
    const newSlug = updates.slug || (updates.title ? generateSlug(newTitle) : current.slug);

    const updatedEssay = {
      ...current,
      ...updates,
      title: newTitle,
      slug: newSlug,
      filename: `${newSlug}.md`,
      language: newLanguage,
      content: newContent,
      readTimeMinutes: calculateReadTime(newContent, newLanguage),
      updatedAt: new Date().toISOString(),
    };

    all[index] = updatedEssay;
    storage.set(STORAGE_KEYS.ESSAYS, all);
    return updatedEssay;
  }

  /**
   * Delete an essay
   */
  async delete(id) {
    await new Promise((resolve) => setTimeout(resolve, 40));
    const deletedIds = storage.get(STORAGE_KEYS.DELETED_IDS, []);
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      storage.set(STORAGE_KEYS.DELETED_IDS, deletedIds);
    }
    return true;
  }

  /**
   * Appreciate an essay (persists count)
   */
  async toggleAppreciation(id) {
    const appreciated = new Set(storage.get(STORAGE_KEYS.APPRECIATED_IDS, []));
    const hasAppreciated = appreciated.has(id);

    const all = storage.get(STORAGE_KEYS.ESSAYS, initialEssays);
    const essay = all.find((e) => e.id === id);

    let newCount = essay ? essay.appreciations || 0 : 0;

    if (hasAppreciated) {
      appreciated.delete(id);
      newCount = Math.max(0, newCount - 1);
    } else {
      appreciated.add(id);
      newCount = newCount + 1;
    }

    if (essay) {
      essay.appreciations = newCount;
      storage.set(STORAGE_KEYS.ESSAYS, all);
    }

    storage.set(STORAGE_KEYS.APPRECIATED_IDS, Array.from(appreciated));
    return { hasAppreciated: !hasAppreciated, appreciations: newCount };
  }

  getAppreciatedIds() {
    return new Set(storage.get(STORAGE_KEYS.APPRECIATED_IDS, []));
  }

  /**
   * Reading List (Shelf bookmark)
   */
  toggleReadingList(id) {
    const list = new Set(storage.get(STORAGE_KEYS.READING_LIST, []));
    const isSaved = list.has(id);
    if (isSaved) {
      list.delete(id);
    } else {
      list.add(id);
    }
    storage.set(STORAGE_KEYS.READING_LIST, Array.from(list));
    return !isSaved;
  }

  getReadingListIds() {
    return new Set(storage.get(STORAGE_KEYS.READING_LIST, []));
  }

  /**
   * Get sections with counts
   */
  async getSections() {
    const essays = await this.getAll(false);
    const counts = {};
    LITERARY_SECTIONS.forEach((s) => {
      counts[s] = 0;
    });
    essays.forEach((e) => {
      const section = e.section || 'Essays';
      counts[section] = (counts[section] || 0) + 1;
    });
    return Object.entries(counts).map(([section, count]) => ({ section, count }));
  }

  /**
   * Get all tags with counts
   */
  async getTags() {
    const essays = await this.getAll(false);
    const map = {};
    essays.forEach((e) => {
      e.tags?.forEach((t) => {
        map[t] = (map[t] || 0) + 1;
      });
    });
    return Object.entries(map).map(([tag, count]) => ({ tag, count }));
  }
}

export const postService = new PostService();
