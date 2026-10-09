# Marginalia — A Literary Quarterly (हाशिया)

*Marginalia* is an independent digital quarterly and essay publication dedicated to **English and Hindi literature**. Built with React 18, Vite, and plain JavaScript (`.js` / `.jsx`), it models the typographic discipline and serene pacing of classical letterpress publishing.

The journal presents 12 deeply considered, original essays (6 English, 6 Hindi in Devanagari script) exploring poetry, fiction, literary criticism, translation, and historical memory. Rejecting ephemeral feeds, synthetic AI gradients, and hurried technical blogs, *Marginalia* treats digital text with the quiet permanence of printed paper.

---

## 1. Project Description & Full Feature List

### A. Multilingual Architecture & Native Scripts
- **Bilingual Editorial Catalog**: 12 original essays of 500–1000 words written natively in each tongue:
  - **English (6 essays)**: Reflections on slow reading, the mechanics of the held-breath short story, rereadability of classic novels, translation as friendship, literary diaries, and the architecture of the essay.
  - **Hindi / हिन्दी (6 essays in Devanagari)**: Original essays on Premchand and rural realism, Kabir and the language of the bazaar, Mahadevi Varma’s introspective lyricism, the post-Independence *Nayi Kahani*, urban alienation in the Hindi novel, and Ramdhari Singh Dinkar’s fiery verse.
- **Language Filtering**: Instant language chips (`All`, `English`, `हिन्दी`) synced bidirectionally to the `?lang=...` query parameter.
- **Transliterated Latin Slugs**: All URLs use clean, permanent ASCII slugs (e.g. `/essays/premchand-aur-sadharan-gaon`, `/essays/kabir-aur-bazar-ki-bhasha`) to prevent URL encoding corruption while preserving native titles in the UI.
- **Calibrated Reading Speeds**: Tailored word-per-minute estimation (~180 wpm for Hindi, ~220 wpm for English).
- **Language Identification**: Small-caps language pills (`EN`, `हिं`) adorn list rows, shelf cards, and reading headers.

### B. Literary Typographic Hierarchy & Theming
- **Dedicated Typeface Pairing**:
  - *Newsreader* (Production Type): Optical-size serif for English body text and headers.
  - *Noto Serif Devanagari* (Google Fonts): Balanced Devanagari glyphs with ~1.9 line-height ensuring clean matras and conjuncts.
  - *Instrument Sans*: Crisp humanist grotesk for UI metadata, counters, and navigation.
  - *JetBrains Mono*: Subtle monospace for folio numerals, timestamps, and metadata.
- **Script-Safe Drop Caps**: Drop caps (`::first-letter`) are enabled for English prose, but strictly disabled for Hindi (`[lang="hi"]`) to prevent breaking Devanagari conjuncts or detaching upper vowel signs (*matras*).
- **Strictly Zero Gradients**: Handcrafted unbleached rag paper tone (`#F7F5EE`) in Day Paper mode and midnight library paper (`#131210`) in Night mode. Zero glows, zero shadows, flat 1px hairline rules.
- **Zero-Flash Theme Synchronization**: Synchronous `<head>` script prevents FOUC (flash of unstyled content) on reload.

### C. Sections & Archival Discovery
- **8 Literary Sections**:
  `Poetry`, `Fiction`, `Essays`, `Criticism`, `Translation`, `Authors`, `History`, `Language`.
- **Bilingual Section Labels**: Section chips display dual titles where space permits (e.g. `Poetry / कविता`, `Fiction / कथा-साहित्य`).
- **Unicode-Normalized Full-Text Search**:
  - Searches titles, excerpts, tags, authors, and body text.
  - Unicode NFC normalization with stripping of Devanagari nukta (`\u093C`).
  - Native searching in Devanagari (e.g. `प्रेमचंद`, `कबीर`) returns instant results.
- **Table of Contents & Reading Shelf**:
  - Dual presentation modes: Tabular folio rows and structured editorial card plates.
  - Contents / Shelf view switcher with persistent bookmarking (`B` key).
  - Sorting: *Newest Essays*, *Most Appreciated*, and *Shortest Read*.

### D. The Reading Experience & Marginal Notes
- **Authentic Reading Plates**: Markdown rendering with classical epigraphs, subheadings, pull quotes, and scholarly footnotes (`[^1]`).
- **Dynamic Reading Progress Line**: Flat hairline indicator tracking progress down the essay container.
- **Section Outline (Scroll-Spy)**: Sticky table of contents highlighting active headings in real-time.
- **Marginal Notes**: Reader annotation thread supporting notes in English and Hindi with relative timestamps and single-level nested replies.
- **Rolling Appreciation Counter**: Appreciate heart button with local single-vote deduplication and animated digit transitions.

### E. Author’s Desk & Composition Suite ("Write")
- **Dual-Pane Composition Suite**: Raw markdown editor on the left with live rendered preview on the right and synchronized scroll tracking.
- **Language Selector (English / हिन्दी)**:
  - Dynamically updates the textarea font, line-height, and placeholder.
  - Seamless native typing in English and Devanagari script.
- **Autosave to LocalStorage**: Debounced background persistence (700ms) with `● Draft saved` visual confirmation.
- **Desk Management Console (`/desk`)**: Private author dashboard to review drafts and published manuscripts.

---

## 2. Tech Stack & Architectural Decisions

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Runtime & Bundler** | React 18 + Vite | Rapid HMR, deterministic ES module resolution, clean production bundle chunks. |
| **Language** | Plain JavaScript (`.jsx` / `.js`) | Clean ES2022+ syntax, zero TypeScript annotations per project specification. |
| **Routing** | React Router v6 (`react-router-dom`) | Declarative client routing with nested layouts, query param hooks, and SPA history. |
| **State Management** | Zustand (`zustand/middleware`) | Lightweight atomic stores with selector subscriptions, zero context re-render cascades. |
| **Typography & Styling** | Vanilla CSS + CSS Variables | Maximum typographic control with CSS tokens and CSS Logical Properties. |
| **Markdown Processing**| `react-markdown` + `remark-gfm` | Robust AST parsing with custom renderers for headings, pull quotes, and footnotes. |
| **Fonts** | Newsreader, Noto Serif Devanagari, Instrument Sans | Authentic native typography loaded via Google Fonts with complete glyph coverage. |
| **Motion** | Framer Motion | Smooth physics-based modal and tab transitions with `prefers-reduced-motion` support. |

---

## 3. Setup & Running Locally

### Prerequisites
- Node.js version 18.0.0 or higher
- npm (Node Package Manager)

### Installation Steps
```bash
# 1. Clone the repository
git clone https://github.com/your-username/marginalia.git
cd marginalia

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
# Server boots at http://localhost:3000/

# 4. Create production build
npm run build

# 5. Preview production build locally
npm run preview
```

---

## 4. Challenges Faced and How I Solved Them

### 1. Devanagari Headroom and Typographic Spacing
- **The Challenge**: Devanagari script requires significant vertical clearance above and below the baseline for vowel signs (*matras*, e.g., `ि`, `ी`, `े`, `ै`) and *shirorekha* horizontal headlines. Under standard Latin line heights (1.4–1.5), Devanagari lines feel congested and matras can touch neighboring descenders.
- **The Solution**: Loaded *Noto Serif Devanagari* through Google Fonts and calibrated scoped CSS typography variables: Hindi text receives `line-height: ~1.8–1.9` and `padding-block: 2px`, ensuring comfortable breathing room for conjuncts and headlines.

### 2. Script-Safe Drop Caps
- **The Challenge**: Classical letterpress typography celebrates initial drop caps (`::first-letter`). However, in Indic scripts like Devanagari, splitting the first character can tear complex conjuncts (e.g., `प्र` in `प्रेमचंद`) or isolate the top matra from its consonant root.
- **The Solution**: Constrained the `drop-cap::first-letter` CSS rule strictly to English prose, explicitly disabling float and drop-cap styles for `[lang="hi"]` content.

### 3. Unicode-Aware Search Normalization
- **The Challenge**: Searching in Hindi often fails because readers may type text with or without the *nukta* diacritical sign (e.g., `ज़` vs `ज`, `फ़` vs `फ`). Additionally, un-normalized Unicode strings fail standard JavaScript `.includes()` checks due to differing composed vs decomposed code points.
- **The Solution**: Implemented [`normalizeSearchText`](file:///c:/Users/Afif/Documents/BLOG%20MANAGER/blog-manager/src/lib/utils.js) using Unicode normalization:
  ```javascript
  export function normalizeSearchText(str) {
    if (!str) return '';
    return str
      .normalize('NFC')
      .replace(/[\u093C]/g, '') // Strip Devanagari nukta
      .toLowerCase()
      .trim();
  }
  ```
  Both the query and searchable text pass through this normalizer, ensuring seamless search results across Devanagari and Latin text.

### 4. Transliterated Latin Slugs
- **The Challenge**: Non-Latin characters in URL paths (e.g. `/essays/प्रेमचंद-और-गाँव`) cause ugly percent-encoded URLs (e.g. `/essays/%E0%A4%AA%E0%A5%8D...`), which break bookmark sharing, SMS links, and terminal logs.
- **The Solution**: Designed a transliteration slug generator in [`src/lib/utils.js`](file:///c:/Users/Afif/Documents/BLOG%20MANAGER/blog-manager/src/lib/utils.js) that maps Hindi phonetic characters to clean Latin equivalents (e.g. `प्रेमचंद` -> `premchand`, `कबीर` -> `kabir`). All seed essays feature human-readable Latin slugs while retaining authentic native titles for display.

### 5. Zero-Flash Night Mode (FOUC Prevention)
- **The Challenge**: Client-side theme switches implemented purely inside React's `useEffect` cause a noticeable white flash when refreshing a page saved in night mode.
- **The Solution**: Embedded an inline, zero-dependency script directly in the `<head>` of `index.html` that reads `localStorage` before the DOM renders and immediately sets the `data-theme` attribute on the root `<html>` element.

---

## 5. Directory Structure Overview

```text
blog-manager/
├── index.html                   # HTML entrypoint with fonts (Newsreader, Noto Devanagari, Instrument Sans)
├── package.json                 # Project dependencies & npm scripts
├── vercel.json                  # SPA rewrite configuration for Vercel
├── public/
│   ├── _redirects               # SPA rewrite rule for Netlify
│   └── favicon.svg              # Literary fleuron mark (❧) favicon
└── src/
    ├── main.jsx                 # React root bootstrap
    ├── App.jsx                  # Application routing & layout tree
    ├── index.css                # Global resets, buttons, hairline rules, & media queries
    ├── components/
    │   ├── common/              # AboutPage, AboutModal, ErrorBoundary, BootSequence
    │   ├── layout/              # TopBreadcrumbs, TabBar, SidebarExplorer, StatusBar, MobileNav
    │   └── ui/                  # Button, Modal, Badge, Skeleton primitives
    ├── data/
    │   └── posts.json           # 12 curated literary essays (6 English, 6 Hindi)
    ├── features/
    │   ├── comments/            # Marginal notes, threaded replies, annotation forms
    │   ├── editor/              # Split-pane editor with EN/HI switcher, My Desk console
    │   ├── posts/               # Reader, ToC scroll-spy, MarkdownRenderer, card & row presenters
    │   ├── search/              # Command palette, filter bar, language chips, empty states
    │   └── theme/               # Day Paper / Night Library toggle
    ├── hooks/                   # useScrollSpy, useHotkeys, useSyncScroll, useDebounce
    ├── lib/                     # postService.js, storage.js, utils.js (Unicode search & slug generator)
    ├── store/                   # Zustand state stores (workspaceStore.js, commentsStore.js)
    └── styles/                  # CSS tokens (tokens.css, typography.css, syntax.css)
```

---

## 6. Keyboard Directives Reference

Press `?` anywhere in the application to summon the on-screen reference manual.

| Key | Directive | Scope |
| :--- | :--- | :--- |
| `J` / `K` | Advance / reverse selected essay in catalogue list | Table of Contents |
| `Enter` | Open selected essay in reader | Table of Contents |
| `G` then `H` | Return to Table of Contents | Global |
| `/` | Focus search inquiry input | Table of Contents |
| `⌘K` / `Ctrl+K` | Open search and command palette | Global |
| `B` | Preserve / remove active essay on Reading Shelf | Reader / List |
| `L` | Inscribe appreciation on active essay | Reader |
| `T` | Toggle Day Paper / Night Library ambiance | Global |
| `Ctrl+S` / `⌘S` | Save draft or publish essay | Editor |
| `Esc` | Dismiss modal dialogs, drawers, and command palette | Global |