/**
 * Finite state machine statuses for a typing test session.
 */
export enum TestStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  COMPLETED = 'completed',
}

/**
 * Supported test modes in Phase 1.
 */
export enum TestMode {
  TIME = 'time',
  WORDS = 'words',
  QUOTE = 'quote',
  CODE = 'code',
  CUSTOM = 'custom',
}

/**
 * Programming language filter for Code Snippets mode.
 */
export enum CodeLanguage {
  ALL = 'all',
  TYPESCRIPT = 'typescript',
  JAVASCRIPT = 'javascript',
  PYTHON = 'python',
}

/**
 * Curated color theme presets.
 */
export enum ThemeId {
  OBSIDIAN_CORAL = 'obsidian-coral',
  MIDNIGHT_LAVENDER = 'midnight-lavender',
  MATRIX = 'matrix',
  OCEAN = 'ocean',
  ROSE = 'rose',
  PAPER = 'paper',
  NORD = 'nord',
  EMBER = 'ember',
  MATCHA = 'matcha',
  MONOCHROME = 'monochrome',
}

/**
 * Monospace font options for the typing prompt.
 */
export enum FontFamily {
  JETBRAINS_MONO = 'jetbrains-mono',
  FIRA_CODE = 'fira-code',
  GEIST_MONO = 'geist-mono',
  SYSTEM_MONO = 'system-mono',
}

/**
 * Synthesized keystroke sound profiles.
 */
export enum SoundProfile {
  OFF = 'off',
  MECHANICAL = 'mechanical',
  SOFT = 'soft',
  TYPEWRITER = 'typewriter',
}

/**
 * Quote length categories for Quote mode.
 */
export enum QuoteLength {
  ALL = 'all',
  SHORT = 'short',
  MEDIUM = 'medium',
  LONG = 'long',
}

/**
 * Per-character validation states rendered by the typing viewport.
 */
export enum CharacterStatus {
  PENDING = 'pending',
  CORRECT = 'correct',
  INCORRECT = 'incorrect',
  EXTRA = 'extra',
}

/**
 * Visual caret style options.
 */
export enum CaretStyle {
  LINE = 'line',
  BLOCK = 'block',
  UNDERLINE = 'underline',
}

/**
 * Visual state of an individual key on the interactive on-screen keyboard.
 */
export enum KeyState {
  IDLE = 'idle',
  ACTIVE = 'active',
  EXPECTED = 'expected',
  ERROR = 'error',
}

