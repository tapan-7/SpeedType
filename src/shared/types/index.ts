import {
  CaretStyle,
  CharacterStatus,
  QuoteLength,
  TestMode,
  TestStatus,
} from '../enums/index.js';

/**
 * Configuration for generating and running a typing test.
 */
export interface TestConfig {
  mode: TestMode;
  /** Duration in seconds when mode === TestMode.TIME */
  durationSeconds: number;
  /** Target word count when mode === TestMode.WORDS */
  wordCount: number;
  /** Quote length filter when mode === TestMode.QUOTE */
  quoteLength: QuoteLength;
  /** Include punctuation in generated word sequences */
  punctuation: boolean;
  /** Include numbers in generated word sequences */
  numbers: boolean;
  /** Custom passage supplied by user when mode === TestMode.CUSTOM */
  customText: string;
}

/**
 * Single character slot inside a word.
 */
export interface CharacterEntry {
  expected: string;
  typed: string | null;
  status: CharacterStatus;
}

/**
 * Word unit tracked by the typing engine.
 */
export interface WordEntry {
  characters: CharacterEntry[];
  /** Extra characters typed beyond the expected word length */
  extraCharacters: CharacterEntry[];
  /** True once the user advances past this word with Space */
  isCompleted: boolean;
  /** True if any character in this word is incorrect or extra/missed */
  hasError: boolean;
}

/**
 * Per-second performance snapshot recorded during a test.
 */
export interface TimelineSnapshot {
  second: number;
  wpm: number;
  rawWpm: number;
  errors: number;
}

/**
 * Aggregated error count for a specific expected character.
 */
export interface KeyErrorStat {
  key: string;
  attempts: number;
  errors: number;
}

/**
 * Character count breakdown at the end of a test.
 */
export interface CharacterBreakdown {
  correct: number;
  incorrect: number;
  extra: number;
  missed: number;
}

/**
 * Complete immutable result produced when a test finishes.
 */
export interface TestResult {
  id: string;
  mode: TestMode;
  configSummary: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  elapsedSeconds: number;
  characters: CharacterBreakdown;
  timeline: TimelineSnapshot[];
  weakKeys: KeyErrorStat[];
  quoteAuthor?: string;
  completedAt: string;
}

/**
 * Read-only snapshot of the typing engine's live state.
 */
export interface TypingEngineState {
  status: TestStatus;
  config: TestConfig;
  words: WordEntry[];
  currentWordIndex: number;
  currentCharIndex: number;
  elapsedMs: number;
  remainingMs: number;
  liveWpm: number;
  liveRawWpm: number;
  liveAccuracy: number;
  correctKeystrokes: number;
  totalKeystrokes: number;
  expectedKey: string | null;
  quoteAuthor?: string;
}

/**
 * Local user preferences persisted in browser storage.
 */
export interface UserPreferences {
  showVirtualKeyboard: boolean;
  showLiveStats: boolean;
  smoothCaret: boolean;
  caretStyle: CaretStyle;
  focusFadeOut: boolean;
}

/**
 * Key definition for the interactive QWERTY on-screen keyboard.
 */
export interface VirtualKeyDef {
  id: string;
  label: string;
  /** Normalized character value matched against expected/pressed keys */
  value: string;
  /** Relative width multiplier (1 = standard key) */
  width?: number;
}

