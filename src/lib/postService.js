import initialPosts from '../data/posts.json';
import { storage } from './storage';
import { calculateReadTime, generateSlug } from './utils';
import { supabase, isSupabaseConfigured } from './supabase';

export const SECTIONS = [
  'Essays',
  'Poetry',
  'Fiction',
  'Criticism',
  'Translation',
  'Authors',
  'History',
  'Language',
];

export const LITERARY_SECTIONS = SECTIONS;
export const TECHNICAL_SECTIONS = SECTIONS; // Backwards compatibility

const STORAGE_KEYS = {
  POSTS: 'marginalia_journal_posts_v1',
  DELETED_IDS: 'marginalia_journal_deleted_ids_v1',
  READING_LIST: 'marginalia_journal_reading_list_v1',
  APPRECIATED_IDS: 'marginalia_journal_appreciated_v1',
};

function normalizeSupabasePost(row) {
  return {
    id: row.id,
    number: row.number || 1,
    essayNumber: row.essay_number || row.number || 1,
    slug: row.slug,
    title: row.title,
    dek: row.dek || '',
    summary: row.summary || row.dek || '',
    section: row.section || 'Essays',
    language: row.language || 'en',
    status: row.status || 'published',
    readTimeMinutes: row.read_time_minutes || 5,
    appreciations: row.appreciations || 0,
    content: row.content || '',
    epigraph: row.epigraph || null,
    image: row.image || null,
    author: row.author || {
      name: 'Contributing Writer',
      handle: 'writer',
      initials: 'CW',
      role: 'Writer',
    },
    publishedAt: row.created_at || new Date().toISOString(),
  };
}

class PostService {
  constructor() {
    this._initStorage();
  }

  _initStorage() {
    const stored = storage.get(STORAGE_KEYS.POSTS);
    // If not stored or holding legacy non-English posts, re-seed with fresh English Marginalia essays
    if (
      !stored ||
      !Array.isArray(stored) ||
      stored.length === 0 ||
      stored.some((p) => p.language === 'hi' || p.language === 'ur')
    ) {
      storage.set(STORAGE_KEYS.POSTS, initialPosts);
      storage.set(STORAGE_KEYS.DELETED_IDS, []);
      storage.set(STORAGE_KEYS.READING_LIST, []);
    }
  }

  async getAll(includeDrafts = false) {
    await new Promise((resolve) => setTimeout(resolve, 15));

    // If Supabase is configured, attempt fetch from cloud database
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('posts').select('*').order('created_at', { ascending: false });
        if (!includeDrafts) {
          query = query.eq('status', 'published');
        }
        const { data, error } = await query;
        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map(normalizeSupabasePost);
        }
      } catch (err) {
        console.warn('[postService] Supabase fetch error, fallback to local storage:', err);
      }
    }

    const all = storage.get(STORAGE_KEYS.POSTS, initialPosts);
    const deletedIds = new Set(storage.get(STORAGE_KEYS.DELETED_IDS, []));

    const active = all.filter((e) => !deletedIds.has(e.id));
    if (includeDrafts) {
      return active;
    }
    return active.filter((e) => (e.status || 'published') === 'published');
  }

  async getBySlug(slug) {
    await new Promise((resolve) => setTimeout(resolve, 15));

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .or(`slug.eq.${slug},id.eq.${slug}`)
          .single();
        if (!error && data) {
          return normalizeSupabasePost(data);
        }
      } catch (err) {
        console.warn('[postService] Supabase getBySlug fallback:', err);
      }
    }

    const all = storage.get(STORAGE_KEYS.POSTS, initialPosts);
    const deletedIds = new Set(storage.get(STORAGE_KEYS.DELETED_IDS, []));
    const post = all.find(
      (e) => !deletedIds.has(e.id) && (e.slug === slug || e.id === slug)
    );

    if (!post) {
      throw new Error(`Essay not found under reference: ${slug}`);
    }
    return post;
  }

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

  async create(postData) {
    await new Promise((resolve) => setTimeout(resolve, 20));
    const all = storage.get(STORAGE_KEYS.POSTS, initialPosts);

    const title = postData.title || 'Untitled Essay';
    const slug = generateSlug(title);
    const lang = postData.language || 'en';
    const readTime = calculateReadTime(postData.content || '', lang);

    const newPost = {
      id: `essay-${Date.now().toString(36)}`,
      number: all.length + 1,
      essayNumber: all.length + 1,
      slug,
      language: lang,
      title,
      dek: postData.dek || '',
      summary: postData.summary || postData.dek || '',
      section: postData.section || 'Essays',
      author: {
        id: postData.author?.id || null,
        name: postData.author?.name || 'Contributing Writer',
        handle: postData.author?.handle || 'writer',
        initials: postData.author?.initials || 'CW',
        role: postData.author?.role || 'Contributing Writer',
      },
      publishedAt: new Date().toISOString(),
      readTimeMinutes: readTime,
      appreciations: 0,
      status: postData.status || 'published', // 'published' | 'draft'
      epigraph: postData.epigraph || null,
      image: postData.image || null,
      content:
        postData.content ||
        '<p><span class="drop-cap">B</span>egin your reflection or manuscript here...</p>',
    };

    const updated = [newPost, ...all];
    storage.set(STORAGE_KEYS.POSTS, updated);

    // Sync to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('posts').upsert({
          id: newPost.id,
          slug: newPost.slug,
          title: newPost.title,
          dek: newPost.dek,
          summary: newPost.summary,
          section: newPost.section,
          language: newPost.language,
          status: newPost.status,
          read_time_minutes: newPost.readTimeMinutes,
          appreciations: 0,
          content: newPost.content,
          epigraph: newPost.epigraph,
          image: newPost.image,
          author: newPost.author,
          created_at: newPost.publishedAt,
          updated_at: newPost.publishedAt,
        });
      } catch (err) {
        console.warn('[postService] Supabase create error:', err);
      }
    }

    return newPost;
  }

  async update(id, updates) {
    await new Promise((resolve) => setTimeout(resolve, 20));
    const all = storage.get(STORAGE_KEYS.POSTS, initialPosts);
    const index = all.findIndex((e) => e.id === id);

    if (index === -1) {
      throw new Error(`Cannot update: Essay ${id} does not exist`);
    }

    const current = all[index];
    const newTitle = updates.title !== undefined ? updates.title : current.title;
    const newContent = updates.content !== undefined ? updates.content : current.content;
    const newSlug = updates.slug || (updates.title ? generateSlug(newTitle) : current.slug);
    const newLang = updates.language || current.language || 'en';

    const updatedPost = {
      ...current,
      ...updates,
      title: newTitle,
      slug: newSlug,
      language: newLang,
      content: newContent,
      readTimeMinutes: calculateReadTime(newContent, newLang),
      updatedAt: new Date().toISOString(),
    };

    all[index] = updatedPost;
    storage.set(STORAGE_KEYS.POSTS, all);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('posts').upsert({
          id: updatedPost.id,
          slug: updatedPost.slug,
          title: updatedPost.title,
          dek: updatedPost.dek,
          summary: updatedPost.summary,
          section: updatedPost.section,
          language: updatedPost.language,
          status: updatedPost.status,
          read_time_minutes: updatedPost.readTimeMinutes,
          appreciations: updatedPost.appreciations || 0,
          content: updatedPost.content,
          epigraph: updatedPost.epigraph,
          image: updatedPost.image,
          author: updatedPost.author,
          updated_at: updatedPost.updatedAt,
        });
      } catch (err) {
        console.warn('[postService] Supabase update error:', err);
      }
    }

    return updatedPost;
  }

  async delete(id) {
    await new Promise((resolve) => setTimeout(resolve, 20));
    const deletedIds = storage.get(STORAGE_KEYS.DELETED_IDS, []);
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      storage.set(STORAGE_KEYS.DELETED_IDS, deletedIds);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('posts').delete().eq('id', id);
      } catch (err) {
        console.warn('[postService] Supabase delete error:', err);
      }
    }

    return true;
  }

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

  async getSections() {
    const posts = await this.getAll(false);
    const counts = {};
    SECTIONS.forEach((s) => {
      counts[s] = 0;
    });
    posts.forEach((e) => {
      const section = e.section || 'Essays';
      counts[section] = (counts[section] || 0) + 1;
    });
    return Object.entries(counts).map(([section, count]) => ({ section, count }));
  }
}

export const postService = new PostService();
