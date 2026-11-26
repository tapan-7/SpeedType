# SpeedType — Project Plan & Phased Roadmap

> A modern, distraction-free typing practice and performance platform inspired by [Monkeytype](https://monkeytype.com/) and [KeyType](https://keytype.pro/), built with its own identity, smooth real-time engine, and clean developer-tool aesthetic.

---

## 1. Product Direction & Core Principles

1. **Typing Area First (Hero Experience):** Opening the app lands the user directly on the typing prompt—no marketing hero banners, no forced onboarding, and no login wall.
2. **Usable Without Login:** All core typing modes, customization, and recent history/analytics work 100% locally in the browser (`localStorage` + Zustand). Accounts are strictly optional (added in Phase 3 for cloud sync).
3. **Clean & Interactive (Not Boring):**
   - **Monkeytype-inspired focus:** Grouped mode pill bar, 3-line smooth-scrolling monospace text window, gliding vertical caret, instant character/word error feedback, `Tab + Enter` instant restart, and **focus fade-out** (secondary chrome fades out once typing starts).
   - **KeyType-inspired polish & interactivity:** Subtle glassmorphic surfaces, ambient glow, live `WPM · Accuracy · Timer` strip, and a **sleek, toggleable interactive on-screen keyboard** that highlights the next key and animates keystrokes without cluttering the typing area.
4. **Current Scope Boundaries:**
   - **English only** for now (no multi-language/country flag selectors or i18n).
   - **No multiplayer** right now (deferred to Phase 4+).

### Visual Identity
| Element | Direction |
| :--- | :--- |
| **Background** | Deep obsidian / charcoal (`#0c0d10` / `#111318`) with subtle ambient glow |
| **Surface / Pills** | Minimal frosted/dark cards (`rgba(255,255,255,0.04)`) with subtle borders |
| **Primary Accent** | Coral orange / warm amber |
| **Secondary Accent** | Soft lavender |
| **Text States** | Pending: muted gray · Correct: bright off-white · Incorrect: soft red + word underline |
| **Typography** | `Geist Sans` (UI & stats) + `JetBrains Mono` (typing prompt) |

---

## 2. Architecture & Monorepo Structure

We use a **`pnpm` workspace monorepo** so the core typing engine is completely decoupled from React and NestJS, making it easy to unit test and reuse across modes.

```text
speedtype/
├── apps/
│   ├── web/                  # Next.js (App Router) + TypeScript + Tailwind + Zustand
│   └── api/                  # (Phase 3) NestJS REST API
├── packages/
│   ├── typing-engine/        # Framework-agnostic TS typing engine + Vitest suite
│   ├── shared/               # Shared types, constants, schemas (Zod)
│   └── database/             # (Phase 3) Prisma schema & PostgreSQL client
├── pnpm-workspace.yaml
└── PROJECT_PLAN.md
```

### Technical Guardrails
- **Zero-Drift Timer:** Use `performance.now()` elapsed deltas rather than `setInterval` counter decrements.
- **Low-Latency Typing Loop:** Keep keystroke handling lightweight, use selective Zustand subscriptions, and avoid unnecessary React re-renders across unaffected words/lines.
- **Timestamped Metrics:** Calculate WPM, Raw WPM, Accuracy, Consistency, and per-key error stats from timestamped keystroke snapshots.

---

## 3. Phased Development Roadmap

### Phase 1 — Foundation, Independent Typing Engine & Clean Practice UI
**Goal:** A complete, smooth, zero-login typing experience running locally in the browser.

1. **Monorepo & App Scaffolding:**
   - Initialize `pnpm` workspace (`apps/web`, `packages/typing-engine`, `packages/shared`).
   - Configure Next.js, TypeScript, Tailwind CSS, `Geist Sans` + `JetBrains Mono`, and Vitest.
2. **Independent `typing-engine` (`packages/typing-engine`):**
   - Finite State Machine: `idle` → `running` → `completed`.
   - Word/text generators (English common 200 / 1k word lists, punctuation & numbers modifiers, quotes, custom text).
   - Character-by-character & word-level validation (`correct`, `incorrect`, `pending`, extra/missed chars) + Backspace handling.
   - `performance.now()` timer + per-second snapshots for WPM, Raw WPM, Accuracy, Consistency, and per-key mistake tracking.
   - Unit tests covering normal typing, fast typing, consecutive errors, backspace, punctuation/numbers, timer expiry, and restart.
3. **Clean Practice Screen (`apps/web`):**
   - **Minimal Top Header:** `SpeedType` logo + compact secondary nav icons (`Stats`, `Settings`).
   - **Centered Mode Pill Bar:**
     - Modifiers: `punctuation`, `numbers`
     - Modes: `time` (`15`, `30`, `60`, `120`), `words` (`10`, `25`, `50`, `100`), `quote` (`short`, `medium`, `long`), `custom`
   - **Typing Stage:**
     - Live `WPM`, `Accuracy`, `Time / Words` counter.
     - 3-line auto-scrolling monospace text area with smooth gliding caret.
     - Focus fade-out on header/mode bar/footer while actively typing.
     - Instant restart (`Tab + Enter` or `↻` button).
   - **Interactive On-Screen Keyboard:** Clean, low-contrast QWERTY visual keyboard below the prompt (with a quick toggle) showing next-key highlight and live keypress feedback.
4. **Results Screen & Local History:**
   - Large WPM & Accuracy summary, Raw WPM, Consistency, character breakdown (`correct / incorrect / extra / missed`).
   - WPM-over-time + error-marker chart (Recharts).
   - Weakest keys callout from the completed test.
   - Automatic persistence of recent results and preferences in `localStorage`.

---

### Phase 2 — Personalization, Code Mode & Local Analytics
**Goal:** Make the platform feel deeply customizable and rewarding without needing an account.

- **Sound Effects:** Optional Web Audio API / mechanical switch sound profiles with volume control.
- **Themes & Appearance:** Curated dark/light themes (e.g., Obsidian Coral, Midnight Lavender, Monochrome, Paper), font switcher, caret style (`line`, `block`, `underline`), and smooth-caret toggle.
- **Code Snippets Mode:** Practice typing real TypeScript/JavaScript/Python snippets.
- **Local Stats & Weakness Detector (`/stats`):**
  - 7 / 30 / 90-day WPM and accuracy trend charts from local history.
  - Personal bests by mode (`15s`, `30s`, `60s`, `25w`, `50w`, etc.).
  - **Key Accuracy Heatmap / Weakness Detector:** Identify consistently mistyped keys and offer a 1-click "Practice Weak Keys" custom drill.

---

### Phase 3 — Backend, Accounts & Cloud Sync
**Goal:** Optional authentication and persistent cloud history.

- **Database & API (`apps/api`, `packages/database`):**
  - NestJS modular monolith (`AuthModule`, `UsersModule`, `ResultsModule`, `StatisticsModule`, `SettingsModule`, `ContentModule`).
  - PostgreSQL + Prisma (`User`, `TestResult`, `UserSettings`).
- **Authentication & Sync:**
  - Email + OAuth (Google/GitHub) login.
  - Seamless import/sync of existing `localStorage` results and settings on first sign-in.
- **Validation & Security:**
  - Server-side range, duration, character-count, and plausibility checks on submitted results + rate limiting.

---

### Phase 4 — Engagement & Competitive Features (Future)
**Goal:** Expand replayability once the core product and backend are rock-solid.

- **Daily Challenge:** Shared daily English passage/seed.
- **Leaderboards:** Global and weekly rankings (with Redis caching & anti-cheat verification).
- **Achievements & Goals:** Daily WPM/consistency targets and milestone badges.
- **Survival Mode:** Progressive speed/accuracy challenge with countdown pressure.
- **Multiplayer / Typing Battle:** Real-time 1v1 or room races (explicitly deferred until earlier phases are complete).

---

## 4. Verification Strategy
- **Unit Tests (`Vitest`):** `packages/typing-engine` state transitions, WPM/consistency math, and edge cases.
- **E2E Tests (`Playwright`):** Landing directly on typing area, completing a test without login, mode switching, restart shortcuts, results rendering, and responsive layout checks.

