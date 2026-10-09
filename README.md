# STACKTRACE // [DEV_01] — Developer Publishing Platform

> **Neo-Brutalist Technical Publishing & System Engineering Workstation**
> Built with React 18, Vite, Plain JavaScript, Zustand (localStorage v4 persistence), and Framer Motion. Grounded in the **STACKTRACE Developer Publishing Platform** design system from StitchMCP.

---

## 1. Visual Direction & Design System

The visual design is inspired by Swiss Neo-Brutalism and Precision Technical Instruments:
- **Palette**:
  - Paper Canvas: `#F6F5EF` (Light Paper) / `#121415` (Dark Terminal)
  - Ink Primary: `#171A1C` / Surface `#FFFFFF`
  - Signal Accent: `#F06432` (Signal Orange)
  - Telemetry Accent: `#A6D96A` (Terminal Green)
  - Hairline Borders: 1px / 2px hard borders (`#DADDD8` / `#2A2E30`)
- **Planar Hard Shadows**: `4px 4px 0px 0px #171A1C` (no blurred drop shadows, strict mechanical depth).
- **Geometry**: Strict `0px` border-radius reset on all interactive components, modals, inputs, and cards.
- **Typography Hierarchy**:
  - Display & Headings: `Space Grotesk`
  - Body Prose & Longform: `Geist`
  - Badges, Telemetry, Code, Gutters: `JetBrains Mono`

---

## 2. Core Features

### Feed & Discover
- **Live Search Bar**: Global search across titles, deks, technical tags, and full markdown content with `⌘K` or `/` shortcut.
- **Taxonomy Filtering**: Interactive technical domain pills (`[Systems]`, `[Backend]`, `[Frontend]`, `[Database]`, `[Architecture]`, `[Performance]`, `[Dev Tools]`, `[Security]`).
- **Telemetry System Strip**: Live simulated system metrics (`SYS_STATUS: ALL SYSTEMS NOMINAL`, `UPTIME: 99.98%`, `LATENCY: 14ms`, `ACTIVE_NODES: 42`).
- **Lead Story 7:5 Split**: Features asymmetric hero narrative on the left and interactive live AST diagnostic / latency trajectory schematic on the right.
- **Editorial 12-Column Grid**: 8 columns for dispatch stream with tabular metrics, 4 columns for telemetry sidebar containing:
  - Trending Benchmarks (realtime performance metrics).
  - The Daemon Dispatch (newsletter sub-agent).
  - Top Contributors with commit count & verification badges.

### Dispatch Reader
- **Monospace Telemetry Ribbon**: Displays Entry ID, technical section, word count, reading duration, and git commit SHA.
- **Syntax Highlighting**: Shiki-style dark high-contrast terminal code plates with line gutters, language badges, and one-click copy buttons.
- **Dynamic Table of Contents**: Realtime active section highlighting with smooth scroll traversal.
- **Peer Architecture Review**: Nested threaded technical comments, author callsigns, timestamps, and inline response composer.
- **Peer Appreciation Counter**: Keyboard shortcut `L` or interactive button with persistent count increment.

### Authoring Workstation (Write)
- **Split-Pane Editor**: Synchronized dual-pane markdown editor with monospace gutter line numbers and real-time live AST preview.
- **Quick Templates**: One-click insertions for Systems Architecture Deep-Dive or Outage Post-Mortem.
- **Autosave Engine**: Automatically serializes drafts to `localStorage` with visual save indicator.

---

## 3. Technology Stack

- **Framework**: React 18 + Vite (Plain JavaScript `.js` / `.jsx`, 0 TypeScript).
- **Routing**: React Router v6.
- **State Management**: Zustand with `localStorage` persistence.
- **Animations**: Framer Motion.
- **Icons**: Lucide React.
- **Markdown Parsing**: `react-markdown` with `remark-gfm`.

---

## 4. Running Locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to interact with the platform.