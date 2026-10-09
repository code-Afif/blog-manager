# Marginalia — Engineering Architecture & Interview Reference

This document provides concise, plain-English explanations of the core architectural patterns in *Marginalia*, followed by the bilingual engineering challenges, and technical interview questions and structured answers.

---

## 1. Core Technical Mechanisms Explained Simply

### A. Multilingual Architecture & Native Scripts
- **Language-Scoped Styling**: Handled via `lang="hi"` attributes rather than bloated utility classes. Devanagari script is assigned dedicated font tokens and vertical spacing variables.
- **Script-Safe Typography**: Drop caps (`::first-letter`) are enabled for English prose, but strictly suppressed for Hindi to prevent breaking conjuncts and separating *matras*.
- **Logical Properties**: CSS properties like `margin-inline-start`, `border-inline-start`, and `padding-inline` dynamically manage alignments and gutters cleanly across components.
- **Unicode-Aware Search Normalization**: Normalizes text into Unicode NFC form and strips Devanagari *nukta* (`\u093C`), allowing diacritic-free queries to match accented words.

### B. Routing & Persistence (`react-router-dom` & `Zustand`)
- **Layout Persistence**: The `<Route path="/" element={<WorkspaceLayout />}>` wraps all views. The masthead, breadcrumbs, sidebar, status bar, and open tabs stay mounted without re-rendering when navigating between essays.
- **Deep Query Synchronization**: Filter states (`?q=...&lang=...&section=...&sort=...`) are bidirectionally synced with React Router's `useSearchParams`, with a 120ms debounce on user keystrokes.
- **Decoupled Service Layer**: All data reads and writes go through [`postService.js`](file:///c:/Users/Afif/Documents/BLOG%20MANAGER/blog-manager/src/lib/postService.js). The UI components have zero direct couplings to `localStorage`, allowing straightforward migration to a remote REST or GraphQL backend.

---

## 2. Challenges Faced and How I Solved Them

### 1. Devanagari Headroom and Typographic Spacing
- **The Challenge**: Devanagari script requires headroom for upper vowel signs (*matras*) and continuous *shirorekha* headlines. Under standard Latin line heights (1.4–1.5), lines feel congested and descenders collide with vowel signs on subsequent lines.
- **The Solution**: Loaded *Noto Serif Devanagari* alongside *Newsreader* and *Instrument Sans* via Google Fonts. Calibrated CSS typography variables: Hindi text receives `line-height: ~1.8–1.9` and `padding-block: 2px`, providing ample vertical space.

### 2. Script-Safe Drop Caps
- **The Challenge**: Classical letterpress typography celebrates initial drop caps (`::first-letter`). However, in Indic scripts like Devanagari, splitting the first character can tear complex conjuncts (e.g., `प्र` in `प्रेमचंद`) or isolate the top matra from its consonant root.
- **The Solution**: Constrained the `drop-cap::first-letter` CSS rule strictly to English prose, explicitly disabling float and drop-cap styles for `[lang="hi"]` content.

### 3. Unicode-Aware Search Normalization
- **The Challenge**: Searching non-Latin scripts frequently fails because users may type words with or without diacritics (Hindi *nukta* like ज़ vs ज). Additionally, un-normalized Unicode characters with multiple code-point representations fail standard string equality or substring checks.
- **The Solution**: Created a centralized `normalizeSearchText` utility that normalizes strings into Unicode NFC form, strips Devanagari nukta (`\u093C`), and converts to lowercase. Both query inputs and essay searchable properties are processed through this helper before matching.

### 4. Transliterated Latin Slugs
- **The Challenge**: Using raw Hindi characters in URL paths results in ugly percent-encoded URLs (e.g. `/essays/%E0%A4%AA%E0%A5%8D...`), which break copy-pasting, chat sharing, and SEO crawlers.
- **The Solution**: Built a phonetically grounded transliteration generator in `src/lib/utils.js` that maps Devanagari phonemes to clean Latin equivalents (e.g. `प्रेमचंद` -> `premchand`, `कबीर` -> `kabir`). This produces permanent, human-readable URLs like `/essays/premchand-aur-sadharan-gaon` while displaying authentic native script titles across all UI views.

### 5. Zero-Flash Theme Synchronization
- **The Challenge**: Resolving theme preferences inside React lifecycle hooks causes a brief white flash when reloading in dark mode.
- **The Solution**: Placed a tiny inline script inside `<head>` that inspects `localStorage` and OS preferences synchronously before the initial HTML paint, immediately affixing `data-theme` to the root element.

---

## 3. Multilingual Support Interview Questions & Answers

### Q1: How do you handle Devanagari typography and prevent conjunct fragmentation in web layouts?
> **Answer**: "Devanagari requires two key typographic considerations: vertical headroom and conjunct preservation. Standard Latin line-heights (1.4–1.5) clip upper vowel signs (*matras*) and *shirorekha* headlines. In *Marginalia*, I set a calibrated `line-height: 1.8–1.9` for all `[lang='hi']` text. Furthermore, CSS drop caps (`::first-letter`) break Devanagari conjuncts by isolating the first glyph from its half-character or vowel mark; I resolved this by disabling `::first-letter` float behavior exclusively on Hindi content."

### Q2: How does your search engine handle Unicode normalization and diacritics across English and Hindi?
> **Answer**: "Standard JavaScript string matching with `.includes()` fails on complex Unicode scripts because characters can be represented either as precomposed glyphs or as base characters plus combining diacritical marks. Furthermore, readers rarely type optional Hindi *nukta* when searching. I built a `normalizeSearchText` utility that first applies `.normalize('NFC')` to ensure consistent code-point representation, and then strips out Devanagari nukta (`\u093C`). By normalizing both the query and target document text, search matching works reliably across both scripts."

### Q3: Why generate Latin transliterated slugs for Hindi essays instead of raw Unicode slugs?
> **Answer**: "While modern browsers can display Unicode characters in the address bar, copying or pasting those URLs into terminals, SMS, markdown documents, or API queries converts them into percent-encoded strings (e.g., `/essays/%E0%A4%AA%E0%A5%8D...`). This breaks human readability and impairs analytics. In `src/lib/utils.js`, I transliterate Devanagari titles into phonetic Latin slugs (e.g., `प्रेमचंद और साधारण गाँव` becomes `premchand-aur-sadharan-gaon`), ensuring clean, permanent URLs while rendering authentic native script titles in the document UI."

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
