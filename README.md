# Marginalia — A Multilingual Literary Quarterly (हाशिया · حاشیہ)

*Marginalia* is an independent digital quarterly and essay publication dedicated to **English, Hindi, and Urdu literature**. Built with React 18, Vite, and plain JavaScript (`.js` / `.jsx`), it models the typographic discipline and serene pacing of classical letterpress publishing.

The journal presents 18 deeply considered, original essays (6 English, 6 Hindi in Devanagari script, 6 Urdu in authentic Nastaliq script) exploring poetry, fiction, literary criticism, translation, and historical memory. Rejecting ephemeral feeds, synthetic AI gradients, and hurried technical blogs, *Marginalia* treats digital text with the quiet permanence of printed paper.

---

## 1. Project Description & Full Feature List

### A. Multilingual Architecture & Native Scripts
- **Trilingual Editorial Catalog**: 18 original essays of 500–1000 words written natively in each tongue:
  - **English (6 essays)**: Reflections on slow reading, the mechanics of the held-breath short story, rereadability of classic novels, translation as friendship, literary diaries, and the architecture of the essay.
  - **Hindi / हिन्दी (6 essays in Devanagari)**: Original essays on Premchand and rural realism, Kabir and the language of the bazaar, Mahadevi Varma’s introspective lyricism, the post-Independence *Nayi Kahani*, urban alienation in the Hindi novel, and Ramdhari Singh Dinkar’s fiery verse.
  - **Urdu / اردو (6 essays in Nastaliq)**: Original essays on Ghalib’s intimate epistolary prose, Mir Taqi Mir’s melancholic mastery, Saadat Hasan Manto’s fearless realism, Ismat Chughtai’s subversive courage, the internal architecture of the ghazal, and Faiz Ahmed Faiz’s poetry of sorrow and dawn.
- **Language Filtering**: Instant language chips (`All`, `English`, `हिन्दी`, `اردو`) synced bidirectionally to the `?lang=...` query parameter.
- **Transliterated Latin Slugs**: All URLs use clean, permanent ASCII slugs (e.g. `/essays/premchand-aur-sadharan-gaon`, `/essays/ghalib-ke-khutoot-aur-nasr`) to prevent URL encoding corruption while preserving native titles in the UI.
- **Multilingual Reading Speeds**: Calibrated word-per-minute estimation (~180 wpm for Hindi and Urdu, ~220 wpm for English).
- **Language Identification**: Small-caps language pills (`EN`, `हिं`, `اردو`) adorn list rows, shelf cards, and reading headers.

### B. Literary Typographic Hierarchy & Theming
- **Dedicated Typeface Pairing**:
  - *Newsreader* (Production Type): Optical-size serif for English body text and headers.
  - *Noto Serif Devanagari* (Google Fonts): Balanced Devanagari glyphs with ~1.9 line-height ensuring clean matras and conjuncts.
  - *Noto Nastaliq Urdu* (Google Fonts): Authentic hanging Nastaliq calligraphic proportions with generous line-height (2.1–2.4) preventing ascender/descender collisions.
  - *Instrument Sans*: Crisp humanist grotesk for UI metadata, counters, and navigation.
- **Bidirectional (RTL / LTR) Layouts**: Urdu essays automatically activate `dir="rtl"` with right text alignment.
- **CSS Logical Properties**: Layout rules utilize `margin-inline-start`, `border-inline-start`, and `padding-inline`, enabling pull quotes, epigraph borders, and outlines to flip naturally between LTR and RTL without stylesheet duplication.
- **Script-Safe Drop Caps**: Drop caps (`::first-letter`) are enabled for English prose, but strictly disabled for Urdu and Hindi to prevent breaking cursive ligatures and Devanagari matras.
- **Strictly Zero Gradients**: Handcrafted unbleached rag paper tone (`#F7F5EE`) in Day Paper mode and midnight library paper (`#131210`) in Night mode. Zero glows, zero shadows, flat 1px hairline rules.
- **Zero-Flash Theme Synchronization**: Synchronous `<head>` script prevents FOUC (flash of unstyled content) on reload.

### C. Sections & Archival Discovery
- **8 Literary Sections**:
  `Poetry`, `Fiction`, `Essays`, `Criticism`, `Translation`, `Authors`, `History`, `Language`.
- **Trilingual Section Labels**: Section chips display trilingual titles where space permits (e.g. `Poetry / कविता / शायरी`, `Fiction / कथा-साहित्य / افسانوی ادب`).
- **Unicode-Normalized Full-Text Search**:
  - Searches titles, excerpts, tags, authors, and body text.
  - Unicode NFC normalization with stripping of Arabic/Urdu harakat/aerab (`[\u064B-\u065F\u0670]`) and Devanagari nukta (`\u093C`).
  - Native searching in Devanagari (e.g. `प्रेमचंद`, `कबीर`) and Urdu script (e.g. `غالب`, `منٹو`) returns instant results.
- **Table of Contents & Reading Shelf**:
  - Dual presentation modes: Tabular folio rows and structured editorial card plates.
  - Contents / Shelf view switcher with persistent bookmarking (`B` key).
  - Sorting: *Newest Essays*, *Most Appreciated*, and *Shortest Read*.

### D. The Reading Experience & Marginal Notes
- **Authentic Reading Plates**: Markdown rendering with classical epigraphs, subheadings, pull quotes, and scholarly footnotes (`[^1]`).
- **Dynamic Reading Progress Line**: Flat hairline indicator tracking progress down the essay container.
- **Section Outline (Scroll-Spy)**: Sticky table of contents highlighting active headings in real-time, positioned correctly on the trailing edge in both LTR and RTL modes.
- **Bidirectional Marginal Notes**: Reader annotation thread supporting notes in English, Hindi, and Urdu with automatic directionality (`dir="auto"`), relative timestamps, and single-level nested replies.
- **Rolling Appreciation Counter**: Appreciate heart button with local single-vote deduplication and animated digit transitions.

### E. Author’s Desk & Composition Suite ("Write")
- **Dual-Pane Composition Suite**: Raw markdown editor on the left with live rendered preview on the right and synchronized scroll tracking.
- **Language Selector (English / हिन्दी / اردو)**:
  - Dynamically updates the textarea font, line-height, text alignment, and direction (`dir="rtl"` for Urdu).
  - Live preview uses `dir="auto"` to properly handle mixed-script and native-script text.
  - Seamless native typing in Devanagari and Urdu scripts.
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
| **Typography & Styling** | Vanilla CSS + CSS Variables | Maximum typographic control with CSS tokens and CSS Logical Properties for RTL/LTR. |
| **Markdown Processing**| `react-markdown` + `remark-gfm` | Robust AST parsing with custom renderers for headings, pull quotes, and footnotes. |
| **Fonts** | Newsreader, Noto Serif Devanagari, Noto Nastaliq Urdu, Instrument Sans | Authentic native typography loaded via Google Fonts with complete glyph coverage. |
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

### 1. Rendering RTL Urdu Alongside LTR English
- **The Challenge**: Urdu requires right-to-left (RTL) reading flow, while English and Hindi flow left-to-right (LTR). Mixing scripts in single components (e.g. the Table of Contents or Reading Reader) can cause numerals, bylines, and trailing badges to appear in inverted or broken orders.
- **The Solution**: Encapsulated directionality at the element level using `dir={essay.language === 'ur' ? 'rtl' : 'ltr'}` and `lang={essay.language}` on content containers. For UI elements (such as essay numbers `№ 01` and reading times), numbers are isolated using `<span className="tabular-nums">` and dir attributes so they render consistently without punctuation inversion.

### 2. Loading Devanagari and Nastaliq Fonts
- **The Challenge**: Standard Arabic typefaces (Naskh) look crude for Urdu literature, which historically demands calligraphic Nastaliq. Nastaliq fonts (like *Noto Nastaliq Urdu*) have extreme vertical glyph ascenders and descenders that clip or collide with adjacent lines if standard Latin line-heights (1.4–1.6) are applied. Devanagari similarly requires headroom for upper matras and shirorekha continuity.
- **The Solution**: Loaded *Noto Nastaliq Urdu* and *Noto Serif Devanagari* through Google Fonts. In [`typography.css`](file:///c:/Users/Afif/Documents/BLOG%20MANAGER/blog-manager/src/styles/typography.css), scoped CSS variables define generous vertical spacing: Urdu text receives `line-height: 2.3–2.4` and `padding-block: 4px`, while Hindi text receives `line-height: ~1.9`.

### 3. Using the `lang` Attribute and CSS Logical Properties
- **The Challenge**: Creating separate CSS classes for every RTL and LTR element results in brittle, duplicated style definitions and positioning bugs when margins, borders, or pull-quotes are flipped.
- **The Solution**: Replaced physical CSS properties with CSS Logical Properties across the entire design system:
  - `margin-inline-start` instead of `margin-left`
  - `padding-inline` instead of `padding-left`/`padding-right`
  - `border-inline-start` instead of `border-left`
  By combining logical properties with `[lang="ur"]` and `[lang="hi"]` attribute selectors, epigraph border rules, pull-quote gutters, and footnotes automatically flip to the correct side when switching between English and Urdu.

### 4. Unicode-Aware Search Normalization
- **The Challenge**: Searching in Hindi and Urdu often fails because readers may type text with or without diacritical vowel marks (Urdu *aerab* / *harakat* like *zer*, *zabar*, *pesh*; Hindi *nukta* or decomposing conjuncts). Additionally, standard `.toLowerCase()` does not normalize combining Unicode characters.
- **The Solution**: Implemented [`normalizeSearchText`](file:///c:/Users/Afif/Documents/BLOG%20MANAGER/blog-manager/src/lib/utils.js) using Unicode normalization:
  ```javascript
  export function normalizeSearchText(str) {
    if (!str) return '';
    return str
      .normalize('NFC')
      .replace(/[\u064B-\u065F\u0670]/g, '') // Strip Arabic/Urdu harakat
      .replace(/\u093C/g, '')               // Strip Hindi nukta
      .toLowerCase()
      .trim();
  }
  ```
  Both the query and searchable text are passed through this normalizer, allowing queries like "गांधी" or "غالب" to find matches regardless of diacritics.

### 5. Transliterated Latin Slugs
- **The Challenge**: Non-Latin characters in URL paths (e.g. `/essays/प्रेमचंद-और-गाँव`) cause ugly percent-encoded URLs (e.g. `/essays/%E0%A4%AA%E0%A5%8D...`), which break bookmark sharing, SMS links, and terminal logs.
- **The Solution**: Designed a transliteration slug generator in [`src/lib/utils.js`](file:///c:/Users/Afif/Documents/BLOG%20MANAGER/blog-manager/src/lib/utils.js) that maps Hindi and Urdu phonetic characters to clean Latin equivalents (e.g. `प्रेमचंद` -> `premchand`, `غالب` -> `ghalib`). All 18 seed essays feature human-readable Latin slugs while retaining native titles for display.

---

## 5. Directory Structure Overview

```text
blog-manager/
├── index.html                   # HTML entrypoint with fonts (Newsreader, Noto Devanagari, Noto Nastaliq)
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
    │   └── posts.json           # 18 curated literary essays (6 English, 6 Hindi, 6 Urdu)
    ├── features/
    │   ├── comments/            # Marginal notes, threaded replies, dir="auto" forms
    │   ├── editor/              # Split-pane editor with EN/HI/UR switcher, My Desk console
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