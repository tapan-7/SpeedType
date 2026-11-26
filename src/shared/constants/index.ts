import {
  CaretStyle,
  CodeLanguage,
  FontFamily,
  QuoteLength,
  SoundProfile,
  TestMode,
  ThemeId,
} from '../enums/index.js';
import type { TestConfig, UserPreferences, VirtualKeyDef } from '../types/index.js';

export const APP_NAME = 'SpeedType';
export const APP_TAGLINE = 'Clean, distraction-free typing practice.';

export const TIME_PRESETS = [15, 30, 60, 120] as const;
export const WORD_PRESETS = [10, 25, 50, 100] as const;

export const QUOTE_LENGTH_OPTIONS: readonly { value: QuoteLength; label: string }[] = [
  { value: QuoteLength.ALL, label: 'all' },
  { value: QuoteLength.SHORT, label: 'short' },
  { value: QuoteLength.MEDIUM, label: 'medium' },
  { value: QuoteLength.LONG, label: 'long' },
];

export const CODE_LANGUAGE_OPTIONS: readonly { value: CodeLanguage; label: string }[] = [
  { value: CodeLanguage.ALL, label: 'all' },
  { value: CodeLanguage.TYPESCRIPT, label: 'ts' },
  { value: CodeLanguage.JAVASCRIPT, label: 'js' },
  { value: CodeLanguage.PYTHON, label: 'py' },
];

export const MODE_OPTIONS: readonly { value: TestMode; label: string }[] = [
  { value: TestMode.TIME, label: 'time' },
  { value: TestMode.WORDS, label: 'words' },
  { value: TestMode.QUOTE, label: 'quote' },
  { value: TestMode.CODE, label: 'code' },
  { value: TestMode.CUSTOM, label: 'custom' },
];

export const THEME_OPTIONS: readonly {
  id: ThemeId;
  label: string;
  bg: string;
  accent: string;
  isLight?: boolean;
}[] = [
  { id: ThemeId.OBSIDIAN_CORAL, label: 'Obsidian', bg: '#0c0d10', accent: '#ff7a45' },
  { id: ThemeId.MIDNIGHT_LAVENDER, label: 'Dusk', bg: '#0b0e17', accent: '#a78bfa' },
  { id: ThemeId.MATRIX, label: 'Matrix', bg: '#07110b', accent: '#22c55e' },
  { id: ThemeId.OCEAN, label: 'Ocean', bg: '#07131e', accent: '#38bdf8' },
  { id: ThemeId.ROSE, label: 'Rose', bg: '#140b12', accent: '#f472b6' },
  { id: ThemeId.PAPER, label: 'Paper', bg: '#f6f5f1', accent: '#ea580c', isLight: true },
  { id: ThemeId.NORD, label: 'Nord', bg: '#161b24', accent: '#88c0d0' },
  { id: ThemeId.EMBER, label: 'Ember', bg: '#140e0a', accent: '#f59e0b' },
  { id: ThemeId.MATCHA, label: 'Matcha', bg: '#0e140f', accent: '#84cc16' },
  { id: ThemeId.MONOCHROME, label: 'Mono', bg: '#09090b', accent: '#e4e4e7' },
];

export const FONT_OPTIONS: readonly { id: FontFamily; label: string }[] = [
  { id: FontFamily.JETBRAINS_MONO, label: 'JetBrains Mono' },
  { id: FontFamily.FIRA_CODE, label: 'Fira Code' },
  { id: FontFamily.GEIST_MONO, label: 'Geist Mono' },
  { id: FontFamily.IBM_PLEX_MONO, label: 'IBM Plex Mono' },
  { id: FontFamily.SPACE_MONO, label: 'Space Mono' },
  { id: FontFamily.ROBOTO_MONO, label: 'Roboto Mono' },
  { id: FontFamily.INCONSOLATA, label: 'Inconsolata' },
  { id: FontFamily.SYSTEM_MONO, label: 'System Mono' },
];

export const FONT_SIZE_OPTIONS: readonly {
  id: 'compact' | 'comfortable' | 'large';
  label: string;
}[] = [
  { id: 'compact', label: 'compact' },
  { id: 'comfortable', label: 'comfortable' },
  { id: 'large', label: 'large' },
];

export const SOUND_PROFILE_OPTIONS: readonly { id: SoundProfile; label: string }[] = [
  { id: SoundProfile.OFF, label: 'off' },
  { id: SoundProfile.MECHANICAL, label: 'mechanical' },
  { id: SoundProfile.SOFT, label: 'soft' },
  { id: SoundProfile.TYPEWRITER, label: 'typewriter' },
];

export const DEFAULT_CUSTOM_TEXT =
  'Clean code always looks like it was written by someone who cares. Focus on rhythm and accuracy before chasing raw speed.';

export const DEFAULT_TEST_CONFIG: TestConfig = {
  mode: TestMode.TIME,
  durationSeconds: 30,
  wordCount: 25,
  quoteLength: QuoteLength.ALL,
  codeLanguage: CodeLanguage.ALL,
  punctuation: false,
  numbers: false,
  customText: DEFAULT_CUSTOM_TEXT,
};

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  showVirtualKeyboard: true,
  showLiveStats: true,
  smoothCaret: true,
  caretStyle: CaretStyle.LINE,
  focusFadeOut: true,
  theme: ThemeId.OBSIDIAN_CORAL,
  fontFamily: FontFamily.JETBRAINS_MONO,
  fontSize: 'comfortable',
  soundProfile: SoundProfile.OFF,
  soundVolume: 0.5,
  playErrorSound: true,
};

export const STORAGE_KEYS = {
  HISTORY: 'speedtype.history.v1',
  PREFERENCES: 'speedtype.preferences.v1',
  CONFIG: 'speedtype.config.v1',
} as const;

export const MAX_LOCAL_HISTORY = 100;

/**
 * Standard 4-row QWERTY layout for the interactive on-screen keyboard.
 */
export const QWERTY_ROWS: readonly VirtualKeyDef[][] = [
  [
    { id: 'q', label: 'Q', value: 'q' },
    { id: 'w', label: 'W', value: 'w' },
    { id: 'e', label: 'E', value: 'e' },
    { id: 'r', label: 'R', value: 'r' },
    { id: 't', label: 'T', value: 't' },
    { id: 'y', label: 'Y', value: 'y' },
    { id: 'u', label: 'U', value: 'u' },
    { id: 'i', label: 'I', value: 'i' },
    { id: 'o', label: 'O', value: 'o' },
    { id: 'p', label: 'P', value: 'p' },
  ],
  [
    { id: 'a', label: 'A', value: 'a' },
    { id: 's', label: 'S', value: 's' },
    { id: 'd', label: 'D', value: 'd' },
    { id: 'f', label: 'F', value: 'f' },
    { id: 'g', label: 'G', value: 'g' },
    { id: 'h', label: 'H', value: 'h' },
    { id: 'j', label: 'J', value: 'j' },
    { id: 'k', label: 'K', value: 'k' },
    { id: 'l', label: 'L', value: 'l' },
    { id: 'semicolon', label: ';', value: ';' },
  ],
  [
    { id: 'z', label: 'Z', value: 'z' },
    { id: 'x', label: 'X', value: 'x' },
    { id: 'c', label: 'C', value: 'c' },
    { id: 'v', label: 'V', value: 'v' },
    { id: 'b', label: 'B', value: 'b' },
    { id: 'n', label: 'N', value: 'n' },
    { id: 'm', label: 'M', value: 'm' },
    { id: 'comma', label: ',', value: ',' },
    { id: 'period', label: '.', value: '.' },
    { id: 'slash', label: '/', value: '/' },
  ],
  [{ id: 'space', label: 'space', value: ' ', width: 6 }],
];

export const UI_STRINGS = {
  RESTART_HINT_KEY_1: 'tab',
  RESTART_HINT_KEY_2: 'enter',
  RESTART_HINT_LABEL: 'restart test',
  CLICK_TO_FOCUS: 'Click or start typing to focus',
  MODIFIER_PUNCTUATION: 'punctuation',
  MODIFIER_NUMBERS: 'numbers',
  KEYBOARD_TOGGLE_SHOW: 'Show keyboard',
  KEYBOARD_TOGGLE_HIDE: 'Hide keyboard',
} as const;

