import {
  CharacterStatus,
  DEFAULT_CUSTOM_TEXT,
  QuoteLength,
  TestMode,
} from '@/shared';
import type { TestConfig, WordEntry } from '@/shared';
import { ENGLISH_QUOTES } from '../data/quotes.js';
import { ENGLISH_WORDS } from '../data/words.js';

const PUNCTUATION_ENDINGS = ['.', ',', ';', '!', '?'] as const;

export interface GeneratedTestPayload {
  words: WordEntry[];
  quoteAuthor?: string;
}

function toWordEntry(rawWord: string): WordEntry {
  return {
    characters: Array.from(rawWord).map((ch) => ({
      expected: ch,
      typed: null,
      status: CharacterStatus.PENDING,
    })),
    extraCharacters: [],
    isCompleted: false,
    hasError: false,
  };
}

function pickRandom<T>(items: readonly T[]): T {
  const index = Math.floor(Math.random() * items.length);
  return items[index] as T;
}

/**
 * Generates an English word sequence with optional punctuation and numbers.
 */
export function generateWordList(
  count: number,
  options: { punctuation: boolean; numbers: boolean },
): WordEntry[] {
  const result: WordEntry[] = [];
  let previousWord = '';

  for (let i = 0; i < count; i++) {
    let word: string;

    if (options.numbers && Math.random() < 0.14) {
      word = String(Math.floor(Math.random() * 999) + 1);
    } else {
      do {
        word = pickRandom(ENGLISH_WORDS);
      } while (word === previousWord && ENGLISH_WORDS.length > 1);
    }

    previousWord = word;

    if (options.punctuation) {
      if (i === 0 || (i > 0 && Math.random() < 0.12)) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      if (i < count - 1 && Math.random() < 0.22) {
        word += pickRandom(PUNCTUATION_ENDINGS);
      } else if (i === count - 1 && !/[.!?,;]$/.test(word)) {
        word += '.';
      }
    }

    result.push(toWordEntry(word));
  }

  return result;
}

/**
 * Generates the initial word entries for the given TestConfig.
 */
export function generateTestWords(config: TestConfig): GeneratedTestPayload {
  switch (config.mode) {
    case TestMode.TIME: {
      // Pre-generate ample words for the selected duration (append more dynamically if needed)
      const initialCount = Math.max(60, Math.ceil(config.durationSeconds * 2.5));
      return {
        words: generateWordList(initialCount, {
          punctuation: config.punctuation,
          numbers: config.numbers,
        }),
      };
    }

    case TestMode.WORDS: {
      return {
        words: generateWordList(config.wordCount, {
          punctuation: config.punctuation,
          numbers: config.numbers,
        }),
      };
    }

    case TestMode.QUOTE: {
      const pool =
        config.quoteLength === QuoteLength.ALL
          ? ENGLISH_QUOTES
          : ENGLISH_QUOTES.filter((q) => q.length === config.quoteLength);
      const quote = pickRandom(pool.length > 0 ? pool : ENGLISH_QUOTES);
      const rawWords = quote.text.trim().split(/\s+/);
      return {
        words: rawWords.map(toWordEntry),
        quoteAuthor: quote.author,
      };
    }

    case TestMode.CUSTOM: {
      const source = config.customText.trim() || DEFAULT_CUSTOM_TEXT;
      const rawWords = source.split(/\s+/).filter(Boolean);
      return {
        words: rawWords.map(toWordEntry),
      };
    }
  }
}

