import initialPosts from '../data/posts.json';
import { storage } from './storage';
import { calculateReadTime, generateSlug } from './utils';

export const TOPICS = [
  'Culture',
  'Personal',
  'Ideas',
  'Literature',
  'Quiet Tech',
  'Architecture of Mind',
];

export const TECHNICAL_SECTIONS = TOPICS;

const STORAGE_KEYS = {
  POSTS: 'stacktrace_journal_posts_v5',
  DELETED_IDS: 'stacktrace_journal_deleted_ids_v5',
  READING_LIST: 'stacktrace_journal_reading_list_v5',
  APPRECIATED_IDS: 'stacktrace_journal_appreciated_v5',
};

/**
 * Service layer wrapping STACKTRACE Developer Publishing Platform operations.
 */
class PostService {
  constructor() {
    this._initStorage();
  }

  _initStorage() {
    const stored = storage.get(STORAGE_KEYS.POSTS);
    // If not stored or holding obsolete data, re-seed with fresh STACKTRACE developer articles
    if (!stored || !Array.isArray(stored) || stored.length === 0 || !stored[0].section || stored[0].language !== 'en') {
      storage.set(STORAGE_KEYS.POSTS, initialPosts);
      storage.set(STORAGE_KEYS.DELETED_IDS, []);
      storage.set(STORAGE_KEYS.READING_LIST, []);
    }
  }

  /**
   * Fetch posts.
   * By default, returns ONLY published posts.
   * Pass includeDrafts = true for the Author's Desk.
   */
  async getAll(includeDrafts = false) {
    await new Promise((resolve) => setTimeout(resolve, 20));
    const all = storage.get(STORAGE_KEYS.POSTS, initialPosts);
    const deletedIds = new Set(storage.get(STORAGE_KEYS.DELETED_IDS, []));

    const active = all.filter((e) => !deletedIds.has(e.id));
    if (includeDrafts) {
      return active;
    }
    return active.filter((e) => (e.status || 'published') === 'published');
  }

  /**
   * Fetch single post by slug
   */
  async getBySlug(slug) {
    await new Promise((resolve) => setTimeout(resolve, 20));
    const all = storage.get(STORAGE_KEYS.POSTS, initialPosts);
    const deletedIds = new Set(storage.get(STORAGE_KEYS.DELETED_IDS, []));
    const post = all.find(
      (e) => !deletedIds.has(e.id) && (e.slug === slug || e.filename === slug)
    );

    if (!post) {
      throw new Error(`Entry Not Found: No post registered under slug ${slug}`);
    }
    return post;
  }

  /**
   * Fetch previous and next published posts for pagination
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
   * Create a post draft or publication
   */
  async create(postData) {
    await new Promise((resolve) => setTimeout(resolve, 30));
    const all = storage.get(STORAGE_KEYS.POSTS, initialPosts);

    const slug = generateSlug(postData.title || 'untitled-entry');
    const readTime = calculateReadTime(postData.content || '', 'en');

    const newPost = {
      id: `entry-${Date.now().toString(36)}`,
      number: all.length + 1,
      essayNumber: all.length + 1,
      slug,
      filename: `${slug}.md`,
      language: 'en',
      title: postData.title || 'Untitled Post',
      dek: postData.dek || '',
      excerpt:
        postData.excerpt ||
        (postData.content || '').slice(0, 160).replace(/[#*`]/g, '') + '...',
      section: postData.section || 'Systems',
      tags: Array.isArray(postData.tags) && postData.tags.length > 0 ? postData.tags : ['architecture'],
      author: {
        name: postData.author?.name || 'Contributing Engineer',
        handle: postData.author?.handle || 'contributor',
        avatar: postData.author?.avatar || 'CE',
        role: postData.author?.role || 'Systems Engineer',
      },
      publishedAt: new Date().toISOString(),
      readTimeMinutes: readTime,
      appreciations: 0,
      status: postData.status || 'draft',
      epigraph: postData.epigraph || null,
      content:
        postData.content ||
        '## §I. System Architecture Overview\n\nBegin your technical deep-dive or field notes here...\n',
    };

    const updated = [newPost, ...all];
    storage.set(STORAGE_KEYS.POSTS, updated);
    return newPost;
  }

  /**
   * Update an existing post
   */
  async update(id, updates) {
    await new Promise((resolve) => setTimeout(resolve, 30));
    const all = storage.get(STORAGE_KEYS.POSTS, initialPosts);
    const index = all.findIndex((e) => e.id === id);

    if (index === -1) {
      throw new Error(`Cannot update: Entry ${id} does not exist`);
    }

    const current = all[index];
    const newTitle = updates.title !== undefined ? updates.title : current.title;
    const newContent = updates.content !== undefined ? updates.content : current.content;
    const newSlug = updates.slug || (updates.title ? generateSlug(newTitle) : current.slug);

    const updatedPost = {
      ...current,
      ...updates,
      title: newTitle,
      slug: newSlug,
      filename: `${newSlug}.md`,
      language: 'en',
      content: newContent,
      readTimeMinutes: calculateReadTime(newContent, 'en'),
      updatedAt: new Date().toISOString(),
    };

    all[index] = updatedPost;
    storage.set(STORAGE_KEYS.POSTS, all);
    return updatedPost;
  }

  /**
   * Delete a post
   */
  async delete(id) {
    await new Promise((resolve) => setTimeout(resolve, 30));
    const deletedIds = storage.get(STORAGE_KEYS.DELETED_IDS, []);
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      storage.set(STORAGE_KEYS.DELETED_IDS, deletedIds);
    }
    return true;
  }

  /**
   * Appreciate a post (persists count)
   */
  async toggleAppreciation(id) {
    const appreciated = new Set(storage.get(STORAGE_KEYS.APPRECIATED_IDS, []));
    const hasAppreciated = appreciated.has(id);

    const all = storage.get(STORAGE_KEYS.POSTS, initialPosts);
    const post = all.find((e) => e.id === id);

    let newCount = post ? post.appreciations || 0 : 0;

    if (hasAppreciated) {
      appreciated.delete(id);
      newCount = Math.max(0, newCount - 1);
    } else {
      appreciated.add(id);
      newCount = newCount + 1;
    }

    if (post) {
      post.appreciations = newCount;
      storage.set(STORAGE_KEYS.POSTS, all);
    }

    storage.set(STORAGE_KEYS.APPRECIATED_IDS, Array.from(appreciated));
    return { hasAppreciated: !hasAppreciated, appreciations: newCount };
  }

  getAppreciatedIds() {
    return new Set(storage.get(STORAGE_KEYS.APPRECIATED_IDS, []));
  }

  /**
   * Reading List (Bookmarks)
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
    const posts = await this.getAll(false);
    const counts = {};
    TECHNICAL_SECTIONS.forEach((s) => {
      counts[s] = 0;
    });
    posts.forEach((e) => {
      const section = e.section || 'Systems';
      counts[section] = (counts[section] || 0) + 1;
    });
    return Object.entries(counts).map(([section, count]) => ({ section, count }));
  }

  /**
   * Get all tags with counts
   */
  async getTags() {
    const posts = await this.getAll(false);
    const map = {};
    posts.forEach((e) => {
      e.tags?.forEach((t) => {
        map[t] = (map[t] || 0) + 1;
      });
    });
    return Object.entries(map).map(([tag, count]) => ({ tag, count }));
  }
}

export const postService = new PostService();
export const LITERARY_SECTIONS = TECHNICAL_SECTIONS;
