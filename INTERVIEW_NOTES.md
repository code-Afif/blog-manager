# STACKTRACE Developer Publishing Platform — Engineering Architecture Notes

## 1. Visual Direction & Neo-Brutalist Design System

- **Design Philosophy**: Swiss Neo-Brutalism & Precision Technical Instruments.
- **Tokens**:
  - `0px` border-radius reset on all cards, buttons, badges, inputs, and modals.
  - Planar hard shadows (`4px 4px 0px 0px #171A1C`) without blurring for mechanical depth.
  - Palette: `#F6F5EF` canvas, `#171A1C` ink, `#F06432` signal orange accent, and `#A6D96A` terminal green indicator.
  - Typography: Space Grotesk for bold headers, Geist for clean technical prose, and JetBrains Mono for code gutters, badges, and telemetry strips.

## 2. Technical Stack & State Persistence

- **Zero TypeScript**: All components and utilities implemented in idiomatic, clean ES6+ Plain JavaScript (`.jsx` / `.js`).
- **Storage Layer**: Dedicated `postService.js` and `commentsStore.js` backed by `localStorage` (versioned `_v4` key) to guarantee instantaneous load without external backend dependencies while allowing full offline CRUD capabilities.
- **Search Engine**: Tokenized multi-parameter filtering indexing titles, deks, content markdown, author callsigns, and technical taxonomy tags.

## 3. High-Density Layout & Performance Optimization

- **Asymmetric 7:5 Split Lead Story**: Left 7 columns house the primary technical narrative with author details and metrics, while right 5 columns render an interactive live AST diagnostic and latency trajectory schematic.
- **12-Column Editorial Grid**: 8 columns of dispatch entries with tabular read metrics and 4 columns of contextual sidebar telemetry (benchmarks, newsletter daemon, and top contributors).
- **Synchronized Scroll Dual-Pane Studio**: Custom scroll synchronization hook `useSyncScroll` computes proportional offset ratios between the raw markdown textarea and rendered AST container.
