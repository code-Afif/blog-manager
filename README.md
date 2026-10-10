# Marginalia — A Journal of Literature, Thought, and Translation

> **A quiet digital publishing platform and reading room for writers and readers of literature.**
> Built with React 18, Vite, Plain JavaScript (`.js` / `.jsx`), TipTap, DOMPurify, and Zustand with local storage persistence.

---

## 1. Literary Aesthetic & Philosophy

Marginalia is designed specifically for writers and readers of literature, not programmers. The visual design rejects dashboard aesthetics, neon glows, drop shadows, and gradients in favor of classical printed book craftsmanship:

- **Paper & Ink Palette**:
  - **Day Paper**: Cream French rag paper (`#FDF9F2`) with deep carbon ink (`#1C1C18`) and oxblood bookcloth accents (`#5D2630`).
  - **Night Library**: Midnight library canvas (`#151718`) with warm aged vellum text (`#E6E2D8`) and warm amber accents (`#D47942`).
  - **Rules & Depth**: Thin hairlines (`1px` solid rules), zero box-shadows, zero glowing effects.
- **Multilingual Classical Typography**:
  - **Display & Titles**: *EB Garamond* — monumental classical serif with humanist proportions.
  - **Body Prose**: *Newsreader* — optical sizing designed for long-form literary immersion.
  - **Hindi (हिन्दी)**: *Noto Serif Devanagari* with authentic font metrics.
  - **Urdu (اردو)**: *Noto Nastaliq Urdu* and *Amiri* with native right-to-left bidirectional flow.
  - **Editorial Ornaments**: Traditional drop caps, pull quotes, footnotes, and fleuron dividers (`* * *`).
- **Plain, Humane Words**:
  - All programmer jargon has been removed.
  - "Section" instead of tags.
  - "Publish" instead of status or deployment.
  - "Draft" instead of unpublished buffer.
  - "Saved" instead of autosave telemetry.
  - "My Desk" instead of post dispatch desk.

---

## 2. Platform Architecture & Features

### 1. Three-Zone Substack-Inspired Layout
- **Left Navigation Rail**:
  - Marginalia wordmark in high-contrast display serif.
  - Links to **Home**, **Reading List**, **Explore**, **Activity**, and **Profile**.
  - Prominent accent **Create** button with a dropdown menu: "Essay" (long piece) and "Note" (short thought).
  - Collapses to icons on tablet; becomes a clean bottom navigation bar on mobile (Home, Explore, Create, Activity, Profile).
- **Centre Column**:
  - Calm, focused reading column (`~680px - 740px` wide) keeping line lengths comfortable and fatigue-free.
- **Right Column (Desktop only)**:
  - Universal search box with full Unicode support (English, Hindi, Urdu).
  - **Writers you follow**: Avatars and names of followed authors.
  - **Recommended for you**: 3 to 5 literary voices with a Follow button and an "×" dismiss action.
- **Masthead**:
  - High-contrast serif wordmark, thin double rule, Day/Night toggle, and universal language switch (**All** / **English** / **हिन्दी** / **اردو**).

### 2. Home Feed: Essays & Notes
- **Top Tab Switch**: Simple switch between **Essays** and **Notes**.
- **Essays Tab**:
  - The typeset contents list: Issue number (`№ 01`), title, dek, author byline, language label, reading time, and appreciations.
  - Filter pills: "All", "Following", "Essays", "Poetry", "Fiction", "Criticism", "Translation", "Authors", "History", "Language".
  - Sorter controls: *Curator’s Selection*, *Recent Dispatches*, *Most Appreciated*.
- **Notes Tab**:
  - Stream of short thoughts, reflections, and literary quotes.
  - Monogram avatar, author name, relative timestamp, note content, and actions for Appreciate (heart), Reply (1-level deep), and Save.
  - Seeded with 15 literary notes across English, Hindi, and Urdu.

### 3. Notes Composer ("What's on your mind?")
- Quick composer trigger on the Home Notes feed and accessible via **Create > Note**.
- Modal composer featuring:
  - Author monogram avatar and name.
  - Large text area with native bidirectional typesetting (`dir="auto"`).
  - Emoji-free language selector (English / हिन्दी / اردو).
  - Quiet 500-character counter appearing only as the limit approaches.
  - Image attachment and quotation formatting.
  - Automatic draft saving to `localStorage` with a "Drafts" quick-resume link.

### 4. Substack-Style Rich-Text Essay Editor (`/write` and `/write/:id`)
- **Lazy-Loaded Route**: Isolated in an asynchronous chunk to keep the reading experience light and instant.
- **Distraction-Free Environment**:
  - Top bar: Back arrow to My Desk, quiet "Saved" badge (shows "Saving..." while typing and "Saved" afterwards), "Preview", and "Continue".
  - Formatting toolbar (single sticky row with thin rule): Style dropdown (Paragraph, Heading, Subheading, Quote), Bold, Italic, Strikethrough, Underline, Highlight, Link, Image, Blockquote, Bullet list, Numbered list, Alignment (left / center / right), Undo, Redo, and a "More" menu (Divider fleuron `* * *`, Pull quote, Footnote, RTL toggle).
  - Floating Bubble Menu: Contextual formatting toolbar on text selection (Bold, Italic, Link, Quote, Highlight).
  - Quick Insert Slash Menu: Typing `/` at the start of an empty line opens insertion options.
  - Authoring Canvas: Title, Subtitle (dek), optional Epigraph with attribution, and byline chip with co-author management.
  - Multilingual & Bidirectional Support: Seamless typing in English, Hindi (Devanagari), and Urdu (Nastaliq RTL).
  - Automatic Slug Generation: Transliterates Latin slugs behind the scenes; writers never see technical URLs.

### 5. Preview & Publish Flow
- **Preview**: Full-screen preview rendering the exact reading layout with drop cap, fonts, and a toggle between **Desktop** (680px) and **Phone** (375px) widths.
- **Continue ("Ready to publish?") Dialog**:
  - Pre-filled editable Title and Subtitle.
  - Section dropdown (*Essays*, *Poetry*, *Fiction*, *Criticism*, *Translation*, *Authors*, *History*, *Language*).
  - Language dropdown (auto-detected with manual override).
  - Optional short summary line pre-filled from the opening sentence.
  - "Publish now", "Save as draft", and "Cancel".
- **Confirmation**: Calm celebratory screen ("Your essay is published.") with "View essay", "Share link", and "Write another".

### 6. My Desk (`/desk`)
- Replaces former technical dispatch manager.
- Tabs for **Essays** (Drafts & Published) and **Notes**.
- Displays title, language badge, date, and quiet "Edit" and "Delete" actions.
- Polite delete confirmation: *"Delete this essay? This cannot be undone."*
- Empty desk state: *"Your desk is clear. Begin something new."* with a Create button.

### 7. Social & Discovery Features
- **Follow Writers**: Follow / Following toggle across writer bylines, recommended sidebar, and profiles.
- **Writer Profile (`/writer/:handle` & `/profile`)**:
  - Monogram avatar, bio, languages written in, Follow action, and tabs for Essays and Notes.
  - Profile owner can edit their name and bio directly in place.
- **Explore (`/explore`)**:
  - Browse by Language (English, Hindi, Urdu with piece counts).
  - Browse by Section with piece counts.
  - Side-by-side curated lists for *Recently Published* and *Most Appreciated*.
- **Activity (`/activity`)**:
  - Stream of reader appreciations, saved reading notes, replies, and new followers.
- **Reading List (`/reading-list`)**:
  - Saved essays and saved notes preserved in local storage for quiet return.

---

## 3. Technology Stack

- **Core**: React 18, Vite.
- **Language**: Plain JavaScript (`.js` / `.jsx`), Zero TypeScript.
- **Rich-Text Editor**: TipTap (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-underline`, `@tiptap/extension-highlight`, `@tiptap/extension-link`, `@tiptap/extension-image`, `@tiptap/extension-text-align`, `@tiptap/extension-placeholder`).
- **Security & Sanitization**: `DOMPurify` for sanitizing all stored and rendered HTML.
- **State & Persistence**: Zustand with `persist` middleware storing data in browser `localStorage`.
- **Styling**: Vanilla CSS tokens (`tokens.css`, `typography.css`, `index.css`) with zero CSS frameworks.
- **Icons**: Lucide React.

---

## 4. Project Folder Structure

```
blog-manager/
├── index.html                   # HTML entrypoint, Google Fonts, synchronous theme check
├── package.json                 # Dependencies & scripts
├── README.md                    # Project overview & architectural guide
├── INTERVIEW_NOTES.md           # Engineering decisions, challenges & interview questions
├── src/
│   ├── App.jsx                  # Root router with lazy-loaded PostEditor
│   ├── main.jsx                 # React root mount
│   ├── index.css                # Global resets, button styles, responsive layout classes
│   ├── components/
│   │   ├── common/              # Colophon, ErrorBoundary, About modal
│   │   ├── layout/              # LiteraryMasthead, LeftNavRail, RightSidebar, WorkspaceLayout
│   │   └── ui/                  # Modal, Button, RollingCounter
│   ├── data/
│   │   └── posts.json           # Multilingual seed essays (English, Hindi, Urdu in HTML)
│   ├── features/
│   │   ├── activity/            # ActivityPage (notifications & engagements)
│   │   ├── comments/            # CommentThread, CommentItem, CommentForm (Marginal Notes)
│   │   ├── editor/              # RichTextEditor, PostEditor, PublishModal, EssayPreview, MyPostsManager
│   │   ├── explore/             # ExplorePage (Browse by language & section)
│   │   ├── notes/               # NotesFeed, NotesComposerModal
│   │   ├── posts/               # PostIndex, PostRow, PostReader, MarkdownRenderer, TableOfContents
│   │   ├── profile/             # ProfilePage (Writer folio & editable profile)
│   │   └── search/              # CommandPalette, EmptySearchState
│   ├── hooks/                   # useDebounce, useHotkeys, useScrollSpy
│   ├── lib/
│   │   ├── notesService.js      # Notes CRUD, replies, appreciations, drafts, and seed notes
│   │   ├── postService.js       # Essay CRUD, sections, appreciations, and reading list
│   │   ├── storage.js           # Safe localStorage wrapper
│   │   └── utils.js             # Transliterated Latin slugs, word counts, relative dates
│   ├── store/
│   │   ├── authStore.js         # Reader authentication & saved lists
│   │   ├── commentsStore.js     # Marginal notes store
│   │   ├── socialStore.js       # Writer following, recommendations, and activity events
│   │   └── workspaceStore.js    # Theme, language, home tab, and active folios
│   └── styles/
│       ├── tokens.css           # Color tokens, paper/ink palette, oxblood/amber accents
│       └── typography.css       # EB Garamond, Newsreader, Noto Devanagari, Noto Nastaliq Urdu
```

---

## 5. Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Launch Vite development server
npm run dev

# 3. Production build validation
npm run build
```