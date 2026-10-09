import initialPosts from '../data/posts.json';
import { storage } from './storage';
import { calculateReadTime, generateSlug } from './utils';

const STORAGE_KEYS = {
  POSTS: 'devlog_posts_override',
  DELETED_IDS: 'devlog_deleted_ids',
  STASHED_IDS: 'devlog_stashed_ids',
  STARRED_IDS: 'devlog_starred_ids',
};

/**
 * Service layer wrapping all post data operations.
 * Can be swapped for REST or GraphQL API endpoints without touching UI components.
 */
class PostService {
  constructor() {
    this._initStorage();
  }

  _initStorage() {
    const stored = storage.get(STORAGE_KEYS.POSTS);
    if (!stored) {
      // First run: save seed posts
      storage.set(STORAGE_KEYS.POSTS, initialPosts);
    }
  }

  /**
   * Fetch all active posts (excluding deleted)
   */
  async getAll() {
    // Simulate slight async network delay (50ms) for realistic service feel
    await new Promise((resolve) => setTimeout(resolve, 30));
    const posts = storage.get(STORAGE_KEYS.POSTS, initialPosts);
    const deletedIds = new Set(storage.get(STORAGE_KEYS.DELETED_IDS, []));
    return posts.filter((p) => !deletedIds.has(p.id));
  }

  /**
   * Fetch a single post by slug
   */
  async getBySlug(slug) {
    await new Promise((resolve) => setTimeout(resolve, 30));
    const all = await this.getAll();
    const post = all.find((p) => p.slug === slug || p.filename === slug);
    if (!post) {
      throw new Error(`ENOENT: no such file or directory: /posts/${slug}.md`);
    }
    return post;
  }

  /**
   * Fetch post by id
   */
  async getById(id) {
    await new Promise((resolve) => setTimeout(resolve, 20));
    const all = await this.getAll();
    const post = all.find((p) => p.id === id);
    if (!post) {
      throw new Error(`ENOENT: post ${id} not found`);
    }
    return post;
  }

  /**
   * Create a new post
   */
  async create(postData) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const allPosts = storage.get(STORAGE_KEYS.POSTS, initialPosts);

    const slug = generateSlug(postData.title || 'untitled-post');
    const folder = postData.folder || 'drafts';
    const filename = `${slug}.md`;
    const readTime = calculateReadTime(postData.content || '');

    const newPost = {
      id: `post-${Date.now().toString(36)}`,
      slug,
      filename,
      folder,
      title: postData.title || 'Untitled Post',
      excerpt: postData.excerpt || (postData.content || '').slice(0, 140) + '...',
      category: postData.category || 'Engineering',
      tags: Array.isArray(postData.tags) ? postData.tags : ['dev'],
      author: {
        name: 'Local Developer',
        handle: 'localuser',
        avatar: 'DEV',
      },
      publishedAt: new Date().toISOString(),
      readTimeMinutes: readTime,
      stars: 0,
      status: postData.status || 'published',
      content: postData.content || '# New Post\n\nStart writing here...',
    };

    const updated = [newPost, ...allPosts];
    storage.set(STORAGE_KEYS.POSTS, updated);
    return newPost;
  }

  /**
   * Update an existing post
   */
  async update(id, updates) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const allPosts = storage.get(STORAGE_KEYS.POSTS, initialPosts);
    const index = allPosts.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new Error(`Cannot update: post ${id} does not exist`);
    }

    const current = allPosts[index];
    const newTitle = updates.title !== undefined ? updates.title : current.title;
    const newContent = updates.content !== undefined ? updates.content : current.content;
    const newSlug = updates.slug || (updates.title ? generateSlug(newTitle) : current.slug);

    const updatedPost = {
      ...current,
      ...updates,
      title: newTitle,
      slug: newSlug,
      filename: `${newSlug}.md`,
      content: newContent,
      readTimeMinutes: calculateReadTime(newContent),
      updatedAt: new Date().toISOString(),
    };

    allPosts[index] = updatedPost;
    storage.set(STORAGE_KEYS.POSTS, allPosts);
    return updatedPost;
  }

  /**
   * Delete a post
   */
  async delete(id) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const deletedIds = storage.get(STORAGE_KEYS.DELETED_IDS, []);
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      storage.set(STORAGE_KEYS.DELETED_IDS, deletedIds);
    }
    return true;
  }

  /**
   * Reset all posts to initial seed data
   */
  async resetToDefaults() {
    storage.set(STORAGE_KEYS.POSTS, initialPosts);
    storage.set(STORAGE_KEYS.DELETED_IDS, []);
    return initialPosts;
  }

  /**
   * Get unique tags with post count
   */
  async getTags() {
    const posts = await this.getAll();
    const tagMap = {};
    posts.forEach((p) => {
      p.tags?.forEach((t) => {
        tagMap[t] = (tagMap[t] || 0) + 1;
      });
    });
    return Object.entries(tagMap).map(([tag, count]) => ({ tag, count }));
  }

  /**
   * Get folder tree structure
   */
  async getFolders() {
    const posts = await this.getAll();
    const folders = {};
    posts.forEach((p) => {
      const folder = p.folder || 'misc';
      if (!folders[folder]) {
        folders[folder] = [];
      }
      folders[folder].push(p);
    });
    return folders;
  }

  /**
   * Star / unstar a post
   */
  async toggleStar(id) {
    const starredIds = new Set(storage.get(STORAGE_KEYS.STARRED_IDS, []));
    const isStarred = starredIds.has(id);
    const allPosts = storage.get(STORAGE_KEYS.POSTS, initialPosts);
    const post = allPosts.find((p) => p.id === id);

    let newCount = post ? post.stars : 0;
    if (isStarred) {
      starredIds.delete(id);
      newCount = Math.max(0, newCount - 1);
    } else {
      starredIds.add(id);
      newCount = newCount + 1;
    }

    if (post) {
      post.stars = newCount;
      storage.set(STORAGE_KEYS.POSTS, allPosts);
    }
    storage.set(STORAGE_KEYS.STARRED_IDS, Array.from(starredIds));

    return { isStarred: !isStarred, stars: newCount };
  }

  getStarredIds() {
    return new Set(storage.get(STORAGE_KEYS.STARRED_IDS, []));
  }

  /**
   * Stash / unstash (bookmark)
   */
  toggleStash(id) {
    const stashed = new Set(storage.get(STORAGE_KEYS.STASHED_IDS, []));
    const isStashed = stashed.has(id);
    if (isStashed) {
      stashed.delete(id);
    } else {
      stashed.add(id);
    }
    storage.set(STORAGE_KEYS.STASHED_IDS, Array.from(stashed));
    return !isStashed;
  }

  getStashedIds() {
    return new Set(storage.get(STORAGE_KEYS.STASHED_IDS, []));
  }
}

export const postService = new PostService();
