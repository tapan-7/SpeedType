import type { KeyErrorStat, TestResult } from '@/shared';
import { ENGLISH_WORDS } from '@/typing-engine/data/words';

export interface PersonalBestEntry {
  configSummary: string;
  wpm: number;
  accuracy: number;
  completedAt: string;
}

export function filterHistoryByDays(
  history: TestResult[],
  days: number,
): TestResult[] {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return history.filter((item) => new Date(item.completedAt).getTime() >= cutoff);
}

export function computePersonalBests(
  history: TestResult[],
): PersonalBestEntry[] {
  const map = new Map<string, PersonalBestEntry>();

  for (const item of history) {
    const existing = map.get(item.configSummary);
    if (!existing || item.wpm > existing.wpm) {
      map.set(item.configSummary, {
        configSummary: item.configSummary,
        wpm: item.wpm,
        accuracy: item.accuracy,
        completedAt: item.completedAt,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.wpm - a.wpm);
}

export function aggregateWeakKeys(history: TestResult[]): KeyErrorStat[] {
  const totals = new Map<string, KeyErrorStat>();

  for (const item of history) {
    for (const wk of item.weakKeys) {
      const existing = totals.get(wk.key) ?? {
        key: wk.key,
        attempts: 0,
        errors: 0,
      };
      existing.attempts += wk.attempts;
      existing.errors += wk.errors;
      totals.set(wk.key, existing);
    }
  }

  return Array.from(totals.values())
    .filter((k) => k.errors > 0)
    .sort((a, b) => b.errors - a.errors);
}

/**
 * Builds a 30-word custom practice drill emphasizing the user's weakest keys.
 */
export function generateWeakKeyDrill(
  weakKeys: KeyErrorStat[],
  wordCount = 30,
): string {
  const targetChars = weakKeys
    .slice(0, 6)
    .map((k) => k.key)
    .filter((k) => k.trim().length === 1);

  if (targetChars.length === 0) {
    return ENGLISH_WORDS.slice(0, wordCount).join(' ');
  }

  const matching = ENGLISH_WORDS.filter((word) =>
    targetChars.some((ch) => word.includes(ch)),
  );
  const pool = matching.length >= 5 ? matching : ENGLISH_WORDS;

  const picked: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool[idx] ?? 'type');
  }
  return picked.join(' ');
}

