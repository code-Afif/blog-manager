# Marginalia — Engineering Architecture & Interview Notes

This document details the architectural decisions, design considerations, challenges encountered, and solutions engineered while modernizing the **Marginalia** literary publishing platform.

---

## 1. Visual & Cultural Direction: Literary Craftsmanship

Marginalia reorients digital publishing around writers and readers of literature rather than technical specialists.

- **Paper & Ink Foundation**:
  - Pure warm paper canvas (`#FDF9F2` Day) and midnight library canvas (`#151718` Night).
  - High-contrast carbon ink typography with oxblood (`#5D2630`) and warm amber (`#D47942`) accents.
  - Complete elimination of neo-brutalist planar shadows, gradients, and glowing effects.
- **Multilingual Classical Typography**:
  - Display Titling: *EB Garamond* (humanist display serif).
  - Body Prose: *Newsreader* (curated for optical reading cadence).
  - Hindi (हिन्दी): *Noto Serif Devanagari*.
  - Urdu (اردو): *Noto Nastaliq Urdu* and *Amiri* with authentic baseline connections.
  - Ornaments: Drop caps on opening paragraphs, fleuron dividers (`* * *`), pull quotes, and editorial footnotes.
- **Human-Centric Wording**:
  - Removed all developer jargon: "Section" instead of tags/categories, "Publish" instead of deployment/status, "Draft" instead of unpublished buffer, "Saved" instead of autosave telemetry, and "My Desk" instead of dispatch manager.

---

## 2. Challenges Faced and How I Solved Them

### Challenge 1: Building a Simple Rich-Text Editor for Non-Technical Writers
- **Problem**: The previous application relied on a split-pane markdown editor with raw `#`, `**`, and backtick syntax, live AST previews, and technical status dropdowns. Non-technical writers (novelists, essayists, poets) find raw markdown intimidating and unnatural compared to tools like Word or Substack.
- **Solution**:
  - Integrated **TipTap** (`@tiptap/react` and `@tiptap/starter-kit`) as an accessible, headless rich-text engine producing semantic HTML.
  - Implemented a clean, single-row sticky formatting toolbar with plain tooltips: Style selector (Paragraph, Heading, Subheading, Quote), standard formatting buttons (Bold, Italic, Underline, Highlight, Strikethrough, Link, Image, Lists, Alignment), and an expandable "More" menu for literary dividers (`* * *`), pull quotes, and footnotes.
  - Engineered a lightweight floating selection bubble menu (Bold, Italic, Link, Quote, Highlight) using selection coordinates, avoiding complex external dependencies.
  - Built a quiet slash menu (`/`) that activates only at the start of an empty line, allowing quick insertion of dividers and quotes without cluttering the screen.
  - Separated the authoring surface into distinct literary fields: Display Title, Subtitle (dek), optional Epigraph with inline attribution, and a byline chip supporting co-author additions.

### Challenge 2: Handling Hindi and Urdu Input and Bidirectional Direction in the Editor
- **Problem**: Hindi uses Devanagari script (LTR) requiring appropriate vertical line heights and font rendering, while Urdu uses Nastaliq/Arabic script (RTL) which flows right-to-left. Mixed typing or switching languages in rich-text editors often causes cursor jumping, reversed punctuation, misaligned text selection, and illegible default fonts.
- **Solution**:
  - Applied `dir="auto"` and `unicode-bidi: plaintext` to all editor blocks, textareas, and output containers. This instructs the browser's BiDi engine to inspect the first strong directional character of each paragraph and format that block accordingly.
  - Configured explicit font-family stacks targeting Unicode ranges: `var(--font-urdu)` for Urdu paragraphs and `var(--font-hindi)` for Devanagari paragraphs, paired with tailored line-height rules (Urdu requires `line-height: 2.1` to avoid vertical glyph clipping in Nastaliq).
  - Added a manual Right-to-Left (RTL) override toggle in the toolbar for writers composing mixed or translated pieces who want to enforce paragraph alignment.
  - Replaced the naive ASCII-only slug generator with a phonetic transliteration dictionary in `src/lib/utils.js` that maps Devanagari and Urdu letters to clean Latin slugs behind the scenes, completely shielding writers from URL complexities.

### Challenge 3: Autosave and the "Saved" Indicator
- **Problem**: Non-technical writers experience anxiety about losing work, but invasive autosave toasts or technical notifications disrupt creative focus. Furthermore, frequent writes to `localStorage` during fast typing can cause jank if not properly debounced.
- **Solution**:
  - Implemented a multi-tier autosave strategy in `PostEditor.jsx`:
    1. A debounced timer that triggers 1.5 seconds after the user pauses typing.
    2. A debounce on unmount and before view state transitions.
  - Designed a quiet status badge in the top bar with a muted colored dot:
    - Displays `"Saving..."` with a subtle pulse while content is being serialized.
    - Transitions quietly to `"Saved"` once stored in `localStorage`.
  - Saved drafts are indexed under `marginalia_essay_draft_active` and synced with `marginalia_journal_posts_v1`. On refresh, the editor automatically restores drafts without technical confirmation dialogs.

### Challenge 4: Sanitizing HTML Before Storage and Rendering
- **Problem**: Storing and rendering raw HTML generated by a rich-text editor exposes the application to Cross-Site Scripting (XSS) vulnerabilities if malicious scripts or `javascript:` links are injected into the content payload.
- **Solution**:
  - Integrated **DOMPurify** to sanitize all HTML both before storing to `postService` and upon rendering inside `MarkdownRenderer.jsx` and `EssayPreview.jsx`.
  - Configured strict allowlists specifying permitted HTML tags (`p`, `h2`, `h3`, `blockquote`, `ul`, `ol`, `li`, `strong`, `em`, `u`, `s`, `mark`, `a`, `img`, `hr`, `span`) and permitted attributes (`href`, `src`, `alt`, `title`, `class`, `id`, `dir`, `lang`).
  - Forced all links to include `rel="noopener noreferrer"` and `target="_blank"` while explicitly stripping any `javascript:` or `data:` URL schemes (excluding safe images).

### Challenge 5: Converting Markdown Seed Content to Semantic HTML
- **Problem**: The original application had pre-seeded essays formatted entirely in markdown strings. If left as markdown, the new rich-text editor would either display raw markdown syntax characters or fail to parse complex structures like drop caps, pull quotes, and fleuron dividers.
- **Solution**:
  - Converted the seed corpus in `src/data/posts.json` from markdown strings into semantic HTML documents.
  - Implemented authentic literary markup for:
    - Drop caps: `<span class="drop-cap">W</span>hen we begin...`
    - Pull quotes: `<figure class="pull-quote"><blockquote>...</blockquote></figure>`
    - Fleuron dividers: `<div class="fleuron-divider">* * *</div>`
    - Footnotes: `<sup class="footnote-ref">[1]</sup>` with a matching `<section class="footnotes">` footer.
  - Created authentic Hindi and Urdu seed essays to ensure the reading view, table of contents generator, search index, and reader progress line work seamlessly with native Indic and Perso-Arabic scripts.

---

## 3. Interview Questions & Model Answers

### Question 1: Why did you choose TipTap for the essay editor instead of raw contentEditable or Draft.js, and how is it optimized for performance?
**Answer**:
> "TipTap was chosen because it is built on top of ProseMirror, the industry standard for robust, collaborative rich-text editing. Unlike raw `contentEditable`—which suffers from notorious cross-browser discrepancies in DOM mutation, caret positioning, and Enter-key behavior—ProseMirror maintains an abstract schema and immutable document state.
> Compared to older libraries like Draft.js (which has been deprecated by Meta) or Slate (which frequently introduces breaking changes across minor releases), TipTap provides modular, headless extensions (`StarterKit`, `Placeholder`, `Link`, `Image`, `TextAlign`). To ensure Marginalia remains lightning fast for general readers, the entire editor suite is lazy-loaded via `React.lazy()` and `React.Suspense` on `/write` routes, keeping the main application bundle under 250 kB gzipped."

### Question 2: How does the application manage bidirectional (LTR/RTL) text flow when a writer inputs Urdu in the rich-text editor?
**Answer**:
> "BiDi handling in Marginalia operates on three coordinated layers:
> 1. **Per-Block Heuristics**: Every paragraph and block element is assigned `dir="auto"`. Rather than forcing the entire document into RTL (which would break English citations or navigation), the browser dynamically resolves the paragraph direction based on its first strong directional glyph (Urdu letters resolve to RTL; English or Devanagari resolve to LTR).
> 2. **Typographic Scaling**: Urdu Nastaliq calligraphy features tall ascenders, descenders, and stacked letterforms that clip under standard Latin line heights. We map Urdu containers to `var(--font-urdu)` (*Noto Nastaliq Urdu* and *Amiri*) with a generous `line-height: 2.1` and `text-align: right`.
> 3. **Manual Granular Control**: For mixed-language translations or bilingual poetry, the editor provides an explicit RTL toggle in the toolbar that updates the block's `dir` attribute without altering surrounding paragraphs."

### Question 3: How does Marginalia guarantee data integrity and XSS protection when saving and rendering rich HTML content across devices?
**Answer**:
> "We implement a defense-in-depth sanitization and storage workflow:
> - **Input Sanitization**: Content generated by the editor is captured via `editor.getHTML()` and sanitized using `DOMPurify` before writing to `localStorage`. Only semantic literary tags are permitted; dangerous elements like `<script>`, `<iframe>`, `onload`, or `onerror` attributes are purged.
> - **Render-Time Sanitization**: When rendering essays in `PostReader` or previews, HTML passes through `DOMPurify.sanitize()` once again to prevent stored XSS even if local storage was tampered with externally.
> - **Fallback Compatibility**: The reader component (`MarkdownRenderer`) handles both HTML strings and legacy markdown inputs gracefully, automatically generating anchor IDs for `<h2>` and `<h3>` tags so the dynamic Table of Contents and reading progress bar function identically across both formats."
