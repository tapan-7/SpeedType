import { CharacterStatus } from '@speedtype/shared';
import type { CharacterBreakdown, WordEntry } from '@speedtype/shared';

/**
 * Standard WPM: (correctChars / 5) / elapsedMinutes.
 */
export function calculateWpm(correctChars: number, elapsedMs: number): number {
  if (elapsedMs <= 0 || correctChars <= 0) return 0;
  const minutes = elapsedMs / 60000;
  return Math.round(correctChars / 5 / minutes);
}

/**
 * Raw WPM includes all typed characters regardless of correctness.
 */
export function calculateRawWpm(totalTypedChars: number, elapsedMs: number): number {
  if (elapsedMs <= 0 || totalTypedChars <= 0) return 0;
  const minutes = elapsedMs / 60000;
  return Math.round(totalTypedChars / 5 / minutes);
}

/**
 * Accuracy percentage (0 - 100) from keystroke counts.
 */
export function calculateAccuracy(
  correctKeystrokes: number,
  totalKeystrokes: number,
): number {
  if (totalKeystrokes <= 0) return 100;
  return Math.round((correctKeystrokes / totalKeystrokes) * 100);
}

/**
 * Consistency score (0 - 100) derived from the coefficient of variation
 * across per-second WPM snapshots.
 */
export function calculateConsistency(wpmSamples: readonly number[]): number {
  if (wpmSamples.length < 2) return 100;
  const mean =
    wpmSamples.reduce((sum, val) => sum + val, 0) / wpmSamples.length;
  if (mean <= 0) return 0;

  const variance =
    wpmSamples.reduce((sum, val) => sum + (val - mean) ** 2, 0) /
    wpmSamples.length;
  const stdDev = Math.sqrt(variance);
  const cv = stdDev / mean;

  return Math.max(0, Math.min(100, Math.round((1 - cv) * 100)));
}

/**
 * Computes final character breakdown across all touched words.
 */
export function buildCharacterBreakdown(
  words: readonly WordEntry[],
  lastTouchedWordIndex: number,
): CharacterBreakdown {
  let correct = 0;
  let incorrect = 0;
  let extra = 0;
  let missed = 0;

  const limit = Math.min(words.length - 1, lastTouchedWordIndex);
  for (let i = 0; i <= limit; i++) {
    const word = words[i];
    if (!word) continue;

    for (const ch of word.characters) {
      if (ch.status === CharacterStatus.CORRECT) correct++;
      else if (ch.status === CharacterStatus.INCORRECT) incorrect++;
      else if (ch.status === CharacterStatus.PENDING && word.isCompleted) {
        missed++;
      }
    }
    extra += word.extraCharacters.length;
  }

  return { correct, incorrect, extra, missed };
}

