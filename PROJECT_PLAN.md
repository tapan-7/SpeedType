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
| **Surface / Pills** | Open, borderless frosted glass surfaces (`rgba(255,255,255,0.03)`) with ambient glow and gradient hairlines (no boxy bordered cards) |
| **Primary Accent** | Coral orange / warm amber |
| **Secondary Accent** | Soft lavender |
| **Text States** | Pending: muted gray · Correct: bright off-white · Incorrect: soft red + word underline |
| **Typography** | `Geist Sans` (UI & stats) + `JetBrains Mono` (typing prompt) |

---

## 2. Architecture & Project Structure

Currently structured as a **single Next.js App Router application** for simplicity and fast iteration, with core typing logic and shared types cleanly isolated under `src/typing-engine/` and `src/shared/` so they can be extracted into shared workspace packages if additional apps (e.g., API, mobile, desktop) are added in Phase 3+.

```text
SpeedType/
├── src/
│   ├── app/                  # Next.js App Router pages, layout, global styles
│   ├── components/           # UI components (typing, results, settings, layout, common)
│   ├── stores/               # Zustand state store (useTypingStore)
│   ├── typing-engine/        # Framework-agnostic TS typing engine + Vitest suite
│   └── shared/               # Shared types, enums, constants
├── next.config.ts
├── vitest.config.ts
├── package.json
└── PROJECT_PLAN.md
```

### Technical Guardrails
- **Zero-Drift Timer:** Use `performance.now()` elapsed deltas rather than `setInterval` counter decrements.
- **Low-Latency Typing Loop:** Keep keystroke handling lightweight, use selective Zustand subscriptions, and avoid unnecessary React re-renders across unaffected words/lines.
- **Timestamped Metrics:** Calculate WPM, Raw WPM, Accuracy, Consistency, and per-key error stats from timestamped keystroke snapshots.

---

## 3. Phased Development Roadmap

### Phase 1 — Foundation, Independent Typing Engine & Clean Practice UI ✅
**Goal:** A complete, smooth, zero-login typing experience running locally in the browser.

1. **App Scaffolding:**
   - [x] Single Next.js App Router project (`npm`), TypeScript, Tailwind CSS v4, `Geist Sans` + `JetBrains Mono`, and Vitest.
2. **Independent `typing-engine` (`src/typing-engine`):**
   - [x] Finite State Machine: `idle` → `running` → `completed`.
   - [x] Word/text generators (English common word lists, punctuation & numbers modifiers, quotes, custom text).
   - [x] Character-by-character & word-level validation (`correct`, `incorrect`, `pending`, extra/missed chars) + Backspace handling.
   - [x] `performance.now()` timer + per-second snapshots for WPM, Raw WPM, Accuracy, Consistency, and per-key mistake tracking.
   - [x] Unit tests (`TypingEngine.test.ts`, 7/7 passing) covering normal typing, errors, backspace, completion, timer expiry, weak keys, and reset.
3. **Clean Practice Screen (`src/components/typing`):**
   - [x] **Minimal Top Header:** `SpeedType` logo + secondary nav icons (Virtual Keyboard toggle, History, Preferences).
   - [x] **Borderless Glass Mode Pill Bar:**
     - Modifiers: `punctuation`, `numbers`
     - Modes: `time` (`15`, `30`, `60`, `120`), `words` (`10`, `25`, `50`, `100`), `quote` (`short`, `medium`, `long`), `custom`
   - [x] **Wide Typing Stage:**
     - Live `WPM`, `Accuracy`, `Time / Words` counter.
     - Wide (`max-w-6xl` inside `max-w-7xl`), large (`30px–40px`) 3-line auto-scrolling monospace text area with smooth gliding caret.
     - Focus fade-out on header/mode bar/footer while actively typing.
     - Instant restart (`Tab + Enter` or `restart` button).
   - [x] **Interactive On-Screen Keyboard:** Enlarged QWERTY visual keyboard with a smoothly gliding spotlight glow tracking the next/pressed key and error highlights.
4. **Results Screen & Local History (`src/components/results`):**
   - [x] Open, borderless glass results layout with `"Time's Up"` / `"Test Complete"` status header and `Tab` / `Enter` restart hint.
   - [x] `ModeBar` kept accessible above results for 1-click mode switching.
   - [x] Large WPM & Accuracy summary, Raw WPM, Consistency, character breakdown (`correct / incorrect / extra / missed`).
   - [x] WPM-over-time area chart (Recharts) on a frosted glass surface + weakest keys callout.
   - [x] Automatic persistence of recent results and preferences in `localStorage`.

---

### Phase 2 — Personalization, Code Mode & Local Analytics ✅
**Goal:** Make the platform feel deeply customizable and rewarding without needing an account.

- [x] **Caret Customization:** Caret style (`line`, `block`, `underline`) and smooth-caret toggle (available in Preferences modal).
- [x] **Sound Effects:** Optional Web Audio API synthesized keystroke sound profiles (`off`, `mechanical`, `soft`, `typewriter`) with volume control and distinct error tone.
- [x] **Themes & Font Switcher:** Curated dark/light themes (`Obsidian Coral`, `Midnight Lavender`, `Monochrome`, `Paper`) and typing font switcher (`JetBrains Mono`, `Fira Code`, `Geist Mono`, `System Mono`).
- [x] **Code Snippets Mode:** Practice typing TypeScript, JavaScript, and Python snippets (`code` mode with `all / ts / js / py` filter).
- [x] **Local Stats & Weakness Detector (`/stats`):**
  - [x] 7 / 30 / 90-day WPM and accuracy trend charts from local history.
  - [x] Personal bests by mode (`time 30s`, `words 25`, `code (typescript)`, etc.).
  - [x] **Key Accuracy Heatmap / Weakness Detector:** QWERTY heatmap highlighting mistyped keys across sessions with a 1-click **"Practice Weak Keys"** custom drill.

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
- **Unit Tests (`Vitest`):** `src/typing-engine/__tests__/TypingEngine.test.ts` — state transitions, WPM/consistency math, and edge cases.
- **E2E Tests (`Playwright`):** Planned for landing directly on typing area, completing a test without login, mode switching, restart shortcuts, results rendering, and responsive layout checks.

