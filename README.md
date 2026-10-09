# devlog // Engineering Workspace & Technical Blog Manager

A dense, high-precision developer workspace and blog management platform designed with the aesthetic of a modern terminal, IDE (VS Code / Linear), and code review suite. Built with flat solid surfaces, hairline borders, zero gradients, and keyboard-first ergonomics.

---

## 1. Project Overview & Features

`devlog` abandons generic lifestyle blog templates and AI gradient cards in favor of a focused developer tool interface:

- **Editor Workspace Metaphor**:
  - **Left Sidebar File Explorer**: Posts are organized as files (`.md`) inside categoric folders (`sys/`, `db/`, `infra/`, `web/`, `arch/`, `net/`, `runtime/`, `vcs/`) with collapsible folders, file count metrics, and hover text scramble decoding.
  - **Main Area Tabbed Panes**: Multitask across multiple markdown files. Tabs feature quick open/close animations, pinned `README.md` index, and dirty/saved state tracking.
  - **Top Bar**: Hairline breadcrumbs (`devlog / posts / filename.md`), search trigger (`Ctrl+K` / `⌘K`), keyboard cheat sheet trigger (`?`), instant theme toggle, and `+ post.md` action.
  - **Bottom Status Bar**: Word count, reading time, git branch status (`git: main`), cursor position (`ln 42, col 1`), bookmark count (`stash: 3`), active theme mode, and real-time autosave indicators (`saved ●`).
- **Post Reader**:
  - Full GitHub-flavored markdown rendering with tables, blockquotes, lists, and inline code.
  - Custom Prism syntax highlighting with line numbers gutter, language indicator, and 1.5s copy feedback.
  - Sticky Table of Contents (ToC) that dynamically tracks scroll position using a custom `useScrollSpy` hook.
  - Flat acid lime reading progress bar pinned to the top of the reading pane.
  - Like button featuring scale pop micro-animation and rolling digit counter (`RollingCounter`).
  - Stash button for offline / bookmarked reads.
  - Git PR / code review styled discussion threads: square avatar initials, monospace author handles, relative timestamps, add/delete, and 1-level deep reply nesting.
- **Search & Filter System**:
  - Instant full-text search across article titles, filenames, content, and tags.
  - Topic tag filter chips with counts.
  - Sorting by newest first, most starred, and shortest read time.
  - **URL Synchronization**: Query parameters (`?q=...&tag=...&sort=...&view=...`) synchronize bidirectionally with the URL so search states and views are fully shareable and support browser history.
  - Toggle between compact tabular **list view** and flat 1px-border **grid view**.
- **Post Management & Split-Pane Editor (CRUD)**:
  - Split-pane markdown editor: raw markdown source on the left with gutter line numbers, live rendered preview on the right.
  - Synchronized scrolling between the editor textarea and preview pane without infinite scroll event loops.
  - Title, folder, tags, excerpt, and draft/published state toggles.
  - Autosaves drafts in the background to `localStorage` with real-time status bar telemetry.
  - "My Posts" management console (`my-posts.sh`) with status filters, edit links, and modal deletion confirmation dialogs.
- **Terminal States**:
  - Terminal-formatted empty search results (`$ grep -rn "xyz" ./posts/ → 0 matches found`) with suggestion hints.
  - File not found 404 state (`ENOENT: no such file or directory, open '/posts/xyz.md'`).
  - Empty stash state (`$ git stash list → 0 entries`).
  - Global `ErrorBoundary` formatted as a kernel panic / stack trace screen with reload and memory wipe options.
  - Flat loading skeleton blocks (strictly zero shimmer gradients).
- **Responsive Architecture**:
  - **Desktop (1280px+)**: Full 3-zone layout (activity rail + file explorer tree, tabbed editor pane, sticky ToC sidebar).
  - **Tablet (768px - 1024px)**: Sidebar collapses to a 42px activity icon rail to maximize document reading space.
  - **Mobile (< 768px)**: Bottom action bar with drawer slide-in for the file explorer, single-column reading view, and tab switcher ("WRITE" vs "PREVIEW") for the markdown editor.

---

## 2. Tech Stack

- **Framework**: React 18 + Vite (written in clean, pure JavaScript `.jsx` / `.js`)
- **Routing**: React Router v6 (`react-router-dom`) with client-side SPA routing and query parameter sync
- **State Management**: Zustand with `persist` middleware for persistent tabs, theme, stashed items, and starred counts
- **Animations**: Framer Motion (respects `prefers-reduced-motion`)
- **Styling**: Plain CSS with CSS Custom Property Design Tokens (`tokens.css`, `typography.css`, `syntax.css`, `index.css`)
- **Markdown & Syntax**: `react-markdown` + `remark-gfm` + `prismjs`
- **Icons**: `lucide-react` (clean, flat SVG developer icons)

---

## 3. Setup & Installation

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Run Locally
```bash
# 1. Clone repository
git clone https://github.com/your-username/devlog.git
cd devlog

# 2. Install dependencies
npm install

# 3. Start Vite development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
# Compile and optimize production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 4. Data Layer & API Swapping

All post data access is encapsulated in a dedicated service module located at [`src/lib/postService.js`](file:///src/lib/postService.js).

The repository comes pre-seeded with 15 realistic dev-focused articles in [`src/data/posts.json`](file:///src/data/posts.json) covering:
1. Rust Ownership & Lifetimes (Affine types & Non-Lexical Lifetimes)
2. Postgres B-Tree vs. BRIN Indexes (Physical page correlation)
3. Docker Multi-Stage Builds & BuildKit Cache Mounts
4. Inside React Fiber (Work loop, 32-bit lanes priority, double buffering)
5. Git Storage Internals (Blobs, trees, commits, packfiles)
6. Linux epoll & Event Loops (O(1) ready-list dispatching, edge-triggered I/O)
7. SQLite WAL Mode (Write-Ahead Logging concurrency & checkpoints)
8. TypeScript Type Inference (Bidirectional inference, object freshness)
9. Raft Distributed Consensus (Leader elections, split votes, log quorums)
10. Kafka Partitions & Zero-Copy DMA (`sendfile` kernel path)
11. HTTP/3 & QUIC (Eliminating transport Head-of-Line blocking)
12. Browser Layout Engines (Box trees, Block Formatting Contexts)
13. Go Garbage Collector (Concurrent tri-color mark & sweep, write barriers)
14. Cache Invalidation Patterns (Cache-Aside, XFetch, stampede locks)
15. WebAssembly Linear Memory (ArrayBuffer sandboxes, 128-bit SIMD)

### Swapping for a Real Backend (REST or GraphQL)

Because the UI consumes `postService` asynchronously, swapping to an external API requires editing only `src/lib/postService.js`:

```javascript
// Example: swapping local storage for a REST API
class PostService {
  async getAll() {
    const res = await fetch('/api/v1/posts');
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  }

  async getBySlug(slug) {
    const res = await fetch(`/api/v1/posts/${slug}`);
    if (!res.ok) throw new Error(`ENOENT: post ${slug} not found`);
    return res.json();
  }

  async create(data) {
    const res = await fetch('/api/v1/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  // update, delete, getTags, toggleStar follow the exact same signature
}
```

---

## 5. Keyboard Shortcuts

| Shortcut | Action | Scope |
|---|---|---|
| <kbd>J</kbd> | Move down in post index list | Global (outside inputs) |
| <kbd>K</kbd> | Move up in post index list | Global (outside inputs) |
| <kbd>Enter</kbd> | Open selected post in editor tab | Post Index |
| <kbd>/</kbd> | Focus instant search input | Post Index |
| <kbd>⌘K</kbd> / <kbd>Ctrl+K</kbd> | Open Command Palette (fuzzy search & actions) | Global |
| <kbd>N</kbd> | Create new markdown post (`untitled.md`) | Global |
| <kbd>B</kbd> | Toggle stash (bookmark) on active post | Reading View |
| <kbd>G</kbd> then <kbd>H</kbd> | Go home (open `README.md` tab) | Global |
| <kbd>?</kbd> | Toggle Keyboard Shortcuts Cheat Sheet modal | Global |
| <kbd>Esc</kbd> | Dismiss Command Palette / Modal dialog | Global |

---

## 6. Challenges Faced and How I Solved Them

### 1. Scroll-Spy Table of Contents (ToC)
- **Challenge**: Standard `IntersectionObserver` configurations often struggle with long articles when multiple headings are simultaneously within the viewport, causing jumpy or erratic active state transitions.
- **Solution**: Developed a custom [`useScrollSpy`](file:///src/hooks/useScrollSpy.js) hook that binds to the reader pane's scroll container with passive event listeners. It computes header coordinates relative to the reader pane top (`rect.top - containerTop <= 130px`) and prioritizes the nearest active heading while computing reading percentage (`(scrollTop / scrollableDistance) * 100`).

### 2. Markdown Editor Synchronized Scrolling
- **Challenge**: Syncing scroll positions between the raw markdown textarea on the left and the rendered HTML preview on the right frequently causes infinite loop feedback events where one pane's scroll fires the other pane's listener repeatedly.
- **Solution**: Designed the [`useSyncScroll`](file:///src/hooks/useSyncScroll.js) hook with an `isScrollingRef` mutex lock. When the textarea initiates a scroll, it flags `isScrollingRef.current = 'editor'`, calculates proportional percentage (`scrollTop / (scrollHeight - clientHeight)`), updates the preview pane, and sets a debounce timer (50ms) to release the lock.

### 3. URL-Synchronized Filters & Browser History
- **Challenge**: When users filter by tag, search query, sort order, and view mode, users expect the browser back button, forward button, and link sharing to restore the exact state. If every keystroke in the search bar pushes a new history entry, pressing "Back" becomes unusable.
- **Solution**: Coupled React Router's `useSearchParams` with a debounced search input (`useDebounce`, 120ms). Keystrokes update the URL using `{ replace: true }`, ensuring search typing does not flood browser history, while explicit tag chip clicks or sort toggles maintain valid history stacks.

### 4. Theme Reveal Transition Without Gradients
- **Challenge**: Most theme transitions use CSS gradients or blurred transitions, which violate our strict "flat solid colors, zero gradients" design specification.
- **Solution**: In [`ThemeToggle.jsx`](file:///src/features/theme/ThemeToggle.jsx), implemented a circular reveal using the native `document.startViewTransition` API. It calculates the maximum hypotenuse distance from the clicked toggle coordinates to screen corners (`Math.hypot(...)`) and runs a hard-edged `clip-path: circle(...)` expansion using flat theme colors, falling back instantly if `prefers-reduced-motion` is enabled.

### 5. Responsive Editor & 3-Zone Layout
- **Challenge**: Split-pane editors become unusable on screen widths under 768px if both panes attempt to fit side-by-side.
- **Solution**: Implemented an adaptive layout strategy in [`EditorSplitPane.jsx`](file:///src/features/editor/EditorSplitPane.jsx). On desktop, it renders a 50/50 split with synchronized scrolling. On screens < 768px, it switches to a dedicated "WRITE (.md)" vs "PREVIEW" tab switcher while collapsing the left sidebar to an icon rail or slide-in drawer.

---

## 7. Deployment Notes

The application is pre-configured for instant zero-configuration deployment to **Vercel** and **Netlify**:

- **Vercel**: Includes `vercel.json` with client-side SPA rewrites:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```
- **Netlify**: Includes `public/_redirects` which copies to the build directory root:
  ```text
  /*    /index.html   200
  ```

---

## 8. Design Rule Compliance Audit

- [x] **Zero Gradients**: Verified with codebase grep; no linear-gradient, radial-gradient, or conic-gradient in CSS or inline styles.
- [x] **No AI Clichés**: No blurred backdrop blobs, no glowing orbs, no purple/blue gradient buttons, no emoji, no centered hero with two oversized CTA buttons.
- [x] **1px Borders & Tight Radii**: All cards, inputs, tabs, and panels use `1px` borders with `0px` to `4px` corner radii.
- [x] **Monospace & Tabular Figures**: "JetBrains Mono" used across all UI chrome, metadata, line numbers, and headings. Numbers use `font-variant-numeric: tabular-nums`.
- [x] **Developer Vibe Details**: Line numbers in gutters, bottom status bar, blinking block cursor, `.md` file labels, keyboard hint chips (`⌘K`, `J`, `K`), and PR-style review threads.