# Marginalia — Engineering Architecture & Interview Reference

This document provides concise, plain-English explanations of the core architectural patterns in *Marginalia*, followed by the 5 multilingual challenges, and technical interview questions and structured answers.

---

## 1. Core Technical Mechanisms Explained Simply

### A. Multilingual Architecture & Native Scripts
- **Language-Scoped Styling**: Handled via `lang="hi"` and `lang="ur"` attributes rather than bloated utility classes. Each script is assigned dedicated font tokens and vertical spacing variables.
- **RTL & Bidirectional Layouts**: Set via `dir="rtl"` on Urdu containers. Numerals (`№ 01`) and metadata are isolated inside `<span className="tabular-nums">` to prevent bidirectional punctuation inversion.
- **Logical Properties**: CSS properties like `margin-inline-start`, `border-inline-start`, and `padding-inline` dynamically flip alignments between LTR and RTL without stylesheet duplication.
- **Unicode-Aware Search Normalization**: Normalizes text into Unicode NFC form and strips Arabic/Urdu *harakat* (`[\u064B-\u065F\u0670]`) and Hindi *nukta* (`\u093C`), allowing diacritic-free queries to match accented or vowel-marked words.

### B. Routing & Persistence (`react-router-dom` & `Zustand`)
- **Layout Persistence**: The `<Route path="/" element={<WorkspaceLayout />}>` wraps all views. The masthead, breadcrumbs, sidebar, status bar, and open tabs stay mounted without re-rendering when navigating between essays.
- **Deep Query Synchronization**: Filter states (`?q=...&lang=...&section=...&sort=...`) are bidirectionally synced with React Router's `useSearchParams`, with a 120ms debounce on user keystrokes.
- **Decoupled Service Layer**: All data reads and writes go through [`postService.js`](file:///c:/Users/Afif/Documents/BLOG%20MANAGER/blog-manager/src/lib/postService.js). The UI components have zero direct couplings to `localStorage`, allowing straightforward migration to a remote REST or GraphQL backend.

---

## 2. Challenges Faced and How I Solved Them

### 1. Rendering RTL Urdu Alongside LTR English
- **The Challenge**: Urdu reads right-to-left, while English and Hindi read left-to-right. In mixed list rows and reader views, standard directional flipping can invert metadata, break punctuation, and misalign action buttons.
- **The Solution**: Directed flow is scoped directly to content wrappers using `dir={lang === 'ur' ? 'rtl' : 'ltr'}` and `lang={lang}`. Fixed elements like folio numbers and metadata chips use explicit `ltr` isolation with `tabular-nums` so that the numerals `№ 01` never invert their bracket order. In the editor preview and comments, `dir="auto"` automatically infers the correct paragraph direction for mixed text.

### 2. Loading Devanagari and Nastaliq Fonts
- **The Challenge**: Standard Arabic Naskh fonts fail the aesthetic expectations of Urdu literature, which requires authentic Nastaliq calligraphy. Nastaliq script features steep diagonal cascading and tall ascenders/descenders that clip heavily or overlap adjacent lines under standard Latin line heights (1.5). Devanagari similarly requires clearance for upper vowel signs (*matras*) and *shirorekha* headlines.
- **The Solution**: Loaded *Noto Serif Devanagari* and *Noto Nastaliq Urdu* alongside *Newsreader* and *Instrument Sans* via Google Fonts. Calibrated CSS typography variables per script: Urdu body text receives `line-height: 2.3–2.4` and `padding-block: 4px`, while Hindi text receives `line-height: ~1.9`.

### 3. Using the `lang` Attribute and CSS Logical Properties
- **The Challenge**: Hardcoding directional styles (e.g. `border-left`, `margin-left`) breaks whenever the language flips to Urdu, requiring redundant `.rtl-blockquote`, `.rtl-footnote` overrides that bloat CSS and cause maintenance bugs.
- **The Solution**: Converted the design system to standard CSS Logical Properties (`margin-inline-start`, `border-inline-start`, `padding-inline`). Coupled with `[lang="ur"]` and `[lang="hi"]` selectors in `typography.css`, pull-quote borders, epigraph rules, and footnote markers flip naturally between LTR and RTL without a single line of redundant override styling.

### 4. Unicode-Aware Search Normalization
- **The Challenge**: Searching non-Latin scripts frequently fails because users may type words with or without diacritics (Urdu *aerab* / *harakat* like *zer*, *zabar*, *pesh*; Hindi *nukta* like ज़ vs ज). Additionally, un-normalized Unicode characters with multiple code-point representations fail standard string equality or substring checks.
- **The Solution**: Created a centralized `normalizeSearchText` utility that normalizes strings into Unicode NFC form, strips Arabic/Urdu diacritics (`[\u064B-\u065F\u0670]`), strips Devanagari nukta (`\u093C`), and converts to lowercase. Both query inputs and essay searchable properties are processed through this helper before matching.

### 5. Transliterated Latin Slugs
- **The Challenge**: Using raw Hindi and Urdu characters in URL paths results in ugly percent-encoded URLs (e.g. `/essays/%E0%A4%AA%E0%A5%8D...`), which break copy-pasting, chat sharing, and SEO crawlers.
- **The Solution**: Built a phonetically grounded transliteration generator in `src/lib/utils.js` that maps Devanagari and Urdu phonemes to clean Latin equivalents (e.g. `प्रेमचंद` -> `premchand`, `غالب` -> `ghalib`). This produces permanent, human-readable URLs like `/essays/premchand-aur-sadharan-gaon` while displaying authentic native script titles across all UI views.

---

## 3. Multilingual Support Interview Questions & Answers

### Q1: How do you handle bidirectional (LTR/RTL) rendering in a mixed-language application without duplicating stylesheets?
> **Answer**: "I use two complementary web standards: the HTML `dir` attribute and CSS Logical Properties. Instead of writing separate `.ltr` and `.rtl` classes with physical properties like `margin-left` or `border-left`, I use `margin-inline-start` and `border-inline-start`. When an essay is loaded in Urdu, setting `dir='rtl'` on the container causes the browser engine to automatically position the inline start boundary on the right side. This flips borders on pull quotes, blockquotes, and footnotes automatically without any additional CSS rules."

### Q2: Why does Nastaliq script require special typography and line-height treatment compared to Latin or standard Arabic fonts?
> **Answer**: "Unlike horizontal Naskh typefaces or Latin fonts, Nastaliq is a diagonal, cascading calligraphic script. Words slant downward from top-right to bottom-left, creating dramatic vertical ascenders and descenders. If standard Latin line-heights (1.4–1.6) are applied to Nastaliq, characters from adjacent lines physically collide and ascenders clip against container boundaries. In *Marginalia*, I configured CSS variables scoped to `[lang='ur']` with a generous line-height of 2.1 to 2.4 and extra block padding, giving the calligraphic glyphs the breathing room they need."

### Q3: How does your search engine handle Unicode normalization and diacritics across English, Hindi, and Urdu?
> **Answer**: "Standard JavaScript string matching with `.includes()` fails on complex Unicode scripts because characters can be represented either as precomposed glyphs or as base characters plus combining diacritical marks. Furthermore, readers rarely type optional Arabic *harakat* (like *zer* or *zabar*) or Hindi *nukta* when searching. I built a `normalizeSearchText` utility that first applies `.normalize('NFC')` to ensure consistent code-point representation, and then uses targeted regular expressions to strip out Arabic vowel marks and Devanagari nukta. By normalizing both the query and target document text, search matching works reliably across all three scripts."

---

## 4. General Frontend Engineering Interview Questions & Answers

### Q4: Why did you choose Zustand over React Context or Redux Toolkit?
> **Answer**: "React Context is built for low-frequency dependency injection, not dynamic application state. When a Context provider updates, all consuming components re-render by default unless wrapped in complex boilerplate. Redux Toolkit provides power but introduces unnecessary ceremony for a client application. Zustand provides an atomic, hook-based store with selective subscriptions, zero React provider wrappers, and native `persist` middleware in under 100 lines of clean code."

### Q5: How did you implement the Scroll-Spy Table of Contents without an external library?
> **Answer**: "I wrote a custom `useScrollSpy` hook that accepts an array of heading IDs and a reference to the scrollable container. Inside a passive scroll listener, it calculates each heading's `getBoundingClientRect().top` relative to the container's ceiling. The heading closest to the top (within a 120px threshold) is marked as `activeId`. The same listener computes `scrollTop / (scrollHeight - clientHeight) * 100` to drive the top reading progress indicator."

### Q6: How do you prevent infinite scroll loops in the dual-pane markdown editor?
> **Answer**: "In `useSyncScroll.js`, whichever pane the user scrolls acquires an `isScrollingRef` lock flag. The companion pane calculates its proportional scroll position by computing the source pane's scroll ratio `scrollTop / (scrollHeight - clientHeight)` and applying it to its own scroll dimensions. The lock flag prevents the companion pane's event from echoing back to the source pane, and is released on the next `requestAnimationFrame`."

### Q7: How did you solve the theme flash (FOUC) when reloading in night mode?
> **Answer**: "React loads asynchronously after the initial HTML is parsed. If theme resolution is delayed until a React `useEffect`, the browser paints the default light paper background before flipping to night mode milliseconds later. I solved this by adding a synchronous, zero-dependency `<script>` directly in the `<head>` of `index.html`. It reads `localStorage` and OS `prefers-color-scheme` preferences and sets `data-theme` on the `<html>` root before the browser renders its first paint frame."

### Q8: How does the application prevent draft essays from leaking onto the public Table of Contents?
> **Answer**: "The data layer enforces this contract in `postService.getAll(includeDrafts = false)`. By default, `getAll()` filters out any essay with `status === 'draft'`. The public Table of Contents (`PostIndex`) calls `getAll(false)`. Only the private Author's Desk (`MyPostsManager`) calls `getAll(true)`, ensuring that drafts are completely invisible to readers while remaining safely autosaved and editable for the author."
